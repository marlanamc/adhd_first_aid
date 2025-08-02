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

  // Define gradients for each page type to match their actual background themes
  const gradients = {
    feelings: {
      // Matches: from-[#fbc2eb] via-[#fbd786] to-[#fbc687] (pink to peach to orange)
      from: 'from-[#fbc2eb]',
      via: 'via-[#fbd786]',
      to: 'to-[#fbc687]',
      hoverFrom: 'hover:from-[#f5b8e4]',
      hoverVia: 'hover:via-[#f5d17f]',
      hoverTo: 'hover:to-[#f5bf80]',
      bgFrom: 'from-[#fbc2eb]/30',
      bgVia: 'via-[#fbd786]/30',
      bgTo: 'to-[#fbc687]/30',
      textAccent: 'text-pink-100',
    },
    barriers: {
      // Matches: from-[#fbc687] via-[#fff5db] to-[#d4fc79] (orange to cream to green)
      from: 'from-[#fbc687]',
      via: 'via-[#fff5db]',
      to: 'to-[#d4fc79]',
      hoverFrom: 'hover:from-[#f5bf80]',
      hoverVia: 'hover:via-[#f9f2d4]',
      hoverTo: 'hover:to-[#cdf672]',
      bgFrom: 'from-[#fbc687]/30',
      bgVia: 'via-[#fff5db]/30',
      bgTo: 'to-[#d4fc79]/30',
      textAccent: 'text-orange-100',
    },
    tasks: {
      // Matches: from-[#d4fc79] via-[#b0f4ea] to-[#8fd3f4] (green to teal to blue)
      from: 'from-[#d4fc79]',
      via: 'via-[#b0f4ea]',
      to: 'to-[#8fd3f4]',
      hoverFrom: 'hover:from-[#cdf672]',
      hoverVia: 'hover:via-[#a9f1e3]',
      hoverTo: 'hover:to-[#88cfed]',
      bgFrom: 'from-[#d4fc79]/30',
      bgVia: 'via-[#b0f4ea]/30',
      bgTo: 'to-[#8fd3f4]/30',
      textAccent: 'text-green-100',
    },
    complex_loops: {
      // Matches: from-[#8fd3f4] via-[#78c2f2] to-[#a18cd1] (blue to blue to purple)
      from: 'from-[#8fd3f4]',
      via: 'via-[#78c2f2]',
      to: 'to-[#a18cd1]',
      hoverFrom: 'hover:from-[#88cfed]',
      hoverVia: 'hover:via-[#71bbeb]',
      hoverTo: 'hover:to-[#9a85ca]',
      bgFrom: 'from-[#8fd3f4]/30',
      bgVia: 'via-[#78c2f2]/30',
      bgTo: 'to-[#a18cd1]/30',
      textAccent: 'text-blue-100',
    },
    identity: {
      // Matches: from-[#a18cd1] via-[#b19cd9] to-[#dec6f7] (purple to purple to light purple)
      from: 'from-[#a18cd1]',
      via: 'via-[#b19cd9]',
      to: 'to-[#dec6f7]',
      hoverFrom: 'hover:from-[#9a85ca]',
      hoverVia: 'hover:via-[#aa95d2]',
      hoverTo: 'hover:to-[#d7bff0]',
      bgFrom: 'from-[#a18cd1]/30',
      bgVia: 'via-[#b19cd9]/30',
      bgTo: 'to-[#dec6f7]/30',
      textAccent: 'text-purple-100',
    },
  }

  const theme = gradients[pageType]

  return (
    <div className="mt-6 flex justify-center">
      <Button
        onClick={() => openModal(pageType)}
        className={`group relative px-8 py-4 bg-gradient-to-r ${theme.from} ${theme.via} ${theme.to} ${theme.hoverFrom} ${theme.hoverVia} ${theme.hoverTo} text-gray-800 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/30 rounded-lg group-hover:bg-white/40 transition-colors">
            <MessageSquare className="h-5 w-5 text-gray-700" />
          </div>
          <div className="text-left">
            <div className="text-base font-semibold text-gray-800">
              Share Your Thoughts{pageName ? ` on ${pageName}` : ''}
            </div>
            <div className="text-sm text-gray-700 group-hover:text-gray-800 transition-colors">
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
