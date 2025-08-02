-- Update Feelings Content Table Schema
-- Run this to update your existing table structure

-- First, drop the existing table to update the schema
-- UNCOMMENT the line below to drop the existing table:
-- DROP TABLE IF EXISTS feelings_content;

-- Create the updated table with step_sections field
CREATE TABLE feelings_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  feeling_name text NOT NULL UNIQUE,
  subtitle text NOT NULL,
  intro_paragraph text NOT NULL,
  gentle_advice text NOT NULL,
  stern_advice text NOT NULL,
  adhd_reasons text[] NOT NULL, -- Array of bullet points
  step_sections jsonb, -- Array of step objects with title, content, tips
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create index for faster lookups by feeling name
CREATE INDEX idx_feelings_content_feeling_name ON feelings_content(feeling_name);

-- Enable Row Level Security (RLS) - matching your existing pattern
ALTER TABLE feelings_content ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (matching your other tables)
CREATE POLICY "Enable read access for all users" ON feelings_content
FOR SELECT USING (true);

-- Create policy for public insert access (if you want to allow submissions)
CREATE POLICY "Enable insert access for all users" ON feelings_content
FOR INSERT WITH CHECK (true);

-- Create policy for public update access (if needed)
CREATE POLICY "Enable update access for all users" ON feelings_content
FOR UPDATE USING (true);

-- Complete "Ashamed" data with all step sections
INSERT INTO feelings_content (
  feeling_name,
  subtitle,
  intro_paragraph,
  gentle_advice,
  stern_advice,
  adhd_reasons,
  step_sections
) VALUES (
  'Ashamed',
  'It''s not a character flaw, it''s not proof you''re broken • It''s ADHD meeting **impossible standards, rejection, and years of internalized blame**.',
  'Shame hits hard when you feel like you''ve let someone down, especially yourself. For many with ADHD, shame is a chronic background noise that whispers you''re fundamentally flawed. But shame isn''t truth, it''s your nervous system trying to protect you from future rejection by making you hyperaware of every mistake.',
  'You were doing your best with the tools you had. Shame doesn''t mean you''re bad, it means you care. That''s not something to fix, it''s something to honor while building better support. Your brain works differently, and the world wasn''t designed for different. That''s not your fault.',
  'Stop letting shame write your story. You messed up? Own it, learn, and move forward. You can''t grow if you''re hiding from your own life. Shame is just fear wearing a disguise, and you''re braver than your fear thinks you are.',
  ARRAY[
    'Cognitive overload: Too many decisions, tasks, or mental threads running at once',
    'Emotional flooding: Stress, anxiety, or big feelings can cloud thinking',
    'Physical depletion: Poor sleep, hunger, dehydration, or medication timing',
    'Sensory overwhelm: Too much noise, light, or stimulation draining your mental bandwidth',
    'Task switching fatigue: Jumping between too many different types of work',
    'Rejection Sensitivity (RSD): Turns small slip-ups into intense self-criticism'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧭",
      "title": "Recognize Anxiety as a Message, Not a Threat",
      "intro": "Your body knows **before** your mind does. Start by tuning in without judgment.",
      "try_this": [
        "Notice: \"Is my heart racing? Is my jaw clenched? Am I pacing or fidgeting?\"",
        "Name it to tame it: Say, \"I''m feeling anxious\" or \"I feel like something''s off.\"",
        "Write out the swirl: Brain dump your worries, or try a \"5-senses scan\" to ground yourself.",
        "Release it: Cry, stomp, rock, shake, movement helps process the energy of anxiety."
      ],
      "tip": "Anxiety isn''t about weakness, it''s about overwhelm. Let''s meet it with care, not shame."
    },
    {
      "number": 2,
      "emoji": "🌬️",
      "title": "Calm Your Mind-Body Loop with Soothing Input",
      "intro": "Your nervous system might be on red alert. Give it signals that you are safe.",
      "try_this": [
        "Move gently: Walk, stretch, shake out tension, or try somatic movement to release adrenaline.",
        "Breathe low and slow: Box breathing, 4-7-8, or extended exhales calm your whole system.",
        "Mindfulness check-in: Try the \"Three-Step Awareness\" (body → sound → breath), or a body scan.",
        "Sensory soothe: Noise-canceling headphones, calming music, or warm showers can help reset.",
        "Eat, hydrate, rest: Anxiety spikes when your biological needs aren''t met, fuel up and slow down."
      ],
      "tip": "Your body needs to _feel_ safety before your brain believes it."
    },
    {
      "number": 3,
      "emoji": "🔍",
      "title": "Challenge Anxiety-Driven Thoughts",
      "intro": "Anxiety feeds on future what-ifs and inner shoulds. Let''s shift the narrative.",
      "try_this": [
        "Add perspective: \"I''m having the thought that…\" to anxious stories. This creates distance and clarity.",
        "Flip the script: \"This feeling means I care\" or \"This is excitement in disguise.\"",
        "Shrink the threat: Instead of \"I''ll mess this up,\" try \"What''s the smallest next step?\"",
        "Reduce decisions: Create structure or defaults to ease mental load (e.g., a meal or outfit plan)."
      ],
      "tip": "You don''t have to believe every scary thought. You just have to notice and soften them."
    },
    {
      "number": 4,
      "emoji": "🚶‍♀️",
      "title": "Reclaim Control Through Small Action",
      "intro": "When anxiety makes everything feel unmanageable, do _less_, not more.",
      "try_this": [
        "Micro-step it: Break things into ridiculously small chunks. \"Open laptop\" counts.",
        "Try the 5-minute rule: Start the task for just 5 minutes. You can stop after, but often won''t need to.",
        "Find the win: Track even the smallest progress. Momentum quiets the \"what if\" noise.",
        "Build rhythms: Morning/evening routines or kairos rituals can signal safety and predictability."
      ],
      "tip": "Progress isn''t about effort, it''s about energy flow. Go small and steady."
    },
    {
      "number": 5,
      "emoji": "🧍‍♀️",
      "title": "Get Support and Create Space to Breathe",
      "intro": "Anxiety isolates. Reconnection, with yourself and others, breaks the cycle.",
      "try_this": [
        "Ask for help: Even just saying \"I''m overwhelmed\" to someone can let the pressure out.",
        "Find your people: Talk to someone who gets it. Or just text \"Anxiety Brain Today\"",
        "Set boundaries: Say \"I''m at capacity\" without guilt. Protect your energy with gentle firmness.",
        "Consider outside support: Coaching or therapy can help untangle chronic anxiety patterns.",
        "Let yourself rest: Rest isn''t earned. It''s maintenance. If stillness is scary, sit with it in short bursts."
      ],
      "tip": "You don''t have to \"earn\" calm. You''re allowed to feel safe now, even before the list is done."
    }
  ]'::jsonb
);