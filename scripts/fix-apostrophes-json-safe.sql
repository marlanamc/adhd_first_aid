-- ============================================
-- SAFE JSON APOSTROPHE FIX FOR ADHD FIRST AID KIT
-- ============================================
-- This script safely fixes apostrophes in JSON step_sections fields
-- It properly handles JSON escaping to avoid errors
-- Created: 2025-01-23

-- ============================================
-- STEP 1: CHECK CURRENT ISSUES
-- ============================================

SELECT 'BEFORE FIX - Issues in JSON fields' as status,
    'feelings_content' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN step_sections::text LIKE '%"t %' OR step_sections::text LIKE '%"re %' OR step_sections::text LIKE '%"ve %' OR step_sections::text LIKE '%"ll %' OR step_sections::text LIKE '%"s %' OR step_sections::text LIKE '%"m %' OR step_sections::text LIKE '%"d %' THEN 1 END) as records_with_issues
FROM feelings_content
UNION ALL
SELECT 'BEFORE FIX - Issues in JSON fields' as status,
    'barriers_content' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN step_sections::text LIKE '%"t %' OR step_sections::text LIKE '%"re %' OR step_sections::text LIKE '%"ve %' OR step_sections::text LIKE '%"ll %' OR step_sections::text LIKE '%"s %' OR step_sections::text LIKE '%"m %' OR step_sections::text LIKE '%"d %' THEN 1 END) as records_with_issues
FROM barriers_content;

-- ============================================
-- STEP 2: CREATE HELPER FUNCTION FOR SAFE REPLACEMENT
-- ============================================

-- Create a function to safely fix apostrophes in JSON text
CREATE OR REPLACE FUNCTION fix_json_apostrophes(json_text text) 
RETURNS text AS $$
BEGIN
    -- First handle the malformed patterns
    json_text := REPLACE(json_text, 'instead of needing, try', 'don''t need');
    json_text := REPLACE(json_text, 'instead of haveing, try', 'don''t have');
    json_text := REPLACE(json_text, 'instead of chooseing, try', 'don''t choose');
    json_text := REPLACE(json_text, 'instead of geting, try', 'don''t get');
    json_text := REPLACE(json_text, 'instead of defineing, try', 'don''t define');
    json_text := REPLACE(json_text, 'instead of predicting, try', 'don''t predict');
    json_text := REPLACE(json_text, 'instead of trying, try', 'don''t try');
    json_text := REPLACE(json_text, 'instead of knowing, try', 'don''t know');
    
    -- Fix the apostrophe patterns
    -- We need to be careful here - only replace within the JSON string values
    -- Look for patterns like: "word"t " or "word"re " etc.
    
    -- Handle escaped quotes within JSON strings
    json_text := REPLACE(json_text, '\"t ', '\'t ');
    json_text := REPLACE(json_text, '\"re ', '\'re ');
    json_text := REPLACE(json_text, '\"ve ', '\'ve ');
    json_text := REPLACE(json_text, '\"ll ', '\'ll ');
    json_text := REPLACE(json_text, '\"s ', '\'s ');
    json_text := REPLACE(json_text, '\"m ', '\'m ');
    json_text := REPLACE(json_text, '\"d ', '\'d ');
    
    -- Also handle the pattern where it's at the end of a word
    json_text := REPLACE(json_text, 'n\"t', 'n''t');
    json_text := REPLACE(json_text, 'you\"re', 'you''re');
    json_text := REPLACE(json_text, 'I\"ve', 'I''ve');
    json_text := REPLACE(json_text, 'you\"ll', 'you''ll');
    json_text := REPLACE(json_text, 'it\"s', 'it''s');
    json_text := REPLACE(json_text, 'I\"m', 'I''m');
    json_text := REPLACE(json_text, 'I\"d', 'I''d');
    
    RETURN json_text;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 3: UPDATE FEELINGS_CONTENT
-- ============================================

-- Update feelings_content step_sections using the helper function
UPDATE feelings_content 
SET step_sections = fix_json_apostrophes(step_sections::text)::jsonb
WHERE step_sections::text LIKE '%"t %' 
   OR step_sections::text LIKE '%"re %'
   OR step_sections::text LIKE '%"ve %'  
   OR step_sections::text LIKE '%"ll %'
   OR step_sections::text LIKE '%"s %'
   OR step_sections::text LIKE '%"m %'
   OR step_sections::text LIKE '%"d %'
   OR step_sections::text LIKE '%instead of%';

-- ============================================
-- STEP 4: UPDATE BARRIERS_CONTENT
-- ============================================

-- Update barriers_content step_sections using the helper function
UPDATE barriers_content 
SET step_sections = fix_json_apostrophes(step_sections::text)::jsonb
WHERE step_sections::text LIKE '%"t %' 
   OR step_sections::text LIKE '%"re %'
   OR step_sections::text LIKE '%"ve %'  
   OR step_sections::text LIKE '%"ll %'
   OR step_sections::text LIKE '%"s %'
   OR step_sections::text LIKE '%"m %'
   OR step_sections::text LIKE '%"d %'
   OR step_sections::text LIKE '%instead of%';

-- ============================================
-- STEP 5: VERIFY THE FIXES
-- ============================================

-- Check if issues are resolved
SELECT 'AFTER FIX - Remaining issues' as status,
    'feelings_content' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN step_sections::text LIKE '%"t %' OR step_sections::text LIKE '%"re %' OR step_sections::text LIKE '%"ve %' OR step_sections::text LIKE '%"ll %' OR step_sections::text LIKE '%"s %' OR step_sections::text LIKE '%"m %' OR step_sections::text LIKE '%"d %' THEN 1 END) as records_with_issues
FROM feelings_content
UNION ALL
SELECT 'AFTER FIX - Remaining issues' as status,
    'barriers_content' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN step_sections::text LIKE '%"t %' OR step_sections::text LIKE '%"re %' OR step_sections::text LIKE '%"ve %' OR step_sections::text LIKE '%"ll %' OR step_sections::text LIKE '%"s %' OR step_sections::text LIKE '%"m %' OR step_sections::text LIKE '%"d %' THEN 1 END) as records_with_issues
FROM barriers_content;

-- ============================================
-- STEP 6: CLEANUP (OPTIONAL)
-- ============================================

-- Drop the helper function if you don't need it anymore
-- DROP FUNCTION IF EXISTS fix_json_apostrophes(text);

-- ============================================
-- STEP 7: SAMPLE OUTPUT
-- ============================================

-- Show sample of fixed content to verify
SELECT 
    feeling_name,
    jsonb_pretty(step_sections->0) as first_step_sample
FROM feelings_content 
WHERE step_sections IS NOT NULL
LIMIT 2;

-- ============================================
-- TROUBLESHOOTING
-- ============================================
-- If you still get errors, run this query to see the problematic records:

/*
SELECT 
    feeling_name,
    step_sections::text as raw_json
FROM feelings_content 
WHERE step_sections::text LIKE '%\"t %' 
   OR step_sections::text LIKE '%\"re %'
   OR step_sections::text LIKE '%\"ve %'
LIMIT 1;
*/

-- This will help identify the exact pattern causing issues