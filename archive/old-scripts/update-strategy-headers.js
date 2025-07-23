const fs = require('fs');

// Load the header mappings
const headerMappings = JSON.parse(fs.readFileSync('header-mappings.json', 'utf-8'));

console.log('Strategy Header Update Script');
console.log('============================\n');

console.log(`Found ${headerMappings.length} strategies with original headers\n`);

// Create a SQL update script
let sqlScript = '-- Update strategy headers with original headers from CSV\n\n';

headerMappings.forEach((mapping, index) => {
    const escapedName = mapping.strategyName.replace(/'/g, "''");
    const escapedHeader = mapping.originalHeader.replace(/'/g, "''");
    
    sqlScript += `-- Strategy ${index + 1}: ${mapping.strategyName}\n`;
    sqlScript += `UPDATE strategies SET header = '${escapedHeader}' WHERE name = '${escapedName}';\n\n`;
});

// Save the SQL script
fs.writeFileSync('update-headers.sql', sqlScript);

// Create a TypeScript/JavaScript version for Supabase
let tsScript = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateStrategyHeaders() {
  console.log('Updating strategy headers...');
  
  const headerMappings = ${JSON.stringify(headerMappings, null, 2)};
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const mapping of headerMappings) {
    try {
      const { error } = await supabase
        .from('strategies')
        .update({ header: mapping.originalHeader })
        .eq('name', mapping.strategyName);
      
      if (error) {
        console.error(\`Error updating \${mapping.strategyName}:\`, error);
        errorCount++;
      } else {
        console.log(\`✓ Updated: \${mapping.strategyName}\`);
        successCount++;
      }
    } catch (err) {
      console.error(\`Exception updating \${mapping.strategyName}:\`, err);
      errorCount++;
    }
  }
  
  console.log(\`\\nUpdate complete: \${successCount} success, \${errorCount} errors\`);
}

updateStrategyHeaders().catch(console.error);
`;

fs.writeFileSync('update-headers.ts', tsScript);

console.log('Generated files:');
console.log('- header-mappings.json: Complete mapping data');
console.log('- update-headers.sql: SQL script for direct database update');
console.log('- update-headers.ts: TypeScript script for Supabase update');

console.log('\nSample mappings showing the pattern:');
console.log('====================================');

// Show some interesting examples
const examples = [
    headerMappings.find(m => m.strategyName === '1% Better'),
    headerMappings.find(m => m.strategyName === '2-Minute Rule'),
    headerMappings.find(m => m.strategyName === 'Brain Dump Blitz'),
    headerMappings.find(m => m.strategyName === 'Cleaning BINGO'),
    headerMappings.find(m => m.strategyName === 'Pomodoro Power Session'),
    headerMappings.find(m => m.strategyName.includes('Email')),
    headerMappings.find(m => m.strategyName.includes('Money')),
    headerMappings.find(m => m.strategyName.includes('Sleep')),
].filter(Boolean);

examples.forEach(mapping => {
    console.log(`"${mapping.strategyName}"`);
    console.log(`  Original: "${mapping.originalHeader}"`);
    console.log('');
});

// Analyze header patterns
console.log('Header Pattern Analysis:');
console.log('========================');

const patterns = {
    timeRelated: headerMappings.filter(m => m.originalHeader.includes('⏰') || m.originalHeader.includes('⏱️') || m.originalHeader.includes('⏳')),
    actionOriented: headerMappings.filter(m => m.originalHeader.includes('🚀') || m.originalHeader.includes('⚡')),
    organizingCleaning: headerMappings.filter(m => m.originalHeader.includes('🧽') || m.originalHeader.includes('🧹') || m.originalHeader.includes('📦')),
    brainMind: headerMappings.filter(m => m.originalHeader.includes('🧠') || m.originalHeader.includes('💭')),
    planning: headerMappings.filter(m => m.originalHeader.includes('📝') || m.originalHeader.includes('📋') || m.originalHeader.includes('🎯')),
};

Object.entries(patterns).forEach(([category, items]) => {
    console.log(`${category}: ${items.length} strategies`);
    items.slice(0, 3).forEach(item => {
        console.log(`  - ${item.originalHeader}`);
    });
    console.log('');
});