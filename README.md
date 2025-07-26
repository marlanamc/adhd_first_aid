# ADHD First Aid Kit

A gentle, supportive web application designed specifically for ADHD minds during overwhelming moments. This toolkit provides personalized strategies and resources to help users navigate executive dysfunction, emotional overwhelm, and daily challenges.

## 🎯 Project Overview

**Purpose**: Create a safe, accessible space where people with ADHD can find immediate, practical support tailored to their specific situation and emotional state.

**Philosophy**: Work with ADHD brains, not against them. Every design choice prioritizes neurodivergent accessibility, gentle language, and reducing cognitive load.

## 🌟 Key Features

### Core User Flows
1. **Homepage Entry Points** - 8 distinct pathways with intuitive question-based navigation
2. **Feeling-Based Flow** - `/feelings` → category selection → strategies
3. **Task-Based Flow** - `/tasks` → category selection → strategies
4. **Barrier-Based Flow** - `/barriers` → category selection → strategies  
5. **Identity-Based Flow** - `/identities` → category selection → strategies
6. **Systems Lab** - Browse, build, and share ADHD-friendly routines
7. **Support Resources** - Guides, scripts, quizzes, and external resources

### Current Features
- **8-Way Navigation** - Choose by feelings, barriers, tasks, identity, or support needs
- **Toggle System** - Category filtering on all content pages for cleaner navigation
- **Question-Based UI** - Homepage cards start with engaging questions ("How are you feeling?")
- **Gradient Theming** - Each content type has its own beautiful gradient background
- **Glassmorphism Design** - Semi-transparent cards with backdrop blur effects
- **Supabase Database** - Real-time strategy data with relational structure
- **Favorites System** - Save strategies locally (no account required)
- **Strategy Voting** - Session-based feedback system
- **Enhanced Feeling Pages** - Database-driven content with gentle/stern advice options
- **ADHD-Friendly Language** - Trauma-informed, compassionate guidance throughout
- **Responsive Design** - Mobile-first, touch-friendly interface

### Content Pages
- **Feelings** (`/feelings`) - Emotion-first navigation with 5 categories
- **Barriers** (`/barriers`) - What's blocking you? 4 barrier types with toggle selection
- **Tasks** (`/tasks`) - Task-specific help with 4 categories  
- **Identities** (`/identities`) - Identity-based support with 6 life contexts
- **Systems Lab** (`/systems`) - Browse, build, and share ADHD-friendly routines
- **Guides** (`/guides`) - Educational content with 4 simplified categories
- **Scripts** (`/scripts`) - Communication templates for hard moments
- **Quizzes** (`/quizzes`) - Interactive self-assessment tools
- **Resources** (`/resources`) - Websites, books, podcasts, and ADHD terminology
- **About/FAQ/Contact** - Project information and community features

## 🏗️ Technical Architecture

### Framework & Tools
- **Next.js 15** - App Router with TypeScript
- **Supabase** - PostgreSQL database with row-level security
- **Tailwind CSS** - Utility-first styling with custom ADHD-friendly animations
- **shadcn/ui** - Accessible component library
- **Lucide React** - Icon library

### Database Schema
```
strategies (main content with icons, images, further reading)
├── feelings (emotional states) → strategy_feelings (junction)
├── issues (challenges + emotional regulation) → strategy_issues (junction)  
├── barriers (cognitive/emotional/sensory) → strategy_barriers (junction)
├── help_tasks (task types) → strategy_help_tasks (junction) - supports multiple
├── tags (categories) → strategy_tags (junction)
├── life_roles → strategy_life_roles (junction)
├── solution_types → strategy_solution_types (junction)
├── styles → strategy_styles (junction)
├── why_does_this_work (mechanisms) → strategy_why_does_this_work (junction)
└── strategy_votes (session-based feedback)
```

**Key Features:**
- **Complete Metadata**: All lookup tables include emoji, color, category, and hover descriptions
- **Multiple Help Tasks**: Strategies can be linked to multiple help tasks per strategy
- **Title Case Standardization**: All data normalized to consistent capitalization
- **Comprehensive Coverage**: 289 strategies with full relational data

### Project Structure
```
src/
├── app/                      # Next.js App Router with all content types
│   ├── feelings/             # Emotion-first navigation with categories
│   ├── barriers/             # Barrier-focused navigation with toggle system
│   ├── tasks/                # Task-specific navigation with categories  
│   ├── identities/           # Identity-based navigation with life contexts
│   ├── systems/              # Systems Lab - browse/build/share routines
│   ├── guides/               # Educational content with simplified categories
│   ├── scripts/              # Communication templates for hard moments
│   ├── quizzes/              # Interactive self-assessment tools
│   ├── resources/            # External resources with terminology integration
│   ├── favorites/            # User favorites (localStorage)
│   └── [support pages]/      # About, FAQ, Contact, etc.
├── components/
│   ├── ui/                   # shadcn/ui component library + FavoriteButton
│   ├── layout/               # Header, Footer with glassmorphism design
│   ├── pages/                # NewHomePage with 8-way navigation
│   └── quiz/                 # Interactive quiz components
├── lib/
│   ├── supabase.ts          # Database client with enhanced queries
│   ├── strategies.ts        # Strategy utilities
│   └── utils.ts             # General utilities
├── types/                   # TypeScript definitions for all data types
├── contexts/                # Theme management with gradient support
├── hooks/                   # Custom hooks (favorites, votes, etc.)
└── archive/                 # Archived files and old scripts
```

## 🎨 Design Philosophy

### Visual Design
- **Ocean Gradient Background** - Calming, consistent visual foundation
- **Soft Color Palette** - Reduces visual overwhelm
- **Gentle Typography** - Serif headings, light body text
- **Flowing Buttons** - Tag-style, rounded elements that feel approachable
- **Glassmorphism UI** - Semi-transparent elements with backdrop blur for modern, gentle aesthetics

### UX Principles
- **Progressive Disclosure** - Information revealed step-by-step
- **Gentle Language** - No harsh productivity advice
- **Escape Hatches** - Always provide ways to go back or start over
- **Hover-Only Messages** - Reassuring content that doesn't overwhelm
- **Category Selection** - Reusable pattern for organizing content into manageable chunks

### Accessibility Features
- **Mobile-First** - Optimized for touch and small screens
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Friendly** - Semantic HTML and ARIA labels
- **Reduced Motion** - Respects user preferences

## 🧠 ADHD-Specific Considerations

### Executive Function Support
- **Small Steps** - Break everything into manageable pieces
- **External Structure** - Timers, visual cues, clear navigation
- **Immediate Rewards** - Quick wins and positive reinforcement

### Emotional Regulation
- **Validation** - "You're not failing, you're overwhelmed"
- **Choice** - Multiple entry points (feelings vs tasks)
- **Safety** - Clear medical disclaimers and crisis resources

### Sensory Considerations
- **Calming Colors** - Soft oranges and blues
- **Minimal Clutter** - Clean, spacious layouts
- **Gentle Animations** - Smooth transitions, not jarring

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd adhd-first-aid-kit-nextjs

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Commands
```bash
npm run dev          # Start development server at localhost:3000
npm run build        # Build for production
npm run start        # Preview production build  
npm run lint         # Run ESLint
npm run import-data  # Import CSV data to Supabase (requires .env.local)
```

### Environment Setup
Required environment variables in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📊 Data & Content Management

### Current Data Structure
- **Comprehensive Strategy Database**: 289 strategies with detailed categorization
- **Advanced Relational Design**: Strategies linked to feelings, issues, barriers, help_tasks, why_mechanisms, and more
- **Smart CSV Import System**: `npm run import-data` with resume capability and data normalization
- **Data Standardization**: All names normalized to Title Case with specific mismatch mappings
- **Complete Metadata**: Every lookup table includes emoji, color, category, hover descriptions

### Content Guidelines
- **Peer-to-Peer**: Strategies from community experience and research
- **Non-Medical**: Clear disclaimers about not being medical advice  
- **Gentle Language**: Avoid productivity shame, embrace neurodivergent perspective
- **Practical Focus**: Immediate, actionable steps with real-world examples
- **Accessibility**: Clear descriptions, alternative text, multiple entry points

### Data Sources
- **CSV Management**: `Strategies_Clean_Sources.csv` - main strategy data (289 entries)
- **Import Pipeline**: `scripts/import-data.ts` - Enhanced CSV to Supabase processing with:
  - Resume capability for large imports
  - Data normalization for consistency  
  - Multiple help_tasks support
  - Specific field mapping (feelings, issues, barriers, why_mechanisms)
- **Schema Management**: `scripts/database/complete-schema.sql` - Complete database setup
- **Documentation**: `docs/datadictionary_clean.md` - Updated taxonomy with all standardized data

## ⚠️ Important Legal Considerations

### Medical Disclaimers
- **Not Medical Advice** - Clearly stated throughout
- **Crisis Resources** - Emergency contacts prominently displayed
- **Professional Care** - Encourages consulting healthcare providers

### Privacy
- **Local Storage Only** - No personal data collection
- **No Tracking** - Respects user privacy
- **Transparent** - Clear about data practices

## 🎯 Future Development Ideas

### Potential Features
- **User Accounts** - Save strategies across devices
- **Community Features** - Share experiences and strategies
- **Personalization** - Learn from user preferences
- **Offline Support** - PWA capabilities
- **More Content** - Expanded strategy library

### Technical Improvements
- **Performance** - Further optimization
- **Accessibility** - Enhanced screen reader support
- **Internationalization** - Multi-language support
- **Analytics** - Privacy-respecting usage insights

## 🤝 Contributing Guidelines

### Code Style
- **TypeScript** - Use proper typing
- **Component Structure** - Keep components focused and reusable
- **Accessibility** - Always consider screen readers and keyboard navigation
- **Performance** - Optimize for mobile and slower connections

### Content Guidelines
- **ADHD-Informed** - Understand executive dysfunction and emotional dysregulation
- **Gentle Language** - Avoid productivity shame or overwhelming advice
- **Evidence-Based** - Strategies should be grounded in ADHD research or community experience
- **Inclusive** - Consider diverse ADHD experiences and presentations

## 📝 Key Files to Understand

### Core Application  
- `src/app/page.tsx` - Main application with data fetching and routing
- `src/lib/supabase.ts` - Database client with connection testing and types
- `src/types/database.ts` - Complete TypeScript definitions
- `src/components/layout/Header.tsx` - Navigation with favorites and theme toggle

### Data Management
- `scripts/import-data.ts` - Enhanced CSV to Supabase import pipeline with resume capability
- `Strategies_Clean_Sources.csv` - Master strategy data (289 entries)
- `scripts/database/complete-schema.sql` - Complete database schema with all metadata
- `docs/datadictionary_clean.md` - Updated taxonomy with standardized Title Case data

### Configuration
- `next.config.js` - Next.js with Supabase environment variable handling
- `tailwind.config.js` - Custom ADHD-friendly animations and theming
- `components.json` - shadcn/ui configuration

## 🆕 Recent Updates (January 2025)

### 🎨 Major ADHD-Friendly Layout Overhaul
- **Collapsible Sections**: All feeling, task, barrier, and identity pages now feature collapsible content sections to reduce cognitive overwhelm
- **Gentle Guidance**: Added "Take your time, open each section when you're ready" messaging with plant emoji to encourage self-paced exploration
- **Plus/Minus Icons**: Clear, non-navigational expand/collapse indicators that don't suggest page navigation
- **Custom Tooltips**: Hover-enabled "Open section" / "Close section" guidance with beautiful styling
- **Smooth Animations**: Content slides in gracefully when expanded for a calming user experience

### 🧭 Contextual Navigation Enhancement
- **Smart 4-Button Layout**: Each page type shows relevant navigation options, avoiding self-referential buttons:
  - **Barrier Pages**: Feelings | Tasks (top), Identity | Systems (bottom)
  - **Task Pages**: Feelings | Barriers (top), Identity | Systems (bottom)  
  - **Identity Pages**: Feelings | Barriers (top), Tasks | Systems (bottom)
  - **Feeling Pages**: Tasks | Barriers (top), Identity | Systems (bottom)
- **Prominent Guide Sections**: Strategy guides moved above navigation for better discoverability
- **Consistent Visual Hierarchy**: All pages follow the same layout pattern for cognitive ease

### 📝 Custom Content Templates
- **Specialized Feeling Pages**: Custom 5-step layouts for Mental Fog, Forgetful, Scattered, Overstimulated, Stuck, and Overwhelmed
- **Contextual Strategies**: Each page type (tasks, barriers, identities) features themed content and icons
- **Unified Design Language**: Consistent color-coded sections with meaningful emojis across all content types

### 🎯 Enhanced Guide System
- **Floating Progress Bar**: Reading progress tracker that follows users while scrolling through guides
- **Beautiful Guide Styling**: Custom NewGuideClient with glassmorphism design instead of plain markdown
- **Dynamic Content Rendering**: Guides automatically adapt between Cognitive & Overload Guide and Dysregulation & Shutdown Guide
- **Step-by-Step Guidance**: Clear progression through guide content with visual indicators

### Major User Experience Improvements
- **Strategy Navigation Fix**: Fixed "Find Your Strategy" button to show proper strategy selection interface instead of compressed homepage
- **Icon System Enhancement**: Comprehensive Lucide icon mapping for all 289 strategies with fallback handling
- **ADHD-Friendly Content**: Improved all strategy descriptions with bullet points and simple language for better readability
- **Gallery Layout Fix**: Fixed strategy card alignment in gallery view for consistent horizontal layout
- **Price Tag Styling**: Updated to translucent black text for improved readability and accessibility

### Enhanced Interaction Features
- **Selection Highlighting**: User-selected terms (feelings, issues, tasks) are now bolded in page descriptions for better context
- **Complete Tooltip System**: Implemented hover tooltips for feelings, help_tasks, and barriers with glassmorphism styling
- **Query Optimization**: Enhanced database queries to fetch complete objects with hover descriptions
- **Interactive Feedback**: Improved visual feedback throughout the user journey

### Scripts & Guides Integration
- **Combined Interface**: Merged scripts and guides into a single page with category selection boxes
- **Improved Navigation**: Users can easily switch between communication templates and step-by-step guides
- **Enhanced Search**: Search functionality works across both scripts and guides content

### Quiz System Enhancement
- **ADHD Structure Archetype Quiz**: Fully integrated interactive quiz to help users understand their relationship with structure
- **Immediate Results**: Removed email requirement - users get results instantly after completion
- **Personalized Recommendations**: Results include tailored coaching and support recommendations

### Resources Page Expansion
- **ADHD Terminology Integration**: Added comprehensive ADHD terms and definitions inline with resources
- **Category Filtering**: Users can filter between websites, books, podcasts, and terminology
- **Enhanced Search**: Search across all resource types and terminology

### UI/UX Improvements
- **Glassmorphism Back Buttons**: Standardized back button styling across all pages with semi-transparent design
- **Fixed Header Issues**: Resolved header overlap problems with proper spacing
- **Consistent Navigation**: All pages now have uniform navigation patterns and styling
- **Mobile Optimization**: Improved touch interactions and responsive design

### Content Organization & Technical Improvements
- **Card Layout Improvements**: Consistent card heights and better visual hierarchy
- **Priority Reordering**: Guides now appear before scripts in navigation to match user preferences
- **Enhanced Accessibility**: Better keyboard navigation and screen reader support
- **Project Cleanup**: Organized folder structure with archive for old files and scripts

## 🌈 The Vision

This project exists to create a genuinely helpful resource for the ADHD community. Every decision—from the gentle color palette to the step-by-step user flow—is made with neurodivergent users in mind. 

The goal isn't to "fix" ADHD brains, but to provide tools that work with their unique wiring. It's a space where overwhelm is met with understanding, and practical support is offered without judgment.

---
