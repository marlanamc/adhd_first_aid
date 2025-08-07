#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function finalFixLifeAreasSources() {
  console.log('🔧 Final fix for life_areas_sources data structure...')
  
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
    
    // Check if title looks like an author name (contains common author patterns)
    const titleLooksLikeAuthor = currentTitle.includes(',') || 
      currentTitle.includes('&') || 
      currentTitle.includes('and') ||
      currentTitle.endsWith('.') ||
      (currentTitle.length < 50 && currentTitle.includes(' '))
    
    // Check if description looks like a book title (contains underscores or is longer)
    const descriptionLooksLikeTitle = currentDescription.includes('_') ||
      currentDescription.length > 30 ||
      currentDescription.includes('Guide') ||
      currentDescription.includes('Book') ||
      currentDescription.includes('ADHD')
    
    if (titleLooksLikeAuthor && descriptionLooksLikeTitle) {
      // Extract the actual book title from description (remove underscores)
      const bookTitle = currentDescription.replace(/_/g, '').trim()
      
      // Update the record
      const { error: updateError } = await supabase
        .from('life_areas_sources')
        .update({
          title: bookTitle,
          authors: currentTitle,
          description: currentDescription // Keep original description
        })
        .eq('id', source.id)
      
      if (updateError) {
        console.error(`❌ Error updating source ${source.id}:`, updateError)
      } else {
        console.log(`✅ Fixed: "${currentTitle}" → "${bookTitle}" by ${currentTitle}`)
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
    .limit(5)
  
  sampleData?.forEach((record, index) => {
    console.log(`Record ${index + 1}:`)
    console.log(`  Title: "${record.title}"`)
    console.log(`  Authors: "${record.authors}"`)
    console.log(`  Description: "${record.description}"`)
    console.log('')
  })
}

finalFixLifeAreasSources().catch(console.error) 