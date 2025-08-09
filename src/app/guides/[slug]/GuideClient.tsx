'use client'

import { ArrowLeft, FileText, Info, Lightbulb, AlertTriangle, Zap, Code, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Guide } from '@/lib/markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface GuideClientProps {
  guide: Guide
}

export default function GuideClient({ guide }: GuideClientProps) {

  // Minimal reading experience – no section checklist/TOC

  // No reading progress bar for a clean, minimal reading experience

  // Utilities to build a dynamic table of contents and stable heading anchors
  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')

  // Anchor ids are added to headings, but we don't render a sidebar TOC

  const goBack = () => {
    window.history.back()
  }

  // Process the markdown content to handle callouts before ReactMarkdown
  const processCallouts = (content: string) => {
    // Replace callout syntax with a special marker that we can detect
    return content.replace(/^>\s*\[!(note|info|tip|warning|danger|example)\]\s*/gim, (match, type) => {
      return `> __CALLOUT_${type.toUpperCase()}__ `
    })
  }

  const processedContent = processCallouts(guide.content)

  // Simple auto-bolding to improve scan-ability for plain-text paragraphs/list items
  const escapeHtml = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const emphasizeFirstClause = (text: string): string => {
    const trimmed = text.trim()
    // Prefer clause before em dash / colon / hyphen
    const match = /^(.{8,120}?)(\s[—\-:]\s|:|—)\s*(.*)$/.exec(trimmed)
    if (match) {
      const lead = escapeHtml(match[1])
      const sep = match[2].trim()
      const rest = escapeHtml(match[3])
      return `<strong>${lead}</strong> ${sep} ${rest}`
    }
    // Otherwise, bold first sentence if reasonably short
    const sentence = /^(.*?[\.\!\?])(\s|$)/.exec(trimmed)
    if (sentence && sentence[1].length >= 24 && sentence[1].length <= 140) {
      const lead = escapeHtml(sentence[1])
      const rest = escapeHtml(trimmed.slice(sentence[1].length))
      return `<strong>${lead}</strong>${rest}`
    }
    return escapeHtml(trimmed)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f1ff] via-[#f5efff] to-[#fef6ee] dark:from-[#0a0f1a] dark:via-[#0c1423] dark:to-[#0f182a] relative">

      <div className="max-w-4xl mx-auto px-4 py-6 pt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={goBack}
              className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-black dark:text-white" />
            </Button>
            <div className="flex-1">
              <div className="text-center">
                <div className="text-4xl mb-2 drop-shadow-sm">{guide.emoji}</div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {guide.title}
                </h1>
                <p className="text-gray-700 dark:text-white/70 text-sm md:text-[15px] max-w-3xl mx-auto">
                  {guide.description}
                </p>
              </div>
            </div>
          </div>

          {/* Minimal meta chips removed for focus; keep tags only if present */}
          {guide.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {guide.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white/60 dark:bg-gray-800 text-black dark:text-white px-2 py-1 rounded-full text-[10px] md:text-xs border border-white/40 dark:border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress bar removed for distraction-free reading */}

        {/* Name timeline removed per request */}

        {/* Guide Content */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-800">
          {/* Quick Summary as colorful cards, if present */}
          {(() => {
            const lines = guide.content.split(/\r?\n/)
            const startIdx = lines.findIndex(l => /^##\s+Quick Summary/i.test(l))
            if (startIdx === -1) return null
            const bullets: string[] = []
            for (let i = startIdx + 1; i < lines.length; i += 1) {
              const line = lines[i]
              if (/^##\s+/.test(line)) break
              const m = /^-\s+(.+)$/.exec(line)
              if (m) bullets.push(m[1])
            }
            if (bullets.length === 0) return null
            const palette = [
              { bg: 'from-[#E0F7FA] to-[#E8F5E9] dark:from-teal-900/30 dark:to-emerald-900/30', border: 'border-teal-200 dark:border-teal-800/60', dot: 'bg-teal-600 dark:bg-teal-400' },
              { bg: 'from-[#FFF3E0] to-[#FCE4EC] dark:from-amber-900/30 dark:to-rose-900/30', border: 'border-amber-200 dark:border-amber-800/60', dot: 'bg-amber-600 dark:bg-amber-400' },
              { bg: 'from-[#EDE7F6] to-[#E3F2FD] dark:from-indigo-900/30 dark:to-blue-900/30', border: 'border-indigo-200 dark:border-indigo-800/60', dot: 'bg-indigo-600 dark:bg-indigo-400' },
              { bg: 'from-[#F1F8E9] to-[#E8EAF6] dark:from-lime-900/30 dark:to-indigo-900/30', border: 'border-lime-200 dark:border-lime-800/60', dot: 'bg-lime-600 dark:bg-lime-400' }
            ]
            return (
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Quick Summary</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {bullets.map((b, i) => {
                    const c = palette[i % palette.length]
                    return (
                      <div key={i} className={`rounded-xl p-4 bg-gradient-to-br ${c.bg} border ${c.border}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 ${c.dot} rounded-full mt-2 flex-shrink-0`} />
                          <div className="text-[13px] leading-relaxed text-gray-800 dark:text-gray-100" dangerouslySetInnerHTML={{ __html: emphasizeFirstClause(b) }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
          <div className="prose max-w-none leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white first:mt-0 tracking-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => {
                  const text = Array.isArray(children) ? children.join('') : String(children) || ''
                  const id = slugify(String(text))
                  return (
                    <h2 id={id} className="mt-9 mb-3 scroll-mt-28 text-xl md:text-[20px] font-bold text-gray-900 dark:text-gray-50">
                      <a href={`#${id}`} className="no-underline hover:underline decoration-2 underline-offset-[6px]">
                        {children}
                      </a>
                    </h2>
                  )
                },
                h3: ({ children }) => {
                  const text = Array.isArray(children) ? children.join('') : String(children) || ''
                  const id = slugify(String(text))
                  return (
                    <h3 id={id} className="mt-5 mb-2 scroll-mt-28 text-lg font-semibold text-gray-800 dark:text-gray-100">
                      <a href={`#${id}`} className="no-underline hover:underline decoration-2 underline-offset-[6px]">
                        {children}
                      </a>
                    </h3>
                  )
                },
                p: ({children}) => {
                  const text = typeof children === 'string' ? children : ''
                  const isActionItem = text.includes('✅') || text.includes('❌')
                  
                  if (isActionItem) {
                    return (
                      <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-l-4 border-yellow-400 dark:border-yellow-700">
                        <p className="text-gray-800 dark:text-gray-100 leading-relaxed font-medium text-sm md:text-[15px]">
                          {children}
                        </p>
                      </div>
                    )
                  }
                  
                  // Auto emphasize for plain text strings; otherwise render children as usual
                  if (typeof children === 'string') {
                    return (
                      <p
                        className="mb-3 text-gray-800 dark:text-gray-100 leading-relaxed text-sm md:text-[15px]"
                        dangerouslySetInnerHTML={{ __html: emphasizeFirstClause(children as string) }}
                      />
                    )
                  }
                  return <p className="mb-3 text-gray-800 dark:text-gray-100 leading-relaxed text-sm md:text-[15px]">{children}</p>
                },
                ul: ({children}) => (
                  <ul className="mb-5 space-y-2.5 list-none">
                    {children}
                  </ul>
                ),
                li: ({children}) => {
                  const text = typeof children === 'string' ? children : ''
                  return (
                    <li className="text-gray-800 dark:text-gray-100 mb-2.5 pl-0 text-sm md:text-[15px]">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-600/70 dark:bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                        {typeof children === 'string' ? (
                          <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: emphasizeFirstClause(text) }} />
                        ) : (
                          <div className="leading-relaxed">{children}</div>
                        )}
                      </div>
                    </li>
                  )
                },
                a: ({ children, href }) => (
                  <a href={href} className="text-blue-700 dark:text-blue-300 underline-offset-2 hover:underline">
                    {children}
                  </a>
                ),
                strong: ({children}) => {
                  const text = typeof children === 'string' ? children : ''
                  const isKeyTerm = text.includes('ADHD') || text.includes('Executive') || text.includes('Working Memory') || text.includes('Attention')
                  
                  return (
                    <strong className={`font-semibold ${isKeyTerm ? 'text-blue-800 dark:text-blue-200 bg-blue-100/70 dark:bg-blue-900/40 px-1 py-0.5 rounded' : 'text-gray-900 dark:text-gray-50'}`}>
                      {children}
                    </strong>
                  )
                },
                em: ({children}) => (
                  <em className="italic text-gray-800 dark:text-gray-200">
                    {children}
                  </em>
                ),
                blockquote: ({children}) => {
                  // Recursively extract text content from React children
                  const extractText = (node: unknown): string => {
                    if (typeof node === 'string') return node
                    if (Array.isArray(node)) return node.map(extractText).join('')
                    if (node && typeof node === 'object' && 'props' in node && 
                        node.props && typeof node.props === 'object' && 'children' in node.props) {
                      return extractText(node.props.children)
                    }
                    return ''
                  }
                  
                  const textContent = extractText(children)
                  
                  // Callout configurations matching Obsidian style
                  const calloutTypes = {
                    note: { 
                      icon: FileText, 
                      color: 'blue',
                      bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
                      border: 'border-blue-400',
                      iconColor: 'text-blue-500'
                    },
                    info: { 
                      icon: Info, 
                      color: 'cyan',
                      bg: 'from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20',
                      border: 'border-cyan-400',
                      iconColor: 'text-cyan-500'
                    },
                    tip: { 
                      icon: Lightbulb, 
                      color: 'green',
                      bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
                      border: 'border-green-400',
                      iconColor: 'text-green-500'
                    },
                    warning: { 
                      icon: AlertTriangle, 
                      color: 'orange',
                      bg: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
                      border: 'border-orange-400',
                      iconColor: 'text-orange-500'
                    },
                    danger: { 
                      icon: Zap, 
                      color: 'red',
                      bg: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
                      border: 'border-red-400',
                      iconColor: 'text-red-500'
                    },
                    example: { 
                      icon: Code, 
                      color: 'purple',
                      bg: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
                      border: 'border-purple-400',
                      iconColor: 'text-purple-500'
                    }
                  }
                  
                  // Default to quote style
                  const defaultCallout = {
                    icon: Quote,
                    color: 'gray',
                    bg: 'from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-700/40',
                    border: 'border-gray-400 dark:border-gray-700',
                    iconColor: 'text-gray-500 dark:text-gray-300'
                  }
                  
                  // Check for our special callout marker
                  const calloutMatch = textContent.match(/__CALLOUT_(NOTE|INFO|TIP|WARNING|DANGER|EXAMPLE)__/i)
                  let calloutType = defaultCallout
                  let calloutTitle = 'Quote'
                  
                  if (calloutMatch) {
                    const type = calloutMatch[1].toLowerCase()
                    calloutType = calloutTypes[type] || defaultCallout
                    calloutTitle = type.charAt(0).toUpperCase() + type.slice(1)
                  }
                  
                  const IconComponent = calloutType.icon
                  
                  return (
                    <div className="mb-6">
                      <div className={`bg-gradient-to-r ${calloutType.bg} border-l-4 ${calloutType.border} rounded-r-lg overflow-hidden shadow-sm`}>
                        <div className={`flex items-center gap-3 px-4 py-3 bg-white/60 dark:bg-gray-900/70`}>
                          <IconComponent className={`h-5 w-5 ${calloutType.iconColor} flex-shrink-0`} />
                          <span className="font-semibold text-gray-800 dark:text-gray-100">
                            {calloutTitle}
                          </span>
                        </div>
                        <div className="px-4 py-4">
                          <div className="text-gray-700 dark:text-gray-100 leading-relaxed [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                            {calloutMatch ? 
                              textContent.replace(/__CALLOUT_(NOTE|INFO|TIP|WARNING|DANGER|EXAMPLE)__\s*/i, '').trim()
                              : children
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                },
                code: ({children}) => (
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm text-gray-800 dark:text-gray-200">
                    {children}
                  </code>
                ),
                hr: () => (
                  <div className="my-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                  </div>
                )
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="text-center mt-6">
          <Button 
            onClick={goBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guides
          </Button>
        </div>
      </div>
    </div>
  )
}