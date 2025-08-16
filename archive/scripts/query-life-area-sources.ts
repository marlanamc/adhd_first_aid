#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const slug = process.argv[2] || 'staying-on-top-of-classwork'

async function main() {
  console.log('Querying life_areas_sources for slug:', slug)
  const { data, error, count } = await supabase
    .from('life_areas_sources')
    .select('*', { count: 'exact' })
    .eq('life_area_slug', slug)

  if (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }

  console.log('Count:', count)
  if (!data || data.length === 0) {
    console.log('No rows found')
    return
  }

  for (const row of data) {
    console.log(`- (${row.id}) [${row.category}] ${row.title} — ${row.authors || ''}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })

