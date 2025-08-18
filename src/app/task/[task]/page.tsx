'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { supabase } from '@/lib/supabase'
import type { Barrier } from '@/types/database'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function TaskBarrierPage() {
  const router = useRouter()
  const params = useParams()
  const task = decodeURIComponent(params.task as string)
  
  const [barriers, setBarriers] = useState<Barrier[]>([])
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Fetch barriers for the selected task
  useEffect(() => {
    async function fetchBarriersForTask() {
      try {
        setLoading(true)
        
        // First get the help task ID
        const { data: helpTaskData, error: helpTaskError } = await supabase
          .from('help_tasks')
          .select('id')
          .eq('name', task)
          .single()

        if (helpTaskError || !helpTaskData) {
          console.error('Error fetching help task:', helpTaskError)
          return
        }

        // Then get barriers connected to this help task
        const { data: helpTaskBarriers, error: htbError } = await supabase
          .from('help_task_barriers')
          .select('barrier_id')
          .eq('help_task_id', helpTaskData.id)

        if (htbError) {
          console.error('Error fetching help task barriers:', htbError)
          return
        }

        const barrierIds = helpTaskBarriers?.map(htb => htb.barrier_id) || []
        
        if (barrierIds.length === 0) {
          setBarriers([])
          return
        }

        const { data: barriersData, error: barriersError } = await supabase
          .from('barriers')
          .select('id, name, emoji, color, category, hover_description')
          .in('id', barrierIds)

        if (barriersError) {
          console.error('Error fetching barriers:', barriersError)
          return
        }

        setBarriers((barriersData as Barrier[]) || [])
      } catch (err) {
        console.error('Error fetching barriers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBarriersForTask()
  }, [task])

  const handleBarrierSelect = (barrierName: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      const searchParams = new URLSearchParams({
        task,
        barrier: barrierName
      })
      router.push('/')
    }, 300)
  }

  const goBack = () => {
    // Go back to strategies page if that's where user came from, otherwise home
    const referrer = document.referrer
    if (referrer && referrer.includes('/strategies')) {
      router.push('/')
    } else {
      router.back() // Use browser back for better UX
    }
  }

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToPage = (page: string) => {
    router.push(`/${page}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen ocean-gradient relative flex flex-col">
        <Header 
          navigateHome={navigateHome} 
          navigateToPage={navigateToPage} 
          onSearchOpen={() => {}} 
        />
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Finding what's blocking you...</p>
        </main></div>
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
        <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-12 md:pt-16 pb-24">
          {/* Navigation */}
          <div className="mb-12 mt-10">
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <button
                onClick={goBack}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light inline-flex items-center cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="font-light">Task</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-primary font-strong">Barrier</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-light">Strategies</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`mobile-transition px-4 md:px-6 ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="text-center mb-6">
              <h3 className="text-base sm:text-lg font-serif text-muted-foreground mb-1 md:mb-2 leading-relaxed">
                You&apos;re struggling with <span className="font-semibold">{task.toLowerCase()}</span>
              </h3>
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-foreground mb-3 md:mb-4 leading-relaxed">
                What&apos;s the main barrier preventing you from moving forward?
              </h2>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
                {barriers.map((barrier, index) => (
                  <TooltipProvider key={barrier.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="default"
                          onClick={() => handleBarrierSelect(barrier.name)}
                          className="feeling-button h-auto py-3 sm:py-4 px-4 sm:px-6 text-sm font-light rounded-full mobile-transition mobile-button-large inline-flex items-center justify-center whitespace-nowrap text-muted-foreground hover:text-foreground"
                          style={{
                            animationDelay: `${index * 0.1}s`,
                            transform: isTransitioning ? 'translateY(-20px)' : 'translateY(0)',
                            opacity: isTransitioning ? 0 : 1
                          }}
                        >
                          <span className="text-center leading-tight">{barrier.name}</span>
                        </Button>
                      </TooltipTrigger>
                      {barrier.hover_description && (
                        <TooltipContent className="bg-white/95 backdrop-blur-md text-sm p-4 max-w-sm rounded-xl shadow-xl border border-white/20">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-lg">
                              {barrier.emoji || '🚧'}
                            </div>
                            <div>
                              <p className="font-medium text-foreground mb-1">{barrier.name}</p>
                              <p className="text-muted-foreground leading-relaxed">{barrier.hover_description}</p>
                            </div>
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main></div>
  )
}