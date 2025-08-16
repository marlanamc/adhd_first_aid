'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Zap, Footprints } from 'lucide-react'
import { useCrisisAndWalkthrough } from '@/hooks/useCrisisAndWalkthrough'
import { useIsMobile } from '@/hooks/use-mobile'

interface FixedBottomActionsProps {
  slug: string
  summaryHtml?: string
  customSteps?: Array<{ id: string; title: string; classes?: string; content: React.ReactNode }>
  pageType?: 'feeling' | 'barrier' | 'complex_loop'
}

export default function FixedBottomActions({ 
  slug, 
  summaryHtml, 
  customSteps,
  pageType = 'feeling'
}: FixedBottomActionsProps) {
  const isMobile = useIsMobile()
  const { goCrisis, openWalkthrough, modal } = useCrisisAndWalkthrough({ 
    slug, 
    summaryHtml, 
    customSteps 
  })

  // Color scheme based on page type
  const colorScheme = {
    feeling: {
      crisis: 'bg-rose-600 hover:bg-rose-700',
      walkthrough: 'bg-teal-600 hover:bg-teal-700'
    },
    barrier: {
      crisis: 'bg-rose-600 hover:bg-rose-700', 
      walkthrough: 'bg-orange-600 hover:bg-orange-700'
    },
    complex_loop: {
      crisis: 'bg-rose-600 hover:bg-rose-700',
      walkthrough: 'bg-purple-600 hover:bg-purple-700'
    }
  }

  const colors = colorScheme[pageType]

  return (
    <>
      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 pb-safe">
          <div className="flex items-center gap-3 justify-center">
            <Button 
              onClick={goCrisis} 
              className={`flex-1 sm:flex-none sm:min-w-[140px] ${colors.crisis} text-white font-medium`}
              size="default"
            >
              <Zap className="h-4 w-4 mr-2" />
              Crisis mode
            </Button>
            
            {!isMobile && (
              <Button 
                onClick={openWalkthrough} 
                className={`flex-1 sm:flex-none sm:min-w-[180px] ${colors.walkthrough} text-white font-medium`}
                size="default"
              >
                <Footprints className="h-4 w-4 mr-2" />
                Walk me through this
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed bar */}
      <div className="h-20 sm:h-16" />

      {/* Modal */}
      {modal}
    </>
  )
}