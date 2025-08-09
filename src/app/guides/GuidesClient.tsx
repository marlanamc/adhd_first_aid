'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type GuideMetadata } from '@/lib/markdown'

interface GuidesClientProps {
  guides: GuideMetadata[]
  categories: Array<{
    name: string
    color: string
    count: number
  }>
}

export default function GuidesClient({ guides, categories }: GuidesClientProps) {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('View All')

  const handleGuideSelect = (guide: GuideMetadata) => {
    setSelectedGuide(guide.title)
    // Navigate to individual guide page using slug
    window.location.href = `/guides/${guide.slug}`
  }

  const goBack = () => {
    window.history.back()
  }

  // Filter guides by selected category
  const filteredGuides = selectedCategory === 'View All'
    ? [...guides].sort((a, b) => a.title.localeCompare(b.title))
    : selectedCategory 
    ? guides.filter(guide => guide.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f1ff] via-[#f5efff] to-[#fef6ee] dark:from-[#0a0f1a] dark:via-[#0c1423] dark:to-[#0f182a] relative">
      <div className="max-w-5xl mx-auto px-4 py-6 pt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={goBack}
              className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-black dark:text-white" />
            </Button>
            <div className="flex-1">
              <div className="text-center">
                <div className="text-4xl mb-2">📚</div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white">
                  Read Guides & Insights
                </h1>
                <p className="text-gray-700 dark:text-white/70 text-sm mt-2">
                  Evidence-based ADHD education combining research and lived experience
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">Choose a category:</h2>
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`
                  group cursor-pointer transform transition-all duration-200 ease-out
                  hover:scale-105 hover:-translate-y-0.5 text-left
                  ${selectedCategory === category.name ? 'scale-105 -translate-y-0.5' : ''}
                `}
              >
                <div className={`backdrop-blur-md rounded-xl p-3 
                              transition-all duration-200
                              group-hover:bg-white/40 dark:group-hover:bg-white/10
                              h-14 flex flex-col justify-center
                              ${selectedCategory === category.name 
                                ? 'bg-white/50 dark:bg-white/20 ring-1 ring-blue-400/50 dark:ring-blue-300/50' 
                                : 'bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/15'}`}>
                  
                  <h3 className={`text-xs font-medium text-gray-900 dark:text-white text-center mb-0.5
                                ${selectedCategory === category.name ? 'font-semibold' : ''}`}>
                    {category.name}
                  </h3>
                  <p className={`text-[10px] text-gray-700 dark:text-gray-300 text-center
                                ${selectedCategory === category.name ? 'text-gray-800 dark:text-gray-200' : ''}`}>
                    {category.count} guide{category.count > 1 ? 's' : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Category Guides */}
        {selectedCategory && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
              {selectedCategory === 'View All' ? 'All Guides' : selectedCategory}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGuides.map((guide) => (
                <div
                  key={guide.slug}
                  onClick={() => handleGuideSelect(guide)}
                  className={`
                    group cursor-pointer transform transition-all duration-200 ease-out
                    hover:scale-105 hover:-translate-y-1
                    ${selectedGuide === guide.title ? 'scale-105 -translate-y-1' : ''}
                  `}
                >
                  <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-xl p-4 
                                shadow-lg hover:shadow-xl transition-all duration-200
                                group-hover:bg-white/40 dark:group-hover:bg-white/15
                                h-44 flex flex-col justify-between
                                border border-white/20 dark:border-white/10">
                    
                    <div className="flex flex-col items-center text-center flex-1">
                      {/* Emoji */}
                      <div className="text-2xl mb-2 transition-all duration-200 group-hover:scale-110">
                        {guide.emoji}
                      </div>
                      
                      {/* Guide Title */}
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2">
                        {guide.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 line-clamp-2 flex-1">
                        {guide.description}
                      </p>
                    </div>
                    
                    {/* Footer with read time and difficulty */}
                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-white/20 dark:border-white/10">
                      <span className="bg-white/30 dark:bg-white/20 px-2 py-1 rounded-full text-[10px]">
                        {guide.difficulty}
                      </span>
                      <span className="text-[10px]">{guide.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Text */}
        <div className="text-center mt-10 max-w-2xl mx-auto">
          <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 dark:border-white/10">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Evidence-Based ADHD Education
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
              Guides combining research, lived experience, and practical strategies for your ADHD brain.
            </p>
            <Button 
              onClick={() => window.location.href = '/suggest'}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
            >
              Suggest a Guide Topic
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}