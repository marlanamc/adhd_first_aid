import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify'

async function fixMarkdownBullets() {
  console.log('🔧 Converting bullet characters to markdown list syntax...')
  console.log('======================================================')

  const inputFile = path.join(__dirname, '..', 'strategies_final_cleaned.csv')
  const outputFile = path.join(__dirname, '..', 'strategies_final_markdown.csv')

  // Read the CSV file
  const fileContent = fs.readFileSync(inputFile, 'utf-8')

  const parser = parse(fileContent, {
    columns: (headers: string[]) => headers.map(h => h.trim()),
    skip_empty_lines: true,
    trim: true
  })

  const strategies: any[] = []
  for await (const record of parser) {
    strategies.push(record)
  }

  console.log(`📊 Processing ${strategies.length} strategies...`)

  let fixedCount = 0

  // Fix each strategy's description and example fields
  for (const strategy of strategies) {
    let wasFixed = false

    // Fix description field
    if (strategy.description && strategy.description.trim()) {
      const originalDescription = strategy.description
      const fixedDescription = originalDescription
        .replace(/•\s+/g, '- ') // Convert • to markdown bullets
        .replace(/^\s*•\s+/gm, '- ') // Handle bullets at start of lines

      if (fixedDescription !== originalDescription) {
        strategy.description = fixedDescription
        wasFixed = true
      }
    }

    // Fix example field  
    if (strategy.example && strategy.example.trim()) {
      const originalExample = strategy.example
      const fixedExample = originalExample
        .replace(/•\s+/g, '- ') // Convert • to markdown bullets
        .replace(/^\s*•\s+/gm, '- ') // Handle bullets at start of lines

      if (fixedExample !== originalExample) {
        strategy.example = fixedExample
        wasFixed = true
      }
    }

    if (wasFixed) {
      fixedCount++
      console.log(`✅ Fixed: ${strategy.Name}`)
    }
  }

  // Write the fixed CSV
  const stringifier = stringify({
    header: true,
    columns: Object.keys(strategies[0])
  })

  const outputStream = fs.createWriteStream(outputFile)
  stringifier.pipe(outputStream)

  for (const strategy of strategies) {
    stringifier.write(strategy)
  }
  stringifier.end()

  await new Promise((resolve) => {
    outputStream.on('finish', resolve)
  })

  console.log('\n🎉 Markdown bullet fix completed!')
  console.log(`✅ Fixed ${fixedCount} strategies`)
  console.log(`📁 Output saved to: strategies_final_markdown.csv`)
  console.log('\n📝 Changes made:')
  console.log('  • Converted • to - for proper markdown lists')
  console.log('  • Fixed both description and example fields')
  console.log('  • ReactMarkdown should now render bullets correctly')
}

fixMarkdownBullets().catch(console.error)