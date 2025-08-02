'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Heart, Wrench, AlertCircle, User, BookOpen, MessageSquareText, HelpCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getStrategies } from '@/lib/strategies'
import type { Strategy } from '@/lib/supabase'

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
  const inputRef = useRef<HTMLInputElement>(null)

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

  // Search function with real database integration
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    
    try {
      // Search strategies using the database
      const strategies = await getStrategies({ search: searchQuery })
      
      // Convert strategies to search results
      const strategyResults = strategies.slice(0, 8).map(strategyToSearchResult)
      
      // Search static content
      const staticResults = staticContent.filter(item => {
        const queryLower = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower) ||
          item.category.toLowerCase().includes(queryLower)
        )
      }).slice(0, 4)
      
      // Combine and sort results (strategies first, then static content)
      const allResults = [...strategyResults, ...staticResults]
      
      // Sort by relevance (title matches first, then description)
      const sortedResults = allResults.sort((a, b) => {
        const queryLower = searchQuery.toLowerCase()
        const aTitle = a.title.toLowerCase().includes(queryLower)
        const bTitle = b.title.toLowerCase().includes(queryLower)
        
        if (aTitle && !bTitle) return -1
        if (!aTitle && bTitle) return 1
        return 0
      })

      setResults(sortedResults.slice(0, 12)) // Limit to 12 results
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
  }, [query])

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
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search strategies by content, feelings, barriers, or keywords like 'breathing'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 border-none outline-none text-lg"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
                      <div className={`rounded-lg p-2 ${colorClasses} group-hover:scale-110 transition-transform`}>
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
            <div className="text-center py-12 px-4">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Search the ADHD First Aid Kit
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Find strategies, guides, scripts, and support for any ADHD challenge
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-700">Feelings</span>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">Tasks</span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">Identities</span>
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">Guides</span>
                <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-700">Barriers</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Press esc to close</span>
            <span>{results.length > 0 ? `${results.length} results` : ''}</span>
          </div>
        </div>
      </div>
    </div>
  )
}