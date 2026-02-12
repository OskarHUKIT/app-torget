-- Add external_link to upload_type
ALTER TABLE apps DROP CONSTRAINT IF EXISTS apps_upload_type_check;
ALTER TABLE apps ADD CONSTRAINT apps_upload_type_check 
  CHECK (upload_type IN ('vercel_url', 'file_upload', 'github', 'external_link'));

-- Make manifest_url nullable for external_link apps
ALTER TABLE apps ALTER COLUMN manifest_url DROP NOT NULL;
