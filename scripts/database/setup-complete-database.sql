-- =================================================================
-- ADHD First Aid Kit - Complete Database Setup Script
-- =================================================================
-- This script sets up the entire database from scratch
-- Run this in your Supabase SQL editor for a fresh setup
-- 
-- Note: This will create all tables and import all content
-- =================================================================

-- Display setup progress
SELECT 'Starting ADHD First Aid Kit database setup...' as status;

-- =================================================================
-- STEP 1: Core Database Schema
-- =================================================================
SELECT 'Setting up core database schema...' as status;

-- Run core schema setup
\i core-schema/complete-schema.sql

-- =================================================================
-- STEP 2: Security and RLS
-- =================================================================
SELECT 'Configuring security and Row Level Security...' as status;

-- Enable RLS and set up policies
\i core-schema/enable-rls.sql
\i core-schema/secure-policies.sql

-- =================================================================
-- STEP 3: Content Table Schemas
-- =================================================================
SELECT 'Creating content-specific table schemas...' as status;

-- Create content tables
\i content-schemas/feelings_content_schema.sql
\i content-schemas/barriers_content_schema.sql

-- =================================================================
-- STEP 4: Import All Content
-- =================================================================
SELECT 'Importing all content data...' as status;

-- Import feelings content (23 feelings with complete guidance)
\i content-imports/import_all_feelings_content.sql

-- Import barriers content (20 barriers with complete guidance)  
\i content-imports/barriers_content.sql

-- =================================================================
-- STEP 5: Verify Setup
-- =================================================================
SELECT 'Verifying database setup...' as status;

-- Check core tables
SELECT 'Core strategies table:' as table_name, COUNT(*) as record_count FROM strategies
UNION ALL
SELECT 'Feelings table:' as table_name, COUNT(*) as record_count FROM feelings
UNION ALL
SELECT 'Barriers table:' as table_name, COUNT(*) as record_count FROM barriers
UNION ALL
SELECT 'Help tasks table:' as table_name, COUNT(*) as record_count FROM help_tasks
UNION ALL
SELECT 'Tags table:' as table_name, COUNT(*) as record_count FROM tags;

-- Check content tables
SELECT 'Content tables:' as section, 
       'Feelings content:' as table_name, COUNT(*) as record_count FROM feelings_content
UNION ALL
SELECT 'Content tables:' as section,
       'Barriers content:' as table_name, COUNT(*) as record_count FROM barriers_content;

-- =================================================================
-- Setup Complete!
-- =================================================================
SELECT 'Database setup complete! ✅' as status;
SELECT 'Your ADHD First Aid Kit database is ready to use.' as message;