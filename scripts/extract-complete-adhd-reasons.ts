import { promises as fs } from 'fs';
import path from 'path';

// Function to extract complete ADHD reasons (both "You might" and mechanisms)
function extractCompleteAdhdReasons(content: string): string[] {
  const lines = content.split('\n');
  const reasons: string[] = [];
  let inAdhdSection = false;
  let inYouMightSection = false;
  let inMechanismsSection = false;

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
      // Look for "You might:" section
      if (trimmed.includes("You might:")) {
        reasons.push("You might:");
        inYouMightSection = true;
        continue;
      }
      
      // Look for "Here's what's really going on:" section  
      if (trimmed.includes("Here's what's really going on") || 
          trimmed.includes("what's happening")) {
        reasons.push("Here's what's really going on:");
        inYouMightSection = false;
        inMechanismsSection = true;
        continue;
      }
      
      // Capture "You might" behaviors
      if (inYouMightSection && trimmed.startsWith('- ')) {
        const cleanBehavior = trimmed.replace(/^\- /, '').trim();
        if (cleanBehavior.length > 5) {
          reasons.push(`- ${cleanBehavior}`);
        }
      }
      
      // Capture ADHD mechanisms (with emojis)
      if (inMechanismsSection && trimmed.startsWith('- ') && 
          (trimmed.includes('🧩') || trimmed.includes('⏰') || 
           trimmed.includes('💥') || trimmed.includes('🔁') || 
           trimmed.includes('🧠') || trimmed.includes('😣') || 
           trimmed.includes('⚡') || trimmed.includes('🎯') || 
           trimmed.includes('🌊') || trimmed.includes('🔄') || 
           trimmed.includes('⚖️') || trimmed.includes('🎭') || 
           trimmed.includes('📱'))) {
        
        const cleanMechanism = trimmed
          .replace(/^\- /, '')
          .replace(/\*\*(.*?)\*\*:/g, '**$1**')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (cleanMechanism.length > 10) {
          reasons.push(`- ${cleanMechanism}`);
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

async function extractAllCompleteAdhdReasons() {
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
      
      // Extract complete ADHD reasons from this specific file
      const adhdReasons = extractCompleteAdhdReasons(content);
      
      if (adhdReasons.length > 0) {
        // Convert filename to loop name format
        const loopName = filenameToLoopName(file);
        results[loopName] = adhdReasons;
        
        console.log(`${loopName}:`);
        adhdReasons.forEach((reason) => {
          console.log(`  ${reason}`);
        });
        console.log('');
      } else {
        console.log(`⚠️  No ADHD reasons found in ${file}`);
      }
    }
    
    console.log('\n--- SAMPLE SQL FOR ANALYSIS PARALYSIS ---');
    if (results['Analysis Paralysis']) {
      const reasons = results['Analysis Paralysis'].map(r => `'${r.replace(/'/g, "''")}'`).join(',\n  ');
      console.log(`UPDATE complex_loops_content 
SET adhd_reasons = ARRAY[
  ${reasons}
]
WHERE loop_name = 'Analysis Paralysis';`);
    }
    
  } catch (error) {
    console.error('❌ Error processing files:', error);
  }
}

// Run the script
extractAllCompleteAdhdReasons().catch(console.error);