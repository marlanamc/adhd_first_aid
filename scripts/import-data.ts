import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'


// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseKey ? 'present' : 'missing'
  })
  process.exit(1)
}

console.log('Supabase URL:', supabaseUrl)
const supabase = createClient(supabaseUrl, supabaseKey)

// Add getOrInsertId here
async function getOrInsertId(table: 'feelings' | 'issues' | 'barriers', name: string): Promise<number> {
  const { data, error } = await supabase
    .from(table)
    .select('id')
    .eq('name', name)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error checking ${table} for "${name}": ${error.message}`)
  }

  if (data) return data.id

  // If not found, insert it
  const { data: insertData, error: insertError } = await supabase
    .from(table)
    .insert({ name })
    .select()
    .single()

  if (insertError || !insertData) {
    throw new Error(`Error inserting into ${table}: ${insertError?.message}`)
  }

  return insertData.id
}

// Helper function to parse array fields
function parseArrayField(field: string | undefined): string[] {
  if (!field) return []
  // If the field is already in array format (starts with [ and ends with ])
  if (field.startsWith('[') && field.endsWith(']')) {
    try {
      return JSON.parse(field)
    } catch (e) {
      console.warn('Failed to parse array field:', field)
      return []
    }
  }
  // Otherwise split by comma and clean up
  return field.split(',').map(s => s.trim()).filter(Boolean)
}

// Transform CSV record into database format
function transformRecord(record: any) {
  return {
    core: {
      name: record['name']?.trim() || '',
      description: record['description']?.trim() || '',
      source: record['source']?.trim() || null,
      price: record['price']?.trim() || null,
      tags: parseArrayField(record['tags']),
      use_case: record['use_case']?.trim() || null,
      adhd_friendly_improvement: record['adhd_friendly_improvement']?.trim() || null,
      example: record['example']?.trim() || null,
      featured: record['featured']?.toLowerCase() === 'true',
      votes: parseInt(record['votes']) || 0,
    },
    feelings: parseArrayField(record['feeling']),
    issues: parseArrayField(record['issue']),
    barriers: parseArrayField(record['barrier_type'])
  }
}

async function importData() {
  try {
    // Read and parse CSV file
    const csvFilePath = path.join(__dirname, 'sample.csv')
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8')
    
    console.log('Reading CSV file...')
    const parser = parse(fileContent, {
      columns: (headers: string[]) => {
        console.log('CSV Headers:', headers)
        return headers.map(h => h.trim())
      },
      skip_empty_lines: true,
      trim: true
    })

    const records = []
    for await (const record of parser) {
      records.push(transformRecord(record))
    }

    console.log(`Parsed ${records.length} records from CSV`)
    console.log('First record:', records[0]) // <-- Add here

    // Clear existing data
    console.log('Clearing existing data...')
    await supabase.from('strategy_feelings').delete().neq('strategy_id', 0)
    await supabase.from('strategy_issues').delete().neq('strategy_id', 0)
    await supabase.from('strategy_barriers').delete().neq('strategy_id', 0)
    const { error: deleteError } = await supabase
      .from('strategies')
      .delete()
      .neq('id', 0) // Delete all records

    if (deleteError) {
      throw new Error(`Failed to clear existing data: ${deleteError.message}`)
    }

    console.log('Inserting new data...')

    for (const record of records) {
      const { core, feelings, issues, barriers } = record

      const { data: strategyData, error: insertError } = await supabase
        .from('strategies')
        .insert(core)
        .select()
        .single()

      if (insertError || !strategyData) {
        console.error('Failed to insert strategy:', core.name)
        continue
      }

      const strategyId = strategyData.id

      for (const f of feelings) {
        const fId = await getOrInsertId('feelings', f)
        await supabase.from('strategy_feelings').insert({ strategy_id: strategyId, feeling_id: fId })
      }

      for (const i of issues) {
        const iId = await getOrInsertId('issues', i)
        await supabase.from('strategy_issues').insert({ strategy_id: strategyId, issue_id: iId })
      }

      for (const b of barriers) {
        const bId = await getOrInsertId('barriers', b)
        await supabase.from('strategy_barriers').insert({ strategy_id: strategyId, barrier_id: bId })
      }
    }

    console.log('🎉 All strategies imported successfully')

    console.log(`Successfully imported ${records.length} strategies`)
    console.log('First record:', records[0])
  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

// Run the import
importData()