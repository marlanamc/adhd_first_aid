// Mock strategy data based on the CSV sample
// This allows the app to work during development without a live Supabase connection

export const mockStrategies = [
  {
    id: '1',
    name: '5-4-3-2-1 Sensory Grounding',
    description: "When your mind's racing, count down with your senses: find 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. This quick sensory exercise pulls you back to the present moment when you're spiraling.",
    feeling: ['Overwhelmed'],
    issue: 'Anxious, Frozen/Shut Down, Spiraling',
    type: 'Technique',
    mode: ['Reflective', 'Sensory'],
    barrier_type: 'Emotional Dysregulation',
    use_case: 'Anxiety managment, Panic response',
    source: 'Look-Up Source, The Anti-Planner',
    tags: ['anxiety', 'grounding', 'mindfulness'],
    price: 'Free',
    featured: false,
    vote_count: [{ count: 15 }]
  },
  {
    id: '2',
    name: '5-Minute Timer Trick',
    description: 'Set a timer for just 5 minutes of work on that task you\'ve been avoiding. Tell yourself "I only have to do this for 5 minutes, then I can stop." The magic is that once you start, your brain often gets over the hump and wants to keep going when the timer rings.',
    feeling: ['Stuck', 'Unmotivated'],
    issue: 'Avoidant, Bored, Can\'t Start',
    type: 'Technique',
    mode: ['Gamified', 'Interactive'],
    barrier_type: 'Task Initiation',
    use_case: 'Beginning a big task, Housework, Low-energy day, Studying',
    source: 'The Anti-Planner',
    tags: ['momentum', 'procrastination', 'starting tasks'],
    price: 'Free',
    featured: true,
    vote_count: [{ count: 23 }]
  },
  {
    id: '3',
    name: '15-Minute Fridge Rescue Challenge',
    description: 'Turn cleaning your fridge into a beat-the-clock game: set a timer for 15 minutes and race to toss expired stuff, wipe down shelves, and group similar items together. The time limit tricks your brain into focusing on just one small space instead of feeling overwhelmed by ALL the cleaning.',
    feeling: ['Overwhelmed', 'Stuck'],
    issue: 'Avoidant, Can\'t Start, Messy',
    type: 'Challenge',
    mode: ['Gamified'],
    barrier_type: 'Task Initiation',
    use_case: 'Breaking through procrastination, Low-energy day, Sunday reset',
    source: 'How to Keep House While Drowning, The Anti-Planner',
    tags: ['cleaning', 'fridge', 'timer method'],
    price: 'Free',
    featured: false,
    vote_count: [{ count: 12 }]
  },
  {
    id: '4',
    name: '15-Minute Speed Clean',
    description: 'When your place is a disaster but you can\'t deal with a full cleaning session, set a timer for just 15 minutes. Focus only on what you can see (counters, floors, tables) and move fast. It\'s not about perfection—it\'s about making your space feel less chaotic so your brain can relax.',
    feeling: ['Chaotic', 'Overwhelmed'],
    issue: 'Avoidant, Can\'t Start, Messy',
    type: 'Challenge',
    mode: ['Embodied', 'Gamified'],
    barrier_type: 'Task Initiation',
    use_case: 'Cleaning your space, Low-energy day, Restoring Focus',
    source: 'The Anti-Planner',
    tags: ['home mess', 'quick clean', 'timer method'],
    price: 'Free',
    featured: false,
    vote_count: [{ count: 18 }]
  },
  {
    id: '5',
    name: 'Accountability Betting',
    description: 'Create small bets with yourself or others to boost task completion. Examples: add $5 to your vacation fund when you finish studying, send an embarrassing "I didn\'t do it 🫣" text to your accountability buddy, or treat yourself after completing 5 workouts.',
    feeling: ['Unmotivated'],
    issue: 'Bored, Can\'t Finish, Can\'t Start',
    type: 'Technique',
    mode: ['Gamified'],
    barrier_type: 'Low dopamine/Motivation',
    use_case: 'Starting difficult tasks, Staying engaged, Working through a boring task',
    source: 'The Anti-Planner',
    tags: ['accountability', 'motivation', 'rewards'],
    price: 'Free',
    featured: false,
    vote_count: [{ count: 8 }]
  },
  {
    id: '6',
    name: 'Body Doubling',
    description: 'Work alongside someone else (in-person or virtually) while each of you does your own tasks. The mere presence and accountability of another person helps you stay on track and resist distractions.',
    feeling: ['Stuck'],
    issue: 'Avoidant, Can\'t Focus, Can\'t Start',
    type: 'Environmental Shift',
    mode: ['Interactive'],
    barrier_type: 'Task Initiation',
    use_case: 'Starting difficult tasks, Staying engaged, Working through a boring task',
    source: 'The Anti-Planner',
    tags: ['accountability', 'body doubling', 'focus'],
    price: 'Free',
    featured: true,
    vote_count: [{ count: 31 }]
  },
  {
    id: '7',
    name: 'Body Scan',
    description: 'Check in with each part of your body (feet to head) when feeling overwhelmed or anxious. Spend 10-30 seconds noticing sensations in each area without judgment. This quick grounding technique pulls your attention away from racing thoughts and back to the present moment.',
    feeling: ['Overwhelmed'],
    issue: 'Anxious, Sensory Overload, Spiraling',
    type: 'Technique',
    mode: ['Reflective'],
    barrier_type: 'Emotional Dysregulation',
    use_case: 'Anxiety moments, Before difficult tasks, Overwhelm recovery',
    source: 'Look-Up Source, The Anti-Planner',
    tags: ['anxiety', 'grounding', 'mindfulness'],
    price: 'Free',
    featured: false,
    vote_count: [{ count: 9 }]
  },
  {
    id: '8',
    name: 'Coin Flip Decision Hack',
    description: 'Stuck between two options? Flip a coin! It either makes the decision for you, or - here\'s the magic - you\'ll feel instantly disappointed with the result and suddenly know what you actually wanted all along. Either way, you get unstuck in seconds.',
    feeling: ['Stuck'],
    issue: 'Can\'t Decide, Can\'t Start, Frozen/Shut Down',
    type: 'Technique',
    mode: ['Gamified', 'Interactive'],
    barrier_type: 'Decision Paralysis',
    use_case: 'Breaking paralysis, Decision making, Task prioritization',
    source: 'The Anti-Planner',
    tags: ['decision making', 'quick fix', 'starting tasks'],
    price: 'Free',
    featured: false,
    vote_count: [{ count: 14 }]
  }
]

// Mock function to simulate API calls
export function getMockStrategies(filters = {}) {
  let filteredStrategies = [...mockStrategies]

  // Filter by feelings
  if (filters.feelings && filters.feelings.length > 0) {
    filteredStrategies = filteredStrategies.filter(strategy =>
      strategy.feeling.some(feeling =>
        filters.feelings.some(filterFeeling =>
          feeling.toLowerCase().includes(filterFeeling.toLowerCase())
        )
      )
    )
  }

  // Filter by search query
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredStrategies = filteredStrategies.filter(strategy =>
      strategy.name.toLowerCase().includes(searchTerm) ||
      strategy.description.toLowerCase().includes(searchTerm) ||
      strategy.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  return Promise.resolve(filteredStrategies)
}

export function getMockStrategy(id) {
  const strategy = mockStrategies.find(s => s.id === id)
  return Promise.resolve(strategy || null)
}

