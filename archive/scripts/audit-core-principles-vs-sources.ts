#!/usr/bin/env tsx
/*
  For every life_area page and complex_loop page:
  - Ensure there are exactly 6 Core Principles
  - Compare each principle against source descriptions to suggest adds/edits
  Output a markdown report with recommendations; pass --write to pad/trim to 6 using suggested items.
*/

import { getAllTasksContent, getLifeAreaSources, getAllComplexLoopsContent, supabase } from '@/lib/supabase'

type Source = { title: string; description: string; category?: string }

function parsePrinciples(lines: string[]): Array<{ emoji?: string; title: string; desc: string }>{
  const items: Array<{ emoji?: string; title: string; desc: string }> = []
  for (let i=0; i<lines.length; i++){
    const ln = lines[i]
    if (/^\s*-\s*try:/i.test(ln)) continue
    const m = ln.match(/^\s*-\s*(?:([\p{Extended_Pictographic}\u2600-\u27BF])\s*)?\*\*(.*?)\*\*[:：]?\s*(.*)$/u)
    if (m){
      // Strip any emojis accidentally inside the bold title
      const cleanTitle = (m[2]||'').replace(/^[\p{Extended_Pictographic}\u2600-\u27BF]+\s*/u,'').trim()
      items.push({ emoji: m[1] || undefined, title: cleanTitle, desc: (m[3]||'').trim() })
      // Skip a trailing Try line if present
      const nxt = lines[i+1]
      if (nxt && /^\s*-\s*try:/i.test(nxt)) i++
    } else {
      const t = ln.replace(/^\s*-\s*/, '').trim()
      if (t) items.push({ title: t, desc: '' })
    }
  }
  return items
}

function suggestFromSources(sources: Source[], slugHint?: string): { title: string; desc: string; emoji?: string; try?: string }[]{
  const items: { title: string; desc: string }[] = []
  const push=(t:string,d:string,e?:string,tr?:string)=>{ if(!items.find(i=>i.title===t)) (items as any).push({title:t,desc:d,emoji:e,try:tr}) }
  sources.forEach(s => {
    const d = (s.description||'').toLowerCase()
    if (/timer|time blindness|pace|visible/.test(d)) push('Make time visible', 'Use visible timers and countdowns to anchor pacing', '⏰', 'Set a visible 20–30 min timer')
    if (/working memory|externalize|checklist|kanban|notes/.test(d)) push('Externalize working memory', 'Use checklists/templates so your brain doesn’t have to remember', '🗂️', 'Write a 3‑step checklist you can reuse')
    if (/initiation|start|executive/.test(d)) push('Start tiny to start at all', 'Lower the start friction with 60‑second actions', '🏁', 'Do one 60‑second starter action')
    if (/energy|fatigue|break/.test(d)) push('Protect your energy', 'Match tasks to capacity and build small breaks in', '⚡', 'Add a movement or water break between blocks')
    if (/awareness|metacogn|name it|notice/.test(d)) push('Awareness before control', 'Name the pattern; you can’t manage what you can’t see', '🔎', 'Name the pattern aloud in 1 sentence')
    if (/structure|routine|habit|rhythm/.test(d)) push('Structure without rigidity', 'Flexible rhythms beat strict rules', '📐', 'Pin a 1‑page template where you start')
    if (/values|priority|north star|meaning/.test(d)) push('Lead with the why', 'Tie tasks to a clear value so effort feels worth it', '🧭', 'Write one‑line “why this matters”')
  })
  // Context nudge based on slug
  const slug = (slugHint||'')
  if (/exam|classwork|study/.test(slug)) (items as any).unshift({ title:'Make time visible', desc:'Use visible timers and countdowns to anchor pacing', emoji:'⏰', try:'Use a kitchen timer in view' })
  if (/work|email|paperwork|organization/.test(slug)) (items as any).unshift({ title:'Externalize working memory', desc:'Use checklists/templates so your brain doesn’t have to remember', emoji:'🗂️', try:'Write a 3‑step checklist you can reuse' })
  return (items as any).slice(0,10)
}

function toBullet(p:{emoji?:string,title:string,desc:string}){
  return `- ${p.emoji||'✨'} **${p.title}**: ${p.desc}`
}

function suggestEmoji(title:string, desc:string): string{
  const t = `${title} ${desc}`.toLowerCase()
  if (/time|timer|countdown|pace|visible/.test(t)) return '⏰'
  if (/working memory|externalize|checklist|kanban|notes|template/.test(t)) return '🗂️'
  if (/start|initiation|tiny|first step|begin|executive/.test(t)) return '🏁'
  if (/energy|fatigue|capacity|rest|break/.test(t)) return '⚡'
  if (/structure|routine|habit|rhythm|rigid/.test(t)) return '📐'
  if (/why|values|priority|north star|meaning/.test(t)) return '🧭'
  if (/awareness|notice|name|metacogn/.test(t)) return '🔎'
  return '💡'
}

async function main(){
  const WRITE = process.argv.includes('--write')
  const tasks = await getAllTasksContent()
  const out: string[] = []
  for (const t of (tasks.data || []) as any[]){
    const slug = (t.task_name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$|--+/g,'-')
    const core = (t.content_sections||[]).find((s:any)=>/core principles/i.test(s.title||''))
    if (!core) continue
    const principles = parsePrinciples(core.content||[])
    const need = 6 - principles.length
    const { data: srcs } = await getLifeAreaSources(slug)
    const suggestions = suggestFromSources((srcs||[]) as any, slug)
    const missing: { title:string;desc:string;emoji?:string;try?:string }[] = []
    for (const s of suggestions){
      if (!principles.find(p=>p.title.toLowerCase()===s.title.toLowerCase())) missing.push(s)
    }
    // If suggestions list is short, backfill with generic but category-appropriate items
    let add = need > 0 ? missing.slice(0, need) : []
    const pad = (ttl:string, dsc:string)=>({ title: ttl, desc: dsc, emoji: suggestEmoji(ttl,dsc) })
    while (add.length < Math.max(0, need)){
      if (add.find(a=>/Make time visible/i.test(a.title)) === undefined) add.push(pad('Make time visible','Use visible timers and countdowns'))
      else if (add.find(a=>/Externalize working memory/i.test(a.title)) === undefined) add.push(pad('Externalize working memory','Use reusable checklists/templates'))
      else if (add.find(a=>/Start tiny/i.test(a.title)) === undefined) add.push(pad('Start tiny to start at all','Use a 60‑second starter action'))
      else if (add.find(a=>/Structure without rigidity/i.test(a.title)) === undefined) add.push(pad('Structure without rigidity','Flexible rhythms beat strict rules'))
      else add.push(pad('Awareness before control','Name the pattern aloud'))
    }
    const rec = need===0 ? 'OK' : (need>0?`Add ${need}`:`Trim ${-need}`)
    out.push(`## ${t.task_name}\n- Current: ${principles.length}\n- Recommendation: ${rec}\n- Candidate adds: ${add.map(a=>a.title).join(', ') || '—'}\n`)
    if (WRITE){
      let updated = principles.slice(0,6)
      if (need>0){
        updated = [...principles, ...add.map(a=>({emoji:a.emoji || suggestEmoji(a.title, a.desc), title:a.title, desc:a.desc}))].slice(0,6)
      }
      const newContent = updated.map(toBullet)
      const newSections = (t.content_sections as any[]).map((s:any)=>/core principles/i.test(s.title||'')?{...s, content: newContent}:s)
      const { error } = await supabase.from('tasks_content').update({ content_sections: newSections }).eq('id', t.id)
      if (error) out.push(`Write failed for ${t.task_name}: ${error.message}`)
    }
  }
  // Complex loops
  const loops = await getAllComplexLoopsContent()
  for (const t of (loops.data || []) as any[]){
    const slug = (t.loop_name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$|--+/g,'-')
    const core = (t.content_sections||[]).find((s:any)=>/core principles/i.test(s.title||''))
    if (!core) continue
    const principles = parsePrinciples(core.content||[])
    const need = 6 - principles.length
    // We don't have loop sources API stubbed here, so reuse heuristics without source lookups
    const suggestions = suggestFromSources([], slug)
    const missing: { title:string;desc:string;emoji?:string;try?:string }[] = []
    for (const s of suggestions){
      if (!principles.find(p=>p.title.toLowerCase()===s.title.toLowerCase())) missing.push(s)
    }
    let add = need > 0 ? missing.slice(0, need) : []
    const pad = (ttl:string, dsc:string)=>({ title: ttl, desc: dsc, emoji: suggestEmoji(ttl,dsc) })
    while (add.length < Math.max(0, need)){
      if (add.find(a=>/Make time visible/i.test(a.title)) === undefined) add.push(pad('Make time visible','Use visible timers and countdowns'))
      else if (add.find(a=>/Externalize working memory/i.test(a.title)) === undefined) add.push(pad('Externalize working memory','Use reusable checklists/templates'))
      else if (add.find(a=>/Start tiny/i.test(a.title)) === undefined) add.push(pad('Start tiny to start at all','Use a 60‑second starter action'))
      else if (add.find(a=>/Structure without rigidity/i.test(a.title)) === undefined) add.push(pad('Structure without rigidity','Flexible rhythms beat strict rules'))
      else add.push(pad('Awareness before control','Name the pattern aloud'))
    }
    const rec = need===0 ? 'OK' : (need>0?`Add ${need}`:`Trim ${-need}`)
    out.push(`## ${t.loop_name}\n- Current: ${principles.length}\n- Recommendation: ${rec}\n- Candidate adds: ${add.map(a=>a.title).join(', ') || '—'}\n`)
    if (WRITE){
      let updated = principles.slice(0,6)
      if (need>0){
        updated = [...principles, ...add.map(a=>({emoji:a.emoji || suggestEmoji(a.title, a.desc), title:a.title, desc:a.desc}))].slice(0,6)
      }
      const newContent = updated.map(toBullet)
      const newSections = (t.content_sections as any[]).map((s:any)=>/core principles/i.test(s.title||'')?{...s, content: newContent}:s)
      const { error } = await supabase.from('complex_loops_content').update({ content_sections: newSections }).eq('id', t.id)
      if (error) out.push(`Write failed for ${t.loop_name}: ${error.message}`)
    }
  }
  console.log(out.join('\n'))
}

main().catch(e=>{ console.error(e); process.exit(1) })

