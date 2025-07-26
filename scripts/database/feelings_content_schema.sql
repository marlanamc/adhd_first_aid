-- Feelings Content Table Schema
-- Add this to your existing Supabase database

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

-- Sample data insert for "Ashamed" as test case
INSERT INTO feelings_content (
  feeling_name,
  subtitle,
  intro_paragraph,
  gentle_advice,
  stern_advice,
  adhd_reasons
) VALUES (
  'Ashamed',
  'It''s not a character flaw • It''s not proof you''re broken • It''s ADHD meeting impossible standards, rejection, and years of internalized blame.',
  'Shame hits hard when you feel like you''ve let someone down, especially yourself. For many with ADHD, shame is a chronic background noise that whispers you''re fundamentally flawed. But shame isn''t truth, it''s your nervous system trying to protect you from future rejection by making you hyperaware of every mistake.',
  'You were doing your best with the tools you had. Shame doesn''t mean you''re bad, it means you care. That''s not something to fix, it''s something to honor while building better support. Your brain works differently, and the world wasn''t designed for different. That''s not your fault.',
  'Stop letting shame write your story. You messed up? Own it, learn, and move forward. You can''t grow if you''re hiding from your own life. Shame is just fear wearing a disguise, and you''re braver than your fear thinks you are.',
  ARRAY[
    'Chronic lateness and disorganization erode self-trust over time',
    'Rejection Sensitivity (RSD) turns small slip-ups into intense self-criticism',
    'Working memory gaps make it easy to forget what matters, and blame yourself after',
    'Masking for long periods leads to identity confusion and self-doubt',
    'Executive dysfunction feels like moral failure to others (and yourself)',
    'Years of being told to "just try harder" creates deep internalized blame'
  ]
);