'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, AlertCircle, Ban, Battery, Brain, CloudLightning, Clock, HelpCircle, Mountain, Frown, CloudRain, XCircle, Timer, Map, Users, Shuffle, Heart, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

interface BarrierPageProps {
  params: {
    barrier: string
  }
}

export default function BarrierPage({ params }: BarrierPageProps) {
  const [barrierName, setBarrierName] = useState<string>('')
  const [barrierIcon, setBarrierIcon] = useState<React.ElementType>(AlertCircle)
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
    const name = decodeURIComponent(params.barrier)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    setBarrierName(name)

    // Map barriers to Lucide icons (matching main barriers page)
    const iconMap: Record<string, React.ElementType> = {
      "I Can't Start": Ban,
      "I Keep Avoiding It": XCircle,
      "I Don't Have Energy": Battery,
      "I Get Distracted": CloudLightning,
      "I Forgot": Brain,
      "I Can't Stay Focused": Brain,
      "I Run Out Of Steam": Battery,
      "I Don't Have Time": Clock,
      "I Don't Know How": HelpCircle,
      "I Feel Frozen": Ban,
      "It Feels Too Big": Mountain,
      "I Feel Shame": Frown,
      "It Feels Pointless": CloudRain,
      "I'm Afraid I'll Fail": AlertCircle,
      "I Already Failed": XCircle,
      "I Feel Emotionally Blocked": Ban,
      "It's Not Urgent": Timer,
      "I Feel Alone": Users,
      "I Don't Know Where To Start": Map,
      "Too Many Decisions": Shuffle
    }
    setBarrierIcon(iconMap[name] || AlertCircle)
  }, [params.barrier])

  const goBack = () => {
    window.history.back()
  }

  // Micro strategies for this barrier (placeholder)
  const microStrategies = [
    {
      title: "Take One Breath",
      description: "Sometimes the first step is just acknowledging where you are."
    },
    {
      title: "Make It Smaller",
      description: "Break whatever you're facing into the tiniest possible piece."
    },
    {
      title: "Change Your Location", 
      description: "Sometimes a different environment shifts everything."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbc687] via-[#fff5db] to-[#d4fc79] relative">
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-lg">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="default"
                onClick={goBack}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-3">
                  {React.createElement(barrierIcon, {
                    className: "h-8 w-8 text-orange-500"
                  })}
                  {barrierName}
                </h1>
              </div>
            </div>

            {/* Validation Header */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <p className="text-lg md:text-xl text-foreground leading-relaxed">
                This barrier is real and valid. Your brain isn't broken - it just works differently, 
                and sometimes it needs different approaches to move forward.
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

          {/* Collapsible Micro Strategies */}
          <div className="mb-8 space-y-4">
            {microStrategies.map((strategy, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => toggleSection(index)}
                  onMouseEnter={() => setHoveredSection(index)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="w-full flex items-center gap-3 mb-4 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-3">
                    <span className="text-2xl">🚧</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {strategy.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Barrier breakthrough strategy
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
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Need More Strategies?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-center">
                Explore all available strategies specifically for overcoming "{barrierName.toLowerCase()}".
              </p>
              <div className="text-center">
                <Button 
                  onClick={() => window.location.href = `/strategies?barrier=${encodeURIComponent(barrierName)}`}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Show All Strategies for "{barrierName}"
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="grid gap-4 md:grid-cols-2 pt-4">
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/feelings'}
              className="p-6 text-left h-auto border-2 hover:bg-pink-50 dark:hover:bg-pink-900/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">❤️</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Feeling stuck emotionally?</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Feelings</div>
                </div>
              </div>
            </Button>

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
  )
}