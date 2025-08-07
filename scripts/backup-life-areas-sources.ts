#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main(){
  console.log('📦 Backing up life_areas_sources ...')
  const { data, error } = await supabase.from('life_areas_sources').select('*')
  if (error){ console.error('❌ fetch error:', error.message); process.exit(1) }
  const outDir = path.join(process.cwd(), 'archive', 'backups')
  fs.mkdirSync(outDir, { recursive: true })
  const file = path.join(outDir, `life_areas_sources_backup_${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
  console.log('✅ Saved', file, `(rows: ${data?.length || 0})`)
}

main().catch(err=>{ console.error(err); process.exit(1) })