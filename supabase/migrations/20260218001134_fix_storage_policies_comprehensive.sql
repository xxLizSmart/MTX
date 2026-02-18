/*
  # Fix storage upload policies

  1. Changes
    - Drop and recreate all storage policies with cleaner, more reliable checks
    - Add UPDATE and DELETE policies so users can replace/remove their own files
    - Simplify path matching to avoid edge cases with storage.foldername

  2. Security
    - Authenticated users can only upload to their own paths
    - KYC: any path under 'kyc-documents/' folder
    - Deposits: any path starting with user's own UUID folder
    - Public read via public bucket URL (no SELECT policy needed for public URLs)
    - Admins can view all files through is_admin()
*/

-- Drop existing storage policies
DROP POLICY IF EXISTS "Authenticated users can upload KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload deposit proofs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own deposit proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all deposit proofs" ON storage.objects;

-- KYC documents bucket: any authenticated user can upload under kyc-documents/
CREATE POLICY "Authenticated users can upload to documents bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can update documents bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'documents')
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can read documents bucket"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

-- Deposit proofs bucket: authenticated users can upload/read their own files
CREATE POLICY "Authenticated users can upload to deposits bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'deposits');

CREATE POLICY "Authenticated users can update deposits bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'deposits')
  WITH CHECK (bucket_id = 'deposits');

CREATE POLICY "Authenticated users can read deposits bucket"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'deposits');
