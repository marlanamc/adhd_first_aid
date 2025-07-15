'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, FileText, Brain, CheckSquare, Heart, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import StructureQuiz from '@/components/quiz/StructureQuiz'

export default function QuizzesPage() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToPage = (page: string) => {
    router.push(`/${page}`)
  }

  const quizzes = [
    {
      id: 'adhd-structure',
      title: 'ADHD Structure Archetype Quiz',
      description: 'Discover your unique relationship with structure and get personalized ADHD coaching recommendations.',
      icon: Brain,
      color: 'from-blue-400 to-indigo-500',
      type: 'quiz',
      estimatedTime: '5-10 minutes',
      questions: 15
    }
  ]

  const downloads = [
    {
      id: 'daily-planner',
      title: 'ADHD-Friendly Daily Planner',
      description: 'A printable daily planning template designed specifically for ADHD brains.',
      icon: FileText,
      color: 'from-purple-400 to-pink-500',
      type: 'download',
      format: 'PDF',
      pages: 1
    },
    {
      id: 'energy-tracker',
      title: 'Energy & Mood Tracker',
      description: 'Track your energy levels, mood, and productivity patterns over time.',
      icon: FileText,
      color: 'from-emerald-400 to-cyan-500',
      type: 'download',
      format: 'PDF',
      pages: 4
    },
    {
      id: 'task-breakdown',
      title: 'Task Breakdown Worksheet',
      description: 'Break down overwhelming tasks into manageable, ADHD-friendly steps.',
      icon: FileText,
      color: 'from-amber-400 to-orange-500',
      type: 'download',
      format: 'PDF',
      pages: 2
    },
    {
      id: 'sensory-toolkit',
      title: 'Sensory Regulation Toolkit',
      description: 'Identify your sensory needs and create personalized regulation strategies.',
      icon: FileText,
      color: 'from-indigo-400 to-purple-500',
      type: 'download',
      format: 'PDF',
      pages: 3
    }
  ]

  const handleItemClick = (item: any) => {
    if (item.type === 'quiz' && item.id === 'adhd-structure') {
      setShowQuiz(true)
    } else {
      setIsTransitioning(true)
      // For downloads, just simulate navigation
      setTimeout(() => {
        console.log(`Navigate to ${item.type}: ${item.id}`)
        setIsTransitioning(false)
      }, 1000)
    }
  }

  // If showing quiz, render quiz component
  if (showQuiz) {
    return (
      <div className="min-h-screen ocean-gradient relative flex flex-col">
        <Header 
          navigateHome={navigateHome} 
          navigateToPage={navigateToPage} 
          onSearchOpen={() => {}} 
        />

        <main className="flex-1 flex flex-col">
          <div className="flex-1 container mx-auto max-w-4xl px-4 sm:px-6 pt-32 md:pt-36 pb-24">
            {/* Back Button */}
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 max-w-xs">
              <button
                onClick={() => setShowQuiz(false)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light inline-flex items-center cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quizzes
              </button>
            </div>

            {/* Quiz Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4 font-serif">
                What's Your ADHD Structure Archetype?
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6">
                  <h3 className="text-foreground font-bold text-lg mb-2">Purpose</h3>
                  <p className="text-muted-foreground">
                    Discover your unique relationship with structure and get personalized ADHD coaching recommendations.
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6">
                  <h3 className="text-foreground font-bold text-lg mb-2">Instructions</h3>
                  <p className="text-muted-foreground">
                    For each item, choose how you typically respond to this type of structure in your life.
                  </p>
                </div>
              </div>
            </div>

            {/* Quiz Component */}
            <StructureQuiz />
          </div>
        </main>

        <Footer navigateToPage={navigateToPage} />
      </div>
    )
  }

  return (
    <div className="min-h-screen ocean-gradient relative flex flex-col">
      <Header 
        navigateHome={navigateHome} 
        navigateToPage={navigateToPage} 
        onSearchOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-32 md:pt-36 pb-24">
          
          {/* Back Button */}
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 max-w-xs">
            <button
              onClick={navigateHome}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light inline-flex items-center cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              Quizzes & Downloads
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Self-assessments to understand your ADHD better and helpful worksheets to support your daily life.
            </p>
          </div>

          {/* Quizzes Section */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-800 dark:text-gray-200 text-center mb-8">
              Self-Assessment Quizzes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => {
                const IconComponent = quiz.icon
                return (
                  <button
                    key={quiz.id}
                    onClick={() => handleItemClick(quiz)}
                    disabled={isTransitioning}
                    className={`
                      relative group cursor-pointer transform transition-all duration-500 ease-out
                      hover:scale-105 hover:-translate-y-1 hover:rotate-1
                      ${isTransitioning ? 'pointer-events-none opacity-50' : 'shadow-lg hover:shadow-2xl'}
                      hover:z-10
                    `}
                  >
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6
                                   transition-all duration-500 ease-out
                                   group-hover:bg-white/90 group-hover:backdrop-blur-xl
                                   min-h-[16rem]
                                   flex flex-col justify-between">
                      
                      {/* Top Section */}
                      <div>
                        {/* Icon */}
                        <div className="mb-4 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${quiz.color} rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rounded-3xl`}>
                            <IconComponent className="w-8 h-8 text-white transition-all duration-500 group-hover:w-10 group-hover:h-10" />
                          </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-left transition-all duration-500 group-hover:text-2xl">
                          {quiz.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-left transition-all duration-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 mb-4">
                          {quiz.description}
                        </p>
                      </div>

                      {/* Bottom Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">{quiz.questions} questions</span>
                          <span className="text-gray-500 dark:text-gray-400">{quiz.estimatedTime}</span>
                        </div>
                        <div className="w-full bg-gradient-to-r from-primary/20 to-primary/10 rounded-full px-3 py-1 text-center">
                          <span className="text-primary font-medium text-sm">Take Quiz</span>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${quiz.color.replace('from-', 'from-').replace('to-', 'to-')}/10 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out rounded-2xl`} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Downloads Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-800 dark:text-gray-200 text-center mb-8">
              Helpful Downloads
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {downloads.map((download) => {
                const IconComponent = download.icon
                return (
                  <button
                    key={download.id}
                    onClick={() => handleItemClick(download)}
                    disabled={isTransitioning}
                    className={`
                      relative group cursor-pointer transform transition-all duration-500 ease-out
                      hover:scale-105 hover:-translate-y-2 hover:rotate-1
                      ${isTransitioning ? 'pointer-events-none opacity-50' : 'shadow-lg hover:shadow-2xl'}
                      hover:z-10
                    `}
                  >
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6
                                   transition-all duration-500 ease-out
                                   group-hover:bg-white/90 group-hover:backdrop-blur-xl
                                   min-h-[18rem]
                                   flex flex-col justify-between text-center">
                      
                      {/* Top Section */}
                      <div>
                        {/* Icon */}
                        <div className="mb-4 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 flex justify-center">
                          <div className={`w-16 h-16 bg-gradient-to-br ${download.color} rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rounded-3xl`}>
                            <IconComponent className="w-8 h-8 text-white transition-all duration-500 group-hover:w-10 group-hover:h-10" />
                          </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 transition-all duration-500 group-hover:text-xl">
                          {download.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-all duration-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 mb-4 text-sm">
                          {download.description}
                        </p>
                      </div>

                      {/* Bottom Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{download.format}</span>
                          <span>•</span>
                          <span>{download.pages} page{download.pages > 1 ? 's' : ''}</span>
                        </div>
                        <div className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/10 rounded-full px-3 py-2 flex items-center justify-center space-x-2">
                          <Download className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-medium text-sm">Download</span>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${download.color.replace('from-', 'from-').replace('to-', 'to-')}/10 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out rounded-2xl`} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="mt-16 text-center">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                More Coming Soon!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're working on more quizzes and helpful resources. Have suggestions for what you'd like to see? 
                Let us know through our suggestion form.
              </p>
              <Button 
                onClick={() => router.push('/suggest')}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Suggest New Content
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Loading State */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Loading content...
            </p>
          </div>
        </div>
      )}

      <Footer navigateToPage={navigateToPage} />
    </div>
  )
}