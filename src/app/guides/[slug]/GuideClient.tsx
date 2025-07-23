'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Tag, Target, CheckCircle, Circle, FileText, Info, Lightbulb, AlertTriangle, X, Zap, Bug, Code, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Guide } from '@/lib/markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface GuideClientProps {
  guide: Guide
}

export default function GuideClient({ guide }: GuideClientProps) {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [scrollProgress, setScrollProgress] = useState(0)

  const toggleSectionComplete = (sectionId: string) => {
    setCompletedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const scrollToSection = (sectionIndex: number) => {
    const headers = document.querySelectorAll('h2, h3')
    if (headers[sectionIndex]) {
      headers[sectionIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      })
      // Also mark as completed when clicked
      toggleSectionComplete(`section-${sectionIndex}`)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  return (
    <div className="min-h-screen bg-[#CAE5FF] dark:bg-[#2B4365] relative">
      {/* Floating Table of Contents */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 max-w-xs">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Navigation</h4>
          <div className="space-y-2 text-xs">
            {['What It Feels Like', 'Why It Happens', 'Soothe the Storm', 'Build Stronger Base', 'Reflect & Adjust'].map((section, index) => (
              <button
                key={section}
                onClick={() => scrollToSection(index)}
                className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {completedSections.has(`section-${index}`) ? (
                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="h-3 w-3 text-gray-400 flex-shrink-0" />
                )}
                <span className="text-gray-700 dark:text-gray-300">{section}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
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
                <div className="text-4xl mb-2">{guide.emoji}</div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-black dark:text-white mb-2">
                  {guide.title}
                </h1>
                <p className="text-black/70 dark:text-white/70 text-sm">
                  {guide.description}
                </p>
              </div>
            </div>
          </div>

          {/* Guide Metadata */}
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-8">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2 text-black dark:text-white">
                <Clock className="h-4 w-4" />
                {guide.readTime}
              </div>
              <div className="flex items-center gap-2 text-black dark:text-white">
                <Target className="h-4 w-4" />
                {guide.difficulty}
              </div>
              <div className="flex items-center gap-2 text-black dark:text-white">
                <Tag className="h-4 w-4" />
                {guide.category}
              </div>
            </div>
            {guide.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {guide.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white/20 text-black dark:text-white px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Progress Tracker */}
        <div className="sticky top-20 z-20 mb-6">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-black dark:text-white">Reading Progress</h3>
              <span className="text-xs text-black/70 dark:text-white/70">
                {Math.round(scrollProgress)}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-150"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Guide Content */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/10">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => (
                  <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({children}) => (
                  <div className="mt-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-500/15 to-purple-500/15 p-5 rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
                      {children}
                    </h2>
                  </div>
                ),
                h3: ({children}) => (
                  <div className="mt-6 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 bg-gradient-to-r from-green-500/10 to-teal-500/10 p-4 rounded-lg border-l-3 border-green-500 shadow-sm">
                      {children}
                    </h3>
                  </div>
                ),
                p: ({children}) => {
                  const text = typeof children === 'string' ? children : ''
                  const isActionItem = text.includes('✅') || text.includes('❌')
                  
                  if (isActionItem) {
                    return (
                      <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-l-4 border-yellow-400">
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                          {children}
                        </p>
                      </div>
                    )
                  }
                  
                  return (
                    <p className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">
                      {children}
                    </p>
                  )
                },
                ul: ({children}) => (
                  <ul className="mb-6 space-y-4 list-none">
                    {children}
                  </ul>
                ),
                li: ({children}) => (
                  <li className="text-gray-800 dark:text-gray-200 mb-4 pl-0">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-black dark:bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="leading-relaxed">{children}</div>
                    </div>
                  </li>
                ),
                strong: ({children}) => {
                  const text = typeof children === 'string' ? children : ''
                  const isKeyTerm = text.includes('ADHD') || text.includes('Executive') || text.includes('Working Memory') || text.includes('Attention')
                  
                  return (
                    <strong className={`font-semibold ${isKeyTerm ? 'text-blue-700 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-900/30 px-1 py-0.5 rounded' : 'text-gray-900 dark:text-white'}`}>
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
                  const extractText = (node: any): string => {
                    if (typeof node === 'string') return node
                    if (Array.isArray(node)) return node.map(extractText).join('')
                    if (node?.props?.children) return extractText(node.props.children)
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
                    bg: 'from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-600/20',
                    border: 'border-gray-400',
                    iconColor: 'text-gray-500'
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
                        <div className={`flex items-center gap-3 px-4 py-3 bg-white/40 dark:bg-gray-800/40`}>
                          <IconComponent className={`h-5 w-5 ${calloutType.iconColor} flex-shrink-0`} />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {calloutTitle}
                          </span>
                        </div>
                        <div className="px-4 py-4">
                          <div className="text-gray-700 dark:text-gray-300 leading-relaxed [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
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
        <div className="text-center mt-8">
          <Button 
            onClick={goBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guides
          </Button>
        </div>
      </div>
    </div>
  )
}