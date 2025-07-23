'use client'

import { useState, useEffect, use } from 'react'
import { ArrowLeft, Heart, Brain, Zap, Frown, Users, BrainCircuit, Battery, Flame, Sparkles, CloudLightning, AlertCircle, Skull, CloudRain, Waves, BookOpen, CloudDrizzle, Shield, UserX, ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

// Hardcoded guide mappings
const FEELING_GUIDE_MAPPINGS = {
  // Cognitive & Overload feelings
  'mental fog': {
    title: 'Cognitive & Overload Guide',
    slug: 'mentalfog',
    emoji: '😶‍🌫️',
    description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies'
  },
  'overwhelmed': {
    title: 'Cognitive & Overload Guide',
    slug: 'mentalfog',
    emoji: '😶‍🌫️',
    description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies'
  },
  'forgetful': {
    title: 'Cognitive & Overload Guide',
    slug: 'mentalfog',
    emoji: '😶‍🌫️',
    description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies'
  },
  'scattered': {
    title: 'Cognitive & Overload Guide',
    slug: 'mentalfog',
    emoji: '😶‍🌫️',
    description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies'
  },
  'overstimulated': {
    title: 'Cognitive & Overload Guide',
    slug: 'mentalfog',
    emoji: '😶‍🌫️',
    description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies'
  },
  // Dysregulation & Shutdown feelings
  'stuck': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  },
  'drained': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  },
  'burned out': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  },
  'numb': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  },
  'ashamed': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  },
  'frustrated': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  }
}

interface FeelingPageProps {
  params: Promise<{
    feeling: string
  }>
}

export default function FeelingTemplate({ params }: FeelingPageProps) {
  const resolvedParams = use(params)
  const [feelingName, setFeelingName] = useState<string>('')
  const [feelingIcon, setFeelingIcon] = useState<React.ElementType>(Heart)
  const [availableGuide, setAvailableGuide] = useState<{
    title: string;
    slug: string;
    emoji: string;
    description: string;
  } | null>(null)
  const [expandedSections, setExpandedSections] = useState<{[key: number]: boolean}>({})
  const [hoveredSection, setHoveredSection] = useState<number | null>(null)

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  useEffect(() => {
    // Convert URL param back to display name
    const name = decodeURIComponent(resolvedParams.feeling)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    setFeelingName(name)

    // Map feelings to Lucide icons
    const iconMap: Record<string, React.ElementType> = {
      // Mental Fog & Overload
      'Mental Fog': CloudDrizzle,
      'Overwhelmed': Waves,
      'Forgetful': Brain,
      'Scattered': CloudLightning,
      'Overstimulated': Sparkles,
      
      // Dysregulation & Shutdown
      'Stuck': BrainCircuit,
      'Drained': Battery,
      'Burned Out': Flame,
      'Numb': Skull,
      'Ashamed': Frown,
      'Frustrated': Flame,
      
      // Heavy Feelings
      'Guilty': AlertCircle,
      'Defeated': CloudRain,
      'Hopeless': CloudRain,
      'Stressed': Zap,
      
      // Jittery & Wound Up
      'Anxious': AlertCircle,
      'Restless': Sparkles,
      'Wired': Zap,
      'Tense': Shield,
      
      // Social & Connection
      'Lonely': Users,
      'Misunderstood': Users,
      'Rejected': UserX
    }
    setFeelingIcon(iconMap[name] || Heart)

    // Check if there's a guide for this feeling
    const feelingKey = name.toLowerCase().trim()
    const matchedGuide = FEELING_GUIDE_MAPPINGS[feelingKey as keyof typeof FEELING_GUIDE_MAPPINGS]
    setAvailableGuide(matchedGuide || null)
  }, [resolvedParams.feeling])

  const goBack = () => {
    window.history.back()
  }

  // Get feeling-specific content
  const getComfortingReminder = (feeling: string) => {
    const reminders: Record<string, string> = {
      'Overwhelmed': "You are not lazy, broken, or falling behind. Your brain just needs a different approach right now.",
      'Mental Fog': "You're not broken, your brain is overwhelmed, not offline. Let's clear the clutter, reset your system, and help you come back online with clarity.",
      'Scattered': "Your mind isn't chaotic, it's creative and sees connections others miss.",
      'Stuck': "You're not lazy. You're not broken. You're just frozen, overwhelmed, overloaded, or unsure where to start. Let's help you get moving again, gently.",
      'Burned Out': "You've been running on empty. This exhaustion is real and your body is asking for rest.",
      'Anxious': "Your nervous system is trying to keep you safe. These feelings will pass.",
      'Drained': "You've been giving more than you have. It's time to refill your cup.",
      'Forgetful': "Your brain isn't broken, it just doesn't store short-term info the way others do. Let's help you work with it instead of against it.",
      'Scattered': "Your brain isn't broken, it's just holding too many tabs open at once. Let's help you bring the chaos into containers so you can focus again.",
      'Overstimulated': "You're not \"too sensitive\", your brain is just on high alert, processing too much at once. Let's slow the input, soothe your system, and help you feel grounded again."
    }
    return reminders[feeling] || "What you're feeling is valid. You're not alone in this experience."
  }

  // Get feeling-specific regulate section content
  const getRegulateContent = (feeling: string) => {
    const content: Record<string, {
      subtitle: string;
      body: string[];
      mind: string[];
      sensory: string[];
    }> = {
      'Forgetful': {
        subtitle: "Your brain is not a storage unit. Let's externalize everything ASAP.",
        body: [
          "Do a complete brain dump - write everything down that's circling in your mind",
          "Use voice memo app or Notes for quick capture",
          "Apply 'Touch It Once' rule: process it now, log it, snooze it, or schedule it",
          "Keep tools in reach - don't rely on memory to 'write it down later'"
        ],
        mind: [
          "Say things out loud to engage active memory",
          "Repeat or paraphrase what you hear",
          "Make it weird, move it, make it meaningful",
          "Mental rehearsal - picture it in detail before bed"
        ],
        sensory: [
          "Put items where you'll see them (meds on water bottle)",
          "Use color coding and clear labels for categorization",
          "Set up a 'drop zone' launchpad near the door",
          "ADHD brains respond to visible structure, not hidden storage"
        ]
      },
      'Scattered': {
        subtitle: "Let's contain the chaos by centralizing your scattered thoughts and stuff.",
        body: [
          "Start with ONE brain dump - get everything out of your head onto paper",
          "Check basic needs: Are you hungry, tired, or overstimulated?",
          "Clear one visible surface to create a sense of calm and control"
        ],
        mind: [
          "Practice mindful breathing - deep, intentional breaths to regain focus",
          "Identify what triggered this scattered feeling",
          "Use 'box breathing' to calm your dysregulated nervous system",
          "Be curious, not critical about your scattered state"
        ],
        sensory: [
          "Turn off notifications and digital distractions",
          "Use noise-canceling headphones if overstimulated",
          "Spend a few minutes in a quiet, low-stimulation space",
          "Create one 'inbox' for all incoming papers, tasks, and thoughts"
        ]
      }
    }
    
    return content[feeling] || {
      subtitle: "Let's get your brain and body back online.",
      body: [
        "Take your meds if you forgot",
        "Drink water / eat something", 
        "Try light movement or stretching",
        "Caffeine (if helpful for you)"
      ],
      mind: [
        "Quick brain dump",
        "3 deep breaths",
        "Short meditation or guided audio"
      ],
      sensory: [
        "Peaceful lighting",
        "Music or background noise",
        "Weighted blanket / comfy texture"
      ]
    }
  }

  // Get feeling-specific zoom out content
  const getZoomOutContent = (feeling: string) => {
    const content: Record<string, string[]> = {
      'Forgetful': [
        "Is my working memory overloaded with too many competing demands?",
        "Am I trying to remember too much instead of writing things down?",
        "Are stress, sleep, or medication issues making my memory worse?",
        "Am I being too hard on myself about normal ADHD memory challenges?"
      ],
      'Scattered': [
        "Am I trying to juggle too many projects, tasks, or mental threads at once?",
        "Is my environment adding to the chaos with clutter, notifications, or distractions?",
        "Am I overwhelmed because tasks feel too big and I don't know where to start?",
        "Are **time blindness** or **perfectionism** making me feel more scattered than I actually am?"
      ]
    }
    
    return content[feeling] || [
      "Am I hungry, tired, overstimulated, or scattered?",
      "Am I avoiding something because I'm afraid I'll fail or do it wrong?", 
      "Is everything blending together because of time blindness, people-pleasing, or unclear priorities?"
    ]
  }

  // Get feeling-specific zoom in content
  const getZoomInContent = (feeling: string) => {
    const content: Record<string, string[]> = {
      'Forgetful': [
        "Write down the ONE most important thing you don't want to forget today",
        "Set up ONE visual reminder (sticky note, phone on counter, keys with wallet)",
        "Do ONE small organizational task (put item in its 'home', clear one surface, set one alarm)"
      ],
      'Scattered': [
        "Pick ONE small task you can complete in **under 5 minutes** right now",
        "Break down ONE overwhelming project into **2-3 smaller steps** (use chunking)",
        "Clear ONE visible surface completely to create a pocket of calm and control"
      ]
    }
    
    return content[feeling] || [
      "Pick a task you can do in under 2 minutes",
      "Choose the easiest or most interesting thing",
      "Do something repetitive to get momentum (dishes, sorting, sweeping)"
    ]
  }

  // Get feeling-specific support content  
  const getSupportContent = (feeling: string) => {
    const content: Record<string, string[]> = {
      'Forgetful': [
        "Use your phone's voice memo to capture thoughts immediately",
        "Ask someone to be your 'external brain' for important reminders",
        "Set up automatic systems (recurring alarms, calendar blocks, email reminders)",
        "Browse memory strategies designed for ADHD brains"
      ],
      'Scattered': [
        "Create designated 'inboxes' to funnel all incoming tasks and information",
        "Use the **'Five Projects Rule'** - limit active projects to prevent overwhelm",
        "Set up a **weekly review** ritual to clear mental clutter and regain control",
        "Ask for external accountability when establishing new organizational systems"
      ]
    }
    
    return content[feeling] || [
      "Ask someone to body double or co-work",
      "Reduce decisions (pick a default!)",
      "Use pre-made systems/templates",
      `Browse strategies designed for ${feeling.toLowerCase()}`
    ]
  }

  // Get feeling-specific acknowledge content
  const getAcknowledgeContent = (feeling: string) => {
    const content: Record<string, string[]> = {
      'Forgetful': [
        "Stop and take a breath. Forgetting doesn't mean you're failing.",
        "Remind yourself: **'My brain works differently, and that's okay.'**",
        "Notice the self-criticism and replace it with curiosity: *'What can I learn from this?'*",
        "Remember: Even neurotypical people forget things, your ADHD brain just needs different supports."
      ],
      'Scattered': [
        "Pause and acknowledge: **'My thoughts feel chaotic right now, and that's okay.'**",
        "This scattered feeling is your ADHD brain trying to process everything at once, it's not laziness.",
        "Breathe deeply and remind yourself: *'I can contain this chaos step by step.'*",
        "You don't have to organize everything perfectly, just start with one small container."
      ]
    }
    
    return content[feeling] || [
      "Don't push through it.",
      "Pause, breathe, and remind yourself: *'This is a signal, not a failure.'*"
    ]
  }

  // Get custom sections for specific feelings
  const getCustomSections = (feeling: string) => {
    if (feeling === 'Forgetful') {
      return [
        {
          emoji: '📤',
          title: 'Externalize Everything ASAP',
          subtitle: 'Your brain is not a storage unit. The second you try to "just remember" something, it starts fading.',
          color: 'blue',
          items: [
            '**Brain Dump**: Write everything down that\'s circling in your mind',
            '**Voice Note / Quick Capture**: Use your Notes app or a dedicated inbox system',
            '**"Touch It Once" Rule**: Process it now, log it, snooze it, or schedule it',
            '**Dictate on the go**: If you can\'t stop, speak it aloud to capture later'
          ],
          tip: 'Keep tools in reach (sticky notes, whiteboard, voice memo app), don\'t rely on memory to "write it down later."'
        },
        {
          emoji: '🧭',
          title: 'Create a Structured, Cued Environment',
          subtitle: 'Let your space remind you, not your brain.',
          color: 'green',
          items: [
            '**Visual Cues**: Put the thing where you\'ll see it (e.g. meds on your water bottle)',
            '**"Homes" for everything**: Keys, wallet, phone, glasses = same spot every time',
            '**Color code + label**: Use colors to categorize and labels to make finding easier',
            '**Drop Zone**: Set up a launchpad near the door for daily essentials'
          ],
          tip: 'ADHD brains respond better to visible structure than hidden storage.'
        },
        {
          emoji: '📋',
          title: 'Use Checklists & Routines for Multi-Step Stuff',
          subtitle: 'Working memory can\'t hold more than a few steps. That\'s not laziness, that\'s neurology.',
          color: 'purple',
          items: [
            '**Checklists**: Packing lists, morning routines, weekly reviews, save and reuse',
            '**Mini-habits**: Pair tasks with physical triggers (e.g. brush teeth → check planner)',
            '**Workflow boards**: Keep daily/weekly task flows somewhere visual'
          ],
          tip: 'Checklists aren\'t just for beginners. Even surgeons and astronauts use them.'
        },
        {
          emoji: '🧠',
          title: 'Engage Your Memory Actively',
          subtitle: 'If you don\'t encode it, you can\'t retrieve it. ADHD memory starts with attention and repetition.',
          color: 'orange',
          items: [
            '**Say it out loud**: Repeat or paraphrase things as you hear them',
            '**Teach it to a 5-year-old**: Explaining cements understanding',
            '**Make it sticky**: Acronyms, drawings, silly jokes, movements',
            '**Mental rehearsal**: Picture it before bed, in detail'
          ],
          tip: 'Passive reading = lost info. Make it weird, make it move, make it meaningful.'
        },
        {
          emoji: '⏰',
          title: 'Use Reminders & Address Root Causes',
          subtitle: 'Forgetfulness often has roots: stress, poor sleep, under-fueling, or time blindness.',
          color: 'pink',
          items: [
            '**Reminders + alarms**: Set snooze-able alerts you\'ll actually see',
            '**Calendar review**: Check tomorrow before bed, and again after breakfast',
            '**Time tracking**: Underestimating time causes missed tasks, track your real durations',
            '**Regulate**: Calm your nervous system, stress kills memory encoding',
            '**Clean up your system**: Too many irrelevant reminders = white noise'
          ],
          tip: 'Tools work best when you trust them, review and simplify often.'
        }
      ]
    }
    
    if (feeling === 'Scattered') {
      return [
        {
          emoji: '📥',
          title: 'Centralize & Contain the Chaos',
          subtitle: 'Your mind and space are overloaded with inputs. The fix? Catch it all, in fewer, clearer places.',
          color: 'blue',
          items: [
            '**Brain Dump**: Unload everything on your mind (random thoughts, to-dos, worries)',
            '**Designate Inboxes**: One for papers, one for notes, one for stuff, funnel it all in',
            '**Thought Containers**: Keep post-its, whiteboards, or voice notes within reach',
            '**Clear Your Digital Desktop**: Move or archive files so your screen isn\'t a mental minefield',
            '**Offload Your Working Memory**: Don\'t trust your brain to "just remember"'
          ],
          tip: 'ADHD isn\'t a memory problem, it\'s a "where does this go?" problem. Create places.'
        },
        {
          emoji: '🪜',
          title: 'Break It Down & Prioritize',
          subtitle: 'Big tasks blur into each other. You\'re not lazy, you just need them to be smaller and sharper.',
          color: 'green',
          items: [
            '**Chunking**: Turn one overwhelming task into tiny, doable steps',
            '**Checklists & Roadmaps**: Write down every step, it helps brains feel safe',
            '**Prioritize**: Glass balls (urgent) vs. plastic balls (can bounce)',
            '**Two-Minute Rule**: If it takes less than 2 minutes, do it now',
            '**Limit Projects**: Keep only 3 to 5 active things on your plate at a time'
          ],
          tip: 'Scattered = too many tabs. Closing a few clears bandwidth.'
        },
        {
          emoji: '🧹',
          title: 'Clear Your Space = Clear Your Mind',
          subtitle: 'Your environment is a mirror of your brain. Reset the scene so your focus has a chance.',
          color: 'purple',
          items: [
            '**Declutter**: Sort into "keep, toss, donate, ponder" piles',
            '**Set Up Homes**: Keys, glasses, wallet = same place every time',
            '**Organize Files**: Rename, folder, and archive digital clutter',
            '**Turn Off Notifications**: Protect your focus bubble',
            '**Use Headphones or Quiet Space**: Reduce sensory input for clarity'
          ],
          tip: 'You\'re not messy on purpose. You\'re overloaded. Make space gentle again.'
        },
        {
          emoji: '🌬',
          title: 'Regulate Inside Before Organizing Outside',
          subtitle: 'Feeling scattered isn\'t just external, your thoughts and emotions are also bouncing around.',
          color: 'orange',
          items: [
            '**Box Breathing**: In for 4, hold for 4, out for 4, hold for 4',
            '**Name Your Monkey Mind**: Label the thoughts instead of letting them run wild',
            '**Sensory Soothing**: Weighted blankets, dim lights, soft textures',
            '**Spoon Theory**: Check how much energy you actually have, and respect it',
            '**Self-Talk Reset**: "I\'m doing the best I can with what I\'ve got right now"'
          ],
          tip: 'You can\'t organize chaos from inside the chaos. Pause first.'
        },
        {
          emoji: '🔁',
          title: 'Create Rhythms, Not Rigid Routines',
          subtitle: 'Structure doesn\'t have to be strict. Rhythms give you a groove, and a place to return to.',
          color: 'pink',
          items: [
            '**Morning & Evening Anchors**: Simple routines = fewer decisions',
            '**Weekly Reviews**: Spend 10 minutes sorting what\'s open, done, or lost',
            '**Workflow Checklists**: For repetitive tasks so you don\'t have to re-think them',
            '**Leave Crumb Trails**: End your day by writing "next steps" for tomorrow-you',
            '**Get Support**: A body double, coach, or friend can help you stay grounded'
          ],
          tip: 'You don\'t need a perfect system, just one you return to.'
        }
      ]
    }
    
    if (feeling === 'Overstimulated') {
      return [
        {
          emoji: '🎯',
          title: 'Know Your Triggers & Signals',
          subtitle: 'You can\'t avoid what you don\'t recognize. Overstimulation often creeps in quietly, until it explodes.',
          color: 'blue',
          items: [
            '**Notice early signs**: Tension, irritability, racing thoughts, shallow breathing',
            '**Map your sensory profile**: What overstimulates you? What calms you?',
            '**Track internal noise**: You might feel scattered from inside, racing ideas, switching tasks',
            '**Write it down**: Keep a running list of things that regularly tip you into overload'
          ],
          tip: 'Learning your personal pattern helps you pause earlier, not just recover harder.'
        },
        {
          emoji: '🧹',
          title: 'Calm Your Space = Calm Your Brain',
          subtitle: 'ADHD brains don\'t filter out sensory input easily. Create an environment that does it for you.',
          color: 'green',
          items: [
            '**Declutter visual space**: Tidy desk, clean desktop, close tabs',
            '**Silence distractions**: Turn off notifications, TV, or unnecessary sounds',
            '**Use headphones or earplugs**: Block external noise or use brown noise',
            '**Dim the lights**: Especially helpful in the evening',
            '**Simplify your space**: Containers, "homes" for keys/wallet/glasses, fewer decisions'
          ],
          tip: 'Your nervous system is taking in everything. Make "less" the default.'
        },
        {
          emoji: '🫁',
          title: 'Regulate Your Body & Brain in the Moment',
          subtitle: 'You can\'t logic your way out of sensory flooding. Your body needs a nervous system reset.',
          color: 'purple',
          items: [
            '**Box Breathing**: Inhale 4, hold 4, exhale 4, hold 4, repeat',
            '**5-4-3-2-1 Grounding**: Use your senses to anchor in the now',
            '**Sensory soothers**: Petting your dog, warm drink, soft fabric, weighted blanket',
            '**Move gently**: Walk, stretch, or shake it out to release tension',
            '**Quick brain dump**: Externalize the mental swirl, list everything on your mind'
          ],
          tip: 'Start with your body. Calming that brings your brain back online.'
        },
        {
          emoji: '🛑',
          title: 'Set Boundaries Before You Burn Out',
          subtitle: 'Overstimulation is a cue, not a failure. Protect your peace like it\'s your power source.',
          color: 'orange',
          items: [
            '**Speak your needs**: Ask for quiet, a break, or a change of plan',
            '**Say no**: Declining something isn\'t rude, it\'s wise',
            '**Set limits**: Pick times to respond to messages or requests, not all day',
            '**Use parachutes**: Have phrases or signals ready to exit situations gracefully',
            '**Ask for support**: Coaches, friends, therapists, you don\'t have to do it alone'
          ],
          tip: 'Boundaries aren\'t selfish, they\'re what let you stay present.'
        },
        {
          emoji: '🧘‍♀️',
          title: 'Build a Lifestyle that Protects Your Bandwidth',
          subtitle: 'The best regulation isn\'t reactive, it\'s preventative. Design your days to be sustainable.',
          color: 'pink',
          items: [
            '**Breaks = essential**: Don\'t wait until you crash. Take short pauses to reset',
            '**Track your spoons**: Know how much energy you have, and spend it wisely',
            '**Eat + sleep like it matters**: Hungry and tired brains can\'t filter anything',
            '**Morning light, evening wind-down**: Support your circadian rhythm',
            '**Create routines**: Gentle rhythms reduce surprises and decision fatigue',
            '**Do a weekly review**: Clear clutter, reflect, and reset for the week ahead',
            '**Be kind to yourself**: This isn\'t about being perfect, it\'s about protecting your system'
          ],
          tip: 'ADHD is about thresholds. You\'re not weak, you\'re full. Let\'s make space again.'
        }
      ]
    }
    
    if (feeling === 'Mental Fog') {
      return [
        {
          emoji: '🔍',
          title: 'Understand Where the Fog Is Coming From',
          subtitle: 'Mental fog isn\'t laziness or "being dumb," it\'s your brain protecting itself from overload.',
          color: 'blue',
          items: [
            '**Cognitive overload**: Too many decisions, tasks, or mental threads running at once',
            '**Emotional flooding**: Stress, anxiety, or big feelings can cloud thinking',
            '**Physical depletion**: Poor sleep, hunger, dehydration, or medication timing',
            '**Sensory overwhelm**: Too much noise, light, or stimulation draining your mental bandwidth',
            '**Task switching fatigue**: Jumping between too many different types of work'
          ],
          tip: 'Mental fog is a signal from your brain that it needs support, not a character flaw.'
        },
        {
          emoji: '📤',
          title: 'Clear the Internal Clutter',
          subtitle: 'Your working memory is full. Let\'s empty it out so your brain has room to think clearly.',
          color: 'green',
          items: [
            '**Brain dump everything**: Write down every task, worry, or random thought swirling in your head',
            '**Sort into containers**: "Do today," "Do this week," "Someday/maybe," and "Not my problem"',
            '**Close mental tabs**: Finish, postpone, or delegate incomplete tasks taking up mental space',
            '**Park decisions**: Write down choices you need to make instead of cycling through them',
            '**Clear your physical space**: Tidy your desk, close browser tabs, put away distractions'
          ],
          tip: 'Your brain can\'t think clearly when it\'s trying to remember everything. External storage = internal clarity.'
        },
        {
          emoji: '🧘',
          title: 'Reset Your Nervous System with Sensory & Movement',
          subtitle: 'You can\'t think your way out of mental fog. Your body needs to shift first, then your brain follows.',
          color: 'purple',
          items: [
            '**Breathe deeply**: Box breathing (4 in, 4 hold, 4 out, 4 hold) to activate your rest response',
            '**Move gently**: Walk, stretch, shake out tension, or do jumping jacks to reset',
            '**Hydrate and fuel**: Drink water, eat protein, check if low blood sugar is fogging you',
            '**Reduce sensory input**: Dim lights, use headphones, find a quiet space to decompress',
            '**Ground in your senses**: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste'
          ],
          tip: 'Mental fog often lifts naturally once your nervous system feels safe and regulated.'
        },
        {
          emoji: '🪨',
          title: 'Reduce Demands & Focus Your Energy',
          subtitle: 'You can\'t add clarity to an overloaded system. Let\'s reduce the cognitive load first.',
          color: 'orange',
          items: [
            '**Pick ONE priority**: What\'s the most important thing you need mental clarity for right now?',
            '**Postpone non-essentials**: Move optional tasks to later when your brain is clearer',
            '**Simplify decisions**: Use templates, defaults, or "good enough" instead of optimizing',
            '**Batch similar tasks**: Group emails, calls, or admin work to reduce task-switching',
            '**Set boundaries**: Say no to new requests until your mental bandwidth recovers'
          ],
          tip: 'Clarity comes from focus, and focus comes from reducing competing demands on your attention.'
        },
        {
          emoji: '🔄',
          title: 'Build Systems That Prevent Future Fog',
          subtitle: 'Mental fog often returns when the same overload patterns repeat. Let\'s build prevention into your life.',
          color: 'pink',
          items: [
            '**Create a daily "brain dump" ritual**: 10 minutes each morning or evening to clear mental clutter',
            '**Use a "second brain" system**: Trusted notes app, planner, or digital system for external memory',
            '**Schedule regular breaks**: Your brain needs recovery time, not just work time',
            '**Track your fog patterns**: Notice what triggers it so you can prevent it earlier',
            '**Build a fog protocol**: Know exactly what steps help you clear it when it comes back',
            '**Protect your energy**: Set limits on commitments, decisions, and mental load during high-stress periods'
          ],
          tip: 'The best way to clear mental fog is to prevent it by designing sustainable rhythms for your ADHD brain.'
        }
      ]
    }
    
    if (feeling === 'Stuck') {
      return [
        {
          emoji: '🔍',
          title: 'Understand Why You\'re Stuck',
          subtitle: 'Stuck is usually a signal, not a failure. Let\'s explore what might be freezing you.',
          color: 'blue',
          items: [
            '**Quick check-in**: Have I eaten, drank water, or slept enough? Are my meds active?',
            '**Body awareness**: Is my body tense, jittery, or totally shut down?',
            '**Environment scan**: Is my space too noisy, messy, or overwhelming?',
            '**Task clarity**: Is the task unclear? Too big? Too emotional?',
            '**Fear check**: Am I scared of messing it up or avoiding a feeling (shame, sadness, anger)?'
          ],
          tip: 'Stuck often means your brain is protecting you. Let\'s thank it, and move forward gently.'
        },
        {
          emoji: '📤',
          title: 'Externalize the Chaos',
          subtitle: 'When your brain is spinning or blank, get it out. That\'s the first step to regaining agency.',
          color: 'green',
          items: [
            '**Brain Dump**: Write down every thought, task, or worry on your mind, no order needed',
            '**Talk it out**: Say what you\'re feeling to a friend, coach, or voice note, anything helps',
            '**Body scan**: Check sensations from head to toe, what do you notice?',
            '**Grounding**: Try the 5-4-3-2-1 sensory method (5 see, 4 hear, 3 feel, 2 smell, 1 taste)',
            '**Name the feeling**: "I notice I\'m feeling stuck right now" creates helpful distance'
          ],
          tip: 'Stuck isn\'t stillness, it\'s mental static. Clear it to move again.'
        },
        {
          emoji: '🌬',
          title: 'Reset Your System with Movement & Soothing',
          subtitle: 'You can\'t think your way out of shutdown, but your body can lead the way back.',
          color: 'purple',
          items: [
            '**Breathwork**: Box breathing (inhale 4, hold 4, exhale 4, hold 4) to reset your nervous system',
            '**Move gently**: Stand up, walk, stretch, shake, or dance, even 30 seconds helps',
            '**Soothing inputs**: Noise-canceling headphones, dim lights, essential oils, weighted blanket',
            '**Comfort items**: Pet an animal, hug a pillow, watch a comfort video, listen to calming music',
            '**Change environment**: Open a window, go outside, or simply change rooms'
          ],
          tip: 'Action doesn\'t start with willpower. It starts with regulation.'
        },
        {
          emoji: '🪜',
          title: 'Make the Next Step Tiny',
          subtitle: 'Overwhelm freezes your brain. Small, simple steps re-engage your momentum.',
          color: 'orange',
          items: [
            '**Break it down**: What\'s one micro-step toward the task? (open the doc, find the charger)',
            '**Pick the easiest piece**: What feels least scary, boring, or emotional? Start there',
            '**Two-Minute Rule**: If it\'ll take less than 2 minutes, do it now',
            '**Reduce decisions**: Pre-decide outfits, meals, or the next 3 moves',
            '**Remove noise**: Mute notifications, clear your space, put on focus music'
          ],
          tip: 'You don\'t need motivation, just one foot in front of the other.'
        },
        {
          emoji: '💗',
          title: 'Build a Rhythm That Prevents the Freeze',
          subtitle: 'Getting unstuck is heroic. Staying in motion takes systems, not hustle.',
          color: 'pink',
          items: [
            '**Build routines with flexible anchors**: Start your day with a warm-up task you enjoy',
            '**Leave a crumb trail**: Before stopping a task, write where to start next time',
            '**Weekly check-ins**: Review what worked and reset what didn\'t',
            '**Ask for help**: Use body doubling, coaching, or pre-made templates to reduce cognitive load',
            '**Talk kindly to yourself**: "I\'m having the thought that I\'m failing" creates helpful distance',
            '**Progress over perfection**: Small consistent steps beat heroic bursts that lead to burnout'
          ],
          tip: 'Being stuck doesn\'t mean you\'re broken, it means your brain needs help, not judgment.'
        }
      ]
    }
    
    if (feeling === 'Overwhelmed') {
      return [
        {
          emoji: '🌊',
          title: 'Acknowledge the Overwhelm',
          subtitle: 'You\'re not lazy, broken, or falling behind. Your brain just needs a different approach right now.',
          color: 'blue',
          items: [
            '**Don\'t push through it**: This feeling is a signal that your system needs support',
            '**Pause, breathe, and remind yourself**: "This is a signal, not a failure"',
            '**Name it to tame it**: Say out loud "I\'m feeling overwhelmed right now"',
            '**Give yourself permission to step back**: Overwhelm requires regulation first, action second'
          ],
          tip: 'Overwhelm is your nervous system saying "too much, too fast." Listen to it with compassion.'
        },
        {
          emoji: '🧘',
          title: 'Regulate, Calm Your Nervous System',
          subtitle: 'Let\'s get your brain and body back online.',
          color: 'green',
          items: [
            '**Body**: Take your meds if you forgot, drink water, eat something, try light movement or stretching, caffeine if helpful for you',
            '**Mind**: Quick brain dump, 3 deep breaths, short meditation or guided audio',
            '**Sensory**: Peaceful lighting, music or background noise, weighted blanket or comfy texture'
          ],
          tip: 'You\'re not lazy or crazy, your brain is responding to stress. Let\'s meet it with care.'
        },
        {
          emoji: '🔍',
          title: 'Zoom Out, What\'s Really Going On?',
          subtitle: 'Understanding the overwhelm helps you respond to it more effectively.',
          color: 'purple',
          items: [
            '**Am I hungry, tired, overstimulated, or scattered?**',
            '**Am I avoiding something because I\'m afraid I\'ll fail or do it wrong?**',
            '**Do I have too many decisions to make or too many things on my plate?**',
            '**Is there something specific stressing me out that I haven\'t named yet?**'
          ],
          tip: 'Overwhelm often has specific causes. Finding them helps you address the root, not just the symptoms.'
        },
        {
          emoji: '🎯',
          title: 'Focus on the Next Small Step',
          subtitle: 'You don\'t need to solve everything right now. Just the next right thing.',
          color: 'orange',
          items: [
            '**Pick ONE thing**: What would make the biggest difference right now?',
            '**Make it smaller**: Break your chosen task into the tiniest possible first step',
            '**Set a timer**: Work for 10-15 minutes, then reassess',
            '**Lower the bar**: Done is better than perfect, and "good enough" is great'
          ],
          tip: 'Progress beats perfection. Small consistent steps add up to big changes over time.'
        },
        {
          emoji: '🛠',
          title: 'Build Systems That Prevent Future Overwhelm',
          subtitle: 'You don\'t need more willpower, you need better systems.',
          color: 'pink',
          items: [
            '**Externalize everything**: Your brain isn\'t a storage unit, use planners, apps, or lists',
            '**Set boundaries**: Practice saying "Let me check my calendar and get back to you"',
            '**Create buffer time**: Schedule breaks and transition time between tasks',
            '**Regular check-ins**: Weekly reviews to catch overwhelm before it builds up',
            '**Ask for help**: Delegate, outsource, or simply tell someone you\'re struggling'
          ],
          tip: 'Overwhelm is often a sign that you need more structure and support, not more discipline.'
        }
      ]
    }
    
    return null
  }

  const customSections = getCustomSections(feelingName)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbc2eb] via-[#fbd786] to-[#fbc687] relative">
      <div className="max-w-4xl mx-auto px-4 py-6 pt-20">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-white/60 dark:bg-gray-800/60 p-6 border-b border-white/20">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={goBack}
                className="p-2 hover:bg-white/30 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                  {React.createElement(feelingIcon, {
                    className: "h-7 w-7 text-pink-500"
                  })}
                  Feeling: {feelingName}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Comforting Reminder */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-l-4 border-pink-400">
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                {getComfortingReminder(feelingName)}
              </p>
            </div>

            {/* Gentle guidance note */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <span className="text-lg">🌱</span>
                <span>Take your time, open each section when you're ready</span>
              </p>
            </div>

            {/* Custom sections for specific feelings or default sections */}
            {customSections ? (
              // Custom layout for feelings like Forgetful
              <>
                {customSections.map((section, index) => (
                  <section key={index} className="space-y-4">
                    <div className="relative">
                      <button
                        onClick={() => toggleSection(index)}
                        onMouseEnter={() => setHoveredSection(index)}
                        onMouseLeave={() => setHoveredSection(null)}
                        className="w-full flex items-center gap-3 mb-4 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className={`bg-${section.color}-100 dark:bg-${section.color}-900/30 rounded-full p-3`}>
                          <span className="text-2xl">{section.emoji}</span>
                        </div>
                        <div className="flex-1 text-left">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {index + 1}. {section.title}
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {section.subtitle}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {expandedSections[index] ? (
                            <Minus className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Plus className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      
                      {/* Custom Tooltip */}
                      {hoveredSection === index && (
                        <div className="absolute right-2 top-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded shadow-lg z-10 pointer-events-none">
                          {expandedSections[index] ? "Close section" : "Open section"}
                        </div>
                      )}
                    </div>
                    
                    {expandedSections[index] && (
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4 animate-in slide-in-from-top duration-300">
                        <div className="space-y-3">
                          {section.items.map((item: string, itemIndex: number) => (
                            <div key={itemIndex} className="flex items-start gap-3">
                              <div className={`w-2 h-2 bg-${section.color}-400 rounded-full mt-2 flex-shrink-0`}></div>
                              <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </div>
                          ))}
                        </div>
                        
                        {section.tip && (
                          <div className={`bg-gradient-to-r from-${section.color}-50 to-${section.color}-100 dark:from-${section.color}-900/20 dark:to-${section.color}-800/20 rounded-lg p-4 border-l-4 border-${section.color}-400`}>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              💡 <strong>Tip:</strong> {section.tip}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                ))}
              </>
            ) : (
              // Default sections for other feelings
              <>
                {/* Section 1: Acknowledge & Pause */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-pink-100 dark:bg-pink-900/30 rounded-full p-2">
                      <span className="text-xl">🫶</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      1. Acknowledge & Pause with Self-Compassion
                    </h2>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 space-y-3">
                    {getAcknowledgeContent(feelingName).map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 2: Regulate */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                      <span className="text-xl">🌡</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      2. Regulate – Calm Your Nervous System
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{getRegulateContent(feelingName).subtitle}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Body */}
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">🧍‍♀️</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Body</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        {getRegulateContent(feelingName).body.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mind */}
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">🧠</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Mind</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        {getRegulateContent(feelingName).mind.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sensory */}
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">🪷</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Sensory</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        {getRegulateContent(feelingName).sensory.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border-l-4 border-green-400">
                    <p className="text-sm italic text-gray-700 dark:text-gray-300">
                      💬 <em>{
                        feelingName === 'Forgetful' ? '"Your brain isn\'t broken, it just needs external supports. That\'s not weakness, it\'s wisdom."' :
                        feelingName === 'Scattered' ? '"Scattered thoughts don\'t mean a scattered mind, they mean a creative brain that needs containers."' :
                        feelingName === 'Overstimulated' ? '"You\'re not too sensitive, your nervous system is just working overtime. Let\'s give it permission to rest."' :
                        '"You\'re not lazy or crazy, your brain is responding to stress. Let\'s meet it with care."'
                      }</em>
                    </p>
                  </div>
                </section>

                {/* Section 3: Zoom Out */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2">
                      <span className="text-xl">🔭</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      3. Zoom Out – What's Really Going On?
                    </h2>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 space-y-3">
                    {getZoomOutContent(feelingName).map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 4: Zoom In */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
                      <span className="text-xl">🔬</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      4. Zoom In – Take a Tiny Step
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Let's shrink the problem.</p>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 space-y-3">
                    {getZoomInContent(feelingName).map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 5: Support & Systems */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-2">
                      <span className="text-xl">🤝</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      5. Use Support & Systems
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">You don't have to do it alone.</p>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 space-y-3">
                    {getSupportContent(feelingName).map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Read More Guide Button - moved above navigation */}
            {availableGuide && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Need More Support?</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-center">
                    Read our comprehensive guide about {feelingName.toLowerCase()} with practical strategies and insights.
                  </p>
                  <div className="text-center">
                    <Button
                      onClick={() => window.location.href = `/guides/${availableGuide.slug}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read: {availableGuide.title}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Options */}
            <div className="grid gap-4 md:grid-cols-2 pt-4">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/tasks'}
                className="p-6 text-left h-auto border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛠</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Need help with a task?</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Task Selector</div>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline"
                onClick={() => window.location.href = '/barriers'}
                className="p-6 text-left h-auto border-2 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚧</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Facing barriers or obstacles?</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Barriers Support</div>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline"
                onClick={() => window.location.href = '/identities'}
                className="p-6 text-left h-auto border-2 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌈</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Need identity-aware support?</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Identity Support</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/systems'}
                className="p-6 text-left h-auto border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧩</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Want to build a system around this?</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Systems Lab</div>
                  </div>
                </div>
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}