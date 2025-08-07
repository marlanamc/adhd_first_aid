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

async function fixLifeAreasSourcesComprehensive() {
  console.log('🔧 Comprehensive fix for life_areas_sources data structure...')
  
  // Load the bibliography to get correct title-author mappings
  const bibliographyPath = path.join(process.cwd(), 'Formatted_ADHD_Source_Bibliography.csv')
  const bibliographyContent = fs.readFileSync(bibliographyPath, 'utf-8')
  const bibliographyLines = bibliographyContent.split('\n').slice(1) // Skip header
  
  const bibliographyMap = new Map<string, { title: string, authors: string, year: string }>()
  
  bibliographyLines.forEach(line => {
    if (line.trim()) {
      const [title, authors, year] = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''))
      if (title && authors) {
        bibliographyMap.set(title, { title, authors, year: year || '' })
        // Also map by authors in case the data is reversed
        bibliographyMap.set(authors, { title, authors, year: year || '' })
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
    const currentTitle = source.title || ''
    const currentDescription = source.description || ''
    const currentAuthors = source.authors || ''
    
    // Try to find a match in the bibliography
    let bestMatch = null
    let bestMatchScore = 0
    
    for (const [key, value] of bibliographyMap.entries()) {
      // Check if current title matches bibliography title
      if (currentTitle.toLowerCase().includes(value.title.toLowerCase()) || 
          value.title.toLowerCase().includes(currentTitle.toLowerCase())) {
        const score = Math.min(currentTitle.length, value.title.length) / Math.max(currentTitle.length, value.title.length)
        if (score > bestMatchScore) {
          bestMatch = value
          bestMatchScore = score
        }
      }
      
      // Check if current description matches bibliography title
      if (currentDescription.toLowerCase().includes(value.title.toLowerCase()) || 
          value.title.toLowerCase().includes(currentDescription.toLowerCase())) {
        const score = Math.min(currentDescription.length, value.title.length) / Math.max(currentDescription.length, value.title.length)
        if (score > bestMatchScore) {
          bestMatch = value
          bestMatchScore = score
        }
      }
    }
    
    if (bestMatch && bestMatchScore > 0.3) { // Threshold for matching
      // Update the record with correct title and authors
      const { error: updateError } = await supabase
        .from('life_areas_sources')
        .update({
          title: bestMatch.title,
          authors: bestMatch.authors,
          description: currentDescription // Keep the original description as it might contain category info
        })
        .eq('id', source.id)
      
      if (updateError) {
        console.error(`❌ Error updating source ${source.id}:`, updateError)
      } else {
        console.log(`✅ Fixed: "${currentTitle}" → "${bestMatch.title}" by ${bestMatch.authors}`)
        fixedCount++
      }
    } else {
      console.log(`⏭️  Skipped: "${currentTitle}" (no good match found)`)
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
    .limit(5)
  
  sampleData?.forEach((record, index) => {
    console.log(`Record ${index + 1}:`)
    console.log(`  Title: "${record.title}"`)
    console.log(`  Authors: "${record.authors}"`)
    console.log(`  Description: "${record.description}"`)
    console.log('')
  })
}

fixLifeAreasSourcesComprehensive().catch(console.error) 