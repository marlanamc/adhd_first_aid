#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const DRY_RUN = !process.argv.includes('--apply')

function normalize(s: string | null | undefined): string {
  return (s || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function normKey(s: string): string {
  return normalize(s).toLowerCase().replace(/\((19|20)\d{2}\)/g, '').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()
}

type BibEntry = { title: string; authors: string; year?: string }

function parseCSVLine(line: string): string[] {
  const parts: string[] = []
  let cur = ''
  let q = false
  for (let i=0;i<line.length;i++){
    const ch=line[i]
    if (ch==='"'){ q=!q; continue }
    if (ch===',' && !q){ parts.push(cur); cur=''; }
    else cur+=ch
  }
  parts.push(cur)
  return parts.map(s=>s.trim())
}

function loadBibliography(): Map<string, BibEntry> {
  const m = new Map<string, BibEntry>()
  const file = path.join(process.cwd(),'Formatted_ADHD_Source_Bibliography.csv')
  const lines = fs.readFileSync(file,'utf8').split(/\r?\n/).slice(1).filter(Boolean)
  for (const ln of lines){
    const [title, authors, year] = parseCSVLine(ln)
    m.set(normKey(title), { title, authors, year })
  }
  return m
}

const bibByTitle = loadBibliography()

function looksLikePersonList(s: string): boolean {
  const n = normalize(s)
  return /(,|&| and )/.test(n) && /[A-Za-z]/.test(n) && !/\b(guide|adhd|brain|mind|habit|book|method|edge|planner|moments|chaos|talk|care|disorder)\b/i.test(n)
}

function cleanDescToTitle(desc: string): string {
  return normalize(desc).replace(/^[-*]\s+/, '').replace(/\s*—\s*/g,' — ')
}

async function main(){
  console.log(`🔧 Targeted swap repair ${DRY_RUN?'(dry-run)':'(apply)'}...`)
  const { data: rows, error } = await supabase.from('life_areas_sources').select('*')
  if (error){ console.error(error); process.exit(1) }

  let count = 0
  for (const r of rows || []){
    const title = normalize(r.title)
    const authors = normalize(r.authors)
    const description = normalize(r.description)

    const titleKey = normKey(title)
    const authorsKey = normKey(authors)

    const titleEqAuthors = titleKey && titleKey === authorsKey
    const titleLooksLikeAuthors = looksLikePersonList(title)
    const hasDesc = !!description

    if (!(titleEqAuthors || titleLooksLikeAuthors) || !hasDesc) continue

    // Prefer a bibliography match found in description
    let newTitle: string | null = null
    let newAuthors: string | null = null

    // Try to match any bibliography title within description
    for (const [k, entry] of bibByTitle.entries()){
      if (new RegExp(entry.title.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&'),'i').test(description)){
        newTitle = entry.title
        newAuthors = entry.authors
        break
      }
    }

    // Fallback: use the description as title, keep authors
    if (!newTitle){
      newTitle = cleanDescToTitle(description)
      newAuthors = authors
    }

    if (DRY_RUN){
      console.log(`→ ${r.life_area_slug}`)
      console.log(`   was: title='${title}' | authors='${authors}' | desc='${description.slice(0,80)}'`)
      console.log(`   fix: title='${newTitle}' | authors='${newAuthors}'`)
    } else {
      const { error: upErr } = await supabase.from('life_areas_sources').update({ title: newTitle, authors: newAuthors }).eq('id', r.id)
      if (upErr) console.error('❌ update failed', r.id, upErr.message)
      else count++
    }
  }

  console.log(`\n📊 ${DRY_RUN? 'Would update':'Updated'}: ${count}`)
}

main().catch(err=>{ console.error(err); process.exit(1) })