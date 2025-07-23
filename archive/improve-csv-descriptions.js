const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../Strategies_Clean_Sources.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Function to improve a description to be more ADHD-friendly
function improveDescription(name, currentDescription) {
  if (!currentDescription || currentDescription.length < 50) {
    return currentDescription; // Keep short descriptions as-is
  }
  
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

    'Brain Dump Blitz': `**Write down everything in your head without stopping.**

• Get paper and pen
• Set a timer for 5-10 minutes  
• Write every thought, worry, or task
• Don't edit or organize - just dump it all out`,

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

    'Body Check-In Scan': `**Quickly scan your body from toes to head to ground yourself.**

• Start at your toes
• Notice each body part for 10 seconds
• Work your way up to your head
• No need to fix anything, just notice`
  };

  // If we have a specific improvement, use it
  if (improvements[name]) {
    return improvements[name];
  }

  // Otherwise, try to improve automatically
  let improved = currentDescription;
  
  // Remove markdown headers and emoji headings
  improved = improved.replace(/###\\s*[🎯🌱⏰🚀🧘‍♀️⏱️🧊🧰🔁📝🧘‍♂️🧠🛋️🎉💡🥦🎧⏰👖🕒]\\s*[^\\n]+\\n\\n?/g, '');
  
  // Remove ADHD explanations - common patterns
  improved = improved.replace(/This strategy helps with[^.]*\\./g, '');
  improved = improved.replace(/For ADHD[^.]*\\./g, '');
  improved = improved.replace(/This helps combat[^.]*\\./g, '');
  improved = improved.replace(/By [^,]*, you can[^.]*\\./g, '');
  improved = improved.replace(/Remember,[^.]*\\./g, '');
  improved = improved.replace(/Even [^,]*, [^.]*\\./g, '');
  improved = improved.replace(/Keep this strategy handy[^.]*\\./g, '');
  improved = improved.replace(/This approach helps[^.]*\\./g, '');
  improved = improved.replace(/When [^,]*, [^.]*\\./g, '');
  
  // Clean up extra whitespace and line breaks
  improved = improved.replace(/\\n\\n+/g, '\\n\\n');
  improved = improved.trim();
  
  // If still very long, try to make it more concise
  if (improved.length > 200) {
    // Try to extract the main action/concept
    const firstSentence = improved.split('.')[0] + '.';
    if (firstSentence.length < 150 && firstSentence.length > 20) {
      return firstSentence;
    }
  }
  
  return improved || currentDescription;
}

// Function to escape CSV fields that contain commas or quotes
function escapeCsvField(field) {
  if (field.includes(',') || field.includes('"') || field.includes('\\n')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

// Process the CSV
const lines = csvContent.split('\\n');
const header = lines[0];
const updatedLines = [header];

console.log('Processing CSV file...');
let updatedCount = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Parse CSV line (basic parser - handles quoted fields)
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      if (inQuotes && line[j + 1] === '"') {
        current += '"';
        j++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current); // Add last field
  
  if (fields.length < 3) continue; // Skip malformed lines
  
  const name = fields[0].replace(/^"(.*)"$/, '$1'); // Remove quotes if present
  const originalDescription = fields[2].replace(/^"(.*)"$/, '$1'); // Remove quotes if present
  
  const improvedDescription = improveDescription(name, originalDescription);
  
  if (improvedDescription !== originalDescription) {
    console.log(`✓ Improved: ${name}`);
    updatedCount++;
  }
  
  // Rebuild the line with the improved description
  fields[2] = escapeCsvField(improvedDescription);
  updatedLines.push(fields.join(','));
}

// Write the updated CSV
const outputPath = path.join(__dirname, '../Strategies_Clean_Sources_Improved.csv');
fs.writeFileSync(outputPath, updatedLines.join('\\n'), 'utf8');

console.log(`\\n=== SUMMARY ===`);
console.log(`Total strategies processed: ${lines.length - 1}`);
console.log(`Descriptions improved: ${updatedCount}`);
console.log(`Output saved to: Strategies_Clean_Sources_Improved.csv`);