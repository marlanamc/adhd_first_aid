#!/usr/bin/env tsx
/*
  Comprehensive ADHD Reasons Audit Script
  Detects:
  - Repeated emoji usage across different items
  - Typos and spelling errors
  - Formatting inconsistencies
  - Duplicate content
  - Nonsensical phrases
  - Missing or malformed structure
*/

import { getAllTasksContent, getAllComplexLoopsContent, supabase } from '@/lib/supabase'
import * as fs from 'fs'
import * as path from 'path'

interface Issue {
  table: 'tasks_content' | 'complex_loops_content'
  item_name: string
  issue_type: string
  description: string
  location: string
  original_text: string
  suggested_fix?: string
  severity: 'high' | 'medium' | 'low'
}

class ADHDReasonsAuditor {
  private issues: Issue[] = []
  private emojiUsageMap = new Map<string, { locations: Set<string>, count: number }>()
  private allContent: { table: 'tasks_content'|'complex_loops_content', id: string, name: string, reasons: string[] }[] = []
  private wrote: { table: 'tasks_content'|'complex_loops_content', name: string, changes: number }[] = []
  private WRITE = process.argv.includes('--write')
  
  async audit() {
    console.log('🔍 Starting Comprehensive ADHD Reasons Audit...\n')
    
    // Collect all content first
    await this.collectAllContent()
    
    // Run various checks
    this.checkTyposAndSpelling()
    this.checkFormattingConsistency()
    this.checkDuplicateContent()
    this.checkStructuralIssues()
    this.checkNonsensicalPhrases()
    
    // Optional autofix pass
    if (this.WRITE) {
      await this.autofixAll()
    }

    // Generate report
    this.generateReport()
  }

  // ---------- Autofix ----------
  private headingEmojiFor(text: string): string {
    const t = text.toLowerCase()
    if (t.includes('executive')) return '🧩'
    if (t.includes('working memory')) return '🧠'
    if (t.includes('time') || t.includes('deadline') || t.includes('late')) return '⏰'
    if (t.includes('attention') || t.includes('focus')) return '🎯'
    if (t.includes('motivation') || t.includes('urgency')) return '🔥'
    if (t.includes('shame') || t.includes('rsd')) return '😣'
    if (t.includes('dopamine')) return '🧪'
    return '💡'
  }

  private normalizeReasonLine(reason: string): string {
    // Collapse weird spacing and stray asterisks
    let s = reason
      .replace(/\uFFFD+/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\*{3,}/g, '**')
      .trim()
    return s
  }

  private formatWhatsGoingLine(line: string): string {
    // Ensure emoji + **Heading**: description
    let s = this.normalizeReasonLine(line)
    // Extract emoji if present
    const emojiMatch = s.match(/^(\p{Extended_Pictographic})\s+/u)
    let emoji = emojiMatch ? emojiMatch[1] : ''
    if (emojiMatch) s = s.slice(emojiMatch[0].length)
    // Extract bold heading
    const boldMatch = s.match(/^\*\*(.*?)\*\*(?::|：)?\s*(.*)$/)
    if (boldMatch) {
      let heading = boldMatch[1].replace(/\p{Extended_Pictographic}\s*/u, '').trim()
      let rest = (boldMatch[2] || '').trim()
      if (!emoji) emoji = this.headingEmojiFor(heading)
      // Guarantee trailing colon
      heading = heading.replace(/[—–-]+\s*$/, '')
      const formatted = `${emoji} **${heading}**: ${rest}`.trim()
      return formatted
    }
    // Fallback: try split on ':'
    const split = s.split(':')
    if (split.length > 1){
      const heading = split[0].replace(/\p{Extended_Pictographic}\s*/u,'').trim()
      const rest = split.slice(1).join(':').trim()
      if (!emoji) emoji = this.headingEmojiFor(heading)
      return `${emoji} **${heading}**: ${rest}`
    }
    // As last resort, wrap entire line as description under generic heading
    return `${emoji || '💡'} **Insight**: ${s}`
  }

  private formatYouMightLine(line: string): string {
    let s = this.normalizeReasonLine(line)
    // Drop any leading emoji that may have leaked into left column
    s = s.replace(/^\p{Extended_Pictographic}\s+/u, '')
    // Ensure it starts with dash
    if (!/^[-•]\s/.test(s)) s = `- ${s.replace(/^[-•]\s*/, '')}`
    // Fix incomplete sentences by trimming dangling connectors/quotes
    const trimDangling = (t: string) => {
      let out = t.trim()
      // Remove unmatched trailing quotes
      out = out.replace(/["“”']+$/g, '').trim()
      // Iteratively trim trailing connector words
      const connectors = [
        'and','or','but','so','because','than','as','with','without','between','to','for','of','in'
      ]
      let changed = true
      while (changed){
        changed = false
        const m = out.match(/^(.*)\b([a-zA-Z]+)\s*$/)
        if (m){
          const last = m[2].toLowerCase()
          if (connectors.includes(last)){
            out = m[1].trim()
            changed = true
          }
        }
      }
      // Collapse space after dash again
      out = out.replace(/^(-|•)\s*/, (m)=>m+'')
      // Ensure we still keep the dash prefix
      if (!/^[-•]\s/.test(out)) out = '- ' + out
      return out
    }
    s = trimDangling(s)
    return s
  }

  private async autofixAll(){
    console.log('🛠️ Running autofix (common formatting/typos)...')
    for (const item of this.allContent){
      const table = item.table
      const id = item.id
      const name = item.name
      const reasons = [...item.reasons]
      let changed = 0
      // Quick pass for typos and double spaces
      const applyTypos = (s:string)=>{
        const patterns = [
          [/\bsene\b/gi,'sense'],[/\bwont\b/gi,"won't"],[/\bcant\b/gi,"can't"],[/\bdont\b/gi,"don't"],[/\bisnt\b/gi,"isn't"],[/\barent\b/gi,"aren't"],[/\bthe\s+the\b/gi,'the']
        ] as Array<[RegExp,string]>
        let t = s
        for (const [p,r] of patterns){ t = t.replace(p,r) }
        return t.replace(/\s{2,}/g,' ')
      }

      const fixGarbled = (s:string)=> s.replace(/\uFFFD+/g,'').replace(/[^\x00-\x7F]{3,}/g,' ').replace(/\s{2,}/g,' ').trim()

      const replaceNonsense = (s:string)=>{
        const map: Array<[RegExp,string]> = [
          [/brain isn'?t braining/gi, 'brain is overloaded or under-stimulated'],
          [/executive functioning dysfunction/gi, 'executive dysfunction'],
          [/context matters: your brain is adapting; supports help/gi, 'Context matters — external supports reduce load'],
          [/insight: context matters/gi, 'Insight: context and supports help'],
          [/insight: insight/gi, 'Insight: name the pattern and pick one small support']
        ]
        let t = s
        for (const [p, r] of map){ t = t.replace(p, r) }
        return t
      }

      // Find section indices
      let youIdx = reasons.findIndex(r=>/^you might:/i.test(r))
      let realIdx = reasons.findIndex(r=>/here'?s what'?s really going on:/i.test(r))
      if (youIdx === -1 || realIdx === -1){
        const youLines: string[] = []
        const rightLines: string[] = []
        for (const ln of reasons){
          const s = this.normalizeReasonLine(ln)
          if (/^[-•]\s+/.test(s)) youLines.push(s)
          else if (/^\p{Extended_Pictographic}/u.test(s) || /\*\*[^*]+\*\*\s*:/.test(s)) rightLines.push(s)
        }
        if (youLines.length || rightLines.length){
          const rebuilt: string[] = []
          rebuilt.push('You might:')
          for (const y of youLines){ rebuilt.push(this.formatYouMightLine(y)) }
          rebuilt.push("Here's what's really going on:")
          for (const r of rightLines){ rebuilt.push(this.formatWhatsGoingLine(r)) }
          if (rebuilt.length > 2){
            youIdx = 0; realIdx = youLines.length + 1
            for (let i=0;i<rebuilt.length;i++) reasons[i] = rebuilt[i]
            reasons.length = rebuilt.length
            changed++
          }
        }
      }

      // Ensure each section has at least one item; if not, add brief, ADHD-friendly defaults
      const ensureMinimumSections = () => {
        const defaultsYou = [
          '- Avoid starting',
          '- Spend hours researching without deciding'
        ]
        const defaultsRight = [
          '🧩 **Executive dysfunction**: initiation is hard; pick one tiny first step',
          '⏰ **Time blindness**: time feels fuzzy; try a visible 20–30 min timer'
        ]
        let updated = false
        let yIdx = reasons.findIndex(r=>/^you might:/i.test(r))
        let rIdx = reasons.findIndex(r=>/here'?s what'?s really going on:/i.test(r))
        if (yIdx === -1 || rIdx === -1){
          reasons.length = 0
          reasons.push('You might:')
          for (const y of defaultsYou) reasons.push(this.formatYouMightLine(y))
          reasons.push("Here's what's really going on:")
          for (const rt of defaultsRight) reasons.push(this.formatWhatsGoingLine(rt))
          updated = true
        } else {
          const ymCount = reasons.slice(yIdx+1, rIdx).filter(l=>/^[-•]/.test(l)).length
          const wgCount = reasons.slice(rIdx+1).filter(l=>/^\p{Extended_Pictographic}/u.test(l)).length
          if (ymCount === 0){
            reasons.splice(rIdx, 0, ...defaultsYou.map(d=>this.formatYouMightLine(d)))
            updated = true
            // re-index right section
            rIdx += defaultsYou.length
          }
          if (wgCount === 0){
            reasons.push(...defaultsRight.map(d=>this.formatWhatsGoingLine(d)))
            updated = true
          }
        }
        return updated
      }
      if (ensureMinimumSections()) changed++
      if (youIdx !== -1 && realIdx !== -1){
        for (let i=youIdx+1; i<realIdx; i++){
          const before = reasons[i]
          let s = this.formatYouMightLine(before)
          s = applyTypos(s)
          if (s !== before){ reasons[i] = s; changed++ }
        }
        for (let i=realIdx+1; i<reasons.length; i++){
          const before = reasons[i]
          let s = this.formatWhatsGoingLine(before)
          s = applyTypos(s)
          if (s !== before){ reasons[i] = s; changed++ }
        }
        // De-dup within sections
        const dedupe = (arr:string[])=>Array.from(new Set(arr))
        const ym = reasons.slice(youIdx+1, realIdx)
        const wg = reasons.slice(realIdx+1)
        const newYm = dedupe(ym)
        const newWg = dedupe(wg)
        if (newYm.length !== ym.length){ reasons.splice(youIdx+1, ym.length, ...newYm); changed++ }
        if (newWg.length !== wg.length){ reasons.splice(realIdx+1, wg.length, ...newWg); changed++ }
      }

      // Global cleanup (garbled + nonsense) across all lines
      for (let i=0;i<reasons.length;i++){
        const before = reasons[i]
        let s = replaceNonsense(fixGarbled(before))
        if (s !== before){ reasons[i] = s; changed++ }
      }

      if (changed > 0){
        const { error } = await supabase.from(table).update({ adhd_reasons: reasons }).eq('id', id)
        // If name columns aren't available for equality, fallback to id-based update would be safer, but keep textual update here as ad-hoc.
        if (!error){
          this.wrote.push({ table, name, changes: changed })
        }
      }
    }
  }
  
  private async collectAllContent() {
    console.log('📋 Collecting all ADHD reasons content...')
    
    // Collect from tasks_content
    const tasks = await getAllTasksContent()
    if (tasks.data) {
      for (const task of tasks.data) {
        if (task.adhd_reasons && Array.isArray(task.adhd_reasons)) {
          this.allContent.push({
            table: 'tasks_content',
            id: (task as any).id,
            name: task.task_name,
            reasons: task.adhd_reasons
          })
          
          // Track emoji usage
          this.trackEmojiUsage(task.adhd_reasons, task.task_name)
        }
      }
    }
    
    // Collect from complex_loops_content
    const loops = await getAllComplexLoopsContent()
    if (loops.data) {
      for (const loop of loops.data) {
        if (loop.adhd_reasons && Array.isArray(loop.adhd_reasons)) {
          this.allContent.push({
            table: 'complex_loops_content',
            id: (loop as any).id,
            name: loop.loop_name,
            reasons: loop.adhd_reasons
          })
          
          // Track emoji usage
          this.trackEmojiUsage(loop.adhd_reasons, loop.loop_name)
        }
      }
    }
    
    console.log(`✅ Collected ${this.allContent.length} items with ADHD reasons\n`)
  }
  
  private trackEmojiUsage(reasons: string[], itemName: string) {
    const emojiRegex = /\p{Extended_Pictographic}/gu
    
    for (const reason of reasons) {
      const emojis = reason.match(emojiRegex) || []
      for (const emoji of emojis) {
        if (!this.emojiUsageMap.has(emoji)) {
          this.emojiUsageMap.set(emoji, { locations: new Set(), count: 0 })
        }
        const usage = this.emojiUsageMap.get(emoji)!
        usage.locations.add(itemName)
        usage.count++
      }
    }
  }
  
  private checkEmojiDuplicatesPerItem() {
    console.log('🔄 Checking emoji reuse within each page section...')
    for (const item of this.allContent){
      const reasons = item.reasons
      const realIdx = reasons.findIndex(r=>/here'?s what'?s really going on:/i.test(r))
      if (realIdx === -1) continue
      const seen = new Set<string>()
      reasons.forEach((line, idx) => {
        if (idx <= realIdx) return
        const m = line.match(/^(\p{Extended_Pictographic})\s+/u)
        if (!m) return
        const e = m[1]
        if (seen.has(e)){
          this.issues.push({
            table: item.table as any,
            item_name: item.name,
            issue_type: 'emoji_duplicate',
            description: 'Duplicate emoji in "What\'s really going on" section; vary emojis within a page',
            location: `Line ${idx + 1}`,
            original_text: line.substring(0, 100),
            severity: 'low'
          })
        } else {
          seen.add(e)
        }
      })
    }
  }
  
  private checkTyposAndSpelling() {
    console.log('✏️ Checking for typos and spelling errors...')
    
    const typoPatterns = [
      { pattern: /\bsene\b/gi, correct: 'sense' },
      { pattern: /\bwont\b/gi, correct: "won't" },
      { pattern: /\bcant\b/gi, correct: "can't" },
      { pattern: /\bdont\b/gi, correct: "don't" },
      { pattern: /\bisnt\b/gi, correct: "isn't" },
      { pattern: /\barent\b/gi, correct: "aren't" },
      { pattern: /\bwouldnt\b/gi, correct: "wouldn't" },
      { pattern: /\bcouldnt\b/gi, correct: "couldn't" },
      { pattern: /\bshouldnt\b/gi, correct: "shouldn't" },
      { pattern: /\byoure\b/gi, correct: "you're" },
      { pattern: /\btheyre\b/gi, correct: "they're" },
      { pattern: /\bits\b(?!\s+(?:a|an|the|my|your|his|her|their|own))/gi, correct: "it's" },
      { pattern: /\bdidnt\b/gi, correct: "didn't" },
      { pattern: /\bwasnt\b/gi, correct: "wasn't" },
      { pattern: /\bwerent\b/gi, correct: "weren't" },
      { pattern: /\bhasnt\b/gi, correct: "hasn't" },
      { pattern: /\bhavent\b/gi, correct: "haven't" },
      { pattern: /\bhadnt\b/gi, correct: "hadn't" },
      { pattern: /\bthats\b/gi, correct: "that's" },
      { pattern: /\bwhats\b/gi, correct: "what's" },
      { pattern: /\bwheres\b/gi, correct: "where's" },
      { pattern: /\bwhens\b/gi, correct: "when's" },
      { pattern: /\bwhys\b/gi, correct: "why's" },
      { pattern: /\bhows\b/gi, correct: "how's" },
      { pattern: /\bwhos\b/gi, correct: "who's" },
      { pattern: /\btheres\b/gi, correct: "there's" },
      { pattern: /\bheres\b/gi, correct: "here's" },
      { pattern: /(?<!\w)m\s+(?=\w)/gi, correct: "'m " }, // Fix orphaned contractions
      { pattern: /(?<!\w)s\s+(?=\w)/gi, correct: "'s " },
      { pattern: /(?<!\w)t\s+(?=\w)/gi, correct: "'t " },
      { pattern: /(?<!\w)ll\s+(?=\w)/gi, correct: "'ll " },
      { pattern: /(?<!\w)re\s+(?=\w)/gi, correct: "'re " },
      { pattern: /(?<!\w)ve\s+(?=\w)/gi, correct: "'ve " },
      { pattern: /(?<!\w)d\s+(?=\w)/gi, correct: "'d " }
    ]
    
    for (const item of this.allContent) {
      item.reasons.forEach((reason, index) => {
        for (const { pattern, correct } of typoPatterns) {
          if (pattern.test(reason)) {
            this.issues.push({
              table: item.table as any,
              item_name: item.name,
              issue_type: 'typo',
              description: `Missing apostrophe or typo: "${pattern.source}" should be "${correct}"`,
              location: `Line ${index + 1}`,
              original_text: reason.substring(0, 100),
              suggested_fix: reason.replace(pattern, correct),
              severity: 'low'
            })
          }
        }
        
        // Check for double spaces
        if (/\s{2,}/.test(reason)) {
          this.issues.push({
            table: item.table as any,
            item_name: item.name,
            issue_type: 'formatting',
            description: 'Multiple consecutive spaces',
            location: `Line ${index + 1}`,
            original_text: reason.substring(0, 100),
            suggested_fix: reason.replace(/\s{2,}/g, ' '),
            severity: 'low'
          })
        }
      })
    }
  }
  
  private checkFormattingConsistency() {
    console.log('📐 Checking formatting consistency...')
    
    for (const item of this.allContent) {
      let hasYouMight = false
      let hasWhatsGoing = false
      let youMightIndex = -1
      let whatsGoingIndex = -1
      
      item.reasons.forEach((reason, index) => {
        // Check for section markers
        if (/^you might:/i.test(reason)) {
          hasYouMight = true
          youMightIndex = index
        }
        if (/here'?s what'?s really going on:/i.test(reason)) {
          hasWhatsGoing = true
          whatsGoingIndex = index
        }
        
        // Check formatting for actual content lines
        if (!reason.includes('You might:') && !reason.includes("Here's what's really going on:")) {
          // Check if it's in "What's really going on" section
          if (whatsGoingIndex > -1 && index > whatsGoingIndex) {
            // Should have emoji and bold formatting
            const hasEmoji = /^\p{Extended_Pictographic}/u.test(reason)
            const hasBold = /\*\*[^*]+\*\*/.test(reason)
            const hasColon = reason.includes(':')
            
            if (!hasEmoji && reason.length > 20) {
              this.issues.push({
                table: item.table as any,
                item_name: item.name,
                issue_type: 'formatting',
                description: 'Missing emoji at start of "What\'s really going on" item',
                location: `Line ${index + 1}`,
                original_text: reason.substring(0, 100),
                severity: 'medium'
              })
            }
            
            if (!hasBold && hasColon && reason.length > 20) {
              this.issues.push({
                table: item.table as any,
                item_name: item.name,
                issue_type: 'formatting',
                description: 'Missing bold formatting for heading',
                location: `Line ${index + 1}`,
                original_text: reason.substring(0, 100),
                severity: 'medium'
              })
            }
          }
          
          // Check if it's in "You might" section
          if (youMightIndex > -1 && index > youMightIndex && index < whatsGoingIndex) {
            // Should start with dash or bullet
            if (!/^[-•]\s/.test(reason) && reason.length > 0) {
              this.issues.push({
                table: item.table as any,
                item_name: item.name,
                issue_type: 'formatting',
                description: 'Missing dash/bullet for "You might" item',
                location: `Line ${index + 1}`,
                original_text: reason.substring(0, 100),
                severity: 'low'
              })
            }
          }
        }
      })
      
      // Check for missing sections
      if (!hasYouMight) {
        this.issues.push({
          table: item.table as any,
          item_name: item.name,
          issue_type: 'structure',
          description: 'Missing "You might:" section',
          location: 'Overall structure',
          original_text: '',
          severity: 'high'
        })
      }
      
      if (!hasWhatsGoing) {
        this.issues.push({
          table: item.table as any,
          item_name: item.name,
          issue_type: 'structure',
          description: 'Missing "Here\'s what\'s really going on:" section',
          location: 'Overall structure',
          original_text: '',
          severity: 'high'
        })
      }
    }
  }
  
  private checkDuplicateContent() {
    console.log('📑 Checking for duplicate content...')
    
    // Check within each item
    for (const item of this.allContent) {
      const seenContent = new Set<string>()
      
      item.reasons.forEach((reason, index) => {
        // Normalize for comparison (remove emoji, lowercase, trim)
        const normalized = reason
          .replace(/\p{Extended_Pictographic}/gu, '')
          .replace(/\*\*/g, '')
          .toLowerCase()
          .trim()
        
        if (normalized.length > 30 && seenContent.has(normalized)) {
          this.issues.push({
            table: item.table as any,
            item_name: item.name,
            issue_type: 'duplicate',
            description: 'Duplicate or near-duplicate content within same item',
            location: `Line ${index + 1}`,
            original_text: reason.substring(0, 100),
            severity: 'medium'
          })
        }
        seenContent.add(normalized)
      })
    }
    
    // Check across all items for common duplicates
    const globalContent = new Map<string, string[]>()
    
    for (const item of this.allContent) {
      for (const reason of item.reasons) {
        const normalized = reason
          .replace(/\p{Extended_Pictographic}/gu, '')
          .replace(/\*\*/g, '')
          .toLowerCase()
          .trim()
        
        if (normalized.length > 50) {
          if (!globalContent.has(normalized)) {
            globalContent.set(normalized, [])
          }
          globalContent.get(normalized)!.push(item.name)
        }
      }
    }
    
    // Report duplicates across items
    for (const [content, items] of globalContent.entries()) {
      if (items.length > 2) {
        this.issues.push({
          table: 'tasks_content',
          item_name: 'Multiple items',
          issue_type: 'duplicate_across',
          description: `Same content appears in ${items.length} different items`,
          location: items.slice(0, 3).join(', ') + (items.length > 3 ? '...' : ''),
          original_text: content.substring(0, 100),
          severity: 'high'
        })
      }
    }
  }
  
  private checkStructuralIssues() {
    console.log('🏗️ Checking structural issues...')
    
    for (const item of this.allContent) {
      // Check for empty or very short reasons
      item.reasons.forEach((reason, index) => {
        if (reason.trim().length === 0) {
          this.issues.push({
            table: item.table as any,
            item_name: item.name,
            issue_type: 'structure',
            description: 'Empty line in ADHD reasons',
            location: `Line ${index + 1}`,
            original_text: '',
            severity: 'medium'
          })
        }
        
        if (reason.trim().length < 10 && 
            !reason.includes('You might:') && 
            !reason.includes("Here's what's really going on:")) {
          this.issues.push({
            table: item.table as any,
            item_name: item.name,
            issue_type: 'structure',
            description: 'Suspiciously short content line',
            location: `Line ${index + 1}`,
            original_text: reason,
            severity: 'low'
          })
        }
      })
      
      // Check for reasonable number of items
      const youMightCount = item.reasons.filter(r => r.startsWith('-') || r.startsWith('•')).length
      const whatsGoingCount = item.reasons.filter(r => /^\p{Extended_Pictographic}/u.test(r)).length
      
      if (youMightCount === 0) {
        this.issues.push({
          table: item.table as any,
          item_name: item.name,
          issue_type: 'structure',
          description: 'No "You might" items found',
          location: 'Overall structure',
          original_text: '',
          severity: 'high'
        })
      }
      
      if (whatsGoingCount === 0) {
        this.issues.push({
          table: item.table as any,
          item_name: item.name,
          issue_type: 'structure',
          description: 'No "What\'s really going on" items found',
          location: 'Overall structure',
          original_text: '',
          severity: 'high'
        })
      }
    }
  }
  
  private checkNonsensicalPhrases() {
    console.log('❓ Checking for nonsensical phrases...')
    
    const problematicPhrases = [
      'brain isnt braining',
      'brain isn\'t braining',
      'executive functioning dysfunction',
      'ADHD ADHD',
      'the the',
      'a a',
      'an an',
      'is is',
      'was was',
      'were were',
      'are are',
      'to to',
      'for for',
      'and and',
      'or or',
      'but but',
      'that that',
      'this this',
      'with with',
      'from from',
      'about about',
      'Context matters: your brain is adapting; supports help',
      'Insight: Context matters',
      'Insight: Insight',
      'makes initiating multi-step tasks feel impossible'
    ]
    
    for (const item of this.allContent) {
      item.reasons.forEach((reason, index) => {
        for (const phrase of problematicPhrases) {
          if (reason.toLowerCase().includes(phrase.toLowerCase())) {
            this.issues.push({
              table: item.table as any,
              item_name: item.name,
              issue_type: 'nonsensical',
              description: `Problematic phrase found: "${phrase}"`,
              location: `Line ${index + 1}`,
              original_text: reason.substring(0, 100),
              severity: phrase.includes('brain') || phrase.includes('Context matters') ? 'high' : 'medium'
            })
          }
        }
        
        // Check for garbled text
        if (/[^\x00-\x7F]{3,}/.test(reason) || /\uFFFD/.test(reason)) {
          this.issues.push({
            table: item.table as any,
            item_name: item.name,
            issue_type: 'garbled',
            description: 'Contains garbled or non-ASCII characters',
            location: `Line ${index + 1}`,
            original_text: reason.substring(0, 100),
            severity: 'high'
          })
        }
      })
    }
  }
  
  private generateReport() {
    const reportDir = path.join(process.cwd(), 'scripts', 'reports')
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true })
    }
    
    const reportPath = path.join(reportDir, 'adhd-reasons-audit-report.md')
    
    let report = '# ADHD Reasons Comprehensive Audit Report\n\n'
    report += `Generated: ${new Date().toISOString()}\n\n`
    report += `Total Issues Found: ${this.issues.length}\n\n`
    if (this.wrote.length){
      report += `## Autofix Summary (--write)\n\n`
      const byTable: Record<string, {count:number}> = {}
      for (const w of this.wrote){ byTable[w.table] = byTable[w.table] || {count:0}; byTable[w.table].count += 1 }
      for (const [tbl, v] of Object.entries(byTable)){
        report += `- ${tbl}: updated ${v.count} items\n`
      }
      report += '\n'
    }
    
    // Summary by severity
    const bySeverity = {
      high: this.issues.filter(i => i.severity === 'high'),
      medium: this.issues.filter(i => i.severity === 'medium'),
      low: this.issues.filter(i => i.severity === 'low')
    }
    
    report += '## Summary by Severity\n\n'
    report += `- 🔴 **High Severity**: ${bySeverity.high.length} issues\n`
    report += `- 🟡 **Medium Severity**: ${bySeverity.medium.length} issues\n`
    report += `- 🟢 **Low Severity**: ${bySeverity.low.length} issues\n\n`
    
    // Summary by type
    const byType = new Map<string, Issue[]>()
    for (const issue of this.issues) {
      if (!byType.has(issue.issue_type)) {
        byType.set(issue.issue_type, [])
      }
      byType.get(issue.issue_type)!.push(issue)
    }
    
    report += '## Issues by Type\n\n'
    for (const [type, issues] of byType.entries()) {
      report += `### ${this.formatIssueType(type)} (${issues.length} issues)\n\n`
      
      // Show up to 5 examples
      const examples = issues.slice(0, 5)
      for (const issue of examples) {
        report += `**${issue.item_name}** - ${issue.location}\n`
        report += `- ${issue.description}\n`
        if (issue.original_text) {
          report += `- Original: "${issue.original_text}"\n`
        }
        if (issue.suggested_fix) {
          report += `- Suggested: "${issue.suggested_fix}"\n`
        }
        report += '\n'
      }
      
      if (issues.length > 5) {
        report += `... and ${issues.length - 5} more\n\n`
      }
    }
    
    // Emoji usage report
    report += '## Emoji Usage Analysis\n\n'
    const sortedEmojis = Array.from(this.emojiUsageMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20)
    
    report += '| Emoji | Usage Count | Number of Items | Status |\n'
    report += '|-------|-------------|-----------------|--------|\n'
    for (const [emoji, usage] of sortedEmojis) {
      const status = usage.count > 10 ? '🔴 Overused' : usage.count > 5 ? '🟡 High' : '🟢 OK'
      report += `| ${emoji} | ${usage.count} | ${usage.locations.size} | ${status} |\n`
    }
    report += '\n'
    
    // Items with most issues
    const issuesByItem = new Map<string, Issue[]>()
    for (const issue of this.issues) {
      if (!issuesByItem.has(issue.item_name)) {
        issuesByItem.set(issue.item_name, [])
      }
      issuesByItem.get(issue.item_name)!.push(issue)
    }
    
    const sortedItems = Array.from(issuesByItem.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10)
    
    report += '## Items with Most Issues\n\n'
    for (const [item, issues] of sortedItems) {
      const highCount = issues.filter(i => i.severity === 'high').length
      const medCount = issues.filter(i => i.severity === 'medium').length
      const lowCount = issues.filter(i => i.severity === 'low').length
      report += `- **${item}**: ${issues.length} total (${highCount} high, ${medCount} medium, ${lowCount} low)\n`
    }
    
    fs.writeFileSync(reportPath, report)
    
    // Console output
    console.log('\n' + '='.repeat(60))
    console.log('📊 AUDIT COMPLETE')
    console.log('='.repeat(60))
    console.log(`Total Issues Found: ${this.issues.length}`)
    console.log(`- High Severity: ${bySeverity.high.length}`)
    console.log(`- Medium Severity: ${bySeverity.medium.length}`)
    console.log(`- Low Severity: ${bySeverity.low.length}`)
    console.log('\nTop Issue Types:')
    for (const [type, issues] of byType.entries()) {
      console.log(`  - ${this.formatIssueType(type)}: ${issues.length}`)
    }
    console.log(`\n📄 Full report saved to: ${reportPath}`)
  }
  
  private formatIssueType(type: string): string {
    const formats: Record<string, string> = {
      emoji_duplicate: '🔄 Emoji duplicates (within page)',
      typo: '✏️ Typos & Spelling',
      formatting: '📐 Formatting Issues',
      duplicate: '📑 Duplicate Content',
      duplicate_across: '🔁 Duplicate Across Items',
      structure: '🏗️ Structural Issues',
      nonsensical: '❓ Nonsensical Phrases',
      garbled: '⚠️ Garbled Text'
    }
    return formats[type] || type
  }
}

// Run the audit
const auditor = new ADHDReasonsAuditor()
auditor.audit().catch(console.error)