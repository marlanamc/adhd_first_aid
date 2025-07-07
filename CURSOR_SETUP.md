# Quick Setup Guide for Cursor

## 🚀 Immediate Setup

1. **Extract the source code** from `adhd-first-aid-kit-nextjs-source.zip`
2. **Open in Cursor** and run:
   ```bash
   npm install
   npm run dev
   ```
3. **Visit** http://localhost:3000 to see the site running

## 🎯 What You're Working With

This is a **Next.js 15 + TypeScript** project for an ADHD support website. Think of it as a gentle, step-by-step toolkit that helps people with ADHD find personalized strategies when they're overwhelmed.

### Key User Flow:
1. User selects how they're feeling (overwhelmed, stuck, anxious, etc.)
2. Identifies specific issue (work, cleaning, emotions, etc.)  
3. Recognizes what's making it harder (perfectionism, low energy, etc.)
4. Gets personalized, ADHD-friendly strategies

## 📁 Important Files to Know

### Main Application Logic
- `src/app/page.tsx` - Core app with all state management and user flow
- `src/components/pages/HomePage.tsx` - Modular homepage component

### Styling & Design
- `src/App.css` - Custom styles, animations, ocean gradient background
- `src/app/globals.css` - Tailwind + shadcn/ui setup
- Uses **Tailwind CSS** + **shadcn/ui** components

### Key Features in Code
- **Multi-step flow** with smooth transitions
- **Strategy modal system** for detailed guidance
- **Search functionality** 
- **Responsive design** optimized for mobile
- **Accessibility features** throughout

## 🎨 Design Philosophy

**Everything is designed for ADHD brains:**
- Gentle, calming colors (ocean sunset gradient)
- Step-by-step flow to reduce overwhelm
- "Escape hatches" - always ways to go back
- Soft, encouraging language (no productivity shame)
- Mobile-first, touch-friendly interface

## 🧠 ADHD-Specific Considerations

When working on this project, remember:
- **Executive dysfunction** - users struggle with planning/organizing
- **Emotional dysregulation** - feelings can be intense and overwhelming  
- **Sensory sensitivity** - avoid harsh colors, jarring animations
- **Time blindness** - provide clear, immediate steps
- **Rejection sensitivity** - language must be gentle and validating

## ⚠️ Critical Legal Aspects

**This is NOT medical advice.** The site includes:
- Prominent medical disclaimers
- Crisis resource information
- Clear boundaries about what the tool is/isn't
- Privacy-focused (local storage only, no tracking)

## 🛠️ Development Tips

### Common Tasks
```bash
# Add new UI component
npx shadcn@latest add [component-name]

# Build for production
npm run build

# Type checking
npm run build  # TypeScript errors will show here
```

### Code Structure
- **State management** is in main `page.tsx` (no external state library)
- **Components** are modular and reusable
- **TypeScript interfaces** define data structures
- **Responsive design** uses Tailwind breakpoints

### Performance Notes
- Static site generation enabled (`output: 'export'`)
- Images optimized for static export
- Minimal JavaScript bundle size
- Mobile-optimized animations

## 🎯 Current Status & Next Steps

**What's Working:**
✅ Complete user flow (feeling → issue → barrier → strategies)
✅ Strategy modal system with detailed guidance
✅ Search functionality
✅ Blog/resources section with clickable posts
✅ Comprehensive footer with legal disclaimers
✅ Mobile-responsive design
✅ Accessibility features

**Potential Improvements:**
- Add more strategies to the mock data
- Implement user accounts for saving strategies
- Add more blog content
- Enhance search with filtering
- Add offline PWA capabilities
- Implement strategy rating/feedback system

## 🤝 Working with This Codebase

### Key Patterns
- **Conditional rendering** based on `currentStep` state
- **Smooth transitions** with `isTransitioning` state
- **Modal system** for detailed content
- **Mobile-first** responsive design

### Data Flow
1. User selections update state (`selectedFeeling`, `selectedIssue`, `selectedBarrier`)
2. State changes trigger step transitions with animations
3. Final step shows filtered strategies based on selections
4. Modals provide detailed strategy information

### Styling Approach
- **Tailwind utility classes** for most styling
- **Custom CSS** in `globals.css` for complex animations and gradients
- **shadcn/ui components** for consistent, accessible UI elements
- **Responsive design** with mobile-first approach

---

**Live Site**: https://henbtlon.manus.space
**Ready to help make ADHD support more accessible!** 🌟

