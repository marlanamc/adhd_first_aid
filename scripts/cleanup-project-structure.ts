#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'

const DRY_RUN = process.argv.includes('--dry-run')

console.log(`🧹 Project Cleanup Script ${DRY_RUN ? '(DRY RUN)' : '(LIVE)'}\n`)

// Categories for organizing scripts
const SCRIPT_CATEGORIES = {
  'archive/scripts/validation': [
    'fast-barrier-validator.ts',
    'batch-barrier-validator.ts',
    'universal-content-validator.ts',
    'validate-icons-and-multiword-italics.ts',
    'validate-and-fix-icons.ts',
  ],
  'archive/scripts/content-fixes': [
    /^fix-.*\.ts$/,
    /^add-.*\.ts$/,
    /^update-.*\.ts$/,
    /^enhance-.*\.ts$/,
    /^improve-.*\.ts$/,
    /^bold-.*\.ts$/,
    /^remove-.*\.ts$/,
    /^replace-.*\.ts$/,
  ],
  'archive/scripts/analysis': [
    /^analyze-.*\.ts$/,
    /^check-.*\.ts$/,
    /^debug-.*\.ts$/,
    /^get-.*\.ts$/,
    /^find-.*\.ts$/,
    /^search-.*\.ts$/,
  ],
  'archive/scripts/imports': [
    /^import-.*\.ts$/,
    /^migrate-.*\.ts$/,
    /^process-.*\.ts$/,
    /^create-.*\.ts$/,
    /^complete-.*\.ts$/,
    /^run-.*\.ts$/,
    /^simple-.*\.ts$/,
    /^standardize-.*\.ts$/,
  ],
  'archive/scripts/one-time-fixes': [
    // All remaining fix scripts that have been run
    'clarify-energy-scale.ts',
    'clean-up-energy-bullets.ts',
    'clean-up-step3.ts',
    'clean-up-subtitles.ts',
    'condense-first-bullet.ts',
    'condense-start-barrier-to-5-steps.ts',
    'delete-corrupted-wired-sources.ts',
    'direct-identity-import.ts',
    'direct-raw-update.ts',
    'direct-raw-update-step2.ts',
    'direct-raw-update-step3.ts',
    'elaborate-modulation-wired.ts',
    'elaborate-ultradian-rhythms.ts',
    'expand-pomodoro-technique-stuck.ts',
    'expand-schedule-it-stuck.ts',
    'final-grade-check.ts',
    'force-update-i-already-failed-step1.ts',
    'force-update-i-already-failed-step2.ts',
    'force-update-i-already-failed-step3.ts',
    'force-update-steps-4-5-bold.ts',
    'implement-all-energy-enhancements.ts',
    'implement-cant-start-fixes.ts',
    'inspect-raw-content.ts',
    'investigate-budgeting-issue.ts',
    'move-no-judgment-to-end-stuck.ts',
    'redistribute-bullets-step1-to-4.ts',
    'reorder-steps-logical-flow.ts',
    'rephrase-sit-still-wired.ts',
    'restore-years-to-sources.ts',
    'revert-adhd-reasons-to-5.ts',
    'test-current-step1-content.ts',
    'test-fixed-slug.ts',
    'trauma-informed-restructure.ts',
    'verify-scattered-bolding.ts',
    'verify-step1-update.ts',
    'verify-hygiene-changes.ts',
  ],
  'archive/scripts/docs': [
    'README-fast-validation.md',
    'adhd-content-editor-agent-prompt.md',
    'enhanced-adhd-content-editor-agent-prompt.md',
  ],
}

// Files to keep in root scripts directory
const KEEP_IN_SCRIPTS = [
  'import-data.ts',  // Main import script
  'cleanup-project-structure.ts',  // This script
  'test-url-conversion.ts',  // Active testing script
  'compare-files-vs-db.ts',  // Useful utility
  'cleanup-duplicates.ts',  // Useful utility
]

// Files/directories to archive from root
const ROOT_FILES_TO_ARCHIVE = [
  'Strategies_ADHDFriendly_valid_icons.csv',  // Old CSV
  'Formatted_ADHD_Source_Bibliography.csv',    // Old CSV
  'Content_Index.csv',                         // Old CSV
  'advice_updates.md',                         // Old documentation
  'feeling_pages_info.md',                      // Old documentation
  'updated_Summary.md',                        // Old documentation
  'barrier_recommendations.md',                // Old documentation
  'cheatsheet.md',                            // Old documentation
]

// Main cleanup function
async function cleanupScripts() {
  const scriptsDir = path.join(process.cwd(), 'scripts')
  const files = fs.readdirSync(scriptsDir)
  
  let movedCount = 0
  let keptCount = 0
  
  for (const file of files) {
    const filePath = path.join(scriptsDir, file)
    
    // Skip directories
    if (fs.statSync(filePath).isDirectory()) {
      continue
    }
    
    // Keep essential scripts
    if (KEEP_IN_SCRIPTS.includes(file)) {
      console.log(`✅ Keeping: ${file}`)
      keptCount++
      continue
    }
    
    // Find category for this file
    let moved = false
    for (const [category, patterns] of Object.entries(SCRIPT_CATEGORIES)) {
      const matches = patterns.some(pattern => {
        if (typeof pattern === 'string') {
          return file === pattern
        }
        return pattern.test(file)
      })
      
      if (matches) {
        const targetDir = path.join(process.cwd(), category)
        const targetPath = path.join(targetDir, file)
        
        if (!DRY_RUN) {
          // Create directory if it doesn't exist
          fs.mkdirSync(targetDir, { recursive: true })
          // Move file
          fs.renameSync(filePath, targetPath)
        }
        
        console.log(`📦 Moving ${file} → ${category}/`)
        movedCount++
        moved = true
        break
      }
    }
    
    // If no category matched, move to general archive
    if (!moved) {
      const targetDir = path.join(process.cwd(), 'archive/scripts/misc')
      const targetPath = path.join(targetDir, file)
      
      if (!DRY_RUN) {
        fs.mkdirSync(targetDir, { recursive: true })
        fs.renameSync(filePath, targetPath)
      }
      
      console.log(`📦 Moving ${file} → archive/scripts/misc/`)
      movedCount++
    }
  }
  
  console.log(`\n📊 Scripts Summary:`)
  console.log(`   Kept: ${keptCount}`)
  console.log(`   Moved: ${movedCount}`)
}

async function cleanupRootFiles() {
  console.log(`\n🗂️  Cleaning up root directory files...\n`)
  
  let archivedCount = 0
  
  for (const file of ROOT_FILES_TO_ARCHIVE) {
    const sourcePath = path.join(process.cwd(), file)
    
    if (fs.existsSync(sourcePath)) {
      const targetDir = path.join(process.cwd(), 'archive/docs')
      const targetPath = path.join(targetDir, file)
      
      if (!DRY_RUN) {
        fs.mkdirSync(targetDir, { recursive: true })
        fs.renameSync(sourcePath, targetPath)
      }
      
      console.log(`📦 Moving ${file} → archive/docs/`)
      archivedCount++
    }
  }
  
  console.log(`\n📊 Root Files Summary:`)
  console.log(`   Archived: ${archivedCount}`)
}

async function createArchiveReadme() {
  const readmeContent = `# Archive Directory

This directory contains files that are no longer actively used but are kept for reference.

## Structure

- **csv-versions/** - Historical CSV data files
- **old-scripts/** - Deprecated scripts
- **scripts/** - Organized one-time scripts
  - **validation/** - Content validation scripts
  - **content-fixes/** - Content fixing scripts that have been run
  - **analysis/** - Analysis and debugging scripts
  - **imports/** - Data import scripts
  - **one-time-fixes/** - Specific one-time fixes
  - **docs/** - Script documentation
  - **misc/** - Miscellaneous scripts
- **docs/** - Old documentation files

## Note

These files are preserved for historical reference and should not be modified.
Most scripts in here have already been run and their changes are in the database.

Last organized: ${new Date().toISOString().split('T')[0]}
`

  const readmePath = path.join(process.cwd(), 'archive/README.md')
  
  if (!DRY_RUN) {
    fs.writeFileSync(readmePath, readmeContent)
  }
  
  console.log(`\n📝 Created archive/README.md`)
}

// Main execution
async function main() {
  console.log('Starting cleanup...\n')
  
  await cleanupScripts()
  await cleanupRootFiles()
  await createArchiveReadme()
  
  console.log(`\n✨ Cleanup complete!`)
  
  if (DRY_RUN) {
    console.log('\n⚠️  This was a dry run. Run without --dry-run to actually move files.')
  }
}

main().catch(console.error)