-- Fix RLS policies to allow public access to assets
-- Execute this in your Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view assets" ON assets;
DROP POLICY IF EXISTS "Anyone can view trade settings" ON trade_settings;

-- Create new policies that allow public access
CREATE POLICY "Public can view assets"
  ON assets FOR SELECT
  USING (true);

CREATE POLICY "Public can view trade settings"
  ON trade_settings FOR SELECT
  USING (true);
