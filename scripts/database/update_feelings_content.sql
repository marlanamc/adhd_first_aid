-- Update feelings content with new step intros and Lucide icons
-- This script combines both the intro text updates and icon replacements

-- First, run the step intro updates
\i update_step_intros.sql

-- Then, run the icon updates
\i update_step_icons.sql

-- Finally, verify the changes
SELECT feeling_name, 
       jsonb_array_elements(step_sections)->>'emoji' as icon,
       jsonb_array_elements(step_sections)->>'intro' as intro
FROM feelings_content
ORDER BY feeling_name, (jsonb_array_elements(step_sections)->>'number')::int; 