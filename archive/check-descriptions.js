const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDescriptions() {
  try {
    console.log('=== FEELINGS ===');
    const { data: feelings, error: feelingsError } = await supabase
      .from('feelings')
      .select('name, description')
      .limit(5);
    
    if (feelingsError) {
      console.error('Feelings error:', feelingsError);
    } else {
      feelings.forEach(feeling => {
        console.log(`${feeling.name}: "${feeling.description || 'NO DESCRIPTION'}"`);
      });
    }
    
    console.log('\n=== HELP TASKS ===');
    const { data: tasks, error: tasksError } = await supabase
      .from('help_tasks')
      .select('name, description')
      .limit(5);
    
    if (tasksError) {
      console.error('Tasks error:', tasksError);
    } else {
      tasks.forEach(task => {
        console.log(`${task.name}: "${task.description || 'NO DESCRIPTION'}"`);
      });
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkDescriptions();