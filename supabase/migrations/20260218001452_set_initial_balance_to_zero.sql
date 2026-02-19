/*
  # Set initial balance to zero for new signups and fix admin approval

  1. Changes
    - Update give_initial_balance trigger to give 0 balance for USDT, BTC, ETH
    - Users must deposit and have it approved to get a balance
    - Add admin INSERT policy on user_assets for deposit approval
    - Add approve_deposit, reject_deposit, approve_withdrawal, reject_withdrawal
      RPC functions using SECURITY DEFINER for reliable admin operations

  2. Security
    - Admin INSERT policy on user_assets restricted to is_admin()
    - RPC functions verify admin status before executing
    - All balance updates are atomic

  3. Notes
    - Existing users keep their current balances unchanged
*/

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
  VALUES
    (NEW.id, 'USDT', 0),
    (NEW.id, 'BTC', 0),
    (NEW.id, 'ETH', 0)
  ON CONFLICT (user_id, symbol)
  DO NOTHING;

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_assets'
      AND policyname = 'Admins can insert user assets'
  ) THEN
    CREATE POLICY "Admins can insert user assets"
      ON user_assets FOR INSERT
      TO authenticated
      WITH CHECK (is_admin());
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.approve_deposit(p_deposit_id uuid, p_admin_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deposit RECORD;
BEGIN
  IF NOT is_admin() THEN
    RETURN json_build_object('success', false, 'error', 'Not authorized');
  END IF;

  SELECT * INTO v_deposit FROM deposits WHERE id = p_deposit_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Deposit not found');
  END IF;
  IF v_deposit.status != 'pending' THEN
    RETURN json_build_object('success', false, 'error', 'Deposit is not pending');
  END IF;

  UPDATE deposits
  SET status = 'approved', reviewed_by = p_admin_id, reviewed_at = now()
  WHERE id = p_deposit_id;

  INSERT INTO user_assets (user_id, symbol, amount)
  VALUES (v_deposit.user_id, v_deposit.currency, v_deposit.amount)
  ON CONFLICT (user_id, symbol)
  DO UPDATE SET amount = user_assets.amount + EXCLUDED.amount;

  RETURN json_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_deposit(p_deposit_id uuid, p_admin_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deposit RECORD;
BEGIN
  IF NOT is_admin() THEN
    RETURN json_build_object('success', false, 'error', 'Not authorized');
  END IF;

  SELECT * INTO v_deposit FROM deposits WHERE id = p_deposit_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Deposit not found');
  END IF;
  IF v_deposit.status != 'pending' THEN
    RETURN json_build_object('success', false, 'error', 'Deposit is not pending');
  END IF;

  UPDATE deposits
  SET status = 'rejected', reviewed_by = p_admin_id, reviewed_at = now()
  WHERE id = p_deposit_id;

  RETURN json_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_withdrawal(p_withdrawal_id uuid, p_admin_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_withdrawal RECORD;
BEGIN
  IF NOT is_admin() THEN
    RETURN json_build_object('success', false, 'error', 'Not authorized');
  END IF;

  SELECT * INTO v_withdrawal FROM withdrawals WHERE id = p_withdrawal_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Withdrawal not found');
  END IF;
  IF v_withdrawal.status != 'pending' THEN
    RETURN json_build_object('success', false, 'error', 'Withdrawal is not pending');
  END IF;

  UPDATE withdrawals
  SET status = 'approved', reviewed_by = p_admin_id, reviewed_at = now()
  WHERE id = p_withdrawal_id;

  RETURN json_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_withdrawal(p_withdrawal_id uuid, p_admin_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_withdrawal RECORD;
BEGIN
  IF NOT is_admin() THEN
    RETURN json_build_object('success', false, 'error', 'Not authorized');
  END IF;

  SELECT * INTO v_withdrawal FROM withdrawals WHERE id = p_withdrawal_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Withdrawal not found');
  END IF;
  IF v_withdrawal.status != 'pending' THEN
    RETURN json_build_object('success', false, 'error', 'Withdrawal is not pending');
  END IF;

  UPDATE withdrawals
  SET status = 'rejected', reviewed_by = p_admin_id, reviewed_at = now()
  WHERE id = p_withdrawal_id;

  INSERT INTO user_assets (user_id, symbol, amount)
  VALUES (v_withdrawal.user_id, v_withdrawal.currency, v_withdrawal.amount)
  ON CONFLICT (user_id, symbol)
  DO UPDATE SET amount = user_assets.amount + EXCLUDED.amount;

  RETURN json_build_object('success', true);
END;
$$;
