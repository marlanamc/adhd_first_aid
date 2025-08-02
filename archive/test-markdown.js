// Quick test of the markdown processing logic

function processTextFormatting(text) {
  // Handle the text in a more robust way that processes markdown properly
  const result = [];
  let keyCounter = 0;

  // Process bold (**text**) and italic (*text*) patterns in order
  const patterns = [
    { regex: /\*\*([^*]+)\*\*/g, wrapper: (content) => `<strong>${content}</strong>` },
    { regex: /\*([^*]+)\*/g, wrapper: (content) => `<em>${content}</em>` },
    { regex: /_([^_]+)_/g, wrapper: (content) => `<em>${content}</em>` }
  ];

  // Find all matches for all patterns
  const allMatches = [];
  
  patterns.forEach(pattern => {
    let match;
    pattern.regex.lastIndex = 0; // Reset regex
    while ((match = pattern.regex.exec(text)) !== null) {
      allMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        wrapper: pattern.wrapper
      });
    }
  });

  // Sort matches by position
  allMatches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep the first one encountered)
  const filteredMatches = [];
  for (const match of allMatches) {
    const hasOverlap = filteredMatches.some(existing => 
      (match.start < existing.end && match.end > existing.start)
    );
    if (!hasOverlap) {
      filteredMatches.push(match);
    }
  }

  // Build the result with text and formatted segments
  let lastEnd = 0;
  filteredMatches.forEach(match => {
    // Add text before the match
    if (match.start > lastEnd) {
      const textBefore = text.slice(lastEnd, match.start);
      if (textBefore) {
        result.push(textBefore);
      }
    }
    
    // Add the formatted match
    result.push(match.wrapper(match.content));
    lastEnd = match.end;
  });

  // Add remaining text after the last match
  if (lastEnd < text.length) {
    const remainingText = text.slice(lastEnd);
    if (remainingText) {
      result.push(remainingText);
    }
  }

  // If no matches were found, return the original text
  if (result.length === 0) {
    result.push(text);
  }

  return result.join('');
}

// Test cases
const testCases = [
  "**You can't outwork executive dysfunction.**",
  "But you *can* build support systems strong enough to hold you up.**",
  "**You can't outwork executive dysfunction.**\n\nBut you *can* build support systems strong enough to hold you up.**"
];

console.log('Testing markdown processing:');
testCases.forEach((test, index) => {
  console.log(`\nTest ${index + 1}: "${test}"`);
  console.log(`Result: "${processTextFormatting(test)}"`);
});