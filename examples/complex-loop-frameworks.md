# Complex Loop Type Frameworks

## 1. ⏰ Time & Transition Loops
**Loops:** Bedtime Procrastination, Waiting Mode, Chronic Lateness, Sleeping Through Alarms

### Framework: "The Time Trap"
**Structure:**
- **The Setup:** [What starts the time distortion]
- **The ADHD Response:** [How ADHD brain processes time differently] 
- **The Cascade:** [Step-by-step breakdown of what happens]
- **The Loop:** [How it feeds back and repeats]

### Key Mechanisms:
- Time blindness disrupts timeline awareness
- Executive dysfunction impairs time management
- Transition difficulties create getting-stuck patterns
- Circadian rhythm disruptions affect natural timing

---

## 2. 🧠 Analysis & Decision Loops  
**Loops:** Analysis Paralysis, Decision Overwhelm, Perfectionism Cycles

### Framework: "The Thinking Spiral"
**Structure:**
- **The Trigger:** [What starts the overthinking]
- **The ADHD Amplification:** [How ADHD makes thinking spiral]
- **The Mental Traffic Jam:** [When the brain gets stuck]
- **The Paralysis:** [Why action becomes impossible]

### Key Mechanisms:
- Executive dysfunction impairs decision-making
- Working memory gets overloaded with options
- Perfectionism + RSD make "wrong" choices feel catastrophic
- All-or-nothing thinking eliminates middle ground

---

## 3. 💥 Social & Relationship Loops
**Loops:** RSD Loops, Difficult Conversations, People-Pleasing Burnout, Last-Minute Cancelling, Friendships & ADHD

### Framework: "The Social Spiral"
**Structure:**
- **The Trigger:** [Social situation that activates RSD]
- **The ADHD Amplification:** [How emotions get dysregulated]
- **The Protective Response:** [Masking, avoiding, people-pleasing]
- **The Reinforcement:** [How the response creates more problems]

### Key Mechanisms:
- RSD makes rejection feel physically threatening
- Emotional dysregulation floods logic with intense feelings
- Masking burns through energy reserves
- Working memory gets hijacked by social anxiety

---

## 4. 🎯 Dopamine & Impulse Loops
**Loops:** Phone Scrolling, Social Media, Online Shopping, Overeating

### Framework: "The Dopamine Cycle" 
**Structure:**
- **The Trigger:** [Understimulation or emotional need]
- **The ADHD Hijack:** [How dopamine-seeking takes over]
- **The Hyperfocus Trap:** [Getting locked into the behavior]
- **The Crash:** [Why it never truly satisfies]

### Key Mechanisms:
- Dopamine dysregulation creates constant seeking
- Hyperfocus makes disengaging nearly impossible
- Impulsivity overrides planning and consequences
- Time blindness erases awareness during the behavior

---

## 5. ⚡ Energy & Capacity Loops
**Loops:** Masking Exhaustion, Constantly Tired, Workout Avoidance, Double-Booking Yourself

### Framework: "The Depletion Pattern"
**Structure:**
- **The Demand:** [What requires more energy for ADHD brains]
- **The Overextension:** [How ADHD brains miscalculate capacity]
- **The Crash:** [When the system can't maintain the pace]
- **The Shame Cycle:** [How exhaustion creates more pressure]

### Key Mechanisms:
- Masking requires constant cognitive effort
- Executive dysfunction makes routine tasks energy-intensive
- Poor interoception (body awareness) misses depletion signals
- Shame about tiredness creates overcompensation

---

## 6. 📋 Task & Communication Loops  
**Loops:** Email Overwhelm, Replying to Texts, Job Searching, Missed Appointments

### Framework: "The Avoidance Spiral"
**Structure:**
- **The Task:** [What seems simple but isn't for ADHD brains]
- **The Executive Breakdown:** [Where the process gets stuck]
- **The Avoidance:** [How delay makes it worse]
- **The Mountain Effect:** [When small tasks become overwhelming]

### Key Mechanisms:
- Executive dysfunction breaks down multi-step processes
- Working memory drops steps and context
- Perfectionism makes simple tasks feel high-stakes
- Time blindness makes deadlines feel sudden

---

## Implementation Plan

### Phase 1: Update Database Schema
- Add `loop_type` field to `complex_loops_content`
- Add `framework_sections` JSONB field for custom content
- Keep existing `adhd_reasons` for backward compatibility

### Phase 2: Create Type-Specific Content
- Replace generic "Why X is Hard with ADHD" sections
- Use framework-appropriate language and structure
- Focus on the specific neurological patterns for each type

### Phase 3: Update UI Components
- Render different section layouts based on loop type
- Use type-specific icons and visual elements
- Highlight the cyclical/pattern nature of each loop type