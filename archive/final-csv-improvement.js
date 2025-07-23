const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

// Function to improve a description to be more ADHD-friendly
function improveDescription(name, currentDescription) {
  if (!currentDescription || currentDescription.length < 50) {
    return currentDescription; // Keep short descriptions as-is
  }
  
  // Remove BOM and clean name
  name = name.replace(/^\uFEFF/, '').trim();
  
  // Define specific improvements for strategies
  const improvements = {
    '1% Better': `**Make tiny improvements every day instead of trying to do everything at once.**

• Pick one small thing to improve (1% better)
• Do it consistently 
• Build momentum over time
• Focus on progress, not perfection`,

    '2-Minute Rule': `**If a task takes less than 2 minutes, do it right now.**

• See a quick task? Do it immediately
• Don't add it to your to-do list
• Prevents small tasks from piling up
• Examples: Reply to a text, file a document, wash a dish`,

    '5-4-3-2-1 Launch': `**Count down from 5 to 1, then immediately start your task.**

• Count: 5-4-3-2-1
• Move your body on "1" 
• Start the task before your brain can resist
• Works great for getting out of bed, starting work, or cleaning`,

    '5-4-3-2-1 Sensory Grounding': `**Use your senses to calm down when feeling overwhelmed.**

• **5 things** you can see
• **4 things** you can touch  
• **3 things** you can hear
• **2 things** you can smell
• **1 thing** you can taste`,

    '10-Minute Pickup': `**Set a 10-minute timer and clean up as much as possible.**

• Start timer for exactly 10 minutes
• Pick up, organize, or clean anything you see
• Stop when timer goes off
• Celebrate what you accomplished`,

    '15-Minute Fridge Rescue': `**Set a 15-minute timer to clean out your fridge.**

• Remove expired items first
• Wipe down shelves quickly  
• Organize what's left
• Stop when timer goes off`,

    '15-Minute Speed Clean': `**Set a timer for 15 minutes and clean only what you can see.**

• Focus on counters, tables, floors
• Don't open drawers or cabinets
• Put things back where they belong
• Celebrate what you accomplished`,

    'Acceptance and Commitment': `**Take small actions that match your personal values.**

• Identify what matters most to you
• Choose one small action that fits those values
• Do it even if you don't feel like it
• Build on tiny wins`,

    'ADHD Crisis Kit': `**Keep a kit with emergency items for tough ADHD days.**

• **Snacks** (protein bars, crackers)
• **Phone charger**
• **Calming items** (fidget toy, essential oil)
• **Medications** (if you take them)
• **Emergency contacts** written down`,

    'Auto-Pilot Life Systems': `**Set up automatic systems so you don't have to remember.**

• Auto-pay bills
• Grocery delivery subscriptions  
• Automatic savings transfers
• Recurring calendar reminders`,

    'Avoidance Journal': `**Write down tasks you keep avoiding and notice patterns.**

• List what you're avoiding
• Note why it feels hard  
• Look for patterns (time of day, type of task)
• Start with the easiest avoided task`,

    'Body Check-In Scan': `**Quickly scan your body from toes to head to ground yourself.**

• Start at your toes
• Notice each body part for 10 seconds
• Work your way up to your head
• No need to fix anything, just notice`,

    'Brain Dump Blitz': `**Write down everything in your head without stopping.**

• Get paper and pen
• Set a timer for 5-10 minutes  
• Write every thought, worry, or task
• Don't edit or organize - just dump it all out`,

    'Brain-Friendly Space Design': `**Arrange your space to work with your ADHD brain.**

• Keep frequently used items visible
• Reduce visual clutter
• Create designated spots for important things
• Use clear containers and labels`,

    'Cleaning BINGO': `**Turn cleaning into a game with a bingo card.**

• Make a bingo card with cleaning tasks
• Cross off tasks as you do them
• Try to get a line or full card
• Reward yourself when you win`,

    'Get Dressed': `**Change out of pajamas into real clothes to shift into action mode.**

• Pick clothes the night before if possible
• Keep simple outfit options ready
• Even changing into different comfy clothes helps
• Notice how it changes your energy`,

    'Friday Afternoon Shutdown Ritual': `**End each week with a simple review and planning session.**

• Set a weekly alarm for Friday at 4pm
• List 3 things you accomplished this week
• Write down 3 priorities for next week
• Close your computer and celebrate the week`,

    'Frozen Vegetables': `**Keep frozen veggies on hand for easy nutrition.**

• Pre-washed and pre-chopped
• Add to any meal in 2 minutes
• Steam in microwave or toss in pan
• Cheap way to add nutrients`,

    'Gaming Headsets': `**Use gaming headsets to block distractions and focus.**

• Great sound isolation
• Comfortable for long wear
• Often cheaper than "work" headphones
• Clear signal to others that you're focused`,

    'Gentle Alarm Sounds': `**Replace harsh alarm beeps with gentle, gradually increasing sounds.**

• Choose nature sounds, chimes, or soft music
• Set volume to start low and increase
• Reduces morning anxiety and stress
• Makes waking up less jarring`,

    'Give Yourself a Deadline': `**Create fake deadlines for tasks that don't have them.**

• Pick a realistic but motivating deadline
• Tell someone else about it for accountability
• Set calendar reminders leading up to it
• Reward yourself when you meet it`,

    'Pomodoro Technique': `**Work for 25 minutes, then take a 5-minute break.**

• Set timer for 25 minutes
• Focus on one task only
• When timer rings, take 5-minute break
• After 4 cycles, take longer break`,

    'Time Blocking': `**Assign specific time slots to different activities.**

• Block out time for specific tasks
• Include buffer time between activities
• Color-code different types of work
• Stick to the schedule as much as possible`,

    'One-Touch Rule': `**Handle each item only once when organizing.**

• Pick up an item
• Decide immediately where it goes
• Put it there right away
• Don't set it down "temporarily"`,

    'Dopamine Menu': `**Create a list of quick activities that boost your mood.**

• **Small:** Listen to one song, pet an animal
• **Medium:** Take a walk, call a friend  
• **Large:** Exercise, creative project
• Pick based on time and energy available`
  };

  // If we have a specific improvement, use it
  if (improvements[name]) {
    return improvements[name];
  }

  // Otherwise, try to improve automatically
  let improved = currentDescription;
  
  // Remove markdown headers and emoji headings
  improved = improved.replace(/###\s*[🎯🌱⏰🚀🧘‍♀️⏱️🧊🧰🔁📝🧘‍♂️🧠🛋️🎉💡🥦🎧⏰👖🕒]\s*[^\n]+\n\n?/g, '');
  
  // Remove ADHD explanations - common patterns
  improved = improved.replace(/This strategy helps with[^.]*\./g, '');
  improved = improved.replace(/For ADHD[^.]*\./g, '');
  improved = improved.replace(/This helps combat[^.]*\./g, '');
  improved = improved.replace(/By [^,]*, you can[^.]*\./g, '');
  improved = improved.replace(/Remember,[^.]*\./g, '');
  improved = improved.replace(/Even [^,]*, [^.]*\./g, '');
  improved = improved.replace(/Keep this strategy handy[^.]*\./g, '');
  improved = improved.replace(/This approach helps[^.]*\./g, '');
  improved = improved.replace(/When [^,]*, [^.]*\./g, '');
  improved = improved.replace(/This technique[^.]*\./g, '');
  improved = improved.replace(/The goal is[^.]*\./g, '');
  improved = improved.replace(/allowing you to[^.]*\./g, '');
  improved = improved.replace(/making it easier[^.]*\./g, '');
  improved = improved.replace(/promoting [^.]*\./g, '');
  
  // Clean up extra whitespace and line breaks
  improved = improved.replace(/\n\n+/g, '\n\n');
  improved = improved.trim();
  
  return improved || currentDescription;
}

async function processCSV() {
  const inputPath = path.join(__dirname, '../Strategies_Clean_Sources.csv');
  const outputPath = path.join(__dirname, '../Strategies_ADHD_Friendly.csv');
  
  const strategies = [];
  let updatedCount = 0;
  let totalCount = 0;
  
  console.log('Reading CSV file...');
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(inputPath)
      .pipe(csv())
      .on('data', (row) => {
        totalCount++;
        
        // Handle BOM in column names
        const name = row['Name'] || row['\uFEFFName'] || row['﻿Name'];
        const originalDescription = row.description;
        
        if (!name) {
          console.log('Warning: Missing name for row', totalCount);
          strategies.push(row);
          return;
        }
        
        const improvedDescription = improveDescription(name, originalDescription);
        
        if (improvedDescription !== originalDescription) {
          console.log(`✓ Improved: ${name}`);
          updatedCount++;
        }
        
        // Update the description in the row
        row.description = improvedDescription;
        
        // Clean the name column (remove BOM)
        if (row['\uFEFFName']) {
          row['Name'] = row['\uFEFFName'];
          delete row['\uFEFFName'];
        }
        if (row['﻿Name']) {
          row['Name'] = row['﻿Name'];
          delete row['﻿Name'];
        }
        
        strategies.push(row);
      })
      .on('end', () => {
        console.log(`\nProcessed ${totalCount} strategies`);
        console.log(`Improved ${updatedCount} descriptions`);
        
        // Write the improved CSV
        if (strategies.length > 0) {
          const headers = Object.keys(strategies[0]).map(key => ({id: key, title: key}));
          
          const csvWriter = createCsvWriter({
            path: outputPath,
            header: headers
          });
          
          csvWriter.writeRecords(strategies)
            .then(() => {
              console.log(`\n✓ Saved ADHD-friendly CSV to: ${path.basename(outputPath)}`);
              resolve();
            })
            .catch(reject);
        } else {
          console.log('No strategies found to process');
          resolve();
        }
      })
      .on('error', reject);
  });
}

processCSV().catch(console.error);