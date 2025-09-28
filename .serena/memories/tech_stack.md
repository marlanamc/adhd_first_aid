# Tech Stack & Architecture

## Core Technologies
- **Next.js 15** with TypeScript - App Router architecture
- **React 19** - Latest React with concurrent features
- **Supabase** - Backend database with row-level security
- **Tailwind CSS** + **shadcn/ui** - Styling and component library
- **Lucide React** - Icon library

## Development Tools
- **TypeScript** - Type safety and better development experience
- **ESLint** - Code linting and formatting
- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing (recently fixed and working)
- **tsx** - TypeScript execution for scripts

## Database & Backend
- **Supabase PostgreSQL** - Main database with RLS (Row Level Security)
- **Database Tables**: complex_loops_content, feelings_content, identities_content, tasks_content, barriers_content, life_areas_content
- **Environment Variables**: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

## Key Architecture Patterns
- **App Router** - Next.js 13+ routing with `/app` directory
- **Dynamic Routing** - Pages like `/complex_loops/[loop]` for individual content
- **Component Library** - Reusable UI components with shadcn/ui
- **Type Safety** - Comprehensive TypeScript types for database schema

## Build System
- **Next.js** - Build, development, and production optimization
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing pipeline
- **Autoprefixer** - CSS vendor prefixing