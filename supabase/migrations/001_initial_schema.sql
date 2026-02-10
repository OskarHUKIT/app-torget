-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create apps table
CREATE TABLE apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  upload_type TEXT NOT NULL CHECK (upload_type IN ('vercel_url', 'file_upload', 'github')),
  external_url TEXT,
  storage_path TEXT,
  github_url TEXT,
  icon_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  manifest_url TEXT NOT NULL,
  install_url TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  install_count INTEGER DEFAULT 0,
  rating FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create user_favorites table
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_apps_status ON apps(status);
CREATE INDEX idx_apps_author ON apps(author_id);
CREATE INDEX idx_apps_category ON apps(category);
CREATE INDEX idx_apps_created_at ON apps(created_at DESC);
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_app ON user_favorites(app_id);

-- Enable Row Level Security
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for apps table
-- Anyone can read approved apps
CREATE POLICY "Anyone can view approved apps"
  ON apps FOR SELECT
  USING (status = 'approved');

-- Users can view their own apps regardless of status
CREATE POLICY "Users can view their own apps"
  ON apps FOR SELECT
  USING (auth.uid() = author_id);

-- Authenticated users can create apps
CREATE POLICY "Authenticated users can create apps"
  ON apps FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own apps
CREATE POLICY "Users can update their own apps"
  ON apps FOR UPDATE
  USING (auth.uid() = author_id);

-- Users can delete their own apps
CREATE POLICY "Users can delete their own apps"
  ON apps FOR DELETE
  USING (auth.uid() = author_id);

-- RLS Policies for user_favorites table
-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own favorites
CREATE POLICY "Users can create their own favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_apps_updated_at
  BEFORE UPDATE ON apps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
