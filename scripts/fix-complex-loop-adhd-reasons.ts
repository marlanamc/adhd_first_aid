import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Function to extract ADHD reasons from markdown content
import { supabase } from '../src/lib/supabase';

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

async function fixComplexLoopAdhdReasons() {
  const complexLoopPagesDir = path.join(process.cwd(), 'Complex Loop Pages');
  
  try {
    // Read all markdown files in the Complex Loop Pages directory
    const files = await fs.readdir(complexLoopPagesDir);
    const mdFiles = files.filter(file => file.endsWith('.md') && !file.includes('Complex Loop Pages.md'));
    
    console.log(`Found ${mdFiles.length} markdown files to process`);
    
    for (const file of mdFiles) {
      const filePath = path.join(complexLoopPagesDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Extract ADHD reasons from this specific file
      const adhdReasons = extractAdhdReasons(content);
      
      if (adhdReasons.length > 0) {
        // Convert filename to loop name format
        const loopName = filenameToLoopName(file);
        
        console.log(`\nProcessing: ${file}`);
        console.log(`Loop name: ${loopName}`);
        console.log(`Found ${adhdReasons.length} ADHD reasons:`);
        adhdReasons.forEach((reason, index) => {
          console.log(`  ${index + 1}. ${reason.substring(0, 80)}${reason.length > 80 ? '...' : ''}`);
        });
        
        // Update the database
        const { error } = await supabase
          .from('complex_loops_content')
          .update({ adhd_reasons: adhdReasons })
          .eq('loop_name', loopName);
        
        if (error) {
          console.error(`❌ Error updating ${loopName}:`, error.message);
        } else {
          console.log(`✅ Updated ADHD reasons for "${loopName}"`);
        }
      } else {
        console.log(`⚠️  No ADHD reasons found in ${file}`);
      }
    }
    
    console.log('\n🎉 All complex loop ADHD reasons have been processed!');
    
  } catch (error) {
    console.error('❌ Error processing files:', error);
  }
}

// Run the script
fixComplexLoopAdhdReasons().catch(console.error);