import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Read the header mappings
const headerMappingsPath = path.join(__dirname, '..', 'header-mappings.json')
const headerMappings = JSON.parse(fs.readFileSync(headerMappingsPath, 'utf-8'))

// Function to update a strategy's description header
async function updateStrategyHeader(strategyName: string, originalHeader: string) {
  try {
    // Get the current strategy
    const { data: strategy, error: fetchError } = await supabase
      .from('strategies')
      .select('id, description')
      .eq('name', strategyName)
      .single()

    if (fetchError) {
      console.warn(`⚠️  Strategy not found: ${strategyName}`)
      return false
    }

    if (!strategy.description) {
      console.warn(`⚠️  No description found for: ${strategyName}`)
      return false
    }

    // Convert original header from ### to # and extract just the emoji + title
    const headerText = originalHeader.replace(/^###\s*/, '').trim()
    const newH1Header = `# ${headerText}`

    // Replace the existing header in the description
    let updatedDescription = strategy.description

    // Find and replace the current header (should start with # emoji)
    const headerRegex = /^#\s*[^\n]+/m
    if (headerRegex.test(updatedDescription)) {
      updatedDescription = updatedDescription.replace(headerRegex, newH1Header)
    } else {
      // If no header found, add it at the beginning
      updatedDescription = `${newH1Header}\n${updatedDescription}`
    }

    // Update the strategy in the database
    const { error: updateError } = await supabase
      .from('strategies')
      .update({ description: updatedDescription })
      .eq('id', strategy.id)

    if (updateError) {
      console.error(`❌ Failed to update ${strategyName}:`, updateError.message)
      return false
    }

    console.log(`✅ Updated: ${strategyName} -> "${newH1Header}"`)
    return true

  } catch (error) {
    console.error(`❌ Error updating ${strategyName}:`, error)
    return false
  }
}

// Main function to update all headers
async function fixAllHeaders() {
  console.log('🔧 Fixing Strategy Description Headers')
  console.log('=====================================')
  console.log(`📊 Processing ${headerMappings.length} strategies...`)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < headerMappings.length; i++) {
    const mapping = headerMappings[i]
    const success = await updateStrategyHeader(mapping.strategyName, mapping.originalHeader)
    
    if (success) {
      successCount++
    } else {
      errorCount++
    }

    // Progress update every 25 strategies
    if ((i + 1) % 25 === 0) {
      console.log(`📈 Progress: ${i + 1}/${headerMappings.length} strategies processed`)
    }
  }

  console.log('\n🎉 Header fix completed!')
  console.log(`✅ Successfully updated: ${successCount} strategies`)
  if (errorCount > 0) {
    console.log(`❌ Failed updates: ${errorCount}`)
  }

  // Show a few examples of the updates
  console.log('\n📝 Example Updates:')
  console.log('  • "Hammock Reset" now has proper header instead of "Get Organized"')
  console.log('  • "2-Minute Rule" -> "# ⏰ Do It Now: 2-Minute Rule"')
  console.log('  • "Brain Dump Blitz" -> "# 🧠 Clear Your Mind"')
  console.log('  • All headers converted from ### to # as requested')
}

// Run the fix
fixAllHeaders().catch(console.error)