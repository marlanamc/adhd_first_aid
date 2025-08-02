#!/usr/bin/env tsx

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function compareFilesVsDatabase() {
  console.log('🔍 Comparing files vs database...')
  
  // Get files from directory
  const tasksDir = join(process.cwd(), 'tasks_pages')
  const files = readdirSync(tasksDir).filter(f => f.endsWith('.md') && f !== 'Task Pages.md')
  
  console.log(`\n📁 Files in tasks_pages folder: ${files.length}`)
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`)
  })
  
  // Get tasks from database
  const { data: dbTasks, error } = await supabase
    .from('tasks_content')
    .select('task_name')
    .order('task_name')
  
  if (error) {
    console.error('Database error:', error)
    return
  }
  
  console.log(`\n💾 Tasks in database: ${dbTasks.length}`)
  dbTasks.forEach((task, index) => {
    console.log(`${index + 1}. "${task.task_name}"`)
  })
  
  // Find missing files
  console.log('\n❌ Files not imported to database:')
  let missingCount = 0
  
  for (const file of files) {
    // Extract title from file to match against database
    const content = readFileSync(join(tasksDir, file), 'utf-8')
    const lines = content.split('\n')
    
    // Find the title line (## Title)
    let fileTitle = ''
    for (const line of lines) {
      if (line.startsWith('## ')) {
        fileTitle = line.replace(/^## /, '').replace(/^[^\s]+ /, '') // Remove emoji
        break
      }
    }
    
    if (!fileTitle) {
      fileTitle = file.replace('.md', '').replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
    
    // Check if this title exists in database
    const dbMatch = dbTasks.find(task => task.task_name === fileTitle)
    
    if (!dbMatch) {
      console.log(`- ${file} → "${fileTitle}"`)
      missingCount++
    }
  }
  
  if (missingCount === 0) {
    console.log('✅ All files have been imported!')
  } else {
    console.log(`\n⚠️  Found ${missingCount} files that may not be imported correctly`)
  }
}

compareFilesVsDatabase()