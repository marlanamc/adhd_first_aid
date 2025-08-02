import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function getAnxiousSteps() {
  // First check what columns exist
  const { data: allData, error } = await supabase
    .from('feelings_content')
    .select('*')
    .eq('feeling_name', 'Anxious')
    .single()
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log('Available columns:')
  console.log(Object.keys(allData))
  
  console.log('\nStep-related content:')
  // Check for step-related columns
  Object.keys(allData).forEach(key => {
    if (key.toLowerCase().includes('step')) {
      console.log(`${key}:`, allData[key])
    }
  })
}

getAnxiousSteps()