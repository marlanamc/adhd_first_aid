-- Phase 2: Migrate Existing Content Data
-- Migrates data from old content tables to new unified structure

-- Create backup tables for safety
DO $$
BEGIN
    -- Only create backups if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'migration_backup_feelings_content') THEN
        CREATE TABLE migration_backup_feelings_content AS SELECT * FROM feelings_content;
        CREATE TABLE migration_backup_barriers_content AS SELECT * FROM barriers_content;  
        CREATE TABLE migration_backup_identities_content AS SELECT * FROM identities_content;
        CREATE TABLE migration_backup_tasks_content AS SELECT * FROM tasks_content;
        CREATE TABLE migration_backup_complex_loops_content AS SELECT * FROM complex_loops_content;
        
        RAISE NOTICE 'Backup tables created successfully';
    ELSE
        RAISE NOTICE 'Backup tables already exist, skipping creation';
    END IF;
END $$;

-- Function to generate URL-friendly slugs
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT) 
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(input_text, '[^a-zA-Z0-9\s\-]', '', 'g'), -- Remove special chars
                '\s+', '-', 'g' -- Replace spaces with hyphens
            ),
            '-+', '-', 'g' -- Collapse multiple hyphens
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to ensure unique slugs
CREATE OR REPLACE FUNCTION ensure_unique_slug(base_slug TEXT, content_type_name TEXT)
RETURNS TEXT AS $$
DECLARE
    final_slug TEXT := base_slug;
    counter INTEGER := 1;
BEGIN
    -- Keep trying until we find a unique slug
    WHILE EXISTS (SELECT 1 FROM content_pages cp 
                  JOIN content_types ct ON cp.content_type_id = ct.id 
                  WHERE cp.slug = final_slug) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- 1. MIGRATE FEELINGS CONTENT
INSERT INTO content_pages (
    content_type_id,
    name,
    slug,
    subtitle,
    intro_paragraph,
    gentle_advice,
    stern_advice,
    adhd_reasons,
    content_sections,
    created_at,
    updated_at
)
SELECT 
    ct.id as content_type_id,
    fc.feeling_name as name,
    ensure_unique_slug(generate_slug(fc.feeling_name), 'feeling') as slug,
    fc.subtitle,
    fc.intro_paragraph,
    fc.gentle_advice,
    fc.stern_advice,
    COALESCE(fc.adhd_reasons, '{}') as adhd_reasons,
    COALESCE(fc.step_sections, '[]') as content_sections,
    fc.created_at,
    fc.updated_at
FROM feelings_content fc
CROSS JOIN content_types ct
WHERE ct.name = 'feeling'
ON CONFLICT (slug) DO NOTHING;

-- 2. MIGRATE BARRIERS CONTENT  
INSERT INTO content_pages (
    content_type_id,
    name,
    slug,
    subtitle,
    intro_paragraph,
    gentle_advice,
    stern_advice,
    adhd_reasons,
    content_sections,
    created_at,
    updated_at
)
SELECT 
    ct.id as content_type_id,
    bc.barrier_name as name,
    ensure_unique_slug(generate_slug(bc.barrier_name), 'barrier') as slug,
    bc.subtitle,
    bc.intro_paragraph,
    bc.gentle_advice,
    bc.stern_advice,
    COALESCE(bc.adhd_reasons, '{}') as adhd_reasons,
    COALESCE(bc.step_sections, '[]') as content_sections,
    bc.created_at,
    bc.updated_at
FROM barriers_content bc
CROSS JOIN content_types ct
WHERE ct.name = 'barrier'
ON CONFLICT (slug) DO NOTHING;

-- 3. MIGRATE IDENTITIES CONTENT
INSERT INTO content_pages (
    content_type_id,
    name,
    slug,
    subtitle,
    emoji,
    intro_paragraph,
    gentle_advice,
    stern_advice,
    adhd_reasons,
    content_sections,
    created_at,
    updated_at
)
SELECT 
    ct.id as content_type_id,
    ic.identity_name as name,
    ensure_unique_slug(generate_slug(ic.identity_name), 'identity') as slug,
    ic.subtitle,
    ic.emoji,
    ic.intro_paragraph,
    ic.gentle_advice,
    ic.stern_advice,
    COALESCE(ic.adhd_reasons, '{}') as adhd_reasons,
    COALESCE(ic.content_sections, '[]') as content_sections,
    ic.created_at,
    ic.updated_at
FROM identities_content ic
CROSS JOIN content_types ct
WHERE ct.name = 'identity'
ON CONFLICT (slug) DO NOTHING;

-- 4. MIGRATE TASKS CONTENT
INSERT INTO content_pages (
    content_type_id,
    name,
    slug,
    subtitle,
    intro_paragraph,
    gentle_advice,
    stern_advice,
    adhd_reasons,
    content_sections,
    created_at,
    updated_at
)
SELECT 
    ct.id as content_type_id,
    tc.task_name as name,
    ensure_unique_slug(generate_slug(tc.task_name), 'task') as slug,
    tc.subtitle,
    tc.intro_paragraph,
    tc.gentle_advice,
    tc.stern_advice,
    COALESCE(tc.adhd_reasons, '{}') as adhd_reasons,
    COALESCE(tc.content_sections, '[]') as content_sections,
    tc.created_at,
    tc.updated_at
FROM tasks_content tc
CROSS JOIN content_types ct
WHERE ct.name = 'task'
ON CONFLICT (slug) DO NOTHING;

-- 5. MIGRATE COMPLEX LOOPS CONTENT
INSERT INTO content_pages (
    content_type_id,
    name,
    slug,
    subtitle,
    intro_paragraph,
    gentle_advice,
    stern_advice,
    adhd_reasons,
    content_sections,
    created_at,
    updated_at
)
SELECT 
    ct.id as content_type_id,
    clc.loop_name as name,
    ensure_unique_slug(generate_slug(clc.loop_name), 'complex_loop') as slug,
    clc.subtitle,
    clc.intro_paragraph,
    clc.gentle_advice,
    clc.stern_advice,
    COALESCE(clc.adhd_reasons, '{}') as adhd_reasons,
    COALESCE(clc.content_sections, '[]') as content_sections,
    clc.created_at,
    clc.updated_at
FROM complex_loops_content clc
CROSS JOIN content_types ct
WHERE ct.name = 'complex_loop'
ON CONFLICT (slug) DO NOTHING;

-- Verify migration counts
DO $$
DECLARE
    feelings_count INTEGER;
    barriers_count INTEGER;  
    identities_count INTEGER;
    tasks_count INTEGER;
    complex_loops_count INTEGER;
    total_migrated INTEGER;
BEGIN
    SELECT COUNT(*) INTO feelings_count FROM content_pages cp 
    JOIN content_types ct ON cp.content_type_id = ct.id WHERE ct.name = 'feeling';
    
    SELECT COUNT(*) INTO barriers_count FROM content_pages cp 
    JOIN content_types ct ON cp.content_type_id = ct.id WHERE ct.name = 'barrier';
    
    SELECT COUNT(*) INTO identities_count FROM content_pages cp 
    JOIN content_types ct ON cp.content_type_id = ct.id WHERE ct.name = 'identity';
    
    SELECT COUNT(*) INTO tasks_count FROM content_pages cp 
    JOIN content_types ct ON cp.content_type_id = ct.id WHERE ct.name = 'task';
    
    SELECT COUNT(*) INTO complex_loops_count FROM content_pages cp 
    JOIN content_types ct ON cp.content_type_id = ct.id WHERE ct.name = 'complex_loop';
    
    total_migrated := feelings_count + barriers_count + identities_count + tasks_count + complex_loops_count;
    
    RAISE NOTICE 'Migration Summary:';
    RAISE NOTICE '- Feelings: % pages', feelings_count;
    RAISE NOTICE '- Barriers: % pages', barriers_count;  
    RAISE NOTICE '- Identities: % pages', identities_count;
    RAISE NOTICE '- Tasks: % pages', tasks_count;
    RAISE NOTICE '- Complex Loops: % pages', complex_loops_count;
    RAISE NOTICE '- Total Migrated: % pages', total_migrated;
    RAISE NOTICE 'Phase 2 Complete: Content data migrated successfully!';
END $$;