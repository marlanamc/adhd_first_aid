#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkLifeAreasSources() {
  console.log('🔍 Checking life_areas_sources data...')
  
  // Get all sources
  const { data: allSources, error } = await supabase
    .from('life_areas_sources')
    .select('*')
    .limit(10)
  
  if (error) {
    console.error('❌ Error fetching sources:', error)
    return
  }
  
  console.log(`📋 Sample data (first 10 records):`)
  allSources?.forEach((record, index) => {
    console.log(`Record ${index + 1}:`)
    console.log(`  Title: "${record.title}"`)
    console.log(`  Authors: "${record.authors}"`)
    console.log(`  Description: "${record.description}"`)
    console.log(`  Category: "${record.category}"`)
    console.log(`  Life Area: "${record.life_area_slug}"`)
    console.log('')
  })
  
  // Check specific life areas
  const testSlugs = ['focus-time', 'dishes', 'cleaning', 'cooking']
  
  for (const slug of testSlugs) {
    const { data: sources, error: slugError } = await supabase
      .from('life_areas_sources')
      .select('*')
      .eq('life_area_slug', slug)
      .limit(3)
    
    if (slugError) {
      console.log(`❌ Error fetching ${slug}:`, slugError)
    } else {
      console.log(`📚 ${slug}: ${sources?.length || 0} sources`)
      sources?.forEach((source, index) => {
        console.log(`  ${index + 1}. "${source.title}" by ${source.authors}`)
      })
      console.log('')
    }
  }
}

checkLifeAreasSources().catch(console.error) 