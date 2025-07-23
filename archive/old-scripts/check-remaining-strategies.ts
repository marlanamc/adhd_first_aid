import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStrategies() {
  console.log('🔍 Checking strategy count in database...')
  
  const { count, error } = await supabase
    .from('strategies')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log(`📊 Total strategies in database: ${count || 0}`)
  
  // Check if we need to re-run the import
  if ((count || 0) < 289) {
    console.log('💡 It looks like not all strategies were imported.')
    console.log('You may need to run the fresh-database-import.ts script again.')
  } else {
    console.log('✅ All strategies are in the database!')
    console.log('🎯 Re-running example updates for all strategies...')
  }
}

checkStrategies().catch(console.error)