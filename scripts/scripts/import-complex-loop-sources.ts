#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const APPLY = process.argv.includes('--apply')

// --- Helpers
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
function parseCSVLine(line: string): string[] {
  const parts: string[] = []
  let cur = ''
  let q = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { q = !q; continue }
    if (ch === ',' && !q) { parts.push(cur); cur = '' } else { cur += ch }
  }
  parts.push(cur)
  return parts.map(s => s.trim())
}

// --- Load formatted bibliography (authoritative allowlist)
 type BibEntry = { title: string; authors: string; year?: string }
 function loadBibliography(): Map<string, BibEntry> {
  const file = path.join(process.cwd(), 'Formatted_ADHD_Source_Bibliography.csv')
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).slice(1).filter(Boolean)
  const map = new Map<string, BibEntry>()
  for (const ln of lines) {
    const [title, authors, year] = parseCSVLine(ln)
    map.set(normKey(title), { title, authors, year })
  }
  return map
}

const BIB = loadBibliography()

const STOPWORDS = new Set([
  'a','an','the','and','or','of','for','to','in','on','with','without','your','you','new','guide','how','why','from','by','about','into','over','under','at','as'
])

function toTokens(s: string): Set<string> {
  return new Set(
    s
      .split(/\s+/)
      .map(w => w.trim())
      .filter(w => w.length > 0 && (!STOPWORDS.has(w) || /\d/.test(w) || w.length >= 4))
  )
}

// Build a searchable list for fuzzy matching
const BIB_ENTRIES: Array<{ key: string; entry: BibEntry; tokens: Set<string> }> = Array.from(BIB.entries()).map(([key, entry]) => ({
  key,
  entry,
  tokens: toTokens(key),
}))

function fuzzyFindBibByTitle(rawTitle: string): BibEntry | undefined {
  const key = normKey(rawTitle)
  const exact = BIB.get(key)
  if (exact) return exact

  const titleTokens = toTokens(key)

  let best: { score: number; entry: BibEntry } | null = null
  for (const cand of BIB_ENTRIES) {
    const substringMatch = cand.key.includes(key) || key.includes(cand.key)

    let overlap = 0
    for (const t of titleTokens) {
      if (cand.tokens.has(t)) overlap++
    }

    let score = overlap
    if (substringMatch) score += 2
    if (cand.key.startsWith(key)) score += 1

    if (!best || score > best.score) {
      best = { score, entry: cand.entry }
    }
  }

  if (best && best.score >= 3) {
    return best.entry
  }
  return undefined
}

// --- Extractors
function extractSourcesFromMarkdown(md: string): Array<{ title: string; authors?: string; description?: string; category?: string }>{
  const lines = md.replace(/\r/g,'').split('\n')
  const items: Array<{ title: string; authors?: string; description?: string; category?: string }> = []
  let lastItem: any = null
  let currentCategory: string | undefined

  const cleanCategory = (s: string) =>
    normalize(s.replace(/^###\s*/, ''))
      .replace(/^[^A-Za-z0-9]+/, '') // drop leading emoji/symbols
      .trim()

  for (let i=0;i<lines.length;i++){
    const line = lines[i]
    if (/^\s*---+\s*$/.test(line)) { lastItem = null; continue }

    const h3 = line.match(/^\s*###\s+(.+)$/)
    if (h3){
      currentCategory = cleanCategory(h3[1])
      lastItem = null
      continue
    }

    // Pattern A: Title on its own line in bold, followed by _authors_ and description lines
    const boldTitleLine = line.match(/^\s*\*\*(.+?)\*\*\s*$/)
    if (boldTitleLine){
      const title = normalize(boldTitleLine[1])
      let authors: string | undefined
      let descriptionParts: string[] = []
      // Look ahead for authors
      const maybeAuthors = lines[i+1]?.trim()
      if (maybeAuthors && /^_.+_$/.test(maybeAuthors)){
        authors = normalize(maybeAuthors.replace(/^_/, '').replace(/_$/, ''))
        i += 1
      }
      // Collect description lines starting with ➤ or plain text until blank/next bold/heading/hr
      let j = i + 1
      while (j < lines.length){
        const nxt = lines[j].trim()
        if (!nxt) break
        if (/^\s*###\s+/.test(nxt)) break
        if (/^\s*---+\s*$/.test(nxt)) break
        if (/^\s*\*\*(.+?)\*\*\s*$/.test(nxt)) break
        if (/^\s*[-*]\s+/.test(nxt)) break
        descriptionParts.push(nxt.replace(/^\s*➤\s*/, ''))
        j++
      }
      i = j - 1
      items.push({ title, authors, description: normalize(descriptionParts.join(' ')), category: currentCategory })
      lastItem = null
      continue
    }

    // Pattern B: Bulleted sources
    const bullet = line.match(/^\s*[-*]\s+(.*)$/)
    if (bullet){
      const raw = bullet[1].trim()
      // Pattern 0: **Author(s).** _Title_
      const authorTitleMatch = raw.match(/\*\*(.+?)\*\*\.?\s+_(.+?)_/)
      if (authorTitleMatch){
        const authors = authorTitleMatch[1].trim()
        const title = authorTitleMatch[2].trim()
        lastItem = { title: normalize(title), authors: normalize(authors), category: currentCategory }
        items.push(lastItem)
        continue
      }
      // Try pattern 1: Title by Authors
      let title: string | undefined
      let authors: string | undefined
      const byIdx = raw.toLowerCase().lastIndexOf(' by ')
      if (byIdx > -1){
        title = raw.slice(0, byIdx).trim()
        authors = raw.slice(byIdx + 4).trim()
      } else {
        // Try pattern 2: Authors. Title
        const dotSplit = raw.split(/\.\s+/, 2)
        if (dotSplit.length === 2){
          const left = dotSplit[0].trim()
          const right = dotSplit[1].trim()
          if (/(,|&| and )/i.test(left)){
            authors = left
            title = right
          }
        }
      }
      if (title){ title = title.replace(/[.]+$/,'').trim() }
      if (authors){ authors = authors.replace(/[.]+$/,'').trim() }
      if (title){
        lastItem = { title: normalize(title), authors: authors ? normalize(authors) : undefined, category: currentCategory }
        items.push(lastItem)
      } else {
        lastItem = null
      }
      continue
    }

    if (lastItem && line.trim() && !/^\s*[-*]\s+/.test(line)){
      if (/^\s*###\s+/.test(line)) { lastItem = null; continue }
      lastItem.description = normalize((lastItem.description ? lastItem.description + ' ' : '') + line.trim())
    }
  }
  return items
}

function toSentences(text: string, max=2){
  const parts = (text||'').split(/(?<=[.!?])\s+/).filter(Boolean)
  return parts.slice(0, max).join(' ') || text
}

// --- Import
async function main(){
  console.log(`📥 Import complex_loop_sources ${APPLY?'(apply)':'(dry-run)'} — only titles in formatted bibliography will be imported`)

  const mdDir = path.join(process.cwd(), 'complex_loop_sources')
  const files = fs.readdirSync(mdDir).filter(f=>f.endsWith('.md'))

  const toInsert: any[] = []

  for (const file of files){
    const loop_slug = file.replace(/\.md$/,'').replace(/_/g,'-')
    const md = fs.readFileSync(path.join(mdDir, file),'utf8')
    const items = extractSourcesFromMarkdown(md)

    for (const it of items){
      const bib = fuzzyFindBibByTitle(it.title)
      if (!bib){
        console.log('⏭️  Skipping (not in bibliography):', it.title)
        continue
      }
      const summary = toSentences(it.description || '')
      const titleHasYear = /\((19|20)\d{2}\)/.test(bib.title)
      const titleWithYear = titleHasYear || !bib.year ? bib.title : `${bib.title} (${bib.year})`
      toInsert.push({
        loop_slug,
        category: it.category || '',
        title: titleWithYear,
        authors: bib.authors,
        description: summary || undefined,
      })
    }
  }

  console.log('✓ Prepared', toInsert.length, 'rows')

  if (!APPLY){
    console.log('Dry run complete. Pass --apply to write to database.')
    return
  }

  const chunkSize = 500
  for (let i=0;i<toInsert.length;i+=chunkSize){
    const chunk = toInsert.slice(i,i+chunkSize)
    const { error } = await supabase.from('complex_loop_sources').insert(chunk)
    if (error){
      console.error('❌ Insert error:', error.message)
      process.exit(1)
    }
  }

  const { count } = await supabase.from('complex_loop_sources').select('*', { count: 'exact', head: true })
  console.log('✅ Import complete. Row count:', count)
}

main().catch(err=>{ console.error(err); process.exit(1) })