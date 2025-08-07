// Test the URL conversion logic from the [life_area]/page.tsx
function testUrlConversion() {
  console.log('🔄 TESTING URL TO TASK NAME CONVERSION');
  console.log('====================================');
  
  const testSlugs = [
    'budgeting-and-tracking',
    'focus-and-time', 
    'bills-and-money',
    'adhd-and-hygiene',
    'regular-task-name'
  ];
  
  testSlugs.forEach(slug => {
    // Replicate the conversion logic from [life_area]/page.tsx
    let taskName = decodeURIComponent(slug)
      .split('-')
      .filter(word => word.length > 0) // Remove empty strings from double dashes
      .map(word => {
        // Special case for ADHD
        if (word.toLowerCase() === 'adhd') {
          return 'ADHD';
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ')
      .replace(/And/g, '&'); // Convert "And" back to "&"
    
    // Apply URL mappings (from the actual code)
    const urlMappings: Record<string, string> = {
      'ADHD Hygiene': 'Hygiene',
      'Bills Money': 'Bills & Money',
      'To Do Lists': 'To-Do Lists',
      'Big Exam Prep Long Term Studying': 'Big Exam Prep (Long-Term Studying)'
    };
    
    taskName = urlMappings[taskName] || taskName;
    
    console.log(`\nSlug: "${slug}"`);
    console.log(`  Converts to: "${taskName}"`);
    console.log(`  Expected: ${getExpectedTaskName(slug)}`);
    console.log(`  Match: ${taskName === getExpectedTaskName(slug) ? '✅' : '❌'}`);
  });
  
  function getExpectedTaskName(slug: string): string {
    const expected: Record<string, string> = {
      'budgeting-and-tracking': 'Budgeting & Tracking',
      'focus-and-time': 'Focus & Time',
      'bills-and-money': 'Bills & Money', 
      'adhd-and-hygiene': 'Hygiene', // Special mapping
      'regular-task-name': 'Regular Task Name'
    };
    return expected[slug] || 'Unknown';
  }
}

testUrlConversion();