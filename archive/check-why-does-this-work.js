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

async function checkWhyDoesThisWork() {
  try {
    console.log('Checking why_does_this_work relationships...')
    
    // Check if there are any entries in the junction table
    const { data: junctionData, error: junctionError } = await supabase
      .from('strategy_why_does_this_work')
      .select(`
        strategy_id,
        why_does_this_work:why_id (
          name,
          category
        )
      `)
      .limit(5)

    if (junctionError) {
      console.error('Error fetching junction table:', junctionError)
      return
    }

    console.log('\n🔗 JUNCTION TABLE ENTRIES:')
    if (junctionData && junctionData.length > 0) {
      junctionData.forEach(entry => {
        console.log(`  Strategy ID: ${entry.strategy_id}`)
        console.log(`  Why Does This Work: ${entry.why_does_this_work?.name}`)
        console.log(`  Category: ${entry.why_does_this_work?.category}`)
        console.log('  ---')
      })
    } else {
      console.log('  No entries found in junction table')
    }

    // Check what's in the why_does_this_work table
    const { data: whyData, error: whyError } = await supabase
      .from('why_does_this_work')
      .select('*')
      .limit(10)

    if (whyError) {
      console.error('Error fetching why_does_this_work table:', whyError)
      return
    }

    console.log('\n📋 WHY_DOES_THIS_WORK TABLE:')
    if (whyData && whyData.length > 0) {
      whyData.forEach(entry => {
        console.log(`  ${entry.name} (${entry.category})`)
      })
    } else {
      console.log('  No entries found in why_does_this_work table')
    }

    // Check a specific strategy with its relationships
    const { data: strategyData, error: strategyError } = await supabase
      .from('strategies')
      .select(`
        name,
        why_does_this_work,
        strategy_why_does_this_work:strategy_why_does_this_work (
          why_does_this_work:why_id (
            name
          )
        )
      `)
      .eq('name', '1% Better')
      .single()

    if (strategyError) {
      console.error('Error fetching strategy:', strategyError)
      return
    }

    console.log('\n🔍 SPECIFIC STRATEGY CHECK (1% Better):')
    if (strategyData) {
      console.log(`  Name: ${strategyData.name}`)
      console.log(`  why_does_this_work field: "${strategyData.why_does_this_work}"`)
      console.log(`  Junction table relationships: ${strategyData.strategy_why_does_this_work?.length || 0}`)
      if (strategyData.strategy_why_does_this_work && strategyData.strategy_why_does_this_work.length > 0) {
        strategyData.strategy_why_does_this_work.forEach(rel => {
          console.log(`    - ${rel.why_does_this_work?.name}`)
        })
      }
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

checkWhyDoesThisWork() 