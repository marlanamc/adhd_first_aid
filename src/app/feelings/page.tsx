'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, Brain, Zap, Frown, Users, BrainCircuit, Battery, Flame, Sparkles, CloudLightning, Rainbow, AlertCircle, Skull, CloudRain, Waves, CloudDrizzle, Shield, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

// Categories with counts
const categories = [
  { name: 'Cognitive & Overload', color: 'from-blue-400 to-cyan-500', count: 5 },
  { name: 'Dysregulation & Shutdown', color: 'from-gray-400 to-slate-500', count: 6 },
  { name: 'Heavy Feelings', color: 'from-purple-400 to-pink-500', count: 4 },
  { name: 'Jittery & Wound Up', color: 'from-yellow-400 to-orange-500', count: 4 },
  { name: 'Social & Connection', color: 'from-green-400 to-teal-500', count: 3 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 22 }
]

// Feelings data with new categories
const feelings = [
  // Cognitive & Overload  
  { name: 'Mental Fog', category: 'Cognitive & Overload', icon: CloudDrizzle },
  { name: 'Overwhelmed', category: 'Cognitive & Overload', icon: Waves },
  { name: 'Forgetful', category: 'Cognitive & Overload', icon: Brain },
  { name: 'Scattered', category: 'Cognitive & Overload', icon: CloudLightning },
  { name: 'Overstimulated', category: 'Cognitive & Overload', icon: Sparkles },
  
  // Dysregulation & Shutdown
  { name: 'Stuck', category: 'Dysregulation & Shutdown', icon: BrainCircuit },
  { name: 'Drained', category: 'Dysregulation & Shutdown', icon: Battery },
  { name: 'Burned Out', category: 'Dysregulation & Shutdown', icon: Flame },
  { name: 'Numb', category: 'Dysregulation & Shutdown', icon: Skull },
  { name: 'Ashamed', category: 'Dysregulation & Shutdown', icon: Frown },
  { name: 'Frustrated', category: 'Dysregulation & Shutdown', icon: Flame },
  
  // Heavy Feelings
  { name: 'Guilty', category: 'Heavy Feelings', icon: AlertCircle },
  { name: 'Defeated', category: 'Heavy Feelings', icon: CloudRain },
  { name: 'Hopeless', category: 'Heavy Feelings', icon: CloudRain },
  { name: 'Stressed', category: 'Heavy Feelings', icon: Zap },
  
  // Jittery & Wound Up
  { name: 'Anxious', category: 'Jittery & Wound Up', icon: AlertCircle },
  { name: 'Restless', category: 'Jittery & Wound Up', icon: Sparkles },
  { name: 'Wired', category: 'Jittery & Wound Up', icon: Zap },
  { name: 'Tense', category: 'Jittery & Wound Up', icon: Shield },
  
  // Social & Connection
  { name: 'Lonely', category: 'Social & Connection', icon: Users },
  { name: 'Misunderstood', category: 'Social & Connection', icon: Users },
  { name: 'Rejected', category: 'Social & Connection', icon: UserX }
]

export default function FeelingsPage() {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Cognitive & Overload')

  // Read category from URL parameter on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryFromUrl = urlParams.get('category')
    if (categoryFromUrl) {
      const decodedCategory = decodeURIComponent(categoryFromUrl)
      console.log('URL category:', categoryFromUrl)
      console.log('Decoded category:', decodedCategory)
      
      // Check if the decoded category matches any of our known categories exactly
      const matchingCategory = categories.find(cat => cat.name === decodedCategory)
      if (matchingCategory) {
        setSelectedCategory(decodedCategory)
      } else {
        console.log('No matching category found for:', decodedCategory)
        console.log('Available categories:', categories.map(cat => cat.name))
      }
    }
  }, [])

  const handleFeelingSelect = (feeling: string) => {
    setSelectedFeeling(feeling)
    // Navigate to individual feeling page with category parameter
    const feelingSlug = encodeURIComponent(feeling.toLowerCase().replace(/\s+/g, '-'))
    const categoryParam = selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ''
    window.location.href = `/feelings/${feelingSlug}${categoryParam}`
  }

  const goBack = () => {
    window.history.back()
  }

  // Filter feelings by selected category
  const filteredFeelings = selectedCategory === 'View All'
    ? [...feelings].sort((a, b) => a.name.localeCompare(b.name))
    : selectedCategory 
    ? feelings.filter(feeling => feeling.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbc2eb] via-[#fbd786] to-[#fbc687] relative">
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
                How are you feeling right now?
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black text-center mb-6">Choose a feeling type:</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    {category.count} feeling{category.count > 1 ? 's' : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Category Feelings */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-black text-center mb-8">
              {selectedCategory === 'View All' ? 'All Feelings' : selectedCategory}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {filteredFeelings.map((feeling) => (
                <div
                  key={feeling.name}
                  onClick={() => handleFeelingSelect(feeling.name)}
                  className={`
                    group cursor-pointer transform transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1
                    ${selectedFeeling === feeling.name ? 'scale-105 -translate-y-1' : ''}
                  `}
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 
                                shadow-lg hover:shadow-xl transition-all duration-300
                                group-hover:bg-white/30
                                h-32 flex flex-col justify-center items-center
                                border border-black/[0.08] dark:border-white/[0.15]">
                    
                    {/* Icon */}
                    <div className="text-2xl mb-1 transition-all duration-300 group-hover:scale-110">
                      {React.createElement(feeling.icon, {
                        size: 24,
                        className: "text-black dark:text-white"
                      })}
                    </div>
                    
                    {/* Feeling Name */}
                    <h3 className="text-sm font-medium text-black text-center transition-all duration-300">
                      {feeling.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Text */}
        <div className="text-center mt-12 max-w-3xl mx-auto">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-black mb-2">
              Don't see your feeling?
            </h3>
            <p className="text-black text-sm mb-4">
              Sometimes emotions are complex. Try exploring other approaches to find what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/barriers'}
                className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm"
              >
                Browse by Barriers
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