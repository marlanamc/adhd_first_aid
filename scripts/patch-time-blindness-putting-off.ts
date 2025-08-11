#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(url, key)

const TARGET_LABEL = /\*\*time blindness\*\*/iu
const SHOULD_REWRITE = (s: string) => /pace yourself|weeks? or months?|time feels fuzzy/i.test(s)
const NEW_DESC = "the future feels far away; 'later' keeps winning. You put it off until urgency hits."

function rewriteLine(line: string): string | null {
  const m = line.match(/^(\s*\p{Extended_Pictographic}?\s*\*\*time blindness\*\*[:：]?\s*)(.*)$/iu)
  if (!m) return null
  const [, prefix, rest] = m
  if (!SHOULD_REWRITE(rest)) return null
  return `${prefix}${NEW_DESC}`
}

async function patchTasks(){
  const { data, error } = await supabase
    .from('tasks_content')
    .select('id, task_name, adhd_reasons')
  if (error || !data) {
    console.error('Fetch error for tasks_content', error?.message)
    return
  }
  for (const row of data as any[]) {
    const reasons: string[] = row.adhd_reasons || []
    let changed = false
    for (let i = 0; i < reasons.length; i++) {
      const updated = rewriteLine(reasons[i])
      if (updated) { reasons[i] = updated; changed = true }
    }
    if (changed) {
      const { error: updErr } = await supabase
        .from('tasks_content')
        .update({ adhd_reasons: reasons })
        .eq('id', row.id)
      if (updErr) console.error('Update failed tasks_content', row.task_name, updErr.message)
      else console.log('✅ Updated tasks_content', row.task_name)
    }
  }
}

async function patchLoops(){
  const { data, error } = await supabase
    .from('complex_loops_content')
    .select('id, loop_name, adhd_reasons')
  if (error || !data) {
    console.error('Fetch error for complex_loops_content', error?.message)
    return
  }
  for (const row of data as any[]) {
    const reasons: string[] = row.adhd_reasons || []
    let changed = false
    for (let i = 0; i < reasons.length; i++) {
      const updated = rewriteLine(reasons[i])
      if (updated) { reasons[i] = updated; changed = true }
    }
    if (changed) {
      const { error: updErr } = await supabase
        .from('complex_loops_content')
        .update({ adhd_reasons: reasons })
        .eq('id', row.id)
      if (updErr) console.error('Update failed complex_loops_content', row.loop_name, updErr.message)
      else console.log('✅ Updated complex_loops_content', row.loop_name)
    }
  }
}

async function main(){
  await patchTasks()
  await patchLoops()
}

main().catch((e)=>{ console.error(e); process.exit(1) })

