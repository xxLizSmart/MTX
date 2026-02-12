-- Additional Trading Platform Tables
--
-- 1. New Tables
--    - assets: Master list of tradeable assets with pricing
--    - user_assets: User balances for each asset
--    - trade_settings: Trading duration settings and rates
--    - deposits: Deposit requests and tracking
--    - withdrawals: Withdrawal requests and tracking
--
-- 2. Security
--    - RLS enabled on all tables
--    - Users can access only their own data

-- Create assets table (master list of available cryptocurrencies)
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  symbol text UNIQUE NOT NULL,
  price numeric DEFAULT 0,
  price_change_percentage_24h numeric DEFAULT 0,
  icon_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_assets table (user balances)
CREATE TABLE IF NOT EXISTS user_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, symbol)
);

-- Create trade_settings table (trading configuration)
CREATE TABLE IF NOT EXISTS trade_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  duration integer UNIQUE NOT NULL,
  min_capital numeric DEFAULT 0,
  win_rate numeric DEFAULT 0.8,
  loss_rate numeric DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric DEFAULT 0,
  currency text NOT NULL,
  proof_url text,
  status text DEFAULT 'pending',
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric DEFAULT 0,
  currency text NOT NULL,
  wallet_address text NOT NULL,
  status text DEFAULT 'pending',
  transaction_hash text,
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add trade_override_status to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'trade_override_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN trade_override_status text;
  END IF;
END $$;

-- Add is_admin to profiles (for backward compatibility)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assets_symbol ON assets(symbol);
CREATE INDEX IF NOT EXISTS idx_user_assets_user_id ON user_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_assets_symbol ON user_assets(symbol);
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);

-- Insert default trade settings
INSERT INTO trade_settings (duration, min_capital, win_rate, loss_rate) VALUES
  (30, 10, 0.8, 1),
  (60, 20, 0.85, 1),
  (90, 50, 0.9, 1),
  (120, 100, 0.95, 1)
ON CONFLICT (duration) DO NOTHING;

-- Insert default assets
INSERT INTO assets (name, symbol, price, price_change_percentage_24h, icon_url) VALUES
  ('Bitcoin', 'BTC', 45000, 2.5, 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'),
  ('Ethereum', 'ETH', 3000, 1.8, 'https://cryptologos.cc/logos/ethereum-eth-logo.png'),
  ('Tether', 'USDT', 1, 0.01, 'https://cryptologos.cc/logos/tether-usdt-logo.png'),
  ('BNB', 'BNB', 400, 3.2, 'https://cryptologos.cc/logos/bnb-bnb-logo.png'),
  ('Solana', 'SOL', 100, 5.5, 'https://cryptologos.cc/logos/solana-sol-logo.png'),
  ('Ripple', 'XRP', 0.6, -1.2, 'https://cryptologos.cc/logos/xrp-xrp-logo.png'),
  ('Cardano', 'ADA', 0.5, 2.1, 'https://cryptologos.cc/logos/cardano-ada-logo.png'),
  ('Dogecoin', 'DOGE', 0.08, 4.3, 'https://cryptologos.cc/logos/dogecoin-doge-logo.png'),
  ('Polkadot', 'DOT', 7, 1.5, 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png'),
  ('Litecoin', 'LTC', 90, 0.8, 'https://cryptologos.cc/logos/litecoin-ltc-logo.png')
ON CONFLICT (symbol) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Assets policies (public read, admin write)
CREATE POLICY "Anyone can view assets"
  ON assets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can update assets"
  ON assets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can delete assets"
  ON assets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- User assets policies
CREATE POLICY "Users can view own assets"
  ON user_assets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets"
  ON user_assets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assets"
  ON user_assets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all user assets"
  ON user_assets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can update all user assets"
  ON user_assets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- Trade settings policies (read for all, write for admin)
CREATE POLICY "Anyone can view trade settings"
  ON trade_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage trade settings"
  ON trade_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- Deposits policies
CREATE POLICY "Users can view own deposits"
  ON deposits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deposits"
  ON deposits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all deposits"
  ON deposits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can update all deposits"
  ON deposits FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- Withdrawals policies
CREATE POLICY "Users can view own withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own withdrawals"
  ON withdrawals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can update all withdrawals"
  ON withdrawals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- Create function to automatically give new users initial balance
CREATE OR REPLACE FUNCTION give_initial_balance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_assets (user_id, symbol, amount)
  VALUES (NEW.id, 'USDT', 1000)
  ON CONFLICT (user_id, symbol) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for initial balance
DROP TRIGGER IF EXISTS on_profile_created_give_balance ON profiles;
CREATE TRIGGER on_profile_created_give_balance
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION give_initial_balance();