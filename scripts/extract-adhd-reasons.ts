import { promises as fs } from 'fs';
import path from 'path';

// Function to extract ADHD reasons from markdown content
function extractAdhdReasons(content: string): string[] {
  const lines = content.split('\n');
  const reasons: string[] = [];
  let inAdhdSection = false;
  let inReasonsList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for the ADHD reasons section
    if (trimmed.includes('Why') && trimmed.includes('Hard with ADHD')) {
      inAdhdSection = true;
      continue;
    }
    
    // If we hit another section header after ADHD section, stop
    if (inAdhdSection && trimmed.startsWith('###') && !trimmed.includes('ADHD')) {
      break;
    }
    
    if (inAdhdSection) {
      // Look for "Here's what's really going on:" or similar
      if (trimmed.includes("Here's what's really going on") || 
          trimmed.includes("what's happening") ||
          inReasonsList) {
        inReasonsList = true;
        
        // Extract bullet points with emojis and explanations
        if (trimmed.startsWith('- ') && (trimmed.includes('🧩') || 
            trimmed.includes('⏰') || trimmed.includes('💥') || 
            trimmed.includes('🔁') || trimmed.includes('🧠') ||
            trimmed.includes('😣') || trimmed.includes('⚡') ||
            trimmed.includes('🎯') || trimmed.includes('🌊') ||
            trimmed.includes('🔄') || trimmed.includes('⚖️') ||
            trimmed.includes('🎭') || trimmed.includes('📱'))) {
          
          // Clean up the reason text
          const cleanReason = trimmed
            .replace(/^\- /, '')
            .replace(/\*\*(.*?)\*\*:/g, '**$1**')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (cleanReason.length > 10) { // Filter out very short entries
            reasons.push(cleanReason);
          }
        }
      }
    }
  }
  
  return reasons;
}

// Function to convert filename to proper loop name
function filenameToLoopName(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function extractAllAdhdReasons() {
  const complexLoopPagesDir = path.join(process.cwd(), 'Complex Loop Pages');
  const results: { [key: string]: string[] } = {};
  
  try {
    // Read all markdown files in the Complex Loop Pages directory
    const files = await fs.readdir(complexLoopPagesDir);
    const mdFiles = files.filter(file => file.endsWith('.md') && !file.includes('Complex Loop Pages.md'));
    
    console.log(`Found ${mdFiles.length} markdown files to process\n`);
    
    for (const file of mdFiles) {
      const filePath = path.join(complexLoopPagesDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Extract ADHD reasons from this specific file
      const adhdReasons = extractAdhdReasons(content);
      
      if (adhdReasons.length > 0) {
        // Convert filename to loop name format
        const loopName = filenameToLoopName(file);
        results[loopName] = adhdReasons;
        
        console.log(`${loopName}:`);
        adhdReasons.forEach((reason, index) => {
          console.log(`  ${index + 1}. ${reason}`);
        });
        console.log('');
      } else {
        console.log(`⚠️  No ADHD reasons found in ${file}`);
      }
    }
    
    // Output as JSON for easy processing
    console.log('\n--- JSON OUTPUT ---');
    console.log(JSON.stringify(results, null, 2));
    
  } catch (error) {
    console.error('❌ Error processing files:', error);
  }
}

// Run the script
extractAllAdhdReasons().catch(console.error);