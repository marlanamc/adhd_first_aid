#!/usr/bin/env tsx
/*
  Clean and verify ADHD Reasons for life_areas and complex_loops.
  - Normalizes labels to canonical set with trailing colon
  - Rewrites concise bodies (<= ~140 chars, <= 2 sentences)
  - Ensures icon/emoji only in the icon slot (line prefix), not in body
  - Keeps left/right coherence; varies duplicate bodies per page
  - Dry-run by default; apply with --apply
  - Optional --slug=<page-slug-fragment>
*/

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Table = 'tasks_content' | 'complex_loops_content'

type You = { raw: string }
type Real = { emoji?: string; heading?: string; desc?: string }

const CANON: Record<string,string> = {
  'Executive dysfunction': 'Executive dysfunction:',
  'Working memory gaps': 'Working memory gaps:',
  'Time blindness': 'Time blindness:',
  'Attention dysregulation': 'Attention dysregulation:',
  'Dopamine-based motivation': 'Dopamine-based motivation:',
  'Planning fallacy & transitions': 'Planning fallacy & transitions:',
  'Emotional dysregulation / RSD trigger': 'Emotional dysregulation / RSD trigger:',
}

const LABEL_EMOJI: Record<string,string> = {
  'Executive dysfunction:': '🧩',
  'Working memory gaps:': '🧠',
  'Time blindness:': '⏰',
  'Attention dysregulation:': '🎯',
  'Dopamine-based motivation:': '⚡',
  'Planning fallacy & transitions:': '⏱️',
  'Emotional dysregulation / RSD trigger:': '😣',
}

function toSlug(name: string){
  return (name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$|--+/g,'-')
}

function parseReasons(lines: string[]|null){
  const you: You[] = []
  const real: Real[] = []
  if (!lines) return { you, real }
  let section: 'you'|'real'|'' = ''
  for (const raw of lines){
    const line = (raw||'').trim()
    if (!line) continue
    if (/^you might:/i.test(line)) { section = 'you'; continue }
    if (/^here'?s what'?s really going on:/i.test(line)) { section = 'real'; continue }
    if (section === 'you'){
      you.push({ raw: line.replace(/^[-•]\s*/, '').trim() })
    } else if (section === 'real'){
      const m = line.match(/^(\p{Extended_Pictographic})?\s*\*\*(.*?)\*\*[:：]?\s*(.*)$/u)
      if (m){
        real.push({ emoji: m[1] || undefined, heading: (m[2]||'').trim(), desc: (m[3]||'').trim() })
      } else {
        real.push({ heading: '', desc: line })
      }
    }
  }
  return { you, real }
}

function clampSentences(text: string, maxChars = 140): string {
  const cleaned = text
    .replace(/[\p{Extended_Pictographic}]/gu,'')
    .replace(/\*\*+/g,'')
    .replace(/\(matches[\s\S]*?\)/ig,'')
    .replace(/[—–]/g,' ')
    .replace(/\s+/g,' ').trim()
  const parts = cleaned.split(/(?<=[.!?])\s+/)
  let out = parts.slice(0,2).join(' ').trim()
  if (out.length > maxChars) out = out.slice(0, maxChars).trim().replace(/[,:;\-\s]+$/,'')
  return out
}

function pickLabel(you: string, heading?: string, desc?: string): keyof typeof CANON {
  const text = `${you} ${heading||''} ${desc||''}`.toLowerCase()
  const has = (re:RegExp)=>re.test(text)
  if (has(/late|ran out of time|hours? (passed|later)|look up.*(hours|time)|timer|deadline|time blind/)) return 'Time blindness'
  if (has(/freeze|can't start|cant start|stare|plan( it)? perfectly.*never start|initiat/)) return 'Executive dysfunction'
  if (has(/forget|lost place|what'?s next|re-?read|after interruption|materials/)) return 'Working memory gaps'
  if (has(/tab|switch|too many inputs|bounc|zoned? out|focus|attention/)) return 'Attention dysregulation'
  if (has(/only.*urgent|bored|novel|new idea|motivation|dopamine/)) return 'Dopamine-based motivation'
  if (has(/transition|prep|buffer|estimate|planning fallacy|hand-?off/)) return 'Planning fallacy & transitions'
  if (has(/shame|avoid|fear|feedback|rsd|threat|embarrass|guilt/)) return 'Emotional dysregulation / RSD trigger'
  return 'Executive dysfunction'
}

function templateBody(label: string, you: string): string {
  switch(label){
    case 'Executive dysfunction:':
      return 'initiation or sequencing are hard; planning overwhelms action.'
    case 'Working memory gaps:':
      return 'steps drop after interruptions; checklists/visuals keep place.'
    case 'Time blindness:':
      return 'time feels fuzzy; “later” wins until urgency hits.'
    case 'Attention dysregulation:':
      return 'hard to select, sustain, or shift focus under load.'
    case 'Dopamine-based motivation:':
      return 'interest/novelty/urgency drive effort more than importance.'
    case 'Planning fallacy & transitions:':
      return 'prep takes longer than expected; switching costs stall starts.'
    case 'Emotional dysregulation / RSD trigger:':
      return 'threat/shame states block initiation and recovery.'
    default:
      return 'initiation or sequencing are hard; planning overwhelms action.'
  }
}

function rewritePage(name: string, lines: string[]|null){
  const { you, real } = parseReasons(lines)
  const pairCount = Math.max(you.length, real.length)
  const newYou: string[] = []
  const newReal: string[] = []
  const seenBodies: Record<string, Set<string>> = {}
  for (let i=0;i<pairCount;i++){
    const youText = (you[i]?.raw || '').replace(/^[-•]\s*/,'').trim()
    const prev = real[i] || {}
    const canonKey = pickLabel(youText, prev.heading, prev.desc)
    const label = CANON[canonKey]
    const emoji = LABEL_EMOJI[label]
    let body = prev.desc || ''
    // strip duplicate label in body and emojis
    body = body.replace(new RegExp('^\\s*(?:\\*\\*)?'+label.replace(/[:：]$/,'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:\\*\\*)?\\s*[:：-]?\\s*','i'), '')
    body = clampSentences(body || templateBody(label, youText))
    if (!seenBodies[label]) seenBodies[label] = new Set<string>()
    if (seenBodies[label].has(body)){
      // vary the body using youText hint
      const hint = clampSentences(youText.replace(/[,.;:]+/g,'').trim(), 60).toLowerCase()
      switch(label){
        case 'Working memory gaps:': body = 'without supports, the next step drops after interruptions.'; break
        case 'Time blindness:': body = 'blocks blur together; starting too late creates a rush at the end.'; break
        case 'Executive dysfunction:': body = 'when the first step isn’t obvious, starting stalls.'; break
        case 'Attention dysregulation:': body = 'competing inputs make focus slippery; narrowing inputs helps.'; break
        default: body = templateBody(label, youText) + (hint? ' ('+hint+')':'')
      }
    }
    seenBodies[label].add(body)
    newYou.push(`- ${youText}`)
    // Persist the chosen label emoji for UI use by prefixing it here; UI parser can extract it
    newReal.push(`- ${emoji} **${label.replace(/[:：]$/,'')}**: ${body}`)
  }
  const rebuilt = ['You might:', ...newYou, "Here's what's really going on:", ...newReal]
  return rebuilt
}

async function processTable(table: Table, apply: boolean, slugFilter?: string){
  const nameField = table === 'tasks_content' ? 'task_name' : 'loop_name'
  const { data, error } = await supabase.from(table).select(`id, ${nameField}, adhd_reasons`).order(nameField)
  if (error || !data) throw new Error(error?.message || 'fetch failed')
  for (const row of data as any[]){
    const name = row[nameField] as string
    const slug = toSlug(name)
    if (slugFilter && slug !== slugFilter) continue
    const before = row.adhd_reasons as string[] | null
    const after = rewritePage(name, before)
    const diff = { page: name, changed: JSON.stringify(before) !== JSON.stringify(after) }
    if (!apply){
      console.log(JSON.stringify(diff))
    } else {
      const { error: updErr } = await supabase.from(table).update({ adhd_reasons: after }).eq('id', row.id)
      if (updErr) console.error('Update failed', table, name, updErr.message)
      else console.log('✅ Updated', table, name)
    }
  }
}

async function main(){
  const APPLY = process.argv.includes('--apply')
  const dirsArg = (process.argv.find(a=>a.startsWith('--dirs='))||'').split('=')[1] || 'life_areas,complex_loops'
  const dirs = new Set(dirsArg.split(',').map(s=>s.trim()))
  const slugArg = (process.argv.find(a=>a.startsWith('--slug='))||'').split('=')[1]
  if (dirs.has('life_areas')) await processTable('tasks_content', APPLY, slugArg)
  if (dirs.has('complex_loops')) await processTable('complex_loops_content', APPLY, slugArg)
}

main().catch(e=>{ console.error(e); process.exit(1) })

