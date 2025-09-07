-- Task & Communication Framework Implementation
-- Populate "The Avoidance Spiral" framework sections for all 4 task/communication loops

-- 1. Email Overwhelm
UPDATE complex_loops_content
SET framework_sections = '{
  "task": {
    "title": "The Task",
    "content": "Email seems simple but requires complex executive processing"
  },
  "executive_breakdown": {
    "title": "The Executive Breakdown",
    "content": "Each email needs sorting, prioritizing, decision-making, and follow-through",
    "mechanisms": [
      "🧩 **Executive dysfunction** breaks down at the \"triage and respond\" stage",
      "🧠 **Working memory** forgets the context by the time you finish reading",
      "💥 **Perfectionism** makes every response feel high-stakes",
      "⏰ **Time blindness** makes \"quick email check\" consume hours"
    ]
  },
  "avoidance": {
    "title": "The Avoidance",
    "steps": [
      "You open your inbox and feel immediately overwhelmed by the volume",
      "Each email spawns mental tasks you can''t track or prioritize",
      "You close the inbox to \"deal with it later\" when you have more energy",
      "Emails accumulate faster than you can process them"
    ]
  },
  "mountain_effect": {
    "title": "The Mountain Effect",
    "content": "What started as manageable communication becomes an insurmountable pile that proves you''re \"bad at adulting\""
  }
}'
WHERE loop_name = 'Email Overwhelm';

-- 2. Replying to Texts
UPDATE complex_loops_content
SET framework_sections = '{
  "task": {
    "title": "The Task",
    "content": "Texting appears effortless but requires emotional and executive energy"
  },
  "executive_breakdown": {
    "title": "The Executive Breakdown",
    "content": "Each message needs processing, tone interpretation, response crafting, and sending",
    "mechanisms": [
      "🧠 **Working memory** drops the message context between reading and responding",
      "🧩 **Executive dysfunction** struggles with the \"craft appropriate response\" step",
      "💥 **Social anxiety** makes tone interpretation and response crafting stressful",
      "⏰ **Time blindness** makes you lose track of how long you''ve been \"meaning to respond\""
    ]
  },
  "avoidance": {
    "title": "The Avoidance",
    "steps": [
      "You read a message and mentally compose a reply",
      "You get distracted before sending and forget you never actually responded",
      "Too much time passes, making the response feel awkward or insufficient",
      "Shame about delayed response makes replying feel even more loaded"
    ]
  },
  "mountain_effect": {
    "title": "The Mountain Effect",
    "content": "Your relationships suffer from communication gaps that feel intentional but are actually neurological"
  }
}'
WHERE loop_name = 'Replying to Texts';

-- 3. Job Searching
UPDATE complex_loops_content
SET framework_sections = '{
  "task": {
    "title": "The Task",
    "content": "Job applications require executive function, emotional regulation, and sustained effort"
  },
  "executive_breakdown": {
    "title": "The Executive Breakdown",
    "content": "Each application involves multiple complex steps with high emotional stakes",
    "mechanisms": [
      "🧩 **Executive dysfunction** makes planning, sequencing, and task initiation difficult",
      "⏰ **Time blindness** causes missed deadlines and unrealistic estimates",
      "🔁 **Procrastination** and shame trap you in avoidance",
      "💥 **Emotional dysregulation** and RSD make feedback feel painful or unbearable"
    ]
  },
  "avoidance": {
    "title": "The Avoidance",
    "steps": [
      "You feel dread every time you think about applying",
      "You open a job posting and immediately feel overwhelmed",
      "You rewrite your resume 37 times and never send it",
      "One rejection sends you into avoidance mode for weeks"
    ]
  },
  "mountain_effect": {
    "title": "The Mountain Effect",
    "content": "Job searching becomes proof that you''re unemployable, when it''s actually just proof that your brain needs different systems"
  }
}'
WHERE loop_name = 'Job Searching';

-- 4. Missed Appointments
UPDATE complex_loops_content
SET framework_sections = '{
  "task": {
    "title": "The Task",
    "content": "Appointments require memory, planning, and transition management"
  },
  "executive_breakdown": {
    "title": "The Executive Breakdown",
    "content": "Keeping appointments involves multiple executive functions working in sequence",
    "mechanisms": [
      "🧠 **Working memory** drops info unless it''s constantly visible",
      "💥 **Impulsivity and distraction** lead to losing track of the day",
      "🔄 **Transition struggles** mean shifting from one task to another can derail follow-through",
      "⏰ **Time blindness** makes \"in 2 hours\" feel both forever and immediate"
    ]
  },
  "avoidance": {
    "title": "The Avoidance",
    "steps": [
      "You book an appointment and instantly forget about it",
      "You get distracted or hyperfocused on something else",
      "You realize you missed it hours or days later",
      "Shame makes you avoid rescheduling, compounding the problem"
    ]
  },
  "mountain_effect": {
    "title": "The Mountain Effect",
    "content": "Missing appointments becomes evidence that you''re unreliable, making future scheduling feel more pressured and likely to fail"
  }
}'
WHERE loop_name = 'Missed Appointments';

-- Verify all Task & Communication frameworks are populated
SELECT loop_name, framework_title,
       CASE WHEN framework_sections IS NOT NULL THEN '✅ Framework Complete' ELSE '❌ Missing Framework' END as status
FROM complex_loops_content 
WHERE loop_type = 'task_communication'
ORDER BY loop_name;

-- Final verification: All 27 complex loops should now have framework sections
SELECT 
    loop_type,
    framework_title,
    COUNT(*) as loop_count,
    COUNT(CASE WHEN framework_sections IS NOT NULL THEN 1 END) as frameworks_complete
FROM complex_loops_content
WHERE loop_type IS NOT NULL
GROUP BY loop_type, framework_title
ORDER BY loop_type;