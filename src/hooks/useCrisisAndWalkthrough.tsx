'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getAllCrisisModeFeelingsNames, getCrisisModeFeeling } from '@/lib/supabase'
import { CrisisModeFeeling } from '@/types/database'
import * as LucideIcons from 'lucide-react'

// Function to format markdown text (same as used in content pages)
const formatMarkdownText = (text: string) => {
  if (!text) return text
  
  // Handle bold text (**text**)
  const withBold = text.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return { type: 'bold', content: part.slice(2, -2), key: `bold-${index}` };
    }
    return { type: 'text', content: part, key: `text-${index}` };
  });

  // Then handle italics (_text_) within each part
  const result: React.ReactNode[] = [];
  withBold.forEach((item) => {
    if (item.type === 'bold') {
      result.push(<strong key={item.key}>{item.content}</strong>);
    } else {
      // Process italics in text parts
      const italicParts = item.content.split(/(_[^_]+_)/).map((part, index) => {
        if (part.startsWith('_') && part.endsWith('_')) {
          return <em key={`${item.key}-italic-${index}`}>{part.slice(1, -1)}</em>;
        }
        return part;
      });
      result.push(...italicParts);
    }
  });

  return result;
};

export interface UseCrisisAndWalkthroughOptions {
  slug: string
  summaryHtml?: string
  customSteps?: CustomWalkStep[]
  pageType?: 'home' | 'barrier' | 'feeling' | 'task' | 'complex_loop' | 'identity' | 'guide' | 'script' | 'quiz' | 'resource'
}

interface WalkStep {
  id: string
  title: string
  excerpt: string
  content?: React.ReactNode
  classes?: string
}

export interface CustomWalkStep {
  id: string
  title: string
  content?: React.ReactNode
  classes?: string
}

const getPageTypeColors = (pageType: string | undefined) => {
  switch (pageType) {
    case 'barrier':
      return {
        primary: 'bg-orange-600 hover:bg-orange-700',
        secondary: 'bg-orange-600',
        text: 'text-orange-700'
      }
    case 'feeling':
      return {
        primary: 'bg-pink-600 hover:bg-pink-700',
        secondary: 'bg-pink-600',
        text: 'text-pink-700'
      }
    case 'task':
      return {
        primary: 'bg-green-600 hover:bg-green-700',
        secondary: 'bg-green-600',
        text: 'text-green-700'
      }
    case 'complex_loop':
      return {
        primary: 'bg-blue-600 hover:bg-blue-700',
        secondary: 'bg-blue-600',
        text: 'text-blue-700'
      }
    case 'identity':
      return {
        primary: 'bg-purple-600 hover:bg-purple-700',
        secondary: 'bg-purple-600',
        text: 'text-purple-700'
      }
    case 'guide':
      return {
        primary: 'bg-blue-600 hover:bg-blue-700',
        secondary: 'bg-blue-600',
        text: 'text-blue-700'
      }
    case 'script':
      return {
        primary: 'bg-purple-600 hover:bg-purple-700',
        secondary: 'bg-purple-600',
        text: 'text-purple-700'
      }
    case 'quiz':
      return {
        primary: 'bg-emerald-600 hover:bg-emerald-700',
        secondary: 'bg-emerald-600',
        text: 'text-emerald-700'
      }
    case 'resource':
      return {
        primary: 'bg-pink-600 hover:bg-pink-700',
        secondary: 'bg-pink-600',
        text: 'text-pink-700'
      }
    default:
      return {
        primary: 'bg-indigo-600 hover:bg-indigo-700',
        secondary: 'bg-indigo-600',
        text: 'text-rose-700'
      }
  }
}

export function useCrisisAndWalkthrough({ slug, summaryHtml, customSteps, pageType }: UseCrisisAndWalkthroughOptions) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [isWalkOpen, setIsWalkOpen] = useState(false)
  const [isCrisisOpen, setIsCrisisOpen] = useState(false)
  const [crisisFeelings, setCrisisFeelings] = useState<Pick<CrisisModeFeeling, 'feeling_name' | 'description' | 'icon'>[]>([])
  const [selectedFeeling, setSelectedFeeling] = useState<CrisisModeFeeling | null>(null)
  const [crisisLoading, setCrisisLoading] = useState(false)
  const [steps, setSteps] = useState<WalkStep[]>([])
  const [index, setIndex] = useState(0)
  const prefersReduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const storageKey = `walkthrough:${slug}`
  const colors = getPageTypeColors(pageType)

  // Build steps from DOM
  const scanDom = useCallback(() => {
    // If custom steps are provided (even if empty), prefer those
    if (customSteps !== undefined) {
      const built: WalkStep[] = customSteps.map((s) => ({
        id: s.id,
        title: s.title,
        excerpt: '',
        content: s.content,
        classes: s.classes,
      }))
      setSteps(built)
      setIndex((prev) => {
        if (built.length === 0) return 0
        if (prev < 0) return 0
        if (prev > built.length - 1) return built.length - 1
        return prev
      })
      // Debug logging for development
      // if (typeof window !== 'undefined') {
      //   // eslint-disable-next-line no-console
      //   console.groupCollapsed('[walkthrough] using customSteps')
      //   // eslint-disable-next-line no-console
      //   console.log('Custom steps count:', built.length)
      //   // eslint-disable-next-line no-console
      //   console.table(built.map(({ id, title }) => ({ id, title })))
      //   // eslint-disable-next-line no-console
      //   console.groupEnd()
      // }
      return built
    }
    // Get all sections with guide-section class and id
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('section.guide-section[id], .guide-section[id]'))
    
    const built: WalkStep[] = nodes.map((node) => {
      // Try to find title in multiple ways
      let title = ''
      
      // First try: direct h2/h3
      const directHeading = node.querySelector('h2, h3')
      if (directHeading) {
        title = directHeading.textContent?.trim() || ''
      }
      
      // Second try: heading inside button
      if (!title) {
        const buttonHeading = node.querySelector('button h3, button h2')
        if (buttonHeading) {
          title = buttonHeading.textContent?.trim() || ''
        }
      }
      
      // Third try: use ID as fallback
      if (!title && node.id) {
        // Special handling for known IDs
        const idMappings: Record<string, string> = {
          'tldr': 'TL;DR / Quick Summary',
          'gentle': 'Soft Start',
          'stern': 'Tough Love', 
          'adhd_reasons': 'Why ADHD Makes This Worse',
          'sources': 'Sources & References'
        }
        
        title = idMappings[node.id] || node.id
          .split('_')
          .map((word) => {
            // Handle special cases
            if (word === 'adhd') return 'ADHD'
            if (word === 'tldr') return 'TL;DR'
            // Capitalize first letter
            return word.charAt(0).toUpperCase() + word.slice(1)
          })
          .join(' ')
      }
      
      // Find excerpt content
      let excerpt = ''
      
      // Try to get content from various places
      const contentEl = node.querySelector('p:not(button p), ul:not(button ul), ol:not(button ol)') || 
                       node.querySelector('button p') ||
                       node.querySelector('div p')
      
      if (contentEl) {
        excerpt = (contentEl.textContent || '').trim().slice(0, 220)
      }
      
      // If still no excerpt, use a descriptive fallback based on ID
      if (!excerpt && node.id) {
        const excerptMappings: Record<string, string> = {
          'tldr': 'Quick overview of how to manage this feeling with ADHD-friendly strategies.',
          'gentle': 'Compassionate, understanding advice for when you need a softer approach.',
          'stern': 'Direct, no-nonsense guidance when you need a push to take action.',
          'adhd_reasons': 'Understanding the neurological and behavioral reasons behind this feeling.',
          'sources': 'Research, books, and resources that informed this content.'
        }
        
        if (excerptMappings[node.id]) {
          excerpt = excerptMappings[node.id]
        } else if (node.id.startsWith('step_')) {
          // Try to get the intro paragraph from the step data
          const introEl = node.querySelector('p')
          if (introEl && introEl.textContent) {
            excerpt = introEl.textContent.trim().slice(0, 220)
          } else {
            excerpt = 'Step-by-step guidance and practical strategies you can try.'
          }
        }
      }
      
      return { 
        id: node.id, 
        title: title.trim(), 
        excerpt: excerpt || 'Click to explore this section.' 
      }
    })
    // Debug logging for development
    // if (typeof window !== 'undefined') {
    //   // eslint-disable-next-line no-console
    //   console.groupCollapsed('[walkthrough] scanDom')
    //   // eslint-disable-next-line no-console
    //   console.log('Found count:', built.length)
    //   // eslint-disable-next-line no-console
    //   console.table(built)
    //   // eslint-disable-next-line no-console
    //   console.groupEnd()
    // }
    setSteps(built)
    // Clamp index to valid range in case a prior session stored an out-of-range value
    setIndex((prev) => {
      if (built.length === 0) return 0
      if (prev < 0) return 0
      if (prev > built.length - 1) return built.length - 1
      return prev
    })
    return built
  }, [customSteps])

  useEffect(() => {
    scanDom()
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const n = Number(saved)
      if (!Number.isNaN(n)) setIndex(n)
    }
  }, [scanDom])

  useEffect(() => {
    localStorage.setItem(storageKey, String(index))
  }, [index])

  const highlight = (el: HTMLElement) => {
    el.classList.add('ring-2', 'ring-rose-400')
    window.setTimeout(() => el.classList.remove('ring-2', 'ring-rose-400'), 1200)
  }

  // Load crisis feelings when crisis modal opens
  const loadCrisisFeelings = useCallback(async () => {
    setCrisisLoading(true)
    try {
      const { data, error } = await getAllCrisisModeFeelingsNames()
      if (error) throw error
      setCrisisFeelings(data || [])
    } catch (error) {
      console.error('Failed to load crisis feelings:', error)
    } finally {
      setCrisisLoading(false)
    }
  }, [])

  const goCrisis = useCallback(() => {
    setIsCrisisOpen(true)
    loadCrisisFeelings()
  }, [loadCrisisFeelings])

  const selectFeeling = useCallback(async (feelingName: string) => {
    setCrisisLoading(true)
    try {
      const { data, error } = await getCrisisModeFeeling(feelingName)
      if (error) throw error
      setSelectedFeeling(data)
    } catch (error) {
      console.error('Failed to load feeling details:', error)
    } finally {
      setCrisisLoading(false)
    }
  }, [])

  const openWalkthrough = useCallback(() => {
    const built = scanDom()
    setIsWalkOpen(true)
    // Only warn if no sections found and no custom steps provided
    if (built.length === 0 && !customSteps) {
      // eslint-disable-next-line no-console
      console.warn('[walkthrough] No sections found. Ensure sections have class "guide-section" and an id attribute.')
    }
    // Reset index if out of range
    setIndex((prev) => {
      if (built.length === 0) return 0
      if (prev > built.length - 1) return 0
      if (prev < 0) return 0
      return prev
    })
  }, [scanDom, customSteps])

  // const closeWalkthrough = () => setIsWalkOpen(false) // Unused - keeping for potential future use

  const jumpTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setIsWalkOpen(false)
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' })
    highlight(el)
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isWalkOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsWalkOpen(false)
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') setIndex((i) => Math.min(i + 1, steps.length - 1))
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') setIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isWalkOpen, steps.length])

  // Modal component to mount at page-level
  const modal = (
    <>
      {/* Crisis mode dialog */}
      <Dialog open={isCrisisOpen} onOpenChange={setIsCrisisOpen}>
        <DialogContent className="max-w-4xl w-full bg-white dark:bg-gray-900 !top-20 !translate-y-0 sm:!top-20 max-h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
          <DialogHeader className="text-center flex-shrink-0">
            <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
              <LucideIcons.Zap className="h-6 w-6 text-pink-600" />
              🆘 Crisis Mode
            </DialogTitle>
            <DialogDescription className="text-center">
              {selectedFeeling ? (
                `${selectedFeeling.feeling_name} - Immediate support strategies`
              ) : (
                "Pick the feeling that matches where you are right now"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0">
            {crisisLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              </div>
            ) : selectedFeeling ? (
              // Selected feeling view
              <div className="space-y-6 p-1">
                {/* Emergency notice */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <LucideIcons.AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800 dark:text-red-200">
                      <p className="font-semibold mb-1">If you're in immediate danger or having thoughts of self-harm:</p>
                      <p>Call 988 (Suicide & Crisis Lifeline) or text "HELLO" to 741741 (Crisis Text Line)</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="text-center">
                  <p className="text-lg text-gray-700 dark:text-gray-300">{formatMarkdownText(selectedFeeling.description)}</p>
                </div>

                {/* Strategies */}
                <div className="pb-4">
                  <h3 className="text-lg font-semibold text-center mb-4">{formatMarkdownText("**Try one of these:**")}</h3>
                  <div className="space-y-3">
                    {selectedFeeling.strategies.map((strategy, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {index + 1}
                          </div>
                          <p className="text-gray-900 dark:text-white leading-relaxed flex-1 text-sm">
                            {formatMarkdownText(strategy)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Feelings list view
              <div className="space-y-6 p-1">
                {/* Emergency notice */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <LucideIcons.AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800 dark:text-red-200">
                      <p className="font-semibold mb-1">If you're in immediate danger or having thoughts of self-harm:</p>
                      <p>Call 988 (Suicide & Crisis Lifeline) or text "HELLO" to 741741 (Crisis Text Line)</p>
                    </div>
                  </div>
                </div>

                {/* Feelings grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
                  {crisisFeelings.map((feeling) => {
                    const IconComponent = (LucideIcons as any)[feeling.icon] as React.ComponentType<any>
                    
                    return (
                      <button
                        key={feeling.feeling_name}
                        onClick={() => selectFeeling(feeling.feeling_name)}
                        className="text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {IconComponent ? (
                              <IconComponent className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                            ) : (
                              <LucideIcons.Circle className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors text-sm">
                              {feeling.feeling_name}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {formatMarkdownText(feeling.description)}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="text-center pb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    These are immediate, in-the-moment strategies. You're not broken — you're human.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Fixed footer buttons */}
          <div className="flex-shrink-0 border-t pt-4">
            {selectedFeeling ? (
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => setSelectedFeeling(null)} 
                  variant="outline"
                >
                  ← Back to feelings
                </Button>
                <Button 
                  onClick={() => setIsCrisisOpen(false)} 
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Button 
                  onClick={() => setIsCrisisOpen(false)} 
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Crisis summary dialog */}
      <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
          <DialogHeader className="">
            <DialogTitle className={colors.text}>Quick TL;DR</DialogTitle>
            <DialogDescription className="" asChild>
              <div className="prose dark:prose-invert text-sm" dangerouslySetInnerHTML={{ __html: summaryHtml || '<p>No summary available.</p>' }} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Walkthrough dialog */}
      <Dialog open={isWalkOpen} onOpenChange={setIsWalkOpen}>
        <DialogContent className="max-w-5xl w-full bg-white dark:bg-gray-900">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">
              {steps.length > 0 ? `Step ${Math.min(index + 1, steps.length)} of ${steps.length}` : 'No sections found'}
            </DialogTitle>
            {/* A11y: provide a description for screen readers to silence warning */}
            <DialogDescription className="sr-only">
              Use left and right arrow keys or letters N and P to navigate steps. Press Escape to close.
            </DialogDescription>
          </DialogHeader>
          {steps.length === 0 ? (
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <p>We couldn’t find any sections to walk through.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Each walkthrough section must be a <code>section</code> element with class <code>guide-section</code> and an <code>id</code>.</li>
                <li>Include a heading (h2/h3) and at least one paragraph or list item.</li>
              </ul>
              <div className="flex gap-2">
                <Button variant="outline" size="default" className="" onClick={scanDom}>Scan again</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 ${colors.secondary} rounded-full`} style={{ width: `${(steps.length ? ((index + 1) / steps.length) * 100 : 0)}%` }} />
              </div>
              {/* Dots */}
              <div className="flex gap-1 justify-center">
                {steps.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === index ? colors.secondary : 'bg-gray-300'}`} />
                ))}
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-center">{steps[index]?.title}</h3>
                {steps[index]?.content ? (
                  steps[index]?.classes ? (
                    <div className={steps[index].classes}>{steps[index].content}</div>
                  ) : (
                    <div className="p-4">{steps[index].content}</div>
                  )
                ) : (
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{steps[index]?.excerpt || 'No content available for this section.'}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button onClick={() => setIndex((i) => Math.max(i - 1, 0))} variant="outline" size="default" className="">Back</Button>
                  <Button onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))} variant="default" size="default" className={`${colors.primary} text-white`}>Next</Button>
                </div>
                <Button onClick={() => steps[index] && jumpTo(steps[index].id)} className={`${colors.primary} text-white`} variant="default" size="default">Jump to full section</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )

  return { goCrisis, openWalkthrough, modal }
}

export default useCrisisAndWalkthrough

