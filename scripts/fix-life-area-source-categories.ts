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

function normalize(s: string | null | undefined): string {
  return (s || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function extractCategoryMap(md: string): Map<number, string> {
  // Map line index to the most recent category heading
  const map = new Map<number, string>()
  const lines = md.replace(/\r/g,'').split('\n')
  let current: string | undefined
  const clean = (s: string) => normalize(s.replace(/^##{1,3}\s*/, '')).replace(/^[^A-Za-z0-9]+/, '').trim()
  for (let i = 0; i < lines.length; i++){
    const ln = lines[i]
    const head = ln.match(/^\s*##{1,3}\s+(.+)$/)
    if (head){
      const text = normalize(head[1])
      const isTop = /\bsources\b/i.test(text) && i < 5
      current = isTop ? current : clean(text)
    }
    map.set(i, current || 'Uncategorized')
  }
  return map
}

function inferCategoryForTitle(md: string, title: string): string | undefined {
  const lines = md.replace(/\r/g,'').split('\n')
  const categoriesByLine = extractCategoryMap(md)
  const normTitle = normalize(title).replace(/\((19|20)\d{2}\)/g, '').trim()

  for (let i = 0; i < lines.length; i++){
    const ln = lines[i]
    // Try to match list item patterns that contain the title
    if (/^\s*[-*]\s+/.test(ln) || /^\s*\*\*.+\*\*\s*(—|-)/.test(ln) || /^\s*\*\*.+\*\*\s*$/.test(ln)){
      const plain = normalize(ln).replace(/^[-*]\s+/, '')
      if (plain.toLowerCase().includes(normTitle.toLowerCase())){
        return categoriesByLine.get(i)
      }
    }
  }
  return undefined
}

async function main(){
  console.log('🔎 Fixing missing categories in life_areas_sources...')
  const { data: allRows, error } = await supabase
    .from('life_areas_sources')
    .select('*')

  if (error){
    console.error('❌ Query error:', error.message)
    process.exit(1)
  }

  const rows = (allRows || []).filter((r: any) => {
    const c = (r.category || '').trim()
    return c.length === 0 || c.toLowerCase() === 'uncategorized'
  })
  if (rows.length === 0){
    console.log('✅ No rows with missing categories found.')
    return
  }

  const mdDir = process.env.LAAK_LIFE_AREAS_SOURCES_DIR || process.env.LIFE_AREAS_SOURCES_DIR || path.join(process.cwd(), 'life_areas_sources')
  if (!fs.existsSync(mdDir)){
    console.error('❌ life_areas_sources directory not found at', mdDir)
    process.exit(1)
  }

  const updates: Array<{ id: number; category: string }> = []

  for (const row of rows){
    const file = path.join(mdDir, row.life_area_slug.replace(/-/g,'_') + '.md')
    if (!fs.existsSync(file)){
      console.warn('⏭️  Missing markdown for slug:', row.life_area_slug)
      continue
    }
    const md = fs.readFileSync(file, 'utf8')
    const cat = inferCategoryForTitle(md, row.title) || 'Uncategorized'
    updates.push({ id: row.id, category: cat })
  }

  console.log('Prepared updates:', updates.length)
  if (!APPLY){
    for (const u of updates.slice(0, 20)){
      console.log(`- id=${u.id} -> ${u.category}`)
    }
    if (updates.length > 20){
      console.log(`...and ${updates.length - 20} more`)
    }
    console.log('Dry run complete. Pass --apply to write changes.')
    return
  }

  // Apply updates row-by-row to avoid NOT NULL constraint issues on upsert
  let processed = 0
  for (const u of updates){
    const { error: upErr } = await supabase
      .from('life_areas_sources')
      .update({ category: u.category })
      .eq('id', u.id)
    if (upErr){
      console.error('❌ Update error for id', u.id, ':', upErr.message)
      process.exit(1)
    }
    processed++
    if (processed % 50 === 0){
      console.log(`Updated ${processed}/${updates.length}`)
    }
  }

  console.log('✅ Category fix complete.')
}

main().catch(err => { console.error(err); process.exit(1) })

