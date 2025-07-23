'use client'

import { useState } from 'react'
import { ArrowLeft, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Quizzes/Tools data from Content_Index.csv
const quizzes = [
  { name: 'Structure Type Archetype Quiz', category: 'Self-Understanding', emoji: '🏗️' },
  { name: 'Sleep Calculator (9 Hours in Bed)', category: 'Sleep Hygiene', emoji: '😴' },
  { name: 'Verbal Processor vs Other Types', category: 'Cognitive Style Insight', emoji: '🗣️' },
  { name: 'Self-Care Type Quiz', category: 'Personalized Support', emoji: '💆‍♀️' },
  { name: 'Time Blindness Calculator', category: 'Time Awareness', emoji: '⏰' },
  { name: 'Root Cause Quiz – Why Don\'t You Want to Shower?', category: 'Motivation Insight', emoji: '🚿' }
]

const categoryColors = {
  'Self-Understanding': 'from-blue-400 to-indigo-500',
  'Sleep Hygiene': 'from-purple-400 to-indigo-500',
  'Cognitive Style Insight': 'from-green-400 to-teal-500',
  'Personalized Support': 'from-pink-400 to-rose-500',
  'Time Awareness': 'from-orange-400 to-amber-500',
  'Motivation Insight': 'from-cyan-400 to-blue-500'
}

const categories = [
  { name: 'Self-Understanding', color: 'from-blue-400 to-indigo-500', count: 1 },
  { name: 'Sleep Hygiene', color: 'from-purple-400 to-indigo-500', count: 1 },
  { name: 'Cognitive Style Insight', color: 'from-green-400 to-teal-500', count: 1 },
  { name: 'Personalized Support', color: 'from-pink-400 to-rose-500', count: 1 },
  { name: 'Time Awareness', color: 'from-orange-400 to-amber-500', count: 1 },
  { name: 'Motivation Insight', color: 'from-cyan-400 to-blue-500', count: 1 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 6 }
]

export default function QuizzesPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('View All')

  const handleQuizSelect = (quiz: string) => {
    setSelectedQuiz(quiz)
    // Navigate to individual quiz page
    window.location.href = `/quizzes/${encodeURIComponent(quiz.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}`
  }

  const goBack = () => {
    window.history.back()
  }

  // Filter quizzes by selected category
  const filteredQuizzes = selectedCategory === 'View All'
    ? [...quizzes].sort((a, b) => a.name.localeCompare(b.name))
    : selectedCategory 
    ? quizzes.filter(quiz => quiz.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen bg-[#E0F5CE] dark:bg-[#2D4A2A] relative">
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
                Quizzes & Tools
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black text-center mb-6">Choose a quiz type:</h2>
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
                    {category.count} quiz{category.count > 1 ? 'zes' : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Category Quizzes */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-black text-center mb-8">
              {selectedCategory === 'View All' ? 'All Quizzes & Tools' : selectedCategory}
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.name}
                  onClick={() => handleQuizSelect(quiz.name)}
                  className={`
                    group cursor-pointer transform transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1
                    ${selectedQuiz === quiz.name ? 'scale-105 -translate-y-1' : ''}
                  `}
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 
                                shadow-lg hover:shadow-xl transition-all duration-300
                                group-hover:bg-white/30
                                h-40 flex flex-col justify-center items-center
                                border border-white/10">
                    
                    {/* Emoji */}
                    <div className="text-4xl mb-4 transition-all duration-300 group-hover:scale-110">
                      {quiz.emoji}
                    </div>
                    
                    {/* Quiz Name */}
                    <h3 className="text-lg font-medium text-black text-center transition-all duration-300">
                      {quiz.name}
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
              Learn About Your ADHD Brain
            </h3>
            <p className="text-black/70 dark:text-white/70 text-sm mb-4">
              These interactive tools help you understand your unique ADHD patterns and find strategies that work for you.
            </p>
            <Button 
              onClick={() => window.location.href = '/suggest'}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Suggest a Quiz or Tool
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}