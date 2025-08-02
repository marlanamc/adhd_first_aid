-- Tasks Content Schema for ADHD First Aid Kit
-- This creates the tasks_content table with comprehensive fields for task pages

CREATE TABLE IF NOT EXISTS tasks_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_name TEXT NOT NULL UNIQUE,
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
ALTER TABLE tasks_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (matching other content tables)
CREATE POLICY "Enable read access for all users" ON tasks_content
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON tasks_content
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON tasks_content
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON tasks_content
    FOR DELETE USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_content_task_name ON tasks_content(task_name);
CREATE INDEX IF NOT EXISTS idx_tasks_content_created_at ON tasks_content(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_content_updated_at BEFORE UPDATE
    ON tasks_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE tasks_content IS 'Content for task pages with ADHD-specific guidance and strategies';
COMMENT ON COLUMN tasks_content.task_name IS 'Name of the task (matches help_tasks.name)';
COMMENT ON COLUMN tasks_content.subtitle IS 'Optional subtitle for the task';
COMMENT ON COLUMN tasks_content.intro_paragraph IS 'Main introductory paragraph explaining the task challenges';
COMMENT ON COLUMN tasks_content.gentle_advice IS 'Gentle, supportive advice section';
COMMENT ON COLUMN tasks_content.stern_advice IS 'Firm but compassionate advice section';
COMMENT ON COLUMN tasks_content.adhd_reasons IS 'Array of reasons why this task is hard with ADHD';
COMMENT ON COLUMN tasks_content.content_sections IS 'JSONB array of content sections with titles, emojis, content arrays, and optional subsections';