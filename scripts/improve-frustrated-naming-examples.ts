import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function improveFrustratedNamingExamples() {
  console.log('💪 Improving naming examples in Frustrated step 1...')
  
  // Get current data
  const { data: currentData, error: fetchError } = await supabase
    .from('feelings_content')
    .select('step_sections')
    .eq('feeling_name', 'Frustrated')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching current data:', fetchError)
    return
  }
  
  if (!currentData || !currentData.step_sections) {
    console.log('❌ No step sections found for Frustrated feeling')
    return
  }
  
  // Update step 1 (index 0) to improve the naming examples
  const updatedSteps = [...currentData.step_sections]
  const step1 = updatedSteps[0] // Step 1 is at index 0
  
  if (step1 && step1.try_this) {
    console.log('Current step 1 try_this items:')
    step1.try_this.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`)
    })
    
    // Update the naming example with more specific and powerful examples
    const updatedTryThis = step1.try_this.map(item => {
      if (item.includes('Name it to tame it:')) {
        return 'Name it to tame it: Get specific - "I\'m frustrated because this task has unclear instructions" or "I\'m frustrated that my brain won\'t focus despite trying"'
      }
      return item
    })
    
    step1.try_this = updatedTryThis
    
    console.log('\nUpdated step 1 try_this items:')
    step1.try_this.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`)
    })
  }
  
  // Update the database
  const { error: updateError } = await supabase
    .from('feelings_content')
    .update({ step_sections: updatedSteps })
    .eq('feeling_name', 'Frustrated')
  
  if (updateError) {
    console.error('❌ Error updating database:', updateError)
    return
  }
  
  console.log('\n✅ Successfully improved naming examples!')
  console.log('🎯 Now includes specific, relatable ADHD frustration scenarios')
  console.log('💡 Shows the power of naming the actual cause, not just the feeling')
}

improveFrustratedNamingExamples()