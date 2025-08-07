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

async function finalCleanupLifeAreasSources() {
  console.log('🧹 Final cleanup for life_areas_sources data...')
  
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
  
  // Get all sources
  const { data: allSources, error } = await supabase
    .from('life_areas_sources')
    .select('*')
  
  if (error) {
    console.error('❌ Error fetching sources:', error)
    return
  }
  
  console.log(`🔍 Found ${allSources?.length || 0} sources to process`)
  
  let fixedCount = 0
  let skippedCount = 0
  
  for (const source of allSources || []) {
    const currentTitle = source.title || ''
    const currentDescription = source.description || ''
    const currentAuthors = source.authors || ''
    
    // Check if current title looks like an author name
    const titleLooksLikeAuthor = currentTitle.includes(',') || 
      currentTitle.includes('&') || 
      currentTitle.includes('and') ||
      currentTitle.endsWith('.') ||
      (currentTitle.length < 50 && currentTitle.includes(' '))
    
    // Try to find a match in the bibliography
    let bestMatch = null
    let bestMatchScore = 0
    
    // First, try to match the current title with bibliography titles
    for (const [key, value] of bibliographyMap.entries()) {
      if (currentTitle.toLowerCase().includes(value.title.toLowerCase()) || 
          value.title.toLowerCase().includes(currentTitle.toLowerCase())) {
        const score = Math.min(currentTitle.length, value.title.length) / Math.max(currentTitle.length, value.title.length)
        if (score > bestMatchScore) {
          bestMatch = value
          bestMatchScore = score
        }
      }
    }
    
    // If no match found and title looks like author, try to extract title from description
    if (!bestMatch && titleLooksLikeAuthor && currentDescription.includes('_')) {
      const extractedTitle = currentDescription.replace(/_/g, '').trim()
      
      // Try to find this extracted title in the bibliography
      for (const [key, value] of bibliographyMap.entries()) {
        if (extractedTitle.toLowerCase().includes(value.title.toLowerCase()) || 
            value.title.toLowerCase().includes(extractedTitle.toLowerCase())) {
          const score = Math.min(extractedTitle.length, value.title.length) / Math.max(extractedTitle.length, value.title.length)
          if (score > bestMatchScore) {
            bestMatch = value
            bestMatchScore = score
          }
        }
      }
    }
    
    if (bestMatch && bestMatchScore > 0.3) {
      // Update the record with correct title and authors
      const { error: updateError } = await supabase
        .from('life_areas_sources')
        .update({
          title: bestMatch.title,
          authors: bestMatch.authors,
          description: currentDescription // Keep the original description
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

finalCleanupLifeAreasSources().catch(console.error) 