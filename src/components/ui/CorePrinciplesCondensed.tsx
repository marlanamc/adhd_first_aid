"use client"

import React from 'react'

export type CorePrinciple = {
  icon?: string
  title: string
  desc?: string
  try?: string
}

type Props = {
  items: CorePrinciple[]
}

export default function CorePrinciplesCondensed({ items }: Props) {
  return (
    <section aria-labelledby="core-principles" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-md border border-black/5 bg-white/70 px-3 py-2 md:py-2.5 min-h-[84px]">
            {it.icon && (
              <span aria-hidden className="text-xl leading-none mt-0.5 flex-shrink-0">{it.icon}</span>
            )}
            <div className="min-w-0">
              <div className="font-semibold text-base text-gray-900 truncate">
                {it.title}
              </div>
              {it.desc && (
                <p className="text-sm text-gray-800 mt-0.5 leading-relaxed">
                  {it.desc}
                </p>
              )}
              {it.try && (
                <p className="text-xs text-gray-600 mt-1"><span className="font-semibold">Try:</span> {it.try}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

