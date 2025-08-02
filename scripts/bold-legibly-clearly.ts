import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function boldLegiblyAndClearly() {
  console.log('✨ Adding bold formatting to "legibly" and "clearly"...')
  
  // Get current data
  const { data: currentData, error: fetchError } = await supabase
    .from('feelings_content')
    .select('step_sections')
    .eq('feeling_name', 'Forgetful')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching current data:', fetchError)
    return
  }
  
  if (!currentData || !currentData.step_sections) {
    console.log('❌ No step sections found for Forgetful feeling')
    return
  }
  
  // Update step 2 (index 1) to bold the keywords
  const updatedSteps = [...currentData.step_sections]
  const step2 = updatedSteps[1] // Step 2 is at index 1
  
  if (step2 && step2.try_this) {
    const updatedTryThis = step2.try_this.map(item => {
      if (item.includes('write legibly and clearly')) {
        return item.replace('write legibly and clearly', 'write **legibly** and **clearly**')
      }
      return item
    })
    
    step2.try_this = updatedTryThis
    
    console.log('Updated text:')
    console.log(updatedTryThis[0])
  }
  
  // Update the database
  const { error: updateError } = await supabase
    .from('feelings_content')
    .update({ step_sections: updatedSteps })
    .eq('feeling_name', 'Forgetful')
  
  if (updateError) {
    console.error('❌ Error updating database:', updateError)
    return
  }
  
  console.log('\n✅ Successfully bolded "legibly" and "clearly"!')
  console.log('💪 Emphasizes the key actions for better note-taking')
}

boldLegiblyAndClearly()