import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Correct mappings from src/app/feelings/page.tsx
const correctMappings = {
  'Anxious': 'Activity',        // lines 46 - Currently: Zap, Should be: Activity
  'Ashamed': 'Frown',          // lines 36 - Currently: Heart, Should be: Frown  
  'Burned Out': 'Flame',       // lines 34 - Currently: Flame (✓ correct)
  'Drained': 'Battery',        // lines 33 - Currently: Battery (✓ correct)
  'Forgetful': 'Brain',        // lines 27 - Currently: Brain (✓ correct)
  'Frustrated': 'ZapOff',      // lines 37 - Currently: AlertTriangle, Should be: ZapOff
  'Guilty': 'EyeOff',          // lines 40 - Currently: Scale, Should be: EyeOff
  'Hopeless': 'UserMinus',     // lines 42 - Currently: Sun, Should be: UserMinus
  'Lonely': 'UserCircle',      // lines 52 - Currently: Users, Should be: UserCircle
  'Mental Fog': 'CloudDrizzle', // lines 25 - Currently: Cloud, Should be: CloudDrizzle
  'Misunderstood': 'Users',    // lines 53 - Currently: Eye, Should be: Users
  'Numb': 'Skull',            // lines 35 - Currently: Shield, Should be: Skull
  'Overstimulated': 'Sparkles', // lines 29 - Currently: VolumeX, Should be: Sparkles
  'Overwhelmed': 'Waves',      // lines 26 - Currently: Waves (✓ correct)
  'Rejected': 'UserX',         // lines 54 - Currently: UserX (✓ correct)
  'Restless': 'ArrowLeftRight', // lines 47 - Currently: Move, Should be: ArrowLeftRight
  'Scattered': 'CloudLightning', // lines 28 - Currently: Shuffle, Should be: CloudLightning
  'Stressed': 'Zap',          // lines 43 - Currently: Gauge, Should be: Zap
  'Stuck': 'LockKeyhole',     // lines 32 - Currently: Lock, Should be: LockKeyhole
  'Defeated': 'CloudRain',    // lines 41 - Currently: Mountain, Should be: CloudRain
  'Wired': 'Zap',            // lines 48 - Currently: Wifi, Should be: Zap
  'Tense': 'Scissors'         // lines 49 - Currently: Muscle, Should be: Scissors
};

async function generateSQLScript() {
  console.log('🔍 CHECKING CURRENT CRISIS MODE ICONS');
  console.log('====================================');
  
  // Get current mappings from database
  const { data: currentData, error } = await supabase
    .from('crisis_mode_feelings')
    .select('feeling_name, icon')
    .order('feeling_name');
    
  if (error) {
    console.error('❌ Error fetching current data:', error);
    return;
  }
  
  if (!currentData) {
    console.error('❌ No data found');
    return;
  }
  
  console.log('\n📊 ICON MAPPING COMPARISON');
  console.log('==========================\n');
  
  const sqlUpdates: string[] = [];
  let changesNeeded = 0;
  
  currentData.forEach(({ feeling_name, icon: currentIcon }) => {
    const correctIcon = correctMappings[feeling_name as keyof typeof correctMappings];
    
    if (!correctIcon) {
      console.log(`⚠️  ${feeling_name}: No mapping found (current: ${currentIcon})`);
      return;
    }
    
    const needsUpdate = currentIcon !== correctIcon;
    
    if (needsUpdate) {
      changesNeeded++;
      console.log(`❌ ${feeling_name}: ${currentIcon} → ${correctIcon}`);
      sqlUpdates.push(`UPDATE crisis_mode_feelings SET icon = '${correctIcon}' WHERE feeling_name = '${feeling_name}';`);
    } else {
      console.log(`✅ ${feeling_name}: ${currentIcon} (correct)`);
    }
  });
  
  console.log(`\n📊 Summary: ${changesNeeded} changes needed out of ${currentData.length} total feelings\n`);
  
  if (sqlUpdates.length > 0) {
    console.log('🛠️  SQL UPDATE SCRIPT:');
    console.log('======================\n');
    console.log('-- Update crisis mode icons to match feelings page mappings');
    sqlUpdates.forEach(sql => console.log(sql));
    console.log('\n-- Verify the updates');
    console.log('SELECT feeling_name, icon FROM crisis_mode_feelings ORDER BY feeling_name;\n');
    
    // Write SQL script to file
    const sqlContent = `-- Update crisis mode icons to match feelings page mappings
-- Generated on ${new Date().toISOString()}

${sqlUpdates.join('\n')}

-- Verify the updates
SELECT feeling_name, icon FROM crisis_mode_feelings ORDER BY feeling_name;
`;
    
    console.log('📝 SQL script has been generated. You can run it manually in Supabase.');
    return sqlContent;
    
  } else {
    console.log('✅ All icons are already correctly mapped!');
    return null;
  }
}

generateSQLScript().catch(console.error);