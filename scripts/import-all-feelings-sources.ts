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
  feeling_slug: string
  category: string
  title: string
  authors: string
  description: string
}

function parseMarkdownSources(content: string, feelingSlug: string): SourceItem[] {
  const sources: SourceItem[] = []
  const lines = content.split('\n')
  
  let currentCategory = ''
  let i = 0
  
  while (i < lines.length) {
    const line = lines[i].trim()
    
    // Skip empty lines, main title, intro paragraph, and dividers
    if (!line || line.startsWith('# 📚 Sources') || line === '---' || 
        line.startsWith('Explore the books') || line.startsWith('Let me know if')) {
      i++
      continue
    }
    
    // Detect category headers (## 🧠 Support Networks...)
    if (line.startsWith('##')) {
      // Clean up category name - remove emoji and extra formatting
      currentCategory = line.replace(/^##\s*/, '').replace(/^[^\s]+\s*/, '').trim()
      // Remove any subsection markers like ### 
      if (currentCategory.includes('###')) {
        currentCategory = currentCategory.split('###')[0].trim()
      }
      i++
      continue
    }
    
    // Skip subsection headers (### 🧠 Externalize...)
    if (line.startsWith('###')) {
      i++
      continue
    }
    
    // Detect book entries (- **Book Title** – _Author_)
    if (line.startsWith('- **') && line.includes('**')) {
      // Handle both patterns: "by Author" and "– Author"
      let titleMatch = null
      let title = ''
      let authors = ''
      
      // Pattern 1: - **Title** – _Author_
      if (line.includes('– _') && line.includes('_')) {
        titleMatch = line.match(/\*\*(.*?)\*\*\s*–\s*_([^_]+)_/)
        if (titleMatch) {
          title = titleMatch[1]
          authors = titleMatch[2]
        }
      }
      // Pattern 2: - **Title** by Author
      else if (line.includes(' by ')) {
        titleMatch = line.match(/\*\*(.*?)\*\*.*?by\s+(.+)/)
        if (titleMatch) {
          title = titleMatch[1]
          authors = titleMatch[2].replace(/[_–]/g, '').trim()
        }
      }
      // Pattern 3: - **Title** – Author (without italics)
      else if (line.includes('–')) {
        titleMatch = line.match(/\*\*(.*?)\*\*\s*–\s*(.+)/)
        if (titleMatch) {
          title = titleMatch[1]
          authors = titleMatch[2].replace(/[_]/g, '').trim()
        }
      }
      // Pattern 4: Just **Title** (no author)
      else {
        titleMatch = line.match(/\*\*(.*?)\*\*/)
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
          if (!nextLine || nextLine.startsWith('- **') || nextLine.startsWith('##') || 
              nextLine.startsWith('###') || nextLine === '---' || nextLine.startsWith('Let me know if')) {
            break
          }
          // Combine description lines, removing extra spacing
          if (description) {
            description += ' ' + nextLine
          } else {
            description = nextLine
          }
          j++
        }
        
        // Clean up description - remove extra markdown and formatting
        description = description
          .replace(/^\s*/, '') // Remove leading spaces
          .replace(/\*\*/g, '') // Remove bold markers
          .replace(/_/g, '') // Remove italic markers
          .trim()
        
        if (currentCategory && title) {
          sources.push({
            feeling_slug: feelingSlug,
            category: currentCategory,
            title: title.trim(),
            authors: authors.trim(),
            description: description
          })
        }
        
        i = j - 1 // Move to the last processed line
      }
    }
    
    i++
  }
  
  return sources
}

function filenameToSlug(filename: string): string {
  // Convert filename to feeling slug
  return filename.replace('.md', '').replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

async function importAllFeelingsSources() {
  try {
    console.log('🚀 Starting comprehensive feelings sources import...')
    
    // Get all markdown files from feelings_sources directory
    const sourcesDir = join(process.cwd(), 'feelings_sources')
    const files = readdirSync(sourcesDir).filter(file => 
      file.endsWith('.md') && file !== 'Feelings_Sources.md' // Skip the main index file
    )
    
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
        const feelingSlug = filenameToSlug(file)
        
        // Parse sources from this file
        const sources = parseMarkdownSources(content, feelingSlug)
        
        if (sources.length === 0) {
          console.log(`⚠️  No sources found in ${file}`)
          continue
        }
        
        console.log(`   Found ${sources.length} sources`)
        
        // Clear existing sources for this feeling
        const { error: deleteError } = await supabase
          .from('feeling_sources')
          .delete()
          .eq('feeling_slug', feelingSlug)
        
        if (deleteError) {
          console.error(`❌ Error clearing existing sources for ${feelingSlug}:`, deleteError.message)
          failedFiles.push(file)
          continue
        }
        
        // Insert sources in batches
        const batchSize = 10
        let insertedCount = 0
        
        for (let i = 0; i < sources.length; i += batchSize) {
          const batch = sources.slice(i, i + batchSize)
          
          const { error } = await supabase
            .from('feeling_sources')
            .insert(batch)
          
          if (error) {
            console.error(`❌ Error inserting batch for ${feelingSlug}:`, error.message)
            failedFiles.push(file)
            break
          }
          
          insertedCount += batch.length
        }
        
        if (insertedCount === sources.length) {
          console.log(`✅ Successfully imported ${insertedCount} sources for ${feelingSlug}`)
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
      .from('feeling_sources')
      .select('feeling_slug, category')
    
    if (!verifyError && allSources) {
      // Group by feeling
      const byFeeling = allSources.reduce((acc, source) => {
        acc[source.feeling_slug] = (acc[source.feeling_slug] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      console.log('\n📈 Sources by feeling:')
      Object.entries(byFeeling)
        .sort(([, a], [, b]) => b - a)
        .forEach(([feeling, count]) => {
          console.log(`  ${feeling}: ${count} sources`)
        })
      
      // Group by category across all feelings
      const byCategory = allSources.reduce((acc, source) => {
        acc[source.category] = (acc[source.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      console.log('\n📊 Sources by category (across all feelings):')
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
importAllFeelingsSources()