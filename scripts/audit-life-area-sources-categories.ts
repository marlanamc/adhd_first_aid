#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function getArgValue(flag: string): string | undefined {
  const ix = process.argv.indexOf(flag)
  if (ix !== -1 && ix + 1 < process.argv.length) return process.argv[ix + 1]
  const pref = flag + '='
  const found = process.argv.find(a => a.startsWith(pref))
  if (found) return found.slice(pref.length)
  return undefined
}

function normalize(s: string | null | undefined): string {
  return (s || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function extractMdCategories(md: string): string[] {
  const lines = md.replace(/\r/g,'').split('\n')
  const cats: string[] = []
  for (let i = 0; i < lines.length; i++){
    const m = lines[i].match(/^\s*##{1,3}\s+(.+)$/)
    if (m){
      const text = normalize(m[1])
      const isTop = /\bsources\b/i.test(text) && i < 5
      if (!isTop) cats.push(text.replace(/^[^A-Za-z0-9]+/, '').trim())
    }
  }
  return Array.from(new Set(cats))
}

async function main(){
  const mdDir = getArgValue('--dir') || path.join(process.cwd(), 'life_areas_sources')
  if (!fs.existsSync(mdDir)){
    console.error('Directory not found:', mdDir)
    process.exit(1)
  }

  const { data, error } = await supabase
    .from('life_areas_sources')
    .select('id, life_area_slug, title, category')

  if (error){
    console.error('Query error:', error.message)
    process.exit(1)
  }

  const rows = data || []
  const total = rows.length
  const uncategorized = rows.filter(r => !r.category || String(r.category).trim().length === 0)

  // Build MD category sets per slug
  const files = fs.readdirSync(mdDir).filter(f => f.endsWith('.md') && f !== 'Task_sources.md')
  const mdCats = new Map<string, Set<string>>()
  for (const f of files){
    const slug = f.replace(/\.md$/, '').replace(/_/g,'-')
    const md = fs.readFileSync(path.join(mdDir, f), 'utf8')
    mdCats.set(slug, new Set(extractMdCategories(md)))
  }

  // Aggregate per slug
  const bySlug: Record<string, { total: number; uncategorized: number; unknownCategory: number; samples: string[] }> = {}
  for (const r of rows){
    const key = r.life_area_slug
    if (!bySlug[key]) bySlug[key] = { total: 0, uncategorized: 0, unknownCategory: 0, samples: [] }
    bySlug[key].total++
    if (!r.category || String(r.category).trim().length === 0){
      bySlug[key].uncategorized++
      if (bySlug[key].samples.length < 5) bySlug[key].samples.push(`uncat: ${r.title}`)
    } else {
      const allowed = mdCats.get(key)
      if (allowed && !allowed.has(String(r.category))){
        bySlug[key].unknownCategory++
        if (bySlug[key].samples.length < 5) bySlug[key].samples.push(`mismatch [${r.category}] -> ${r.title}`)
      }
    }
  }

  console.log('Life Areas Sources — Category Audit')
  console.log('Total rows:', total)
  console.log('Uncategorized rows:', uncategorized.length)
  console.log('Unique slugs:', Object.keys(bySlug).length)

  const sorted = Object.entries(bySlug)
    .sort((a,b) => (b[1].uncategorized + b[1].unknownCategory) - (a[1].uncategorized + a[1].unknownCategory))

  for (const [slug, stats] of sorted){
    if (stats.uncategorized > 0 || stats.unknownCategory > 0){
      console.log(`- ${slug}: total=${stats.total} uncategorized=${stats.uncategorized} unknownCategory=${stats.unknownCategory}`)
      for (const s of stats.samples){
        console.log(`    • ${s}`)
      }
    }
  }

  // Print slugs with no issues at the end (compact)
  const ok = sorted.filter(([,s]) => s.uncategorized === 0 && s.unknownCategory === 0).map(([slug]) => slug)
  console.log('\nOK slugs:', ok.length)
  console.log(ok.join(', '))
}

main().catch(e => { console.error(e); process.exit(1) })

