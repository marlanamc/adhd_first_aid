#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(url, key)

type Patch = { task: string; replacement: string }

const TARGET_DESC = 'makes planning, sequencing, and follow-through harder'

const PATCHES: Patch[] = [
  {
    task: 'Dishes',
    replacement: 'step sequencing (scrape → rinse → load) breaks down; transitions stall'
  },
  {
    task: 'Meal Planning',
    replacement: 'planning horizon + decision load overwhelm; step sequencing stalls'
  },
  {
    task: 'Meal Prepping',
    replacement: 'multi‑step batching strains sequencing and working memory'
  },
  {
    task: 'Trash & Recycling',
    replacement: 'action‑initiation + switching tasks (collect → sort → take out) breaks down'
  }
]

async function patchOne(p: Patch){
  const { data, error } = await supabase
    .from('tasks_content')
    .select('id, task_name, adhd_reasons')
    .eq('task_name', p.task)
    .single()
  if (error || !data) return console.error('Fetch failed for', p.task, error?.message)
  const reasons: string[] = (data as any).adhd_reasons || []
  let current = ''
  let changed = false
  for (let i=0;i<reasons.length;i++){
    const line = reasons[i]
    if (/^here'?s what'?s really going on:/i.test(line)) { current = 'real'; continue }
    if (/^you might:/i.test(line)) { current = 'you'; continue }
    if (current === 'real'){
      const m = line.match(/^\s*\p{Extended_Pictographic}?\s*\*\*(executive dysfunction)\*\*[:：]?\s*(.*)$/iu)
      if (m){
        const desc = (m[2] || '').trim().toLowerCase()
        if (desc === TARGET_DESC.toLowerCase()){
          reasons[i] = line.replace(m[2], p.replacement)
          changed = true
        }
      }
    }
  }
  if (!changed) return console.log('No change needed for', p.task)
  const { error: updErr } = await supabase
    .from('tasks_content')
    .update({ adhd_reasons: reasons })
    .eq('id', (data as any).id)
  if (updErr) return console.error('Update failed for', p.task, updErr.message)
  console.log('✅ Updated', p.task)
}

async function main(){
  for (const p of PATCHES){
    await patchOne(p)
  }
}

main().catch(e=>{ console.error(e); process.exit(1) })

