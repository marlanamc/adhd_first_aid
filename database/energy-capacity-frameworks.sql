-- Energy & Capacity Framework Implementation
-- Populate "The Depletion Pattern" framework sections for all 5 energy/capacity loops

-- 1. Masking Exhaustion
UPDATE complex_loops_content
SET framework_sections = '{
  "demand": {
    "title": "The Demand",
    "content": "Social and professional situations require you to appear \"normal\""
  },
  "overextension": {
    "title": "The Overextension",
    "content": "Your ADHD brain burns 3x the energy to do what looks effortless",
    "mechanisms": [
      "🎭 **Masking** requires constant cognitive monitoring and suppression of natural impulses",
      "🧠 **Working memory** gets hijacked by managing your presentation vs. focusing on tasks",
      "🧩 **Executive function** depletes rapidly from constant self-regulation",
      "💥 **Emotional regulation** becomes harder when you''re already at capacity"
    ]
  },
  "crash": {
    "title": "The Crash",
    "steps": [
      "You successfully \"pass\" as neurotypical all day/week",
      "Mental resources become completely depleted",
      "You collapse in private - shutdown, meltdown, or complete withdrawal",
      "Recovery time is longer than the masking period"
    ]
  },
  "shame_cycle": {
    "title": "The Shame Cycle",
    "content": "You feel guilty for being tired from \"just existing,\" leading to more pressure to mask better"
  }
}'
WHERE loop_name = 'Masking Exhaustion';

-- 2. Constantly Tired
UPDATE complex_loops_content
SET framework_sections = '{
  "demand": {
    "title": "The Demand",
    "content": "Daily tasks require more cognitive energy when your brain works differently"
  },
  "overextension": {
    "title": "The Overextension",
    "content": "Your ADHD brain expends enormous energy on tasks that seem simple",
    "mechanisms": [
      "🎭 **Masking** and constant self-regulation burn through mental energy fast",
      "🧩 **Executive dysfunction** makes routine tasks require more cognitive effort",
      "💤 **Sleep quality issues** mean you''re not getting restorative rest",
      "💥 **Emotional dysregulation** creates chronic stress on your nervous system"
    ]
  },
  "crash": {
    "title": "The Crash",
    "steps": [
      "You feel exhausted even after sleeping",
      "You need caffeine just to function at baseline",
      "You feel drained from everyday tasks that seem easy for others",
      "Afternoon crashes hit regardless of how much rest you got"
    ]
  },
  "shame_cycle": {
    "title": "The Shame Cycle",
    "content": "Society tells you tiredness means laziness, so you push harder and burn out faster"
  }
}'
WHERE loop_name = 'Constantly Tired';

-- 3. Workout Avoidance
UPDATE complex_loops_content
SET framework_sections = '{
  "demand": {
    "title": "The Demand",
    "content": "Exercise requires executive function, energy, and sensory tolerance"
  },
  "overextension": {
    "title": "The Overextension",
    "content": "Your ADHD brain miscalculates the true cost of working out",
    "mechanisms": [
      "🧩 **Executive dysfunction** makes the multi-step process of exercising overwhelming",
      "🎭 **Sensory sensitivity** to clothing, sounds, or environments creates additional barriers",
      "🎯 **All-or-nothing thinking** makes anything less than a \"real workout\" feel pointless",
      "⚡ **Energy miscalculation** doesn''t account for the activation energy required"
    ]
  },
  "crash": {
    "title": "The Crash",
    "steps": [
      "You plan to exercise but realize you''re already depleted",
      "The thought of changing clothes, going somewhere, and being active feels impossible",
      "You skip the workout and feel guilty about \"being lazy\"",
      "Shame makes future exercise feel even more loaded"
    ]
  },
  "shame_cycle": {
    "title": "The Shame Cycle",
    "content": "Physical inactivity affects mood and energy, making exercise feel even more necessary but harder to start"
  }
}'
WHERE loop_name = 'Workout Avoidance';

-- 4. Double-Booking Yourself
UPDATE complex_loops_content
SET framework_sections = '{
  "demand": {
    "title": "The Demand",
    "content": "Multiple commitments each feel manageable individually"
  },
  "overextension": {
    "title": "The Overextension",
    "content": "Your ADHD brain underestimates cumulative energy costs",
    "mechanisms": [
      "⚡ **Impulsivity** leads to saying yes before checking your schedule",
      "🧠 **Working memory** forgets existing commitments when new opportunities arise",
      "⏰ **Time blindness** makes it hard to estimate how long things actually take",
      "🎢 **Dopamine-seeking** makes new, exciting plans irresistible"
    ]
  },
  "crash": {
    "title": "The Crash",
    "steps": [
      "You suddenly realize you have three things scheduled for the same day",
      "Each commitment now feels overwhelming instead of exciting",
      "You''re forced to cancel on people last-minute",
      "Guilt and shame make you avoid future commitments"
    ]
  },
  "shame_cycle": {
    "title": "The Shame Cycle",
    "content": "Being seen as unreliable makes you either over-commit to prove yourself or under-commit out of fear"
  }
}'
WHERE loop_name = 'Double-Booking Yourself';

-- 5. Undereating
UPDATE complex_loops_content
SET framework_sections = '{
  "demand": {
    "title": "The Demand",
    "content": "Regular eating requires interoception, executive function, and sensory tolerance"
  },
  "overextension": {
    "title": "The Overextension",
    "content": "Your ADHD brain prioritizes other stimulation over body signals",
    "mechanisms": [
      "🎯 **Hyperfocus** makes you lose track of hunger cues and time",
      "🧩 **Executive dysfunction** makes meal planning and preparation feel overwhelming",
      "🎭 **Sensory sensitivities** can make food textures, smells, or tastes unbearable",
      "💊 **Stimulant medication** can suppress appetite as a side effect"
    ]
  },
  "crash": {
    "title": "The Crash",
    "steps": [
      "You suddenly realize you''ve only eaten once all day",
      "Low blood sugar creates brain fog, irritability, and fatigue",
      "The idea of preparing food feels overwhelming when you''re already depleted",
      "You grab something quick or skip eating entirely"
    ]
  },
  "shame_cycle": {
    "title": "The Shame Cycle",
    "content": "You feel \"broken\" for forgetting basic self-care, leading to more self-neglect and shame"
  }
}'
WHERE loop_name = 'Undereating';

-- Verify all Energy & Capacity frameworks are populated
SELECT loop_name, framework_title,
       CASE WHEN framework_sections IS NOT NULL THEN '✅ Framework Complete' ELSE '❌ Missing Framework' END as status
FROM complex_loops_content 
WHERE loop_type = 'energy_capacity'
ORDER BY loop_name;