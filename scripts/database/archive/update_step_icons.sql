-- Update step section icons to use Lucide icons instead of emojis

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