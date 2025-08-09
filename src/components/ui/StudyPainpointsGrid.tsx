import React from 'react'
import type { LucideIcon } from 'lucide-react'

export type StudyPainpointItem = {
  id: string
  left: { label: string; text: string; Icon?: LucideIcon; emoji?: string }
  right: { label: string; text: string; Icon?: LucideIcon; emoji?: string }
}

interface StudyPainpointsGridProps {
  items: StudyPainpointItem[]
}

const rowPastels = [
  'bg-[#FBF8CC]/50',  // Lemon Chiffon
  'bg-[#FDE4CF]/50',  // Champagne Pink  
  'bg-[#FFCFD2]/50',  // Baby Pink
  'bg-[#F1C0E8]/50',  // Pink Lavender
  'bg-[#CFBAF0]/50',  // Lavender Blue
  'bg-[#A3C4F3]/50',  // Baby Blue Eyes
  'bg-[#90DBF4]/50',  // Sky Blue
  'bg-[#8EECF5]/50',  // Electric Blue
  'bg-[#98F5E1]/50',  // Magic Mint
  'bg-[#B9FBC0]/50',  // Granny Smith Apple
]

export default function StudyPainpointsGrid({ items }: StudyPainpointsGridProps) {
  return (
    <section aria-labelledby="painpoints-heading" className="w-full">
      <h2 id="painpoints-heading" className="sr-only">Study pain points</h2>

      {/* Column headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-3">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">You might:</h3>
        <h3 className="text-base md:text-lg font-semibold text-gray-900">Here’s what’s really going on:</h3>
      </div>

      <div className="space-y-3 md:space-y-4">
        {items.map((row, index) => {
          const bg = rowPastels[index % rowPastels.length]
          return (
            <div key={row.id} className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* connector */}
              <span aria-hidden className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">→</span>

              {/* Left card */}
              <div className={`h-full rounded-2xl shadow-sm ring-1 ring-black/5 ${bg}`}>
                <div className="p-4 md:p-5 flex items-start gap-3 md:gap-4">
                  {row.left.emoji ? (
                    <span aria-hidden className="text-xl md:text-2xl leading-none">{row.left.emoji}</span>
                  ) : row.left.Icon ? (
                    <row.left.Icon aria-hidden className="h-5 w-5 md:h-6 md:w-6 text-gray-900/80" />
                  ) : null}
                  <div className="space-y-1">
                    <div className="text-[16px] md:text-[18px] font-semibold text-gray-900 leading-tight">{row.left.label}</div>
                    <p className="text-[14px] md:text-[15px] text-gray-700 leading-relaxed">{row.left.text}</p>
                  </div>
                </div>
              </div>

              {/* Right card */}
              <div className={`h-full rounded-2xl shadow-sm ring-1 ring-black/5 ${bg}`}>
                <div className="p-4 md:p-5 flex items-start gap-3 md:gap-4">
                  {row.right.emoji ? (
                    <span aria-hidden className="text-xl md:text-2xl leading-none">{row.right.emoji}</span>
                  ) : row.right.Icon ? (
                    <row.right.Icon aria-hidden className="h-5 w-5 md:h-6 md:w-6 text-gray-900/80" />
                  ) : null}
                  <div className="space-y-1">
                    <div className="text-[16px] md:text-[18px] font-semibold text-gray-900 leading-tight">{row.right.label}</div>
                    <p className="text-[14px] md:text-[15px] text-gray-700 leading-relaxed">{row.right.text}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// Seed data and minimal usage snippet
export const exampleItems: StudyPainpointItem[] = [
  {
    id: 'row-1',
    left: {
      label: 'Lost in the page',
      text: 'Re-read the same page and don’t remember it later',
      emoji: '📖',
    },
    right: {
      label: 'Executive function load',
      text: 'Initiation and sequencing are hard. Use 1‑step starts + checklists.',
      emoji: '🧩',
    },
  },
  {
    id: 'row-2',
    left: {
      label: 'Freeze at the start',
      text: 'Plan, then freeze at start',
      emoji: '🚫',
    },
    right: {
      label: 'Working memory gaps',
      text: 'Info slips without retrieval. Favor flashcards over re‑reading.',
      emoji: '🧠',
    },
  },
  {
    id: 'row-3',
    left: {
      label: 'Misplaced next step',
      text: 'Lose track of materials/next step',
      emoji: '⚠️',
    },
    right: {
      label: 'Time blindness',
      text: 'Time feels fuzzy. Use visible timers + short time boxes.',
      emoji: '⏰',
    },
  },
  {
    id: 'row-4',
    left: {
      label: 'Energy crash',
      text: 'Crash when energy/interest dips',
      emoji: '✨',
    },
    right: {
      label: 'Motivation follows interest/urgency',
      text: 'Create stakes: body doubling + micro‑deadlines.',
      emoji: '🔥',
    },
  },
]

export function StudyPainpointsGridExample() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-2">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">You might:</h3>
        <h3 className="text-base md:text-lg font-semibold text-gray-900">Here’s what’s really going on:</h3>
      </div>
      <StudyPainpointsGrid items={exampleItems} />
    </div>
  )
}

