const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Strategy-specific emoji mapping
const getStrategyEmoji = (name, subtitle) => {
  const emojiMap = {
    // Time management
    'time': '⏰', 'timer': '⏱️', 'schedule': '📅', 'deadline': '🚨', 'routine': '🔄',
    'pomodoro': '🍅', 'break': '☕', 'morning': '🌅', 'evening': '🌙', 'sleep': '😴',
    
    // Organization
    'list': '📝', 'checklist': '✅', 'organize': '🗂️', 'sort': '📊', 'file': '📁',
    'inbox': '📥', 'system': '⚙️', 'clean': '🧹', 'declutter': '🗂️', 'folder': '📂',
    
    // Energy & Focus
    'focus': '🎯', 'attention': '👁️', 'energy': '⚡', 'motivation': '🚀', 'flow': '🌊',
    'brain': '🧠', 'mindful': '🧘', 'breathe': '💨', 'calm': '😌', 'stress': '💆',
    
    // Physical & Movement
    'walk': '🚶', 'exercise': '💪', 'move': '🏃', 'stretch': '🤸', 'dance': '💃',
    'fidget': '🎲', 'shake': '🤝', 'physical': '🏋️', 'body': '🧘‍♀️',
    
    // Social & Communication
    'support': '🤝', 'friend': '👫', 'family': '👨‍👩‍👧‍👦', 'team': '👥', 'help': '🆘',
    'accountability': '🤝', 'buddy': '👯', 'community': '🏘️', 'network': '🕸️',
    
    // Creativity & Expression
    'create': '🎨', 'art': '🖼️', 'music': '🎵', 'write': '✍️', 'journal': '📔',
    'creative': '💡', 'imagination': '🌈', 'story': '📚', 'idea': '💭',
    
    // Learning & Growth
    'learn': '📚', 'study': '📖', 'practice': '🎯', 'skill': '🛠️', 'growth': '🌱',
    'improve': '📈', 'develop': '🔧', 'master': '🏆', 'progress': '📊',
    
    // Environment & Space
    'space': '🏠', 'room': '🏡', 'environment': '🌿', 'light': '💡', 'sound': '🔊',
    'cozy': '🛋️', 'comfort': '☁️', 'sanctuary': '🏛️', 'nest': '🪺',
    
    // Technology & Tools
    'app': '📱', 'tool': '🔧', 'technology': '💻', 'digital': '🌐', 'automation': '🤖',
    'reminder': '⏰', 'notification': '🔔', 'alarm': '⏰', 'device': '📟',
    
    // Emotions & Mental Health
    'emotion': '💭', 'feeling': '❤️', 'mood': '😊', 'anxiety': '😰', 'worry': '😟',
    'overwhelm': '🌪️', 'panic': '😱', 'sad': '😢', 'happy': '😊', 'calm': '😌',
    
    // Tasks & Productivity
    'task': '✅', 'project': '📋', 'goal': '🎯', 'priority': '🔝', 'complete': '✅',
    'finish': '🏁', 'start': '🏁', 'begin': '▶️', 'end': '🔚', 'done': '✅',
    
    // Default patterns
    'minute': '⏱️', 'second': '⏱️', 'hour': '⏰', 'day': '📅', 'week': '📅',
    'simple': '✨', 'easy': '✨', 'quick': '⚡', 'instant': '⚡', 'fast': '💨'
  };
  
  const text = (name + ' ' + subtitle).toLowerCase();
  
  // Find matching emoji based on keywords
  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    if (text.includes(keyword)) {
      return emoji;
    }
  }
  
  // Default emoji based on strategy type
  if (text.includes('break') || text.includes('pause')) return '☕';
  if (text.includes('list') || text.includes('note')) return '📝';
  if (text.includes('time') || text.includes('schedule')) return '⏰';
  if (text.includes('focus') || text.includes('attention')) return '🎯';
  if (text.includes('energy') || text.includes('motivation')) return '⚡';
  if (text.includes('organize') || text.includes('system')) return '🗂️';
  if (text.includes('move') || text.includes('physical')) return '💪';
  if (text.includes('help') || text.includes('support')) return '🤝';
  if (text.includes('creative') || text.includes('art')) return '🎨';
  if (text.includes('learn') || text.includes('study')) return '📚';
  
  // Default fallback
  return '✨';
};

// Create engaging headers based on strategy content
const createHeader = (name, subtitle, useCase, emoji) => {
  // Extract key concepts for header
  const concepts = [name, subtitle, useCase].join(' ').toLowerCase();
  
  // Header patterns based on strategy type
  if (concepts.includes('minute') || concepts.includes('quick')) {
    return `${emoji} Quick Win: ${name}`;
  }
  if (concepts.includes('break') || concepts.includes('pause')) {
    return `${emoji} Take a Break: ${name}`;
  }
  if (concepts.includes('organize') || concepts.includes('system')) {
    return `${emoji} Get Organized: ${name}`;
  }
  if (concepts.includes('focus') || concepts.includes('attention')) {
    return `${emoji} Focus Boost: ${name}`;
  }
  if (concepts.includes('energy') || concepts.includes('motivation')) {
    return `${emoji} Energy Hack: ${name}`;
  }
  if (concepts.includes('time') || concepts.includes('schedule')) {
    return `${emoji} Time Helper: ${name}`;
  }
  if (concepts.includes('overwhelm') || concepts.includes('anxiety')) {
    return `${emoji} Calm Down: ${name}`;
  }
  if (concepts.includes('start') || concepts.includes('begin')) {
    return `${emoji} Get Started: ${name}`;
  }
  if (concepts.includes('finish') || concepts.includes('complete')) {
    return `${emoji} Finish Strong: ${name}`;
  }
  if (concepts.includes('habit') || concepts.includes('routine')) {
    return `${emoji} Build Habits: ${name}`;
  }
  
  // Default pattern
  return `${emoji} ${name} Strategy`;
};

// Convert strategy content to ADHD-friendly format
const improveDescription = (strategy) => {
  const { Name, subtitle, use_case, description } = strategy;
  
  // Skip if already improved (has # header)
  if (description && description.trim().startsWith('#')) {
    return description;
  }
  
  const emoji = getStrategyEmoji(Name, subtitle);
  const header = createHeader(Name, subtitle, use_case, emoji);
  
  // Create bold subtitle from use_case or subtitle
  const boldSubtitle = `**${use_case || subtitle || `A simple way to use ${Name}`}**`;
  
  // Extract key points from existing description
  let actionPoints = [];
  
  if (description) {
    // Split description into sentences and extract actionable items
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Convert to bullet points with ADHD-friendly language
    actionPoints = sentences.slice(0, 4).map(sentence => {
      let point = sentence.trim();
      
      // Make it more actionable
      if (!point.match(/^(do|try|use|start|set|take|find|create|make|write|plan)/i)) {
        if (point.toLowerCase().includes('help')) {
          point = `Use this when ${point.toLowerCase()}`;
        } else if (point.toLowerCase().includes('time')) {
          point = `Set aside time to ${point.toLowerCase()}`;
        } else {
          point = `Try ${point.toLowerCase()}`;
        }
      }
      
      // Ensure it starts with capital letter
      point = point.charAt(0).toUpperCase() + point.slice(1);
      
      // Remove redundant words
      point = point.replace(/\b(basically|essentially|generally|typically)\b/gi, '');
      
      return point;
    });
  }
  
  // Add default points if we don't have enough
  if (actionPoints.length < 3) {
    actionPoints.push(`Start small and build momentum`);
    actionPoints.push(`Focus on progress, not perfection`);
  }
  
  // Construct the improved description
  const improvedDescription = [
    `# ${header}`,
    '',
    boldSubtitle,
    '',
    ...actionPoints.map(point => `• ${point}`),
    ''
  ].join('\n');
  
  return improvedDescription;
};

// Process the CSV file
async function processStrategies() {
  const strategies = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('/Users/marlanacreed/Downloads/Projects/adhd-first-aid-kit/Strategies_ADHDFriendly_update.csv')
      .pipe(csv())
      .on('data', (data) => {
        strategies.push(data);
      })
      .on('end', () => {
        console.log(`Processing ${strategies.length} strategies...`);
        
        // Process strategies starting from row 11 (index 10) since first 10 are already done
        for (let i = 10; i < strategies.length; i++) {
          const strategy = strategies[i];
          
          // Only process if not already marked as reviewed
          if (strategy['Reviewed?'] !== 'Yes') {
            strategy.description = improveDescription(strategy);
            strategy['Reviewed?'] = 'Yes';
            console.log(`Improved: ${strategy.Name}`);
          }
        }
        
        // Write the updated CSV
        const csvWriter = createCsvWriter({
          path: '/Users/marlanacreed/Downloads/Projects/adhd-first-aid-kit/Strategies_ADHDFriendly_update_complete.csv',
          header: Object.keys(strategies[0]).map(key => ({ id: key, title: key }))
        });
        
        csvWriter.writeRecords(strategies)
          .then(() => {
            console.log('✅ All strategy descriptions improved!');
            console.log('Output file: Strategies_ADHDFriendly_update_complete.csv');
            resolve();
          })
          .catch(reject);
      })
      .on('error', reject);
  });
}

// Run the process
processStrategies().catch(console.error);