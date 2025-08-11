#!/usr/bin/env tsx
import { getAllTasksContent, getAllComplexLoopsContent } from '@/lib/supabase'
import * as fs from 'fs'
import * as path from 'path'

type You = { title: string; body?: string }
type Real = { title: string; body: string }
type Row = { icon: string; youMight: You; whatsGoingOn: Real }

type Parsed = {
  left: string[]
  right: { emoji?: string; heading: string; desc: string }[]
}

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
      // optional emoji + **Heading**: desc
      const m = line.match(/^(\p{Extended_Pictographic})?\s*\*\*(.*?)\*\*[:：]?\s*(.*)$/u)
      if (m){
        const [, emoji, headingRaw, descRaw] = m
        const heading = (headingRaw || '').trim()
        const desc = (descRaw || '').trim()
        res.right.push({ emoji, heading, desc })
      } else {
        // fallback: treat as desc with unknown heading
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
  // keep original casing if close to canon
  const near = CANON_LABELS.find(L => L.toLowerCase() === k)
  return near || h || 'Executive dysfunction'
}

function trimToTwoSentences(text: string): string {
  const cleaned = (text || '').replace(/[—–]/g, ' ').replace(/\s+/g, ' ').trim()
  const parts = cleaned.split(/(?<=[.!?])\s+/)
  return parts.slice(0, 2).join(' ').trim()
}

const ICON_BY_LABEL: Record<string, string> = {
  'Executive dysfunction': '🧩',
  'Working memory gaps': '🧠',
  'Time blindness': '⏰',
  'Shame/avoidance': '🫣',
  'Attention/executive load': '🔀',
  'Inconsistent motivation (dopamine‑based)': '⚡️',
  'Planning fallacy & transition friction': '➡️'
}

type Example = { title: string; body?: string }

function canonicalExamples(label: string, context: ReturnType<typeof getContext>): Example[] {
  switch(label){
    case 'Executive dysfunction':
      return [
        { title: 'Open your laptop and freeze', body: context === 'study' ? 'The blank page feels too big.' : 'It’s hard to start the first step.' },
        { title: 'Plan it perfectly, never start', body: 'Over‑planning delays action.' },
        { title: 'Bounce between steps, lose the thread' }
      ]
    case 'Time blindness':
      return [
        { title: 'Think ten minutes—it’s forty', body: 'Blocks overrun and handoffs slip.' },
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
      return [
        { title: 'Open one tab, end up with twelve' },
        { title: 'Chase a new idea mid‑task' }
      ]
    case 'Inconsistent motivation (dopamine‑based)':
      return [
        { title: 'Only start when it’s exciting or urgent' },
        { title: 'Can work at deadline, not before' }
      ]
    case 'Planning fallacy & transition friction':
      return [
        { title: 'Leave early, still arrive late' },
        { title: 'Prep steps steal your buffer' },
        { title: 'Getting from one task to the next is sticky' }
      ]
    case 'Impulsivity':
      return [
        { title: 'Tap buy before thinking' },
        { title: 'Say yes before checking capacity' }
      ]
    case 'Masking':
      return [
        { title: 'Perform “okay” until you crash' },
        { title: 'Hide struggles to avoid judgment' }
      ]
    case 'Hypervigilance':
      return [
        { title: 'Scan for danger in every text' },
        { title: 'Rehearse arguments in your head' }
      ]
    case 'Perfectionism':
      return [
        { title: 'If it’s not perfect, skip it' },
        { title: 'Tweak forever, never ship' }
      ]
    case 'Weak interoception':
      return [
        { title: 'Miss hunger until you crash' },
        { title: 'Overeat because cues feel muted' }
      ]
    case 'Decision paralysis':
      return [
        { title: 'Rewrite it ten times, still stuck' },
        { title: 'Too many options, no decision' }
      ]
    case 'Sleep inertia':
      return [
        { title: 'Wake but can’t boot up' },
        { title: 'Hit snooze on autopilot' }
      ]
    case 'Negative self-talk':
      return [
        { title: 'Assume silence means rejection' },
        { title: 'Tell yourself you always fail' }
      ]
    case 'Paralysis':
      return [
        { title: 'Feel stuck after bad news' },
        { title: 'Safer not to try at all' }
      ]
    case 'Message backlog':
      return [
        { title: 'Compose replies only in your head' },
        { title: 'Draft, never send' }
      ]
    case 'Sensory desensitization':
      return [
        { title: 'Sleep through the loudest alarm' }
      ]
    case 'Inconsistent sleep habits':
      return [
        { title: 'Crash at random times' }
      ]
    case 'All-or-nothing thinking':
      return [
        { title: 'If not perfect, why start' },
        { title: 'One slip = total reset' }
      ]
    case 'Initiation paralysis':
      return [
        { title: 'Short windows feel useless' },
        { title: 'Stare at the starting line' }
      ]
    case 'Low self-worth':
      return [
        { title: 'Say yes to earn approval' },
        { title: 'Overwork to prove your value' }
      ]
    default:
      return [ { title: 'Open your laptop and freeze' } ]
  }
}

function clampTitle(title: string): string {
  const words = title.split(/\s+/)
  if (words.length <= 7) return title
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

function craftYouMight(existing: string | undefined, label: string, context: ReturnType<typeof getContext>, used: Set<string>): You {
  const candidates = canonicalExamples(label, context)
  // if existing is incomplete or generic, prefer canonical
  if (isIncompleteYou(existing)){
    for (const c of candidates){
      const title = clampTitle(c.title)
      if (!used.has(title)) { used.add(title); return { title, body: c.body } }
    }
  }
  // use existing but clamp and sanitize
  const raw = (existing || '').replace(/:\s*$/, '')
  const title = clampTitle(raw.replace(/[:：]$/, ''))
  if (!used.has(title)) { used.add(title); return { title } }
  // fallback to canonical unique
  for (const c of candidates){
    const ct = clampTitle(c.title)
    if (!used.has(ct)) { used.add(ct); return { title: ct, body: c.body } }
  }
  let unique = title
  let i = 2
  while (used.has(unique)) { unique = `${title} (${i++})` }
  used.add(unique)
  return { title: unique }
}

function buildRows(pageName: string, parsed: Parsed): { rows: Row[]; notes: string[] }{
  const context = getContext(pageName)
  const rows: Row[] = []
  const notes: string[] = []
  const usedTitles = new Set<string>()
  const pairs = Math.max(parsed.left.length, parsed.right.length)
  for (let i=0;i<pairs;i++){
    const right = parsed.right[i]
    let heading = normalizeLabel(right?.heading || '')
    let body = trimToTwoSentences(right?.desc || '')
    const icon = right?.emoji || ICON_BY_LABEL[heading] || '✨'

    const youExisting = parsed.left[i]
    const you = craftYouMight(youExisting, heading, context, usedTitles)
    rows.push({ icon, youMight: you, whatsGoingOn: { title: ensureColon(heading), body } })
  }
  // De-duplicate exact duplicate titles across rows by re-rolling from canonical pool
  const titleCounts: Record<string, number> = {}
  rows.forEach(r => { titleCounts[r.youMight.title] = (titleCounts[r.youMight.title] || 0) + 1 })
  for (let i=0;i<rows.length;i++){
    if (titleCounts[rows[i].youMight.title] > 1){
      const alt = canonicalExamples(rows[i].whatsGoingOn.title.replace(/[:：]$/, ''), context)
      for (const c of alt){
        if (!usedTitles.has(c.title)) { usedTitles.add(c.title); rows[i].youMight.title = c.title; rows[i].youMight.body = c.body; break }
      }
      titleCounts[rows[i].youMight.title] = 1
      notes.push('Merged duplicate You might titles by assigning alternatives')
    }
  }
  return { rows, notes }
}

function writeJson(pagePath: string, data: any){
  const dir = path.join(process.cwd(), 'scripts', 'reports', 'adhd-reasons-json')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const file = path.join(dir, pagePath.replace(/\//g, '__') + '.json')
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

function toSlug(name: string){
  return (name||'').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$|--+/g, '-')
}

async function main(){
  const blocks: any[] = []
  const tasks = await getAllTasksContent()
  for (const t of (tasks.data || []) as any[]){
    const parsed = parseReasons(t.adhd_reasons as string[])
    const { rows, notes } = buildRows(t.task_name || '', parsed)
    const page = `life_areas/${toSlug(t.task_name || '')}.mdx`
    const block = { page, rows, notes }
    blocks.push(block)
    writeJson(page, block)
  }
  const loops = await getAllComplexLoopsContent()
  for (const t of (loops.data || []) as any[]){
    const parsed = parseReasons(t.adhd_reasons as string[])
    const { rows, notes } = buildRows(t.loop_name || '', parsed)
    const page = `complex_loops/${toSlug(t.loop_name || '')}.mdx`
    const block = { page, rows, notes }
    blocks.push(block)
    writeJson(page, block)
  }
  // Print one JSON block per page to stdout
  for (const b of blocks){
    process.stdout.write(JSON.stringify(b, null, 2) + '\n\n')
  }
}

main().catch(err=>{ console.error(err); process.exit(1) })

