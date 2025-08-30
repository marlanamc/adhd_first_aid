-- Fix: Create missing tables from migration 001
-- Run this to complete the schema setup before running migration 003

-- Create sources table (was missing from first migration)
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

-- Create content_sources table
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

-- Create unified_tags table
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

-- Create content_tags table
CREATE TABLE IF NOT EXISTS content_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_page_id UUID NOT NULL REFERENCES content_pages(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES unified_tags(id) ON DELETE CASCADE,
    relevance_score INTEGER DEFAULT 3 CHECK (relevance_score >= 1 AND relevance_score <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_content_tag UNIQUE(content_page_id, tag_id)
);

-- Create user_interactions table
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

-- Create indexes
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

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sources_updated_at 
    BEFORE UPDATE ON sources 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unified_tags_updated_at 
    BEFORE UPDATE ON unified_tags 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access" ON sources FOR SELECT USING (true);
CREATE POLICY "Public read access" ON content_sources FOR SELECT USING (true);
CREATE POLICY "Public read access" ON unified_tags FOR SELECT USING (true);
CREATE POLICY "Public read access" ON content_tags FOR SELECT USING (true);
CREATE POLICY "Public interactions" ON user_interactions FOR ALL USING (true);

-- Verify creation
DO $$
DECLARE
    missing_tables TEXT[] := '{}';
    tbl_name TEXT;
BEGIN
    -- Check for all required tables
    FOREACH tbl_name IN ARRAY ARRAY['sources', 'content_sources', 'unified_tags', 'content_tags', 'user_interactions'] LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl_name AND table_schema = 'public') THEN
            missing_tables := missing_tables || tbl_name;
        END IF;
    END LOOP;
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE EXCEPTION 'Failed to create tables: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE 'SUCCESS: All missing tables created successfully!';
        RAISE NOTICE 'Tables ready:';
        RAISE NOTICE '- sources: ready for migration data';
        RAISE NOTICE '- content_sources: ready for relationships';
        RAISE NOTICE '- unified_tags: ready for tag migration';
        RAISE NOTICE '- content_tags: ready for tag relationships';
        RAISE NOTICE '- user_interactions: ready for user tracking';
        RAISE NOTICE '';
        RAISE NOTICE 'Now you can run migration 003 (migrate_sources_data.sql)';
    END IF;
END $$;