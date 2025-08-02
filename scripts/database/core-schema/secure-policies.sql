-- ==========================
-- SECURE RLS POLICIES FOR ADHD FIRST AID KIT
-- ==========================
-- This script replaces overly permissive policies with secure ones
-- Run this in your Supabase SQL editor

-- ==========================
-- DROP EXISTING INSECURE POLICIES
-- ==========================

-- Drop all public insert policies (too permissive)
DROP POLICY IF EXISTS "Public insert access" ON strategies;
DROP POLICY IF EXISTS "Public insert access" ON feelings;
DROP POLICY IF EXISTS "Public insert access" ON issues;
DROP POLICY IF EXISTS "Public insert access" ON barriers;
DROP POLICY IF EXISTS "Public insert access" ON help_tasks;
DROP POLICY IF EXISTS "Public insert access" ON tags;
DROP POLICY IF EXISTS "Public insert access" ON life_roles;
DROP POLICY IF EXISTS "Public insert access" ON solution_types;
DROP POLICY IF EXISTS "Public insert access" ON styles;
DROP POLICY IF EXISTS "Public insert access" ON why_does_this_work;
DROP POLICY IF EXISTS "Public insert access" ON strategy_feelings;
DROP POLICY IF EXISTS "Public insert access" ON strategy_issues;
DROP POLICY IF EXISTS "Public insert access" ON strategy_barriers;
DROP POLICY IF EXISTS "Public insert access" ON strategy_help_tasks;
DROP POLICY IF EXISTS "Public insert access" ON strategy_tags;
DROP POLICY IF EXISTS "Public insert access" ON strategy_life_roles;
DROP POLICY IF EXISTS "Public insert access" ON strategy_solution_types;
DROP POLICY IF EXISTS "Public insert access" ON strategy_styles;
DROP POLICY IF EXISTS "Public insert access" ON strategy_why_does_this_work;

-- ==========================
-- SECURE POLICIES - READ ONLY FOR MOST TABLES
-- ==========================

-- Core data should be read-only for public
-- (Keep existing read policies - they're secure)

-- ==========================
-- VOTING SYSTEM - CONTROLLED WRITE ACCESS
-- ==========================

-- Strategy votes: Allow anonymous users to vote (this is the only write access needed)
-- Keep existing vote policies as they're appropriately restricted

-- ==========================
-- ADMIN-ONLY WRITE ACCESS (Optional Future Enhancement)
-- ==========================

-- If you want admin access later, you can add authenticated policies:
-- CREATE POLICY "Admin write access" ON strategies 
-- FOR ALL USING (auth.role() = 'authenticated' AND auth.email() = 'your-admin-email@example.com');

-- ==========================
-- VERIFICATION
-- ==========================

-- Check that only read and vote policies remain
SELECT 
    tablename, 
    policyname, 
    cmd,
    permissive,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Expected result: Only SELECT policies on data tables, and vote policies on strategy_votes