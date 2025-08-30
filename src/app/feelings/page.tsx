'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Brain, Zap, Frown, Users, LockKeyhole, Flame, CloudLightning, Activity, Skull, CloudRain, Waves, CloudDrizzle, ArrowLeftRight, UserMinus, UserCircle, ZapOff, EyeOff, Sparkles, BatteryLow, Scissors, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SuggestFeelingModal } from '@/components/ui/SuggestFeelingModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useIsMobile } from '@/hooks/use-mobile'
import FixedBottomActions from '@/components/ui/FixedBottomActions'
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
  { name: 'Stuck', category: 'Dysregulation & Shutdown', icon: LockKeyhole },
  { name: 'Drained', category: 'Dysregulation & Shutdown', icon: BatteryLow },
  { name: 'Burned Out', category: 'Dysregulation & Shutdown', icon: Flame },
  { name: 'Numb', category: 'Dysregulation & Shutdown', icon: Skull },
  { name: 'Ashamed', category: 'Dysregulation & Shutdown', icon: Frown },
  { name: 'Frustrated', category: 'Dysregulation & Shutdown', icon: ZapOff },
  
  // Heavy Feelings
  { name: 'Guilty', category: 'Heavy Feelings', icon: EyeOff },
  { name: 'Defeated', category: 'Heavy Feelings', icon: CloudRain },
  { name: 'Hopeless', category: 'Heavy Feelings', icon: UserMinus },
  { name: 'Stressed', category: 'Heavy Feelings', icon: Zap },
  
  // Jittery & Wound Up
  { name: 'Anxious', category: 'Jittery & Wound Up', icon: Activity },
  { name: 'Restless', category: 'Jittery & Wound Up', icon: ArrowLeftRight },
  { name: 'Wired', category: 'Jittery & Wound Up', icon: Zap },
  { name: 'Tense', category: 'Jittery & Wound Up', icon: Scissors },
  
  // Social & Connection
  { name: 'Lonely', category: 'Social & Connection', icon: UserCircle },
  { name: 'Misunderstood', category: 'Social & Connection', icon: Users },
  { name: 'Rejected', category: 'Social & Connection', icon: UserX }
]

export default function FeelingsPage() {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Cognitive & Overload')
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
  const isMobile = useIsMobile()

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
    window.location.href = '/'
  }

  // Filter feelings by selected category
  const filteredFeelings = selectedCategory === 'View All'
    ? [...feelings].sort((a, b) => a.name.localeCompare(b.name))
    : selectedCategory 
    ? feelings.filter(feeling => feeling.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen relative">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <Button
              variant="ghost"
              size="default"
              onClick={goBack}
              className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-[#22223B] dark:text-white" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-black dark:text-white text-center">
                How are you feeling right now?
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection - Mobile Optimized */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-black dark:text-white text-center mb-4 md:mb-6">
            Choose a feeling category
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
                          {category.name === 'Cognitive & Overload' ? '🧠' :
                           category.name === 'Dysregulation & Shutdown' ? '😵‍💫' :
                           category.name === 'Heavy Feelings' ? '💔' :
                           category.name === 'Jittery & Wound Up' ? '⚡' :
                           category.name === 'Social & Connection' ? '🤝' :
                           category.name === 'View All' ? '👀' : '🔧'}
                        </span>
                        <span className={`font-medium text-base ${category.name === 'View All' ? 'text-gray-600' : ''}`}>
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm text-black/60 dark:text-white/60 flex-shrink-0 ml-4">
                        {category.count} {category.count === 1 ? 'feeling' : 'feelings'}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`
                    group cursor-pointer transform transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1 text-left
                    active:scale-95
                    ${selectedCategory === category.name ? 'scale-105 -translate-y-1' : ''}
                  `}
                >
                  <div className={`
                    backdrop-blur-md rounded-2xl p-3 
                    transition-all duration-300
                    group-hover:bg-white/30 group-hover:scale-[1.02]
                    flex flex-col items-center justify-center
                    h-16 gap-2
                    ${selectedCategory === category.name 
                      ? 'bg-white/40 ring-2 ring-white/50 shadow-lg' 
                      : 'bg-white/10 hover:bg-white/20'}
                  `}>
                    <h3 className={`text-sm font-medium text-black dark:text-white text-center
                                  ${selectedCategory === category.name ? 'font-bold' : ''}`}>
                      {category.name}
                    </h3>
                    <span className={`text-xs text-black/60 dark:text-white/60 text-center
                                    ${selectedCategory === category.name ? 'text-black/80 dark:text-white/80' : ''}`}>
                      {category.count} {category.count === 1 ? 'feeling' : 'feelings'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Category Feelings */}
        {selectedCategory && (
          <div>
            {/* Visual separator on mobile */}
            <div className="md:hidden h-px bg-white/20 dark:bg-gray-600/30 mb-6 mx-4" />
            
            <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white text-center mb-6 md:mb-8">
              {selectedCategory === 'View All' ? 'All Feelings' : selectedCategory}
            </h2>
            
            <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {filteredFeelings.map((feeling) => (
                <div
                  key={feeling.name}
                  onClick={() => handleFeelingSelect(feeling.name)}
                  className={`
                    group cursor-pointer transform transition-all duration-300 ease-out
                    md:hover:scale-105 md:hover:-translate-y-1
                    active:scale-[0.98] md:active:scale-95
                    ${selectedFeeling === feeling.name ? 'md:scale-105 md:-translate-y-1' : ''}
                  `}
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 md:p-6 
                                shadow-lg hover:shadow-xl transition-all duration-300
                                group-hover:bg-white/30 group-hover:scale-[1.02]
                                h-28 md:h-32 flex flex-col justify-center items-center gap-2 md:gap-3
                                border border-black/[0.08] dark:border-white/[0.15]
                                relative before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gray-200/30">
                    
                    {/* Icon */}
                    <div className="text-2xl mb-1 transition-all duration-300 group-hover:scale-110">
                      {React.createElement(feeling.icon, {
                        size: 28,
                        className: "text-black dark:text-white w-7 h-7 md:w-6 md:h-6"
                      })}
                    </div>
                    
                    {/* Feeling Name */}
                    <h3 className="text-sm md:text-sm font-medium text-black dark:text-white text-center transition-all duration-300">
                      {feeling.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Text */}
        <div className="text-center mt-8 md:mt-12 max-w-3xl mx-auto">
          <div className="bg-white/20 dark:bg-gray-800/60 backdrop-blur-md rounded-xl md:rounded-2xl p-5 md:p-6 border border-white/10 dark:border-gray-600/30">
            <h3 className="text-base md:text-lg font-semibold text-black dark:text-white mb-2">
              Don&apos;t see your feeling?
            </h3>
            
            {/* Suggest a Feeling Button */}
            <div className="mb-4 flex justify-center">
              <Button
                onClick={() => setIsSuggestModalOpen(true)}
                className="group relative px-4 py-2 bg-gradient-to-r from-[#fca3b7] via-[#fbc2eb] to-[#fbd786] hover:from-[#f89db0] hover:via-[#f5b8e4] hover:to-[#f5d17f] text-gray-800 font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white/30 rounded-md group-hover:bg-white/40 transition-colors">
                    <Sparkles className="h-4 w-4 text-gray-700" />
                  </div>
                  <span>Suggest a Feeling</span>
                </div>
              </Button>
            </div>
            
            <p className="text-black dark:text-gray-200 text-sm mb-4 px-2 md:px-0">
              Sometimes emotions are complex. Try exploring other approaches to find what you need.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 justify-center">
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/barriers'}
                className="bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/60 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Barriers
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
      
      {/* Suggest Feeling Modal */}
      <SuggestFeelingModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
      />
      
      {/* Crisis Mode Actions */}
      <FixedBottomActions 
        slug="feelings-category"
        pageType="feeling"
        crisisOnly={true}
      />
    </div>
  )
} 