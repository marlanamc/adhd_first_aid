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
    <div className="min-h-screen bg-[#CAE5FF] dark:bg-[#2B4365] relative">
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
                Read Guides & Insights
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black text-center mb-6">Choose a guide type:</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
            <h2 className="text-2xl font-bold text-black text-center mb-8">
              {selectedCategory === 'View All' ? 'All Guides' : selectedCategory}
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGuides.map((guide) => (
                <div
                  key={guide.slug}
                  onClick={() => handleGuideSelect(guide)}
                  className={`
                    group cursor-pointer transform transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1
                    ${selectedGuide === guide.title ? 'scale-105 -translate-y-1' : ''}
                  `}
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 
                                shadow-lg hover:shadow-xl transition-all duration-300
                                group-hover:bg-white/30
                                h-52 flex flex-col justify-between
                                border border-white/10">
                    
                    <div className="flex flex-col items-center text-center flex-1">
                      {/* Emoji */}
                      <div className="text-3xl mb-3 transition-all duration-300 group-hover:scale-110">
                        {guide.emoji}
                      </div>
                      
                      {/* Guide Title */}
                      <h3 className="text-base font-semibold text-black mb-2 leading-tight">
                        {guide.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-xs text-black/70 mb-3 line-clamp-3 flex-1">
                        {guide.description}
                      </p>
                    </div>
                    
                    {/* Footer with read time and difficulty */}
                    <div className="flex justify-between items-center text-xs text-black/60 pt-2 border-t border-white/10">
                      <span className="bg-white/20 px-2 py-1 rounded-full">
                        {guide.difficulty}
                      </span>
                      <span>{guide.readTime}</span>
                    </div>
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
              Evidence-Based ADHD Education
            </h3>
            <p className="text-black/70 dark:text-white/70 text-sm mb-4">
              These guides combine research, lived experience, and practical strategies to help you understand and work with your ADHD brain.
            </p>
            <Button 
              onClick={() => window.location.href = '/suggest'}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Suggest a Guide Topic
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}