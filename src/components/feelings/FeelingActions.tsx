'use client'

import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, Footprints } from 'lucide-react'
import { useCrisisAndWalkthrough } from '@/hooks/useCrisisAndWalkthrough'
import { useIsMobile } from '@/hooks/use-mobile'
import type { FeelingsContent, FeelingSources } from '@/lib/supabase'

// Local markdown-style formatter to match page rendering
function formatMarkdownText(text: string) {
  if (!text) return null
  if (text.includes('**') || text.includes('_')) {
    const withBold = text.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return { type: 'bold', content: part.slice(2, -2), key: `bold-${index}` }
      }
      return { type: 'text', content: part, key: `text-${index}` }
    })
    const result: React.ReactNode[] = []
    withBold.forEach((item) => {
      if (item.type === 'bold') {
        result.push(<strong key={item.key}>{item.content}</strong>)
      } else {
        const italicParts = (item.content as string).split(/(_[^_]+_)/).map((part, i) => {
          if (part.startsWith('_') && part.endsWith('_')) {
            return <em key={`${item.key}-italic-${i}`}>{part.slice(1, -1)}</em>
          }
          return part
        })
        result.push(...italicParts)
      }
    })
    return result
  }
  return text
}

export interface FeelingActionsProps {
  slug: string
  summaryHtml?: string
  content?: FeelingsContent | null
  sources?: FeelingSources[] | null
}

export default function FeelingActions({ slug, summaryHtml, content, sources }: FeelingActionsProps) {
  const isMobile = useIsMobile()
  // Build rich, colored steps directly so modal shows full sections with their styles
  const customSteps = useMemo(() => {
    // If full content is available, mirror the entire page (summary → gentle → stern → reasons → steps → sources)
    if (content) {
      const steps: Array<{ id: string; title: string; classes?: string; content: React.ReactNode }> = []

      // Quick Summary
      if (content.intro_paragraph || summaryHtml) {
        steps.push({
          id: 'tldr',
          title: 'Quick Summary',
          classes: 'border-l-4 border-pink-400 bg-pink-50/50 dark:bg-pink-900/10 p-5 rounded-r-lg',
          content: (
            <p className="text-base md:text-lg text-foreground leading-relaxed">{formatMarkdownText(content.intro_paragraph)}</p>
          ),
        })
      }

      // Soft Start
      steps.push({
        id: 'gentle',
        title: 'Soft Start',
        classes: 'bg-[#A0E8AF]/40 border border-[#A0E8AF]/60 rounded-xl p-5',
        content: (
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{formatMarkdownText(content.gentle_advice)}</p>
        ),
      })

      // Tough Love
      steps.push({
        id: 'stern',
        title: 'Tough Love',
        classes: 'bg-[#F87171]/30 border border-[#F87171]/50 rounded-xl p-5',
        content: (
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{formatMarkdownText(content.stern_advice)}</p>
        ),
      })

      // Why ADHD Makes This Worse
      if (Array.isArray(content.adhd_reasons) && content.adhd_reasons.length > 0) {
        // Emoji mapper (lightweight, mirrors page vibe)
        const pickEmoji = (text: string) => {
          const t = text.toLowerCase()
          if (t.includes('working memory')) return '💭'
          if (t.includes('executive')) return '⚙️'
          if (t.includes('dopamine')) return '🧬'
          if (t.includes('sensory')) return '🎚️'
          if (t.includes('time')) return '⏳'
          if (t.includes('overwhelm')) return '🌊'
          if (t.includes('burnout')) return '🔥'
          if (t.includes('anxiety')) return '😰'
          return '🧩'
        }

        steps.push({
          id: 'adhd_reasons',
          title: `Why ADHD Makes ${content.feeling_name} Worse`,
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
                    <span className="translate-y-[2px]">{pickEmoji(reason)}</span>
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

      // Step sections
      if (Array.isArray(content.step_sections) && content.step_sections.length > 0) {
        const colorSchemes = [
          { bg: 'bg-[#FCF6BD]/20', border: 'border-[#FCF6BD]/50' },
          { bg: 'bg-[#D0F4DE]/20', border: 'border-[#D0F4DE]/50' },
          { bg: 'bg-[#A9DEF9]/20', border: 'border-[#A9DEF9]/50' },
          { bg: 'bg-[#E4C1F9]/20', border: 'border-[#E4C1F9]/50' },
          { bg: 'bg-[#CEF4FF]/20', border: 'border-[#CEF4FF]/50' },
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

      // Sources (split into one walkthrough step per category to reduce cognitive load)
      if (Array.isArray(sources) && sources.length > 0) {
        const grouped = sources.reduce<Record<string, typeof sources>>((acc, s) => {
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
          { bg: 'bg-[#A3C4F3]/40', border: 'border-[#A3C4F3]/60' },
          { bg: 'bg-[#90DBF4]/40', border: 'border-[#90DBF4]/60' },
          { bg: 'bg-[#8EECF5]/40', border: 'border-[#8EECF5]/60' },
          { bg: 'bg-[#98F5E1]/40', border: 'border-[#98F5E1]/60' },
          { bg: 'bg-[#B9FBC0]/40', border: 'border-[#B9FBC0]/60' },
        ]

        const entries = Object.entries(grouped).sort(([, a], [, b]) => b.length - a.length)
        entries.forEach(([category, items], i) => {
          const c = palette[i % palette.length]
          steps.push({
            id: 'sources', // Jump scrolls to the Sources section on the page
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
    }

    // Fallback minimal steps if no content provided
    return [
      {
        id: 'tldr',
        title: 'Quick Summary',
        classes: 'border-l-4 border-pink-400 bg-pink-50/50 dark:bg-pink-900/10 p-5 rounded-r-lg',
        content: (
          <div className="prose dark:prose-invert text-base" dangerouslySetInnerHTML={{ __html: summaryHtml || '' }} />
        ),
      },
      { id: 'gentle', title: 'Soft Start', classes: 'bg-[#A0E8AF]/40 border border-[#A0E8AF]/60 rounded-xl p-5', content: <p>Open the “Soft Start” section for a gentle beginning.</p> },
      { id: 'stern', title: 'Tough Love', classes: 'bg-[#F87171]/30 border border-[#F87171]/50 rounded-xl p-5', content: <p>Use the “Tough Love” section when you need a firmer push.</p> },
    ]
  }, [content, sources, summaryHtml])

  const { goCrisis, openWalkthrough, modal } = useCrisisAndWalkthrough({ slug, summaryHtml, customSteps })

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <Button onClick={goCrisis} className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white">
        <Zap className="h-4 w-4 mr-2" />
        Crisis mode
      </Button>
      {!isMobile && (
        <Button onClick={openWalkthrough} className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white" variant="default">
          <Footprints className="h-4 w-4 mr-2" />
          Walk me through this
        </Button>
      )}
      {modal}
    </div>
  )
}

