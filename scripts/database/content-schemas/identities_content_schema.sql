-- =============================================
-- IDENTITY PAGES CONTENT SCHEMA
-- =============================================
-- This table stores the structured content for identity pages
-- Based on template: feelings_content_schema.sql

-- Drop existing table if it exists
DROP TABLE IF EXISTS identities_content CASCADE;

-- Create identities_content table
CREATE TABLE identities_content (
    id SERIAL PRIMARY KEY,
    
    -- Basic identity information
    identity_name VARCHAR(100) NOT NULL UNIQUE,
    subtitle TEXT,
    emoji VARCHAR(10),
    
    -- Main content sections (similar to feelings/barriers)
    intro_paragraph TEXT NOT NULL,
    gentle_advice TEXT NOT NULL,
    stern_advice TEXT NOT NULL,
    
    -- Identity-specific content sections
    -- This will store an array of section objects with nested content
    content_sections JSONB NOT NULL DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_identities_content_identity_name ON identities_content(identity_name);
CREATE INDEX idx_identities_content_created_at ON identities_content(created_at);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_identities_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_identities_content_updated_at
    BEFORE UPDATE ON identities_content
    FOR EACH ROW
    EXECUTE FUNCTION update_identities_content_updated_at();

-- Enable Row Level Security
ALTER TABLE identities_content ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to identities_content" ON identities_content
    FOR SELECT USING (true);

-- Create policy for public write access (for imports/updates)
CREATE POLICY "Allow public write access to identities_content" ON identities_content
    FOR ALL USING (true);

-- Add comments for documentation
COMMENT ON TABLE identities_content IS 'Stores structured content for ADHD identity pages';
COMMENT ON COLUMN identities_content.identity_name IS 'The name of the identity (e.g., "The Newly Diagnosed", "The Parent")';
COMMENT ON COLUMN identities_content.subtitle IS 'Subtitle or description for the identity';
COMMENT ON COLUMN identities_content.emoji IS 'Emoji representing the identity';
COMMENT ON COLUMN identities_content.intro_paragraph IS 'Main introduction paragraph with markdown formatting';
COMMENT ON COLUMN identities_content.gentle_advice IS 'Gentle advice section content';
COMMENT ON COLUMN identities_content.stern_advice IS 'Stern advice section content';
COMMENT ON COLUMN identities_content.content_sections IS 'JSONB array of content sections with titles, content, and nested subsections';

/*
Example content_sections structure:
[
  {
    "title": "What It Feels Like",
    "emoji": "🌊",
    "content": "Array of bullet points or paragraphs",
    "subsections": [
      {
        "title": "Subsection Title",
        "emoji": "🧠",
        "content": "Subsection content"
      }
    ]
  }
]
*/