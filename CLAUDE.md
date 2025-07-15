# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
npm run dev          # Start development server at localhost:3000
npm run build        # Build for production
npm run start        # Preview production build
npm run lint         # Run ESLint

# Data management
npm run import-data  # Import CSV data to Supabase database
tsx scripts/import-data.ts  # Direct import script execution
```

## Project Architecture

### Tech Stack
- **Next.js 15** with TypeScript - App Router architecture
- **Supabase** - Backend database with row-level security
- **Tailwind CSS** + **shadcn/ui** - Styling and component library
- **Lucide React** - Icon library

### Database Architecture
The application uses Supabase with a relational schema:

**Core Tables:**
- `strategies` - Main strategy data with relationships
- `feelings`, `issues`, `barriers`, `tags`, `help_tasks` - Lookup tables
- Junction tables: `strategy_feelings`, `strategy_issues`, `strategy_barriers`, `strategy_tags`
- `strategy_votes` - User voting data with session tracking

**Key Features:**
- Row Level Security (RLS) enabled on all tables
- Public read access policies
- Session-based voting without user accounts

### Application Flow
1. **Home Page** (`src/app/page.tsx`) - Main entry with feeling/task selection
2. **Feeling Flow** - `/feeling/[feeling]` → `/feeling/[feeling]/issue/[issue]` → strategies
3. **Task Flow** - `/task/[task]` → strategies
4. **Strategy Display** - Modal system with detailed guidance

### Key Directories

**`src/app/`** - Next.js App Router pages
- `feeling/[feeling]/` - Feeling-based navigation
- `task/[task]/` - Task-based navigation  
- `strategies/` - Strategy listing page
- `scripts/` - Scripts and guides page with category selection
- `systems/` - Life management systems page
- `quizzes/` - Self-assessment quizzes and downloads
- `resources/` - External resources with terminology integration
- `favorites/` - User favorites (localStorage)

**`src/components/`**
- `layout/` - Header, Footer components
- `ui/` - shadcn/ui component library (includes FavoriteButton)
- `pages/` - Modular page components
- `quiz/` - Quiz components (StructureQuiz)

**`src/lib/`**
- `supabase.ts` - Database client with connection testing
- `strategies.ts` - Strategy-related utilities
- `utils.ts` - General utilities

**`src/types/`** - TypeScript definitions
- `database.ts` - Supabase table types
- `strategies.ts` - Strategy-related types

**`scripts/`** - Data management
- `import-data.ts` - CSV to Supabase importer
- `database/` - SQL scripts for schema setup

### Environment Setup
Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### State Management
- **Theme Context** (`src/contexts/ThemeContext.tsx`) - Light/dark mode
- **Favorites Hook** (`src/hooks/useFavorites.ts`) - localStorage-based favorites
- **Local State** - React useState for UI interactions

### Data Flow
1. **CSV Import** - `scripts/import-data.ts` processes CSV → Supabase
2. **Query Patterns** - Fetch with joins for strategy relationships
3. **Client-Side** - Supabase client queries with error handling
4. **Caching** - No explicit caching, relies on Supabase/browser caching

### ADHD-Specific Design Principles
- **Progressive Disclosure** - Step-by-step navigation
- **Gentle Language** - Supportive, non-judgmental copy
- **Minimal Cognitive Load** - Clean UI, clear actions
- **Accessibility** - Keyboard navigation, semantic HTML
- **Mobile-First** - Touch-friendly, responsive design

### Component Patterns
- **Server Components** - Static pages, SEO content
- **Client Components** - Interactive UI with 'use client'
- **Modal System** - Strategy details in overlays
- **Responsive Design** - Mobile-first with Tailwind breakpoints
- **Glassmorphism UI** - Semi-transparent elements with backdrop blur
- **Category Selection** - Reusable pattern for content organization

### Key Files to Understand
- `src/app/page.tsx` - Main application logic and routing
- `src/lib/supabase.ts` - Database connection and type exports
- `src/types/database.ts` - Complete type definitions
- `scripts/import-data.ts` - Data import pipeline
- `tailwind.config.js` - Custom animations and ADHD-friendly styling
- `src/components/layout/Header.tsx` - Fixed header with glassmorphism navigation
- `src/app/scripts/page.tsx` - Scripts and guides with category selection pattern

### Recent Updates (2024)
- **Scripts & Guides Integration**: Combined scripts and guides into single page with category selection boxes
- **Quiz System**: Integrated ADHD Structure Archetype Quiz with immediate results (no email required)
- **Resources Enhancement**: Added comprehensive ADHD terminology inline with category filtering
- **UI Consistency**: Implemented glassmorphism back buttons across all pages with proper header spacing
- **Navigation Improvements**: Fixed header overlap issues and standardized back button styling