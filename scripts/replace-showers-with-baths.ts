import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function replaceShowersWithBaths() {
  console.log('🛁 Replacing showers with baths in Burned Out step 2...')
  
  // Get current data
  const { data: currentData, error: fetchError } = await supabase
    .from('feelings_content')
    .select('step_sections')
    .eq('feeling_name', 'Burned Out')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching current data:', fetchError)
    return
  }
  
  if (!currentData || !currentData.step_sections) {
    console.log('❌ No step sections found for Burned Out feeling')
    return
  }
  
  // Update step 2 (index 1) to replace showers with baths
  const updatedSteps = [...currentData.step_sections]
  const step2 = updatedSteps[1] // Step 2 is at index 1
  
  if (step2 && step2.try_this) {
    console.log('Current warmth suggestion:')
    const currentItem = step2.try_this.find(item => item.includes('showers'))
    console.log(currentItem)
    
    // Replace showers with baths
    const updatedTryThis = step2.try_this.map(item => {
      if (item.includes('blankets, showers, soft clothes')) {
        return 'Wrap yourself in weight or warmth: Think blankets, baths, soft clothes'
      }
      return item
    })
    
    step2.try_this = updatedTryThis
    
    console.log('\nUpdated warmth suggestion:')
    const updatedItem = step2.try_this.find(item => item.includes('baths'))
    console.log(updatedItem)
  }
  
  // Update the database
  const { error: updateError } = await supabase
    .from('feelings_content')
    .update({ step_sections: updatedSteps })
    .eq('feeling_name', 'Burned Out')
  
  if (updateError) {
    console.error('❌ Error updating database:', updateError)
    return
  }
  
  console.log('\n✅ Successfully replaced showers with baths!')
  console.log('🛁 Baths are much more ADHD-friendly - passive, soothing, and no rushing')
  console.log('💡 Perfect for when you need to regulate but standing feels overwhelming')
}

replaceShowersWithBaths()