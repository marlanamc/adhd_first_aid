'use client'

import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, Footprints } from 'lucide-react'
import { useCrisisAndWalkthrough } from '@/hooks/useCrisisAndWalkthrough'
import { useIsMobile } from '@/hooks/use-mobile'
import type { FeelingsContent, FeelingSources, BarriersContent, BarrierSources } from '@/lib/supabase'

import { formatMarkdownText } from '@/lib/utils'

interface FixedBottomActionsProps {
  slug: string
  summaryHtml?: string
  customSteps?: Array<{ id: string; title: string; classes?: string; content: React.ReactNode }>
  pageType?: 'home' | 'barrier' | 'feeling' | 'task' | 'complex_loop' | 'identity' | 'guide' | 'script' | 'quiz' | 'resource'
  content?: FeelingsContent | BarriersContent | null
  sources?: FeelingSources[] | BarrierSources[] | null
  crisisOnly?: boolean // Show only crisis mode button, no walkthrough
  onOpenCrisisMode?: () => void // Function to open targeted crisis mode for feelings
}

export default function FixedBottomActions({ 
  slug, 
  summaryHtml, 
  customSteps: providedCustomSteps,
  pageType = 'feeling',
  content,
  sources,
  crisisOnly = false,
  onOpenCrisisMode
}: FixedBottomActionsProps) {
  const isMobile = useIsMobile()
  
  // Build custom steps from content if not provided
  const customSteps = useMemo(() => {
    // If custom steps are already provided, use them
    if (providedCustomSteps) return providedCustomSteps
    
    // If no content, return empty steps (no TL;DR since intro is already visible on page)
    if (!content) {
      return []
    }
    
    const steps: Array<{ id: string; title: string; classes?: string; content: React.ReactNode }> = []
    
    // Skip TL;DR/intro for walkthrough since it's already visible on the page
    
    // Add Gentle Advice
    if (content.gentle_advice) {
      steps.push({
        id: 'gentle',
        title: 'Soft Start',
        classes: 'bg-[#A0E8AF]/40 border border-[#A0E8AF]/60 rounded-xl p-5',
        content: (
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{formatMarkdownText(content.gentle_advice)}</p>
        ),
      })
    }
    
    // Add Tough Love
    if (content.stern_advice) {
      steps.push({
        id: 'stern',
        title: 'Tough Love',
        classes: 'bg-[#F87171]/30 border border-[#F87171]/50 rounded-xl p-5',
        content: (
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{formatMarkdownText(content.stern_advice)}</p>
        ),
      })
    }
    
    // Add ADHD Reasons
    if (Array.isArray(content.adhd_reasons) && content.adhd_reasons.length > 0) {
      const title = pageType === 'feeling' 
        ? `Why ADHD Makes ${(content as FeelingsContent).feeling_name} Worse`
        : 'How ADHD Amplifies The Struggle'
      
      steps.push({
        id: 'adhd_reasons',
        title,
        classes: 'bg-[#FFADD3]/20 border border-[#FFADD3]/30 rounded-xl p-5',
        content: (
          <ul className="space-y-3">
            {content.adhd_reasons.map((reason, i) => {
              const colonIndex = reason.indexOf(':')
              const hasColon = colonIndex !== -1
              const heading = hasColon ? reason.substring(0, colonIndex + 1) : ''
              const description = hasColon ? reason.substring(colonIndex + 1).trim() : reason
              return (
                <li key={i} className="flex items-start gap-3">
                  <span className="translate-y-[2px]">•</span>
                  <span className="text-gray-900 dark:text-gray-100 leading-relaxed">
                    {hasColon ? (
                      <>
                        <strong>{heading.replace(/\*\*(.*?)\*\*/g, '$1')}</strong> {formatMarkdownText(description)}
                      </>
                    ) : (
                      formatMarkdownText(reason)
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        ),
      })
    }
    
    // Add Step Sections
    if (Array.isArray(content.step_sections) && content.step_sections.length > 0) {
      const colorSchemes = [
        { bg: 'bg-[#FCF6BD]/20', border: 'border-[#FCF6BD]/50' },
        { bg: 'bg-[#D0F4DE]/20', border: 'border-[#D0F4DE]/50' },
        { bg: 'bg-[#A9DEF9]/20', border: 'border-[#A9DEF9]/50' },
        { bg: 'bg-[#E4C1F9]/20', border: 'border-[#E4C1F9]/50' },
        { bg: 'bg-[#ffdace]/20', border: 'border-[#ffdace]/50' },
      ]
      
      content.step_sections.forEach((s, idx) => {
        const colors = colorSchemes[idx % colorSchemes.length]
        steps.push({
          id: `step_${idx}`,
          title: `${s.number}. ${s.title.replace(/\*\*(.*?)\*\*/g, '$1')}`,
          classes: `${colors.bg} border ${colors.border} rounded-xl p-5`,
          content: (
            <div className="space-y-4">
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{formatMarkdownText(s.intro)}</p>
              {Array.isArray(s.try_this) && s.try_this.length > 0 && (
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">Try this:</p>
                  <ul className="space-y-2">
                    {s.try_this.map((item, i) => {
                      const colonIndex = item.indexOf(':')
                      const hasColon = colonIndex !== -1
                      const heading = hasColon ? item.substring(0, colonIndex + 1) : ''
                      const description = hasColon ? item.substring(colonIndex + 1).trim() : item
                      const cleanHeading = heading.replace(/\*\*(.*?)\*\*/g, '$1')
                      return (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-gray-900">•</span>
                          <span className="text-gray-900 dark:text-gray-100 leading-relaxed">
                            {hasColon ? (
                              <>
                                <strong>{cleanHeading}</strong> {formatMarkdownText(description)}
                              </>
                            ) : (
                              formatMarkdownText(item)
                            )}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
              {s.tip && (
                <div className={`${colors.bg} border-l-4 ${colors.border} pl-4 py-2 rounded-r-lg`}>
                  <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">💡 Tip:</span> {formatMarkdownText(s.tip)}</p>
                </div>
              )}
            </div>
          ),
        })
      })
    }
    
    // Add Sources if available
    if (Array.isArray(sources) && sources.length > 0) {
      const grouped = sources.reduce<Record<string, (FeelingSources | BarrierSources)[]>>((acc, s) => {
        const cat = s.category || 'Other'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(s)
        return acc
      }, {})
      
      const palette = [
        { bg: 'bg-[#FBF8CC]/40', border: 'border-[#FBF8CC]/60' },
        { bg: 'bg-[#FDE4CF]/40', border: 'border-[#FDE4CF]/60' },
        { bg: 'bg-[#FFCFD2]/40', border: 'border-[#FFCFD2]/60' },
        { bg: 'bg-[#F1C0E8]/40', border: 'border-[#F1C0E8]/60' },
        { bg: 'bg-[#CFBAF0]/40', border: 'border-[#CFBAF0]/60' },
      ]
      
      const entries = Object.entries(grouped).sort(([, a], [, b]) => b.length - a.length)
      entries.forEach(([category, items], i) => {
        const c = palette[i % palette.length]
        steps.push({
          id: 'sources',
          title: `Sources — ${category}`,
          classes: `rounded-xl p-5 ${c.bg} border ${c.border}`,
          content: (
            <ul className="space-y-2">
              {items.map((src) => (
                <li key={src.id} className="text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">{src.title}</span>
                  {src.authors ? ` — ${src.authors}` : ''}
                  {src.description ? ` — ${src.description}` : ''}
                </li>
              ))}
            </ul>
          ),
        })
      })
    }
    
    return steps
  }, [providedCustomSteps, content, sources, pageType])
  
  const { goCrisis, openWalkthrough, modal } = useCrisisAndWalkthrough({ 
    slug, 
    summaryHtml, 
    customSteps,
    pageType
  })

  // Gradient styles for buttons to match design
  const gradientStyles = {
    crisis: 'bg-gradient-to-r from-pink-500 via-pink-400 to-orange-400 hover:from-pink-600 hover:via-pink-500 hover:to-orange-500 shadow-lg hover:shadow-xl transition-all duration-300',
    walkthrough: 'bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 shadow-lg hover:shadow-xl transition-all duration-300'
  }

  return (
    <>
      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 backdrop-blur-md border-t border-white/20 dark:border-gray-600/20 shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 pb-safe">
          <div className="flex items-center gap-3 justify-center">
            <Button 
              onClick={pageType === 'feeling' && onOpenCrisisMode ? onOpenCrisisMode : goCrisis} 
              className={`flex-1 sm:flex-none sm:min-w-[140px] ${gradientStyles.crisis} text-black font-medium border-0`}
              size="default"
            >
              <Zap className="h-4 w-4 mr-2 text-black" />
              Crisis mode
            </Button>
            
            {!isMobile && !crisisOnly && (
              <Button 
                onClick={openWalkthrough} 
                className={`flex-1 sm:flex-none sm:min-w-[180px] ${gradientStyles.walkthrough} text-black font-medium border-0`}
                size="default"
              >
                <Footprints className="h-4 w-4 mr-2 text-black" />
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