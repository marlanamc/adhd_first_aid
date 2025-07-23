'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight, Heart, Star, X, ExternalLink, Filter, ThumbsUp } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { useFavorites } from '@/hooks/useFavorites'
import { useVotes } from '@/hooks/useVotes'
import { NewHomePage } from '@/components/pages'
import { getStrategies } from '@/lib/strategies'
import { supabase } from '@/lib/supabase'
import type { Strategy, Feeling } from '@/lib/supabase'
import type { SortOption, ViewMode } from '@/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import * as LucideIcons from 'lucide-react'

// Icon name mapping to Lucide icons
const iconMapping: { [key: string]: string } = {
  'footprints': 'FootprintsIcon',
  'book': 'Book',
  'zap': 'Zap',
  'brain': 'Brain',
  'heart': 'Heart',
  'target': 'Target',
  'clock': 'Clock',
  'home': 'Home',
  'settings': 'Settings',
  'users': 'Users',
  'calendar': 'Calendar',
  'check-circle': 'CheckCircle',
  'alert-circle': 'AlertCircle',
  'lightbulb': 'Lightbulb',
  'shield': 'Shield',
  'trending-up': 'TrendingUp',
  'activity': 'Activity',
  'coffee': 'Coffee',
  'sun': 'Sun',
  'moon': 'Moon',
  'star': 'Star',
  'award': 'Award',
  'gift': 'Gift',
  'sparkles': 'Sparkles',
  'rocket': 'Rocket',
  'flag': 'Flag',
  'map-pin': 'MapPin',
  'phone': 'Phone',
  'mail': 'Mail',
  'message-square': 'MessageSquare',
  'camera': 'Camera',
  'video': 'Video',
  'music': 'Music',
  'play': 'Play',
  'pause': 'Pause',
  'skip-back': 'SkipBack',
  'skip-forward': 'SkipForward',
  'volume-2': 'Volume2',
  'volume-x': 'VolumeX',
  'mic': 'Mic',
  'mic-off': 'MicOff',
  'headphones': 'Headphones',
  'speaker': 'Speaker',
  'monitor': 'Monitor',
  'smartphone': 'Smartphone',
  'tablet': 'Tablet',
  'laptop': 'Laptop',
  'wifi': 'Wifi',
  'wifi-off': 'WifiOff',
  'battery': 'Battery',
  'battery-charging': 'BatteryCharging',
  'lock': 'Lock',
  'unlock': 'Unlock',
  'eye': 'Eye',
  'eye-off': 'EyeOff',
  'search': 'Search',
  'search-x': 'SearchX',
  'plus': 'Plus',
  'minus': 'Minus',
  'x': 'X',
  'check': 'Check',
  'alert-triangle': 'AlertTriangle',
  'info': 'Info',
  'help-circle': 'HelpCircle',
  'file-text': 'FileText',
  'file': 'File',
  'folder': 'Folder',
  'folder-open': 'FolderOpen',
  'download': 'Download',
  'upload': 'Upload',
  'share': 'Share',
  'link': 'Link',
  'external-link': 'ExternalLink',
  'copy': 'Copy',
  'edit': 'Edit',
  'trash': 'Trash',
  'save': 'Save',
  'undo': 'Undo',
  'redo': 'Redo',
  'rotate-ccw': 'RotateCcw',
  'rotate-cw': 'RotateCw',
  'zoom-in': 'ZoomIn',
  'zoom-out': 'ZoomOut',
  'maximize': 'Maximize',
  'minimize': 'Minimize',
  'move': 'Move',
  'crop': 'Crop',
  'scissors': 'Scissors',
  'type': 'Type',
  'bold': 'Bold',
  'italic': 'Italic',
  'underline': 'Underline',
  'strikethrough': 'Strikethrough',
  'align-left': 'AlignLeft',
  'align-center': 'AlignCenter',
  'align-right': 'AlignRight',
  'list': 'List',
  'grid': 'Grid',
  'columns': 'Columns',
  'rows': 'Rows',
  'hash': 'Hash',
  'at-sign': 'AtSign',
  'dollar-sign': 'DollarSign',
  'percent': 'Percent',
  // Add more mappings for common strategy icons
  'fast-forward': 'FastForward',
  'anchor': 'Anchor',
  'hand': 'Hand',
  'refrigerator': 'Refrigerator',
  'timer': 'Timer',
  'toolbox': 'Toolbox',
  'credit-card': 'CreditCard',
  'brush': 'Brush',
  'gem': 'Gem',
  'chef-hat': 'ChefHat',
  'hand-coins': 'HandCoins',
  'grid-3x3': 'Grid3X3',
  'broom': 'Broom',
  'lamp': 'Lamp',
  'package-2': 'Package2',
  'notebook-pen': 'NotebookPen',
  'scan-face': 'ScanFace',
  'shower-head': 'ShowerHead',
  'sunset': 'Sunset',
  'layout-dashboard': 'LayoutDashboard',
  // Add missing icons that are in the database
  'refresh-cw': 'RefreshCw',
  'battery-full': 'BatteryFull',
  'alarm-clock': 'AlarmClock',
  'calendar-x': 'CalendarX',
  'shopping-cart': 'ShoppingCart',
  'washing-machine': 'WashingMachine',
  'check-square': 'CheckSquare',
  'trash-2': 'Trash2',
  'lotus': 'Lotus',
  'life-buoy': 'LifeBuoy',
  'tasks': 'Tasks',
  'hard-drive': 'HardDrive',
  'graduation-cap': 'GraduationCap',
  'lightning': 'Lightning',
  'user-plus': 'UserPlus',
  'shield-check': 'ShieldCheck',
  'dice': 'Dice',
  'package-x': 'PackageX',
  'cooking-pot': 'CookingPot',
  // Add missing icons for strategies
  'broom': 'Broom',
  'lotus': 'Lotus',
  'lightning': 'Lightning',
  'meditation': 'Lotus',
  'cleaning': 'Broom',
  'game': 'Dice',
  'toolkit': 'Toolbox',
  'mobile': 'Smartphone',
  'command': 'Terminal',
  'sprint': 'Zap',
  'stealth': 'Eye',
  'treasure': 'Gem',
  'hunt': 'Search',
  'yoga': 'Lotus',
  'stretching': 'Move',
  'sensory': 'Lightning',
  'breaks': 'Pause',
  'micro': 'Clock',
  'timer': 'Timer',
  'apps': 'Smartphone',
  'crisis': 'AlertTriangle',
  'partner': 'Users',
  'power': 'Zap',
  'magic': 'Sparkles',
  'eraser': 'Brush',
  'numbered': 'Hash',
  'decision': 'Target'
}

// Dynamic icon component
const DynamicIcon = ({ iconName, className }: { iconName: string, className?: string }) => {
  // Convert kebab-case to PascalCase and map to Lucide icon names
  const mappedIconName = iconMapping[iconName.toLowerCase()] || 
                        iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase()
  
  const IconComponent = (LucideIcons as any)[mappedIconName]
  
  if (IconComponent) {
    return <IconComponent className={className} />
  }
  
  // Fallback: show first letter of icon name in a styled div
  return (
    <div className={`${className} flex items-center justify-center font-bold text-xs bg-primary/20 rounded`}>
      {iconName.charAt(0).toUpperCase()}
    </div>
  )
}

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
  const viewAll = searchParams.get('view') === 'all'
  
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
  const { favorites } = useFavorites()
  const { hasVoted, toggleVote } = useVotes()

  // Function to get favorite count for a strategy
  const getFavoriteCount = (strategyId: string) => {
    return favorites.filter((fav: any) => fav.id === strategyId).length
  }

  // Determine if this is a task flow or feeling flow
  const isTaskFlow = !!task
  const isSearchFlow = !!searchQuery
  const isSelectionFlow = !feeling && !issue && !task && !barrier && !searchQuery && !viewAll

  interface Task {
    id: string
    name: string
    emoji: string | null
    color: string | null
    category: string | null
    hover_description: string | null
  }

  // Fetch feelings and tasks for selection flow
  useEffect(() => {
    async function fetchFeelingsAndTasks() {
      if (!isSelectionFlow) return

      try {
        // Fetch feelings
        const { data: feelingsData, error: feelingsError } = await supabase
          .from('feelings')
          .select('id, name, emoji, color, category, hover_description')
          .order('name')

        if (feelingsError) {
          console.error('Error fetching feelings:', feelingsError)
        } else {
          setFeelings(feelingsData || [])
        }

        // Fetch help tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('help_tasks')
          .select('id, name, emoji, color, category, hover_description')

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
      console.log('fetchStrategies called with:', { feeling, issue, task, barrier, searchQuery, viewAll, isSelectionFlow })
      
      if (isSelectionFlow) {
        console.log('Skipping strategy fetch - in selection flow')
        return // Don't fetch strategies for selection flow
      }

      try {
        setLoading(true)
        setError(null)

        const filters: { feelings?: string[], issues?: string[], barrier_type?: string, search?: string } = {}
        
        if (feeling) filters.feelings = [feeling]
        if (issue) filters.issues = [issue]
        if (barrier) filters.barrier_type = barrier
        if (searchQuery) filters.search = searchQuery

        console.log('Fetching strategies with filters:', filters)
        const data = await getStrategies(filters)
        console.log('Fetched strategies:', data?.length || 0)  // Debug log
        console.log('First strategy details:', data?.[0])  // Debug log for first strategy
        setStrategies(data)
      } catch (err) {
        console.error('Error fetching strategies:', err)
        setError('Failed to load strategies. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchStrategies()
  }, [feeling, issue, task, barrier, searchQuery, viewAll, isSelectionFlow])

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
        return [...strategies].sort((a, b) => {
          const aVotes = typeof a.vote_count === 'object' ? a.vote_count.count : (a.vote_count ?? 0)
          const bVotes = typeof b.vote_count === 'object' ? b.vote_count.count : (b.vote_count ?? 0)
          return bVotes - aVotes
        })
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
    router.back()
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
            <div className="relative z-[60]">
              <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 max-w-xs">
                <button
                  onClick={goBack}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light inline-flex items-center cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>
              </div>
            </div>

            {/* Strategy Selection */}
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
                Find Your Strategy
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Choose how you'd like to explore strategies that can help you today.
              </p>
            </div>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feelings Card */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-10 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
                   onClick={() => setViewMode('feeling')}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">💭</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">How I'm Feeling</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Browse strategies based on your current emotional state - whether you're overwhelmed, unfocused, or restless.
                  </p>
                </div>
              </div>

              {/* Tasks Card */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-10 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
                   onClick={() => setViewMode('task')}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">What I Need Help With</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Find strategies for specific tasks like getting started, staying organized, or managing your energy.
                  </p>
                </div>
              </div>

              {/* View All Strategies Card */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-10 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
                   onClick={() => setViewMode('all')}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">View All Strategies</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Explore our complete collection of ADHD strategies and techniques - discover new approaches and find what works for you.
                  </p>
                </div>
              </div>
            </div>

            {/* Selection Interface */}
            {(viewMode === 'feeling' || viewMode === 'task') && (
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {viewMode === 'feeling' ? 'How are you feeling right now?' : 'What do you need help with?'}
                  </h2>
                </div>
                
                {viewMode === 'feeling' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {feelings.map((feeling) => (
                      <TooltipProvider key={feeling.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleFeelingSelect(feeling.name)}
                              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 group text-center"
                            >
                              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                {feeling.emoji || '💭'}
                              </div>
                              <div className="text-sm font-medium text-foreground">
                                {feeling.name}
                              </div>
                            </button>
                          </TooltipTrigger>
                          {feeling.hover_description && (
                            <TooltipContent className="bg-white/95 backdrop-blur-md text-sm p-4 max-w-sm rounded-xl shadow-xl border border-white/20">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-lg">
                                  {feeling.emoji || '💭'}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground mb-1">{feeling.name}</p>
                                  <p className="text-muted-foreground leading-relaxed">{feeling.hover_description}</p>
                                </div>
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {tasks.map((task) => (
                      <TooltipProvider key={task.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleTaskSelect(task.name)}
                              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group text-left"
                            >
                              <div className="flex items-center">
                                <div className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                                  {task.emoji || '🎯'}
                                </div>
                                <div className="text-base font-medium text-foreground">
                                  {task.name}
                                </div>
                              </div>
                            </button>
                          </TooltipTrigger>
                          {task.hover_description && (
                            <TooltipContent className="bg-white/95 backdrop-blur-md text-sm p-4 max-w-sm rounded-xl shadow-xl border border-white/20">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-lg">
                                  {task.emoji || '🎯'}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground mb-1">{task.name}</p>
                                  <p className="text-muted-foreground leading-relaxed">{task.hover_description}</p>
                                </div>
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* View All Strategies - Direct Access */}
            {viewMode === 'all' && (
              <div className="mt-12 text-center">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    All Strategies
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Explore our complete collection of ADHD strategies and techniques. Browse, search, and discover what works best for you.
                  </p>
                </div>
                <button
                  onClick={() => {
                    console.log('Browse All Strategies button clicked')
                    setIsTransitioning(true)
                    setTimeout(() => {
                      // Navigate to strategies page with a special parameter to indicate "all" view
                      router.push('/strategies?view=all')
                    }, 300)
                  }}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full transition-all duration-200 transform hover:scale-105 font-medium text-lg"
                >
                  <span>Browse All Strategies</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
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
        <div className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 pt-12 md:pt-16 pb-24">


          {/* Content */}
          <div className="animate-in px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground mb-4">
                {isSearchFlow ? 'Search Results' : (feeling || issue || task || barrier ? 'Strategies For You' : 'All Strategies')}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                {isSearchFlow ? (
                  <>Results for &quot;{searchQuery}&quot;</>
                ) : (feeling || issue || task || barrier) ? (
                  <>
                    Here are strategies that might help when you&apos;re
                    {isTaskFlow ? (
                      <> struggling with <span className="text-primary font-bold">{task}</span></>
                    ) : (
                      <>
                        {feeling && (
                          <> feeling <span className="text-primary font-bold">{feeling}</span></>
                        )}
                        {issue && (
                          <>, <span className="text-primary font-bold">{issue}</span></>
                        )}
                      </>
                    )}
                    {barrier && (
                      <>, and working through <span className="text-primary font-bold">{barrier}</span></>
                    )}
                    .
                  </>
                ) : (
                  <>
                    Explore our complete collection of ADHD strategies and techniques. Browse, search, and discover what works best for you.
                  </>
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {feeling || issue || task || barrier ? 'Some strategies might work for multiple situations, so we\'ve included those too!' : 'Use the filters above to narrow down your search or browse all strategies.'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 items-start">
                  {sortStrategies(filterStrategies(strategies)).map((strategy, index) => {
                    console.log('Rendering strategy:', strategy)  // Debug log
                    console.log('Strategy use_case:', strategy.use_case)  // Debug log for use_case
                    console.log('Strategy subtitle:', strategy.subtitle)  // Debug log for subtitle
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
                                tags: strategy.strategy_tags?.map(st => st.tag.name) || [],
                                price: strategy.price || 'Free'
                              }}
                              size="sm"
                            />
                          </div>
                        </div>

                        {/* Strategy title and subtitle - centered with fixed heights */}
                        <div className="text-center mb-4 h-32 flex flex-col justify-center">
                          {/* Icon area - fixed height */}
                          <div className="h-12 flex items-center justify-center mb-3">
                            {strategy.icon_file && (
                              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <DynamicIcon iconName={strategy.icon_file} className="w-6 h-6 text-primary" />
                              </div>
                            )}
                          </div>
                          
                          {/* Title area - fixed height */}
                          <div className="h-12 flex items-center justify-center mb-2 px-2">
                            <h3 className="strategy-title text-center overflow-hidden" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: '1.2'
                            }}>
                              {strategy.name}
                            </h3>
                          </div>
                          
                          {/* Subtitle area - fixed height */}
                          <div className="h-6 flex items-center justify-center px-2">
                            {strategy.subtitle && (
                              <p className="text-sm text-muted-foreground font-medium text-center overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                {strategy.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Use Case - with light box (always present for alignment) */}
                        <div className="mb-4 sm:mb-6 flex-grow">
                          <div className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 min-h-[4rem] flex items-center justify-center">
                            {strategy.use_case ? (
                              <div className="prose prose-sm max-w-none text-center">
                                <ReactMarkdown>
                                  {strategy.use_case}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground/50 italic text-center">
                                Ready to use
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tags and metadata */}
                        <div className="space-y-3 sm:space-y-4 mt-auto">
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
                              <span className="text-xs sm:text-sm bg-black/10 text-black px-2 sm:px-3 py-1 rounded-full font-medium">
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
                                <Heart className="h-3 w-3 text-red-500 fill-current" />
                                <span className="text-xs text-muted-foreground font-medium">
                                  {getFavoriteCount(strategy.id)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ThumbsUp className="h-3 w-3 text-blue-500 fill-current" />
                                <span className="text-xs text-muted-foreground font-medium">
                                  {(typeof strategy.vote_count === 'object' ? strategy.vote_count.count : strategy.vote_count) ?? 0}
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
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowStrategyModal(false)}
        >
          <div 
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
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
                    <div className="flex items-center space-x-2">
                      <FavoriteButton 
                        strategy={{
                          id: selectedStrategy.id,
                          name: selectedStrategy.name,
                          description: selectedStrategy.description || '',
                          category: selectedStrategy.subtitle || '',
                          tags: selectedStrategy.strategy_tags?.map(tag => tag.tag.name) || [],
                          price: selectedStrategy.price || 'Free'
                        }}
                        size="lg"
                        className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                      />
                      <button
                        onClick={() => setShowStrategyModal(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted/20 rounded-full"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    {selectedStrategy.icon_file && (
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <DynamicIcon iconName={selectedStrategy.icon_file} className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h1 className="strategy-modal-title mb-2">
                        {selectedStrategy.name}
                      </h1>
                      {selectedStrategy.subtitle && (
                        <p className="text-lg text-muted-foreground font-medium">
                          {selectedStrategy.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Use Case - moved above description with quote style */}
                  {selectedStrategy.use_case && (
                    <div className="mb-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-r-lg p-2 sm:p-3">
                        <div className="flex items-center gap-2">
                          <div className="text-blue-500 flex-shrink-0">
                            <LucideIcons.Lightbulb className="w-5 h-5" />
                          </div>
                          <div className="flex-1 flex items-center">
                            <div className="text-blue-800 leading-relaxed prose prose-base max-w-none font-semibold">
                              <ReactMarkdown>
                                {selectedStrategy.use_case}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light prose prose-lg max-w-none prose-headings:text-foreground prose-strong:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedStrategy.description || 'No description available.'}
                    </ReactMarkdown>
                  </div>
                </div>
              
                {/* Content */}
                <div className="space-y-6">
                  {/* Example - removed quote styling for better readability */}
                  {selectedStrategy.example && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 text-lg">Example</h3>
                      <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4 sm:p-6 shadow-lg">
                        <div className="text-foreground leading-relaxed prose prose-base max-w-none prose-headings:text-foreground prose-strong:text-foreground prose-p:text-foreground prose-li:text-foreground prose-table:text-sm">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              table: ({children, ...props}) => (
                                <div className="overflow-x-auto my-4">
                                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg overflow-hidden" {...props}>
                                    {children}
                                  </table>
                                </div>
                              ),
                              thead: ({children, ...props}) => (
                                <thead className="bg-blue-50" {...props}>
                                  {children}
                                </thead>
                              ),
                              tbody: ({children, ...props}) => (
                                <tbody className="bg-white divide-y divide-gray-200" {...props}>
                                  {children}
                                </tbody>
                              ),
                              th: ({children, ...props}) => (
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0" {...props}>
                                  {children}
                                </th>
                              ),
                              td: ({children, ...props}) => (
                                <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200 last:border-r-0" {...props}>
                                  {children}
                                </td>
                              ),
                              h2: ({children, ...props}) => (
                                <h2 className="text-xl font-bold text-foreground mt-6 mb-3 first:mt-0" {...props}>
                                  {children}
                                </h2>
                              ),
                              h3: ({children, ...props}) => (
                                <h3 className="text-lg font-semibold text-foreground mt-4 mb-2" {...props}>
                                  {children}
                                </h3>
                              ),
                              ul: ({children, ...props}) => (
                                <ul className="space-y-1 my-3" {...props}>
                                  {children}
                                </ul>
                              ),
                              li: ({children, ...props}) => (
                                <li className="flex items-start" {...props}>
                                  <span className="text-blue-500 mr-2 flex-shrink-0 mt-1">•</span>
                                  <span>{children}</span>
                                </li>
                              )
                            }}
                          >
                            {selectedStrategy.example}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Why This Works */}
                  {selectedStrategy.strategy_why_does_this_work && selectedStrategy.strategy_why_does_this_work.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 text-lg">Why This Works</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStrategy.strategy_why_does_this_work.map((whyObj, index) => (
                          <span
                            key={whyObj.why_does_this_work.name}
                            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium"
                          >
                            {whyObj.why_does_this_work.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}


                  {/* ADHD-Friendly Improvement */}
                  {selectedStrategy.adhd_friendly_improvement && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 text-lg">ADHD-Friendly Improvement</h3>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>
                          {selectedStrategy.adhd_friendly_improvement}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}



                {/* Source/Inspiration */}
                {selectedStrategy.source && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg">Source/Inspiration</h3>
                    <div className="text-sm text-muted-foreground">
                      {selectedStrategy.source}
                    </div>
                  </div>
                )}

                {/* Further Reading */}
                {selectedStrategy.further_reading_text && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg">Further Reading</h3>
                    <div className="prose prose-sm max-w-none">
                      {selectedStrategy.further_reading_url ? (
                        <a
                          href={selectedStrategy.further_reading_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <ReactMarkdown>
                            {selectedStrategy.further_reading_text}
                          </ReactMarkdown>
                        </a>
                      ) : (
                        <ReactMarkdown>
                          {selectedStrategy.further_reading_text}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                )}

                {/* Related Topics (Tags) */}
                {selectedStrategy.strategy_tags && selectedStrategy.strategy_tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg">Tags</h3>
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
                    <span className="text-sm bg-black/10 text-black px-3 py-1 rounded-full font-medium">
                      {selectedStrategy.price || 'Free'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                      <span className="text-sm text-muted-foreground font-medium">
                        {getFavoriteCount(selectedStrategy.id)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4 text-blue-500 fill-current" />
                      <span className="text-sm text-muted-foreground font-medium">
                        {(typeof selectedStrategy.vote_count === 'object' ? selectedStrategy.vote_count.count : selectedStrategy.vote_count) ?? 0}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FavoriteButton 
                      strategy={{
                        id: selectedStrategy.id,
                        name: selectedStrategy.name,
                        description: selectedStrategy.description || '',
                        category: selectedStrategy.subtitle || '',
                        tags: selectedStrategy.strategy_tags?.map(tag => tag.tag.name) || [],
                        price: selectedStrategy.price || 'Free'
                      }}
                      size="md"
                      showText={true}
                      text="Favorite"
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVote(selectedStrategy.id);
                      }}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 ${
                        hasVoted(selectedStrategy.id)
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                      }`}
                    >
                      <ThumbsUp className={`h-4 w-4 transition-all duration-200 ${hasVoted(selectedStrategy.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">
                        {hasVoted(selectedStrategy.id) ? 'Voted' : 'Helpful'}
                      </span>
                    </button>
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