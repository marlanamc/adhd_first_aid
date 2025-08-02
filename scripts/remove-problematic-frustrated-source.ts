import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function removeProblematicFrustratedSource() {
  console.log('🗑️ Removing problematic source from frustrated feeling sources...')
  
  // First, find the source with the problematic text
  const { data: sources, error: fetchError } = await supabase
    .from('feeling_sources')
    .select('*')
    .eq('feeling_slug', 'frustrated')
    .like('description', '%While the full text%')
  
  if (fetchError) {
    console.error('❌ Error fetching sources:', fetchError)
    return
  }
  
  if (!sources || sources.length === 0) {
    console.log('❌ No matching source found')
    return
  }
  
  console.log(`Found ${sources.length} source(s) to remove:`)
  sources.forEach(source => {
    console.log(`ID ${source.id}: "${source.title}" by ${source.authors}`)
    console.log(`Description: ${source.description}`)
  })
  
  // Delete the problematic source(s)
  for (const source of sources) {
    const { error: deleteError } = await supabase
      .from('feeling_sources')
      .delete()
      .eq('id', source.id)
    
    if (deleteError) {
      console.error(`❌ Error deleting source ID ${source.id}:`, deleteError)
    } else {
      console.log(`✅ Successfully deleted source ID ${source.id}`)
    }
  }
  
  console.log('\n✨ Cleanup complete!')
}

removeProblematicFrustratedSource()