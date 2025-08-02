import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testTable() {
  console.log('Testing if feeling_sources table exists...')
  
  try {
    const { data, error } = await supabase
      .from('feeling_sources')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Table does not exist or has issues:', error.message)
      console.log('\n📋 Please run this SQL in your Supabase SQL Editor:')
      console.log('=' .repeat(60))
      console.log(`
CREATE TABLE feeling_sources (
    id SERIAL PRIMARY KEY,
    feeling_slug TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feeling_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feeling_sources_policy" ON feeling_sources 
    FOR ALL TO PUBLIC USING (true);
      `)
      console.log('=' .repeat(60))
      console.log('\nAfter creating the table, run: tsx scripts/import-sources-data.ts')
    } else {
      console.log('✅ Table exists and is accessible!')
      console.log(`Current records: ${data?.length ?? 0}`)
    }
  } catch (error) {
    console.error('Error testing table:', error)
  }
}

testTable()