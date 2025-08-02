import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface StandardizedSource {
  id: number
  title: string
  authors: string
  appearances: number
  unique_pages: number
  categories: string[]
  description: string
}

interface OriginalSource {
  feeling_slug?: string
  barrier_slug?: string
  category: string
  title: string
  authors: string
  description: string
}

async function migrateToStandardizedSources() {
  console.log('🔄 Migrating to standardized sources system...\n')
  
  try {
    // Step 1: Create the standardized sources table
    console.log('1️⃣ Creating standardized sources table...')
    
    const schemaSQL = readFileSync(
      join(process.cwd(), 'scripts/database/standardized-sources-schema.sql'),
      'utf-8'
    )
    
    // Execute schema (Note: This might need to be run manually in Supabase)
    console.log('   📋 Schema ready for execution in Supabase SQL Editor')
    console.log('   📁 File: scripts/database/standardized-sources-schema.sql')
    
    // Step 2: Get current sources from both tables
    console.log('\n2️⃣ Retrieving current sources...')
    
    const { data: feelingSources, error: feelingError } = await supabase
      .from('feeling_sources')
      .select('*')
    
    if (feelingError) {
      console.error('❌ Error fetching feeling sources:', feelingError)
      return
    }
    
    const { data: barrierSources, error: barrierError } = await supabase
      .from('barrier_sources')
      .select('*')
    
    if (barrierError) {
      console.error('❌ Error fetching barrier sources:', barrierError)
      return
    }
    
    console.log(`   ✅ Retrieved ${feelingSources?.length || 0} feeling sources`)
    console.log(`   ✅ Retrieved ${barrierSources?.length || 0} barrier sources`)
    
    // Step 3: Load standardized sources
    console.log('\n3️⃣ Loading standardized sources mapping...')
    
    const standardizedSources: StandardizedSource[] = JSON.parse(
      readFileSync(join(process.cwd(), 'scripts/top-57-sources.json'), 'utf-8')
    )
    
    console.log(`   ✅ Loaded ${standardizedSources.length} standardized sources`)
    
    // Step 4: Create mapping function
    function findStandardizedSource(originalTitle: string, originalAuthors: string): StandardizedSource | null {
      // Normalize function for comparison
      const normalize = (str: string) => str.toLowerCase().trim()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
      
      const normalizedTitle = normalize(originalTitle)
      const normalizedAuthors = normalize(originalAuthors)
      
      return standardizedSources.find(source => {
        const sourceTitle = normalize(source.title)
        const sourceAuthors = normalize(source.authors)
        
        // Exact match first
        if (sourceTitle === normalizedTitle && sourceAuthors === normalizedAuthors) {
          return true
        }
        
        // Title match with similar authors
        if (sourceTitle === normalizedTitle) {
          // Check if authors are subset/superset
          const originalWords = normalizedAuthors.split(' ')
          const sourceWords = sourceAuthors.split(' ')
          const commonWords = originalWords.filter(word => sourceWords.includes(word))
          if (commonWords.length >= Math.min(originalWords.length, sourceWords.length) * 0.6) {
            return true
          }
        }
        
        // Similar title match
        if (sourceTitle.includes(normalizedTitle) || normalizedTitle.includes(sourceTitle)) {
          if (sourceAuthors === normalizedAuthors) {
            return true
          }
        }
        
        return false
      })
    }
    
    // Step 5: Create migration mappings
    console.log('\n4️⃣ Creating migration mappings...')
    
    const feelingMappings: Array<{
      feeling_slug: string
      source_id: number
      category: string
    }> = []
    
    const barrierMappings: Array<{
      barrier_slug: string
      source_id: number
      category: string
    }> = []
    
    let mappedCount = 0
    let unmappedCount = 0
    const unmappedSources: string[] = []
    
    // Process feeling sources
    if (feelingSources) {
      for (const source of feelingSources) {
        const standardized = findStandardizedSource(source.title, source.authors)
        if (standardized) {
          feelingMappings.push({
            feeling_slug: source.feeling_slug,
            source_id: standardized.id,
            category: source.category
          })
          mappedCount++
        } else {
          unmappedCount++
          unmappedSources.push(`"${source.title}" by ${source.authors} (feeling: ${source.feeling_slug})`)
        }
      }
    }
    
    // Process barrier sources
    if (barrierSources) {
      for (const source of barrierSources) {
        const standardized = findStandardizedSource(source.title, source.authors)
        if (standardized) {
          barrierMappings.push({
            barrier_slug: source.barrier_slug,
            source_id: standardized.id,
            category: source.category
          })
          mappedCount++
        } else {
          unmappedCount++
          unmappedSources.push(`"${source.title}" by ${source.authors} (barrier: ${source.barrier_slug})`)
        }
      }
    }
    
    console.log(`   ✅ Mapped: ${mappedCount} sources`)
    console.log(`   ⚠️  Unmapped: ${unmappedCount} sources`)
    
    // Step 6: Generate migration SQL
    console.log('\n5️⃣ Generating migration SQL...')
    
    const migrationSQL = [
      '-- Migration to standardized sources',
      '-- Run this after creating the standardized_sources table',
      '',
      '-- Insert feeling mappings',
      'INSERT INTO feeling_standardized_sources (feeling_slug, source_id, category) VALUES'
    ]
    
    const feelingInserts = feelingMappings.map((mapping, index) => {
      const isLast = index === feelingMappings.length - 1
      return `    ('${mapping.feeling_slug}', ${mapping.source_id}, '${mapping.category.replace(/'/g, "''")}')${isLast ? ';' : ','}`
    })
    
    if (feelingInserts.length > 0) {
      migrationSQL.push(...feelingInserts)
    } else {
      migrationSQL.push('    -- No feeling mappings found')
    }
    
    migrationSQL.push(
      '',
      '-- Insert barrier mappings',
      'INSERT INTO barrier_standardized_sources (barrier_slug, source_id, category) VALUES'
    )
    
    const barrierInserts = barrierMappings.map((mapping, index) => {
      const isLast = index === barrierMappings.length - 1
      return `    ('${mapping.barrier_slug}', ${mapping.source_id}, '${mapping.category.replace(/'/g, "''")}')${isLast ? ';' : ','}`
    })
    
    if (barrierInserts.length > 0) {
      migrationSQL.push(...barrierInserts)
    } else {
      migrationSQL.push('    -- No barrier mappings found')
    }
    
    // Write migration SQL
    const fs = await import('fs')
    fs.writeFileSync(
      join(process.cwd(), 'scripts/database/migrate-sources.sql'),
      migrationSQL.join('\n')
    )
    
    // Write unmapped sources report
    if (unmappedSources.length > 0) {
      fs.writeFileSync(
        join(process.cwd(), 'scripts/unmapped-sources.txt'),
        'UNMAPPED SOURCES (not in top 57):\n' +
        '='.repeat(50) + '\n\n' +
        unmappedSources.join('\n')
      )
    }
    
    // Step 7: Summary
    console.log('\n✅ MIGRATION PREPARATION COMPLETE!')
    console.log('=' .repeat(60))
    console.log(`📊 Total sources processed: ${mappedCount + unmappedCount}`)
    console.log(`✅ Successfully mapped: ${mappedCount}`)
    console.log(`⚠️  Unmapped (filtered out): ${unmappedCount}`)
    console.log(`📁 Feeling mappings: ${feelingMappings.length}`)
    console.log(`📁 Barrier mappings: ${barrierMappings.length}`)
    
    console.log('\n📋 FILES GENERATED:')
    console.log('1. scripts/database/standardized-sources-schema.sql - Create tables')
    console.log('2. scripts/database/migrate-sources.sql - Migrate data')
    if (unmappedSources.length > 0) {
      console.log('3. scripts/unmapped-sources.txt - Sources not migrated')
    }
    
    console.log('\n🚀 NEXT STEPS:')
    console.log('1. Run standardized-sources-schema.sql in Supabase SQL Editor')
    console.log('2. Run migrate-sources.sql in Supabase SQL Editor')
    console.log('3. Update application code to use new standardized sources')
    console.log('4. Test the new source display system')
    
    // Show sample mappings
    console.log('\n📝 SAMPLE MAPPINGS:')
    console.log('-' .repeat(60))
    const sampleMappings = feelingMappings.slice(0, 5)
    sampleMappings.forEach(mapping => {
      const source = standardizedSources.find(s => s.id === mapping.source_id)
      console.log(`• ${mapping.feeling_slug} → "${source?.title}" by ${source?.authors}`)
    })
    
  } catch (error) {
    console.error('💥 Migration error:', error)
  }
}

// Run the migration
migrateToStandardizedSources()