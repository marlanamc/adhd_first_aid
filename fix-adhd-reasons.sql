-- Fix corrupted ADHD reasons for complex loops
-- Run this in Supabase SQL Editor

-- Analysis Paralysis
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🧩 **Executive dysfunction** makes it hard to plan, prioritize, and act',
  '⏰ **Time blindness** warps urgency, making decisions feel endless', 
  '💥 **Low dopamine** leads to shutdown when there''s no clear reward',
  '🔁 **Shame or avoidance loop** keeps you stuck in research mode',
  '🧠 **Working memory limits** mean juggling options overloads your brain'
]
WHERE loop_name = 'Analysis Paralysis';

-- Bedtime Procrastination
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '📱 **Hyperfocus** keeps you locked in and unable to disengage',
  '🧠 **Racing thoughts** ramp up just when you try to wind down'
]
WHERE loop_name = 'Bedtime Procrastination';

-- Chronic Lateness
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🎯 **Executive dysfunction** interferes with planning, prioritizing, and starting on time'
]
WHERE loop_name = 'Chronic Lateness';

-- Difficult Conversations
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '💥 **Emotional dysregulation** makes rejection or tension feel physically painful',
  '🔁 **RSD (Rejection Sensitive Dysphoria)** leads to panic over real or imagined criticism',
  '🧠 **Mental "noise" and distractibility** can make it hard to follow or finish your thoughts',
  '🎯 **Perfectionism and shame** make you fear saying the wrong thing'
]
WHERE loop_name = 'Difficult Conversations';

-- Email Overwhelm  
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🧩 **Executive dysfunction** makes sorting, prioritizing, and follow-through difficult',
  '🔁 **Working memory issues** cause you to forget why you opened a message',
  '⏰ **Time blindness** makes it feel like "just checking email" eats hours',
  '💥 **Low dopamine** makes boring admin feel impossible',
  '🧠 **Perfectionism and shame** keep you stuck in avoidance'
]
WHERE loop_name = 'Email Overwhelm';

-- Friendships
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🧩 **Executive dysfunction** affects memory, follow-through, and social routines',
  '⏰ **Time blindness** makes it hard to track how long it''s been since you last reached out',
  '🔁 **Shame or avoidance loop** from past social "failures" leads to masking or withdrawing',
  '💥 **Dopamine seeking** might lead to impulsive over-sharing, or conversely, ghosting during burnout'
]
WHERE loop_name = 'Friendships';

-- Intimacy
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🔁 **Working memory** issues make follow-through and consistency hard',
  '💥 **Emotional dysregulation** causes quick shifts in mood and reactions',
  '🎭 **Masking** and people-pleasing create internal tension',
  '⏰ **Time blindness** makes it easy to miss special dates or forget to check in'
]
WHERE loop_name = 'Intimacy';

-- Job Search  
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🧩 **Executive dysfunction** makes planning, sequencing, and task initiation difficult',
  '⏰ **Time blindness** causes missed deadlines and unrealistic estimates',
  '🔁 **Procrastination** and shame trap you in avoidance',
  '💥 **Emotional dysregulation** and RSD make feedback feel painful or unbearable'
]
WHERE loop_name = 'Job Searching';

-- Last Min Cancelling
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '⚡ **Impulsivity** says yes before checking your real capacity',
  '🧠 **Working memory** forgets you already have 3 other things that day',
  '💥 **Overwhelm** + masking all week = social battery drained at go-time'
]
WHERE loop_name = 'Last Min Cancelling';

-- Masking Exhaustion
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🎭 **Masking** is a constant performance, it burns through energy fast',
  '🧠 **Working memory gaps** mean you''re mentally juggling "scripts" and real life'
]
WHERE loop_name = 'Masking Exhaustion';

-- Missed Appointments
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🧠 **Working memory** drops info unless it''s constantly visible',
  '💥 **Impulsivity and distraction** lead to losing track of the day',
  '🔄 **Transition struggles** mean shifting from one task to another can derail follow-through'
]
WHERE loop_name = 'Missed Appointments';

-- Online Shopping
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🧠 **Impulsivity** and instant dopamine make fast purchases extra tempting'
]
WHERE loop_name = 'Online Shopping';

-- Overeating
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '⚡ **Impulsivity** overrides the pause between urge and action'
]
WHERE loop_name = 'Overeating';

-- People Pleasing Burnout
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '⚡ **Impulsivity** leads to fast yeses before checking your bandwidth',
  '🧠 **Executive dysfunction** makes it hard to see how full your plate already is',
  '🔁 **Low self-worth** drives the belief you need to earn approval through service'
]
WHERE loop_name = 'People Pleasing Burnout';

-- Perfectionism Cycles
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🎯 **All-or-nothing thinking** tells you if it''s not perfect, it''s worthless',
  '🧠 **Executive dysfunction** makes planning, prioritizing, and sequencing harder',
  '💥 **RSD and fear of judgment** make imperfection feel like failure',
  '🔄 **Working memory gaps** make it hard to remember what matters and what''s "extra"'
]
WHERE loop_name = 'Perfectionism Cycles';

-- Phone Scrolling
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🧠 **Executive dysfunction** makes it hard to resist impulse use and disengage',
  '📱 **Hyperfocus** on your phone means losing track of time entirely'
]
WHERE loop_name = 'Phone Scrolling';

-- RSD Loops
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '💥 **Rejection Sensitive Dysphoria** triggers real emotional pain, like a punch to your nervous system',
  '🔁 **Negative self-talk** creates loops of "I''m too much," "I''m unlovable," "I always mess this up"',
  '🧠 **Working memory overload** means spirals crowd out action or focus'
]
WHERE loop_name = 'RSD Loops';

-- Text Message Avoidance
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '⏰ **Time blindness** causes you to lose track of how long it''s been'
]
WHERE loop_name = 'Text Message Avoidance';

-- Waiting Mode
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '⏰ **Time blindness** makes it hard to visualize the day as a timeline',
  '🔁 **Transition difficulties** make shifting in and out of tasks exhausting',
  '🧠 **Working memory** can''t hold plans and steps while a future event looms',
  '💥 **Fear of lateness or hyperfocus** keeps you from committing to anything'
]
WHERE loop_name = 'Waiting Mode';

-- Workout Avoidance
UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  '🧩 **Executive dysfunction** makes task initiation and sequencing hard',
  '💥 **Low dopamine** means movement won''t feel rewarding until after you do it',
  '🔁 **Shame or avoidance loop** keeps you stuck, especially if exercise feels like punishment',
  '🧠 **All-or-nothing thinking** says if you can''t do a full workout, it''s not worth starting',
  '🎭 **Sensory issues** with clothing, noise, or environment make movement feel unsafe'
]
WHERE loop_name = 'Workout Avoidance';

-- Verify the updates
SELECT loop_name, array_length(adhd_reasons, 1) as reason_count 
FROM complex_loops_content 
ORDER BY loop_name;