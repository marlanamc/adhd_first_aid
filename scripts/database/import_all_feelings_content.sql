-- Import All Feelings Content for Supabase
-- This script processes all feeling pages following the "Ashamed" format we established
-- Run this after running the schema update script

-- Clear existing data first
-- UNCOMMENT the line below to clear existing data:
-- DELETE FROM feelings_content;

-- Insert all feelings content
INSERT INTO feelings_content (
  feeling_name,
  subtitle,
  intro_paragraph,
  gentle_advice,
  stern_advice,
  adhd_reasons,
  step_sections
) VALUES 
(
  'Anxious',
  'It''s not weakness, it''s not overreacting • It''s ADHD meeting **nervous system dysregulation, hypervigilance, and too many open tabs** in your mind.',
  'Anxiety hits differently with ADHD. That **tight chest, spinning mind, and urgency**? It''s **fear speaking, not facts**. Your brain is trying to protect you from **threats that may not even exist**. But that doesn''t make the feeling **less real or valid**.',
  'Your brain is trying to protect you. That tight chest, spinning mind, and urgency? It''s fear speaking, not facts. Pause. Breathe into your body. Move slowly. You are safe right now, even if your mind says otherwise.',
  'You can''t keep letting fear steer the ship. You''ve been here before, and you survived. Breathe. Move. Do the thing. Let your body prove to your brain that the world won''t end.',
  ARRAY[
    'Emotional dysregulation: Can turn small worries into spirals',
    'Time blindness: Makes everything feel urgent or "now or never"',
    'Overactive working memory: Loops fears and "what-ifs" endlessly',
    'Rejection Sensitivity: Makes social situations feel threatening',
    'Nervous system hyperreactivity: Keeps the body on high alert'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧭",
      "title": "Recognize Anxiety as a Message, Not a Threat",
      "intro": "Start by tuning in without judgment.",
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
      "tip": "Your body needs to feel safety before your brain believes it."
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
      "intro": "When anxiety makes everything feel unmanageable, do less, not more.",
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
),
(
  'Overwhelmed',
  'It''s not being lazy, it''s not bad time management • It''s ADHD meeting **decision fatigue, emotional overload, and the feeling that everything is happening all at once**.',
  'With ADHD, "overwhelmed" doesn''t just mean busy, it means **paralyzed**. Your brain tries to track **too many tasks, options, feelings, and expectations at once**… and **short-circuits**. Even **simple things feel impossible** when there''s no clear place to start. You''re not behind. You''re **overloaded**. There''s a difference.',
  'Of course you''re overwhelmed, you''re carrying too much, too fast, without enough support. Breathe. Write it down. Do one thing at a time. You''re not behind. You''re overloaded. Slow down to move forward.',
  'Overwhelm doesn''t mean "stop everything." It means _prioritize._ What matters most right now? Do that. Then the next thing. You''re not going to solve it by spiraling.',
  ARRAY[
    'Executive dysfunction: Makes prioritizing and sequencing difficult',
    'Time blindness: Turns small tasks into urgent crises',
    'Sensory overload: Plus emotional intensity equals full system spike',
    'All-or-nothing thinking: Makes it feel like everything needs to happen right now',
    'Working memory gaps: Mean you''re always afraid of forgetting something important'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧭",
      "title": "Acknowledge the Overwhelm",
      "intro": "You''re not lazy, broken, or falling behind. Your brain just needs a different approach right now.",
      "try_this": [
        "Don''t push through it: This feeling is a signal that your system needs support",
        "Pause, breathe, and remind yourself: \"This is a signal, not a failure\"",
        "Name it to tame it: Say out loud \"I''m feeling overwhelmed right now\"",
        "Give yourself permission to step back: Overwhelm requires regulation first, action second"
      ],
      "tip": "Overwhelm is your nervous system saying \"too much, too fast.\" Listen to it with compassion."
    },
    {
      "number": 2,
      "emoji": "🧘",
      "title": "Regulate, Calm Your Nervous System",
      "intro": "Let''s get your brain and body back online.",
      "try_this": [
        "Body: Take your meds if you forgot, drink water, eat something, try light movement or stretching",
        "Mind: Quick brain dump, 3 deep breaths, short meditation or guided audio",
        "Sensory: Peaceful lighting, music or background noise, weighted blanket or comfy texture"
      ],
      "tip": "You''re not lazy or crazy, your brain is responding to stress. Let''s meet it with care."
    },
    {
      "number": 3,
      "emoji": "🔍",
      "title": "Zoom Out, What''s Really Going On?",
      "intro": "Understanding the overwhelm helps you respond to it more effectively.",
      "try_this": [
        "Am I hungry, tired, overstimulated, or scattered?",
        "Am I avoiding something because I''m afraid I''ll fail or do it wrong?",
        "Do I have too many decisions to make or too many things on my plate?",
        "Is there something specific stressing me out that I haven''t named yet?"
      ],
      "tip": "Overwhelm often has specific causes. Finding them helps you address the root, not just the symptoms."
    },
    {
      "number": 4,
      "emoji": "🎯",
      "title": "Focus on the Next Small Step",
      "intro": "You don''t need to solve everything right now. Just the next right thing.",
      "try_this": [
        "Pick ONE thing: What would make the biggest difference right now?",
        "Make it smaller: Break your chosen task into the tiniest possible first step",
        "Set a timer: Work for 10-15 minutes, then reassess",
        "Lower the bar: Done is better than perfect, and \"good enough\" is great"
      ],
      "tip": "Progress beats perfection. Small consistent steps add up to big changes over time."
    },
    {
      "number": 5,
      "emoji": "🛠️",
      "title": "Build Systems That Prevent Future Overwhelm",
      "intro": "You don''t need more willpower, you need better systems.",
      "try_this": [
        "Externalize everything: Your brain isn''t a storage unit, use planners, apps, or lists",
        "Set boundaries: Practice saying \"Let me check my calendar and get back to you\"",
        "Create buffer time: Schedule breaks and transition time between tasks",
        "Regular check-ins: Weekly reviews to catch overwhelm before it builds up",
        "Ask for help: Delegate, outsource, or simply tell someone you''re struggling"
      ],
      "tip": "Overwhelm is often a sign that you need more structure and support, not more discipline."
    }
  ]'::jsonb
),
(
  'Mental Fog',
  'It''s not laziness, it''s not being "spacey" • It''s ADHD meeting **cognitive overload, dopamine depletion, and a brain that''s trying to function without fuel**.',
  'Mental fog isn''t just "being distracted", it''s a **full-body, full-brain shutdown**. You know there are things you need to do, but your thoughts feel **heavy, distant, or blank**. You try to concentrate, and **nothing sticks**. With ADHD, this kind of fog can strike after **too much stimulation, too little rest, poor nutrition, or even emotional burnout**. This isn''t about **effort**, it''s about **capacity**.',
  'Your brain feels foggy because it''s tired, overloaded, or undernourished. That doesn''t mean you''re broken. Step away from the screen. Drink water. Move your body. The fog lifts more easily when you stop pushing through it blindly.',
  'You can''t think clearly because you''ve ignored your basics. Eat. Hydrate. Step outside. Then write down the top 3 things you need to do. You won''t get clarity by waiting, create it.',
  ARRAY[
    'Low dopamine: Mental fatigue makes your brain slow and unresponsive',
    'Working memory overload: From juggling too many tasks and thoughts',
    'Time blindness: Causes task pressure that fogs clarity instead of creating urgency',
    'Missed meals or poor hydration: Can trigger a full-system crash',
    'Emotional exhaustion: Or masking can leave you mentally flatlined'
  ],
  '[
    {
      "number": 1,
      "emoji": "🔍",
      "title": "Understand Where the Fog Is Coming From",
      "intro": "Mental fog isn''t laziness or \"being dumb,\" it''s your brain protecting itself from overload.",
      "try_this": [
        "Cognitive overload: Too many decisions, tasks, or mental threads running at once",
        "Emotional flooding: Stress, anxiety, or big feelings can cloud thinking",
        "Physical depletion: Poor sleep, hunger, dehydration, or medication timing",
        "Sensory overwhelm: Too much noise, light, or stimulation draining your mental bandwidth",
        "Task switching fatigue: Jumping between too many different types of work"
      ],
      "tip": "Mental fog is a signal from your brain that it needs support, not a character flaw."
    },
    {
      "number": 2,
      "emoji": "📤",
      "title": "Clear the Internal Clutter",
      "intro": "Your working memory is full. Let''s empty it out so your brain has room to think clearly.",
      "try_this": [
        "Brain dump everything: Write down every task, worry, or random thought swirling in your head",
        "Sort into containers: \"Do today,\" \"Do this week,\" \"Someday/maybe,\" and \"Not my problem\"",
        "Close mental tabs: Finish, postpone, or delegate incomplete tasks taking up mental space",
        "Park decisions: Write down choices you need to make instead of cycling through them",
        "Clear your physical space: Tidy your desk, close browser tabs, put away distractions"
      ],
      "tip": "Your brain can''t think clearly when it''s trying to remember everything. External storage equals internal clarity."
    },
    {
      "number": 3,
      "emoji": "🧘",
      "title": "Reset Your Nervous System with Sensory and Movement",
      "intro": "You can''t think your way out of mental fog. Your body needs to shift first, then your brain follows.",
      "try_this": [
        "Breathe deeply: Box breathing (4 in, 4 hold, 4 out, 4 hold) to activate your rest response",
        "Move gently: Walk, stretch, shake out tension, or do jumping jacks to reset",
        "Hydrate and fuel: Drink water, eat protein, check if low blood sugar is fogging you",
        "Reduce sensory input: Dim lights, use headphones, find a quiet space to decompress",
        "Ground in your senses: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste"
      ],
      "tip": "Mental fog often lifts naturally once your nervous system feels safe and regulated."
    },
    {
      "number": 4,
      "emoji": "🪨",
      "title": "Reduce Demands and Focus Your Energy",
      "intro": "You can''t add clarity to an overloaded system. Let''s reduce the cognitive load first.",
      "try_this": [
        "Pick ONE priority: What''s the most important thing you need mental clarity for right now?",
        "Postpone non-essentials: Move optional tasks to later when your brain is clearer",
        "Simplify decisions: Use templates, defaults, or \"good enough\" instead of optimizing",
        "Batch similar tasks: Group emails, calls, or admin work to reduce task-switching",
        "Set boundaries: Say no to new requests until your mental bandwidth recovers"
      ],
      "tip": "Clarity comes from focus, and focus comes from reducing competing demands on your attention."
    },
    {
      "number": 5,
      "emoji": "🔄",
      "title": "Build Systems That Prevent Future Fog",
      "intro": "Mental fog often returns when the same overload patterns repeat. Let''s build prevention into your life.",
      "try_this": [
        "Create a daily \"brain dump\" ritual: 10 minutes each morning or evening to clear mental clutter",
        "Use a \"second brain\" system: Trusted notes app, planner, or digital system for external memory",
        "Schedule regular breaks: Your brain needs recovery time, not just work time",
        "Track your fog patterns: Notice what triggers it so you can prevent it earlier",
        "Build a fog protocol: Know exactly what steps help you clear it when it comes back",
        "Protect your energy: Set limits on commitments, decisions, and mental load during high-stress periods"
      ],
      "tip": "The best way to clear mental fog is to prevent it by designing sustainable rhythms for your ADHD brain."
    }
  ]'::jsonb
),
(
  'Frustrated',
  'It''s not overreacting, it''s not being difficult • It''s ADHD meeting **blocked momentum, missed intentions, and invisible effort that goes unrewarded**.',
  'Frustration builds when you know what to do but can''t seem to get yourself to do it, or when you finally start, and 10 other problems pop up first. With ADHD, it''s not just one thing that goes wrong, it''s everything at once, and the emotional dam breaks fast. You''re not being dramatic. You''re exhausted from trying and still feeling stuck.',
  'Frustration usually means something matters. You''re trying, and it''s not working, and that''s valid. Step away. Shake it out. Come back with curiosity instead of control. You''re not alone in this.',
  'Yelling at the problem won''t solve it. You''re spinning your wheels. Take a breath. Walk away if you need to. Then fix it. Don''t let the feeling drive the action.',
  ARRAY[
    'Executive dysfunction: Turns small steps into uphill battles',
    'Rejection sensitivity: Can make any mistake feel personal or public',
    'Task-switching and distraction: Disrupt flow, again and again',
    'Systems that work for others: Often fall apart for you',
    'Emotional dysregulation: Once you''re triggered, it''s hard to come back down'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧠",
      "title": "Notice Frustration as a Signal, Not a Flaw",
      "intro": "Frustration means your needs aren''t being met, not that you''re being unreasonable.",
      "try_this": [
        "Name it to tame it: Say it out loud, \"I''m frustrated\"",
        "Notice the body: Tension, clenched jaw, restlessness, pressure in chest?",
        "Don''t shame it: Frustration is a normal response to stuckness, not a character defect",
        "Ask: \"What isn''t working for me right now?\""
      ],
      "tip": "Suppressing frustration doesn''t solve it, acknowledging it gives you power."
    },
    {
      "number": 2,
      "emoji": "🌬️",
      "title": "Regulate First, Create Space Between Trigger and Response",
      "intro": "When frustration spikes, nervous system tools are your off-ramp from a spiral.",
      "try_this": [
        "Move it out: Walk, stretch, bounce, shake, dance it out",
        "Find quiet: Noise-canceling headphones, a dim room, deep breathing",
        "Use pressure or warmth: Weighted blanket, warm drink, grounding touch",
        "Pause intentionally: Step away before reacting, breathe, then decide"
      ],
      "tip": "Frustration wants speed. Regulation gives you options."
    },
    {
      "number": 3,
      "emoji": "🛠️",
      "title": "Get Curious: What''s Actually Causing This?",
      "intro": "Don''t just react to the feeling, investigate it. There''s often something deeper beneath the snap.",
      "try_this": [
        "Ask \"why?\" five times: Keep digging, \"What''s this really about?\"",
        "Break the problem down: Too big? Too vague? Too emotionally charged?",
        "Reframe the story: Instead of \"I should be able to do this,\" try \"Maybe I need a new approach\"",
        "Find one next step: Any action is better than none, pick something tiny and do it"
      ],
      "tip": "Frustration isn''t the enemy, it''s your system saying \"help me change this.\""
    },
    {
      "number": 4,
      "emoji": "🧱",
      "title": "Reclaim Control and Protect Your Capacity",
      "intro": "Frustration grows when you feel powerless or overstretched. Let''s give your brain some ground to stand on.",
      "try_this": [
        "Focus on controllables: What can you influence right now?",
        "List what''s draining you: Too many tasks? Too many \"yeses\"?",
        "Say no with integrity: \"Not right now\" is powerful and valid",
        "Set boundaries: Your peace matters more than others'' expectations"
      ],
      "tip": "Boundaries reduce burnout. Burnout breeds frustration."
    },
    {
      "number": 5,
      "emoji": "🤝",
      "title": "Talk It Out, Reflect It Back",
      "intro": "Frustration often isolates. Saying it out loud, or learning from it, helps it lose its grip.",
      "try_this": [
        "Ask for help: Share where you''re stuck with someone who won''t judge",
        "Body double: Work through the block with someone beside you",
        "Reflect: What triggered this? What helped last time?",
        "Get support: Therapy or ADHD coaching can help you unpack deeper patterns",
        "Debrief the moment: After the fog clears, ask \"What worked? What didn''t?\""
      ],
      "tip": "Frustration isn''t a failure, it''s an invitation to learn, shift, and move forward differently."
    }
  ]'::jsonb
),
(
  'Defeated',
  'It''s not that you''re weak, it''s not that you gave up too soon • It''s ADHD meeting **chronic friction, unmet effort, and the weight of invisible struggle**.',
  'That feeling of defeat doesn''t come from one bad day, it builds up over time. When everyday tasks feel harder than they should, when systems don''t work for you, when your effort never seems to match your outcomes, it''s exhausting. ADHD can make you feel like you''re always trying and always failing. You''re not giving up, you''re tired of fighting your own brain to do things everyone else seems to manage without effort.',
  'It''s okay to feel like you''re losing. But this isn''t the end. It''s just a rough round. You''ve made it through 100% of your hardest days so far, and you will get through this one too. One tiny win is still a win.',
  'You''re not defeated, you''re discouraged. There''s a difference. Stand up. Shake it off. Try again. The fight''s not over unless you stay down.',
  ARRAY[
    'Executive dysfunction: Makes simple tasks feel like battles, and losing those battles over and over feels demoralizing',
    'Working memory issues: Cause things to fall through the cracks, even when you care deeply',
    'Emotional dysregulation: Means small failures can feel like total collapse',
    'Years of "almosts" and "not quites": Can erode your self-trust',
    'Internalized ableism: Can make you believe struggling means you''re not trying hard enough, even when you are'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧠",
      "title": "Recognize Defeat as a Signal, Not a Verdict",
      "intro": "Feeling defeated is a message, not proof of failure.",
      "try_this": [
        "What am I feeling right now?: Write down adjectives, even if they''re messy",
        "Tune into your body: Heavy limbs, clenched stomach, numbness, fatigue, those are real data",
        "Journal or voice-record: A 1-minute rant. Venting helps interrupt spirals and clarify what''s really going on",
        "Don''t judge the emotion: Just notice it. That''s a win"
      ],
      "tip": "Your emotions are messengers, not dictators. You can feel defeated and move forward."
    },
    {
      "number": 2,
      "emoji": "🔄",
      "title": "Reframe Defeatist Thoughts with Compassion",
      "intro": "Defeat often grows from limiting beliefs and inner shame. Let''s loosen their grip.",
      "try_this": [
        "I''m having the thought: \"I''ll never figure this out\" creates distance, not identity",
        "Ask: \"Is this thought helpful or just familiar?\" (Hint: your brain loves repetition, not always truth)",
        "Reframe \"failure\" as data: What did I learn? What do I now know for next time?",
        "Try the \"Good Enough\" lens: You don''t need to win today. You just need to show up"
      ],
      "tip": "\"Failure\" is often persistence in disguise."
    },
    {
      "number": 3,
      "emoji": "⚙️",
      "title": "Build Momentum with Gentle, Imperfect Action",
      "intro": "Defeat thrives in overwhelm. Action, even tiny, reactivates your sense of agency.",
      "try_this": [
        "Break it down to micro-steps: One sentence. One drawer. One email draft",
        "Brain dump everything: On your mind, no filter. Circle one thing that feels doable",
        "Use the 5-minute rule: \"I''ll just do 5 minutes and see what happens\"",
        "Celebrate any effort: \"I opened the doc.\" \"I put on pants.\" It counts"
      ],
      "tip": "Low-key and done beats high-expectation and avoided."
    },
    {
      "number": 4,
      "emoji": "🤝",
      "title": "Don''t Do This Alone, Set Boundaries and Ask for Help",
      "intro": "Defeat festers in isolation. Community and limits can shift the weight.",
      "try_this": [
        "Ask for help: Even if it''s just, \"Can you sit with me while I do this?\"",
        "Build a circle of \"sympathetic others\": People who see your worth, even when you forget it",
        "Say \"no\" where you need to: List everything on your plate and highlight what isn''t yours to carry",
        "Practice disappointing others: When necessary. Your peace matters more than approval"
      ],
      "tip": "Boundaries aren''t rejection. They''re rescue missions."
    },
    {
      "number": 5,
      "emoji": "🪞",
      "title": "Reclaim Your Identity with Compassion and Clarity",
      "intro": "Feeling defeated often hijacks your self-worth. Let''s take it back.",
      "try_this": [
        "I am not my executive function: You''re more than your productivity",
        "Talk to yourself like a trusted friend: \"You''re doing your best. That''s enough today\"",
        "Redefine rest: It''s not a reward. It''s a right, especially when you''re running on fumes",
        "Consider ADHD coaching or therapy: To untangle the root shame, overwhelm, or trauma. There''s no shame in needing a guide"
      ],
      "tip": "You''re not behind. You''re rebuilding."
    }
  ]'::jsonb
),
(
  'Burned Out',
  'It''s not weakness, it''s not a lack of willpower • It''s ADHD meeting **nonstop mental effort, emotional labor, and invisible load**.',
  'Burnout with ADHD often doesn''t look like complete collapse, it looks like functioning on fumes, smiling while you''re unraveling inside, doing just enough to get by until you crash. It comes from constantly pushing yourself to meet standards that weren''t built for your brain, from masking, overthinking, overdoing, and rarely resting. If you feel like you''re always one missed task away from everything falling apart… you''re not alone.',
  'Burnout is not weakness, it''s your body waving a red flag. You''ve been running on fumes, and it''s okay to stop. Rest isn''t a reward, it''s a requirement. You don''t have to earn your right to slow down.',
  'You''re past the warning signs. You ignored the exhaustion, the irritability, the crashes, and now you''re fried. Step back. Shut it down. If you don''t rest now, your body will force you to later.',
  ARRAY[
    'Constant overcompensation: To hide struggles or seem "on top of it"',
    'Decision fatigue: And mental overload from juggling too many unstructured tasks',
    'Executive dysfunction: Makes simple things feel endlessly hard',
    'Rejection Sensitivity (RSD): Means every critique or mistake hits harder',
    'Difficulty resting: Guilt often creeps in when you''re not "being productive"'
  ],
  '[
    {
      "number": 1,
      "emoji": "🔍",
      "title": "Spot the Burnout Before It Deepens",
      "intro": "Burnout builds slowly, then hits all at once. The earlier you notice it, the gentler your recovery can be.",
      "try_this": [
        "Check your state: Feeling numb, foggy, hollow, or like nothing matters?",
        "Scan your body: Headache? Clenched jaw? Sound/light sensitivity? Exhaustion that sleep doesn''t fix?",
        "Ask: \"What is my body trying to tell me right now?\"",
        "Notice the patterns: Overcommitting? Pleasing others at your own expense? Trying to outrun shame or pressure?"
      ],
      "tip": "Burnout often looks like \"I''m fine\" until you''re fully disconnected. Let''s catch it early, or meet it where it is."
    },
    {
      "number": 2,
      "emoji": "🌬️",
      "title": "Regulate First, Stop the Spiral",
      "intro": "You don''t have to earn rest. Start with nervous system care, not productivity.",
      "try_this": [
        "Go dim: Retreat to a dark room or sensory-safe space",
        "Block the noise: Put on headphones or white noise",
        "Hydrate and breathe: 4–4–4–4 box breathing and a big glass of water",
        "Let it out: Cry, shake, stomp, or hug a pillow",
        "Mindless comfort: Watch a safe, easy show or scroll intentionally for 10 minutes",
        "Wrap yourself in weight or warmth: Think blankets, showers, soft clothes"
      ],
      "tip": "You''re not weak. You''re overloaded. Rest is your reset, not a reward."
    },
    {
      "number": 3,
      "emoji": "🪫",
      "title": "Reduce Demands and Honor Energy Limits",
      "intro": "You can''t schedule your way out of burnout, but you can remove pressure.",
      "try_this": [
        "Brain dump: Get it all out, to-dos, worries, appointments",
        "Cancel what you can: Reschedule, delegate, or say no",
        "Break tasks into \"baby steps\": So small they feel almost silly",
        "Pomodoro or 5-minute rule: Tiny timeboxes to re-engage without forcing it",
        "End-of-day reset: Take a walk, journal, or stretch to signal \"day''s over\"",
        "Track energy: Use \"red/yellow/green\" zones to plan work around your real capacity"
      ],
      "tip": "\"Do less to unlock more.\" Recharging now lets you show up later, with presence, not just pressure."
    },
    {
      "number": 4,
      "emoji": "💗",
      "title": "Reframe Burnout with Compassion",
      "intro": "You''re not failing, you''ve been functioning beyond your capacity for too long. Let''s shift the inner story.",
      "try_this": [
        "\"I''m having the thought that I''m falling behind\": It''s just a thought",
        "Label what you feel: Not as \"bad,\" but as a signal",
        "Redefine rest: Include emotional, sensory, creative, and social recharge",
        "Reclaim your pace: You don''t need to \"keep up\", you need to stay with yourself",
        "Refocus on what you can control: Hydration, tiny actions, asking for support"
      ],
      "tip": "Compassion is not coddling. It''s the foundation of healing."
    },
    {
      "number": 5,
      "emoji": "🤝",
      "title": "Lean on Support and Set Boundaries to Protect Your Spark",
      "intro": "You don''t have to do this alone. Burnout recovery requires people, permission, and pacing.",
      "try_this": [
        "Ask for help: Not when you''re \"at capacity\", now",
        "Use a body double: Or accountability buddy to re-engage gently",
        "Say \"no\" without over-explaining",
        "Connect with others: Who understand burnout and ADHD",
        "Seek out professional support: Therapist, ADHD coach, or support group"
      ],
      "tip": "Boundaries aren''t walls. They''re bridges back to yourself."
    }
  ]'::jsonb
),
(
  'Forgetful',
  'It''s not carelessness, it''s not being irresponsible • It''s ADHD meeting **working memory overload**, **attention switching**, and a brain that **stores information differently**.',
  'Forgetting with ADHD isn''t about not caring, it''s about how your brain processes and stores information. Your working memory is like having too many browser tabs open, and when something new comes in, something else gets pushed out. You might remember obscure details from 5 years ago but forget what you had for lunch. This isn''t a character flaw, it''s how your neurodivergent brain works.',
  'You''re not careless, your brain just works differently. Forgetting doesn''t make you untrustworthy. You need better systems, not more shame. External memory is your friend.',
  'You know you forget things. So why aren''t you writing it down? Set alarms. Use a planner. You can''t keep acting like it''s a surprise. Handle it.',
  ARRAY[
    'Working memory limitations: Information gets pushed out when new things come in',
    'Attention switching: Moving between tasks makes you lose track of details',
    'Time blindness: Makes it hard to remember when things happened or are supposed to happen',
    'Emotional salience: You remember things that have strong emotional impact, not necessarily important things',
    'Executive function challenges: Difficulty with planning and organizing information storage'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧠",
      "title": "Understand Your Memory Style",
      "intro": "Your ADHD brain has a unique way of storing and retrieving information. Let''s work with it, not against it.",
      "try_this": [
        "Notice patterns: What do you tend to forget? Names, appointments, tasks, or conversations?",
        "Identify your memory strengths: Visual, auditory, or kinesthetic cues that help you remember",
        "Recognize your triggers: Stress, distraction, or rushing often worsen memory",
        "Give yourself permission: Your brain isn''t designed for perfect recall, and that''s okay"
      ],
      "tip": "Memory challenges are brain differences, not character defects. Understanding helps you adapt."
    },
    {
      "number": 2,
      "emoji": "📝",
      "title": "Build External Memory Systems",
      "intro": "Your brain isn''t meant to be a storage unit. Let''s create reliable external systems.",
      "try_this": [
        "Write everything down: Use a notebook, phone app, or planner as your external brain",
        "Set multiple reminders: Phone alarms, calendar alerts, sticky notes in visible places",
        "Create checklists: For routine tasks and important processes",
        "Use visual cues: Photos, color coding, or symbols to trigger memory",
        "Voice memos: Record important information when writing isn''t possible"
      ],
      "tip": "The best memory system is the one you''ll actually use consistently."
    },
    {
      "number": 3,
      "emoji": "🔗",
      "title": "Create Memory Anchors and Associations",
      "intro": "Help your brain store information by connecting it to things you already remember.",
      "try_this": [
        "Link to emotions: Connect information to how it makes you feel",
        "Use storytelling: Turn facts into mini-narratives your brain can follow",
        "Create acronyms or rhymes: Make boring information more memorable",
        "Associate with locations: Link tasks to specific places or rooms",
        "Use the ''memory palace'' technique: Visualize information in familiar spaces"
      ],
      "tip": "Your brain remembers connections better than isolated facts."
    },
    {
      "number": 4,
      "emoji": "⏰",
      "title": "Time and Context Strategies",
      "intro": "Work with your time blindness and context switching challenges.",
      "try_this": [
        "Time-block important tasks: Schedule specific times for things that matter",
        "Set transition reminders: Alerts to help you switch between activities mindfully",
        "Use context switching rituals: Brief routines that help your brain transition",
        "Batch similar tasks: Group phone calls, emails, or errands together",
        "Review regularly: Daily or weekly check-ins with your memory systems"
      ],
      "tip": "Structure and routine support your memory when willpower fails."
    },
    {
      "number": 5,
      "emoji": "🤝",
      "title": "Build Support and Self-Compassion",
      "intro": "You don''t have to remember everything alone, and forgetting doesn''t make you a bad person.",
      "try_this": [
        "Ask for help: Let trusted people know you might need reminders",
        "Share your systems: Let others know how they can support your memory",
        "Practice self-forgiveness: Everyone forgets sometimes, ADHD brains just do it more",
        "Celebrate what you remember: Notice and acknowledge your memory successes",
        "Find your memory buddies: People who can help you remember important things"
      ],
      "tip": "Memory challenges are easier to manage with support and self-compassion."
    }
  ]'::jsonb
),
(
  'Scattered',
  'It''s not being disorganized, it''s not lacking focus • It''s ADHD meeting **multiple attention streams**, **competing priorities**, and a brain that **sees everything at once**.',
  'Feeling scattered isn''t about being messy or unfocused, it''s about having a brain that notices everything and struggles to filter what''s important right now. Your attention goes in multiple directions because your ADHD brain is designed to be aware of many things simultaneously. The challenge is learning to harness this expansive awareness rather than being overwhelmed by it.',
  'You''re not a mess, you''re managing too many tabs at once. Your brain isn''t failing, it''s overwhelmed. Write things down. Focus on one thing. Put the rest in a "later" list. You''re allowed to create order.',
  'You''re letting chaos run your day. Stop switching tasks every 3 minutes. Focus. Pick one thing. Close the rest. You''ll get more done when you stop trying to do it all at once.',
  ARRAY[
    'Diffuse attention: Your brain scans the environment constantly for interesting or important information',
    'Weak attention filtering: Difficulty screening out irrelevant stimuli or thoughts',
    'Multiple processing streams: Your mind runs several trains of thought simultaneously',
    'Interest-based attention: Focus follows curiosity rather than importance',
    'Hyperfocus contrast: When you''re not hyperfocused, attention feels especially scattered'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧭",
      "title": "Acknowledge the Scattered State",
      "intro": "Scattered isn''t broken, it''s your brain''s natural state. Let''s work with it.",
      "try_this": [
        "Notice without judgment: ''My attention is scattered right now''",
        "Name what you''re tracking: List all the things competing for your attention",
        "Recognize the positives: Scattered attention can mean creativity and awareness",
        "Don''t fight it: Resistance often makes scattering worse"
      ],
      "tip": "Scattered attention is a feature of ADHD, not a bug. Understanding helps you manage it."
    },
    {
      "number": 2,
      "emoji": "📤",
      "title": "Externalize and Organize Your Mental Load",
      "intro": "Get all those swirling thoughts out of your head and onto paper or screen.",
      "try_this": [
        "Brain dump everything: Write down every task, worry, or idea in your mind",
        "Sort into categories: Work, personal, creative, someday/maybe",
        "Identify what''s urgent vs. important: Use a simple priority matrix",
        "Choose your ''now'' focus: Pick 1-3 things that actually need attention today",
        "Park the rest: Put non-urgent items in a trusted system for later"
      ],
      "tip": "Your brain can''t focus when it''s trying to remember everything. External storage creates internal calm."
    },
    {
      "number": 3,
      "emoji": "🎯",
      "title": "Create Focus Anchors",
      "intro": "Give your scattered attention something specific to land on.",
      "try_this": [
        "Set a single intention: ''For the next 25 minutes, I''m focusing on X''",
        "Use physical anchors: A specific chair, desk setup, or location for focused work",
        "Try body doubling: Work alongside others (virtually or in person)",
        "Use timers: Pomodoro technique or other time-boxing methods",
        "Create rituals: Brief routines that signal ''focus time'' to your brain"
      ],
      "tip": "Scattered attention needs clear boundaries and specific targets to be productive."
    },
    {
      "number": 4,
      "emoji": "🌊",
      "title": "Work with Your Natural Rhythms",
      "intro": "Instead of forcing focus, learn when and how your attention naturally flows.",
      "try_this": [
        "Track your attention patterns: When are you naturally more focused?",
        "Honor your ultradian rhythms: Work with your natural 90-120 minute cycles",
        "Take advantage of hyperfocus: When it happens naturally, go with it",
        "Plan for scattered times: Use these periods for creative or administrative tasks",
        "Accept the ebb and flow: Some days will be more scattered than others"
      ],
      "tip": "Fighting your natural attention patterns creates more scattering. Flow with them instead."
    },
    {
      "number": 5,
      "emoji": "🛠️",
      "title": "Build Sustainable Focus Systems",
      "intro": "Create structures that support your attention without overwhelming your brain.",
      "try_this": [
        "Simplify your environment: Reduce visual and auditory distractions",
        "Use attention cues: Specific music, lighting, or scents for focus",
        "Practice attention training: Meditation, mindfulness, or other attention exercises",
        "Build focus gradually: Start with short periods and increase slowly",
        "Create fail-safes: Systems that work even when your attention is particularly scattered"
      ],
      "tip": "Sustainable focus comes from systems that support your ADHD brain, not fight against it."
    }
  ]'::jsonb
),
(
  'Overstimulated',
  'It''s not being too sensitive, it''s not overreacting • It''s ADHD meeting **sensory overload**, **emotional intensity**, and a **nervous system on high alert**.',
  'Overstimulation with ADHD happens when your brain receives more input than it can process comfortably. Sounds feel louder, lights seem brighter, emotions hit harder, and your nervous system goes into overdrive. Your brain''s filter system isn''t working properly, so everything gets through at once. This isn''t weakness or drama, it''s your neurodivergent nervous system responding to an overwhelming environment.',
  'Your environment is louder than your nervous system can handle. That''s not weakness, it''s sensitivity. You deserve quiet. Find calm: noise-canceling headphones, dark spaces, soft textures. You don''t have to power through it.',
  'Turn it off. All of it. The lights, the music, the notifications. Your brain isn''t wired to handle this much input nonstop. Step out of the chaos. Reset, or burn out. Your choice.',
  ARRAY[
    'Sensory processing differences: Heightened sensitivity to sound, light, touch, or movement',
    'Emotional intensity: Feelings are experienced more strongly and last longer',
    'Weak sensory gating: Difficulty filtering out irrelevant or background stimuli',
    'Stress sensitivity: Overstimulation triggers fight-or-flight responses',
    'Cumulative overload: Stimulation builds up throughout the day until you hit your limit'
  ],
  '[
    {
      "number": 1,
      "emoji": "🚨",
      "title": "Recognize Overstimulation Early",
      "intro": "The earlier you catch overstimulation, the easier it is to manage.",
      "try_this": [
        "Notice physical signs: Tension, headache, restlessness, jaw clenching",
        "Track emotional changes: Irritability, anxiety, feeling on edge",
        "Watch for cognitive symptoms: Difficulty concentrating, feeling scattered",
        "Identify your triggers: Specific sounds, environments, or situations",
        "Learn your warning signs: What happens just before you become overwhelmed?"
      ],
      "tip": "Overstimulation often builds gradually. Early recognition prevents complete overwhelm."
    },
    {
      "number": 2,
      "emoji": "🛡️",
      "title": "Create Immediate Relief",
      "intro": "When overstimulation hits, your nervous system needs quick support.",
      "try_this": [
        "Find quiet space: Remove yourself from stimulating environments",
        "Reduce sensory input: Dim lights, use noise-canceling headphones, close your eyes",
        "Use calming textures: Soft blanket, stress ball, or fidget toy",
        "Try deep breathing: 4-7-8 breathing or other calming techniques",
        "Ground through your senses: Name 5 things you see, 4 you hear, 3 you feel"
      ],
      "tip": "Your nervous system needs immediate soothing before you can think clearly."
    },
    {
      "number": 3,
      "emoji": "⚡",
      "title": "Discharge Overwhelm Energy",
      "intro": "Overstimulation creates energy that needs to be released from your system.",
      "try_this": [
        "Move your body: Shake, stretch, walk, or do jumping jacks",
        "Express vocally: Hum, sing, or make sounds that feel good",
        "Use pressure: Weighted blanket, tight hug, or push against a wall",
        "Try bilateral movement: Cross-lateral exercises or alternating movements",
        "Release through creativity: Draw, write, or make music to express the overwhelm"
      ],
      "tip": "Trapped stimulation energy needs a way out. Movement and expression help discharge it."
    },
    {
      "number": 4,
      "emoji": "🏠",
      "title": "Design Your Environment for Success",
      "intro": "Prevention is easier than recovery. Create spaces that support your nervous system.",
      "try_this": [
        "Control lighting: Use lamps instead of overhead lights, adjust screen brightness",
        "Manage sound: Use white noise, earplugs, or noise-canceling headphones",
        "Organize visually: Reduce clutter and visual chaos in your spaces",
        "Create retreat spaces: Designate calm zones where you can decompress",
        "Use calming colors and textures: Soft fabrics, plants, and soothing colors"
      ],
      "tip": "Your environment should support your nervous system, not fight against it."
    },
    {
      "number": 5,
      "emoji": "📅",
      "title": "Build Overstimulation Prevention into Your Life",
      "intro": "Regular practices can increase your resilience to overstimulation.",
      "try_this": [
        "Schedule downtime: Regular breaks and quiet periods throughout your day",
        "Practice nervous system regulation: Daily meditation, breathing, or mindfulness",
        "Know your limits: Track when and where you typically become overstimulated",
        "Plan for high-stimulation events: Prepare strategies and recovery time",
        "Communicate your needs: Let others know about your sensitivity and needs"
      ],
      "tip": "Consistent self-care builds your capacity to handle stimulation without becoming overwhelmed."
    }
  ]'::jsonb
),
(
  'Stuck',
  'It''s not laziness, it''s not procrastination • It''s ADHD meeting **executive dysfunction**, **decision paralysis**, and a brain that **knows what to do but can''t get started**.',
  'Being stuck with ADHD is different from regular procrastination. You want to do the thing, know how to do the thing, and feel bad about not doing the thing, but your brain simply won''t initiate action. It''s like having a car with a dead battery, everything looks fine from the outside, but nothing happens when you turn the key. This is executive dysfunction, not moral failure.',
  'Being stuck doesn''t mean you''re lazy. Your brain''s ''start'' button isn''t working right now. Be gentle with yourself. Try the smallest possible step. Movement creates momentum.',
  'Stop making excuses and just start. You know what you need to do. Set a timer for 5 minutes and begin. Action creates motivation, not the other way around.',
  ARRAY[
    'Executive dysfunction: Difficulty with task initiation and switching',
    'Dopamine deficiency: Lack of reward anticipation makes starting feel impossible',
    'Analysis paralysis: Overthinking prevents action',
    'Perfectionism: Fear of doing it wrong creates paralysis',
    'Task overwhelm: When something feels too big or complex to start'
  ],
  '[
    {
      "number": 1,
      "emoji": "🔍",
      "title": "Understand Why You''re Stuck",
      "intro": "Stuck isn''t a character flaw, it''s a neurological state. Let''s figure out what''s really going on.",
      "try_this": [
        "Is the task too big? Break it into smaller, more manageable pieces",
        "Are you overwhelmed? Too many competing priorities or decisions?",
        "Is it boring? Your ADHD brain might need more stimulation or interest",
        "Are you afraid? Fear of failure, judgment, or not being perfect?",
        "Are you depleted? Hungry, tired, or emotionally drained?"
      ],
      "tip": "Understanding the source of stuckness helps you choose the right strategy to get unstuck."
    },
    {
      "number": 2,
      "emoji": "🪨",
      "title": "Start Ridiculously Small",
      "intro": "The smaller the first step, the easier it is for your brain to take it.",
      "try_this": [
        "Break it down to micro-steps: ''Open the document'' or ''Find the phone number''",
        "Use the ''2-minute rule'': If it takes less than 2 minutes, do it now",
        "Try the ''next physical action'': What''s the very next thing your body needs to do?",
        "Set a tiny timer: 5 minutes of work, then you can stop if you want",
        "Lower the bar: Done is better than perfect, and started is better than stuck"
      ],
      "tip": "Momentum builds from tiny actions. Start so small that your brain can''t resist."
    },
    {
      "number": 3,
      "emoji": "🎭",
      "title": "Change Your State or Context",
      "intro": "Sometimes you need to shift your physical or mental state to get unstuck.",
      "try_this": [
        "Change locations: Move to a different room, coffee shop, or workspace",
        "Alter your body position: Stand up, lie down, or work from the floor",
        "Use body doubling: Work alongside someone else, even virtually",
        "Try the ''as if'' technique: Act as if you''re someone who easily does this task",
        "Add stimulation: Play music, chew gum, or use a fidget toy while working"
      ],
      "tip": "Your environment and state affect your ability to start. Change the context, change the outcome."
    },
    {
      "number": 4,
      "emoji": "🎯",
      "title": "Create Structure and Accountability",
      "intro": "External structure can provide the framework your executive function is missing.",
      "try_this": [
        "Set specific deadlines: Even artificial ones create urgency",
        "Schedule it: Put the task in your calendar like an appointment",
        "Tell someone: Commit to updating a friend or partner on your progress",
        "Use the Pomodoro Technique: 25 minutes of focused work with breaks",
        "Create rewards: Small celebrations or treats for completing tasks"
      ],
      "tip": "External structure can substitute for internal executive function when you''re stuck."
    },
    {
      "number": 5,
      "emoji": "🧠",
      "title": "Address the Root Causes",
      "intro": "Chronic stuckness often has deeper patterns that need attention.",
      "try_this": [
        "Notice your patterns: When and where do you typically get stuck?",
        "Address perfectionism: Good enough is often truly good enough",
        "Manage decision fatigue: Reduce unnecessary choices in your day",
        "Build routines: Consistent structures reduce the need for executive function",
        "Consider professional help: ADHD coaching or therapy can address underlying issues"
      ],
      "tip": "Understanding your stuckness patterns helps you prevent them and recover faster."
    }
  ]'::jsonb
),
(
  'Drained',
  'It''s not being weak, it''s not giving up • It''s ADHD meeting **chronic mental effort**, **masking exhaustion**, and **running on empty**.',
  'Feeling drained with ADHD goes beyond normal tiredness. It''s the exhaustion that comes from constantly managing a brain that works differently, masking your struggles, and expending extra mental energy on tasks that seem effortless for others. Your battery isn''t just low, it''s been running on reserve power for too long. This isn''t laziness, it''s legitimate depletion.',
  'You''ve been pushing too hard for too long. No wonder you''re empty. You''re allowed to pause. Recharge doesn''t mean you''re lazy, it means you''re wise enough to protect your energy. Refill before you break.',
  'You''re not a phone on 1%, you''re a person with choices. Sleep. Eat. Get off the screen. Rest like it matters, because it does. Then get back to it.',
  ARRAY[
    'Cognitive load: Constant mental effort to manage ADHD symptoms',
    'Masking fatigue: Exhaustion from hiding struggles and appearing ''normal''',
    'Emotional regulation: Extra energy needed to manage intense emotions',
    'Executive function demands: Simple tasks require more mental resources',
    'Chronic stress: From navigating a world not designed for ADHD brains'
  ],
  '[
    {
      "number": 1,
      "emoji": "🔋",
      "title": "Recognize Your Energy Patterns",
      "intro": "Understanding your energy helps you work with it instead of against it.",
      "try_this": [
        "Track your energy levels: Notice when you feel most and least energized",
        "Identify energy drains: What activities, people, or situations deplete you?",
        "Notice warning signs: Irritability, brain fog, or physical tension",
        "Honor your limits: You have finite energy and that''s completely normal",
        "Distinguish tired from drained: Tired needs rest, drained needs restoration"
      ],
      "tip": "Your energy is finite and precious. Treating it as such helps you manage it better."
    },
    {
      "number": 2,
      "emoji": "🛌",
      "title": "Prioritize Recovery and Rest",
      "intro": "Rest isn''t earned, it''s required for your brain to function properly.",
      "try_this": [
        "Take guilt-free breaks: Even 5-10 minutes can help reset your system",
        "Practice saying no: Protect your energy by declining non-essential commitments",
        "Create restorative activities: Reading, gentle movement, or creative pursuits",
        "Improve sleep hygiene: Consistent bedtime, dark room, limited screens",
        "Schedule downtime: Put rest in your calendar like any other important appointment"
      ],
      "tip": "Rest is not a luxury, it''s maintenance for your ADHD brain."
    },
    {
      "number": 3,
      "emoji": "⚡",
      "title": "Restore Your Energy Reserves",
      "intro": "When you''re drained, you need active restoration, not just rest.",
      "try_this": [
        "Spend time in nature: Even a few minutes outside can be restorative",
        "Engage in special interests: Activities that genuinely excite and energize you",
        "Connect with supportive people: Those who understand and accept you",
        "Practice gentle movement: Yoga, walking, or stretching to release tension",
        "Try creative expression: Art, music, writing, or other forms of creativity"
      ],
      "tip": "Restoration is active recovery. Find activities that genuinely refill your energy tank."
    },
    {
      "number": 4,
      "emoji": "🎯",
      "title": "Optimize Your Energy Management",
      "intro": "Work smarter, not harder, by aligning tasks with your energy levels.",
      "try_this": [
        "Match tasks to energy: Do demanding work when energy is high",
        "Batch similar activities: Group tasks to reduce mental switching costs",
        "Use your chronotype: Work with your natural daily energy rhythms",
        "Minimize decision fatigue: Automate or simplify routine choices",
        "Focus on energy givers: Prioritize activities that add to rather than drain your energy"
      ],
      "tip": "Strategic energy management prevents depletion and maximizes your effectiveness."
    },
    {
      "number": 5,
      "emoji": "🌱",
      "title": "Build Long-term Energy Sustainability",
      "intro": "Create systems and habits that support your energy over time.",
      "try_this": [
        "Develop consistent routines: Reduce daily decision-making demands",
        "Build your support network: People who can help when you''re drained",
        "Practice self-compassion: Stop judging yourself for having limits",
        "Address underlying issues: Consider therapy, coaching, or medical support",
        "Celebrate small wins: Acknowledge progress, even when energy is low"
      ],
      "tip": "Sustainable energy management is about building systems that support your unique ADHD brain."
    }
  ]'::jsonb
),
(
  'Numb',
  'It''s not being unfeeling, it''s not depression • It''s ADHD meeting **emotional overwhelm**, **protective shutdown**, and a brain that''s **temporarily offline**.',
  'Numbness with ADHD often comes after periods of intense emotion or overstimulation. Your brain essentially hits the circuit breaker to protect itself from further overwhelm. You might feel disconnected from yourself, your feelings, or your motivation. This isn''t permanent emptiness, it''s your nervous system''s way of saying ''I need a break.'' It''s protection, not pathology.',
  'Numbness is protection. When everything''s too much, your brain sometimes shuts down. That doesn''t mean you''re broken, it means you''ve hit capacity. Give yourself a gentle sensory reset. Music, nature, light movement. Come back slowly.',
  'You''re not feeling because you''ve been ignoring your needs. Get up. Eat something. Move your body. Numb is a signal, not a home. Shake yourself out of autopilot.',
  ARRAY[
    'Emotional overwhelm protection: Brain shuts down to prevent further overload',
    'Dopamine depletion: Low neurotransmitter levels create emotional flatness',
    'Trauma response: Dissociation as protection from intense experiences',
    'Burnout symptom: Result of chronic stress and overstimulation',
    'Medication side effects: Some ADHD medications can cause emotional blunting'
  ],
  '[
    {
      "number": 1,
      "emoji": "🔍",
      "title": "Understand Numbness as Protection",
      "intro": "Numbness isn''t emptiness, it''s your brain''s way of creating safety.",
      "try_this": [
        "Acknowledge the numbness: ''I''m feeling disconnected right now''",
        "Don''t judge it: This is a normal response to overwhelm",
        "Look for patterns: What typically happens before you feel numb?",
        "Check for overwhelm signs: Have you been stressed, overstimulated, or emotional?",
        "Consider it temporary: This feeling state will shift and change"
      ],
      "tip": "Numbness is often your nervous system''s way of saying ''I need a break.''"
    },
    {
      "number": 2,
      "emoji": "🌊",
      "title": "Gentle Re-engagement with Feeling",
      "intro": "Don''t force emotions, but create space for them to return naturally.",
      "try_this": [
        "Start with physical sensations: Notice temperature, texture, or pressure",
        "Try gentle movement: Stretching, walking, or swaying to reconnect with your body",
        "Use art or music: Creative expression can bypass mental blocks to feeling",
        "Practice breathing exercises: Slow, deep breaths can help emotions surface",
        "Write without censoring: Stream of consciousness to access buried feelings"
      ],
      "tip": "Feelings return gradually. Be patient with your emotional reawakening process."
    },
    {
      "number": 3,
      "emoji": "🧠",
      "title": "Address Underlying Causes",
      "intro": "Numbness is often a symptom of something else that needs attention.",
      "try_this": [
        "Check your basics: Sleep, nutrition, hydration, and exercise",
        "Review medications: Some can cause emotional blunting",
        "Examine stress levels: Chronic stress can lead to emotional shutdown",
        "Look at life circumstances: Major changes or challenges affecting you?",
        "Consider trauma: Past or recent experiences that might need processing"
      ],
      "tip": "Treating the root cause often helps numbness resolve more quickly."
    },
    {
      "number": 4,
      "emoji": "🔌",
      "title": "Reconnect with What Matters",
      "intro": "Even when numb, you can take small steps toward reconnection.",
      "try_this": [
        "Engage with interests: Activities that previously brought joy or excitement",
        "Connect with people: Even if you don''t feel like it, social connection helps",
        "Practice gratitude: List things you''re thankful for, even small ones",
        "Set tiny goals: Achievable tasks that create a sense of accomplishment",
        "Use your senses: Strong flavors, textures, or scents to stimulate awareness"
      ],
      "tip": "Action can precede feeling. Sometimes we do things first, then emotions follow."
    },
    {
      "number": 5,
      "emoji": "🤝",
      "title": "Seek Support When Needed",
      "intro": "Persistent numbness might need professional attention or extra support.",
      "try_this": [
        "Talk to someone: Friend, family member, or professional who can listen",
        "Consider therapy: Especially if numbness persists or worsens",
        "Review with your doctor: Rule out medical causes or medication effects",
        "Join support groups: Others who understand ADHD and emotional struggles",
        "Be patient with recovery: Healing from numbness takes time and self-compassion"
      ],
      "tip": "You don''t have to navigate numbness alone. Support can help you reconnect with yourself."
    }
  ]'::jsonb
),
(
  'Ashamed',
  'It''s not being bad, it''s not deserving punishment • It''s ADHD meeting **internalized ableism**, **chronic misunderstanding**, and a lifetime of being told you''re **too much** or **not enough**.',
  'Shame with ADHD runs deep because it often starts early and gets reinforced repeatedly. You''ve likely been criticized for being **forgetful, disorganized, impulsive, or emotional**, when these are actually **neurological differences, not character flaws**. Shame tells you that you **ARE** the problem, not that you **HAVE** a challenge. But your worth isn''t determined by how well you fit neurotypical expectations.',
  'Shame says "you are the problem", but that''s a lie. You''re not broken. You''re human. Everyone struggles. Everyone slips. Talk to yourself the way you would a friend. You deserve compassion, not punishment.',
  'Shame grows in silence. It''s time to drag it into the light. You made a mistake? Own it. Learn. Fix it if you can. But do not let shame stop your life. You''re better than the worst thing you''ve done.',
  ARRAY[
    'Internalized ableism: Years of being told ADHD traits are character flaws',
    'Chronic misunderstanding: From family, teachers, and society about ADHD',
    'Masking exhaustion: Shame from constantly hiding your true self',
    'Comparison trap: Measuring yourself against neurotypical standards',
    'RSD amplification: Rejection sensitivity makes shame feel overwhelming'
  ],
  '[
    {
      "number": 1,
      "emoji": "🪞",
      "title": "Recognize Shame vs. Guilt",
      "intro": "Understanding the difference helps you address shame more effectively.",
      "try_this": [
        "Guilt says: ''I did something bad'' - this can be helpful for growth",
        "Shame says: ''I AM bad'' - this is toxic and needs to be challenged",
        "Notice shame language: ''I''m stupid,'' ''I''m lazy,'' ''I''m broken''",
        "Reframe shame thoughts: ''I''m having the thought that I''m broken''",
        "Practice self-compassion: How would you talk to a friend in your situation?"
      ],
      "tip": "Shame is about identity, guilt is about actions. You can change actions, but your core self is worthy."
    },
    {
      "number": 2,
      "emoji": "🧠",
      "title": "Challenge Internalized Ableism",
      "intro": "Question the voices that tell you ADHD traits are moral failings.",
      "try_this": [
        "Identify shame messages: What negative things do you believe about yourself?",
        "Ask: ''Where did this belief come from?'' Often it''s from uninformed sources",
        "Learn about ADHD: Understanding your neurodivergence reduces self-blame",
        "Reframe traits positively: Creativity, enthusiasm, empathy, out-of-the-box thinking",
        "Connect with ADHD community: Others who understand your experience"
      ],
      "tip": "Shame often comes from misunderstanding ADHD. Education and community help heal it."
    },
    {
      "number": 3,
      "emoji": "💝",
      "title": "Practice Active Self-Compassion",
      "intro": "Treat yourself with the same kindness you''d show a struggling friend.",
      "try_this": [
        "Use kind self-talk: Replace harsh inner critic with supportive voice",
        "Practice the ''friend test'': Would you say this to a friend? If not, don''t say it to yourself",
        "Acknowledge your struggles: ''This is really hard for me'' without judgment",
        "Celebrate small wins: Notice and appreciate your efforts and progress",
        "Forgive your mistakes: Everyone messes up, especially when learning"
      ],
      "tip": "Self-compassion isn''t weakness, it''s the foundation of healing and growth."
    },
    {
      "number": 4,
      "emoji": "🛡️",
      "title": "Build Shame Resilience",
      "intro": "Develop tools to handle shame when it arises and protect against future shame.",
      "try_this": [
        "Name shame when it comes up: ''I''m feeling shame right now''",
        "Practice vulnerability: Share struggles with trusted people",
        "Set boundaries: Limit exposure to shame-inducing people or situations",
        "Create affirmations: Positive statements about your worth and capabilities",
        "Develop a support network: People who see and value your authentic self"
      ],
      "tip": "Shame thrives in secrecy and isolation. Connection and openness help it dissolve."
    },
    {
      "number": 5,
      "emoji": "🌱",
      "title": "Rebuild Your Identity",
      "intro": "Create a new narrative about yourself based on truth, not shame.",
      "try_this": [
        "List your strengths: What are you good at? What do people appreciate about you?",
        "Acknowledge your growth: How have you changed and learned over time?",
        "Define your values: What matters to you beyond productivity or perfection?",
        "Practice radical acceptance: You are worthy exactly as you are right now",
        "Consider therapy: Professional help can be invaluable for shame healing"
      ],
      "tip": "You get to write your own story. Make it one of growth, compassion, and authentic self-worth."
    }
  ]'::jsonb
),
(
  'Guilty',
  'It''s not being a bad person, it''s not moral failure • It''s ADHD meeting **unmet expectations**, **impact on others**, and the weight of **good intentions gone awry**.',
  'Guilt with ADHD often comes from the gap between your intentions and your impact. You meant to call back, remember the appointment, or follow through on your promise, but ADHD got in the way. The guilt is real because you genuinely care about others and hate disappointing them. But carrying excessive guilt doesn''t help anyone and often makes executive function worse.',
  'Guilt means you care, and that''s good. But holding on to guilt too long just keeps you stuck. You made a mistake? Apologize, repair if you can, and move forward. You''re still allowed to try again.',
  'You''re sitting in guilt like it''s a punishment that''ll fix everything. It won''t. Take responsibility. Make the repair. Then let it go. You''re not helping anyone by staying stuck in shame.',
  ARRAY[
    'Impact awareness: Recognizing how ADHD symptoms affect others',
    'Intention-action gap: Wanting to do right but struggling with follow-through',
    'Responsibility sensitivity: Caring deeply about commitments and relationships',
    'Past mistakes: Accumulated experiences of letting people down',
    'Perfectionist standards: Unrealistic expectations for yourself'
  ],
  '[
    {
      "number": 1,
      "emoji": "⚖️",
      "title": "Distinguish Healthy vs. Toxic Guilt",
      "intro": "Not all guilt is bad. Learn to work with helpful guilt and release the toxic kind.",
      "try_this": [
        "Healthy guilt: Points to real harm and motivates positive change",
        "Toxic guilt: Disproportionate, paralyzing, and not helpful for growth",
        "Ask: ''Is this guilt proportionate to the actual impact?''",
        "Consider: ''Is this guilt helping me grow or just making me stuck?''",
        "Notice patterns: Do you feel guilty about things beyond your control?"
      ],
      "tip": "Guilt can be a moral compass, but excessive guilt becomes a prison."
    },
    {
      "number": 2,
      "emoji": "🧠",
      "title": "Understand the ADHD-Guilt Connection",
      "intro": "Recognize how ADHD symptoms create situations that trigger guilt.",
      "try_this": [
        "Identify ADHD-related guilt triggers: Forgetfulness, lateness, unfinished tasks",
        "Separate ADHD symptoms from character: You''re not intentionally hurting people",
        "Acknowledge the real impact: ADHD symptoms can affect others, and that''s valid",
        "Focus on intentions: You care about people and want to do well",
        "Learn about your brain: Understanding ADHD reduces self-blame"
      ],
      "tip": "ADHD explains behavior but doesn''t excuse impact. Both things can be true."
    },
    {
      "number": 3,
      "emoji": "🔄",
      "title": "Transform Guilt into Action",
      "intro": "Use guilt as information to guide positive changes rather than self-punishment.",
      "try_this": [
        "Ask: ''What is this guilt trying to tell me?''",
        "Identify the value behind the guilt: Reliability, kindness, respect for others",
        "Make specific amends: Apologize genuinely and make concrete changes",
        "Focus on future behavior: What can you do differently next time?",
        "Create systems: External supports to help you follow through on commitments"
      ],
      "tip": "Guilt is useful when it motivates positive change, not when it creates paralysis."
    },
    {
      "number": 4,
      "emoji": "🤝",
      "title": "Repair Relationships and Communicate",
      "intro": "Address the impact of your actions while advocating for your needs.",
      "try_this": [
        "Apologize without over-explaining: Acknowledge impact without making excuses",
        "Ask how to make it right: What would help repair the situation?",
        "Share your challenges: Help others understand ADHD without using it as an excuse",
        "Set realistic expectations: Be honest about your limitations and strengths",
        "Create accountability systems: Ask for help with reminders or check-ins"
      ],
      "tip": "Honest communication about ADHD can actually strengthen relationships."
    },
    {
      "number": 5,
      "emoji": "💚",
      "title": "Practice Self-Forgiveness and Growth",
      "intro": "Release perfectionist standards and embrace learning from mistakes.",
      "try_this": [
        "Practice self-compassion: You''re human and learning to manage ADHD",
        "Focus on progress: Notice improvements, even if they''re small",
        "Set realistic standards: What''s achievable given your ADHD challenges?",
        "Learn from mistakes: What systems or strategies might help next time?",
        "Celebrate efforts: Acknowledge when you try, even if results aren''t perfect"
      ],
      "tip": "Self-forgiveness isn''t about lowering standards, it''s about sustainable growth."
    }
  ]'::jsonb
),
(
  'Hopeless',
  'It''s not giving up, it''s not weakness • It''s ADHD meeting **chronic struggle**, **unmet potential**, and the exhaustion of **trying the same things over and over**.',
  'Hopelessness with ADHD often comes from years of trying strategies that work for others but not for you, from feeling like you''re always behind or failing despite your best efforts. It''s the fatigue that comes from constantly fighting your own brain. But hopelessness is a feeling, not a fact. Your ADHD brain has unique strengths, and with the right support and strategies, change is possible.',
  'Feeling hopeless doesn''t mean you _are_ hopeless. ADHD can warp your perspective when you''re exhausted, stuck, or overwhelmed. This isn''t forever. You don''t need to solve everything, just survive today. Hope can be rebuilt from small wins.',
  'You''ve been here before and made it out. This feeling isn''t truth, it''s fog. Do something. Anything. Clean one dish. Step outside. Hope doesn''t return on its own, you have to go find it.',
  ARRAY[
    'Chronic struggle: Years of difficulty with tasks others find easy',
    'Unmet potential: Knowing you''re capable but unable to consistently perform',
    'Failed strategies: Trying neurotypical solutions that don''t work for ADHD',
    'Comparison fatigue: Constantly measuring yourself against others',
    'System failures: When environments don''t support ADHD success'
  ],
  '[
    {
      "number": 1,
      "emoji": "🌙",
      "title": "Acknowledge the Darkness",
      "intro": "Hopelessness is a valid response to chronic struggle. Don''t judge it away.",
      "try_this": [
        "Name the feeling: ''I''m feeling hopeless right now''",
        "Validate your struggle: You''ve been fighting hard for a long time",
        "Don''t rush to fix: Sit with the feeling without immediately trying to change it",
        "Remember it''s temporary: Feelings change, even when they feel permanent",
        "Seek support: You don''t have to carry this alone"
      ],
      "tip": "Acknowledging hopelessness without judgment is the first step toward healing."
    },
    {
      "number": 2,
      "emoji": "🔍",
      "title": "Examine Your Story",
      "intro": "Challenge the narratives that fuel hopelessness.",
      "try_this": [
        "Identify hopeless thoughts: ''Nothing will ever change,'' ''I''ll never figure this out''",
        "Question absolute language: Is ''never'' and ''always'' really true?",
        "Look for exceptions: Times when things did work or improve",
        "Consider your growth: How are you different now than you were years ago?",
        "Separate feeling from fact: Hopelessness is an emotion, not reality"
      ],
      "tip": "Hopelessness often comes from stories we tell ourselves. Examine those stories critically."
    },
    {
      "number": 3,
      "emoji": "🌱",
      "title": "Find Tiny Seeds of Possibility",
      "intro": "Hope doesn''t have to be big. Small possibilities can grow into larger ones.",
      "try_this": [
        "Look for micro-improvements: Any small positive changes, no matter how tiny",
        "Focus on next steps: What''s one small thing you could try?",
        "Connect with others: People who understand ADHD and have found their way",
        "Explore new approaches: ADHD-specific strategies you haven''t tried yet",
        "Celebrate small wins: Any progress counts, even if it''s not perfect"
      ],
      "tip": "Hope grows from small possibilities, not grand transformations."
    },
    {
      "number": 4,
      "emoji": "🛠️",
      "title": "Try ADHD-Specific Approaches",
      "intro": "Maybe you haven''t found the right strategies yet, not because nothing works, but because you''ve been trying neurotypical solutions.",
      "try_this": [
        "Learn about ADHD: Understanding your brain can reveal new possibilities",
        "Try body doubling: Working alongside others for accountability",
        "Experiment with stimulation: Background music, fidgets, or movement while working",
        "Use external structure: Apps, timers, and systems designed for ADHD",
        "Find your hyperfocus: Activities that naturally engage your ADHD brain"
      ],
      "tip": "ADHD brains often need different strategies. What works for neurotypicals might not work for you."
    },
    {
      "number": 5,
      "emoji": "🤝",
      "title": "Build a Support Network",
      "intro": "Hopelessness thrives in isolation. Connection can restore hope.",
      "try_this": [
        "Find ADHD community: Online groups, support meetings, or forums",
        "Consider professional help: Therapists or coaches who understand ADHD",
        "Share your struggles: With trusted friends or family members",
        "Look for mentors: People with ADHD who are thriving",
        "Be patient with recovery: Rebuilding hope takes time and support"
      ],
      "tip": "Hope is often restored through connection with others who understand your journey."
    }
  ]'::jsonb
),
(
  'Stressed',
  'It''s not overreacting, it''s not being dramatic • It''s ADHD meeting **multiple competing demands**, **time pressure**, and a **nervous system that amplifies everything**.',
  'Stress hits differently with ADHD. Your nervous system is more reactive, your executive function struggles under pressure, and multiple demands can quickly become overwhelming. What might be manageable stress for someone else can feel crushing when you''re juggling ADHD symptoms, trying to stay organized, and managing the emotional intensity that comes with neurodivergence.',
  'Stress doesn''t mean you''re failing, it means your load is heavier than your current capacity. You don''t need to "push through", you need to regulate. Breathe. Shake it out. Simplify. You are allowed to slow down and still be strong.',
  'You''re carrying more than you can handle and pretending it''s fine. It''s not. Cut something. Delegate. Stop saying yes to everything. You can''t keep sprinting and expect to survive the marathon.',
  ARRAY[
    'Nervous system hyperreactivity: ADHD brains are more sensitive to stress',
    'Executive function breakdown: Stress makes ADHD symptoms worse',
    'Emotional intensity: Feelings are experienced more strongly',
    'Time blindness: Makes everything feel urgent and overwhelming',
    'Multitasking struggles: Multiple demands create cognitive overload'
  ],
  '[
    {
      "number": 1,
      "emoji": "🚨",
      "title": "Recognize Your Stress Signals",
      "intro": "ADHD stress shows up in your body, mind, and behavior. Learn your warning signs.",
      "try_this": [
        "Physical signs: Tension, headaches, stomach issues, restlessness",
        "Mental signs: Racing thoughts, difficulty concentrating, forgetfulness",
        "Emotional signs: Irritability, anxiety, feeling overwhelmed",
        "Behavioral signs: Procrastination, avoidance, or hyperfocus on unimportant tasks",
        "Notice early warnings: Catch stress before it becomes overwhelming"
      ],
      "tip": "Early recognition of stress helps you respond before it spirals out of control."
    },
    {
      "number": 2,
      "emoji": "🛡️",
      "title": "Calm Your Nervous System First",
      "intro": "You can''t think clearly when your stress response is activated. Regulation comes before action.",
      "try_this": [
        "Deep breathing: 4-7-8 breathing or box breathing to activate calm",
        "Movement: Walk, stretch, or shake out tension to discharge stress energy",
        "Grounding: 5-4-3-2-1 technique (5 things you see, 4 you touch, etc.)",
        "Cold water: Splash on face or drink cold water to reset your system",
        "Progressive muscle relaxation: Tense and release muscle groups"
      ],
      "tip": "Your nervous system needs to feel safe before your executive function can work properly."
    },
    {
      "number": 3,
      "emoji": "📋",
      "title": "Organize and Prioritize",
      "intro": "Stress often comes from feeling like everything is urgent. Let''s sort reality from perception.",
      "try_this": [
        "Brain dump: Write down everything causing you stress",
        "Categorize: Urgent vs. important, controllable vs. uncontrollable",
        "Pick your top 3: What truly needs attention today?",
        "Break it down: Turn big stressors into smaller, manageable tasks",
        "Time estimate: How long will each task actually take?"
      ],
      "tip": "Stress makes everything feel equally urgent. Prioritizing helps you see what really needs attention."
    },
    {
      "number": 4,
      "emoji": "⚡",
      "title": "Take Strategic Action",
      "intro": "Focus your energy on what you can control and let go of the rest.",
      "try_this": [
        "Start with quick wins: Knock out 5-minute tasks to build momentum",
        "Use time boxing: Set specific time limits for tasks to prevent overwhelm",
        "Single-task: Focus on one thing at a time, despite ADHD multitasking urges",
        "Ask for help: Delegate or get support where possible",
        "Set boundaries: Say no to additional stressors during high-stress periods"
      ],
      "tip": "Strategic action focuses your ADHD brain and reduces the overwhelm that feeds stress."
    },
    {
      "number": 5,
      "emoji": "🔄",
      "title": "Build Stress Resilience",
      "intro": "Create systems and habits that help you handle stress more effectively over time.",
      "try_this": [
        "Regular stress relief: Build daily practices like meditation, exercise, or creative time",
        "Identify triggers: What situations or people consistently stress you out?",
        "Create buffers: Build extra time and space around stressful events",
        "Develop coping scripts: Know what you''ll do when stress hits",
        "Monitor your capacity: Learn to recognize when you''re approaching your limit"
      ],
      "tip": "Stress resilience comes from consistent practices and self-awareness, not just crisis management."
    }
  ]'::jsonb
),
(
  'Restless',
  'It''s not being unable to sit still, it''s not being disruptive • It''s ADHD meeting **understimulation**, **energy that needs an outlet**, and a **body-brain connection seeking balance**.',
  'Restlessness with ADHD is your nervous system''s way of seeking the stimulation it needs to function optimally. Your brain might be understimulated, your body might have excess energy, or you might be fighting against environments that require you to be still when you need to move. This isn''t bad behavior, it''s your neurodivergent system trying to regulate itself.',
  'That twitchy, can''t-sit-still feeling is your body asking for movement. It''s not wrong, it''s just misdirected. Try walking, shaking, stretching, pacing. Restlessness isn''t a problem, it''s an outlet waiting to happen.',
  'You''re fidgeting through your life. Use the energy, don''t just let it leak. Move with intention. Channel it into something useful. Otherwise you''re just burning out in place.',
  ARRAY[
    'Understimulation: Your brain needs more sensory input to function optimally',
    'Dopamine seeking: Movement and stimulation help regulate neurotransmitters',
    'Nervous system regulation: Your body uses movement to manage energy and emotions',
    'Hyperactivity presentation: Physical restlessness is a core ADHD symptom',
    'Environmental mismatch: Many settings require stillness that doesn''t work for ADHD'
  ],
  '[
    {
      "number": 1,
      "emoji": "⚡",
      "title": "Understand Your Restless Energy",
      "intro": "Restlessness is information about what your nervous system needs.",
      "try_this": [
        "Notice patterns: When do you feel most restless? Time of day, situations, emotions?",
        "Identify the type: Physical restlessness, mental restlessness, or both?",
        "Check your stimulation level: Are you bored, understimulated, or overwhelmed?",
        "Consider your environment: Are you in a space that requires unnatural stillness?",
        "Listen to your body: What kind of movement or stimulation do you crave?"
      ],
      "tip": "Restlessness isn''t a problem to solve, it''s information about what your brain and body need."
    },
    {
      "number": 2,
      "emoji": "🏃‍♀️",
      "title": "Channel Restless Energy Productively",
      "intro": "Give your restlessness positive outlets instead of fighting it.",
      "try_this": [
        "Fidget tools: Stress balls, fidget cubes, or tactile objects to occupy your hands",
        "Standing or walking: Work from a standing desk or take walking meetings",
        "Exercise breaks: Quick bursts of movement throughout your day",
        "Background stimulation: Music, white noise, or other sensory input",
        "Productive movement: Clean, organize, or do physical tasks when restless"
      ],
      "tip": "Working with restlessness is more effective than fighting against it."
    },
    {
      "number": 3,
      "emoji": "🎯",
      "title": "Find Your Optimal Stimulation Level",
      "intro": "Experiment to find the right amount and type of stimulation for focus.",
      "try_this": [
        "Try different settings: Quiet vs. background noise, sitting vs. standing",
        "Experiment with timing: When is your restlessness highest and lowest?",
        "Test stimulation types: Visual, auditory, tactile, or movement-based",
        "Monitor your focus: How does different stimulation affect your concentration?",
        "Adjust as needed: Your optimal stimulation may vary by task or day"
      ],
      "tip": "The right amount of stimulation can actually improve focus and reduce disruptive restlessness."
    },
    {
      "number": 4,
      "emoji": "🛠️",
      "title": "Create Restlessness-Friendly Environments",
      "intro": "Modify your spaces and routines to accommodate your need for movement.",
      "try_this": [
        "Flexible workspace: Options to sit, stand, or move while working",
        "Movement breaks: Scheduled times to get up and move around",
        "Fidget-friendly meetings: Bring quiet fidget tools to long meetings",
        "Exercise routine: Regular physical activity to manage overall restlessness",
        "Communicate needs: Help others understand your movement needs"
      ],
      "tip": "Environments that accommodate restlessness often improve performance for everyone."
    },
    {
      "number": 5,
      "emoji": "🌊",
      "title": "Manage Restlessness Over Time",
      "intro": "Build long-term strategies for working with your restless energy.",
      "try_this": [
        "Track patterns: Note when restlessness is highest and what helps",
        "Plan for it: Build movement and stimulation into your daily routine",
        "Develop coping strategies: Quick techniques for managing restlessness in constrained situations",
        "Practice self-advocacy: Communicate your needs in work and social settings",
        "Embrace your energy: See restlessness as vitality and enthusiasm, not a flaw"
      ],
      "tip": "Restlessness can be a source of energy and creativity when properly channeled."
    }
  ]'::jsonb
),
(
  'Wired',
  'It''s not being hyper, it''s not being ''on drugs'' • It''s ADHD meeting **dopamine spikes**, **hyperfocus activation**, and a brain **running at maximum intensity**.',
  'Feeling wired with ADHD is like having your brain''s engine revving at full speed. You might have too much energy, racing thoughts, or be hyperfocused on something that captured your interest. This can come from medication, excitement, stress, or just your natural ADHD intensity. It''s not necessarily bad, but it can be overwhelming and hard to direct productively.',
  'You''re not actually energized, you''re overstimulated. That buzz in your body might feel productive, but it''s adrenaline, not peace. Slow down. Ground yourself. You don''t have to run on hyperdrive to be valuable.',
  'You''re not focused, you''re frazzled. The caffeine, the chaos, the scrolling, it''s frying your nervous system. Sit still. Turn things off. Don''t confuse being "on" with being in control.',
  ARRAY[
    'Dopamine fluctuations: Spikes in neurotransmitters create intense energy',
    'Hyperfocus activation: When your brain locks onto something interesting',
    'Medication effects: Stimulants can create wired feelings, especially when adjusting',
    'Nervous system arousal: High stimulation or excitement amplifying energy',
    'Interest-driven intensity: ADHD passion and enthusiasm at full power'
  ],
  '[
    {
      "number": 1,
      "emoji": "⚡",
      "title": "Understand Your Wired State",
      "intro": "Recognize what''s driving the wired feeling so you can work with it.",
      "try_this": [
        "Check medication timing: Are you recently medicated or experiencing side effects?",
        "Identify triggers: Excitement, stress, caffeine, or intense focus?",
        "Notice the type: Physical energy, mental racing, or emotional intensity?",
        "Consider your interests: Are you hyperfocused on something compelling?",
        "Monitor your body: Heart rate, restlessness, jaw clenching, or tension?"
      ],
      "tip": "Understanding why you''re wired helps you decide how to channel or manage the energy."
    },
    {
      "number": 2,
      "emoji": "🎯",
      "title": "Channel the Energy Productively",
      "intro": "When you''re wired, use that energy for tasks that benefit from intensity and focus.",
      "try_this": [
        "Tackle challenging projects: Use the energy for tasks requiring deep focus",
        "Physical activity: Channel excess energy into exercise or movement",
        "Creative work: Wired states can fuel artistic or innovative thinking",
        "Organize or clean: Physical tasks that benefit from high energy",
        "Learn something new: Use the intensity for absorbing information"
      ],
      "tip": "Wired energy is powerful when directed toward the right activities."
    },
    {
      "number": 3,
      "emoji": "🌊",
      "title": "Manage Overwhelm and Intensity",
      "intro": "Sometimes wired energy becomes too much. Learn to modulate without shutting down.",
      "try_this": [
        "Take breaks: Step away before the intensity becomes overwhelming",
        "Use breathing techniques: Slow, deep breaths to moderate arousal",
        "Change environments: Move to a calmer, less stimulating space",
        "Ground yourself: Focus on physical sensations to stay connected to your body",
        "Set boundaries: Don''t take on more when you''re already running hot"
      ],
      "tip": "You can moderate wired energy without completely suppressing your natural intensity."
    },
    {
      "number": 4,
      "emoji": "⏰",
      "title": "Plan for the Inevitable Crash",
      "intro": "Wired states often lead to energy crashes. Prepare for the comedown.",
      "try_this": [
        "Schedule recovery time: Plan easier activities for after intense periods",
        "Maintain basics: Eat regularly, stay hydrated, don''t skip meals",
        "Avoid overcommitment: Don''t make promises based on temporary high energy",
        "Practice self-compassion: It''s normal to need recovery after intense periods",
        "Create soft landings: Comfortable environments and activities for when energy drops"
      ],
      "tip": "Planning for energy fluctuations helps you maintain stability over time."
    },
    {
      "number": 5,
      "emoji": "🎚️",
      "title": "Learn to Regulate Your Energy",
      "intro": "Develop skills for managing your energy levels over time.",
      "try_this": [
        "Track patterns: Notice what triggers wired states and how long they last",
        "Practice modulation: Techniques for turning energy up or down as needed",
        "Build routines: Consistent habits that support energy regulation",
        "Communicate needs: Let others know when you''re in a wired state",
        "Embrace your intensity: See wired energy as part of your ADHD gifts when well-managed"
      ],
      "tip": "Learning to work with your energy patterns is more effective than fighting them."
    }
  ]'::jsonb
),
(
  'Tense',
  'It''s not being uptight, it''s not overreacting • It''s ADHD meeting **hypervigilance**, **sensory sensitivity**, and a **nervous system stuck in alert mode**.',
  'Tension with ADHD often comes from your nervous system being on high alert, whether from overstimulation, stress, RSD (Rejection Sensitive Dysphoria), or just the constant effort of managing ADHD symptoms. Your body holds this stress as physical tension - tight shoulders, clenched jaw, shallow breathing. This isn''t just ''being stressed,'' it''s your neurodivergent nervous system''s response to an overwhelming world.',
  'Your body remembers what your brain tries to power through. Tension is unprocessed stress. You don''t have to fix it, just _feel_ it. Stretch. Move. Breathe into the tight places. You deserve relief.',
  'You''re walking around like a clenched fist. That tension? It''s talking to you, and you''re ignoring it. Stretch. Exhale. Let it go before it locks in. Your body isn''t a stress dump, treat it better.',
  ARRAY[
    'Hypervigilance: Constantly scanning for threats or problems',
    'Sensory overload: Physical tension from processing too much stimulation',
    'Rejection sensitivity: Body tension from fear of criticism or rejection',
    'Chronic stress: Accumulated tension from managing ADHD challenges',
    'Perfectionist pressure: Physical manifestation of internal pressure'
  ],
  '[
    {
      "number": 1,
      "emoji": "🔍",
      "title": "Locate and Acknowledge Your Tension",
      "intro": "Awareness is the first step in releasing physical and emotional tension.",
      "try_this": [
        "Body scan: Notice where you hold tension - shoulders, jaw, stomach, back?",
        "Rate the intensity: On a scale of 1-10, how tense do you feel?",
        "Identify triggers: What situations or thoughts increase your tension?",
        "Notice patterns: When during the day do you feel most tense?",
        "Acknowledge without judgment: Tension is a normal response to stress"
      ],
      "tip": "You can''t release tension you don''t notice. Awareness creates the possibility for change."
    },
    {
      "number": 2,
      "emoji": "🌬️",
      "title": "Use Breath to Release Tension",
      "intro": "Your breath is directly connected to your nervous system and can help release tension.",
      "try_this": [
        "Deep belly breathing: Breathe into your diaphragm, not your chest",
        "Extended exhales: Make your exhale longer than your inhale to activate calm",
        "Box breathing: 4 counts in, hold 4, out 4, hold 4",
        "Sighing: Let out audible sighs to release tension naturally",
        "Breathe into tense areas: Imagine sending breath to tight muscles"
      ],
      "tip": "Your breath is always available as a tool for nervous system regulation."
    },
    {
      "number": 3,
      "emoji": "💆‍♀️",
      "title": "Release Physical Tension",
      "intro": "Your body needs direct attention to release stored tension and stress.",
      "try_this": [
        "Progressive muscle relaxation: Tense then release each muscle group",
        "Gentle stretching: Focus on areas where you hold tension",
        "Self-massage: Use your hands or tools to work out tight spots",
        "Heat therapy: Warm bath, heating pad, or hot shower to relax muscles",
        "Movement: Walking, yoga, or gentle exercise to discharge tension"
      ],
      "tip": "Physical tension needs physical release. Your body will thank you for direct attention."
    },
    {
      "number": 4,
      "emoji": "🛡️",
      "title": "Address Mental and Emotional Tension",
      "intro": "Physical tension often reflects mental and emotional stress that needs attention.",
      "try_this": [
        "Identify worry thoughts: What''s your mind rehearsing or ruminating on?",
        "Practice thought defusion: ''I''m having the thought that...'' to create distance",
        "Journal or talk it out: Express what''s creating internal pressure",
        "Set boundaries: Say no to additional stressors when you''re already tense",
        "Practice self-compassion: Treat yourself with the kindness you''d show a friend"
      ],
      "tip": "Mental tension often manifests as physical tension. Address both for complete relief."
    },
    {
      "number": 5,
      "emoji": "��",
      "title": "Build Tension Prevention into Your Life",
      "intro": "Create habits and systems that prevent tension from building up over time.",
      "try_this": [
        "Regular check-ins: Throughout the day, notice and release tension",
        "Daily movement: Exercise or stretching to prevent tension accumulation",
        "Stress management: Regular practices like meditation, journaling, or therapy",
        "Environment design: Create calm spaces that support relaxation",
        "Boundary maintenance: Protect your energy and nervous system capacity"
      ],
      "tip": "Prevention is easier than treatment. Build tension release into your daily routine."
    }
  ]'::jsonb
),
(
  'Lonely',
  'It''s not being antisocial, it''s not being needy • It''s ADHD meeting **social exhaustion**, **masking fatigue**, and the challenge of finding people who **truly understand you**.',
  'Loneliness with ADHD is complex. You might crave connection but find social situations draining. You might mask your ADHD traits around others, leaving you feeling unseen and disconnected from your authentic self. Or you might struggle with social cues and timing, making it hard to build and maintain friendships. The loneliness isn''t just about being alone, it''s about feeling misunderstood or having to hide parts of yourself.',
  'You can feel lonely even when you''re around people, especially with ADHD. You deserve connection, even if it looks different than what others expect. Reach out, even if it''s awkward. You are not a burden.',
  'You''re lonely, but you''re not reaching out. You''re isolating out of fear, not fact. Send the message. Ask someone to hang out. People won''t know you need connection unless you let them in.',
  ARRAY[
    'Masking exhaustion: Hiding ADHD traits leaves you feeling disconnected from yourself',
    'Social timing challenges: Difficulty with social cues and conversation flow',
    'Rejection sensitivity: Fear of rejection makes social connection feel risky',
    'Interest-based socialization: Struggling to connect over small talk vs. special interests',
    'Social energy depletion: Finding social interaction exhausting rather than energizing'
  ],
  '[
    {
      "number": 1,
      "emoji": "💭",
      "title": "Understand Your Unique Social Needs",
      "intro": "ADHD changes how you experience and need social connection.",
      "try_this": [
        "Identify your social style: Do you prefer small groups, one-on-one, or parallel socializing?",
        "Notice energy patterns: Which social activities energize vs. drain you?",
        "Recognize masking: When do you feel like you''re performing rather than being authentic?",
        "Explore connection preferences: Deep conversations vs. activity-based vs. shared interests?",
        "Honor your needs: Your social needs might be different from neurotypical expectations"
      ],
      "tip": "Understanding your social needs helps you seek the right kinds of connection."
    },
    {
      "number": 2,
      "emoji": "🎭",
      "title": "Reduce Masking and Embrace Authenticity",
      "intro": "Real connection happens when you can be yourself, ADHD traits and all.",
      "try_this": [
        "Practice selective authenticity: Start by being more real with safe people",
        "Share your ADHD experience: Help others understand your brain and needs",
        "Set social boundaries: It''s okay to leave early or take breaks",
        "Advocate for your needs: Ask for what helps you feel comfortable socially",
        "Celebrate your ADHD gifts: Enthusiasm, creativity, and unique perspectives"
      ],
      "tip": "Authentic relationships are built on real connection, not perfect performance."
    },
    {
      "number": 3,
      "emoji": "🔍",
      "title": "Find Your People",
      "intro": "Seek out communities and individuals who appreciate neurodivergent traits.",
      "try_this": [
        "Join ADHD communities: Online groups, support meetings, or local organizations",
        "Pursue your interests: Connect with others who share your passions",
        "Look for neurodivergent-friendly spaces: Places that celebrate different ways of being",
        "Quality over quantity: Focus on deep connections rather than numerous shallow ones",
        "Be patient: Building authentic relationships takes time"
      ],
      "tip": "Your people are out there. Look for communities that celebrate authenticity and neurodiversity."
    },
    {
      "number": 4,
      "emoji": "🌱",
      "title": "Build Connection Skills That Work for You",
      "intro": "Develop social strategies that honor your ADHD brain rather than fighting it.",
      "try_this": [
        "Practice vulnerability: Share struggles and successes authentically",
        "Use your ADHD strengths: Enthusiasm, empathy, and unique insights",
        "Create structure: Scheduled check-ins or regular activities with friends",
        "Communicate your needs: Let people know how ADHD affects your social style",
        "Focus on mutual interests: Bond over shared passions rather than forcing small talk"
      ],
      "tip": "Social skills can be learned and adapted to work with your ADHD brain."
    },
    {
      "number": 5,
      "emoji": "💝",
      "title": "Nurture Self-Connection and Self-Compassion",
      "intro": "The relationship with yourself is the foundation for all other connections.",
      "try_this": [
        "Practice self-compassion: Treat yourself with the kindness you''d show a friend",
        "Develop your relationship with yourself: Spend quality time alone without judgment",
        "Celebrate your uniqueness: Your ADHD traits can be gifts in relationships",
        "Journal or reflect: Process your social experiences and needs",
        "Seek professional support: Therapy can help with social anxiety and relationship skills"
      ],
      "tip": "A strong relationship with yourself makes all other relationships more authentic and fulfilling."
    }
  ]'::jsonb
),
(
  'Misunderstood',
  'It''s not being dramatic, it''s not playing victim • It''s ADHD meeting **invisible struggles**, **misconceptions about neurodivergence**, and a world that often **judges what it doesn''t understand**.',
  'Feeling misunderstood with ADHD is incredibly common because many of your struggles are invisible. People might see you as lazy when you''re battling executive dysfunction, dramatic when you''re experiencing RSD, or scattered when you''re managing multiple cognitive demands. The mismatch between your internal experience and others'' perceptions can leave you feeling isolated and invalidated.',
  'You''re not too much, you''ve just been around people who didn''t know how to hold your truth. Being misunderstood doesn''t mean you''re wrong. You deserve to be seen and heard. Find your people, they exist.',
  'You''re not a mystery, you''re avoiding being clear. Speak up. Say what you need. Stop expecting people to read your mind or get your silence. Clarity creates connection.',
  ARRAY[
    'Invisible struggles: ADHD symptoms often can''t be seen from the outside',
    'Misconceptions: Common myths about ADHD being fake or just lack of willpower',
    'Masking success: When you mask well, people don''t believe you struggle',
    'Communication gaps: Difficulty explaining complex neurological experiences',
    'Societal ableism: Systems and attitudes that don''t accommodate neurodifference'
  ],
  '[
    {
      "number": 1,
      "emoji": "🪞",
      "title": "Validate Your Own Experience",
      "intro": "Your experience is real and valid, whether or not others understand it.",
      "try_this": [
        "Trust your inner experience: You know what you''re going through",
        "Stop seeking validation: Your struggles don''t need others'' approval to be real",
        "Journal your experiences: Document patterns and challenges for clarity",
        "Connect with others who understand: ADHD communities and support groups",
        "Practice self-advocacy: Speak up for your needs and experiences"
      ],
      "tip": "Self-validation is more reliable than seeking understanding from others who may not be capable of it."
    },
    {
      "number": 2,
      "emoji": "🎓",
      "title": "Educate Others When Appropriate",
      "intro": "Sometimes misunderstanding comes from lack of information rather than lack of caring.",
      "try_this": [
        "Choose your battles: Not everyone needs to understand, focus on key relationships",
        "Share resources: Articles, videos, or books about ADHD experiences",
        "Use analogies: Compare ADHD struggles to more visible conditions",
        "Be specific: Instead of ''I have ADHD,'' explain particular challenges",
        "Set boundaries: You don''t owe everyone an education about your neurodivergence"
      ],
      "tip": "Education can help, but remember you''re not responsible for everyone''s understanding."
    },
    {
      "number": 3,
      "emoji": "🛡️",
      "title": "Protect Your Energy from Toxic Misunderstanding",
      "intro": "Some people will never understand, and that''s not your fault or responsibility.",
      "try_this": [
        "Identify safe people: Those who listen, learn, and support you",
        "Limit exposure: Reduce time with people who consistently invalidate you",
        "Practice gray rock: Minimal engagement with those who won''t understand",
        "Don''t over-explain: You don''t need to justify your experience to everyone",
        "Build your support network: Surround yourself with understanding people"
      ],
      "tip": "Protecting your energy from toxic misunderstanding is an act of self-care, not selfishness."
    },
    {
      "number": 4,
      "emoji": "💪",
      "title": "Build Resilience to Misunderstanding",
      "intro": "Develop inner strength that doesn''t depend on others'' understanding or approval.",
      "try_this": [
        "Develop a strong sense of self: Know who you are beyond others'' opinions",
        "Practice self-compassion: Be kind to yourself when others aren''t",
        "Focus on your growth: Let your progress speak louder than others'' doubts",
        "Find meaning in your struggle: How has ADHD also brought gifts or insights?",
        "Connect with your values: Stay true to what matters to you"
      ],
      "tip": "Resilience comes from internal validation and connection to your authentic self."
    },
    {
      "number": 5,
      "emoji": "🌟",
      "title": "Find and Create Understanding Communities",
      "intro": "Seek out and build relationships with people who get it or are willing to learn.",
      "try_this": [
        "Join ADHD communities: Online forums, support groups, or local meetups",
        "Find neurodivergent-friendly spaces: Places that celebrate different ways of being",
        "Be open about your needs: In work, relationships, and social situations",
        "Mentor others: Share your experience with newly diagnosed individuals",
        "Advocate for awareness: Help create more understanding in your communities"
      ],
      "tip": "Understanding communities exist and can be created. You deserve to be seen and accepted for who you are."
    }
  ]'::jsonb
),
(
  'Rejected',
  'It''s not being too sensitive, it''s not imagining things • It''s ADHD meeting **Rejection Sensitive Dysphoria**, **social challenges**, and a **nervous system that experiences rejection as physical pain**.',
  'Rejection with ADHD often triggers RSD (Rejection Sensitive Dysphoria), making criticism, disapproval, or exclusion feel like intense emotional pain. Your nervous system processes rejection as a threat to survival, creating overwhelming feelings that can last for hours or days. This isn''t being ''too sensitive,'' it''s a neurological reality of having ADHD. The pain is real, even when the rejection might be minor or unintentional.',
  'Rejection hits harder for you, that''s real. ADHD often comes with RSD, and it''s not your fault. Let yourself feel it, but don''t let it rewrite your worth. You''re still lovable. Still capable. Still needed.',
  'You''re not broken, you''re bruised. Rejection is painful, but it''s not a death sentence. Feel it, then move. Don''t let one "no" silence everything else you could be saying yes to.',
  ARRAY[
    'Rejection Sensitive Dysphoria (RSD): Neurological hypersensitivity to criticism or rejection',
    'Social vulnerability: ADHD traits can lead to more experiences of actual rejection',
    'Emotional intensity: ADHD brains experience emotions more strongly',
    'Memory bias: Tendency to remember rejections more vividly than acceptances',
    'Self-protection mechanisms: Avoiding situations where rejection might occur'
  ],
  '[
    {
      "number": 1,
      "emoji": "🧠",
      "title": "Understand RSD and Your Rejection Response",
      "intro": "Rejection Sensitive Dysphoria makes rejection feel like a survival threat to your nervous system.",
      "try_this": [
        "Recognize RSD symptoms: Intense emotional pain, shame, or rage after perceived rejection",
        "Notice triggers: Criticism, disapproval, conflict, or even neutral responses",
        "Understand it''s neurological: Your brain processes rejection differently than neurotypicals",
        "Track patterns: When and where do you most often feel rejected?",
        "Validate the pain: RSD pain is real, even if others don''t understand it"
      ],
      "tip": "Understanding RSD helps you recognize when your reaction might be amplified beyond the actual situation."
    },
    {
      "number": 2,
      "emoji": "🛡️",
      "title": "Soothe Your Nervous System in the Moment",
      "intro": "When RSD hits, your nervous system needs immediate care and regulation.",
      "try_this": [
        "Practice grounding: 5-4-3-2-1 technique or focus on physical sensations",
        "Use bilateral stimulation: Cross-lateral movements or alternating tapping",
        "Try breathing exercises: Deep, slow breaths to activate your parasympathetic system",
        "Seek comfort: Weighted blanket, warm bath, or soothing music",
        "Time boundaries: Remind yourself this intense feeling will pass"
      ],
      "tip": "Immediate nervous system care prevents RSD from spiraling into deeper emotional wounds."
    },
    {
      "number": 3,
      "emoji": "🔍",
      "title": "Examine the Reality of the Rejection",
      "intro": "RSD can make minor things feel major. Let''s check the facts once you''re regulated.",
      "try_this": [
        "Wait for regulation: Don''t analyze until your nervous system has calmed",
        "Check the evidence: Was this actually rejection or RSD sensitivity?",
        "Consider alternatives: Could there be other explanations for their behavior?",
        "Ask directly: Sometimes clarifying prevents unnecessary suffering",
        "Practice perspective: How will this feel in a week, month, or year?"
      ],
      "tip": "RSD can distort perception. Fact-checking after regulation helps you respond to reality, not just feelings."
    },
    {
      "number": 4,
      "emoji": "💝",
      "title": "Build Self-Worth Independent of Others'' Approval",
      "intro": "Reduce the power of rejection by strengthening your internal sense of worth.",
      "try_this": [
        "Identify your values: What matters to you beyond others'' opinions?",
        "Celebrate your strengths: Regularly acknowledge your positive qualities",
        "Practice self-compassion: Treat yourself with kindness, especially after perceived rejection",
        "Build accomplishment: Engage in activities that make you feel capable and valued",
        "Connect with supporters: Spend time with people who appreciate you"
      ],
      "tip": "Self-worth that comes from within is more stable than approval from others."
    },
    {
      "number": 5,
      "emoji": "🌱",
      "title": "Develop Long-term RSD Management Strategies",
      "intro": "Build resilience and coping strategies for managing RSD over time.",
      "try_this": [
        "Create a RSD toolkit: Specific strategies that help you when rejection hits",
        "Practice exposure gradually: Small doses of potential rejection to build tolerance",
        "Develop relationships: With people who understand RSD and ADHD",
        "Consider medication: Some medications can help with RSD intensity",
        "Work with professionals: Therapy can help develop coping strategies and heal rejection wounds"
      ],
      "tip": "RSD management is a skill that improves with practice and support. You can learn to navigate it more effectively."
    }
  ]'::jsonb
);

-- Note: This is a comprehensive import with all 22 feelings from the feelings page.
-- Each feeling has been processed to remove em dashes, clean up emojis, 
-- format subtitles with strategic bolding, and structure step sections properly.

-- ============================================================================
-- STEP INTRO UPDATES
-- These updates refine the intro text for each step section to remove redundancy
-- ============================================================================

-- Mental Fog updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Your brain just needs a different approach right now."'::jsonb
)
WHERE feeling_name = 'Mental Fog';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Let''s empty it out so your brain has room to think clearly."'::jsonb
)
WHERE feeling_name = 'Mental Fog';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Your body needs to shift first, then your brain follows."'::jsonb
)
WHERE feeling_name = 'Mental Fog';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Let''s reduce the cognitive load first."'::jsonb
)
WHERE feeling_name = 'Mental Fog';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Let''s build prevention into your life."'::jsonb
)
WHERE feeling_name = 'Mental Fog';

-- Overwhelmed updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Your brain just needs a different approach right now."'::jsonb
)
WHERE feeling_name = 'Overwhelmed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Let''s get your brain and body back online."'::jsonb
)
WHERE feeling_name = 'Overwhelmed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Let''s meet it with care."'::jsonb
)
WHERE feeling_name = 'Overwhelmed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Just the next right thing."'::jsonb
)
WHERE feeling_name = 'Overwhelmed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"You need better systems."'::jsonb
)
WHERE feeling_name = 'Overwhelmed';

-- Anxious updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Start by tuning in without judgment."'::jsonb
)
WHERE feeling_name = 'Anxious';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Give it signals that you are safe."'::jsonb
)
WHERE feeling_name = 'Anxious';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Let''s shift the narrative."'::jsonb
)
WHERE feeling_name = 'Anxious';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Do less, not more."'::jsonb
)
WHERE feeling_name = 'Anxious';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Reconnection breaks the cycle."'::jsonb
)
WHERE feeling_name = 'Anxious';

-- Scattered updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Let''s work with it."'::jsonb
)
WHERE feeling_name = 'Scattered';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Get all those swirling thoughts out of your head."'::jsonb
)
WHERE feeling_name = 'Scattered';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Give your scattered attention something specific to land on."'::jsonb
)
WHERE feeling_name = 'Scattered';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Learn when and how your attention naturally flows."'::jsonb
)
WHERE feeling_name = 'Scattered';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Create structures that support your attention without overwhelming your brain."'::jsonb
)
WHERE feeling_name = 'Scattered';

-- Stuck updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Let''s figure out what''s really going on."'::jsonb
)
WHERE feeling_name = 'Stuck';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"The smaller the first step, the easier it is for your brain to take it."'::jsonb
)
WHERE feeling_name = 'Stuck';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Sometimes you need to shift your physical or mental state."'::jsonb
)
WHERE feeling_name = 'Stuck';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"External structure can provide the framework your executive function is missing."'::jsonb
)
WHERE feeling_name = 'Stuck';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Chronic stuckness often has deeper patterns that need attention."'::jsonb
)
WHERE feeling_name = 'Stuck';

-- Frustrated updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Frustration means your needs aren''t being met."'::jsonb
)
WHERE feeling_name = 'Frustrated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Nervous system tools are your off-ramp from a spiral."'::jsonb
)
WHERE feeling_name = 'Frustrated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"There''s often something deeper beneath the snap."'::jsonb
)
WHERE feeling_name = 'Frustrated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Let''s give your brain some ground to stand on."'::jsonb
)
WHERE feeling_name = 'Frustrated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Saying it out loud, or learning from it, helps it lose its grip."'::jsonb
)
WHERE feeling_name = 'Frustrated';

-- Defeated updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Hopelessness is a message, not proof of failure."'::jsonb
)
WHERE feeling_name = 'Defeated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Challenge the narratives that fuel hopelessness."'::jsonb
)
WHERE feeling_name = 'Defeated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Small possibilities can grow into larger ones."'::jsonb
)
WHERE feeling_name = 'Defeated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Maybe you haven''t found the right strategies yet."'::jsonb
)
WHERE feeling_name = 'Defeated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Connection can restore hope."'::jsonb
)
WHERE feeling_name = 'Defeated';

-- Burned Out updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"The earlier you notice it, the gentler your recovery can be."'::jsonb
)
WHERE feeling_name = 'Burned Out';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Regulation comes before action."'::jsonb
)
WHERE feeling_name = 'Burned Out';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"You can''t schedule your way out of burnout, but you can remove pressure."'::jsonb
)
WHERE feeling_name = 'Burned Out';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Let''s shift the inner story."'::jsonb
)
WHERE feeling_name = 'Burned Out';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Burnout recovery requires people, permission, and pacing."'::jsonb
)
WHERE feeling_name = 'Burned Out';

-- Forgetful updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Let''s work with it, not against it."'::jsonb
)
WHERE feeling_name = 'Forgetful';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Let''s create reliable external systems."'::jsonb
)
WHERE feeling_name = 'Forgetful';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Help your brain store information by connecting it to things you already remember."'::jsonb
)
WHERE feeling_name = 'Forgetful';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Work with your time blindness and context switching challenges."'::jsonb
)
WHERE feeling_name = 'Forgetful';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"You don''t have to remember everything alone."'::jsonb
)
WHERE feeling_name = 'Forgetful';

-- Numb updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Numbness is your brain''s way of creating safety."'::jsonb
)
WHERE feeling_name = 'Numb';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Don''t force emotions, but create space for them to return naturally."'::jsonb
)
WHERE feeling_name = 'Numb';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Numbness is often a symptom of something else that needs attention."'::jsonb
)
WHERE feeling_name = 'Numb';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Even when numb, you can take small steps toward reconnection."'::jsonb
)
WHERE feeling_name = 'Numb';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Persistent numbness might need professional attention or extra support."'::jsonb
)
WHERE feeling_name = 'Numb';

-- Ashamed updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Understanding helps you address shame more effectively."'::jsonb
)
WHERE feeling_name = 'Ashamed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Question the voices that tell you ADHD traits are moral failings."'::jsonb
)
WHERE feeling_name = 'Ashamed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Treat yourself with the same kindness you''d show a struggling friend."'::jsonb
)
WHERE feeling_name = 'Ashamed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Develop tools to handle shame when it arises and protect against future shame."'::jsonb
)
WHERE feeling_name = 'Ashamed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Create a new narrative about yourself based on truth, not shame."'::jsonb
)
WHERE feeling_name = 'Ashamed';

-- Guilty updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Not all guilt is bad."'::jsonb
)
WHERE feeling_name = 'Guilty';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Recognize how ADHD symptoms create situations that trigger guilt."'::jsonb
)
WHERE feeling_name = 'Guilty';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Use guilt as information to guide positive changes rather than self-punishment."'::jsonb
)
WHERE feeling_name = 'Guilty';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Address the impact of your actions while advocating for your needs."'::jsonb
)
WHERE feeling_name = 'Guilty';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Release perfectionist standards and embrace learning from mistakes."'::jsonb
)
WHERE feeling_name = 'Guilty';

-- Hopeless updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Don''t judge it away."'::jsonb
)
WHERE feeling_name = 'Hopeless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Challenge the narratives that fuel hopelessness."'::jsonb
)
WHERE feeling_name = 'Hopeless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Hope doesn''t have to be big."'::jsonb
)
WHERE feeling_name = 'Hopeless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Maybe you haven''t found the right strategies yet."'::jsonb
)
WHERE feeling_name = 'Hopeless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Hope is often restored through connection with others who understand your journey."'::jsonb
)
WHERE feeling_name = 'Hopeless';

-- Stressed updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"The earlier you catch stress, the gentler your recovery can be."'::jsonb
)
WHERE feeling_name = 'Stressed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Regulation comes before action."'::jsonb
)
WHERE feeling_name = 'Stressed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Let''s sort reality from perception."'::jsonb
)
WHERE feeling_name = 'Stressed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Focus your energy on what you can control."'::jsonb
)
WHERE feeling_name = 'Stressed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Create systems and habits that help you handle stress more effectively."'::jsonb
)
WHERE feeling_name = 'Stressed';

-- Restless updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Restlessness is information about what your nervous system needs."'::jsonb
)
WHERE feeling_name = 'Restless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Give your restlessness positive outlets instead of fighting it."'::jsonb
)
WHERE feeling_name = 'Restless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Experiment to find the right amount and type of stimulation."'::jsonb
)
WHERE feeling_name = 'Restless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Modify your spaces and routines to accommodate your need for movement."'::jsonb
)
WHERE feeling_name = 'Restless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Build long-term strategies for working with your restless energy."'::jsonb
)
WHERE feeling_name = 'Restless';

-- Wired updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Recognize what''s driving the wired feeling so you can work with it."'::jsonb
)
WHERE feeling_name = 'Wired';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Use that energy for tasks that benefit from intensity and focus."'::jsonb
)
WHERE feeling_name = 'Wired';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Learn to modulate without shutting down."'::jsonb
)
WHERE feeling_name = 'Wired';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Prepare for the comedown."'::jsonb
)
WHERE feeling_name = 'Wired';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Develop skills for managing your energy levels over time."'::jsonb
)
WHERE feeling_name = 'Wired';

-- Tense updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Awareness creates the possibility for change."'::jsonb
)
WHERE feeling_name = 'Tense';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Your breath is directly connected to your nervous system."'::jsonb
)
WHERE feeling_name = 'Tense';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Your body needs direct attention to release stored tension."'::jsonb
)
WHERE feeling_name = 'Tense';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Physical tension often reflects mental and emotional stress."'::jsonb
)
WHERE feeling_name = 'Tense';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Create habits and systems that prevent tension from building up."'::jsonb
)
WHERE feeling_name = 'Tense';

-- Lonely updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"ADHD changes how you experience and need social connection."'::jsonb
)
WHERE feeling_name = 'Lonely';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Real connection happens when you can be yourself."'::jsonb
)
WHERE feeling_name = 'Lonely';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Seek out communities and individuals who appreciate neurodivergent traits."'::jsonb
)
WHERE feeling_name = 'Lonely';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Develop social strategies that honor your ADHD brain."'::jsonb
)
WHERE feeling_name = 'Lonely';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"The relationship with yourself is the foundation for all other connections."'::jsonb
)
WHERE feeling_name = 'Lonely';

-- Misunderstood updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Your experience is real and valid."'::jsonb
)
WHERE feeling_name = 'Misunderstood';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Sometimes misunderstanding comes from lack of information."'::jsonb
)
WHERE feeling_name = 'Misunderstood';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Some people will never understand, and that''s not your fault."'::jsonb
)
WHERE feeling_name = 'Misunderstood';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Develop inner strength that doesn''t depend on others'' understanding."'::jsonb
)
WHERE feeling_name = 'Misunderstood';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Seek out and build relationships with people who get it."'::jsonb
)
WHERE feeling_name = 'Misunderstood';

-- Rejected updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,intro}',
  '"Rejection Sensitive Dysphoria makes rejection feel like a survival threat."'::jsonb
)
WHERE feeling_name = 'Rejected';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,intro}',
  '"Your nervous system needs immediate care and regulation."'::jsonb
)
WHERE feeling_name = 'Rejected';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,intro}',
  '"Let''s check the facts once you''re regulated."'::jsonb
)
WHERE feeling_name = 'Rejected';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,intro}',
  '"Reduce the power of rejection by strengthening your internal sense of worth."'::jsonb
)
WHERE feeling_name = 'Rejected';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,intro}',
  '"Build resilience and coping strategies for managing RSD over time."'::jsonb
)
WHERE feeling_name = 'Rejected';

-- ============================================================================
-- STEP ICON UPDATES
-- These updates replace emoji icons with Lucide icon names for proper rendering
-- ============================================================================

-- Mental Fog updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Brain"'::jsonb
)
WHERE feeling_name = 'Mental Fog';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"FileOutput"'::jsonb
)
WHERE feeling_name = 'Mental Fog';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Yoga"'::jsonb
)
WHERE feeling_name = 'Mental Fog';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Target"'::jsonb
)
WHERE feeling_name = 'Mental Fog';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"RefreshCw"'::jsonb
)
WHERE feeling_name = 'Mental Fog';

-- Overwhelmed updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Compass"'::jsonb
)
WHERE feeling_name = 'Overwhelmed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Lotus"'::jsonb
)
WHERE feeling_name = 'Overwhelmed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Search"'::jsonb
)
WHERE feeling_name = 'Overwhelmed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Target"'::jsonb
)
WHERE feeling_name = 'Overwhelmed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Wrench"'::jsonb
)
WHERE feeling_name = 'Overwhelmed';

-- Anxious updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Compass"'::jsonb
)
WHERE feeling_name = 'Anxious';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Wind"'::jsonb
)
WHERE feeling_name = 'Anxious';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Search"'::jsonb
)
WHERE feeling_name = 'Anxious';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"PersonStanding"'::jsonb
)
WHERE feeling_name = 'Anxious';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Users"'::jsonb
)
WHERE feeling_name = 'Anxious';

-- Scattered updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Compass"'::jsonb
)
WHERE feeling_name = 'Scattered';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"FileOutput"'::jsonb
)
WHERE feeling_name = 'Scattered';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Target"'::jsonb
)
WHERE feeling_name = 'Scattered';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Waves"'::jsonb
)
WHERE feeling_name = 'Scattered';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Wrench"'::jsonb
)
WHERE feeling_name = 'Scattered';

-- Stuck updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Search"'::jsonb
)
WHERE feeling_name = 'Stuck';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Mountain"'::jsonb
)
WHERE feeling_name = 'Stuck';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Mask"'::jsonb
)
WHERE feeling_name = 'Stuck';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Target"'::jsonb
)
WHERE feeling_name = 'Stuck';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Brain"'::jsonb
)
WHERE feeling_name = 'Stuck';

-- Frustrated updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Brain"'::jsonb
)
WHERE feeling_name = 'Frustrated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Wind"'::jsonb
)
WHERE feeling_name = 'Frustrated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Wrench"'::jsonb
)
WHERE feeling_name = 'Frustrated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Blocks"'::jsonb
)
WHERE feeling_name = 'Frustrated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"HandsClapping"'::jsonb
)
WHERE feeling_name = 'Frustrated';

-- Defeated updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Brain"'::jsonb
)
WHERE feeling_name = 'Defeated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"RefreshCw"'::jsonb
)
WHERE feeling_name = 'Defeated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Cog"'::jsonb
)
WHERE feeling_name = 'Defeated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"HandsHelping"'::jsonb
)
WHERE feeling_name = 'Defeated';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Mirror"'::jsonb
)
WHERE feeling_name = 'Defeated';

-- Burned Out updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Search"'::jsonb
)
WHERE feeling_name = 'Burned Out';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Shield"'::jsonb
)
WHERE feeling_name = 'Burned Out';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Battery"'::jsonb
)
WHERE feeling_name = 'Burned Out';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Heart"'::jsonb
)
WHERE feeling_name = 'Burned Out';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"HandsHelping"'::jsonb
)
WHERE feeling_name = 'Burned Out';

-- Forgetful updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Brain"'::jsonb
)
WHERE feeling_name = 'Forgetful';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"FileText"'::jsonb
)
WHERE feeling_name = 'Forgetful';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Link"'::jsonb
)
WHERE feeling_name = 'Forgetful';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Clock"'::jsonb
)
WHERE feeling_name = 'Forgetful';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"HandsHelping"'::jsonb
)
WHERE feeling_name = 'Forgetful';

-- Numb updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Search"'::jsonb
)
WHERE feeling_name = 'Numb';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Waves"'::jsonb
)
WHERE feeling_name = 'Numb';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Brain"'::jsonb
)
WHERE feeling_name = 'Numb';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Power"'::jsonb
)
WHERE feeling_name = 'Numb';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"HandsHelping"'::jsonb
)
WHERE feeling_name = 'Numb';

-- Ashamed updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Mirror"'::jsonb
)
WHERE feeling_name = 'Ashamed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Brain"'::jsonb
)
WHERE feeling_name = 'Ashamed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Heart"'::jsonb
)
WHERE feeling_name = 'Ashamed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Shield"'::jsonb
)
WHERE feeling_name = 'Ashamed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Sprout"'::jsonb
)
WHERE feeling_name = 'Ashamed';

-- Guilty updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Scale"'::jsonb
)
WHERE feeling_name = 'Guilty';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Brain"'::jsonb
)
WHERE feeling_name = 'Guilty';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"RefreshCw"'::jsonb
)
WHERE feeling_name = 'Guilty';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"HandsHelping"'::jsonb
)
WHERE feeling_name = 'Guilty';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Heart"'::jsonb
)
WHERE feeling_name = 'Guilty';

-- Hopeless updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Moon"'::jsonb
)
WHERE feeling_name = 'Hopeless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Search"'::jsonb
)
WHERE feeling_name = 'Hopeless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Sprout"'::jsonb
)
WHERE feeling_name = 'Hopeless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Wrench"'::jsonb
)
WHERE feeling_name = 'Hopeless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"HandsHelping"'::jsonb
)
WHERE feeling_name = 'Hopeless';

-- Stressed updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Bell"'::jsonb
)
WHERE feeling_name = 'Stressed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Shield"'::jsonb
)
WHERE feeling_name = 'Stressed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"FileText"'::jsonb
)
WHERE feeling_name = 'Stressed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Zap"'::jsonb
)
WHERE feeling_name = 'Stressed';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"RefreshCw"'::jsonb
)
WHERE feeling_name = 'Stressed';

-- Restless updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Zap"'::jsonb
)
WHERE feeling_name = 'Restless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"PersonRunning"'::jsonb
)
WHERE feeling_name = 'Restless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Target"'::jsonb
)
WHERE feeling_name = 'Restless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Wrench"'::jsonb
)
WHERE feeling_name = 'Restless';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Waves"'::jsonb
)
WHERE feeling_name = 'Restless';

-- Wired updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Zap"'::jsonb
)
WHERE feeling_name = 'Wired';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Target"'::jsonb
)
WHERE feeling_name = 'Wired';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Waves"'::jsonb
)
WHERE feeling_name = 'Wired';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Clock"'::jsonb
)
WHERE feeling_name = 'Wired';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Sliders"'::jsonb
)
WHERE feeling_name = 'Wired';

-- Tense updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Search"'::jsonb
)
WHERE feeling_name = 'Tense';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Wind"'::jsonb
)
WHERE feeling_name = 'Tense';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"PersonStanding"'::jsonb
)
WHERE feeling_name = 'Tense';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Shield"'::jsonb
)
WHERE feeling_name = 'Tense';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"RefreshCw"'::jsonb
)
WHERE feeling_name = 'Tense';

-- Lonely updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Brain"'::jsonb
)
WHERE feeling_name = 'Lonely';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Mask"'::jsonb
)
WHERE feeling_name = 'Lonely';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Search"'::jsonb
)
WHERE feeling_name = 'Lonely';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Sprout"'::jsonb
)
WHERE feeling_name = 'Lonely';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Heart"'::jsonb
)
WHERE feeling_name = 'Lonely';

-- Misunderstood updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Mirror"'::jsonb
)
WHERE feeling_name = 'Misunderstood';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"GraduationCap"'::jsonb
)
WHERE feeling_name = 'Misunderstood';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Shield"'::jsonb
)
WHERE feeling_name = 'Misunderstood';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Dumbbell"'::jsonb
)
WHERE feeling_name = 'Misunderstood';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Star"'::jsonb
)
WHERE feeling_name = 'Misunderstood';

-- Rejected updates
UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{0,emoji}',
  '"Brain"'::jsonb
)
WHERE feeling_name = 'Rejected';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{1,emoji}',
  '"Shield"'::jsonb
)
WHERE feeling_name = 'Rejected';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{2,emoji}',
  '"Search"'::jsonb
)
WHERE feeling_name = 'Rejected';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{3,emoji}',
  '"Heart"'::jsonb
)
WHERE feeling_name = 'Rejected';

UPDATE feelings_content
SET step_sections = jsonb_set(
  step_sections,
  '{4,emoji}',
  '"Sprout"'::jsonb
)
WHERE feeling_name = 'Rejected';