#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(url, key)

async function main(){
  const taskName = 'Bills & Money'

  const newReasons: string[] = [
    'You might:',
    '- Avoid opening bills or statements',
    '- Miss payment due dates or pay last minute',
    '- Start a budget, then abandon it',
    '- Feel paralyzed by spreadsheets or numbers',
    '− Beat yourself up for being “behind”',
    "Here's what's really going on:",
    '🧩 **Executive dysfunction** — makes organization and follow-through harder',
    '⏰ **Time blindness** — due dates feel abstract; late fees sneak up',
    '🧠 **Working memory** — forget what was scheduled or paid',
    '😣 **Shame/avoidance** — money tasks trigger fear, so you shut down',
    '🎯 **Decision fatigue** — too many choices or categories stalls action',
  ]

  const { data, error } = await supabase
    .from('tasks_content')
    .select('id, task_name')
    .eq('task_name', taskName)
    .single()

  if (error || !data){
    throw new Error('Could not find task row for ' + taskName + ': ' + (error?.message || 'not found'))
  }

  const { error: updErr } = await supabase
    .from('tasks_content')
    .update({ adhd_reasons: newReasons })
    .eq('id', data.id)

  if (updErr){
    throw new Error('Update failed: ' + updErr.message)
  }
  console.log('✅ Updated ADHD reasons for', taskName)
}

main().catch(err => { console.error(err); process.exit(1) })

