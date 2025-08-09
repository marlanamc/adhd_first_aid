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

async function main() {
  const taskName = 'Big Exam Prep (Long-Term Studying)'
  const newIntro = `It’s a battle against **time blindness**, **working memory gaps**, and **mental fatigue**.

Studying for a big exam with ADHD isn’t about willpower — it’s about designing supports your brain can lean on. Start tiny, make it visible, and let momentum build.`

  const { data: row, error: fetchErr } = await supabase
    .from('tasks_content')
    .select('id, intro_paragraph, task_name')
    .eq('task_name', taskName)
    .single()

  if (fetchErr) {
    console.error('Fetch error:', fetchErr.message)
    process.exit(1)
  }
  if (!row) {
    console.error('Task not found:', taskName)
    process.exit(1)
  }

  const { error: updErr } = await supabase
    .from('tasks_content')
    .update({ intro_paragraph: newIntro })
    .eq('id', row.id)

  if (updErr) {
    console.error('Update error:', updErr.message)
    process.exit(1)
  }

  console.log('Updated intro for:', taskName)
}

main().catch(e => { console.error(e); process.exit(1) })

