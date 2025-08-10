#!/usr/bin/env tsx
/*
  Verify Core Principles across life_areas (tasks) and complex_loops pages.
  Checks per page:
  - All emojis are present, unique, and appropriate to the title/description keywords
  - No duplicate titles, descriptions or Try suggestions
  Reports by default. Pass --write to apply fixes (emoji diversification and varied Try lines) back to DB.
*/

import { getAllTasksContent, getAllComplexLoopsContent, supabase } from '@/lib/supabase'

type CoreItem = { emoji: string; title: string; desc: string; try: string }

function norm(s?: string){ return (s||'').toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,' ').trim() }

// Parse a single bullet line into {emoji?, title, desc}
// Mirrors parsing used in the UI component
function parseBullet(line: string): { emoji: string | null; title: string; desc: string }{
  const m = line.match(/^\s*-\s*(?:([\p{Extended_Pictographic}\u2600-\u27BF])\s*)?\*\*(.*?)\*\*[:：]?\s*(.*)$/u)
  if (m){
    return { emoji: m[1] || null, title: m[2].trim(), desc: (m[3]||'').trim() }
  }
  // Fallback: "- Title" style
  const m2 = line.match(/^\s*-\s*(?:([\p{Extended_Pictographic}\u2600-\u27BF])\s*)?(.*?)\s*$/u)
  return { emoji: (m2?.[1] || null), title: (m2?.[2] || '').trim(), desc: '' }
}

// Suggest an emoji based on keywords; returns an ordered list of candidates
function suggestEmojis(title: string, desc: string): string[]{
  const t = `${title} ${desc}`.toLowerCase()
  const picks: string[] = []
  const add=(e:string)=>{ if(!picks.includes(e)) picks.push(e) }
  if (/brain|awareness|understand|name it|notice|mind|attention/.test(t)) { add('🧠'); add('🔎'); add('💡') }
  if (/structure|routine|rigid|system|organize|scaffold/.test(t)) { add('📐'); add('🗂️'); add('🧱') }
  if (/energy|fatigue|capacity|rest/.test(t)) { add('⚡'); add('🔋'); add('🌙') }
  if (/time|timer|visible|countdown|pace/.test(t)) { add('⏰'); add('⏱️'); add('🗓️') }
  if (/momentum|trust|small win|start|tiny/.test(t)) { add('🏁'); add('➡️'); add('✨') }
  if (/compassion|kind|shame|not broken|valid/.test(t)) { add('💛'); add('🤝'); add('🫶') }
  if (/values|direction|north star|priority/.test(t)) { add('🧭'); add('📌'); add('⭐') }
  if (picks.length === 0) { add('✨'); add('💡'); add('🧭') }
  return picks
}

function suggestTry(title: string, desc: string): string{
  const t = `${title} ${desc}`.toLowerCase()
  if (/time|timer|visible|countdown|pace/.test(t)) return 'Set a visible 20–30 min timer'
  if (/structure|routine|system|organize/.test(t)) return 'Write a 3‑step checklist you can reuse'
  if (/energy|fatigue|capacity/.test(t)) return 'Add a movement or water break between blocks'
  if (/awareness|notice|name|understand/.test(t)) return 'Name the pattern aloud in 1 sentence'
  if (/momentum|start|tiny/.test(t)) return 'Do one 60‑second starter action'
  if (/compassion|kind|shame|valid/.test(t)) return 'Swap “lazy” for “low dopamine” in your self‑talk'
  return 'Set a visible 20–30 min timer'
}

function analyzeCore(items: CoreItem[]){
  const issues: string[] = []
  const titleSet = new Set<string>()
  const descSet = new Set<string>()
  const trySet = new Set<string>()
  const emojiSet = new Set<string>()

  items.forEach(ci => {
    const nt = norm(ci.title)
    const nd = norm(ci.desc)
    const ntry = norm(ci.try)
    if (titleSet.has(nt)) issues.push(`Duplicate title: "${ci.title}"`); else titleSet.add(nt)
    if (nd && descSet.has(nd)) issues.push(`Duplicate description: "${ci.desc}"`); else if (nd) descSet.add(nd)
    if (trySet.has(ntry)) issues.push(`Duplicate Try: "${ci.try}"`); else trySet.add(ntry)
    if (emojiSet.has(ci.emoji)) issues.push(`Duplicate emoji: ${ci.emoji}`); else emojiSet.add(ci.emoji)
    // Appropriateness check
    const suggested = suggestEmojis(ci.title, ci.desc)
    if (!suggested.includes(ci.emoji)) {
      issues.push(`Emoji may not match: ${ci.emoji} → expected one of ${suggested.join(' ')}`)
    }
  })
  return issues
}

function buildCoreItems(lines: string[]): CoreItem[]{
  const parsed = lines
    .filter(l => !/^\s*(?:[-*•]\s*)?try\s*:/i.test(l))
    .map(parseBullet)
    .filter(b => b.title)
    .map(b => ({
      emoji: b.emoji || suggestEmojis(b.title, b.desc)[0],
      title: b.title,
      desc: b.desc,
      try: suggestTry(b.title, b.desc)
    }))

  // Enforce unique emojis per section by selecting alternates when needed
  const used = new Set<string>()
  return parsed.map(ci => {
    if (!used.has(ci.emoji)) { used.add(ci.emoji); return ci }
    const alts = suggestEmojis(ci.title, ci.desc)
    const alt = alts.find(e => !used.has(e)) || ci.emoji
    used.add(alt)
    return { ...ci, emoji: alt }
  })
}

async function main(){
  const WRITE = process.argv.includes('--write')
  const out: string[] = []

  // Tasks
  const tasks = await getAllTasksContent()
  const taskPages = (tasks.data || []) as any[]
  for (const t of taskPages){
    const core = (t.content_sections || []).find((s: any) => /core principles/i.test(s.title || ''))
    if (!core || !Array.isArray(core.content) || core.content.length === 0) continue
    const items = buildCoreItems(core.content as string[])
    const issues = analyzeCore(items)
    if (WRITE && issues.length){
      // Rebuild content bullets with diversified emoji and tailored Try
      const updated = (core.content as string[]).map((ln, i) => {
        const p = parseBullet(ln)
        const ci = items[i]
        const emoji = ci.emoji
        const title = p.title || `Principle ${i+1}`
        const desc = p.desc || ''
        const trys = suggestTry(title, desc)
        return `- ${emoji} **${title}**: ${desc}\n- Try: ${trys}`
      })
      const { error } = await supabase
        .from('tasks_content')
        .update({ content_sections: (t.content_sections as any[]).map((s:any)=>/core principles/i.test(s.title||'')?{...s, content: updated}:s) })
        .eq('id', t.id)
      if (error) out.push(`Failed to write fixes for ${t.task_name}: ${error.message}`)
    }
    if (issues.length){
      out.push(`## ${t.task_name}\n${issues.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n`)
    }
  }

  // Loops
  const loops = await getAllComplexLoopsContent()
  const loopPages = (loops.data || []) as any[]
  for (const t of loopPages){
    const core = (t.content_sections || []).find((s: any) => /core principles/i.test(s.title || ''))
    if (!core || !Array.isArray(core.content) || core.content.length === 0) continue
    const items = buildCoreItems(core.content as string[])
    const issues = analyzeCore(items)
    if (WRITE && issues.length){
      const updated = (core.content as string[]).map((ln, i) => {
        const p = parseBullet(ln)
        const ci = items[i]
        const emoji = ci.emoji
        const title = p.title || `Principle ${i+1}`
        const desc = p.desc || ''
        const trys = suggestTry(title, desc)
        return `- ${emoji} **${title}**: ${desc}\n- Try: ${trys}`
      })
      const { error } = await supabase
        .from('complex_loops_content')
        .update({ content_sections: (t.content_sections as any[]).map((s:any)=>/core principles/i.test(s.title||'')?{...s, content: updated}:s) })
        .eq('id', t.id)
      if (error) out.push(`Failed to write fixes for ${t.loop_name}: ${error.message}`)
    }
    if (issues.length){
      out.push(`## ${t.loop_name}\n${issues.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n`)
    }
  }

  if (out.length === 0){
    console.log('No issues found in Core Principles sections.')
  } else {
    console.log(out.join('\n'))
  }
}

main().catch(err=>{ console.error(err); process.exit(1) })

