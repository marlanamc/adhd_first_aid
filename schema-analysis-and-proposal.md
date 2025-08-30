# ADHD First Aid Kit - Database Schema Analysis & Improvement Proposal

## Current Schema Issues

### 🔴 Critical Issues
1. **Inconsistent ID Types**: Mix of UUID and integer PKs across related tables
2. **Duplicate Content Systems**: Old strategy-based + new content-based systems
3. **Fragmented Source Management**: Multiple source table patterns with no standardization
4. **Empty/Unused Tables**: Several tables with 0 rows taking up space
5. **Inconsistent Naming**: Mix of snake_case and variations

### 🟡 Medium Issues
1. **JSONB Structure Inconsistency**: Some content tables have different JSONB formats
2. **Missing Foreign Key Relationships**: Between content tables and source tables
3. **Redundant Junction Tables**: Many-to-many tables for features not being used
4. **Inconsistent Timestamps**: Mix of `now()`, `timezone('utc', now())`, `CURRENT_TIMESTAMP`

## Proposed Unified Schema

### 🎯 Core Content System
```sql
-- Main content types (unified structure)
CREATE TABLE content_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- 'feeling', 'barrier', 'identity', 'task', 'complex_loop'
    display_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unified content table
CREATE TABLE content_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type_id UUID NOT NULL REFERENCES content_types(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    subtitle TEXT,
    emoji TEXT,
    intro_paragraph TEXT NOT NULL,
    gentle_advice TEXT NOT NULL,
    stern_advice TEXT NOT NULL,
    adhd_reasons TEXT[] DEFAULT '{}',
    content_sections JSONB DEFAULT '[]',
    meta_data JSONB DEFAULT '{}', -- For type-specific fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_type_id, name)
);
```

### 📚 Unified Source Management
```sql
-- Standardized sources
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    authors TEXT,
    description TEXT,
    publication_year INTEGER,
    source_type TEXT, -- 'book', 'article', 'website', 'research', etc.
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content-source relationships
CREATE TABLE content_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_page_id UUID NOT NULL REFERENCES content_pages(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- How this source relates to the content
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_page_id, source_id, category)
);
```

### 🏷️ Simplified Tagging System
```sql
-- Universal tags
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT, -- 'strategy', 'symptom', 'context', etc.
    color TEXT,
    emoji TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content-tag relationships
CREATE TABLE content_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_page_id UUID NOT NULL REFERENCES content_pages(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    relevance_score INTEGER DEFAULT 1, -- 1-5 for filtering
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_page_id, tag_id)
);
```

### 🆘 Crisis & Utility Tables
```sql
-- Keep crisis mode as-is (it's well structured)
-- No changes needed to crisis_mode_feelings

-- User interactions (voting, favorites, etc.)
CREATE TABLE user_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    content_page_id UUID REFERENCES content_pages(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL, -- 'vote_up', 'vote_down', 'favorite', 'view'
    interaction_data JSONB DEFAULT '{}', -- Store additional data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, content_page_id, interaction_type)
);
```

## Migration Strategy

### Phase 1: Create New Structure
1. Create new unified tables
2. Migrate existing content to new format
3. Set up proper indexes and constraints

### Phase 2: Data Migration
1. Migrate feelings_content → content_pages (type: 'feeling')
2. Migrate barriers_content → content_pages (type: 'barrier') 
3. Migrate identities_content → content_pages (type: 'identity')
4. Migrate tasks_content → content_pages (type: 'task')
5. Migrate complex_loops_content → content_pages (type: 'complex_loop')
6. Consolidate all source tables into unified sources system

### Phase 3: Legacy Cleanup
1. Archive old strategy tables (don't delete - keep as backup)
2. Remove empty/unused tables
3. Update application code to use new schema
4. Clean up unused columns

## Benefits of This Approach

### ✅ Consistency
- Single ID type (UUID) throughout
- Standardized naming conventions
- Unified content structure
- Consistent timestamp handling

### ✅ Maintainability  
- Single content table to maintain
- Unified source management
- Simplified relationships
- Easier to add new content types

### ✅ Performance
- Better indexing strategy
- Reduced table count
- Optimized queries
- Less data duplication

### ✅ Flexibility
- JSONB meta_data for type-specific fields
- Extensible tag system
- Easy to add new content types
- Future-proof structure

## Estimated Impact

### 🗂️ Table Reduction
- **Before**: 35+ tables
- **After**: ~10 core tables
- **Reduction**: ~70% fewer tables to maintain

### 📊 Data Consolidation
- All content pages in one table (~130 current records)
- All sources in one table (~1000+ current records)  
- Unified tagging system
- Simplified relationships

### ⚡ Performance Gains
- Single table queries for content
- Better caching opportunities
- Simplified joins
- Optimized indexes

Would you like me to proceed with creating the migration scripts for this new structure?