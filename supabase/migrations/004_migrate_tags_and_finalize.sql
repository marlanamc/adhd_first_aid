-- Phase 4: Migrate Tags and Finalize Schema
-- Consolidates existing tags and creates updated application views

-- Create backup for tags
CREATE TABLE IF NOT EXISTS migration_backup_tags AS 
SELECT * FROM tags WHERE false; -- Create structure but no data initially

-- Only populate backup if we haven't already
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM migration_backup_tags LIMIT 1) THEN
        INSERT INTO migration_backup_tags SELECT * FROM tags;
        RAISE NOTICE 'Tags backup created successfully';
    END IF;
END $$;

-- 1. MIGRATE EXISTING TAGS TO NEW STRUCTURE  
-- Clear the new unified_tags table first (in case of re-run)
TRUNCATE TABLE unified_tags RESTART IDENTITY CASCADE;

-- Migrate existing tags (the original tags table had good structure)
INSERT INTO unified_tags (
    name,
    category,
    color,
    emoji,
    description,
    usage_count,
    created_at,
    updated_at
)
SELECT 
    name,
    category,
    color,
    emoji,
    hover_description as description,
    0 as usage_count, -- Start with 0, will be calculated later
    NOW() as created_at,
    NOW() as updated_at
FROM tags
WHERE name IS NOT NULL AND trim(name) != '';

-- Add some useful system tags that might be missing
INSERT INTO unified_tags (name, category, emoji, description) VALUES
('Executive Function', 'cognitive', '🧩', 'Strategies targeting executive function challenges'),
('Time Management', 'skill', '⏰', 'Tools and techniques for managing time effectively'),
('Emotional Regulation', 'emotional', '💗', 'Techniques for managing emotional responses'),
('Focus & Attention', 'cognitive', '🎯', 'Strategies to improve focus and attention'),
('Working Memory', 'cognitive', '🧠', 'Support for working memory challenges'),
('Procrastination', 'behavior', '⏳', 'Addressing procrastination patterns'),
('Perfectionism', 'behavior', '✨', 'Working with perfectionist tendencies'),
('RSD', 'emotional', '💔', 'Rejection Sensitive Dysphoria support'),
('Hyperfocus', 'attention', '🔍', 'Managing hyperfocus states'),
('Transition Difficulty', 'executive', '🔄', 'Support for task and activity transitions')
ON CONFLICT (name) DO NOTHING;

-- 2. CREATE USEFUL VIEWS FOR APPLICATION
-- View for content with type information
CREATE OR REPLACE VIEW content_with_types AS
SELECT 
    cp.id,
    cp.name,
    cp.slug,
    cp.subtitle,
    cp.emoji,
    cp.intro_paragraph,
    cp.gentle_advice,
    cp.stern_advice,
    cp.adhd_reasons,
    cp.content_sections,
    cp.meta_data,
    cp.is_published,
    cp.sort_order,
    cp.created_at,
    cp.updated_at,
    ct.name as content_type,
    ct.display_name as content_type_display,
    ct.icon as content_type_icon,
    ct.color_scheme as content_type_color
FROM content_pages cp
JOIN content_types ct ON cp.content_type_id = ct.id
WHERE cp.is_published = true;

-- View for content with source counts
CREATE OR REPLACE VIEW content_with_source_counts AS
SELECT 
    cwt.*,
    COALESCE(source_counts.source_count, 0) as source_count,
    COALESCE(source_counts.categories, '{}') as source_categories
FROM content_with_types cwt
LEFT JOIN (
    SELECT 
        cs.content_page_id,
        COUNT(*) as source_count,
        array_agg(DISTINCT cs.category) as categories
    FROM content_sources cs
    GROUP BY cs.content_page_id
) source_counts ON cwt.id = source_counts.content_page_id;

-- View for content with tag information
CREATE OR REPLACE VIEW content_with_tags AS
SELECT 
    cwt.*,
    COALESCE(tag_info.tag_count, 0) as tag_count,
    COALESCE(tag_info.tags, '[]'::jsonb) as tags
FROM content_with_types cwt
LEFT JOIN (
    SELECT 
        ct.content_page_id,
        COUNT(*) as tag_count,
        jsonb_agg(
            jsonb_build_object(
                'id', t.id,
                'name', t.name,
                'category', t.category,
                'emoji', t.emoji,
                'relevance_score', ct.relevance_score
            )
        ) as tags
    FROM content_tags ct
    JOIN unified_tags t ON ct.tag_id = t.id
    GROUP BY ct.content_page_id
) tag_info ON cwt.id = tag_info.content_page_id;

-- Comprehensive view combining everything
CREATE OR REPLACE VIEW content_full AS
SELECT 
    cwsc.*,
    COALESCE(tag_info.tag_count, 0) as tag_count,
    COALESCE(tag_info.tags, '[]'::jsonb) as tags,
    COALESCE(interaction_stats.view_count, 0) as view_count,
    COALESCE(interaction_stats.vote_score, 0) as vote_score,
    COALESCE(interaction_stats.favorite_count, 0) as favorite_count
FROM content_with_source_counts cwsc
LEFT JOIN (
    SELECT 
        ct.content_page_id,
        COUNT(*) as tag_count,
        jsonb_agg(
            jsonb_build_object(
                'id', t.id,
                'name', t.name,
                'category', t.category,
                'emoji', t.emoji,
                'relevance_score', ct.relevance_score
            ) ORDER BY ct.relevance_score DESC, t.name
        ) as tags
    FROM content_tags ct
    JOIN unified_tags t ON ct.tag_id = t.id
    GROUP BY ct.content_page_id
) tag_info ON cwsc.id = tag_info.content_page_id
LEFT JOIN (
    SELECT 
        ui.content_page_id,
        COUNT(*) FILTER (WHERE ui.interaction_type = 'view') as view_count,
        COUNT(*) FILTER (WHERE ui.interaction_type = 'vote_up') - 
        COUNT(*) FILTER (WHERE ui.interaction_type = 'vote_down') as vote_score,
        COUNT(*) FILTER (WHERE ui.interaction_type = 'favorite') as favorite_count
    FROM user_interactions ui
    WHERE ui.content_page_id IS NOT NULL
    GROUP BY ui.content_page_id
) interaction_stats ON cwsc.id = interaction_stats.content_page_id;

-- 3. CREATE HELPFUL INDEXES FOR VIEWS
CREATE INDEX IF NOT EXISTS idx_content_pages_published_type ON content_pages(content_type_id, is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_content_pages_updated ON content_pages(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_sources_multiple ON content_sources(content_page_id, category, relevance_score DESC);

-- 4. UPDATE SORT ORDERS BASED ON CURRENT USAGE
-- Set sort orders based on creation date and name for consistency
UPDATE content_pages SET sort_order = subquery.row_num
FROM (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY content_type_id 
            ORDER BY created_at ASC, name ASC
        ) as row_num
    FROM content_pages
) subquery
WHERE content_pages.id = subquery.id;

-- 5. CLEAN UP FUNCTIONS
DROP FUNCTION IF EXISTS generate_slug(TEXT);
DROP FUNCTION IF EXISTS ensure_unique_slug(TEXT, TEXT);

-- 6. ADD USEFUL CONSTRAINTS AND VALIDATIONS
-- Ensure content_sections follow expected structure
DO $$
BEGIN
    -- Add check that JSONB arrays contain objects with expected fields
    -- This is informational - we don't want to break existing data
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE constraint_name = 'valid_content_sections_structure'
    ) THEN
        -- We'll add this as a soft validation in application code instead
        -- since existing data might not conform perfectly yet
        RAISE NOTICE 'Content sections structure validation will be handled in application layer';
    END IF;
END $$;

-- 7. GRANT APPROPRIATE PERMISSIONS  
-- Update RLS policies to work with new structure
DROP POLICY IF EXISTS "Public read access" ON content_pages;
CREATE POLICY "Public read access" ON content_pages 
    FOR SELECT 
    USING (is_published = true);

-- Allow public read on views (they inherit base table policies)
GRANT SELECT ON content_with_types TO anon, authenticated;
GRANT SELECT ON content_with_source_counts TO anon, authenticated;  
GRANT SELECT ON content_with_tags TO anon, authenticated;
GRANT SELECT ON content_full TO anon, authenticated;

-- Final verification and reporting
DO $$
DECLARE
    content_count INTEGER;
    sources_count INTEGER;
    tags_count INTEGER;
    content_sources_count INTEGER;
    content_tags_count INTEGER;
    feelings_count INTEGER;
    barriers_count INTEGER;
    identities_count INTEGER;
    tasks_count INTEGER;
    complex_loops_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO content_count FROM content_pages;
    SELECT COUNT(*) INTO sources_count FROM sources;
    SELECT COUNT(*) INTO tags_count FROM unified_tags;
    SELECT COUNT(*) INTO content_sources_count FROM content_sources;
    SELECT COUNT(*) INTO content_tags_count FROM content_tags;
    
    SELECT COUNT(*) INTO feelings_count FROM content_with_types WHERE content_type = 'feeling';
    SELECT COUNT(*) INTO barriers_count FROM content_with_types WHERE content_type = 'barrier';
    SELECT COUNT(*) INTO identities_count FROM content_with_types WHERE content_type = 'identity';
    SELECT COUNT(*) INTO tasks_count FROM content_with_types WHERE content_type = 'task';
    SELECT COUNT(*) INTO complex_loops_count FROM content_with_types WHERE content_type = 'complex_loop';
    
    RAISE NOTICE '=== MIGRATION COMPLETE ===';
    RAISE NOTICE 'Unified Schema Summary:';
    RAISE NOTICE '- Total content pages: %', content_count;
    RAISE NOTICE '  * Feelings: %', feelings_count;
    RAISE NOTICE '  * Barriers: %', barriers_count;
    RAISE NOTICE '  * Identities: %', identities_count;
    RAISE NOTICE '  * Tasks: %', tasks_count;
    RAISE NOTICE '  * Complex Loops: %', complex_loops_count;
    RAISE NOTICE '- Total sources: %', sources_count;
    RAISE NOTICE '- Total tags: %', tags_count;
    RAISE NOTICE '- Content-source links: %', content_sources_count;
    RAISE NOTICE '- Content-tag links: %', content_tags_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Views created:';
    RAISE NOTICE '- content_with_types: Basic content with type info';
    RAISE NOTICE '- content_with_source_counts: Content with source statistics';  
    RAISE NOTICE '- content_with_tags: Content with tag information';
    RAISE NOTICE '- content_full: Comprehensive view with all relationships';
    RAISE NOTICE '';
    RAISE NOTICE 'Phase 4 Complete: Schema migration successful!';
    RAISE NOTICE 'Next: Update your application code to use the new unified tables.';
END $$;