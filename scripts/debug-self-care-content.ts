#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('Checking Self-Care section content...')
  
  // Get the Working Multiple Jobs identity to see the self-care section
  const { data, error } = await supabase
    .from('identities_content')
    .select('identity_name, content_sections')
    .eq('identity_name', 'The Working Multiple Jobs')
    .single()
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  if (data && data.content_sections) {
    console.log('\n=== WORKING MULTIPLE JOBS CONTENT ===')
    
    data.content_sections.forEach((section: any, sectionIndex: number) => {
      if (section.title && section.title.includes('Self-Care')) {
        console.log(`\n--- FOUND SELF-CARE SECTION: ${section.title} ---`)
        console.log('Content items:')
        
        if (section.content && Array.isArray(section.content)) {
          section.content.forEach((item: string, itemIndex: number) => {
            console.log(`  ${itemIndex + 1}. "${item}"`)
            // Check what each item starts with
            if (item.startsWith('**')) {
              console.log(`    ^^ Starts with ** (should be bold header with bullet)`)
            } else if (item.startsWith('→')) {
              console.log(`    ^^ Starts with → (should be arrow)`)
            } else if (item.trim().startsWith('→')) {
              console.log(`    ^^ Starts with → after trim (should be arrow)`)
            } else if (item.startsWith('  ') || item.startsWith('\t')) {
              console.log(`    ^^ Starts with whitespace (indented - should be arrow?)`)
            } else {
              console.log(`    ^^ Starts with: "${item.charAt(0)}" (regular bullet?)`)
            }
          })
        }
        
        // Check subsections too
        if (section.subsections && Array.isArray(section.subsections)) {
          section.subsections.forEach((subsection: any, subIndex: number) => {
            console.log(`\n  Subsection: ${subsection.title}`)
            if (subsection.content) {
              subsection.content.forEach((item: string, itemIndex: number) => {
                console.log(`    ${itemIndex + 1}. "${item}"`)
              })
            }
          })
        }
      }
    })
  }
}

main()