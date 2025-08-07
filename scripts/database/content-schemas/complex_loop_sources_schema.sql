-- Create table for complex loop sources
CREATE TABLE IF NOT EXISTS complex_loop_sources (
    id SERIAL PRIMARY KEY,
    loop_slug TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_complex_loop_sources_slug ON complex_loop_sources(loop_slug);
CREATE INDEX IF NOT EXISTS idx_complex_loop_sources_category ON complex_loop_sources(category);
CREATE INDEX IF NOT EXISTS idx_complex_loop_sources_title ON complex_loop_sources(title);

-- Row Level Security
ALTER TABLE complex_loop_sources ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (public site reads)
DROP POLICY IF EXISTS "Allow read access to complex_loop_sources" ON complex_loop_sources;
CREATE POLICY "Allow read access to complex_loop_sources"
  ON complex_loop_sources
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Restrict writes to service role by default (no public writes from client)
DROP POLICY IF EXISTS "Allow writes to complex_loop_sources for service role" ON complex_loop_sources;
CREATE POLICY "Allow writes to complex_loop_sources for service role"
  ON complex_loop_sources
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_complex_loop_sources_updated_at ON complex_loop_sources;
CREATE TRIGGER trg_complex_loop_sources_updated_at
  BEFORE UPDATE ON complex_loop_sources
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();