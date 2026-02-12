import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxcomvnatcsyqxwnvyqf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y29tdm5hdGNzeXF4d252eXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDAxNzcsImV4cCI6MjA4MzI3NjE3N30.ve3CnQ4QcVn0Lqhh_w5XvgOOKoGxKGFb0TB6-piSW2Y';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
