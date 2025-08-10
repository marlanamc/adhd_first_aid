#!/usr/bin/env tsx
/*
  Verifies ADHD Reasons across life_areas (tasks) and complex_loops pages.
  - Detects duplicates/near-duplicates for You might / What's going on / How to work
  - Prints a per-page markdown report with before/after and final corrected rows
  - Read-only by default. Pass --write to apply fixes back to the database.
*/

import { getAllTasksContent, getAllComplexLoopsContent, supabase } from '@/lib/supabase'

type PairRight = { emoji: string | null; heading: string | null; desc: string }
type Row = {
  youMight: { title: string; body?: string }
  whats: { title: string; body: string }
  howTo: string[]
}

function sanitize(s: string){
  return (s || '').replace(/\uFFFD+/g,'').replace(/\s+/g,' ').trim()
}

function cleanLeft(s?: string){
  return sanitize((s || '').replace(/^[\-•]\s*/, ''))
}

function parseRight(s?: string): PairRight{
  if (!s) return { emoji: null, heading: null, desc: '' }
  const emojiMatch = s.match(/^(\p{Extended_Pictographic})\s+(.+)/u) || s.match(/^([\u{2300}-\u{23FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1FAFF}])\s+(.+)/u)
  let rest = s; let emoji: string | null = null
  if (emojiMatch) { emoji = emojiMatch[1]; rest = emojiMatch[2] }
  rest = sanitize(rest.replace(/^[\uFFFD\s]+/, ''))
  const boldMatch = rest.match(/^\*\*(.*?)\*\*[:：]?\s*(.*)?$/)
  if (boldMatch) return { emoji, heading: boldMatch[1], desc: boldMatch[2] || '' }
  return { emoji, heading: null, desc: rest }
}

function seemsRight(text: string){
  return /(executive|time|working memory|attention|motivation|shame|rsd|dopamine)/i.test(text) || /^\*\*.+?\*\*/.test(text)
}

function toYouMight(text: string){
  const t = text.toLowerCase()
  if (/(tabs?|browser|doomscroll|scroll|youtube|tiktok|twitter|instagram|reddit)/.test(t)) return { title: 'Open one tab, end up with 12', body: 'Lose track of your original task' }
  if (/freeze|hard to start|can'?t start|getting started/.test(t)) return { title: 'Open your laptop… and just stare', body: 'Everything feels too big to begin' }
  if (/hyperfocus/.test(t)) return { title: 'Look up and it’s 4 hours later', body: 'Lost the sense of time passing' }
  if (/(running|always).*late|late\b/.test(t)) return { title: 'Leave early, still arrive late', body: 'Pre‑leave steps stole the buffer' }
  if (/guilt|shame|behind/.test(t)) return { title: 'Beat yourself up for being “behind”', body: 'Motivation drops when shame spikes' }
  if (/distract|notification|ping/.test(t)) return { title: 'Started… then wandered off', body: 'Got sidetracked and never came back' }
  const title = text.split(/[.,]/)[0].slice(0, 60)
  return { title: title.charAt(0).toUpperCase()+title.slice(1) }
}

function rightEmojiFor(h?: string | null){
  const k = (h||'').toLowerCase()
  if (k.includes('executive')) return '🧩'
  if (k.includes('working memory')) return '🧠'
  if (k.includes('time')) return '⏰'
  if (k.includes('attention')) return '🎯'
  if (k.includes('motivation') || k.includes('urgency')) return '🔥'
  if (k.includes('rsd') || k.includes('shame')) return '😣'
  if (k.includes('dopamine')) return '🧪'
  return '💡'
}

// Build DB-compatible adhd_reasons string[] from normalized rows
function rowsToAdhdReasonsLines(rows: Row[]): string[] {
  const lines: string[] = []
  lines.push('You might:')
  for (const r of rows) {
    const title = sanitize(r.youMight.title)
    if (title) lines.push(`- ${title}`)
  }
  lines.push("Here's what's really going on:")
  for (const r of rows) {
    const headingNoColon = (r.whats.title || '').replace(/[：:]\s*$/, '')
    const emoji = rightEmojiFor(headingNoColon)
    const body = sanitize(r.whats.body || '')
    const rightLine = `${emoji} **${headingNoColon}**: ${body}`.trim()
    lines.push(rightLine)
  }
  return lines
}

function buildRows(adhd_reasons: string[] | null, contextHint?: string): Row[]{
  if (!adhd_reasons || adhd_reasons.length === 0) return []
  const you: string[] = []; const real: string[] = []
  let current = ''
  for (const line of adhd_reasons){
    if (/^you might:/i.test(line)) current = 'you'
    else if (/^here'?s what'?s really going on:/i.test(line)) current = 'real'
    else if (current === 'you') you.push(cleanLeft(line))
    else if (current === 'real') real.push(line)
  }
  const rights: PairRight[] = real.map(parseRight).filter(r => (r.heading && r.heading.trim()) || (r.desc && r.desc.trim()))
  const manual: Record<number, PairRight> = {}
  const lefts = you.map((left, i) => {
    if (seemsRight(left)) { manual[i] = parseRight(left); return sanitize(left.replace(/^\p{Extended_Pictographic}\s*/u,'').replace(/\*\*[^*]+\*\*/g,'').replace(/^[—:\-\s]+/,'').trim()) }
    return sanitize(left)
  })
  const pairs = lefts.map((l, i) => ({ left: l, right: manual[i] || rights[i] || {emoji:null,heading:'Context matters',desc:'your brain is adapting; supports help'} }))
  const rows: Row[] = pairs.map(({left,right}) => {
    // You might
    const ym = toYouMight(left)
    // What’s going on
    const heading = (right.heading || 'Insight').replace(/[—–-]+\s*$/,'') + ':'
    const whats = { title: heading, body: String(right.desc || '') }
    // How to (heuristics)
    const body = `${heading} ${whats.body}`.toLowerCase()
    const tips: string[] = []
    const add=(t:string)=>{ if(!tips.includes(t)) tips.push(t) }
    if (/working memory|remember|forget/.test(body)) add('Write a one‑sentence recap')
    if (/time|deadline|blind/.test(body)) add('Set a 25‑min visible timer')
    if (/executive|start|initiat|prioritiz/.test(body)) add('Do a 5‑4‑3‑2‑1 countdown')
    if (/attention|tabs?|browser/.test(body)) add('Use one‑tab full‑screen mode')
    if (/motivation|urgency/.test(body)) add('Body‑double for 20 minutes')
    const howTo = tips.slice(0,3)
    return { youMight: ym, whats, howTo }
  })
  // Context tweak
  if (contextHint && /work tasks/i.test(contextHint)){
    rows.forEach(r => {
      if (/study|studied/i.test(r.youMight.title)){ r.youMight.title = 'Lose your place in the project'; r.youMight.body = 'Reopen a doc and can’t remember what’s next' }
    })
  }
  return dedupeRows(rows)
}

function norm(s:string){ return s.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,' ').trim() }

function dedupeRows(rows: Row[]): Row[]{
  const seenYM = new Map<string, number>()
  const altYM = ['Mid‑project detour','Halfway there… and gone','Opened email, forgot work']
  const seenHow = new Map<string, number>()
  const altTips = [
    ['Capture next step on sticky','Set a 10‑min timer','Return to the doc'],
    ['Tab quarantine a later window','Write a one‑line recap','Nudge with body‑double'],
    ['Schedule a 20‑min wrap‑up','Park tasks in To‑Do','Stand up, breathe, resume']
  ]
  rows.forEach((r, i) => {
    const k = norm(r.youMight.title)
    if (seenYM.has(k)){
      r.youMight.title = altYM[(i+seenYM.size)%altYM.length]
    } else {
      seenYM.set(k,i)
    }
    const hk = r.howTo.map(norm).sort().join('|')
    if (seenHow.has(hk)){
      r.howTo = altTips[(i+seenHow.size)%altTips.length]
    } else {
      seenHow.set(hk,i)
    }
    // enforce 2–3 bullets, verb-first
    r.howTo = r.howTo.filter(Boolean).slice(0,3)
    if (r.howTo.length < 2) r.howTo.push('Write a one‑sentence recap')
  })
  return rows
}

function rowsToMarkdown(rows: Row[]): string{
  const header = `| You might | What’s really going on | How to work with your brain |\n|---|---|---|`
  const lines = rows.map(r => `| ${r.youMight.title.replace(/\|/g,'/')} | ${r.whats.title.replace(/\|/g,'/')} ${r.whats.body.replace(/\|/g,'/')} | ${r.howTo.join('; ').replace(/\|/g,'/')} |`)
  return [header, ...lines].join('\n')
}

async function main(){
  const WRITE = process.argv.includes('--write')
  const reports: string[] = []
  const updatedPages: string[] = []
  // Tasks
  const tasks = await getAllTasksContent()
  const taskPages = (tasks.data || []).filter(t => Array.isArray((t as any).adhd_reasons)) as any[]
  for (const t of taskPages){
    const name = t.task_name as string
    const beforeRows = buildRows(t.adhd_reasons as string[])
    const afterRows = dedupeRows(JSON.parse(JSON.stringify(beforeRows)))
    const issues: string[] = []
    if (beforeRows.length !== new Set(beforeRows.map(r=>norm(r.youMight.title))).size) issues.push('Duplicate “You might”')
    const beforeHowKeys = beforeRows.map(r=>r.howTo.map(norm).sort().join('|'))
    if (beforeHowKeys.length !== new Set(beforeHowKeys).size) issues.push('Duplicate “How to work” bullets')
    if (issues.length === 0) continue
    if (WRITE) {
      const newReasons = rowsToAdhdReasonsLines(afterRows)
      const { error: updErr } = await supabase
        .from('tasks_content')
        .update({ adhd_reasons: newReasons })
        .eq('id', t.id)
      if (updErr) {
        console.error(`Failed to update tasks_content for ${name}:`, updErr.message)
      } else {
        updatedPages.push(`Task: ${name}`)
      }
    }
    const beforeAfter: string[] = []
    for (let i=0;i<beforeRows.length;i++){
      if (norm(beforeRows[i].youMight.title) !== norm(afterRows[i].youMight.title) || beforeRows[i].howTo.join('|') !== afterRows[i].howTo.join('|')){
        beforeAfter.push(`| ${beforeRows[i].youMight.title} / ${beforeRows[i].howTo.join('; ')} | ${afterRows[i].youMight.title} / ${afterRows[i].howTo.join('; ')} |`)
      }
    }
    reports.push(`## ${name}\n\n### Issues found:\n${issues.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\n### Fixes applied:\n| Before | After |\n|---|---|\n${beforeAfter.join('\n')}\n\n### Final corrected ADHD Reasons:\n${rowsToMarkdown(afterRows)}\n`)
  }
  // Complex loops
  const loops = await getAllComplexLoopsContent()
  const loopPages = (loops.data || []).filter(t => Array.isArray((t as any).adhd_reasons)) as any[]
  for (const t of loopPages){
    const name = t.loop_name as string
    const beforeRows = buildRows(t.adhd_reasons as string[])
    const afterRows = dedupeRows(JSON.parse(JSON.stringify(beforeRows)))
    const issues: string[] = []
    if (beforeRows.length !== new Set(beforeRows.map(r=>norm(r.youMight.title))).size) issues.push('Duplicate “You might”')
    const beforeHowKeys = beforeRows.map(r=>r.howTo.map(norm).sort().join('|'))
    if (beforeHowKeys.length !== new Set(beforeHowKeys).size) issues.push('Duplicate “How to work” bullets')
    if (issues.length === 0) continue
    if (WRITE) {
      const newReasons = rowsToAdhdReasonsLines(afterRows)
      const { error: updErr } = await supabase
        .from('complex_loops_content')
        .update({ adhd_reasons: newReasons })
        .eq('id', t.id)
      if (updErr) {
        console.error(`Failed to update complex_loops_content for ${name}:`, updErr.message)
      } else {
        updatedPages.push(`Loop: ${name}`)
      }
    }
    const beforeAfter: string[] = []
    for (let i=0;i<beforeRows.length;i++){
      if (norm(beforeRows[i].youMight.title) !== norm(afterRows[i].youMight.title) || beforeRows[i].howTo.join('|') !== afterRows[i].howTo.join('|')){
        beforeAfter.push(`| ${beforeRows[i].youMight.title} / ${beforeRows[i].howTo.join('; ')} | ${afterRows[i].youMight.title} / ${afterRows[i].howTo.join('; ')} |`)
      }
    }
    reports.push(`## ${name}\n\n### Issues found:\n${issues.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\n### Fixes applied:\n| Before | After |\n|---|---|\n${beforeAfter.join('\n')}\n\n### Final corrected ADHD Reasons:\n${rowsToMarkdown(afterRows)}\n`)
  }
  if (reports.length === 0){
    console.log('No issues found in ADHD Reasons sections.')
  } else {
    console.log(reports.join('\n'))
  }
  if (WRITE) {
    console.log('\nApplied updates to pages:\n' + (updatedPages.length ? updatedPages.join('\n') : 'None'))
  }
}

main().catch(err=>{ console.error(err); process.exit(1) })

