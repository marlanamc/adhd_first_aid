import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Function to parse SQL INSERT statement and extract values
function parseInsertStatement(sql: string) {
  // Match the VALUES clause
  const valuesMatch = sql.match(/VALUES\s*\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'::jsonb\s*\)/s)
  
  if (!valuesMatch) {
    throw new Error('Could not parse INSERT statement')
  }
  
  const [, identity_name, emoji, intro_paragraph, gentle_advice, stern_advice, content_sections_str] = valuesMatch
  
  // Unescape single quotes
  const unescapeQuotes = (str: string) => str.replace(/''/g, "'")
  
  return {
    identity_name: unescapeQuotes(identity_name),
    emoji: unescapeQuotes(emoji),
    intro_paragraph: unescapeQuotes(intro_paragraph),
    gentle_advice: unescapeQuotes(gentle_advice),
    stern_advice: unescapeQuotes(stern_advice),
    content_sections: JSON.parse(unescapeQuotes(content_sections_str))
  }
}

async function runSQLImport() {
  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync('scripts/database/content-imports/cleaned_identities_content.sql', 'utf8')
    
    // Extract the SQL statements (skip the DELETE and just run INSERTs)
    const lines = sqlContent.split('\n')
    const insertStatements = []
    let currentStatement = ''
    
    for (const line of lines) {
      if (line.trim().startsWith('INSERT INTO identities_content')) {
        if (currentStatement) {
          insertStatements.push(currentStatement.trim())
        }
        currentStatement = line
      } else if (line.trim() === ');' && currentStatement) {
        currentStatement += '\n' + line
        insertStatements.push(currentStatement.trim())
        currentStatement = ''
      } else if (currentStatement) {
        currentStatement += '\n' + line
      }
    }
    
    console.log(`Found ${insertStatements.length} INSERT statements`)
    
    // First, clear existing data
    console.log('Clearing existing identities_content data...')
    const { error: deleteError } = await supabase
      .from('identities_content')
      .delete()
      .neq('identity_name', '')  // Delete all records
    
    if (deleteError) {
      console.error('Error clearing data:', deleteError)
      return
    }
    
    console.log('✓ Cleared existing data')
    
    // Process each INSERT statement
    for (let i = 0; i < insertStatements.length; i++) {
      const statement = insertStatements[i]
      console.log(`Processing statement ${i + 1}/${insertStatements.length}...`)
      
      try {
        // Parse the statement and extract data
        const data = parseInsertStatement(statement)
        
        // Insert using Supabase client
        const { error } = await supabase
          .from('identities_content')
          .insert(data)
        
        if (error) {
          console.error(`Error in statement ${i + 1}:`, error)
          continue
        }
        
        console.log(`✓ Statement ${i + 1} completed`)
      } catch (err) {
        console.error(`Error processing statement ${i + 1}:`, err)
      }
    }
    
    console.log('\n✅ SQL import completed!')
    
    // Verify the import
    const { data, error } = await supabase
      .from('identities_content')
      .select('identity_name')
    
    if (error) {
      console.error('Error verifying import:', error)
    } else {
      console.log(`📊 Verified: ${data.length} identity records imported`)
    }
    
  } catch (error) {
    console.error('Import failed:', error)
  }
}

runSQLImport()