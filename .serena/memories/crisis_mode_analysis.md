# Crisis Mode Analysis & Extension Plan

## Current Crisis Mode Implementation

### Database Structure
- **Table:** `crisis_mode_feelings`
- **Fields:** `feeling_name`, `description`, `strategies[]` (jsonb), `icon`
- **Pattern:** Targeted immediate support for specific emotional states

### UI Pattern
- **Component:** `TargetedCrisisMode.tsx`
- **Features:** 
  - Modal overlay with crisis-specific content
  - Checkable strategy list (user can mark as tried)
  - Progress feedback ("You've tried X strategies")
  - Supportive messaging throughout

### Integration Method
- **Trigger:** Special crisis button in `FixedBottomActions`
- **Routing:** `onOpenCrisisMode` prop for feelings pages
- **Fallback:** General crisis mode with feeling selection

## Extension Strategy for Other Content Types

### 1. Barriers Crisis Mode
**Use Case:** When a barrier is actively blocking someone and they need immediate help

**Database Schema:**
```sql
crisis_mode_barriers (
  id uuid,
  barrier_name text,
  description text, -- "This barrier is real and hard. Here's immediate help."
  strategies jsonb, -- Array of actionable steps
  icon text,
  created_at, updated_at
)
```

### 2. Complex Loops Crisis Mode  
**Use Case:** When someone is stuck in a destructive ADHD loop and needs circuit breakers

**Database Schema:**
```sql
crisis_mode_complex_loops (
  id uuid,
  loop_name text,
  description text, -- "You're caught in this loop. Here's how to interrupt it."
  strategies jsonb, -- Array of loop-breaking techniques
  icon text,
  created_at, updated_at
)
```

### 3. Life Areas Crisis Mode
**Use Case:** When a life area is in crisis/collapse and needs stabilization

**Database Schema:**
```sql
crisis_mode_life_areas (
  id uuid,
  life_area_name text,
  description text, -- "This area needs immediate attention. Start here."
  strategies jsonb, -- Array of stabilization steps
  icon text,
  created_at, updated_at
)
```

### 4. Identities Crisis Mode
**Use Case:** When identity struggles are causing acute distress

**Database Schema:**
```sql
crisis_mode_identities (
  id uuid,
  identity_name text,
  description text, -- "Your identity is valid. Here's immediate support."
  strategies jsonb, -- Array of identity-affirming actions
  icon text,
  created_at, updated_at
)
```

## Universal Crisis Mode Component Design

### Enhanced TargetedCrisisMode Component
- **Generic:** Support all content types via props
- **Type-specific messaging:** Adjust language for each content type
- **Consistent UX:** Same checkable strategy pattern
- **Content-aware:** Load appropriate crisis data based on content type

### Integration Pattern
- **Universal Button:** Crisis mode available on all content type pages
- **Smart Routing:** Direct to targeted crisis mode when available
- **Graceful Fallback:** General crisis mode when targeted unavailable