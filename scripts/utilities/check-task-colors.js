const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTaskColors() {
  try {
    const { data, error } = await supabase
      .from('help_tasks')
      .select('category, color, sort_order')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    const categories = {};
    data.forEach(task => {
      if (!categories[task.category]) {
        categories[task.category] = {
          color: task.color,
          sort_order: task.sort_order
        };
      }
    });
    
    console.log('Task categories with colors:');
    Object.entries(categories).forEach(([category, info]) => {
      console.log(`${category}: ${info.color} (sort_order: ${info.sort_order})`);
    });
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkTaskColors();