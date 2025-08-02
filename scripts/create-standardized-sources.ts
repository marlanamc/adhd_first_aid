import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface StandardizedSource {
  id: number
  title: string
  authors: string
  used_in_feelings: string[]
  used_in_barriers: string[]
  categories: string[]
}

interface ConsolidatedSource {
  id: number
  title: string
  authors: string
  total_appearances: number
  unique_pages: number
  categories: string[]
  description?: string
}

async function createStandardizedSources() {
  console.log('📚 Creating standardized sources list (max 57 sources)...\n')
  
  // Read the analysis results
  const sourcesData: StandardizedSource[] = JSON.parse(
    readFileSync(join(process.cwd(), 'scripts/standardized-sources.json'), 'utf-8')
  )
  
  // Calculate metrics for each source
  const sourcesWithMetrics = sourcesData.map(source => {
    const uniquePages = new Set([
      ...source.used_in_feelings,
      ...source.used_in_barriers
    ]).size
    
    return {
      id: source.id,
      title: source.title,
      authors: source.authors,
      total_appearances: source.used_in_feelings.length + source.used_in_barriers.length,
      unique_pages: uniquePages,
      categories: [...new Set(source.categories)],
      // Calculate utility score: appearances * unique pages (weights broad utility)
      utility_score: (source.used_in_feelings.length + source.used_in_barriers.length) * uniquePages
    }
  })
  
  // Sort by utility score and take top 57
  const top57Sources = sourcesWithMetrics
    .sort((a, b) => b.utility_score - a.utility_score)
    .slice(0, 57)
  
  console.log('🏆 TOP 57 MOST USEFUL SOURCES:')
  console.log('=' .repeat(80))
  console.log('Rank | Title | Authors | Appearances | Unique Pages | Utility Score')
  console.log('-' .repeat(80))
  
  top57Sources.forEach((source, index) => {
    const rank = (index + 1).toString().padStart(2)
    const title = source.title.length > 30 ? source.title.substring(0, 27) + '...' : source.title.padEnd(30)
    const authors = source.authors.length > 20 ? source.authors.substring(0, 17) + '...' : source.authors.padEnd(20)
    const appearances = source.total_appearances.toString().padStart(3)
    const uniquePages = source.unique_pages.toString().padStart(2)
    const utilityScore = source.utility_score.toString().padStart(4)
    
    console.log(`${rank}   | ${title} | ${authors} | ${appearances}         | ${uniquePages}           | ${utilityScore}`)
  })
  
  // Create the final standardized list
  const standardizedList = top57Sources.map((source, index) => ({
    id: index + 1,
    title: source.title,
    authors: source.authors,
    appearances: source.total_appearances,
    unique_pages: source.unique_pages,
    categories: source.categories,
    description: generateDescription(source.title, source.authors, source.categories)
  }))
  
  // Write the standardized sources list
  writeFileSync(
    join(process.cwd(), 'scripts/top-57-sources.json'),
    JSON.stringify(standardizedList, null, 2)
  )
  
  // Create SQL for standardized sources table
  const sqlStatements = [
    '-- Create standardized sources table',
    'DROP TABLE IF EXISTS standardized_sources CASCADE;',
    '',
    'CREATE TABLE standardized_sources (',
    '    id SERIAL PRIMARY KEY,',
    '    title TEXT NOT NULL,',
    '    authors TEXT NOT NULL,',
    '    description TEXT,',
    '    total_appearances INTEGER DEFAULT 0,',
    '    unique_pages INTEGER DEFAULT 0,',
    '    categories TEXT[],',
    '    created_at TIMESTAMPTZ DEFAULT NOW(),',
    '    updated_at TIMESTAMPTZ DEFAULT NOW()',
    ');',
    '',
    'ALTER TABLE standardized_sources ENABLE ROW LEVEL SECURITY;',
    '',
    'CREATE POLICY "standardized_sources_policy" ON standardized_sources',
    '    FOR ALL TO PUBLIC USING (true);',
    '',
    '-- Insert the top 57 sources',
    'INSERT INTO standardized_sources (title, authors, description, total_appearances, unique_pages, categories) VALUES'
  ]
  
  const insertValues = standardizedList.map((source, index) => {
    const isLast = index === standardizedList.length - 1
    const categoriesArray = `'{${source.categories.map(c => `"${c.replace(/"/g, '""')}"`).join(', ')}}'`
    
    return `    ('${source.title.replace(/'/g, "''")}', '${source.authors.replace(/'/g, "''")}', '${source.description?.replace(/'/g, "''") || ''}', ${source.appearances}, ${source.unique_pages}, ${categoriesArray})${isLast ? ';' : ','}`
  })
  
  sqlStatements.push(...insertValues)
  
  // Add junction tables for the new standardized system
  sqlStatements.push(
    '',
    '-- Create junction tables for standardized sources',
    'DROP TABLE IF EXISTS feeling_standardized_sources CASCADE;',
    'DROP TABLE IF EXISTS barrier_standardized_sources CASCADE;',
    '',
    'CREATE TABLE feeling_standardized_sources (',
    '    id SERIAL PRIMARY KEY,',
    '    feeling_slug TEXT NOT NULL,',
    '    source_id INTEGER REFERENCES standardized_sources(id),',
    '    category TEXT NOT NULL,',
    '    created_at TIMESTAMPTZ DEFAULT NOW()',
    ');',
    '',
    'CREATE TABLE barrier_standardized_sources (',
    '    id SERIAL PRIMARY KEY,',
    '    barrier_slug TEXT NOT NULL,',
    '    source_id INTEGER REFERENCES standardized_sources(id),',
    '    category TEXT NOT NULL,',
    '    created_at TIMESTAMPTZ DEFAULT NOW()',
    ');',
    '',
    'ALTER TABLE feeling_standardized_sources ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE barrier_standardized_sources ENABLE ROW LEVEL SECURITY;',
    '',
    'CREATE POLICY "feeling_standardized_sources_policy" ON feeling_standardized_sources FOR ALL TO PUBLIC USING (true);',
    'CREATE POLICY "barrier_standardized_sources_policy" ON barrier_standardized_sources FOR ALL TO PUBLIC USING (true);',
    '',
    'CREATE INDEX idx_feeling_standardized_sources_feeling ON feeling_standardized_sources(feeling_slug);',
    'CREATE INDEX idx_feeling_standardized_sources_source ON feeling_standardized_sources(source_id);',
    'CREATE INDEX idx_barrier_standardized_sources_barrier ON barrier_standardized_sources(barrier_slug);',
    'CREATE INDEX idx_barrier_standardized_sources_source ON barrier_standardized_sources(source_id);'
  )
  
  writeFileSync(
    join(process.cwd(), 'scripts/database/standardized-sources-schema.sql'),
    sqlStatements.join('\n')
  )
  
  console.log('\n✅ STANDARDIZATION COMPLETE!')
  console.log('=' .repeat(80))
  console.log(`📊 Reduced from 315 unique sources to 57 most useful sources`)
  console.log(`📁 Generated: scripts/top-57-sources.json`)
  console.log(`🗄️ Generated: scripts/database/standardized-sources-schema.sql`)
  
  console.log('\n📈 NEXT STEPS:')
  console.log('1. Run the SQL schema to create standardized_sources table')
  console.log('2. Migrate existing feeling_sources and barrier_sources to use standardized references')
  console.log('3. Update application to display sources from standardized table')
  
  // Show some examples of removed sources
  const removedSources = sourcesWithMetrics.slice(57, 67)
  console.log('\n🗑️ EXAMPLES OF SOURCES REMOVED (ranked 58-67):')
  console.log('-' .repeat(80))
  removedSources.forEach((source, index) => {
    console.log(`${58 + index}. "${source.title}" by ${source.authors} (${source.total_appearances} appearances, ${source.unique_pages} pages)`)
  })
  
  return standardizedList
}

function generateDescription(title: string, authors: string, categories: string[]): string {
  // Create a brief description based on the most common categories
  const topCategories = categories.slice(0, 3)
  
  if (title.toLowerCase().includes('adhd')) {
    return `ADHD-focused resource covering ${topCategories.join(', ').toLowerCase()}.`
  } else if (title.toLowerCase().includes('habit') || title.toLowerCase().includes('tiny')) {
    return `Habit formation and behavior change strategies applicable to ${topCategories.slice(0, 2).join(' and ').toLowerCase()}.`
  } else if (title.toLowerCase().includes('self-care') || title.toLowerCase().includes('compassion')) {
    return `Self-care and compassion-focused approach to ${topCategories.slice(0, 2).join(' and ').toLowerCase()}.`
  } else if (title.toLowerCase().includes('brain') || title.toLowerCase().includes('second brain') || title.toLowerCase().includes('organize')) {
    return `Organization and external brain systems for ${topCategories.slice(0, 2).join(' and ').toLowerCase()}.`
  } else if (title.toLowerCase().includes('coach') || title.toLowerCase().includes('motivational')) {
    return `Coaching and motivational strategies for ${topCategories.slice(0, 2).join(' and ').toLowerCase()}.`
  } else if (title.toLowerCase().includes('body') || title.toLowerCase().includes('trauma')) {
    return `Body-based and trauma-informed approaches to ${topCategories.slice(0, 2).join(' and ').toLowerCase()}.`
  } else {
    return `Comprehensive resource for ${topCategories.slice(0, 2).join(' and ').toLowerCase()}.`
  }
}

// Run the standardization
createStandardizedSources()