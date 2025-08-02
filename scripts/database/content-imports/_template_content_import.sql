-- Template for importing [CONTENT_TYPE] content
-- Copy this file and replace [CONTENT_TYPE] with your content type
-- Follow the established pattern for consistency

-- Import All [CONTENT_TYPE] Content for Supabase
-- This script processes all [CONTENT_TYPE] pages following the same format as feelings/barriers content
-- Run this after running the [CONTENT_TYPE]_content_schema.sql script

-- Clear existing data first (uncomment if needed)
-- DELETE FROM [CONTENT_TYPE]_content;

-- Insert all [CONTENT_TYPE] content
INSERT INTO [CONTENT_TYPE]_content (
  [CONTENT_TYPE]_name,
  subtitle,
  intro_paragraph,
  gentle_advice,
  stern_advice,
  adhd_reasons,
  step_sections
) VALUES 
(
  'Example [CONTENT_TYPE]',
  'Example subtitle with emoji and description',
  'Example intro paragraph with **bold text** support. This explains what this [CONTENT_TYPE] is about and how ADHD affects it.',
  'Gentle, compassionate advice for this [CONTENT_TYPE]. This should be supportive and understanding.',
  'Direct, action-oriented advice for this [CONTENT_TYPE]. This should be more firm but still helpful.',
  ARRAY[
    'ADHD factor 1: Description of how this affects the [CONTENT_TYPE]',
    'ADHD factor 2: Another way ADHD makes this [CONTENT_TYPE] more challenging',
    'ADHD factor 3: Third factor specific to ADHD brains',
    'ADHD factor 4: Fourth amplifying factor',
    'ADHD factor 5: Fifth factor showing ADHD impact'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧭",
      "title": "First Step Title",
      "intro": "Brief introduction to this step and why it matters.",
      "try_this": [
        "Action item 1: Specific thing to try",
        "Action item 2: Another concrete step",
        "Action item 3: Third actionable item"
      ],
      "tip": "Helpful tip for implementing this step successfully."
    },
    {
      "number": 2,
      "emoji": "🌱",
      "title": "Second Step Title", 
      "intro": "Introduction to the second step.",
      "try_this": [
        "Action item 1: First thing to try for step 2",
        "Action item 2: Second actionable item"
      ],
      "tip": "Implementation tip for step 2."
    }
  ]'
);

-- Add more [CONTENT_TYPE] entries following the same pattern...

-- Verify the imports
SELECT [CONTENT_TYPE]_name, intro_paragraph FROM [CONTENT_TYPE]_content ORDER BY [CONTENT_TYPE]_name;