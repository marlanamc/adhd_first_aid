#!/usr/bin/env tsx

// Test slug generation from tasks page
function generateSlug(taskName: string): string {
  return encodeURIComponent(taskName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
}

// Test URL to task name conversion from individual task page
function convertUrlToTaskName(urlParam: string): string {
  let taskName = decodeURIComponent(urlParam)
    .split('-')
    .filter(word => word.length > 0) // Remove empty strings from double dashes
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
    'ADHD Hygiene': 'ADHD & Hygiene',
    'Bills Money': 'Bills & Money',
    'To Do Lists': 'To-Do Lists',
    'Big Exam Prep Long Term Studying': 'Big Exam Prep (Long-Term Studying)'
  }
  
  return urlMappings[taskName] || taskName
}

console.log('🧪 Testing slug generation and conversion:')
console.log('')

const testTasks = [
  'Bills & Money',
  'To-Do Lists',
  'ADHD & Hygiene',
  'Big Exam Prep (Long-Term Studying)'
]

testTasks.forEach(task => {
  const slug = generateSlug(task)
  const converted = convertUrlToTaskName(slug)
  const match = converted === task ? '✅' : '❌'
  console.log(`"${task}" → "${slug}" → "${converted}" ${match}`)
})