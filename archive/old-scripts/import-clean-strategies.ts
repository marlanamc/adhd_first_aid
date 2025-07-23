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

// Test database connection
async function testConnection() {
  console.log('🔗 Testing Supabase connection...')
  try {
    const { data, error } = await supabase.from('help_tasks').select('id').limit(1)
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      process.exit(1)
    }
    console.log('✅ Database connection successful!')
    return true
  } catch (err) {
    console.error('❌ Connection test failed:', err)
    process.exit(1)
  }
}

// ONLY lookup existing entries - DO NOT create new ones
async function findExistingId(
  table: 'feelings' | 'issues' | 'barriers' | 'help_tasks' | 'tags' | 'life_roles' | 'solution_types' | 'styles' | 'why_does_this_work',
  name: string
): Promise<string | null> {
  if (!name || name.trim() === '') {
    return null
  }

  // Clean the name and try exact match first
  const cleanName = name.trim()
  
  const { data, error } = await supabase
    .from(table)
    .select('id')
    .eq('name', cleanName)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.warn(`Warning: Error looking up ${table} for "${cleanName}": ${error.message}`)
    return null
  }

  if (data) {
    return data.id
  }

  // If exact match fails, try case-insensitive search
  const { data: caseInsensitiveData, error: caseError } = await supabase
    .from(table)
    .select('id, name')
    .ilike('name', cleanName)
    .limit(1)

  if (caseError) {
    console.warn(`Warning: Case-insensitive lookup failed for ${table} "${cleanName}": ${caseError.message}`)
    return null
  }

  if (caseInsensitiveData && caseInsensitiveData.length > 0) {
    console.log(`📝 Found case-insensitive match: "${cleanName}" → "${caseInsensitiveData[0].name}"`)
    return caseInsensitiveData[0].id
  }

  console.warn(`⚠️  No existing entry found in ${table} for: "${cleanName}"`)
  return null
}

// Insert strategy with relationships to EXISTING lookup entries only
async function insertStrategy(strategyData: any): Promise<void> {
  try {
    console.log(`🔄 Processing: ${strategyData.Name}`)

    // Check if strategy already exists
    const { data: existingStrategy, error: checkError } = await supabase
      .from('strategies')
      .select('id')
      .eq('name', strategyData.Name)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.warn(`Warning: Error checking for existing strategy "${strategyData.Name}": ${checkError.message}`)
    }

    if (existingStrategy) {
      console.log(`⏭️  Skipped: ${strategyData.Name} (already exists)`)
      return
    }

    // 1. Insert the main strategy record
    const strategyInsert = {
      name: strategyData.Name,
      subtitle: strategyData.subtitle || null,
      description: strategyData.description || null,
      example: strategyData.example || null,
      use_case: strategyData.use_case || null,
      source: strategyData.source || null,
      icon_file: strategyData.icon_file || null,
      image: strategyData.image || null,
      image_source: strategyData.image_source || null,
      further_reading_text: strategyData.further_reading_text || null,
      further_reading_url: strategyData.further_reading_url || null,
      adhd_friendly_improvement: strategyData.adhd_friendly_improvement || null,
      price: strategyData.price || 'Free',
      reviewed: strategyData['Reviewed?'] === 'Yes'
    }

    const { data: strategy, error: strategyError } = await supabase
      .from('strategies')
      .insert(strategyInsert)
      .select('id')
      .single()

    if (strategyError) {
      throw new Error(`Error inserting strategy "${strategyData.Name}": ${strategyError.message}`)
    }

    const strategyId = strategy.id

    // 2. Handle single-value relationships (only link to existing entries)
    const singleValueFields = [
      { csvField: 'feeling_1', table: 'feelings' as const, junction: 'strategy_feelings' },
      { csvField: 'feeling_2', table: 'feelings' as const, junction: 'strategy_feelings' }
    ]

    for (const field of singleValueFields) {
      const value = strategyData[field.csvField]
      if (value && value.trim()) {
        const existingId = await findExistingId(field.table, value.trim())
        if (existingId) {
          const junctionData = {
            strategy_id: strategyId,
            [`${field.table.slice(0, -1)}_id`]: existingId
          }

          const { error: junctionError } = await supabase
            .from(field.junction)
            .insert(junctionData)

          if (junctionError && junctionError.code !== '23505') {
            console.warn(`Warning: Could not link ${field.table} "${value}" to strategy "${strategyData.Name}": ${junctionError.message}`)
          }
        }
      }
    }

    // 3. Handle multi-value relationships (split by comma, only link to existing)
    const multiValueFields = [
      { csvField: 'issues', table: 'issues' as const, junction: 'strategy_issues' },
      { csvField: 'barrier', table: 'barriers' as const, junction: 'strategy_barriers' },
      { csvField: 'help_task', table: 'help_tasks' as const, junction: 'strategy_help_tasks' }
    ]

    for (const field of multiValueFields) {
      const value = strategyData[field.csvField]
      if (value && value.trim()) {
        const items = value.split(',').map((item: string) => item.trim()).filter((item: string) => item)
        
        for (const item of items) {
          const existingId = await findExistingId(field.table, item)
          if (existingId) {
            const junctionData = {
              strategy_id: strategyId,
              [`${field.table.slice(0, -1)}_id`]: existingId
            }

            const { error: junctionError } = await supabase
              .from(field.junction)
              .insert(junctionData)

            if (junctionError && junctionError.code !== '23505') {
              console.warn(`Warning: Could not link ${field.table} "${item}" to strategy "${strategyData.Name}": ${junctionError.message}`)
            }
          }
        }
      }
    }

    // 4. Handle "why does this work" relationships
    const whyValue = strategyData.why_does_this_work_AI
    if (whyValue && whyValue.trim()) {
      const whyItems = whyValue.split(',').map((item: string) => item.trim().replace(/^["']|["']$/g, '')).filter((item: string) => item)
      
      for (const item of whyItems) {
        const existingId = await findExistingId('why_does_this_work', item)
        if (existingId) {
          const { error: whyJunctionError } = await supabase
            .from('strategy_why_does_this_work')
            .insert({
              strategy_id: strategyId,
              why_id: existingId
            })

          if (whyJunctionError && whyJunctionError.code !== '23505') {
            console.warn(`Warning: Could not link "why" "${item}" to strategy "${strategyData.Name}": ${whyJunctionError.message}`)
          }
        }
      }
    }

    // 5. Handle tag relationships (create tags as needed since they're more flexible)
    const tagFields = [
      'cultural_context_tags', 'energy_state_tags', 'identity_tags', 
      'solution_type_tags', 'strategy_style_tags', 'task_context_tags', 
      'life_role_tags', 'life_transition_tags', 'mental_state_tags', 
      'treatment_context_tags'
    ]

    for (const field of tagFields) {
      const tagValue = strategyData[field]
      if (tagValue && tagValue.trim()) {
        const tags = tagValue.split(',').map((tag: string) => tag.trim().replace(/^["']|["']$/g, '')).filter((tag: string) => tag)
        
        for (const tag of tags) {
          try {
            // For tags, we can create new ones since they're flexible
            let tagId = await findExistingId('tags', tag)
            
            if (!tagId) {
              const { data: newTag, error: tagInsertError } = await supabase
                .from('tags')
                .insert({
                  name: tag,
                  category: field.replace('_tags', '')
                })
                .select('id')
                .single()

              if (tagInsertError) {
                console.warn(`Warning: Could not create tag "${tag}": ${tagInsertError.message}`)
                continue
              }
              tagId = newTag.id
            }

            const { error: tagJunctionError } = await supabase
              .from('strategy_tags')
              .insert({
                strategy_id: strategyId,
                tag_id: tagId
              })

            if (tagJunctionError && tagJunctionError.code !== '23505') {
              console.warn(`Warning: Could not link tag "${tag}" to strategy "${strategyData.Name}": ${tagJunctionError.message}`)
            }
          } catch (err) {
            console.warn(`Warning: Failed to process tag "${tag}" for strategy "${strategyData.Name}":`, err)
          }
        }
      }
    }

    console.log(`✅ Imported: ${strategyData.Name}`)

  } catch (error) {
    console.error(`❌ Failed to import strategy "${strategyData.Name}":`, error)
    throw error
  }
}

// Main import function
async function importCleanStrategies() {
  try {
    await testConnection()

    console.log('📂 Reading CSV file...')
    const csvFilePath = path.join(__dirname, '..', 'strategies_7_19_update.csv')
    
    if (!fs.existsSync(csvFilePath)) {
      console.error(`❌ CSV file not found: ${csvFilePath}`)
      process.exit(1)
    }

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

    console.log(`📊 Found ${strategies.length} strategies to import`)

    // Check existing count
    const { count: existingCount } = await supabase
      .from('strategies')
      .select('*', { count: 'exact', head: true })

    console.log(`📋 Existing strategies in database: ${existingCount || 0}`)

    // Import strategies
    console.log('🚀 Starting import (only linking to existing lookup entries)...')
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i]
      
      try {
        await insertStrategy(strategy)
        successCount++
        
        if ((i + 1) % 25 === 0) {
          console.log(`📈 Progress: ${i + 1}/${strategies.length} strategies processed`)
        }
      } catch (error) {
        errorCount++
        console.error(`❌ Error importing strategy ${i + 1}:`, error)
      }
    }

    // Final summary
    console.log('\n🎉 Import completed!')
    console.log(`✅ Successfully imported: ${successCount} strategies`)
    if (errorCount > 0) {
      console.log(`❌ Failed imports: ${errorCount}`)
    }

    // Verify final count
    const { count: finalCount } = await supabase
      .from('strategies')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Total strategies in database: ${finalCount || 0}`)

    console.log('\n📝 Import Notes:')
    console.log('  • Descriptions and examples should now import properly')
    console.log('  • Only linked to existing lookup table entries (no duplicates created)')
    console.log('  • Warnings shown for any missing lookup entries')
    console.log('  • Tags created as needed (they are flexible)')

  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

// Run the import
console.log('🎯 ADHD First Aid Kit - Clean Strategies Import')
console.log('===============================================')
importCleanStrategies().catch(console.error)