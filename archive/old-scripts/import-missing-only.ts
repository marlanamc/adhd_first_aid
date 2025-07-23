import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse'
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

async function importOnlyMissing() {
  try {
    console.log('🔍 Finding missing strategies...')
    
    // Get all existing strategy names
    const { data: existingStrategies, error: existingError } = await supabase
      .from('strategies')
      .select('name')

    if (existingError) {
      console.error('❌ Error fetching existing strategies:', existingError.message)
      return
    }

    const existingNames = new Set(existingStrategies.map(s => s.name))
    console.log(`📊 Found ${existingNames.size} existing strategies in database`)

    // Read CSV
    const csvFilePath = path.join(__dirname, '..', 'strategies_7_19_update.csv')
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8')

    const parser = parse(fileContent, {
      columns: (headers: string[]) => headers.map(h => h.trim()),
      skip_empty_lines: true,
      trim: true
    })

    const strategies: any[] = []
    for await (const record of parser) {
      strategies.push(record)
    }

    // Find missing strategies
    const missingStrategies = strategies.filter(s => !existingNames.has(s.Name))
    console.log(`📋 Found ${missingStrategies.length} missing strategies to import`)

    if (missingStrategies.length === 0) {
      console.log('✅ All strategies are already imported!')
      return
    }

    console.log('\n🚀 Importing missing strategies...')
    
    // Import only missing strategies (simplified - just the basic strategy data)
    let successCount = 0
    
    for (const strategy of missingStrategies) {
      try {
        const { error: insertError } = await supabase
          .from('strategies')
          .insert({
            name: strategy.Name,
            subtitle: strategy.subtitle || null,
            description: strategy.description || null,
            example: strategy.example || null,
            use_case: strategy.use_case || null,
            source: strategy.source || null,
            icon_file: strategy.icon_file || null,
            image: strategy.image || null,
            image_source: strategy.image_source || null,
            further_reading_text: strategy.further_reading_text || null,
            further_reading_url: strategy.further_reading_url || null,
            adhd_friendly_improvement: strategy.adhd_friendly_improvement || null,
            price: strategy.price || 'Free',
            reviewed: strategy['Reviewed?'] === 'Yes'
          })

        if (insertError) {
          console.error(`❌ Failed to import ${strategy.Name}:`, insertError.message)
        } else {
          console.log(`✅ Imported: ${strategy.Name}`)
          successCount++
        }
      } catch (error) {
        console.error(`❌ Error importing ${strategy.Name}:`, error)
      }
    }

    console.log(`\n🎉 Import completed!`)
    console.log(`✅ Successfully imported: ${successCount} missing strategies`)

    // Final count
    const { count: finalCount } = await supabase
      .from('strategies')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Total strategies in database: ${finalCount || 0}`)

  } catch (error) {
    console.error('❌ Import failed:', error)
  }
}

importOnlyMissing().catch(console.error)