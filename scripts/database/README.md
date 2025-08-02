# Database Scripts Organization

This folder contains all database setup and content management scripts for the ADHD First Aid Kit application.

## Folder Structure

### `/core-schema/`
**Main database foundation - run these first for new setups**

- `complete-schema.sql` - **PRIMARY SETUP SCRIPT** - Complete database schema with all tables, relationships, and basic data
- `enable-rls.sql` - Row Level Security configuration
- `secure-policies.sql` - Security policies for public access

### `/content-schemas/`
**Content-specific table schemas**

- `feelings_content_schema.sql` - Schema for individual feeling pages content
- `barriers_content_schema.sql` - Schema for individual barrier pages content  
- `_template_content_schema.sql` - **TEMPLATE** - Copy this to create new content schemas

*Future content schemas will be added here for:*
- `tasks_content_schema.sql`
- `identities_content_schema.sql` 
- `complex_loops_content_schema.sql`
- `guides_content_schema.sql`
- `quizzes_content_schema.sql`
- `resources_content_schema.sql`

### `/content-imports/`
**Complete content import scripts**

- `import_all_feelings_content.sql` - All 23 feelings with complete content (intro paragraphs, advice, ADHD reasons, step sections)
- `barriers_content.sql` - All 20 barriers with complete content
- `_template_content_import.sql` - **TEMPLATE** - Copy this to create new content imports

*Future content imports will be added here for:*
- `tasks_content.sql`
- `identities_content.sql`
- `complex_loops_content.sql`
- `guides_content.sql`
- `quizzes_content.sql`
- `resources_content.sql`

### `/archive/`
**Deprecated, partial, or outdated scripts**

Contains old migration scripts, partial updates, and deprecated files that are kept for reference but should not be used in new setups.

## Quick Setup

**🚀 One-Command Complete Setup:**
```sql
-- Run this single script to set up everything
\i setup-complete-database.sql
```

## Manual Setup Order for New Database

1. **Core Setup** (run once for new database):
   ```sql
   -- Run in Supabase SQL editor
   \i core-schema/complete-schema.sql
   \i core-schema/enable-rls.sql
   \i core-schema/secure-policies.sql
   ```

2. **Content Schemas** (run to add content tables):
   ```sql
   \i content-schemas/feelings_content_schema.sql
   \i content-schemas/barriers_content_schema.sql
   ```

3. **Content Import** (run to populate content):
   ```sql
   \i content-imports/import_all_feelings_content.sql
   \i content-imports/barriers_content.sql
   ```

## Content Structure

All content follows a consistent structure:
- **Intro paragraph** - Markdown-formatted introduction with bold text support
- **Gentle advice** - Compassionate, supportive guidance
- **Stern advice** - Direct, action-oriented guidance  
- **ADHD reasons** - Array of ADHD-specific factors that amplify the issue
- **Step sections** - JSON array of 5-step action plans with:
  - Number, emoji, title, intro
  - Try_this array with actionable bullet points
  - Tips for implementation

## Adding New Content Types

When adding new content types (tasks, identities, etc.):

1. Create schema file in `/content-schemas/`
2. Create import script in `/content-imports/`
3. Update this README with the new files
4. Follow the established naming convention and structure

## Database Types

TypeScript types are automatically generated from the database schema and located in:
- `src/types/database.ts` - Main database types
- `src/lib/supabase.ts` - Database functions and type exports

## Notes

- All scripts use proper SQL escaping for apostrophes and quotes
- JSON step sections are properly formatted for direct database insertion
- All content supports markdown bold formatting with `**text**` syntax
- Content is optimized for ADHD-friendly presentation with bullet points and clear structure