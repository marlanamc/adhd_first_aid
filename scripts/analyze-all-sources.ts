import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

interface SourceItem {
  file: string
  type: 'feeling' | 'barrier'
  category: string
  title: string
  authors: string
  description: string
}

interface UniqueSource {
  title: string
  authors: string
  appearances: {
    file: string
    type: 'feeling' | 'barrier'
    category: string
  }[]
}

function parseFeelingSources(content: string, filename: string): SourceItem[] {
  const sources: SourceItem[] = []
  const lines = content.split('\n')
  
  let currentCategory = ''
  let i = 0
  
  while (i < lines.length) {
    const line = lines[i].trim()
    
    if (!line || line.startsWith('# 📚 Sources') || line === '---' || 
        line.startsWith('Explore the books') || line.startsWith('Let me know if')) {
      i++
      continue
    }
    
    // Detect category headers
    if (line.startsWith('##')) {
      currentCategory = line.replace(/^##\s*/, '').replace(/^[^\s]+\s*/, '').trim()
      if (currentCategory.includes('###')) {
        currentCategory = currentCategory.split('###')[0].trim()
      }
      i++
      continue
    }
    
    if (line.startsWith('###')) {
      i++
      continue
    }
    
    // Detect book entries
    if (line.startsWith('- **') && line.includes('**')) {
      let title = ''
      let authors = ''
      
      // Multiple patterns for extracting title and author
      if (line.includes('– _') && line.includes('_')) {
        const match = line.match(/\*\*(.*?)\*\*\s*–\s*_([^_]+)_/)
        if (match) {
          title = match[1]
          authors = match[2]
        }
      } else if (line.includes(' by ')) {
        const match = line.match(/\*\*(.*?)\*\*.*?by\s+(.+)/)
        if (match) {
          title = match[1]
          authors = match[2].replace(/[_–]/g, '').trim()
        }
      } else if (line.includes('–')) {
        const match = line.match(/\*\*(.*?)\*\*\s*–\s*(.+)/)
        if (match) {
          title = match[1]
          authors = match[2].replace(/[_]/g, '').trim()
        }
      } else {
        const match = line.match(/\*\*(.*?)\*\*/)
        if (match) {
          title = match[1]
          authors = ''
        }
      }
      
      if (title) {
        let description = ''
        let j = i + 1
        
        while (j < lines.length) {
          const nextLine = lines[j].trim()
          if (!nextLine || nextLine.startsWith('- **') || nextLine.startsWith('##') || 
              nextLine.startsWith('###') || nextLine === '---' || nextLine.startsWith('Let me know if')) {
            break
          }
          if (description) {
            description += ' ' + nextLine
          } else {
            description = nextLine
          }
          j++
        }
        
        description = description.replace(/^\s*/, '').replace(/\*\*/g, '').replace(/_/g, '').trim()
        
        if (currentCategory && title) {
          sources.push({
            file: filename,
            type: 'feeling',
            category: currentCategory,
            title: title.trim(),
            authors: authors.trim(),
            description: description
          })
        }
        
        i = j - 1
      }
    }
    
    i++
  }
  
  return sources
}

function parseBarrierSources(content: string, filename: string): SourceItem[] {
  const sources: SourceItem[] = []
  const lines = content.split('\n')
  
  let currentCategory = ''
  let i = 0
  
  while (i < lines.length) {
    const line = lines[i].trim()
    
    if (!line || line.startsWith('## 📚 Sources') || line === '---' || 
        line.startsWith('Explore the books') || line.startsWith('Let me know if')) {
      i++
      continue
    }
    
    // Detect category headers
    if (line.startsWith('###') || line.startsWith('##')) {
      currentCategory = line.replace(/^###?\s*/, '').replace(/^[^\s]+\s*/, '').trim()
      i++
      continue
    }
    
    // Detect book entries
    if (line.startsWith('- ')) {
      let title = ''
      let authors = ''
      
      // Multiple patterns specific to barriers
      const barrierPattern = line.match(/\*\*([^.]+)\.\*\*\s*_([^_]+)_/)
      if (barrierPattern) {
        authors = barrierPattern[1].trim()
        title = barrierPattern[2].trim()
        const yearMatch = line.match(/_[^_]+_\s*\((\d{4})\)/)
        if (yearMatch) {
          title += ` (${yearMatch[1]})`
        }
      } else if (line.includes('**') && line.includes('–') && line.includes('_')) {
        const altPattern1 = line.match(/\*\*([^–]+)–\s*_([^_]+)_\*\*/)
        if (altPattern1) {
          authors = altPattern1[1].trim()
          title = altPattern1[2].trim()
        } else {
          const standardPattern = line.match(/\*\*([^*]+)\*\*\s*–\s*_([^_]+)_/)
          if (standardPattern) {
            authors = standardPattern[1].trim()
            title = standardPattern[2].trim()
          }
        }
      } else if (line.startsWith('- _') && line.includes('–')) {
        const altPattern2 = line.match(/-\s*_([^_]+)_\s*–\s*(.+)/)
        if (altPattern2) {
          title = altPattern2[1].trim()
          authors = altPattern2[2].trim()
        }
      } else if (line.includes(' by ')) {
        const byPattern = line.match(/\*\*(.*?)\*\*.*?by\s+(.+)/)
        if (byPattern) {
          title = byPattern[1]
          authors = byPattern[2].replace(/[_–]/g, '').trim()
        }
      } else if (line.includes('**')) {
        const titleMatch = line.match(/\*\*(.*?)\*\*/)
        if (titleMatch) {
          title = titleMatch[1]
          authors = ''
        }
      }
      
      if (title) {
        let description = ''
        let j = i + 1
        
        while (j < lines.length) {
          const nextLine = lines[j].trim()
          if (!nextLine || nextLine.startsWith('- **') || nextLine.startsWith('###') || 
              nextLine === '---' || nextLine.startsWith('Let me know if')) {
            break
          }
          if (description) {
            description += ' ' + nextLine
          } else {
            description = nextLine
          }
          j++
        }
        
        description = description.replace(/^\s*/, '').replace(/\*\*/g, '').replace(/_/g, '').trim()
        
        if (currentCategory && title) {
          sources.push({
            file: filename,
            type: 'barrier',
            category: currentCategory,
            title: title.trim(),
            authors: authors.trim(),
            description: description
          })
        }
        
        i = j - 1
      }
    }
    
    i++
  }
  
  return sources
}

async function analyzeAllSources() {
  console.log('🔍 Analyzing all sources for duplicates and standardization...\n')
  
  const allSources: SourceItem[] = []
  
  // Process feelings sources
  const feelingsDir = join(process.cwd(), 'feelings_sources')
  const feelingFiles = readdirSync(feelingsDir).filter(file => 
    file.endsWith('.md') && file !== 'Feelings_Sources.md'
  )
  
  console.log(`📁 Processing ${feelingFiles.length} feeling source files...`)
  for (const file of feelingFiles) {
    const content = readFileSync(join(feelingsDir, file), 'utf-8')
    const sources = parseFeelingSources(content, file)
    allSources.push(...sources)
  }
  
  // Process barriers sources
  const barriersDir = join(process.cwd(), 'barriers_sources')
  const barrierFiles = readdirSync(barriersDir).filter(file => file.endsWith('.md'))
  
  console.log(`📁 Processing ${barrierFiles.length} barrier source files...\n`)
  for (const file of barrierFiles) {
    const content = readFileSync(join(barriersDir, file), 'utf-8')
    const sources = parseBarrierSources(content, file)
    allSources.push(...sources)
  }
  
  // Group by unique title + author combination
  const uniqueSources = new Map<string, UniqueSource>()
  
  for (const source of allSources) {
    const key = `${source.title}|||${source.authors}`.toLowerCase()
    
    if (!uniqueSources.has(key)) {
      uniqueSources.set(key, {
        title: source.title,
        authors: source.authors,
        appearances: []
      })
    }
    
    uniqueSources.get(key)!.appearances.push({
      file: source.file,
      type: source.type,
      category: source.category
    })
  }
  
  // Convert to array and sort by frequency
  const sourceArray = Array.from(uniqueSources.values())
    .sort((a, b) => b.appearances.length - a.appearances.length)
  
  // Print analysis
  console.log('=' .repeat(80))
  console.log('📊 SOURCE ANALYSIS RESULTS')
  console.log('=' .repeat(80))
  console.log(`\n📚 Total source entries: ${allSources.length}`)
  console.log(`✨ Unique sources: ${sourceArray.length}`)
  console.log(`🔄 Duplicate sources: ${sourceArray.filter(s => s.appearances.length > 1).length}`)
  
  // Show sources that appear multiple times
  console.log('\n🔄 SOURCES APPEARING MULTIPLE TIMES:')
  console.log('-' .repeat(80))
  
  let duplicateCount = 0
  for (const source of sourceArray) {
    if (source.appearances.length > 1) {
      duplicateCount++
      console.log(`\n${duplicateCount}. "${source.title}" by ${source.authors || '(no author)'}`)
      console.log(`   Appears ${source.appearances.length} times in:`)
      
      // Group by type
      const byType = source.appearances.reduce((acc, app) => {
        if (!acc[app.type]) acc[app.type] = []
        acc[app.type].push(app)
        return acc
      }, {} as Record<string, typeof source.appearances>)
      
      for (const [type, apps] of Object.entries(byType)) {
        console.log(`   ${type === 'feeling' ? '❤️' : '🚧'} ${type}s:`)
        for (const app of apps) {
          console.log(`      - ${app.file} (${app.category})`)
        }
      }
    }
  }
  
  // Category analysis
  console.log('\n📊 CATEGORIES ANALYSIS:')
  console.log('-' .repeat(80))
  
  const categories = new Set<string>()
  allSources.forEach(s => categories.add(s.category))
  
  console.log(`\nUnique categories found: ${categories.size}`)
  console.log('\nCategories:')
  Array.from(categories).sort().forEach(cat => {
    const count = allSources.filter(s => s.category === cat).length
    console.log(`  - ${cat} (${count} sources)`)
  })
  
  // Export standardized sources
  console.log('\n💾 Exporting standardized sources list...')
  
  const standardizedSources = sourceArray.map((source, index) => ({
    id: index + 1,
    title: source.title,
    authors: source.authors,
    used_in_feelings: source.appearances.filter(a => a.type === 'feeling').map(a => a.file.replace('.md', '')),
    used_in_barriers: source.appearances.filter(a => a.type === 'barrier').map(a => a.file.replace('.md', '')),
    categories: [...new Set(source.appearances.map(a => a.category))]
  }))
  
  // Write to file
  const output = JSON.stringify(standardizedSources, null, 2)
  const fs = await import('fs')
  fs.writeFileSync(join(process.cwd(), 'scripts/standardized-sources.json'), output)
  
  console.log(`\n✅ Exported ${standardizedSources.length} unique sources to scripts/standardized-sources.json`)
  
  // Summary
  console.log('\n📈 FINAL SUMMARY:')
  console.log('=' .repeat(80))
  console.log(`Total unique sources: ${sourceArray.length}`)
  console.log(`Sources appearing only once: ${sourceArray.filter(s => s.appearances.length === 1).length}`)
  console.log(`Sources appearing 2+ times: ${sourceArray.filter(s => s.appearances.length >= 2).length}`)
  console.log(`Sources appearing 3+ times: ${sourceArray.filter(s => s.appearances.length >= 3).length}`)
  console.log(`Maximum appearances: ${Math.max(...sourceArray.map(s => s.appearances.length))} times`)
}

// Run the analysis
analyzeAllSources()