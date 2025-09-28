# Task Completion Checklist

## When Tasks Are Complete

### Code Quality Validation (Required)
```bash
npm run lint         # Run ESLint to check code quality
npm run build        # Ensure production build succeeds
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests (if changes affect UI)
```

### Content Validation (For Content Changes)
```bash
npm run validate     # Validate all content types
# OR specific validation:
npm run validate:barriers    # For barrier content changes
npm run validate:feelings    # For feelings content changes
npm run validate:tasks       # For task content changes
npm run validate:identities  # For identity content changes
npm run validate:loops       # For complex loops content changes
```

### Database Changes (Manual Process)
- **Do NOT run SQL scripts automatically**
- **Provide SQL scripts for manual execution in Supabase**
- **Test database connectivity first if pages aren't loading**

### Performance & Accessibility Check
- **Page Load Times**: Target <2 seconds
- **Mobile Responsiveness**: Test on mobile devices
- **Accessibility**: Screen reader and keyboard navigation
- **ADHD UX**: Cognitive load, visual hierarchy, error prevention

### Documentation Updates
- Update relevant documentation if architecture changes
- Update CLAUDE.md if new commands or patterns are introduced
- No automatic README or documentation creation unless requested

## Before Committing (Only When User Requests)
- **Never commit automatically** unless user explicitly asks
- Use descriptive commit messages about work completed
- Follow the custom `update_git_todo` workflow when requested

## ADHD-Specific Quality Checks
- **Cognitive Load**: Is the interface simple and clear?
- **Visual Hierarchy**: Is information architecture consistent?
- **Error Prevention**: Does design prevent mistakes?
- **Multiple Paths**: Are there flexible navigation options?
- **Immediate Feedback**: Do actions provide clear responses?

## Performance Targets
- **Page Load**: <2 seconds
- **Database Queries**: Optimized and cached
- **Mobile Performance**: Fast on throttled connections
- **Accessibility**: WCAG AA compliance minimum