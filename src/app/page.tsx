'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HomePage } from '@/components/pages'
import { supabase } from '@/lib/supabase'
import type { Feeling } from '@/lib/supabase'
import type { ViewMode } from '@/types'
import NewHomePage from '@/components/pages/NewHomePage'

// Import styles
import './globals.css'

interface Task {
  id: string
  name: string
  emoji: string | null
  color: string | null
  category: string | null
  description: string | null
}

export default function Home() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('feeling')
  const [feelings, setFeelings] = useState<Feeling[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [useNewHomepage] = useState(true) // Toggle for testing

  // Fetch feelings
  useEffect(() => {
    async function fetchFeelings() {
      try {
        const { data, error } = await supabase
          .from('feelings')
          .select('id, name, emoji, color, category, description')
          .order('name')

        if (error) {
          console.error('Error fetching feelings:', error)
          return
        }

        setFeelings(data || [])
      } catch (err) {
        console.error('Exception while fetching feelings:', err)
      }
    }
    fetchFeelings()
  }, [])

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

  const handleFeelingSelect = (feeling: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/feeling/${encodeURIComponent(feeling)}`)
    }, 300)
  }

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

  const handleScriptSelect = (_category: string) => {
    setSelectedCard('scripts-guides')
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/scripts`)
    }, 300)
  }

  const handleSystemSelect = (_category: string) => {
    setSelectedCard('systems')
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/systems`)
    }, 300)
  }

  const handleGuideSelect = (_category: string) => {
    setSelectedCard('guides')
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/guides`)
    }, 300)
  }

  const handleStrategySelect = () => {
    setSelectedCard('strategies')
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/strategies`)
    }, 300)
  }

  const handleQuizSelect = () => {
    setSelectedCard('quizzes')
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/quizzes`)
    }, 300)
  }

  const handleResourceSelect = () => {
    setSelectedCard('resources')
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/resources`)
    }, 300)
  }

  return (
    <div className="min-h-screen ocean-gradient relative flex flex-col">
      <Header 
        navigateHome={navigateHome} 
        navigateToPage={navigateToPage} 
        onSearchOpen={() => {
          // TODO: Implement search functionality
        }} 
      />

      <main className="flex-1 flex flex-col">
        {useNewHomepage ? (
          <NewHomePage
            feelings={feelings}
            tasks={tasks}
            handleFeelingSelect={handleFeelingSelect}
            handleTaskSelect={handleTaskSelect}
            onScriptSelect={handleScriptSelect}
            onSystemSelect={handleSystemSelect}
            onGuideSelect={handleGuideSelect}
            onStrategySelect={handleStrategySelect}
            onQuizSelect={handleQuizSelect}
            onResourceSelect={handleResourceSelect}
            isTransitioning={isTransitioning}
            selectedCard={selectedCard}
          />
        ) : (
          <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-12 md:pt-16 pb-24">
            <HomePage
              viewMode={viewMode}
              setViewMode={setViewMode}
              feelings={feelings}
              tasks={tasks}
              handleFeelingSelect={handleFeelingSelect}
              handleTaskSelect={handleTaskSelect}
              isTransitioning={isTransitioning}
            />
          </div>
        )}
      </main>

      <Footer navigateToPage={navigateToPage} />
    </div>
  )
}