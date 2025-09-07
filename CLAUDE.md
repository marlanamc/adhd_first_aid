# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Context
- **Supabase Project Status**: The Supabase project can be paused/unpaused. If database connectivity fails, check if the project needs to be unpaused
- **Page Types**: This app has multiple content types: feelings, barriers, identities, tasks, complex_loops, life_areas, etc.
- **Database Connection Issues**: If pages aren't loading or showing "not found", it's likely a database connectivity issue

## Development Rules  
- **No Automatic Database Operations**: Do not run SQL scripts or database queries unless explicitly requested by the user
- **Provide SQL Scripts**: When database changes are needed, provide the SQL script for the user to run manually in Supabase
- **Test Database First**: If content pages aren't working, test database connectivity before investigating code issues

## Common Development Commands

```bash
# Development
npm run dev          # Start development server (may use port 3001 if 3000 is occupied)
npm run build        # Build for production
npm run lint         # Run ESLint

# Data management
npm run import-data  # Import CSV data to Supabase database
tsx scripts/import-data.ts  # Direct import script execution

# Debugging
npx tsx test-db-connection.ts  # Test database connectivity (if file exists)

# Fast validation (99% faster than agent)
npx tsx scripts/fast-barrier-validator.ts "Barrier Name"  # Single barrier validation  
npx tsx scripts/batch-barrier-validator.ts              # All barriers validation
```

## Custom Commands

### update_git_todo
When user says "update_git_todo", perform these actions in order:
1. Update TODO.md with completed work from recent session
2. Commit all changes with descriptive message about work completed
3. Push changes to git repository

**Usage:** User simply types "update_git_todo" and Claude will handle the full workflow automatically.

## Project Overview

### Tech Stack
- **Next.js 15** with TypeScript - App Router architecture
- **Supabase** - Backend database with row-level security
- **Tailwind CSS** + **shadcn/ui** - Styling and component library
- **Lucide React** - Icon library

### Database Structure & Content Types
**Current Content Tables:**
- `complex_loops_content` - Complex behavioral patterns (e.g., analysis paralysis, bedtime procrastination)
- `feelings_content` - Emotional states and related strategies  
- `identities_content` - Identity-specific content (e.g., ADHD, neurodivergent)
- `tasks_content` - Task-based content and strategies
- `barriers_content` - Common barriers and obstacles
- `life_areas_content` - Content organized by life domains

**Legacy/Migration Notes:**
- The project has undergone several naming changes and restructures
- Some function names or patterns may reference old structures
- Database connection issues are usually related to Supabase project pausing/unpausing

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Key Files & Architecture

**Core Application:**

- `src/app/page.tsx` - Main application logic
- `src/app/complex_loops/` - Complex loops pages (main list + individual loop pages)
- `src/app/feelings/`, `src/app/barriers/`, `src/app/identities/` - Other content type pages

**Database & Data:**

- `src/lib/supabase.ts` - Database client with query functions
- `src/lib/supabase-unified.ts` - Alternative/unified database functions
- `src/types/database.ts` - Type definitions
- `scripts/import-data.ts` - Data import pipeline

**Common Issues:**

- If content pages show loading indefinitely or "not found", check Supabase project status
- The app uses dynamic routes like `/complex_loops/[loop]` for individual content pages
- Database query functions have verbose logging for debugging
