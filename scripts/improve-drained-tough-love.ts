import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function improveDrainedToughLove() {
  console.log('💪 Improving Drained tough love advice with specific actions and bolding...')
  
  // Get current data
  const { data: currentData, error: fetchError } = await supabase
    .from('feelings_content')
    .select('stern_advice')
    .eq('feeling_name', 'Drained')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching current data:', fetchError)
    return
  }
  
  if (!currentData || !currentData.stern_advice) {
    console.log('❌ No stern advice found for Drained feeling')
    return
  }
  
  console.log('Current tough love advice:')
  console.log(currentData.stern_advice)
  
  // Create more specific, action-oriented advice with bolding
  const updatedAdvice = "You're not a phone on 1%; you're a person with choices. **Sleep deeply**. **Eat real food**. **Close the apps**. This isn't about quick fixes - you need to **rebuild your reserves** like your life depends on it, because it does. Then get back to it."
  
  console.log('\nUpdated tough love advice:')
  console.log(updatedAdvice)
  
  // Update the database
  const { error: updateError } = await supabase
    .from('feelings_content')
    .update({ stern_advice: updatedAdvice })
    .eq('feeling_name', 'Drained')
  
  if (updateError) {
    console.error('❌ Error updating database:', updateError)
    return
  }
  
  console.log('\n✅ Successfully improved tough love advice!')
  console.log('💡 Made it more specific with actionable steps')
  console.log('⚡ Added bold formatting to key actions')
  console.log('🎯 "Rebuild your reserves" is clearer than "restore"')
}

improveDrainedToughLove()