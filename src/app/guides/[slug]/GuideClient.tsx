'use client'

import React, { useState, useMemo } from 'react'
import { ArrowLeft, FileText, Info, Lightbulb, AlertTriangle, Zap, Code, Quote, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Guide } from '@/lib/markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface GuideClientProps {
  guide: Guide
}

export default function GuideClient({ guide }: GuideClientProps) {

  const goBack = () => {
    window.history.back()
  }

  // Process the markdown content to handle callouts before ReactMarkdown
  const processCallouts = (content: string) => {
    return content.replace(/^>\s*\[!(note|info|tip|warning|danger|example)\]\s*/gim, (_match, type) => {
      return `> __CALLOUT_${type.toUpperCase()}__ `
    })
  }

  // Parse markdown into sections based on H2 headers
  const guideSections = useMemo(() => {
    const rawContent = guide.content
    // Split by H2 headers (## Title)
    // The regex captures the title so it's included in the split array
    const parts = rawContent.split(/^##\s+(.+)$/gm)
    
    const sections: { title: string | null; content: string; isOpen: boolean }[] = []
    
    // First part is the intro (content before the first H2)
    if (parts[0].trim()) {
      sections.push({ 
        title: null, 
        content: parts[0],
        isOpen: true 
      })
    }
    
    // Subsequent parts are pairs of (Title, Content)
    for (let i = 1; i < parts.length; i += 2) {
      const title = parts[i].trim()
      const content = parts[i + 1]
      // Default Quick Summary to open
      const isSummary = /quick summary/i.test(title)
      sections.push({ 
        title, 
        content,
        isOpen: isSummary 
      })
    }
    
    return sections
  }, [guide.content])

  // State for expanded sections
  // Initialize with the IDs (indices) of sections that should be open
  const [expandedSections, setExpandedSections] = useState<Set<number>>(() => {
    const initial = new Set<number>()
    guideSections.forEach((sec, idx) => {
      if (sec.isOpen || sec.title === null) initial.add(idx)
    })
    return initial
  })

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }
  
  const expandAll = () => {
    const all = new Set<number>()
    guideSections.forEach((_, idx) => all.add(idx))
    setExpandedSections(all)
  }

  const collapseAll = () => {
    const none = new Set<number>()
    // Always keep intro open if it has no title
    guideSections.forEach((sec, idx) => {
      if (sec.title === null) none.add(idx)
    })
    setExpandedSections(none)
  }

  const emphasizeFirstClause = (text: string): string => {
    const trimmed = text.trim()
    const match = /^(.{8,120}?)(\s[—\-:]\s|:|—)\s*(.*)$/.exec(trimmed)
    if (match) {
      return `<strong>${match[1]}</strong> ${match[2].trim()} ${match[3]}`
    }
    const sentence = /^(.*?[\.\!\?])(\s|$)/.exec(trimmed)
    if (sentence && sentence[1].length >= 24 && sentence[1].length <= 140) {
      return `<strong>${sentence[1]}</strong>${trimmed.slice(sentence[1].length)}`
    }
    return trimmed
  }

  // Special renderer for the Quick Summary content
  const renderQuickSummary = (content: string) => {
    const bullets: string[] = []
    const lines = content.split(/\r?\n/)
    for (const line of lines) {
      const m = /^-\s+(.+)$/.exec(line)
      if (m) bullets.push(m[1])
    }
    
    if (bullets.length === 0) return <div className="text-gray-600 dark:text-gray-300 italic">No summary points found.</div>

    const palette = [
      { bg: 'from-[#E0F7FA] to-[#E8F5E9] dark:from-teal-900/30 dark:to-emerald-900/30', border: 'border-teal-200 dark:border-teal-800/60', dot: 'bg-teal-600 dark:bg-teal-400' },
      { bg: 'from-[#FFF3E0] to-[#FCE4EC] dark:from-amber-900/30 dark:to-rose-900/30', border: 'border-amber-200 dark:border-amber-800/60', dot: 'bg-amber-600 dark:bg-amber-400' },
      { bg: 'from-[#EDE7F6] to-[#E3F2FD] dark:from-indigo-900/30 dark:to-blue-900/30', border: 'border-indigo-200 dark:border-indigo-800/60', dot: 'bg-indigo-600 dark:bg-indigo-400' },
      { bg: 'from-[#F1F8E9] to-[#E8EAF6] dark:from-lime-900/30 dark:to-indigo-900/30', border: 'border-lime-200 dark:border-lime-800/60', dot: 'bg-lime-600 dark:bg-lime-400' }
    ]

    return (
      <div className="grid gap-4 mt-4">
        {bullets.map((b, i) => {
          const c = palette[i % palette.length]
          return (
            <div key={i} className={`rounded-2xl p-5 bg-gradient-to-br ${c.bg} border ${c.border}`}>
              <div className="flex items-start gap-4">
                <div className={`w-2.5 h-2.5 ${c.dot} rounded-full mt-2 flex-shrink-0`} />
                <div className="text-base leading-relaxed text-gray-800 dark:text-gray-100 font-medium" dangerouslySetInnerHTML={{ __html: emphasizeFirstClause(b) }} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#CAE5FF] dark:from-[#0a0f1a] dark:via-[#0c1423] dark:to-[#0f182a] relative">

      <div className="max-w-3xl mx-auto px-6 py-8 pt-24">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-8">
            <Button
              variant="ghost"
              onClick={goBack}
              className="p-3 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-6 w-6 text-black dark:text-white" />
            </Button>
            <div className="flex-1">
              <div className="text-center">
                <div className="text-6xl mb-4 drop-shadow-sm">{guide.emoji}</div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                  {guide.title}
                </h1>
                <p className="text-gray-700 dark:text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  {guide.description}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {guide.tags.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {guide.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white/70 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-full text-sm md:text-base border border-white/40 dark:border-gray-700 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Expand/Collapse Controls */}
          {guideSections.length > 1 && (
            <div className="flex justify-center gap-4 mb-8">
              <Button variant="ghost" size="sm" onClick={expandAll} className="text-blue-800 dark:text-blue-200 hover:bg-white/40">
                Expand All
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll} className="text-blue-800 dark:text-blue-200 hover:bg-white/40">
                Collapse All
              </Button>
            </div>
          )}
        </div>

        {/* Guide Content Rendered as Accordions */}
        <div className="space-y-6">
          {guideSections.map((section, index) => {
            const isSummary = section.title && /quick summary/i.test(section.title)
            const isOpen = expandedSections.has(index)
            const processed = processCallouts(section.content)

            // Intro content (no title) renders as a simple card
            if (section.title === null) {
              return (
                <div key={index} className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/20 dark:border-gray-800">
                  <div className="prose max-w-none">
                     <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                     >
                       {processed}
                     </ReactMarkdown>
                  </div>
                </div>
              )
            }

            return (
              <div 
                key={index} 
                className={`
                  bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-sm border border-white/20 dark:border-gray-800 overflow-hidden
                  transition-all duration-300 ease-in-out
                  ${isOpen ? 'ring-2 ring-blue-500/10 dark:ring-blue-400/20' : ''}
                `}
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full text-left px-8 py-6 flex items-center justify-between group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors m-0">
                    {section.title}
                  </h2>
                  <div className={`
                    p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400
                    group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-400
                    transition-all duration-300
                  `}>
                    <ChevronDown className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-8 pb-10 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="h-px bg-gray-100 dark:bg-gray-800 mb-8" />
                    
                    {isSummary ? (
                       renderQuickSummary(section.content)
                    ) : (
                      <div className="prose max-w-none leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                        >
                          {processed}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Extracted components to keep the main component cleaner
const markdownComponents: any = {
  h1: ({ children }: any) => (
    <div className="hidden">{children}</div> // Hide H1s inside sections as we use section titles
  ),
  h2: ({ children }: any) => (
    <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white first:mt-0">
      {children}
    </h3>
  ),
  h3: ({ children }: any) => (
    <h4 className="text-lg font-bold mt-6 mb-3 text-gray-800 dark:text-gray-100">
      {children}
    </h4>
  ),
  p: ({children}: any) => {
    // Check for checklist items that got parsed as paragraphs or bold starts
    if (typeof children === 'string' && (children.startsWith('✅') || children.startsWith('❌'))) {
       return (
          <div className={`mb-6 p-5 rounded-2xl border-l-4 ${children.startsWith('❌') ? 'bg-red-50 dark:bg-red-900/20 border-red-400' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400'}`}>
            <p className="text-gray-800 dark:text-gray-100 leading-relaxed font-medium text-lg m-0">
              {children}
            </p>
          </div>
       )
    }
    return <p className="mb-6 text-gray-800 dark:text-gray-100 leading-relaxed text-lg">{children}</p>
  },
  ul: ({children}: any) => (
    <ul className="mb-8 space-y-3 list-none">
      {children}
    </ul>
  ),
  li: ({children}: any) => {
    const hasNodeAndChildren = (value: unknown): value is { node?: { tagName?: string }; children?: unknown } => {
      return typeof value === 'object' && value !== null
    }

    // Handling for simple list items that might be checklists
    const content = React.isValidElement(children) && hasNodeAndChildren(children.props) && children.props.node?.tagName === 'p'
        ? children.props.children
        : children;
        
    return (
      <li className="text-gray-800 dark:text-gray-100 mb-3 pl-0 text-lg">
        <div className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-2.5 flex-shrink-0" />
          <div className="leading-relaxed">{content}</div>
        </div>
      </li>
    )
  },
  a: ({ children, href }: any) => (
    <a href={href} className="text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline font-medium">
      {children}
    </a>
  ),
  blockquote: ({children}: any) => {
    // Logic to render callouts
      const hasChildrenProp = (value: unknown): value is { children?: unknown } => {
        return typeof value === 'object' && value !== null && 'children' in value
      }

      const extractText = (node: unknown): string => {
        if (typeof node === 'string') return node
        if (typeof node === 'number') return String(node)
        if (Array.isArray(node)) return node.map(extractText).join('')
        if (React.isValidElement(node) && hasChildrenProp(node.props)) {
          return extractText(node.props.children)
        }
        return ''
      }
      
      const textContent = extractText(children)
      const calloutMatch = textContent.match(/__CALLOUT_(NOTE|INFO|TIP|WARNING|DANGER|EXAMPLE)__/i)
      
      let type = 'quote'
      if (calloutMatch) type = calloutMatch[1].toLowerCase()
      
      const configs: any = {
        note: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-500' },
        info: { icon: Info, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-500' },
        tip: { icon: Lightbulb, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-500' },
        warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-500' },
        danger: { icon: Zap, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-500' },
        example: { icon: Code, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-500' },
        quote: { icon: Quote, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800', border: 'border-gray-400' }
      }
      
      const config = configs[type] || configs.quote
      const Icon = config.icon
      const cleanContent = calloutMatch ? textContent.replace(/__CALLOUT_[A-Z]+__\s*/i, '') : children

      return (
        <div className={`my-8 rounded-2xl border-l-4 ${config.border} ${config.bg} p-6 shadow-sm`}>
          <div className="flex items-center gap-3 mb-3">
             <Icon className={`h-5 w-5 ${config.color}`} />
             <span className={`font-bold uppercase text-xs tracking-wider ${config.color}`}>{type}</span>
          </div>
          <div className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed italic">
            {cleanContent}
          </div>
        </div>
      )
  },
  // Custom renderer for checklists if they are rendered as separate inputs
  input: (props: any) => {
      if (props.type === 'checkbox') {
          return (
             <div className="inline-flex items-center justify-center w-5 h-5 mr-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-600">
                {props.checked && <div className="w-3 h-3 bg-blue-600 rounded-sm" />}
             </div>
          ) 
      }
      return <input {...props} />
  }
}
