-- Schema Update for Loop-Type-Specific Sections
-- Add support for customized "under the hood" explanations based on loop type

-- Step 1: Add loop type classification
ALTER TABLE complex_loops_content 
ADD COLUMN IF NOT EXISTS loop_type TEXT CHECK (loop_type IN (
  'time_transition',
  'analysis_decision', 
  'social_relationship',
  'dopamine_impulse',
  'energy_capacity',
  'task_communication'
));

-- Step 2: Add framework-specific content structure
ALTER TABLE complex_loops_content
ADD COLUMN IF NOT EXISTS framework_sections JSONB DEFAULT '{}';

-- Step 3: Add metadata for framework titles and structures
ALTER TABLE complex_loops_content
ADD COLUMN IF NOT EXISTS framework_title TEXT;

-- Step 4: Populate loop types for existing content
UPDATE complex_loops_content SET loop_type = 'time_transition', framework_title = 'The Time Trap'
WHERE loop_name IN ('Bedtime Procrastination', 'Waiting Mode', 'Chronic Lateness', 'Sleeping Through Alarms');

UPDATE complex_loops_content SET loop_type = 'analysis_decision', framework_title = 'The Thinking Spiral' 
WHERE loop_name IN ('Analysis Paralysis', 'Decision Overwhelm', 'Perfectionism Cycles');

UPDATE complex_loops_content SET loop_type = 'social_relationship', framework_title = 'The Social Spiral'
WHERE loop_name IN ('Rejection Sensitivity Loops', 'Difficult Conversations', 'People-Pleasing Burnout', 'Last-Minute Cancelling', 'Friendships & ADHD');

UPDATE complex_loops_content SET loop_type = 'dopamine_impulse', framework_title = 'The Dopamine Cycle'
WHERE loop_name IN ('Phone Scrolling', 'ADHD & Social Media', 'Online Shopping', 'Overeating');

UPDATE complex_loops_content SET loop_type = 'energy_capacity', framework_title = 'The Depletion Pattern'
WHERE loop_name IN ('Masking Exhaustion', 'Constantly Tired', 'Workout Avoidance', 'Double-Booking Yourself');

UPDATE complex_loops_content SET loop_type = 'task_communication', framework_title = 'The Avoidance Spiral'
WHERE loop_name IN ('Email Overwhelm', 'Replying to Texts', 'Job Searching', 'Missed Appointments');

-- Handle edge cases and remaining loops
UPDATE complex_loops_content SET loop_type = 'time_transition', framework_title = 'The Time Trap'
WHERE loop_name IN ('Can''t Fall Asleep') AND loop_type IS NULL;

UPDATE complex_loops_content SET loop_type = 'energy_capacity', framework_title = 'The Depletion Pattern'  
WHERE loop_name IN ('Undereating') AND loop_type IS NULL;

UPDATE complex_loops_content SET loop_type = 'social_relationship', framework_title = 'The Social Spiral'
WHERE loop_name IN ('Intimacy & Connection') AND loop_type IS NULL;

-- Sample framework_sections structure for Waiting Mode (Time Trap)
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

-- Sample framework_sections structure for Analysis Paralysis (Thinking Spiral)
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "You need to make a decision (buy something, choose a path, start a project)"
  },
  "adhd_amplification": {
    "title": "The ADHD Amplification",
    "content": "Your brain craves certainty but struggles with executive function",
    "mechanisms": [
      "🧩 **Executive dysfunction** makes weighing options feel overwhelming",
      "🧠 **Working memory** gets overloaded juggling all the possibilities",
      "💥 **Perfectionism + RSD** make the \"wrong\" choice feel catastrophic",
      "💥 **Low dopamine** creates shutdown when there''s no clear \"best\" answer"
    ]
  },
  "mental_traffic_jam": {
    "title": "The Mental Traffic Jam", 
    "steps": [
      "You start researching to find the \"perfect\" choice",
      "Each new piece of information spawns 3 more questions",
      "Options multiply instead of narrowing down",
      "Your brain gets stuck in analysis mode, unable to switch to action"
    ]
  },
  "paralysis": {
    "title": "The Paralysis",
    "content": "Research becomes a way to avoid the anxiety of deciding, but never actually reduces it"
  }
}'
WHERE loop_name = 'Analysis Paralysis';

-- Create index for efficient querying by loop type
CREATE INDEX IF NOT EXISTS idx_complex_loops_loop_type ON complex_loops_content(loop_type);

-- Verify the updates
SELECT loop_name, loop_type, framework_title, 
       CASE WHEN framework_sections IS NOT NULL THEN 'Has Framework' ELSE 'Needs Framework' END as framework_status
FROM complex_loops_content 
ORDER BY loop_type, loop_name;