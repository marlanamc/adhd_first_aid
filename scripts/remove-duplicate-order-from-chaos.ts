import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function removeDuplicateOrderFromChaos() {
  console.log('🔍 Finding duplicate "Order from Chaos" sources in frustrated feeling...')
  
  // Find all "Order from Chaos" sources for frustrated feeling
  const { data: sources, error: fetchError } = await supabase
    .from('feeling_sources')
    .select('*')
    .eq('feeling_slug', 'frustrated')
    .eq('title', 'Order from Chaos (2018)')
    .order('id', { ascending: true })
  
  if (fetchError) {
    console.error('❌ Error fetching sources:', fetchError)
    return
  }
  
  if (!sources || sources.length === 0) {
    console.log('❌ No "Order from Chaos" sources found')
    return
  }
  
  console.log(`Found ${sources.length} "Order from Chaos" sources:`)
  sources.forEach((source, index) => {
    console.log(`${index + 1}. ID ${source.id}: ${source.description}`)
  })
  
  // Keep the first one (about ADHD insight) and delete the second one (about system breakdowns)
  if (sources.length > 1) {
    // Find the one about system breakdowns (to delete)
    const toDelete = sources.find(s => s.description.includes('system breakdowns'))
    
    if (toDelete) {
      console.log(`\n🗑️ Deleting duplicate with ID ${toDelete.id} (system breakdowns description)`)
      
      const { error: deleteError } = await supabase
        .from('feeling_sources')
        .delete()
        .eq('id', toDelete.id)
      
      if (deleteError) {
        console.error(`❌ Error deleting source ID ${toDelete.id}:`, deleteError)
      } else {
        console.log(`✅ Successfully deleted duplicate source ID ${toDelete.id}`)
        console.log(`✅ Kept the source about "ADHD insight and validation"`)
      }
    }
  }
  
  console.log('\n✨ Cleanup complete!')
}

removeDuplicateOrderFromChaos()