import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify'

async function alignDescriptionsAndExamples() {
  console.log('🔄 Aligning descriptions and examples from different CSV files...')
  console.log('===============================================================')

  // File paths
  const descriptionsFile = path.join(__dirname, '..', 'Strategies_ADHDFriendly_complete_fixed.csv')
  const examplesFile = path.join(__dirname, '..', 'Strategies_ADHDFriendly_update.csv')
  const outputFile = path.join(__dirname, '..', 'Strategies_ADHDFriendly_aligned.csv')

  // Read descriptions CSV
  console.log('📖 Reading descriptions from complete file...')
  const descriptionsContent = fs.readFileSync(descriptionsFile, 'utf-8')
  const descriptionsParser = parse(descriptionsContent, {
    columns: (headers: string[]) => headers.map(h => h.trim().replace(/^\ufeff/, '')),
    skip_empty_lines: true,
    trim: true
  })

  const descriptionsData: any[] = []
  for await (const record of descriptionsParser) {
    descriptionsData.push(record)
  }

  // Read examples CSV
  console.log('📖 Reading examples from update file...')
  const examplesContent = fs.readFileSync(examplesFile, 'utf-8')
  const examplesParser = parse(examplesContent, {
    columns: (headers: string[]) => headers.map(h => h.trim().replace(/^\ufeff/, '')),
    skip_empty_lines: true,
    trim: true
  })

  const examplesData: any[] = []
  for await (const record of examplesParser) {
    examplesData.push(record)
  }

  console.log(`📊 Found ${descriptionsData.length} strategies with descriptions`)
  console.log(`📊 Found ${examplesData.length} strategies with examples`)

  // Create lookup maps by strategy name
  const descriptionsMap = new Map()
  descriptionsData.forEach(strategy => {
    if (strategy.Name) {
      descriptionsMap.set(strategy.Name.trim(), strategy)
    }
  })

  const examplesMap = new Map()
  examplesData.forEach(strategy => {
    if (strategy.Name) {
      examplesMap.set(strategy.Name.trim(), strategy)
    }
  })

  // Combine data - use descriptions as base, add examples where they match
  const alignedData: any[] = []
  let alignedCount = 0
  let missingExamples = 0
  let mismatchedNames: string[] = []

  for (const strategy of descriptionsData) {
    const strategyName = strategy.Name?.trim()
    if (!strategyName) continue

    // Start with the description strategy as base
    const alignedStrategy = { ...strategy }

    // Try to find matching example
    const exampleStrategy = examplesMap.get(strategyName)
    if (exampleStrategy) {
      // Replace example with the one from update file, fix bullet points
      let updatedExample = exampleStrategy.example || ''
      if (updatedExample) {
        updatedExample = updatedExample
          .replace(/•\s+/g, '- ') // Convert • to markdown bullets
          .replace(/^\s*•\s+/gm, '- ') // Handle bullets at start of lines
      }
      alignedStrategy.example = updatedExample
      alignedCount++
    } else {
      console.log(`⚠️  No example found for: "${strategyName}"`)
      missingExamples++
    }

    alignedData.push(alignedStrategy)
  }

  // Check for examples that don't have matching descriptions
  for (const [exampleName] of examplesMap) {
    if (!descriptionsMap.has(exampleName)) {
      mismatchedNames.push(exampleName)
    }
  }

  // Write the aligned CSV
  console.log('💾 Writing aligned CSV...')
  const stringifier = stringify({
    header: true,
    columns: Object.keys(alignedData[0])
  })

  const outputStream = fs.createWriteStream(outputFile)
  stringifier.pipe(outputStream)

  for (const strategy of alignedData) {
    stringifier.write(strategy)
  }
  stringifier.end()

  await new Promise((resolve) => {
    outputStream.on('finish', resolve)
  })

  console.log('\n🎉 Alignment completed!')
  console.log(`✅ Successfully aligned: ${alignedCount} strategies`)
  console.log(`⚠️  Missing examples: ${missingExamples} strategies`)
  console.log(`📁 Output saved to: Strategies_ADHDFriendly_aligned.csv`)

  if (mismatchedNames.length > 0) {
    console.log(`\n🔍 Examples found but no matching descriptions:`)
    mismatchedNames.forEach(name => console.log(`  - "${name}"`))
  }

  console.log('\n📝 Changes made:')
  console.log('  • Used descriptions from complete file')
  console.log('  • Used examples from update file')
  console.log('  • Fixed bullet points in examples (• → -)')
  console.log('  • Aligned by strategy name matching')
}

alignDescriptionsAndExamples().catch(console.error)