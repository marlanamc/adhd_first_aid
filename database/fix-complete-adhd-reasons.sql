-- Fix corrupted ADHD reasons for complex loops (COMPLETE VERSION)
-- This includes both "You might" behaviors and "Here's what's really going on" mechanisms
-- Run this in Supabase SQL Editor

-- Analysis Paralysis
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Spend hours researching without ever choosing',
  '- Feel stuck between "too many options" or "none feel right"',
  '- Avoid starting because you don''t know how to do it perfectly',
  '- Restart projects again and again',
  '- Wait for a burst of clarity that never comes',
  'Here''s what''s really going on:',
  '- 🧩 **Executive dysfunction** makes it hard to plan, prioritize, and act',
  '- ⏰ **Time blindness** warps urgency, making decisions feel endless',
  '- 💥 **Low dopamine** leads to shutdown when there''s no clear reward',
  '- 🔁 **Shame or avoidance loop** keeps you stuck in research mode',
  '- 🧠 **Working memory limits** mean juggling options overloads your brain'
]
WHERE loop_name = 'Analysis Paralysis';

-- Bedtime Procrastination  
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Stay up scrolling, gaming, or watching shows long after you''re tired',
  '- Feel like bedtime is when your brain finally wakes up',
  '- Push off sleep because the next day feels overwhelming or depressing',
  '- Tell yourself "just 10 more minutes" over and over',
  '- Have a racing mind that won''t turn off when you try to sleep',
  'Here''s what''s really going on:',
  '- 🕰️ **Time blindness** makes you underestimate how late it is',
  '- 🎢 **Dopamine-seeking** pushes you to find stimulation instead of rest',
  '- 📱 **Hyperfocus** keeps you locked in and unable to disengage',
  '- 🚪 **Transition trouble** makes shifting to bedtime feel like hitting a wall',
  '- 🧠 **Racing thoughts** ramp up just when you try to wind down',
  '- 😤 **Revenge bedtime** happens when you''re reclaiming "me time" after a stressful day',
  '- 🌙 **Night owl biology** means you may not feel sleepy until very late',
  '- 🌫️ **Low melatonin** or inconsistent sleep signals throw off your internal clock'
]
WHERE loop_name = 'Bedtime Procrastination';

-- Waiting Mode
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Have an appointment later and feel frozen until it''s done',
  '- Fear getting sucked into something and missing it',
  '- Keep checking the clock and feeling restless',
  '- Scroll or wander instead of starting anything',
  '- Feel like the day is "already over" because something''s scheduled',
  'Here''s what''s really going on:',
  '- ⏰ **Time blindness** makes it hard to visualize the day as a timeline',
  '- 🔁 **Transition difficulties** make shifting in and out of tasks exhausting',
  '- 🧠 **Working memory** can''t hold plans and steps while a future event looms',
  '- 💥 **Fear of lateness or hyperfocus** keeps you from committing to anything',
  '- 🚪 **Initiation paralysis** makes short windows feel too small to be productive'
]
WHERE loop_name = 'Waiting Mode';

-- Email Overwhelm
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Ignore emails because they seem overwhelming or unimportant',
  '- Open a message and immediately forget what it said',
  '- Get lost down a rabbit hole from one link or idea',
  '- Dread replying and postpone it until you forget altogether',
  '- Feel embarrassed about unread messages and avoid the inbox entirely',
  'Here''s what''s really going on:',
  '- 🧩 **Executive dysfunction** makes sorting, prioritizing, and follow-through difficult',
  '- 🔁 **Working memory issues** cause you to forget why you opened a message',
  '- ⏰ **Time blindness** makes it feel like "just checking email" eats hours',
  '- 💥 **Low dopamine** makes boring admin feel impossible',
  '- 🎧 **Digital overload** (notifications, pop-ups, hyperlinks) overwhelms your focus',
  '- 🧠 **Perfectionism and shame** keep you stuck in avoidance'
]
WHERE loop_name = 'Email Overwhelm';

-- Perfectionism Cycles
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Avoid starting because you can''t do it "right"',
  '- Spend hours perfecting something simple',
  '- Keep tweaking instead of finishing',
  '- Trash what you started because it''s not "good enough"',
  '- Feel shame for not living up to your potential',
  'Here''s what''s really going on:',
  '- 🎯 **All-or-nothing thinking** tells you if it''s not perfect, it''s worthless',
  '- 🧠 **Executive dysfunction** makes planning, prioritizing, and sequencing harder',
  '- 💥 **RSD and fear of judgment** make imperfection feel like failure',
  '- ⏳ **Time blindness** leads to underestimating how long perfectionist spirals take',
  '- 🔄 **Working memory gaps** make it hard to remember what matters and what''s "extra"',
  '- 💭 **Shame and overcompensation** fuel impossible expectations'
]
WHERE loop_name = 'Perfectionism Cycles';

-- Workout Avoidance
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Feel paralyzed even though you want to move',
  '- Plan to work out… then never start',
  '- Get overwhelmed by too many choices (what to wear, what to do, where to go)',
  '- Avoid the gym because it feels overstimulating or judgmental',
  '- Say "I''ll go later", and suddenly it''s tomorrow',
  '- Skip it entirely because your sports bra is uncomfortable or your leggings feel wrong',
  'Here''s what''s really going on:',
  '- 🧩 **Executive dysfunction** makes task initiation and sequencing hard',
  '- 💥 **Low dopamine** means movement won''t feel rewarding until after you do it',
  '- 🔁 **Shame or avoidance loop** keeps you stuck, especially if exercise feels like punishment',
  '- 🧠 **All-or-nothing thinking** says if you can''t do a full workout, it''s not worth starting',
  '- 🎭 **Sensory issues** with clothing, noise, or environment make movement feel unsafe'
]
WHERE loop_name = 'Workout Avoidance';

-- Job Search
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Feel dread every time you think about applying',
  '- Open a job posting and immediately feel overwhelmed',
  '- Rewrite your resume 37 times and never send it',
  '- Struggle with imposter syndrome or Rejection Sensitive Dysphoria (RSD)',
  '- Ghost your inbox after one rejection',
  'Here''s what''s really going on:',
  '- 🧩 **Executive dysfunction** makes planning, sequencing, and task initiation difficult',
  '- ⏰ **Time blindness** causes missed deadlines and unrealistic estimates',
  '- 🔁 **Procrastination** and shame trap you in avoidance',
  '- 💥 **Emotional dysregulation** and RSD make feedback feel painful or unbearable'
]
WHERE loop_name = 'Job Searching';

-- Phone Scrolling
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Pick up your phone to check the weather and find yourself on Instagram 20 minutes later',
  '- Intend to text someone back, but forget what you were doing mid-scroll',
  '- Feel pulled to check your phone constantly, even during other tasks',
  '- Struggle to stop scrolling at night, even when you''re tired',
  '- Feel overstimulated but can''t look away',
  'Here''s what''s really going on:',
  '- 🧠 **Executive dysfunction** makes it hard to resist impulse use and disengage',
  '- 📱 **Hyperfocus** on your phone means losing track of time entirely'
]
WHERE loop_name = 'Phone Scrolling';

-- Rejection Sensitivity Loops (RSD)
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Spiral after a text or a vague look',
  '- Assume someone''s silence means they hate you',
  '- Rehearse arguments that never happened',
  '- Withdraw or lash out to avoid being hurt',
  '- Feel stuck and unmotivated after rejection',
  '- Say yes to everything to avoid disapproval',
  'Here''s what''s really going on:',
  '- 💥 **Rejection Sensitive Dysphoria** triggers real emotional pain, like a punch to your nervous system',
  '- 🔁 **Negative self-talk** creates loops of "I''m too much," "I''m unlovable," "I always mess this up"',
  '- 🧠 **Working memory overload** means spirals crowd out action or focus'
]
WHERE loop_name = 'Rejection Sensitivity Loops';

-- Friendships & ADHD
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Forget to reply or check in even when you really care',
  '- Feel intense shame after minor conflicts or misunderstandings',
  '- Get overwhelmed by social energy and avoid making plans',
  '- Struggle to keep up with group chats, birthdays, or text threads',
  '- Hyperfocus on one person, then unintentionally go silent',
  'Here''s what''s really going on:',
  '- 🧩 **Executive dysfunction** affects memory, follow-through, and social routines',
  '- ⏰ **Time blindness** makes it hard to track how long it''s been since you last reached out',
  '- 🔁 **Shame or avoidance loop** from past social "failures" leads to masking or withdrawing',
  '- 💥 **Dopamine seeking** might lead to impulsive over-sharing, or conversely, ghosting during burnout'
]
WHERE loop_name = 'Friendships & ADHD';

-- People-Pleasing Burnout
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Say yes to things you don''t have time or energy for',
  '- Feel panic or guilt at the thought of disappointing someone',
  '- Overwork yourself to "make up" for your ADHD',
  '- Crash hard after doing too much for others',
  '- Feel resentment but say nothing, then spiral',
  'Here''s what''s really going on:',
  '- ⚡ **Impulsivity** leads to fast yeses before checking your bandwidth',
  '- 🧠 **Executive dysfunction** makes it hard to see how full your plate already is',
  '- 🔁 **Low self-worth** drives the belief you need to earn approval through service'
]
WHERE loop_name = 'People-Pleasing Burnout';

-- Last-Minute Cancelling
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Genuinely want to go… until the moment arrives',
  '- Say yes out of guilt, pressure, or impulsivity',
  '- Forget how much energy the thing would actually take',
  '- Realize too late that you''re already maxed out',
  '- Feel shame and avoid the conversation entirely',
  'Here''s what''s really going on:',
  '- ⚡ **Impulsivity** says yes before checking your real capacity',
  '- 🧠 **Working memory** forgets you already have 3 other things that day',
  '- 💥 **Overwhelm** + masking all week = social battery drained at go-time'
]
WHERE loop_name = 'Last-Minute Cancelling';

-- Difficult Conversations
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Avoid conversations because you''re afraid of conflict or rejection',
  '- Struggle to explain your thoughts clearly, especially under stress',
  '- Say too much, too fast, or blurt things out impulsively',
  '- Overprepare and still feel like you messed it up',
  '- Replay conversations for days, stuck in a shame spiral',
  'Here''s what''s really going on:',
  '- 💥 **Emotional dysregulation** makes rejection or tension feel physically painful',
  '- 🔁 **RSD (Rejection Sensitive Dysphoria)** leads to panic over real or imagined criticism',
  '- 🧠 **Mental "noise" and distractibility** can make it hard to follow or finish your thoughts',
  '- 🚀 **Impulsivity** leads to talking too much, interrupting, or going off-track',
  '- 🎯 **Perfectionism and shame** make you fear saying the wrong thing',
  '- 💭 **Verbal processing** means you might not know what you think until you''re already talking'
]
WHERE loop_name = 'Difficult Conversations';

-- Chronic Lateness
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Leave the house in a frenzy even though you knew you had somewhere to be',
  '- Think you have "plenty of time," then somehow still run late',
  '- Always try to squeeze in one more thing before leaving',
  '- Miss appointments, buses, or meetings and feel terrible about it',
  '- Underestimate how long getting ready or transitioning takes',
  'Here''s what''s really going on:',
  '- 🎯 **Executive dysfunction** interferes with planning, prioritizing, and starting on time'
]
WHERE loop_name = 'Chronic Lateness';

-- Masking Exhaustion
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Feel like you''re "acting" all day to keep up',
  '- Over-prepare, overthink, and overcommit',
  '- Say yes when you''re already burned out',
  '- Hide your struggles to avoid judgment',
  '- Crumble when you''re finally alone',
  'Here''s what''s really going on:',
  '- 🎭 **Masking** is a constant performance, it burns through energy fast',
  '- 🧠 **Working memory gaps** mean you''re mentally juggling "scripts" and real life'
]
WHERE loop_name = 'Masking Exhaustion';

-- Missed Appointments
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Book an appointment and instantly forget about it',
  '- Underestimate how long it takes to get ready or get there',
  '- Get distracted or sucked into something else',
  '- Hit "just one more thing" mode and run out of time',
  '- Avoid rescheduling because you feel ashamed',
  'Here''s what''s really going on:',
  '- 🧠 **Working memory** drops info unless it''s constantly visible',
  '- 💥 **Impulsivity and distraction** lead to losing track of the day',
  '- 🔄 **Transition struggles** mean shifting from one task to another can derail follow-through'
]
WHERE loop_name = 'Missed Appointments';

-- Online Shopping
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Open Amazon to buy one thing and end up with 7',
  '- Get overwhelmed and abandon your cart entirely',
  '- Add something impulsively and forget what you needed',
  '- Forget to track orders or return packages',
  '- Feel guilty or ashamed after clicking "Buy Now"',
  'Here''s what''s really going on:',
  '- 🧠 **Impulsivity** and instant dopamine make fast purchases extra tempting'
]
WHERE loop_name = 'Online Shopping';

-- Overeating
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Skip meals all day and binge late at night',
  '- Eat out of boredom or overwhelm',
  '- Struggle to stop even when full',
  '- Crave sugar or carbs constantly',
  '- Feel ashamed or out of control',
  'Here''s what''s really going on:',
  '- ⚡ **Impulsivity** overrides the pause between urge and action'
]
WHERE loop_name = 'Overeating';

-- Replying to Texts
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- See a message, mentally draft a reply, then forget to send it',
  '- Feel frozen when someone sends a long or emotional message',
  '- Mean to respond later and then forget entirely',
  '- Feel guilt or shame about how long it''s been since you replied',
  '- Want to say something thoughtful but can''t find the words',
  'Here''s what''s really going on:',
  '- ⏰ **Time blindness** causes you to lose track of how long it''s been'
]
WHERE loop_name = 'Replying to Texts';

-- Intimacy & Connection
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Crave connection but feel overwhelmed when someone gets close',
  '- Panic after a small disagreement, fearing the relationship is over',
  '- Get so caught up in your own thoughts or tasks that you forget to check in',
  '- Overshare or struggle with boundaries, then feel shame or regret',
  '- Say yes when you mean no, then feel resentful or overstimulated',
  'Here''s what''s really going on:',
  '- 🔁 **Working memory** issues make follow-through and consistency hard',
  '- 💥 **Emotional dysregulation** causes quick shifts in mood and reactions',
  '- 🎭 **Masking** and people-pleasing create internal tension',
  '- ⏰ **Time blindness** makes it easy to miss special dates or forget to check in'
]
WHERE loop_name = 'Intimacy & Connection';

-- ADHD & Social Media
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Scroll for hours and forget why you picked up your phone',
  '- Feel drained or overstimulated after opening your apps',
  '- Compare yourself to others and spiral into self-doubt',
  '- Overshare or feel regret after posting impulsively',
  '- Lose track of time and delay tasks or bedtime',
  'Here''s what''s really going on:',
  '- 🎯 **Dopamine-seeking:** ADHD brains crave stimulation, social media delivers it fast and endlessly',
  '- ⚡ **Impulsivity** makes it hard to pause before clicking, posting, or reacting',
  '- ⏳ **Time blindness** distorts how long you''ve been scrolling',
  '- 🧠 **Working memory lapses** cause you to forget why you opened the app',
  '- 🌪️ **Emotional dysregulation** turns comparisons into spirals',
  '- 🔊 **Sensory overload** from nonstop input tires out your nervous system'
]
WHERE loop_name = 'ADHD & Social Media';

-- Can't Fall Asleep
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Lie awake with racing thoughts that won''t quiet',
  '- Feel physically tired but mentally wired',
  '- Get frustrated and check your phone, making it worse',
  '- Worry about tomorrow or replay today over and over',
  '- Feel like your brain "turns on" right when you want to sleep',
  'Here''s what''s really going on:',
  '- 🧠 **Racing thoughts** and hyperactivity peak when you try to wind down',
  '- 💥 **Emotional dysregulation** makes worries feel bigger at night',
  '- 🎢 **Dopamine dysregulation** keeps your brain seeking stimulation',
  '- 🌙 **Circadian rhythm disruption** from ADHD affects natural sleep patterns'
]
WHERE loop_name = 'Can''t Fall Asleep';

-- Constantly Tired
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Feel exhausted even after sleeping',
  '- Need caffeine just to function at baseline',
  '- Feel drained from everyday tasks that seem easy for others',
  '- Crash in the afternoon no matter what you do',
  '- Sleep a lot but never feel rested',
  'Here''s what''s really going on:',
  '- 🎭 **Masking** and constant self-regulation burn through mental energy fast',
  '- 🧠 **Executive dysfunction** makes routine tasks require more cognitive effort',
  '- 💤 **Sleep quality issues** mean you''re not getting restorative rest',
  '- ⚡ **Emotional dysregulation** creates chronic stress on your nervous system'
]
WHERE loop_name = 'Constantly Tired';

-- Decision Overwhelm
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Freeze when faced with too many choices',
  '- Spend hours researching options and still feel stuck',
  '- Avoid making decisions until the last possible moment',
  '- Change your mind repeatedly once you''ve decided',
  '- Feel paralyzed by "what if" scenarios',
  'Here''s what''s really going on:',
  '- 🧩 **Executive dysfunction** makes weighing options and prioritizing difficult',
  '- 🧠 **Working memory limits** get overloaded by too much information',
  '- 💥 **Perfectionism and RSD** make the "wrong" choice feel catastrophic',
  '- ⏰ **Time blindness** makes urgent decisions feel endless'
]
WHERE loop_name = 'Decision Overwhelm';

-- Double-Booking Yourself
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Say yes to multiple things on the same day without checking',
  '- Forget you already have plans when something fun comes up',
  '- Underestimate how long events will take',
  '- Feel overwhelmed when you realize you''re overcommitted',
  '- Cancel on people last minute because you''re stretched too thin',
  'Here''s what''s really going on:',
  '- ⚡ **Impulsivity** leads to saying yes before checking your schedule',
  '- 🧠 **Working memory** forgets existing commitments when new opportunities arise',
  '- ⏰ **Time blindness** makes it hard to estimate how long things actually take',
  '- 🎢 **Dopamine-seeking** makes new, exciting plans irresistible'
]
WHERE loop_name = 'Double-Booking Yourself';

-- Sleeping Through Alarms
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Hit snooze 6 times and not remember',
  '- Sleep through the loudest alarm',
  '- Set 5 alarms but wake up late anyway',
  '- Wake up foggy, cranky, or disoriented',
  '- Stay up way too late even when tired',
  '- Feel groggy no matter how long you slept',
  'Here''s what''s really going on:',
  '- 🌙 **Circadian rhythm disruption** makes your natural sleep-wake cycle irregular',
  '- 💤 **Sleep inertia** from poor sleep quality makes waking up extra difficult',
  '- 🧠 **Executive dysfunction** impairs the decision-making needed to get out of bed',
  '- ⏰ **Time blindness** distorts your sense of urgency in the morning'
]
WHERE loop_name = 'Sleeping Through Alarms';

-- Undereating
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Forget to eat until you''re dizzy, shaky, or irritable',
  '- Feel "too busy" or overwhelmed to bother with food',
  '- Eat one small meal and realize it was your only one all day',
  '- Get grossed out by textures, smells, or the idea of food altogether',
  'Here''s what''s really going on:',
  '- 🎯 **Hyperfocus** makes you lose track of hunger cues and time',
  '- 🧠 **Executive dysfunction** makes meal planning and preparation feel overwhelming',
  '- 🎭 **Sensory sensitivities** can make food textures, smells, or tastes unbearable',
  '- 💥 **Stimulant medication** can suppress appetite as a side effect'
]
WHERE loop_name = 'Undereating';

-- Encouragement to Take With You (if this exists as a content page)
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  'You might:',
  '- Feel like you''re failing even when you''re trying hard',
  '- Compare yourself to neurotypical standards and feel "broken"',
  '- Forget your wins and focus only on what''s not working',
  '- Feel like you should be "over" your ADHD struggles by now',
  '- Question whether you''re just making excuses',
  'Here''s what''s really going on:',
  '- 💭 **Internalized ableism** makes you judge yourself by neurotypical standards',
  '- 🧠 **Negativity bias** causes your brain to focus more on problems than progress',
  '- 💥 **RSD and shame** amplify self-criticism and minimize achievements',
  '- 🎯 **All-or-nothing thinking** makes small setbacks feel like total failures'
]
WHERE loop_name = 'Encouragement to Take With You';

-- Verify the updates worked
SELECT loop_name, array_length(adhd_reasons, 1) as reason_count 
FROM complex_loops_content 
WHERE adhd_reasons IS NOT NULL
ORDER BY loop_name;