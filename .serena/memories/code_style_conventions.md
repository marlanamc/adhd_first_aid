# Code Style & Conventions

## TypeScript Standards
- **Strict TypeScript** - All code uses TypeScript with strict mode enabled
- **Type Definitions** - Comprehensive types in `src/types/database.ts`
- **Interface Naming** - Clear, descriptive interface names
- **Type Safety** - No `any` types, proper typing for all functions and components

## React/Next.js Conventions
- **App Router** - Using Next.js 13+ App Router pattern (`/app` directory)
- **Server Components** - Default to server components, use `'use client'` sparingly
- **Component Structure** - Functional components with TypeScript interfaces
- **File Naming** - PascalCase for components, kebab-case for pages
- **Export Style** - Named exports preferred, default exports for pages

## Component Organization
- **UI Components** - Reusable components in `src/components/ui/`
- **Page Components** - Page-specific components in `src/components/pages/`
- **Feature Components** - Feature-specific components in dedicated folders
- **Hooks** - Custom hooks in `src/hooks/`
- **Utils** - Utility functions in `src/lib/`

## Database & API Patterns
- **Supabase Integration** - Use typed clients in `src/lib/supabase.ts`
- **Error Handling** - Comprehensive error handling with try/catch
- **Loading States** - Proper loading and error state management
- **Type Safety** - Database schema types generated and maintained

## CSS & Styling
- **Tailwind CSS** - Utility-first CSS approach
- **shadcn/ui** - Consistent component library usage
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliance and screen reader support

## ADHD-Specific Design Patterns
- **Cognitive Load Reduction** - Simple, clear interfaces
- **Visual Hierarchy** - Consistent information architecture
- **Progressive Disclosure** - Information revealed as needed
- **Error Prevention** - Design prevents mistakes before they happen
- **Multiple Navigation Paths** - Flexible ways to access content

## File Structure Conventions
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   └── pages/          # Page-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configs
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## Code Quality Standards
- **ESLint** - Configured with Next.js rules
- **Prettier** - Code formatting (if configured)
- **No Comments Rule** - Code should be self-documenting (per CLAUDE.md)
- **Error Boundaries** - Comprehensive error handling
- **Testing** - Unit tests with Jest, E2E tests with Playwright