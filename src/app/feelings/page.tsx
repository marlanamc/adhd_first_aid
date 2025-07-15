'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import type { Feeling } from '@/lib/supabase'

export default function FeelingsPage() {
  const router = useRouter()
  const [feelings, setFeelings] = useState<Feeling[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

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

  // Group feelings by category
  const groupedFeelings = feelings.reduce((acc, feeling) => {
    const category = feeling.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feeling);
    return acc;
  }, {} as Record<string, Feeling[]>);

  const handleFeelingSelect = (feeling: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/feeling/${encodeURIComponent(feeling)}`)
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
              How are you feeling right now?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Choose the feeling that best matches where you are emotionally. 
              We'll help you find strategies that work with what you're experiencing.
            </p>
          </div>

          {/* Feelings by Category */}
          <div className="space-y-12">
            {Object.entries(groupedFeelings).map(([categoryName, categoryFeelings]) => (
              <div key={categoryName} className="space-y-6">
                <h2 className="text-2xl font-serif font-medium text-gray-800 dark:text-gray-200 text-center">
                  {categoryName}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryFeelings.map((feeling) => (
                    <button
                      key={feeling.id}
                      onClick={() => handleFeelingSelect(feeling.name)}
                      disabled={isTransitioning}
                      className={`
                        relative group cursor-pointer transform transition-all duration-500 ease-out
                        hover:scale-110 hover:-translate-y-2 hover:rotate-1
                        ${isTransitioning ? 'pointer-events-none opacity-50' : 'shadow-lg hover:shadow-2xl'}
                        hover:z-10
                      `}
                    >
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 text-center
                                     transition-all duration-500 ease-out
                                     group-hover:bg-white/90 group-hover:backdrop-blur-xl">
                        
                        {/* Emoji */}
                        {feeling.emoji && (
                          <div className="text-4xl mb-3 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6">
                            {feeling.emoji}
                          </div>
                        )}
                        
                        {/* Feeling Name */}
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 
                                      transition-all duration-500 group-hover:text-lg">
                          {feeling.name}
                        </h3>
                        
                        {/* Description */}
                        {feeling.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed
                                        transition-all duration-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                            {feeling.description}
                          </p>
                        )}

                        {/* Hover shimmer effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-all duration-500 
                                       bg-gradient-to-r from-transparent via-white to-transparent
                                       transform -skew-x-12 -translate-x-full group-hover:translate-x-full" />
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
                Don't see your feeling?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Sometimes our emotions are complex or don't fit neatly into categories. 
                Choose the closest match, or try browsing by what you need help with instead.
              </p>
              <Button 
                onClick={() => router.push('/tasks')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Browse by Tasks Instead
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
              Finding strategies for how you're feeling...
            </p>
          </div>
        </div>
      )}

      <Footer navigateToPage={navigateToPage} />
    </div>
  )
}