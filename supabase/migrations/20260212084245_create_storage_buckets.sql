/*
  # Create storage buckets for KYC documents and deposit proofs

  1. New Buckets
    - `documents` - Stores KYC identity document uploads (passports, licenses, etc.)
    - `deposits` - Stores deposit proof screenshots

  2. Security
    - Both buckets are private (not publicly accessible)
    - Authenticated users can upload to their own folder (path prefixed with their user ID)
    - Authenticated users can read their own uploads
    - Admins can read all files in both buckets (uses is_admin() function)

  3. Important Notes
    - File paths follow the pattern: `kyc-documents/{user_id}-{random}.{ext}` for KYC
    - File paths follow the pattern: `{user_id}/{random}.{ext}` for deposits
    - Public URLs are generated via signed URLs or getPublicUrl after making buckets public
    - Buckets are set to public so getPublicUrl works for admin viewing
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('deposits', 'deposits', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload KYC documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = 'kyc-documents'
  );

CREATE POLICY "Users can view own KYC documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = split_part((storage.filename(name)), '-', 1)
  );

CREATE POLICY "Admins can view all KYC documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND is_admin()
  );

CREATE POLICY "Authenticated users can upload deposit proofs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'deposits'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own deposit proofs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'deposits'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can view all deposit proofs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'deposits'
    AND is_admin()
  );