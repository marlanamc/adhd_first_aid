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

const dir = process.argv[2] || path.join(process.cwd(), 'life_areas_sources')

async function countForSlug(slug: string): Promise<number> {
  const { count, error } = await supabase
    .from('life_areas_sources')
    .select('*', { count: 'exact', head: true })
    .eq('life_area_slug', slug)
  if (error) throw error
  return count || 0
}

async function main() {
  if (!fs.existsSync(dir)) {
    console.error('Directory not found:', dir)
    process.exit(1)
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'Task_sources.md')
  const missing: Array<{ file: string; slug: string }> = []

  console.log('Auditing life_areas_sources in:', dir)
  for (const file of files) {
    const base = file.replace(/\.md$/, '')
    const slug = base.replace(/_/g, '-')
    const count = await countForSlug(slug)
    const status = count > 0 ? 'OK' : 'MISSING'
    console.log(`${status}  ${slug}  (${file})  — rows: ${count}`)
    if (count === 0) missing.push({ file, slug })
  }

  console.log('\nSummary:')
  console.log('Total files:', files.length)
  console.log('Missing:', missing.length)
  if (missing.length > 0) {
    console.log('\nMissing list:')
    for (const m of missing) console.log(`- ${m.slug} (${m.file})`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })

