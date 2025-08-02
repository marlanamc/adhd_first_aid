-- Complex Loops Content Schema for ADHD First Aid Kit
-- This creates the complex_loops_content table with comprehensive fields for complex loop pages

CREATE TABLE IF NOT EXISTS complex_loops_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loop_name TEXT NOT NULL UNIQUE,
    subtitle TEXT,
    intro_paragraph TEXT NOT NULL,
    gentle_advice TEXT NOT NULL,
    stern_advice TEXT NOT NULL,
    adhd_reasons TEXT[] NOT NULL DEFAULT '{}',
    content_sections JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE complex_loops_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (matching other content tables)
CREATE POLICY "Enable read access for all users" ON complex_loops_content
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON complex_loops_content
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON complex_loops_content
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON complex_loops_content
    FOR DELETE USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_complex_loops_content_loop_name ON complex_loops_content(loop_name);
CREATE INDEX IF NOT EXISTS idx_complex_loops_content_created_at ON complex_loops_content(created_at);

-- Create trigger for updated_at (reuse existing function)
CREATE TRIGGER update_complex_loops_content_updated_at BEFORE UPDATE
    ON complex_loops_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE complex_loops_content IS 'Content for complex loop pages with ADHD-specific guidance and strategies';
COMMENT ON COLUMN complex_loops_content.loop_name IS 'Name of the complex loop (e.g., "Analysis Paralysis", "Bedtime Procrastination")';
COMMENT ON COLUMN complex_loops_content.subtitle IS 'Optional subtitle for the loop';
COMMENT ON COLUMN complex_loops_content.intro_paragraph IS 'Main introductory paragraph explaining the loop challenges';
COMMENT ON COLUMN complex_loops_content.gentle_advice IS 'Gentle, supportive advice section';
COMMENT ON COLUMN complex_loops_content.stern_advice IS 'Firm but compassionate advice section';  
COMMENT ON COLUMN complex_loops_content.adhd_reasons IS 'Array of reasons why this loop happens with ADHD';
COMMENT ON COLUMN complex_loops_content.content_sections IS 'JSONB array of content sections with titles, emojis, content arrays, and optional subsections';