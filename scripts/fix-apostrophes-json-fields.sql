-- ============================================
-- FIX APOSTROPHES IN JSON STEP_SECTIONS FIELDS
-- ============================================
-- This script fixes apostrophes in the JSON step_sections fields
-- Run this AFTER the comprehensive apostrophe fix script
-- Created: 2025-01-23

-- ============================================
-- STEP 1: CHECK CURRENT ISSUES IN JSON FIELDS
-- ============================================

SELECT 'BEFORE JSON FIX - Issue Count' as status,
    'feelings_content' as table_name,
    COUNT(CASE WHEN step_sections::text LIKE '%"t %' OR step_sections::text LIKE '%"re %' OR step_sections::text LIKE '%"ve %' OR step_sections::text LIKE '%"ll %' OR step_sections::text LIKE '%"s %' OR step_sections::text LIKE '%"m %' OR step_sections::text LIKE '%"d %' THEN 1 END) as step_sections_issues
FROM feelings_content
UNION ALL
SELECT 'BEFORE JSON FIX - Issue Count' as status,
    'barriers_content' as table_name,
    COUNT(CASE WHEN step_sections::text LIKE '%"t %' OR step_sections::text LIKE '%"re %' OR step_sections::text LIKE '%"ve %' OR step_sections::text LIKE '%"ll %' OR step_sections::text LIKE '%"s %' OR step_sections::text LIKE '%"m %' OR step_sections::text LIKE '%"d %' THEN 1 END) as step_sections_issues
FROM barriers_content;

-- ============================================
-- STEP 2: FIX FEELINGS_CONTENT STEP_SECTIONS
-- ============================================

-- Fix step_sections in feelings_content
-- This converts to text, replaces the apostrophes, then converts back to JSONB
UPDATE feelings_content 
SET step_sections = (
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
        step_sections::text,
        '"t ', '''t '),     -- can"t → can't
        '"re ', '''re '),   -- you"re → you're
        '"ve ', '''ve '),   -- I"ve → I've
        '"ll ', '''ll '),   -- you"ll → you'll
        '"s ', '''s '),     -- it"s → it's
        '"m ', '''m '),     -- I"m → I'm
        '"d ', '''d ')      -- I"d → I'd
)::jsonb
WHERE step_sections::text LIKE '%"t %' 
   OR step_sections::text LIKE '%"re %'
   OR step_sections::text LIKE '%"ve %'  
   OR step_sections::text LIKE '%"ll %'
   OR step_sections::text LIKE '%"s %'
   OR step_sections::text LIKE '%"m %'
   OR step_sections::text LIKE '%"d %';

-- ============================================
-- STEP 3: FIX BARRIERS_CONTENT STEP_SECTIONS
-- ============================================

-- Fix step_sections in barriers_content
UPDATE barriers_content 
SET step_sections = (
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
        step_sections::text,
        '"t ', '''t '),     -- can"t → can't
        '"re ', '''re '),   -- you"re → you're
        '"ve ', '''ve '),   -- I"ve → I've
        '"ll ', '''ll '),   -- you"ll → you'll
        '"s ', '''s '),     -- it"s → it's
        '"m ', '''m '),     -- I"m → I'm
        '"d ', '''d ')      -- I"d → I'd
)::jsonb
WHERE step_sections::text LIKE '%"t %' 
   OR step_sections::text LIKE '%"re %'
   OR step_sections::text LIKE '%"ve %'  
   OR step_sections::text LIKE '%"ll %'
   OR step_sections::text LIKE '%"s %'
   OR step_sections::text LIKE '%"m %'
   OR step_sections::text LIKE '%"d %';

-- ============================================
-- STEP 4: SPECIAL CASES - FIX COMPLEX PATTERNS
-- ============================================

-- Some content might have patterns like: "instead of needing, try" or "instead of chooseing, try"
-- These are malformed and should be fixed to proper English

-- Fix "instead of [word]ing, try" patterns in feelings_content
UPDATE feelings_content 
SET step_sections = (
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
        step_sections::text,
        'instead of needing, try', 'don''t need'),
        'instead of haveing, try', 'don''t have'),
        'instead of chooseing, try', 'don''t choose'),
        'instead of geting, try', 'don''t get'),
        'instead of defineing, try', 'don''t define'
    )
)::jsonb
WHERE step_sections::text LIKE '%instead of %ing, try%';

-- Fix the same patterns in barriers_content
UPDATE barriers_content 
SET step_sections = (
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
        step_sections::text,
        'instead of needing, try', 'don''t need'),
        'instead of haveing, try', 'don''t have'),
        'instead of chooseing, try', 'don''t choose'),
        'instead of geting, try', 'don''t get'),
        'instead of defineing, try', 'don''t define'
    )
)::jsonb
WHERE step_sections::text LIKE '%instead of %ing, try%';

-- ============================================
-- STEP 5: VERIFY ALL FIXES
-- ============================================

-- Check if any apostrophe issues remain
SELECT 'AFTER JSON FIX - Remaining Issues' as status,
    'feelings_content' as table_name,
    COUNT(CASE WHEN step_sections::text LIKE '%"t %' OR step_sections::text LIKE '%"re %' OR step_sections::text LIKE '%"ve %' OR step_sections::text LIKE '%"ll %' OR step_sections::text LIKE '%"s %' OR step_sections::text LIKE '%"m %' OR step_sections::text LIKE '%"d %' THEN 1 END) as step_sections_issues
FROM feelings_content
UNION ALL
SELECT 'AFTER JSON FIX - Remaining Issues' as status,
    'barriers_content' as table_name,
    COUNT(CASE WHEN step_sections::text LIKE '%"t %' OR step_sections::text LIKE '%"re %' OR step_sections::text LIKE '%"ve %' OR step_sections::text LIKE '%"ll %' OR step_sections::text LIKE '%"s %' OR step_sections::text LIKE '%"m %' OR step_sections::text LIKE '%"d %' THEN 1 END) as step_sections_issues
FROM barriers_content;

-- Check for any remaining "instead of" patterns
SELECT 'Malformed Pattern Check' as check_type,
    'feelings_content' as table_name,
    COUNT(CASE WHEN step_sections::text LIKE '%instead of %ing, try%' THEN 1 END) as malformed_patterns
FROM feelings_content
UNION ALL
SELECT 'Malformed Pattern Check' as check_type,
    'barriers_content' as table_name,
    COUNT(CASE WHEN step_sections::text LIKE '%instead of %ing, try%' THEN 1 END) as malformed_patterns
FROM barriers_content;

-- ============================================
-- STEP 6: SAMPLE OUTPUT TO VERIFY
-- ============================================

-- Show a sample of fixed step_sections content
SELECT 
    feeling_name,
    (step_sections->0->>'title') as first_step_title,
    SUBSTRING((step_sections->0->>'intro'), 1, 100) as first_step_intro_sample
FROM feelings_content 
WHERE step_sections IS NOT NULL
LIMIT 3;

-- ============================================
-- NOTES:
-- ============================================
-- 1. This script works with JSONB data, converting to text for replacements
-- 2. It also fixes malformed patterns like "instead of needing, try"
-- 3. Run the verification queries to ensure all issues are resolved
-- 4. Check your app thoroughly after running to ensure JSON structure is intact
-- ============================================