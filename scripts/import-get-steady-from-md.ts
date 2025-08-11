#!/usr/bin/env tsx
/*
  Import Get Steady Before You Start cards for life_areas from a curated markdown file.
  File format example (per page):
    ### **📚 Big Exam Prep (Long-Term Studying)**
    1. 🫁 **Breathe before you begin**
       Lower anxiety ...
       **Try:** Do one minute ...
  Behavior:
    - Replace (overwrite) the page's Get Steady section (or Core Principles) with exactly 6 cards
    - Use the emoji from the md as the card emoji
    - Lines per card stored as:
        - "- {emoji} **{Title}**: {desc}"
        - "- Try: {try}"
  Flags: --file=<path> (default life_areas_get_steady.md), --apply, --slug=<slug>
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

type Card = { icon: string; title: string; desc: string; try: string }
type PageBlock = { name: string; cards: Card[] }

function toSlug(name: string){
  return (name||'').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$|--+/g,'-')
}

function stripMd(s?: string){
  return String(s||'').replace(/[\*`_]+/g,'').replace(/\s+/g,' ').trim()
}

function parseFile(filePath: string, onlySlug?: string): PageBlock[]{
  const raw = fs.readFileSync(filePath, 'utf8')
  const lines = raw.split(/\r?\n/)
  const pages: PageBlock[] = []
  let current: PageBlock | null = null
  let buffer: string[] = []
  const pushCardFromBuffer = () => {
    if (!current) return
    if (buffer.length === 0) return
    // buffer lines for one numbered item
    // e.g. [ '1. 🫁 **Title**', '  Desc', '  **Try:** Do ...' ]
    const head = buffer[0] || ''
    const headMatch = head.match(/^\s*\d+\.\s*([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2300-\u23FF\u2600-\u26FF\u2700-\u27BF])\s*\*\*(.*?)\*\*/)
    if (!headMatch) { buffer = []; return }
    const icon = headMatch[1]
    const title = stripMd(headMatch[2])
    // description line is the next non-empty
    let desc = stripMd(buffer.slice(1).find(l=>/\S/.test(l)) || '')
    // try line is the first with **Try:**
    const tryLine = buffer.find(l=>/\*\*\s*Try\s*:\s*/i.test(l)) || ''
    const tr = stripMd(tryLine.replace(/\*\*\s*Try\s*:\s*/i, ''))
    current.cards.push({ icon, title, desc, try: tr })
    buffer = []
  }
  for (let i=0;i<lines.length;i++){
    const line = lines[i]
    const h = line.match(/^###\s*\*\*([^*]+)\*\*/)
    if (h){
      // flush any pending card
      pushCardFromBuffer()
      if (current){
        if (!onlySlug || toSlug(current.name) === onlySlug) pages.push(current)
      }
      // strip any leading emoji + space
      const nameRaw = h[1].trim()
      const name = nameRaw.replace(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2300-\u23FF\u2600-\u26FF\u2700-\u27BF])\s+/, '')
      current = { name, cards: [] }
      buffer = []
      continue
    }
    // numbered item head
    if (/^\s*\d+\.\s+/.test(line)){
      pushCardFromBuffer()
      buffer = [line]
      continue
    }
    if (current && buffer.length){
      buffer.push(line)
    }
  }
  pushCardFromBuffer()
  if (current){ if (!onlySlug || toSlug(current.name) === onlySlug) pages.push(current) }
  return pages
}

function toLines(cards: Card[]): string[]{
  return cards.slice(0,6).map(c=>[`- ${c.icon} **${c.title}**: ${c.desc}` , `- Try: ${c.try}`]).flat()
}

function findGetSteadyIndices(sections: any[]): number[]{
  const idxs: number[] = []
  sections.forEach((s:any, i:number) => {
    const t = (s.title||'').trim()
    if (/^get steady before you start$/i.test(t) || /^core principles$/i.test(t)) idxs.push(i)
  })
  return idxs
}

async function run(filePath: string, apply: boolean, onlySlug?: string){
  const pages = parseFile(filePath, onlySlug)
  if (pages.length === 0){ console.log('No pages parsed'); return }
  const { data: tasks, error } = await supabase.from('tasks_content').select('id, task_name, content_sections').order('task_name')
  if (error || !tasks) throw new Error(error?.message || 'fetch tasks failed')
  const bySlug = new Map<string, any>()
  for (const t of tasks){ bySlug.set(toSlug(t.task_name), t) }

  const alias: Record<string,string> = { 'writing-an-email': 'writing-emails' }

  for (const p of pages){
    let slug = toSlug(p.name)
    if (alias[slug]) slug = alias[slug]
    const row = bySlug.get(slug) || tasks.find((t:any)=>toSlug(t.task_name) === slug || slug.includes(toSlug(t.task_name)))
    if (!row){ console.warn('No match for', p.name, slug); continue }
    const sections = (row.content_sections || []) as any[]
    const lines = toLines(p.cards)
    const idxs = findGetSteadyIndices(sections)
    const keep = idxs.length? idxs[0] : -1
    let newSections: any[]
    const section = { emoji: '⚓', title: 'Get Steady Before You Start', content: lines }
    if (keep >= 0){
      newSections = sections.filter((_,i)=> i===keep || !idxs.includes(i))
      newSections[keep] = section
    } else {
      newSections = [section, ...sections]
    }
    if (!apply){
      console.log(`Would update: ${row.task_name}`)
      continue
    }
    const { error: updErr } = await supabase.from('tasks_content').update({ content_sections: newSections }).eq('id', row.id)
    if (updErr) console.error('Update failed', row.task_name, updErr.message)
    else console.log('✅ Updated Get Steady for', row.task_name)
  }
}

async function main(){
  const APPLY = process.argv.includes('--apply')
  const fileArg = (process.argv.find(a=>a.startsWith('--file='))||'').split('=')[1]
  const slugArg = (process.argv.find(a=>a.startsWith('--slug='))||'').split('=')[1]
  const filePath = fileArg ? path.resolve(fileArg) : path.resolve(process.cwd(), 'life_areas_get_steady.md')
  await run(filePath, APPLY, slugArg)
}

main().catch(e=>{ console.error(e); process.exit(1) })

