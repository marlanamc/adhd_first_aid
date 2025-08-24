-- Simple Apostrophe Fix Script for ADHD First Aid Kit Database
-- This replaces common contractions that use " instead of ' 

-- First, let's see what we're dealing with - check current issues
SELECT 
    'Before Fix - barriers_content' as status,
    barrier_name,
    'step_sections' as field,
    step_sections::text as sample
FROM barriers_content 
WHERE step_sections::text LIKE '%"t %' 
   OR step_sections::text LIKE '%"re %'
   OR step_sections::text LIKE '%"ve %'  
   OR step_sections::text LIKE '%"ll %'
   OR step_sections::text LIKE '%"s %'
   OR step_sections::text LIKE '%"m %'
   OR step_sections::text LIKE '%"d %'
LIMIT 3;

-- Check feelings_content issues
SELECT 
    'Before Fix - feelings_content' as status,
    feeling_name,
    'gentle_advice' as field,
    gentle_advice as sample
FROM feelings_content 
WHERE gentle_advice LIKE '%"t %' 
   OR gentle_advice LIKE '%"re %'
   OR gentle_advice LIKE '%"ve %'  
   OR gentle_advice LIKE '%"ll %'
   OR gentle_advice LIKE '%"s %'
   OR gentle_advice LIKE '%"m %'
   OR gentle_advice LIKE '%"d %'
LIMIT 3;

-- FIX SIMPLE TEXT FIELDS FIRST (easier to verify)

-- Fix gentle_advice in feelings_content
UPDATE feelings_content 
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

-- Fix stern_advice in feelings_content
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

-- Fix intro_paragraph in feelings_content
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

-- Verify the simple text field fixes worked
SELECT 
    'After Fix - feelings_content simple fields' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN gentle_advice LIKE '%"t %' OR gentle_advice LIKE '%"re %' OR gentle_advice LIKE '%"ve %' OR gentle_advice LIKE '%"ll %' OR gentle_advice LIKE '%"s %' OR gentle_advice LIKE '%"m %' OR gentle_advice LIKE '%"d %' THEN 1 END) as remaining_gentle_issues,
    COUNT(CASE WHEN stern_advice LIKE '%"t %' OR stern_advice LIKE '%"re %' OR stern_advice LIKE '%"ve %' OR stern_advice LIKE '%"ll %' OR stern_advice LIKE '%"s %' OR stern_advice LIKE '%"m %' OR stern_advice LIKE '%"d %' THEN 1 END) as remaining_stern_issues
FROM feelings_content;