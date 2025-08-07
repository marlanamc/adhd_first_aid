#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main(){
  const { count: before } = await supabase.from('complex_loop_sources').select('*', { count: 'exact', head: true })
  console.log('Rows currently in complex_loop_sources:', before)

  // Delete all rows (neq on a non-nullable column is safe)
  const { error } = await supabase.from('complex_loop_sources').delete().neq('id', '')
  if (error) {
    console.error('Delete error:', error.message)
  }

  const { count: after } = await supabase.from('complex_loop_sources').select('*', { count: 'exact', head: true })
  console.log('✅ Cleared table. Remaining rows:', after)
}

main().catch(err=>{ console.error(err); process.exit(1) })