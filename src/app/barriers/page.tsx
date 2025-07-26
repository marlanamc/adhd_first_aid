'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, AlertCircle, Ban, Battery, Brain, CloudLightning, Clock, HelpCircle, Mountain, Frown, CloudRain, XCircle, Timer, Map, Users, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

// Barrier data from Content_Index.csv with icons
const barriers = [
  // Executive Function
  { name: "I can't start", category: 'Executive Function', icon: Ban },
  { name: "I keep avoiding it", category: 'Executive Function', icon: XCircle },
  { name: "I don't have energy", category: 'Executive Function', icon: Battery },
  { name: "I get distracted", category: 'Executive Function', icon: CloudLightning },
  { name: "I forgot", category: 'Executive Function', icon: Brain },
  { name: "I can't stay focused", category: 'Executive Function', icon: Brain },
  { name: "I run out of steam", category: 'Executive Function', icon: Battery },
  { name: "I don't have time", category: 'Executive Function', icon: Clock },
  { name: "I don't know how", category: 'Executive Function', icon: HelpCircle },
  { name: "I feel frozen", category: 'Executive Function', icon: Ban },
  
  // Emotional Blocks
  { name: "It feels too big", category: 'Emotional Blocks', icon: Mountain },
  { name: "I feel shame", category: 'Emotional Blocks', icon: Frown },
  { name: "It feels pointless", category: 'Emotional Blocks', icon: CloudRain },
  { name: "I'm afraid I'll fail", category: 'Emotional Blocks', icon: AlertCircle },
  { name: "I already failed", category: 'Emotional Blocks', icon: XCircle },
  { name: "I feel emotionally blocked", category: 'Emotional Blocks', icon: Ban },
  
  // Motivation Issues
  { name: "It's not urgent", category: 'Motivation Issues', icon: Timer },
  { name: "I feel alone", category: 'Motivation Issues', icon: Users },
  
  // Decision Paralysis
  { name: "I don't know where to start", category: 'Decision Paralysis', icon: Map },
  { name: "Too many decisions", category: 'Decision Paralysis', icon: Shuffle }
]

const categories = [
  { name: 'Executive Function', color: 'from-blue-400 to-cyan-500', count: 10 },
  { name: 'Emotional Blocks', color: 'from-red-400 to-pink-500', count: 6 },
  { name: 'Motivation Issues', color: 'from-green-400 to-emerald-500', count: 2 },
  { name: 'Decision Paralysis', color: 'from-yellow-400 to-orange-500', count: 2 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 20 }
]

const categoryColors = {
  'Executive Function': 'from-blue-400 to-cyan-500',
  'Emotional Blocks': 'from-red-400 to-pink-500',
  'Decision Paralysis': 'from-yellow-400 to-orange-500',
  'Motivation Issues': 'from-green-400 to-emerald-500'
}

export default function BarriersPage() {
  const [selectedBarrier, setSelectedBarrier] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Executive Function')

  // Read category from URL parameter on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryFromUrl = urlParams.get('category')
    if (categoryFromUrl) {
      const decodedCategory = decodeURIComponent(categoryFromUrl)
      // Check if the decoded category matches any of our known categories exactly
      const categories = ['Executive Function', 'Social & Interpersonal', 'Emotional', 'Time & Priority', 'Decision Paralysis', 'Motivation Issues', 'View All']
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
    window.history.back()
  }

  // Filter barriers by selected category
  const filteredBarriers = selectedCategory === 'View All'
    ? [...barriers].sort((a, b) => a.name.localeCompare(b.name))
    : selectedCategory 
    ? barriers.filter(barrier => barrier.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbc687] via-[#fff5db] to-[#d4fc79] relative">
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
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-black text-center">
                What's Getting in Your Way?
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black text-center mb-6">Choose a barrier type:</h2>
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
                              group-hover:bg-white/30
                              h-16 flex flex-col justify-center
                              ${selectedCategory === category.name 
                                ? 'bg-white/40 ring-2 ring-black/[0.15] dark:ring-white/[0.3]' 
                                : 'bg-white/10 hover:bg-white/20'}`}>
                  
                  <h3 className={`text-sm font-medium text-black text-center mb-1
                                ${selectedCategory === category.name ? 'font-semibold' : ''}`}>
                    {category.name}
                  </h3>
                  <p className={`text-xs text-black/70 text-center
                                ${selectedCategory === category.name ? 'text-black/90' : ''}`}>
                    {category.count} barriers
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Category Barriers */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-black text-center mb-8">
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
                                group-hover:bg-white/30
                                h-32 flex flex-col justify-center items-center
                                border border-black/[0.08] dark:border-white/[0.15]">
                    
                    {/* Icon */}
                    <div className="text-2xl mb-1 transition-all duration-300 group-hover:scale-110">
                      {React.createElement(barrier.icon, {
                        size: 24,
                        className: "text-black dark:text-white"
                      })}
                    </div>
                    
                    {/* Barrier Name */}
                    <h3 className="text-sm font-medium text-black text-center transition-all duration-300">
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
          <div className="bg-white/30 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-black mb-2">
              Need a different approach?
            </h3>
            <p className="text-black text-sm mb-4">
              ADHD barriers are real, not character flaws. Try exploring other pathways to find what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/feelings'}
                className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm"
              >
                Browse by Feelings
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/tasks'}
                className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm"
              >
                Browse by Tasks
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/complex_loops'}
                className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm"
              >
                Browse by Complex Loops
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/identities'}
                className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm"
              >
                Browse by Identity
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}