-- Update step section intros to remove redundant first lines

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