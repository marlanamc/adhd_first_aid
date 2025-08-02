-- Update all intro paragraphs with new condensed markdown versions
-- Replacing em dashes with commas as requested

-- Update Anxious
UPDATE feelings_content 
SET intro_paragraph = 'Anxiety hits differently with ADHD. That **tight chest, spinning mind, and urgency**? It''s **fear speaking, not facts**. Your brain is trying to protect you from **threats that may not even exist**, but that doesn''t make the feeling **less real or valid**.'
WHERE feeling_name = 'Anxious';

-- Update Overwhelmed
UPDATE feelings_content 
SET intro_paragraph = 'Being overwhelmed with ADHD isn''t just being busy , it''s **paralysis**. Your brain tries to juggle **too many tasks, emotions and options** at once and **short‑circuits**. You''re not behind; you''re **overloaded**, and that''s why even simple things feel impossible.'
WHERE feeling_name = 'Overwhelmed';

-- Update Mental Fog
UPDATE feelings_content 
SET intro_paragraph = 'ADHD mental fog isn''t mere distraction; it''s a **full‑brain shutdown**. Your thoughts feel **heavy and blank**, and nothing sticks. This fog often follows **overstimulation, exhaustion or depletion**, and it''s about **capacity**, not effort.'
WHERE feeling_name = 'Mental Fog';

-- Update Frustrated
UPDATE feelings_content 
SET intro_paragraph = 'Frustration shows up when you **know what to do but can''t do it**, or when problems pile up all at once. In ADHD, obstacles compound until your emotional dam bursts. You''re not dramatic; you''re **exhausted and stuck**.'
WHERE feeling_name = 'Frustrated';

-- Update Defeated
UPDATE feelings_content 
SET intro_paragraph = 'Feeling defeated with ADHD comes from the **cumulative weight of unmet effort and friction**. Everyday tasks can feel like battles, and your results never seem to match your effort. You''re not weak; you''re just **tired of fighting your own brain**.'
WHERE feeling_name = 'Defeated';

-- Update Burned Out
UPDATE feelings_content 
SET intro_paragraph = 'ADHD burnout often looks like **running on fumes** instead of collapsing. You push, mask and overdo to meet standards that weren''t built for your brain until you **crash**. Feeling one missed task from disaster isn''t weakness , it''s **burnout**.'
WHERE feeling_name = 'Burned Out';

-- Update Forgetful
UPDATE feelings_content 
SET intro_paragraph = 'Forgetfulness in ADHD isn''t carelessness; it''s a **working‑memory overload**. With **too many tabs open**, new information pushes out other details. Remembering random facts but forgetting lunch is a **brain difference**, not a flaw.'
WHERE feeling_name = 'Forgetful';

-- Update Scattered
UPDATE feelings_content 
SET intro_paragraph = 'Feeling scattered comes from having a brain that **sees everything at once** and struggles to filter what''s important. Your attention jumps because your mind is built for **expansive awareness**. Harnessing that awareness is the challenge.'
WHERE feeling_name = 'Scattered';

-- Update Overstimulated
UPDATE feelings_content 
SET intro_paragraph = 'Overstimulation happens when your **nervous system** is flooded with too much input. Sounds seem louder, lights brighter, emotions stronger, because your brain''s **filter** lets everything through. This isn''t drama; it''s your **neurodivergent system** responding to overload.'
WHERE feeling_name = 'Overstimulated';

-- Update Stuck
UPDATE feelings_content 
SET intro_paragraph = 'Being stuck with ADHD isn''t laziness; it''s **executive dysfunction**. You know what to do and want to do it, but your brain''s **start button** won''t engage , like a car with a dead battery. It isn''t a moral failure.'
WHERE feeling_name = 'Stuck';

-- Update Drained
UPDATE feelings_content 
SET intro_paragraph = 'Feeling drained with ADHD isn''t simple tiredness , it''s **deep exhaustion** from constantly managing your brain, masking and overexerting on tasks others find easy. Your battery has been **running on reserve**, and depletion isn''t laziness.'
WHERE feeling_name = 'Drained';

-- Update Numb
UPDATE feelings_content 
SET intro_paragraph = 'Emotional numbness is your brain''s **circuit breaker** after intense feelings or overstimulation. You feel **disconnected** not because you''re broken, but because your nervous system needs a **protective break**.'
WHERE feeling_name = 'Numb';

-- Update Ashamed
UPDATE feelings_content 
SET intro_paragraph = 'Shame with ADHD starts early and gets reinforced. You''ve been criticized for traits that are **neurological differences**, not flaws. Shame insists **"you are the problem,"** but your worth isn''t defined by how well you fit neurotypical expectations.'
WHERE feeling_name = 'Ashamed';

-- Update Guilty
UPDATE feelings_content 
SET intro_paragraph = 'Guilt arises from the **gap between intention and impact**. You care, but forgetfulness or disorganization leads to broken promises. Holding on to guilt doesn''t help; it often worsens your **executive function**.'
WHERE feeling_name = 'Guilty';

-- Update Hopeless
UPDATE feelings_content 
SET intro_paragraph = 'Hopelessness grows from **years of failed strategies** and feeling perpetually behind. It''s the fatigue of always battling your brain. Yet hopelessness is just a **feeling**, not a fact; change is possible with the right support.'
WHERE feeling_name = 'Hopeless';

-- Update Stressed
UPDATE feelings_content 
SET intro_paragraph = 'Stress with ADHD is amplified: your **nervous system overreacts**, executive function falters under pressure, and multiple demands quickly become overwhelming. What others manage can feel **crushing** when you''re juggling ADHD symptoms and intense emotions.'
WHERE feeling_name = 'Stressed';

-- Update Restless
UPDATE feelings_content 
SET intro_paragraph = 'Restlessness is your nervous system seeking **stimulation**. Understimulation or excess energy makes you fidgety, especially when environments demand stillness. It''s not misbehavior; it''s your **neurodivergent system** regulating itself.'
WHERE feeling_name = 'Restless';

-- Update Wired
UPDATE feelings_content 
SET intro_paragraph = 'Feeling wired is your brain''s **engine revving at full speed**. You have **excess energy and racing thoughts** , whether from medication, excitement or natural intensity. It isn''t bad, but it can be **overwhelming** and hard to channel.'
WHERE feeling_name = 'Wired';

-- Update Tense
UPDATE feelings_content 
SET intro_paragraph = 'Tension stems from a **nervous system stuck in alert mode** , overstimulation, stress or RSD leaves your body **tight and clenched**. It''s not simply stress; it''s your **neurodivergent body** reacting to overload.'
WHERE feeling_name = 'Tense';

-- Update Lonely
UPDATE feelings_content 
SET intro_paragraph = 'Loneliness isn''t just being alone , it''s **craving connection** but finding social situations draining. Masking your traits or missing cues leaves you feeling **unseen and misunderstood**. It''s about hiding parts of yourself.'
WHERE feeling_name = 'Lonely';

-- Update Misunderstood
UPDATE feelings_content 
SET intro_paragraph = 'Feeling misunderstood stems from **invisible struggles**. Others may label you lazy or dramatic when you''re fighting **executive dysfunction or RSD**. The gap between your inner reality and others'' perceptions creates **isolation**.'
WHERE feeling_name = 'Misunderstood';

-- Update Rejected
UPDATE feelings_content 
SET intro_paragraph = 'Rejection with ADHD activates **Rejection Sensitive Dysphoria**,criticism or exclusion feels like **intense emotional pain**. Your nervous system responds as if survival is threatened. It''s not oversensitivity; the pain is neurologically real.'
WHERE feeling_name = 'Rejected';

-- Verify the updates
SELECT feeling_name, intro_paragraph FROM feelings_content ORDER BY feeling_name;