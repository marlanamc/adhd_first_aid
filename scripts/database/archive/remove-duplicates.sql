-- Remove Duplicate Strategies Script
-- This script identifies and removes duplicate strategies based on name
-- Keeps the FIRST occurrence (oldest by ID) and removes newer duplicates

-- First, let's see what duplicates we have
SELECT 
    name,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ' ORDER BY id) as all_ids
FROM strategies 
GROUP BY name 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, name;

-- Show total count before cleanup
SELECT 'Before cleanup' as status, COUNT(*) as total_strategies FROM strategies;

-- Create a temporary table with strategies to keep (first occurrence of each name)
CREATE TEMP TABLE strategies_to_keep AS
SELECT DISTINCT ON (name) 
    id,
    name
FROM strategies
ORDER BY name, id ASC;  -- Keep the first (oldest) ID for each name

-- Show what we're keeping vs removing
SELECT 
    'Strategies to keep' as status,
    COUNT(*) as count
FROM strategies_to_keep;

SELECT 
    'Strategies to remove' as status,
    COUNT(*) as count
FROM strategies s
WHERE s.id NOT IN (SELECT id FROM strategies_to_keep);

-- Delete junction table entries for strategies we're removing
-- This prevents foreign key constraint violations

DELETE FROM strategy_feelings 
WHERE strategy_id NOT IN (SELECT id FROM strategies_to_keep);

DELETE FROM strategy_issues 
WHERE strategy_id NOT IN (SELECT id FROM strategies_to_keep);

DELETE FROM strategy_barriers 
WHERE strategy_id NOT IN (SELECT id FROM strategies_to_keep);

DELETE FROM strategy_help_tasks 
WHERE strategy_id NOT IN (SELECT id FROM strategies_to_keep);

DELETE FROM strategy_tags 
WHERE strategy_id NOT IN (SELECT id FROM strategies_to_keep);

DELETE FROM strategy_life_roles 
WHERE strategy_id NOT IN (SELECT id FROM strategies_to_keep);

DELETE FROM strategy_solution_types 
WHERE strategy_id NOT IN (SELECT id FROM strategies_to_keep);

DELETE FROM strategy_styles 
WHERE strategy_id NOT IN (SELECT id FROM strategies_to_keep);

DELETE FROM strategy_why_does_this_work 
WHERE strategy_id NOT IN (SELECT id FROM strategies_to_keep);

DELETE FROM strategy_votes 
WHERE strategy_id NOT IN (SELECT id FROM strategies_to_keep);

-- Finally, delete the duplicate strategy records themselves
DELETE FROM strategies 
WHERE id NOT IN (SELECT id FROM strategies_to_keep);

-- Show final count
SELECT 'After cleanup' as status, COUNT(*) as total_strategies FROM strategies;

-- Show remaining duplicates (should be 0)
SELECT 
    'Remaining duplicates' as status,
    COUNT(*) as count
FROM (
    SELECT name
    FROM strategies 
    GROUP BY name 
    HAVING COUNT(*) > 1
) duplicates;

-- Clean up temp table
DROP TABLE strategies_to_keep;