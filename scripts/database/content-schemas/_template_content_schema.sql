-- Template for [CONTENT_TYPE]_content table schema
-- Copy this file and replace [CONTENT_TYPE] with your content type (e.g., tasks, identities, etc.)
-- Follow the established pattern for consistency

CREATE TABLE IF NOT EXISTS [CONTENT_TYPE]_content (
  id SERIAL PRIMARY KEY,
  [CONTENT_TYPE]_name TEXT NOT NULL UNIQUE, -- Main identifier (e.g., task_name, identity_name)
  subtitle TEXT,                             -- Optional subtitle for the content
  intro_paragraph TEXT NOT NULL,             -- Main introduction with markdown bold support
  gentle_advice TEXT NOT NULL,               -- Compassionate, supportive guidance
  stern_advice TEXT NOT NULL,                -- Direct, action-oriented guidance
  adhd_reasons TEXT[] NOT NULL DEFAULT '{}', -- Array of ADHD-specific amplifying factors
  step_sections JSONB NOT NULL DEFAULT '[]', -- JSON array of step-by-step guidance
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_[CONTENT_TYPE]_content_name ON [CONTENT_TYPE]_content([CONTENT_TYPE]_name);

-- Enable Row Level Security
ALTER TABLE [CONTENT_TYPE]_content ENABLE ROW LEVEL SECURITY;

-- Create public read policy
CREATE POLICY "Enable read access for all users" ON [CONTENT_TYPE]_content
  FOR SELECT
  TO public
  USING (true);

-- Create public write policy (for imports)
CREATE POLICY "Enable write access for all users" ON [CONTENT_TYPE]_content
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

CREATE TRIGGER update_[CONTENT_TYPE]_content_updated_at 
    BEFORE UPDATE ON [CONTENT_TYPE]_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON [CONTENT_TYPE]_content TO public;
GRANT ALL ON SEQUENCE [CONTENT_TYPE]_content_id_seq TO public;