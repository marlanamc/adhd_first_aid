import fs from 'fs'
import path from 'path'

async function cleanupProject() {
  console.log('🧹 Cleaning up project folder...')
  console.log('==================================')

  const projectRoot = path.join(__dirname, '..')

  // Files to keep (final/current versions)
  const filesToKeep = [
    'Strategies_ADHDFriendly_valid_icons.csv', // This is our final, working version
    'CLAUDE.md',
    'README.md',
    'SECURITY.md',
    'package.json',
    'package-lock.json',
    'next.config.js',
    'tailwind.config.js',
    'tsconfig.json',
    'eslint.config.mjs',
    'postcss.config.mjs',
    'components.json',
    'next-env.d.ts'
  ]

  // Outdated CSV files to archive
  const csvFilesToArchive = [
    'Strategies_ADHDFriendly_aligned.csv',
    'Strategies_ADHDFriendly_complete_fixed.csv', 
    'Strategies_ADHDFriendly_complete_with_examples.csv',
    'Strategies_ADHDFriendly_final_with_better_icons.csv',
    'Strategies_ADHDFriendly_update.csv',
    'Strategies_ADHDFriendly_update_complete.csv',
    'Strategies_ADHD_Friendly.csv',
    'strategies_7_19_cleaned.csv',
    'strategies_7_19_update.csv',
    'strategies_final_cleaned.csv',
    'strategies_final_markdown.csv'
  ]

  // Outdated scripts to archive
  const scriptsToArchive = [
    'extract-headers.js',
    'header-extraction-summary.md',
    'header-mappings.json',
    'update-headers.sql',
    'update-headers.ts',
    'update-strategy-headers.js'
  ]

  // Create archive directory if it doesn't exist
  const archiveDir = path.join(projectRoot, 'archive')
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir)
  }

  // Create CSV archive subdirectory
  const csvArchiveDir = path.join(archiveDir, 'csv-versions')
  if (!fs.existsSync(csvArchiveDir)) {
    fs.mkdirSync(csvArchiveDir)
    console.log('📁 Created CSV archive directory')
  }

  // Create scripts archive subdirectory  
  const scriptsArchiveDir = path.join(archiveDir, 'old-scripts')
  if (!fs.existsSync(scriptsArchiveDir)) {
    fs.mkdirSync(scriptsArchiveDir)
    console.log('📁 Created scripts archive directory')
  }

  let archivedCount = 0

  // Archive outdated CSV files
  console.log('\n📦 Archiving outdated CSV files...')
  for (const csvFile of csvFilesToArchive) {
    const sourcePath = path.join(projectRoot, csvFile)
    const targetPath = path.join(csvArchiveDir, csvFile)
    
    if (fs.existsSync(sourcePath)) {
      fs.renameSync(sourcePath, targetPath)
      console.log(`📦 Archived: ${csvFile}`)
      archivedCount++
    }
  }

  // Archive outdated scripts
  console.log('\n📦 Archiving outdated scripts...')
  for (const scriptFile of scriptsToArchive) {
    const sourcePath = path.join(projectRoot, scriptFile)
    const targetPath = path.join(scriptsArchiveDir, scriptFile)
    
    if (fs.existsSync(sourcePath)) {
      fs.renameSync(sourcePath, targetPath)
      console.log(`📦 Archived: ${scriptFile}`)
      archivedCount++
    }
  }

  // Clean up scripts directory - archive old scripts
  const scriptsDir = path.join(projectRoot, 'scripts')
  const scriptsToKeep = [
    'fresh-database-import.ts',
    'validate-and-fix-icons.ts',
    'align-descriptions-and-examples.ts',
    'database'
  ]

  console.log('\n🧹 Cleaning scripts directory...')
  const scriptFiles = fs.readdirSync(scriptsDir)
  for (const file of scriptFiles) {
    if (!scriptsToKeep.includes(file) && !file.endsWith('.ts') || 
        (file.endsWith('.ts') && !scriptsToKeep.includes(file))) {
      const filePath = path.join(scriptsDir, file)
      const stats = fs.statSync(filePath)
      
      if (stats.isFile()) {
        const targetPath = path.join(scriptsArchiveDir, file)
        fs.renameSync(filePath, targetPath)
        console.log(`📦 Archived script: ${file}`)
        archivedCount++
      }
    }
  }

  // Create a README for the archive
  const archiveReadme = `# Archive Directory

This directory contains older versions of files that were used during development but are no longer needed for the current application.

## CSV Versions (/csv-versions)
- Various iterations of the strategies CSV file during development
- The current working version is: \`Strategies_ADHDFriendly_valid_icons.csv\` (in project root)

## Old Scripts (/old-scripts)  
- Development scripts used for data processing and migration
- Current working scripts are in the \`/scripts\` directory

## Archive (/archive)
- Original files from earlier development phases
- Legacy code and data files

**Note**: These files are kept for reference but are not used by the current application.
`

  fs.writeFileSync(path.join(archiveDir, 'README.md'), archiveReadme)

  console.log('\n🎉 Project cleanup completed!')
  console.log(`📦 Archived ${archivedCount} files`)
  console.log(`📁 Current working CSV: Strategies_ADHDFriendly_valid_icons.csv`)
  console.log(`🗂️ All archived files moved to /archive subdirectories`)
  
  console.log('\n📋 Project structure is now clean and organized:')
  console.log('  ✅ One working CSV file in root')
  console.log('  ✅ Essential scripts only in /scripts')
  console.log('  ✅ All old versions archived with documentation')
  console.log('  ✅ Project ready for production')
}

cleanupProject().catch(console.error)