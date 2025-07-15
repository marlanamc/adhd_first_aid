# ADHD First Aid Kit

A gentle, supportive web application designed specifically for ADHD minds during overwhelming moments. This toolkit provides personalized strategies and resources to help users navigate executive dysfunction, emotional overwhelm, and daily challenges.

## 🎯 Project Overview

**Purpose**: Create a safe, accessible space where people with ADHD can find immediate, practical support tailored to their specific situation and emotional state.

**Philosophy**: Work with ADHD brains, not against them. Every design choice prioritizes neurodivergent accessibility, gentle language, and reducing cognitive load.

## 🌟 Key Features

### Core User Flows
1. **Feeling-Based Flow** - `/feeling/[feeling]` → `/feeling/[feeling]/issue/[issue]` → strategies
2. **Task-Based Flow** - `/task/[task]` → strategies  
3. **Direct Strategy Access** - `/strategies` page with comprehensive filtering

### Current Features
- **Dual Navigation** - Choose by how you feel OR what you need help with
- **Supabase Database** - Real-time strategy data with relational structure
- **Favorites System** - Save strategies locally (no account required)
- **Dark/Light Mode** - Theme toggle with user preference storage
- **Strategy Voting** - Session-based feedback system
- **Responsive Design** - Mobile-first, touch-friendly interface
- **Search Functionality** - Coming soon (framework in place)

### Content Pages
- **About** - Project background and philosophy
- **FAQ** - Common questions about ADHD and the toolkit
- **Blog** - Educational content (expandable framework)
- **Scripts & Guides** - Communication templates and step-by-step guidance with category selection
- **Systems** - Life management systems for daily routines and organization
- **Quizzes** - Self-assessment tools including ADHD Structure Archetype Quiz
- **Resources** - External resources with integrated ADHD terminology and filtering
- **Contact** - Feedback and communication
- **Legal & Privacy** - Clear disclaimers and data practices
- **Suggest Strategy** - Community contribution form

## 🏗️ Technical Architecture

### Framework & Tools
- **Next.js 15** - App Router with TypeScript
- **Supabase** - PostgreSQL database with row-level security
- **Tailwind CSS** - Utility-first styling with custom ADHD-friendly animations
- **shadcn/ui** - Accessible component library
- **Lucide React** - Icon library

### Database Schema
```
strategies (main content)
├── feelings (emotional states) → strategy_feelings (junction)
├── issues (challenges) → strategy_issues (junction)  
├── barriers (obstacles) → strategy_barriers (junction)
├── tags (categories) → strategy_tags (junction)
├── help_tasks (task types) → linked via help_task_id
└── strategy_votes (session-based feedback)
```

### Project Structure
```
src/
├── app/                  # Next.js App Router
│   ├── feeling/[feeling]/     # Feeling-based navigation
│   ├── task/[task]/          # Task-based navigation
│   ├── strategies/           # Strategy listing page
│   ├── scripts/              # Scripts & guides with category selection
│   ├── systems/              # Life management systems
│   ├── quizzes/              # Self-assessment quizzes and downloads
│   ├── resources/            # External resources with terminology
│   ├── favorites/            # User favorites
│   └── [other pages]/        # About, FAQ, Blog, etc.
├── components/
│   ├── ui/                   # shadcn/ui component library + FavoriteButton
│   ├── layout/               # Header, Footer
│   ├── pages/                # Modular page components
│   └── quiz/                 # Quiz components (StructureQuiz)
├── lib/
│   ├── supabase.ts          # Database client & types
│   ├── strategies.ts        # Strategy utilities
│   └── utils.ts             # General utilities
├── types/                   # TypeScript definitions
├── contexts/                # Theme management
└── hooks/                   # Custom hooks (favorites, etc.)
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
- **Comprehensive Strategy Database**: 200+ strategies with detailed categorization
- **Relational Design**: Strategies linked to feelings, issues, barriers, and tags
- **CSV Import System**: `npm run import-data` for bulk data management
- **Data Validation**: Built-in checks for consistency and completeness

### Content Guidelines
- **Peer-to-Peer**: Strategies from community experience and research
- **Non-Medical**: Clear disclaimers about not being medical advice  
- **Gentle Language**: Avoid productivity shame, embrace neurodivergent perspective
- **Practical Focus**: Immediate, actionable steps with real-world examples
- **Accessibility**: Clear descriptions, alternative text, multiple entry points

### Data Sources
- **CSV Management**: `scripts/sample.csv` - main strategy data  
- **Import Pipeline**: `scripts/import-data.ts` - CSV to Supabase processing
- **Documentation**: See `docs/` folder for data validation guides and taxonomy

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
- `scripts/import-data.ts` - CSV to Supabase import pipeline
- `scripts/sample.csv` - Master strategy data (200+ entries)
- `docs/complete_database_review_guide.md` - Data validation checklist
- `docs/datadictionary_clean.md` - Complete taxonomy of feelings, barriers, etc.

### Configuration
- `next.config.js` - Next.js with Supabase environment variable handling
- `tailwind.config.js` - Custom ADHD-friendly animations and theming
- `components.json` - shadcn/ui configuration

## 🆕 Recent Updates (2024)

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

### Content Organization
- **Card Layout Improvements**: Consistent card heights and better visual hierarchy
- **Priority Reordering**: Guides now appear before scripts in navigation to match user preferences
- **Enhanced Accessibility**: Better keyboard navigation and screen reader support

## 🌈 The Vision

This project exists to create a genuinely helpful resource for the ADHD community. Every decision—from the gentle color palette to the step-by-step user flow—is made with neurodivergent users in mind. 

The goal isn't to "fix" ADHD brains, but to provide tools that work with their unique wiring. It's a space where overwhelm is met with understanding, and practical support is offered without judgment.

---

**Live Site**: https://henbtlon.manus.space
**Built with care for the ADHD community** 💙
