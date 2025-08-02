import fs from 'fs'
import path from 'path'

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
      const subsectionMatch = line.match(/#### (.+?) (.+)/)
      if (subsectionMatch) {
        currentSectionData.subsections.push({
          title: cleanEmDashes(subsectionMatch[2]),
          emoji: subsectionMatch[1],
          content: []
        })
      } else {
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
      if (rawLine.match(/^\t- /)) {
        let subBulletContent = rawLine.replace(/^\t- /, '').trim()
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

// Process all identity files
const identityPagesDir = '/Users/marlanacreed/Downloads/Projects/adhd-first-aid-kit/Identity Pages'
const files = fs.readdirSync(identityPagesDir)
  .filter(file => file.endsWith('.md') && file !== 'Identity Pages.md' && !file.includes('.backup.'))

const processedIdentities: any[] = []

console.log(`Processing ${files.length} cleaned identity markdown files:`)

for (const file of files) {
  try {
    const filePath = path.join(identityPagesDir, file)
    console.log(`Processing ${file}...`)
    
    const identity = parseCleanedIdentityFile(filePath)
    processedIdentities.push(identity)
    
    console.log(`✓ Processed: ${identity.identity_name}`)
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error)
  }
}

// Generate SQL insert statements
let sqlContent = `-- =============================================
-- CLEANED IDENTITY PAGES CONTENT IMPORT
-- =============================================
-- Auto-generated from cleaned Identity Pages markdown files
-- Processed ${new Date().toISOString()}

-- Clear existing data
DELETE FROM identities_content;

-- Insert identity content
`

for (const identity of processedIdentities) {
  const escapedValues = {
    identity_name: identity.identity_name.replace(/'/g, "''"),
    emoji: identity.emoji.replace(/'/g, "''"),
    intro_paragraph: identity.intro_paragraph.replace(/'/g, "''"),
    gentle_advice: identity.gentle_advice.replace(/'/g, "''"),
    stern_advice: identity.stern_advice.replace(/'/g, "''"),
    content_sections: JSON.stringify(identity.content_sections).replace(/'/g, "''")
  }
  
  sqlContent += `
INSERT INTO identities_content (
  identity_name,
  emoji,
  intro_paragraph,
  gentle_advice,
  stern_advice,
  content_sections
) VALUES (
  '${escapedValues.identity_name}',
  '${escapedValues.emoji}',
  '${escapedValues.intro_paragraph}',
  '${escapedValues.gentle_advice}',
  '${escapedValues.stern_advice}',
  '${escapedValues.content_sections}'::jsonb
);
`
}

// Write the SQL file
const outputPath = '/Users/marlanacreed/Downloads/Projects/adhd-first-aid-kit/scripts/database/content-imports/cleaned_identities_content.sql'
fs.writeFileSync(outputPath, sqlContent)

console.log(`\n✅ Generated cleaned SQL import file: ${outputPath}`)
console.log(`📊 Processed ${processedIdentities.length} identity pages`)

// Show sample of processed identities
console.log('\nProcessed identities:')
processedIdentities.forEach((identity, i) => {
  console.log(`${i + 1}. ${identity.identity_name} (${identity.emoji})`)
})