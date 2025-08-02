#!/usr/bin/env tsx

// Test URL conversion logic
function convertUrlToTaskName(urlParam: string): string {
  let taskName = decodeURIComponent(urlParam)
    .split('-')
    .map(word => {
      // Special case for ADHD
      if (word.toLowerCase() === 'adhd') {
        return 'ADHD'
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
    .replace(/And/g, '&')
  
  // Handle special URL to database name mappings
  const urlMappings: Record<string, string> = {
    'Hygiene': 'ADHD & Hygiene',
    'To Do Lists': 'To-Do Lists',
    'Big Exam Prep Long Term Studying': 'Big Exam Prep (Long-Term Studying)'
  }
  
  return urlMappings[taskName] || taskName
}

console.log('🧪 Testing URL to Task Name conversion:')
console.log('')

const testCases = [
  'hygiene',
  'adhd-and-hygiene', 
  'cleaning',
  'bills-and-money',
  'to-do-lists',
  'big-exam-prep-long-term-studying'
]

testCases.forEach(urlParam => {
  const result = convertUrlToTaskName(urlParam)
  console.log(`"${urlParam}" → "${result}"`)
})