-- RPC for distance-based lookup of dugnader/events.
-- Uses latitude/longitude columns added in 004_media_geo_support.sql

CREATE OR REPLACE FUNCTION public.get_nearby_dugnader(
  input_lat DOUBLE PRECISION,
  input_lng DOUBLE PRECISION,
  input_radius_km DOUBLE PRECISION DEFAULT 30,
  input_query TEXT DEFAULT NULL,
  input_limit INTEGER DEFAULT 60
)
RETURNS TABLE(content_id UUID, distance_km DOUBLE PRECISION)
LANGUAGE sql
STABLE
AS $$
  WITH scoped AS (
    SELECT
      c.id,
      c.title,
      c.description,
      c.location_name,
      c.address,
      c.tags,
      6371 * acos(
        LEAST(
          1,
          GREATEST(
            -1,
            cos(radians(input_lat)) * cos(radians(c.latitude)) * cos(radians(c.longitude) - radians(input_lng))
            + sin(radians(input_lat)) * sin(radians(c.latitude))
          )
        )
      ) AS distance_km
    FROM content c
    WHERE c.status = 'approved'
      AND c.type IN ('dugnad', 'event')
      AND c.latitude IS NOT NULL
      AND c.longitude IS NOT NULL
  ),
  filtered AS (
    SELECT *
    FROM scoped s
    WHERE s.distance_km <= GREATEST(input_radius_km, 1)
      AND (
        input_query IS NULL
        OR trim(input_query) = ''
        OR (
          lower(coalesce(s.title, '') || ' ' || coalesce(s.description, '') || ' ' || coalesce(s.location_name, '') || ' ' || coalesce(s.address, '') || ' ' || array_to_string(coalesce(s.tags, '{}'), ' '))
          LIKE '%' || lower(trim(input_query)) || '%'
        )
      )
  )
  SELECT f.id AS content_id, f.distance_km
  FROM filtered f
  ORDER BY f.distance_km ASC
  LIMIT GREATEST(input_limit, 1);
$$;

