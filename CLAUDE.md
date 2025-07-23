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
The application uses Supabase with a comprehensive relational schema:

**Core Tables:**
- `strategies` - Main strategy data with icons, images, further reading, and full relationships
- Lookup tables: `feelings`, `issues`, `barriers`, `help_tasks`, `tags`, `life_roles`, `solution_types`, `styles`, `why_does_this_work`
- Junction tables: `strategy_feelings`, `strategy_issues`, `strategy_barriers`, `strategy_help_tasks`, `strategy_tags`, `strategy_life_roles`, `strategy_solution_types`, `strategy_styles`, `strategy_why_does_this_work`
- `strategy_votes` - User voting data with session tracking

**Key Features:**
- Row Level Security (RLS) enabled on all tables with public read/write policies
- Complete metadata for all lookup tables (emoji, color, category, hover_description)
- Multiple help_tasks support per strategy
- Title Case standardization across all data
- 289 strategies with comprehensive relational data
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
1. **CSV Import** - `scripts/import-data.ts` processes `Strategies_Clean_Sources.csv` → Supabase with:
   - Resume capability for large imports
   - Data normalization and Title Case standardization
   - Multiple help_tasks support
   - Field-specific mapping for consistency
2. **Schema Setup** - `scripts/database/complete-schema.sql` provides complete database setup
3. **Query Patterns** - Fetch with joins for strategy relationships across all tables
4. **Client-Side** - Supabase client queries with error handling
5. **Caching** - No explicit caching, relies on Supabase/browser caching

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
- `scripts/import-data.ts` - Enhanced data import pipeline with normalization
- `scripts/database/complete-schema.sql` - Complete database schema setup
- `Strategies_Clean_Sources.csv` - Main strategy data (289 entries)
- `docs/datadictionary_clean.md` - Updated data taxonomy with Title Case standards
- `tailwind.config.js` - Custom animations and ADHD-friendly styling
- `src/components/layout/Header.tsx` - Fixed header with glassmorphism navigation
- `src/app/scripts/page.tsx` - Scripts and guides with category selection pattern

### Recent Updates (2025)
- **Database Schema Enhancement**: Complete relational schema with full metadata for all lookup tables
- **Data Standardization**: Title Case normalization across all data with specific mismatch mappings
- **Multiple Help Tasks**: Support for linking multiple help tasks per strategy
- **Import Script Enhancement**: Resume capability, data normalization, and field-specific mapping
- **Complete Documentation**: Updated all documentation with current schema and data structure

#### ✨ Major ADHD-Friendly Layout Overhaul
- **Collapsible Sections**: All feeling, task, barrier, and identity pages now feature collapsible content sections to reduce cognitive overwhelm
  - Uses `useState` for `expandedSections` tracking with unique keys per section
  - Plus/minus icons instead of arrows to avoid navigation confusion
  - Custom tooltips showing "Open section" / "Close section" on hover
  - Smooth animations using `animate-in slide-in-from-top duration-300`
- **Gentle Guidance System**: Added "Take your time" messaging with 🌱 emoji to encourage self-paced exploration
- **Dynamic Content Rendering**: Custom sections for specific feelings (Mental Fog, Forgetful, Scattered, Overstimulated, Stuck, Overwhelmed)

#### 🧭 Contextual Navigation Enhancement
- **Smart 4-Button Layout**: Each page type shows contextually relevant navigation, avoiding self-referential buttons:
  - **Barrier Pages**: ❤️ Feelings | 🛠 Tasks (top), 🌈 Identity | 🧩 Systems (bottom)
  - **Task Pages**: ❤️ Feelings | 🚧 Barriers (top), 🌈 Identity | 🧩 Systems (bottom)  
  - **Identity Pages**: ❤️ Feelings | 🚧 Barriers (top), 🛠 Tasks | 🧩 Systems (bottom)
  - **Feeling Pages**: 🛠 Tasks | 🚧 Barriers (top), 🌈 Identity | 🧩 Systems (bottom)
- **Prominent Guide Sections**: Strategy guides moved above navigation for better discoverability
- **Consistent Visual Hierarchy**: All pages follow the same layout pattern for cognitive ease

#### 📚 Enhanced Guide System
- **Floating Progress Bar**: Reading progress tracker that follows users while scrolling through guides using `position: fixed`
- **Beautiful Guide Styling**: Custom `NewGuideClient` with glassmorphism design instead of plain markdown
- **Dynamic Content Rendering**: Guides automatically adapt between Cognitive & Overload Guide and Dysregulation & Shutdown Guide
- **Custom Content Templates**: Specialized 5-step layouts with color-coded sections and themed emojis

#### Previous Major Features
- **Scripts & Guides Integration**: Combined scripts and guides into single page with category selection boxes
- **Quiz System**: Integrated ADHD Structure Archetype Quiz with immediate results (no email required)
- **Resources Enhancement**: Added comprehensive ADHD terminology inline with category filtering
- **UI Consistency**: Implemented glassmorphism back buttons across all pages with proper header spacing
- **Navigation Improvements**: Fixed header overlap issues and standardized back button styling
- **Strategy Navigation Fix**: Fixed "Find Your Strategy" button to show proper strategy selection interface
- **Icon System**: Comprehensive Lucide icon mapping for all strategies with fallback handling
- **ADHD-Friendly Descriptions**: Improved all 289 strategy descriptions with bullet points and simple language
- **Gallery Alignment**: Fixed strategy card alignment in gallery view for consistent horizontal layout
- **Price Tag Styling**: Updated to translucent black text for better readability
- **Selection Highlighting**: Bold user-selected terms in page descriptions for better context
- **Hover Tooltips**: Complete tooltip system for feelings, help_tasks, and barriers with glassmorphism styling
- **Query Optimization**: Enhanced database queries to fetch complete objects with hover descriptions
- **Project Organization**: Cleaned up folder structure with archive for old files