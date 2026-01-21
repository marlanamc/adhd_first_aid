'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  getAllCrisisModeFeelingsNames,
  getCrisisModeFeeling,
  getAllCrisisModeBarriersNames,
  getCrisisModeBarrier,
  getAllCrisisModeComplexLoopsNames,
  getCrisisModeComplexLoop,
  getAllCrisisModeLifeAreasNames,
  getCrisisModeLifeArea,
  getAllCrisisModeIdentitiesNames,
  getCrisisModeIdentity
} from '@/lib/supabase'
import { CrisisModeContent } from '@/types/crisis-mode'
import { iconRegistry, Zap, AlertTriangle, Circle } from '@/lib/iconRegistry'

import { formatMarkdownText } from '@/lib/utils'
import { logError, logWarning } from '@/lib/error-handling'
import { getPageTypeColors, type PageType } from '@/lib/colors'
import { Loader } from '@/components/ui/Loader'

// ===== DOM SCANNING UTILITIES =====
const findGuideSections = (): HTMLElement[] => {
  return Array.from(document.querySelectorAll<HTMLElement>('section.guide-section[id], .guide-section[id]'))
}

const extractTitleFromNode = (node: HTMLElement): string => {
  // First try: direct h2/h3
  const directHeading = node.querySelector('h2, h3')
  if (directHeading?.textContent) {
    return directHeading.textContent.trim()
  }

  // Second try: heading inside button
  const buttonHeading = node.querySelector('button h3, button h2')
  if (buttonHeading?.textContent) {
    return buttonHeading.textContent.trim()
  }

  // Third try: use ID as fallback
  if (node.id) {
    return generateTitleFromId(node.id)
  }

  return ''
}

const generateTitleFromId = (id: string): string => {
  const idMappings: Record<string, string> = {
    'tldr': 'TL;DR / Quick Summary',
    'gentle': 'Soft Start',
    'stern': 'Tough Love',
    'adhd_reasons': 'Why ADHD Makes This Worse',
    'sources': 'Sources & References'
  }

  if (idMappings[id]) {
    return idMappings[id]
  }

  // Convert snake_case to Title Case
  return id
    .split('_')
    .map((word) => {
      if (word === 'adhd') return 'ADHD'
      if (word === 'tldr') return 'TL;DR'
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

const extractExcerptFromNode = (node: HTMLElement): string => {
  // Try to get content from various places
  const contentEl = node.querySelector('p:not(button p), ul:not(button ul), ol:not(button ol)') ||
                   node.querySelector('button p') ||
                   node.querySelector('div p')

  if (contentEl?.textContent) {
    return contentEl.textContent.trim().slice(0, 220)
  }

  // If still no excerpt, use a descriptive fallback based on ID
  if (node.id) {
    return generateExcerptFromId(node.id)
  }

  return 'Click to explore this section.'
}

const generateExcerptFromId = (id: string): string => {
  const excerptMappings: Record<string, string> = {
    'tldr': 'Quick overview of how to manage this feeling with ADHD-friendly strategies.',
    'gentle': 'Compassionate, understanding advice for when you need a softer approach.',
    'stern': 'Direct, no-nonsense guidance when you need a push to take action.',
    'adhd_reasons': 'Understanding the neurological and behavioral reasons behind this feeling.',
    'sources': 'Research, books, and resources that informed this content.'
  }

  if (excerptMappings[id]) {
    return excerptMappings[id]
  }

  if (id.startsWith('step_')) {
    const introEl = document.querySelector(`#${id} p`)
    if (introEl?.textContent) {
      return introEl.textContent.trim().slice(0, 220)
    }
    return 'Step-by-step guidance and practical strategies you can try.'
  }

  return 'Click to explore this section.'
}

const createWalkStep = (node: HTMLElement): WalkStep => {
  return {
    id: node.id,
    title: extractTitleFromNode(node).trim(),
    excerpt: extractExcerptFromNode(node)
  }
}

const processCustomSteps = (customSteps: CustomWalkStep[]): WalkStep[] => {
  return customSteps.map((s) => ({
    id: s.id,
    title: s.title,
    excerpt: '',
    content: s.content,
    classes: s.classes,
  }))
}

const processGuideSections = (): WalkStep[] => {
  const nodes = findGuideSections()
  return nodes.map(createWalkStep)
}

// ===== EXTRACTED HOOKS =====

// Hook for DOM scanning and walkthrough step generation
const useWalkthroughScanner = (customSteps?: CustomWalkStep[]) => {
  const scanDom = useCallback(() => {
    if (customSteps !== undefined) {
      return processCustomSteps(customSteps)
    } else {
      return processGuideSections()
    }
  }, [customSteps])

  return { scanDom }
}

// Hook for page type color management - now uses centralized system
const usePageTypeColors = (pageType: PageType) => {
  return useMemo(() => getPageTypeColors(pageType), [pageType])
}

// Hook for walkthrough state management
const useWalkthroughState = (slug: string, customSteps?: CustomWalkStep[]) => {
  const [steps, setSteps] = useState<WalkStep[]>([])
  const [index, setIndex] = useState(0)
  const prefersReduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const storageKey = `walkthrough:${slug}`

  const { scanDom } = useWalkthroughScanner(customSteps)

  // Initialize walkthrough
  useEffect(() => {
    const built = scanDom()
    setSteps(built)

    // Load saved position from localStorage
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const n = Number(saved)
      if (!Number.isNaN(n)) setIndex(n)
    }

    // Clamp index to valid range
    setIndex((prev) => {
      if (built.length === 0) return 0
      if (prev < 0) return 0
      if (prev > built.length - 1) return built.length - 1
      return prev
    })
  }, [scanDom, storageKey])

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, String(index))
  }, [index, storageKey])

  const highlight = (el: HTMLElement) => {
    el.classList.add('ring-2', 'ring-rose-400')
    window.setTimeout(() => el.classList.remove('ring-2', 'ring-rose-400'), 1200)
  }

  const jumpTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' })
    highlight(el)
  }

  return {
    steps,
    index,
    setIndex,
    jumpTo,
    prefersReduced,
    scanDom
  }
}

// Hook for crisis mode functionality
const useCrisisMode = (filterByType?: 'feeling' | 'barrier' | 'complex_loop' | 'life_area' | 'identity') => {
  const [isCrisisOpen, setIsCrisisOpen] = useState(false)
  const [crisisItems, setCrisisItems] = useState<Array<{
    name: string;
    type: 'feeling' | 'barrier' | 'complex_loop' | 'life_area' | 'identity';
    description: string;
    icon: string;
  }>>([])
  const [selectedItem, setSelectedItem] = useState<CrisisModeContent | null>(null)
  const [crisisLoading, setCrisisLoading] = useState(false)

  // Get the correct back button text based on filter type
  const getBackButtonText = () => {
    switch (filterByType) {
      case 'barrier': return 'Back to barriers'
      case 'complex_loop': return 'Back to complex loops'
      case 'life_area': return 'Back to life areas'
      case 'identity': return 'Back to identities'
      case 'feeling': return 'Back to feelings'
      default: return 'Back to crisis options'
    }
  }

  // Load all crisis items when crisis modal opens
  const loadCrisisItems = useCallback(async () => {
    setCrisisLoading(true)
    try {
      const [feelingsRes, barriersRes, loopsRes, lifeAreasRes, identitiesRes] = await Promise.all([
        getAllCrisisModeFeelingsNames(),
        getAllCrisisModeBarriersNames(),
        getAllCrisisModeComplexLoopsNames(),
        getAllCrisisModeLifeAreasNames(),
        getAllCrisisModeIdentitiesNames()
      ])

      const allItems = [
        ...(feelingsRes.data || []).map((item: any) => ({
          name: item.feeling_name,
          type: 'feeling' as const,
          description: item.description,
          icon: item.icon
        })),
        ...(barriersRes.data || []).map((item: any) => ({
          name: item.barrier_name,
          type: 'barrier' as const,
          description: item.description,
          icon: item.icon
        })),
        ...(loopsRes.data || []).map((item: any) => ({
          name: item.loop_name,
          type: 'complex_loop' as const,
          description: item.description,
          icon: item.icon
        })),
        ...(lifeAreasRes.data || []).map((item: any) => ({
          name: item.life_area_name,
          type: 'life_area' as const,
          description: item.description,
          icon: item.icon
        })),
        ...(identitiesRes.data || []).map((item: any) => ({
          name: item.identity_name,
          type: 'identity' as const,
          description: item.description,
          icon: item.icon
        }))
      ]

      console.log('Crisis items loaded:', allItems.length, allItems)
      setCrisisItems(allItems)
    } catch (error) {
      console.error('Failed to load crisis items:', error)
      logError('Failed to load crisis items', error, 'crisisMode', 'high')
    } finally {
      setCrisisLoading(false)
    }
  }, [])

  const goCrisis = useCallback(() => {
    setIsCrisisOpen(true)
    loadCrisisItems()
  }, [loadCrisisItems])

  const selectFeeling = useCallback(async (itemName: string, itemType?: 'feeling' | 'barrier' | 'complex_loop' | 'life_area' | 'identity') => {
    setCrisisLoading(true)
    try {
      let result;

      // If type is provided, use it; otherwise try to find the item in our crisis items list
      const type = itemType || crisisItems.find(item => item.name === itemName)?.type || 'feeling'

      switch (type) {
        case 'feeling':
          result = await getCrisisModeFeeling(itemName)
          break
        case 'barrier':
          result = await getCrisisModeBarrier(itemName)
          break
        case 'complex_loop':
          result = await getCrisisModeComplexLoop(itemName)
          break
        case 'life_area':
          result = await getCrisisModeLifeArea(itemName)
          break
        case 'identity':
          result = await getCrisisModeIdentity(itemName)
          break
        default:
          throw new Error(`Unknown crisis item type: ${type}`)
      }

      if (result.error) throw result.error
      setSelectedItem(result.data)
    } catch (error) {
      logError('Failed to load crisis item details', error, 'crisisMode', 'high')
    } finally {
      setCrisisLoading(false)
    }
  }, [crisisItems])

  // Filter items if filterByType is provided
  const filteredCrisisItems = filterByType
    ? crisisItems.filter(item => item.type === filterByType)
    : crisisItems

  return {
    isCrisisOpen,
    setIsCrisisOpen,
    crisisFeelings: filteredCrisisItems, // Keep the old name for compatibility
    selectedFeeling: selectedItem, // Keep the old name for compatibility
    setSelectedFeeling: setSelectedItem,
    crisisLoading,
    goCrisis,
    selectFeeling,
    loadCrisisFeelings: loadCrisisItems,
    getBackButtonText
  }
}

export interface UseCrisisAndWalkthroughOptions {
  slug: string
  summaryHtml?: string
  customSteps?: CustomWalkStep[]
  pageType?: 'home' | 'barrier' | 'feeling' | 'task' | 'complex_loop' | 'identity' | 'life_area' | 'guide' | 'script' | 'quiz' | 'resource'
  crisisFilterType?: 'feeling' | 'barrier' | 'complex_loop' | 'life_area' | 'identity'
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



// ===== REFACTORED MAIN HOOK =====

export function useCrisisAndWalkthrough({ slug, summaryHtml, customSteps, pageType, crisisFilterType }: UseCrisisAndWalkthroughOptions) {
  // Extract concerns into focused hooks
  const colors = usePageTypeColors(pageType || 'home' as PageType)
  const walkthroughState = useWalkthroughState(slug, customSteps)
  const crisisMode = useCrisisMode(crisisFilterType)

  // Local state for summary and walkthrough modals
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [isWalkOpen, setIsWalkOpen] = useState(false)

  // Extract values from smaller hooks
  const {
    steps,
    index,
    setIndex,
    jumpTo: _jumpTo,
    prefersReduced,
    scanDom
  } = walkthroughState

  const {
    isCrisisOpen,
    setIsCrisisOpen,
    crisisFeelings,
    selectedFeeling,
    setSelectedFeeling,
    crisisLoading,
    goCrisis,
    selectFeeling,
    getBackButtonText
  } = crisisMode

  // Enhanced walkthrough opener with validation
  const openWalkthrough = useCallback(() => {
    const built = scanDom()
    setIsWalkOpen(true)
    // Only warn if no sections found and no custom steps provided
    if (built.length === 0 && !customSteps) {
      logWarning('No walkthrough sections found. Ensure sections have class "guide-section" and an id attribute.', 'walkthrough')
    }
    // Reset index if out of range
    setIndex((prev) => {
      if (built.length === 0) return 0
      if (prev > built.length - 1) return 0
      if (prev < 0) return 0
      return prev
    })
  }, [scanDom, customSteps, setIndex])

  // Enhanced jumpTo with walkthrough closing
  const jumpToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setIsWalkOpen(false)
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' })
    // Highlight the element briefly
    el.classList.add('ring-2', 'ring-rose-400')
    window.setTimeout(() => el.classList.remove('ring-2', 'ring-rose-400'), 1200)
  }, [prefersReduced])

  // Keyboard navigation for walkthrough
  useEffect(() => {
    if (!isWalkOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsWalkOpen(false)
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') setIndex((i) => Math.min(i + 1, steps.length - 1))
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') setIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isWalkOpen, steps.length, setIndex])

  // Modal component to mount at page-level
  const modal = (
    <>
      {/* Crisis mode dialog */}
      <Dialog open={isCrisisOpen} onOpenChange={setIsCrisisOpen}>
        <DialogOverlay className="z-[99]" />
        <DialogContent className="max-w-4xl w-full bg-white dark:bg-gray-900 !top-20 !translate-y-0 sm:!top-20 max-h-[calc(100vh-5rem)] overflow-hidden flex flex-col z-[100]">
          <DialogHeader className="text-center flex-shrink-0">
            <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
              <Zap className="h-6 w-6 text-pink-600" />
              🆘 Crisis Mode
            </DialogTitle>
            <DialogDescription className="text-center">
              {selectedFeeling ? (
                `${(selectedFeeling as any).feeling_name || (selectedFeeling as any).barrier_name || (selectedFeeling as any).loop_name || (selectedFeeling as any).life_area_name || (selectedFeeling as any).identity_name} - Immediate support strategies`
              ) : (
                "Pick the feeling that matches where you are right now"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0">
            {crisisLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader size="md" className="border-pink-600 border-t-transparent" />
              </div>
            ) : selectedFeeling ? (
              // Selected feeling view
              <div className="space-y-6 p-1">
                {/* Emergency notice */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
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
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800 dark:text-red-200">
                      <p className="font-semibold mb-1">If you're in immediate danger or having thoughts of self-harm:</p>
                      <p>Call 988 (Suicide & Crisis Lifeline) or text "HELLO" to 741741 (Crisis Text Line)</p>
                    </div>
                  </div>
                </div>

                {/* Feelings grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
                  {crisisFeelings.map((feeling) => {
                    // Check if the icon is an emoji or a Lucide icon name
                    const isEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(feeling.icon)
                    const IconComponent = !isEmoji ? iconRegistry[feeling.icon] as React.ComponentType<any> : null

                    return (
                      <button
                        key={`${feeling.type}-${feeling.name}`}
                        onClick={() => selectFeeling(feeling.name)}
                        className="text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {isEmoji ? (
                              <span className="text-lg w-5 h-5 flex items-center justify-center">{feeling.icon}</span>
                            ) : IconComponent ? (
                              <IconComponent className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                            ) : (
                              <Circle className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors text-sm">
                              {feeling.name}
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
                  ← {getBackButtonText()}
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
        <DialogOverlay className="z-[99]" />
        <DialogContent className="max-w-5xl w-full bg-white dark:bg-gray-900 z-[100]">
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
                <Button onClick={() => steps[index] && jumpToSection(steps[index].id)} className={`${colors.primary} text-white`} variant="default" size="default">Jump to full section</Button>
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

