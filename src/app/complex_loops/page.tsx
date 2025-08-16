'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Brain, Share2, ShoppingBag, AlarmClock, CalendarX, CalendarCheck, CalendarClock, Timer, HeartCrack, UserMinus, UserX, MessagesSquare, MailQuestion, Users, HeartHandshake, MessageCircleQuestion, CircleDashed, Target, Infinity, Utensils, UtensilsCrossed, Building2, Dumbbell, Moon, BellRing, BatteryLow, Sparkles, MousePointerClick, Repeat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SuggestContentModal } from '@/components/ui/SuggestContentModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'

// Complex Loops data with icons - Brain first, Sparkles last, no duplicates (28 loops)
const complexLoops = [
  // Decision & Perfectionism (Brain first as requested)
  { name: 'Analysis Paralysis', category: 'Decision & Perfectionism', icon: Brain },
  { name: 'Decision Overwhelm', category: 'Decision & Perfectionism', icon: CircleDashed },
  { name: 'Perfectionism Cycles', category: 'Decision & Perfectionism', icon: Target },
  
  // Digital & Screen
  { name: 'Phone Scrolling', category: 'Digital & Screen', icon: Share2 },
  { name: 'Social Media', category: 'Digital & Screen', icon: MailQuestion },
  { name: 'Online Shopping', category: 'Digital & Screen', icon: ShoppingBag },
  
  // Time & Schedule
  { name: 'Chronic Lateness', category: 'Time & Schedule', icon: AlarmClock },
  { name: 'Missed Appointments', category: 'Time & Schedule', icon: CalendarX },
  { name: 'Last-Minute Cancelling', category: 'Time & Schedule', icon: CalendarCheck },
  { name: 'Double-Booking Yourself', category: 'Time & Schedule', icon: CalendarClock },
  { name: 'Waiting Mode', category: 'Time & Schedule', icon: Timer },
  
  // Emotional & Social
  { name: 'People-Pleasing Burnout', category: 'Emotional & Social', icon: HeartCrack },
  { name: 'Rejection Sensitivity Loops', category: 'Emotional & Social', icon: UserMinus },
  { name: 'Masking Exhaustion', category: 'Emotional & Social', icon: UserX },
  { name: 'Replying to Texts', category: 'Emotional & Social', icon: MessagesSquare },
  { name: 'Email Overwhelm', category: 'Emotional & Social', icon: Users },
  { name: 'Friendships & ADHD', category: 'Emotional & Social', icon: HeartHandshake },
  { name: 'Intimacy & Connection', category: 'Emotional & Social', icon: MessageCircleQuestion },
  { name: 'Difficult Conversations', category: 'Emotional & Social', icon: Infinity },
  
  // Life & Wellness
  { name: 'Overeating', category: 'Life & Wellness', icon: Utensils },
  { name: 'Undereating', category: 'Life & Wellness', icon: UtensilsCrossed },
  { name: 'Job Searching', category: 'Life & Wellness', icon: Building2 },
  { name: 'Workout Avoidance', category: 'Life & Wellness', icon: Dumbbell },
  
  // Sleep & Energy
  { name: 'Can\'t Fall Asleep', category: 'Sleep & Energy', icon: Moon },
  { name: 'Sleeping Through Alarms', category: 'Sleep & Energy', icon: BellRing },
  { name: 'Constantly Tired', category: 'Sleep & Energy', icon: BatteryLow },
  
  // End with Sparkles (last as requested)
  { name: 'Bedtime Procrastination', category: 'Sleep & Energy', icon: Sparkles }
]

const categories = [
  { name: 'Decision & Perfectionism', color: 'from-amber-400 to-orange-500', count: 3 },
  { name: 'Digital & Screen', color: 'from-blue-400 to-cyan-500', count: 3 },
  { name: 'Time & Schedule', color: 'from-purple-400 to-indigo-500', count: 5 },
  { name: 'Emotional & Social', color: 'from-pink-400 to-rose-500', count: 8 },
  { name: 'Life & Wellness', color: 'from-green-400 to-emerald-500', count: 4 },
  { name: 'Sleep & Energy', color: 'from-indigo-400 to-blue-500', count: 4 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 28 }
]


export default function ComplexLoopsPage() {
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Decision & Perfectionism')
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
  const isMobile = useIsMobile()

  // Read category from URL parameter on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryFromUrl = urlParams.get('category')
    if (categoryFromUrl) {
      const decodedCategory = decodeURIComponent(categoryFromUrl)
      // Check if the decoded category matches any of our known categories exactly
      const categories = ['Decision & Perfectionism', 'Digital & Screen', 'Time & Schedule', 'Emotional & Social', 'Life & Wellness', 'Sleep & Energy', 'View All']
      const matchingCategory = categories.find(cat => cat === decodedCategory)
      if (matchingCategory) {
        setSelectedCategory(decodedCategory)
      }
    }
  }, [])

  const handleLoopSelect = (loop: string) => {
    setSelectedLoop(loop)
    // Navigate to individual complex loop page with category parameter
    // Fix ampersand handling to avoid double dashes in URLs
    const loopSlug = encodeURIComponent(
      loop
        .toLowerCase()
        .replace(/&/g, 'and') // Replace & with 'and' before other processing
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/[^a-z0-9-]/g, '') // Remove special characters
        .replace(/--+/g, '-') // Clean up any double dashes
    )
    const categoryParam = selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ''
    window.location.href = `/complex_loops/${loopSlug}${categoryParam}`
  }

  const goBack = () => {
    window.location.href = '/'
  }

  // Filter loops by selected category
  const filteredLoops = selectedCategory === 'View All'
    ? [...complexLoops].sort((a, b) => a.name.localeCompare(b.name))
    : selectedCategory 
    ? complexLoops.filter(loop => loop.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b0f4ea] via-[#78c2f2] to-[#a18cd1] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative">
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
                Which loop do you want to break?
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black dark:text-white text-center mb-6 flex items-center justify-center gap-2">
            <MousePointerClick className="h-5 w-5" />
            Choose a pattern type:
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
                          {category.name === 'Time & Procrastination' ? '⏰' :
                           category.name === 'Focus & Distraction' ? '🎯' :
                           category.name === 'Emotional & Social' ? '💭' :
                           category.name === 'Health & Habits' ? '💪' :
                           category.name === 'Work & Productivity' ? '💼' :
                           category.name === 'Decision & Perfectionism' ? '🤔' :
                           category.name === 'Digital & Screen' ? '📱' :
                           category.name === 'Time & Schedule' ? '📅' :
                           category.name === 'Life & Wellness' ? '🌱' :
                           category.name === 'Sleep & Energy' ? '😴' :
                           category.name === 'View All' ? '👀' : '🔄'}
                        </span>
                        <span className={`font-medium text-base ${category.name === 'View All' ? 'text-gray-600' : ''}`}>
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm text-black/60 dark:text-white/60 flex-shrink-0 ml-4">
                        {category.count} {category.count === 1 ? 'pattern' : 'patterns'}
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
                                group-hover:bg-white/30
                                h-16 flex flex-col justify-center
                                ${selectedCategory === category.name 
                                  ? 'bg-white/40 ring-2 ring-black/[0.15] dark:ring-white/[0.3]' 
                                  : 'bg-white/10 hover:bg-white/20'}`}>
                    
                    <h3 className={`text-sm font-medium text-black dark:text-white text-center mb-1
                                  ${selectedCategory === category.name ? 'font-semibold' : ''}`}>
                      {category.name}
                    </h3>
                    <p className={`text-xs text-black/70 dark:text-white/70 text-center
                                  ${selectedCategory === category.name ? 'text-black/90 dark:text-white/90' : ''}`}>
                      {category.count} patterns
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Category Loops */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white text-center mb-8">
              {selectedCategory === 'View All' ? 'All Complex Loops' : selectedCategory}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredLoops.map((loop) => (
                <div
                  key={loop.name}
                  onClick={() => handleLoopSelect(loop.name)}
                  className={`
                    group cursor-pointer transform transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1
                    ${selectedLoop === loop.name ? 'scale-105 -translate-y-1' : ''}
                  `}
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 
                                shadow-lg hover:shadow-xl transition-all duration-300
                                group-hover:bg-white/30
                                h-32 flex flex-col justify-center items-center
                                border border-white/10">
                    
                    {/* Icon */}
                    <div className="text-2xl mb-1 transition-all duration-300 group-hover:scale-110">
                      {React.createElement(loop.icon, {
                        size: 24,
                        className: "text-black dark:text-white"
                      })}
                    </div>
                    
                    {/* Loop Name */}
                    <h3 className="text-sm font-medium text-black dark:text-white text-center transition-all duration-300">
                      {loop.name}
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
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              These patterns feel different from tasks
            </h3>
            
            {/* Suggest a Complex Loop Button */}
            <div className="mb-4 flex justify-center">
              <Button
                onClick={() => setIsSuggestModalOpen(true)}
                className="group relative px-4 py-2 bg-gradient-to-r from-[#b0f4ea] via-[#78c2f2] to-[#a18cd1] hover:from-[#a9f1e3] hover:via-[#71bbeb] hover:to-[#9a85ca] text-gray-800 font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white/30 rounded-md group-hover:bg-white/40 transition-colors">
                    <Repeat className="h-4 w-4 text-gray-700" />
                  </div>
                  <span>Suggest a Complex Loop</span>
                </div>
              </Button>
            </div>
            
            <p className="text-black dark:text-white text-sm mb-4">
              Complex loops require deeper self-regulation and emotional awareness, not just breaking things into steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/feelings'}
                className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Feelings
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/barriers'}
                className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Barriers
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/life_areas'}
                className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Life Areas
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/identities'}
                className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Identity
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Suggest Complex Loop Modal */}
      <SuggestContentModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        contentType="complex_loop"
      />
    </div>
  )
}