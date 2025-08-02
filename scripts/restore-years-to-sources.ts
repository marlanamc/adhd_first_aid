import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface BibliographyEntry {
  title: string
  authors: string
  year: string
}

function loadBibliography(): Map<string, BibliographyEntry> {
  const csvContent = readFileSync(join(process.cwd(), 'Formatted_ADHD_Source_Bibliography.csv'), 'utf-8')
  const lines = csvContent.split('\n').slice(1) // Skip header
  const bibliography = new Map<string, BibliographyEntry>()
  
  for (const line of lines) {
    if (!line.trim()) continue
    
    const parts = line.match(/(\".*?\"|[^,]+)/g) || []
    if (parts.length >= 3) {
      const title = parts[0].replace(/^\"|\"$/g, '').trim()
      const authors = parts[1].replace(/^\"|\"$/g, '').trim()
      const year = parts[2].replace(/^\"|\"$/g, '').trim()
      
      // Create lookup key
      const key = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
      bibliography.set(key, { title, authors, year })
      
      // Also add short title for better matching
      const shortTitle = title.split(':')[0].toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
      if (shortTitle !== key) {
        bibliography.set(shortTitle, { title, authors, year })
      }
    }
  }
  
  return bibliography
}

function findBestMatch(sourceTitle: string, sourceAuthors: string, bibliography: Map<string, BibliographyEntry>): BibliographyEntry | null {
  const normalizeForComparison = (str: string) => 
    str.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()
  
  const normalizedTitle = normalizeForComparison(sourceTitle)
  const normalizedAuthors = normalizeForComparison(sourceAuthors)
  
  // Exact title match
  if (bibliography.has(normalizedTitle)) {
    return bibliography.get(normalizedTitle)!
  }
  
  // Partial title matches
  for (const [key, entry] of bibliography.entries()) {
    const entryTitle = normalizeForComparison(entry.title)
    
    // Check if either title contains the other
    if (entryTitle.includes(normalizedTitle) || normalizedTitle.includes(entryTitle)) {
      // Verify author similarity
      const entryAuthors = normalizeForComparison(entry.authors)
      if (entryAuthors.includes(normalizedAuthors) || normalizedAuthors.includes(entryAuthors)) {
        return entry
      }
    }
  }
  
  // Fuzzy author-based matching
  for (const [key, entry] of bibliography.entries()) {
    const entryAuthors = normalizeForComparison(entry.authors)
    
    // Extract last names for comparison
    const sourceLastNames = normalizedAuthors.split(/[,&]/).map(name => name.trim().split(' ')[0])
    const entryLastNames = entryAuthors.split(/[,;]/).map(name => name.trim().split(' ').pop()).filter(Boolean)
    
    const commonLastNames = sourceLastNames.filter(name => 
      entryLastNames.some(entryName => entryName.includes(name) || name.includes(entryName))
    )
    
    if (commonLastNames.length > 0) {
      return entry
    }
  }
  
  return null
}

async function restoreYearsToSources() {
  console.log('📅 Restoring years to source titles...')
  
  // Load bibliography
  const bibliography = loadBibliography()
  console.log(`\n📖 Loaded ${bibliography.size} bibliography entries`)
  
  const tables = ['feeling_sources', 'barrier_sources']
  
  for (const table of tables) {
    console.log(`\n📋 Processing ${table}...`)
    
    const { data: sources, error } = await supabase
      .from(table)
      .select('*')
    
    if (error) {
      console.error(`❌ Error fetching from ${table}:`, error)
      continue
    }
    
    if (!sources || sources.length === 0) {
      console.log(`   No sources found in ${table}`)
      continue
    }
    
    console.log(`   Found ${sources.length} sources to process`)
    
    let updatedCount = 0
    let notFoundCount = 0
    
    for (const source of sources) {
      const bibEntry = findBestMatch(source.title, source.authors, bibliography)
      
      if (bibEntry) {
        // Update the title to include the year in parentheses
        // Format: "Original Title (YYYY)"
        const titleWithYear = `${bibEntry.title} (${bibEntry.year})`
        
        const { error: updateError } = await supabase
          .from(table)
          .update({ 
            title: titleWithYear,
            authors: bibEntry.authors
          })
          .eq('id', source.id)
        
        if (updateError) {
          console.error(`   ❌ Failed to update ${source.id}: ${updateError.message}`)
        } else {
          updatedCount++
        }
      } else {
        notFoundCount++
        console.log(`   ❓ No match found for: "${source.title}" by "${source.authors}"`)
      }
    }
    
    console.log(`   ✅ Updated: ${updatedCount}`)
    console.log(`   ❌ Not found: ${notFoundCount}`)
  }
  
  console.log('\n✨ Years have been restored to source titles!')
  console.log('Format: "Title (YYYY)" by Author')
}

// Run the restoration
restoreYearsToSources()