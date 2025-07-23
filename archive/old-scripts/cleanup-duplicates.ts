import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanupDuplicateStrategies() {
  console.log('🧹 Cleaning up duplicate strategies...')
  console.log('=======================================')

  try {
    // First, get count of all strategies
    const { count: totalCount, error: countError } = await supabase
      .from('strategies')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Error getting strategy count:', countError.message)
      return
    }

    console.log(`📊 Total strategies in database: ${totalCount}`)

    // Find duplicate strategy names
    const { data: duplicateNames, error: duplicateError } = await supabase
      .from('strategies')
      .select('name')
      .then(({ data, error }) => {
        if (error) return { data: null, error }
        
        // Count occurrences of each name
        const nameCounts: Record<string, number> = {}
        data?.forEach(strategy => {
          nameCounts[strategy.name] = (nameCounts[strategy.name] || 0) + 1
        })
        
        // Filter to only duplicates
        const duplicates = Object.entries(nameCounts)
          .filter(([_, count]) => count > 1)
          .map(([name, count]) => ({ name, count }))
        
        return { data: duplicates, error: null }
      })

    if (duplicateError) {
      console.error('❌ Error finding duplicates:', duplicateError.message)
      return
    }

    if (!duplicateNames || duplicateNames.length === 0) {
      console.log('✅ No duplicate strategies found!')
      return
    }

    console.log(`🔍 Found ${duplicateNames.length} strategy names with duplicates:`)
    duplicateNames.forEach(({ name, count }) => {
      console.log(`  📝 "${name}" appears ${count} times`)
    })

    let totalDeleted = 0

    // For each duplicate name, keep the most complete version and delete others
    for (const { name } of duplicateNames) {
      console.log(`\n🔄 Processing duplicates for: "${name}"`)
      
      // Get all versions of this strategy
      const { data: strategies, error: strategyError } = await supabase
        .from('strategies')
        .select('*')
        .eq('name', name)
        .order('created_at', { ascending: false }) // Most recent first

      if (strategyError) {
        console.error(`❌ Error fetching strategies for "${name}":`, strategyError.message)
        continue
      }

      if (!strategies || strategies.length <= 1) {
        console.log(`  ✅ No duplicates found for "${name}"`)
        continue
      }

      console.log(`  📊 Found ${strategies.length} copies`)

      // Find the "best" version - prioritize:
      // 1. Most recent (already sorted)
      // 2. Has description content
      // 3. Has example content
      const bestStrategy = strategies.find(s => 
        s.description && s.description.trim() && 
        s.example && s.example.trim()
      ) || strategies[0] // Fallback to most recent

      console.log(`  🎯 Keeping strategy with ID: ${bestStrategy.id} (${bestStrategy.created_at})`)

      // Delete all other versions
      const toDelete = strategies.filter(s => s.id !== bestStrategy.id)
      
      for (const strategy of toDelete) {
        const { error: deleteError } = await supabase
          .from('strategies')
          .delete()
          .eq('id', strategy.id)

        if (deleteError) {
          console.error(`  ❌ Failed to delete duplicate ${strategy.id}:`, deleteError.message)
        } else {
          console.log(`  🗑️ Deleted duplicate: ${strategy.id} (${strategy.created_at})`)
          totalDeleted++
        }
      }
    }

    // Final count check
    const { count: finalCount, error: finalCountError } = await supabase
      .from('strategies')
      .select('*', { count: 'exact', head: true })

    if (finalCountError) {
      console.error('❌ Error getting final count:', finalCountError.message)
    } else {
      console.log('\n🎉 Cleanup completed!')
      console.log(`📊 Strategies before cleanup: ${totalCount}`)
      console.log(`🗑️ Duplicates deleted: ${totalDeleted}`)
      console.log(`📊 Strategies after cleanup: ${finalCount}`)
      
      if (finalCount === 289) {
        console.log('✅ Perfect! Database now has exactly 289 unique strategies.')
      } else if ((finalCount || 0) < 289) {
        console.log('⚠️ Strategy count is lower than expected (289).')
      } else {
        console.log('⚠️ There may still be some duplicates remaining.')
      }
    }

  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  }
}

cleanupDuplicateStrategies().catch(console.error)