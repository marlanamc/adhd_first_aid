-- ============================================
-- COMPREHENSIVE APOSTROPHE FIX FOR ADHD FIRST AID KIT
-- ============================================
-- This script fixes all instances where " is used instead of ' for apostrophes
-- Run this in your Supabase SQL Editor
-- Created: 2025-01-23

-- ============================================
-- STEP 1: BACKUP CHECK (View current issues)
-- ============================================

-- First, let's see what we're about to fix
SELECT 'BEFORE FIX - Issue Count' as status,
    'feelings_content' as table_name,
    COUNT(CASE WHEN gentle_advice LIKE '%"t %' OR gentle_advice LIKE '%"re %' OR gentle_advice LIKE '%"ve %' OR gentle_advice LIKE '%"ll %' OR gentle_advice LIKE '%"s %' OR gentle_advice LIKE '%"m %' OR gentle_advice LIKE '%"d %' THEN 1 END) as gentle_advice_issues,
    COUNT(CASE WHEN stern_advice LIKE '%"t %' OR stern_advice LIKE '%"re %' OR stern_advice LIKE '%"ve %' OR stern_advice LIKE '%"ll %' OR stern_advice LIKE '%"s %' OR stern_advice LIKE '%"m %' OR stern_advice LIKE '%"d %' THEN 1 END) as stern_advice_issues,
    COUNT(CASE WHEN intro_paragraph LIKE '%"t %' OR intro_paragraph LIKE '%"re %' OR intro_paragraph LIKE '%"ve %' OR intro_paragraph LIKE '%"ll %' OR intro_paragraph LIKE '%"s %' OR intro_paragraph LIKE '%"m %' OR intro_paragraph LIKE '%"d %' THEN 1 END) as intro_issues
FROM feelings_content;

-- ============================================
-- STEP 2: FIX TEXT FIELDS IN FEELINGS_CONTENT
-- ============================================

-- Fix gentle_advice
UPDATE feelings_content 
SET gentle_advice = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    gentle_advice,
    '"t ', '''t '),     -- can"t → can't
    '"re ', '''re '),   -- you"re → you're
    '"ve ', '''ve '),   -- I"ve → I've
    '"ll ', '''ll '),   -- you"ll → you'll
    '"s ', '''s '),     -- it"s → it's
    '"m ', '''m '),     -- I"m → I'm
    '"d ', '''d ')      -- I"d → I'd
WHERE gentle_advice LIKE '%"t %' 
   OR gentle_advice LIKE '%"re %'
   OR gentle_advice LIKE '%"ve %'  
   OR gentle_advice LIKE '%"ll %'
   OR gentle_advice LIKE '%"s %'
   OR gentle_advice LIKE '%"m %'
   OR gentle_advice LIKE '%"d %';

-- Fix stern_advice
UPDATE feelings_content 
SET stern_advice = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    stern_advice,
    '"t ', '''t '), 
    '"re ', '''re '), 
    '"ve ', '''ve '), 
    '"ll ', '''ll '), 
    '"s ', '''s '),
    '"m ', '''m '),
    '"d ', '''d ')
WHERE stern_advice LIKE '%"t %' 
   OR stern_advice LIKE '%"re %'
   OR stern_advice LIKE '%"ve %'  
   OR stern_advice LIKE '%"ll %'
   OR stern_advice LIKE '%"s %'
   OR stern_advice LIKE '%"m %'
   OR stern_advice LIKE '%"d %';

-- Fix intro_paragraph
UPDATE feelings_content 
SET intro_paragraph = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    intro_paragraph,
    '"t ', '''t '), 
    '"re ', '''re '), 
    '"ve ', '''ve '), 
    '"ll ', '''ll '), 
    '"s ', '''s '),
    '"m ', '''m '),
    '"d ', '''d ')
WHERE intro_paragraph LIKE '%"t %' 
   OR intro_paragraph LIKE '%"re %'
   OR intro_paragraph LIKE '%"ve %'  
   OR intro_paragraph LIKE '%"ll %'
   OR intro_paragraph LIKE '%"s %'
   OR intro_paragraph LIKE '%"m %'
   OR intro_paragraph LIKE '%"d %';

-- Fix subtitle if it has issues
UPDATE feelings_content 
SET subtitle = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    subtitle,
    '"t ', '''t '), 
    '"re ', '''re '), 
    '"ve ', '''ve '), 
    '"ll ', '''ll '), 
    '"s ', '''s '),
    '"m ', '''m '),
    '"d ', '''d ')
WHERE subtitle LIKE '%"t %' 
   OR subtitle LIKE '%"re %'
   OR subtitle LIKE '%"ve %'  
   OR subtitle LIKE '%"ll %'
   OR subtitle LIKE '%"s %'
   OR subtitle LIKE '%"m %'
   OR subtitle LIKE '%"d %';

-- ============================================
-- STEP 3: FIX TEXT FIELDS IN BARRIERS_CONTENT
-- ============================================

-- Fix gentle_advice
UPDATE barriers_content 
SET gentle_advice = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    gentle_advice,
    '"t ', '''t '), 
    '"re ', '''re '), 
    '"ve ', '''ve '), 
    '"ll ', '''ll '), 
    '"s ', '''s '),
    '"m ', '''m '),
    '"d ', '''d ')
WHERE gentle_advice LIKE '%"t %' 
   OR gentle_advice LIKE '%"re %'
   OR gentle_advice LIKE '%"ve %'  
   OR gentle_advice LIKE '%"ll %'
   OR gentle_advice LIKE '%"s %'
   OR gentle_advice LIKE '%"m %'
   OR gentle_advice LIKE '%"d %';

-- Fix stern_advice
UPDATE barriers_content 
SET stern_advice = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    stern_advice,
    '"t ', '''t '), 
    '"re ', '''re '), 
    '"ve ', '''ve '), 
    '"ll ', '''ll '), 
    '"s ', '''s '),
    '"m ', '''m '),
    '"d ', '''d ')
WHERE stern_advice LIKE '%"t %' 
   OR stern_advice LIKE '%"re %'
   OR stern_advice LIKE '%"ve %'  
   OR stern_advice LIKE '%"ll %'
   OR stern_advice LIKE '%"s %'
   OR stern_advice LIKE '%"m %'
   OR stern_advice LIKE '%"d %';

-- Fix intro_paragraph
UPDATE barriers_content 
SET intro_paragraph = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    intro_paragraph,
    '"t ', '''t '), 
    '"re ', '''re '), 
    '"ve ', '''ve '), 
    '"ll ', '''ll '), 
    '"s ', '''s '),
    '"m ', '''m '),
    '"d ', '''d ')
WHERE intro_paragraph LIKE '%"t %' 
   OR intro_paragraph LIKE '%"re %'
   OR intro_paragraph LIKE '%"ve %'  
   OR intro_paragraph LIKE '%"ll %'
   OR intro_paragraph LIKE '%"s %'
   OR intro_paragraph LIKE '%"m %'
   OR intro_paragraph LIKE '%"d %';

-- ============================================
-- STEP 4: VERIFY THE FIXES
-- ============================================

-- Check if any issues remain in feelings_content
SELECT 'AFTER FIX - Remaining Issues' as status,
    'feelings_content' as table_name,
    COUNT(CASE WHEN gentle_advice LIKE '%"t %' OR gentle_advice LIKE '%"re %' OR gentle_advice LIKE '%"ve %' OR gentle_advice LIKE '%"ll %' OR gentle_advice LIKE '%"s %' OR gentle_advice LIKE '%"m %' OR gentle_advice LIKE '%"d %' THEN 1 END) as gentle_advice_issues,
    COUNT(CASE WHEN stern_advice LIKE '%"t %' OR stern_advice LIKE '%"re %' OR stern_advice LIKE '%"ve %' OR stern_advice LIKE '%"ll %' OR stern_advice LIKE '%"s %' OR stern_advice LIKE '%"m %' OR stern_advice LIKE '%"d %' THEN 1 END) as stern_advice_issues,
    COUNT(CASE WHEN intro_paragraph LIKE '%"t %' OR intro_paragraph LIKE '%"re %' OR intro_paragraph LIKE '%"ve %' OR intro_paragraph LIKE '%"ll %' OR intro_paragraph LIKE '%"s %' OR intro_paragraph LIKE '%"m %' OR intro_paragraph LIKE '%"d %' THEN 1 END) as intro_issues
FROM feelings_content

UNION ALL

-- Check if any issues remain in barriers_content
SELECT 'AFTER FIX - Remaining Issues' as status,
    'barriers_content' as table_name,
    COUNT(CASE WHEN gentle_advice LIKE '%"t %' OR gentle_advice LIKE '%"re %' OR gentle_advice LIKE '%"ve %' OR gentle_advice LIKE '%"ll %' OR gentle_advice LIKE '%"s %' OR gentle_advice LIKE '%"m %' OR gentle_advice LIKE '%"d %' THEN 1 END) as gentle_advice_issues,
    COUNT(CASE WHEN stern_advice LIKE '%"t %' OR stern_advice LIKE '%"re %' OR stern_advice LIKE '%"ve %' OR stern_advice LIKE '%"ll %' OR stern_advice LIKE '%"s %' OR stern_advice LIKE '%"m %' OR stern_advice LIKE '%"d %' THEN 1 END) as stern_advice_issues,
    COUNT(CASE WHEN intro_paragraph LIKE '%"t %' OR intro_paragraph LIKE '%"re %' OR intro_paragraph LIKE '%"ve %' OR intro_paragraph LIKE '%"ll %' OR intro_paragraph LIKE '%"s %' OR intro_paragraph LIKE '%"m %' OR intro_paragraph LIKE '%"d %' THEN 1 END) as intro_issues
FROM barriers_content;

-- ============================================
-- STEP 5: VIEW SAMPLE OF FIXED CONTENT
-- ============================================

-- Show a few examples of the fixed content
SELECT 
    feeling_name,
    SUBSTRING(gentle_advice, 1, 150) as gentle_advice_sample
FROM feelings_content 
WHERE gentle_advice LIKE '%''t %' 
   OR gentle_advice LIKE '%''re %'
   OR gentle_advice LIKE '%''ve %'
LIMIT 3;

-- ============================================
-- NOTES:
-- ============================================
-- 1. This script fixes simple text fields first (safer)
-- 2. The JSON fields (step_sections) are more complex
-- 3. After running this, check your app to ensure everything looks correct
-- 4. If you need to fix JSON fields too, we have a separate script for that
-- ============================================