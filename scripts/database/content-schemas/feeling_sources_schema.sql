-- =================================================================
-- Feeling Sources Content Schema
-- =================================================================
-- Create table for storing source references for feelings
-- =================================================================

-- Create feeling_sources table
CREATE TABLE IF NOT EXISTS feeling_sources (
    id SERIAL PRIMARY KEY,
    feeling_slug TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups by feeling
CREATE INDEX IF NOT EXISTS idx_feeling_sources_feeling_slug ON feeling_sources(feeling_slug);

-- Enable Row Level Security
ALTER TABLE feeling_sources ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
DROP POLICY IF EXISTS "Allow public read access to feeling_sources" ON feeling_sources;
CREATE POLICY "Allow public read access to feeling_sources" ON feeling_sources
    FOR SELECT TO PUBLIC
    USING (true);

-- Create policy to allow public insert/update (for imports)
DROP POLICY IF EXISTS "Allow public write access to feeling_sources" ON feeling_sources;
CREATE POLICY "Allow public write access to feeling_sources" ON feeling_sources
    FOR ALL TO PUBLIC
    USING (true);

-- Add updated_at trigger
DROP FUNCTION IF EXISTS update_feeling_sources_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_feeling_sources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_feeling_sources_updated_at ON feeling_sources;
CREATE TRIGGER update_feeling_sources_updated_at BEFORE UPDATE
    ON feeling_sources FOR EACH ROW EXECUTE FUNCTION update_feeling_sources_updated_at();

-- Display confirmation
SELECT 'Feeling sources schema created successfully! ✅' as status;