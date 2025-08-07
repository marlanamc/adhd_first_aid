#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const APPLY = process.argv.includes('--apply')

async function main(){
  if (!APPLY){
    console.log('⚠️  Dry run. Pass --apply to actually delete all rows from life_areas_sources.')
  }
  const { count, error } = await supabase.from('life_areas_sources').select('*', { count: 'exact', head: true })
  if (error){ console.error('❌ Count error:', error.message); process.exit(1) }
  console.log('Rows currently in life_areas_sources:', count)
  if (!APPLY) return
  // Use a safe tautology filter to satisfy PostgREST's DELETE requirement
  const { error: delErr } = await supabase.from('life_areas_sources').delete().neq('life_area_slug', '__never__')
  if (delErr){ console.error('❌ Delete error:', delErr.message); process.exit(1) }
  const { count: after } = await supabase.from('life_areas_sources').select('*', { count: 'exact', head: true })
  console.log('✅ Cleared table. Remaining rows:', after)
}

main().catch(err=>{ console.error(err); process.exit(1) })