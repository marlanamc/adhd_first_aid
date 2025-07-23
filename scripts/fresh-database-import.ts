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
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseKey ? 'present' : 'missing'
  })
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
      console.log('💡 Make sure you:')
      console.log('   1. Ran the complete-schema.sql script in Supabase SQL Editor')
      console.log('   2. Have correct SUPABASE_URL and SUPABASE_ANON_KEY in .env.local')
      process.exit(1)
    }
    console.log('✅ Database connection successful!')
    return true
  } catch (err) {
    console.error('❌ Connection test failed:', err)
    process.exit(1)
  }
}

// Name mappings to match CSV data with schema data
const nameMappings: Record<string, Record<string, string>> = {
  feelings: {
    'Burned out': 'Burned Out'  // CSV uses "Burned out", schema uses "Burned Out"
  },
  help_tasks: {
    // Map CSV technical terms to user-friendly schema terms
    'Task Initiation': 'Starting Something Hard',
    'Emotional Dysregulation': 'Managing Emotional Dysregulation', 
    'Decision Fatigue': 'Prioritizing When Everything Feels Urgent',
    'Executive Dysfunction': 'Breaking Down Big Projects',
    'Poor Time Estimation': 'Planning My Time',
    'Working Memory Engagement': 'Staying Focused',
    'Inertia': 'Overcoming Procrastination',
    'Time Blindness': 'Managing My Schedule',
    'Task Structuring': 'Breaking Down Big Projects'
  },
  issues: {
    // Map CSV technical terms to user-friendly schema terms
    'Task Initiation': 'Can\'t Start',
    'Working Memory Engagement': 'Can\'t Focus',
    'Task Structuring': 'Can\'t Start',
    'Time Blindness': 'Time Blind',
    'Executive Dysfunction': 'Can\'t Start',
    'Emotional Dysregulation': 'Spiraling',
    'Inertia': 'Frozen/Shut Down'
  },
  why_does_this_work: {
    // Clean up quote issues and map to schema terms
    'Externalizes Tasks': 'Externalizes Tasks',
    '"Externalizes Tasks': 'Externalizes Tasks',
    'Externalizes Tasks"': 'Externalizes Tasks',
    'Breaks Down Complexity': 'Breaks Down Complexity',
    '"Breaks Down Complexity': 'Breaks Down Complexity',
    'Breaks Down Complexity"': 'Breaks Down Complexity',
    'Frees Up Working Memory': 'Frees Up Working Memory',
    '"Frees Up Working Memory': 'Frees Up Working Memory',
    'Frees Up Working Memory"': 'Frees Up Working Memory',
    'Dopamine Activation': 'Activates Dopamine',
    '"Dopamine Activation': 'Activates Dopamine',
    'Dopamine Activation"': 'Activates Dopamine',
    'Emotional Regulation': 'Emotional Regulation',
    '"Emotional Regulation': 'Emotional Regulation',
    'Emotional Regulation"': 'Emotional Regulation',
    'Gamifies Action': 'Gamifies Action',
    '"Gamifies Action': 'Gamifies Action',
    'Gamifies Action"': 'Gamifies Action',
    'Working Memory Failures': 'Frees Up Working Memory'
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

  // Apply name mapping if exists
  const mappedName = nameMappings[table]?.[name.trim()] || name.trim()

  // Clean the name and try exact match first
  const { data, error } = await supabase
    .from(table)
    .select('id')
    .eq('name', mappedName)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.warn(`Warning: Error looking up ${table} for "${mappedName}": ${error.message}`)
    return null
  }

  if (data) {
    return data.id
  }

  // If exact match fails, try case-insensitive search
  const { data: caseInsensitiveData, error: caseError } = await supabase
    .from(table)
    .select('id, name')
    .ilike('name', mappedName)
    .limit(1)

  if (caseError) {
    console.warn(`Warning: Case-insensitive lookup failed for ${table} "${mappedName}": ${caseError.message}`)
    return null
  }

  if (caseInsensitiveData && caseInsensitiveData.length > 0) {
    console.log(`📝 Found case-insensitive match: "${mappedName}" → "${caseInsensitiveData[0].name}"`)
    return caseInsensitiveData[0].id
  }

  console.warn(`⚠️  No existing entry found in ${table} for: "${mappedName}"`)
  return null
}

// Insert strategy with relationships
async function insertStrategy(strategyData: any): Promise<void> {
  try {
    // 1. Check if strategy already exists
    const { data: existingStrategy, error: existsError } = await supabase
      .from('strategies')
      .select('id, name')
      .eq('name', strategyData.Name)
      .single()

    if (existsError && existsError.code !== 'PGRST116') {
      console.warn(`Warning: Error checking if strategy exists: ${existsError.message}`)
    }

    if (existingStrategy) {
      console.log(`⏭️  Skipped: "${strategyData.Name}" (already exists)`)
      return
    }

    // 2. Insert the main strategy record
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

    // 3. Handle relationships (with comma-separated support for issues and barriers)
    const singleValueRelationships = [
      { table: 'feelings' as const, fields: ['feeling_1', 'feeling_2'], junction: 'strategy_feelings' },
      { table: 'help_tasks' as const, fields: ['help_task'], junction: 'strategy_help_tasks' }
    ]

    const multiValueRelationships = [
      { table: 'issues' as const, field: 'issues', junction: 'strategy_issues' },
      { table: 'barriers' as const, field: 'barrier', junction: 'strategy_barriers' }
    ]

    // Handle single-value relationships (feelings, help_tasks)
    for (const rel of singleValueRelationships) {
      for (const field of rel.fields) {
        const value = strategyData[field]
        if (value && value.trim()) {
          const relatedId = await findExistingId(rel.table, value.trim())
          if (relatedId) {
            // Insert junction table relationship
            const junctionData = {
              strategy_id: strategyId,
              [`${rel.table.slice(0, -1)}_id`]: relatedId // Remove 's' and add '_id'
            }

            const { error: junctionError } = await supabase
              .from(rel.junction)
              .insert(junctionData)

            if (junctionError && junctionError.code !== '23505') { // Ignore duplicates
              console.warn(`Warning: Could not link ${rel.table} "${value}" to strategy "${strategyData.Name}": ${junctionError.message}`)
            }
          }
        }
      }
    }

    // Handle multi-value relationships (issues, barriers) - split by comma
    for (const rel of multiValueRelationships) {
      const value = strategyData[rel.field]
      if (value && value.trim()) {
        // Split by comma and process each item
        const items = value.split(',').map((item: string) => item.trim()).filter((item: string) => item)
        
        for (const item of items) {
          const relatedId = await findExistingId(rel.table, item)
          if (relatedId) {
            // Insert junction table relationship
            const junctionData = {
              strategy_id: strategyId,
              [`${rel.table.slice(0, -1)}_id`]: relatedId // Remove 's' and add '_id'
            }

            const { error: junctionError } = await supabase
              .from(rel.junction)
              .insert(junctionData)

            if (junctionError && junctionError.code !== '23505') { // Ignore duplicates
              console.warn(`Warning: Could not link ${rel.table} "${item}" to strategy "${strategyData.Name}": ${junctionError.message}`)
            }
          }
        }
      }
    }

    // 3. Handle styles table (from strategy_style_tags field)
    const styleValue = strategyData.strategy_style_tags
    if (styleValue && styleValue.trim()) {
      const styles = styleValue.split(',').map((style: string) => style.trim().replace(/^["']|["']$/g, '')).filter((style: string) => style)
      
      for (const style of styles) {
        const styleId = await findExistingId('styles', style)
        if (styleId) {
          const { error: styleJunctionError } = await supabase
            .from('strategy_styles')
            .insert({
              strategy_id: strategyId,
              style_id: styleId
            })

          if (styleJunctionError && styleJunctionError.code !== '23505') {
            console.warn(`Warning: Could not link style "${style}" to strategy "${strategyData.Name}": ${styleJunctionError.message}`)
          }
        }
      }
    }

    // 4. Handle tag relationships (special handling for comma-separated values)
    const tagFields = [
      'cultural_context_tags', 'energy_state_tags', 'identity_tags', 
      'solution_type_tags', 'task_context_tags', 
      'life_role_tags', 'life_transition_tags', 'mental_state_tags', 
      'treatment_context_tags'
    ]

    for (const field of tagFields) {
      const tagValue = strategyData[field]
      if (tagValue && tagValue.trim()) {
        // Split by comma and process each tag
        const tags = tagValue.split(',').map((tag: string) => tag.trim().replace(/^["']|["']$/g, '')).filter((tag: string) => tag)
        
        for (const tag of tags) {
          // For tags, we still create new ones since they're flexible
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
        }
      }
    }

    // 5. Handle solution_types table (from solution_type_tags field)
    const solutionTypeValue = strategyData.solution_type_tags
    if (solutionTypeValue && solutionTypeValue.trim()) {
      const solutionTypes = solutionTypeValue.split(',').map((type: string) => type.trim().replace(/^["']|["']$/g, '')).filter((type: string) => type)
      
      for (const solutionType of solutionTypes) {
        const solutionTypeId = await findExistingId('solution_types', solutionType)
        if (solutionTypeId) {
          const { error: solutionTypeJunctionError } = await supabase
            .from('strategy_solution_types')
            .insert({
              strategy_id: strategyId,
              solution_type_id: solutionTypeId
            })

          if (solutionTypeJunctionError && solutionTypeJunctionError.code !== '23505') {
            console.warn(`Warning: Could not link solution type "${solutionType}" to strategy "${strategyData.Name}": ${solutionTypeJunctionError.message}`)
          }
        }
      }
    }

    // 6. Handle "why does this work" relationships
    const whyValue = strategyData.why_does_this_work_AI
    if (whyValue && whyValue.trim()) {
      const whyItems = whyValue.split(',').map((item: string) => item.trim().replace(/^["']|["']$/g, '')).filter((item: string) => item)
      
      for (const item of whyItems) {
        const whyId = await findExistingId('why_does_this_work', item)
        if (whyId) {
          const { error: whyJunctionError } = await supabase
            .from('strategy_why_does_this_work')
            .insert({
              strategy_id: strategyId,
              why_id: whyId
            })

          if (whyJunctionError && whyJunctionError.code !== '23505') {
            console.warn(`Warning: Could not link "why" "${item}" to strategy "${strategyData.Name}": ${whyJunctionError.message}`)
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
async function importData() {
  try {
    // Test connection first
    await testConnection()

    console.log('📂 Reading CSV file...')
    const csvFilePath = path.join(__dirname, '..', 'Strategies_ADHDFriendly_valid_icons.csv')
    
    if (!fs.existsSync(csvFilePath)) {
      console.error(`❌ CSV file not found: ${csvFilePath}`)
      console.log('💡 Make sure the file "Strategies_ADHDFriendly_valid_icons.csv" exists in the project root')
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

    // Check if database is empty
    const { count: existingCount, error: countError } = await supabase
      .from('strategies')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Could not check existing strategies:', countError.message)
      process.exit(1)
    }
    console.log(`📋 Existing strategies in database: ${existingCount || 0}`)

    if ((existingCount || 0) > 0) {
      console.log('⚠️  Database contains existing strategies. This script is optimized for fresh databases.')
      console.log('💡 If you want to clear the database first, uncomment the DROP statements in complete-schema.sql')
    }

    // Import strategies
    console.log('🚀 Starting import...')
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i]
      
      try {
        await insertStrategy(strategy)
        successCount++
        
        // Progress update every 25 strategies
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

  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

// Run the import
console.log('🎯 ADHD First Aid Kit - Fresh Database Import')
console.log('===============================================')
importData().catch(console.error)