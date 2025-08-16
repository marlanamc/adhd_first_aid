#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function normalize(s: string){
  return s.replace(/\r/g,'').replace(/\t/g,'  ').trimEnd()
}

function parseMarkdown(md: string){
  const lines = normalize(md).split('\n')

  // Extract ADHD reasons section
  const reasonsStart = lines.findIndex(l => /^###\s+.*Why Big Exam Prep Is Hard/i.test(l))
  if (reasonsStart === -1) throw new Error('Reasons heading not found')
  let i = reasonsStart + 1
  const reasons: string[] = []

  // Find "You might:" block
  while (i < lines.length && !/^-\s+You might:/i.test(lines[i])) i++
  if (i < lines.length){
    reasons.push('You might:')
    i++
    while (i < lines.length){
      const ln = lines[i]
      if (/^\s*-\s+Here\u2019s what\u2019s really going on:|^\s*-\s+Here'?s what'?s really going on:/i.test(ln)) break
      if (/^\s*-\s+/.test(ln)) reasons.push(ln)
      i++
    }
  }
  // Find "Here's what's really going on:" block
  while (i < lines.length && !/^\s*-\s+Here\u2019s what\u2019s really going on:|^\s*-\s+Here'?s what'?s really going on:/i.test(lines[i])) i++
  if (i < lines.length){
    reasons.push("Here's what's really going on:")
    i++
    while (i < lines.length){
      const ln = lines[i]
      if (/^###\s+/.test(ln)) break
      if (/^\s*-\s+/.test(ln)) reasons.push(ln.replace(/^\s*-\s+/, ''))
      i++
    }
  }

  // Extract content sections
  function collectList(start: number): { items: string[]; next: number }{
    const items: string[] = []
    let j = start
    while (j < lines.length){
      const ln = lines[j]
      if (/^\s*####\s+/.test(ln) || /^\s*###\s+/.test(ln)) break
      if (/^\s*>\s+/.test(ln)) items.push(ln)
      if (/^\s*-\s+/.test(ln)) items.push(ln)
      j++
    }
    return { items, next: j }
  }

  const sections: any[] = []

  // Core Principles
  const coreIx = lines.findIndex(l => /^###\s+.*Core Principles/i.test(l))
  if (coreIx !== -1){
    const { items, next } = collectList(coreIx + 1)
    sections.push({ emoji: '⚓', title: 'Core Principles', content: items.map(s=>s.replace(/^\s*-\s+/, '')) })
    i = next
  }

  // Strategies (parent + subsections)
  const stratIx = lines.findIndex(l => /^###\s+.*Strategies for Big Exam Prep/i.test(l))
  if (stratIx !== -1){
    const subsections: Array<{ title: string; emoji: string; content: string[] }> = []
    let k = stratIx + 1
    while (k < lines.length){
      const h = lines[k]
      if (/^###\s+/.test(h)) break
      const m = h.match(/^\s*####\s+([\u{1F300}-\u{1FAD6}\u2600-\u27BF])\s*(.+)$/u)
      if (m){
        const emoji = m[1]
        const title = m[2].trim()
        const { items, next } = collectList(k + 1)
        subsections.push({ title, emoji, content: items.map(s=>s.replace(/^\s*-\s+/, '')) })
        k = next
        continue
      }
      k++
    }
    sections.push({ emoji: '🛠️', title: 'Strategies for Big Exam Prep', subsections })
  }

  // Big Exams ≠ Morality
  const moralIx = lines.findIndex(l => /^###\s+.*Big Exams/i.test(l))
  if (moralIx !== -1){
    const { items } = collectList(moralIx + 1)
    sections.push({ emoji: '🧭', title: 'Big Exams ≠ Morality', content: items.map(s=>s.replace(/^\s*-\s+/, '')) })
  }

  // Encouragement
  const encIx = lines.findIndex(l => /^###\s+.*Encouragement/i.test(l))
  if (encIx !== -1){
    const { items } = collectList(encIx + 1)
    sections.push({ emoji: '✨', title: 'Encouragement to Take With You', content: items.map(s=>s.replace(/^\s*-\s+/, '')) })
  }

  return { reasons, sections }
}

async function main(){
  const file = path.join(process.cwd(), 'life_areas', 'big_exam_prep.md')
  if (!fs.existsSync(file)){
    throw new Error('Markdown not found at ' + file)
  }
  const md = fs.readFileSync(file, 'utf8')
  const { reasons, sections } = parseMarkdown(md)

  const taskName = 'Big Exam Prep (Long-Term Studying)'
  const { data, error } = await supabase
    .from('tasks_content')
    .select('id, task_name')
    .eq('task_name', taskName)
    .single()

  if (error || !data){
    throw new Error('Failed to find task row: ' + (error?.message || 'not found'))
  }

  const { error: updErr } = await supabase
    .from('tasks_content')
    .update({ adhd_reasons: reasons, content_sections: sections })
    .eq('id', data.id)

  if (updErr){
    throw new Error('Update failed: ' + updErr.message)
  }
  console.log('✅ Restored ADHD reasons and content_sections from markdown for', taskName)
}

main().catch(err => { console.error(err); process.exit(1) })

