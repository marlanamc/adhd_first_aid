-- Phase 1: Create Unified Schema Structure
-- Creates the new unified tables for content management

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
    meta_data JSONB NOT NULL DEFAULT '{}', -- For type-specific fields
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure unique names within each content type
    CONSTRAINT unique_content_name_per_type UNIQUE(content_type_id, name),
    
    -- Validate JSONB structures
    CONSTRAINT valid_content_sections CHECK (jsonb_typeof(content_sections) = 'array'),
    CONSTRAINT valid_meta_data CHECK (jsonb_typeof(meta_data) = 'object'),
    
    -- Validate slug format (URL-friendly)
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$' AND slug NOT LIKE '-%' AND slug NOT LIKE '%-')
);

-- Unified sources table
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    authors TEXT,
    description TEXT,
    publication_year INTEGER CHECK (publication_year > 1900 AND publication_year <= EXTRACT(YEAR FROM NOW()) + 5),
    source_type TEXT DEFAULT 'other' CHECK (source_type IN ('book', 'article', 'website', 'research', 'blog', 'video', 'podcast', 'other')),
    url TEXT,
    isbn TEXT,
    doi TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure we don't have exact duplicates
    CONSTRAINT unique_source UNIQUE(title, authors, publication_year)
);

-- Content-source relationships
CREATE TABLE IF NOT EXISTS content_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_page_id UUID NOT NULL REFERENCES content_pages(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- How this source relates to the content
    relevance_score INTEGER DEFAULT 1 CHECK (relevance_score >= 1 AND relevance_score <= 5),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_content_source_category UNIQUE(content_page_id, source_id, category)
);

-- Unified tags table (will be populated from existing tags)
CREATE TABLE IF NOT EXISTS unified_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT, -- 'strategy', 'symptom', 'context', 'tool', etc.
    color TEXT,
    emoji TEXT,
    description TEXT,
    usage_count INTEGER NOT NULL DEFAULT 0, -- Denormalized for performance
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_tag_name CHECK (trim(name) != '' AND length(name) <= 100)
);

-- Content-tag relationships  
CREATE TABLE IF NOT EXISTS content_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_page_id UUID NOT NULL REFERENCES content_pages(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES unified_tags(id) ON DELETE CASCADE,
    relevance_score INTEGER DEFAULT 3 CHECK (relevance_score >= 1 AND relevance_score <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_content_tag UNIQUE(content_page_id, tag_id)
);

-- User interactions (votes, favorites, views)
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    content_page_id UUID REFERENCES content_pages(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('vote_up', 'vote_down', 'favorite', 'view', 'share')),
    interaction_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Allow only one interaction of each type per session per content
    CONSTRAINT unique_interaction UNIQUE(session_id, content_page_id, interaction_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_pages_content_type ON content_pages(content_type_id);
CREATE INDEX IF NOT EXISTS idx_content_pages_slug ON content_pages(slug);
CREATE INDEX IF NOT EXISTS idx_content_pages_published ON content_pages(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_content_pages_sort ON content_pages(content_type_id, sort_order, name);

CREATE INDEX IF NOT EXISTS idx_content_sources_content ON content_sources(content_page_id);
CREATE INDEX IF NOT EXISTS idx_content_sources_source ON content_sources(source_id);
CREATE INDEX IF NOT EXISTS idx_content_sources_category ON content_sources(category);

CREATE INDEX IF NOT EXISTS idx_content_tags_content ON content_tags(content_page_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_tag ON content_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_relevance ON content_tags(relevance_score) WHERE relevance_score >= 4;

CREATE INDEX IF NOT EXISTS idx_unified_tags_category ON unified_tags(category);
CREATE INDEX IF NOT EXISTS idx_unified_tags_usage ON unified_tags(usage_count DESC);

CREATE INDEX IF NOT EXISTS idx_user_interactions_session ON user_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_content ON user_interactions(content_page_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created ON user_interactions(created_at);

-- Create updated_at triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_content_types_updated_at 
    BEFORE UPDATE ON content_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_pages_updated_at 
    BEFORE UPDATE ON content_pages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sources_updated_at 
    BEFORE UPDATE ON sources 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unified_tags_updated_at 
    BEFORE UPDATE ON unified_tags 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on new tables (matching existing pattern)
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;  
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies for public read access
-- (You can tighten these later based on your needs)
CREATE POLICY "Public read access" ON content_types FOR SELECT USING (true);
CREATE POLICY "Public read access" ON content_pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access" ON sources FOR SELECT USING (true);
CREATE POLICY "Public read access" ON content_sources FOR SELECT USING (true);
CREATE POLICY "Public read access" ON unified_tags FOR SELECT USING (true);
CREATE POLICY "Public read access" ON content_tags FOR SELECT USING (true);
CREATE POLICY "Public interactions" ON user_interactions FOR ALL USING (true);

-- Add helpful comments
COMMENT ON TABLE content_types IS 'Lookup table for different types of content (feelings, barriers, etc.)';
COMMENT ON TABLE content_pages IS 'Unified table for all ADHD content pages with consistent structure';
COMMENT ON TABLE sources IS 'Unified sources/references table for all content types';
COMMENT ON TABLE content_sources IS 'Many-to-many relationship between content pages and their sources';
COMMENT ON TABLE tags IS 'Unified tagging system for all content types';
COMMENT ON TABLE content_tags IS 'Many-to-many relationship between content pages and tags';
COMMENT ON TABLE user_interactions IS 'User interactions like votes, favorites, and views';

COMMENT ON COLUMN content_pages.slug IS 'URL-friendly identifier, must be unique across all content types';
COMMENT ON COLUMN content_pages.content_sections IS 'JSONB array of content sections with consistent structure';
COMMENT ON COLUMN content_pages.meta_data IS 'JSONB object for storing type-specific additional data';
COMMENT ON COLUMN content_sources.category IS 'How the source relates to content (e.g., "Research", "Book", "Article")';
COMMENT ON COLUMN content_sources.relevance_score IS 'Score 1-5 indicating how relevant this source is to the content';

-- Log successful completion
DO $$
BEGIN
    RAISE NOTICE 'Phase 1 Complete: Unified schema structure created successfully!';
    RAISE NOTICE 'Next step: Run Phase 2 migration to transfer existing data.';
END $$;