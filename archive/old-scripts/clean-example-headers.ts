import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify'

async function cleanExampleHeaders() {
  console.log('🧹 Cleaning example headers in CSV...')
  console.log('=====================================')

  const inputFile = path.join(__dirname, '..', 'strategies_final_fixed.csv')
  const outputFile = path.join(__dirname, '..', 'strategies_final_cleaned.csv')

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

  let cleanedCount = 0

  // Clean each strategy's example column
  for (const strategy of strategies) {
    if (strategy.example && strategy.example.trim()) {
      const originalExample = strategy.example

      // Remove the ### 💡 Real-Life Example headers and similar patterns
      let cleanedExample = originalExample
        .replace(/### 💡 Real-Life Example[^\n]*\n?/g, '')
        .replace(/### 💡 Example[^\n]*\n?/g, '')
        .replace(/### 💡[^\n]*\n?/g, '')
        .replace(/### 🔍 Real-Life Example[^\n]*\n?/g, '')
        .replace(/### 🔍 Example[^\n]*\n?/g, '')
        .replace(/### 🔍[^\n]*\n?/g, '')
        .replace(/### ✨ Real-Life Example[^\n]*\n?/g, '')
        .replace(/### ✨ Example[^\n]*\n?/g, '')
        .replace(/### ✨[^\n]*\n?/g, '')
        .replace(/### 🎯 Real-Life Example[^\n]*\n?/g, '')
        .replace(/### 🎯 Example[^\n]*\n?/g, '')
        .replace(/### 🎯[^\n]*\n?/g, '')
        // Clean up any other ### headers that aren't ## (level 2)
        .replace(/### [^\n]*Real-Life Example[^\n]*\n?/gi, '')
        .replace(/### [^\n]*Example[^\n]*\n?/gi, '')
        // Clean up multiple consecutive newlines
        .replace(/\n\n\n+/g, '\n\n')
        // Clean up leading/trailing whitespace
        .trim()

      // Only update if something changed
      if (cleanedExample !== originalExample) {
        strategy.example = cleanedExample
        cleanedCount++
        console.log(`✅ Cleaned: ${strategy.Name}`)
      }
    }
  }

  // Write the cleaned CSV
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

  console.log('\n🎉 Example header cleanup completed!')
  console.log(`✅ Cleaned ${cleanedCount} strategy examples`)
  console.log(`📁 Output saved to: strategies_final_cleaned.csv`)
  console.log('\n📝 Changes made:')
  console.log('  • Removed ### 💡 Real-Life Example headers')
  console.log('  • Kept existing ## [emoji] Example headers')
  console.log('  • Cleaned up extra whitespace')
}

cleanExampleHeaders().catch(console.error)