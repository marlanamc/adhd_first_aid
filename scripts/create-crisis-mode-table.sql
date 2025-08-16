-- Create crisis_mode_feelings table
CREATE TABLE IF NOT EXISTS crisis_mode_feelings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feeling_name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  strategies JSONB NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE crisis_mode_feelings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on crisis_mode_feelings"
ON crisis_mode_feelings FOR SELECT
USING (true);

-- Create policy for authenticated insert/update access (for admin operations)
CREATE POLICY "Allow authenticated insert/update access on crisis_mode_feelings"
ON crisis_mode_feelings FOR ALL
USING (auth.role() = 'authenticated');

-- Insert crisis mode feelings data
INSERT INTO crisis_mode_feelings (feeling_name, description, strategies, icon) VALUES
('Anxious', 'You don''t have to solve everything at once. Your brain needs safety before clarity.', '[
  "Stand up and shake your arms out for 15 seconds.",
  "Look around and name 3 things that _are_ okay right now.",
  "Hold something cold — a drink, ice, wet paper towel.",
  "Say this out loud: \"Anxiety is a signal, not a prophecy.\"",
  "Play one song you know every word to and sing it."
]'::jsonb, 'Zap'),

('Ashamed', 'You are not a failure. You are a human having a hard time.', '[
  "Put your hand on your heart and whisper: \"I''m still worthy.\"",
  "Do one tiny act of care (brush teeth, change clothes, wash face).",
  "Picture yourself at 6 years old. Would you speak to them like this?",
  "Text a friend: \"Can I get a ''you''re not a terrible person'' pep talk?\"",
  "Write down what _shame is saying_ — then write what''s actually true."
]'::jsonb, 'Heart'),

('Burned Out', 'You''re not lazy. You''re overextended. You''ve been running on empty.', '[
  "Lay down for 10 minutes with no phone, no guilt.",
  "Take a shower in the dark. Let yourself disappear for a moment.",
  "Place one hand on your chest, one on your belly, and breathe.",
  "Do _one_ soft thing: light a candle, put on a cozy shirt, dim the lights.",
  "Whisper: \"I''m allowed to step back without giving up.\""
]'::jsonb, 'Flame'),

('Defeated', 'It''s okay to rest. You haven''t failed — you''ve just hit a wall.', '[
  "Sit on the floor. Sometimes grounding literally helps.",
  "Drink something with flavor. Let it wake up your senses.",
  "Say out loud: \"I feel defeated. That doesn''t mean I _am_ defeated.\"",
  "Pause the problem. Can you set it down for 1 heart?",
  "Move at half speed. You''re not out — just recalibrating."
]'::jsonb, 'Mountain'),

('Drained', 'You don''t need to push through. You need a plug to recharge.', '[
  "Close your eyes for 5 minutes — no scrolling.",
  "Do one cozy thing: blanket burrito, soft music, low light.",
  "Sip something warm or high-electrolyte. Let your body know it''s safe.",
  "Say this out loud: \"My battery is low. I don''t need to earn rest.\"",
  "Cancel one thing. Right now. Permission granted."
]'::jsonb, 'Battery'),

('Forgetful', 'You''re not broken. Your brain just misfiles things sometimes.', '[
  "Start a \"holding pen\" — brain dump _everything_ without judgment.",
  "Set a timer for 10 minutes: \"Find what I forgot.\"",
  "Say this out loud: \"I forgot — that doesn''t mean I failed.\"",
  "Text someone: \"Can you remind me about [thing] later?\"",
  "Give your brain a cue: \"What was I doing before I blanked?\""
]'::jsonb, 'Brain'),

('Frustrated', 'Of course you''re frustrated. You''re trying — and it still feels hard.', '[
  "Step away for 90 seconds and move your body.",
  "Say: \"I''m allowed to be mad. That doesn''t mean I''m doing it wrong.\"",
  "Hold an ice cube or splash cold water — reset your nervous system.",
  "Blast one aggressive song. Bonus points for yelling the chorus.",
  "Write down the rant your brain is screaming. Don''t edit. Let it out."
]'::jsonb, 'AlertTriangle'),

('Guilty', 'Guilt is a signal — not a sentence. You''re not the worst.', '[
  "Say out loud: \"I messed up — but I can still make things right.\"",
  "Write one thing you _can_ do to repair or reset.",
  "Text someone: \"I feel bad about something. Can I talk it through?\"",
  "Offer kindness to something else — a pet, a plant, yourself.",
  "Cross out this thought: \"I should''ve known better.\" Replace it with: \"I''m learning.\""
]'::jsonb, 'Scale'),

('Hopeless', 'Hope doesn''t have to come from you right now. Borrow some.', '[
  "Call or text someone who makes you feel more human.",
  "Watch a video of something growing or beginning.",
  "Say: \"I can''t see a way through yet. But that doesn''t mean there isn''t one.\"",
  "Put on a comfort show and let yourself zone out — guilt-free.",
  "Wrap yourself in a blanket and whisper, \"I get to survive this, not solve it today.\""
]'::jsonb, 'Sun'),

('Lonely', 'You''re not unlovable. You''re disconnected — and that can be rebuilt.', '[
  "Text someone a random meme or \"thinking of you\"",
  "Hug a pillow or stuffed animal. Let yourself _feel_ the need.",
  "Listen to a podcast or YouTube video with voices you like.",
  "Send a selfie to a friend — no caption needed.",
  "Say: \"I feel lonely. That doesn''t mean I''m alone forever.\""
]'::jsonb, 'Users'),

('Mental Fog', 'You''re not lazy or dumb. Your brain is buffering.', '[
  "Say out loud: \"I''m in a fog — not a failure.\"",
  "Walk to a different room and back. Let your brain reorient.",
  "Drink a glass of cold water.",
  "Write one word on a sticky note: \"Start.\"",
  "Name one thing you _can_ do on autopilot. Do that first."
]'::jsonb, 'Cloud'),

('Misunderstood', 'You''re not too much. You''re just not being seen clearly right now.', '[
  "Write down what you _wish_ someone would say to you.",
  "Whisper: \"I know who I am, even if they don''t.\"",
  "Voice memo a rant — say everything you couldn''t say aloud.",
  "Put on music that _gets you_. Let it speak for you.",
  "Remind yourself: \"Even when I feel alone, I still exist fully.\""
]'::jsonb, 'Eye'),

('Numb', 'Not feeling is a form of feeling. Your brain might be protecting you.', '[
  "Touch something cold or textured — ice, stone, salt, bark.",
  "Inhale a strong scent (peppermint, vinegar, citrus).",
  "Take a warm shower, even if it feels robotic.",
  "Name 5 objects around you, just to anchor in your body.",
  "Play a playlist of songs that used to move you — and notice _anything_ you feel."
]'::jsonb, 'Shield'),

('Overstimulated', 'Your brain is full. You need quiet, not more input.', '[
  "Mute everything: devices, lights, notifications, even socks.",
  "Sit in a dark room or close your eyes for 2 minutes.",
  "Massage your jaw, temples, or scalp — slowly.",
  "Put your phone in a drawer. No apps. No noise.",
  "Do one repetitive task (fold laundry, wipe a counter) and breathe."
]'::jsonb, 'VolumeX'),

('Overwhelmed', 'Everything is too much. That doesn''t mean _you_ are too much.', '[
  "Put your hand on your heart and say: \"One thing at a time.\"",
  "Pick up ONE object and put it where it belongs.",
  "Say this out loud: \"I can''t do it all. But I can begin.\"",
  "Make a messy brain dump — no structure, no order.",
  "Set a timer for 5 minutes. Only decide what to do _next_."
]'::jsonb, 'Waves'),

('Rejected', 'Rejection hurts — even when it''s tiny, even when it''s not real.', '[
  "Say: \"This feels personal. It might not be.\"",
  "Text someone you trust and ask: \"Can you remind me I''m not awful?\"",
  "Hold something cold and breathe through the sting.",
  "Write: \"What happened\" / \"What I made it mean\" — and separate the two.",
  "Write a letter to your younger self. Say what you wish someone said then."
]'::jsonb, 'UserX'),

('Restless', 'That buzzing in your body isn''t wrong — it''s energy looking for a place to go.', '[
  "March in place or shadow box for 60 seconds.",
  "Try a quick logic game, riddle, or puzzle — give your brain a job.",
  "Scribble furiously on paper for one full minute.",
  "Reorganize a drawer, shelf, or bag — speed counts, not neatness.",
  "Say out loud: \"I''m not broken. I''m just full.\""
]'::jsonb, 'Move'),

('Scattered', 'You''re not flaky — your thoughts are just trying to fly in five directions at once.', '[
  "Write _everything_ on your mind into a chaotic list.",
  "Clap your hands three times. Say: \"Right here. Right now.\"",
  "Do a micro-task in one corner of the room. Stay there.",
  "Start a voice memo and narrate what''s happening. No judgment.",
  "Pick _one_ thing and whisper: \"I choose you first.\""
]'::jsonb, 'Shuffle'),

('Stressed', 'You''re carrying a lot. You deserve to set some of it down — even briefly.', '[
  "Press your palms together and exhale slowly.",
  "Take a 10-minute phone break. Put it face down.",
  "Stand up and stretch your arms as wide as you can. Then drop them.",
  "Say: \"I am not the sum of my stress.\"",
  "Play white noise, rain, or brown noise — something that softens the edges."
]'::jsonb, 'Gauge'),

('Stuck', 'Stuck doesn''t mean broken. It means pause. Pauses can end.', '[
  "Look at yourself in the mirror and say: \"Let''s just start with one breath.\"",
  "Pick the smallest task possible — even \"stand up\" counts.",
  "Move _something_ from one place to another. Doesn''t matter what.",
  "Write: \"I feel stuck because…\" until the next word comes.",
  "Say: \"Motion creates motion. I just need a flicker.\""
]'::jsonb, 'Lock'),

('Tense', 'Your body''s holding the weight. Let it know it''s allowed to soften.', '[
  "Clench every muscle for 5 seconds, then release. Repeat twice.",
  "Exhale longer than you inhale — try 4 in, 6 out.",
  "Roll your neck and shoulders slowly, with intention.",
  "Place your hand on your chest and say: \"You''re safe now.\"",
  "Lie down flat on the floor. Let gravity hold you."
]'::jsonb, 'Muscle'),

('Wired', 'You''re not energized — you''re overstimulated. Time to land.', '[
  "Dim the lights or shut the curtains. Signal \"wind down.\"",
  "Put on cozy socks or a hoodie — compress and calm.",
  "Hold an ice pack or frozen peas — instant nervous system check.",
  "Say: \"I don''t need to act on every impulse.\"",
  "Play a low-sensory game (solitaire, sudoku) or stare at a lava lamp video."
]'::jsonb, 'Wifi');

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_crisis_mode_feelings_name ON crisis_mode_feelings(feeling_name);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crisis_mode_feelings_updated_at
    BEFORE UPDATE ON crisis_mode_feelings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE crisis_mode_feelings IS 'Crisis mode feelings with immediate coping strategies';
COMMENT ON COLUMN crisis_mode_feelings.feeling_name IS 'Name of the crisis feeling state';
COMMENT ON COLUMN crisis_mode_feelings.description IS 'Supportive description of the feeling state';
COMMENT ON COLUMN crisis_mode_feelings.strategies IS 'Array of immediate coping strategies';
COMMENT ON COLUMN crisis_mode_feelings.icon IS 'Lucide icon name for the feeling';