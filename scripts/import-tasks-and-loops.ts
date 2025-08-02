#!/usr/bin/env tsx

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface ContentSection {
  title: string;
  emoji: string;
  content: string[];
  subsections?: {
    title: string;
    emoji: string;
    content: string[];
  }[];
}

interface ParsedContent {
  name: string;
  subtitle?: string;
  intro_paragraph: string;
  gentle_advice: string;
  stern_advice: string;
  adhd_reasons: string[];
  content_sections: ContentSection[];
}

function parseMarkdownFile(content: string, filename: string): ParsedContent {
  const lines = content.split('\n')
  let title = ''
  let subtitle = ''
  let intro_paragraph = ''
  let gentle_advice = ''
  let stern_advice = ''
  let adhd_reasons: string[] = []
  let content_sections: ContentSection[] = []
  let currentContentSection: ContentSection | null = null
  let currentSubsection: any = null
  let currentSection = ''
  let collectingADHDReasons = false

  // Extract title from filename (remove .md and convert underscores to spaces)
  title = filename.replace('.md', '').replace(/_/g, ' ')
  
  // Debug logging for cleaning file
  const isCleaningFile = false // filename.toLowerCase().includes('cleaning')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()
    
    // Skip empty lines
    if (!trimmedLine) continue
    
    // Main title (## )
    if (trimmedLine.startsWith('## ')) {
      const titleMatch = trimmedLine.match(/^## (.+)/)
      if (titleMatch) {
        title = titleMatch[1].replace(/^[^\s]+ /, '') // Remove emoji
      }
      continue
    }
    
    // Extract intro paragraph (first substantial paragraph after title, before advice)
    if (!intro_paragraph && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('**') && trimmedLine.length > 30 && !currentSection) {
      intro_paragraph = trimmedLine
      continue
    }
    
    // Gentle advice
    if (trimmedLine.startsWith('**🧸')) {
      currentSection = 'gentle'
      continue
    }
    
    // Stern advice  
    if (trimmedLine.startsWith('**🔥')) {
      currentSection = 'stern'
      continue
    }
    
    // Main content sections (### )
    if (trimmedLine.startsWith('### ')) {
      currentSection = 'content_sections'
      collectingADHDReasons = false
      
      const sectionMatch = trimmedLine.match(/^### (.+)/)
      if (sectionMatch) {
        const fullTitle = sectionMatch[1]
        const emojiMatch = fullTitle.match(/^([^\s]+)\s+(.+)/)
        
        // Check if this is the ADHD reasons section
        if (trimmedLine.includes('Why') && (trimmedLine.includes('Hard with ADHD') || trimmedLine.includes('ADHD'))) {
          collectingADHDReasons = true
          if (isCleaningFile) console.log('Started collecting ADHD reasons')
          // Don't create a content section for ADHD reasons, just start collecting
          continue
        }
        
        currentContentSection = {
          title: emojiMatch ? emojiMatch[2] : fullTitle,
          emoji: emojiMatch ? emojiMatch[1] : '🛠️',
          content: [],
          subsections: []
        }
        content_sections.push(currentContentSection)
        currentSubsection = null
      }
      continue
    }
    
    // Subsections (#### )
    if (line.startsWith('#### ') && currentContentSection) {
      const subsectionMatch = line.match(/^#### (.+)/)
      if (subsectionMatch) {
        const fullTitle = subsectionMatch[1]
        const emojiMatch = fullTitle.match(/^([^\s]+)\s+(.+)/)
        
        currentSubsection = {
          title: emojiMatch ? emojiMatch[2] : fullTitle,
          emoji: emojiMatch ? emojiMatch[1] : '•',
          content: []
        }
        currentContentSection.subsections = currentContentSection.subsections || []
        currentContentSection.subsections.push(currentSubsection)
      }
      continue
    }
    
    // Collect content based on current section
    if (currentSection === 'gentle' && !gentle_advice && trimmedLine.length > 5) {
      gentle_advice = trimmedLine
    } else if (currentSection === 'stern' && !stern_advice && trimmedLine.length > 5) {
      stern_advice = trimmedLine
    } else if (currentSection === 'content_sections') {
      // Handle ADHD reasons special case
      if (collectingADHDReasons) {
        // Check if we've moved to a new section (indicated by ### or other headers)
        if (trimmedLine.startsWith('###') || trimmedLine.startsWith('####')) {
          collectingADHDReasons = false
          if (isCleaningFile) console.log('Stopped collecting ADHD reasons, found new section:', trimmedLine)
          i-- // Reprocess this line as a section header
          continue
        }
        
        // Check for main list headers (use original line to preserve indentation)
        if (line.startsWith('- You might:')) {
          adhd_reasons.push('You might:')
          if (isCleaningFile) console.log('Added header: You might:')
          continue
        }
        if (line.startsWith("- Here's what's really going on:") || line.startsWith("- Here's what's really going on:")) {
          adhd_reasons.push("Here's what's really going on:")
          if (isCleaningFile) console.log('Added header: Here\'s what\'s really going on:')
          continue
        }
        // Collect the actual ADHD reason bullets (indented with two spaces)
        if (line.startsWith('  - ') && line.length > 4) {
          const bulletContent = line.substring(4).trim()
          adhd_reasons.push(bulletContent)
          if (isCleaningFile) console.log('Added bullet:', bulletContent)
          continue
        }
        // Log what we're skipping
        if (isCleaningFile && trimmedLine.length > 0) {
          console.log('Skipping line in ADHD section:', line)
        }
        // Continue collecting even on empty lines (don't stop collection)
        continue
      }
      
      // Regular content collection (skip if we're collecting ADHD reasons)
      if (!collectingADHDReasons && (line.startsWith('- ') || line.startsWith('> ') || line.startsWith('  - ') || 
          (!line.startsWith('#') && !line.startsWith('**') && line.length > 10))) {
        
        if (currentSubsection) {
          currentSubsection.content.push(line)
        } else if (currentContentSection) {
          currentContentSection.content.push(line)
        }
      }
    }
  }

  if (isCleaningFile) {
    console.log('Final ADHD reasons for cleaning:', adhd_reasons)
    console.log('Total ADHD reasons collected:', adhd_reasons.length)
  }
  
  return {
    name: title,
    subtitle,
    intro_paragraph,
    gentle_advice,
    stern_advice,
    adhd_reasons,
    content_sections
  }
}

async function importTasks() {
  console.log('🧼 Starting tasks import...')
  
  const tasksDir = join(process.cwd(), 'tasks_pages')
  const files = readdirSync(tasksDir).filter(f => f.endsWith('.md') && f !== 'Task Pages.md')
  
  for (const file of files) {
    try {
      console.log(`Processing task: ${file}`)
      const content = readFileSync(join(tasksDir, file), 'utf8')
      const parsed = parseMarkdownFile(content, file)
      
      const { error } = await supabase
        .from('tasks_content')
        .upsert({
          task_name: parsed.name,
          subtitle: parsed.subtitle,
          intro_paragraph: parsed.intro_paragraph,
          gentle_advice: parsed.gentle_advice,
          stern_advice: parsed.stern_advice,
          adhd_reasons: parsed.adhd_reasons,
          content_sections: parsed.content_sections
        }, {
          onConflict: 'task_name'
        })
      
      if (error) {
        console.error(`Error importing ${file}:`, error)
      } else {
        console.log(`✅ Imported: ${parsed.name}`)
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err)
    }
  }
}

async function importComplexLoops() {
  console.log('🧠 Starting complex loops import...')
  
  const loopsDir = join(process.cwd(), 'complex_loops_pages')
  const files = readdirSync(loopsDir).filter(f => f.endsWith('.md') && f !== 'Complex Loop Pages.md')
  
  for (const file of files) {
    try {
      console.log(`Processing loop: ${file}`)
      const content = readFileSync(join(loopsDir, file), 'utf8')
      const parsed = parseMarkdownFile(content, file)
      
      const { error } = await supabase
        .from('complex_loops_content')
        .upsert({
          loop_name: parsed.name,
          subtitle: parsed.subtitle,
          intro_paragraph: parsed.intro_paragraph,
          gentle_advice: parsed.gentle_advice,
          stern_advice: parsed.stern_advice,
          adhd_reasons: parsed.adhd_reasons,
          content_sections: parsed.content_sections
        }, {
          onConflict: 'loop_name'
        })
      
      if (error) {
        console.error(`Error importing ${file}:`, error)
      } else {
        console.log(`✅ Imported: ${parsed.name}`)
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err)
    }
  }
}

async function main() {
  console.log('📥 Starting tasks and complex loops import...')
  
  try {
    await importTasks()
    await importComplexLoops()
    console.log('🎉 Import completed successfully!')
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}