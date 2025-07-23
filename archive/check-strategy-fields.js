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

async function checkStrategyFields() {
  try {
    console.log('Checking strategy fields in database...')
    
    // Get one strategy to see all available fields
    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Error fetching strategy:', error)
      return
    }

    if (data && data.length > 0) {
      const strategy = data[0]
      console.log('\n📋 AVAILABLE FIELDS:')
      Object.keys(strategy).forEach(field => {
        const value = strategy[field]
        const hasValue = value !== null && value !== undefined && value !== ''
        console.log(`  ${field}: ${hasValue ? '✅ Has data' : '❌ Empty/null'} (${typeof value})`)
      })

      // Check specific fields we're interested in
      console.log('\n🔍 SPECIFIC FIELD CHECK:')
      console.log(`  why_does_this_work: ${strategy.why_does_this_work ? '✅' : '❌'} "${strategy.why_does_this_work}"`)
      console.log(`  adhd_friendly_improvement: ${strategy.adhd_friendly_improvement ? '✅' : '❌'} "${strategy.adhd_friendly_improvement}"`)
      console.log(`  use_case: ${strategy.use_case ? '✅' : '❌'} "${strategy.use_case}"`)
      console.log(`  example: ${strategy.example ? '✅' : '❌'} "${strategy.example}"`)
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

checkStrategyFields() 