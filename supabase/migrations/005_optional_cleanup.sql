-- Phase 5: Optional Cleanup (Run this AFTER confirming everything works)
-- This script removes old tables and consolidates the schema
-- WARNING: Only run this after your application is updated and working with new schema!

-- This migration is commented out by default for safety
-- Uncomment the sections you want to run after thorough testing

/*
-- STEP 1: Rename old content tables (don't delete yet - keep as archives)
DO $$
BEGIN
    -- Only rename if new system is working
    IF EXISTS (SELECT 1 FROM content_pages LIMIT 1) THEN
        
        -- Rename old content tables to archive_*
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'feelings_content') THEN
            ALTER TABLE feelings_content RENAME TO archive_feelings_content;
            RAISE NOTICE 'Archived feelings_content';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'barriers_content') THEN
            ALTER TABLE barriers_content RENAME TO archive_barriers_content;
            RAISE NOTICE 'Archived barriers_content';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'identities_content') THEN
            ALTER TABLE identities_content RENAME TO archive_identities_content;
            RAISE NOTICE 'Archived identities_content';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tasks_content') THEN
            ALTER TABLE tasks_content RENAME TO archive_tasks_content;
            RAISE NOTICE 'Archived tasks_content';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'complex_loops_content') THEN
            ALTER TABLE complex_loops_content RENAME TO archive_complex_loops_content;
            RAISE NOTICE 'Archived complex_loops_content';
        END IF;
        
        RAISE NOTICE 'Old content tables archived successfully';
    ELSE
        RAISE NOTICE 'New content_pages table is empty - skipping archive step';
    END IF;
END $$;

-- STEP 2: Archive old source tables  
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM sources LIMIT 1) THEN
        
        -- Archive source tables
        ALTER TABLE feeling_sources RENAME TO archive_feeling_sources;
        ALTER TABLE barrier_sources RENAME TO archive_barrier_sources;
        ALTER TABLE identity_sources RENAME TO archive_identity_sources;
        ALTER TABLE life_areas_sources RENAME TO archive_life_areas_sources;
        ALTER TABLE complex_loop_sources RENAME TO archive_complex_loop_sources;
        
        -- Archive standardized source tables if they exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'standardized_sources') THEN
            ALTER TABLE standardized_sources RENAME TO archive_standardized_sources;
            ALTER TABLE feeling_standardized_sources RENAME TO archive_feeling_standardized_sources;
            ALTER TABLE barrier_standardized_sources RENAME TO archive_barrier_standardized_sources;
        END IF;
        
        RAISE NOTICE 'Old source tables archived successfully';
    ELSE
        RAISE NOTICE 'New sources table is empty - skipping source archive';
    END IF;
END $$;

-- STEP 3: Clean up empty/unused strategy tables
-- These tables have 0 rows and were part of the old system
DO $$
DECLARE
    table_name TEXT;
    empty_tables TEXT[] := ARRAY[
        'life_roles',
        'solution_types', 
        'styles',
        'strategy_life_roles',
        'strategy_solution_types',
        'strategy_styles'
    ];
BEGIN
    FOREACH table_name IN ARRAY empty_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name) THEN
            EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', table_name);
            RAISE NOTICE 'Dropped empty table: %', table_name;
        END IF;
    END LOOP;
END $$;

-- STEP 4: Archive strategy system (keep for now, might be useful)
-- Uncomment this section only if you're sure you won't need the strategy system
/*
DO $$
DECLARE 
    strategy_tables TEXT[] := ARRAY[
        'strategies',
        'feelings', 
        'issues',
        'barriers',
        'help_tasks',
        'tags', -- This is the old tags, new one has different structure
        'why_does_this_work',
        'strategy_feelings',
        'strategy_issues', 
        'strategy_barriers',
        'strategy_help_tasks',
        'strategy_tags',
        'strategy_why_does_this_work',
        'strategy_votes'
    ];
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY strategy_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name) THEN
            EXECUTE format('ALTER TABLE %I RENAME TO archive_%I', table_name, table_name);
            RAISE NOTICE 'Archived strategy table: %', table_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Strategy system archived - can be restored if needed';
END $$;
*/

-- STEP 5: Update sequences and reset auto-increment values
-- Reset sequences for clean numbering going forward
DO $$
DECLARE
    seq_name TEXT;
BEGIN
    -- Find and reset sequences for old content tables (now archived)
    FOR seq_name IN 
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_name LIKE '%content_id_seq'
    LOOP
        EXECUTE format('DROP SEQUENCE IF EXISTS %I CASCADE', seq_name);
        RAISE NOTICE 'Cleaned up sequence: %', seq_name;
    END LOOP;
END $$;

-- STEP 6: Vacuum and analyze for performance
VACUUM ANALYZE content_pages;
VACUUM ANALYZE sources;
VACUUM ANALYZE content_sources;
VACUUM ANALYZE tags;
VACUUM ANALYZE content_tags;
VACUUM ANALYZE user_interactions;

-- STEP 7: Final verification
DO $$
DECLARE
    total_tables INTEGER;
    archive_tables INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_tables 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name NOT LIKE 'migration_backup_%'
    AND table_name NOT LIKE 'archive_%';
    
    SELECT COUNT(*) INTO archive_tables
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'archive_%';
    
    RAISE NOTICE '=== CLEANUP COMPLETE ===';
    RAISE NOTICE 'Active tables: %', total_tables;
    RAISE NOTICE 'Archived tables: %', archive_tables;
    RAISE NOTICE '';
    RAISE NOTICE 'Schema cleanup completed successfully!';
    RAISE NOTICE 'Your database is now using the unified schema.';
    RAISE NOTICE '';
    RAISE NOTICE 'Archived tables are kept for safety and can be dropped later if needed.';
END $$;

*/

-- For now, just create a summary of what would be cleaned up
DO $$
DECLARE
    old_content_tables TEXT[] := ARRAY[
        'feelings_content',
        'barriers_content', 
        'identities_content',
        'tasks_content',
        'complex_loops_content'
    ];
    old_source_tables TEXT[] := ARRAY[
        'feeling_sources',
        'barrier_sources',
        'identity_sources', 
        'life_areas_sources',
        'complex_loop_sources'
    ];
    table_count INTEGER := 0;
    table_name TEXT;
BEGIN
    RAISE NOTICE '=== CLEANUP SUMMARY ===';
    RAISE NOTICE 'Phase 5 is COMMENTED OUT for safety.';
    RAISE NOTICE 'Uncomment sections in 005_optional_cleanup.sql after testing.';
    RAISE NOTICE '';
    RAISE NOTICE 'Tables that would be archived:';
    
    FOREACH table_name IN ARRAY old_content_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name) THEN
            RAISE NOTICE '- % (content)', table_name;
            table_count := table_count + 1;
        END IF;
    END LOOP;
    
    FOREACH table_name IN ARRAY old_source_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name) THEN
            RAISE NOTICE '- % (sources)', table_name;  
            table_count := table_count + 1;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Total tables ready for archival: %', table_count;
    RAISE NOTICE 'These will be renamed to archive_* (not deleted) for safety.';
END $$;