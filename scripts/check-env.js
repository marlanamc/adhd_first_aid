require('dotenv').config({ path: '.env.local' });

console.log('\nChecking Supabase Environment Variables:\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 
  `${supabaseUrl.slice(0, 20)}...` : 
  'NOT SET ❌');

console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 
  `${supabaseKey.slice(0, 5)}...${supabaseKey.slice(-5)}` : 
  'NOT SET ❌');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Missing required environment variables');
  console.log('\nPlease ensure you have a .env.local file with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.log('\n❌ Invalid Supabase URL format');
  console.log('URL should be in format: https://your-project.supabase.co');
  process.exit(1);
}

console.log('\n✅ Environment variables look good!\n'); 