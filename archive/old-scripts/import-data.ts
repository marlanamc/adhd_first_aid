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

// 🔁 Get or insert ID from any lookup table
async function getOrInsertId(
  table: 'feelings' | 'issues' | 'barriers' | 'help_tasks' | 'tags' | 'life_roles' | 'solution_types' | 'styles' | 'why_does_this_work',
  name: string,
  additionalData: Record<string, any> = {}
): Promise<string> {
  if (!name || name.trim() === '') {
    throw new Error(`Cannot insert empty name into ${table}`)
  }

  const { data, error } = await supabase
    .from(table)
    .select('id')
    .eq('name', name.trim())
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error checking ${table} for "${name}": ${error.message}`)
  }

  if (data) return data.id

  const insertData = {
    name: name.trim(),
    ...additionalData
  }

  const { data: inserted, error: insertError } = await supabase
    .from(table)
    .insert(insertData)
    .select()
    .single()

  if (insertError || !inserted) {
    throw new Error(`Error inserting into ${table}: ${insertError?.message}`)
  }

  return inserted.id
}

// 📦 Handle comma-separated fields or raw arrays
function parseArrayField(field: string | undefined): string[] {
  if (!field) return []
  if (field.startsWith('[') && field.endsWith(']')) {
    try {
      return JSON.parse(field)
    } catch {
      console.warn('Failed to parse array field:', field)
      return []
    }
  }
  return field.split(',').map(s => s.trim()).filter(Boolean)
}

// 🔤 Normalize text with specific mappings for data consistency
function normalizeDataField(str: string, fieldType: 'feelings' | 'issues' | 'help_tasks' | 'why_does_this_work' | 'barriers' | 'general' = 'general'): string {
  if (!str) return str
  
  // Specific mappings for known mismatches
  const mappings: Record<string, Record<string, string>> = {
    feelings: {
      'burned out': 'Burned Out',
      'burnedout': 'Burned Out',
      'burned_out': 'Burned Out'
    },
    issues: {
      'frozenshutdown': 'Frozen/Shut Down',
      'frozen/shutdown': 'Frozen/Shut Down',
      'frozen shutdown': 'Frozen/Shut Down',
      'cannot finish': "Can't Finish",
      'cant finish': "Can't Finish",
      'can not finish': "Can't Finish",
      'time blindness': 'Time Blind',
      'timeblindness': 'Time Blind',
      'cant decide': "Can't Decide",
      'cannot decide': "Can't Decide",
      'can not decide': "Can't Decide"
    },
    why_does_this_work: {
      'breaking dopwn complexity': 'Breaks Down Complexity',
      'breaking down complexity': 'Breaks Down Complexity',
      'freeing up working memory': 'Frees Up Working Memory',
      'activating dopamine': 'Activates Dopamine',
      'dopamine activation': 'Activates Dopamine',
      'providing instant rewards': 'Provides Instant Rewards',
      'gamifying action': 'Gamifies Action',
      'reducing decision fatigue': 'Reduces Decision Fatigue',
      'providing external structure': 'Provides External Structure',
      'minimizing friction': 'Minimizes Friction',
      'externalizing tasks': 'Externalizes Tasks',
      'reducing shame': 'Reduces Shame',
      'meeting you where you are': 'Meets You Where You Are',
      'building confidence': 'Builds Confidence',
      'helping regulate emotions': 'Helps Regulate Emotions',
      'starting small': 'Starts Small',
      'building momentum': 'Builds Momentum',
      'creating accountability': 'Creates Accountability',
      'cognitive load management': 'Cognitive Load Management',
      'emotional regulation': 'Emotional Regulation',
      'executive function support': 'Executive Function Support',
      'emotional support': 'Emotional Support'
    },
    help_tasks: {
      'task initiation': 'Task Initiation Support',
      'focus task execution': 'Focus Task Execution',
      'focused task execution': 'Focus Task Execution',
      'overcoming resistance': 'Overcoming Resistance',
      'quick task management': 'Quick Task Management'
    }
  }
  
  const normalizedKey = str.toLowerCase().trim()
  const categoryMappings = mappings[fieldType] || {}
  
  // Check for exact mapping first
  if (categoryMappings[normalizedKey]) {
    return categoryMappings[normalizedKey]
  }
  
  // Default to title case if no specific mapping
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

// 🧠 Transform each CSV record into structured data
function transformRecord(record: any) {
  // Extract feelings and ensure they exist in our properties
  const feelings = [record['feeling_1'], record['feeling_2']]
    .filter(Boolean)
    .map(f => normalizeDataField(f.trim(), 'feelings'))
    .filter(f => !!f)

  // Extract issues (now in a single column) with specific normalization
  const issues = parseArrayField(record['issues'])
    .map(issue => normalizeDataField(issue, 'issues'))

  // Process tags by category (updated with new categories)
  const tagsByCategory = {
    task_context: parseArrayField(record['task_context_tags']),
    energy_state: parseArrayField(record['energy_state_tags']),
    mental_state: parseArrayField(record['mental_state_tags']),
    solution_type: parseArrayField(record['solution_type_tags']),
    strategy_style: parseArrayField(record['strategy_style_tags']),
    life_role: parseArrayField(record['life_role_tags']),
    identity: parseArrayField(record['identity_tags']),
    cultural_context: parseArrayField(record['cultural_context_tags']),
    treatment_context: parseArrayField(record['treatment_context_tags']),
    life_transition: parseArrayField(record['life_transition_tags'])
  }

  // Get barrier (fixed field name) with normalization
  const barriers = parseArrayField(record['barrier'])
    .map(barrier => normalizeDataField(barrier, 'barriers'))

  // Get help tasks (support multiple) with specific normalization
  const helpTasks = parseArrayField(record['help_task'])
    .map(task => normalizeDataField(task, 'help_tasks'))

  // Extract why_does_this_work mechanisms with specific normalization
  const whyMechanisms = parseArrayField(record['why_does_this_work_AI'])
    .map(mechanism => normalizeDataField(mechanism, 'why_does_this_work'))

  // Extract life roles
  const lifeRoles = parseArrayField(record['life_role_tags'])

  // Extract solution types
  const solutionTypes = parseArrayField(record['solution_type_tags'])

  // Extract styles
  const styles = parseArrayField(record['strategy_style_tags'])

  return {
    core: {
      name: record['Name']?.trim() || '',
      subtitle: record['subtitle']?.trim() || null,
      description: record['description']?.trim() || '',
      example: record['example']?.trim() || '',
      use_case: record['use_case']?.trim() || null,
      why_does_this_work: record['why_does_this_work_AI']?.trim() || null,
      adhd_friendly_improvement: record['adhd_friendly_improvement']?.trim() || null,
      source: record['source']?.trim() || null,
      icon_file: record['icon_file']?.trim() || null,
      image: record['image']?.trim() || null,
      further_reading_text: record['further_reading_text']?.trim() || null,
      further_reading_url: record['further_reading_url']?.trim() || null,
      price: record['price']?.trim() || null,
      featured: false,
      vote_count: 0
    },
    feelings,
    issues,
    barriers,
    helpTasks,
    whyMechanisms,
    lifeRoles,
    solutionTypes,
    styles,
    tagsByCategory
  }
}

async function importData() {
  try {
    const csvFilePath = path.join(__dirname, '..', 'Strategies_ADHDFriendly_final_with_better_icons.csv')
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8')

    const parser = parse(fileContent, {
      columns: (headers: string[]) => headers.map(h => h.trim()),
      skip_empty_lines: true,
      trim: true
    })

    const records = []
    for await (const record of parser) {
      records.push(transformRecord(record))
    }

    console.log(`Parsed ${records.length} strategies`)

    // 🔍 Check existing strategies and determine what to import
    const { data: existingStrategies, error: checkError } = await supabase
      .from('strategies')
      .select('name')

    if (checkError) {
      throw new Error(`Error checking existing data: ${checkError.message}`)
    }

    const existingNames = new Set(existingStrategies?.map(s => s.name) || [])
    const recordsToImport = records.filter(record => !existingNames.has(record.core.name))

    if (recordsToImport.length === 0) {
      console.log('📋 All strategies already imported!')
      console.log(`✅ Total strategies in database: ${existingNames.size}`)
      
      // Update existing strategies with correct field mappings
      console.log('🔄 Updating existing strategies with correct field mappings...')
      for (const record of records) {
        const { core } = record
        const { error: updateError } = await supabase
          .from('strategies')
          .update({
            subtitle: core.subtitle,
            use_case: core.use_case,
            why_does_this_work: core.why_does_this_work,
            adhd_friendly_improvement: core.adhd_friendly_improvement
          })
          .eq('name', core.name)
        
        if (updateError) {
          console.error(`❌ Failed to update strategy: ${core.name}`, updateError)
        } else {
          console.log(`✅ Updated: ${core.name}`)
        }
      }
      console.log('✅ Finished updating existing strategies')
      return
    }

    console.log(`📊 Import status:`)
    console.log(`   Already imported: ${existingNames.size}`)
    console.log(`   Remaining to import: ${recordsToImport.length}`)
    console.log(`   Total strategies: ${records.length}`)

    // Only clear data if we're starting fresh (no existing strategies)
    if (existingNames.size === 0) {
      // 🧹 Clear old data (only if needed)
      console.log('Clearing existing strategies...')
    try {
      const { error: helpTaskError } = await supabase.from('strategy_help_tasks').delete().neq('strategy_id', '')
      if (helpTaskError) console.log('Note: strategy_help_tasks delete:', helpTaskError.message)
      
      const { error: whyError } = await supabase.from('strategy_why_does_this_work').delete().neq('strategy_id', '')
      if (whyError) console.log('Note: strategy_why_does_this_work delete:', whyError.message)
      
      const { error: styleError } = await supabase.from('strategy_styles').delete().neq('strategy_id', '')
      if (styleError) console.log('Note: strategy_styles delete:', styleError.message)
      
      const { error: solutionError } = await supabase.from('strategy_solution_types').delete().neq('strategy_id', '')
      if (solutionError) console.log('Note: strategy_solution_types delete:', solutionError.message)
      
      const { error: roleError } = await supabase.from('strategy_life_roles').delete().neq('strategy_id', '')
      if (roleError) console.log('Note: strategy_life_roles delete:', roleError.message)
      
      const { error: tagError } = await supabase.from('strategy_tags').delete().neq('strategy_id', '')
      if (tagError) console.log('Note: strategy_tags delete:', tagError.message)
      
      const { error: barrierError } = await supabase.from('strategy_barriers').delete().neq('strategy_id', '')
      if (barrierError) console.log('Note: strategy_barriers delete:', barrierError.message)
      
      const { error: issueError } = await supabase.from('strategy_issues').delete().neq('strategy_id', '')
      if (issueError) console.log('Note: strategy_issues delete:', issueError.message)
      
      const { error: feelingError } = await supabase.from('strategy_feelings').delete().neq('strategy_id', '')
      if (feelingError) console.log('Note: strategy_feelings delete:', feelingError.message)
      
      const { error: strategyError } = await supabase.from('strategies').delete().neq('id', '')
      if (strategyError) console.log('Note: strategies delete:', strategyError.message)
      
        console.log('✅ Cleared existing data')
      } catch (error) {
        console.log('Warning during cleanup:', error)
      }
    } else {
      console.log('🔄 Resuming import from where we left off...')
    }

    // 🚀 Insert new records (only the ones not already imported)
    for (const record of recordsToImport) {
      const { core, feelings, issues, barriers, helpTasks, whyMechanisms, lifeRoles, solutionTypes, styles, tagsByCategory } = record

      // Insert strategy
      const { data: strategyData, error: insertError } = await supabase
        .from('strategies')
        .insert(core)
        .select()
        .single()

      if (insertError || !strategyData) {
        console.error(`❌ Failed to insert strategy: ${core.name}`)
        console.error('InsertError:', insertError)
        console.error('Core object being inserted:', core)
        continue
      }

      const strategyId = strategyData.id
      console.log(`✅ Inserted: ${core.name}`)

      // Insert help tasks if present
      for (const helpTask of helpTasks) {
        if (!helpTask || helpTask.trim() === '') continue
        try {
          const helpTaskId = await getOrInsertId('help_tasks', helpTask)
          await supabase.from('strategy_help_tasks').insert({ strategy_id: strategyId, help_task_id: helpTaskId })
        } catch (err) {
          console.error(`❌ Failed to insert help task for ${core.name}:`, helpTask)
          console.error(err)
        }
      }

      // Insert feelings
      for (const feeling of feelings) {
        if (!feeling || feeling.trim() === '') continue
        try {
          const fId = await getOrInsertId('feelings', feeling)
          await supabase.from('strategy_feelings').insert({ strategy_id: strategyId, feeling_id: fId })
        } catch (err) {
          console.error(`❌ Failed to insert feeling for ${core.name}:`, feeling)
          console.error(err)
        }
      }

      // Insert issues
      for (const issue of issues) {
        if (!issue || issue.trim() === '') continue
        try {
          const iId = await getOrInsertId('issues', issue)
          await supabase.from('strategy_issues').insert({ strategy_id: strategyId, issue_id: iId })
        } catch (err) {
          console.error(`❌ Failed to insert issue for ${core.name}:`, issue)
          console.error(err)
        }
      }

      // Insert barriers
      for (const b of barriers) {
        if (!b || b.trim() === '') continue
        try {
          const bId = await getOrInsertId('barriers', b)
          await supabase.from('strategy_barriers').insert({ strategy_id: strategyId, barrier_id: bId })
        } catch (err) {
          console.error(`❌ Failed to insert barrier for ${core.name}:`, b)
          console.error(err)
        }
      }

      // Insert why mechanisms
      for (const why of whyMechanisms) {
        if (!why || why.trim() === '') continue
        try {
          const whyId = await getOrInsertId('why_does_this_work', why)
          await supabase.from('strategy_why_does_this_work').insert({ strategy_id: strategyId, why_id: whyId })
        } catch (err) {
          console.error(`❌ Failed to insert why mechanism for ${core.name}:`, why)
          console.error(err)
        }
      }

      // Insert life roles
      for (const role of lifeRoles) {
        if (!role || role.trim() === '') continue
        try {
          const roleId = await getOrInsertId('life_roles', role)
          await supabase.from('strategy_life_roles').insert({ strategy_id: strategyId, life_role_id: roleId })
        } catch (err) {
          console.error(`❌ Failed to insert life role for ${core.name}:`, role)
          console.error(err)
        }
      }

      // Insert solution types
      for (const solution of solutionTypes) {
        if (!solution || solution.trim() === '') continue
        try {
          const solutionId = await getOrInsertId('solution_types', solution)
          await supabase.from('strategy_solution_types').insert({ strategy_id: strategyId, solution_type_id: solutionId })
        } catch (err) {
          console.error(`❌ Failed to insert solution type for ${core.name}:`, solution)
          console.error(err)
        }
      }

      // Insert styles
      for (const style of styles) {
        if (!style || style.trim() === '') continue
        try {
          const styleId = await getOrInsertId('styles', style)
          await supabase.from('strategy_styles').insert({ strategy_id: strategyId, style_id: styleId })
        } catch (err) {
          console.error(`❌ Failed to insert style for ${core.name}:`, style)
          console.error(err)
        }
      }

      // Insert remaining tags by category (energy_state, task_context, mental_state, etc.)
      for (const [category, tags] of Object.entries(tagsByCategory)) {
        // Skip categories that now have their own tables
        if (['life_role', 'solution_type', 'strategy_style'].includes(category)) continue
        
        for (const tag of tags) {
          if (!tag || tag.trim() === '') continue
          try {
            const tId = await getOrInsertId('tags', tag, { category })
            await supabase.from('strategy_tags').insert({ strategy_id: strategyId, tag_id: tId })
          } catch (err) {
            console.error(`❌ Failed to insert tag for ${core.name}:`, tag)
            console.error(err)
          }
        }
      }
    }

    console.log(`🎉 Import completed successfully!`)
    console.log(`📊 Final count: ${existingNames.size + recordsToImport.length} total strategies in database`)
  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

// 🔁 Run the script
importData()
