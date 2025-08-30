-- Phase 3: Migrate Sources Data  
-- Consolidates all source tables into unified sources system

-- Create backup tables for source data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'migration_backup_feeling_sources') THEN
        CREATE TABLE migration_backup_feeling_sources AS SELECT * FROM feeling_sources;
        CREATE TABLE migration_backup_barrier_sources AS SELECT * FROM barrier_sources;
        CREATE TABLE migration_backup_identity_sources AS SELECT * FROM identity_sources;
        CREATE TABLE migration_backup_life_areas_sources AS SELECT * FROM life_areas_sources;
        CREATE TABLE migration_backup_complex_loop_sources AS SELECT * FROM complex_loop_sources;
        
        -- Also backup standardized sources if they exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'standardized_sources') THEN
            CREATE TABLE migration_backup_standardized_sources AS SELECT * FROM standardized_sources;
            CREATE TABLE migration_backup_feeling_standardized_sources AS SELECT * FROM feeling_standardized_sources;
            CREATE TABLE migration_backup_barrier_standardized_sources AS SELECT * FROM barrier_standardized_sources;
        END IF;
        
        RAISE NOTICE 'Source backup tables created successfully';
    ELSE
        RAISE NOTICE 'Source backup tables already exist, skipping creation';
    END IF;
END $$;

-- Function to normalize source titles for duplicate detection
CREATE OR REPLACE FUNCTION normalize_source_title(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(trim(regexp_replace(title, '\s+', ' ', 'g')));
END;
$$ LANGUAGE plpgsql;

-- Function to extract publication year from text
CREATE OR REPLACE FUNCTION extract_year(text_input TEXT)
RETURNS INTEGER AS $$
BEGIN
    -- Look for 4-digit year pattern
    RETURN (regexp_matches(text_input, '\b(19|20)\d{2}\b'))[1]::INTEGER;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 1. MIGRATE FROM STANDARDIZED_SOURCES (if exists)
-- This gives us the cleanest, deduplicated sources first
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'standardized_sources') THEN
        INSERT INTO sources (
            title,
            authors,
            description,
            publication_year,
            source_type,
            created_at,
            updated_at
        )
        SELECT 
            title,
            authors,
            description,
            extract_year(COALESCE(description, title, '')),
            CASE 
                WHEN title ILIKE '%research%' OR title ILIKE '%study%' OR title ILIKE '%journal%' THEN 'research'
                WHEN title ILIKE '%book%' OR authors IS NOT NULL AND length(authors) > 10 THEN 'book'
                WHEN title ILIKE '%article%' OR title ILIKE '%blog%' THEN 'article'
                WHEN title ILIKE '%website%' OR title ILIKE '%site%' THEN 'website'
                ELSE 'other'
            END as source_type,
            created_at,
            updated_at
        FROM standardized_sources
        ON CONFLICT (title, authors, publication_year) DO NOTHING;
        
        RAISE NOTICE 'Migrated standardized sources';
    END IF;
END $$;

-- 2. MIGRATE INDIVIDUAL SOURCE TABLES
-- Migrate feeling sources
INSERT INTO sources (title, authors, description, publication_year, source_type)
SELECT DISTINCT
    title,
    authors,
    description,
    extract_year(COALESCE(description, title, '')),
    CASE 
        WHEN title ILIKE '%research%' OR title ILIKE '%study%' THEN 'research'
        WHEN title ILIKE '%book%' THEN 'book' 
        WHEN title ILIKE '%article%' THEN 'article'
        WHEN title ILIKE '%website%' OR title ILIKE '%blog%' THEN 'website'
        ELSE 'other'
    END
FROM feeling_sources
WHERE title IS NOT NULL AND trim(title) != ''
ON CONFLICT (title, authors, publication_year) DO NOTHING;

-- Migrate barrier sources  
INSERT INTO sources (title, authors, description, publication_year, source_type)
SELECT DISTINCT
    title,
    authors,
    description,
    extract_year(COALESCE(description, title, '')),
    CASE 
        WHEN title ILIKE '%research%' OR title ILIKE '%study%' THEN 'research'
        WHEN title ILIKE '%book%' THEN 'book'
        WHEN title ILIKE '%article%' THEN 'article' 
        WHEN title ILIKE '%website%' OR title ILIKE '%blog%' THEN 'website'
        ELSE 'other'
    END
FROM barrier_sources
WHERE title IS NOT NULL AND trim(title) != ''
ON CONFLICT (title, authors, publication_year) DO NOTHING;

-- Migrate identity sources
INSERT INTO sources (title, authors, description, publication_year, source_type)
SELECT DISTINCT
    title,
    authors,
    description,
    extract_year(COALESCE(description, title, '')),
    CASE 
        WHEN title ILIKE '%research%' OR title ILIKE '%study%' THEN 'research'
        WHEN title ILIKE '%book%' THEN 'book'
        WHEN title ILIKE '%article%' THEN 'article'
        WHEN title ILIKE '%website%' OR title ILIKE '%blog%' THEN 'website'
        ELSE 'other'
    END
FROM identity_sources
WHERE title IS NOT NULL AND trim(title) != ''
ON CONFLICT (title, authors, publication_year) DO NOTHING;

-- Migrate life areas sources  
INSERT INTO sources (title, authors, description, publication_year, source_type)
SELECT DISTINCT
    title,
    authors,
    description,
    extract_year(COALESCE(description, title, '')),
    CASE 
        WHEN title ILIKE '%research%' OR title ILIKE '%study%' THEN 'research'
        WHEN title ILIKE '%book%' THEN 'book'
        WHEN title ILIKE '%article%' THEN 'article'
        WHEN title ILIKE '%website%' OR title ILIKE '%blog%' THEN 'website'
        ELSE 'other'
    END
FROM life_areas_sources
WHERE title IS NOT NULL AND trim(title) != ''
ON CONFLICT (title, authors, publication_year) DO NOTHING;

-- Migrate complex loop sources
INSERT INTO sources (title, authors, description, publication_year, source_type)
SELECT DISTINCT
    title,
    authors,
    description,
    extract_year(COALESCE(description, title, '')),
    CASE 
        WHEN title ILIKE '%research%' OR title ILIKE '%study%' THEN 'research'
        WHEN title ILIKE '%book%' THEN 'book'
        WHEN title ILIKE '%article%' THEN 'article'
        WHEN title ILIKE '%website%' OR title ILIKE '%blog%' THEN 'website'
        ELSE 'other'
    END
FROM complex_loop_sources
WHERE title IS NOT NULL AND trim(title) != ''
ON CONFLICT (title, authors, publication_year) DO NOTHING;

-- 3. CREATE CONTENT-SOURCE RELATIONSHIPS
-- Helper function to find matching content page by slug patterns
CREATE OR REPLACE FUNCTION find_content_page_id(slug_pattern TEXT, content_type_name TEXT)
RETURNS UUID AS $$
DECLARE
    page_id UUID;
BEGIN
    SELECT cp.id INTO page_id
    FROM content_pages cp
    JOIN content_types ct ON cp.content_type_id = ct.id
    WHERE ct.name = content_type_name 
    AND (cp.slug = slug_pattern 
         OR cp.slug = generate_slug(slug_pattern)
         OR cp.name ILIKE '%' || replace(slug_pattern, '-', ' ') || '%');
    
    RETURN page_id;
END;
$$ LANGUAGE plpgsql;

-- Link feeling sources
INSERT INTO content_sources (content_page_id, source_id, category, relevance_score)
SELECT DISTINCT
    find_content_page_id(fs.feeling_slug, 'feeling') as content_page_id,
    s.id as source_id,
    COALESCE(fs.category, 'Reference') as category,
    3 as relevance_score -- Default middle score
FROM feeling_sources fs
JOIN sources s ON (
    normalize_source_title(s.title) = normalize_source_title(fs.title)
    AND COALESCE(s.authors, '') = COALESCE(fs.authors, '')
)
WHERE find_content_page_id(fs.feeling_slug, 'feeling') IS NOT NULL
ON CONFLICT (content_page_id, source_id, category) DO NOTHING;

-- Link barrier sources
INSERT INTO content_sources (content_page_id, source_id, category, relevance_score)
SELECT DISTINCT
    find_content_page_id(bs.barrier_slug, 'barrier') as content_page_id,
    s.id as source_id,
    COALESCE(bs.category, 'Reference') as category,
    3 as relevance_score
FROM barrier_sources bs
JOIN sources s ON (
    normalize_source_title(s.title) = normalize_source_title(bs.title)
    AND COALESCE(s.authors, '') = COALESCE(bs.authors, '')
)
WHERE find_content_page_id(bs.barrier_slug, 'barrier') IS NOT NULL
ON CONFLICT (content_page_id, source_id, category) DO NOTHING;

-- Link identity sources
INSERT INTO content_sources (content_page_id, source_id, category, relevance_score)
SELECT DISTINCT
    find_content_page_id(is_table.identity_slug, 'identity') as content_page_id,
    s.id as source_id,
    COALESCE(is_table.category, 'Reference') as category,
    3 as relevance_score
FROM identity_sources is_table
JOIN sources s ON (
    normalize_source_title(s.title) = normalize_source_title(is_table.title)
    AND COALESCE(s.authors, '') = COALESCE(is_table.authors, '')
)
WHERE find_content_page_id(is_table.identity_slug, 'identity') IS NOT NULL
ON CONFLICT (content_page_id, source_id, category) DO NOTHING;

-- Link life areas sources (we'll need to create life_area content type first)
-- This will be handled in a separate migration if needed

-- Link complex loop sources
INSERT INTO content_sources (content_page_id, source_id, category, relevance_score)
SELECT DISTINCT
    find_content_page_id(cls.loop_slug, 'complex_loop') as content_page_id,
    s.id as source_id,
    COALESCE(cls.category, 'Reference') as category,
    3 as relevance_score
FROM complex_loop_sources cls
JOIN sources s ON (
    normalize_source_title(s.title) = normalize_source_title(cls.title)
    AND COALESCE(s.authors, '') = COALESCE(cls.authors, '')
)
WHERE find_content_page_id(cls.loop_slug, 'complex_loop') IS NOT NULL
ON CONFLICT (content_page_id, source_id, category) DO NOTHING;

-- Clean up helper functions
DROP FUNCTION IF EXISTS normalize_source_title(TEXT);
DROP FUNCTION IF EXISTS extract_year(TEXT);
DROP FUNCTION IF EXISTS find_content_page_id(TEXT, TEXT);

-- Report migration results
DO $$
DECLARE
    sources_count INTEGER;
    content_sources_count INTEGER;
    feelings_sources INTEGER;
    barriers_sources INTEGER;
    identities_sources INTEGER;
    complex_loops_sources INTEGER;
BEGIN
    SELECT COUNT(*) INTO sources_count FROM sources;
    SELECT COUNT(*) INTO content_sources_count FROM content_sources;
    
    SELECT COUNT(*) INTO feelings_sources FROM content_sources cs
    JOIN content_pages cp ON cs.content_page_id = cp.id
    JOIN content_types ct ON cp.content_type_id = ct.id
    WHERE ct.name = 'feeling';
    
    SELECT COUNT(*) INTO barriers_sources FROM content_sources cs
    JOIN content_pages cp ON cs.content_page_id = cp.id
    JOIN content_types ct ON cp.content_type_id = ct.id
    WHERE ct.name = 'barrier';
    
    SELECT COUNT(*) INTO identities_sources FROM content_sources cs
    JOIN content_pages cp ON cs.content_page_id = cp.id
    JOIN content_types ct ON cp.content_type_id = ct.id
    WHERE ct.name = 'identity';
    
    SELECT COUNT(*) INTO complex_loops_sources FROM content_sources cs
    JOIN content_pages cp ON cs.content_page_id = cp.id
    JOIN content_types ct ON cp.content_type_id = ct.id
    WHERE ct.name = 'complex_loop';
    
    RAISE NOTICE 'Sources Migration Summary:';
    RAISE NOTICE '- Total unified sources: %', sources_count;
    RAISE NOTICE '- Total content-source links: %', content_sources_count;
    RAISE NOTICE '- Feelings sources: %', feelings_sources;
    RAISE NOTICE '- Barriers sources: %', barriers_sources;
    RAISE NOTICE '- Identities sources: %', identities_sources;
    RAISE NOTICE '- Complex loops sources: %', complex_loops_sources;
    RAISE NOTICE 'Phase 3 Complete: Sources data migrated successfully!';
END $$;