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
  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

  const mdInline = (s?: string) => {
    const raw = String(s || '')
    const emojiLead = /^[\p{Extended_Pictographic}\u2600-\u27BF\uFE0F\u200D\s]+/u
    const stripped = raw.replace(emojiLead, '').trimStart()
    const safe = escapeHtml(stripped)
    return safe
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
  }
  return (
    <section aria-labelledby="core-principles" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {items.map((it, idx) => {
          // Ensure we don't repeat emoji visually; rotate a fallback set if duplicates occur
          const uniqueEmoji = (() => {
            const pool = ['✨','🧭','📌','🔁','🌱','🔎','🪄','🧠','🎯','⚡','⏰','💡']
            const chosen = it.icon || pool[idx % pool.length]
            return chosen
          })()
          return (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-md border border-black/5 bg-white/80 px-3 py-2.5 md:py-3 min-h-[92px] focus-within:ring-2 focus-within:ring-blue-400"
              tabIndex={-1}
            >
              <span aria-hidden className="text-xl leading-none mt-0.5 flex-shrink-0 select-none">{uniqueEmoji}</span>
              <div className="min-w-0">
                <div
                  className="font-semibold text-base text-gray-900"
                  dangerouslySetInnerHTML={{ __html: mdInline(it.title) }}
                />
                {it.desc && (
                  <p
                    className="text-sm text-gray-800 mt-0.5 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: mdInline(it.desc) }}
                  />
                )}
                {it.try && (
                  <p className="text-xs text-gray-600 mt-1"><span className="font-semibold">Try:</span> {it.try}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

