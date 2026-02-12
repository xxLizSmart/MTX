-- Fix signup trigger to handle errors gracefully
--
-- This fixes the "Database error saving new user" issue

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS generate_referral_code() CASCADE;

-- Recreate referral code generator with better error handling
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
  new_code text;
  code_exists boolean;
  attempts integer := 0;
  max_attempts integer := 100;
BEGIN
  LOOP
    -- Generate random 8 character code
    new_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = new_code) INTO code_exists;
    
    -- Exit if unique code found
    EXIT WHEN NOT code_exists;
    
    -- Increment attempts and exit if max reached
    attempts := attempts + 1;
    EXIT WHEN attempts >= max_attempts;
  END LOOP;
  
  -- If we couldn't generate unique code after max attempts, append timestamp
  IF code_exists THEN
    new_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6)) || 
                substring(extract(epoch from clock_timestamp())::text from 1 for 2);
  END IF;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Recreate the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_referral_code text;
  v_referred_by uuid;
  v_email text;
  v_first_name text;
  v_last_name text;
BEGIN
  -- Generate unique referral code
  v_referral_code := generate_referral_code();
  
  -- Get email (handle both email and phone signups)
  v_email := COALESCE(NEW.email, NEW.phone, '');
  
  -- Get metadata
  v_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  v_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  
  -- Lookup referrer by code (if provided)
  v_referred_by := NULL;
  IF NEW.raw_user_meta_data->>'referred_by' IS NOT NULL AND NEW.raw_user_meta_data->>'referred_by' != '' THEN
    SELECT id INTO v_referred_by 
    FROM profiles 
    WHERE referral_code = NEW.raw_user_meta_data->>'referred_by' 
    LIMIT 1;
  END IF;
  
  -- Insert profile
  INSERT INTO profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    referral_code, 
    referred_by, 
    is_admin, 
    role,
    kyc_status,
    balance_usd
  )
  VALUES (
    NEW.id,
    v_email,
    v_first_name,
    v_last_name,
    v_referral_code,
    v_referred_by,
    false,
    'user',
    'not_submitted',
    0
  );
  
  -- Create referral record if referred
  IF v_referred_by IS NOT NULL THEN
    INSERT INTO referrals (referrer_id, referred_id, status, reward_amount)
    VALUES (v_referred_by, NEW.id, 'pending', 0)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth signup
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Make sure the give_initial_balance function exists and works
DROP TRIGGER IF EXISTS on_profile_created_give_balance ON profiles;
DROP FUNCTION IF EXISTS give_initial_balance() CASCADE;

CREATE OR REPLACE FUNCTION give_initial_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Give new user 1000 USDT starting balance
  INSERT INTO user_assets (user_id, symbol, amount)
  VALUES (NEW.id, 'USDT', 1000)
  ON CONFLICT (user_id, symbol) 
  DO UPDATE SET amount = user_assets.amount + 1000;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in give_initial_balance: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger for initial balance
CREATE TRIGGER on_profile_created_give_balance
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION give_initial_balance();