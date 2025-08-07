# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Rules
- **No Automatic Database Operations**: Do not run SQL scripts or database queries unless explicitly requested by the user
- **Provide SQL Scripts**: When database changes are needed, provide the SQL script for the user to run manually in Supabase

## Common Development Commands

```bash
# Development
npm run dev          # Start development server at localhost:3000
npm run build        # Build for production
npm run lint         # Run ESLint

# Data management
npm run import-data  # Import CSV data to Supabase database
tsx scripts/import-data.ts  # Direct import script execution

# Fast validation (99% faster than agent)
npx tsx scripts/fast-barrier-validator.ts "Barrier Name"  # Single barrier validation
npx tsx scripts/batch-barrier-validator.ts              # All barriers validation
```

## Project Overview

### Tech Stack
- **Next.js 15** with TypeScript - App Router architecture
- **Supabase** - Backend database with row-level security
- **Tailwind CSS** + **shadcn/ui** - Styling and component library
- **Lucide React** - Icon library

### Database Structure
Core content tables: `strategies`, `feelings_content`, `identities_content`, `complex_loops_content`, `tasks_content`

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Key Files
- `src/app/page.tsx` - Main application logic
- `src/lib/supabase.ts` - Database client
- `src/types/database.ts` - Type definitions
- `scripts/import-data.ts` - Data import pipeline