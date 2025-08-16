#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Section = { emoji?: string; title: string; content: string[] }

type You = { title: string; body?: string }
type Real = { heading: string; desc: string }

function toSlug(name: string){
  return (name||'')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$|--+/g, '-')
}

function parseReasons(lines: string[]|null): { you: You[]; real: Real[] }{
  const you: You[] = []
  const real: Real[] = []
  if (!lines) return { you, real }
  let sec: 'you'|'real'|'' = ''
  for (const raw of lines){
    const line = (raw||'').trim()
    if (!line) continue
    if (/^you might:/i.test(line)) { sec='you'; continue }
    if (/^here'?s what'?s really going on:/i.test(line)) { sec='real'; continue }
    if (sec==='you'){
      const l = line.replace(/^[-•]\s*/, '').trim()
      if (l) you.push({ title: l })
    } else if (sec==='real'){
      const m = line.match(/^(\p{Extended_Pictographic})?\s*\*\*(.*?)\*\*[:：]?\s*(.*)$/u)
      if (m){
        real.push({ heading: (m[2]||'').trim(), desc: (m[3]||'').trim() })
      }
    }
  }
  return { you, real }
}

function nounsFor(slug: string): string[]{
  const map: Record<string,string[]> = {
    'bills-money': ['bills','bank login','statements'],
    'budgeting-tracking': ['budget file','tracker','spending list'],
    'car-maintenance': ['registration','maintenance log','service notes'],
    'cleaning': ['trash bags','cleaning kit','bin'],
    'cleaning-out-the-fridge': ['trash bin','compost','toss bin'],
    'cooking': ['ingredients','pan','knife'],
    'creative-projects': ['notebook','draft','sketch'],
    'decluttering': ['donate box','trash bag','keep box'],
    'dishes': ['soap','rack','sponge'],
    'filling-out-documents': ['forms','ID','pen'],
    'focus-time': ['timer','index card','task name'],
    'following-up': ['message list','template'],
    'getting-out-the-door': ['keys','bag','wallet'],
    'grocery-shopping': ['list','bags','wallet'],
    'hygiene': ['toothbrush','towel','soap'],
    'laundry': ['hamper','detergent','basket'],
    'making-phone-calls': ['number','script','notes'],
    'meal-planning': ['calendar','meal list'],
    'meal-prepping': ['containers','cutting board'],
    'medication-refills': ['pill bottle','pharmacy app'],
    'minor-repairs': ['tool kit','screws'],
    'morning-routine': ['clothes','meds','water'],
    'organization': ['bins','labels'],
    'paperwork': ['folder','pen','envelope'],
    'planning-scheduling': ['planner','calendar'],
    'reading-important-mail': ['mail pile','letter opener'],
    'retail-shopping': ['return bag','receipt'],
    'returning-items': ['receipt','return bag'],
    'staying-on-top-of-classwork': ['syllabus','notes','timer'],
    'to-do-lists': ['index card','template'],
    'trash-recycling': ['bags','bins'],
    'work-tasks': ['project doc','task card']
  }
  return map[slug] || ['materials','timer','sticky note']
}

type Card = { icon: string; title: string; desc: string; try: string }

type Ctx = { primary: string; secondary?: string; space?: string; app?: string; scope: string; windowVerb: string; shortTask: string }

function contextFor(slug: string, taskName: string): Ctx {
  const base = { primary:'materials', secondary:'timer', space:'desk', scope:'slice', windowVerb:'start', shortTask: taskName.toLowerCase() }
  const map: Record<string, Partial<Ctx>> = {
    'bills-money': { primary:'bills', app:'bank login', scope:'bill', windowVerb:'pay', shortTask:'bills' },
    'budgeting-tracking': { primary:'budget file', app:'tracker', scope:'budget line', windowVerb:'review', shortTask:'budget' },
    'car-maintenance': { primary:'registration', scope:'maintenance step', windowVerb:'check', shortTask:'car' },
    'cleaning': { primary:'trash bags', scope:'room zone', windowVerb:'tidy', shortTask:'cleaning' },
    'cleaning-out-the-fridge': { primary:'toss bin', scope:'shelf', windowVerb:'sort', shortTask:'fridge' },
    'cooking': { primary:'ingredients', scope:'recipe step', windowVerb:'prep', shortTask:'cooking' },
    'creative-projects': { primary:'draft', scope:'tiny pass', windowVerb:'sketch', shortTask:'project' },
    'decluttering': { primary:'donate box', scope:'bin', windowVerb:'sort', shortTask:'declutter' },
    'dishes': { primary:'sink load', scope:'rack load', windowVerb:'rinse', shortTask:'dishes' },
    'filling-out-documents': { primary:'forms', scope:'one field', windowVerb:'fill', shortTask:'forms' },
    'focus-time': { primary:'task card', scope:'block', windowVerb:'focus', shortTask:'focus' },
    'following-up': { primary:'message list', scope:'reply', windowVerb:'reply', shortTask:'follow‑up' },
    'getting-out-the-door': { primary:'keys + bag', scope:'leave step', windowVerb:'pack', shortTask:'leaving' },
    'grocery-shopping': { primary:'list', scope:'aisle', windowVerb:'shop', shortTask:'groceries' },
    'hygiene': { primary:'toothbrush', scope:'step', windowVerb:'wash', shortTask:'hygiene' },
    'laundry': { primary:'basket', scope:'load', windowVerb:'fold', shortTask:'laundry' },
    'making-phone-calls': { primary:'call script', scope:'call', windowVerb:'call', shortTask:'calls' },
    'meal-planning': { primary:'meal list', scope:'meal slot', windowVerb:'plan', shortTask:'meal plan' },
    'meal-prepping': { primary:'containers', scope:'batch', windowVerb:'prep', shortTask:'meal prep' },
    'medication-refills': { primary:'pill bottle', app:'pharmacy app', scope:'refill', windowVerb:'refill', shortTask:'meds' },
    'minor-repairs': { primary:'tool kit', scope:'fix', windowVerb:'fix', shortTask:'repairs' },
    'morning-routine': { primary:'clothes + meds', scope:'step', windowVerb:'start', shortTask:'morning' },
    'organization': { primary:'bins + labels', scope:'bin', windowVerb:'sort', shortTask:'organization' },
    'paperwork': { primary:'folder + ID', scope:'form', windowVerb:'sign', shortTask:'paperwork' },
    'planning-scheduling': { primary:'planner', app:'calendar', scope:'slot', windowVerb:'plan', shortTask:'plan' },
    'reading-important-mail': { primary:'mail pile', scope:'letter', windowVerb:'read', shortTask:'mail' },
    'retail-shopping': { primary:'return bag', scope:'item', windowVerb:'return', shortTask:'shopping' },
    'returning-items': { primary:'receipt + return bag', scope:'return', windowVerb:'return', shortTask:'returns' },
    'staying-on-top-of-classwork': { primary:'syllabus', scope:'topic', windowVerb:'study', shortTask:'classwork' },
    'to-do-lists': { primary:'index card', scope:'task', windowVerb:'list', shortTask:'to‑dos' },
    'trash-recycling': { primary:'trash + recycle bins', scope:'run', windowVerb:'take', shortTask:'trash' },
    'work-tasks': { primary:'project doc', scope:'step', windowVerb:'build', shortTask:'work' },
  }
  return { ...base, ...(map[slug]||{}) } as Ctx
}

function buildGetSteadyCards(taskName: string, slug: string, reasons: { you: You[]; real: Real[] }): Card[]{
  const lowerReals = reasons.real.map(r=>`${r.heading} ${r.desc}`.toLowerCase())
  const ctx = contextFor(slug, taskName)
  const cards: Card[] = []
  const add=(c:Card)=>{ if (!cards.find(x=>x.title.toLowerCase()===c.title.toLowerCase()) && !cards.find(x=>x.try.toLowerCase()===c.try.toLowerCase())) cards.push(c) }

  // 1) Stage the key item/space (page-specific)
  add({ icon:'📌', title:`Stage ${ctx.primary}`.slice(0,24), desc:`Put ${ctx.primary} where you’ll see/use it`, try:`Place ${ctx.primary} next to your ${ctx.secondary||'timer'}` })
  // 2) Open/pin the app or doc if present
  if (ctx.app){ add({ icon:'📱', title:`Open ${ctx.app} & pin`.slice(0,24), desc:`Keep ${ctx.app} visible so starting is easy`, try:`Open ${ctx.app} and keep it front-most` }) }
  else { add({ icon:'🗂️', title:'Pin your start point', desc:'Make the first thing obvious and visible', try:`Put a sticky with “${ctx.shortTask}” where you begin` }) }
  // 3) Set a tiny time container
  add({ icon:'⏰', title:`Set a ${ctx.windowVerb} window`.slice(0,24), desc:'Pick a small start/stop and honor the stop', try:'Set a visible 12‑minute timer' })
  // 4) Name today’s specific scope
  add({ icon:'🧭', title:`Today: one ${ctx.scope}`.slice(0,24), desc:'Shrink to a tiny slice you can actually begin', try:`Write “Today I just ${ctx.scope}” on a sticky` })
  // 5) Visible anchors for the task
  add({ icon:'👀', title:`Visible ${ctx.shortTask} anchors`.slice(0,28), desc:'Keep task name and time in view', try:`Stick “${ctx.shortTask}” near your clock/timer` })
  // 6) Permission / anti‑shame (varied wording)
  const antiTitles = [
    `Permission: one ${ctx.scope}`,
    `Start fresh on ${ctx.shortTask}`,
    `Lose the “behind” story`,
  ]
  const anti = antiTitles[(slug.length + taskName.length) % antiTitles.length]
  add({ icon:'💛', title:anti.slice(0,28), desc:'You’re not behind—starting small still counts', try:'Say aloud: “Small counts; slow is allowed”' })

  // Preference ordering from reasons
  const has = (kw:string)=>lowerReals.some(t=>t.includes(kw))
  const preferred: string[] = []
  if (has('time blindness')) preferred.push(`Set a ${ctx.windowVerb} window`, `Visible ${ctx.shortTask} anchors`)
  if (has('working memory')) preferred.push(`Stage ${ctx.primary}`)
  if (has('shame')||has('avoid')) preferred.push(anti)
  if (has('executive')) preferred.push(`Today: one ${ctx.scope}`)
  const ordered = cards.sort((a,b)=>{
    const pa = preferred.indexOf(a.title)
    const pb = preferred.indexOf(b.title)
    return (pa===-1?99:pa) - (pb===-1?99:pb)
  })
  return ordered.slice(0,6)
}

function toBullets(cards: Card[]): string[]{
  const out: string[] = []
  const seenTitle = new Set<string>()
  const seenTry = new Set<string>()
  for (const c0 of cards){
    // sanitize markdown and collapse spaces
    const c: Card = {
      icon: c0.icon,
      title: c0.title.replace(/[.:\s]+$/,'').trim(),
      desc: c0.desc.replace(/\*\*+/g,'').replace(/\s+/g,' ').trim(),
      try: c0.try.replace(/^\s*-?\s*try:\s*/i,'').replace(/\s+/g,' ').trim(),
    }
    if (!c.title || seenTitle.has(c.title.toLowerCase())) continue
    if (!c.try || seenTry.has(c.try.toLowerCase())) continue
    seenTitle.add(c.title.toLowerCase())
    seenTry.add(c.try.toLowerCase())
    out.push(`- ${c.icon} **${c.title}**: ${c.desc}`)
    out.push(`- Try: ${c.try}`)
  }
  return out
}

function getSteadyIndices(sections: Section[]): number[]{
  const idxs: number[] = []
  sections.forEach((s, i) => {
    const t = (s.title || '').trim()
    if (/^core principles$/i.test(t) || /^get steady before you start$/i.test(t)) idxs.push(i)
  })
  return idxs
}

async function migrateOne(task: any, apply: boolean){
  const slug = toSlug(task.task_name||'')
  const reasons = parseReasons(task.adhd_reasons as string[])
  const cards = buildGetSteadyCards(task.task_name||'', slug, reasons)
  const bullets = toBullets(cards)
  const sections: Section[] = (task.content_sections||[]) as any
  const idxs = getSteadyIndices(sections)
  const section: Section = { emoji: '⚓', title: 'Get Steady Before You Start', content: bullets }
  let newSections: Section[]
  if (idxs.length > 0){
    // Keep only the first occurrence; drop others
    const keep = idxs[0]
    newSections = sections.filter((_, i) => i === keep || !idxs.includes(i))
    newSections[keep] = section
  } else {
    // Insert at top, before strategies
    newSections = [section, ...sections]
  }
  const bulletTitleRe = /^\s*-\s*(?:[\p{Extended_Pictographic}\u2600-\u27BF]\s*)?\*\*/u
  const beforeTitles = (idxs.length>0 ? sections[idxs[0]]?.content||[] : []).filter((l:string)=>bulletTitleRe.test(l)).slice(0,20)
  const afterTitles = bullets.filter(l=>bulletTitleRe.test(l)).slice(0,20)
  const diff = { page: task.task_name, beforeCount: beforeTitles.length, afterCount: afterTitles.length }
  if (!apply){
    console.log(JSON.stringify(diff))
    return
  }
  const { error } = await supabase.from('tasks_content').update({ content_sections: newSections }).eq('id', task.id)
  if (error) throw new Error(`Update failed for ${task.task_name}: ${error.message}`)
  console.log(`✅ Migrated ${task.task_name}`)
}

async function main(){
  const APPLY = process.argv.includes('--apply')
  const onlySlug = (process.argv.find(a=>a.startsWith('--slug='))||'').split('=')[1]
  const { data: tasks, error } = await supabase.from('tasks_content').select('id, task_name, adhd_reasons, content_sections').order('task_name')
  if (error) throw new Error(error.message)
  for (const t of (tasks||[])){
    const slug = toSlug(t.task_name||'')
    if (onlySlug && slug !== onlySlug) continue
    await migrateOne(t, APPLY)
  }
}

main().catch(e=>{ console.error(e); process.exit(1) })

