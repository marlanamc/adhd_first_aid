-- Migration: Reorganize Identities Content Structure
-- Purpose: Flatten nested subsections to match the cleaner structure of complex_loops_content

-- Create a backup of the current identities_content table
CREATE TABLE IF NOT EXISTS identities_content_backup AS SELECT * FROM identities_content;

-- Function to reorganize content sections from nested to flat structure
CREATE OR REPLACE FUNCTION reorganize_identity_sections(sections jsonb)
RETURNS jsonb AS $$
DECLARE
    result jsonb := '[]'::jsonb;
    section jsonb;
    subsection jsonb;
    new_section jsonb;
    section_index int := 0;
BEGIN
    FOR section IN SELECT * FROM jsonb_array_elements(sections)
    LOOP
        section_index := section_index + 1;
        
        -- Process main section
        new_section := jsonb_build_object(
            'emoji', section->>'emoji',
            'title', section->>'title',
            'content', COALESCE(section->'content', '[]'::jsonb),
            'subsections', '[]'::jsonb
        );
        
        -- Only add main section if it has content or if it's a header section
        IF jsonb_array_length(COALESCE(section->'content', '[]'::jsonb)) > 0 
           OR (section->>'title' IS NOT NULL AND section->>'title' != '') THEN
            result := result || new_section;
        END IF;
        
        -- Convert nested subsections to main-level sections with better organization
        IF section->'subsections' IS NOT NULL AND jsonb_array_length(section->'subsections') > 0 THEN
            -- Create a "Strategies" or appropriate wrapper section if needed
            IF section->>'title' ILIKE '%strategies%' OR section->>'title' ILIKE '%tips%' THEN
                -- Keep subsections as they are, grouped under the main section
                new_section := jsonb_build_object(
                    'emoji', section->>'emoji',
                    'title', section->>'title',
                    'content', '[]'::jsonb,
                    'subsections', section->'subsections'
                );
                result := jsonb_set(result, ARRAY[(jsonb_array_length(result) - 1)::text], new_section);
            ELSE
                -- Flatten subsections to main level
                FOR subsection IN SELECT * FROM jsonb_array_elements(section->'subsections')
                LOOP
                    new_section := jsonb_build_object(
                        'emoji', subsection->>'emoji',
                        'title', subsection->>'title',
                        'content', COALESCE(subsection->'content', '[]'::jsonb),
                        'subsections', '[]'::jsonb
                    );
                    result := result || new_section;
                END LOOP;
            END IF;
        END IF;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Add ADHD reasons column if it doesn't exist
ALTER TABLE identities_content 
ADD COLUMN IF NOT EXISTS adhd_reasons text[] DEFAULT ARRAY[]::text[];

-- Update all identities content to use reorganized structure
UPDATE identities_content
SET content_sections = reorganize_identity_sections(content_sections),
    updated_at = NOW();

-- Populate generic ADHD reasons for identities that don't have them
UPDATE identities_content
SET adhd_reasons = ARRAY[
    'You might:',
    'Feel like you''re constantly playing catch-up',
    'Struggle with maintaining routines and consistency',
    'Experience intense emotional reactions to everyday situations',
    'Have difficulty prioritizing when everything feels urgent',
    'Face challenges with organization and time management',
    'Here''s what''s really going on:',
    '🧩 **Executive dysfunction**: Planning and organizing require extra mental energy',
    '⏰ **Time blindness**: Difficulty estimating how long tasks take or sensing time passing',
    '🧠 **Working memory**: Holding multiple pieces of information becomes overwhelming',
    '💥 **Emotional dysregulation**: Feelings are more intense and harder to manage',
    '🎯 **Attention differences**: Focus comes in extremes - hyperfocus or scattered attention'
]
WHERE adhd_reasons = ARRAY[]::text[] OR adhd_reasons IS NULL;

-- Specific ADHD reasons for certain identities
UPDATE identities_content
SET adhd_reasons = ARRAY[
    'You might:',
    'Feel exhausted from constantly masking at work',
    'Struggle to maintain the same pace as neurotypical colleagues',
    'Experience shame spirals from missed deadlines or forgotten tasks',
    'Have difficulty saying no to additional responsibilities',
    'Feel like you''re drowning despite appearing successful',
    'Here''s what''s really going on:',
    '🔁 **Executive dysfunction loop**: Forgetfulness and missed steps create constant catch-up',
    '⏳ **Time blindness**: Can''t gauge when you''re doing "enough" or estimate task duration',
    '🎭 **Masking exhaustion**: Pretending to be neurotypical drains your battery',
    '💥 **Impulsivity**: Overcommitting by saying yes before thinking it through',
    '🔌 **Dopamine crashes**: Alternating between overstimulation and complete shutdown'
]
WHERE identity_name = 'The Burned Out Professional';

UPDATE identities_content
SET adhd_reasons = ARRAY[
    'You might:',
    'Feel overwhelmed managing your needs plus your children''s',
    'Struggle with the constant transitions parenting requires',
    'Experience guilt about not being the "organized parent"',
    'Have difficulty with morning and bedtime routines',
    'Feel like you''re failing despite trying so hard',
    'Here''s what''s really going on:',
    '🧩 **Task switching overload**: Parenting requires constant context switching',
    '📅 **Schedule management**: Tracking everyone''s needs exceeds working memory',
    '😞 **Parent guilt amplified**: ADHD shame combines with parenting pressure',
    '⚡ **Sensory overwhelm**: Children''s noise and chaos can trigger dysregulation',
    '💛 **Emotional contagion**: You absorb and amplify your children''s emotions'
]
WHERE identity_name = 'The Parent';

UPDATE identities_content
SET adhd_reasons = ARRAY[
    'You might:',
    'Start projects with enthusiasm then abandon them halfway',
    'Have brilliant ideas but struggle with implementation',
    'Feel frustrated by the gap between vision and execution',
    'Experience feast-or-famine work patterns',
    'Wonder if you''re cut out for entrepreneurship',
    'Here''s what''s really going on:',
    '🚀 **Novelty seeking**: Your brain craves new challenges and gets bored with routine',
    '📊 **Detail overwhelm**: Big picture thinking clashes with administrative needs',
    '⏰ **Time optimism**: Consistently underestimating how long things take',
    '💡 **Idea overflow**: Too many possibilities make it hard to commit to one path',
    '📈 **Inconsistent productivity**: Energy and focus come in unpredictable waves'
]
WHERE identity_name = 'The Entrepreneur';

-- Clean up the function
DROP FUNCTION IF EXISTS reorganize_identity_sections(jsonb);

-- Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_identities_content_identity_name ON identities_content(identity_name);

-- Verify the migration worked
DO $$
DECLARE
    identity_count integer;
    sections_count integer;
BEGIN
    SELECT COUNT(*) INTO identity_count FROM identities_content;
    SELECT SUM(jsonb_array_length(content_sections)) INTO sections_count FROM identities_content;
    
    RAISE NOTICE 'Migration complete. % identities updated with % total sections.', identity_count, sections_count;
END $$;