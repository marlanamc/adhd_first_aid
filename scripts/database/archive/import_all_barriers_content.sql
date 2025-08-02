-- Import All Barriers Content for Supabase
-- This script processes all barrier pages following the same format as feelings content
-- Run this after running the barriers_content_schema.sql script

-- Clear existing data first (uncomment if needed)
-- DELETE FROM barriers_content;

-- Insert all barriers content
INSERT INTO barriers_content (
  barrier_name,
  subtitle,
  intro_paragraph,
  gentle_advice,
  stern_advice,
  adhd_reasons,
  step_sections
) VALUES 
(
  'I Already Failed',
  '💔 When mistakes feel like evidence that you''re broken, not just human',
  'Feeling like you **already failed** isn''t just discouragement — it''s your ADHD brain **locking onto one moment** and treating it like a pattern. **Mistakes feel permanent**, even when they''re not. You''re not broken — you''re navigating a brain that struggles with **time**, **memory**, and **self-trust**.',
  'You didn''t fail — you just paused. ADHD isn''t a straight line, and you''re allowed to restart as many times as you need. The shame isn''t helping. The fact that you''re here means you haven''t given up. Try again, gently.',
  'So what if you messed up? That doesn''t mean you stop trying. Failure isn''t the end — staying stuck is. You''re not broken. You''re avoiding. Pick it back up. Keep going.',
  ARRAY[
    'Time blindness: Makes one mistake feel like a permanent failure',
    'ADHD brains replay past setbacks in loops: Making it hard to reset',
    'All-or-nothing thinking: Turns slip-ups into "proof" you can''t succeed',
    'Emotional dysregulation: Makes shame hit harder and last longer',
    'Low motivation after failure: Comes from dopamine drop-off'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧭",
      "title": "Reframe \"Failure\" as Feedback, Not a Verdict",
      "intro": "ADHD isn''t a character flaw. It''s a difference in how your brain handles motivation, memory, and momentum.",
      "try_this": [
        "Reroute the narrative: \"This isn''t failure. It''s feedback I can learn from.\"",
        "Add distance: Say, \"I''m having the thought that I failed,\" instead of \"I am a failure.\"",
        "Spot the shame loop: Notice if you''re slipping into \"I always mess up\" territory. That''s history talking, not truth.",
        "Name what did work: Even if it fizzled out, what parts helped for a while?"
      ],
      "tip": "You''re not lazy, broken, or behind. You''re learning how your brain moves forward."
    },
    {
      "number": 2,
      "emoji": "🌱",
      "title": "Offer Yourself a Do-Over (Without the Drama)",
      "intro": "ADHD brains often go all-or-nothing. Let''s soften the edges and give yourself a fresh entry point.",
      "try_this": [
        "Reset the frame: \"If I were starting from right now, what would I try?\"",
        "Shrink the restart: Choose the tiniest action (like opening a tab or putting on shoes). That counts.",
        "Pick a \"restart anchor\": A post-it on your mirror, an alarm with a kind message — something that says \"you can begin again.\"",
        "Time travel wisely: Let future-you say thanks. \"Next week, I''ll be glad I nudged myself now.\""
      ],
      "tip": "Every single thing you admire was restarted dozens of times behind the scenes."
    },
    {
      "number": 3,
      "emoji": "🛠️",
      "title": "Work With (Not Against) ADHD Motivation",
      "intro": "ADHD motivation needs interest, urgency, and reward — not shame. Let''s tap into that.",
      "try_this": [
        "Make it interesting: Can you gamify it, add novelty, or make it social?",
        "Create gentle urgency: Set a 15-minute timer and promise yourself a break after.",
        "Add a reward: Tea after. A walk. A TikTok scroll. Make the boring task \"dopamine-adjacent.\"",
        "Use body doubling: Hop on a Zoom, coworking call, or text a friend: \"Gonna start now — hold me to it?\""
      ],
      "tip": "ADHD doesn''t struggle with effort. It struggles with activation. Get the engine humming first."
    },
    {
      "number": 4,
      "emoji": "🔍",
      "title": "Redefine What \"Success\" Looks Like (Today)",
      "intro": "Perfectionism makes everything feel like failure. Progress is allowed to be scrappy.",
      "try_this": [
        "Lower the bar: Ask, \"What would ''bare minimum'' success look like?\"",
        "Track micro-wins: Even 2 minutes of effort counts. Log it. See the streak.",
        "Drop the \"shoulds\": Whose voice says it has to be that way? Choose what you need right now.",
        "Reflect: What does \"done\" actually mean today? Does it need to be perfect, or just... real?"
      ],
      "tip": "The bravest thing isn''t perfection. It''s showing up again after the dip."
    },
    {
      "number": 5,
      "emoji": "🧍‍♀️",
      "title": "Borrow Belief When Yours Runs Low",
      "intro": "You don''t need to do this alone. Self-trust builds faster with safe, kind witnesses.",
      "try_this": [
        "Text someone: \"I''m stuck in ''I already failed'' brain. Can you remind me that I didn''t?\"",
        "Repeat a mantra: \"I can restart in a way that works for me.\" (Say it. Post it. Use it.)",
        "Get ADHD-aware support: Coaches, therapists, or groups who know this pattern intimately can help.",
        "Reset with regulation: Sometimes, the best next step is a snack, a stretch, or a nap. Return when you''ve refueled."
      ],
      "tip": "There''s no expiration date on starting again. You''re still on the path — and that''s what matters."
    }
  ]'
),
(
  'I Can''t Start',
  '🧊 When your brain freezes between knowing what to do and actually doing it',
  'Not being able to **start** isn''t laziness — it''s a **brain disconnect**. You _want_ to do it, but ADHD disrupts the jump from **intention to action**. It''s like standing at the edge of a pool and **freezing**, even when you know how to swim.',
  'Starting is often the hardest part — not because you''re lazy, but because your brain is stuck in overwhelm. You don''t need to feel ready. You need a tiny entry point. Lower the bar. One minute counts.',
  'You''re waiting for the perfect moment that''s never coming. You don''t need clarity — you need action. Start messy. Start now. You''re letting fear run the show. Take the wheel.',
  ARRAY[
    'Executive dysfunction: Disrupts the ability to initiate, even simple tasks',
    'Low dopamine: Makes uninteresting tasks feel physically repelling',
    'Overwhelm from too many unknowns: Can trigger paralysis',
    'Energy may drain: Just from thinking about the task',
    'Shame from past delays: Can block momentum before it begins'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧭",
      "title": "Acknowledge the Freeze Without Blame",
      "intro": "Task initiation is an executive function — not a willpower issue. You''re not broken.",
      "try_this": [
        "Name it: Say out loud, \"I''m stuck\" or \"This feels too big right now.\"",
        "Shrink the shame: Remind yourself, \"This is an ADHD thing. I''ve been here before. It passes.\"",
        "Spot the block: Is it confusion, perfectionism, overwhelm, fear, boredom?",
        "Use curiosity: \"What would make this feel 10% easier or more doable?\""
      ],
      "tip": "When your brain hits the brakes, compassion is the gas."
    },
    {
      "number": 2,
      "emoji": "🧱",
      "title": "Micro-Start with the Smallest Step",
      "intro": "Overwhelm freezes action. Let''s shrink the task until your brain says \"okay, fine.\"",
      "try_this": [
        "Break it down absurdly small: \"Open browser tab\" or \"Find pen\" or \"Put on playlist.\"",
        "Use the 5-minute rule: Set a timer and commit to just 5 minutes. You can stop after.",
        "Celebrate the start, not the finish: Starting is the hard part.",
        "Make a \"next one thing\" list: Just the very next action, not the whole project."
      ],
      "tip": "Progress doesn''t begin with motion. It begins with permission."
    },
    {
      "number": 3,
      "emoji": "⚡",
      "title": "Activate Dopamine with Interest, Urgency, or Reward",
      "intro": "Your brain isn''t lazy — it just needs the right fuel to start. Let''s give it some.",
      "try_this": [
        "Stack dopamine: Pair the task with music, a cozy drink, or a favorite hoodie.",
        "Make it urgent-ish: Text a friend \"Starting in 5,\" or set a deadline that feels real.",
        "Build in a treat: \"After this I get a cookie / a break / a funny video.\"",
        "Add novelty: Can you do it in a new location? With a new pen? In an accent?"
      ],
      "tip": "Boring doesn''t start. But interesting does. Find your spark."
    },
    {
      "number": 4,
      "emoji": "🔁",
      "title": "Set Up a Soft System That Guides You In",
      "intro": "Don''t rely on memory or willpower — your brain needs external scaffolding.",
      "try_this": [
        "Use visual cues: Sticky notes, checklists, or objects placed where you''ll see them.",
        "Try time-blocking with wiggle room: Anchor tasks around meals, meds, or classes — not rigid hours.",
        "Prep your launchpad: Put everything for the task in one visible place. Friction = stuck.",
        "Use body doubling: Work alongside someone (even silently) to help your brain engage."
      ],
      "tip": "Your systems should whisper \"start here,\" not scream \"why haven''t you?\""
    },
    {
      "number": 5,
      "emoji": "🫂",
      "title": "Get Support and Permission to Begin Again",
      "intro": "You don''t have to push alone. Gentle connection makes momentum possible.",
      "try_this": [
        "Text someone: \"I need a nudge. Can I tell you when I start?\"",
        "Remind yourself: \"I don''t have to finish this right now — I just need to begin.\"",
        "Regulate first: Eat, hydrate, stretch, breathe. Dysregulated bodies don''t start stuff.",
        "Consider support: ADHD coaching or therapy can help with initiation strategies that stick."
      ],
      "tip": "The restart is always available. Your window to begin is right now, no guilt needed."
    }
  ]'
),
(
  'I Feel Alone',
  '🧍 When hiding your struggles makes you invisible, even in a crowd',
  'ADHD can feel **isolating** even when you''re surrounded by people. When others don''t **understand your struggles**, or when you **hide them** out of **fear** or **shame**, it''s easy to feel **invisible**. You''re not alone — you''re just **carrying too much on your own**.',
  'You''re not actually alone — your brain just convinces you that you are. So many people struggle like you do. You deserve connection, even when you''re behind, messy, or struggling. Reach out. Even a little.',
  'You''re isolating by choice now. Connection requires effort — send the text. Ask for help. You''re not meant to do this solo, but no one can show up if you keep shutting them out.',
  ARRAY[
    'Rejection Sensitivity: Makes even small disconnection feel huge',
    'Masking your struggles: Can lead to feeling misunderstood',
    'Inconsistent communication habits: May push people away',
    'Emotional regulation issues: Make reaching out feel vulnerable',
    'Past invalidation: Can make you expect to be dismissed again'
  ],
  '[
    {
      "number": 1,
      "emoji": "🤲",
      "title": "Reframe the Loneliness with Compassion",
      "intro": "You''re not broken — your brain just interacts with the world differently. That difference can feel isolating, but it''s not a flaw.",
      "try_this": [
        "Say: \"This is loneliness, not a personal failing.\"",
        "Understand it''s brain-based: ADHD can affect social cues, time perception, and follow-through — all things that impact relationships.",
        "Let go of the \"shoulds\": You don''t have to connect like everyone else. You just need your way."
      ],
      "tip": "Loneliness isn''t about being alone — it''s about not feeling seen. Let''s fix that."
    },
    {
      "number": 2,
      "emoji": "🤝",
      "title": "Build Micro-Connections (You Don''t Need a Village Overnight)",
      "intro": "You don''t have to overhaul your social life to feel connected. Start small — and safe.",
      "try_this": [
        "Join an ADHD-friendly space (online or IRL): ADDA, CHADD, Discord groups, or even Reddit can be a great place to start.",
        "Try body doubling: Sit on Zoom or a chat with someone while working. Connection doesn''t have to be deep to be real.",
        "Send low-pressure check-ins: \"Thinking of you\" texts or memes don''t require responses but show care.",
        "Find your people through shared interests: Gaming, crafts, hiking — connection often happens through doing, not just talking."
      ],
      "tip": "You don''t need to be \"fixed\" to deserve connection. You''re worthy of friendship exactly as you are."
    }
  ]'
);

-- Verify the imports
SELECT barrier_name, intro_paragraph FROM barriers_content ORDER BY barrier_name;