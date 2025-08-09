# ADHD First Aid Kit

A gentle, supportive web application designed specifically for ADHD minds during overwhelming moments. This toolkit provides personalized strategies and resources to help users navigate executive dysfunction, emotional overwhelm, and daily challenges.

## 🎯 What This Is

A safe, accessible digital space where people with ADHD can find immediate, practical support tailored to their specific situation and emotional state. Every design choice prioritizes neurodivergent accessibility, gentle language, and reducing cognitive load.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/marlanamc/adhd_first_aid
cd adhd-first-aid-kit

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🌟 Key Features

### Multiple Entry Points
Navigate by how you're feeling in the moment:
- **Feelings** - 22 emotion-specific pages with gentle/stern advice
- **Barriers** - 20 pages addressing specific obstacles
- **Tasks** - 36 task-specific guides with ADHD-friendly approaches  
- **Identities** - 23 identity-based support pages
- **Complex Loops** - 29 behavioral pattern pages with strategies

### ADHD-Friendly Design
- **Collapsible Content** - Reduce overwhelm with expandable sections
- **Progressive Disclosure** - Information revealed step-by-step
- **Gentle Language** - No harsh productivity advice
- **Mobile-First** - Optimized for phones and touch interaction
- **Visual Calm** - Soft gradients and glassmorphism effects

### Interactive Features
- **Systems Lab** - Browse and build ADHD-friendly routines
- **Guides** - Educational content about ADHD
- **Scripts** - Communication templates for difficult conversations
- **Quizzes** - Self-assessment tools
- **Resources** - Curated external resources and terminology

## 🏗️ Tech Stack

- **Next.js 15** with TypeScript and App Router
- **Supabase** - PostgreSQL database with row-level security
- **Tailwind CSS** - Custom ADHD-friendly styling
- **shadcn/ui** - Accessible component library
- **Lucide React** - Icon library

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── barriers/        # Barrier pages
│   ├── feelings/        # Feeling pages
│   ├── tasks/           # Task pages
│   ├── identities/      # Identity pages
│   ├── complex_loops/   # Complex loop pages
│   ├── systems/         # Systems Lab
│   ├── guides/          # Educational guides
│   └── [others]/        # Additional features
├── components/          
│   ├── ui/              # Reusable UI components
│   ├── barriers/        # Barrier-specific components
│   └── feelings/        # Feeling-specific components
├── lib/                 # Utilities and database client
├── hooks/               # Custom React hooks
└── types/               # TypeScript definitions
```

## 🧠 Database Structure

All content is stored in Supabase with comprehensive relational data:

- **strategies** - 289 ADHD-specific strategies
- **feelings_content** - Complete feeling pages with dual advice system
- **tasks_content** - Task-specific guidance
- **barriers_content** - Barrier-focused strategies
- **identities_content** - Identity-based support
- **complex_loops_content** - Behavioral pattern content
- **[entity]_sources** - Research sources for content credibility

## 🎨 Design Philosophy

### Visual Design
- **Ocean Gradients** - Calming color schemes
- **Glassmorphism** - Modern, gentle aesthetic
- **Soft Typography** - Easy on the eyes
- **Clear Hierarchy** - Information organized intuitively

### UX Principles
- **Work WITH ADHD** - Not against it
- **Small Steps** - Everything broken into manageable pieces
- **Multiple Paths** - Different entry points for different needs
- **No Judgment** - Supportive, understanding tone throughout

## 📝 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run import-data  # Import CSV data to Supabase
```

## 🤝 Contributing

We welcome contributions that align with our ADHD-friendly philosophy:

1. **Understand ADHD** - Familiarize yourself with executive dysfunction
2. **Use Gentle Language** - Avoid productivity shame
3. **Test on Mobile** - Ensure touch-friendly interactions
4. **Consider Cognitive Load** - Keep interfaces simple and clear

## ⚠️ Important Notes

- **Not Medical Advice** - This is peer support, not clinical treatment
- **Crisis Resources** - Emergency contacts are prominently displayed
- **Privacy First** - No tracking, no data collection
- **Local Storage** - User preferences saved locally only

## 📚 Recent Updates

### January 2025
- Complete database migration for all content
- Enhanced UI components for barriers and feelings
- New crisis and walkthrough support hooks
- Improved guide system with better navigation
- Cleaned up project structure, removed obsolete files
- Added comprehensive source citations for credibility

## 🌈 Our Mission

Create a genuinely helpful resource for the ADHD community where overwhelm is met with understanding, and practical support is offered without judgment. This isn't about "fixing" ADHD brains—it's about providing tools that work WITH their unique wiring.

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- **Live Site**: [Coming Soon]
- **GitHub**: [github.com/marlanamc/adhd_first_aid](https://github.com/marlanamc/adhd_first_aid)
- **Issues**: [Report bugs or request features](https://github.com/marlanamc/adhd_first_aid/issues)

---

Made with 💛 for the ADHD community