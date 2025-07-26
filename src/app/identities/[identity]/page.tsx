'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, User, Users, Home, Briefcase, Brain, Heart, Globe, Palette, Coins, ArrowUpRight, School, HeartHandshake, Building2, Zap, GraduationCap, Brush, Plus, Minus, Share2, Wrench, Construction, RotateCcw, Puzzle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

interface IdentityPageProps {
  params: {
    identity: string
  }
}

export default function IdentityPage({ params }: IdentityPageProps) {
  const [identityName, setIdentityName] = useState<string>('')
  const [identityIcon, setIdentityIcon] = useState<React.ElementType>(User)
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
    const name = decodeURIComponent(params.identity)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    setIdentityName(name)

    // Map identities to Lucide icons (matching main identities page)
    const iconMap: Record<string, React.ElementType> = {
      'Caregiver': HeartHandshake,
      'Parent': Users,
      'Over-responsible Sibling': Users,
      'Over Responsible Sibling': Users, // Handle URL formatting
      'Solo Household Manager': Home,
      'Job Seeker': ArrowUpRight,
      'Burned Out Professional': Building2,
      'Working Multiple Jobs': Zap,
      'Entrepreneur': Briefcase,
      'Breadwinner': Coins,
      'Neurodivergent Adult': Brain,
      'Newly Diagnosed ADHD': Brain,
      'Newly Diagnosed Adhd': Brain, // Handle URL formatting
      'Sick Or Chronically Ill': Heart,
      'Sick or Chronically Ill': Heart,
      'Grieving Or Emotionally Raw': Heart,
      'Grieving or Emotionally Raw': Heart,
      'Queer Or Trans In Unsupportive Environment': User,
      'Queer or Trans in Unsupportive Environment': User,
      'Immigrant Or English Language Learner': Globe,
      'Immigrant or English Language Learner': Globe,
      'No Support System': Users,
      'Student': GraduationCap,
      'Creative With Executive Dysfunction': Brush,
      'Creative with Executive Dysfunction': Brush,
      'Low-Income / Financially Stretched': Coins,
      'Low Income / Financially Stretched': Coins,
      'Recovering Perfectionist': ArrowUpRight
    }
    setIdentityIcon(iconMap[name] || User)
  }, [params.identity])

  const goBack = () => {
    // Check if there's a category parameter in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    
    if (category) {
      // Go back to the specific category page - re-encode the category
      window.location.href = `/identities?category=${encodeURIComponent(category)}`
    } else {
      // Try browser history first, fallback to main identities page
      if (document.referrer && document.referrer.includes('/identities')) {
        window.history.back()
      } else {
        window.location.href = '/identities'
      }
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `ADHD First Aid Kit - ${identityName}`,
      text: `Get identity-aware ADHD support for ${identityName.toLowerCase()} - strategies and guidance`,
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

  // Micro strategies for this identity context (placeholder)
  const microStrategies = [
    {
      title: "Start Small",
      description: "Pick one tiny thing that feels manageable right now."
    },
    {
      title: "Honor Your Energy",
      description: "Work with your natural rhythms, not against them."
    },
    {
      title: "Find Your People", 
      description: "Connect with others who understand your specific challenges."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8fd3f4] via-[#a18cd1] to-[#b19cd9] relative">
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
                  {React.createElement(identityIcon, {
                    className: "h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0"
                  })}
                  {identityName}
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
                Your role as <strong>{identityName.toLowerCase()}</strong> comes with unique challenges. 
                You're managing more than most people realize, and that takes incredible strength.
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
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3">
                    <span className="text-2xl">🌈</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {strategy.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Identity-aware support
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
                Explore all available strategies specifically designed for {identityName.toLowerCase()}.
              </p>
              <div className="text-center">
                <Button 
                  onClick={() => window.location.href = `/strategies?identity=${encodeURIComponent(identityName)}`}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Show All Strategies for {identityName}
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Options - Excluding Identities */}
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

            {/* Middle Row - Tasks and Complex Loops */}
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
                onClick={() => window.location.href = '/complex_loops'}
                className="p-6 text-left h-auto border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-6 w-6" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Stuck in repetitive patterns?</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">→ Browse Complex Loops</div>
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