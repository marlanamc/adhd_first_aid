"use client"

import React from 'react'

export type Row = {
  icon?: string
  youMight: { title: string; body?: string }
  whatsGoingOn: { title: string; body: string }
  howTo: string[]
}

type Props = {
  rows: Row[]
}

// Keep tokens in line with existing pastel row styles
const rowPalette = [
  { bg: 'bg-[#FBF8CC]/35', border: 'border-[#FBF8CC]/60' },
  { bg: 'bg-[#FDE4CF]/35', border: 'border-[#FDE4CF]/60' },
  { bg: 'bg-[#FFCFD2]/35', border: 'border-[#FFCFD2]/60' },
  { bg: 'bg-[#F1C0E8]/35', border: 'border-[#F1C0E8]/60' },
  { bg: 'bg-[#CFBAF0]/35', border: 'border-[#CFBAF0]/60' },
  { bg: 'bg-[#A3C4F3]/35', border: 'border-[#A3C4F3]/60' },
]

const ensureColon = (title: string) =>
  /[:：]$/.test(title.trim()) ? title : `${title.trim().replace(/[—–-]+\s*$/,'')}:`

export default function AdhdReasonsThreeCol({ rows }: Props) {
  const rightEmojiFor = (title?: string) => {
    const k = (title || '').toLowerCase()
    if (k.includes('executive')) return '🧩'
    if (k.includes('working memory')) return '🧠'
    if (k.includes('time')) return '⏰'
    if (k.includes('attention')) return '🎯'
    if (k.includes('rsd') || k.includes('shame')) return '😣'
    if (k.includes('dopamine')) return '🧪'
    if (k.includes('motivation') || k.includes('urgency')) return '🔥'
    if (k.includes('planning') || k.includes('transition')) return '⏱️'
    return '💡'
  }
  return (
    <section aria-labelledby="adhd-reasons" className="space-y-3">
      {/* Column headings on desktop to match existing style */}
      <div className="hidden md:grid md:grid-cols-2 gap-5 pl-1 pr-1" aria-hidden>
        <h4 className="font-semibold text-gray-900 text-base border-b border-gray-200 text-center py-3 bg-white/60 dark:bg-gray-900/10 rounded-t">You might:</h4>
        <h4 className="font-semibold text-gray-900 text-base border-b border-gray-200 text-center py-3 bg-white/60 dark:bg-gray-900/10 rounded-t">Here's what's really going on:</h4>
      </div>
      <div className="space-y-4">
        {rows.map((row, idx) => {
          const scheme = rowPalette[idx % rowPalette.length]
          return (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-stretch">
              {/* Col 1 */}
              <article
                className={`relative rounded-md px-4 py-3 md:py-4 flex h-full items-start gap-3 border ${scheme.bg} ${scheme.border} focus-within:ring-2 focus-within:ring-blue-400 min-h-[132px]`}
                role="group"
              >
                {row.icon && (
                  <span aria-hidden className="text-lg w-5 text-center mt-[2px] flex-shrink-0">{row.icon}</span>
                )}
                <div className="text-gray-900">
                  <h3 className="font-semibold text-[16px] md:text-[17px] leading-tight">{row.youMight.title}</h3>
                  {row.youMight.body && (
                    <p className="text-[15px] md:text-[16px] leading-[1.65] mt-1">{row.youMight.body}</p>
                  )}
                </div>
                <span aria-hidden className="hidden md:flex items-center justify-center absolute -right-3 inset-y-0 my-auto select-none">→</span>
              </article>

              {/* Col 2 */}
              <article
                className={`relative rounded-md px-4 py-3 md:py-4 flex h-full items-start gap-3 border ${scheme.bg} ${scheme.border} min-h-[132px]`}
              >
                <span aria-hidden className="text-lg w-5 text-center mt-[2px] flex-shrink-0">{rightEmojiFor(row.whatsGoingOn.title)}</span>
                <div className="text-gray-900">
                  <h3 className="font-semibold text-[16px] md:text-[17px] leading-tight">
                    {ensureColon(row.whatsGoingOn.title)}
                  </h3>
                  <p className="text-[15px] md:text-[16px] leading-[1.65] mt-1">{row.whatsGoingOn.body}</p>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </section>
  )
}

