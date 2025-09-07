-- Dopamine & Impulse Framework Implementation
-- Populate "The Dopamine Cycle" framework sections for all 5 dopamine/impulse loops

-- 1. Phone Scrolling
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "Understimulation, transition moment, or emotional discomfort"
  },
  "adhd_hijack": {
    "title": "The ADHD Hijack",
    "content": "Your brain seeks fast, predictable dopamine hits",
    "mechanisms": [
      "🎯 **Dopamine dysregulation** makes your brain constantly seek stimulation",
      "📱 **Hyperfocus** locks you into the scrolling pattern",
      "⏰ **Time blindness** erases awareness of minutes turning into hours",
      "🧩 **Executive dysfunction** can''t initiate the \"stop\" command"
    ]
  },
  "hyperfocus_trap": {
    "title": "The Hyperfocus Trap",
    "steps": [
      "You pick up your phone for \"just a quick check\"",
      "The infinite scroll triggers hyperfocus - phone becomes your entire world",
      "Each swipe promises the next hit of novelty or validation",
      "Hours pass in what feels like minutes"
    ]
  },
  "crash": {
    "title": "The Crash",
    "content": "You surface feeling overstimulated, time-wasted, and no closer to addressing the original need for stimulation"
  }
}'
WHERE loop_name = 'Phone Scrolling';

-- 2. Online Shopping
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "Emotional discomfort, boredom, or seeing something appealing"
  },
  "adhd_hijack": {
    "title": "The ADHD Hijack",
    "content": "Shopping provides instant gratification for your dopamine-starved brain",
    "mechanisms": [
      "⚡ **Impulsivity** overrides consideration of budget, need, or consequences",
      "🎯 **Dopamine-seeking** makes the anticipation of purchase intensely rewarding",
      "🧩 **Executive dysfunction** impairs ability to pause and evaluate the decision",
      "💥 **Emotional regulation** uses shopping as a quick mood fix"
    ]
  },
  "hyperfocus_trap": {
    "title": "The Hyperfocus Trap",
    "steps": [
      "You open a shopping site for \"one specific thing\"",
      "Recommendations and deals trigger hyperfocus on browsing",
      "Each item in your cart feels necessary and urgent",
      "The purchase provides a brief dopamine hit"
    ]
  },
  "crash": {
    "title": "The Crash",
    "content": "Buyer''s remorse, financial stress, and clutter don''t address the underlying need for stimulation or emotional regulation"
  }
}'
WHERE loop_name = 'Online Shopping';

-- 3. Social Media
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "Loneliness, FOMO, boredom, or need for validation"
  },
  "adhd_hijack": {
    "title": "The ADHD Hijack",
    "content": "Social media algorithms are designed to exploit dopamine vulnerabilities",
    "mechanisms": [
      "🎯 **Dopamine-seeking** craves the unpredictable rewards of likes, comments, and new content",
      "⚖️ **Comparison trap** triggers emotional dysregulation and keeps you scrolling",
      "😰 **FOMO** makes stopping feel like you''ll miss something important",
      "⏰ **Time blindness** makes \"just 5 minutes\" become hours"
    ]
  },
  "hyperfocus_trap": {
    "title": "The Hyperfocus Trap",
    "steps": [
      "You open an app to \"quickly check\" notifications",
      "The algorithm feeds you content designed to keep you engaged",
      "Comparison with others triggers emotional reactions that demand more scrolling",
      "You get stuck in a loop of consuming content that makes you feel worse"
    ]
  },
  "crash": {
    "title": "The Crash",
    "content": "You feel overstimulated, disconnected from real life, and often worse about yourself than when you started"
  }
}'
WHERE loop_name = 'Social Media';

-- 4. Screen Time
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "Understimulation, emotional overwhelm, or transition avoidance"
  },
  "adhd_hijack": {
    "title": "The ADHD Hijack",
    "content": "Screens provide reliable, instant stimulation for your dysregulated dopamine system",
    "mechanisms": [
      "🎯 **Dopamine dysregulation** makes screens intensely rewarding and hard to stop",
      "⏰ **Time blindness** causes you to lose track of how long you''ve been online",
      "📱 **Hyperfocus** makes it feel impossible to disengage, even when you want to",
      "🧠 **Understimulation** leads your brain to seek excitement and novelty via screens"
    ]
  },
  "hyperfocus_trap": {
    "title": "The Hyperfocus Trap",
    "steps": [
      "You turn to screens for \"just a few minutes\" of stimulation or escape",
      "The content triggers hyperfocus - screen time becomes all-consuming",
      "Each video, game level, or post promises the next dopamine hit",
      "Hours disappear as your brain chases that elusive satisfaction"
    ]
  },
  "crash": {
    "title": "The Crash",
    "content": "You emerge feeling mentally foggy, physically restless, and guilty about \"wasted\" time, but no more regulated than when you started"
  }
}'
WHERE loop_name = 'Screen Time';

-- 5. Overeating
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "Stress, boredom, emotional overwhelm, or understimulation"
  },
  "adhd_hijack": {
    "title": "The ADHD Hijack",
    "content": "Food provides reliable dopamine when your brain is seeking regulation",
    "mechanisms": [
      "⚡ **Impulsivity** overrides hunger cues and mindful eating",
      "🎯 **Dopamine-seeking** makes high-reward foods (sugar, fat, salt) irresistible",
      "💥 **Emotional dysregulation** uses food as a quick mood stabilizer",
      "🧩 **Executive dysfunction** impairs ability to pause between urge and action"
    ]
  },
  "hyperfocus_trap": {
    "title": "The Hyperfocus Trap",
    "steps": [
      "You start eating to address an emotional or physical need",
      "The food provides immediate dopamine and comfort",
      "Hyperfocus on eating means losing awareness of fullness cues",
      "The behavior becomes automatic during stress or boredom"
    ]
  },
  "crash": {
    "title": "The Crash",
    "content": "Physical discomfort, shame, and energy crashes don''t address the underlying need for dopamine or emotional regulation"
  }
}'
WHERE loop_name = 'Overeating';

-- Verify all Dopamine & Impulse frameworks are populated
SELECT loop_name, framework_title,
       CASE WHEN framework_sections IS NOT NULL THEN '✅ Framework Complete' ELSE '❌ Missing Framework' END as status
FROM complex_loops_content 
WHERE loop_type = 'dopamine_impulse'
ORDER BY loop_name;