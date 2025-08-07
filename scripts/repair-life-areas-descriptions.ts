#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load env
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials.');
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

function looksLikeJustTitle(title: string, description: string): boolean {
  const t = normalize(title).toLowerCase()
  const d = normalize(description).toLowerCase()
  if (!d) return true
  // Remove year from title and compare
  const tNoYear = t.replace(/\((19|20)\d{2}\)/g, '').trim()
  return d === tNoYear || d === t || d.replace(/[.]+$/, '') === tNoYear
}

function slugToMarkdownPath(lifeAreaSlug: string): string {
  const file = lifeAreaSlug.replace(/-/g, '_') + '.md'
  return path.join(process.cwd(), 'life_areas_sources', file)
}

function toSentences(text: string, maxSentences = 2): string {
  const cleaned = normalize(text)
  const parts = cleaned
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
  const snippet = parts.slice(0, maxSentences).join(' ')
  return snippet || cleaned
}

function extractSummaryFromMarkdown(md: string, title: string, authors: string | null): string | null {
  const mdClean = md.replace(/\r/g, '')
  const mdLines = mdClean.split('\n')

  const tNorm = normalize(title)
  const tNeedle = tNorm.replace(/[.*+?^${}()|[\]\\]/g, '.') // relaxed match
  const tRegex = new RegExp(tNeedle, 'i')

  const aNorm = normalize(authors || '')
  const aNeedle = aNorm.replace(/[.*+?^${}()|[\]\\]/g, '.')
  const aRegex = aNorm ? new RegExp(aNeedle, 'i') : null

  // Locate the line that mentions title (preferred) or authors
  let idx = mdLines.findIndex(l => tRegex.test(l.replace(/_/g, '')))
  if (idx === -1 && aRegex) idx = mdLines.findIndex(l => aRegex!.test(l))
  if (idx === -1) return null

  // Try to take the next 1-3 lines that look like description text (not another title)
  const collected: string[] = []
  for (let i = idx + 1; i < Math.min(idx + 6, mdLines.length); i++) {
    const line = mdLines[i]
    if (!line) continue
    // Stop if next source or new category header starts (common patterns)
    if (/^\s*[-*]\s+(_.*_|\*.*\*)/i.test(line)) break
    if (/^#{1,6}\s/.test(line)) break
    const text = line.replace(/^\s*[-*]\s+/, '').trim()
    if (!text) continue
    collected.push(text)
    if (collected.join(' ').length > 300) break
  }

  if (collected.length === 0) return null
  return toSentences(collected.join(' '), 2)
}

async function main() {
  console.log(`🔧 Repairing life_areas_sources descriptions ${DRY_RUN ? '(dry-run)' : '(apply)'}...`)

  const { data: rows, error } = await supabase
    .from('life_areas_sources')
    .select('*')

  if (error) {
    console.error('❌ Failed to fetch life_areas_sources:', error.message)
    process.exit(1)
  }

  let examined = 0
  let skipped = 0
  let updated = 0
  let fallbackUsed = 0

  for (const row of rows || []) {
    examined++
    const title = normalize(row.title)
    const description = normalize(row.description)

    const needsFix = !description || looksLikeJustTitle(title, description)
    if (!needsFix) { skipped++; continue }

    const mdPath = slugToMarkdownPath(row.life_area_slug)
    let summary: string | null = null

    if (fs.existsSync(mdPath)) {
      const md = fs.readFileSync(mdPath, 'utf8')
      summary = extractSummaryFromMarkdown(md, row.title, row.authors)
    }

    if (!summary) {
      // Fallback to category-based short summary
      const cat = normalize(row.category)
      if (cat) {
        summary = toSentences(`${cat} — page-specific insights and strategies relevant to this task.`, 1)
      } else {
        summary = 'Practical, page-specific guidance drawn from this source.'
      }
      fallbackUsed++
    }

    if (DRY_RUN) {
      console.log(`→ ${row.life_area_slug} :: ${title}`)
      console.log(`   was: ${description || '(empty)'}`)
      console.log(`   new: ${summary}`)
    } else {
      const { error: upErr } = await supabase
        .from('life_areas_sources')
        .update({ description: summary })
        .eq('id', row.id)

      if (upErr) {
        console.error('❌ Update failed for', row.id, upErr.message)
      } else {
        updated++
      }
    }
  }

  console.log('\n📊 Summary')
  console.log('  Examined:', examined)
  console.log('  Skipped (already ok):', skipped)
  if (DRY_RUN) console.log('  Would update:', examined - skipped)
  else console.log('  Updated:', updated)
  console.log('  Fallback summaries used:', fallbackUsed)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})