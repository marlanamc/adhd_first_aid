-- Test Migration: Create Unified Schema (Fixed Version)
-- Run this first to test the basic structure

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Content types lookup table
CREATE TABLE IF NOT EXISTS content_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE CHECK (name ~ '^[a-z_]+$'), -- snake_case only
    display_name TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- Lucide icon name
    color_scheme TEXT, -- For UI theming
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the content types we currently support
INSERT INTO content_types (name, display_name, description, icon, color_scheme) VALUES
('feeling', 'Feelings', 'Emotional states and responses', 'heart', 'pink'),
('barrier', 'Barriers', 'Obstacles and challenges', 'shield-alert', 'orange'),
('identity', 'Identities', 'Life roles and identities', 'user', 'purple'),
('task', 'Tasks', 'Life tasks and activities', 'check-square', 'blue'),
('complex_loop', 'Complex Loops', 'Behavioral patterns and cycles', 'refresh-cw', 'indigo'),
('life_area', 'Life Areas', 'Areas of daily life', 'home', 'green')
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    color_scheme = EXCLUDED.color_scheme,
    updated_at = NOW();

-- Main unified content table
CREATE TABLE IF NOT EXISTS content_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type_id UUID NOT NULL REFERENCES content_types(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    subtitle TEXT,
    emoji TEXT,
    intro_paragraph TEXT NOT NULL,
    gentle_advice TEXT NOT NULL,
    stern_advice TEXT NOT NULL,
    adhd_reasons TEXT[] NOT NULL DEFAULT '{}',
    content_sections JSONB NOT NULL DEFAULT '[]',
    meta_data JSONB NOT NULL DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_content_name_per_type UNIQUE(content_type_id, name),
    CONSTRAINT valid_content_sections CHECK (jsonb_typeof(content_sections) = 'array'),
    CONSTRAINT valid_meta_data CHECK (jsonb_typeof(meta_data) = 'object'),
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$' AND slug NOT LIKE '-%' AND slug NOT LIKE '%-')
);

-- Simple test view
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

-- Enable RLS
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies for public read access
CREATE POLICY "Public read access" ON content_types FOR SELECT USING (true);
CREATE POLICY "Public read access" ON content_pages FOR SELECT USING (is_published = true);

-- Test that everything was created successfully
DO $$
BEGIN
    RAISE NOTICE '=== TEST MIGRATION COMPLETE ===';
    RAISE NOTICE 'Created tables:';
    RAISE NOTICE '- content_types: % rows', (SELECT COUNT(*) FROM content_types);
    RAISE NOTICE '- content_pages: ready for data migration';
    RAISE NOTICE '- content_with_types view: created successfully';
    RAISE NOTICE '';
    RAISE NOTICE 'This is a TEST migration. If successful, run the full migration scripts.';
END $$;