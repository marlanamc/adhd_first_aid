const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, 'archive', 'Strategies_Clean_Sources.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Split into lines and parse
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

// Find the indices for Name and description columns
const nameIndex = headers.findIndex(h => h.trim() === 'Name');
const descriptionIndex = headers.findIndex(h => h.trim() === 'description');

console.log(`Name column index: ${nameIndex}`);
console.log(`Description column index: ${descriptionIndex}`);

const headerMappings = [];

// Process each strategy line
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line carefully (handling quoted fields)
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    let j = 0;
    
    while (j < line.length) {
        const char = line[j];
        
        if (char === '"' && (j === 0 || line[j-1] === ',')) {
            inQuotes = true;
        } else if (char === '"' && inQuotes && (j === line.length - 1 || line[j+1] === ',')) {
            inQuotes = false;
        } else if (char === ',' && !inQuotes) {
            fields.push(currentField);
            currentField = '';
            j++;
            continue;
        } else {
            currentField += char;
        }
        j++;
    }
    fields.push(currentField); // Add the last field
    
    if (fields.length > Math.max(nameIndex, descriptionIndex)) {
        const strategyName = fields[nameIndex]?.trim().replace(/^"|"$/g, '');
        const description = fields[descriptionIndex]?.trim().replace(/^"|"$/g, '');
        
        if (strategyName && description) {
            // Extract the header line (### emoji + title)
            const headerMatch = description.match(/^###\s*[^\n]+/);
            if (headerMatch) {
                const originalHeader = headerMatch[0].trim();
                headerMappings.push({
                    strategyName,
                    originalHeader
                });
            }
        }
    }
}

console.log(`\nFound ${headerMappings.length} header mappings\n`);

// Show the first 20 mappings
console.log('First 20 header mappings:');
console.log('========================');
for (let i = 0; i < Math.min(20, headerMappings.length); i++) {
    const mapping = headerMappings[i];
    console.log(`"${mapping.strategyName}" -> "${mapping.originalHeader}"`);
}

console.log('\n...\n');

// Show some statistics
const emojiCounts = {};
headerMappings.forEach(mapping => {
    const emojiMatch = mapping.originalHeader.match(/###\s*([^\s]+)/);
    if (emojiMatch) {
        const emoji = emojiMatch[1];
        emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
    }
});

console.log('Emoji usage statistics:');
console.log('======================');
Object.entries(emojiCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([emoji, count]) => {
        console.log(`${emoji}: ${count} strategies`);
    });

// Save the complete mapping to a JSON file
fs.writeFileSync('header-mappings.json', JSON.stringify(headerMappings, null, 2));
console.log(`\nComplete mapping saved to header-mappings.json`);