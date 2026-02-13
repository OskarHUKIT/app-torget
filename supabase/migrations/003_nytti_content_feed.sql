-- Nytti: Unified content table for feed (poems, artwork, apps, games, ideas)
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('app', 'game', 'poem', 'artwork', 'idea')),
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
  url TEXT,
  image_url TEXT,
  body_text TEXT,
  metadata JSONB DEFAULT '{}',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  curator_notes TEXT,
  is_curator_pick BOOLEAN DEFAULT false
);

-- User engagement for personalization (likes, saves)
CREATE TABLE user_engagement (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  engagement_type TEXT NOT NULL CHECK (engagement_type IN ('like', 'save', 'open')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id, engagement_type)
);

-- Profiles for region and preferences
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  region TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_created_at ON content(created_at DESC);
CREATE INDEX idx_content_curator_pick ON content(is_curator_pick) WHERE is_curator_pick = true;
CREATE INDEX idx_user_engagement_user ON user_engagement(user_id);
CREATE INDEX idx_user_engagement_content ON user_engagement(content_id);

-- RLS
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Content: anyone can read approved, authors see own
CREATE POLICY "Anyone can view approved content"
  ON content FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can view own content"
  ON content FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Authenticated can create content"
  ON content FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update own content"
  ON content FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own content"
  ON content FOR DELETE
  USING (auth.uid() = author_id);

-- Engagement: users manage own
CREATE POLICY "Users can view own engagement"
  ON user_engagement FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own engagement"
  ON user_engagement FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own engagement"
  ON user_engagement FOR DELETE
  USING (auth.uid() = user_id);

-- Profiles: users manage own
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger for updated_at on content
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sync approved apps to content feed
CREATE OR REPLACE FUNCTION sync_app_to_content()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' THEN
    INSERT INTO content (type, title, description, author_id, app_id, url, image_url, category, tags, status, created_at, updated_at)
    VALUES (
      'app',
      COALESCE(NEW.name, 'App'),
      NEW.description,
      NEW.author_id,
      NEW.id,
      NEW.install_url,
      NEW.icon_url,
      NEW.category,
      COALESCE(NEW.tags, '{}'),
      'approved',
      NEW.created_at,
      NEW.updated_at
    )
    ON CONFLICT (app_id) WHERE app_id IS NOT NULL
    DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, url = EXCLUDED.url, image_url = EXCLUDED.image_url, category = EXCLUDED.category, tags = EXCLUDED.tags, updated_at = EXCLUDED.updated_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Partial unique: one content row per app (app_id can be null for poems, etc.)
CREATE UNIQUE INDEX content_app_id_unique ON content (app_id) WHERE app_id IS NOT NULL;

CREATE TRIGGER sync_app_to_content_trigger
  AFTER INSERT OR UPDATE OF status ON apps
  FOR EACH ROW
  WHEN (NEW.status = 'approved')
  EXECUTE FUNCTION sync_app_to_content();

-- Backfill existing approved apps into content
INSERT INTO content (type, title, description, author_id, app_id, url, image_url, category, tags, status, created_at, updated_at)
SELECT 'app', a.name, a.description, a.author_id, a.id, a.install_url, a.icon_url, a.category, COALESCE(a.tags, '{}'), 'approved', a.created_at, a.updated_at
FROM apps a
WHERE a.status = 'approved'
  AND NOT EXISTS (SELECT 1 FROM content c WHERE c.app_id = a.id);
