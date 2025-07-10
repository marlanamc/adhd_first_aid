require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  console.log('\nTesting Supabase Connection...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Try to fetch a single row from help_tasks
    const { data, error } = await supabase
      .from('help_tasks')
      .select('id, name')
      .limit(1);

    if (error) {
      console.error('❌ Connection Error:', error.message);
      console.error('\nDetails:', error);
      process.exit(1);
    }

    console.log('✅ Successfully connected to Supabase!');
    console.log('Sample data:', data);
    console.log('\nConnection is working properly.\n');
  } catch (err) {
    console.error('❌ Exception:', err);
    process.exit(1);
  }
}

testConnection(); 