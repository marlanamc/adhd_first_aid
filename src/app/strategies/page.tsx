'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight, Heart, Star, X, ExternalLink, Filter } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { HomePage } from '@/components/pages'
import { getStrategies } from '@/lib/strategies'
import { supabase } from '@/lib/supabase'
import type { Strategy, Feeling } from '@/lib/supabase'
import type { SortOption, ViewMode } from '@/types'

// Helper function to get tag colors
const getTagColor = (index: number) => {
  const colors = [
    'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700',
    'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700',
    'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700',
    'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700',
    'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700',
    'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700',
    'bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700',
    'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700'
  ]
  return colors[index % colors.length]
}

function StrategiesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Extract parameters from URL
  const feeling = searchParams.get('feeling')
  const issue = searchParams.get('issue')
  const task = searchParams.get('task')
  const barrier = searchParams.get('barrier')
  const searchQuery = searchParams.get('search')
  
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [showStrategyModal, setShowStrategyModal] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [priceFilter, setPriceFilter] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [availablePrices, setAvailablePrices] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('feeling')
  const [feelings, setFeelings] = useState<Feeling[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Determine if this is a task flow or feeling flow
  const isTaskFlow = !!task
  const isSearchFlow = !!searchQuery
  const isSelectionFlow = !feeling && !issue && !task && !barrier && !searchQuery

  interface Task {
    id: string
    name: string
    emoji: string | null
    color: string | null
    category: string | null
    description: string | null
  }

  // Fetch feelings and tasks for selection flow
  useEffect(() => {
    async function fetchFeelingsAndTasks() {
      if (!isSelectionFlow) return

      try {
        // Fetch feelings
        const { data: feelingsData, error: feelingsError } = await supabase
          .from('feelings')
          .select('id, name, emoji, color, category, description')
          .order('name')

        if (feelingsError) {
          console.error('Error fetching feelings:', feelingsError)
        } else {
          setFeelings(feelingsData || [])
        }

        // Fetch help tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('help_tasks')
          .select('id, name, emoji, color, category, description')

        if (tasksError) {
          console.error('Error fetching help tasks:', tasksError)
        } else {
          const validTasks = (tasksData || []).filter(task => task.name) as Task[]
          setTasks(validTasks)
        }
      } catch (err) {
        console.error('Exception while fetching data:', err)
      }
    }

    fetchFeelingsAndTasks()
  }, [isSelectionFlow])

  // Fetch strategies based on URL parameters
  useEffect(() => {
    async function fetchStrategies() {
      if (isSelectionFlow) return // Don't fetch strategies for selection flow

      try {
        setLoading(true)
        setError(null)

        const filters: { feelings?: string[], issues?: string[], barrier_type?: string, search?: string } = {}
        
        if (feeling) filters.feelings = [feeling]
        if (issue) filters.issues = [issue]
        if (barrier) filters.barrier_type = barrier
        if (searchQuery) filters.search = searchQuery

        const data = await getStrategies(filters)
        setStrategies(data)
      } catch (err) {
        console.error('Error fetching strategies:', err)
        setError('Failed to load strategies. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchStrategies()
  }, [feeling, issue, task, barrier, searchQuery, isSelectionFlow])

  // Get unique tags and prices from strategies
  useEffect(() => {
    if (strategies.length > 0) {
      const tags = Array.from(new Set(
        strategies.flatMap(strategy => 
          (strategy.strategy_tags || [])
            .map(tagObj => tagObj.tag.name)
            .filter((name): name is string => !!name)
        )
      )).sort()
      setAvailableTags(tags)

      const prices = Array.from(new Set(
        strategies
          .map(strategy => strategy.price)
          .filter((price): price is string => !!price)
      )).sort((a, b) => {
        if (a === 'Free') return -1
        if (b === 'Free') return 1
        return a.length - b.length
      })
      setAvailablePrices(prices)
    }
  }, [strategies])

  // Sort strategies
  const sortStrategies = (strategies: Strategy[]) => {
    switch (sortBy) {
      case 'popular':
        return [...strategies].sort((a, b) => ((b.vote_count ?? 0) - (a.vote_count ?? 0)))
      case 'newest':
        return [...strategies].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA
        })
      case 'alphabetical':
        return [...strategies].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return strategies
    }
  }

  // Filter strategies
  const filterStrategies = (strategies: Strategy[]) => {
    return strategies.filter(strategy => {
      const matchesPrice = priceFilter.length === 0 || (strategy.price && priceFilter.includes(strategy.price))
      const matchesTags = tagFilter.length === 0 || 
        (strategy.strategy_tags || []).some(tagObj => tagObj.tag.name && tagFilter.includes(tagObj.tag.name))
      return matchesPrice && matchesTags
    })
  }

  const goBack = () => {
    if (isTaskFlow) {
      router.push(`/task/${encodeURIComponent(task)}`)
    } else if (feeling && issue) {
      router.push(`/feeling/${encodeURIComponent(feeling)}/issue/${encodeURIComponent(issue)}`)
    } else {
      router.push('/')
    }
  }

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToPage = (page: string) => {
    router.push(`/${page}`)
  }

  const handleStrategyClick = (strategy: Strategy) => {
    setSelectedStrategy(strategy)
    setShowStrategyModal(true)
  }

  const handleFeelingSelect = (feeling: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/feeling/${encodeURIComponent(feeling)}`)
    }, 300)
  }

  const handleTaskSelect = (task: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/task/${encodeURIComponent(task)}`)
    }, 300)
  }

  // Show original toggle interface if no parameters are provided
  if (isSelectionFlow) {
    return (
      <div className="min-h-screen ocean-gradient relative flex flex-col">
        <Header 
          navigateHome={navigateHome} 
          navigateToPage={navigateToPage} 
          onSearchOpen={() => {}} 
        />

        <main className="flex-1 flex flex-col">
          <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-32 md:pt-36 pb-24">
            
            {/* Back Button */}
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 max-w-xs">
              <button
                onClick={navigateHome}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light inline-flex items-center cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
            </div>

            {/* Use the original HomePage component */}
            <HomePage
              viewMode={viewMode}
              setViewMode={(mode: 'feeling' | 'task' | 'scripts' | 'systems') => setViewMode(mode as ViewMode)}
              feelings={feelings}
              tasks={tasks}
              handleFeelingSelect={handleFeelingSelect}
              handleTaskSelect={handleTaskSelect}
              isTransitioning={isTransitioning}
            />
          </div>
        </main>

        <Footer navigateToPage={navigateToPage} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen ocean-gradient relative flex flex-col">
        <Header 
          navigateHome={navigateHome} 
          navigateToPage={navigateToPage} 
          onSearchOpen={() => {}} 
        />
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading strategies...</p>
        </main>
        <Footer navigateToPage={navigateToPage} />
      </div>
    )
  }

  return (
    <div className="min-h-screen ocean-gradient relative flex flex-col">
      <Header 
        navigateHome={navigateHome} 
        navigateToPage={navigateToPage} 
        onSearchOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-12 md:pt-16 pb-24">
          {/* Navigation - only show if not a search flow */}
          {!isSearchFlow && (
            <div className="mb-12 mt-10">
              <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                <button
                  onClick={goBack}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light inline-flex items-center cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {isTaskFlow ? (
                    <>
                      <span className="font-light">Task</span>
                      <ChevronRight className="h-4 w-4" />
                      <span className="font-light">Barrier</span>
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-primary font-strong">Strategies</span>
                    </>
                  ) : (
                    <>
                      <span className="font-light">Feeling</span>
                      <ChevronRight className="h-4 w-4" />
                      <span className="font-light">Issue</span>
                      <ChevronRight className="h-4 w-4" />
                      <span className="font-light">Barrier</span>
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-primary font-strong">Strategies</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="animate-in px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground mb-4">
                {isSearchFlow ? 'Search Results' : 'Strategies for you'}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                {isSearchFlow ? (
                  <>Results for &quot;{searchQuery}&quot;</>
                ) : (
                  <>
                    Here are strategies that might help when you&apos;re
                    {isTaskFlow ? (
                      <> struggling with <span className="text-primary font-medium">{task}</span></>
                    ) : (
                      <>
                        {feeling && (
                          <> feeling <span className="text-primary font-medium">{feeling}</span></>
                        )}
                        {issue && (
                          <> and facing <span className="text-primary font-medium">{issue}</span></>
                        )}
                      </>
                    )}
                    {barrier && (
                      <> and working through <span className="text-primary font-medium">{barrier}</span></>
                    )}
                    .
                  </>
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Some strategies might work for multiple situations, so we&apos;ve included those too!
              </p>

              {/* Sort and Filter Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-light text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="popular">Most Helpful</option>
                    <option value="newest">Newest</option>
                    <option value="alphabetical">A-Z</option>
                  </select>
                </div>

                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {(priceFilter.length > 0 || tagFilter.length > 0) && (
                    <span className="ml-2 bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs">
                      {priceFilter.length + tagFilter.length}
                    </span>
                  )}
                </Button>
              </div>

              {/* Compact Filter Panel */}
              {showFilters && (
                <div className="mt-4 p-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-md max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      Filters
                    </h3>
                    <button
                      onClick={() => {
                        setPriceFilter([])
                        setTagFilter([])
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Price Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Price</h4>
                      <div className="space-y-1">
                        {availablePrices.map((price) => (
                          <label key={price} className="flex items-center space-x-2 cursor-pointer group py-1 px-2 rounded hover:bg-white/40 transition-all duration-200">
                            <input
                              type="checkbox"
                              checked={priceFilter.includes(price)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPriceFilter([...priceFilter, price])
                                } else {
                                  setPriceFilter(priceFilter.filter(p => p !== price))
                                }
                              }}
                              className="rounded border-gray-300 h-3 w-3 text-primary focus:ring-primary focus:ring-1"
                            />
                            <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                              {price === 'Free' ? '🆓 Free' : `💰 ${price}`}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Tags Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Categories</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {availableTags.map((tag) => (
                          <label key={tag} className="flex items-center space-x-2 cursor-pointer group py-1 px-2 rounded hover:bg-white/40 transition-all duration-200">
                            <input
                              type="checkbox"
                              checked={tagFilter.includes(tag)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setTagFilter([...tagFilter, tag])
                                } else {
                                  setTagFilter(tagFilter.filter(t => t !== tag))
                                }
                              }}
                              className="rounded border-gray-300 h-3 w-3 text-primary focus:ring-primary focus:ring-1"
                            />
                            <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                              🏷️ {tag}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Strategies Grid */}
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button variant="outline" size="default" className="" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                  {sortStrategies(filterStrategies(strategies)).map((strategy, index) => {
                    const assignedFeelings = Array.isArray(strategy.strategy_feelings)
                      ? strategy.strategy_feelings.map((sf) => sf.feeling?.name).filter(Boolean)
                      : [];

                    return (
                      <div
                        key={strategy.id}
                        className="strategy-card clickable-card rounded-xl md:rounded-2xl p-4 sm:p-6 mobile-transition bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl cursor-pointer flex flex-col h-full"
                        onClick={() => handleStrategyClick(strategy)}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          transform: loading ? 'translateY(20px)' : 'translateY(0)',
                          opacity: loading ? 0 : 1
                        }}
                      >
                        {/* Header with feelings and save button */}
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {assignedFeelings.slice(0, 2).map((feeling) => (
                              <span
                                key={feeling}
                                className="text-xs sm:text-sm text-primary font-medium bg-primary/10 px-2 sm:px-3 py-1 rounded-full"
                              >
                                {feeling}
                              </span>
                            ))}
                            {assignedFeelings.length > 2 && (
                              <span className="text-xs sm:text-sm text-muted-foreground bg-muted/30 px-2 sm:px-3 py-1 rounded-full">
                                +{assignedFeelings.length - 2} more
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            <FavoriteButton
                              strategy={{
                                id: strategy.id,
                                name: strategy.name,
                                description: strategy.description || '',
                                category: assignedFeelings.join(', ') || 'General',
                                tags: strategy.tags || [],
                                price: strategy.price || 'Free'
                              }}
                              size="sm"
                            />
                          </div>
                        </div>

                        {/* Strategy title and description */}
                        <h3 className="strategy-title">
                          {strategy.name}
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 flex-grow line-clamp-3">
                          {strategy.description || 'No description available.'}
                        </p>

                        {/* Tags and metadata */}
                        <div className="space-y-3 sm:space-y-4">
                          {/* Strategy tags */}
                          {strategy.strategy_tags && strategy.strategy_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {strategy.strategy_tags.slice(0, 3).map((tagObj, index) => (
                                <span
                                  key={tagObj.tag.name}
                                  className={`text-xs sm:text-sm ${getTagColor(index)} px-2 sm:px-3 py-1 rounded-full font-medium`}
                                >
                                  {tagObj.tag.name}
                                </span>
                              ))}
                              {strategy.strategy_tags.length > 3 && (
                                <span className="text-xs sm:text-sm text-muted-foreground bg-muted/30 px-2 sm:px-3 py-1 rounded-full">
                                  +{strategy.strategy_tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Bottom row with price, featured, and votes */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs sm:text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 sm:px-3 py-1 rounded-full font-medium">
                                {strategy.price || 'Free'}
                              </span>
                              {strategy.featured && (
                                <span className="text-xs sm:text-sm bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 px-2 sm:px-3 py-1 rounded-full font-medium">
                                  ⭐ Featured
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4 text-red-500 fill-current" />
                                <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                                  {strategy.vote_count || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Strategy Modal */}
      {showStrategyModal && selectedStrategy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            {/* Modal Content */}
            <div className="strategy-modal-body p-6 md:p-8 lg:p-12">
              <div className="max-w-3xl mx-auto">
                {/* Strategy Header */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedStrategy?.strategy_feelings) && 
                        selectedStrategy.strategy_feelings.map((sf) => sf.feeling?.name).filter(Boolean).map((feeling) => (
                          <span
                            key={feeling}
                            className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full"
                          >
                            {feeling}
                          </span>
                        ))}
                      {selectedStrategy.featured && (
                        <span className="text-sm bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowStrategyModal(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted/20 rounded-full"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <h1 className="strategy-modal-title">
                    {selectedStrategy.name}
                  </h1>

                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                    {selectedStrategy.description || 'No description available.'}
                  </p>
                </div>
              
                {/* Content */}
                <div className="space-y-6">
                  {/* Example */}
                  {selectedStrategy.example && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 text-lg">Example</h3>
                      <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
                        <p className="text-foreground/80 leading-relaxed italic">
                          {selectedStrategy.example}
                        </p>
                      </div>
                    </div>
                  )}

                {/* Related Topics (Tags) */}
                {selectedStrategy.strategy_tags && selectedStrategy.strategy_tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg">Related Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStrategy.strategy_tags.map((tagObj, index) => (
                        <span
                          key={tagObj.tag.name}
                          className={`text-sm ${getTagColor(index)} px-3 py-1 rounded-full font-medium`}
                        >
                          {tagObj.tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-6 border-t border-muted/30">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      {selectedStrategy.price || 'Free'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                      <span className="text-sm text-muted-foreground font-medium">
                        {selectedStrategy.vote_count || 0} helpful
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle helpful vote
                      }}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full transition-all duration-200 transform hover:scale-105"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">Helpful</span>
                    </button>
                    
                    {selectedStrategy.source && (
                      <button
                        onClick={() => window.open(selectedStrategy.source!, '_blank')}
                        className="source-toggle"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Source</span>
                      </button>
                    )}
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer navigateToPage={navigateToPage} />
    </div>
  )
}

export default function StrategiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen ocean-gradient flex items-center justify-center">Loading...</div>}>
      <StrategiesPageContent />
    </Suspense>
  )
}