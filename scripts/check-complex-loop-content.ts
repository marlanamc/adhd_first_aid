#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main(){
  const target = process.argv[2] || "Can't Fall Asleep"
  console.log('Checking complex_loops_content for:', target)

  const exact = await supabase.from('complex_loops_content').select('id, loop_name').eq('loop_name', target)
  console.log('Exact matches:', exact.data?.length, exact.error?.message)
  console.log(exact.data)

  const ilike = await supabase.from('complex_loops_content').select('id, loop_name').ilike('loop_name', target)
  console.log('ILIKE matches:', ilike.data?.length, ilike.error?.message)
  console.log(ilike.data)

  const like = await supabase.from('complex_loops_content').select('id, loop_name').ilike('loop_name', `%${target.split(' ')[0]}%`)
  console.log('Partial ILIKE matches (first word):', like.data?.length)
  console.log(like.data)
}

main().catch(err=>{ console.error(err); process.exit(1) })