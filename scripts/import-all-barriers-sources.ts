import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface SourceItem {
  barrier_slug: string
  category: string
  title: string
  authors: string
  description: string
}

function parseMarkdownSources(content: string, barrierSlug: string): SourceItem[] {
  const sources: SourceItem[] = []
  const lines = content.split('\n')
  
  let currentCategory = ''
  let i = 0
  
  while (i < lines.length) {
    const line = lines[i].trim()
    
    // Skip empty lines, main title, intro paragraph, and dividers
    if (!line || line.startsWith('## 📚 Sources') || line === '---' || 
        line.startsWith('Explore the books') || line.startsWith('Let me know if')) {
      i++
      continue
    }
    
    // Detect category headers (### 🧠 Why It's Hard... or ## 🧠 Understanding...)
    if (line.startsWith('###') || line.startsWith('##')) {
      // Clean up category name - remove emoji and extra formatting
      currentCategory = line.replace(/^###?\s*/, '').replace(/^[^\s]+\s*/, '').trim()
      i++
      continue
    }
    
    // Detect book entries with multiple patterns
    if (line.startsWith('- ')) {
      let title = ''
      let authors = ''
      
      // Pattern 1: - **Author.** _Title_ (Year)
      const barrierPattern = line.match(/\*\*([^.]+)\.\*\*\s*_([^_]+)_/)
      if (barrierPattern) {
        authors = barrierPattern[1].trim()
        title = barrierPattern[2].trim()
        
        // Extract year if present
        const yearMatch = line.match(/_[^_]+_\s*\((\d{4})\)/)
        if (yearMatch) {
          title += ` (${yearMatch[1]})`
        }
      } 
      // Pattern 2: - **Author – _Title_**
      else if (line.includes('**') && line.includes('–') && line.includes('_')) {
        const altPattern1 = line.match(/\*\*([^–]+)–\s*_([^_]+)_\*\*/)
        if (altPattern1) {
          authors = altPattern1[1].trim()
          title = altPattern1[2].trim()
        }
      }
      // Pattern 3: - _Title_ – Author
      else if (line.startsWith('- _') && line.includes('–')) {
        const altPattern2 = line.match(/-\s*_([^_]+)_\s*–\s*(.+)/)
        if (altPattern2) {
          title = altPattern2[1].trim()
          authors = altPattern2[2].trim()
        }
      }
      // Pattern 4: - **Title** – _Author_
      else if (line.includes('**') && line.includes('–') && line.includes('_')) {
        const altPattern3 = line.match(/\*\*(.*?)\*\*\s*–\s*_([^_]+)_/)
        if (altPattern3) {
          title = altPattern3[1]
          authors = altPattern3[2]
        }
      } 
      // Pattern 5: - **Title** by Author
      else if (line.includes(' by ')) {
        const byPattern = line.match(/\*\*(.*?)\*\*.*?by\s+(.+)/)
        if (byPattern) {
          title = byPattern[1]
          authors = byPattern[2].replace(/[_–]/g, '').trim()
        }
      } 
      // Pattern 6: **Author** – _Title_ (standard format)
      else if (line.includes('**') && line.includes('–') && line.includes('_')) {
        const standardPattern = line.match(/\*\*([^*]+)\*\*\s*–\s*_([^_]+)_/)
        if (standardPattern) {
          authors = standardPattern[1].trim()
          title = standardPattern[2].trim()
        }
      }
      // Pattern 7: Just **Title** with no author
      else if (line.includes('**')) {
        const titleMatch = line.match(/\*\*(.*?)\*\*/)
        if (titleMatch) {
          title = titleMatch[1]
          authors = ''
        }
      }
      
      if (title) {
        // Look for description on next line(s)
        let description = ''
        let j = i + 1
        
        while (j < lines.length) {
          const nextLine = lines[j].trim()
          if (!nextLine || nextLine.startsWith('- **') || nextLine.startsWith('###') || 
              nextLine === '---' || nextLine.startsWith('Let me know if')) {
            break
          }
          // Combine description lines
          if (description) {
            description += ' ' + nextLine
          } else {
            description = nextLine
          }
          j++
        }
        
        // Clean up description
        description = description
          .replace(/^\s*/, '')
          .replace(/\*\*/g, '')
          .replace(/_/g, '')
          .trim()
        
        if (currentCategory && title) {
          sources.push({
            barrier_slug: barrierSlug,
            category: currentCategory,
            title: title.trim(),
            authors: authors.trim(),
            description: description
          })
        }
        
        i = j - 1
      }
    }
    
    i++
  }
  
  return sources
}

function filenameToSlug(filename: string): string {
  // Convert filename to barrier slug
  // i_cant_start.md → i_cant_start
  return filename.replace('.md', '')
}

async function testBarrierSourcesTable() {
  try {
    const { data, error } = await supabase
      .from('barrier_sources')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Table does not exist or has issues:', error.message)
      console.log('\n📋 Please run this SQL in your Supabase SQL Editor first:')
      console.log('=' .repeat(60))
      console.log(`
CREATE TABLE barrier_sources (
    id SERIAL PRIMARY KEY,
    barrier_slug TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_barrier_sources_barrier_slug ON barrier_sources(barrier_slug);

ALTER TABLE barrier_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "barrier_sources_policy" ON barrier_sources 
    FOR ALL TO PUBLIC USING (true);
      `)
      console.log('=' .repeat(60))
      console.log('\nThen run this script again.')
      return false
    }
    
    console.log('✅ Table accessible')
    return true
  } catch (error) {
    console.error('Error testing table:', error)
    return false
  }
}

async function importAllBarriersSources() {
  try {
    console.log('🚀 Starting comprehensive barriers sources import...')
    
    // Test if table exists
    const tableExists = await testBarrierSourcesTable()
    if (!tableExists) {
      return
    }
    
    // Get all markdown files from barriers_sources directory
    const sourcesDir = join(process.cwd(), 'barriers_sources')
    const files = readdirSync(sourcesDir).filter(file => file.endsWith('.md'))
    
    console.log(`📁 Found ${files.length} source files to process`)
    
    let totalSources = 0
    let processedFiles = 0
    let failedFiles: string[] = []
    
    // Process each file
    for (const file of files) {
      try {
        console.log(`\n📖 Processing ${file}...`)
        
        const filePath = join(sourcesDir, file)
        const content = readFileSync(filePath, 'utf-8')
        const barrierSlug = filenameToSlug(file)
        
        // Parse sources from this file
        const sources = parseMarkdownSources(content, barrierSlug)
        
        if (sources.length === 0) {
          console.log(`⚠️  No sources found in ${file}`)
          continue
        }
        
        console.log(`   Found ${sources.length} sources`)
        
        // Clear existing sources for this barrier
        const { error: deleteError } = await supabase
          .from('barrier_sources')
          .delete()
          .eq('barrier_slug', barrierSlug)
        
        if (deleteError) {
          console.error(`❌ Error clearing existing sources for ${barrierSlug}:`, deleteError.message)
          failedFiles.push(file)
          continue
        }
        
        // Insert sources in batches
        const batchSize = 10
        let insertedCount = 0
        
        for (let i = 0; i < sources.length; i += batchSize) {
          const batch = sources.slice(i, i + batchSize)
          
          const { error } = await supabase
            .from('barrier_sources')
            .insert(batch)
          
          if (error) {
            console.error(`❌ Error inserting batch for ${barrierSlug}:`, error.message)
            failedFiles.push(file)
            break
          }
          
          insertedCount += batch.length
        }
        
        if (insertedCount === sources.length) {
          console.log(`✅ Successfully imported ${insertedCount} sources for ${barrierSlug}`)
          totalSources += insertedCount
          processedFiles++
        }
        
      } catch (error) {
        console.error(`💥 Error processing ${file}:`, error)
        failedFiles.push(file)
      }
    }
    
    // Final summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 IMPORT SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Successfully processed: ${processedFiles}/${files.length} files`)
    console.log(`📚 Total sources imported: ${totalSources}`)
    
    if (failedFiles.length > 0) {
      console.log(`❌ Failed files: ${failedFiles.join(', ')}`)
    }
    
    // Verify final database state
    console.log('\n🔍 Verifying database...')
    const { data: allSources, error: verifyError } = await supabase
      .from('barrier_sources')
      .select('barrier_slug, category')
    
    if (!verifyError && allSources) {
      // Group by barrier
      const byBarrier = allSources.reduce((acc, source) => {
        acc[source.barrier_slug] = (acc[source.barrier_slug] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      console.log('\n📈 Sources by barrier:')
      Object.entries(byBarrier)
        .sort(([, a], [, b]) => b - a)
        .forEach(([barrier, count]) => {
          console.log(`  ${barrier}: ${count} sources`)
        })
      
      // Group by category across all barriers
      const byCategory = allSources.reduce((acc, source) => {
        acc[source.category] = (acc[source.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      console.log('\n📊 Sources by category (across all barriers):')
      Object.entries(byCategory)
        .sort(([, a], [, b]) => b - a)
        .forEach(([category, count]) => {
          console.log(`  ${category}: ${count} sources`)
        })
    }
    
    console.log('\n🎉 Import complete!')
    
  } catch (error) {
    console.error('💥 Fatal error during import:', error)
  }
}

// Run the import
importAllBarriersSources()