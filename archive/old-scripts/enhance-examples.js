const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Enhanced example generation with ADHD-specific patterns
const generateDetailedExample = (strategy) => {
  const { Name, subtitle, use_case, description, help_task, feeling_1, feeling_2, issues, barrier } = strategy;
  
  // Skip if already has detailed example (first 10)
  if (strategy.example && strategy.example.includes('##')) {
    return strategy.example;
  }
  
  // Strategy categorization for appropriate examples
  const getStrategyCategory = (name, subtitle, useCase) => {
    const text = [name, subtitle, useCase].join(' ').toLowerCase();
    
    if (text.includes('time') || text.includes('schedule') || text.includes('deadline')) return 'time';
    if (text.includes('clean') || text.includes('organize') || text.includes('declutter')) return 'cleaning';
    if (text.includes('focus') || text.includes('attention') || text.includes('distract')) return 'focus';
    if (text.includes('energy') || text.includes('motivat') || text.includes('mood')) return 'energy';
    if (text.includes('anxiet') || text.includes('overwhelm') || text.includes('stress')) return 'anxiety';
    if (text.includes('start') || text.includes('begin') || text.includes('initiat')) return 'starting';
    if (text.includes('habit') || text.includes('routine') || text.includes('consistent')) return 'habits';
    if (text.includes('work') || text.includes('job') || text.includes('career')) return 'work';
    if (text.includes('social') || text.includes('friend') || text.includes('relationship')) return 'social';
    if (text.includes('health') || text.includes('exercise') || text.includes('sleep')) return 'health';
    if (text.includes('learn') || text.includes('study') || text.includes('skill')) return 'learning';
    if (text.includes('money') || text.includes('budget') || text.includes('finance')) return 'finance';
    if (text.includes('creative') || text.includes('art') || text.includes('write')) return 'creative';
    if (text.includes('decision') || text.includes('choice') || text.includes('pick')) return 'decisions';
    if (text.includes('break') || text.includes('rest') || text.includes('pause')) return 'breaks';
    
    return 'general';
  };
  
  const category = getStrategyCategory(Name, subtitle, use_case);
  
  // Scenario templates based on category
  const scenarioTemplates = {
    time: {
      emoji: '⏰',
      scenarios: [
        {
          title: 'Morning Routine Chaos',
          problem: 'Every morning feels like rushing through a tornado. You\'re always late and forget important things.',
          solution: `Apply ${Name} to your morning routine`,
          steps: [
            'Set up everything the night before',
            'Use a simple checklist by the door',
            'Build in 10 extra minutes as buffer time',
            'Celebrate when you leave on time'
          ]
        },
        {
          title: 'Work Deadline Stress',
          problem: 'Project deadlines sneak up on you, causing last-minute panic and all-nighters.',
          solution: `Use ${Name} to manage work timelines`,
          steps: [
            'Break the project into 15-minute chunks',
            'Schedule specific times for each chunk',
            'Set daily check-in reminders',
            'Reward yourself for staying on track'
          ]
        }
      ]
    },
    cleaning: {
      emoji: '🧹',
      scenarios: [
        {
          title: 'Kitchen Disaster Zone',
          problem: 'Your kitchen looks like a food tornado hit it. Dirty dishes everywhere, counters covered in clutter.',
          solution: `Transform your kitchen using ${Name}`,
          steps: [
            'Start with just the sink area (5 minutes)',
            'Load dishwasher or wash one sink of dishes',
            'Clear one counter completely',
            'Wipe down that clean counter to see the victory'
          ]
        },
        {
          title: 'Bedroom Clothes Mountain',
          problem: 'Clean and dirty clothes live together in mysterious piles around your room.',
          solution: `Tackle the clothes chaos with ${Name}`,
          steps: [
            'Make three piles: clean, dirty, donate',
            'Put away just the clean clothes first',
            'Toss dirty clothes in hamper',
            'Set a timer for 15 minutes max'
          ]
        }
      ]
    },
    focus: {
      emoji: '🎯',
      scenarios: [
        {
          title: 'Zoom Meeting Brain Fog',
          problem: 'You\'re in an important video call but your mind keeps wandering to random thoughts.',
          solution: `Use ${Name} to stay present in meetings`,
          steps: [
            'Take notes by hand (engages your brain)',
            'Repeat key points in your head',
            'Use fidget tools off-camera',
            'Sit in a spot with minimal distractions'
          ]
        },
        {
          title: 'Study Session Struggles',
          problem: 'You sit down to study but end up reading the same paragraph 5 times without absorbing it.',
          solution: `Apply ${Name} to boost study focus`,
          steps: [
            'Read for just 10 minutes at a time',
            'Summarize each section out loud',
            'Use a fidget or stress ball while reading',
            'Take movement breaks between sections'
          ]
        }
      ]
    },
    energy: {
      emoji: '⚡',
      scenarios: [
        {
          title: 'Afternoon Energy Crash',
          problem: 'By 2 PM, you feel like a phone with 5% battery. Everything seems impossible.',
          solution: `Recharge your energy using ${Name}`,
          steps: [
            'Step outside for 5 minutes of sunlight',
            'Do 10 jumping jacks or stretch',
            'Drink a full glass of water',
            'Listen to one energizing song'
          ]
        },
        {
          title: 'Monday Morning Motivation Deficit',
          problem: 'Monday mornings feel like climbing Mount Everest in flip-flops.',
          solution: `Kickstart your week with ${Name}`,
          steps: [
            'Prep something you enjoy for Monday morning',
            'Set one tiny, achievable goal for the day',
            'Reward yourself for just showing up',
            'Connect with a friend or colleague early on'
          ]
        }
      ]
    },
    anxiety: {
      emoji: '🌊',
      scenarios: [
        {
          title: 'Pre-Meeting Panic',
          problem: 'You have a big presentation in 30 minutes and your heart is racing.',
          solution: `Calm your nerves using ${Name}`,
          steps: [
            'Take 5 deep breaths, counting to 4 on each',
            'List 3 things you know you do well',
            'Splash cool water on your wrists',
            'Remind yourself: "I can handle whatever happens"'
          ]
        },
        {
          title: 'Social Event Overwhelm',
          problem: 'You\'re at a party and feeling overstimulated - too many voices, lights, and expectations.',
          solution: `Find your calm using ${Name}`,
          steps: [
            'Step outside or find a quiet corner',
            'Focus on 3 things you can see clearly',
            'Take slow breaths through your nose',
            'Give yourself permission to leave early if needed'
          ]
        }
      ]
    },
    starting: {
      emoji: '🚀',
      scenarios: [
        {
          title: 'The Dreaded Email Inbox',
          problem: 'You have 47 unread emails and the thought of opening them makes you want to hide.',
          solution: `Break through the starting block with ${Name}`,
          steps: [
            'Set a timer for just 10 minutes',
            'Delete obvious junk mail first (easy wins)',
            'Respond to one simple email',
            'Stop when timer goes off, celebrate progress'
          ]
        },
        {
          title: 'Exercise Avoidance',
          problem: 'You know you should work out, but the thought of a full gym session feels overwhelming.',
          solution: `Get moving using ${Name}`,
          steps: [
            'Put on workout clothes (that\'s it for now)',
            'Walk around the block once',
            'Do 5 pushups against the wall',
            'Celebrate that you moved your body today'
          ]
        }
      ]
    },
    // Add more categories as needed...
    general: {
      emoji: '✨',
      scenarios: [
        {
          title: 'Daily Life Challenge',
          problem: `You're struggling with situations where ${use_case || 'this strategy applies'}.`,
          solution: `Apply ${Name} to make it manageable`,
          steps: [
            'Start with the smallest possible step',
            'Set a timer for 15 minutes maximum',
            'Focus on progress, not perfection',
            'Celebrate any forward movement'
          ]
        }
      ]
    }
  };
  
  const template = scenarioTemplates[category] || scenarioTemplates.general;
  const scenarios = template.scenarios;
  
  // Generate the detailed example
  let example = '';
  
  scenarios.forEach((scenario, index) => {
    example += `## ${template.emoji} ${scenario.title}\n\n`;
    example += `**The Challenge:** ${scenario.problem}\n\n`;
    example += `**The ${Name} Solution:**\n`;
    scenario.steps.forEach((step, stepIndex) => {
      example += `${stepIndex + 1}. ${step}\n`;
    });
    example += `\n**Why This Works:** Small steps prevent overwhelm → builds momentum → creates sustainable progress!\n\n`;
    
    if (index < scenarios.length - 1) {
      example += '---\n\n';
    }
  });
  
  // Add ADHD-specific pro tips
  example += `## 💡 ADHD Pro Tips\n\n`;
  example += `**For Low Energy Days:** Cut the steps in half - even 1 step is progress!\n\n`;
  example += `**For Hyperfocus Days:** Set a timer so you don't burn out.\n\n`;
  example += `**For Rejection Sensitive Days:** Remember - this is about helping yourself, not being perfect.\n\n`;
  
  return example;
};

// Process the CSV file
async function enhanceExamples() {
  const strategies = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('/Users/marlanacreed/Downloads/Projects/adhd-first-aid-kit/Strategies_ADHDFriendly_update_complete.csv')
      .pipe(csv())
      .on('data', (data) => {
        strategies.push(data);
      })
      .on('end', () => {
        console.log(`Enhancing examples for ${strategies.length} strategies...`);
        
        // Process strategies starting from row 11 (index 10) since first 10 are already done
        let enhancedCount = 0;
        for (let i = 10; i < strategies.length; i++) {
          const strategy = strategies[i];
          
          // Generate detailed example if it doesn't already have one
          if (!strategy.example || strategy.example.trim() === '' || !strategy.example.includes('##')) {
            strategy.example = generateDetailedExample(strategy);
            enhancedCount++;
            console.log(`Enhanced example for: ${strategy.Name}`);
          }
        }
        
        console.log(`\n✅ Enhanced ${enhancedCount} strategy examples!`);
        
        // Write the updated CSV
        const csvWriter = createCsvWriter({
          path: '/Users/marlanacreed/Downloads/Projects/adhd-first-aid-kit/Strategies_ADHDFriendly_complete_with_examples.csv',
          header: Object.keys(strategies[0]).map(key => ({ id: key, title: key }))
        });
        
        csvWriter.writeRecords(strategies)
          .then(() => {
            console.log('✅ All strategy examples enhanced!');
            console.log('Output file: Strategies_ADHDFriendly_complete_with_examples.csv');
            resolve();
          })
          .catch(reject);
      })
      .on('error', reject);
  });
}

// Run the enhancement process
enhanceExamples().catch(console.error);