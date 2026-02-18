/*
  # Fix trigger search_path and create missing profiles

  1. Problem
    - handle_new_user and generate_referral_code functions lack SET search_path
    - When called by GoTrue (supabase_auth_admin), the search_path may be empty
    - Unqualified references like "FROM profiles" fail silently in the exception handler
    - Users get created in auth.users but NOT in profiles
    - Without profiles, FK constraints block deposits, trades, and KYC submissions

  2. Changes
    - Rebuild generate_referral_code with SET search_path = public and SECURITY DEFINER
    - Rebuild handle_new_user with SET search_path = public
    - Create missing profiles for any auth.users without a corresponding profile
    - Give initial USDT balance to users who have profiles but no assets

  3. Security
    - Both functions run as postgres (SECURITY DEFINER), bypassing RLS safely
    - Explicit search_path = public prevents injection via search_path manipulation
*/

-- Drop and recreate generate_referral_code with SECURITY DEFINER + explicit search_path
DROP FUNCTION IF EXISTS generate_referral_code() CASCADE;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code text;
  code_exists boolean;
  attempts integer := 0;
  max_attempts integer := 100;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
    attempts := attempts + 1;
    EXIT WHEN attempts >= max_attempts;
  END LOOP;

  IF code_exists THEN
    new_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6)) ||
                substring(extract(epoch from clock_timestamp())::text from 1 for 2);
  END IF;

  RETURN new_code;
END;
$$;

-- Drop and recreate handle_new_user with explicit search_path
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral_code text;
  v_referred_by uuid;
  v_email text;
  v_first_name text;
  v_last_name text;
BEGIN
  v_referral_code := public.generate_referral_code();
  v_email := COALESCE(NEW.email, NEW.phone, '');
  v_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  v_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');

  v_referred_by := NULL;
  IF (NEW.raw_user_meta_data->>'referred_by') IS NOT NULL
     AND (NEW.raw_user_meta_data->>'referred_by') != '' THEN
    SELECT id INTO v_referred_by
    FROM public.profiles
    WHERE referral_code = (NEW.raw_user_meta_data->>'referred_by')
    LIMIT 1;
  END IF;

  INSERT INTO public.profiles (
    id, email, first_name, last_name, referral_code,
    referred_by, is_admin, role, kyc_status, balance_usd
  )
  VALUES (
    NEW.id, v_email, v_first_name, v_last_name, v_referral_code,
    v_referred_by, false, 'user', 'not_submitted', 0
  )
  ON CONFLICT (id) DO NOTHING;

  IF v_referred_by IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, referred_id, status, reward_amount)
    VALUES (v_referred_by, NEW.id, 'pending', 0)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user for %: % - %', NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Also fix give_initial_balance with explicit search_path
DROP TRIGGER IF EXISTS on_profile_created_give_balance ON public.profiles;
DROP FUNCTION IF EXISTS give_initial_balance() CASCADE;

CREATE OR REPLACE FUNCTION public.give_initial_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_assets (user_id, symbol, amount)
  VALUES (NEW.id, 'USDT', 1000)
  ON CONFLICT (user_id, symbol)
  DO UPDATE SET amount = user_assets.amount + 1000;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in give_initial_balance for %: % - %', NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_give_balance
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.give_initial_balance();

-- Create missing profiles for auth.users that have no profile
DO $$
DECLARE
  auth_user RECORD;
  v_referral_code text;
BEGIN
  FOR auth_user IN
    SELECT u.id, u.email, u.phone, u.raw_user_meta_data
    FROM auth.users u
    WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
  LOOP
    v_referral_code := public.generate_referral_code();

    INSERT INTO public.profiles (
      id, email, first_name, last_name, referral_code,
      referred_by, is_admin, role, kyc_status, balance_usd
    )
    VALUES (
      auth_user.id,
      COALESCE(auth_user.email, auth_user.phone, ''),
      COALESCE(auth_user.raw_user_meta_data->>'first_name', ''),
      COALESCE(auth_user.raw_user_meta_data->>'last_name', ''),
      v_referral_code,
      NULL,
      false,
      'user',
      'not_submitted',
      0
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;

-- Give initial USDT balance to any user that has a profile but no user_assets at all
INSERT INTO public.user_assets (user_id, symbol, amount)
SELECT p.id, 'USDT', 1000
FROM public.profiles p
WHERE p.is_admin = false
  AND NOT EXISTS (
    SELECT 1 FROM public.user_assets ua WHERE ua.user_id = p.id
  )
ON CONFLICT (user_id, symbol) DO NOTHING;
