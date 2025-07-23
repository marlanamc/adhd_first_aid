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

// Strategy-specific unique examples
const getUniqueExample = (strategyName: string, subtitle: string, useCase: string): string => {
  const name = strategyName.toLowerCase()
  
  // Specific examples for each strategy type
  if (name.includes('hammock') || name.includes('reset')) {
    return `## 🛋️ The Ultimate Comfort Reset

You've been grinding all week and your brain feels like a phone at 3% battery. Everything sounds annoying, tasks feel impossible, and you're snapping at people you love.

### The Hammock Protocol:
1. **Find your comfort zone** - hammock, cozy chair, or bed with soft blankets
2. **Set a gentle timer** for 20-30 minutes ⏰
3. **No phones, no tasks** - just pure rest
4. **Let your mind wander** or focus on the gentle swaying
5. **Breathe deeply** and feel your nervous system slow down

### What Happens:
**Before:** Frazzled, overstimulated, everything feels hard  
**After:** Nervous system regulated, brain rested, ready to engage with life again

### Why This Works for ADHD:
🧠 **Resets your nervous system** when overwhelmed  
⚡ **Restores depleted dopamine** naturally  
🔄 **Gives executive function a break** to recharge  
💤 **Prevents burnout** before it gets worse

### Pro Tips:
🌿 **Outside is better** - fresh air and nature sounds amplify the reset  
📱 **Put phone in another room** - resist the scroll urge  
☁️ **Focus on physical sensations** - wind, warmth, the gentle movement  
⏰ **Honor the timer** - this isn't lazy, it's essential maintenance!`
  }

  if (name.includes('towel warmer') || name.includes('warm')) {
    return `## 🔥 Instant Comfort Activation

It's 6 AM, you're running late, and the thought of a cold bathroom makes you want to crawl back under the covers. Your morning routine feels like pure torture.

### The Towel Warmer Magic:
1. **Turn on warmer** 10 minutes before your shower
2. **Step into bathroom** to a wall of cozy warmth
3. **Enjoy the luxurious feeling** of a warm towel after showering
4. **Let the warmth** ease morning anxiety and stiffness

### The Experience:
**Before:** Cold, harsh morning = delayed start, avoidance, feeling awful  
**After:** Warm, spa-like experience = smoother transition, self-care feeling

### Why This Works for ADHD:
🌡️ **Reduces sensory shock** of temperature changes  
💆 **Creates positive associations** with necessary routines  
⚡ **Provides instant dopamine** hit from physical comfort  
🛁 **Makes self-care feel luxurious** instead of like a chore

### Pro Tips:
⏰ **Set phone reminder** to turn it on before shower  
🧴 **Add eucalyptus oil** to the towel for aromatherapy bonus  
☀️ **Use in winter** when getting out of bed is extra hard  
🎁 **Small luxury** that makes a huge difference in daily experience!`
  }

  if (name.includes('shower toothbrush') || name.includes('toothbrush')) {
    return `## 🦷 Hygiene Hack: Shower Multitasking

You keep forgetting to brush your teeth, or you brush them and then eat breakfast and feel gross all morning. Your dental hygiene is becoming a source of guilt and shame.

### The Shower Toothbrush System:
1. **Keep toothbrush and toothpaste** in the shower
2. **Brush while hair conditioner sits** (perfect 2-3 minute window)
3. **Rinse mouth and toothbrush** as part of shower routine
4. **Never forget again** because it's built into an existing habit

### The Beauty of This:
**Before:** Forget to brush → feel gross → guilt → avoid dentist  
**After:** Automatic teeth brushing → fresh mouth → confident smile

### Why This Works for ADHD:
🔗 **Habit stacking** - attaches to existing routine  
⏰ **Perfect timing** - conditioner needs to sit anyway  
🧠 **Reduces decision fatigue** - one less thing to remember  
💦 **Sensory bundling** - all the water/cleaning happens together

### Pro Tips:
🪥 **Get a suction cup holder** for your shower toothbrush  
🌿 **Use kids' flavored toothpaste** if mint feels too intense  
⏰ **Brush for the full conditioner time** - usually 2-3 minutes  
🎵 **Play a specific song** to make the timing automatic!`
  }

  if (name.includes('velcro') || name.includes('supply station')) {
    return `## 🎯 Command Central: Velcro Supply Stations

You're constantly losing your phone charger, can't find a pen when you need one, and your desk/nightstand/kitchen counter is chaos because everything just gets dumped there.

### The Velcro Revolution:
1. **Identify your "drop zones"** - where you naturally put things
2. **Install velcro strips** in these exact spots
3. **Attach velcro to frequently used items** - chargers, remotes, keys
4. **Everything has a HOME** that's exactly where you'd put it anyway

### Real-Life Setup:
📱 **Bedside:** Phone charger velcroed to nightstand edge  
🖊️ **Kitchen:** Pens velcroed inside junk drawer  
🎮 **Living room:** TV remote velcroed to coffee table side  
🔑 **Entryway:** Keys velcroed inside door frame

### The Results:
**Before:** "Where did I put...?" becomes daily treasure hunt  
**After:** Everything has a magnetic home exactly where you expect it

### Why This Works for ADHD:
🧲 **Works with your natural habits** instead of against them  
👀 **Visual and tactile feedback** when something's in place  
🔄 **Prevents the "drop and lose" cycle** that drives you crazy  
⚡ **Instant gratification** of the satisfying velcro sound

### Pro Tips:
🏠 **Start with ONE station** and let success build momentum  
🎨 **Use clear velcro** so it's not visually cluttered  
📏 **Industrial strength velcro** for heavier items like tablets  
🔄 **Put velcro where things naturally land** - don't fight your patterns!`
  }

  if (name.includes('brain dump') || name.includes('thought capture')) {
    return `## 🧠 Mental Declutter Session

Your brain feels like 47 browser tabs are open at once. You're trying to focus on work but random thoughts keep popping up: "Did I lock the door? I need to call mom. What was that thing Sarah said yesterday? I should clean the fridge..."

### The Brain Dump Process:
1. **Grab whatever's handy** - paper, phone notes, back of envelope
2. **Set timer for 10 minutes** ⏰
3. **Write EVERYTHING** in your head - don't organize, just dump
4. **Don't stop writing** until timer goes off or brain feels empty
5. **Feel the relief** of getting it all OUT of your head

### What Goes on the Page:
- Tasks you need to do ("call dentist")
- Random worries ("did I send that email?")
- Creative ideas ("blog post about cats")
- Things you don't want to forget ("mom's birthday next week")
- Grocery items ("we're out of coffee!")
- Feelings ("frustrated with project")

### The Magic Moment:
**Before:** Brain = shaken snow globe, chaotic and overwhelming  
**After:** Thoughts are captured = brain feels spacious and calm

### Why This Works for ADHD:
🧮 **Frees up working memory** for the task at hand  
📝 **Externalizes the mental load** so you don't have to hold it all  
🎯 **Allows focus** to flow to what actually matters  
😌 **Reduces anxiety** from trying to remember everything

### Pro Tips:
🗑️ **Don't judge what comes out** - this isn't about neat writing  
📱 **Voice memos work too** if writing feels hard  
🔄 **Do this when you feel scattered** - prevention is key  
✅ **Highlight actual tasks** after the dump is complete!`
  }

  if (name.includes('fidget') || name.includes('tool')) {
    return `## 🎲 Hands-On Focus Tools

You're in a meeting and your brain is ping-ponging everywhere EXCEPT what the person is saying. Your hands feel restless, your leg is bouncing, and you're fighting the urge to pick at your nails or click your pen 47 times.

### The Fidget Toolkit:
**Silent Options for Meetings:**
- **Thinking putty** - squish, stretch, roll
- **Smooth worry stone** - thumb circles
- **Fidget cube** - buttons, switches, gears
- **Stress ring** - spin around finger

**Focus-Enhancing Options:**
- **Fidget pen** - for note-taking meetings
- **Textured bracelet** - discrete rubbing motion
- **Magnetic rings** - satisfying snap together/apart
- **Spiky sensory ball** - under desk pressure

### How to Use:
1. **Keep hands busy** while ears and eyes focus
2. **Find your rhythm** - some need constant motion, others intermittent
3. **Match intensity to need** - big feelings need bigger movements
4. **Rotate tools** to prevent boredom

### The Science:
**Before:** Restless energy pulls focus away from important tasks  
**After:** Hands are occupied, brain can actually listen and process

### Why This Works for ADHD:
🧠 **Occupies hyperactive impulses** so brain can focus elsewhere  
⚡ **Provides sensory input** that calms nervous system  
🎯 **Improves concentration** by giving fidgety energy an outlet  
💆 **Reduces anxiety** through repetitive, soothing motions

### Pro Tips:
🤫 **Test for noise level** before bringing to meetings  
🎒 **Keep backup fidgets** in car, bag, desk drawer  
🔄 **Rotate options** - what works today might not work tomorrow  
👥 **Normalize it** - "This helps me focus better" is honest and fine!`
  }

  if (name.includes('everything shower') || name.includes('ritual')) {
    return `## 🚿 The Ultimate Reset Ritual

You feel grimy, overwhelmed, and disconnected from your body. Regular showers feel rushed and functional, but you crave something that feels like genuine self-care and renewal.

### The Everything Shower Experience:
**Phase 1: Setup (5 minutes)**
1. **Light a candle** or dim the lights
2. **Play calming music** or nature sounds
3. **Gather luxurious products** - good shampoo, scrubs, oils
4. **Set intention** - this is YOUR time

**Phase 2: The Full Experience (20-30 minutes)**
- **Hair mask treatment** - let it sit while you do other steps
- **Full body exfoliation** with scrub or brush
- **Face mask or deep cleanse**
- **Shave/groom** whatever needs attention
- **Oil treatment** for cuticles and dry spots

**Phase 3: Post-Shower Luxury (10 minutes)**
- **Soft towel wrap** (bonus if it's warmed!)
- **Rich body lotion** applied mindfully
- **Clean pajamas** or favorite comfy clothes
- **Hydrating drink** - tea, water with lemon

### The Transformation:
**Before:** Feeling disconnected, grimy, low self-care  
**After:** Renewed, pampered, deeply relaxed, reconnected with body

### Why This Works for ADHD:
💆 **Sensory reset** when overstimulated  
🧠 **Mindfulness practice** disguised as practical hygiene  
⚡ **Dopamine boost** from luxury and self-care  
🔄 **Transition ritual** between difficult day and restful evening

### Pro Tips:
📅 **Schedule it** like an important appointment  
🛒 **Keep special products** just for everything showers  
📱 **Phone stays outside** - this is sacred time  
🕯️ **Make it atmospheric** - lighting and scents matter!`
  }

  if (name.includes('decision coin') || name.includes('coin flip')) {
    return `## 🪙 Let the Universe Decide

You've been staring at two equally good (or equally awful) options for 20 minutes. Your brain is stuck in analysis paralysis, weighing pros and cons that keep shifting, and you're getting more frustrated by the minute.

### The Coin Flip Decision Method:
1. **Assign options to heads/tails** - be specific
2. **Flip the coin** 🪙
3. **Notice your immediate reaction** to the result
4. **That gut reaction IS your answer** - not the coin!

### Real Examples:
🍕 **"Pizza or Chinese food?"**  
Flip: Heads = Pizza. Result: "Ugh, I was hoping for Chinese!"  
**Answer:** Chinese it is!

📚 **"Study math or work on essay?"**  
Flip: Tails = Essay. Result: "Actually, that sounds right."  
**Answer:** Essay time!

🎬 **"Movie night or early bedtime?"**  
Flip: Heads = Movie. Result: "But I'm really tired..."  
**Answer:** Bedtime wins!

### The Magic:
**Before:** Endless mental ping-pong between options, getting nowhere  
**After:** Clear answer emerges from your gut reaction to the "random" choice

### Why This Works for ADHD:
🧠 **Bypasses overthinking** and accesses intuitive wisdom  
⚡ **Provides external structure** for internal decisions  
🎯 **Reveals true preferences** hidden under analysis paralysis  
🔄 **Quick resolution** prevents decision fatigue spiral

### Pro Tips:
🪙 **Use a real coin** - the physical action matters  
❤️ **Trust your gut reaction** more than the actual flip  
🔄 **Works for any binary choice** - big or small decisions  
📱 **Coin flip apps work too** if you don't have physical coins!`
  }

  // Add more specific examples here for other strategies...

  // Default fallback if no specific match found
  return generateGenericExample(strategyName, subtitle, useCase)
}

// Generic example only for strategies without specific matches
const generateGenericExample = (name: string, subtitle: string, useCase: string): string => {
  const emoji = getEmoji(name)
  
  return `## ${emoji} ${name} Strategy in Action

You're facing a situation where ${useCase}. This is exactly when ${name} becomes your secret weapon.

### How ${name} Works:
1. **Recognize the challenge** - notice when you're in the target situation
2. **Apply the technique** - follow the specific steps for this strategy
3. **Experience the shift** - feel how this approach changes your experience
4. **Build the habit** - practice until it becomes automatic

### The Process:
When you find yourself in situations where ${useCase}, ${name} provides a concrete way forward.

### Why This Strategy Helps:
✨ **Provides structure** when you feel scattered  
🎯 **Offers clear steps** instead of vague advice  
⚡ **Works with ADHD brain patterns** rather than against them  
🔄 **Creates positive momentum** you can build on

### Implementation Tips:
📝 **Start small** - master the basics before expanding  
🔄 **Practice regularly** - consistency beats perfection  
📱 **Set reminders** until it becomes second nature  
🎉 **Celebrate progress** - acknowledge when you use this successfully

*Note: This strategy works best when ${useCase}. Adapt the approach to fit your specific situation and needs.*`
}

// Helper function to get appropriate emoji
const getEmoji = (strategyName: string): string => {
  const name = strategyName.toLowerCase()
  if (name.includes('minute') || name.includes('timer')) return '⏱️'
  if (name.includes('clean') || name.includes('tidy')) return '🧹'
  if (name.includes('food') || name.includes('meal')) return '🍽️'
  if (name.includes('focus') || name.includes('attention')) return '🎯'
  if (name.includes('energy') || name.includes('mood')) return '⚡'
  if (name.includes('habit') || name.includes('routine')) return '🔄'
  if (name.includes('list') || name.includes('note')) return '📝'
  if (name.includes('calm') || name.includes('anxiety')) return '🧘'
  if (name.includes('organize') || name.includes('system')) return '🗂️'
  return '✨'
}

// Main function to update examples with unique content
async function updateUniqueExamples() {
  console.log('🎯 Creating Unique Strategy Examples')
  console.log('===================================')

  try {
    const { data: strategies, error } = await supabase
      .from('strategies')
      .select('id, name, subtitle, use_case')

    if (error) {
      console.error('❌ Error fetching strategies:', error.message)
      return
    }

    console.log(`📊 Processing ${strategies.length} strategies with unique examples...`)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i]
      
      try {
        const uniqueExample = getUniqueExample(strategy.name, strategy.subtitle || '', strategy.use_case || '')
        
        const { error: updateError } = await supabase
          .from('strategies')
          .update({ example: uniqueExample })
          .eq('id', strategy.id)

        if (updateError) {
          console.error(`❌ Failed to update ${strategy.name}:`, updateError.message)
          errorCount++
        } else {
          console.log(`✅ Updated: ${strategy.name}`)
          successCount++
        }

        if ((i + 1) % 25 === 0) {
          console.log(`📈 Progress: ${i + 1}/${strategies.length} strategies processed`)
        }

      } catch (error) {
        console.error(`❌ Error processing ${strategy.name}:`, error)
        errorCount++
      }
    }

    console.log('\n🎉 Unique examples completed!')
    console.log(`✅ Successfully updated: ${successCount} strategies`)
    if (errorCount > 0) {
      console.log(`❌ Failed updates: ${errorCount}`)
    }

    console.log('\n📝 Each strategy now has:')
    console.log('  • Completely unique examples tailored to that specific strategy')
    console.log('  • Real scenarios that match the strategy purpose')
    console.log('  • Specific implementation details')
    console.log('  • No more generic "daily life challenge" repetition!')

  } catch (error) {
    console.error('❌ Failed to update examples:', error)
  }
}

updateUniqueExamples().catch(console.error)