#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
if (!url || !key) throw new Error('Missing Supabase env vars')
const supabase = createClient(url, key)

type You = { title: string; body?: string }
type Real = { title: string; body: string }
type Row = { icon: string; youMight: You; whatsGoingOn: Real }
type Parsed = { left: string[]; right: { emoji?: string; heading: string; desc: string }[] }

const ensureColon = (s: string) => /[:：]$/.test(s.trim()) ? s.trim() : s.replace(/[—–-]+\s*$/, '').trim() + ':'

function getContext(name: string): 'study' | 'work' | 'bills' | 'creative' | 'household' | 'general' {
  const n = (name || '').toLowerCase()
  if (/exam|study|class|school|homework|reading/.test(n)) return 'study'
  if (/work|email|phone|meeting|project/.test(n)) return 'work'
  if (/bill|money|budget|bank|payment|tax/.test(n)) return 'bills'
  if (/creative|writing|art|project/.test(n)) return 'creative'
  if (/laundry|dishes|clean|trash|grocery|meal|cook|declutter/.test(n)) return 'household'
  return 'general'
}

function parseReasons(lines: string[] | null): Parsed {
  const res: Parsed = { left: [], right: [] }
  if (!lines) return res
  let section: 'you' | 'real' | '' = ''
  for (const raw of lines){
    const line = (raw || '').trim()
    if (!line) continue
    if (/^you might:/i.test(line)) { section = 'you'; continue }
    if (/^here'?s what'?s really going on:/i.test(line)) { section = 'real'; continue }
    if (section === 'you'){
      const l = line.replace(/^[-•]\s*/, '').trim()
      if (l) res.left.push(l)
    } else if (section === 'real'){
      const m = line.match(/^(\p{Extended_Pictographic})?\s*\*\*(.*?)\*\*[:：]?\s*(.*)$/u)
      if (m){
        const [, emoji, headingRaw, descRaw] = m
        res.right.push({ emoji, heading: (headingRaw||'').trim(), desc: (descRaw||'').trim() })
      } else {
        res.right.push({ heading: '', desc: line })
      }
    }
  }
  return res
}

const CANON_LABELS = [
  'Executive dysfunction',
  'Working memory gaps',
  'Time blindness',
  'Shame/avoidance',
  'Attention/executive load',
  'Inconsistent motivation (dopamine‑based)',
  'Planning fallacy & transition friction',
  'Impulsivity',
  'Masking',
  'Hypervigilance',
  'Perfectionism',
  'Weak interoception',
  'Decision paralysis',
  'Sleep inertia',
  'Negative self-talk',
  'Paralysis',
  'Message backlog',
  'Sensory desensitization',
  'Inconsistent sleep habits',
  'Initiation paralysis',
  'Low self-worth'
]

function normalizeLabel(h: string): string {
  const k = (h || '').toLowerCase().trim()
  if (!k || k === 'insight' || k.includes('context matters')) return 'Executive dysfunction'
  if (/executive/.test(k)) return 'Executive dysfunction'
  if (/working\s*memory/.test(k)) return 'Working memory gaps'
  if (/time|deadline|late/.test(k)) return 'Time blindness'
  if (/shame|avoid|rsd|emotion/.test(k)) return 'Shame/avoidance'
  if (/attention|load|focus/.test(k)) return 'Attention/executive load'
  if (/motiv|dopamine/.test(k)) return 'Inconsistent motivation (dopamine‑based)'
  if (/plan|transition|switch/.test(k)) return 'Planning fallacy & transition friction'
  if (/impuls/.test(k)) return 'Impulsivity'
  if (/mask/.test(k)) return 'Masking'
  if (/hypervigil/.test(k)) return 'Hypervigilance'
  if (/perfect/.test(k)) return 'Perfectionism'
  if (/interocep/.test(k)) return 'Weak interoception'
  if (/decision/.test(k)) return 'Decision paralysis'
  if (/sleep inertia/.test(k)) return 'Sleep inertia'
  if (/negative self|self-talk/.test(k)) return 'Negative self-talk'
  if (/paralysis/.test(k)) return 'Paralysis'
  if (/message backlog/.test(k)) return 'Message backlog'
  if (/desensitization|tune out/.test(k)) return 'Sensory desensitization'
  if (/sleep habits|circadian/.test(k)) return 'Inconsistent sleep habits'
  if (/initiation paralysis/.test(k)) return 'Initiation paralysis'
  if (/self-worth|worth/.test(k)) return 'Low self-worth'
  const near = CANON_LABELS.find(L => L.toLowerCase() === k)
  return near || h || 'Executive dysfunction'
}

function trimToTwoSentences(text: string): string {
  const cleaned = (text || '').replace(/[—–]/g, ' ').replace(/\s+/g, ' ').trim()
  const parts = cleaned.split(/(?<=[.!?])\s+/)
  return parts.slice(0, 2).join(' ').trim()
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function stripDuplicateLabel(body: string, headingWithColon: string): string {
  let s = (body || '').trim()
  const label = headingWithColon.replace(/[:：]$/, '').trim()
  if (!label) return s
  // Remove a leading emoji if present
  s = s.replace(/^[\p{Extended_Pictographic}]\uFE0F?\s*/u, '')
  // Remove bolded label + colon
  const reBold = new RegExp('^\\*\\*' + escapeRegExp(label) + '\\*\\*\\s*[:：-]\\s*', 'i')
  s = s.replace(reBold, '')
  // Remove plain label + colon
  const rePlain = new RegExp('^' + escapeRegExp(label) + '\\s*[:：-]\\s*', 'i')
  s = s.replace(rePlain, '')
  return s.trim()
}

const ICON_BY_LABEL: Record<string, string> = {
  'Executive dysfunction': '🧩',
  'Working memory gaps': '🧠',
  'Time blindness': '⏰',
  'Shame/avoidance': '🫣',
  'Attention/executive load': '🔀',
  'Inconsistent motivation (dopamine‑based)': '⚡️',
  'Planning fallacy & transition friction': '➡️',
  'Impulsivity': '⚡',
  'Masking': '🎭',
  'Hypervigilance': '🚨',
  'Perfectionism': '✨',
  'Weak interoception': '🥤',
  'Decision paralysis': '🤔',
  'Sleep inertia': '😪',
  'Negative self-talk': '🗯️',
  'Paralysis': '🧊',
  'Message backlog': '📥',
  'Sensory desensitization': '🔕',
  'Inconsistent sleep habits': '🕰️',
  'Initiation paralysis': '🚪',
  'Low self-worth': '💧'
}

function clampTitle(title: string): string {
  const words = (title||'').trim().split(/\s+/)
  if (words.length <= 7) return title.trim()
  return words.slice(0,7).join(' ') + '…'
}

function isIncompleteYou(s: string | undefined): boolean {
  if (!s) return true
  const t = s.trim()
  if (!t) return true
  if (/["'“”]$/.test(t)) return true
  if (/(?:\b|\s)(and|or|to|but|for|of|with|without|between|from|on)$/i.test(t)) return true
  if (t.length < 8) return true
  return false
}

function canonicalExamples(label: string, context: ReturnType<typeof getContext>): You[] {
  switch(label){
    case 'Executive dysfunction':
      return [
        { title: 'Open your laptop and freeze' },
        { title: 'Plan it perfectly, never start' },
        { title: 'Bounce between steps, lose the thread' }
      ]
    case 'Time blindness':
      return [
        { title: 'Think ten minutes—it’s forty' },
        { title: 'Start too late, race the clock' },
        { title: 'Miss the block—“later” kept winning' }
      ]
    case 'Working memory gaps':
      return [
        { title: 'Lose your place after one interruption' },
        { title: 'Re‑read but can’t recall' },
        { title: 'Forget the next step without a checklist' }
      ]
    case 'Shame/avoidance':
      return [
        { title: 'One small mistake → spiral + avoid' },
        { title: 'Avoid opening messages you fear' },
        { title: 'Freeze when feedback feels like danger' }
      ]
    case 'Attention/executive load':
      return [ { title: 'Open one tab, end up with twelve' }, { title: 'Chase a new idea mid‑task' } ]
    case 'Inconsistent motivation (dopamine‑based)':
      return [ { title: 'Only start when it’s exciting or urgent' }, { title: 'Can work at deadline, not before' } ]
    case 'Planning fallacy & transition friction':
      return [ { title: 'Leave early, still arrive late' }, { title: 'Prep steps steal your buffer' } ]
    default:
      return [ { title: 'Open your laptop and freeze' } ]
  }
}

function craftYou(existing: string | undefined, label: string, context: ReturnType<typeof getContext>, used: Set<string>): You {
  const cands = canonicalExamples(label, context)
  if (isIncompleteYou(existing)){
    for (const c of cands){
      const t = clampTitle(c.title)
      if (!used.has(t)) { used.add(t); return { title: t, body: c.body } }
    }
  }
  const raw = (existing || '').replace(/:\s*$/, '')
  const t = clampTitle(raw)
  if (!used.has(t)) { used.add(t); return { title: t } }
  for (const c of cands){
    const t2 = clampTitle(c.title)
    if (!used.has(t2)) { used.add(t2); return { title: t2, body: c.body } }
  }
  let unique = t
  let i = 2
  while (used.has(unique)) unique = `${t} (${i++})`
  used.add(unique)
  return { title: unique }
}

function buildRows(pageName: string, parsed: Parsed): { rows: Row[]; notes: string[] }{
  const context = getContext(pageName)
  const rows: Row[] = []
  const notes: string[] = []
  const used = new Set<string>()
  const pairs = Math.max(parsed.left.length, parsed.right.length)
  for (let i=0;i<pairs;i++){
    const right = parsed.right[i]
    let heading = normalizeLabel(right?.heading || '')
    let body = trimToTwoSentences(right?.desc || '')
    body = stripDuplicateLabel(body, heading)
    const icon = right?.emoji || ICON_BY_LABEL[heading] || '✨'
    const you = craftYou(parsed.left[i], heading, context, used)
    rows.push({ icon, youMight: you, whatsGoingOn: { title: ensureColon(heading), body } })
  }
  // de-dup pass
  const seen: Record<string, number> = {}
  rows.forEach(r => { seen[r.youMight.title] = (seen[r.youMight.title]||0)+1 })
  for (let i=0;i<rows.length;i++){
    if (seen[rows[i].youMight.title] > 1){
      const alts = canonicalExamples(rows[i].whatsGoingOn.title.replace(/[:：]$/,''), context)
      for (const a of alts){
        const t = clampTitle(a.title)
        if (!seen[t]) { seen[t]=1; rows[i].youMight.title = t; rows[i].youMight.body = a.body; break }
      }
      notes.push('Merged duplicate You might titles by assigning alternatives')
    }
  }
  return { rows, notes }
}

function rowsToDbLines(rows: Row[]): string[]{
  const lines: string[] = []
  lines.push('You might:')
  for (const r of rows){
    const left = `- ${r.youMight.title}${r.youMight.body ? ' — ' + r.youMight.body : ''}`
    lines.push(left)
  }
  lines.push("Here's what's really going on:")
  for (const r of rows){
    const labelNoColon = r.whatsGoingOn.title.replace(/[:：]$/, '')
    const right = `- ${r.icon ? r.icon + ' ' : ''}**${labelNoColon}**: ${r.whatsGoingOn.body}`
    lines.push(right)
  }
  return lines
}

async function processTable(table: 'tasks_content'|'complex_loops_content', nameField: string){
  const { data, error } = await supabase.from(table).select(`id, ${nameField}, adhd_reasons`)
  if (error || !data){
    console.error('Fetch error', table, error?.message)
    return
  }
  for (const row of data as any[]){
    const parsed = parseReasons(row.adhd_reasons as string[])
    const { rows } = buildRows(row[nameField] || '', parsed)
    const cleaned = rowsToDbLines(rows)
    const { error: updErr } = await supabase.from(table).update({ adhd_reasons: cleaned }).eq('id', row.id)
    if (updErr) console.error('Update failed', table, row[nameField], updErr.message)
    else console.log('✅ Updated', table, row[nameField])
  }
}

async function main(){
  await processTable('tasks_content', 'task_name')
  await processTable('complex_loops_content', 'loop_name')
}

main().catch(e=>{ console.error(e); process.exit(1) })

