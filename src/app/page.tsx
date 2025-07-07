'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Heart, Star, ArrowLeft, ChevronRight, Timer, X, ExternalLink, Menu, ChevronDown } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getStrategies } from '../lib/strategies'
import type { Strategy } from '../lib/supabase'
import type { StrategyFilters } from '../lib/strategies'
import { supabase } from '@/lib/supabase'
import { HomePage } from '@/components/pages'

// Import styles
import './globals.css'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  featured: boolean
  category: string
  readTime: string
  publishDate: string
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState('feeling') // 'feeling', 'issue', 'barrier', 'gallery', 'faq', 'about', 'blog', 'terminology', 'legal'
  const [selectedFeeling, setSelectedFeeling] = useState('')
  const [selectedIssue, setSelectedIssue] = useState('')
  const [selectedBarrier, setSelectedBarrier] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'feeling' | 'task'>('feeling') // 'feeling' or 'task'
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [showStrategyModal, setShowStrategyModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feelings, setFeelings] = useState<string[]>([]);


  const allIssues = [
    'Anxious',
    'Frozen/Shut Down',
    'Spiraling',
    'Avoidant',
    'Bored',
    "Can't Start",
    'Messy',
    "Can't Focus",
    'Disorganized',
    'Overcommitted'
  ]

  const allBarriers = [
    'Emotional Dysregulation',
    'Task Initiation',
    'Low dopamine/Motivation',
    'Decision Paralysis'
  ]

  // Get available issues based on selected feeling
  const getAvailableIssues = () => {
    if (!selectedFeeling) return [];
    if (strategies.length === 0) return [];

    const availableIssues = Array.from(new Set(
      strategies.flatMap(strategy => {
        // If using join, extract from strategy.strategy_issues
        if (Array.isArray(strategy.strategy_issues)) {
          return strategy.strategy_issues
            .map((si: any) => si.issue?.name)
            .filter((name: string | undefined) => !!name);
        }
        // fallback for denormalized data
        if (Array.isArray(strategy.issue)) return strategy.issue;
        if (typeof strategy.issue === 'string' && strategy.issue.trim().length > 0) {
          return strategy.issue.split(',').map(i => i.trim());
        }
        return [];
      })
    ));
    return availableIssues;
  };

  // Get available barriers based on selected feeling and issue
  const getAvailableBarriers = () => {
    if (!selectedFeeling || !selectedIssue) return [];
    if (strategies.length === 0) return [];

    const availableBarriers = Array.from(new Set(
      strategies.flatMap(strategy => {
        // Get issues for this strategy
        let issues: string[] = [];
        if (Array.isArray(strategy.strategy_issues)) {
          issues = strategy.strategy_issues
            .map((si: any) => si.issue?.name)
            .filter((name: string | undefined) => !!name);
        } else if (Array.isArray(strategy.issue)) {
          issues = strategy.issue;
        } else if (typeof strategy.issue === 'string' && strategy.issue.trim().length > 0) {
          issues = strategy.issue.split(',').map(i => i.trim());
        }

        // If this strategy includes the selected issue, return its barriers
        if (issues.includes(selectedIssue)) {
          if (Array.isArray(strategy.strategy_barriers)) {
            return strategy.strategy_barriers
              .map((sb: any) => sb.barrier?.name)
              .filter((name: string | undefined) => !!name);
          }
          // fallback for denormalized data
          if (strategy.barrier_type) return [strategy.barrier_type];
        }
        return [];
      })
    ));

    return availableBarriers;
  }

  // Use filtered issues and barriers
  const issues = getAvailableIssues();
  const barriers = getAvailableBarriers();

  const tasks = [
    'Cleaning my fridge',
    'Getting started on work',
    'Managing a shame spiral',
    'Trying to eat today',
    'Doing laundry',
    'Making phone calls',
    'Organizing my space',
    'Starting a project'
  ]

  // Fetch strategies function
  async function fetchStrategies() {
    setLoading(true)
    setError(null)
    try {
      const filters: StrategyFilters = {}

      if (selectedFeeling) {
        filters.feelings = [selectedFeeling]
        console.log('Setting feeling filter:', filters.feelings)
      }

      if (selectedIssue) {
        filters.issues = [selectedIssue]
        console.log('🧩 Selected Issue (UI):', selectedIssue)
        console.log('🔍 Setting issue filter for Supabase:', filters.issues)
      }


      if (selectedBarrier) {
        filters.barrier_type = selectedBarrier
        console.log('Setting barrier filter:', filters.barrier_type)
      }

      if (searchQuery) {
        filters.search = searchQuery
        console.log('Setting search filter:', filters.search)
      }

      console.log('Calling getStrategies with filters:', JSON.stringify(filters))
      const data = await getStrategies(filters)
      console.log('Received strategies:', data.length)
      setStrategies(data)
    } catch (err) {
      console.error('Error fetching strategies:', err)
      setError(err instanceof Error ? err.message : 'Failed to load strategies. Please try again.')
      setStrategies([]) // Clear strategies on error
    } finally {
      setLoading(false)
    }
  }


  const handleFeelingSelect = (feeling: string) => {
    setSelectedFeeling(feeling)
    setIsTransitioning(true)

    // Reset other selections when feeling changes
    setSelectedIssue('')
    setSelectedBarrier('')

    setTimeout(() => {
      setCurrentStep('issue')
      setIsTransitioning(false)
    }, 800)
  }

  const handleTaskSelect = (task: string) => {
    setSelectedFeeling(task)
    setIsTransitioning(true)

    setTimeout(() => {
      setCurrentStep('issue')
      setIsTransitioning(false)
    }, 800)
  }

  const handleIssueSelect = (issue: string) => {
    setSelectedIssue(issue)
    setIsTransitioning(true)

    setTimeout(() => {
      setCurrentStep('barrier')
      setIsTransitioning(false)
    }, 600)
  }

  const handleBarrierSelect = (barrier: string) => {
    setSelectedBarrier(barrier)
    setIsTransitioning(true)

    setTimeout(() => {
      setCurrentStep('gallery')
      setIsTransitioning(false)
    }, 600)
  }

  const goBack = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      if (currentStep === 'gallery') {
        setCurrentStep('barrier')
        setSelectedBarrier('')
      } else if (currentStep === 'barrier') {
        setCurrentStep('issue')
        setSelectedIssue('')
      } else if (currentStep === 'issue') {
        setCurrentStep('feeling')
        setSelectedFeeling('')
      }
      setIsTransitioning(false)
    }, 400)
  }

  const resetFlow = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep('feeling')
      setSelectedFeeling('')
      setSelectedIssue('')
      setSelectedBarrier('')
      setShowSearch(false)
      setIsTransitioning(false)
    }, 400)
  }

  const handleStrategyClick = (strategy: Strategy) => {
    setSelectedStrategy(strategy)
    setShowStrategyModal(true)
    document.body.style.overflow = 'hidden'
  }

  const closeStrategyModal = () => {
    setShowStrategyModal(false)
    setSelectedStrategy(null)
    document.body.style.overflow = 'unset'
  }

  const navigateToPage = (page: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(page)
      setIsTransitioning(false)
    }, 400)
  }

  const navigateHome = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep('feeling')
      setSelectedFeeling('')
      setSelectedIssue('')
      setSelectedBarrier('')
      setShowSearch(false)
      setIsTransitioning(false)
    }, 400)
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showStrategyModal) {
        closeStrategyModal()
      }
      if (e.key === 'Escape' && showDropdown) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showStrategyModal, showDropdown])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showDropdown && !(e.target as Element).closest('.dropdown-container')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showDropdown])

  useEffect(() => {
    if (
      currentStep === 'issue' ||
      currentStep === 'barrier' ||
      currentStep === 'gallery'
    ) {
      fetchStrategies()
    }
  }, [currentStep, selectedFeeling, selectedIssue, selectedBarrier, searchQuery])

  useEffect(() => {
    console.log('Available issues:', getAvailableIssues());
  }, [strategies, selectedFeeling]);

  // Fetch feelings from Supabase
  useEffect(() => {
    async function fetchFeelings() {
      const { data, error } = await supabase.from('feelings').select('name');
      if (!error && data) {
        setFeelings(data.map((f: { name: string }) => f.name));
      }
    }
    fetchFeelings();
  }, []);

  return (
    <div className="min-h-screen ocean-gradient relative">
      <Header navigateHome={navigateHome} navigateToPage={navigateToPage} />

      <main className="flex min-h-screen flex-col">
        <div className="flex-grow">
          {/* Subtitle for homepage only */}
          {currentStep === 'feeling' && (
            <div className="text-center py-4 md:py-6 px-4">
              <p className="text-base sm:text-lg text-muted-foreground font-light italic subheading-serif">
                Gentle tools for overwhelming moments
              </p>
            </div>
          )}

          {/* Breadcrumb navigation for multi-step flow */}
          {['issue', 'barrier', 'gallery'].includes(currentStep) && (
            <div className="compact-breadcrumb">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <span className={currentStep === 'feeling' ? 'text-primary' : ''}>Feeling</span>
                <ChevronRight className="h-4 w-4" />
                <span className={currentStep === 'issue' ? 'text-primary' : ''}>Issue</span>
                <ChevronRight className="h-4 w-4" />
                <span className={currentStep === 'barrier' ? 'text-primary' : ''}>Barrier</span>
                <ChevronRight className="h-4 w-4" />
                <span className={currentStep === 'gallery' ? 'text-primary' : ''}>Strategies</span>
              </div>
            </div>
          )}

          {/* Render appropriate page component */}
          {currentStep === 'feeling' && (
            <HomePage
              viewMode={viewMode}
              setViewMode={setViewMode}
              feelings={feelings}
              tasks={tasks}
              handleFeelingSelect={handleFeelingSelect}
              handleTaskSelect={handleTaskSelect}
              isTransitioning={isTransitioning}
            />
          )}

          {/* Issue Selection Step */}
          {currentStep === 'issue' && (
            <div className={`mobile-transition ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
              <div className="mb-3 md:mb-4">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={goBack}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light mobile-button"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Back</span>
                </Button>
              </div>

              <div className="text-center mb-8 md:mb-12">
                <h3 className="text-base sm:text-lg font-serif text-muted-foreground mb-2 md:mb-3 leading-relaxed px-4">
                  You're feeling {selectedFeeling.toLowerCase()}
                </h3>
                <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-foreground mb-4 md:mb-6 leading-relaxed px-4">
                  What specific issue are you facing right now?
                </h2>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
                  {issues.map((issue, index) => (
                    <Button
                      key={issue}
                      variant="ghost"
                      size="default"
                      onClick={() => handleIssueSelect(issue)}
                      className="feeling-button h-auto py-3 sm:py-4 px-4 sm:px-6 text-sm font-light rounded-full mobile-transition mobile-button-large inline-flex items-center justify-center whitespace-nowrap text-muted-foreground hover:text-foreground"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        transform: isTransitioning ? 'translateY(-20px)' : 'translateY(0)',
                        opacity: isTransitioning ? 0 : 1
                      }}
                    >
                      <span className="text-center leading-tight">{issue}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Barrier Selection Step */}
          {currentStep === 'barrier' && (
            <div className={`mobile-transition ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
              <div className="mb-3 md:mb-4">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={goBack}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light mobile-button"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Back</span>
                </Button>
              </div>

              <div className="text-center mb-8 md:mb-12">
                <h3 className="text-base sm:text-lg font-serif text-muted-foreground mb-2 md:mb-3 leading-relaxed px-4">
                  You're working on: {selectedIssue.toLowerCase()}
                </h3>
                <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-foreground mb-4 md:mb-6 leading-relaxed px-4">
                  What's making this harder for you?
                </h2>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
                  {barriers.map((barrier, index) => (
                    <Button
                      key={barrier}
                      variant="ghost"
                      size="default"
                      onClick={() => handleBarrierSelect(barrier)}
                      className="feeling-button h-auto py-3 sm:py-4 px-4 sm:px-6 text-sm font-light rounded-full mobile-transition mobile-button-large inline-flex items-center justify-center whitespace-nowrap text-muted-foreground hover:text-foreground"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        transform: isTransitioning ? 'translateY(-20px)' : 'translateY(0)',
                        opacity: isTransitioning ? 0 : 1
                      }}
                    >
                      <span className="text-center leading-tight">{barrier}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Gallery Page */}
          {currentStep === 'gallery' && (
            <div className="animate-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground mb-4">
                  Strategies for you
                </h2>
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                  Here are strategies that might help when you're feeling <span className="text-primary font-medium">{selectedFeeling}</span>,
                  dealing with <span className="text-primary font-medium">{selectedIssue}</span>
                  {selectedBarrier && <>, and working through <span className="text-primary font-medium">{selectedBarrier}</span></>}.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Some strategies might work for multiple situations, so we've included those too!
                </p>
              </div>

              {loading && (
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <p className="text-muted-foreground">Finding the best strategies for you...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => fetchStrategies()}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {!loading && !error && strategies.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any exact matches, but don't worry! Let's try a different approach.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="ghost"
                      size="default"
                      onClick={goBack}
                      className="text-primary"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go Back
                    </Button>
                    <Button
                      variant="ghost"
                      size="default"
                      onClick={resetFlow}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Start Over
                    </Button>
                  </div>
                </div>
              )}

              {!loading && !error && strategies.length > 0 && (
                <div className="px-4 md:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                    {strategies.map((strategy, index) => {
                      // 👇 Place this at the top of your map callback
                      const assignedFeelings = Array.isArray(strategy.strategy_feelings)
                        ? strategy.strategy_feelings.map((sf: any) => sf.feeling?.name).filter(Boolean)
                        : [];

                      return (
                        <div
                          key={strategy.id}
                          onClick={() => handleStrategyClick(strategy)}
                          className="strategy-card clickable-card rounded-xl md:rounded-2xl p-4 sm:p-6 mobile-transition bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl cursor-pointer flex flex-col h-full"
                          style={{
                            animationDelay: `${index * 0.15}s`,
                            transform: isTransitioning ? 'translateY(30px)' : 'translateY(0)',
                            opacity: isTransitioning ? 0 : 1
                          }}
                        >
                          <div className="flex items-start justify-between mb-3 md:mb-4">
                            <div className="flex-1">
                              <span className="text-xs text-primary font-medium mb-1 block">
                                {assignedFeelings.join(', ')}
                              </span>
                              <h4 className="font-serif text-foreground text-base sm:text-lg leading-relaxed pr-2">
                                {strategy.name}
                              </h4>
                            </div>
                            {strategy.featured && (
                              <span className="text-xs bg-accent/20 text-accent px-2 sm:px-3 py-1 rounded-full ml-2 sm:ml-4 font-light flex-shrink-0">
                                Featured
                              </span>
                            )}
                          </div>

                          <p className="text-muted-foreground text-sm sm:text-base mb-4 md:mb-6 leading-relaxed font-light body-light">
                            {strategy.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4 md:mb-6 mobile-tags">
                            {strategy.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs bg-muted/50 text-muted-foreground px-2 sm:px-3 py-1 rounded-full font-light mobile-tag">
                                {tag}
                              </span>
                            ))}
                            <span className="text-xs bg-muted/30 text-muted-foreground px-2 sm:px-3 py-1 rounded-full font-light mobile-tag">
                              {strategy.price}
                            </span>
                          </div>

                          {/* Action Buttons at the bottom */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-auto pt-4 border-t border-muted/20">
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="default"
                                className="vote-button text-muted-foreground hover:text-primary transition-colors duration-300 font-light mobile-button p-2 sm:p-3"
                              >
                                <Heart className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="text-xs sm:text-sm">
                                  {strategy.vote_count} found this helpful
                                </span>
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="default"
                              className="vote-button text-muted-foreground hover:text-accent transition-colors duration-300 mobile-button self-start sm:self-auto"
                            >
                              <Star className="h-4 w-4" />
                              <span className="ml-2 text-xs sm:text-sm">Save</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center mt-8">
                    <p className="text-sm text-muted-foreground mb-4">
                      Don't see what you're looking for?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        variant="ghost"
                        size="default"
                        onClick={goBack}
                        className="text-primary"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Try Different Filters
                      </Button>
                      <Button
                        variant="ghost"
                        size="default"
                        onClick={() => setShowSearch(true)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search All Strategies
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <Footer navigateToPage={navigateToPage} />
      </main>

      {/* Strategy Modal */}
      {showStrategyModal && selectedStrategy && (
        <div className="fixed inset-0 z-50 strategy-modal-overlay">
          <div className="strategy-modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeStrategyModal}></div>

          <div className="strategy-modal-container relative z-10 min-h-screen flex items-center justify-center p-4">
            <div className="strategy-modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
              {/* Modal Header */}
              <div className="strategy-modal-header sticky top-0 bg-white/90 backdrop-blur-lg border-b border-white/20 p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={closeStrategyModal}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 p-2"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    <span className="text-sm">Back to strategies</span>
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="default"
                  onClick={closeStrategyModal}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="strategy-modal-body p-6 md:p-8 lg:p-12">
                <div className="max-w-3xl mx-auto">
                  {/* Strategy Header */}
                  <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                        {Array.isArray(selectedStrategy.strategy_feelings)
                          ? selectedStrategy.strategy_feelings
                            .map((sf: any) => sf.feeling?.name)
                            .filter(Boolean)
                            .join(', ')
                          : ''}
                      </span>
                      {selectedStrategy.featured && (
                        <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full font-light">
                          Featured
                        </span>
                      )}
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-6 leading-tight">
                      {selectedStrategy.name}
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                      {selectedStrategy.description}
                    </p>
                  </div>

                  {/* Strategy Details */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-serif text-foreground mb-4">Example</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      <p className="leading-relaxed font-light mb-4">
                        {selectedStrategy.example}
                      </p>
                    </div>
                  </div>

                  {/* Tags and Metadata */}
                  <div className="mb-8">
                    <h3 className="text-lg font-serif text-foreground mb-3">Related topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStrategy.tags.map((tag: string) => (
                        <span key={tag} className="text-sm bg-muted/50 text-muted-foreground px-3 py-1 rounded-full font-light">
                          {tag}
                        </span>
                      ))}
                      <span className="text-sm bg-muted/30 text-muted-foreground px-3 py-1 rounded-full font-light">
                        {selectedStrategy.price}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-muted/20">
                    <Button
                      variant="ghost"
                      size="default"
                      className="flex-1 text-muted-foreground hover:text-primary transition-colors duration-300 font-light p-4"
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      <span>{selectedStrategy.vote_count} found this helpful</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="default"
                      className="flex-1 text-muted-foreground hover:text-accent transition-colors duration-300 font-light p-4"
                    >
                      <Star className="h-5 w-5 mr-3" />
                      <span>Save to my toolkit</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="default"
                      className="flex-1 text-muted-foreground hover:text-foreground transition-colors duration-300 font-light p-4"
                    >
                      <ExternalLink className="h-5 w-5 mr-3" />
                      <span>Share strategy</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

