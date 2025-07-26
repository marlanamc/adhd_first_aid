'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, Heart, Smartphone, Calendar, MessageSquareText, Clock, Laptop, Users, Brain, Zap, Volume2, Eye, ShoppingCart, Utensils, Bed, Briefcase, Mail, AlertCircle, Plus, Minus, Share2, Wrench, Construction, Rainbow, Puzzle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

interface ComplexLoopPageProps {
  params: {
    loop: string
  }
}

export default function ComplexLoopPage({ params }: ComplexLoopPageProps) {
  const [loopName, setLoopName] = useState<string>('')
  const [loopIcon, setLoopIcon] = useState<React.ElementType>(RotateCcw)
  const [expandedSections, setExpandedSections] = useState<{[key: number]: boolean}>({})
  const [hoveredSection, setHoveredSection] = useState<number | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  useEffect(() => {
    // Convert URL param back to display name
    const name = decodeURIComponent(params.loop)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/And/g, '&')
    setLoopName(name)

    // Map complex loops to Lucide icons (matching main complex loops page)
    const iconMap: Record<string, React.ElementType> = {
      // Digital & Screen
      'Phone Scrolling': Smartphone,
      'Screen Time Binges': Laptop,
      'Social Media Spirals': MessageSquareText,
      'Online Shopping': ShoppingCart,
      
      // Time & Schedule
      'Chronic Lateness': Clock,
      'Missed Appointments': Calendar,
      'Last Minute Canceling': Calendar,
      'Double Booking Yourself': Calendar,
      
      // Emotional & Social
      'People Pleasing Burnout': Users,
      'Rejection Sensitivity Loops': Heart,
      'Social Masking Exhaustion': Users,
      'Text Message Avoidance': MessageSquareText,
      'Email Overwhelm': Mail,
      'Friendships': Users,
      'Intimacy': Heart,
      
      // Decision & Perfectionism
      'Decision Overwhelm': Brain,
      'Perfectionism Cycles': Eye,
      'Analysis Paralysis': Brain,
      'Pre Event Paralysis': AlertCircle,
      
      // Life & Wellness
      'Overeating': Utensils,
      'Undereating': Utensils,
      'Job Search': Briefcase,
      
      // Sleep & Energy
      'Can\'t Fall Asleep': Brain,
      'Sleeping Through Alarms': Volume2,
      'Constantly Tired': Eye,
      'Bedtime Procrastination': Clock
    }
    setLoopIcon(iconMap[name] || RotateCcw)
  }, [params.loop])

  const goBack = () => {
    // Check if there's a category parameter in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    
    if (category) {
      // Go back to the specific category page - re-encode the category
      window.location.href = `/complex_loops?category=${encodeURIComponent(category)}`
    } else {
      // Try browser history first, fallback to main complex loops page
      if (document.referrer && document.referrer.includes('/complex_loops')) {
        window.history.back()
      } else {
        window.location.href = '/complex_loops'
      }
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `ADHD First Aid Kit - ${loopName}`,
      text: `Get help breaking the ${loopName.toLowerCase()} loop - ADHD-friendly strategies and support`,
      url: window.location.href
    }

    try {
      // Check if native sharing is available and supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard with better feedback
        await navigator.clipboard.writeText(window.location.href)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000) // Reset after 2 seconds
      }
    } catch (error) {
      // Fallback to clipboard if share fails
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000) // Reset after 2 seconds
      } catch (clipboardError) {
        console.error('Share failed:', error)
      }
    }
  }

  // Validation messages for different complex loops
  const getValidationMessage = (loop: string) => {
    const messages: Record<string, string> = {
      'Phone Scrolling': "Phone scrolling isn't laziness - it's your brain seeking dopamine. Your executive function isn't broken, it just needs different support.",
      'Social Media Spirals': "Social media comparison hits ADHDers especially hard due to rejection sensitivity. Your worth isn't measured by posts.",
      'Chronic Lateness': "Time blindness is a real ADHD symptom, not a character flaw. Your brain processes time differently.",
      'Decision Overwhelm': "ADHD brains get overwhelmed by too many options. This isn't indecisiveness - it's neurodivergent decision processing.",
      'People Pleasing Burnout': "Rejection sensitivity makes you overcompensate. Your needs matter too - saying no is self-care.",
      'Email Overwhelm': "Email paralysis is common with ADHD. The backlog doesn't reflect your character or capabilities.",
      'Can\'t Fall Asleep': "Racing thoughts at bedtime are part of ADHD. Your brain isn't trying to sabotage you - it just needs help winding down.",
      'Bedtime Procrastination': "Revenge bedtime procrastination is real. You deserve downtime, even if it means staying up late.",
      'Analysis Paralysis': "Perfectionism and ADHD create analysis paralysis. Good enough is actually good enough."
    }
    return messages[loop] || `This pattern feels overwhelming because ADHD brains get stuck in loops. You're not broken - your brain just needs different strategies to break free.`
  }

  // Loop-breaking strategies based on the specific complex loop
  const getLoopBreakingStrategies = (loop: string) => {
    const strategies: Record<string, Array<{title: string, description: string}>> = {
      'Phone Scrolling': [
        { title: "Set specific scroll times", description: "Allow yourself 15 minutes at 9am, 1pm, and 7pm. Set timers." },
        { title: "Move phone to another room", description: "Physical distance creates mental distance from the urge." },
        { title: "Replace with fidget alternative", description: "Keep stress ball, fidget toy, or book nearby for when you need stimulation." }
      ],
      'Social Media Spirals': [
        { title: "Unfollow accounts that trigger comparison", description: "Your feed should support, not sabotage your mental health." },
        { title: "Set daily time limits", description: "Use built-in screen time controls to limit social apps to 30 minutes daily." },
        { title: "Practice the 'post and leave' rule", description: "Share your content then immediately close the app - don't wait for reactions." }
      ],
      'Chronic Lateness': [
        { title: "Add 'ADHD time' to estimates", description: "Whatever you think it takes, add 25% more time for transitions and delays." },
        { title: "Set 'leaving alarms'", description: "Set multiple alarms: 'get ready now,' 'gather items,' and 'walk out door.'" },
        { title: "Prepare the night before", description: "Lay out clothes, pack bags, prep coffee - reduce morning decisions." }
      ],
      'Decision Overwhelm': [
        { title: "Limit options to 3", description: "Too many choices paralyze ADHD brains. Narrow down to max 3 options." },
        { title: "Set decision deadlines", description: "Give yourself 24-48 hours max, then choose the 'good enough' option." },
        { title: "Use the 'coin flip test'", description: "Flip a coin - your gut reaction to the result reveals your true preference." }
      ],
      'Email Overwhelm': [
        { title: "Declare email bankruptcy", description: "Archive everything older than 2 weeks. Start fresh - the important stuff will resurface." },
        { title: "Use the 2-minute rule", description: "If it takes less than 2 minutes to respond, do it immediately." },
        { title: "Set email office hours", description: "Check only at set times (9am, 1pm, 5pm) then close the app." }
      ],
      'Can\'t Fall Asleep': [
        { title: "Brain dump before bed", description: "Write down racing thoughts for 10 minutes - get them out of your head." },
        { title: "Try the '4-7-8' breathing", description: "Inhale for 4, hold for 7, exhale for 8. Repeat until drowsy." },
        { title: "Use white noise or brown noise", description: "Consistent sound masks racing thoughts and environmental distractions." }
      ],
      'Bedtime Procrastination': [
        { title: "Schedule your 'me time' earlier", description: "Block out 30-60 minutes of protected personal time before 9pm." },
        { title: "Create a bedtime routine you enjoy", description: "Make bedtime something to look forward to, not just an end to fun." },
        { title: "Set a 'bedtime alarm'", description: "Alarm at 9pm means start winding down, not necessarily sleep time." }
      ],
      'Analysis Paralysis': [
        { title: "Set a 'good enough' standard", description: "80% perfect and done is better than 100% perfect and never finished." },
        { title: "Time-box research/planning", description: "Give yourself 2 hours max to research, then make a decision with available info." },
        { title: "Ask 'What's the worst that could happen?'", description: "Usually the worst case isn't actually that bad, and it's reversible." }
      ]
    }
    
    return strategies[loop] || [
      { title: "Interrupt the pattern", description: "When you notice the loop starting, pause and take 3 deep breaths." },
      { title: "Change your environment", description: "Sometimes moving to a different space breaks the mental loop." },
      { title: "Set a timer for the loop", description: "Allow yourself 10 minutes in the loop, then redirect to something else." }
    ]
  }

  const loopBreakingStrategies = getLoopBreakingStrategies(loopName)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8fd3f4] via-[#78c2f2] to-[#a18cd1] relative">
      <div className="max-w-5xl mx-auto px-6 py-8 pt-24">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-5">
              <Button
                variant="ghost"
                size="default"
                onClick={goBack}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-2 sm:gap-3">
                  {React.createElement(loopIcon, {
                    className: "h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0"
                  })}
                  {loopName}
                </h1>
              </div>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={handleShare}
                  className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
                  title={copySuccess ? "Link copied!" : "Share this page"}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                {copySuccess && (
                  <div className="absolute -top-8 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                    Link copied!
                  </div>
                )}
              </div>
            </div>

            {/* Validation Header */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <p className="text-lg md:text-xl text-foreground leading-relaxed">
                {getValidationMessage(loopName)}
              </p>
            </div>
          </div>

          {/* Gentle guidance note */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
              <span className="text-lg">🌱</span>
              <span>Take your time, open each section when you're ready</span>
            </p>
          </div>

          {/* Collapsible Loop-Breaking Strategies */}
          <div className="mb-8 space-y-4">
            {loopBreakingStrategies.map((strategy, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => toggleSection(index)}
                  onMouseEnter={() => setHoveredSection(index)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="w-full flex items-center gap-3 mb-4 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {strategy.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Loop-breaking strategy
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
                
                {expandedSections[index] && (
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4 animate-in slide-in-from-top duration-300">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {strategy.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show All Strategies Button - moved above navigation */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Need More Strategies?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-center">
                Explore all available strategies specifically for breaking the {loopName.toLowerCase()} loop.
              </p>
              <div className="text-center">
                <Button 
                  onClick={() => window.location.href = `/strategies?complex_loop=${encodeURIComponent(loopName)}`}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Show All Strategies for {loopName}
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Options - Excluding Complex Loops */}
          <div className="space-y-6">
            {/* Top Row - Feelings and Barriers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/feelings'}
                className="p-6 text-left h-auto border-2 hover:bg-pink-50 dark:hover:bg-pink-900/20"
              >
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Feeling stuck emotionally?</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Feelings</div>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/barriers'}
                className="p-6 text-left h-auto border-2 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                <div className="flex items-center gap-3">
                  <Construction className="h-6 w-6" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Facing barriers or obstacles?</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Barriers Support</div>
                  </div>
                </div>
              </Button>
            </div>

            {/* Middle Row - Tasks and Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/tasks'}
                className="p-6 text-left h-auto border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="h-6 w-6" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Need help with specific tasks?</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Tasks</div>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/identities'}
                className="p-6 text-left h-auto border-2 hover:bg-pink-50 dark:hover:bg-pink-900/20"
              >
                <div className="flex items-center gap-3">
                  <Rainbow className="h-6 w-6" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Need identity-aware support?</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">→ Browse by Identity</div>
                  </div>
                </div>
              </Button>
            </div>

            {/* Bottom Row - Systems Lab */}
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/systems'}
                className="p-6 text-left h-auto border-2 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <div className="flex items-center gap-3">
                  <Puzzle className="h-6 w-6" />
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