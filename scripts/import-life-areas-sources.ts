#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
function getArgValue(flag: string): string | undefined {
  const ix = process.argv.indexOf(flag)
  if (ix !== -1 && ix + 1 < process.argv.length) return process.argv[ix + 1]
  const pref = flag + '='
  const found = process.argv.find(a => a.startsWith(pref))
  if (found) return found.slice(pref.length)
  return undefined
}

function loadBibliography(): Map<string, BibEntry> {
  const envPath = process.env.LAAK_BIBLIO_PATH || process.env.BIBLIO_PATH
  const argPath = getArgValue('--bib')
  const primary = envPath || argPath || path.join(process.cwd(), 'Formatted_ADHD_Source_Bibliography.csv')
  const fallback = path.join(process.cwd(), 'archive', 'docs', 'Formatted_ADHD_Source_Bibliography.csv')
  const file = fs.existsSync(primary) ? primary : fallback
  if (!fs.existsSync(file)) {
    throw new Error(`Formatted_ADHD_Source_Bibliography.csv not found. Looked in: \n- ${primary}\n- ${fallback}`)
  }
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
    // quick substring heuristic
    const substringMatch = cand.key.includes(key) || key.includes(cand.key)

    // token overlap score
    let overlap = 0
    for (const t of titleTokens) {
      if (cand.tokens.has(t)) overlap++
    }

    // scoring: prioritize substring match and token overlap
    let score = overlap
    if (substringMatch) score += 2
    if (cand.key.startsWith(key)) score += 1

    if (!best || score > best.score) {
      best = { score, entry: cand.entry }
    }
  }

  // require a minimum strength to avoid false positives
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
      .replace(/^[^A-Za-z0-9]+/, '')
      .trim()

  for (let i=0;i<lines.length;i++){
    const line = lines[i]
    if (/^\s*---+\s*$/.test(line)) { lastItem = null; continue }
    const h3 = line.match(/^\s*###\s+(.+)$/)
    if (h3){ currentCategory = cleanCategory(h3[1]); lastItem = null; continue }

    // Support bold title on its own line (followed by author/year or description lines)
    const boldTitle = line.match(/^\s*\*\*(.+?)\*\*\s*$/)
    if (boldTitle){
      lastItem = { title: normalize(boldTitle[1]), category: currentCategory }
      items.push(lastItem)
      continue
    }

    // Support one-line Title — Authors (Year) pattern (with or without italics)
    const emDashSplit = line.match(/^\s*\*\*(.+?)\*\*\s+[—-]\s+_?(.+?)_?\s*$/)
    if (emDashSplit){
      const title = normalize(emDashSplit[1])
      let authors = normalize(emDashSplit[2])
      // Remove trailing year in authors if present and append to title
      const yr = authors.match(/\((19|20)\d{2}\)/)
      let finalTitle = title
      if (yr) {
        finalTitle = `${title} ${yr[0]}`
        authors = authors.replace(yr[0], '').trim()
      }
      lastItem = { title: finalTitle, authors, category: currentCategory }
      items.push(lastItem)
      continue
    }

    // bullet line like: - Title by Authors
    const bullet = line.match(/^\s*[-*]\s+(.*)$/)
    if (bullet){
      const raw = bullet[1].trim()
      const authorTitleMatch = raw.match(/\*\*(.+?)\*\*\.?\s+_(.+?)_/)
      if (authorTitleMatch){
        const authors = authorTitleMatch[1].trim()
        const title = authorTitleMatch[2].trim()
        lastItem = { title: normalize(title), authors: normalize(authors), category: currentCategory }
        items.push(lastItem)
        continue
      }
      let title: string | undefined
      let authors: string | undefined
      const byIdx = raw.toLowerCase().lastIndexOf(' by ')
      if (byIdx > -1){
        title = raw.slice(0, byIdx).trim()
        authors = raw.slice(byIdx + 4).trim()
      } else {
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

    // Authors line directly following a bold title
    if (lastItem && !lastItem.authors){
      const authorLine = line.match(/^\s*([^\(]+?)(?:\s*\((19|20)\d{2}|Undated\))?\s*$/)
      if (authorLine && authorLine[1] && !/^##/.test(authorLine[1]) && !/^\*\*/.test(authorLine[1])){
        const authors = normalize(authorLine[1])
        if (authors && /[,;&]/.test(authors)){
          lastItem.authors = authors
          continue
        }
      }
    }

    // description line
    if (lastItem && line.trim() && !/^\s*[-*]\s+/.test(line)){
      if (/^\s*###\s+/.test(line)) { lastItem = null; continue }
      const cleaned = line.replace(/^\s*➤\s*/, '')
      lastItem.description = normalize((lastItem.description ? lastItem.description + ' ' : '') + cleaned.trim())
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
  console.log(`📥 Import life_areas_sources ${APPLY?'(apply)':'(dry-run)'} — only titles in formatted bibliography will be imported`)

  const dirEnv = process.env.LAAK_LIFE_AREAS_SOURCES_DIR || process.env.LIFE_AREAS_SOURCES_DIR
  const dirArg = getArgValue('--dir')
  const mdDir = dirEnv || dirArg || path.join(process.cwd(), 'life_areas_sources')
  if (!fs.existsSync(mdDir)) {
    throw new Error(`life_areas_sources directory not found at ${mdDir}.\nProvide via --dir /absolute/path or set env LAAK_LIFE_AREAS_SOURCES_DIR.`)
  }
  let files = fs.readdirSync(mdDir).filter(f=>f.endsWith('.md') && f !== 'Task_sources.md')
  const only = getArgValue('--only')
  if (only) {
    const base = only.endsWith('.md') ? only : `${only}.md`
    files = files.filter(f => f === base)
    if (files.length === 0) {
      throw new Error(`--only specified '${only}' but file not found in ${mdDir}`)
    }
  }

  const toInsert: any[] = []

  for (const file of files){
    const life_area_slug = file.replace(/\.md$/,'').replace(/_/g,'-')
    const md = fs.readFileSync(path.join(mdDir, file),'utf8')
    const items = extractSourcesFromMarkdown(md)

    const humanizeSlug = (slug: string) => {
      const words = slug.split('-').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1))
      // specific niceties
      const text = words.join(' ').replace(/\bTodo\b/g, 'To-Do').replace(/\bAnd\b/g, '&')
      return text
    }

    for (const it of items){
      const bib = fuzzyFindBibByTitle(it.title)
      if (!bib){
        // Skip items not present in the formatted bibliography
        console.log('⏭️  Skipping (not in bibliography):', it.title)
        continue
      }
      // page-specific description
      const summary = toSentences(it.description || '')
      const fallback = `Used on this page to support ADHD-friendly strategies for ${humanizeSlug(life_area_slug)}.`
      const finalDescription = summary && summary.trim().length > 0 ? summary : fallback
      // ensure year appears after title
      const titleHasYear = /\((19|20)\d{2}\)/.test(bib.title)
      const titleWithYear = titleHasYear || !bib.year ? bib.title : `${bib.title} (${bib.year})`
      toInsert.push({
        life_area_slug,
        category: it.category || '',
        title: titleWithYear,
        authors: bib.authors,
        description: finalDescription,
      })
    }
  }

  console.log('✓ Prepared', toInsert.length, 'rows')

  if (!APPLY){
    console.log('Dry run complete. Pass --apply to write to database.')
    return
  }

  // Insert in chunks
  const chunkSize = 500
  for (let i=0;i<toInsert.length;i+=chunkSize){
    const chunk = toInsert.slice(i,i+chunkSize)
    const { error } = await supabase.from('life_areas_sources').insert(chunk)
    if (error){
      console.error('❌ Insert error:', error.message)
      process.exit(1)
    }
  }

  const { count } = await supabase.from('life_areas_sources').select('*', { count: 'exact', head: true })
  console.log('✅ Import complete. Row count:', count)
}

main().catch(err=>{ console.error(err); process.exit(1) })