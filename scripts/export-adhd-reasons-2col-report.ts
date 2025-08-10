#!/usr/bin/env tsx
import { getAllTasksContent, getAllComplexLoopsContent } from '@/lib/supabase'
import * as fs from 'fs'
import * as path from 'path'

type TwoCol = { left: string[]; right: { heading: string; desc: string }[] }

const ensureColon = (s: string) => /[:：]$/.test(s.trim()) ? s.trim() : s.replace(/[—–-]+\s*$/, '').trim() + ':'

function parseReasons(lines: string[] | null): TwoCol {
  if (!lines || !Array.isArray(lines)) return { left: [], right: [] }
  const you: string[] = []
  const right: { heading: string; desc: string }[] = []
  let current = ''
  for (const line of lines) {
    if (/^you might:/i.test(line)) { current = 'you'; continue }
    if (/^here'?s what'?s really going on:/i.test(line)) { current = 'real'; continue }
    if (current === 'you') {
      const l = line.replace(/^[-•]\s*/, '').trim()
      if (l) you.push(l)
    } else if (current === 'real') {
      // Extract emoji + **Heading**: description
      const m = line.match(/^(\p{Extended_Pictographic})?\s*\*\*(.*?)\*\*[:：]?\s*(.*)$/u)
      if (m){
        let heading = m[2].trim()
        let desc = (m[3] || '').trim()
        // Normalize vague headings
        const dk = desc.toLowerCase()
        const hk = heading.toLowerCase()
        if (!heading || hk === 'insight' || hk.includes('context matters')){
          if (/executive/.test(dk)) heading = 'Executive dysfunction'
          else if (/working memory|remember|forget/.test(dk)) heading = 'Working memory'
          else if (/time|deadline|late/.test(dk)) heading = 'Time blindness'
          else if (/shame|rsd|avoid/.test(dk)) heading = 'Shame/avoidance'
          else if (/attention|focus/.test(dk)) heading = 'Attention/executive load'
          else heading = 'Executive dysfunction'
        }
        right.push({ heading, desc })
      } else {
        const s = line.trim()
        if (s) right.push({ heading: 'Executive dysfunction', desc: s })
      }
    }
  }
  return { left: you, right }
}

function toSlug(name: string){
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$|--+/g, '-')
}

function twoColTable(two: TwoCol): string{
  const rows: string[] = []
  rows.push('| You might | What\'s really going on |')
  rows.push('|---|---|')
  const len = Math.max(two.left.length, two.right.length)
  for (let i=0;i<len;i++){
    const left = two.left[i] ? two.left[i] : ''
    const r = two.right[i]
    const right = r ? `${ensureColon(r.heading)} ${r.desc}` : ''
    rows.push(`| ${left.replace(/\|/g,'/')} | ${right.replace(/\|/g,'/')} |`)
  }
  return rows.join('\n')
}

const GENERIC = new Set<string>([
  'Set a visible 20–30 min timer',
  'Do a 5‑4‑3‑2‑1 countdown',
  'Write a one‑sentence recap',
  'Open the doc and type 1 line',
  'Close extra tabs before starting',
  'Park links in a later window',
  'Use one‑tab full‑screen mode',
  'Take a 30‑sec reset'
])

function suggestStrategyMoves(pageName: string, two: TwoCol): string[]{
  const out: string[] = []
  const name = pageName.toLowerCase()
  const add = (s:string)=>{ const t=s.trim(); if (t && !GENERIC.has(t) && !out.includes(t)) out.push(t) }
  for (const r of two.right){
    const hk = r.heading.toLowerCase()
    const dk = r.desc.toLowerCase()
    if (/bills|money|budget|payment/.test(name)){
      if (/time|deadline/.test(dk)) add('Enable auto‑pay for essentials and calendar reminders')
      if (/working memory|forget/.test(dk)) add('Keep a 1‑page “bill checklist” and pay from it weekly')
      if (/executive|organization/.test(dk)) add('Do a 10‑minute “money sweep” block on the same day each week')
      if (/shame|avoid/.test(dk)) add('Rename the task neutrally (“10‑min money check”) and body‑double once')
      if (/attention|focus/.test(dk)) add('Pay bills in a dedicated one‑tab window only')
    }
    if (/scheduling|appointments|calendar/.test(name)){
      if (/executive/.test(hk+dk)) add('Use a 2‑step script: find 3 times → message in one sitting')
      if (/working memory|forget/.test(dk)) add('Template notes: who/why/where; paste when booking')
    }
    if (/paperwork|documents|forms/.test(name)){
      if (/executive/.test(hk+dk)) add('Set up a “paperwork kit” (ID, pen, folder) kept in one spot')
      if (/attention|focus/.test(dk)) add('Fill forms in 10‑minute passes; stop after one pass')
    }
    if (/phone|scroll|tabs/.test(name)){
      if (/attention/.test(hk+dk)) add('Use a “later” window or read‑it‑later list before you start')
    }
  }
  return out
}

async function main(){
  const out: string[] = []
  const tasks = await getAllTasksContent()
  for (const t of (tasks.data || []) as any[]){
    const two = parseReasons(t.adhd_reasons as string[])
    const slug = toSlug(t.task_name || '')
    out.push(`## ${t.task_name} (life_areas/${slug})\n`)
    out.push('### Updated ADHD Reasons (2 columns)\n')
    out.push(twoColTable(two)+"\n")
    const moves = suggestStrategyMoves(t.task_name || '', two)
    out.push('### Changes to Strategies\n' + (moves.length? moves.map(m=>`- ${m}`).join('\n') : '- None') + '\n')
  }
  const loops = await getAllComplexLoopsContent()
  for (const t of (loops.data || []) as any[]){
    const two = parseReasons(t.adhd_reasons as string[])
    const slug = toSlug(t.loop_name || '')
    out.push(`## ${t.loop_name} (complex_loops/${slug})\n`)
    out.push('### Updated ADHD Reasons (2 columns)\n')
    out.push(twoColTable(two)+"\n")
    const moves = suggestStrategyMoves(t.loop_name || '', two)
    out.push('### Changes to Strategies\n' + (moves.length? moves.map(m=>`- ${m}`).join('\n') : '- None') + '\n')
  }
  const reportDir = path.join(process.cwd(), 'scripts', 'reports')
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true })
  const file = path.join(reportDir, 'adhd-reasons-2col-report.md')
  fs.writeFileSync(file, out.join('\n'))
  console.log('Saved:', file)
}

main().catch(err => { console.error(err); process.exit(1) })

