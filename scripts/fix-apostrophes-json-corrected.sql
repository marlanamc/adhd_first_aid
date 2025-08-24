-- ============================================
-- CORRECTED JSON APOSTROPHE FIX FOR ADHD FIRST AID KIT
-- ============================================
-- This script safely fixes apostrophes in JSON step_sections fields
-- Uses proper PostgreSQL string escaping
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
    -- Using E'' notation for escape sequences or doubling quotes
    json_text := REPLACE(json_text, '\"t ', '''t ');
    json_text := REPLACE(json_text, '\"re ', '''re ');
    json_text := REPLACE(json_text, '\"ve ', '''ve ');
    json_text := REPLACE(json_text, '\"ll ', '''ll ');
    json_text := REPLACE(json_text, '\"s ', '''s ');
    json_text := REPLACE(json_text, '\"m ', '''m ');
    json_text := REPLACE(json_text, '\"d ', '''d ');
    
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
-- STEP 3: ALTERNATIVE APPROACH - DIRECT UPDATE
-- ============================================

-- If the function approach doesn't work, try this direct update approach
-- This uses multiple nested REPLACE calls

-- Update feelings_content step_sections
UPDATE feelings_content 
SET step_sections = (
    REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(
                                    REPLACE(
                                        REPLACE(
                                            REPLACE(
                                                REPLACE(
                                                    REPLACE(
                                                        REPLACE(
                                                            step_sections::text,
                                                            '\"t ', '''t '),
                                                        '\"re ', '''re '),
                                                    '\"ve ', '''ve '),
                                                '\"ll ', '''ll '),
                                            '\"s ', '''s '),
                                        '\"m ', '''m '),
                                    '\"d ', '''d '),
                                'n\"t', 'n''t'),
                            'you\"re', 'you''re'),
                        'I\"ve', 'I''ve'),
                    'you\"ll', 'you''ll'),
                'it\"s', 'it''s'),
            'I\"m', 'I''m'),
        'I\"d', 'I''d')
)::jsonb
WHERE step_sections::text LIKE '%\"t %' 
   OR step_sections::text LIKE '%\"re %'
   OR step_sections::text LIKE '%\"ve %'  
   OR step_sections::text LIKE '%\"ll %'
   OR step_sections::text LIKE '%\"s %'
   OR step_sections::text LIKE '%\"m %'
   OR step_sections::text LIKE '%\"d %';

-- Update barriers_content step_sections
UPDATE barriers_content 
SET step_sections = (
    REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(
                                    REPLACE(
                                        REPLACE(
                                            REPLACE(
                                                REPLACE(
                                                    REPLACE(
                                                        REPLACE(
                                                            step_sections::text,
                                                            '\"t ', '''t '),
                                                        '\"re ', '''re '),
                                                    '\"ve ', '''ve '),
                                                '\"ll ', '''ll '),
                                            '\"s ', '''s '),
                                        '\"m ', '''m '),
                                    '\"d ', '''d '),
                                'n\"t', 'n''t'),
                            'you\"re', 'you''re'),
                        'I\"ve', 'I''ve'),
                    'you\"ll', 'you''ll'),
                'it\"s', 'it''s'),
            'I\"m', 'I''m'),
        'I\"d', 'I''d')
)::jsonb
WHERE step_sections::text LIKE '%\"t %' 
   OR step_sections::text LIKE '%\"re %'
   OR step_sections::text LIKE '%\"ve %'  
   OR step_sections::text LIKE '%\"ll %'
   OR step_sections::text LIKE '%\"s %'
   OR step_sections::text LIKE '%\"m %'
   OR step_sections::text LIKE '%\"d %';

-- ============================================
-- STEP 4: VERIFY THE FIXES
-- ============================================

-- Check if issues are resolved
SELECT 'AFTER FIX - Remaining issues' as status,
    'feelings_content' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN step_sections::text LIKE '%\"t %' OR step_sections::text LIKE '%\"re %' OR step_sections::text LIKE '%\"ve %' OR step_sections::text LIKE '%\"ll %' OR step_sections::text LIKE '%\"s %' OR step_sections::text LIKE '%\"m %' OR step_sections::text LIKE '%\"d %' THEN 1 END) as records_with_issues
FROM feelings_content
UNION ALL
SELECT 'AFTER FIX - Remaining issues' as status,
    'barriers_content' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN step_sections::text LIKE '%\"t %' OR step_sections::text LIKE '%\"re %' OR step_sections::text LIKE '%\"ve %' OR step_sections::text LIKE '%\"ll %' OR step_sections::text LIKE '%\"s %' OR step_sections::text LIKE '%\"m %' OR step_sections::text LIKE '%\"d %' THEN 1 END) as records_with_issues
FROM barriers_content;

-- ============================================
-- STEP 5: CLEANUP
-- ============================================

-- Drop the helper function if it was created
DROP FUNCTION IF EXISTS fix_json_apostrophes(text);

-- ============================================
-- TROUBLESHOOTING - See what patterns remain
-- ============================================

-- If issues persist, run this to see examples:
/*
SELECT 
    feeling_name,
    substring(step_sections::text from position('\"t ' in step_sections::text) - 20 for 60) as context
FROM feelings_content 
WHERE step_sections::text LIKE '%\"t %'
LIMIT 3;
*/