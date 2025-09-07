import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '..', '.env.local') })

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
  table: 'feelings' | 'issues' | 'barriers' | 'help_tasks' | 'tags',
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

// 🧠 Transform each CSV record into structured data
function transformRecord(record: any) {
  // Extract feelings and ensure they exist in our properties
  const feelings = [record['feeling_1'], record['feeling_2']]
    .filter(Boolean)
    .map(f => f.trim())
    .filter(f => !!f)

  // Extract issues
  const issues = [record['issue_1'], record['issue_2'], record['issue_3']]
    .filter(Boolean)
    .map(i => i.trim())
    .filter(i => !!i)

  // Process tags by category
  const tagsByCategory = {
    task_context: parseArrayField(record['task_context_tags']),
    energy_state: parseArrayField(record['energy_state_tags']),
    mental_state: parseArrayField(record['mental_state_tags']),
    solution_type: parseArrayField(record['solution_type_tags']),
    strategy_style: parseArrayField(record['strategy_style_tags'])
  }

  // Get barrier type
  const barriers = parseArrayField(record['barrier_type'])

  // Get help task
  const helpTask = record['help_task']?.trim() || null

  return {
    core: {
      name: record['name']?.trim() || '',
      description: record['description']?.trim() || '',
      example: record['example']?.trim() || '',
      source: record['source']?.trim() || null,
      price: record['price']?.trim() || null,
      use_case: record['use_case']?.trim() || null,
      adhd_friendly_improvement: record['adhd_friendly_improvement']?.trim() || null,
      help_task_id: null as string | null,
      barrier_id: null as string | null
    },
    feelings,
    issues,
    barriers,
    helpTask,
    tagsByCategory
  }
}

async function importData() {
  try {
    const csvFilePath = path.join(__dirname, 'sample.csv')
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

    // 🧹 Clear old data
    console.log('Clearing existing strategies...')
    try {
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

    // 🚀 Insert new records
    for (const record of records) {
      const { core, feelings, issues, barriers, helpTask, tagsByCategory } = record

      // Insert help task if present
      if (helpTask) {
        try {
          const helpTaskId = await getOrInsertId('help_tasks', helpTask)
          core.help_task_id = helpTaskId
        } catch (err) {
          console.error(`❌ Failed to resolve help task for ${core.name}:`, helpTask)
          console.error(err)
        }
      }

      // Insert primary barrier if present
      if (barriers.length > 0 && barriers[0].trim() !== '') {
        try {
          const barrierId = await getOrInsertId('barriers', barriers[0])
          core.barrier_id = barrierId
        } catch (err) {
          console.error(`❌ Failed to resolve barrier for ${core.name}:`, barriers[0])
          console.error(err)
        }
      }

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

      // Insert tags by category
      for (const [category, tags] of Object.entries(tagsByCategory)) {
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

    console.log('🎉 All strategies imported successfully!')
  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

// 🔁 Run the script
importData()
