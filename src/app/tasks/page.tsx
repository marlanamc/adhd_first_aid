'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'

interface Task {
  id: string
  name: string
  emoji: string | null
  color: string | null
  category: string | null
  description: string | null
}

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Fetch help tasks
  useEffect(() => {
    async function fetchHelpTasks() {
      try {
        const { data, error } = await supabase
          .from('help_tasks')
          .select('id, name, emoji, color, category, description')

        if (error) {
          console.error('Error fetching help tasks:', error.message)
          return
        }

        if (!data) {
          console.warn('No help tasks data returned')
          return
        }

        const validTasks = data.filter(task => task.name) as Task[]
        setTasks(validTasks)
      } catch (err) {
        console.error('Exception while fetching help tasks:', err)
      }
    }
    fetchHelpTasks()
  }, [])

  // Group tasks by category
  const groupedTasks = tasks.reduce((acc, task) => {
    const category = task.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Create a sorted list of categories based on a predefined order
  const getSortedTaskCategories = () => {
    const categoryOrder = [
      'Getting Started',
      'Following Through', 
      'Planning + Organization',
      'Cleaning + Resetting',
      'Focus + Motivation',
      'Emotional Support + Self-Regulation',
      'Life Maintenance',
      'Energy Management',
      'Mental Clarity',
      'Other'
    ];
    
    const categories = Object.keys(groupedTasks);
    
    return categories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      
      // If both categories are in the predefined order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one category is in the predefined order, it comes first
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither category is in the predefined order, sort alphabetically
      return a.localeCompare(b);
    });
  };

  const handleTaskSelect = (task: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/task/${encodeURIComponent(task)}`)
    }, 300)
  }

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToPage = (page: string) => {
    router.push(`/${page}`)
  }

  return (
    <div className="min-h-screen ocean-gradient relative flex flex-col">
      <Header 
        navigateHome={navigateHome} 
        navigateToPage={navigateToPage} 
        onSearchOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-12 md:pt-16 pb-24">
          
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={navigateHome}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              What do you need help with today?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Choose the area where you're struggling right now. 
              We'll show you ADHD-friendly strategies that really work.
            </p>
          </div>

          {/* Tasks by Category */}
          <div className="space-y-12">
            {getSortedTaskCategories().map((categoryName) => (
              <div key={categoryName} className="space-y-6">
                <h2 className="text-2xl font-serif font-medium text-gray-800 dark:text-gray-200 text-center">
                  {categoryName}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedTasks[categoryName].map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskSelect(task.name)}
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
                                     group-hover:bg-white/90 group-hover:backdrop-blur-xl">
                        
                        {/* Emoji and Color Indicator */}
                        <div className="flex items-center mb-3">
                          {task.emoji && (
                            <div className="text-2xl mr-3 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6">
                              {task.emoji}
                            </div>
                          )}
                          {task.color && (
                            <div 
                              className="w-4 h-4 rounded-full transition-all duration-500 group-hover:scale-125"
                              style={{ backgroundColor: task.color }}
                            />
                          )}
                        </div>
                        
                        {/* Task Name */}
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-left
                                      transition-all duration-500 group-hover:text-lg">
                          {task.name}
                        </h3>
                        
                        {/* Description */}
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-left
                                        transition-all duration-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                            {task.description}
                          </p>
                        )}

                        {/* Hover shimmer effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-all duration-500 
                                       bg-gradient-to-r from-transparent via-white to-transparent
                                       transform -skew-x-12 -translate-x-full group-hover:translate-x-full rounded-2xl" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Help Text */}
          <div className="mt-16 text-center">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Not sure where to start?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Sometimes it's easier to start with how you're feeling rather than what you need to do. 
                Try browsing by your current emotional state instead.
              </p>
              <Button 
                onClick={() => router.push('/feelings')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Browse by How You Feel Instead
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
              Finding strategies for what you need help with...
            </p>
          </div>
        </div>
      )}

      <Footer navigateToPage={navigateToPage} />
    </div>
  )
}