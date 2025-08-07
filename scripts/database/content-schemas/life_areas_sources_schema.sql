-- =================================================================
-- Life Areas Sources Content Schema
-- =================================================================
-- Create table for storing source references for life areas
-- =================================================================

-- Create life_areas_sources table
CREATE TABLE IF NOT EXISTS life_areas_sources (
    id SERIAL PRIMARY KEY,
    life_area_slug TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups by life area
CREATE INDEX IF NOT EXISTS idx_life_areas_sources_life_area_slug ON life_areas_sources(life_area_slug);

-- Enable Row Level Security
ALTER TABLE life_areas_sources ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
DROP POLICY IF EXISTS "Allow public read access to life_areas_sources" ON life_areas_sources;
CREATE POLICY "Allow public read access to life_areas_sources" ON life_areas_sources
    FOR SELECT TO PUBLIC
    USING (true);

-- Create policy to allow public insert/update (for imports)
DROP POLICY IF EXISTS "Allow public write access to life_areas_sources" ON life_areas_sources;
CREATE POLICY "Allow public write access to life_areas_sources" ON life_areas_sources
    FOR ALL TO PUBLIC
    USING (true);

-- Add updated_at trigger
DROP FUNCTION IF EXISTS update_life_areas_sources_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_life_areas_sources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_life_areas_sources_updated_at ON life_areas_sources;
CREATE TRIGGER update_life_areas_sources_updated_at BEFORE UPDATE
    ON life_areas_sources FOR EACH ROW EXECUTE FUNCTION update_life_areas_sources_updated_at();

-- Display confirmation
SELECT 'Life areas sources schema created successfully! ✅' as status; 