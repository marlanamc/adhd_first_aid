import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function findTherapyText() {
  console.log('🔍 Searching for therapy text in Ashamed content...')
  
  const { data, error } = await supabase
    .from('feelings_content')
    .select('*')
    .eq('feeling_name', 'Ashamed')
    .single()
  
  if (error) {
    console.error('❌ Error fetching data:', error)
    return
  }
  
  if (!data) {
    console.log('❌ No data found for Ashamed feeling')
    return
  }
  
  // Search through all text fields for therapy mention
  const fields = ['intro_paragraph', 'gentle_advice', 'stern_advice', 'adhd_reasons']
  
  for (const field of fields) {
    if (data[field] && data[field].includes('therapy')) {
      console.log(`Found in ${field}:`)
      console.log(data[field])
      console.log('\n---\n')
    }
  }
  
  // Check step sections
  if (data.step_sections) {
    data.step_sections.forEach((step, index) => {
      if (step.intro && step.intro.includes('therapy')) {
        console.log(`Found in step ${index + 1} intro:`)
        console.log(step.intro)
        console.log('\n---\n')
      }
      if (step.try_this) {
        step.try_this.forEach((item, itemIndex) => {
          if (item.includes('therapy')) {
            console.log(`Found in step ${index + 1}, try_this item ${itemIndex + 1}:`)
            console.log(item)
            console.log('\n---\n')
          }
        })
      }
      if (step.tip && step.tip.includes('therapy')) {
        console.log(`Found in step ${index + 1} tip:`)
        console.log(step.tip)
        console.log('\n---\n')
      }
    })
  }
}

findTherapyText()