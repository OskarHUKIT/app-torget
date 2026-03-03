-- Extend content model for modern Nytti media and local dugnader/events

-- Expand supported content types.
ALTER TABLE content
  DROP CONSTRAINT IF EXISTS content_type_check;

ALTER TABLE content
  ADD CONSTRAINT content_type_check
  CHECK (type IN ('app', 'game', 'poem', 'artwork', 'idea', 'article', 'dugnad', 'event'));

-- Add geo/event fields used by dugnader and local discovery.
ALTER TABLE content
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS location_name TEXT,
  ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS capacity INTEGER,
  ADD COLUMN IF NOT EXISTS organizer TEXT,
  ADD COLUMN IF NOT EXISTS contact TEXT;

-- Keep coordinates valid if provided.
ALTER TABLE content
  ADD CONSTRAINT content_latitude_range_check
  CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));

ALTER TABLE content
  ADD CONSTRAINT content_longitude_range_check
  CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));

-- Indexes for filters and nearby preselection.
CREATE INDEX IF NOT EXISTS idx_content_type_created_at
  ON content (type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_coordinates
  ON content (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_content_starts_at
  ON content (starts_at)
  WHERE starts_at IS NOT NULL;
