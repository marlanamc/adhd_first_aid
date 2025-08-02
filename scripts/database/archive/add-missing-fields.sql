-- Add missing fields to strategies table
-- Run this in your Supabase SQL editor

-- Add subtitle field (rename title to subtitle for consistency)
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS subtitle text;
UPDATE strategies SET subtitle = title WHERE subtitle IS NULL AND title IS NOT NULL;

-- Add use_case field
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS use_case text;

-- Add icon_file field (rename icon to icon_file for consistency)
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS icon_file text;
UPDATE strategies SET icon_file = icon WHERE icon_file IS NULL AND icon IS NOT NULL;

-- Add adhd_friendly_improvement field
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS adhd_friendly_improvement text;

-- Add why_does_this_work field
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS why_does_this_work text;

-- Add image_source field
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS image_source text;

-- Add further_reading_suggestions field
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS further_reading_suggestions text;

-- Add reviewed field
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS reviewed boolean DEFAULT false;

-- Add help_task_id field (without foreign key constraint initially)
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS help_task_id uuid;

-- Add barrier_id field (without foreign key constraint initially)
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS barrier_id uuid;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_strategies_subtitle ON strategies(subtitle);
CREATE INDEX IF NOT EXISTS idx_strategies_use_case ON strategies(use_case);
CREATE INDEX IF NOT EXISTS idx_strategies_icon_file ON strategies(icon_file);
CREATE INDEX IF NOT EXISTS idx_strategies_reviewed ON strategies(reviewed);

-- Update the updated_at trigger to include new fields
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS update_strategies_updated_at ON strategies;
CREATE TRIGGER update_strategies_updated_at 
    BEFORE UPDATE ON strategies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 