# Essential Development Commands

## Development Server
```bash
npm run dev          # Start development server (may use port 3001 if 3000 is occupied)
npm run build        # Build for production
npm start           # Start production server
```

## Code Quality & Testing
```bash
npm run lint        # Run ESLint
npm run test        # Run Jest unit tests
npm run test:watch  # Run Jest in watch mode
npm run test:coverage # Run tests with coverage report
```

## End-to-End Testing
```bash
npm run test:e2e              # Run Playwright tests
npm run test:e2e:ui           # Run Playwright with UI
npm run test:e2e:headed       # Run Playwright in headed mode
npm run test:e2e:local        # Run Playwright against localhost
```

## Data Management
```bash
npm run import-data           # Import CSV data to Supabase database
tsx scripts/import-data.ts    # Direct import script execution
```

## Content Validation (Fast Performance)
```bash
# Universal content validator
npm run validate              # Validate all content types
npm run validate:barriers     # Validate barriers content only
npm run validate:feelings     # Validate feelings content only
npm run validate:tasks        # Validate tasks content only
npm run validate:identities   # Validate identities content only
npm run validate:loops        # Validate complex loops content only

# Fast barrier validation (99% faster than agent)
npx tsx scripts/fast-barrier-validator.ts "Barrier Name"  # Single barrier validation  
npx tsx scripts/batch-barrier-validator.ts              # All barriers validation
```

## Custom Workflow Commands
```bash
# User can type "update_git_todo" for automated workflow:
# 1. Update TODO.md with completed work
# 2. Commit all changes with descriptive message
# 3. Push changes to git repository
```

## Debugging & Testing
```bash
npx tsx test-db-connection.ts  # Test database connectivity (if file exists)
```

## Important Notes
- **Supabase Status**: Project can be paused/unpaused - check if database connectivity fails
- **Database Operations**: Don't run SQL scripts automatically - provide them for manual execution
- **Port Flexibility**: Dev server may use port 3001 if 3000 is occupied