#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const id = process.argv[2]
const category = process.argv.slice(3).join(' ')

if (!id || !category){
  console.error('Usage: tsx scripts/set-life-area-source-category.ts <id> <category...>')
  process.exit(1)
}

async function main(){
  const { data: before } = await supabase.from('life_areas_sources').select('id, category').eq('id', id)
  console.log('Before:', before)
  const { error } = await supabase.from('life_areas_sources').update({ category }).eq('id', id)
  if (error){
    console.error('Update error:', error.message)
    process.exit(1)
  }
  const { data: after } = await supabase.from('life_areas_sources').select('id, category').eq('id', id)
  console.log('After:', after)
}

main().catch(e => { console.error(e); process.exit(1) })

