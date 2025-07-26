'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, Smartphone, Calendar, MessageSquareText, Clock, Laptop, Heart, Users, Brain, Zap, Volume2, Eye, ShoppingCart, Utensils, Bed, Briefcase, Mail, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

// Complex Loops data with icons - updated from CSV
const complexLoops = [
  // Digital & Screen
  { name: 'Phone Scrolling', category: 'Digital & Screen', icon: Smartphone },
  { name: 'Screen Time Binges', category: 'Digital & Screen', icon: Laptop },
  { name: 'Social Media Spirals', category: 'Digital & Screen', icon: MessageSquareText },
  { name: 'Online Shopping', category: 'Digital & Screen', icon: ShoppingCart },
  
  // Time & Schedule
  { name: 'Chronic Lateness', category: 'Time & Schedule', icon: Clock },
  { name: 'Missed Appointments', category: 'Time & Schedule', icon: Calendar },
  { name: 'Last-Minute Canceling', category: 'Time & Schedule', icon: Calendar },
  { name: 'Double-Booking Yourself', category: 'Time & Schedule', icon: Calendar },
  
  // Emotional & Social
  { name: 'People-Pleasing Burnout', category: 'Emotional & Social', icon: Users },
  { name: 'Rejection Sensitivity Loops', category: 'Emotional & Social', icon: Heart },
  { name: 'Social Masking Exhaustion', category: 'Emotional & Social', icon: Users },
  { name: 'Text Message Avoidance', category: 'Emotional & Social', icon: MessageSquareText },
  { name: 'Email Overwhelm', category: 'Emotional & Social', icon: Mail },
  { name: 'Friendships', category: 'Emotional & Social', icon: Users },
  { name: 'Intimacy', category: 'Emotional & Social', icon: Heart },
  
  // Decision & Perfectionism
  { name: 'Decision Overwhelm', category: 'Decision & Perfectionism', icon: Brain },
  { name: 'Perfectionism Cycles', category: 'Decision & Perfectionism', icon: Eye },
  { name: 'Analysis Paralysis', category: 'Decision & Perfectionism', icon: Brain },
  { name: 'Pre-Event Paralysis', category: 'Decision & Perfectionism', icon: AlertCircle },
  
  // Life & Wellness
  { name: 'Overeating', category: 'Life & Wellness', icon: Utensils },
  { name: 'Undereating', category: 'Life & Wellness', icon: Utensils },
  { name: 'Job Search', category: 'Life & Wellness', icon: Briefcase },
  
  // Sleep & Energy
  { name: 'Can\'t Fall Asleep', category: 'Sleep & Energy', icon: Brain },
  { name: 'Sleeping Through Alarms', category: 'Sleep & Energy', icon: Volume2 },
  { name: 'Constantly Tired', category: 'Sleep & Energy', icon: Eye },
  { name: 'Bedtime Procrastination', category: 'Sleep & Energy', icon: Clock }
]

const categories = [
  { name: 'Digital & Screen', color: 'from-blue-400 to-cyan-500', count: 4 },
  { name: 'Time & Schedule', color: 'from-purple-400 to-indigo-500', count: 4 },
  { name: 'Emotional & Social', color: 'from-pink-400 to-rose-500', count: 7 },
  { name: 'Decision & Perfectionism', color: 'from-amber-400 to-orange-500', count: 4 },
  { name: 'Life & Wellness', color: 'from-green-400 to-emerald-500', count: 3 },
  { name: 'Sleep & Energy', color: 'from-indigo-400 to-blue-500', count: 4 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 26 }
]

const categoryColors = {
  'Digital & Screen': 'from-blue-400 to-cyan-500',
  'Time & Schedule': 'from-purple-400 to-indigo-500',
  'Emotional & Social': 'from-pink-400 to-rose-500',
  'Decision & Perfectionism': 'from-amber-400 to-orange-500',
  'Life & Wellness': 'from-green-400 to-emerald-500',
  'Sleep & Energy': 'from-indigo-400 to-blue-500'
}

export default function ComplexLoopsPage() {
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Digital & Screen')

  // Read category from URL parameter on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryFromUrl = urlParams.get('category')
    if (categoryFromUrl) {
      const decodedCategory = decodeURIComponent(categoryFromUrl)
      // Check if the decoded category matches any of our known categories exactly
      const categories = ['Digital & Screen', 'Time & Schedule', 'Emotional & Social', 'Decision & Perfectionism', 'Life & Wellness', 'Sleep & Energy', 'View All']
      const matchingCategory = categories.find(cat => cat === decodedCategory)
      if (matchingCategory) {
        setSelectedCategory(decodedCategory)
      }
    }
  }, [])

  const handleLoopSelect = (loop: string) => {
    setSelectedLoop(loop)
    // Navigate to individual complex loop page with category parameter
    const loopSlug = encodeURIComponent(loop.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    const categoryParam = selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ''
    window.location.href = `/complex_loops/${loopSlug}${categoryParam}`
  }

  const goBack = () => {
    window.history.back()
  }

  // Filter loops by selected category
  const filteredLoops = selectedCategory === 'View All'
    ? [...complexLoops].sort((a, b) => a.name.localeCompare(b.name))
    : selectedCategory 
    ? complexLoops.filter(loop => loop.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8fd3f4] via-[#78c2f2] to-[#a18cd1] relative">
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
                Which loop do you want to break?
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black text-center mb-6">Choose a pattern type:</h2>
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
                    {category.count} patterns
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Category Loops */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-black text-center mb-8">
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
                    <h3 className="text-sm font-medium text-black text-center transition-all duration-300">
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
            <h3 className="text-lg font-semibold text-black mb-2">
              These patterns feel different from tasks
            </h3>
            <p className="text-black text-sm mb-4">
              Complex loops require deeper self-regulation and emotional awareness, not just breaking things into steps.
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