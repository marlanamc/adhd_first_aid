-- Import all tasks content to tasks_content table
-- This script should be run after running the TypeScript import script
-- or can be used to verify the import worked correctly

-- First, ensure the table exists
\i scripts/database/content-schemas/tasks_content_schema.sql

-- Note: The actual data import is handled by the TypeScript script
-- scripts/import-tasks-and-loops.ts which parses the markdown files
-- and inserts them with proper JSON structure

-- To run the import script:
-- tsx scripts/import-tasks-and-loops.ts

-- You can verify the import worked by running:
SELECT 
    task_name,
    subtitle,
    LENGTH(intro_paragraph) as intro_length,
    LENGTH(gentle_advice) as gentle_length,
    LENGTH(stern_advice) as stern_length,
    ARRAY_LENGTH(adhd_reasons, 1) as reason_count,
    JSONB_ARRAY_LENGTH(content_sections) as section_count,
    created_at
FROM tasks_content 
ORDER BY task_name;

-- Check specific task content structure:
-- SELECT task_name, content_sections FROM tasks_content WHERE task_name = 'Cleaning';