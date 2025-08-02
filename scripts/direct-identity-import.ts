import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
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

// Function to clean em dashes with exception for bolded text
function cleanEmDashes(text: string): string {
  // First, protect em dashes that come after **bolded text**
  const protectedText = text.replace(/(\*\*[^*]*\*\*)\s*—/g, '$1PROTECTED_EM_DASH')
  
  // Now replace remaining em dashes with commas
  let result = protectedText.replace(/—/g, ', ')
  
  // Restore the protected em dashes
  result = result.replace(/PROTECTED_EM_DASH/g, ' —')
  
  // Fix spacing issues
  result = result
    .replace(/, , /g, ', ') // Fix double commas
    .replace(/,  /g, ', ') // Fix comma with double space
    .replace(/ ,/g, ',') // Fix space before comma
    .replace(/\s+,/g, ',') // Fix any whitespace before comma
    .trim()
    
  return result
}

// Function to parse cleaned identity markdown file
function parseCleanedIdentityFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  
  // Find the header line
  let headerLine = ''
  let headerIndex = 0
  
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    if (lines[i].trim().startsWith('##')) {
      headerLine = lines[i].trim()
      headerIndex = i
      break
    }
  }
  
  if (!headerLine) {
    throw new Error(`No header found in ${filePath}`)
  }
  
  // Extract basic info from header
  let emoji = ''
  let identityName = ''
  
  const headerMatch1 = headerLine.match(/## (.+) ADHD Identity Guide: _(.+)_/)
  if (headerMatch1) {
    emoji = headerMatch1[1].trim()
    identityName = headerMatch1[2].trim()
  } else {
    const headerMatch2 = headerLine.match(/## (.+?) (.+)/)
    if (headerMatch2) {
      emoji = headerMatch2[1].trim()
      identityName = headerMatch2[2].trim()
    } else {
      throw new Error(`Invalid header format in ${filePath}: ${headerLine}`)
    }
  }
  
  // Find the intro paragraph
  let introParagraph = ''
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line && !line.startsWith('**') && !line.startsWith('#') && !line.startsWith('---')) {
      introParagraph = cleanEmDashes(line)
      break
    }
  }
  
  // Find gentle and stern advice and content sections
  let gentleAdvice = ''
  let sternAdvice = ''
  let currentSection = ''
  let contentSections: any[] = []
  let currentSectionData: any = null
  
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const line = rawLine.trim()
    
    // Look for gentle advice
    if (line.startsWith('**🧸 Gentle Advice:**')) {
      currentSection = 'gentle'
      continue
    }
    
    // Look for stern advice  
    if (line.startsWith('**🔥 Stern Advice:**')) {
      currentSection = 'stern'
      continue
    }
    
    // Look for section headers (### with emoji)
    if (line.startsWith('### ')) {
      // Save previous section if exists
      if (currentSectionData) {
        contentSections.push(currentSectionData)
      }
      
      const sectionMatch = line.match(/### (.+?) (.+)/)
      if (sectionMatch) {
        currentSectionData = {
          title: cleanEmDashes(sectionMatch[2]),
          emoji: sectionMatch[1],
          content: [],
          subsections: []
        }
      } else {
        currentSectionData = {
          title: cleanEmDashes(line.replace('### ', '')),
          emoji: '📝',
          content: [],
          subsections: []
        }
      }
      currentSection = 'content'
      continue
    }
    
    // Look for subsection headers (#### with emoji)
    if (line.startsWith('#### ') && currentSection === 'content' && currentSectionData) {
      // Try to match emoji + title pattern: #### 🔥 Title
      const emojiMatch = line.match(/#### ([^\w\s]+)\s+(.+)/)
      if (emojiMatch) {
        currentSectionData.subsections.push({
          title: cleanEmDashes(emojiMatch[2]),
          emoji: emojiMatch[1],
          content: []
        })
      } else {
        // No emoji found, use the whole text as title
        currentSectionData.subsections.push({
          title: cleanEmDashes(line.replace('#### ', '')),
          emoji: '🔸',
          content: []
        })
      }
      continue
    }
    
    // Skip horizontal rules and empty lines
    if (line === '---' || line === '') {
      continue
    }
    
    // Process content based on current section
    if (currentSection === 'gentle' && line && !line.startsWith('**🔥')) {
      gentleAdvice += (gentleAdvice ? ' ' : '') + cleanEmDashes(line)
    } else if (currentSection === 'stern' && line && !line.startsWith('###')) {
      sternAdvice += (sternAdvice ? ' ' : '') + cleanEmDashes(line)
    } else if (currentSection === 'content' && line && currentSectionData) {
      
      // Handle callout boxes (lines starting with >)
      if (line.startsWith('>')) {
        let calloutText = line.substring(1).trim()
        
        // Get the target content array (subsection or main section)
        const currentSubsection = currentSectionData.subsections[currentSectionData.subsections.length - 1]
        const targetContent = currentSubsection ? currentSubsection.content : currentSectionData.content
        
        // Check if the last item is also a callout to combine them
        const lastItemIndex = targetContent.length - 1
        if (lastItemIndex >= 0 && targetContent[lastItemIndex].startsWith('> ')) {
          // Combine with previous callout
          const existingCallout = targetContent[lastItemIndex].substring(2) // Remove '> '
          const combinedCallout = `${existingCallout}\n\n${cleanEmDashes(calloutText)}`
          targetContent[lastItemIndex] = `> ${combinedCallout}`
        } else {
          // Create new callout
          targetContent.push(`> ${cleanEmDashes(calloutText)}`)
        }
        continue
      }
      
      // Handle indented sub-bullets (tabs or multiple spaces) - MUST come before regular bullets
      if (rawLine.match(/^[\t ]{4,}- /) || rawLine.match(/^\t- /)) {  // 4+ spaces or tab followed by dash
        let subBulletContent = rawLine.replace(/^[\t ]+- /, '').trim()
        subBulletContent = cleanEmDashes(subBulletContent)
        
        // Add to current subsection if we have one
        const currentSubsection = currentSectionData.subsections[currentSectionData.subsections.length - 1]
        if (currentSubsection) {
          currentSubsection.content.push(`→ ${subBulletContent}`)
        } else {
          // Add to main section content
          currentSectionData.content.push(`→ ${subBulletContent}`)
        }
        continue
      }
      
      // Handle regular bullet points
      if (line.startsWith('- ')) {
        let bulletContent = line.substring(2).trim()
        bulletContent = cleanEmDashes(bulletContent)
        
        // Add to current subsection if we have one
        const currentSubsection = currentSectionData.subsections[currentSectionData.subsections.length - 1]
        if (currentSubsection) {
          currentSubsection.content.push(bulletContent)
        } else {
          // Add to main section content
          currentSectionData.content.push(bulletContent)
        }
        continue
      }
      
      // Handle regular content lines
      if (!line.startsWith('####') && !line.startsWith('###')) {
        const cleanedLine = cleanEmDashes(line)
        
        // Add to current subsection if we have one
        const currentSubsection = currentSectionData.subsections[currentSectionData.subsections.length - 1]
        if (currentSubsection) {
          currentSubsection.content.push(cleanedLine)
        } else {
          // Add to main section content
          currentSectionData.content.push(cleanedLine)
        }
      }
    }
  }
  
  // Don't forget the last section
  if (currentSectionData) {
    contentSections.push(currentSectionData)
  }
  
  return {
    identity_name: identityName,
    emoji: emoji,
    intro_paragraph: introParagraph,
    gentle_advice: cleanEmDashes(gentleAdvice),
    stern_advice: cleanEmDashes(sternAdvice),
    content_sections: contentSections
  }
}

async function importIdentities() {
  try {
    const identityPagesDir = '/Users/marlanacreed/Downloads/Projects/adhd-first-aid-kit/Identity Pages'
    const files = fs.readdirSync(identityPagesDir)
      .filter(file => file.endsWith('.md') && file !== 'Identity Pages.md' && !file.includes('.backup.'))

    console.log(`Processing ${files.length} identity markdown files...`)

    // Clear existing data
    console.log('Clearing existing identities_content data...')
    const { error: deleteError } = await supabase
      .from('identities_content')
      .delete()
      .neq('identity_name', '')

    if (deleteError) {
      console.error('Error clearing data:', deleteError)
      return
    }
    console.log('✓ Cleared existing data')

    // Process and import each file
    const identities = []
    for (const file of files) {
      try {
        const filePath = path.join(identityPagesDir, file)
        console.log(`Processing ${file}...`)
        
        const identity = parseCleanedIdentityFile(filePath)
        identities.push(identity)
        
        console.log(`✓ Processed: ${identity.identity_name}`)
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error)
      }
    }

    // Insert all identities
    console.log(`\nInserting ${identities.length} identities into database...`)
    
    for (let i = 0; i < identities.length; i++) {
      const identity = identities[i]
      console.log(`Inserting ${i + 1}/${identities.length}: ${identity.identity_name}`)
      
      const { error } = await supabase
        .from('identities_content')
        .insert(identity)
      
      if (error) {
        console.error(`Error inserting ${identity.identity_name}:`, error)
      } else {
        console.log(`✓ Inserted: ${identity.identity_name}`)
      }
    }

    // Verify the import
    const { data, error } = await supabase
      .from('identities_content')
      .select('identity_name')

    if (error) {
      console.error('Error verifying import:', error)
    } else {
      console.log(`\n✅ Import completed! ${data.length} identity records in database`)
      
      // List imported identities
      console.log('\nImported identities:')
      data.forEach((identity: any, i: number) => {
        console.log(`${i + 1}. ${identity.identity_name}`)
      })
    }

  } catch (error) {
    console.error('Import failed:', error)
  }
}

importIdentities()