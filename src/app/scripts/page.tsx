'use client'

import { useState } from 'react'
import { ArrowLeft, MessageSquareText } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Scripts data from Content_Index.csv
const scripts = [
  { name: 'How to talk to a friend who doubts ADHD', category: 'Advocacy & Boundaries', emoji: '🗣️' },
  { name: 'How to ask your doctor for an ADHD evaluation', category: 'Medical Navigation', emoji: '🩺' },
  { name: 'How to tell your partner what you need', category: 'Relationship Communication', emoji: '💕' },
  { name: 'What to say when you forgot again', category: 'Repair & Reassurance', emoji: '😔' },
  { name: 'How to ask your boss for accommodations', category: 'Workplace Advocacy', emoji: '💼' },
  { name: 'I\'m trying my best (to family/friends/self)', category: 'Self-Compassion', emoji: '💙' }
]

const categoryColors = {
  'Advocacy & Boundaries': 'from-red-400 to-pink-500',
  'Medical Navigation': 'from-blue-400 to-cyan-500',
  'Relationship Communication': 'from-purple-400 to-indigo-500',
  'Repair & Reassurance': 'from-orange-400 to-amber-500',
  'Workplace Advocacy': 'from-green-400 to-emerald-500',
  'Self-Compassion': 'from-teal-400 to-cyan-500'
}

const categories = [
  { name: 'Advocacy & Boundaries', color: 'from-red-400 to-pink-500', count: 1 },
  { name: 'Medical Navigation', color: 'from-blue-400 to-cyan-500', count: 1 },
  { name: 'Relationship Communication', color: 'from-purple-400 to-indigo-500', count: 1 },
  { name: 'Repair & Reassurance', color: 'from-orange-400 to-amber-500', count: 1 },
  { name: 'Workplace Advocacy', color: 'from-green-400 to-emerald-500', count: 1 },
  { name: 'Self-Compassion', color: 'from-teal-400 to-cyan-500', count: 1 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 6 }
]

export default function ScriptsPage() {
  const [selectedScript, setSelectedScript] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('View All')

  const handleScriptSelect = (script: string) => {
    setSelectedScript(script)
    // Navigate to individual script page
    window.location.href = `/scripts/${encodeURIComponent(script.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}`
  }

  const goBack = () => {
    window.history.back()
  }

  // Filter scripts by selected category
  const filteredScripts = selectedCategory === 'View All'
    ? [...scripts].sort((a, b) => a.name.localeCompare(b.name))
    : selectedCategory 
    ? scripts.filter(script => script.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen bg-[#E8D7FF] dark:bg-[#453975] relative">
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
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
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-black text-center">
                Scripts for Hard Moments
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black text-center mb-6">Choose a script type:</h2>
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
                    {category.count} script{category.count > 1 ? 's' : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Category Scripts */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-black text-center mb-8">
              {selectedCategory === 'View All' ? 'All Scripts' : selectedCategory}
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredScripts.map((script) => (
                <div
                  key={script.name}
                  onClick={() => handleScriptSelect(script.name)}
                  className={`
                    group cursor-pointer transform transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1
                    ${selectedScript === script.name ? 'scale-105 -translate-y-1' : ''}
                  `}
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 
                                shadow-lg hover:shadow-xl transition-all duration-300
                                group-hover:bg-white/30
                                h-40 flex flex-col justify-center items-center
                                border border-white/10">
                    
                    {/* Emoji */}
                    <div className="text-4xl mb-4 transition-all duration-300 group-hover:scale-110">
                      {script.emoji}
                    </div>
                    
                    {/* Script Name */}
                    <h3 className="text-lg font-medium text-black text-center transition-all duration-300">
                      {script.name}
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
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Communication Made Easier
            </h3>
            <p className="text-black/70 dark:text-white/70 text-sm mb-4">
              These scripts provide starting points for difficult conversations. Adapt them to fit your voice and situation.
            </p>
            <Button 
              onClick={() => window.location.href = '/suggest'}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              Suggest a Script Topic
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}