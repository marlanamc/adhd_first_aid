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
  
  const formatTitle = (title?: string) => {
    if (!title) return ''
    // Check if title contains a colon
    const colonIndex = title.indexOf(':')
    if (colonIndex > -1) {
      // Split at colon and format the part before as bold
      const beforeColon = title.substring(0, colonIndex)
      const afterColon = title.substring(colonIndex + 1).trim()
      // Return formatted HTML without the colon, with the second part on next line
      return `<strong>${escapeHtml(beforeColon)}</strong><br/>${escapeHtml(afterColon)}`
    }
    // If no colon, just apply normal markdown formatting
    return mdInline(title)
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
                {/* When desc is provided separately, title is already just the bold part */}
                {it.desc ? (
                  <>
                    <div className="font-semibold text-base text-gray-900">
                      {it.title}
                    </div>
                    <div className="text-base text-gray-900 leading-relaxed">
                      {it.desc}
                    </div>
                  </>
                ) : (
                  /* When no desc, parse the title for colon */
                  <div
                    className="text-base text-gray-900 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatTitle(it.title) }}
                  />
                )}
                {it.try && (
                  <p className="text-xs text-gray-600 mt-1.5"><span className="font-semibold">Try:</span> {it.try}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

