-- Fix Incorrect Apostrophes in Database Content
-- This script replaces " with ' in contractions throughout the ADHD First Aid Kit database

-- ================================
-- FIX BARRIERS_CONTENT TABLE
-- ================================

-- Fix step_sections JSON field in barriers_content
UPDATE barriers_content 
SET step_sections = step_sections::text::jsonb
WHERE step_sections::text ~ '"(t|re|ve|ll|s|m) '
  AND step_sections IS NOT NULL;

-- Replace common contractions in barriers_content step_sections
UPDATE barriers_content 
SET step_sections = (
    SELECT jsonb_agg(
        jsonb_set(
            jsonb_set(
                jsonb_set(
                    jsonb_set(
                        jsonb_set(elem,
                            '{try_this}', 
                            (SELECT jsonb_agg(
                                replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
                                    item::text, 
                                    '"t ', '''t '), 
                                    '"re ', '''re '), 
                                    '"ve ', '''ve '), 
                                    '"ll ', '''ll '), 
                                    '"s ', '''s '),
                                    '"m ', '''m '),
                                    '"d ', '''d '),
                                    '"', ''''), -- Fix any remaining double quotes used as apostrophes
                                    '\"', ''''), -- Fix escaped quotes
                                    '\\\"', '''')::jsonb -- Fix double-escaped quotes
                                FROM jsonb_array_elements_text(elem->'try_this') item
                            ))
                        ),
                        '{intro}', 
                        to_jsonb(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
                            (elem->>'intro'),
                            '"t ', '''t '), 
                            '"re ', '''re '), 
                            '"ve ', '''ve '), 
                            '"ll ', '''ll '), 
                            '"s ', '''s '),
                            '"m ', '''m '),
                            '"d ', '''d '),
                            '"', ''''), 
                            '\"', ''''), 
                            '\\\"', ''''))
                    ),
                    '{tip}', 
                    to_jsonb(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
                        (elem->>'tip'),
                        '"t ', '''t '), 
                        '"re ', '''re '), 
                        '"ve ', '''ve '), 
                        '"ll ', '''ll '), 
                        '"s ', '''s '),
                        '"m ', '''m '),
                        '"d ', '''d '),
                        '"', ''''), 
                        '\"', ''''), 
                        '\\\"', ''''))
                ),
                '{title}', 
                to_jsonb(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
                    (elem->>'title'),
                    '"t ', '''t '), 
                    '"re ', '''re '), 
                    '"ve ', '''ve '), 
                    '"ll ', '''ll '), 
                    '"s ', '''s '),
                    '"m ', '''m '),
                    '"d ', '''d '),
                    '"', ''''), 
                    '\"', ''''), 
                    '\\\"', ''''))
            ),
            '{number}', elem->'number'
        )
        FROM jsonb_array_elements(step_sections) elem
    )
)
WHERE step_sections::text ~ '"(t|re|ve|ll|s|m|d) ';

-- Fix gentle_advice field in barriers_content
UPDATE barriers_content 
SET gentle_advice = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
    gentle_advice,
    '"t ', '''t '), 
    '"re ', '''re '), 
    '"ve ', '''ve '), 
    '"ll ', '''ll '), 
    '"s ', '''s '),
    '"m ', '''m '),
    '"d ', '''d '),
    '"', ''''), 
    '\"', ''''), 
    '\\\"', '''')
WHERE gentle_advice ~ '"(t|re|ve|ll|s|m|d) ';

-- Fix stern_advice field in barriers_content
UPDATE barriers_content 
SET stern_advice = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
    stern_advice,
    '"t ', '''t '), 
    '"re ', '''re '), 
    '"ve ', '''ve '), 
    '"ll ', '''ll '), 
    '"s ', '''s '),
    '"m ', '''m '),
    '"d ', '''d '),
    '"', ''''), 
    '\"', ''''), 
    '\\\"', '''')
WHERE stern_advice ~ '"(t|re|ve|ll|s|m|d) ';

-- ================================
-- FIX FEELINGS_CONTENT TABLE  
-- ================================

-- Fix step_sections JSON field in feelings_content
UPDATE feelings_content 
SET step_sections = (
    SELECT jsonb_agg(
        jsonb_set(
            jsonb_set(
                jsonb_set(
                    jsonb_set(
                        jsonb_set(elem,
                            '{try_this}', 
                            (SELECT jsonb_agg(
                                replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
                                    item::text, 
                                    '"t ', '''t '), 
                                    '"re ', '''re '), 
                                    '"ve ', '''ve '), 
                                    '"ll ', '''ll '), 
                                    '"s ', '''s '),
                                    '"m ', '''m '),
                                    '"d ', '''d '),
                                    '"', ''''), 
                                    '\"', ''''), 
                                    '\\\"', '''')::jsonb
                                FROM jsonb_array_elements_text(elem->'try_this') item
                            ))
                        ),
                        '{intro}', 
                        to_jsonb(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
                            (elem->>'intro'),
                            '"t ', '''t '), 
                            '"re ', '''re '), 
                            '"ve ', '''ve '), 
                            '"ll ', '''ll '), 
                            '"s ', '''s '),
                            '"m ', '''m '),
                            '"d ', '''d '),
                            '"', ''''), 
                            '\"', ''''), 
                            '\\\"', ''''))
                    ),
                    '{tip}', 
                    to_jsonb(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
                        (elem->>'tip'),
                        '"t ', '''t '), 
                        '"re ', '''re '), 
                        '"ve ', '''ve '), 
                        '"ll ', '''ll '), 
                        '"s ', '''s '),
                        '"m ', '''m '),
                        '"d ', '''d '),
                        '"', ''''), 
                        '\"', ''''), 
                        '\\\"', ''''))
                ),
                '{title}', 
                to_jsonb(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
                    (elem->>'title'),
                    '"t ', '''t '), 
                    '"re ', '''re '), 
                    '"ve ', '''ve '), 
                    '"ll ', '''ll '), 
                    '"s ', '''s '),
                    '"m ', '''m '),
                    '"d ', '''d '),
                    '"', ''''), 
                    '\"', ''''), 
                    '\\\"', ''''))
            ),
            '{number}', elem->'number'
        )
        FROM jsonb_array_elements(step_sections) elem
    )
)
WHERE step_sections::text ~ '"(t|re|ve|ll|s|m|d) ';

-- Fix gentle_advice field in feelings_content
UPDATE feelings_content 
SET gentle_advice = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
    gentle_advice,
    '"t ', '''t '), 
    '"re ', '''re '), 
    '"ve ', '''ve '), 
    '"ll ', '''ll '), 
    '"s ', '''s '),
    '"m ', '''m '),
    '"d ', '''d '),
    '"', ''''), 
    '\"', ''''), 
    '\\\"', '''')
WHERE gentle_advice ~ '"(t|re|ve|ll|s|m|d) ';

-- Fix stern_advice field in feelings_content
UPDATE feelings_content 
SET stern_advice = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
    stern_advice,
    '"t ', '''t '), 
    '"re ', '''re '), 
    '"ve ', '''ve '), 
    '"ll ', '''ll '), 
    '"s ', '''s '),
    '"m ', '''m '),
    '"d ', '''d '),
    '"', ''''), 
    '\"', ''''), 
    '\\\"', '''')
WHERE stern_advice ~ '"(t|re|ve|ll|s|m|d) ';

-- Fix intro_paragraph field in feelings_content
UPDATE feelings_content 
SET intro_paragraph = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
    intro_paragraph,
    '"t ', '''t '), 
    '"re ', '''re '), 
    '"ve ', '''ve '), 
    '"ll ', '''ll '), 
    '"s ', '''s '),
    '"m ', '''m '),
    '"d ', '''d '),
    '"', ''''), 
    '\"', ''''), 
    '\\\"', '''')
WHERE intro_paragraph ~ '"(t|re|ve|ll|s|m|d) ';

-- ================================
-- VERIFICATION QUERIES
-- ================================

-- Check that fixes worked
SELECT 
    'barriers_content' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN step_sections::text ~ '"(t|re|ve|ll|s|m|d) ' THEN 1 END) as remaining_step_issues,
    COUNT(CASE WHEN gentle_advice ~ '"(t|re|ve|ll|s|m|d) ' THEN 1 END) as remaining_gentle_issues,
    COUNT(CASE WHEN stern_advice ~ '"(t|re|ve|ll|s|m|d) ' THEN 1 END) as remaining_stern_issues
FROM barriers_content
UNION ALL
SELECT 
    'feelings_content' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN step_sections::text ~ '"(t|re|ve|ll|s|m|d) ' THEN 1 END) as remaining_step_issues,
    COUNT(CASE WHEN gentle_advice ~ '"(t|re|ve|ll|s|m|d) ' THEN 1 END) as remaining_gentle_issues,
    COUNT(CASE WHEN stern_advice ~ '"(t|re|ve|ll|s|m|d) ' THEN 1 END) as remaining_stern_issues
FROM feelings_content;