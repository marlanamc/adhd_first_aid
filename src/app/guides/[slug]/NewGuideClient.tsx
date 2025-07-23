'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Tag, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Guide } from '@/lib/markdown'

interface GuideClientProps {
  guide: Guide
}

export default function NewGuideClient({ guide }: GuideClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goBack = () => {
    window.history.back()
  }

  // Parse the guide content into sections based on guide type
  const parseGuideContent = () => {
    const content = guide.content
    
    // Extract the intro quote
    const introMatch = content.match(/>\s*(.+?)(?=\n---|\n###)/s)
    const intro = introMatch ? introMatch[1].replace(/^__CALLOUT_\w+__\s*/, '').trim() : ''
    
    // Determine which guide this is based on title or slug
    const isDysregulationGuide = guide.title.includes('Dysregulation') || guide.slug === 'dysregulation'
    
    if (isDysregulationGuide) {
      return {
        intro,
        sections: [
          {
            emoji: '⚠️',
            title: 'What It Feels Like',
            subtitle: 'Recognizing dysregulation and shutdown',
            content: [
              'Feeling emotionally flooded or totally numb',
              'Thoughts looping endlessly, or no thoughts at all',
              'Bursting into anger or tears, or going completely quiet',
              'Stuck in bed, frozen in place, zoning out, or dissociating',
              'Feeling like your system just "crashed"'
            ]
          },
          {
            emoji: '🧠',
            title: 'Why It Happens',
            subtitle: 'Dysregulation is not bad behavior, it\'s a nervous system in distress',
            content: [
              '**ADHD itself**: Emotional reactivity, poor impulse control, and working memory issues',
              '**Overwhelm**: Too many inputs, not enough clarity',
              '**Chronic stress or trauma**: Leads to faulty internal "alarm systems"',
              '**Sensory overload**: Lights, sounds, smells, or social pressure',
              '**Hormonal shifts**: Estrogen drops can intensify ADHD symptoms',
              '**Nervous system imbalance**: Fight-or-flight mode stuck "on"',
              '**Perfectionism, shame, or internal pressure**: Keeps your system locked in tension'
            ]
          },
          {
            emoji: '🧭',
            title: 'Step 1: Notice the Signs Sooner',
            subtitle: 'Your system often gives clues, learning to recognize them helps you intervene earlier',
            subsections: [
              {
                emoji: '🚨',
                title: 'Early Warning Signs',
                items: [
                  '🤯 Feeling mentally overloaded or emotionally fragile',
                  '😶 Numbness or blank mind',
                  '🧍 Frozen body or nonverbal state',
                  '🧠 Racing thoughts, circular thinking',
                  '🌋 Emotional spikes (rage, panic, despair)',
                  '❄️ Cold hands, tension, shallow breathing',
                  '🚨 Urge to shut out the world'
                ]
              }
            ]
          },
          {
            emoji: '🫁',
            title: 'Step 2: Regulate First, Don\'t Push Through',
            subtitle: 'Thinking, planning, and doing come after your nervous system calms down',
            subsections: [
              {
                emoji: '🌬',
                title: 'Regulation Techniques',
                items: [
                  '🌬 Box breathing or 6-3-8-3 pattern',
                  '🧘 Body scan or grounding exercise',
                  '🚶 Small movement: walk, stretch, bounce, shake',
                  '🎧 Noise-canceling headphones or calming music',
                  '🧺 Comfort inputs: blanket, favorite scent, warm drink',
                  '📝 Brain dump: List everything swirling in your mind'
                ]
              }
            ]
          },
          {
            emoji: '🧱',
            title: 'Step 3: Reduce Pressure & Create Structure',
            subtitle: 'Shutdown often comes from too much input, too few supports. Let\'s fix that',
            subsections: [
              {
                emoji: '🪜',
                title: 'Simplify and Structure',
                items: [
                  '🪜 Break tasks into absurdly small steps',
                  '🛑 Cut down decision points: meals, outfits, to-dos',
                  '📍 Define 1 clear, gentle priority',
                  '🧹 Clear clutter (visual, digital, emotional)',
                  '🧭 Use visual prompts or checklists, don\'t rely on memory'
                ]
              }
            ]
          },
          {
            emoji: '🧠',
            title: 'Step 4: Understand What\'s Underneath',
            subtitle: 'Sometimes stuck-ness is masking deeper distress. Curiosity helps you move forward without shame',
            subsections: [
              {
                emoji: '✏️',
                title: 'Explore with Curiosity',
                items: [
                  '✏️ Journal or voice memo: "What feels heavy right now?"',
                  '🧠 Ask: Am I scared of failure? Am I trying to avoid a feeling?',
                  '💬 Use this sentence: "I\'m having the thought that..." to create space',
                  '🧍 Name the emotion: Anger? Fear? Shame? Grief? All of the above?'
                ]
              }
            ]
          },
          {
            emoji: '🧩',
            title: 'Step 5: Build a Resilient System',
            subtitle: 'You don\'t need more discipline, you need a structure that adapts to your needs',
            subsections: [
              {
                emoji: '🔁',
                title: 'Sustainable Systems',
                items: [
                  '🔁 Use rhythms, not rigid routines',
                  '📆 Do weekly reviews to reflect + adjust',
                  '💾 Externalize memory: calendar, checklist, inbox, timer',
                  '💬 Practice boundary scripts: "I need a pause to process"',
                  '📚 Learn from shutdowns: What triggered this? What helped?',
                  '🧘 Schedule rest before burnout',
                  '🙋‍♀️ Ask for help: body double, friend, coach, or therapist',
                  '🛠 Try "What if this were easy?" to shift mindset'
                ]
              }
            ],
            finalNote: 'You\'re not broken, you\'re human. Dysregulation is information, not failure. With practice, you can learn to work with your nervous system instead of against it.'
          }
        ]
      }
    }
    
    // Default to Cognitive & Overload Guide structure
    return {
      intro,
      sections: [
        {
          emoji: '🌀',
          title: 'What Mental Fog Feels Like',
          subtitle: 'Recognizing the experience',
          content: [
            'Like your brain is flipping channels nonstop',
            'Like your thoughts are swimming in glue', 
            'Like you\'re tired and restless and scattered all at once',
            'You might start 10 things and finish none. Or you zone out mid-thought.'
          ]
        },
        {
          emoji: '🧷',
          title: 'Why It Happens (ADHD Style)',
          subtitle: 'Understanding the root causes',
          content: [
            '🧠 **Executive Dysfunction**: Planning, prioritizing, and starting tasks feels impossible',
            '🗒 **Working Memory**: Like sticky notes that blow away before you use them',
            '🎯 **Attention Dysregulation**: You can\'t filter what\'s important vs. background noise',
            '🔊 **Sensory Overload**: Everything is *too much* all at once',
            '🔁 **Analysis Paralysis**: Too many options = no action',
            '💥 **Emotional Flooding**: Intense feelings can lead to shutdown'
          ]
        },
        {
          emoji: '🧘‍♀️',
          title: 'Step 1: Soothe the Storm',
          subtitle: 'You can\'t think your way out of mental fog. First, calm your body and brain.',
          subsections: [
            {
              emoji: '🩺',
              title: 'Regulate Your Nervous System',
              items: [
                '**Rest** (yes, even just 10 mins)',
                '**Hydrate & eat** something',
                '**Deep breathing** (inhale 5, exhale 8)',
                '**Move your body** (walk, stretch, shake it out)',
                '**Quiet the senses** (noise-canceling headphones, soft lighting, alone time)'
              ]
            },
            {
              emoji: '📝',
              title: 'Externalize the Chaos',
              items: [
                '**Brain Dump** → write *everything* down, no filter',
                '**Talk it out** → friend, coach, voice notes',
                '**Clear the fog** → seeing it out loud often brings clarity'
              ]
            },
            {
              emoji: '🧩',
              title: 'Simplify the Next Move',
              items: [
                'Do 1 thing. Make it small. *Examples: open the laptop, fill your water, delete 3 emails*',
                'Pick what\'s easiest or most interesting',
                'Repeat this mantra: **"Good enough is great."**'
              ]
            }
          ]
        },
        {
          emoji: '🧱',
          title: 'Step 2: Build a Stronger Base',
          subtitle: 'Once you\'re out of the fog, set up systems to catch you next time.',
          subsections: [
            {
              emoji: '📦',
              title: 'Externalize Everything',
              items: [
                'Your brain ≠ a to-do list',
                'Use **planners**, **calendar apps**, or **sticky notes**',
                'Centralize info: keep tasks and notes in 1–2 trusted places',
                'Try systems like PARA or a simple "Now / Next / Later" board'
              ]
            },
            {
              emoji: '🏡',
              title: 'Shape Your Environment',
              items: [
                'ADHD-friendly = distraction-minimized, tools visible, zones defined',
                'Add **visual cues** (e.g., timers, sticky notes, color codes)',
                'Create **checklists** for anything that repeats (morning routine, weekly review)'
              ]
            },
            {
              emoji: '⏰',
              title: 'Design for Your Energy',
              items: [
                'Notice when you have **brainpower** vs. **mush-brain**',
                'Block time for hard stuff during peak focus',
                'Use **transition rituals** (stretch, music, breath) between tasks',
                'Protect "buffer zones" — downtime isn\'t wasted time'
              ]
            },
            {
              emoji: '🤝',
              title: 'Lean on Support',
              items: [
                '**Body doubling** (even virtual) makes hard tasks easier',
                '**ADHD coaching** for accountability & systems that stick',
                'Practice saying **"no"** and setting boundaries',
                'Join a community. You\'re not alone.'
              ]
            }
          ]
        },
        {
          emoji: '🔄',
          title: 'Step 3: Reflect & Adjust',
          subtitle: 'Managing ADHD is an experiment, not a one-and-done solution.',
          content: [
            '**Track what works**, energy, focus, tools, moods',
            '**Review your week**: What helped? What didn\'t? Why?',
            '**Adjust as needed**, what worked 2 weeks ago might need a refresh',
            'Prioritize curiosity over criticism'
          ],
          finalNote: 'You\'re not failing, you\'re learning. Mental fog isn\'t laziness. It\'s a signal. Listen to it with kindness. Then meet it with strategy.'
        }
      ]
    }
  }

  const guideData = parseGuideContent()

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
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{guide.emoji}</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {guide.title}
                  </h1>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {guide.description}
                </p>
              </div>
            </div>
          </div>

          {/* Fixed Progress Tracker */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-white/20 p-4 transition-all duration-300">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-black dark:text-white">Reading Progress</h3>
                <span className="text-xs text-black/70 dark:text-white/70">
                  {Math.round(scrollProgress)}%
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-150"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Guide Metadata */}
          <div className="bg-white/30 dark:bg-gray-800/30 p-4 border-b border-white/20">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2 text-black dark:text-white">
                <Clock className="h-4 w-4" />
                {guide.readTime}
              </div>
              <div className="flex items-center gap-2 text-black dark:text-white">
                <Target className="h-4 w-4" />
                {guide.difficulty}
              </div>
              <div className="flex items-center gap-2 text-black dark:text-white">
                <Tag className="h-4 w-4" />
                {guide.category}
              </div>
            </div>
            {guide.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {guide.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white/20 text-black dark:text-white px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-8 space-y-8 pt-28">
            
            {/* Intro Quote */}
            {guideData.intro && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-l-4 border-pink-400">
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed italic">
                  {guideData.intro}
                </p>
              </div>
            )}

            {/* Guide Sections */}
            {guideData.sections.map((section, sectionIndex) => (
              <section key={sectionIndex} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                    <span className="text-xl">{section.emoji}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                    {section.subtitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Simple content list */}
                {section.content && (
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Subsections */}
                {section.subsections && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg">{subsection.emoji}</span>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{subsection.title}</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          {subsection.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Final note for last section */}
                {section.finalNote && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-l-4 border-green-400">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💬</span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Final Reminder</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {section.finalNote}
                    </p>
                  </div>
                )}
              </section>
            ))}

            {/* Navigation Footer */}
            <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
              <Button 
                onClick={goBack}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Guides
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}