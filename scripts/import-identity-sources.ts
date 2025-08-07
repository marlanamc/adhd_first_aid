import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const APPLY = process.argv.includes('--apply')

// --- Bibliography helpers
interface BibRow { title: string; authors: string; year?: string }

const STOPWORDS = new Set(
  'a,an,and,of,or,the,with,for,to,into,on,in,by,about,adhd,new,guide,introduction,how,why'.split(',')
)

function normalize(s: string) {
  return (s || '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function toTokens(s: string): string[] {
  return normalize(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t && !STOPWORDS.has(t))
}

function scoreMatch(query: string, target: string): number {
  const qt = toTokens(query)
  const tt = toTokens(target)
  if (qt.length === 0 || tt.length === 0) return 0
  const tset = new Set(tt)
  let hits = 0
  for (const tok of qt) if (tset.has(tok)) hits++
  // small bonus for substring presence to catch short titles like "ADHD 2.0"
  const sub = target.toLowerCase().includes(query.toLowerCase()) ? 0.5 : 0
  return hits / qt.length + sub
}

function loadBibliography(csvPath: string): Map<string, BibRow> {
  const csv = fs.readFileSync(csvPath, 'utf8')
  const lines = csv.split(/\r?\n/).filter(Boolean)
  const header = lines.shift()!
  const cols = header.split(',').map(h => h.trim().toLowerCase())
  const titleIdx = cols.indexOf('title')
  const authorsIdx = cols.indexOf('authors')
  const yearIdx = cols.findIndex(c => c.includes('year'))
  const map = new Map<string, BibRow>()
  for (const line of lines) {
    const parts = line.split(',')
    const title = normalize(parts[titleIdx] || '')
    if (!title) continue
    const authors = normalize(parts[authorsIdx] || '')
    const year = normalize(parts[yearIdx] || '')
    map.set(title.toLowerCase(), { title, authors, year })
  }
  return map
}

function findFuzzyMatch(queryTitle: string, bib: Map<string, BibRow>): BibRow | undefined {
  const exact = bib.get(normalize(queryTitle).toLowerCase())
  if (exact) return exact
  let best: BibRow | undefined
  let bestScore = 0
  for (const row of bib.values()) {
    const s = scoreMatch(queryTitle, row.title)
    if (s > bestScore) { bestScore = s; best = row }
  }
  return bestScore >= 0.5 ? best : undefined
}

// --- Markdown extractor (### for category, bullets for items, next lines accumulate description)
function extractSourcesFromMarkdown(md: string): Array<{ title: string; authors?: string; description?: string; category?: string }>{
  const lines = md.replace(/\r/g,'').split('\n')
  const items: Array<{ title: string; authors?: string; description?: string; category?: string }> = []
  let lastItem: any = null
  let currentCategory: string | undefined

  const cleanCategory = (s: string) =>
    normalize(s.replace(/^###\s*/, '')).replace(/^[^A-Za-z0-9]+/, '').trim()

  for (let i=0;i<lines.length;i++){
    const line = lines[i]
    if (/^\s*---+\s*$/.test(line)) { lastItem = null; continue }
    const h3 = line.match(/^\s*###\s+(.+)$/)
    if (h3){ currentCategory = cleanCategory(h3[1]); lastItem = null; continue }
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
      if (title){ title = title.replace(/[.]+$/, '').trim() }
      if (authors){ authors = authors.replace(/[.]+$/, '').trim() }
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

async function main(){
  console.log(`📥 Import identity_sources ${APPLY ? '(apply)' : '(dry-run)'} — only titles in formatted bibliography will be imported`)

  const mdDir = path.join(process.cwd(), 'identity_sources')
  const bibPath = path.join(process.cwd(), 'Formatted_ADHD_Source_Bibliography.csv')
  const BIB = loadBibliography(bibPath)

  const files = fs.readdirSync(mdDir).filter(f=>f.endsWith('.md'))
  const toInsert: any[] = []

  for (const file of files){
    const identity_slug = file.replace(/\.md$/, '').replace(/_/g,'-')
    const md = fs.readFileSync(path.join(mdDir, file), 'utf8')
    const items = extractSourcesFromMarkdown(md)
    for (const it of items){
      const bib = BIB.get(normalize(it.title).toLowerCase()) || findFuzzyMatch(it.title, BIB)
      if (!bib){
        console.log('⏭️  Skipping (not in bibliography):', it.title)
        continue
      }
      const summary = toSentences(it.description || '')
      toInsert.push({
        identity_slug,
        category: it.category || 'Uncategorized',
        title: bib.year ? `${bib.title} (${bib.year})` : bib.title,
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
    const { error } = await supabase.from('identity_sources').insert(chunk)
    if (error){
      console.error('❌ Insert error:', error.message)
      process.exit(1)
    }
  }

  const { count } = await supabase.from('identity_sources').select('*', { count: 'exact', head: true })
  console.log('✅ Import complete. Row count:', count)
}

main().catch(err => { console.error(err); process.exit(1) })

