'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { scripts } from '@/data/scripts'

// Generate categories dynamically from scripts
const categoryColors: Record<string, string> = {
  'Advocacy & Boundaries': 'from-red-400 to-pink-500',
  'Medical Navigation': 'from-blue-400 to-cyan-500', 
  'Relationship Communication': 'from-purple-400 to-indigo-500',
  'Repair & Reassurance': 'from-orange-400 to-amber-500',
  'Workplace Advocacy': 'from-green-400 to-emerald-500',
  'Self-Compassion': 'from-teal-400 to-cyan-500',
  'Boundaries & Energy': 'from-rose-400 to-pink-500',
  'Productivity Support': 'from-violet-400 to-purple-500',
  'Advocacy & Defense': 'from-red-500 to-rose-600',
  'Sensory Support': 'from-cyan-400 to-teal-500',
  'Recovery Protocols': 'from-orange-400 to-amber-500'
}

const defaultColor = 'from-gray-400 to-gray-600'

function getCategories() {
  const counts = new Map<string, number>()
  scripts.forEach(s => {
    counts.set(s.category, (counts.get(s.category) || 0) + 1)
  })

  const cats = Array.from(counts.entries()).map(([name, count]) => ({
    name,
    count,
    color: categoryColors[name] || defaultColor
  })).sort((a, b) => a.name.localeCompare(b.name))

  return [
    ...cats,
    { name: 'View All', count: scripts.length, color: defaultColor }
  ]
}

export default function ScriptsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('View All')
  const categories = getCategories()

  const handleScriptSelect = (slug: string) => {
    window.location.href = `/scripts/${slug}`
  }

  const goBack = () => {
    window.history.back()
  }

  // Filter scripts by selected category
  const filteredScripts = selectedCategory === 'View All'
    ? [...scripts].sort((a, b) => a.name.localeCompare(b.name))
    : scripts.filter(script => script.category === selectedCategory)

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
        <div>
          <h2 className="text-2xl font-bold text-black text-center mb-8">
            {selectedCategory === 'View All' ? 'All Scripts' : selectedCategory}
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredScripts.map((script) => (
              <div
                key={script.slug}
                onClick={() => handleScriptSelect(script.slug)}
                className={`
                  group cursor-pointer transform transition-all duration-300 ease-out
                  hover:scale-105 hover:-translate-y-1
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