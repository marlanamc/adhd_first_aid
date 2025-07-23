const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Function to improve a description to be more ADHD-friendly
function improveDescription(name, currentDescription) {
  if (!currentDescription) return null;
  
  // Remove markdown headers and emoji headings
  let improved = currentDescription.replace(/###\s*[🎯🌱⏰🚀🧘‍♀️⏱️🧊🧰🔁📝🧘‍♂️🧠🛋️🎉💡]\s*[^\\n]+\\n\\n?/g, '');
  
  // Remove ADHD explanations - common patterns
  improved = improved.replace(/This strategy helps with[^.]*\./g, '');
  improved = improved.replace(/For ADHD[^.]*\./g, '');
  improved = improved.replace(/This helps combat[^.]*\./g, '');
  improved = improved.replace(/By [^,]*, you can[^.]*\./g, '');
  improved = improved.replace(/Remember,[^.]*\./g, '');
  improved = improved.replace(/Even [^,]*, [^.]*\./g, '');
  improved = improved.replace(/Keep this strategy handy[^.]*\./g, '');
  
  // Clean up extra whitespace and line breaks
  improved = improved.replace(/\\n\\n+/g, '\\n\\n');
  improved = improved.trim();
  
  // If description is still very long (>300 chars), it needs manual review
  if (improved.length > 300) {
    return null; // Return null for manual review
  }
  
  return improved;
}

async function improveAllDescriptions() {
  console.log('Starting description improvements...');
  
  // Get all strategies
  const { data: strategies, error } = await supabase
    .from('strategies')
    .select('id, name, description');
    
  if (error) {
    console.error('Error fetching strategies:', error);
    return;
  }
  
  console.log(`Found ${strategies.length} strategies to review`);
  
  let improved = 0;
  let needsManualReview = 0;
  let alreadyGood = 0;
  
  for (const strategy of strategies) {
    const improved_desc = improveDescription(strategy.name, strategy.description);
    
    if (!improved_desc) {
      needsManualReview++;
      continue;
    }
    
    if (improved_desc === strategy.description) {
      alreadyGood++;
      continue;
    }
    
    // Update the description
    const { error: updateError } = await supabase
      .from('strategies')
      .update({ description: improved_desc })
      .eq('id', strategy.id);
      
    if (updateError) {
      console.error(`Error updating ${strategy.name}:`, updateError);
    } else {
      console.log(`✓ Improved: ${strategy.name}`);
      improved++;
    }
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\\n=== SUMMARY ===');
  console.log(`Improved: ${improved}`);
  console.log(`Already good: ${alreadyGood}`);
  console.log(`Need manual review: ${needsManualReview}`);
}

// Run the improvement
improveAllDescriptions().catch(console.error);