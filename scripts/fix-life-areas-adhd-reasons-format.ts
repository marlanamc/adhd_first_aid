import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fixLifeAreasADHDReasonsFormat() {
  console.log('🔧 UPDATING LIFE_AREAS ADHD REASONS TO MATCH COMPLEX_LOOPS FORMAT');
  console.log('================================================================');
  
  // Get all tasks_content records
  const { data: allTasks, error: fetchError } = await supabase
    .from('tasks_content')
    .select('*');
    
  if (fetchError) {
    console.error('❌ Error fetching tasks:', fetchError);
    return;
  }
  
  if (!allTasks) {
    console.log('❌ No tasks found');
    return;
  }
  
  console.log(`📋 Found ${allTasks.length} tasks to update`);
  
  let updatedCount = 0;
  
  for (const task of allTasks) {
    if (!task.adhd_reasons || !Array.isArray(task.adhd_reasons)) {
      console.log(`⚠️  Skipping ${task.task_name} - no ADHD reasons found`);
      continue;
    }
    
    // Find the separator index
    const separatorIndex = task.adhd_reasons.findIndex(reason => 
      reason === "Here's what's really going on:"
    );
    
    if (separatorIndex === -1) {
      console.log(`⚠️  Skipping ${task.task_name} - no separator found`);
      continue;
    }
    
    // Split the reasons into behavioral and explanation sections
    const behavioralReasons = task.adhd_reasons.slice(0, separatorIndex);
    const explanationReasons = task.adhd_reasons.slice(separatorIndex);
    
    // Ensure behavioral section starts with "You might:"
    const updatedBehavioralReasons = behavioralReasons[0] === "You might:" 
      ? behavioralReasons 
      : ["You might:", ...behavioralReasons];
    
    // Combine back together
    const updatedADHDReasons = [
      ...updatedBehavioralReasons,
      ...explanationReasons
    ];
    
    // Update the task
    const { error: updateError } = await supabase
      .from('tasks_content')
      .update({ adhd_reasons: updatedADHDReasons })
      .eq('id', task.id);
      
    if (updateError) {
      console.error(`❌ Error updating ${task.task_name}:`, updateError);
    } else {
      console.log(`✅ Updated ${task.task_name}`);
      updatedCount++;
    }
  }
  
  console.log(`\n🎉 COMPLETED: Updated ${updatedCount}/${allTasks.length} tasks`);
  console.log('✅ All life_areas ADHD reasons now match complex_loops format!');
}

if (require.main === module) {
  fixLifeAreasADHDReasonsFormat().catch(console.error);
}

export { fixLifeAreasADHDReasonsFormat };