import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabaseFields() {
  try {
    console.log('Checking database fields...')
    
    // Get a single strategy to see what fields are available
    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching strategy:', error)
      return
    }

    console.log('Available fields in strategies table:')
    console.log(Object.keys(data))
    
    console.log('\nSample strategy data:')
    console.log(JSON.stringify(data, null, 2))
    
    // Check specific fields we're looking for
    console.log('\nChecking specific fields:')
    console.log('subtitle:', data.subtitle ? '✅ EXISTS' : '❌ MISSING')
    console.log('use_case:', data.use_case ? '✅ EXISTS' : '❌ MISSING')
    console.log('icon_file:', data.icon_file ? '✅ EXISTS' : '❌ MISSING')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkDatabaseFields() 