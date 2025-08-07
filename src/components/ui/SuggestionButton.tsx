'use client'

import React from 'react'
import { MessageSquare } from 'lucide-react'
import { Button } from './button'
import { useModal } from '@/contexts/ModalContext'

interface SuggestionButtonProps {
  pageType?: 'feelings' | 'barriers' | 'tasks' | 'complex_loops' | 'identity'
}

export function SuggestionButton({
  pageType = 'feelings',
}: SuggestionButtonProps) {
  const { openModal } = useModal()

  // Get readable page name from URL
  const getPageName = () => {
    if (typeof window === 'undefined') return ''
    
    const path = window.location.pathname
    const segments = path.split('/')
    
    // Get the last segment of the URL
    const lastSegment = segments[segments.length - 1]
    
    // Convert slug to readable name
    if (lastSegment && lastSegment !== '') {
      return lastSegment
        .split(/[-_]/) // Split on both hyphens and underscores
        .map(word => {
          // Handle special cases
          if (word.toLowerCase() === 'adhd') return 'ADHD'
          if (word.toLowerCase() === 'ai') return 'AI'
          if (word.toLowerCase() === 'ui') return 'UI'
          if (word.toLowerCase() === 'api') return 'API'
          // Capitalize first letter of each word
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join(' ')
    }
    
    return ''
  }

  const pageName = getPageName()

  // Define gradients that match the homepage cards exactly
  const gradients = {
    feelings: {
      // Matches homepage: from-[#fca3b7] via-[#fbc2eb] to-[#fbd786]
      from: 'from-[#fca3b7]',
      via: 'via-[#fbc2eb]',
      to: 'to-[#fbd786]',
      hoverFrom: 'hover:from-[#fc92ab]',
      hoverVia: 'hover:via-[#fbb6e8]',
      hoverTo: 'hover:to-[#fbd07f]',
      bgFrom: 'from-[#fca3b7]/20',
      bgVia: 'via-[#fbc2eb]/20',
      bgTo: 'to-[#fbd786]/20',
    },
    barriers: {
      // Matches homepage: from-[#fbd786] via-[#fff5db] to-[#c0f5a3]
      from: 'from-[#fbd786]',
      via: 'via-[#fff5db]',
      to: 'to-[#c0f5a3]',
      hoverFrom: 'hover:from-[#fbd07f]',
      hoverVia: 'hover:via-[#fef1d4]',
      hoverTo: 'hover:to-[#b9f39c]',
      bgFrom: 'from-[#fbd786]/20',
      bgVia: 'via-[#fff5db]/20',
      bgTo: 'to-[#c0f5a3]/20',
    },
    tasks: {
      // Matches homepage: from-[#d4fc79] via-[#b0f4ea] to-[#8fd3f4]
      from: 'from-[#d4fc79]',
      via: 'via-[#b0f4ea]',
      to: 'to-[#8fd3f4]',
      hoverFrom: 'hover:from-[#cdfb72]',
      hoverVia: 'hover:via-[#a9f2e7]',
      hoverTo: 'hover:to-[#88cff1]',
      bgFrom: 'from-[#d4fc79]/20',
      bgVia: 'via-[#b0f4ea]/20',
      bgTo: 'to-[#8fd3f4]/20',
    },
    complex_loops: {
      // Matches homepage: from-[#b0f4ea] via-[#78c2f2] to-[#a18cd1]
      from: 'from-[#b0f4ea]',
      via: 'via-[#78c2f2]',
      to: 'to-[#a18cd1]',
      hoverFrom: 'hover:from-[#a9f2e7]',
      hoverVia: 'hover:via-[#71bbef]',
      hoverTo: 'hover:to-[#9a85ce]',
      bgFrom: 'from-[#b0f4ea]/20',
      bgVia: 'via-[#78c2f2]/20',
      bgTo: 'to-[#a18cd1]/20',
    },
    identity: {
      // Matches homepage: from-[#78c2f2] via-[#b39ddb] to-[#e1d5f9]
      from: 'from-[#78c2f2]',
      via: 'via-[#b39ddb]',
      to: 'to-[#e1d5f9]',
      hoverFrom: 'hover:from-[#71bbef]',
      hoverVia: 'hover:via-[#ac96d8]',
      hoverTo: 'hover:to-[#dccef6]',
      bgFrom: 'from-[#78c2f2]/20',
      bgVia: 'via-[#b39ddb]/20',
      bgTo: 'to-[#e1d5f9]/20',
    },
  }

  const theme = gradients[pageType]

  return (
    <div className="mt-6 flex justify-center">
      <Button
        onClick={() => openModal(pageType)}
        className={`group relative px-8 py-4 bg-gradient-to-r ${theme.from} ${theme.via} ${theme.to} ${theme.hoverFrom} ${theme.hoverVia} ${theme.hoverTo} text-black font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/30 rounded-lg group-hover:bg-white/40 transition-colors">
            <MessageSquare className="h-5 w-5 text-black" />
          </div>
          <div className="text-left">
            <div className="text-base font-semibold text-black">
              Share Your Thoughts{pageName ? ` on ${pageName}` : ''}
            </div>
            <div className="text-sm text-black/80 group-hover:text-black transition-colors">
              Suggestions • Feedback • Resources
            </div>
          </div>
        </div>

        {/* Subtle animated background */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${theme.bgFrom} ${theme.bgVia} ${theme.bgTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        ></div>
      </Button>
    </div>
  )
}
