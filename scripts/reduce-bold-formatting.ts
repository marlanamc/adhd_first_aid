#!/usr/bin/env tsx

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

// Function to reduce bold formatting in advice sections
function reduceAdviceBolding(text: string): string {
  // Key concepts that should remain bold
  const keyTermsToKeepBold = [
    'ADHD',
    'overwhelm', 'overwhelming', 'overwhelmed',
    'momentum', 'motivation',
    'break it into steps', 'one step at a time',
    'progress', 'win',
    'mysterious', 'complicated',
    'start', 'action', 'done'
  ]
  
  // First, remove all existing bold formatting
  let result = text.replace(/\*\*(.*?)\*\*/g, '$1')
  
  // Then selectively re-add bold formatting only for key terms
  keyTermsToKeepBold.forEach(term => {
    // Create case-insensitive regex for whole words
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    result = result.replace(regex, `**$&**`)
  })
  
  return result
}

function processFile(filePath: string): boolean {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  let modified = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Check for gentle or stern advice lines
    if (line.startsWith('**🧸 Gentle Advice:**') || line.startsWith('**🔥 Stern Advice:**')) {
      // Skip the header line
      continue
    }
    
    // Check if this is an advice content line (line after advice header)
    const prevLine = i > 0 ? lines[i - 1] : ''
    if (prevLine.startsWith('**🧸 Gentle Advice:**') || prevLine.startsWith('**🔥 Stern Advice:**')) {
      if (line.trim() && !line.startsWith('#') && !line.startsWith('**')) {
        const newLine = reduceAdviceBolding(line)
        if (newLine !== line) {
          lines[i] = newLine
          modified = true
        }
      }
    }
  }
  
  if (modified) {
    writeFileSync(filePath, lines.join('\n'))
    return true
  }
  
  return false
}

function main() {
  console.log('🔧 Starting bold formatting reduction...')
  
  const tasksDir = join(process.cwd(), 'tasks_pages')
  let tasksUpdated = 0
  
  // Process task files
  console.log('\n📁 Processing task files...')
  const taskFiles = readdirSync(tasksDir).filter(f => f.endsWith('.md'))
  for (const file of taskFiles) {
    const filePath = join(tasksDir, file)
    if (processFile(filePath)) {
      console.log(`  ✅ Updated: ${file}`)
      tasksUpdated++
    }
  }
  
  console.log('\n✨ Bold formatting reduction complete!')
  console.log(`📊 Updated ${tasksUpdated} task files`)
}

main()