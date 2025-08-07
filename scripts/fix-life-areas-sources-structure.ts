#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixLifeAreasSourcesStructure() {
  console.log('🔧 Fixing life_areas_sources data structure...')
  
  // First, let's see what the current data looks like
  const { data: currentData, error: fetchError } = await supabase
    .from('life_areas_sources')
    .select('*')
    .limit(5)
  
  if (fetchError) {
    console.error('❌ Error fetching data:', fetchError)
    return
  }
  
  console.log('📋 Current data structure (first 5 records):')
  currentData?.forEach((record, index) => {
    console.log(`Record ${index + 1}:`)
    console.log(`  Title: "${record.title}"`)
    console.log(`  Description: "${record.description}"`)
    console.log(`  Authors: "${record.authors}"`)
    console.log('')
  })
  
  // Load the bibliography to get correct title-author mappings
  const bibliographyPath = path.join(process.cwd(), 'Formatted_ADHD_Source_Bibliography.csv')
  const bibliographyContent = fs.readFileSync(bibliographyPath, 'utf-8')
  const bibliographyLines = bibliographyContent.split('\n').slice(1) // Skip header
  
  const bibliographyMap = new Map<string, { title: string, authors: string }>()
  
  bibliographyLines.forEach(line => {
    if (line.trim()) {
      const [title, authors, year] = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''))
      if (title && authors) {
        bibliographyMap.set(title, { title, authors })
        // Also map by authors in case the data is reversed
        bibliographyMap.set(authors, { title, authors })
      }
    }
  })
  
  console.log(`📚 Loaded ${bibliographyMap.size} bibliography entries`)
  
  // Get all sources that need fixing
  const { data: allSources, error: allSourcesError } = await supabase
    .from('life_areas_sources')
    .select('*')
  
  if (allSourcesError) {
    console.error('❌ Error fetching all sources:', allSourcesError)
    return
  }
  
  console.log(`🔍 Found ${allSources?.length || 0} sources to process`)
  
  let fixedCount = 0
  let skippedCount = 0
  
  for (const source of allSources || []) {
    // Check if the current title field looks like an author name (short, contains common author patterns)
    const currentTitle = source.title || ''
    const currentDescription = source.description || ''
    
    // If title looks like an author name (short, contains common patterns) and description looks like a book title
    const titleLooksLikeAuthor = currentTitle.length < 100 && 
      (currentTitle.includes(',') || currentTitle.includes('&') || currentTitle.includes('and'))
    
    const descriptionLooksLikeTitle = currentDescription.length > 20 && 
      !currentDescription.includes('_') && 
      !currentDescription.includes('—')
    
    if (titleLooksLikeAuthor && descriptionLooksLikeTitle) {
      // Swap title and description
      const { error: updateError } = await supabase
        .from('life_areas_sources')
        .update({
          title: currentDescription,
          description: currentTitle
        })
        .eq('id', source.id)
      
      if (updateError) {
        console.error(`❌ Error updating source ${source.id}:`, updateError)
      } else {
        console.log(`✅ Fixed: "${currentTitle}" → "${currentDescription}"`)
        fixedCount++
      }
    } else {
      console.log(`⏭️  Skipped: "${currentTitle}" (looks correct)`)
      skippedCount++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Fixed: ${fixedCount}`)
  console.log(`   Skipped: ${skippedCount}`)
  console.log(`   Total: ${(allSources?.length || 0)}`)
  
  // Show some examples of the fixed data
  console.log(`\n📋 Sample of fixed data:`)
  const { data: sampleData } = await supabase
    .from('life_areas_sources')
    .select('*')
    .limit(3)
  
  sampleData?.forEach((record, index) => {
    console.log(`Record ${index + 1}:`)
    console.log(`  Title: "${record.title}"`)
    console.log(`  Description: "${record.description}"`)
    console.log(`  Authors: "${record.authors}"`)
    console.log('')
  })
}

fixLifeAreasSourcesStructure().catch(console.error) 