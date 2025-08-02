-- Create barriers_content table with structure similar to feelings_content
-- This table stores all the detailed content for individual barrier pages

CREATE TABLE IF NOT EXISTS barriers_content (
  id SERIAL PRIMARY KEY,
  barrier_name TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  intro_paragraph TEXT NOT NULL,
  gentle_advice TEXT NOT NULL,
  stern_advice TEXT NOT NULL,
  adhd_reasons TEXT[] NOT NULL DEFAULT '{}',
  step_sections JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_barriers_content_barrier_name ON barriers_content(barrier_name);

-- Enable Row Level Security
ALTER TABLE barriers_content ENABLE ROW LEVEL SECURITY;

-- Create public read policy for barriers_content
CREATE POLICY "Enable read access for all users" ON barriers_content
  FOR SELECT
  TO public
  USING (true);

-- Create public write policy for barriers_content (for imports)
CREATE POLICY "Enable write access for all users" ON barriers_content
  FOR ALL
  TO public
  USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_barriers_content_updated_at 
    BEFORE UPDATE ON barriers_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON barriers_content TO public;
GRANT ALL ON SEQUENCE barriers_content_id_seq TO public;