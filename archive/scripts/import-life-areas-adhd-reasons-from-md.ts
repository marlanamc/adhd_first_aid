#!/usr/bin/env tsx
/*
  Import ADHD Reasons for life_areas from a curated markdown file.
  Input default: life_areas_adhd_reasons.md at repo root
  Behavior:
    - Parse each section "## 🧠 ADHD Reasons — <Name>"
    - Extract You might list and Right reasons list
    - Strip trailing "(matches …)" notes from right bodies
    - Left bullets: remove emoji/markdown; keep short text (title — subtitle if present)
    - Right bullets: keep one emoji + **Heading**: body (no match note)
    - Write back to Supabase tasks_content.adhd_reasons for the matched page
  Flags: --apply, --slug=<slug>, --file=<path>
*/

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type PageBlock = { name: string; you: string[]; real: string[] }

function toSlug(name: string){
  return (name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$|--+/g,'-')
}

function parseFile(filePath: string, singleSlug?: string): PageBlock[] {
  const raw = fs.readFileSync(filePath, 'utf8')
  const lines = raw.split(/\r?\n/)
  const pages: PageBlock[] = []
  let current: PageBlock | null = null
  let mode: ''|'you'|'real' = ''
  for (let i=0;i<lines.length;i++){
    const line = lines[i]
    const h = line.match(/^##\s*.*?ADHD Reasons\s*—\s*(.+?)\s*$/)
    if (h){
      if (current && (!singleSlug || toSlug(current.name).includes(singleSlug) || singleSlug.includes(toSlug(current.name)))){
        pages.push(current)
      } else if (current && !singleSlug){
        pages.push(current)
      }
      current = { name: h[1].trim(), you: [], real: [] }
      mode = ''
      continue
    }
    if (!current) continue
    if (/^\*\*\s*📌\s*You might:\s*\*\*/i.test(line)){ mode = 'you'; continue }
    if (/^\*\*\s*🧠\s*Here(?:’|')s what(?:’|')s really going on:\s*\*\*/i.test(line)){ mode = 'real'; continue }
    if (/^---\s*$/.test(line)){ mode = ''; continue }
    if (/^\s*-\s+/.test(line)){
      if (mode === 'you') current.you.push(line.trim())
      if (mode === 'real') current.real.push(line.trim())
    }
  }
  if (current && (!singleSlug || toSlug(current.name).includes(singleSlug) || singleSlug.includes(toSlug(current.name)))) pages.push(current)
  return pages
}

function cleanLeft(bullet: string): string{
  // Example: "- 🚫 **Open your laptop… and just stare** — Everything feels too big to begin."
  let s = bullet.replace(/^\s*-\s+/,'').trim()
  s = s.replace(/^[\p{Extended_Pictographic}\u2600-\u27BF]\s*/u,'')
  const m = s.match(/^\*\*(.*?)\*\*\s*[—-]\s*(.*)$/)
  if (m){
    const title = m[1].trim()
    const sub = m[2].trim()
    return sub ? `${title} — ${sub}` : title
  }
  // Fallback: strip markdown
  s = s.replace(/\*\*/g,'')
  return s
}

function cleanRight(bullet: string): string{
  // Keep: - ⏰ **Time blindness**: body (strip any _(matches ... )_ wherever it appears)
  let s = bullet.replace(/^\s*-\s+/,'').trim()
  // Extract emoji
  const emoji = (s.match(/^[\p{Extended_Pictographic}\u2600-\u27BF]/u)?.[0]) || '💡'
  s = s.replace(/^[\p{Extended_Pictographic}\u2600-\u27BF]\s*/u,'')
  // Split heading/body
  const m = s.match(/^\*\*(.*?)\*\*[:：]?\s*(.*)$/)
  let heading = m ? m[1].trim() : s
  let body = m ? (m[2]||'').trim() : ''
  // Remove match annotations wherever found
  body = body.replace(/\s*_?\(matches[\s\S]*?\)_?\s*/ig,' ').trim()
  // Ensure colon
  if (!/[:：]$/.test(heading)) heading = heading.replace(/[—–-]+\s*$/,'').trim()
  const out = `- ${emoji} **${heading}**: ${body}`
  return out
}

function buildReasons(you: string[], real: string[]): string[]{
  const left = you.map(cleanLeft)
  const right = real.map(cleanRight)
  return ['You might:', ...left.map(l=>`- ${l}`), "Here's what's really going on:", ...right]
}

async function main(){
  const APPLY = process.argv.includes('--apply')
  const fileArg = (process.argv.find(a=>a.startsWith('--file='))||'').split('=')[1]
  const slugArg = (process.argv.find(a=>a.startsWith('--slug='))||'').split('=')[1]
  const filePath = fileArg ? path.resolve(fileArg) : path.resolve(process.cwd(), 'life_areas_adhd_reasons.md')
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`)

  const pages = parseFile(filePath, slugArg)
  if (pages.length === 0) { console.log('No sections parsed'); return }

  // Fetch all tasks to match
  const { data: tasks, error } = await supabase.from('tasks_content').select('id, task_name, adhd_reasons')
  if (error || !tasks) throw new Error(error?.message || 'fetch tasks failed')
  const bySlug = new Map<string, any>()
  for (const t of tasks){ bySlug.set(toSlug(t.task_name), t) }

  for (const p of pages){
    const headerSlug = toSlug(p.name)
    let match = tasks.find(t => toSlug(t.task_name).includes(headerSlug) || headerSlug.includes(toSlug(t.task_name)))
    if (!match){ console.warn('No task match for', p.name); continue }
    const rebuilt = buildReasons(p.you, p.real)
    if (!APPLY){
      console.log(`Would update: ${match.task_name} (${headerSlug})`)      
      continue
    }
    const { error: updErr } = await supabase.from('tasks_content').update({ adhd_reasons: rebuilt }).eq('id', match.id)
    if (updErr) console.error('Update failed', match.task_name, updErr.message)
    else console.log('✅ Updated', match.task_name)
  }
}

main().catch(e=>{ console.error(e); process.exit(1) })

