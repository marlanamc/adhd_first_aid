import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMentalFogSources() {
  try {
    console.log('Starting mental fog sources import...')
    
    // Read the SQL file
    const sqlPath = join(process.cwd(), 'scripts/database/content-imports/mental-fog-sources.sql')
    const sqlContent = readFileSync(sqlPath, 'utf-8')
    
    // Split into individual statements and execute them
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`Executing ${statements.length} SQL statements...`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        if (statement.toUpperCase().includes('CREATE TABLE') || 
            statement.toUpperCase().includes('CREATE INDEX') ||
            statement.toUpperCase().includes('ALTER TABLE') ||
            statement.toUpperCase().includes('CREATE POLICY') ||
            statement.toUpperCase().includes('DROP POLICY')) {
          
          console.log(`Executing schema statement ${i + 1}...`)
          // For schema changes, we'll need to use the raw SQL approach
          console.log('Note: Schema changes need to be run in Supabase SQL editor')
          continue
        }
        
        if (statement.toUpperCase().includes('INSERT INTO')) {
          console.log(`Executing insert statement ${i + 1}...`)
          
          // Parse the INSERT statement manually
          if (statement.includes('feeling_sources')) {
            // Extract the values from the INSERT statement
            const valuesMatch = statement.match(/VALUES\s+(.+);?$/is)
            if (valuesMatch) {
              const valuesString = valuesMatch[1]
              // Parse individual value tuples
              const tuples = valuesString.match(/\([^)]+\)/g)
              
              if (tuples) {
                for (const tuple of tuples) {
                  // Extract values from the tuple
                  const cleanTuple = tuple.slice(1, -1) // Remove parentheses
                  const values = cleanTuple.split(',').map(v => v.trim().replace(/^'|'$/g, ''))
                  
                  const [feeling_slug, category, title, authors, description] = values
                  
                  const { error } = await supabase
                    .from('feeling_sources')
                    .insert({
                      feeling_slug,
                      category,
                      title,
                      authors,
                      description
                    })
                  
                  if (error) {
                    console.error(`Error inserting: ${title}`, error)
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`, error)
      }
    }
    
    // Verify the data was inserted
    const { data, error } = await supabase
      .from('feeling_sources')
      .select('*')
      .eq('feeling_slug', 'mental_fog')
    
    if (error) {
      console.error('Error verifying data:', error)
    } else {
      console.log(`✅ Successfully inserted ${data.length} sources for mental fog`)
      
      // Show breakdown by category
      const categoryCount = data.reduce((acc, source) => {
        acc[source.category] = (acc[source.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      console.log('\nCategories:')
      Object.entries(categoryCount).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} sources`)
      })
    }
    
  } catch (error) {
    console.error('Error running mental fog sources:', error)
  }
}

// Run the import
runMentalFogSources()