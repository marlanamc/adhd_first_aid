-- Import All Barriers Content for Supabase (Complete Version)
-- This script processes all 20 barrier pages following the same format as feelings content
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
  'Feeling like you **already failed** isn''t just discouragement, it''s your ADHD brain **locking onto one moment** and treating it like a pattern. **Mistakes feel permanent**, even when they''re not. You''re not broken, you''re navigating a brain that struggles with **time**, **memory**, and **self-trust**.',
  'You didn''t fail, you just paused. ADHD isn''t a straight line, and you''re allowed to restart as many times as you need. The shame isn''t helping. The fact that you''re here means you haven''t given up. Try again, gently.',
  'So what if you messed up? That doesn''t mean you stop trying. Failure isn''t the end, staying stuck is. You''re not broken. You''re avoiding. Pick it back up. Keep going.',
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
        "Pick a \"restart anchor\": A post-it on your mirror, an alarm with a kind message, something that says \"you can begin again.\"",
        "Time travel wisely: Let future-you say thanks. \"Next week, I''ll be glad I nudged myself now.\""
      ],
      "tip": "Every single thing you admire was restarted dozens of times behind the scenes."
    },
    {
      "number": 3,
      "emoji": "🛠️",
      "title": "Work With (Not Against) ADHD Motivation",
      "intro": "ADHD motivation needs interest, urgency, and reward, not shame. Let''s tap into that.",
      "try_this": [
        "Make it interesting: Can you gamify it, add novelty, or make it social?",
        "Create gentle urgency: Set a 15-minute timer and promise yourself a break after.",
        "Add a reward: Tea after. A walk. A TikTok scroll. Make the boring task \"dopamine-adjacent.\"",
        "Use body doubling: Hop on a Zoom, coworking call, or text a friend: \"Gonna start now, hold me to it?\""
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
      "tip": "There''s no expiration date on starting again. You''re still on the path, and that''s what matters."
    }
  ]'
),
(
  'I Can''t Start',
  '🧊 When your brain freezes between knowing what to do and actually doing it',
  'Not being able to **start** isn''t laziness, it''s a **brain disconnect**. You _want_ to do it, but ADHD disrupts the jump from **intention to action**. It''s like standing at the edge of a pool and **freezing**, even when you know how to swim.',
  'Starting is often the hardest part, not because you''re lazy, but because your brain is stuck in overwhelm. You don''t need to feel ready. You need a tiny entry point. Lower the bar. One minute counts.',
  'You''re waiting for the perfect moment that''s never coming. You don''t need clarity, you need action. Start messy. Start now. You''re letting fear run the show. Take the wheel.',
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
      "intro": "Task initiation is an executive function, not a willpower issue. You''re not broken.",
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
      "intro": "Your brain isn''t lazy, it just needs the right fuel to start. Let''s give it some.",
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
      "intro": "Don''t rely on memory or willpower, your brain needs external scaffolding.",
      "try_this": [
        "Use visual cues: Sticky notes, checklists, or objects placed where you''ll see them.",
        "Try time-blocking with wiggle room: Anchor tasks around meals, meds, or classes, not rigid hours.",
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
        "Remind yourself: \"I don''t have to finish this right now, I just need to begin.\"",
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
  'ADHD can feel **isolating** even when you''re surrounded by people. When others don''t **understand your struggles**, or when you **hide them** out of **fear** or **shame**, it''s easy to feel **invisible**. You''re not alone, you''re just **carrying too much on your own**.',
  'You''re not actually alone, your brain just convinces you that you are. So many people struggle like you do. You deserve connection, even when you''re behind, messy, or struggling. Reach out. Even a little.',
  'You''re isolating by choice now. Connection requires effort, send the text. Ask for help. You''re not meant to do this solo, but no one can show up if you keep shutting them out.',
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
      "intro": "You''re not broken, your brain just interacts with the world differently. That difference can feel isolating, but it''s not a flaw.",
      "try_this": [
        "Say: \"This is loneliness, not a personal failing.\"",
        "Understand it''s brain-based: ADHD can affect social cues, time perception, and follow-through, all things that impact relationships.",
        "Let go of the \"shoulds\": You don''t have to connect like everyone else. You just need your way."
      ],
      "tip": "Loneliness isn''t about being alone, it''s about not feeling seen. Let''s fix that."
    },
    {
      "number": 2,
      "emoji": "🤝",
      "title": "Build Micro-Connections (You Don''t Need a Village Overnight)",
      "intro": "You don''t have to overhaul your social life to feel connected. Start small, and safe.",
      "try_this": [
        "Join an ADHD-friendly space (online or IRL): ADDA, CHADD, Discord groups, or even Reddit can be a great place to start.",
        "Try body doubling: Sit on Zoom or a chat with someone while working. Connection doesn''t have to be deep to be real.",
        "Send low-pressure check-ins: \"Thinking of you\" texts or memes don''t require responses but show care.",
        "Find your people through shared interests: Gaming, crafts, hiking, connection often happens through doing, not just talking."
      ],
      "tip": "You don''t need to be \"fixed\" to deserve connection. You''re worthy of friendship exactly as you are."
    }
  ]'
),
(
  'I Can''t Stay Focused',
  '🧠 When your brain freezes between knowing what to do and actually doing it',
  'Struggling to **stay focused** doesn''t mean you''re not trying, it means your brain''s **attention system** isn''t built to **filter distractions** or **stay on track** without **interest** or **urgency**. This isn''t a **discipline issue**. It''s a **neurological** one.',
  'Your focus isn''t broken, it''s wired differently. You don''t need more discipline. You need tools: timers, breaks, movement, silence. Make focus easier, not harder.',
  'Stop blaming your brain and start managing it. You know you drift, so build a system around it. Focus won''t magically appear. You have to set it up.',
  ARRAY[
    'Attention regulation is impaired: Not just paying attention, but shifting it',
    'Intrusive thoughts or stimuli hijack focus in seconds',
    'Working memory gaps: Mean forgetting what you were just doing',
    'You may hyperfocus on the wrong thing: Without realizing it',
    'Masking your distraction: Can add a layer of hidden stress'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧭",
      "title": "Recognize Attention Drift Without Shame",
      "intro": "Focus isn''t about trying harder, it''s about noticing and resetting.",
      "try_this": [
        "Spot the moment: \"Whoa, I drifted.\" That''s not failure, it''s a signal.",
        "Normalize it: Attention naturally shifts. ADHD just shifts _faster_ and _harder_.",
        "Name it kindly: \"My brain''s off-roading again, let''s gently steer back.\"",
        "Note the pattern: Are you tired? Bored? Hungry? Anxious? Clarity helps you prep next time."
      ],
      "tip": "Getting distracted doesn''t mean you failed. Redirecting is the real skill."
    },
    {
      "number": 2,
      "emoji": "🧹",
      "title": "Adjust Your Environment to Support Focus",
      "intro": "ADHD brains respond strongly to visual, auditory, and emotional input. Shape your space to help.",
      "try_this": [
        "Declutter your workspace: Hide visual noise. Keep only what you need in sight.",
        "Mute the noise: Turn off notifications or switch your phone to grayscale.",
        "Add helpful input: Try lo-fi beats, white noise, or a Pomodoro YouTube timer.",
        "Make it interesting: Switch locations, stand up, or change your posture to re-engage."
      ],
      "tip": "Your space can help your brain focus, or fight against it. Design wisely."
    },
    {
      "number": 3,
      "emoji": "⚡",
      "title": "Fuel Your Focus with Dopamine and Movement",
      "intro": "Focus follows stimulation. Let''s give your brain what it''s missing.",
      "try_this": [
        "Choose a \"NICE\" task: Something Novel, Interesting, Challenging, or an Emergency.",
        "Add a reward: \"After 25 mins, I get to watch a video / check messages / eat a snack.\"",
        "Move often: Stand up, stretch, fidget, pace, movement boosts dopamine and resets focus.",
        "Use tactile tools: Fidget toys, chewing gum, or weighted items can ground attention."
      ],
      "tip": "Stillness ≠ focus. Movement isn''t a distraction, it''s fuel."
    },
    {
      "number": 4,
      "emoji": "🧱",
      "title": "Build External Systems That Anchor Attention",
      "intro": "Working memory is slippery. Use outside-the-brain strategies to stay on track.",
      "try_this": [
        "Set a timer: Try 10–25 minute focus blocks with built-in breaks.",
        "Use checklists or visual trackers: Cross things off and see your wins stack up.",
        "Externalize steps: Write them big on a whiteboard or sticky note in your line of sight.",
        "Try body doubling: Silent co-working (in-person or virtual) helps keep your brain tethered."
      ],
      "tip": "Don''t rely on memory. Give your brain a paper trail to follow."
    },
    {
      "number": 5,
      "emoji": "🫶",
      "title": "Get Help and Celebrate Redirects",
      "intro": "You don''t need to do this alone. Support reduces shame and builds resilience.",
      "try_this": [
        "Co-work with someone: Just knowing someone else is focused can help you focus, too.",
        "Text someone: \"I need a check-in in 30 mins, I''m doing [task] now.\"",
        "Do a reset ritual: If you''ve drifted too far, stretch, splash water on your face, or step outside for 2 mins.",
        "Celebrate the redirect: Every time you _notice_ and _return_ to focus, that''s a win."
      ],
      "tip": "Focus isn''t a light switch. It''s a dance. Let it be messy, and keep dancing."
    }
  ]'
),
(
  'I Don''t Have Energy',
  '🪫 When your brain is running on empty and everything feels like climbing a mountain',
  'Not having **energy** with ADHD often has nothing to do with **sleep** or **effort**. It''s the **mental load**, the constant **decision-making**, **filtering**, **overthinking**, and **self-regulation**. You''re tired because your brain is **sprinting every day** just to keep up.',
  'You''re not lazy. You''re depleted. Burnout, overwhelm, and emotional exhaustion hit hard with ADHD. Rest is valid. Nourishment is necessary. Start with hydration, a snack, and something gentle. Then ease in.',
  'You''re tired because you''re ignoring your needs. You don''t get more energy by doing nothing. Move your body. Eat real food. Shut off the noise. Reboot yourself like you mean it.',
  ARRAY[
    'Mental fatigue is constant: From filtering distractions and self-monitoring',
    'Emotional turbulence and sensory overload: Are draining',
    'ADHD often disrupts sleep: Leading to daytime exhaustion',
    'Brain fog and task inertia: Create a low-energy loop',
    'Guilt about "not doing enough": Burns more emotional fuel'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧭",
      "title": "Redefine Energy with Self-Compassion",
      "intro": "Your energy isn''t just physical, it''s emotional, mental, sensory, and executive. Be gentle with yourself.",
      "try_this": [
        "Say it out loud: \"I''m not broken, I''m just drained. That''s valid.\"",
        "Reframe: \"I''m not lazy, I''m running low on brain fuel or regulation.\"",
        "Go micro: Lower the bar. \"Stand up\" or \"put one sock on\" counts as momentum.",
        "Swap \"try harder\" with \"what would make this 10% easier?\""
      ],
      "tip": "Motivation follows motion, not the other way around."
    },
    {
      "number": 2,
      "emoji": "🚶‍♀️",
      "title": "Move Gently to Create Activation",
      "intro": "Movement is one of the fastest ways to boost dopamine and reboot your system.",
      "try_this": [
        "2-minute reset: Walk around the block, stretch your arms, shake it out.",
        "Try somatic movement: Rocking, swaying, or tapping to regulate.",
        "Change posture or environment: Sit somewhere new, or work from the floor.",
        "Stand and sway: Even light movement wakes up the ADHD brain."
      ],
      "tip": "You don''t need a workout. You need motion, any kind."
    },
    {
      "number": 3,
      "emoji": "🍳",
      "title": "Refill Your Basic Fuel Tanks",
      "intro": "ADHD energy dips are often biological. Start with the essentials.",
      "try_this": [
        "Eat protein: Scrambled eggs, a smoothie, or a snack with fat + protein combo.",
        "Hydrate: A glass of cold water can restart your brain faster than coffee.",
        "Scan your sleep debt: Did you rest last night? Or do you need a real nap today?",
        "Get sunlight: A few minutes outside helps regulate sleep, mood, and energy."
      ],
      "tip": "Your executive function can''t run on empty. Food, water, and light are non-negotiable."
    },
    {
      "number": 4,
      "emoji": "🧱",
      "title": "Break Down and Add Incentives",
      "intro": "Your brain needs momentum and rewards, not pressure.",
      "try_this": [
        "Pick the tiniest step: \"Open email tab\" or \"grab laundry basket\" is a win.",
        "Use the 5-minute rule: \"I''ll just do this for 5 minutes\" lowers the wall.",
        "Add a reward: \"After this, I get a sweet / 10 mins TikTok / a nap.\"",
        "Schedule around your real energy: Save hard tasks for your best hours, not the calendar''s."
      ],
      "tip": "You don''t need to feel ready. You just need to start tiny, and reward the effort."
    },
    {
      "number": 5,
      "emoji": "🤝",
      "title": "Get Support and Let Yourself Rest",
      "intro": "Sometimes the most productive thing is to ask for help, or let yourself off the hook.",
      "try_this": [
        "Use body doubling: A friend on FaceTime or co-working session can jumpstart focus.",
        "Ask for help: Text \"I''m stuck, can you nudge me to do one thing?\"",
        "Rest on purpose: Plan a 10-minute guilt-free rest with no scrolling or shame.",
        "See an ADHD coach or therapist: You deserve support tailored to your brain."
      ],
      "tip": "You''re allowed to rest _before_ you finish the list. Maintenance is not a reward, it''s survival."
    }
  ]'
),
(
  'I Don''t Have Time',
  '⏳ When time slips through your fingers like water',
  'With ADHD, **time slips through your fingers**. You''re not **lazy** or **careless**, your brain literally processes time **differently**. What looks like **poor time management** is often **time blindness**, making **planning** and **pacing** feel like a guessing game.',
  'Time blindness is real. You''re not terrible at time, your brain just doesn''t track it in a linear way. Try visual timers, external clocks, or scheduling backward. Even 5 minutes can move things forward.',
  'You have time, you''re just misusing it. You''ve spent 30 minutes scrolling and 0 minutes starting. You don''t need more time. You need to protect and prioritize what you''ve got.',
  ARRAY[
    'Time blindness: Warps your ability to sense how much time you have',
    'Task switching: Eats up hidden minutes and momentum',
    'Planning and sequencing tasks: Can take longer than the task itself',
    'Urgency bias: May lead to procrastination until the last minute',
    'Even small tasks: Feel like major time commitments when unstarted'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧭",
      "title": "Reframe Time and Release the Shame",
      "intro": "ADHD time perception (aka \"time blindness\") makes time feel stretchy, slippery, or invisible. It''s not your fault.",
      "try_this": [
        "Say: \"This isn''t about laziness. My brain just doesn''t _feel_ time the same way.\"",
        "Acknowledge: \"Everything feels equally urgent when I can''t see time clearly.\"",
        "Reframe: \"I''m not bad with time, I just need to make time visible.\"",
        "Let go of \"should\": Stop punishing yourself for a brain-based reality."
      ],
      "tip": "You don''t lack time, you lack time awareness. That''s fixable."
    },
    {
      "number": 2,
      "emoji": "⏱️",
      "title": "Externalize Time and Create Anchors",
      "intro": "If your brain can''t _hold_ time, outsource it.",
      "try_this": [
        "Use visual timers or Pomodoro apps: See time pass, don''t just guess.",
        "Set alarms for everything: Start, switch, and stop cues for your day.",
        "Anchor tasks to routines: \"After breakfast, I…\" or \"Before I brush my teeth…\"",
        "Track your real time: How long _does_ a shower or email take? Build real data."
      ],
      "tip": "External time cues reduce anxiety and increase follow-through."
    },
    {
      "number": 3,
      "emoji": "🧱",
      "title": "Break It Down and Shrink the Ask",
      "intro": "When everything feels urgent, it''s easy to freeze or overthink.",
      "try_this": [
        "Make it micro: Instead of \"do laundry,\" try \"carry clothes to washer.\"",
        "Try the 5-minute rule: Start for 5 minutes, no pressure to continue (but you might).",
        "Make a \"Now, Next, Later\" list: Keep it short and visual.",
        "Skip multitasking: It''s a time-suck. One thing at a time."
      ],
      "tip": "Clarity creates capacity. Smaller = faster start."
    },
    {
      "number": 4,
      "emoji": "🎯",
      "title": "Add Dopamine: Urgency, Novelty, and Rewards",
      "intro": "If it''s boring, your brain won''t start. If it''s stimulating, it might not stop.",
      "try_this": [
        "Create urgency: Fake a deadline or invite someone over to trigger action.",
        "Add a finish line + prize: \"When I do X, I get Y.\"",
        "Layer novelty: New music, new location, new tool = fresh start.",
        "Use hyperfocus wisely: Batch tasks you _want_ to tunnel into, but set alarms to exit."
      ],
      "tip": "ADHD doesn''t lack motivation, it needs the right kind of fuel."
    },
    {
      "number": 5,
      "emoji": "🛑",
      "title": "Reclaim Capacity: Rest, Boundaries, and Support",
      "intro": "\"No time\" is often code for \"no margin.\" Let''s fix that.",
      "try_this": [
        "Audit your load: What are you saying yes to that''s stealing your hours?",
        "Prioritize rest like a task: Downtime is recovery, not indulgence.",
        "Say no without guilt: \"I''m at capacity\" is a full sentence.",
        "Ask for help: Use body doubling, coaching, or ADHD community support."
      ],
      "tip": "You don''t need more hours, you need more _room to breathe_."
    }
  ]'
),
(
  'I Don''t Know How',
  '🤷‍♀️ When the path forward feels invisible',
  'When your ADHD brain sees a task and **freezes**, it''s often because it doesn''t see a **path forward**. You might know _what_ to do, but not _how_ to **begin**. That missing roadmap can feel like a **brick wall**, but it''s a **setup problem**, not a **you problem**.',
  'Not knowing is okay. You don''t have to have all the answers to begin. Ask. Google. Try badly. Learning is allowed to be messy and slow. You''re still worthy while you figure it out.',
  'You''re using "I don''t know how" to delay everything. Pick a method. Watch a tutorial. Ask someone. You don''t get better by avoiding, you get better by trying.',
  ARRAY[
    'Breaking tasks into steps: Is harder with executive dysfunction',
    'You might overcomplicate things: Trying to do them "perfectly"',
    'Working memory gaps: Make it hard to follow multi-step instructions',
    'Asking for help: May trigger feelings of shame or embarrassment',
    'Difficulty with self-teaching: Due to attention drift or overwhelm'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧠",
      "title": "Reframe the Feeling and Ditch the Shame",
      "intro": "ADHD challenges with planning, working memory, and decision-making make \"I don''t know how\" a real obstacle, not a character flaw.",
      "try_this": [
        "Say: \"This isn''t about laziness, it''s about missing instructions or steps.\"",
        "Name it: \"I''m not dumb, I just need help breaking this down.\"",
        "Offer self-compassion: You''re not behind, you''re just missing scaffolding.",
        "Ditch the pressure: Let go of the \"shoulds\" and meet your brain where it''s at."
      ],
      "tip": "If you''re overwhelmed, the problem isn''t you, it''s the instructions."
    },
    {
      "number": 2,
      "emoji": "🧱",
      "title": "Shrink It Down into Micro-Steps",
      "intro": "Big or vague tasks = instant paralysis. Make the next move ridiculously clear.",
      "try_this": [
        "Write it like a recipe: \"Step 1: Open laptop. Step 2: Open doc.\"",
        "Keep breaking down until it feels laughably easy.",
        "Talk it out: Verbal processing with a friend or AI can unlock clarity.",
        "Use checklists: Get the steps _out of your brain_ and into view."
      ],
      "tip": "If you can''t start, you probably haven''t found the _first_ step yet."
    },
    {
      "number": 3,
      "emoji": "⏳",
      "title": "Externalize Time and Process",
      "intro": "Planning and sequencing are hard for ADHD brains. Make time and steps visible.",
      "try_this": [
        "Use visual timers and alarms: To guide time spent or when to shift tasks.",
        "Map it out visually: Use sticky notes, mind maps, or flowcharts.",
        "Build in buffer zones: Transitions take energy, give yourself space to shift.",
        "Use tools like Trello, Notion, or paper planners: Whatever works _for your brain_, not just what''s popular."
      ],
      "tip": "Your brain doesn''t like holding timelines. That''s what external tools are for."
    },
    {
      "number": 4,
      "emoji": "🎯",
      "title": "Engage Your Motivation System (aka Dopamine)",
      "intro": "If your brain isn''t interested or excited, it _won''t_ figure out how, no matter how important it is.",
      "try_this": [
        "Add urgency: Fake a deadline or invite someone to check in.",
        "Use rewards: \"When I do this step, I get a treat.\"",
        "Make it novel: Change your location, tools, or music playlist.",
        "Find the \"spark\": Ask yourself, \"What part of this could be _fun_ or _meaningful_?\""
      ],
      "tip": "If your brain won''t start, it probably needs more dopamine, not more shame."
    },
    {
      "number": 5,
      "emoji": "🤝",
      "title": "Ask for Help and Normalize Learning",
      "intro": "You don''t have to know how, _you just have to know how to ask_.",
      "try_this": [
        "Use body doubling: Work beside someone while you figure it out.",
        "Ask a friend, mentor, or coach: Say, \"Can we break this down together?\"",
        "Try-and-tweak: Take imperfect action. Adjust as you go, that''s how learning works.",
        "Celebrate each micro-win: Every step counts, especially when it used to feel impossible."
      ],
      "tip": "You''re not supposed to know everything. But you _can_ build systems that help you figure it out."
    }
  ]'
),
(
  'I Don''t Know Where to Start',
  '🧩 When everything feels equally urgent and equally overwhelming',
  'Everything feels **equally urgent** and **equally overwhelming**. Your ADHD brain struggles with **sorting**, **sequencing**, and **deciding where to begin**. So instead, it **stalls**. This isn''t a **motivation issue**, it''s an **executive function overload**.',
  'It all feels important, so nothing gets done. You''re not broken, you just need a path. Pick the easiest task. Or the one you dread least. Start anywhere. Starting _somewhere_ is the win.',
  'You''re waiting for a map that doesn''t exist. Just start. Pick a corner. Pick a tab. Pick a pile. Stop romanticizing the plan and move.',
  ARRAY[
    'ADHD brains often can''t prioritize tasks easily: Everything feels urgent',
    'Your mind may spin in circles: Instead of choosing a first step',
    'Fear of starting "wrong": Can stall momentum completely',
    'Low dopamine: Makes boring or unclear tasks hard to approach',
    'You may lose track: Of how long you''ve been stuck'
  ],
  '[
    {
      "number": 1,
      "emoji": "🫶",
      "title": "Reframe the Freeze and Remove the Shame",
      "intro": "This isn''t a moral failing, it''s a classic ADHD roadblock caused by task initiation, planning, and memory wiring.",
      "try_this": [
        "Say: \"I''m not lazy, I''m just missing the first step.\"",
        "Ditch \"shoulds\": There''s no one \"right\" starting point. Start messy, weird, or small.",
        "Remember: Your brain isn''t broken, it''s just not a fan of vague instructions.",
        "Offer compassion: Talk to yourself like a friend who''s overwhelmed, not a machine that''s malfunctioning."
      ],
      "tip": "Shame freezes progress. Compassion unlocks it."
    },
    {
      "number": 2,
      "emoji": "🧱",
      "title": "Make the First Step Stupidly Small",
      "intro": "If everything feels like too much, zoom in. Zoom _way_ in.",
      "try_this": [
        "Write it out like a recipe: \"Step 1: Open laptop. Step 2: Plug it in.\"",
        "Start with the win: \"Drink water\" or \"light a candle\" can be your launchpad.",
        "Talk it out: ADHD brains often think better aloud. Use a friend, chatbot, or voice memo.",
        "Use checklists or sticky notes: Make your brain''s steps visible and real."
      ],
      "tip": "If it still feels hard, the step isn''t small enough yet."
    },
    {
      "number": 3,
      "emoji": "🧭",
      "title": "Externalize Time and Process",
      "intro": "Your brain might be overwhelmed because it''s holding too much at once. Let''s lighten the load.",
      "try_this": [
        "Use timers: Set one just to begin. Even 3 minutes is progress.",
        "Visualize the process: Try mind maps, sticky note sequencing, or sketching the flow.",
        "Focus on _sequence_, not schedule: \"Do A, then B\" works better than \"Do A at 10:00.\"",
        "Keep tools visible: Keep what you need to start _in sight_ and easy to access."
      ],
      "tip": "If it''s out of sight, it''s out of your working memory."
    },
    {
      "number": 4,
      "emoji": "🎯",
      "title": "Spark Motivation to Break the Gridlock",
      "intro": "The ADHD brain needs a _reason_ to act, not just obligation.",
      "try_this": [
        "Pick the most interesting or easiest piece first: Ignore the \"right\" order.",
        "Add urgency: Text a friend \"I''m starting this now\" or set a fake deadline.",
        "Use rewards: \"If I write one sentence, I get a snack\" works better than shame.",
        "Make it fun: Play music, race the timer, or use a fun pen. Anything to activate dopamine."
      ],
      "tip": "If it''s not exciting, urgent, or rewarding, it probably won''t happen. Add one."
    },
    {
      "number": 5,
      "emoji": "🤝",
      "title": "Get Momentum from Others",
      "intro": "You don''t need to know where to start, you just need a nudge.",
      "try_this": [
        "Use a body double: Sit with someone while you figure it out or start together.",
        "Ask for help: Say, \"Can you help me break this into a first step?\"",
        "Consider ADHD coaching or therapy: You deserve strategies that work with your brain.",
        "Celebrate progress: Every tiny step you take is a win. Track it and honor it."
      ],
      "tip": "Starting _with_ someone can be easier than starting _alone_."
    }
  ]'
),
(
  'I Feel Emotionally Blocked',
  '🧱 When feelings freeze your forward motion',
  '**Emotional blocks** aren''t **coldness** or **avoidance**, they''re **self-protection**. ADHD brains can get so **overloaded by feelings** that they **shut down** or go **numb**. You''re not **emotionally broken**. You''re just **full and stuck**.',
  'You''re not stuck because you''re lazy, you''re protecting yourself. Emotional blocks are real. Shame, fear, and doubt can freeze you. You don''t need to push through, just _notice_ and take one small step.',
  'You''re not moving because you''re avoiding the feeling. Call it what it is, fear, guilt, grief, and keep going anyway. Action dissolves blocks. Do it _while_ it feels hard.',
  ARRAY[
    'Emotional dysregulation: Can overload or shut down your system',
    'ADHD brains may avoid uncomfortable emotions: By tuning out',
    'Fear of being "too much": Can lead to emotional suppression',
    'Internal chaos: Can make it hard to name or access what you feel',
    'Trouble expressing emotions: May be mistaken for indifference'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧠",
      "title": "Acknowledge the Block Without Shame",
      "intro": "This feeling is real, and common. You''re not making it up or failing.",
      "try_this": [
        "Say: \"Something feels stuck, and that''s information, not a flaw.\"",
        "Know that ADHD often brings emotional intensity and regulation issues.",
        "Let go of \"shoulds\" about how you''re supposed to feel or process.",
        "Offer yourself the same patience you''d give a friend."
      ],
      "tip": "You don''t have to \"feel ready\" to start feeling better. You just have to begin with compassion."
    },
    {
      "number": 2,
      "emoji": "🔍",
      "title": "Identify What''s Beneath the Block",
      "intro": "Emotionally stuck often means emotionally overloaded or shut down. Let''s peek underneath.",
      "try_this": [
        "Ask yourself: Am I overwhelmed? Ashamed? Numb? Resentful? Sometimes the block is covering something bigger.",
        "Consider RSD: Are you avoiding something because it might make you feel rejected or not good enough?",
        "Check for burnout: Are you physically or emotionally depleted?",
        "Write without filter: Do a 5-minute free-write about \"What''s bothering me right now?\" to get underneath the fog."
      ],
      "tip": "Emotional blocks often show up as \"I don''t care\" when the truth is \"This feels too big.\""
    },
    {
      "number": 3,
      "emoji": "🌬️",
      "title": "Move Emotion Through the Body",
      "intro": "Emotions live in the body, not the brain. Let''s help them shift.",
      "try_this": [
        "Go for a \"feeling walk\": No pressure to solve anything, just move.",
        "Play music that matches or soothes your mood: Let your body respond.",
        "Shake it out, stomp your feet, or do somatic shaking: To release static.",
        "Label what you''re feeling (even imperfectly): \"This feels like tightness,\" or \"This might be frustration.\""
      ],
      "tip": "You can''t think your way out of an emotional block. But you _can_ move through it."
    },
    {
      "number": 4,
      "emoji": "🧱",
      "title": "Lower the Pressure and Start Small",
      "intro": "Blocks grow when the next step feels too big or unclear. Let''s shrink it.",
      "try_this": [
        "Choose a micro-step: \"Open the tab,\" \"Put on music,\" \"Move the pile.\"",
        "Nourish first: Have a snack, drink water, take meds, regulate before expecting output.",
        "Set a timer for 5 minutes: You don''t have to finish, just start. The block doesn''t get to make the rules.",
        "Try the \"Name → Move → Breathe\" trio: Name the feeling, move your body, then take 3 deep breaths."
      ],
      "tip": "You don''t have to _want_ to start. You just have to make it easier to begin."
    },
    {
      "number": 5,
      "emoji": "🫶",
      "title": "Connect with Co-Regulation and External Support",
      "intro": "Emotional stuckness often melts faster when we don''t face it alone.",
      "try_this": [
        "Try body doubling: Work or sit alongside someone, even silently.",
        "Text someone: \"Feeling frozen, want to check in later?\" Small contact helps.",
        "Consider therapy or ADHD coaching: You deserve support that gets _your_ brain.",
        "Join an ADHD support group: Normalize the rollercoaster, and borrow hope from others."
      ],
      "tip": "Emotional regulation doesn''t happen in isolation. Your nervous system needs cues that it''s not alone."
    }
  ]'
),
(
  'I Feel Frozen',
  '🧊 When your brain hits the emergency brake',
  '**Freezing** isn''t procrastination, it''s your brain **locking up under pressure**. ADHD **overloads your cognitive system** until it hits **pause**. You''re not being **lazy**. You''re in **shutdown mode** because your **nervous system is maxed out**.',
  'Freeze mode is your brain saying, "I''m overwhelmed." That''s not weakness, it''s a survival response. You need safety, not shame. Ground yourself. Breathe. Move one inch forward.',
  'You''re stuck in your head. Get out of it. Do one thing, even if it''s wrong. Frozen isn''t a forever state. Break it with motion. Now.',
  ARRAY[
    'Executive dysfunction: Can completely halt forward motion',
    'Time blindness + pressure: Equals total shutdown',
    'Overthinking every outcome: Can lead to analysis paralysis',
    'Fear of failure or judgment: Makes stillness feel safer',
    'ADHD brains often wait for the "right mood" to act: And it doesn''t come'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧠",
      "title": "Acknowledge the Freeze Without Shame",
      "intro": "Your system is paused, not because you don''t care, but because it''s overwhelmed.",
      "try_this": [
        "Say it aloud: \"I feel stuck, and that makes sense.\"",
        "Remind yourself: ADHD brains freeze when things feel too big, unclear, or emotionally loaded.",
        "Banish the shame words: Lazy, stupid, useless, those don''t belong here.",
        "Let yourself begin by _naming_, not fixing."
      ],
      "tip": "Freezing is a stress response. The antidote is not pressure, it''s permission."
    },
    {
      "number": 2,
      "emoji": "🔍",
      "title": "Understand Why You''re Frozen",
      "intro": "Getting curious helps you move gently from stuck to soft.",
      "try_this": [
        "Ask: Am I overwhelmed by choices? Scared of messing up? Unsure what comes first?",
        "Notice emotions underneath: Is this shame? Fear? Decision fatigue?",
        "Check for ADHD roots: Is this analysis paralysis? Working memory overload? Emotional flooding?",
        "Brain dump it out: 5 minutes, no filter. Just let it spill."
      ],
      "tip": "Freezing is often a mix of too many thoughts + too much emotion + not enough clarity."
    },
    {
      "number": 3,
      "emoji": "🚪",
      "title": "Move Toward Motion, Tiny, Visible Steps",
      "intro": "You don''t have to unfreeze all at once. Just wiggle the door.",
      "try_this": [
        "Choose one micro-step: Open the tab. Write the date. Stand up.",
        "Set a 3-5 minute timer: Don''t commit to finishing, just to starting.",
        "Use a checklist with steps as small as \"uncap the pen\" or \"plug in the laptop.\"",
        "Body double: Work alongside someone (virtually or IRL) to gently unlock action.",
        "Move your body first: Even a stretch or walk can restart flow."
      ],
      "tip": "Action creates clarity. You don''t need motivation, you need momentum."
    },
    {
      "number": 4,
      "emoji": "🌬️",
      "title": "Regulate Your Emotions and Nervous System",
      "intro": "A frozen brain is often a flooded brain. Let''s soothe it.",
      "try_this": [
        "Do a sensory scan: Notice what you hear, feel, smell, see, taste.",
        "Try box breathing or 4-7-8: To settle your nervous system.",
        "Name what you''re feeling: \"I''m scared to get it wrong.\" \"I feel too much.\"",
        "Reframe: \"This is hard for my brain, and I''m learning to support it.\""
      ],
      "tip": "You don''t have to _solve_ your feelings, just honor and move through them."
    },
    {
      "number": 5,
      "emoji": "🤝",
      "title": "Get Support, You Weren''t Meant to Do This Alone",
      "intro": "Freezing is easier to melt when someone else is near.",
      "try_this": [
        "Text a friend: \"I''m frozen. Can I talk it through?\"",
        "Use a body double app or co-working space: Shared presence reduces activation friction.",
        "Talk to a therapist or ADHD coach: To help untangle chronic stuckness.",
        "Join ADHD groups or Discords: Just seeing \"me too\" can unstick you."
      ],
      "tip": "Co-regulation and co-thinking are powerful. Your brain wasn''t meant to solo this."
    }
  ]'
),
(
  'I Feel Shame',
  '😔 When your worth feels tied to your performance',
  '**Shame** with ADHD isn''t just feeling bad, it''s feeling **broken**. You''ve likely been told your challenges are **personal failures**, not **neurological differences**. Over time, that becomes **internalized**. But your worth isn''t tied to how well you **perform**, it''s tied to being **human**.',
  'Shame says you''re the problem, but you''re not. You''re a human with a brain that needs support, not punishment. The mess, the delay, the struggle, it''s all part of the process. You can''t hate yourself into healing. Meet yourself with softness.',
  'Shame is keeping you small. You made a mistake, now fix it. Shame feeds paralysis. Action breaks it. You''re not the worst, you''re just hiding. Step out of it. Do the thing.',
  ARRAY[
    'Emotional dysregulation: Makes shame feel intense and long-lasting',
    'ADHD brains ruminate on past mistakes: Even small ones',
    'Repeated criticism over "simple" things: Builds deep self-doubt',
    'You may internalize ADHD struggles: As personal failures',
    'Years of masking: Can disconnect you from your real needs'
  ],
  '[
    {
      "number": 1,
      "emoji": "🫶",
      "title": "Name the Shame Without Letting It Define You",
      "intro": "Shame thrives in silence. You don''t have to justify or hide anymore.",
      "try_this": [
        "Say it out loud: \"I feel ashamed… and I don''t need to stay stuck there.\"",
        "Remember: Shame is a feeling, not a fact. It shows up when you''ve internalized blame.",
        "Trace it back: Ask, \"Whose voice is this really?\" Teachers? Parents? Society?",
        "Write a compassion letter to your younger self: The one who first felt \"too much\" or \"not enough.\""
      ],
      "tip": "Shame wants you to shrink. Self-compassion helps you step into the light."
    },
    {
      "number": 2,
      "emoji": "🧭",
      "title": "Separate Who You Are From What You Struggle With",
      "intro": "ADHD is part of your wiring, not your worth.",
      "try_this": [
        "Reframe: Instead of \"I''m a mess,\" try \"I''m someone with ADHD who''s learning how to work with it.\"",
        "List the facts: One page for your strengths. One for your challenges. You are both.",
        "Challenge \"I am\" thoughts: Swap \"I am bad at everything\" for \"My brain struggles with…\" and \"I''m learning to…\"",
        "Notice what''s uniquely _you_: Humor? Empathy? Pattern recognition? Celebrate it."
      ],
      "tip": "Shame collapses identity into failure. You are more than what''s hard."
    },
    {
      "number": 3,
      "emoji": "🎯",
      "title": "Embrace Imperfection and Celebrate Micro-Wins",
      "intro": "Perfectionism fuels shame. Progress dissolves it.",
      "try_this": [
        "Practice \"good enough\": What''s the minimum viable version of the thing?",
        "Track even the tiniest success: Got out of bed? Answered one email? That counts.",
        "Keep a \"proof I''m growing\" list: Wins, compliments, patterns you''ve shifted.",
        "Create something messy: Doodle, cook, sing badly, practice being imperfect on purpose."
      ],
      "tip": "The antidote to shame isn''t perfection, it''s proof that you''re trying in your own way."
    },
    {
      "number": 4,
      "emoji": "🧑‍🤝‍🧑",
      "title": "Let Others In and Set Your Own Boundaries",
      "intro": "You don''t have to hide. You also don''t have to explain everything.",
      "try_this": [
        "Text a trusted friend: \"Hey, I''m spiraling in shame. Can I talk it out?\"",
        "Practice saying: \"This is something my ADHD makes harder. I''m working on it.\"",
        "Set firm but gentle boundaries: \"I''m not taking on that task right now.\"",
        "Talk about ADHD like a user manual: \"Here''s what helps me function best.\""
      ],
      "tip": "Being understood heals shame. And being misunderstood isn''t your fault."
    },
    {
      "number": 5,
      "emoji": "🧑‍⚕️",
      "title": "Use Resources That See You Fully",
      "intro": "You weren''t meant to go this alone. You deserve support that gets your brain.",
      "try_this": [
        "Listen to ADHD podcasts or videos: _How to ADHD_, _ADHD ReWired_, let yourself be seen.",
        "Find a therapist or coach who specializes in ADHD and shame: Ask them directly: \"Do you have experience with neurodivergence?\"",
        "Join support groups or ADHD communities: Like ADDA, CHADD, or Discord servers.",
        "Read stories of others with ADHD: Seeing yourself reflected is powerful."
      ],
      "tip": "If the world taught you to feel ashamed, the world was wrong. You''re not broken, just misunderstood."
    }
  ]'
),
(
  'I Forgot',
  '🧠 When your working memory drops the ball',
  '**Forgetting** things doesn''t mean you don''t care, it means your **working memory** dropped it. ADHD brains have trouble **holding onto short-term tasks**, especially if they''re not urgent or visible. You''re not careless. Your brain just isn''t built for **mental Post-it notes**.',
  'Forgetfulness isn''t a character flaw, it''s part of how ADHD brains are wired. You don''t need to "try harder", you need tools. External reminders. Visual cues. Consistency. You can remember more _by relying on your environment, not your memory_.',
  'You know you forget things, so why aren''t you setting systems? Stop acting surprised every time. Write it down. Set the reminder. You can''t just hope your brain will do better.',
  ARRAY[
    'Working memory gaps: Make it easy to drop tasks mid-flow',
    'You may hyperfocus on one thing: And block out everything else',
    'ADHD brains struggle with holding onto "invisible" or delayed tasks',
    'Lack of time cues or visual reminders: Increases forgetfulness',
    'Guilt from forgetting: Can snowball into avoidance'
  ],
  '[
    {
      "number": 1,
      "emoji": "💛",
      "title": "Reframe Forgetfulness with Compassion, Not Criticism",
      "intro": "You didn''t forget because you''re lazy. You forgot because your brain needs backup.",
      "try_this": [
        "Say: \"This is my ADHD brain, not a character flaw.\"",
        "Replace \"I''m a mess\" with \"This task needs a system.\"",
        "Banish shamey words like \"flaky\" or \"incompetent\": They don''t belong to you.",
        "Write a reminder to your future self: \"You care. You just need more cues.\""
      ],
      "tip": "Forgetting is a symptom, not a moral failing. Let''s work with your memory, not against it."
    },
    {
      "number": 2,
      "emoji": "🗓️",
      "title": "Build an External Brain: Don''t Try to Remember, _Design to Remember_",
      "intro": "Out of sight = out of mind. So get it _in_ sight.",
      "try_this": [
        "Set alarms and visual timers: One for each key transition or action.",
        "Use checklists, planners, or task apps you _actually_ like.",
        "Color-code, label, or post visual cues: Where the action happens (e.g., sticky note on the fridge).",
        "Create a \"launchpad\" by the door: For essentials like keys, wallet, meds.",
        "Use the \"Touch It Once\" rule: Immediately write it down, log it, or act on it."
      ],
      "tip": "Don''t shame yourself for needing tools. Pilots use checklists too."
    },
    {
      "number": 3,
      "emoji": "🧩",
      "title": "Structure Tasks for ADHD Memory",
      "intro": "Large, vague tasks are memory kryptonite. Break it all down.",
      "try_this": [
        "Micro-step it: Break \"clean kitchen\" into \"open dishwasher\" → \"put in one dish.\"",
        "Use checklists for multi-step tasks: E.g., morning routine, leaving the house.",
        "Try time-blocking around \"anchor points\": Like meals or meds.",
        "Track time honestly for a week: To calibrate your time expectations.",
        "Define success by the _action_, not the outcome: \"Check planner = win.\""
      ],
      "tip": "The more you externalize, the less you drop."
    },
    {
      "number": 4,
      "emoji": "🔁",
      "title": "Manage Transitions + Distractions with Intention",
      "intro": "Memory gaps often sneak in between tasks, or during hyperfocus.",
      "try_this": [
        "Transition mindfully: End each task with a mini reset, stretch, breathe, check notes.",
        "Set \"rescue\" alarms for hyperfocus traps: Pick sounds that surprise you.",
        "Designate low-distraction zones: Phones in other rooms, tabs closed, visual clutter cleared.",
        "Use a whiteboard or post-it path for big projects: \"Here''s where I left off.\"",
        "Accept \"less stuff = fewer things to remember\": Simplify where possible."
      ],
      "tip": "Forgetting isn''t just about recall, it''s about the _interruptions_ between."
    },
    {
      "number": 5,
      "emoji": "🤝",
      "title": "Create a Memory-Friendly Support Ecosystem",
      "intro": "You don''t have to remember everything. You can be reminded, with love and systems.",
      "try_this": [
        "Body doubling: Work beside someone to stay anchored.",
        "Accountability buddies: \"Text me at 3 to check if I left yet.\"",
        "ADHD coaching: Get custom support for building systems that _stick_.",
        "Therapy: Unpack the shame that comes from a lifetime of being called \"forgetful.\"",
        "Join ADHD communities: Hear \"me too\" and find tricks others swear by."
      ],
      "tip": "Needing reminders doesn''t make you weak. It makes you smart enough to adapt."
    }
  ]'
),
(
  'I Got Distracted',
  '🔄 When your attention gets hijacked',
  'Getting **distracted** isn''t a character flaw, it''s a brain constantly pulled in **ten directions at once**. ADHD affects your ability to **filter noise**, **shift focus**, or stay connected to what you were doing. It''s not about **willpower**, it''s about **wiring**.',
  'Distraction isn''t a moral failure, it''s a brain state. You''re not failing, you''re responding to an environment that pulls your attention everywhere. ADHD needs buffers. Timers. Headphones. Breaks. You can return to the task, it''s still waiting.',
  'You''re letting your attention run wild. You know this happens, plan for it. Cut the tabs. Silence the phone. Set a timer. You don''t have to feel focused to act focused.',
  ARRAY[
    'ADHD means attention is interest-based: Not importance-based',
    'Internal distractions (thoughts, feelings): Feel just as loud as external ones',
    'Novel ideas can derail focus mid-task',
    'Interruptions break momentum: And are hard to recover from',
    'You may feel shame or frustration: Making it harder to refocus'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧠",
      "title": "Accept Distraction as a Brain Thing, Not a Character Flaw",
      "intro": "You''re not careless, your brain just filters the world differently.",
      "try_this": [
        "Say: \"This is my interest-driven brain at work, not a lack of effort.\"",
        "Reframe: \"I got distracted\" → \"I was pulled toward stimulation.\"",
        "Ditch shamey labels like \"scatterbrained\": They don''t help, and they''re not true.",
        "Ask: Was I overstimulated? Bored? Tired? That data can help you pivot next time."
      ],
      "tip": "You don''t need to force focus. You need tools that match how your brain _actually_ works."
    },
    {
      "number": 2,
      "emoji": "🗒️",
      "title": "Externalize Everything, Don''t Trust Your Brain to Hold It",
      "intro": "ADHD brains forget what''s out of sight. So make everything visible, pingable, and retrievable.",
      "try_this": [
        "Write down your tasks and ideas: ALL of them.",
        "Create an \"Idea Parking Lot\" for distractions: That pop up mid-task.",
        "Use alarms or visual timers: To signal task shifts, breaks, or check-ins.",
        "Leave breadcrumbs when you stop: \"What was I doing? What''s next?\"",
        "Use color coding, icons, or stickers: To keep visual memory engaged."
      ],
      "tip": "Forgetfulness isn''t failure. It''s a cue to externalize."
    },
    {
      "number": 3,
      "emoji": "📵",
      "title": "Create an ADHD-Friendly Environment",
      "intro": "Your setup can make focus harder, or much easier.",
      "try_this": [
        "Reduce noise: Use noise-canceling headphones or ambient playlists.",
        "Clear the visual clutter: Tidy desk, limited tabs, single browser window.",
        "Lock or hide distracting apps during focus sessions: Use app blockers if needed.",
        "Design your \"focus zone\" with only the tools you need.",
        "Batch-check messages, DMs, or email at set times: Not in real time."
      ],
      "tip": "ADHD brains are _cue-sensitive_, so change the cues, change the experience."
    },
    {
      "number": 4,
      "emoji": "⏱️",
      "title": "Tame Hyperfocus + Transition Trouble",
      "intro": "Getting stuck or derailed is part of ADHD. You can make it smoother to shift and re-enter.",
      "try_this": [
        "Use alarms to \"rescue\" yourself from hyperfocus: Every 30–90 minutes.",
        "Leave yourself notes at the end of a session: \"Next step: __\"",
        "Build in \"transition rituals\" between tasks: A breath, a stretch, a reset.",
        "Channel fidget energy into acceptable movement: Wobble stool, walking, fidget toy.",
        "Try body doubling: Someone nearby can help anchor your attention."
      ],
      "tip": "Your brain resists abrupt shifts. Let''s give it a _bridge_, not a jolt."
    },
    {
      "number": 5,
      "emoji": "🫶",
      "title": "Regulate, Reset, and Reconnect with Support",
      "intro": "Distraction isn''t failure, it''s a flag. The real win is getting back on track.",
      "try_this": [
        "Practice mindfulness: 2–5 minutes of breath work or a grounding scan.",
        "Go micro: \"Just do 2 minutes.\" The restart is the hardest part.",
        "Use coaching, therapy, or ADHD communities: To find your rhythm and get ideas.",
        "Say out loud: \"I lost track, now I''m coming back.\" That re-entry matters.",
        "Get gentle accountability: A check-in buddy, a shared task list, or just someone to say \"Go.\""
      ],
      "tip": "Getting distracted is _normal_ with ADHD. Getting back to center is the real skill."
    }
  ]'
),
(
  'I Keep Avoiding It',
  '🙈 When avoidance becomes your default mode',
  'Avoidance doesn''t mean you''re lazy, it means the task triggers **discomfort**, **shame**, or **overwhelm**, and your ADHD brain tries to **protect you**. The longer you wait, the harder it feels. But the avoidance isn''t the real problem, it''s what''s underneath.',
  'Avoidance is protection. Your brain is trying to spare you from discomfort. But the longer you wait, the louder the task becomes. Start with curiosity, not pressure. Why am I avoiding this? And what''s one step I can take?',
  'You''re avoiding because it''s easier, not because it''s impossible. Stop dodging it. The dread is worse than the task. Start the thing. Do it poorly. Just stop pretending avoidance is neutral, it''s a choice.',
  ARRAY[
    'Emotional dysregulation: Turns discomfort into dread',
    'Tasks that feel boring, unclear, or overwhelming: Get flagged as "danger"',
    'Avoidance becomes a short-term relief loop: That worsens stress',
    'Fear of failure, shame, or criticism: Makes delay feel safer',
    'Executive dysfunction: Makes it harder to re-engage once you disconnect'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧭",
      "title": "Understand What''s Driving the Avoidance",
      "intro": "Your brain isn''t saying \"no\", it''s saying \"this feels like too much.\"",
      "try_this": [
        "Name it: Is it unclear? Too big? Boring? Loaded with shame?",
        "Notice if you''re up against a \"Wall of Awful\": Layers of past failure or dread.",
        "Ask: What emotion is under the avoidance? Fear? Guilt? Overwhelm?",
        "Say: \"This isn''t me being lazy. It''s my brain saying I need a different way in.\""
      ],
      "tip": "Avoidance is information. Let''s listen, then shift the conditions."
    },
    {
      "number": 2,
      "emoji": "🪜",
      "title": "Break It Down + Write It Down",
      "intro": "If your brain can''t see it clearly, it can''t act on it. So make it concrete.",
      "try_this": [
        "Write out exactly what you''re avoiding: No judgment.",
        "Break it into _the tiniest_ steps: \"Open laptop\" counts.",
        "Use visual checklists: To lighten working memory load.",
        "Leave \"breadcrumbs\": Notes on what to do next if you stop midway."
      ],
      "tip": "Clarity reduces threat. Visibility creates safety. Micro-steps build trust."
    },
    {
      "number": 3,
      "emoji": "🎮",
      "title": "Engage Your Brain''s Dopamine System",
      "intro": "You need interest, urgency, or a spark, not \"just try harder.\"",
      "try_this": [
        "Set up a tiny reward for finishing: Stickers, snacks, a funny video.",
        "Try a \"Beat the Clock\" sprint: Race a timer for 5 minutes.",
        "Turn it into a challenge: \"Can I do this before the song ends?\"",
        "Body double: Do the task near someone else (IRL or virtual)."
      ],
      "tip": "Your brain runs on challenge, novelty, and celebration, not guilt."
    },
    {
      "number": 4,
      "emoji": "🧹",
      "title": "Reduce Friction + Adjust the Environment",
      "intro": "You don''t have to fight your space, you can make it work for you.",
      "try_this": [
        "Mute devices and block distractions: With an app like Freedom or Forest.",
        "Create a \"launchpad\": Where needed items are always ready.",
        "Set up a predictable start space: Same seat, music, drink as a ritual.",
        "Let yourself fidget or move: It regulates your attention, not disrupts it."
      ],
      "tip": "Fewer decisions = more action. More comfort = less resistance."
    },
    {
      "number": 5,
      "emoji": "🤝",
      "title": "Seek Support and Practice Gentle Reentry",
      "intro": "Avoidance thrives in isolation, connection and compassion break the cycle.",
      "try_this": [
        "Say it out loud to someone: \"I keep avoiding this and I don''t know why.\"",
        "Ask a friend to body double: Or just text \"I''m doing the thing now.\"",
        "Reflect: \"What helped me start? What got in my way?\"",
        "Talk kindly to yourself: \"I''m learning what works, this is part of the process.\""
      ],
      "tip": "Accountability doesn''t mean pressure. It means not being alone."
    }
  ]'
),
(
  'I Run Out of Steam',
  '🪫 When your energy crashes mid-journey',
  'With ADHD, you often start strong and then **crash**, not because you''re flaky, but because your **energy system** works differently. When the **novelty wears off** or things get harder, your **motivation tanks**. You''re not inconsistent, you''re **burning out** from the inside.',
  'Your energy dips are real. ADHD burns through fuel fast, emotionally and physically. You don''t need to power through. Rest is part of the rhythm. Refill before you crash. Short rests, body movement, water, they all count.',
  'Running out of steam isn''t an excuse, it''s a warning. You need a system to refuel. Get sleep. Get food. Take a walk. And then get back to it. You''re not done. You''re just paused.',
  ARRAY[
    'ADHD brains often sprint, then crash: Inconsistent energy is common',
    'Hyperfocus leads to burnout: When you forget to rest',
    'Motivation dips quickly: Once novelty or urgency fades',
    'Emotional stress or perfectionism: Drains your mental fuel',
    'Transitions between tasks: Cost more energy than most people realize'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧠",
      "title": "Accept Your Energy Patterns Without Shame",
      "intro": "Your brain uses more power to do less, that''s not weakness, that''s wiring.",
      "try_this": [
        "Reframe it: \"I''m not lazy, I''m running on empty. I need a refill, not a lecture.\"",
        "Pause before pushing: Ask, \"Am I depleted? Or just bored, hungry, overstimulated?\"",
        "Ditch the guilt: Low energy doesn''t mean low worth. It means your tank is low.",
        "Replace \"I should\" with \"What would help me feel 10% better right now?\""
      ],
      "tip": "ADHD burnout is real. What looks like a slump is often survival mode."
    },
    {
      "number": 2,
      "emoji": "💪",
      "title": "Fuel Your Brain with Movement and Intentional Rest",
      "intro": "Energy isn''t just about sleep. It''s about rhythm, rest, and regulation.",
      "try_this": [
        "Move to re-energize: Even 5 minutes of walking, dancing, or stretching counts.",
        "Redefine rest: Physical, emotional, sensory, social, they all matter.",
        "Try a micro-reset: Lay down, dim the lights, or do a single breathing cycle.",
        "Eat protein-rich snacks and hydrate: Your brain needs literal fuel."
      ],
      "tip": "You don''t earn rest, you require it. Recovery is part of the process."
    },
    {
      "number": 3,
      "emoji": "📅",
      "title": "Align Tasks With Your Energy Waves",
      "intro": "Don''t fight your cycles. Plan _with_ them instead.",
      "try_this": [
        "Schedule hard stuff for your natural high-energy windows: Morning, post-workout, etc.",
        "Save admin or passive tasks for your slump hours.",
        "Cut what''s non-essential today: Energy is a limited resource, budget it.",
        "Declutter your mental and physical space: To reduce cognitive drag."
      ],
      "tip": "Sustainable productivity starts with knowing your rhythms, not overriding them."
    },
    {
      "number": 4,
      "emoji": "🛠️",
      "title": "Use Tools That Sustain Momentum",
      "intro": "You don''t have to keep yourself going by willpower alone.",
      "try_this": [
        "Externalize: Write it down, set reminders, make checklists. Free up mental RAM.",
        "Break it down: \"Write email\" becomes → open email → write subject → one sentence.",
        "Leave breadcrumbs: When stopping a task, jot the _next_ step for easy re-entry.",
        "Try Pomodoro: Work for 25 min → break for 5. Or pick your own rhythm."
      ],
      "tip": "Consistency beats intensity. The goal is \"still moving,\" not \"all done.\""
    },
    {
      "number": 5,
      "emoji": "🎮",
      "title": "Use Motivation Boosters + Ask for Support",
      "intro": "ADHD motivation is driven by interest, urgency, novelty, and connection.",
      "try_this": [
        "Create short-term deadlines or mini goals: To build urgency.",
        "Set rewards: \"Once I finish this, I get [x].\" Make it fun.",
        "Use body doubling: Co-work with a friend or on a virtual co-focus app.",
        "Join a support group or hire an ADHD coach if you can: Guidance = fuel."
      ],
      "tip": "You don''t have to power through. You just need someone to walk with you."
    }
  ]'
),
(
  'I''m Afraid I''ll Fail',
  '😨 When fear of failure keeps you from trying',
  'Fear of failure hits harder with ADHD because your brain **remembers failure vividly** and **feels it deeply**. Even trying can feel risky when you''ve been **criticized**, **misunderstood**, or **punished for struggling**. You''re not weak, you''re **guarding yourself**.',
  'Fear of failure is real, and painful. Especially when you''ve failed before or been told you''re not enough. But not trying _is also_ a form of failure. Start scared. You can learn while you go. You don''t need to be fearless, just brave.',
  'Failure''s not fatal, stagnation is. You keep letting fear make your choices. It''s stealing your time, your potential, and your peace. You won''t know unless you try. Take the risk. Do it anyway.',
  ARRAY[
    'Rejection Sensitivity: Makes the idea of failure feel unbearable',
    'ADHD perfectionism: Pushes you to avoid rather than try',
    'Past experiences with failure: Often feel vivid and fresh',
    'Fear loops: Hijack your thoughts and keep you stuck in "what ifs"',
    'Executive dysfunction + fear: Equals paralyzing combo'
  ],
  '[
    {
      "number": 1,
      "emoji": "🫶",
      "title": "Acknowledge the Fear, Don''t Judge It",
      "intro": "ADHD makes past stumbles feel like proof you''ll mess up again, but fear isn''t a prophecy.",
      "try_this": [
        "Say it out loud: \"I''m afraid I''ll fail, and that''s okay to feel.\"",
        "Name what''s underneath: Fear of judgment? Rejection? Shame? Get specific.",
        "Reframe: \"This fear is a sign I care, not a sign I shouldn''t try.\"",
        "Mirror it back: What would you say to a friend in the same spot?"
      ],
      "tip": "Your ADHD isn''t a flaw, it''s a difference. Let''s stop treating it like a verdict."
    },
    {
      "number": 2,
      "emoji": "🔁",
      "title": "Redefine Failure as Feedback, Not Final",
      "intro": "Failure is part of the process, and not a reflection of your worth.",
      "try_this": [
        "Ask: \"What would ''good enough'' look like right now?\"",
        "Look for lessons: What didn''t work last time? What could be different?",
        "Track wins: Keep a \"proof list\" of times you thought you''d fail, but didn''t.",
        "Try → Learn → Adjust → Repeat: That''s how real growth works."
      ],
      "tip": "If something didn''t work, the strategy failed, not you."
    },
    {
      "number": 3,
      "emoji": "🧱",
      "title": "Break the Wall of Awful Into Tiny Steps",
      "intro": "Overwhelm fuels fear. Let''s shrink the task until it''s doable.",
      "try_this": [
        "Micro-step it: What''s the **very first thing** you could do? (Even if it''s \"open the tab\")",
        "Externalize: Write out the steps like you''re giving instructions to a confused robot.",
        "Breadcrumbs: If you stop, leave a note for Future You: \"Next up: X\"",
        "Talk it out: Verbal processors, explain the task to a friend or AI to make it clearer."
      ],
      "tip": "Clarity calms fear. The brain can''t act on fuzzy."
    },
    {
      "number": 4,
      "emoji": "🎯",
      "title": "Hack Motivation With Dopamine, Not Willpower",
      "intro": "The ADHD brain moves for **interest**, **urgency**, **challenge**, or **reward**, not just \"should.\"",
      "try_this": [
        "Reward stacking: \"If I do 5 mins, I get my favorite drink or a silly video.\"",
        "Make it urgent: Invite someone over, set a deadline, or make a bet with a friend.",
        "Make it fun: Add music, change your location, or make it a game.",
        "Body double: Sit with someone, even virtually, while you start."
      ],
      "tip": "You''re not unmotivated, you''re **differently motivated**. Work with your brain, not against it."
    },
    {
      "number": 5,
      "emoji": "🛟",
      "title": "Expand Your Support and Tolerance for Discomfort",
      "intro": "You don''t have to do ADHD solo. And growth comes with a little discomfort, that''s okay.",
      "try_this": [
        "Get support: ADHD coach, therapist, or just someone who listens without fixing.",
        "Practice discomfort reps: Try doing _one hard thing_, then reflect: \"What did I survive?\"",
        "Join a support group: Hear stories that sound like yours, it rewrites your inner script.",
        "Set boundaries: Say no to pressure that makes fear worse. Your nervous system matters too."
      ],
      "tip": "You don''t need to be fearless to take action. You just need to feel safe enough to try."
    }
  ]'
),
(
  'It Feels Pointless',
  '🌀 When nothing seems to matter',
  'Tasks feel **pointless** when your brain can''t connect them to a **clear reward**, **urgency**, or **meaning**. ADHD brains aren''t motivated by "should", they need a **why**. Without it, everything feels **flat**, no matter how important it might seem on paper.',
  'When you can''t see the outcome, it''s hard to feel motivated. You''re not lazy, you''re disconnected. Find a reason. Even a tiny one. Tie it to something meaningful. Purpose fuels momentum, and you deserve to feel like what you do matters.',
  'Everything feels pointless when you avoid action. You''re not going to find purpose from the couch. Move anyway. Meaning doesn''t appear, it''s built. Start building.',
  ARRAY[
    'ADHD brains crave meaning, urgency, or novelty: Not just obligation',
    'Low dopamine: Makes boring tasks feel physically painful',
    'Tasks with unclear outcomes: Feel unmotivating or empty',
    'If you''re disconnected from the "why": Your brain checks out',
    'Shame about "not caring enough": Adds to the avoidance'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧠",
      "title": "Recognize This Feeling as an ADHD Symptom",
      "intro": "This sense of \"what''s the point?\" isn''t laziness, it''s a **dopamine drought**.",
      "try_this": [
        "Reframe: \"My brain isn''t broken, it''s under-stimulated. I need a spark, not shame.\"",
        "Remind yourself: Feeling stuck doesn''t mean you''re not motivated. It means you need the right kind of _hook_ to unlock your drive.",
        "Accept that this happens: And it doesn''t make your goal or value any less real."
      ],
      "tip": "If it feels pointless, it''s likely the task is either too vague, too distant, or too disconnected from what fuels you."
    },
    {
      "number": 2,
      "emoji": "🔥",
      "title": "Reconnect to Purpose, Urgency, or Novelty",
      "intro": "You need **interest**, **challenge**, **reward**, or **urgency** to engage, not just importance.",
      "try_this": [
        "Ask: \"Why did this matter to me in the first place?\" or \"How could I make this meaningful right now?\"",
        "Add novelty: Change location, method, or tools. Make it a race. Switch things up to engage your brain.",
        "Create urgency: Set a playful deadline or invite someone to check in with you. Turn it into a timed \"mission.\"",
        "Ask better questions: What am I curious about? What would make this fun or weird?"
      ],
      "tip": "You''re not \"not motivated\", you''re **differently motivated**. Find your ignition point."
    },
    {
      "number": 3,
      "emoji": "🪜",
      "title": "Shrink the Task and Redefine Success",
      "intro": "When tasks are too big or abstract, they feel pointless. Let''s shrink and reframe.",
      "try_this": [
        "Break it down: What''s one **clear, tiny action** you can do now?",
        "Leave breadcrumbs: If you stop, write a note for Future You, \"Next step: ____\"",
        "Focus on progress, not perfection: Your brain gets dopamine from **moving**, not just achieving.",
        "Ask: \"What would ''good enough'' look like today?\""
      ],
      "tip": "Boring or endless tasks need clearer endings and **faster feedback loops**. Build them in."
    },
    {
      "number": 4,
      "emoji": "🧍‍♀️",
      "title": "Use Outside Tools to Jumpstart Action",
      "intro": "Your brain isn''t built for solo willpower. That''s okay, let''s build scaffolding.",
      "try_this": [
        "Use a Pomodoro timer: 25 min work, 5 min break, repeat. You can do one.",
        "Body double: Work near someone (even virtually). Their presence helps regulate attention.",
        "Reward system: Promise yourself something small and fun after finishing even the tiniest piece.",
        "Externalize your plans: Write your task list where you can see it. Don''t rely on memory."
      ],
      "tip": "If it lives only in your head, it''s not ADHD-proof. Put it _out where it can help you_."
    },
    {
      "number": 5,
      "emoji": "🌱",
      "title": "Build Self-Acceptance and Recharge Your Spark",
      "intro": "Feeling like nothing matters is exhausting. It''s okay to pause, and ask for help.",
      "try_this": [
        "Remind yourself: \"I''ve felt this before, and I''ve come back from it.\"",
        "Talk to an ADHD coach or therapist: Especially if hopelessness keeps coming back.",
        "Join a support group: Realizing you''re not the only one who feels this way can change everything.",
        "Reignite curiosity: Watch a video, read a blog, or explore something _just because_. Sometimes, purpose starts with a spark."
      ],
      "tip": "When everything feels pointless, **you don''t need more pressure, you need more light**."
    }
  ]'
),
(
  'It Feels Too Big',
  '🧱 When the mountain feels too high to climb',
  'When something feels **too big**, it''s not because you''re incapable, it''s because your ADHD brain sees the **whole mountain** and freezes. Breaking it down feels impossible. But the issue isn''t the task, it''s the **starting system** your brain didn''t get built with.',
  'Of course it feels too big, because you''re trying to do it all at once. ADHD brains struggle with sequencing and scale. Break it down until it feels doable. 1 step. 5 minutes. One corner of the mountain.',
  'You''re making it too big in your head and using that as an excuse. Break it down. Write it out. Take one chunk. You don''t have to finish, you just have to start moving.',
  ARRAY[
    'ADHD brains struggle with breaking down complex tasks',
    'Everything can feel like it has to be done all at once',
    'Poor time sense: Makes it hard to estimate how long anything will take',
    'Overwhelm quickly triggers shutdown or avoidance',
    'Without clear steps: Your brain may not know how to begin'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧠",
      "title": "Name the Overwhelm and Normalize It",
      "intro": "This isn''t about motivation or discipline, your brain is working hard just trying to figure out **where to begin**.",
      "try_this": [
        "Reframe: \"It''s not that I can''t do this, it''s that the _format_ is wrong for my brain right now.\"",
        "Practice radical self-compassion: \"Of course it feels too big, my brain''s overwhelmed, not lazy.\"",
        "Remind yourself: ADHD brains can _zoom out_ easily, but _zooming in_ takes scaffolding."
      ],
      "tip": "That frozen, overloaded feeling isn''t failure, it''s your brain waving a flag for support."
    },
    {
      "number": 2,
      "emoji": "🪜",
      "title": "Slice the Task Into Micro-Actions",
      "intro": "\"Do the thing\" is not a task. Let''s find the smallest, clearest next action, something Future You could start _without thinking_.",
      "try_this": [
        "Break it way down: \"Write the report\" becomes: Open Google Docs → Write the heading → Write 1 sentence",
        "Externalize: Get it out of your head and onto paper or screen.",
        "Pro-tip: Imagine giving instructions to a space alien who could mess up anything vague."
      ],
      "tip": "If it still feels too big, you haven''t gone small enough."
    },
    {
      "number": 3,
      "emoji": "🎯",
      "title": "Zoom In On Just One Starting Point",
      "intro": "You don''t need to finish. You just need **one foothold** to begin the climb.",
      "try_this": [
        "Ask: \"What''s the _very first_, least-intimidating thing I can do right now?\"",
        "Leave breadcrumbs: When stopping, jot a note to Future You: \"Next step: ___\"",
        "Ruthlessly trim the list: Circle 1–2 things that _actually matter today_."
      ],
      "tip": "Start anywhere that feels _doable_. Forward is forward."
    },
    {
      "number": 4,
      "emoji": "🚀",
      "title": "Fuel Up with Interest, Challenge, or Dopamine",
      "intro": "Tasks that feel too big usually feel too boring, too far away, or too unclear. Let''s make them spark.",
      "try_this": [
        "Add reward: Pick a treat or mini-break to pair with each chunk.",
        "Make it a sprint: \"How much can I do in 7 minutes?\" Set a timer.",
        "Body double: Sit with someone else while you start (even virtually).",
        "Add novelty: New location, soundtrack, tools, anything to _shake up the energy_."
      ],
      "tip": "Your brain isn''t unmotivated, it just needs a stronger _hook_."
    },
    {
      "number": 5,
      "emoji": "🌱",
      "title": "Build Resilience and Redefine Success",
      "intro": "You don''t have to be perfect. You just have to **try again differently**.",
      "try_this": [
        "Reframe failure as data: \"This strategy didn''t work, what might?\"",
        "Grow your discomfort tolerance: Let things be a little messy or incomplete.",
        "Get support: ADHD coaching, therapy, or community can turn mountains into molehills.",
        "Say it aloud: \"I''m not bad at this, I''m just doing it alone right now. Time to bring in reinforcements.\""
      ],
      "tip": "ADHD strategies are like shoes. If one doesn''t fit, it doesn''t mean your feet are wrong."
    }
  ]'
),
(
  'It''s Not Urgent',
  '🕰 When lack of pressure kills motivation',
  'If it''s not **urgent**, it might not exist in your ADHD brain. That''s not neglect, that''s **time blindness** and a **dopamine system** that responds to **now**, not later. You''ll care, just not until the clock''s ticking. And that''s not your fault.',
  'ADHD brains crave urgency to get started, so things without deadlines fall through the cracks. That doesn''t mean they''re unimportant. Add stakes, structure, or support. Your future self will thank you.',
  'You''re treating "not urgent" like "not necessary." That''s why you''re always behind. If it matters, do it _before_ it becomes a crisis. Choose to be proactive, or deal with the mess later.',
  ARRAY[
    'ADHD brains are driven by urgency, interest, or excitement: Not importance',
    'Tasks without deadlines: Feel invisible or irrelevant',
    'Dopamine levels stay too low: To spark motivation',
    'You may completely forget about non-urgent tasks: Until they become emergencies',
    'The longer you delay: The harder it becomes to care'
  ],
  '[
    {
      "number": 1,
      "emoji": "🔥",
      "title": "Reframe \"Not Urgent\" as a Dopamine and Time Blindness Thing",
      "intro": "Tasks without pressure often slide off the ADHD radar. That''s not laziness, that''s brain wiring.",
      "try_this": [
        "Reframe: \"This doesn''t feel urgent, but that''s just my brain''s signal system being fuzzy, not a reflection of importance.\"",
        "Create a **mini-deadline**: \"I''ll try this for the next 7 minutes\" or \"I want it off my plate before dinner.\"",
        "Add a challenge frame: \"How much of this can I knock out before the timer hits zero?\""
      ],
      "tip": "You don''t need \"real\" urgency, **artificial urgency works just fine**."
    },
    {
      "number": 2,
      "emoji": "🪜",
      "title": "Break It Down and Find the Smallest First Step",
      "intro": "When something feels distant, our brains often interpret it as \"too big\" or \"meh.\" Shrink it down to make it doable.",
      "try_this": [
        "Write out each step like you''re leaving instructions for a space alien.",
        "Only ask: \"What is the _very first thing_ I can do?\"",
        "Don''t aim for finished, aim for started."
      ],
      "tip": "If you''re staring at it, you''re probably waiting for it to feel urgent. Don''t wait. Zoom in."
    },
    {
      "number": 3,
      "emoji": "🧭",
      "title": "Externalize Time and Make It Feel Real",
      "intro": "Time doesn''t feel real to ADHD brains. Let''s bring it into the room.",
      "try_this": [
        "Use visual timers, Pomodoro clocks, or countdown apps: Seeing time helps _feel_ time.",
        "Time block your day: Assign loose \"zones\" like \"Email Zone 10-11\" or \"Project Hour 2-3\".",
        "Write it down: If it''s not visible, it may as well not exist."
      ],
      "tip": "**Time blindness is a brain thing**, externalizing time brings you back into sync."
    },
    {
      "number": 4,
      "emoji": "⚡",
      "title": "Add Dopamine, Rewards, and Interest",
      "intro": "You''re not unmotivated, you''re unstimulated. Let''s give your brain a reason to care now.",
      "try_this": [
        "Promise a reward: \"If I do this, I get a snack / song / scroll.\"",
        "Add novelty: New playlist, different location, different pen.",
        "Start with the easiest piece: To build momentum.",
        "Celebrate the _doing_, not just the done."
      ],
      "tip": "Dopamine flows _before_ the reward, make progress feel good."
    },
    {
      "number": 5,
      "emoji": "🧍",
      "title": "Don''t Go It Alone, Let Others Hold You to It",
      "intro": "Motivation grows when someone''s watching, even if they don''t say a word.",
      "try_this": [
        "Body double: Work while someone else is present (IRL or virtual).",
        "Ask for accountability: \"Can I text you when I start this?\" or \"Check on me at 4?\"",
        "Share your goal out loud: Social stakes = urgency.",
        "Work with a coach or therapist: To build non-urgent structure into your routine."
      ],
      "tip": "**No shame in needing scaffolding**, you''re building the life your brain works with, not against."
    }
  ]'
),
(
  'Too Many Decisions',
  '🤯 When choice overload freezes your brain',
  'ADHD makes even small choices feel like a **mental traffic jam**. **Decision fatigue** sets in quickly when your brain is juggling too many variables at once. It''s not indecision, it''s **cognitive overload**. No wonder you feel stuck.',
  'Decision fatigue is real. ADHD brains burn out fast when juggling too many options. Simplify. Pre-decide. Remove half the choices. You don''t have to get it perfect, you just need one next step.',
  'You''re not stuck, you''re stalling. You''ve made harder choices before. Pick something. Take action. Every minute you delay is another you don''t get back. Make a move.',
  ARRAY[
    'Decision-making is an executive function: And ADHD weakens that system',
    'Every choice can feel high-stakes or emotionally loaded',
    'Analysis paralysis: Leads to overthinking, stalling, and burnout',
    'Low working memory: Makes it hard to compare options or hold context',
    'Fear of making the "wrong" choice: Can freeze all progress'
  ],
  '[
    {
      "number": 1,
      "emoji": "📝",
      "title": "Dump It Out of Your Head, Externalize Everything",
      "intro": "Your brain isn''t great at juggling 12 tabs open at once. That''s working memory overload, not failure.",
      "try_this": [
        "Brain dump all the decisions, tasks, options, and loose ends.",
        "Turn big vague decisions into clear, concrete choices.",
        "Use checklists or categories like: \"Now / Soon / Later / Maybe\""
      ],
      "tip": "Don''t try to hold it in your head, **write it down to shrink it down**."
    },
    {
      "number": 2,
      "emoji": "🎯",
      "title": "Ruthlessly Simplify Your Choices",
      "intro": "You don''t need _all_ the options. You need fewer.",
      "try_this": [
        "Ask: \"What actually matters _right now_?\"",
        "Shrink your list: Cut it down to 3, then to 1.",
        "Set a time limit: \"I''ll pick something in the next 7 minutes.\"",
        "Say no: For every new yes, remove something else."
      ],
      "tip": "**More options = more stuck. Less = clarity.** Decision limits are freedom."
    },
    {
      "number": 3,
      "emoji": "🪜",
      "title": "Break It Into Micro-Steps and Just Pick the Next One",
      "intro": "Big choices are really just a bunch of small ones hiding in a trench coat.",
      "try_this": [
        "Break the decision or task into tiny, single-step actions.",
        "Choose just _one_ next step, ignore the rest for now.",
        "Gamify small decisions: Flip a coin, roll dice, or let a randomizer choose."
      ],
      "tip": "You don''t need the _perfect_ choice. You need **movement**."
    },
    {
      "number": 4,
      "emoji": "🧍‍♀️",
      "title": "Let Structure and People Help Carry the Load",
      "intro": "ADHD brains thrive with outside scaffolding. You don''t have to manage it all internally.",
      "try_this": [
        "Use timers, visual aids, or calendar blocks: To externalize your schedule.",
        "Use a body double: Sit with someone while you decide or do the thing.",
        "Set up \"decision buffer\" time: A little in-between space to reset between tasks."
      ],
      "tip": "**Support isn''t weakness.** It''s the smartest tool in your ADHD kit."
    },
    {
      "number": 5,
      "emoji": "💛",
      "title": "Ditch Perfection and Practice Gentle Decision-Making",
      "intro": "This doesn''t have to be the _best_ choice. It just has to be a choice.",
      "try_this": [
        "Self-talk check: \"I''m not lazy or indecisive, I''m overloaded.\"",
        "Make fewer decisions each day: Pick outfits, meals, or priorities ahead of time.",
        "Remind yourself: \"Good enough is good enough. Progress > perfection.\""
      ],
      "tip": "**You are allowed to make \"okay\" decisions**. They''re better than burnout."
    }
  ]'
);

-- Verify the imports
SELECT barrier_name, intro_paragraph FROM barriers_content ORDER BY barrier_name;