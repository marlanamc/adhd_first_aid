import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function fixApostrophes(text: string): string {
  if (!text) return text;
  
  // Replace straight quotes with proper apostrophes for common contractions
  return text
    .replace(/you"re/g, "you're")
    .replace(/you"ll/g, "you'll")
    .replace(/don"t/g, "don't")
    .replace(/can"t/g, "can't")
    .replace(/won"t/g, "won't")
    .replace(/isn"t/g, "isn't")
    .replace(/aren"t/g, "aren't")
    .replace(/wasn"t/g, "wasn't")
    .replace(/weren"t/g, "weren't")
    .replace(/doesn"t/g, "doesn't")
    .replace(/hasn"t/g, "hasn't")
    .replace(/haven"t/g, "haven't")
    .replace(/hadn"t/g, "hadn't")
    .replace(/wouldn"t/g, "wouldn't")
    .replace(/couldn"t/g, "couldn't")
    .replace(/shouldn"t/g, "shouldn't")
    .replace(/mustn"t/g, "mustn't")
    .replace(/needn"t/g, "needn't")
    .replace(/oughtn"t/g, "oughtn't")
    .replace(/that"s/g, "that's")
    .replace(/what"s/g, "what's")
    .replace(/where"s/g, "where's")
    .replace(/when"s/g, "when's")
    .replace(/who"s/g, "who's")
    .replace(/how"s/g, "how's")
    .replace(/why"s/g, "why's")
    .replace(/there"s/g, "there's")
    .replace(/here"s/g, "here's")
    .replace(/it"s/g, "it's")
    .replace(/he"s/g, "he's")
    .replace(/she"s/g, "she's")
    .replace(/we"re/g, "we're")
    .replace(/they"re/g, "they're")
    .replace(/we"ll/g, "we'll")
    .replace(/they"ll/g, "they'll")
    .replace(/I"m/g, "I'm")
    .replace(/I"ll/g, "I'll")
    .replace(/I"ve/g, "I've")
    .replace(/I"d/g, "I'd")
    .replace(/you"ve/g, "you've")
    .replace(/you"d/g, "you'd")
    .replace(/he"ll/g, "he'll")
    .replace(/she"ll/g, "she'll")
    .replace(/we"ve/g, "we've")
    .replace(/they"ve/g, "they've")
    .replace(/he"d/g, "he'd")
    .replace(/she"d/g, "she'd")
    .replace(/we"d/g, "we'd")
    .replace(/they"d/g, "they'd");
}

async function fixFeelingsApostrophes() {
  console.log('🔧 FIXING APOSTROPHES IN FEELINGS CONTENT');
  console.log('=======================================');
  
  try {
    // Get all feelings content
    const { data: feelings, error: fetchError } = await supabase
      .from('feelings_content')
      .select('*');
      
    if (fetchError) {
      console.error('❌ Error fetching feelings:', fetchError);
      return;
    }
    
    console.log(`✅ Found ${feelings.length} feelings to process`);
    
    let updatedCount = 0;
    let totalIssuesFixed = 0;
    
    for (const feeling of feelings) {
      let hasChanges = false;
      const updatedFeeling = { ...feeling };
      
      // Fix stern advice
      if (feeling.stern_advice && feeling.stern_advice.includes('"')) {
        const originalLength = (feeling.stern_advice.match(/"/g) || []).length;
        updatedFeeling.stern_advice = fixApostrophes(feeling.stern_advice);
        const newLength = (updatedFeeling.stern_advice.match(/"/g) || []).length;
        const fixed = originalLength - newLength;
        if (fixed > 0) {
          hasChanges = true;
          totalIssuesFixed += fixed;
          console.log(`  ✅ ${feeling.feeling_name} - Fixed ${fixed} issues in stern advice`);
        }
      }
      
      // Fix gentle advice
      if (feeling.gentle_advice && feeling.gentle_advice.includes('"')) {
        const originalLength = (feeling.gentle_advice.match(/"/g) || []).length;
        updatedFeeling.gentle_advice = fixApostrophes(feeling.gentle_advice);
        const newLength = (updatedFeeling.gentle_advice.match(/"/g) || []).length;
        const fixed = originalLength - newLength;
        if (fixed > 0) {
          hasChanges = true;
          totalIssuesFixed += fixed;
          console.log(`  ✅ ${feeling.feeling_name} - Fixed ${fixed} issues in gentle advice`);
        }
      }
      
      // Fix step sections
      if (feeling.step_sections) {
        const updatedStepSections = feeling.step_sections.map((step: any) => {
          const updatedStep = { ...step };
          
          // Fix intro
          if (step.intro && step.intro.includes('"')) {
            updatedStep.intro = fixApostrophes(step.intro);
            hasChanges = true;
            totalIssuesFixed++;
          }
          
          // Fix tip
          if (step.tip && step.tip.includes('"')) {
            updatedStep.tip = fixApostrophes(step.tip);
            hasChanges = true;
            totalIssuesFixed++;
          }
          
          // Fix try_this items
          if (step.try_this) {
            updatedStep.try_this = step.try_this.map((item: string) => {
              if (item.includes('"')) {
                hasChanges = true;
                totalIssuesFixed++;
                return fixApostrophes(item);
              }
              return item;
            });
          }
          
          return updatedStep;
        });
        
        updatedFeeling.step_sections = updatedStepSections;
      }
      
      // Update the database if there were changes
      if (hasChanges) {
        const { error: updateError } = await supabase
          .from('feelings_content')
          .update({
            stern_advice: updatedFeeling.stern_advice,
            gentle_advice: updatedFeeling.gentle_advice,
            step_sections: updatedFeeling.step_sections
          })
          .eq('id', feeling.id);
          
        if (updateError) {
          console.error(`❌ Error updating ${feeling.feeling_name}:`, updateError);
        } else {
          updatedCount++;
          console.log(`✅ Updated ${feeling.feeling_name}`);
        }
      }
    }
    
    console.log('');
    console.log('📊 SUMMARY:');
    console.log(`   Feelings updated: ${updatedCount}/${feelings.length}`);
    console.log(`   Total apostrophe issues fixed: ${totalIssuesFixed}`);
    console.log('');
    console.log('🎉 All apostrophes have been fixed in feelings content!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixFeelingsApostrophes().catch(console.error);