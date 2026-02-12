import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  console.log('Fixing RLS policies for assets table...');

  const queries = [
    'DROP POLICY IF EXISTS "Anyone can view assets" ON assets;',
    'DROP POLICY IF EXISTS "Anyone can view trade settings" ON trade_settings;',
    'CREATE POLICY "Public can view assets" ON assets FOR SELECT USING (true);',
    'CREATE POLICY "Public can view trade settings" ON trade_settings FOR SELECT USING (true);'
  ];

  for (const query of queries) {
    console.log(`Executing: ${query}`);
    const { data, error } = await supabase.rpc('exec_sql', { sql: query });

    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success!');
    }
  }
}

fixRLSPolicies().catch(console.error);
