#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const DRY_RUN = !process.argv.includes('--apply')

function normalize(str: string | null | undefined): string {
  return (str || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeForMatch(str: string): string {
  return normalize(str)
    .toLowerCase()
    .replace(/\((19|20)\d{2}\)/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseCSVLine(line: string): string[] {
  // split by commas not inside quotes
  const parts: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (ch === ',' && !inQuotes) {
      parts.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  parts.push(current)
  return parts.map(s => s.trim())
}

type BibEntry = { title: string; authors: string; year?: string }

function loadBibliography(): { byTitle: Map<string, BibEntry>; byAuthors: Map<string, BibEntry[]> } {
  const bibPath = path.join(process.cwd(), 'Formatted_ADHD_Source_Bibliography.csv')
  const content = fs.readFileSync(bibPath, 'utf8')
  const lines = content.split(/\r?\n/).slice(1).filter(Boolean)
  const byTitle = new Map<string, BibEntry>()
  const byAuthors = new Map<string, BibEntry[]>()
  for (const line of lines) {
    const [title, authors, year] = parseCSVLine(line)
    const entry: BibEntry = { title, authors, year }
    byTitle.set(normalizeForMatch(title), entry)
    const key = normalizeForMatch(authors)
    const arr = byAuthors.get(key) || []
    arr.push(entry)
    byAuthors.set(key, arr)
  }
  return { byTitle, byAuthors }
}

function findTitleInText(text: string, titles: Map<string, BibEntry>): BibEntry | null {
  const clean = normalize(text)
  for (const [normTitle, entry] of titles.entries()) {
    const re = new RegExp(entry.title.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'i')
    if (re.test(clean)) return entry
  }
  return null
}

function slugToMarkdownPath(lifeAreaSlug: string): string {
  const file = lifeAreaSlug.replace(/-/g, '_') + '.md'
  return path.join(process.cwd(), 'life_areas_sources', file)
}

async function main() {
  console.log(`🔧 Repairing titles/authors ${DRY_RUN ? '(dry-run)' : '(apply)'} ...`)

  const { byTitle, byAuthors } = loadBibliography()

  const { data: rows, error } = await supabase.from('life_areas_sources').select('*')
  if (error) {
    console.error('❌ fetch error:', error.message)
    process.exit(1)
  }

  let examined = 0
  let updated = 0
  let skipped = 0

  for (const row of rows || []) {
    examined++
    const title = normalize(row.title)
    const authors = normalize(row.authors)
    const desc = normalize(row.description)

    const normTitle = normalizeForMatch(title)
    const normAuthors = normalizeForMatch(authors)

    let fixTitle: string | null = null
    let fixAuthors: string | null = null

    // Case A: Title matches a known bibliography title -> trust authors from bib
    const titleBib = byTitle.get(normTitle)
    if (titleBib) {
      fixTitle = titleBib.title
      fixAuthors = titleBib.authors
    } else {
      // Case B: Title looks like an author list
      const possibleByAuthors = byAuthors.get(normTitle)
      if (possibleByAuthors && possibleByAuthors.length) {
        // If description contains one of these titles, prefer it
        const byDesc = possibleByAuthors.find(e => new RegExp(e.title.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'i').test(desc))
        const entry = byDesc || (possibleByAuthors.length === 1 ? possibleByAuthors[0] : null)
        if (entry) {
          fixTitle = entry.title
          fixAuthors = entry.authors
        }
      }

      // Case C: Authors field is actually a title (swap)
      if (!fixTitle) {
        const authorsAsTitle = byTitle.get(normAuthors)
        if (authorsAsTitle) {
          fixTitle = authorsAsTitle.title
          fixAuthors = authorsAsTitle.authors
        }
      }

      // Case D: Try to find a title inside description or markdown page
      if (!fixTitle) {
        const foundInDesc = findTitleInText(desc, byTitle)
        if (foundInDesc) {
          fixTitle = foundInDesc.title
          fixAuthors = foundInDesc.authors
        } else {
          const mdPath = slugToMarkdownPath(row.life_area_slug)
          if (fs.existsSync(mdPath)) {
            const md = fs.readFileSync(mdPath, 'utf8')
            const foundInMd = findTitleInText(md, byTitle)
            if (foundInMd) {
              fixTitle = foundInMd.title
              fixAuthors = foundInMd.authors
            }
          }
        }
      }
    }

    // If we determined a title, ensure authors present
    if (fixTitle && !fixAuthors) {
      const tEntry = byTitle.get(normalizeForMatch(fixTitle))
      fixAuthors = tEntry?.authors || authors || null
    }

    // If nothing to change, skip
    const willChange = (fixTitle && fixTitle !== title) || (fixAuthors && fixAuthors !== authors)
    if (!willChange) { skipped++; continue }

    const update: Record<string, any> = {}
    if (fixTitle) update.title = fixTitle
    if (fixAuthors) update.authors = fixAuthors

    if (DRY_RUN) {
      console.log(`→ ${row.life_area_slug}`)
      console.log(`   title: '${title}' => '${update.title ?? title}'`)
      console.log(`   authors: '${authors}' => '${update.authors ?? authors}'`)
    } else {
      const { error: upErr } = await supabase.from('life_areas_sources').update(update).eq('id', row.id)
      if (upErr) {
        console.error('❌ update failed', row.id, upErr.message)
      } else {
        updated++
      }
    }
  }

  console.log('\n📊 Summary')
  console.log('  Examined:', examined)
  console.log('  Will update/Updated:', DRY_RUN ? examined - skipped : updated)
}

main().catch(err => { console.error(err); process.exit(1) })