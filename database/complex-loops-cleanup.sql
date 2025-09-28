-- Complex Loops Cleanup Script
-- Fix naming issues and missing categorizations

-- Step 1: Fix the misnamed entries
UPDATE complex_loops_content 
SET loop_name = 'Screen Time'
WHERE loop_name = 'Encouragement to Take With You';

UPDATE complex_loops_content 
SET loop_name = 'Social Media'  
WHERE loop_name = 'ADHD & Social Media';

-- Step 2: Add missing loop type categorizations
UPDATE complex_loops_content 
SET loop_type = 'dopamine_impulse', 
    framework_title = 'The Dopamine Cycle'
WHERE loop_name = 'Screen Time';

UPDATE complex_loops_content 
SET loop_type = 'time_transition', 
    framework_title = 'The Time Trap'
WHERE loop_name = 'Can''t Fall Asleep';

-- Step 3: Update other missing categorizations that might exist
UPDATE complex_loops_content 
SET loop_type = 'energy_capacity', 
    framework_title = 'The Depletion Pattern'
WHERE loop_name = 'Undereating' AND loop_type IS NULL;

UPDATE complex_loops_content 
SET loop_type = 'social_relationship', 
    framework_title = 'The Social Spiral'
WHERE loop_name = 'Intimacy & Connection' AND loop_type IS NULL;

-- Step 4: Verify all 27 complex loops now have proper categorization
SELECT 
    loop_name,
    loop_type,
    framework_title,
    CASE 
        WHEN loop_type IS NULL THEN '❌ Missing Category'
        WHEN framework_title IS NULL THEN '⚠️ Missing Framework Title' 
        ELSE '✅ Properly Categorized'
    END as status
FROM complex_loops_content 
ORDER BY 
    CASE loop_type
        WHEN 'time_transition' THEN 1
        WHEN 'analysis_decision' THEN 2  
        WHEN 'social_relationship' THEN 3
        WHEN 'dopamine_impulse' THEN 4
        WHEN 'energy_capacity' THEN 5
        WHEN 'task_communication' THEN 6
        ELSE 7
    END,
    loop_name;