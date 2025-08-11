#!/usr/bin/env tsx
/*
  Clean and verify the "Get Steady Before You Start" sections across life_areas.
  - Keep same card layout (icon → bold title → desc + Try line)
  - Normalize title/desc/try, dedupe per-page, strip markdown/emoji from bodies
  - Dry-run by default; apply with --apply; optional --slug=<slug>
*/

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Section = { emoji?: string; title: string; content: string[] }
type Card = { icon: string; title: string; desc: string; try: string }

function toSlug(name: string){
  return (name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$|--+/g,'-')
}

function contextFor(slug: string, taskName: string){
  const base = { primary:'materials', secondary:'timer', task: taskName.toLowerCase(), noun:'task' }
  const map: Record<string, Partial<typeof base>> = {
    'bills-money': { primary:'bills', noun:'bills' },
    'budgeting-tracking': { primary:'budget file', noun:'budget' },
    'car-maintenance': { primary:'registration', noun:'maintenance' },
    'cleaning': { primary:'trash bags', noun:'room' },
    'cleaning-out-the-fridge': { primary:'toss bin', noun:'fridge' },
    'cooking': { primary:'ingredients', noun:'recipe' },
    'creative-projects': { primary:'draft', noun:'project' },
    'decluttering': { primary:'donate box', noun:'bin' },
    'dishes': { primary:'sink load', noun:'dishes' },
    'filling-out-documents': { primary:'forms', noun:'form' },
    'focus-time': { primary:'task card', noun:'block' },
    'following-up': { primary:'message list', noun:'reply' },
    'getting-out-the-door': { primary:'keys + bag', noun:'leave step' },
    'grocery-shopping': { primary:'list', noun:'list' },
    'hygiene': { primary:'toothbrush', noun:'step' },
    'laundry': { primary:'basket', noun:'load' },
    'making-phone-calls': { primary:'call script', noun:'call' },
    'meal-planning': { primary:'meal list', noun:'meal slot' },
    'meal-prepping': { primary:'containers', noun:'batch' },
    'medication-refills': { primary:'pill bottle', noun:'refill' },
    'minor-repairs': { primary:'tool kit', noun:'fix' },
    'morning-routine': { primary:'clothes + meds', noun:'step' },
    'organization': { primary:'bins + labels', noun:'bin' },
    'paperwork': { primary:'folder + ID', noun:'form' },
    'planning-scheduling': { primary:'planner', noun:'slot' },
    'reading-important-mail': { primary:'mail pile', noun:'letter' },
    'retail-shopping': { primary:'return bag', noun:'item' },
    'returning-items': { primary:'receipt + return bag', noun:'return' },
    'staying-on-top-of-classwork': { primary:'syllabus', noun:'topic' },
    'to-do-lists': { primary:'index card', noun:'task' },
    'trash-recycling': { primary:'trash + recycle bins', noun:'run' },
    'work-tasks': { primary:'project doc', noun:'step' },
  }
  return { ...base, ...(map[slug]||{}) }
}

function stripMd(s?: string){
  return String(s||'')
    .replace(/[\p{Extended_Pictographic}\u2600-\u27BF]/gu,'') // emojis
    .replace(/\*\*|__/g,'')
    .replace(/[_`]/g,'')
    .replace(/[“”]/g,'"')
    .replace(/[‘’]/g,"'")
    .replace(/\s+/g,' ')
    .trim()
}

function clampWords(s: string, maxWords = 5){
  const words = s.split(/\s+/)
  return words.slice(0, maxWords).join(' ')
}

function clampLen(s: string, max = 90){
  let t = s.replace(/\s+/g,' ').trim()
  if (t.length <= max) return t
  t = t.slice(0, max).replace(/[,:;\-\s]+$/,'')
  return t
}

function parseCards(content: string[]): Card[] {
  const cards: Card[] = []
  for (let i=0;i<content.length;i++){
    const line = content[i]
    const next = content[i+1] || ''
    const first = line.replace(/^\s*-\s*/, '')
    // Capture the last emoji** sequence if present
    const emojiPattern = /([\p{Extended_Pictographic}\u2600-\u27BF])\s*\*\*/gu
    const emojis = [...first.matchAll(emojiPattern)]
    const icon = emojis.length ? emojis[emojis.length-1][1] : (first.match(/^[\p{Extended_Pictographic}\u2600-\u27BF]/u)?.[0] || '✨')
    const cleaned = first.replace(emojiPattern,'')
    const m = cleaned.match(/^\s*(?:\*\*)?(.*?)\*\*[:：]?\s*(.*)$/)
    let title = m ? m[1] : cleaned
    let desc = m ? m[2] : ''
    let tryLine = ''
    if (/^\s*-\s*try:/i.test(next)){
      tryLine = next.replace(/^\s*-\s*try:/i,'').trim()
      i++
    }
    cards.push({ icon, title: title || '', desc, try: tryLine })
  }
  return cards
}

function cleanCards(cards: Card[], slug: string, taskName: string, allowDrop = false): Card[] {
  const ctx = contextFor(slug, taskName)
  const out: Card[] = []
  const seenTitle = new Set<string>()
  const seenTry = new Set<string>()
  for (const raw of cards){
    let icon = raw.icon || '✨'
    let title = clampWords(stripMd(raw.title).replace(/[.:;，。:]+$/,''), 5)
    if (!title) title = 'Stage materials'
    // Noun injection for generic titles
    if (/stage materials/i.test(title)) title = `Stage ${ctx.primary}`.slice(0, 22)
    if (/pin your start/i.test(title)) title = 'Pin your start point'
    if (/set a start window/i.test(title)) title = 'Set a start window'
    if (/name today/i.test(title)) title = `Name today’s ${ctx.noun}`
    if (/keep it visible/i.test(title)) title = `Keep it visible`
    // Desc
    let desc = stripMd(raw.desc)
    // Single sentence, present tense-ish: clamp to first sentence
    desc = desc.split(/(?<=[.!?])\s+/)[0] || desc
    if (!desc) desc = 'Put what you need where you’ll see/use it.'
    desc = clampLen(desc, 90)
    // Try line
    let tr = stripMd(raw.try).replace(/^to\s+/i,'').trim()
    if (!tr) {
      if (/stage/i.test(title)) tr = `Place ${ctx.primary} next to your ${ctx.secondary}`
      else if (/start window/i.test(title)) tr = 'Set a visible 12‑minute timer'
      else if (/name today/i.test(title)) tr = 'Write “Today I just ___” on a sticky'
      else if (/visible/i.test(title)) tr = `Stick “${taskName}” near your clock/timer`
      else tr = 'Sip water and stretch for 30–60s'
    }
    tr = tr.replace(/^try:\s*/i,'').trim()
    if (!/^[A-Za-z]/.test(tr)) tr = 'Start a 12‑minute timer'
    tr = clampLen(tr, 80)
    // Dedupe
    const kt = title.toLowerCase()
    const ktry = tr.toLowerCase()
    if (seenTitle.has(kt) || seenTry.has(ktry)){
      if (allowDrop) continue
      // Differentiate by adding page noun
      if (seenTitle.has(kt)) title = `${title} (${ctx.noun})`
      if (seenTry.has(ktry)) tr = `${tr} (for ${ctx.noun})`
    }
    seenTitle.add(title.toLowerCase())
    seenTry.add(tr.toLowerCase())
    out.push({ icon, title, desc, try: tr })
  }
  // Ensure 4–6 cards; trim extras if needed, keep first 6
  return out.slice(0, 6)
}

function toLines(cards: Card[]): string[]{
  const lines: string[] = []
  for (const c of cards){
    lines.push(`- ${c.icon} **${c.title}**: ${c.desc}`)
    lines.push(`- Try: ${c.try}`)
  }
  return lines
}

function findGetSteadyIndices(sections: Section[]): number[]{
  const idxs: number[] = []
  sections.forEach((s, i) => {
    const t = (s.title||'').trim()
    if (/^get steady before you start$/i.test(t) || /^core principles$/i.test(t)) idxs.push(i)
  })
  return idxs
}

async function run(apply: boolean, slugFilter?: string){
  const { data, error } = await supabase.from('tasks_content').select('id, task_name, content_sections')
  if (error || !data) throw new Error(error?.message || 'fetch failed')
  for (const row of data as any[]){
    const name = row.task_name as string
    const slug = toSlug(name)
    if (slugFilter && slug !== slugFilter) continue
    const sections: Section[] = (row.content_sections||[]) as any
    const idxs = findGetSteadyIndices(sections)
    if (idxs.length === 0) continue
    const keep = idxs[0]
    // Merge: drop later duplicates
    const pruned = sections.filter((_,i)=> i===keep || !idxs.includes(i))
    const gs = pruned[keep]
    const beforeCards = parseCards(gs.content||[])
    const afterCards = cleanCards(beforeCards, slug, name, /*allowDrop*/false)
    const afterLines = toLines(afterCards)
    const changed = JSON.stringify(gs.content||[]) !== JSON.stringify(afterLines) || idxs.length>1 || /core principles/i.test(gs.title||'')
    if (!changed){
      console.log(`No change: ${name}`)
      continue
    }
    const newSections = pruned.slice()
    newSections[keep] = { emoji: '⚓', title: 'Get Steady Before You Start', content: afterLines }
    if (!apply){
      console.log(`Would update: ${name}`)
      continue
    }
    const { error: updErr } = await supabase.from('tasks_content').update({ content_sections: newSections }).eq('id', row.id)
    if (updErr) console.error('Update failed', name, updErr.message)
    else console.log(`✅ Cleaned ${name}`)
  }
}

async function main(){
  const APPLY = process.argv.includes('--apply')
  const slugArg = (process.argv.find(a=>a.startsWith('--slug='))||'').split('=')[1]
  await run(APPLY, slugArg)
}

main().catch(e=>{ console.error(e); process.exit(1) })

