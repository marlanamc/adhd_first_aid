const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Better icon mappings for inappropriate strategy icons
const iconUpdates = {
  'Zig-Zag Productivity': 'trending-up', // Represents variable/zigzag productivity patterns
  'Vitamin D Supplements': 'sun', // Sun represents vitamin D source
  'Voice Memos': 'mic', // Microphone for voice recording
  'Visual Task Board': 'kanban-square', // Kanban board for task management (if available, else 'layout')
  'Treat Yo Self - After doing something you really don\'t want to': 'gift', // Gift represents treating yourself
  'Workspace Lighting': 'lightbulb', // Light bulb for lighting
  'Visual Schedules': 'calendar', // Calendar for schedules
  'Towel Warmer Treat': 'thermometer', // Temperature/warmth representation
  'Verbal Processor': 'message-circle', // Speech bubble for verbal processing
  'Vent Space': 'wind', // Wind represents venting emotions
  'Velcroed Supply Stations': 'package', // Package for organized supplies
  'TickTick': 'check-square', // Check mark for task app
  'Time Containers': 'clock', // Clock for time management
  'Thought Capture Pad': 'edit-3', // Pen/writing for capturing thoughts
  'The Closing Ritual': 'power', // Power button for shutting down/closing
  'Task-Specific Playlists': 'headphones', // Headphones for music/playlists
  'Ta-Da List (Everything You\'ve Already Done Today)': 'check-circle', // Check circle for completed tasks
  'Survival Mode Productivity': 'shield', // Shield for survival/protection mode
  'Stress Action Plan - Why? What? When? (Be Realistic)': 'target', // Target for planning/strategy
  'Strategic Caffeine System': 'coffee', // Coffee cup for caffeine
  'Sticky Notes Everywhere': 'sticky-note', // Sticky note icon (if available, else 'square')
  'Switch it Up - Change Environment': 'shuffle', // Shuffle for changing/switching
  'Small Wins Trophy Shelf': 'trophy', // Trophy for achievements
  'Shower Toothbrush': 'sparkles', // Sparkles for cleanliness/hygiene
  'Set Realistic Expectations at Work': 'target', // Target for setting expectations
  'Strategic Saying No': 'x-circle', // X for saying no/boundaries
  'Shutting Up the Scumbag Brain': 'volume-x', // Muted volume for silencing negative thoughts
  'See-Through Success': 'eye', // Eye for visibility/seeing through
};

// Fallback icons in case primary choices aren't available
const fallbackIcons = {
  'kanban-square': 'layout',
  'sticky-note': 'square',
  'thermometer': 'sun',
  'edit-3': 'edit',
  'check-circle': 'check',
  'message-circle': 'message-square',
  'volume-x': 'volume-off',
  'x-circle': 'x',
  'check-square': 'check',
  'trending-up': 'arrow-up',
};

// Function to update strategy icons
async function updateIcons() {
  const strategies = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('/Users/marlanacreed/Downloads/Projects/adhd-first-aid-kit/Strategies_ADHDFriendly_complete_with_examples.csv')
      .pipe(csv())
      .on('data', (data) => {
        strategies.push(data);
      })
      .on('end', () => {
        console.log(`Updating icons for ${Object.keys(iconUpdates).length} strategies...`);
        
        let updatedCount = 0;
        
        // Update each strategy with better icons
        strategies.forEach((strategy) => {
          const strategyName = strategy.Name;
          
          if (iconUpdates[strategyName]) {
            const oldIcon = strategy.icon_file;
            const newIcon = iconUpdates[strategyName];
            
            strategy.icon_file = newIcon;
            updatedCount++;
            
            console.log(`✅ Updated "${strategyName}": ${oldIcon} → ${newIcon}`);
          }
        });
        
        console.log(`\n🎯 Updated ${updatedCount} strategy icons!`);
        
        // Write the updated CSV
        const csvWriter = createCsvWriter({
          path: '/Users/marlanacreed/Downloads/Projects/adhd-first-aid-kit/Strategies_ADHDFriendly_final_with_better_icons.csv',
          header: Object.keys(strategies[0]).map(key => ({ id: key, title: key }))
        });
        
        csvWriter.writeRecords(strategies)
          .then(() => {
            console.log('✅ All strategy icons updated!');
            console.log('Output file: Strategies_ADHDFriendly_final_with_better_icons.csv');
            
            // Show summary of changes
            console.log('\n📊 Icon Update Summary:');
            Object.entries(iconUpdates).forEach(([strategy, icon]) => {
              console.log(`  • ${strategy}: ${icon}`);
            });
            
            resolve();
          })
          .catch(reject);
      })
      .on('error', reject);
  });
}

// Additional function to check if we need to use fallback icons
function validateAndUseFallbacks() {
  console.log('\n💡 Icon Mapping Logic:');
  console.log('Primary choices with fallbacks if needed:');
  
  Object.entries(iconUpdates).forEach(([strategy, primaryIcon]) => {
    const fallback = fallbackIcons[primaryIcon];
    if (fallback) {
      console.log(`  • ${strategy}: ${primaryIcon} (fallback: ${fallback})`);
    } else {
      console.log(`  • ${strategy}: ${primaryIcon}`);
    }
  });
}

// Run the icon updates
console.log('🎨 Starting icon updates for ADHD strategies...\n');
validateAndUseFallbacks();
updateIcons().catch(console.error);