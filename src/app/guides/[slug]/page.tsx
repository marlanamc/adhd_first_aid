import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getGuideBySlug, type Guide } from '@/lib/markdown'
import NewGuideClient from './NewGuideClient'

interface GuidePageProps {
  params: {
    slug: string
  }
}

// Sample data for guides since we're using static data for now
const sampleGuides: { [key: string]: Guide } = {
  'habit-stacking-vs-bundling': {
    title: 'Habit Stacking vs Habit Bundling',
    category: 'Task Help',
    emoji: '🔗',
    slug: 'habit-stacking-vs-bundling',
    description: 'Learn the difference between these two powerful ADHD-friendly habit techniques and when to use each one.',
    tags: ['habits', 'productivity', 'executive function'],
    difficulty: 'beginner',
    readTime: '5 min',
    content: `# Habit Stacking vs Habit Bundling

Both techniques help ADHD brains build sustainable routines, but they work in different ways.

## What is Habit Stacking?

**Habit stacking** links a new habit to an existing strong habit using the formula: "After I [existing habit], I will [new habit]."

### Examples:
- After I pour my morning coffee, I will take my ADHD medication
- After I brush my teeth, I will lay out tomorrow's clothes
- After I sit down at my desk, I will write down my top 3 priorities

### Why it works for ADHD:
- **Uses existing neural pathways** - your brain already has the trigger habit automated
- **Reduces decision fatigue** - no need to remember when to do the new habit
- **Creates clear cause-and-effect** - ADHD brains love concrete connections

## What is Habit Bundling?

**Habit bundling** pairs something you *need* to do with something you *want* to do.

### Examples:
- Only listen to your favorite podcast while doing dishes
- Only watch Netflix while folding laundry
- Only have your special coffee drink while doing admin tasks

### Why it works for ADHD:
- **Provides immediate dopamine** - the reward is built into the task
- **Makes boring tasks enjoyable** - perfect for ADHD brains that need stimulation
- **Reduces avoidance** - you're not just doing the hard thing, you're getting something fun too

## When to Use Each

### Use Habit Stacking When:
- ✅ You want to build a morning or evening routine
- ✅ The new habit is quick (under 2 minutes)
- ✅ You have a very consistent existing habit to anchor to
- ✅ The new habit doesn't require much mental energy

### Use Habit Bundling When:
- ✅ The task feels overwhelming or boring
- ✅ You have strong preferences for entertainment/rewards
- ✅ The task takes longer than a few minutes
- ✅ You tend to avoid or procrastinate on the task

## Pro Tips for ADHD Success

1. **Start ridiculously small** - make the new habit so easy you can't fail
2. **Choose strong anchor habits** - things you do without thinking (like checking your phone)
3. **Be flexible** - if it's not working after 2 weeks, adjust rather than quit
4. **Stack multiple small habits** - create a chain of 3-4 mini habits

## Common ADHD Mistakes to Avoid

❌ **Making the new habit too big** - "After I wake up, I will do a 30-minute workout"

✅ **Start tiny** - "After I wake up, I will do 5 jumping jacks"

❌ **Choosing weak anchor habits** - "After I feel motivated, I will..."

✅ **Pick automatic habits** - "After I start my car, I will..."

---

*Remember: The goal isn't perfection. It's progress. Pick one technique and try it for 2 weeks.*`
  },
  'mentalfog': {
    title: 'Cognitive & Overload Guide',
    category: 'Feelings Support',
    emoji: '😶‍🌫️',
    slug: 'mentalfog',
    description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies',
    tags: ['feelings', 'overwhelm', 'executive function'],
    difficulty: 'beginner',
    readTime: '5 min',
    content: `# Cognitive & Overload Guide 

> Mental fog and overwhelm suck. When you're stuck in it, it can feel like your brain is buffering, spinning, or just... offline. This guide walks you through what's happening and what you can _actually do_ about it, starting now.

---

### 🌀 What Mental Fog Feels Like

- Like your brain is flipping channels nonstop
- Like your thoughts are swimming in glue
- Like you're tired _and_ restless _and_ scattered all at once
- You might start 10 things and finish none. Or you zone out mid-thought.

---

### 🧷 Why It Happens (ADHD Style)

- **🧠 Executive Dysfunction**: Planning, prioritizing, and starting tasks feels impossible
- **🗒 Working Memory**: Like sticky notes that blow away before you use them
- **🎯 Attention Dysregulation**: You can't filter what's important vs. background noise
- **🔊 Sensory Overload**: Everything is _too much_ all at once
- **🔁 Analysis Paralysis**: Too many options = no action
- **💥 Emotional Flooding**: Intense feelings can lead to shutdown

---

## 🧘‍♀️ Step 1: Soothe the Storm

You can't think your way out of mental fog. First, calm your body and brain.

### 🩺 Regulate Your Nervous System

- **Rest** (yes, even just 10 mins)
- **Hydrate & eat** something
- **Deep breathing** (inhale 5, exhale 8)
- **Move your body** (walk, stretch, shake it out)
- **Quiet the senses** (noise-canceling headphones, soft lighting, alone time)

---

### 📝 Externalize the Chaos

- **Brain Dump** → write _everything_ down, no filter
- **Talk it out** → friend, coach, voice notes
- **Clear the fog** → seeing it out loud often brings clarity

---

### 🧩 Simplify the Next Move

- Do 1 thing. Make it small.  
  _Examples: open the laptop, fill your water, delete 3 emails_
- Pick what's easiest or most interesting
- Repeat this mantra: **"Good enough is great."**

---

## 🧱 Step 2: Build a Stronger Base

Once you're out of the fog, set up systems to catch you _next time_.

### 📦 Externalize Everything

- Your brain ≠ a to-do list
- Use **planners**, **calendar apps**, or **sticky notes**
- Centralize info: keep tasks and notes in 1–2 trusted places
- Try systems like PARA or a simple "Now / Next / Later" board

---

### 🏡 Shape Your Environment

- ADHD-friendly = distraction-minimized, tools visible, zones defined
- Add **visual cues** (e.g., timers, sticky notes, color codes)
- Create **checklists** for anything that repeats (morning routine, weekly review)

---

### ⏰ Design for Your Energy

- Notice when you have **brainpower** vs. **mush-brain**
- Block time for hard stuff during peak focus
- Use **transition rituals** (stretch, music, breath) between tasks
- Protect "buffer zones", downtime isn't wasted time

---

### 🤝 Lean on Support

- **Body doubling** (even virtual) makes hard tasks easier
- **ADHD coaching** for accountability & systems that stick
- Practice saying **"no"** and setting boundaries
- Join a community. You're not alone.

---

## 🔄 Step 3: Reflect & Adjust

Managing ADHD is an experiment, not a one-and-done solution.

- **Track what works**, energy, focus, tools, moods
- **Review your week**: What helped? What didn't? Why?
- **Adjust as needed**, what worked 2 weeks ago might need a refresh
- Prioritize curiosity over criticism

---

### 💬 Final Reminder:

You're not failing, you're learning.  
Mental fog isn't laziness. It's a signal. Listen to it with kindness. Then meet it with strategy.`
  },
  'dysregulation': {
    title: 'Dysregulation & Shutdown Guide',
    category: 'Feelings Support',
    emoji: '🧯',
    slug: 'dysregulation',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies',
    tags: ['feelings', 'regulation', 'nervous system'],
    difficulty: 'beginner',
    readTime: '6 min',
    content: `# Dysregulation & Shutdown Guide

> Dysregulation and shutdown aren't personal failures, they're signs that your brain and body are overwhelmed, out of sync, or out of fuel. This guide helps you understand what's happening and what to do next.

---

### ⚠️ What It Feels Like

- Feeling emotionally flooded or totally numb
- Thoughts looping endlessly, or no thoughts at all
- Bursting into anger or tears, or going completely quiet
- Stuck in bed, frozen in place, zoning out, or dissociating
- Feeling like your system just "crashed"

Whether you're pacing, panicking, or completely shutting down, these are signs that your nervous system is in overdrive or collapse, and needs support.

---

### 🧠 Why It Happens

Dysregulation is not bad behavior, it's a nervous system in distress.

**🔄 Common Causes:**
- **ADHD itself**: Emotional reactivity, poor impulse control, and working memory issues
- **Overwhelm**: Too many inputs, not enough clarity
- **Chronic stress or trauma**: Leads to faulty internal "alarm systems"
- **Sensory overload**: Lights, sounds, smells, or social pressure
- **Hormonal shifts**: Estrogen drops can intensify ADHD symptoms
- **Nervous system imbalance**: Fight-or-flight mode stuck "on"
- **Perfectionism, shame, or internal pressure**: Keeps your system locked in tension

---

## 🧭 Step 1: Notice the Signs Sooner

Your system often gives clues, learning to recognize them helps you intervene earlier.

### Try this:

- 🤯 Feeling mentally overloaded or emotionally fragile
- 😶 Numbness or blank mind
- 🧍 Frozen body or nonverbal state
- 🧠 Racing thoughts, circular thinking
- 🌋 Emotional spikes (rage, panic, despair)
- ❄️ Cold hands, tension, shallow breathing
- 🚨 Urge to shut out the world

💡 **Tip**: Emotional shutdown ≠ emotional weakness. It's a protective mode.

---

## 🫁 Step 2: Regulate First, Don't Push Through

Thinking, planning, and doing come after your nervous system calms down.

### Try this:

- 🌬 Box breathing or 6-3-8-3 pattern
- 🧘 Body scan or grounding exercise
- 🚶 Small movement: walk, stretch, bounce, shake
- 🎧 Noise-canceling headphones or calming music
- 🧺 Comfort inputs: blanket, favorite scent, warm drink
- 📝 Brain dump: List everything swirling in your mind

💡 **Tip**: You're not lazy, you're in a stress loop. Start with safety, not productivity.

---

## 🧱 Step 3: Reduce Pressure & Create Structure

Shutdown often comes from too much input, too few supports. Let's fix that.

### Try this:

- 🪜 Break tasks into absurdly small steps
- 🛑 Cut down decision points: meals, outfits, to-dos
- 📍 Define 1 clear, gentle priority
- 🧹 Clear clutter (visual, digital, emotional)
- 🧭 Use visual prompts or checklists, don't rely on memory

💡 **Tip**: A "launchpad" by the door, a labeled inbox, or a pre-filled checklist = mental relief.

---

## 🧠 Step 4: Understand What's Underneath

Sometimes stuck-ness is masking deeper distress. Curiosity helps you move forward without shame.

### Try this:

- ✏️ Journal or voice memo: "What feels heavy right now?"
- 🧠 Ask: Am I scared of failure? Am I trying to avoid a feeling?
- 💬 Use this sentence: "I'm having the thought that..." to create space
- 🧍 Name the emotion: Anger? Fear? Shame? Grief? All of the above?

💡 **Tip**: Resistance is a clue, not a character flaw.

---

## 🧩 Step 5: Build a Resilient System

You don't need more discipline, you need a structure that adapts to your needs.

### Try this:

- 🔁 Use rhythms, not rigid routines
- 📆 Do weekly reviews to reflect + adjust
- 💾 Externalize memory: calendar, checklist, inbox, timer
- 💬 Practice boundary scripts: "I need a pause to process"
- 📚 Learn from shutdowns: What triggered this? What helped?
- 🧘 Schedule rest before burnout
- 🙋‍♀️ Ask for help: body double, friend, coach, or therapist
- 🛠 Try "What if this were easy?" to shift mindset

💡 **Tip**: Success isn't "never getting dysregulated." It's noticing it early, and having a plan.

---

### 💬 Final Reminder:

You're not broken, you're human. Dysregulation is information, not failure. With practice, you can learn to work with your nervous system instead of against it.`
  }
}

async function getGuide(slug: string): Promise<Guide | null> {
  try {
    // First try to load from markdown files
    const loadedGuide = getGuideBySlug(slug)
    if (loadedGuide) {
      return loadedGuide
    } else {
      // Fallback to sample data
      const sampleGuide = sampleGuides[slug]
      if (sampleGuide) {
        return sampleGuide
      }
    }
  } catch (error) {
    console.error('Error loading guide:', error)
    // Try sample data as fallback
    const sampleGuide = sampleGuides[slug]
    if (sampleGuide) {
      return sampleGuide
    }
  }
  return null
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = await getGuide(params.slug)


  if (!guide) {
    return (
      <div className="min-h-screen bg-[#CAE5FF] dark:bg-[#2B4365] relative flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Guide Not Found</h1>
          <p className="text-black/70 dark:text-white/70 mb-6">
            The guide you're looking for doesn't exist or hasn't been created yet.
          </p>
          <Button 
            onClick={() => window.history.back()} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return <NewGuideClient guide={guide} />
}