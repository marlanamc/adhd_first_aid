import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { parse } from 'csv-parse/sync'

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
  // Use a real CSV parser to correctly handle quoted fields and commas
  const records: Array<Record<string, string>> = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true,
    trim: true
  })

  const map = new Map<string, BibRow>()
  for (const row of records) {
    const title = normalize((row['Title'] ?? (row as any)['title'] ?? ''))
    if (!title) continue
    const authors = normalize(
      row['Author(s)'] ?? row['Authors'] ?? (row as any)['author(s)'] ?? (row as any)['authors'] ?? ''
    )
    const year = normalize(String(row['Year'] ?? (row as any)['year'] ?? ''))
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
      // Some lists use "Title (Year) — Author" or "Title — Author (Year)"
      const emDashSplit = raw.split(/\s+[—-]\s+/)
      if (emDashSplit.length === 2){
        let t = emDashSplit[0]
        let a = emDashSplit[1]
        // Move year from authors to title if present there
        const yearInAuthors = a.match(/\((19|20)\d{2}\)/)
        const yearInTitle = t.match(/\((19|20)\d{2}\)/)
        if (yearInAuthors && !yearInTitle) {
          t = `${t} ${yearInAuthors[0]}`
          a = a.replace(yearInAuthors[0], '').trim()
        }
        lastItem = { title: normalize(t), authors: normalize(a), category: currentCategory }
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
    // Identity files often use a bold title line followed by an authors line and then a description line
    const boldTitle = line.match(/^\s*\*\*(.+?)\*\*\s*$/)
    if (boldTitle){
      lastItem = { title: normalize(boldTitle[1]), category: currentCategory }
      items.push(lastItem)
      continue
    }
    // Authors line directly after a bold title, e.g. "Lastname, First; Name (2024)"
    if (lastItem && !lastItem.authors){
      const authorLine = line.match(/^\s*([^\(]+?)(?:\s*\((19|20)\d{2}\))?\s*$/)
      if (authorLine && authorLine[1] && !/^##/.test(authorLine[1]) && !/^\*\*/.test(authorLine[1])){
        const authors = normalize(authorLine[1])
        if (authors && /[,;&]/.test(authors)){
          lastItem.authors = authors
          continue
        }
      }
    }
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

async function main(){
  console.log(`📥 Import identity_sources ${APPLY ? '(apply)' : '(dry-run)'} — only titles in formatted bibliography will be imported`)

  const mdDir = path.join(process.cwd(), 'identity_sources')
  const bibPath = path.join(process.cwd(), 'Formatted_ADHD_Source_Bibliography.csv')
  const BIB = loadBibliography(bibPath)

  const files = fs.readdirSync(mdDir).filter(f=>f.endsWith('.md'))
  const toInsert: any[] = []

  // Map markdown filenames to site route slugs
  const slugMap: Record<string,string> = {
    'audhd': 'the-audhd-individual',
    'bipoc': 'the-bipoc-individual',
    'breadwinner': 'the-breadwinner',
    'burned_out_professional': 'the-burned-out-professional',
    'caretaker': 'the-caretaker',
    'creative_with_adhd': 'the-creative',
    'entrepreneur': 'the-entrepreneur',
    'grieving': 'the-grieving-or-emotionally-raw-individual',
    'immigrant': 'the-immigrant',
    'job_seeker': 'the-job-seeker',
    'low_income': 'the-low-income-individual',
    'neurodivergent_adult': 'the-neurodivergent-adult',
    'no_support_system': 'the-individual-without-a-support-system',
    'over_responsible_sibling': 'the-overly-responsible-sibling',
    'parent': 'the-parent',
    'parent_of_adhd_child': 'the-parent-of-an-adhd-child',
    'queer_or_trans': 'queer_or_trans',
    'recently_diagnosed': 'the-recently-diagnosed',
    'recovering_perfectionist': 'the-recovering-perfectionist',
    'sick_chronically_ill': 'the-sick-or-chronically-ill-adult',
    'solo_household_manager': 'the-solo-household-manager',
    'student': 'the-student',
    'working_multiple_jobs': 'the-working-multiple-jobs-individual',
  }

  for (const file of files){
    const base = file.replace(/\.md$/, '')
    const key = base.toLowerCase()
    const mapped = slugMap[key] || base.replace(/_/g,'-')
    const identity_slug = mapped
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

