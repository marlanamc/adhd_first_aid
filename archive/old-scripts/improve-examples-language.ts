import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify'

// ADHD-friendly example templates for different strategy types
const getADHDFriendlyExample = (strategyName: string, subtitle: string, useCase: string, description: string): string => {
  const name = strategyName.toLowerCase()
  
  // Extract emoji from description if present
  const emojiMatch = description.match(/^#+\s*([🌱🧰⏰🎯🧘‍♀️🔄🧹✨🎲🚿🪙💪🎊]+)/)
  const emoji = emojiMatch ? emojiMatch[1] : '✨'
  
  // Strategy-specific examples
  if (name.includes('1% better') || name.includes('incremental')) {
    return `### ${emoji} ${strategyName}

**Why you might use this:**
You're staring at a massive goal feeling totally overwhelmed. The "just do everything at once" approach has burned you out before, and you need something that actually sticks.

**How to do it:**
- Pick ONE tiny thing to improve today (seriously, just one!)
- Make it so small you can't fail (like 5 jumping jacks instead of "get fit")
- Do it consistently rather than perfectly
- Build on yesterday's win, even if it was microscopic

**Why it helps:**
ADHD brains love quick wins and hate feeling overwhelmed. Starting stupidly small bypasses that "all or nothing" thinking that usually derails us.

**Bonus tip:**
Track your 1% wins in your phone notes. Seeing "Day 12 of doing something" feels surprisingly amazing!`
  }
  
  if (name.includes('2-minute') || name.includes('2 minute')) {
    return `### ${emoji} ${strategyName}

**Why you might use this:**
Your to-do list is haunting you with tiny tasks that somehow feel impossible to start. Email replies, putting dishes away, quick calls - they're piling up and making you feel scattered.

**How to do it:**
- If something takes less than 2 minutes, do it NOW
- Don't add it to a list, don't save it for later
- Just knock it out immediately
- For bigger tasks, ask "What 2-minute piece can I do right now?"

**Why it helps:**
ADHD brains struggle with task switching, so handling quick stuff immediately prevents that mental clutter buildup. Plus, instant completion = instant dopamine hit!

**Bonus tip:**
Set a 2-minute timer and race yourself. Making it a game makes boring tasks way more bearable.`
  }
  
  if (name.includes('5-4-3-2-1') && name.includes('launch')) {
    return `### ${emoji} ${strategyName}

**Why you might use this:**
You're stuck in that awful "I need to do this thing but my body won't move" limbo. Your brain knows what to do, but there's this invisible force field stopping you.

**How to do it:**
- Count down out loud: "5... 4... 3... 2... 1..."
- On "1" immediately move your body toward the task
- Don't think, just move (even if it's just standing up)
- Start with the tiniest first step possible

**Why it helps:**
The countdown tricks your brain into action mode before it can spiral into overthinking. Physical movement breaks the freeze response that keeps us stuck.

**Bonus tip:**
Make it dramatic! Count down like you're launching a rocket. The sillier it feels, the more likely you are to actually do it.`
  }
  
  if (name.includes('5-4-3-2-1') && name.includes('grounding')) {
    return `### ${emoji} ${strategyName}

**Why you might use this:**
Everything feels overwhelming and you're spiraling. Your thoughts are racing, your chest is tight, and you need to get back to earth ASAP.

**How to do it:**
- 5 things you can see (blue mug, that crack in the wall...)
- 4 things you can touch (soft sweater, cool phone, rough table...)
- 3 things you can hear (traffic, AC humming, your neighbor's dog...)
- 2 things you can smell (coffee, that candle you forgot about...)
- 1 thing you can taste (gum, leftover coffee, even just your mouth)

**Why it helps:**
Anxiety pulls us into our heads, but this forces us back into our actual bodies. ADHD brains respond really well to concrete, sensory tasks when emotions get overwhelming.

**Bonus tip:**
Save this in your phone as "54321" so you can find it quickly when you're panicking.`
  }
  
  if (name.includes('hammock') || name.includes('reset')) {
    return `### ${emoji} ${strategyName}

**Why you might use this:**
You're running on empty and everything feels like too much. You've been pushing through for days and your brain is basically a phone at 3% battery.

**How to do it:**
- Find the coziest spot you can (hammock, bed, that perfect couch corner)
- Set a timer for 20-30 minutes so you don't stress about time
- No phones, no tasks, no productivity - just pure rest
- Let your mind wander or focus on gentle movement/breathing

**Why it helps:**
ADHD brains burn through energy faster than neurotypical ones. This isn't laziness - it's essential maintenance that prevents total burnout.

**Bonus tip:**
Keep a "hammock kit" ready: soft blanket, water bottle, maybe some calming music queued up. Make it as frictionless as possible.`
  }
  
  if (name.includes('brain dump') || name.includes('thought capture')) {
    return `### ${emoji} ${strategyName}

**Why you might use this:**
Your brain feels like it has 47 browser tabs open. Random thoughts keep popping up, you're worried you'll forget important stuff, and you can't focus on anything because EVERYTHING feels urgent.

**How to do it:**
- Grab whatever's handy (phone notes, random paper, back of envelope)
- Set a timer for 10 minutes
- Write down EVERY thought in your head - don't organize, just dump
- Include worries, tasks, random ideas, everything
- Stop when the timer goes off (or your brain feels empty)

**Why it helps:**
ADHD working memory is like trying to juggle while riding a unicycle. Getting thoughts out of your head frees up mental space for actually doing things.

**Bonus tip:**
Don't judge what comes out. "Remember to buy socks" and "existential crisis about life choices" can live on the same list.`
  }
  
  if (name.includes('fidget') || name.includes('tool')) {
    return `### ${emoji} ${strategyName}

**Why you might use this:**
You're in a meeting/class/call and your body is vibrating with restless energy. Your leg is bouncing, you're picking at your nails, and your brain keeps ping-ponging away from what you're supposed to focus on.

**How to do it:**
- Keep a few silent options ready (thinking putty, smooth stone, fidget cube)
- Choose based on your need: subtle for meetings, bigger movements for solo work
- Let your hands stay busy while your brain focuses elsewhere
- Don't fight the need to move - work with it

**Why it helps:**
ADHD brains often need movement to focus. Giving your hands something to do can actually help your mind pay attention to what matters.

**Bonus tip:**
Rotate your fidget tools regularly - ADHD brains get bored easily, so having options keeps them effective.`
  }
  
  if (name.includes('decision') && name.includes('coin')) {
    return `### ${emoji} ${strategyName}

**Why you might use this:**
You've been staring at two equally good (or equally terrible) options for way too long. Your brain is stuck in analysis paralysis and you're getting more frustrated by the minute.

**How to do it:**
- Assign each option to heads or tails
- Flip the coin
- Pay attention to your gut reaction to the result
- That reaction IS your answer (not the actual coin flip!)

**Why it helps:**
Sometimes ADHD brains get stuck overthinking when we already know what we want deep down. The coin trick helps bypass all that mental noise.

**Bonus tip:**
If you feel disappointed with the result, boom - you know what you actually wanted. If you feel relieved, that's your answer too!`
  }
  
  if (name.includes('everything shower') || name.includes('shower ritual')) {
    return `### ${emoji} ${strategyName}

**Why you might use this:**
You feel disconnected from your body, overwhelmed by life, and regular showers feel rushed and functional. You're craving something that feels like actual self-care.

**How to do it:**
- Block out 30-45 minutes when you won't be interrupted
- Set the mood: dim lights, good music, maybe a candle
- Do ALL the things: hair mask, exfoliate, face mask, the works
- Move slowly and mindfully - this is YOUR time

**Why it helps:**
ADHD brains often feel scattered and disconnected. This ritual forces you to slow down, be present in your body, and practice self-care in a structured way.

**Bonus tip:**
Keep "everything shower" supplies in a separate basket so you don't have to hunt for stuff when you need this reset.`
  }
  
  // Generic template for strategies without specific examples
  return `### ${emoji} ${strategyName}

**Why you might use this:**
${useCase || "You're feeling stuck or overwhelmed and need a concrete way forward."}

**How to do it:**
- Start with the smallest possible step
- Focus on progress, not perfection
- Give yourself permission to adapt this to your needs
- Celebrate when you use this strategy (seriously!)

**Why it helps:**
This strategy works with your ADHD brain instead of against it, providing structure when everything feels chaotic.

**Bonus tip:**
Remember that using ANY coping strategy is a win, even if it doesn't work perfectly the first time.`
}

async function improveExamplesLanguage() {
  console.log('✨ Improving examples with ADHD-friendly language...')
  console.log('=================================================')

  const inputFile = path.join(__dirname, '..', 'strategies_final_markdown.csv')
  const outputFile = path.join(__dirname, '..', 'strategies_adhd_friendly.csv')

  // Read the CSV file
  const fileContent = fs.readFileSync(inputFile, 'utf-8')

  const parser = parse(fileContent, {
    columns: (headers: string[]) => headers.map(h => h.trim()),
    skip_empty_lines: true,
    trim: true
  })

  const strategies: any[] = []
  for await (const record of parser) {
    strategies.push(record)
  }

  console.log(`📊 Processing ${strategies.length} strategies...`)

  let improvedCount = 0

  // Improve each strategy's example
  for (const strategy of strategies) {
    if (strategy.Name && strategy.Name.trim()) {
      const improvedExample = getADHDFriendlyExample(
        strategy.Name,
        strategy.subtitle || '',
        strategy.use_case || '',
        strategy.description || ''
      )

      // Only update if we have content to update
      if (improvedExample && improvedExample.trim()) {
        strategy.example = improvedExample
        improvedCount++
        console.log(`✅ Improved: ${strategy.Name}`)
      }
    }
  }

  // Write the improved CSV
  const stringifier = stringify({
    header: true,
    columns: Object.keys(strategies[0])
  })

  const outputStream = fs.createWriteStream(outputFile)
  stringifier.pipe(outputStream)

  for (const strategy of strategies) {
    stringifier.write(strategy)
  }
  stringifier.end()

  await new Promise((resolve) => {
    outputStream.on('finish', resolve)
  })

  console.log('\n🎉 ADHD-friendly language improvement completed!')
  console.log(`✅ Improved ${improvedCount} strategy examples`)
  console.log(`📁 Output saved to: strategies_adhd_friendly.csv`)
  console.log('\n📝 Language improvements:')
  console.log('  • Used "you" language for personal connection')
  console.log('  • Broke content into skimmable chunks')
  console.log('  • Added emotional validation and support')
  console.log('  • Included practical bonus tips')
  console.log('  • Made language conversational and encouraging')
}

improveExamplesLanguage().catch(console.error)