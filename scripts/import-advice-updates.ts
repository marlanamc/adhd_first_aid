#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
}

interface AdviceUpdate {
  name: string
  type: string
  gentle_advice: string
  stern_advice: string
}

// Parse markdown table to extract advice updates
function parseMarkdownTable(content: string): AdviceUpdate[] {
  const lines = content.split('\n')
  const updates: AdviceUpdate[] = []
  
  // Skip header lines
  let startIndex = 0
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('|:---|:---|:---|:---|')) {
      startIndex = i + 1
      break
    }
  }
  
  // Parse each row
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || !line.startsWith('|')) continue
    
    // Split by | and clean up
    const parts = line.split('|').map(p => p.trim()).filter(p => p)
    
    if (parts.length >= 4) {
      // Remove the ** from names
      const name = parts[0].replace(/\*\*/g, '')
      
      updates.push({
        name,
        type: parts[1],
        gentle_advice: parts[2],
        stern_advice: parts[3]
      })
    }
  }
  
  return updates
}

// Update content in the appropriate table
async function updateContent(update: AdviceUpdate, previewOnly = false) {
  const tableConfig: Record<string, { table: string; nameField: string }> = {
    'feelings': { table: 'feelings_content', nameField: 'feeling_name' },
    'tasks': { table: 'tasks_content', nameField: 'task_name' },
    'barriers': { table: 'barriers_content', nameField: 'barrier_name' },
    'identities': { table: 'identities_content', nameField: 'identity_name' },
    'complex_loops': { table: 'complex_loops_content', nameField: 'loop_name' }
  }
  
  const config = tableConfig[update.type]
  if (!config) {
    console.log(`${colors.yellow}Unknown type: ${update.type} for ${update.name}${colors.reset}`)
    return
  }
  
  const { table, nameField } = config
  
  // Special handling for identities - need to match the database name format
  let searchName = update.name
  if (update.type === 'identities') {
    // The database stores full names like "ADHD Identity Guide: The Parent"
    // But the update file has shortened names
    if (!searchName.startsWith('ADHD Identity Guide:')) {
      // Map shortened names to full names
      const identityMap: Record<string, string> = {
        'ADHD Identity Guide: Queer & Trans': 'ADHD Identity Guide: Queer & Trans',
        'ADHD Identity Guide: The Parent of a Child with ADHD': 'ADHD Identity Guide: The Parent of a Child with ADHD',
        'ADHD Identity Guide: The Recovering Perfectionist': 'ADHD Identity Guide: The Recovering Perfectionist',
        'The AuDHD Individual': 'ADHD Identity Guide: The AuDHD Individual',
        'The BIPOC Individual': 'ADHD Identity Guide: The BIPOC Individual',
        'The Breadwinner': 'ADHD Identity Guide: The Breadwinner',
        'The Burned Out Professional': 'ADHD Identity Guide: The Burned Out Professional',
        'The Caretaker': 'ADHD Identity Guide: The Caretaker',
        'The Creative': 'ADHD Identity Guide: The Creative',
        'The Entrepreneur': 'ADHD Identity Guide: The Entrepreneur',
        'The Grieving or Emotionally Raw Individual': 'ADHD Identity Guide: The Grieving or Emotionally Raw Individual',
        'The Immigrant': 'ADHD Identity Guide: The Immigrant',
        'The Individual Without a Support System': 'ADHD Identity Guide: The Individual Without a Support System',
        'The Job Seeker': 'ADHD Identity Guide: The Job Seeker',
        'The Low-Income Individual': 'ADHD Identity Guide: The Low-Income Individual',
        'The Neurodivergent Adult': 'ADHD Identity Guide: The Neurodivergent Adult',
        'The Overly Responsible Sibling': 'ADHD Identity Guide: The Overly Responsible Sibling',
        'The Parent': 'ADHD Identity Guide: The Parent',
        'The Recently Diagnosed': 'ADHD Identity Guide: The Recently Diagnosed',
        'The Sick or Chronically Ill': 'ADHD Identity Guide: The Sick or Chronically Ill',
        'The Solo Household Manager': 'ADHD Identity Guide: The Solo Household Manager',
        'The Student': 'ADHD Identity Guide: The Student',
        'The Working Multiple Jobs': 'ADHD Identity Guide: The Working Multiple Jobs'
      }
      
      searchName = identityMap[update.name] || update.name
    }
  }
  
  // First, check if the item exists
  const { data: existing, error: checkError } = await supabase
    .from(table)
    .select(`id, ${nameField}, gentle_advice, stern_advice`)
    .eq(nameField, searchName)
    .single()
  
  if (checkError) {
    console.log(`${colors.red}Not found in ${table}: ${searchName}${colors.reset}`)
    return
  }
  
  if (previewOnly) {
    // Show preview of changes
    console.log(`${colors.yellow}Preview - ${update.type}: ${searchName}${colors.reset}`)
    console.log(`  Current gentle: ${existing.gentle_advice?.substring(0, 50)}...`)
    console.log(`  New gentle: ${update.gentle_advice.substring(0, 50)}...`)
    console.log(`  Current stern: ${existing.stern_advice?.substring(0, 50)}...`)
    console.log(`  New stern: ${update.stern_advice.substring(0, 50)}...\n`)
    return
  }
  
  // Update the advice
  const { error: updateError } = await supabase
    .from(table)
    .update({
      gentle_advice: update.gentle_advice,
      stern_advice: update.stern_advice,
      updated_at: new Date().toISOString()
    })
    .eq('id', existing.id)
  
  if (updateError) {
    console.log(`${colors.red}Error updating ${searchName}: ${updateError.message}${colors.reset}`)
  } else {
    console.log(`${colors.green}✓ Updated ${update.type}: ${searchName}${colors.reset}`)
  }
}

// Main import function
async function importAdviceUpdates(previewOnly = false) {
  const mode = previewOnly ? 'Preview Mode' : 'Update Mode'
  console.log(`${colors.blue}Starting advice content updates (${mode})...${colors.reset}\n`)
  
  // Read the advice updates file
  const filePath = path.join(__dirname, '../advice_updates.md')
  if (!fs.existsSync(filePath)) {
    console.error(`${colors.red}Error: advice_updates.md not found${colors.reset}`)
    return
  }
  
  const content = fs.readFileSync(filePath, 'utf-8')
  const updates = parseMarkdownTable(content)
  
  console.log(`${colors.magenta}Found ${updates.length} items to ${previewOnly ? 'preview' : 'update'}${colors.reset}\n`)
  
  // Group updates by type for summary
  const summary: Record<string, number> = {}
  
  // Process each update
  for (const update of updates) {
    await updateContent(update, previewOnly)
    summary[update.type] = (summary[update.type] || 0) + 1
  }
  
  // Print summary
  console.log(`\n${colors.blue}${previewOnly ? 'Preview' : 'Update'} Summary:${colors.reset}`)
  for (const [type, count] of Object.entries(summary)) {
    console.log(`  ${type}: ${count} items`)
  }
  
  if (previewOnly) {
    console.log(`\n${colors.yellow}This was a preview. Run without --preview to apply changes.${colors.reset}`)
  } else {
    console.log(`\n${colors.green}Advice updates complete!${colors.reset}`)
  }
}

// Check command line arguments
const args = process.argv.slice(2)
const previewMode = args.includes('--preview')

// Run the import
importAdviceUpdates(previewMode).catch(console.error)