'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Copy, MessageSquareText, Heart, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Scripts data from the parent page
const scriptsData = [
  {
    name: 'How to talk to a friend who doubts ADHD',
    category: 'Advocacy & Boundaries',
    emoji: '🗣️',
    slug: 'how-to-talk-to-a-friend-who-doubts-adhd',
    content: {
      intro: "When someone doubts your ADHD, it can feel invalidating and hurtful. Here's a gentle but firm script to help you navigate this conversation.",
      scripts: [
        {
          title: "For the Skeptical Friend",
          content: `"I understand ADHD might seem overdiagnosed or trendy to you, but my experience is real. This isn't about making excuses—it's about understanding why my brain works differently. I'd appreciate your support rather than skepticism."`
        },
        {
          title: "When They Say 'Everyone's a Little ADHD'",
          content: `"That's like saying everyone's a little diabetic because everyone gets tired sometimes. ADHD isn't just being distracted—it's a neurodevelopmental difference that affects my daily life in significant ways."`
        },
        {
          title: "Setting a Boundary",
          content: `"I'm not asking you to become an expert on ADHD, but I am asking you to trust my experience and respect that this is real for me. Can we agree on that?"`
        }
      ],
      tips: [
        "Practice these phrases beforehand so they feel natural",
        "Stay calm—your tone matters as much as your words",
        "Remember: you don't need to convince everyone, just set boundaries",
        "It's okay to end the conversation if they remain dismissive"
      ]
    }
  },
  {
    name: 'How to ask your doctor for an ADHD evaluation',
    category: 'Medical Navigation',
    emoji: '🩺',
    slug: 'how-to-ask-your-doctor-for-an-adhd-evaluation',
    content: {
      intro: "Asking for an ADHD evaluation can feel daunting. Here's how to advocate for yourself with confidence and clarity.",
      scripts: [
        {
          title: "Opening the Conversation",
          content: `"I'd like to discuss the possibility of an ADHD evaluation. I've been experiencing [specific symptoms] that are impacting my work/relationships/daily life, and I think ADHD might explain some of these challenges."`
        },
        {
          title: "When They Dismiss Your Concerns",
          content: `"I understand you might not see ADHD immediately, but these symptoms are significantly affecting my quality of life. Could we explore this possibility or perhaps refer me to a specialist who can do a comprehensive evaluation?"`
        },
        {
          title: "If They Say You're Too Old/Smart/Successful",
          content: `"ADHD can present differently in adults and can be masked by intelligence or coping strategies I've developed over time. I'd appreciate a thorough evaluation to rule it in or out definitively."`
        }
      ],
      tips: [
        "Bring a list of specific symptoms and examples",
        "Mention how symptoms impact your daily functioning",
        "Consider bringing a trusted friend or family member for support",
        "Don't be afraid to seek a second opinion if dismissed"
      ]
    }
  },
  {
    name: 'How to tell your partner what you need',
    category: 'Relationship Communication',
    emoji: '💕',
    slug: 'how-to-tell-your-partner-what-you-need',
    content: {
      intro: "Clear communication about your ADHD needs can strengthen your relationship. Here's how to have this important conversation.",
      scripts: [
        {
          title: "Explaining Your ADHD",
          content: `"I want to help you understand how my ADHD affects me so we can work together better. When I [specific behavior], it's not because I don't care—it's because my brain processes things differently."`
        },
        {
          title: "Asking for Specific Support",
          content: `"It would really help me if you could [specific request]. For example, when we make plans, could you send me a reminder text the day before? It's not that I don't value our time together—my brain just needs that extra support."`
        },
        {
          title: "When You Make a Mistake",
          content: `"I know I messed up by [specific mistake], and I'm sorry it affected you. This is one of those areas where my ADHD trips me up. Can we problem-solve together how to prevent this in the future?"`
        }
      ],
      tips: [
        "Be specific about what support looks like",
        "Explain the 'why' behind your needs",
        "Focus on solutions, not just problems",
        "Appreciate their efforts to understand and help"
      ]
    }
  },
  {
    name: 'What to say when you forgot again',
    category: 'Repair & Reassurance',
    emoji: '😔',
    slug: 'what-to-say-when-you-forgot-again',
    content: {
      intro: "ADHD memory challenges can strain relationships. Here's how to acknowledge, apologize, and move forward constructively.",
      scripts: [
        {
          title: "Taking Responsibility",
          content: `"I forgot about [specific thing], and I can see that this affected you. This isn't an excuse, but my ADHD makes it hard for me to keep track of everything. I'm sorry, and I want to figure out how to do better."`
        },
        {
          title: "When Someone's Frustrated",
          content: `"I can hear that you're frustrated, and I don't blame you. I'm frustrated with myself too. My forgetting isn't about you not being important to me—you are incredibly important. Can we brainstorm some systems to help me remember better?"`
        },
        {
          title: "Making Amends",
          content: `"I know saying sorry doesn't undo the impact of my forgetting. What can I do right now to help repair this? And what systems can we put in place so this doesn't happen again?"`
        }
      ],
      tips: [
        "Acknowledge the impact, not just the mistake",
        "Avoid over-explaining or making it about your ADHD struggles",
        "Focus on solutions and prevention",
        "Follow through on any commitments you make to do better"
      ]
    }
  },
  {
    name: 'How to ask your boss for accommodations',
    category: 'Workplace Advocacy',
    emoji: '💼',
    slug: 'how-to-ask-your-boss-for-accommodations',
    content: {
      intro: "Requesting workplace accommodations is your right. Here's how to approach this conversation professionally and effectively.",
      scripts: [
        {
          title: "Initial Request",
          content: `"I'd like to schedule a meeting to discuss some workplace accommodations that would help me perform my job more effectively. I have ADHD, which affects [specific work areas], and there are some reasonable adjustments that could really improve my productivity."`
        },
        {
          title: "Explaining the Need",
          content: `"Due to my ADHD, I sometimes struggle with [specific challenge]. A helpful accommodation would be [specific request], which would allow me to [specific benefit]. This is similar to how someone might need a standing desk for back issues."`
        },
        {
          title: "Addressing Concerns",
          content: `"I understand you might have questions about how this would work. I'm committed to my role and my team's success. These accommodations would actually help me contribute more effectively, not less."`
        }
      ],
      tips: [
        "Know your rights under the ADA (if applicable)",
        "Be specific about what accommodations you need",
        "Focus on how accommodations improve your work performance",
        "Consider bringing documentation from your healthcare provider"
      ]
    }
  },
  {
    name: 'I\'m trying my best (to family/friends/self)',
    category: 'Self-Compassion',
    emoji: '💙',
    slug: 'im-trying-my-best-to-family-friends-self',
    content: {
      intro: "Sometimes you need to remind others—and yourself—that you're doing your best with the brain you have.",
      scripts: [
        {
          title: "To Family/Friends",
          content: `"I know it might not always look like it, but I am trying my best. My ADHD brain works differently, and what looks effortless for you might be incredibly difficult for me. I'm not making excuses—I'm explaining my reality."`
        },
        {
          title: "When Someone Says 'Just Try Harder'",
          content: `"I understand that from the outside it might look like I'm not trying hard enough. But having ADHD means that 'just trying harder' isn't always the solution. Sometimes I need to try differently, not harder."`
        },
        {
          title: "To Yourself",
          content: `"I am doing my best with the brain I have. ADHD makes some things harder for me, and that's not a character flaw. I'm learning, growing, and finding strategies that work for me. My progress might look different from others', but it's still progress."`
        }
      ],
      tips: [
        "Remember: effort and results aren't always proportional with ADHD",
        "Your best might look different day to day—that's okay",
        "Focus on progress, not perfection",
        "Surround yourself with people who understand and support you"
      ]
    }
  }
]

interface ScriptPageProps {
  params: Promise<{ slug: string }>
}

export default function ScriptPage({ params }: ScriptPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null)
  const [script, setScript] = useState<any>(null)
  const [copiedScript, setCopiedScript] = useState<string | null>(null)

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)

      // Find the script data
      const foundScript = scriptsData.find(s => s.slug === resolved.slug)
      setScript(foundScript)
    }

    resolveParams()
  }, [params])

  const copyToClipboard = async (text: string, title: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedScript(title)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const goBack = () => {
    window.history.back()
  }

  if (!resolvedParams || !script) {
    return (
      <div className="min-h-screen bg-[#E8D7FF] dark:bg-[#453975] relative flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Script Not Found</h1>
          <p className="text-black/70 dark:text-white/70 mb-6">
            The script you're looking for doesn't exist or hasn't been created yet.
          </p>
          <Button
            onClick={goBack}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8D7FF] dark:bg-[#453975] relative">
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={goBack}
              className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-black dark:text-white" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl">{script.emoji}</span>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-black text-center">
                  {script.name}
                </h1>
              </div>
              <p className="text-center text-black/70 text-sm">
                {script.category}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="backdrop-blur-md bg-white/20 dark:bg-black/20 rounded-3xl p-8 mb-8">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-black dark:text-white text-lg leading-relaxed">
              {script.content.intro}
            </p>
          </div>

          {/* Scripts */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
              <MessageSquareText className="h-5 w-5" />
              Scripts to Use
            </h2>

            {script.content.scripts.map((scriptItem: any, index: number) => (
              <div key={index} className="bg-white/30 dark:bg-black/30 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-black dark:text-white">
                    {scriptItem.title}
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(scriptItem.content, scriptItem.title)}
                    className="text-black/70 dark:text-white/70 hover:bg-white/20"
                  >
                    {copiedScript === scriptItem.title ? (
                      <span className="text-green-600 text-sm">Copied!</span>
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-black/80 dark:text-white/80 italic leading-relaxed">
                  {scriptItem.content}
                </p>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="bg-white/30 dark:bg-black/30 rounded-2xl p-6">
            <h3 className="font-medium text-black dark:text-white mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Helpful Tips
            </h3>
            <ul className="space-y-3">
              {script.content.tips.map((tip: string, index: number) => (
                <li key={index} className="text-black/80 dark:text-white/80 flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: script.name,
                  text: script.content.intro,
                  url: window.location.href,
                })
              } else {
                copyToClipboard(window.location.href, 'URL')
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Share className="h-4 w-4 mr-2" />
            Share Script
          </Button>
        </div>
      </div>
    </div>
  )
}