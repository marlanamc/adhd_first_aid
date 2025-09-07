-- Time & Transition Framework Implementation
-- Populate "The Time Trap" framework sections for all 5 time/transition loops

-- 1. Waiting Mode
UPDATE complex_loops_content 
SET framework_sections = '{
  "setup": {
    "title": "The Setup",
    "content": "You have something scheduled later (appointment, meeting, social event)"
  },
  "adhd_response": {
    "title": "The ADHD Response", 
    "content": "Your brain can''t hold \"now\" and \"later\" simultaneously",
    "mechanisms": [
      "⏰ **Time blindness** makes 2 hours feel infinite or instant",
      "🧩 **Executive dysfunction** can''t plan around the appointment", 
      "🧠 **Working memory** drops current tasks to \"hold space\" for later"
    ]
  },
  "cascade": {
    "title": "The Cascade",
    "steps": [
      "You become hyperaware of the clock but lose sense of actual duration",
      "Short tasks feel \"not worth starting\" because they might make you late",
      "Long tasks feel impossible because you can''t focus with something looming", 
      "You''re frozen between now and then, unable to engage with either"
    ]
  },
  "loop": {
    "title": "The Loop",
    "content": "The more you check the clock, the more fragmented your time sense becomes, making you feel even more stuck"
  }
}'
WHERE loop_name = 'Waiting Mode';

-- 2. Bedtime Procrastination
UPDATE complex_loops_content 
SET framework_sections = '{
  "setup": {
    "title": "The Setup",
    "content": "You''re tired but can''t stop scrolling, watching, or doing \"just one more thing\""
  },
  "adhd_response": {
    "title": "The ADHD Response", 
    "content": "Nighttime amplifies time blindness and dopamine-seeking",
    "mechanisms": [
      "🕰️ **Time blindness** makes you underestimate how late it is",
      "📱 **Hyperfocus** keeps you locked into stimulating activities",
      "🚪 **Transition trouble** makes shifting to bedtime feel like hitting a wall",
      "😤 **Revenge bedtime** happens when you''re reclaiming \"me time\" after a stressful day"
    ]
  },
  "cascade": {
    "title": "The Cascade",
    "steps": [
      "Your brain seeks stimulation right when it should be winding down",
      "Each \"10 more minutes\" erases awareness of actual time passing",
      "Racing thoughts ramp up just when you try to be still",
      "Tomorrow''s overwhelm makes tonight feel like your last chance for fun"
    ]
  },
  "loop": {
    "title": "The Loop",
    "content": "Poor sleep makes the next day harder, increasing your need for nighttime escape"
  }
}'
WHERE loop_name = 'Bedtime Procrastination';

-- 3. Chronic Lateness
UPDATE complex_loops_content 
SET framework_sections = '{
  "setup": {
    "title": "The Setup",
    "content": "You know you need to leave at 2:00 PM, it''s 1:45 PM, you think \"plenty of time\""
  },
  "adhd_response": {
    "title": "The ADHD Response", 
    "content": "Time estimation fails catastrophically",
    "mechanisms": [
      "⏰ **Time blindness** makes 15 minutes feel like an hour",
      "🧩 **Executive dysfunction** can''t sequence getting-ready tasks",
      "🚪 **Transition paralysis** makes stopping current activity nearly impossible"
    ]
  },
  "cascade": {
    "title": "The Cascade",
    "steps": [
      "You underestimate how long each step takes (shower, find keys, drive there)",
      "\"One more thing\" syndrome kicks in - just answer this email, just tidy this",
      "Suddenly it''s 2:10 and you''re not even dressed",
      "Panic mode creates chaos, making you forget items and move slower"
    ]
  },
  "loop": {
    "title": "The Loop",
    "content": "Being late creates shame and anxiety, which makes time management even harder next time"
  }
}'
WHERE loop_name = 'Chronic Lateness';

-- 4. Sleeping Through Alarms
UPDATE complex_loops_content 
SET framework_sections = '{
  "setup": {
    "title": "The Setup",
    "content": "You set 5 alarms but somehow sleep through all of them"
  },
  "adhd_response": {
    "title": "The ADHD Response", 
    "content": "Your circadian rhythm and executive function are out of sync",
    "mechanisms": [
      "🌙 **Circadian rhythm disruption** makes your natural sleep-wake cycle irregular",
      "💤 **Sleep inertia** from poor sleep quality makes waking feel impossible",
      "🧩 **Executive dysfunction** impairs the decision-making needed to get out of bed",
      "⏰ **Time blindness** distorts your sense of morning urgency"
    ]
  },
  "cascade": {
    "title": "The Cascade",
    "steps": [
      "Late bedtime (from bedtime procrastination) creates sleep debt",
      "ADHD brain doesn''t produce clear \"wake up\" signals at alarm time",
      "Each snooze feels like \"just 5 more minutes\" but becomes 30",
      "You wake up groggy and behind schedule, rushing through morning"
    ]
  },
  "loop": {
    "title": "The Loop",
    "content": "Poor morning routine makes the whole day feel chaotic, leading to more bedtime procrastination"
  }
}'
WHERE loop_name = 'Sleeping Through Alarms';

-- 5. Can''t Fall Asleep
UPDATE complex_loops_content 
SET framework_sections = '{
  "setup": {
    "title": "The Setup",
    "content": "You''re lying in bed physically tired but your mind is racing and won''t quiet"
  },
  "adhd_response": {
    "title": "The ADHD Response", 
    "content": "Your brain becomes most active when you want it to rest",
    "mechanisms": [
      "🧠 **Racing thoughts** and hyperactivity peak when you try to wind down",
      "💥 **Emotional dysregulation** makes worries feel bigger at night",
      "🎢 **Dopamine dysregulation** keeps your brain seeking stimulation",
      "🌙 **Circadian rhythm disruption** from ADHD affects natural sleep patterns"
    ]
  },
  "cascade": {
    "title": "The Cascade",
    "steps": [
      "You lie down and suddenly remember everything you forgot to do",
      "Worry thoughts multiply and feel more urgent in the dark",
      "You check your phone \"just for a minute\" and get sucked in",
      "Each failed attempt to sleep creates more anxiety about sleeping"
    ]
  },
  "loop": {
    "title": "The Loop",
    "content": "Sleep anxiety makes falling asleep harder, which creates more sleep anxiety"
  }
}'
WHERE loop_name = 'Can''t Fall Asleep';

-- Verify all Time & Transition frameworks are populated
SELECT loop_name, framework_title,
       CASE WHEN framework_sections IS NOT NULL THEN '✅ Framework Complete' ELSE '❌ Missing Framework' END as status
FROM complex_loops_content 
WHERE loop_type = 'time_transition'
ORDER BY loop_name;