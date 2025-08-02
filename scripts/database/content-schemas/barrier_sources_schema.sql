-- =================================================================
-- Barrier Sources Content Schema
-- =================================================================
-- Create table for storing source references for barriers
-- =================================================================

-- Create barrier_sources table
CREATE TABLE IF NOT EXISTS barrier_sources (
    id SERIAL PRIMARY KEY,
    barrier_slug TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups by barrier
CREATE INDEX IF NOT EXISTS idx_barrier_sources_barrier_slug ON barrier_sources(barrier_slug);

-- Enable Row Level Security
ALTER TABLE barrier_sources ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
DROP POLICY IF EXISTS "Allow public read access to barrier_sources" ON barrier_sources;
CREATE POLICY "Allow public read access to barrier_sources" ON barrier_sources
    FOR SELECT TO PUBLIC
    USING (true);

-- Create policy to allow public insert/update (for imports)
DROP POLICY IF EXISTS "Allow public write access to barrier_sources" ON barrier_sources;
CREATE POLICY "Allow public write access to barrier_sources" ON barrier_sources
    FOR ALL TO PUBLIC
    USING (true);

-- Add updated_at trigger
DROP FUNCTION IF EXISTS update_barrier_sources_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_barrier_sources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_barrier_sources_updated_at ON barrier_sources;
CREATE TRIGGER update_barrier_sources_updated_at BEFORE UPDATE
    ON barrier_sources FOR EACH ROW EXECUTE FUNCTION update_barrier_sources_updated_at();

-- Display confirmation
SELECT 'Barrier sources schema created successfully! ✅' as status;