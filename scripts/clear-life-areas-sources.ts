#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
  console.log('🧹 Clearing life_areas_sources table...')
  const { data: rows, error: selErr } = await supabase
    .from('life_areas_sources')
    .select('id')

  if (selErr) {
    console.error('❌ Failed to list rows:', selErr.message)
    process.exit(1)
  }

  const ids = (rows || []).map((r: any) => r.id)
  console.log('Found rows:', ids.length)

  const chunkSize = 500
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize)
    const { error: delErr } = await supabase
      .from('life_areas_sources')
      .delete()
      .in('id', chunk)
    if (delErr) {
      console.error('❌ Delete error:', delErr.message)
      process.exit(1)
    }
    console.log(`Deleted ${i + chunk.length}/${ids.length}`)
  }

  const { count } = await supabase
    .from('life_areas_sources')
    .select('*', { count: 'exact', head: true })

  console.log('✅ Cleared. Remaining rows:', count)
}

main().catch((err) => { console.error(err); process.exit(1) })

