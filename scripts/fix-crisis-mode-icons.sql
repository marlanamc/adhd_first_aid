-- Update crisis mode icons to match feelings page mappings
-- Generated on 2025-08-16
-- This fixes 17 out of 22 crisis mode icons to match the correct mappings from src/app/feelings/page.tsx

-- Key fixes:
-- • Anxious: Zap → Activity (as mentioned in the issue)
-- • Mental Fog: Cloud → CloudDrizzle  
-- • Scattered: Shuffle → CloudLightning
-- • Overstimulated: VolumeX → Sparkles
-- • And 13 others...

UPDATE crisis_mode_feelings SET icon = 'Activity' WHERE feeling_name = 'Anxious';
UPDATE crisis_mode_feelings SET icon = 'Frown' WHERE feeling_name = 'Ashamed';
UPDATE crisis_mode_feelings SET icon = 'CloudRain' WHERE feeling_name = 'Defeated';
UPDATE crisis_mode_feelings SET icon = 'ZapOff' WHERE feeling_name = 'Frustrated';
UPDATE crisis_mode_feelings SET icon = 'EyeOff' WHERE feeling_name = 'Guilty';
UPDATE crisis_mode_feelings SET icon = 'UserMinus' WHERE feeling_name = 'Hopeless';
UPDATE crisis_mode_feelings SET icon = 'UserCircle' WHERE feeling_name = 'Lonely';
UPDATE crisis_mode_feelings SET icon = 'CloudDrizzle' WHERE feeling_name = 'Mental Fog';
UPDATE crisis_mode_feelings SET icon = 'Users' WHERE feeling_name = 'Misunderstood';
UPDATE crisis_mode_feelings SET icon = 'Skull' WHERE feeling_name = 'Numb';
UPDATE crisis_mode_feelings SET icon = 'Sparkles' WHERE feeling_name = 'Overstimulated';
UPDATE crisis_mode_feelings SET icon = 'ArrowLeftRight' WHERE feeling_name = 'Restless';
UPDATE crisis_mode_feelings SET icon = 'CloudLightning' WHERE feeling_name = 'Scattered';
UPDATE crisis_mode_feelings SET icon = 'Zap' WHERE feeling_name = 'Stressed';
UPDATE crisis_mode_feelings SET icon = 'LockKeyhole' WHERE feeling_name = 'Stuck';
UPDATE crisis_mode_feelings SET icon = 'Scissors' WHERE feeling_name = 'Tense';
UPDATE crisis_mode_feelings SET icon = 'Zap' WHERE feeling_name = 'Wired';

-- Verify the updates
SELECT feeling_name, icon FROM crisis_mode_feelings ORDER BY feeling_name;