'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Heart, Wrench, AlertCircle, User, BookOpen, MessageSquareText, HelpCircle, RotateCcw, Mic, MicOff, Zap, Sparkles, Clock, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/Loader'
import { getStrategies } from '@/lib/strategies'
import { supabase } from '@/lib/supabase'
import type { Strategy } from '@/lib/supabase'

// Speech Recognition types
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

// ADHD-friendly search suggestions
const QUICK_SEARCHES = [
  { query: 'overwhelmed', label: 'Feeling Overwhelmed', icon: AlertCircle, color: 'text-red-600 bg-red-100' },
  { query: 'cant start', label: 'Can\'t Start Tasks', icon: Clock, color: 'text-orange-600 bg-orange-100' },
  { query: 'anxious', label: 'Anxiety & Worry', icon: Heart, color: 'text-pink-600 bg-pink-100' },
  { query: 'focus', label: 'Need to Focus', icon: Target, color: 'text-blue-600 bg-blue-100' },
  { query: 'tired', label: 'Feeling Drained', icon: Zap, color: 'text-purple-600 bg-purple-100' },
  { query: 'procrastination', label: 'Procrastinating', icon: Clock, color: 'text-green-600 bg-green-100' }
]

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  type: 'feeling' | 'task' | 'barrier' | 'identity' | 'complex_loop' | 'guide' | 'script' | 'quiz' | 'resource'
  url: string
  icon?: React.ElementType
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [searchMode, setSearchMode] = useState<'normal' | 'crisis'>('normal')
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  // Static content for non-strategy items
  const staticContent: SearchResult[] = [
    // Guides
    { id: 'cognitive-overload', title: 'Cognitive & Overload Guide', description: 'Navigate mental fog and overwhelm', category: 'Educational', type: 'guide', url: '/guides/mentalfog', icon: BookOpen },
    { id: 'dysregulation', title: 'Dysregulation & Shutdown Guide', description: 'Emotional regulation and nervous system support', category: 'Educational', type: 'guide', url: '/guides/dysregulation', icon: BookOpen },

    // Scripts
    { id: 'adhd-evaluation', title: 'Ask for ADHD Evaluation', description: 'Script for requesting professional assessment', category: 'Healthcare', type: 'script', url: '/scripts', icon: MessageSquareText },
    { id: 'workplace-accommodations', title: 'Workplace Accommodations', description: 'How to request ADHD accommodations at work', category: 'Work', type: 'script', url: '/scripts', icon: MessageSquareText },
    { id: 'partner-support', title: 'Tell Partner What You Need', description: 'Communicating ADHD needs to your partner', category: 'Relationships', type: 'script', url: '/scripts', icon: MessageSquareText },

    // Quizzes
    { id: 'structure-quiz', title: 'ADHD Structure Quiz', description: 'Discover your relationship with structure', category: 'Self-Assessment', type: 'quiz', url: '/quizzes', icon: HelpCircle },
  ]

  // Convert strategy to search result
  const strategyToSearchResult = (strategy: Strategy): SearchResult => ({
    id: strategy.id,
    title: strategy.name,
    description: strategy.subtitle || strategy.description || '',
    category: 'Strategies',
    type: 'feeling', // Default to feeling for strategies
    url: `/`,
    icon: Heart
  })

  // Search function with comprehensive database integration
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    
    try {
      const searchTerm = searchQuery.toLowerCase()
      const allResults: SearchResult[] = []
      
      // Search strategies using the existing function
      try {
        const strategies = await getStrategies({ search: searchQuery })
        const strategyResults = strategies.slice(0, 4).map(strategyToSearchResult)
        allResults.push(...strategyResults)
      } catch (error) {
        console.warn('Strategy search failed:', error)
      }

      // Search barriers content
      try {
        const { data: barriers } = await supabase
          .from('barriers_content')
          .select('*')
          .or(`barrier_name.ilike.%${searchTerm}%,gentle_advice.ilike.%${searchTerm}%,stern_advice.ilike.%${searchTerm}%`)
          .limit(3)
        
        if (barriers) {
          barriers.forEach(barrier => {
            allResults.push({
              id: barrier.id,
              title: barrier.barrier_name,
              description: barrier.gentle_advice || 'Strategies for overcoming this barrier',
              category: 'Barriers',
              type: 'barrier',
              url: `/barriers/${encodeURIComponent(barrier.barrier_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}`,
              icon: AlertCircle
            })
          })
        }
      } catch (error) {
        console.warn('Barriers search failed:', error)
      }

      // Search feelings content
      try {
        const { data: feelings } = await supabase
          .from('feelings_content')
          .select('*')
          .or(`feeling_name.ilike.%${searchTerm}%,quick_summary.ilike.%${searchTerm}%,soft_start.ilike.%${searchTerm}%`)
          .limit(3)
        
        if (feelings) {
          feelings.forEach(feeling => {
            allResults.push({
              id: feeling.id,
              title: feeling.feeling_name,
              description: feeling.quick_summary || 'Support for this feeling',
              category: 'Feelings',
              type: 'feeling',
              url: `/feelings/${encodeURIComponent(feeling.feeling_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}`,
              icon: Heart
            })
          })
        }
      } catch (error) {
        console.warn('Feelings search failed:', error)
      }

      // Search tasks/life areas content
      try {
        const { data: tasks } = await supabase
          .from('tasks_content')
          .select('*')
          .or(`task_name.ilike.%${searchTerm}%,intro_paragraph.ilike.%${searchTerm}%,encouragement.ilike.%${searchTerm}%`)
          .limit(3)
        
        if (tasks) {
          tasks.forEach(task => {
            const taskSlug = task.task_name.toLowerCase()
              .replace(/[&]/g, '-and-')
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .replace(/--+/g, '-')
              .replace(/^-|-$/g, '')
            
            allResults.push({
              id: task.id,
              title: task.task_name,
              description: task.intro_paragraph?.substring(0, 150) + '...' || 'ADHD-friendly guidance for this task',
              category: 'Life Areas',
              type: 'task',
              url: `/life_areas/${taskSlug}`,
              icon: Wrench
            })
          })
        }
      } catch (error) {
        console.warn('Tasks search failed:', error)
      }

      // Search identities content
      try {
        const { data: identities } = await supabase
          .from('identities_content')
          .select('*')
          .or(`identity_name.ilike.%${searchTerm}%,intro_paragraph.ilike.%${searchTerm}%`)
          .limit(2)
        
        if (identities) {
          identities.forEach(identity => {
            const identitySlug = identity.identity_name.toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .replace(/--+/g, '-')
            
            allResults.push({
              id: identity.id,
              title: identity.identity_name,
              description: identity.intro_paragraph?.substring(0, 150) + '...' || 'ADHD identity guide',
              category: 'Identities',
              type: 'identity',
              url: `/identities/${identitySlug}`,
              icon: User
            })
          })
        }
      } catch (error) {
        console.warn('Identities search failed:', error)
      }

      // Search complex loops content
      try {
        const { data: loops } = await supabase
          .from('complex_loops_content')
          .select('*')
          .or(`loop_name.ilike.%${searchTerm}%,intro_paragraph.ilike.%${searchTerm}%`)
          .limit(2)
        
        if (loops) {
          loops.forEach(loop => {
            const loopSlug = loop.loop_name.toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .replace(/--+/g, '-')
            
            allResults.push({
              id: loop.id,
              title: loop.loop_name,
              description: loop.intro_paragraph?.substring(0, 150) + '...' || 'Breaking complex ADHD patterns',
              category: 'Complex Loops',
              type: 'complex_loop',
              url: `/complex_loops/${loopSlug}`,
              icon: RotateCcw
            })
          })
        }
      } catch (error) {
        console.warn('Complex loops search failed:', error)
      }
      
      // Search static content
      const staticResults = staticContent.filter(item => {
        const queryLower = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower) ||
          item.category.toLowerCase().includes(queryLower)
        )
      }).slice(0, 2)
      
      allResults.push(...staticResults)
      
      // Sort by relevance (title matches first, then description)
      const sortedResults = allResults.sort((a, b) => {
        const queryLower = searchQuery.toLowerCase()
        const aTitle = a.title.toLowerCase().includes(queryLower)
        const bTitle = b.title.toLowerCase().includes(queryLower)
        
        if (aTitle && !bTitle) return -1
        if (!aTitle && bTitle) return 1
        return 0
      })

      setResults(sortedResults.slice(0, 15)) // Increased limit
    } catch (error) {
      console.error('Search error:', error)
      // Fallback to static content only
      const staticResults = staticContent.filter(item => {
        const queryLower = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower) ||
          item.category.toLowerCase().includes(queryLower)
        )
      })
      setResults(staticResults.slice(0, 12))
    } finally {
      setIsSearching(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 400) // Slightly longer delay for database queries

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Voice search functionality
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startVoiceSearch = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopVoiceSearch = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      // Add voice search shortcut (Ctrl/Cmd + M)
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault()
        startVoiceSearch()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleResultClick = (url: string) => {
    window.location.href = url
    onClose()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feeling': return Heart
      case 'task': return Wrench
      case 'barrier': return AlertCircle
      case 'identity': return User
      case 'complex_loop': return RotateCcw
      case 'guide': return BookOpen
      case 'script': return MessageSquareText
      case 'quiz': return HelpCircle
      default: return Search
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feeling': return 'text-pink-600 bg-pink-100'
      case 'task': return 'text-blue-600 bg-blue-100'
      case 'barrier': return 'text-orange-600 bg-orange-100'
      case 'identity': return 'text-purple-600 bg-purple-100'
      case 'complex_loop': return 'text-cyan-600 bg-cyan-100'
      case 'guide': return 'text-green-600 bg-green-100'
      case 'script': return 'text-indigo-600 bg-indigo-100'
      case 'quiz': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {/* Mode Toggle */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Button
                variant={searchMode === 'normal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchMode('normal')}
                className="text-xs"
              >
                <Search className="h-3 w-3 mr-1" />
                Normal
              </Button>
              <Button
                variant={searchMode === 'crisis' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchMode('crisis')}
                className="text-xs text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Crisis Mode
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {/* Voice Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                className={`text-xs ${isListening ? 'text-red-600' : 'text-gray-400'}`}
                title="Voice search (Ctrl/Cmd + M)"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder={
                searchMode === 'crisis'
                  ? "Quick help needed! Search for urgent strategies..."
                  : "Search strategies by content, feelings, barriers, or keywords like 'breathing'..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 border-none outline-none text-lg ${
                searchMode === 'crisis' ? 'text-red-600 dark:text-red-400' : ''
              }`}
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="md" className="border-blue-500 border-t-transparent" />
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => {
                const Icon = result.icon || getTypeIcon(result.type)
                const colorClasses = getTypeColor(result.type)
                
                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.url)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-lg p-2 ${colorClasses}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {result.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {result.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize">
                            {result.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {result.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-12 px-4">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try searching for techniques like &quot;breathing&quot;, feelings like &quot;overwhelmed&quot;, or barriers like &quot;can't start&quot;
              </p>
            </div>
          ) : (
            <div className="p-4">
              {searchMode === 'crisis' ? (
                // Crisis Mode - Quick Actions
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">
                      Crisis Mode: Quick Help
                    </h3>
                    <p className="text-red-600 dark:text-red-300 text-sm">
                      Immediate strategies for when you need help right now
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {QUICK_SEARCHES.slice(0, 4).map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.query}
                          onClick={() => setQuery(item.query)}
                          className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`rounded-lg p-1.5 ${item.color}`}>
                              <Icon className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-medium text-red-700 dark:text-red-300">
                              {item.label}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                // Normal Mode - Quick Suggestions
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Quick Search Suggestions
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Click any suggestion or type your own search
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {QUICK_SEARCHES.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.query}
                          onClick={() => setQuery(item.query)}
                          className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left group"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`rounded-lg p-1.5 ${item.color}`}>
                              <Icon className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {item.label}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Or search by category:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-700">Feelings</span>
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">Tasks</span>
                      <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">Identities</span>
                      <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">Guides</span>
                      <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-700">Barriers</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span>Esc to close</span>
                {searchMode === 'normal' && <span>Ctrl/Cmd + M for voice</span>}
              </div>
              <span>{results.length > 0 ? `${results.length} results` : ''}</span>
            </div>
            {searchMode === 'crisis' && (
              <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                💡 Crisis Mode: Focus on immediate help. Try "breathing" or "grounding" for quick strategies.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal
