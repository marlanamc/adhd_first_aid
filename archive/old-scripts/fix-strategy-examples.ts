import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Strategy-specific example generators
const generateExample = (strategy: any): string => {
  const { name, subtitle, use_case, description } = strategy
  
  // Determine emoji based on strategy type
  const getEmoji = (strategyName: string): string => {
    const name = strategyName.toLowerCase()
    if (name.includes('minute') || name.includes('timer')) return '⏱️'
    if (name.includes('clean') || name.includes('tidy')) return '🧹'
    if (name.includes('break') || name.includes('pause')) return '☕'
    if (name.includes('food') || name.includes('meal')) return '🍽️'
    if (name.includes('focus') || name.includes('attention')) return '🎯'
    if (name.includes('energy') || name.includes('mood')) return '⚡'
    if (name.includes('habit') || name.includes('routine')) return '🔄'
    if (name.includes('list') || name.includes('note')) return '📝'
    if (name.includes('calm') || name.includes('anxiety')) return '🧘'
    if (name.includes('organize') || name.includes('system')) return '🗂️'
    if (name.includes('social') || name.includes('friend')) return '👥'
    if (name.includes('exercise') || name.includes('movement')) return '💪'
    if (name.includes('sleep') || name.includes('rest')) return '😴'
    if (name.includes('work') || name.includes('project')) return '💼'
    if (name.includes('creative') || name.includes('art')) return '🎨'
    return '✨'
  }

  const emoji = getEmoji(name)
  
  // Generate strategy-specific examples based on the name and purpose
  if (name.includes('2-Minute Rule') || name.includes('2 Minute')) {
    return `## 📧 Quick Win: The 2-Minute Power Move

You're staring at a text message that needs a simple "yes" reply, but somehow it's been sitting there for 3 days making you feel guilty.

### The 2-Minute Test:
1. **Spot the task** - "This needs a quick reply"
2. **Time check** - "Will this take under 2 minutes?"
3. **If YES** - Do it RIGHT NOW (no excuses!)
4. **If NO** - Schedule it for later

### Real-Time Example:
❌ **Before:** Text sits in phone → mental note to reply → forget → remember at 2am → feel bad → repeat  
✅ **After:** See text → 30 seconds to reply → send → DONE → brain space freed up!

### Why This Works for ADHD:
- **Prevents pile-up** of small tasks that become overwhelming
- **Reduces working memory load** (fewer things to remember)
- **Creates momentum** that helps with bigger tasks
- **Eliminates decision fatigue** about when to do it

### Pro Tips:
🔥 **Set a 2-minute timer** if you're not sure how long something takes  
📱 **Use voice-to-text** for super quick responses  
🎯 **"Good enough" is perfect** - don't overthink the response  
⚡ **Celebrate each 2-minute win** - your brain loves these dopamine hits!`
  }

  if (name.includes('10-Minute') || name.includes('10 Minute')) {
    return `## 🏡 10-Minute Reset Magic

Your living room looks like a tornado hit it - dishes on the coffee table, clothes on the couch, papers everywhere. Just looking at it makes your brain shut down.

### How it works:
1. **Grab your phone** and set a timer for exactly 10 minutes ⏱️
2. **Press start** and immediately grab ONE thing
3. **Put that ONE thing** where it belongs
4. **Grab the NEXT thing** you see (don't overthink it!)
5. **Keep going** until the timer rings
6. **STOP** when the timer goes off - even mid-task!

### Why only 10 minutes?
- **Short enough** that your brain can't say "but that will take forever!"
- **Long enough** to make a visible difference
- **Prevents perfectionist spiral** of "but I need to do EVERYTHING"
- **Creates clear start AND end point**

### The Results:
**Before:** Overwhelming chaos, can't find your keys, feel guilty about the mess  
**After:** Surfaces cleared, floor visible, brain fog lifted

### Pro Tips:
🔊 **Use a LOUD timer** that forces you to stop  
📸 **Take a "before" photo** so you can see your progress  
📦 **Have a "sort later" box** for items you don't know where to put  
🎉 **Celebrate completing the 10 minutes** no matter how much you got done!`
  }

  if (name.includes('5-4-3-2-1 Launch') || name.includes('Launch')) {
    return `## 🚀 Breaking Through the Stuck Moment

You're doom-scrolling on your phone even though your homework is due tomorrow. Your brain keeps saying "I'll start in a minute" but that was 30 minutes ago.

### The Launch Sequence:
1. **Notice you're stuck** in the avoidance loop
2. **Take a deep breath**
3. **Count out loud:** "5...4...3...2...1!"
4. **On "1"** - make a BIG physical movement
5. **Immediately start** the task before your brain can object

### Real Example:
🔄 **The Situation:** Sitting on couch, homework waiting, brain saying "not yet"  
🚀 **The Launch:** "5-4-3-2-1!" → TOSS phone onto couch → stand up → walk to desk → open homework

### Why This Works:
- **Countdown creates momentum** that bypasses resistance
- **Physical movement** breaks the paralysis pattern
- **Executive function** doesn't have time to talk you out of it
- **Action happens** before doubt can creep in

### Pro Tips:
💥 **Make the "1" action DRAMATIC** - the bigger the movement, the better it works!  
🗣️ **Count out loud** - hearing your voice makes it more powerful  
⚡ **Move immediately** on "1" - hesitation kills the momentum  
🎯 **Start with the tiniest step** - just opening the document counts as starting!`
  }

  if (name.includes('5-4-3-2-1') && name.includes('Grounding')) {
    return `## 🧘 Emergency Calm-Down Protocol

You're at the store and suddenly everything feels too much - lights too bright, people too loud, brain too fuzzy. You need to ground yourself RIGHT NOW.

### The 5-4-3-2-1 Technique:

#### 👀 **5 things you can SEE** (look for colors!)
- Blue shopping basket
- Yellow price tag  
- Red exit sign
- Green plant
- White floor tile

#### 👆 **4 things you can TOUCH** (focus on textures!)
- Smooth phone screen
- Soft hoodie fabric
- Cool metal shopping cart
- Rough denim of your jeans

#### 👂 **3 things you can HEAR** (name them out loud!)
- "Store announcement on aisle 5"
- "Shopping cart wheels squeaking" 
- "Air conditioning humming"

#### 👃 **2 things you can SMELL** (breathe deeply!)
- Coffee from the café
- Your shampoo/cologne

#### 👅 **1 thing you can TASTE**
- Mint gum or just notice what's already in your mouth

### Why This Works:
✨ **Gives racing thoughts somewhere to go**  
🎯 **Creates instant structure** when you feel scattered  
🎮 **The countdown gives your brain a game to play**  
⚓ **Each sense pulls you back to the present moment**

### Pro Tips:
📱 **Save this in your phone** as "Emergency Calm Down"  
🔄 **Practice when you're NOT panicking** so it's easier to remember  
🎧 **If sounds are overwhelming,** find a quiet corner first  
⏱️ **This takes less than 60 seconds** but feels like magic!`
  }

  // Generate examples for other common strategies
  if (name.includes('Brain Dump') || name.includes('Thought')) {
    return `## 🧠 Mental Declutter Session

Your brain feels like 47 browser tabs are open at once. Thoughts are bouncing around like ping pong balls and you can't focus on anything because you're trying to remember EVERYTHING.

### The Brain Dump Process:
1. **Grab paper or open notes app** - doesn't matter which
2. **Set timer for 5-10 minutes** ⏱️
3. **Write EVERYTHING** that's in your head
4. **Don't organize** - just dump it all out
5. **Keep writing** until the timer stops or your brain feels empty

### What Goes on the Page:
- Tasks you need to do
- Things you're worried about  
- Random thoughts
- Ideas for later
- Things you don't want to forget
- Grocery list items
- That thing your friend said yesterday

### The Magic Moment:
**Before:** Brain feels like a shaken snow globe - chaotic and overwhelming  
**After:** Thoughts are on paper where you can see them - brain feels spacious and calm

### Why This Works for ADHD:
🧮 **Frees up working memory** for the task at hand  
📝 **Externalizes the mental load** so you don't have to hold it all  
🎯 **Allows focus** to flow to what actually matters right now  
😌 **Reduces anxiety** from trying to remember everything

### Pro Tips:
🗑️ **Don't judge what comes out** - this isn't about quality writing  
📱 **Voice memos work too** if writing feels hard  
🔄 **Do this daily** to prevent mental buildup  
✅ **Highlight action items** after the dump is complete`
  }

  if (name.includes('Habit') && (name.includes('Stack') || name.includes('Anchor'))) {
    return `## 🔗 The Habit Attachment Strategy

You want to remember to take your vitamins, but somehow you keep forgetting even though the bottle is RIGHT THERE on the counter staring at you.

### How Habit Stacking Works:
**After I [EXISTING HABIT], I will [NEW HABIT]**

### Real-Life Example:
❌ **Doesn't work:** "I need to remember to take vitamins"  
✅ **Works:** "After I pour my morning coffee, I will take my vitamins"

### The Setup Process:
1. **Identify a rock-solid existing habit** (something you do every day without thinking)
2. **Pick your new tiny habit** (start smaller than you think!)
3. **Create the connection:** "After I _____, I will _____"
4. **Put visual cues** in place to remind you
5. **Practice the sequence** for 2-3 weeks until it feels automatic

### More Stack Examples:
🦷 "After I brush my teeth, I will write one thing I'm grateful for"  
📱 "After I plug in my phone to charge, I will set out tomorrow's clothes"  
☕ "After I start the coffee maker, I will take my ADHD medication"

### Why This Works:
🧠 **Borrows momentum** from habits your brain already does automatically  
⚓ **Creates a reliable trigger** instead of relying on memory  
🔄 **Builds on existing neural pathways** rather than creating new ones from scratch

### Pro Tips:
📍 **Stack location matters** - do both habits in the same physical space  
📏 **Start TINY** - 30 seconds or less for the new habit  
🎯 **Be specific** about the trigger - "after I sit down" is vague, "after I pour coffee" is clear  
⚡ **Celebrate the connection** - acknowledge when you remember to do the stack!`
  }

  // Default example generator for other strategies
  return generateDefaultExample(name, subtitle, use_case, emoji)
}

// Default example generator for strategies not covered above
const generateDefaultExample = (name: string, subtitle: string, use_case: string, emoji: string): string => {
  const scenarios = [
    {
      context: "work deadline stress",
      before: "Staring at your computer screen, paralyzed by the size of the project, checking social media instead of working",
      after: "Clear next steps, momentum building, actually making progress you can see"
    },
    {
      context: "morning routine chaos", 
      before: "Running late again, can't find your keys, feeling scattered and defeated before the day even starts",
      after: "Smooth morning flow, everything in its place, leaving on time feeling calm and prepared"
    },
    {
      context: "overwhelming to-do list",
      before: "Mental list keeps growing, tasks feel impossible, avoiding everything and feeling guilty about it", 
      after: "Clear priorities, manageable chunks, steady progress that feels achievable"
    }
  ]

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]

  return `## ${emoji} ${name} in Action

${scenario.before}. Sound familiar? This is where ${name} can completely change your experience.

### How This Strategy Helps:
Using ${name} when ${use_case}, you can transform overwhelm into manageable action.

### Step-by-Step Process:
1. **Recognize the stuck moment** - notice when you're avoiding or feeling overwhelmed
2. **Apply ${name}** - use this specific technique to break through
3. **Take the first small action** - momentum starts with movement
4. **Build on the success** - let one win lead to the next

### The Transformation:
**Before:** ${scenario.before}  
**After:** ${scenario.after}

### Why This Works for ADHD Brains:
✨ **Reduces overwhelm** by breaking things into smaller pieces  
🎯 **Provides clear structure** when executive function is struggling  
⚡ **Creates momentum** that your brain can build on  
🧠 **Works WITH your ADHD** instead of fighting against it

### Pro Tips:
🔄 **Start smaller than you think** - success builds on success  
📱 **Set reminders** until this becomes automatic  
🎉 **Celebrate the small wins** - your brain needs the dopamine hit  
💪 **Be patient with yourself** - new habits take time to stick

### Common Obstacles & Solutions:
❓ **"I forgot to use this strategy"** → Set phone reminders or visual cues  
❓ **"It didn't work perfectly"** → Progress, not perfection - adjust and try again  
❓ **"I don't have time"** → Start with just 30 seconds - something is better than nothing`
}

// Main function to fix all examples
async function fixAllExamples() {
  console.log('🎯 Fixing Strategy Examples with ADHD-Friendly Content')
  console.log('=====================================================')

  try {
    // Get all strategies from database
    const { data: strategies, error } = await supabase
      .from('strategies')
      .select('id, name, subtitle, use_case, description')

    if (error) {
      console.error('❌ Error fetching strategies:', error.message)
      return
    }

    console.log(`📊 Processing ${strategies.length} strategies...`)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i]
      
      try {
        // Generate new ADHD-friendly example
        const newExample = generateExample(strategy)
        
        // Update strategy in database
        const { error: updateError } = await supabase
          .from('strategies')
          .update({ example: newExample })
          .eq('id', strategy.id)

        if (updateError) {
          console.error(`❌ Failed to update ${strategy.name}:`, updateError.message)
          errorCount++
        } else {
          console.log(`✅ Updated: ${strategy.name}`)
          successCount++
        }

        // Progress update every 25 strategies
        if ((i + 1) % 25 === 0) {
          console.log(`📈 Progress: ${i + 1}/${strategies.length} strategies processed`)
        }

      } catch (error) {
        console.error(`❌ Error processing ${strategy.name}:`, error)
        errorCount++
      }
    }

    console.log('\n🎉 Example fix completed!')
    console.log(`✅ Successfully updated: ${successCount} strategies`)
    if (errorCount > 0) {
      console.log(`❌ Failed updates: ${errorCount}`)
    }

    console.log('\n📝 Examples now include:')
    console.log('  • ## H2 headers with emojis for visual anchoring')
    console.log('  • Real ADHD scenarios with specific details')
    console.log('  • Before/after transformations')
    console.log('  • Why it works explanations for brain differences')
    console.log('  • Pro tips for common obstacles')
    console.log('  • Conversational tone that acknowledges real challenges')

  } catch (error) {
    console.error('❌ Failed to fix examples:', error)
  }
}

// Run the fix
fixAllExamples().catch(console.error)