-- Insert Crisis Mode Barriers Data
-- Generated from crisis-mode/barrier_crisis_mode.md

INSERT INTO crisis_mode_barriers (barrier_name, description, strategies, icon) VALUES

('I Already Failed', 'You didn''t ruin it. You paused. Pauses can end.',
'["Say: \"Reset, not restart.\"", "Choose a re-start time (e.g., 3:15 pm) and set a timer.", "Do a 60-second reset (clear desk, close tabs, water).", "Write one line: \"Next right step is ___.\"", "Text someone: \"I''m jumping back in for 10 minutes. Hold me to it?\""]',
'XCircle'),

('I Can''t Start', 'Starting is the hard part. Make it microscopic.',
'["Do a **20-second action** (open doc, put shoes on, get bin).", "Set a **2-minute timer** — quit after if you want.", "Say: \"Just the first puzzle piece.\"", "Move the task into view (place item in doorway/desk).", "Whisper: \"I start messy, then improve.\""]',
'Pause'),

('I Can''t Stay Focused', 'Your attention is slipping, not your worth.',
'["Work in **8–10 minute sprints**; break 2 minutes.", "Remove **one** distraction (put phone in a drawer).", "Turn on brown/white noise.", "Write a **mini-to-do** with 3 checkboxes only.", "Stand, stretch, sip water, sit — then resume."]',
'Focus'),

('I Don''t Have Energy', 'You need a spark, not discipline.',
'["Eat or drink something with protein/electrolytes.", "4 breaths in, 6 out — 5 rounds.", "Change into \"work mode\" clothes.", "Do a **1-brick task**: one email, one plate, one line.", "If you''re wiped: 10-minute horizontal rest, then try again."]',
'Battery'),

('I Don''t Have Time', 'Do less on purpose — on your terms.',
'["Cut scope in half. Then cut it again.", "Pick a hard stop time and set an alarm.", "Decide the **one outcome** that actually matters.", "Default to \"good enough\" template or last version.", "Defer or delete one non-essential piece _right now_."]',
'Clock'),

('I Don''t Know How', 'You don''t need mastery to begin; you need a first move.',
'["Write: \"What''s unclear?\" → list 3 questions.", "Search one 5-minute tutorial and follow the first step only.", "Build a dumb prototype: wrong is fine, visible is better.", "Ask for a pointer: \"What would you do first?\"", "Copy a similar example and modify."]',
'HelpCircle'),

('I Don''t Know Where to Start', 'Start anywhere small and true.',
'["Pick the **start line**: materials, document, or space.", "Draw a 5-box map: Step 1 → Step 5. Fill in _only_ Step 1.", "Choose the **Most Obvious First Action** (MOFA).", "5-minute timer: gather tools only.", "Say: \"Action reveals order.\""]',
'Map'),

('I Feel Alone', 'You''re allowed to be supported.',
'["Send a \"body-double?\" text to one person.", "Turn on a study-with-me video/lofi stream.", "Tell someone your next 10-minute goal.", "Put on something cozy — signal care to your nervous system.", "Say: \"I can move with company, even virtual.\""]',
'UserX'),

('I Feel Emotionally Blocked', 'You can''t think your way through a locked door; try the body key.',
'["Cold water on wrists/face, 30 seconds.", "Write one sentence: \"I''m blocked because ___.\"", "3-minute walk; narrate one observation per step.", "One song → when it ends, do one tiny task.", "Place hand on chest: \"It''s safe to take a micro-step.\""]',
'HeartCrack'),

('I Feel Frozen', 'Motion melts ice. Any motion.',
'["Move _something_ from A to B.", "90-second tidy of the nearest surface.", "Hold an ice cube and count to 20. Then choose one action.", "Say: \"I''m allowed to start ugly.\"", "Do the 10-second version of the task."]',
'Snowflake'),

('I Feel Shame', 'Shame thrives in silence; bust it with truth and care.',
'["Hand on heart: \"I''m still worthy.\"", "Micro-repair: one apology, one reset, one plan.", "Tell one safe person, \"I''m spiraling — can I vent?\"", "Do a tiny self-care act (wash face, fresh shirt).", "Replace \"should''ve\" with \"next time I''ll…\""]',
'Frown'),

('I Forgot', 'Forgetting isn''t failure — it''s human.',
'["Brain-dump everything you''re holding.", "Set two reminders (time + place cue).", "Put the item where future-you will trip over it.", "Send yourself an email with the subject \"DO THIS TODAY.\"", "Say: \"Systems, not memory.\""]',
'Brain'),

('I Got Distracted', 'You''re not weak — your environment won. Change the field.',
'["Phone in another room for 15 minutes.", "Set up a **Focus Box**: water, pen, sticky notes, headphones.", "Full-screen the one app you need.", "7-minute sprint; tally distractions on paper.", "Say: \"Back to task\" and physically turn your body toward it."]',
'Tv'),

('I Keep Avoiding It', 'Avoidance = protection. Let''s make it safer and smaller.',
'["Do a **no-stakes preview**: open the file, look only.", "Body-double for the first 10 minutes.", "Identify the scariest 10% and strip it out for now.", "Script the first sentence you''ll say/type.", "Promise a tiny reward when you touch the task."]',
'Route'),

('I Run Out of Steam', 'You didn''t lose willpower; you used your fuel.',
'["Protein or carb + water break.", "Re-pick the target: \"What actually matters to finish?\"", "5 on / 2 off x 3 rounds.", "Cut two steps you don''t need.", "Do an easy win to get momentum, then return."]',
'ZapOff'),

('I''m Afraid I''ll Fail', 'Fear is loud before the first move.',
'["Define \"minimum viable success\" (MVS) in one line.", "Say: \"Outcome uncertain, effort chosen.\"", "Do a deliberately bad first draft.", "Ask for a quick gut-check from one person.", "Two minutes of action, then reassess."]',
'Meh'),

('It Feels Pointless', 'Meaning can be tiny and still count.',
'["Tie it to a person or value: \"Who benefits if I do this?\"", "Make it a game: score points for each 3-minute burst.", "Shrink the goal to \"move it forward 1%.\"", "Do it as a **future favor**: \"Tomorrow-me says thanks.\"", "Add a vibe: music, candle, light — change the feel."]',
'TrendingDown'),

('It Feels Too Big', 'Big becomes doable when it becomes many smalls.',
'["Break into **5 sticky notes** — one micro-step each.", "Choose the **first brick** only.", "Work until the next song ends.", "Gather tools only (no doing).", "Create a \"Later\" pile to park extras."]',
'Mountain'),

('It''s Not Urgent', 'Urgency is optional; momentum is not.',
'["Schedule a **10-minute slot** today anyway.", "Tie it to a routine (after coffee → 5 minutes on task).", "Write the cost of not doing it (30 seconds).", "Define a visible finish line (one page, one email, one drawer).", "Say: \"I do tiny things early to buy future ease.\""]',
'TimerOff'),

('Too Many Decisions', 'Decision fatigue is real — constrain the menu.',
'["Limit to **two** options; flip a coin if tied.", "Choose the option that is **easiest to start**.", "Give yourself **90 seconds** to decide.", "Use a default rule: \"If <15 minutes, do now.\"", "Park non-critical choices on a \"Decide Friday\" list."]',
'Layers');