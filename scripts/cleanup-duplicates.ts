import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function cleanup() {
  console.log('Cleaning up duplicate records...')
  
  // Remove remaining Cognitive Barriers records
  const { data: duplicates, error: fetchError } = await supabase
    .from('barriers')
    .select('id, name')
    .eq('category', 'Cognitive Barriers')
  
  console.log('Found duplicates to remove:', duplicates?.map(d => d.name))
  
  if (duplicates) {
    for (const dup of duplicates) {
      const { error } = await supabase
        .from('barriers')
        .delete()
        .eq('id', dup.id)
      
      if (error) {
        console.log('Error deleting:', dup.name, error.message)
      } else {
        console.log('✓ Deleted duplicate:', dup.name)
      }
    }
  }
  
  // Remove test category
  const { error: testError } = await supabase
    .from('barriers')
    .delete()
    .eq('category', 'Test Category')
  
  if (testError) {
    console.log('Error removing test category:', testError.message)
  } else {
    console.log('✓ Removed test category')
  }
  
  console.log('\nFinal check:')
  await checkFinalState()
}

async function checkFinalState() {
  const { data: barriers } = await supabase
    .from('barriers')
    .select('name, category')
    .order('category', { ascending: true })
    .order('name', { ascending: true })
  
  const categoryGroups: Record<string, string[]> = {}
  barriers?.forEach(barrier => {
    if (!categoryGroups[barrier.category]) {
      categoryGroups[barrier.category] = []
    }
    categoryGroups[barrier.category].push(barrier.name)
  })
  
  Object.entries(categoryGroups).forEach(([category, items]) => {
    console.log(`${category} (${items.length} items):`)
    items.forEach(item => console.log(`  - ${item}`))
    console.log()
  })
  
  // Show percentages
  const total = barriers?.length || 0
  console.log(`Final Distribution:`)
  Object.entries(categoryGroups).forEach(([category, items]) => {
    const percentage = Math.round((items.length / total) * 100)
    console.log(`  ${category}: ${items.length} items (${percentage}%)`)
  })
}

cleanup().catch(console.error)