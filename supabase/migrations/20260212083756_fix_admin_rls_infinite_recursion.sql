/*
  # Fix infinite recursion in admin RLS policies

  1. New Functions
    - `is_admin()` - Security definer function that checks if the current user
      is an admin by querying `profiles` directly, bypassing RLS to prevent
      infinite recursion

  2. Security Changes
    - Drops and recreates all 16 admin policies across 8 tables to use `is_admin()`
      instead of a subquery on `profiles`
    - Affected tables: profiles, transactions, kyc_verifications, referrals,
      assets, user_assets, trade_settings, deposits, withdrawals

  3. Important Notes
    - The root cause was admin policies on `profiles` querying `profiles` itself,
      which triggered the same RLS check recursively
    - The `is_admin()` function uses SECURITY DEFINER to bypass RLS when checking
      admin status, breaking the recursion cycle
*/

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (role = 'admin' OR is_admin = true)
  );
$$;

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- transactions
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (is_admin());

-- kyc_verifications
DROP POLICY IF EXISTS "Admins can view all KYC" ON kyc_verifications;
CREATE POLICY "Admins can view all KYC"
  ON kyc_verifications FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update all KYC" ON kyc_verifications;
CREATE POLICY "Admins can update all KYC"
  ON kyc_verifications FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- referrals
DROP POLICY IF EXISTS "Admins can view all referrals" ON referrals;
CREATE POLICY "Admins can view all referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (is_admin());

-- assets
DROP POLICY IF EXISTS "Admins can insert assets" ON assets;
CREATE POLICY "Admins can insert assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update assets" ON assets;
CREATE POLICY "Admins can update assets"
  ON assets FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete assets" ON assets;
CREATE POLICY "Admins can delete assets"
  ON assets FOR DELETE
  TO authenticated
  USING (is_admin());

-- user_assets
DROP POLICY IF EXISTS "Admins can view all user assets" ON user_assets;
CREATE POLICY "Admins can view all user assets"
  ON user_assets FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update all user assets" ON user_assets;
CREATE POLICY "Admins can update all user assets"
  ON user_assets FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- trade_settings
DROP POLICY IF EXISTS "Admins can manage trade settings" ON trade_settings;
CREATE POLICY "Admins can manage trade settings"
  ON trade_settings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- deposits
DROP POLICY IF EXISTS "Admins can view all deposits" ON deposits;
CREATE POLICY "Admins can view all deposits"
  ON deposits FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update all deposits" ON deposits;
CREATE POLICY "Admins can update all deposits"
  ON deposits FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- withdrawals
DROP POLICY IF EXISTS "Admins can view all withdrawals" ON withdrawals;
CREATE POLICY "Admins can view all withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update all withdrawals" ON withdrawals;
CREATE POLICY "Admins can update all withdrawals"
  ON withdrawals FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());