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

interface SourceUpdate {
  table: string
  id: number
  oldTitle: string
  oldAuthors: string
  newFormattedSource: string
  matchType: 'exact' | 'partial' | 'fuzzy'
}

function parseBibliographyCSV(): Map<string, BibliographyEntry> {
  const csvContent = readFileSync(join(process.cwd(), 'Formatted_ADHD_Source_Bibliography.csv'), 'utf-8')
  const lines = csvContent.split('\n').slice(1) // Skip header
  const bibliography = new Map<string, BibliographyEntry>()
  
  for (const line of lines) {
    if (!line.trim()) continue
    
    // Parse CSV line, handling quoted fields
    const parts = line.match(/(".*?"|[^,]+)/g) || []
    if (parts.length >= 3) {
      const title = parts[0].replace(/^"|"$/g, '').trim()
      const authors = parts[1].replace(/^"|"$/g, '').trim()
      const year = parts[2].replace(/^"|"$/g, '').trim()
      
      // Create lookup keys
      const titleKey = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
      
      bibliography.set(titleKey, {
        title,
        authors,
        year
      })
      
      // Also add shortened versions for better matching
      const shortTitle = title.split(':')[0].toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
      if (shortTitle !== titleKey) {
        bibliography.set(shortTitle, { title, authors, year })
      }
    }
  }
  
  return bibliography
}

function findBestMatch(sourceTitle: string, sourceAuthors: string, bibliography: Map<string, BibliographyEntry>): { entry: BibliographyEntry | null, matchType: 'exact' | 'partial' | 'fuzzy' } {
  const normalizeForComparison = (str: string) => 
    str.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()
  
  const normalizedTitle = normalizeForComparison(sourceTitle)
  const normalizedAuthors = normalizeForComparison(sourceAuthors)
  
  // Exact title match
  if (bibliography.has(normalizedTitle)) {
    return { entry: bibliography.get(normalizedTitle)!, matchType: 'exact' }
  }
  
  // Partial title matches
  for (const [key, entry] of bibliography.entries()) {
    const entryTitle = normalizeForComparison(entry.title)
    
    // Check if either title contains the other
    if (entryTitle.includes(normalizedTitle) || normalizedTitle.includes(entryTitle)) {
      // Verify author similarity
      const entryAuthors = normalizeForComparison(entry.authors)
      if (entryAuthors.includes(normalizedAuthors) || normalizedAuthors.includes(entryAuthors)) {
        return { entry, matchType: 'partial' }
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
      return { entry, matchType: 'fuzzy' }
    }
  }
  
  return { entry: null, matchType: 'exact' }
}

function formatSource(entry: BibliographyEntry): string {
  return `**${entry.title}** (${entry.year}) ${entry.authors}`
}

async function updateSourcesTable(tableName: string, bibliography: Map<string, BibliographyEntry>) {
  console.log(`\\n📋 Processing ${tableName}...`)
  
  const { data: sources, error } = await supabase
    .from(tableName)
    .select('*')
  
  if (error) {
    console.error(`❌ Error fetching from ${tableName}:`, error)
    return
  }
  
  if (!sources || sources.length === 0) {
    console.log(`   No sources found in ${tableName}`)
    return
  }
  
  console.log(`   Found ${sources.length} sources to process`)
  
  const updates: SourceUpdate[] = []
  const unmatchedSources: Array<{title: string, authors: string}> = []
  
  for (const source of sources) {
    const { entry, matchType } = findBestMatch(source.title, source.authors, bibliography)
    
    if (entry) {
      const newFormattedSource = formatSource(entry)
      
      // Only update if different from current
      const currentFormatted = `**${source.title}** by ${source.authors}`
      if (newFormattedSource !== currentFormatted) {
        updates.push({
          table: tableName,
          id: source.id,
          oldTitle: source.title,
          oldAuthors: source.authors,
          newFormattedSource,
          matchType
        })
      }
    } else {
      unmatchedSources.push({
        title: source.title,
        authors: source.authors
      })
    }
  }
  
  console.log(`   ✅ Matched: ${sources.length - unmatchedSources.length}/${sources.length}`)
  console.log(`   ⚠️  Unmatched: ${unmatchedSources.length}`)
  
  // Show some examples
  if (updates.length > 0) {
    console.log('\\n   📝 Sample updates:')
    updates.slice(0, 3).forEach(update => {
      console.log(`      Old: "${update.oldTitle}" by ${update.oldAuthors}`)
      console.log(`      New: ${update.newFormattedSource}`)
      console.log(`      Match: ${update.matchType}`)
      console.log()
    })
  }
  
  if (unmatchedSources.length > 0) {
    console.log('\\n   ❓ Unmatched sources (need manual review):')
    unmatchedSources.slice(0, 5).forEach(source => {
      console.log(`      "${source.title}" by ${source.authors}`)
    })
    if (unmatchedSources.length > 5) {
      console.log(`      ... and ${unmatchedSources.length - 5} more`)
    }
  }
  
  return { updates, unmatchedSources }
}

async function applyUpdates(updates: SourceUpdate[]) {
  console.log(`\n💾 Applying ${updates.length} source format updates...`)
  
  let successCount = 0
  let failCount = 0
  
  for (const update of updates) {
    // Split the formatted source back into title and authors for database
    const titleMatch = update.newFormattedSource.match(/\*\*(.*?)\*\* \((\d{4})\) (.+)/)
    if (titleMatch) {
      const [, title, year, authors] = titleMatch
      
      const { error } = await supabase
        .from(update.table)
        .update({
          title: title,
          authors: authors
        })
        .eq('id', update.id)
      
      if (error) {
        console.error(`   ❌ Failed to update ${update.table} ID ${update.id}: ${error.message}`)
        failCount++
      } else {
        successCount++
      }
    }
  }
  
  console.log(`\n✅ Successfully updated: ${successCount}`)
  if (failCount > 0) {
    console.log(`❌ Failed updates: ${failCount}`)
  }
}

async function standardizeAllSources() {
  console.log('📚 Standardizing all sources using bibliography...')
  
  // Load bibliography
  const bibliography = parseBibliographyCSV()
  console.log(`\n📖 Loaded ${bibliography.size} bibliography entries`)
  
  // Process each table
  const allUpdates: SourceUpdate[] = []
  const allUnmatched: Array<{table: string, title: string, authors: string}> = []
  
  const tables = ['feeling_sources', 'barrier_sources']
  
  for (const table of tables) {
    const result = await updateSourcesTable(table, bibliography)
    if (result) {
      allUpdates.push(...result.updates)
      allUnmatched.push(...result.unmatchedSources.map(source => ({ table, ...source })))
    }
  }
  
  // Apply all updates
  if (allUpdates.length > 0) {
    await applyUpdates(allUpdates)
  }
  
  // Final summary
  console.log('\\n' + '='.repeat(60))
  console.log('📊 STANDARDIZATION SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total sources processed: ${allUpdates.length + allUnmatched.length}`)
  console.log(`Successfully standardized: ${allUpdates.length}`)
  console.log(`Need manual review: ${allUnmatched.length}`)
  
  if (allUnmatched.length > 0) {
    console.log('\\n❓ Sources needing manual review:')
    allUnmatched.forEach(source => {
      console.log(`   ${source.table}: "${source.title}" by ${source.authors}`)
    })
  }
  
  console.log('\\n✨ Format example: **Building a Second Brain** (2022) Forte, Tiago')
}

// Run the standardization
standardizeAllSources()