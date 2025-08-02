import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
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
    
    // Skip empty lines and main title
    if (!line || line.startsWith('# 📚 Sources') || line === '---') {
      i++
      continue
    }
    
    // Detect category headers (## 🧠 Executive Function...)
    if (line.startsWith('##')) {
      currentCategory = line.replace(/^##\s*/, '').replace(/^[^\s]+\s*/, '').trim()
      i++
      continue
    }
    
    // Detect book entries (- **Book Title** by Author)
    if (line.startsWith('- **') && line.includes('**') && line.includes(' by ')) {
      const titleMatch = line.match(/\*\*(.*?)\*\* by (.+)/)
      if (titleMatch) {
        const [, title, authors] = titleMatch
        
        // Look for description on next line(s)
        let description = ''
        let j = i + 1
        
        while (j < lines.length) {
          const nextLine = lines[j].trim()
          if (!nextLine || nextLine.startsWith('- **') || nextLine.startsWith('##') || nextLine === '---') {
            break
          }
          // Remove leading spaces and combine description lines
          if (description) {
            description += ' ' + nextLine
          } else {
            description = nextLine
          }
          j++
        }
        
        sources.push({
          feeling_slug: feelingSlug,
          category: currentCategory,
          title: title.trim(),
          authors: authors.trim(),
          description: description.trim()
        })
        
        i = j - 1 // Move to the last processed line
      }
    }
    
    i++
  }
  
  return sources
}

async function createTableIfNeeded() {
  // Try to create the table directly with individual commands
  console.log('Creating feeling_sources table...')
  
  // First, try to create the table by inserting a test record and catching the error
  try {
    const { data } = await supabase
      .from('feeling_sources')
      .select('*')
      .limit(1)
    
    console.log('✅ Table already exists')
    return
  } catch (error) {
    console.log('Table does not exist, needs to be created manually in Supabase dashboard')
    console.log('Please run this SQL in your Supabase SQL editor:')
    console.log(`
CREATE TABLE feeling_sources (
    id SERIAL PRIMARY KEY,
    feeling_slug TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feeling_sources_feeling_slug ON feeling_sources(feeling_slug);

ALTER TABLE feeling_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to feeling_sources" ON feeling_sources
    FOR SELECT TO PUBLIC
    USING (true);

CREATE POLICY "Allow public write access to feeling_sources" ON feeling_sources
    FOR ALL TO PUBLIC
    USING (true);
    `)
  }
}

async function importFeelingSources() {
  try {
    console.log('Starting feeling sources import...')
    
    // Try to create table first
    await createTableIfNeeded()
    
    // Read the markdown file
    const sourcesPath = join(process.cwd(), 'mental_fog_sources.md')
    const content = readFileSync(sourcesPath, 'utf-8')
    
    // Parse the sources
    const sources = parseMarkdownSources(content, 'mental_fog')
    
    console.log(`Parsed ${sources.length} sources`)
    
    // Clear existing sources for mental_fog
    const { error: deleteError } = await supabase
      .from('feeling_sources')
      .delete()
      .eq('feeling_slug', 'mental_fog')
    
    if (deleteError) {
      console.error('Error clearing existing sources:', deleteError)
      return
    }
    
    // Insert sources in batches
    const batchSize = 50
    for (let i = 0; i < sources.length; i += batchSize) {
      const batch = sources.slice(i, i + batchSize)
      
      const { error } = await supabase
        .from('feeling_sources')
        .insert(batch)
      
      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error)
        return
      }
      
      console.log(`Imported batch ${i / batchSize + 1} (${batch.length} sources)`)
    }
    
    console.log('✅ Successfully imported all feeling sources!')
    
    // Verify the import
    const { data: verifyData, error: verifyError } = await supabase
      .from('feeling_sources')
      .select('*')
      .eq('feeling_slug', 'mental_fog')
    
    if (verifyError) {
      console.error('Error verifying import:', verifyError)
    } else {
      console.log(`✅ Verification: ${verifyData.length} sources found in database`)
      
      // Show categories breakdown
      const categoryCount = verifyData.reduce((acc, source) => {
        acc[source.category] = (acc[source.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      console.log('Categories breakdown:')
      Object.entries(categoryCount).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} sources`)
      })
    }
    
  } catch (error) {
    console.error('Error importing feeling sources:', error)
  }
}

// Run the import
importFeelingSources()