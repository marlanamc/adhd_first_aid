'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Battery, Brain, CloudLightning, Clock, HelpCircle, Mountain, Frown, XCircle, TimerOff, Map, Pause, Lightbulb, Focus, Snowflake, Target, TrendingDown, UserX, Route, Layers, HeartCrack, ZapOff, Meh, Tv, MousePointerClick, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SuggestContentModal } from '@/components/ui/SuggestContentModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'

// Icon mapping to ensure proper resolution
const iconMap = {
  XCircle,
  Battery,
  CloudLightning,
  Brain,
  Clock,
  HelpCircle,
  Mountain,
  Frown,
  TimerOff,
  Map,
  Pause,
  ZapOff,
  Lightbulb,
  Focus,
  Snowflake,
  Target,
  TrendingDown,
  UserX,
  Route,
  Layers,
  HeartCrack,
  Meh,
  Tv
}

// Barrier data with updated categories
const barriers = [
  // Getting Started
  { name: "I Can't Start", category: 'Getting Started', icon: 'Pause' },
  { name: "I Keep Avoiding It", category: 'Getting Started', icon: 'Route' },
  { name: "I Feel Frozen", category: 'Getting Started', icon: 'Snowflake' },
  
  // Decision & Planning
  { name: "I Don't Know Where to Start", category: 'Decision & Planning', icon: 'Map' },
  { name: "Too Many Decisions", category: 'Decision & Planning', icon: 'Layers' },
  { name: "I Don't Know How", category: 'Decision & Planning', icon: 'HelpCircle' },
  
  // Memory & Time
  { name: "I Forgot", category: 'Memory & Time', icon: 'Brain' },
  { name: "I Don't Have Time", category: 'Memory & Time', icon: 'Clock' },
  
  // Energy & Focus
  { name: "I Don't Have Energy", category: 'Energy & Focus', icon: 'Battery' },
  { name: "I Got Distracted", category: 'Energy & Focus', icon: 'Tv' },
  { name: "I Can't Stay Focused", category: 'Energy & Focus', icon: 'Focus' },
  { name: "I Run Out of Steam", category: 'Energy & Focus', icon: 'ZapOff' },
  
  // Emotional Blocks
  { name: "It Feels Too Big", category: 'Emotional Blocks', icon: 'Mountain' },
  { name: "I Feel Shame", category: 'Emotional Blocks', icon: 'Frown' },
  { name: "It Feels Pointless", category: 'Emotional Blocks', icon: 'TrendingDown' },
  { name: "I'm Afraid I'll Fail", category: 'Emotional Blocks', icon: 'Meh' },
  { name: "I Already Failed", category: 'Emotional Blocks', icon: 'XCircle' },
  { name: "I Feel Emotionally Blocked", category: 'Emotional Blocks', icon: 'HeartCrack' },
  
  // Motivation Issues
  { name: "It's Not Urgent", category: 'Motivation Issues', icon: 'TimerOff' },
  { name: "I Feel Alone", category: 'Motivation Issues', icon: 'UserX' },
]

const categories = [
  { name: 'Getting Started', color: 'from-blue-400 to-cyan-500', count: 3 },
  { name: 'Decision & Planning', color: 'from-purple-400 to-indigo-500', count: 3 },
  { name: 'Memory & Time', color: 'from-green-400 to-emerald-500', count: 2 },
  { name: 'Energy & Focus', color: 'from-orange-400 to-yellow-500', count: 4 },
  { name: 'Emotional Blocks', color: 'from-red-400 to-pink-500', count: 6 },
  { name: 'Motivation Issues', color: 'from-gray-400 to-slate-500', count: 2 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 20 }
]


export default function BarriersPage() {
  const [selectedBarrier, setSelectedBarrier] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Getting Started')
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
  const isMobile = useIsMobile()

  // Read category from URL parameter on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryFromUrl = urlParams.get('category')
    if (categoryFromUrl) {
      const decodedCategory = decodeURIComponent(categoryFromUrl)
      // Check if the decoded category matches any of our known categories exactly
      const categories = ['Getting Started', 'Decision & Planning', 'Memory & Time', 'Energy & Focus', 'Emotional Blocks', 'Motivation Issues', 'View All']
      const matchingCategory = categories.find(cat => cat === decodedCategory)
      if (matchingCategory) {
        setSelectedCategory(decodedCategory)
      }
    }
  }, [])

  const handleBarrierSelect = (barrier: string) => {
    setSelectedBarrier(barrier)
    // Navigate to individual barrier page with category parameter
    const barrierSlug = encodeURIComponent(barrier.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    const categoryParam = selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ''
    window.location.href = `/barriers/${barrierSlug}${categoryParam}`
  }

  const goBack = () => {
    window.location.href = '/'
  }

  // Filter barriers by selected category
  const filteredBarriers = selectedCategory === 'View All'
    ? [...barriers].sort((a, b) => a.name.localeCompare(b.name))
    : selectedCategory 
    ? barriers.filter(barrier => barrier.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen relative">
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="default"
              onClick={goBack}
              className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-[#22223B] dark:text-white" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white text-center">
                What&apos;s Getting in Your Way?
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black dark:text-white text-center mb-6 flex items-center justify-center gap-2">
            <MousePointerClick className="h-5 w-5" />
            Choose a barrier type:
          </h2>
          {isMobile ? (
            <Select value={selectedCategory || undefined} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full bg-white/20 dark:bg-gray-800/40 backdrop-blur-md border-white/30 dark:border-gray-600/30 text-black dark:text-white">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-white/30 dark:border-gray-600/30">
                {categories.map((category, index) => (
                  <SelectItem 
                    key={category.name} 
                    value={category.name}
                    className="text-black dark:text-white hover:bg-white/20 dark:hover:bg-gray-700/50"
                  >
                    {category.name === 'View All' && index > 0 && (
                      <div className="border-t border-gray-300 my-2 -mx-2"></div>
                    )}
                    <div className="flex items-center w-full">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-xl">
                          {category.name === 'Getting Started' ? '🚀' :
                           category.name === 'Decision & Planning' ? '🎯' :
                           category.name === 'Memory & Time' ? '⏰' :
                           category.name === 'Energy & Focus' ? '⚡' :
                           category.name === 'Emotional Blocks' ? '💔' :
                           category.name === 'Motivation Issues' ? '💪' :
                           category.name === 'View All' ? '👀' : '🔧'}
                        </span>
                        <span className={`font-medium text-base ${category.name === 'View All' ? 'text-gray-600' : ''}`}>
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm text-black/60 dark:text-white/60 flex-shrink-0 ml-4">
                        {category.count} {category.count === 1 ? 'barrier' : 'barriers'}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`
                    group cursor-pointer transform transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1 text-left
                    ${selectedCategory === category.name ? 'scale-105 -translate-y-1' : ''}
                  `}
                >
                  <div className={`backdrop-blur-md rounded-2xl p-3 
                                transition-all duration-300
                                group-hover:bg-white/30 group-hover:scale-[1.02]
                                h-16 flex flex-col justify-center gap-2
                                relative before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gray-200/30
                                ${selectedCategory === category.name 
                                  ? 'bg-white/40 ring-2 ring-black/[0.15] dark:ring-white/[0.3]' 
                                  : 'bg-white/10 hover:bg-white/20'}`}>
                    
                    <h3 className={`text-sm font-medium text-black dark:text-white text-center mb-1
                                  ${selectedCategory === category.name ? 'font-semibold' : ''}`}>
                      {category.name}
                    </h3>
                    <p className={`text-xs text-black dark:text-white/70 text-center
                                  ${selectedCategory === category.name ? 'text-black dark:text-white/90' : ''}`}>
                      {category.count} barriers
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Category Barriers */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white text-center mb-8">
              {selectedCategory === 'View All' ? 'All Barriers' : selectedCategory}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBarriers.map((barrier) => (
                <div
                  key={barrier.name}
                  onClick={() => handleBarrierSelect(barrier.name)}
                  className={`
                    group cursor-pointer transform transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1
                    ${selectedBarrier === barrier.name ? 'scale-105 -translate-y-1' : ''}
                  `}
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 
                                shadow-lg hover:shadow-xl transition-all duration-300
                                group-hover:bg-white/30 group-hover:scale-[1.02]
                                h-32 flex flex-col justify-center items-center gap-3
                                border border-black/[0.08] dark:border-white/[0.15]
                                relative before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gray-200/30">
                    
                    {/* Icon */}
                    <div className="text-2xl mb-1 transition-all duration-300 group-hover:scale-110">
                      {barrier.icon && iconMap[barrier.icon as keyof typeof iconMap] ? React.createElement(iconMap[barrier.icon as keyof typeof iconMap], {
                        size: 24,
                        className: "text-black dark:text-white dark:text-white"
                      }) : <HelpCircle size={24} className="text-black dark:text-white dark:text-white" />}
                    </div>
                    
                    {/* Barrier Name */}
                    <h3 className="text-sm font-medium text-black dark:text-white text-center transition-all duration-300">
                      {barrier.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Text */}
        <div className="text-center mt-12 max-w-3xl mx-auto">
          <div className="bg-white/20 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 dark:border-gray-600/30">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Need a different approach?
            </h3>
            
            {/* Suggest a Barrier Button */}
            <div className="mb-4 flex justify-center">
              <Button
                onClick={() => setIsSuggestModalOpen(true)}
                className="group relative px-4 py-2 bg-gradient-to-r from-[#fbd786] via-[#fff5db] to-[#c0f5a3] hover:from-[#f5d17f] hover:via-[#f9f2d4] hover:to-[#b9f29c] text-gray-800 font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white/30 rounded-md group-hover:bg-white/40 transition-colors">
                    <Shield className="h-4 w-4 text-gray-700" />
                  </div>
                  <span>Suggest a Barrier</span>
                </div>
              </Button>
            </div>
            
            <p className="text-black dark:text-white text-sm mb-4">
              ADHD barriers are real, not character flaws. Try exploring other pathways to find what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/feelings'}
                className="bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/60 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Feelings
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/life_areas'}
                className="bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/60 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Life Areas
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/complex_loops'}
                className="bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/60 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Complex Loops
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/identities'}
                className="bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/60 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Identity
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Suggest Barrier Modal */}
      <SuggestContentModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        contentType="barrier"
      />
    </div>
  )
}