'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCollapsibleSections } from '@/hooks/useCollapsibleSections'
import { 
  ArrowLeft, Plus, Minus, Share2, Brain, Heart, 
  Wrench, RotateCcw, Rainbow, Puzzle, Construction,
  XCircle, Lightbulb, Target,
  BookOpen, Zap, Star, Clock, Home, Briefcase, 
  Settings, Folder, FileText, Mail, ClipboardList,
  ShoppingCart, Utensils, Shirt, Trash2,
  Phone, Wallet, Calendar, Car, Pill, Activity,
  Sparkles, Key, Flame, ArrowLeftRight, Bath,
  Sun, DoorClosed, Dumbbell, CookingPot, Refrigerator,
  Recycle, Store, PackageCheck, Receipt, Calculator,
  ScrollText, Pencil, PhoneCall, Bell, GraduationCap,
  Library, Palette, MailPlus, TrendingUp, TrendingDown,
  Award, Medal, Music, Laptop, Monitor, MapPin, 
  Link as LinkIcon, Globe, Snowflake, Scissors, Hammer,
  Paintbrush, Brush, Shield, Gem, Crown, Flower, Leaf,
  Gamepad2, User, Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTasksContent, getLifeAreaSources } from '@/lib/supabase'
import type { TasksContent, LifeAreaSources } from '@/lib/supabase'
import { SuggestionButton } from '@/components/ui/SuggestionButton';
import { ShareModal } from '@/components/ui/ShareModal';
import StudyPainpointsGrid from '@/components/ui/StudyPainpointsGrid'
import CorePrinciplesCondensed from '@/components/ui/CorePrinciplesCondensed'
import AdhdReasonsThreeCol, { type Row as AdhdRow } from '@/components/ui/AdhdReasonsThreeCol'
import { CollapsibleToggle } from '@/components/ui/CollapsibleToggle'

// Short, ADHD‑friendly subtitles for section headers (customized for life areas)
const getSectionSubtitle = (title: string): string => {
  const t = (title || '').toLowerCase()
  if (t.includes('core principles')) return 'The few big ideas to keep you steady when things feel overwhelming'
  if (t.includes('strategies')) return 'Tiny, do‑able moves to get this task started now'
  if (t.includes('mindset')) return 'Gentle reframes that lower pressure and unlock action'
  if (t.includes('encouragement')) return 'A quick pep talk to take with you when it’s tough'
  if (t.includes('tools')) return 'Practical helpers you can grab fast when you need them'
  if (t.includes('examples')) return 'Real‑life patterns and how people shift them'
  if (t.includes('common mistakes')) return 'What trips folks up, and how to avoid it without shame'
  if (t.includes('checklist')) return 'A simple list so your brain doesn’t have to remember it all'
  if (t.includes('faq')) return 'Quick answers to the questions that pop up a lot'
  // ADHD reasons header
  if (t.includes('why') && t.includes('hard')) return 'Connect what you feel with what’s happening in your brain, no shame, just clarity'
  // Generic fallback
  return 'Open for a quick, plain‑language guide to help you move forward'
}

import { formatMarkdownTextWithIntelligence } from '@/lib/utils'

// Direct mapping of task names to Lucide icons (no emoji intermediary)
const getTaskIcon = (taskName: string): React.ElementType => {
  const taskIconMap: Record<string, React.ElementType> = {
    // Core household tasks - Brain is first, Sparkles is last as required
    'Focus & Time': Brain,
    'Cleaning': Sparkles, // Keep as last per requirements
    'Laundry': Shirt,
    'Dishes': Utensils,
    'Decluttering': PackageCheck,
    'Cooking': CookingPot,
    'Hygiene': Bath,
    'Cleaning Out the Fridge': Refrigerator,
    'Trash & Recycling': Recycle,
    'Minor Repairs': Wrench,
    
    // Daily routines
    'Morning Routine': Sun,
    'Getting Out the Door': DoorClosed,
    'Moving Your Body': Dumbbell,
    
    // Shopping & errands
    'Grocery Shopping': ShoppingCart,
    'Retail Shopping': Store,
    'Returning Items': RotateCcw,
    'Car Maintenance': Car,
    
    // Planning & organization
    'Planning & Scheduling': Calendar,
    'To-Do Lists': ClipboardList,
    'Organization': Folder,
    'Meal Planning': Clock,
    'Meal Prepping': CookingPot,
    
    // Financial & administrative
    'Bills & Money': Receipt,
    'Budgeting & Tracking': Calculator,
    'Paperwork': ScrollText,
    'Filling Out Documents': Pencil,
    
    // Communication tasks
    'Reading Important Mail': Mail,
    'Writing Emails': MailPlus,
    'Making Phone Calls': PhoneCall,
    'Following Up': Bell,
    'Scheduling Appointments': Calendar,
    
    // Health & wellness
    'Medication Refills': Pill,
    
    // Work & education - each gets unique icon
    'Work Tasks': Briefcase,
    'Big Exam Prep (Long-Term Studying)': GraduationCap,
    'Staying on Top of Classwork': Library,
    'Creative Projects': Palette,
  }
  
  return taskIconMap[taskName] || Settings // Default fallback
}

// Comprehensive emoji to icon mapping for content sections - NO DUPLICATES
const getSectionIcon = (emoji: string): React.ElementType => {
  const sectionIconMap: Record<string, React.ElementType> = {
    // Core universal emojis used across multiple tasks
    '🧠': Brain,
    '❤️': Heart,
    '⚡': Zap,
    '🎯': Target,
    '🔧': Wrench,
    '🛠️': Construction,
    '💡': Lightbulb,
    '✨': Sparkles,
    '🔥': Flame,
    '🚀': Rocket,
    
    // Time & Schedule related
    '⏰': Clock,
    '⏱️': Clock, // Timer
    '⏳': Clock, // Hourglass
    '📅': Calendar,
    '🗓️': Calendar,
    
    // Communication & Information
    '📞': PhoneCall,
    '📱': Phone,
    '✉️': Mail,
    '📧': MailPlus,
    '💬': Heart, // Comments/conversation
    '📋': ClipboardList,
    '📝': ScrollText,
    '📄': FileText,
    '📊': TrendingUp,
    '📈': TrendingUp,
    
    // Health & Body
    '🧘': User, // Meditation
    '🏃': Dumbbell, // Running
    '💪': Zap, // Muscle/strength  
    '🌡️': Activity, // Thermometer
    '💊': Pill,
    '🧼': Bath,
    '🚿': Bath, // Shower
    '🛁': Bath, // Bathtub
    
    // Food & Kitchen
    '🍽️': Utensils,
    '🍳': CookingPot,
    '🥘': CookingPot,
    '🍕': Utensils, // Pizza
    '🥗': Utensils, // Salad
    '🛒': ShoppingCart,
    '🛍️': ShoppingCart, // Shopping bags
    
    // Home & Cleaning
    '🏠': Home,
    '🏡': Home,
    '🧽': Brush, // Sponge
    '🧴': Bath, // Soap bottle
    '🧹': Brush, // Broom
    '🚿_shower': Bath, // Shower head
    '🪣': Store, // Bucket
    '🗑️': Trash2,
    '♻️': Recycle,
    '🧺': PackageCheck, // Laundry basket
    
    // Clothing & Personal Items
    '👕': Shirt,
    '👔': Briefcase, // Dress shirt/formal
    '🧤': Paintbrush, // Gloves
    '👟': Activity, // Sneakers
    '🧳': Briefcase, // Suitcase
    
    // Work & Study
    '💼': Briefcase,
    '📚': BookOpen,
    '📖': Library, // Open book
    '✏️': Pencil,
    '🖊️': Pencil, // Pen
    '📐': ScrollText, // Ruler/triangle
    '🎓': GraduationCap,
    '🖥️': Monitor, // Desktop
    '💻': Laptop,
    
    // Creative & Arts
    '🎨': Palette,
    '🖌️': Paintbrush,
    '✂️': Scissors,
    '📸': Activity, // Camera
    '🎭': Shield, // Theater masks
    '🎪': Crown, // Circus tent
    '🎵': Music,
    '🎧': Music, // Headphones
    '🎶': Activity, // Musical notes
    
    // Transportation & Movement
    '🚗': Car,
    '🚕': Car, // Taxi
    '🚙': Car, // SUV
    '🚌': Car, // Bus
    '🚲': Activity, // Bicycle
    '🛴': Activity, // Scooter
    '✈️': Activity, // Airplane
    '🚪': DoorClosed,
    '🚶': User, // Walking
    '🏃_running': Dumbbell, // Running
    
    // Money & Finance
    '💰': Wallet,
    '💳': Receipt, // Credit card
    '💵': Receipt, // Dollar bills
    '🧾': Receipt,
    '📊_chart': Calculator, // Bar chart
    '📈_up': TrendingUp,
    '📉': TrendingDown,
    '🏦': Award, // Bank
    
    // Technology & Tools
    '⚙️': Settings,
    '🔩': Key, // Bolt
    '🔨': Hammer,
    '🪛': Construction, // Screwdriver
    '🧰': PackageCheck, // Toolbox
    '⛏️': Construction, // Pick
    '🔑': Key,
    '🔒': Shield, // Lock
    '🔓': Key, // Unlock
    '🖱️': Activity, // Computer mouse
    
    // Nature & Environment
    '🌱': Flower,
    '🌿': Leaf,
    '🌳': Flower, // Tree
    '🌞': Sun,
    '⛅': Activity, // Clouds
    '🌧️': Activity, // Rain
    '🌊': Activity, // Ocean wave
    '⭐': Star,
    '🌟': Medal,
    '🌈': Rainbow,
    '💧': Snowflake, // Water drop
    
    // Emotions & States
    '😊': Heart, // Happy
    '😌': Heart, // Content
    '🤗': Heart, // Hugging
    '🤝': Heart, // Handshake
    '🫶': Heart, // Heart hands
    '💜': Heart, // Purple heart
    '💙': Heart, // Blue heart
    '💚': Heart, // Green heart
    
    // Symbols & Abstract
    '🎪_circus': Crown, // Circus tent
    '🔮': Gem,
    '💎': Gem,
    '🏆': Award,
    '🥇': Medal, // Gold medal
    '🎖️': Award, // Military medal
    '🛡️': Shield,
    '⚖️': Award, // Scale of justice
    '🧩': Puzzle,
    '🔗': LinkIcon,
    '🌐': Globe,
    '💫': Star, // Dizzy star
    '⚪': Activity, // White circle
    '🔵': Activity, // Blue circle
    
    // Special utility emojis
    '📍': MapPin,
    '🎲': Activity, // Dice
    '🎯_target': Lightbulb, // Different context from Target
    '🎮': Gamepad2,
    '🧸': Heart, // Teddy bear
    '🎁': PackageCheck, // Gift
    '📦': PackageCheck, // Package
    '📮': Mail, // Postbox
    '📬': Mail, // Mailbox
    
    // Default for any unmapped emojis
    'Utensils': Utensils, // Special case for dishes
  }
  
  return sectionIconMap[emoji] || Settings // Default fallback for truly unknown emojis
}

interface LifeAreaPageProps {
  params: Promise<{
    life_area: string
  }>
}

export default function LifeAreaPage({ params }: LifeAreaPageProps) {
  const [content, setContent] = useState<TasksContent | null>(null)
  const [sources, setSources] = useState<LifeAreaSources[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  // Use our collapsible sections hook
  const { 
    expandedSections, 
    toggleSection, 
    toggleAllSections, 
    isAllExpanded, 
    isAllCollapsed 
  } = useCollapsibleSections()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        // Await params since it's now a Promise in Next.js 15
        const resolvedParams = await params
        
        // Convert URL param back to display name  
        let taskName = decodeURIComponent(resolvedParams.life_area)
          .split('-')
          .filter(word => word.length > 0) // Remove empty strings from double dashes
          .map(word => {
            // Special case for ADHD
            if (word.toLowerCase() === 'adhd') {
              return 'ADHD'
            }
            return word.charAt(0).toUpperCase() + word.slice(1)
          })
          .join(' ')
          .replace(/And/g, '&')
        
        // Handle special URL to database name mappings
        const urlMappings: Record<string, string> = {
          'ADHD & Hygiene': 'Hygiene',
          'ADHD Hygiene': 'Hygiene', 
          'Bills Money': 'Bills & Money',
          'To Do Lists': 'To-Do Lists',
          'Big Exam Prep Long Term Studying': 'Big Exam Prep (Long-Term Studying)'
        }
        
        taskName = urlMappings[taskName] || taskName

        const { data, error } = await getTasksContent(taskName)
        
        if (error) {
          setError(`Failed to load task content: ${error.message}`)
        } else if (data) {
          setContent(data)
          
          // Fetch sources using the slug format
          // Convert URL slug to match database format
          const lifeAreaSlug = resolvedParams.life_area

          // Map URL slugs to preferred base slug first
          const slugMappings: Record<string, string> = {
            'focus-and-time': 'focus-time',
            'bills-and-money': 'bills-money',
            'budgeting-and-tracking': 'budgeting-tracking',
            'big-exam-prep-long-term-studying': 'big-exam-prep',
            'cleaning-out-the-fridge': 'cleaning-out-fridge',
            'filling-out-documents': 'filling-out-docs',
            'to-do-lists': 'todo-lists',
            'trash-and-recycling': 'trash-recycling',
            'planning-and-scheduling': 'planning-scheduling',
          }

          const baseSlug = slugMappings[lifeAreaSlug] || lifeAreaSlug

          // Generate candidate variations to robustly match stored slugs
          const generateCandidates = (slug: string): string[] => {
            const variants = new Set<string>()
            const add = (s: string) => variants.add(s.replace(/--+/g, '-').replace(/^-+|-+$/g, ''))

            add(slug)
            // Common article/connector cleanup
            add(slug.replace(/-and-/g, '-'))
            add(slug.replace(/-the-/g, '-'))
            add(slug.replace(/-of-/g, '-'))
            add(slug.replace(/-on-/g, '-'))
            // docs/documents
            add(slug.replace(/documents/g, 'docs'))
            add(slug.replace(/docs/g, 'documents'))
            // to-do/todo
            add(slug.replace(/to-do/g, 'todo'))
            add(slug.replace(/todo/g, 'to-do'))
            // trash & recycling
            add(slug.replace(/trash-and-recycling/g, 'trash-recycling'))
            // underscores variant (just in case)
            add(slug.replace(/-/g, '_'))

            // Token-based simplifications: last word and last two words
            const tokens = slug.split('-').filter(Boolean)
            if (tokens.length > 0) add(tokens[tokens.length - 1])
            if (tokens.length > 1) add(tokens.slice(-2).join('-'))

            return Array.from(variants)
          }

          const candidateSlugs = Array.from(new Set([
            ...generateCandidates(baseSlug),
            // also try candidates from the original route slug
            ...generateCandidates(lifeAreaSlug),
          ]))

          console.log('Trying life area source slugs:', candidateSlugs)
          let foundSources: LifeAreaSources[] | null = null
          for (const candidate of candidateSlugs) {
            const { data: tryData, error: tryError } = await getLifeAreaSources(candidate)
            if (tryError) {
              console.error('Error fetching sources for', candidate, tryError)
              continue
            }
            if (tryData && tryData.length > 0) {
              foundSources = tryData
              break
            }
          }

          if (foundSources) {
            console.log('Found sources:', foundSources.length)
            setSources(foundSources)
          } else {
            console.log('No sources found for any candidate slugs')
          }
        } else {
          setError('Task content not found')
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error('Error fetching task content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [params])

  const goBack = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    
    if (category) {
      window.location.href = `/life_areas?category=${encodeURIComponent(category)}`
    } else {
      window.location.href = '/life_areas'
    }
  }

  const handleShare = () => {
    // Always show the custom share modal
    setIsShareModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#9ee5b5] via-[#b0f4ea] to-[#8fd3f4] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-lg">Prepping your executive function helpers...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#9ee5b5] via-[#b0f4ea] to-[#8fd3f4] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-md text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Task Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error || 'This task content is not available yet.'}
          </p>
          <Button onClick={goBack} variant="default" size="default" className="bg-blue-500 hover:bg-blue-600 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Life Areas
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9ee5b5] via-[#b0f4ea] to-[#8fd3f4] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative">
      <div className="max-w-5xl mx-auto px-4 py-6 pt-4">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-lg">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="default"
                onClick={goBack}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-2 sm:gap-3">
                  {React.createElement(getTaskIcon(content.task_name), {
                    className: "h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0"
                  })}
                  {content.task_name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h1>
                {content.subtitle && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    {content.subtitle}
                  </p>
                )}
              </div>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={handleShare}
                  className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
                  title="Share this page"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Intro Paragraph - with green border like requested */}
            <div className="border-l-4 border-green-500 bg-green-50/50 dark:bg-green-900/10 pl-4 py-3 mb-5 rounded-r-lg">
              <p className="text-base md:text-lg text-foreground leading-relaxed"
                 dangerouslySetInnerHTML={{ 
                   __html: content.intro_paragraph
                     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                     .replace(/\*(.*?)\*/g, '<em>$1</em>')
                     .replace(/_(.*?)_/g, '<em>$1</em>')
                 }} 
              />
            </div>

          </div>


          {/* Section Divider */}
          <div className="flex items-center justify-center gap-4 mb-5 text-gray-400 dark:text-gray-600">
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              <p className="text-sm font-medium">Choose how you want to begin</p>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
          </div>

          {/* Side-by-Side Toggle Boxes (original placement and style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {/* Left Box - Soft Start */}
            <div className="relative" data-section-id="gentle-advice">
              <Button
                onClick={() => toggleSection('gentle-advice')}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#61ffb5]/40 hover:shadow-md transition-shadow duration-300 border border-[#A0E8AF]/60 min-h-[52px] touch-manipulation"
                variant="ghost"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#2D9C3C]" />
                  <h3 className="text-base font-semibold text-gray-900">Soft Start</h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {expandedSections['gentle-advice'] ? (
                    <Minus className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </Button>
              {expandedSections['gentle-advice'] && (
                <div className="bg-[#61ffb5]/40 rounded-xl p-3 space-y-2 animate-in slide-in-from-top duration-300 border border-[#A0E8AF]/60 mt-2">
                  <p className="text-base text-gray-900 leading-relaxed">
                    {formatMarkdownTextWithIntelligence(content.gentle_advice, 'tasks')}
                  </p>
                </div>
              )}
            </div>

            {/* Right Box - Tough Love */}
            <div className="relative" data-section-id="stern-advice">
              <Button
                onClick={() => toggleSection('stern-advice')}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#ff61ab]/40 hover:shadow-md transition-shadow duration-300 border border-[#FF9EBB]/60 min-h-[52px] touch-manipulation"
                variant="ghost"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#D23369]" />
                  <h3 className="text-base font-semibold text-gray-900">Tough Love</h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {expandedSections['stern-advice'] ? (
                    <Minus className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </Button>
              {expandedSections['stern-advice'] && (
                <div className="bg-[#ff61ab]/40 rounded-xl p-3 space-y-2 animate-in slide-in-from-top duration-300 border border-[#FF9EBB]/60 mt-2">
                  <p className="text-base text-gray-900 leading-relaxed">
                    {formatMarkdownTextWithIntelligence(content.stern_advice, 'tasks')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Gentle guidance note - moved before ADHD reasons section */}
          <div className="flex items-center justify-center gap-4 mb-5 text-gray-400 dark:text-gray-600">
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <p className="text-sm font-medium">Explore when you're ready</p>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
          </div>

          {/* Collapsible Toggle */}
          <div className="flex justify-center mb-4">
            <CollapsibleToggle
              isAllExpanded={isAllExpanded}
              isAllCollapsed={isAllCollapsed}
              onToggleAll={toggleAllSections}
            />
          </div>

          {/* ADHD Reasons - card style */}
          {content.adhd_reasons && content.adhd_reasons.length > 0 && (
            <div className="rounded-2xl transition-all duration-300 mb-4 bg-white border border-[#FBF8CC]" data-section-id="adhd-reasons">
              <button
                onClick={() => toggleSection('adhd-reasons')}
                className="w-full p-4 text-left rounded-2xl transition-all duration-300 flex items-center justify-between group"
                title={expandedSections['adhd-reasons'] ? 'Close section' : 'Open section'}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FBF8CC] rounded-lg flex-shrink-0">
                    <Brain className="h-5 w-5 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      Why {content.task_name} is Hard with ADHD
                    </h3>
                      <p className="text-sm text-gray-700 mt-0.5">Connect what you feel with what’s happening in your brain, no shame, just clarity</p>
                  </div>
                </div>
                {expandedSections['adhd-reasons'] ? (
                  <Minus className="h-5 w-5 text-gray-900 flex-shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-900 flex-shrink-0" />
                )}
              </button>

              {expandedSections['adhd-reasons'] && (
                <div className="px-4 pb-4 animate-in slide-in-from-top duration-300 border-t border-[#D9D9FF] bg-white">
                  <div className="space-y-4">
                    {(() => {
                      const youMightItems: string[] = []
                      const whatsReallyGoingOnItems: string[] = []
                      let currentSection = ''

                      content.adhd_reasons.forEach((reason) => {
                        if (reason === 'You might:') currentSection = 'you-might'
                        else if (reason === "Here's what's really going on:") currentSection = 'whats-really-going-on'
                        else if (currentSection === 'you-might') youMightItems.push(reason)
                        else if (currentSection === 'whats-really-going-on') whatsReallyGoingOnItems.push(reason)
                      })

                      const sanitize = (s: string) => (s || '').replace(/\uFFFD+/g, '').replace(/\s+/g, ' ').trim()
                      const cleanLeft = (s?: string) => sanitize((s || '').replace(/^[-•]\s*/, ''))
                      const rawLefts = youMightItems.map(cleanLeft).filter(Boolean)

                      const parseRight = (s?: string) => {
                        if (!s) return { emoji: null as string | null, heading: null as string | null, desc: '' }
                        // Capture any emoji sequence (with variation selectors/ZWJ) at the start
                        // Broad emoji matcher without Unicode property to satisfy linter
                        let rest = s.replace(/^\s*[-•]\s*/, '')
                        const emojiMatch = rest.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2300-\u23FF\u2600-\u26FF\u2700-\u27BF])\s+(.+)/)
                        let emoji: string | null = null
                        if (emojiMatch) { emoji = emojiMatch[1]; rest = emojiMatch[2] }
                        rest = sanitize(rest.replace(/^[\uFFFD\s]+/, ''))
                        const boldMatch = rest.match(/^\*\*(.*?)\*\*[:：]?\s*(.*)?$/)
                        if (boldMatch) {
                          let body = (boldMatch[2] || '').replace(/^\s*[-•]\s*/, '')
                          body = body.replace(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2300-\u23FF\u2600-\u26FF\u2700-\u27BF])\s*/, '')
                          body = body.replace(/^\*\*.*?\*\*[:：]?\s*/, '')
                          return { emoji, heading: boldMatch[1], desc: body }
                        }
                        // If bold not found, attempt to strip any residual heading pattern from desc
                        const cleaned = rest.replace(/^\s*[-•]\s*/, '').replace(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2300-\u23FF\u2600-\u26FF\u2700-\u27BF])\s*/, '').replace(/^\s*\*\*.*?\*\*[:：]?\s*/, '')
                        return { emoji, heading: null, desc: cleaned }
                      }

                      const rights = whatsReallyGoingOnItems
                        .map(parseRight)
                        .filter(r => (r.heading && r.heading.trim()) || (r.desc && r.desc.trim()))
                      // Parse left bullets: "- [emoji] **Title** — subtitle"
                      const parseLeftItem = (txt: string): { emoji?: string; title: string; body?: string } => {
                        let t = txt
                        t = t.replace(/^\s*[−—–-•]\s*/, '')
                        const em = t.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2300-\u23FF\u2600-\u26FF\u2700-\u27BF])\s+(.+)/)
                        let emoji: string | undefined
                        if (em) { emoji = em[1]; t = em[2] }
                        const m = t.match(/^\*\*(.*?)\*\*\s*(?:[—–-]\s*(.*))?$/)
                        if (m) {
                          const title = (m[1] || '').trim()
                          const body = (m[2] || '').trim() || undefined
                          return { emoji, title, body }
                        }
                        const parts = t.split(/[—–-]\s+/, 2)
                        const title = (parts[0] || '').trim()
                        const body = (parts[1] || '').trim() || undefined
                        return { emoji, title: title || t.trim(), body }
                      }
                      const leftParsed = rawLefts.map(parseLeftItem)

                      const guessRight = (left: string): { emoji: string; heading: string; desc: string } => {
                        const t = left.toLowerCase()
                        if (/(tab|forget|remember|meeting|agreed|follow\s*up|checked|scheduled)/.test(t)) {
                          return { emoji: '🧠', heading: 'Working memory failures', desc: 'your brain is juggling a lot, so details slip without reminders' }
                        }
                        if (/(avoid|boring|complex|start|starting|begin|multi\s*step|plan)/.test(t)) {
                          return { emoji: '🧩', heading: 'Executive dysfunction', desc: "getting started is hard when your brain can't pick a first step or feel the spark" }
                        }
                        if (/(late|time|deadline|last-minute|estimate|expire|registration|inspection|how long it's been)/.test(t)) {
                          return { emoji: '⏰', heading: 'Time blindness', desc: 'time feels fuzzy, so deadlines sneak up and urgency spikes' }
                        }
                        if (/(distract|halfway|project|never return|switch)/.test(t)) {
                          return { emoji: '🎯', heading: 'Attention dysregulation', desc: 'focus swings make it tough to stay with one thing start‑to‑finish' }
                        }
                        if (/(urgency|low activation|warning light|not screaming)/.test(t)) {
                          return { emoji: '💥', heading: 'Motivation', desc: 'your drive follows urgency/interest, not importance—low signal = low activation' }
                        }
                        if (/(panic|breaks|no backup|overwhelm|stress)/.test(t)) {
                          return { emoji: '💛', heading: 'Your nervous system is overloaded', desc: 'when stress spikes, short‑term relief wins over long‑term plans—totally human' }
                        }
                        return { emoji: '💡', heading: 'Context matters', desc: 'your brain is adapting to stressors; gentle supports help shift the pattern' }
                      }

                      const pairs = leftParsed.map((left, i) => ({ left, right: rights[i] || guessRight(`${left.title} ${left.body || ''}`) }))


                      const emojiFromHeading = (h?: string|null) => {
                        const k = (h||'').toLowerCase()
                        if (k.includes('executive')) return '🧩'
                        if (k.includes('working memory')) return '🧠'
                        if (k.includes('time')) return '⏰'
                        if (k.includes('attention')) return '🎯'
                        if (k.includes('shame') || k.includes('rsd')) return '😔'
                        if (k.includes('dopamine') || k.includes('motivation')) return '⚡'
                        return '✨'
                      }

                      const rightEmojiFor = (h?: string | null) => {
                        const k = (h || '').toLowerCase()
                        if (k.includes('executive')) return '🧩'
                        if (k.includes('working memory')) return '🧠'
                        if (k.includes('time')) return '⏰'
                        if (k.includes('attention')) return '🎯'
                        if (k.includes('motivation')) return '🔥'
                        if (k.includes('nervous system')) return '⚡'
                        return '💡'
                      }

                      const rows: AdhdRow[] = pairs.map((pair) => {
                        const r = typeof pair.right === 'string' ? parseRight(pair.right) : pair.right
                        const left = pair.left as { emoji?: string; title: string; body?: string }
                        const youMightTitle = left.title
                        const youMightBody = left.body
                        const finalEmoji = left.emoji || r.emoji || emojiFromHeading(r.heading)

                        // Normalize vague headings like "Insight" or "Context matters"
                        const normalizeHeading = (h?: string | null) => {
                          const raw = (h || '').trim()
                          const k = raw.toLowerCase()
                          if (!raw || k === 'insight' || k.includes('context matters')) {
                            // Infer a better key term from the description
                            const d = String(r.desc || '').toLowerCase()
                            if (/executive/.test(d)) return 'Executive dysfunction'
                            if (/working memory|remember|forget/.test(d)) return 'Working memory'
                            if (/time|deadline|late/.test(d)) return 'Time blindness'
                            if (/shame|rsd|avoid/.test(d)) return 'Shame/avoidance'
                            if (/attention|focus/.test(d)) return 'Attention/executive load'
                            return 'Executive dysfunction'
                          }
                          return raw
                        }
                         // Title should use the bolded label if present; otherwise infer
                         const inferred = normalizeHeading(r.heading)
                         const whats = {
                           title: (inferred || '').replace(/[—–-]+\s*$/, ''),
                           body: String(r.desc || '')
                             .replace(/^([\p{Extended_Pictographic}\uFE0F\u200D]|\s)+/u, '')
                             .replace(/^\*\*.*?\*\*[:：]?\s*/, '')
                             .replace(/\s+/g, ' ')
                             .trim(),
                           icon: r.emoji || undefined
                         }
                        // Generate concise, verb‑first, unique tips per row
                        const tips: string[] = []
                        const body = `${whats.title} ${whats.body}`.toLowerCase()
                        const push = (t: string) => { if (!tips.includes(t)) tips.push(t) }
                        if (/tabs?|browser|attention/.test(body)) {
                          push('Close extra tabs before starting')
                          push('Park links in a later window')
                          push('Use one‑tab full‑screen mode')
                        }
                        if (/executive|start|initiat|prioritiz/.test(body)) {
                          push('Do a 5‑4‑3‑2‑1 countdown')
                          push('Open the doc and type 1 line')
                        }
                        if (/time|blind|planning fallacy|transition/.test(body)) {
                          push('Set a visible timer 20–30 min')
                          push('Add +15 min buffer')
                          push('Run two alarms: wrap‑up + leave')
                        }
                        if (/working memory|remember|forget|sequence/.test(body)) {
                          push('Use a door or desk checklist')
                          push('Write a one‑sentence recap')
                        }
                        if (/rsd|shame|motivation|urgency/.test(body)) {
                          push('Name it: “time blind, not lazy”')
                          push('Take a 30‑sec reset')
                          push('Body‑double for a micro‑win')
                        }
                        const howTo = tips.slice(0, 3)
                        return { icon: finalEmoji, youMight: { title: youMightTitle, body: youMightBody }, whatsGoingOn: { ...whats, icon: r.emoji || undefined }, howTo: howTo.length ? howTo : ['Start with 1 tiny action', 'Make it visible', 'Summarize aloud'] }
                      })

                      // Ensure unique "You might" titles to avoid duplicate rows after mapping
                      const ensureUniqueYouMight = (rowsIn: AdhdRow[], originals: string[]): AdhdRow[] => {
                        const seen = new Set<string>()
                        return rowsIn.map((r, idx) => {
                          let title = r.youMight.title
                          const key = (s: string) => s.toLowerCase().trim()
                          if (seen.has(key(title))) {
                            const src = (originals[idx] || '').toLowerCase()
                            if (/(abandon|stall|give up|stop|within a week)/.test(src)) title = 'Start strong… then stall out'
                            else if (/freeze/.test(src)) title = 'Freeze the moment you start'
                            else if (/plan(ning)?(\s+but\s+not\s+doing)?|loop of planning/.test(src)) title = 'Plan it to death, don’t start'
                            else if (/forget|remember/.test(src)) title = 'Forget what you studied'
                            else if (/(materials|what comes next|next step)/.test(src)) title = 'Lose track of what’s next'
                            else if (/(energy|interest).*crash|crash/.test(src)) title = 'Energy dips stop the session'
                            else if (/tabs?|scroll/.test(src)) title = 'Open one tab, end up with 12'
                            else title = title + ' — part 2'
                          }
                          seen.add(key(title))
                          return { ...r, youMight: { ...r.youMight, title } }
                        })
                      }

                      const dedupedRows = ensureUniqueYouMight(rows, leftParsed.map(l=>`${l.title} ${l.body||''}`))
                      return <AdhdReasonsThreeCol rows={dedupedRows} />
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}


          {/* Content Sections */}
          {content.content_sections && (() => {
            const visibleSections = content.content_sections.filter((s: any) => !/^\s*sources\s*$/i.test(s.title || ''))
            if (visibleSections.length === 0) return null
            return (
            <div className="space-y-4">
              {visibleSections.map((section, index) => {
                // Fixed accent colors per section (order aligned with content)
                const colorSchemes = [
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#FDE4CF]', iconBg: 'bg-[#FDE4CF]', textColor: 'text-[#FDE4CF]', panelBg: 'bg-[#FDE4CF]/20' }, // Core Principles
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#B9FBC0]', iconBg: 'bg-[#B9FBC0]', textColor: 'text-[#B9FBC0]', panelBg: 'bg-white' }, // Strategies
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#F1C0E8]', iconBg: 'bg-[#F1C0E8]', textColor: 'text-[#F1C0E8]', panelBg: 'bg-[#F1C0E8]/20' }, // Mindset Shift
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#A3C4F3]', iconBg: 'bg-[#A3C4F3]', textColor: 'text-[#A3C4F3]', panelBg: 'bg-[#A3C4F3]/20' }, // Encouragement
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#B9FBC0]', iconBg: 'bg-[#B9FBC0]', panelBg: 'bg-[#B9FBC0]/20' }, // Sources (fallback)
                ];
                
                const colors = colorSchemes[index % colorSchemes.length];
                const IconComponent = getSectionIcon(section.emoji);
                const sectionId = `section-${index}`;
                const isExpanded = expandedSections[sectionId];
                
                


                return (
                  <div key={index} className={`rounded-2xl ${colors.bg} border ${colors.border} transition-all duration-300 group/section`} data-section-id={sectionId}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSection(sectionId);
                      }}
                      className={`w-full p-5 md:p-6 text-left rounded-2xl transition-all duration-300 flex items-center justify-between group relative`}
                      title={isExpanded ? "Close section" : "Open section"}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 ${colors.iconBg} rounded-lg flex-shrink-0`}>
                          <IconComponent className="h-5 w-5 text-gray-900" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-0.5">
                            <div dangerouslySetInnerHTML={{ 
                              __html: section.title
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/_(.*?)_/g, '<em>$1</em>')
                            }} />
                          </h3>
                           <p className="text-sm text-gray-700">{getSectionSubtitle(section.title.replace(/Get Steady Before You Start/i,'Core Principles'))}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <Minus className={`h-5 w-5 text-black flex-shrink-0`} />
                      ) : (
                        <Plus className={`h-5 w-5 text-black flex-shrink-0`} />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className={`px-3 md:px-4 pb-3 md:pb-4 animate-in slide-in-from-top duration-300 border-t ${colors.border} ${colors.panelBg} rounded-b-2xl`}>
                        {section.content && section.content.length > 0 && (
                           (/^\s*core principles\s*$/i.test(section.title || '') || /^\s*get steady before you start\s*$/i.test(section.title || '')) ? (
                           (() => {
                               const parse = (line: string) => {
                                 // Split by newline to handle the "Try:" line separately
                                 const lines = line.split('\n')
                                 const mainLine = lines[0] || ''
                                 
                                 // Extract the last emoji before the title and clean up the corrupted pattern
                                 // Pattern: "- ✨ **✨ **✨ **✨ **💡 **Title text**: Description"
                                 const emojiPattern = /([\p{Extended_Pictographic}\u2600-\u27BF])\s*\*\*/gu
                                 const emojis = [...mainLine.matchAll(emojiPattern)]
                                 const lastEmoji = emojis.length > 0 ? emojis[emojis.length - 1][1] : ''
                                 
                                 // Remove all the emoji-asterisk patterns to get clean text
                                 let cleanedLine = mainLine
                                   .replace(/^-\s*/, '') // Remove leading dash
                                   .replace(/([\p{Extended_Pictographic}\u2600-\u27BF])\s*\*\*/gu, '') // Remove all emoji-** patterns
                                   .replace(/\*\*:\*\*.*$/g, '') // Remove trailing **:** corruption
                                   .trim()
                                 
                                 // Now parse title and description
                                 // The format after cleaning should be: "Title text**: Description" or just "Title text: Description"
                                 const titleDescMatch = cleanedLine.match(/^(.*?)\*?\*?:\s*(.*)$/)
                                 
                                 if (titleDescMatch) {
                                   const title = titleDescMatch[1].replace(/\*+$/, '').trim()
                                   const desc = titleDescMatch[2].trim()
                                   return { icon: lastEmoji, title, desc }
                                 }
                                 
                                 // Fallback: treat the whole cleaned line as title
                                 const title = cleanedLine.replace(/\*+/g, '').trim()
                                 return { icon: lastEmoji || '', title, desc: '' }
                               }
                               const tryCandidates = (title: string, desc: string): string[] => {
                                 const t = `${title} ${desc}`.toLowerCase()
                                 const picks: string[] = []
                                 const add=(s:string)=>{ if(!picks.includes(s)) picks.push(s) }
                                 if (/time|timer|visible|countdown|pace/.test(t)) { add('Set a visible 20–30 min timer'); add('Use a kitchen timer in view') }
                                 if (/structure|routine|system|organize|checklist/.test(t)) { add('Write a 3‑step checklist you can reuse'); add('Pin a 1‑page template where you start') }
                                 if (/energy|fatigue|capacity|rest|break/.test(t)) { add('Add a movement or water break between blocks'); add('Work in two short bursts, then stop') }
                                 if (/aware|awareness|notice|name|understand|mind/.test(t)) { add('Name the pattern aloud in 1 sentence'); add('Write a one‑line recap at the end') }
                                 if (/momentum|start|tiny|first step|begin/.test(t)) { add('Do one 60‑second starter action'); add('Open the doc and type one line') }
                                 if (/distraction|tab|phone|scroll/.test(t)) { add('Park links in a later window'); add('Put phone in another room for 20 min') }
                                 if (picks.length === 0) { add('Set a visible 20–30 min timer'); add('Do one 60‑second starter action'); add('Write a 3‑step checklist you can reuse') }
                                 return picks
                               }
                               // Pair lines: principle bullet optionally followed by a "- Try:" line
                               const lines = section.content as string[]
                               const raw: Array<{icon:string; title:string; desc:string; try?: string}> = []
                               for (let i = 0; i < lines.length; i++){
                                 const line = lines[i]
                                 if (/^\s*-\s*try:/i.test(line)) continue
                                 const p = parse(line)
                                 // Lookahead for Try
                                 const next = lines[i+1]
                                 const mTry = next && /^\s*-\s*try:\s*(.+)$/i.exec(next)
                                 const tryLine = mTry ? mTry[1].trim() : undefined
                                 if (mTry) i++
                                 raw.push({ icon: p.icon, title: p.title, desc: p.desc, try: tryLine })
                               }
                               // Ensure unique emojis across items
                               const emojiPool = ['✨','🧭','📌','🔁','🌱','🔎','🪄','🧠','🎯','⚡','⏰','💡']
                               const usedEmojis = new Set<string>()
                               const pickEmoji = (want?: string) => {
                                 if (want && !usedEmojis.has(want)) { usedEmojis.add(want); return want }
                                 const alt = emojiPool.find(e => !usedEmojis.has(e)) || '✨'
                                 usedEmojis.add(alt)
                                 return alt
                               }
                               // Ensure unique Try lines across items
                               const usedTries = new Set<string>()
                               const pickTry = (title: string, desc: string) => {
                                 const cands = tryCandidates(title, desc)
                                 const choice = cands.find(c => !usedTries.has(c)) || cands[0]
                                 usedTries.add(choice)
                                 return choice
                               }
                               const items = raw.map(r => ({
                                 icon: pickEmoji(r.icon),
                                 title: r.title.slice(0, 120),
                                 desc: r.desc,
                                 try: (() => { const chosen = r.try || pickTry(r.title, r.desc); usedTries.add(chosen); return chosen })()
                               }))
                               return <CorePrinciplesCondensed items={items} />
                             })()
                           ) : (
                          <div className="space-y-2 sm:space-y-3 mb-2 sm:mb-3 pt-1 sm:pt-2">
                            {(() => {
                              const groupedContent: Array<{type: 'quote', items: string[]} | {type: 'bullet', item: string}> = [];
                              let currentQuoteGroup: string[] = [];
                              
                              // Group consecutive quotes together
                              section.content.forEach((item) => {
                                if (item.startsWith('> ')) {
                                  currentQuoteGroup.push(item);
                                } else {
                                  // If we have accumulated quotes, add them as a group
                                  if (currentQuoteGroup.length > 0) {
                                    groupedContent.push({ type: 'quote', items: currentQuoteGroup });
                                    currentQuoteGroup = [];
                                  }
                                  // Add the non-quote item
                                  groupedContent.push({ type: 'bullet', item });
                                }
                              });
                              
                              // Don't forget any remaining quotes
                              if (currentQuoteGroup.length > 0) {
                                groupedContent.push({ type: 'quote', items: currentQuoteGroup });
                              }
                              
                              return groupedContent.map((group, groupIndex) => {
                                if (group.type === 'quote') {
                                  // Render grouped quotes in one box
                                  return (
                                    <div key={groupIndex} className={`border-l-4 ${colors.border} ml-6 pl-4 py-3 ${colors.bg.replace('/40', '/10')} rounded-lg space-y-2 hover:shadow-sm transition-shadow group/quote`}>
                                      {group.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="text-gray-900"
                                             dangerouslySetInnerHTML={{ 
                                               __html: item.replace('> ', '')
                                                 .replace(/^-\s*(\d+\.\s*)?/, '')
                                                 .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                 .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                 .replace(/_(.*?)_/g, '<em>$1</em>')
                                             }} 
                                        />
                                      ))}
                                    </div>
                                  )
                                } else {
                                  // Regular bullet points
                                  return (
                                    <div key={groupIndex} className="flex items-baseline gap-3 ml-6 group/bullet hover:bg-gray-500/10 rounded-lg transition-colors mt-1">
                                      <span className="text-gray-900 flex-shrink-0 mt-0.5 text-lg group-hover/bullet:scale-110 transition-transform">•</span>
                                      <div className="text-gray-900 py-1"
                                           dangerouslySetInnerHTML={{ 
                                             __html: group.item.replace(/^-\s*(\d+\.\s*)?/, '')
                                               .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                               .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                               .replace(/_(.*?)_/g, '<em>$1</em>')
                                           }} 
                                      />
                                    </div>
                                  )
                                }
                              });
                            })()}
                          </div>
                           )
                        )}
                        
                        {/* Subsections */}
                        {section.subsections && section.subsections.length > 0 && (
                          <div className="space-y-2 sm:space-y-3">
                            {section.subsections.map((subsection, subIndex) => {
                              const SubIconComponent = getSectionIcon(subsection.emoji);
                              const subsectionId = `subsection-${index}-${subIndex}`;
                              const isSubExpanded = expandedSections[subsectionId];
                              
                              // Gentle color rotation using existing brand palette - more opaque and ADHD-friendly
                              const colorRotation = [
                                { bg: 'bg-[#FBF8CC]/80', hover: 'hover:bg-[#FBF8CC]', text: 'text-gray-900', border: 'border-[#FBF8CC]/30', iconBg: 'bg-[#FBF8CC]', textColor: 'text-gray-900' }, // Lemon Chiffon
                                { bg: 'bg-[#FDE4CF]/80', hover: 'hover:bg-[#FDE4CF]', text: 'text-gray-900', border: 'border-[#FDE4CF]/30', iconBg: 'bg-[#FDE4CF]', textColor: 'text-gray-900' }, // Champagne Pink
                                { bg: 'bg-[#FFCFD2]/80', hover: 'hover:bg-[#FFCFD2]', text: 'text-gray-900', border: 'border-[#FFCFD2]/30', iconBg: 'bg-[#FFCFD2]', textColor: 'text-gray-900' }, // Baby Pink
                                { bg: 'bg-[#F1C0E8]/80', hover: 'hover:bg-[#F1C0E8]', text: 'text-gray-900', border: 'border-[#F1C0E8]/30', iconBg: 'bg-[#F1C0E8]', textColor: 'text-gray-900' }, // Pink Lavender
                                { bg: 'bg-[#CFBAF0]/80', hover: 'hover:bg-[#CFBAF0]', text: 'text-gray-900', border: 'border-[#CFBAF0]/30', iconBg: 'bg-[#CFBAF0]', textColor: 'text-gray-900' }, // Lavender Blue
                                { bg: 'bg-[#A3C4F3]/80', hover: 'hover:bg-[#A3C4F3]', text: 'text-gray-900', border: 'border-[#A3C4F3]/30', iconBg: 'bg-[#A3C4F3]', textColor: 'text-gray-900' }, // Baby Blue Eyes
                                { bg: 'bg-[#90DBF4]/80', hover: 'hover:bg-[#90DBF4]', text: 'text-gray-900', border: 'border-[#90DBF4]/30', iconBg: 'bg-[#90DBF4]', textColor: 'text-gray-900' }, // Sky Blue
                                { bg: 'bg-[#8EECF5]/80', hover: 'hover:bg-[#8EECF5]', text: 'text-gray-900', border: 'border-[#8EECF5]/30', iconBg: 'bg-[#8EECF5]', textColor: 'text-gray-900' }, // Electric Blue
                                { bg: 'bg-[#98F5E1]/80', hover: 'hover:bg-[#98F5E1]', text: 'text-gray-900', border: 'border-[#98F5E1]/30', iconBg: 'bg-[#98F5E1]', textColor: 'text-gray-900' }, // Magic Mint
                                { bg: 'bg-[#B9FBC0]/80', hover: 'hover:bg-[#B9FBC0]', text: 'text-gray-900', border: 'border-[#B9FBC0]/30', iconBg: 'bg-[#B9FBC0]', textColor: 'text-gray-900' } // Granny Smith Apple
                              ];
                              
                              const subColors = colorRotation[subIndex % colorRotation.length];
                              
                              return (
                                <div key={subIndex} className={`rounded-xl border ${subColors.border.replace('/30','/40')} transition-all duration-300 overflow-hidden`} data-section-id={subsectionId}>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toggleSection(subsectionId);
                                    }}
                                    className={`w-full p-4 text-left ${subColors.bg} ${subColors.hover} transition-all duration-300 flex items-center justify-between group`}
                                    title={isSubExpanded ? "Close section" : "Open section"}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className={`p-1.5 ${subColors.iconBg} rounded-md flex-shrink-0 transition-transform duration-300 ${isSubExpanded ? 'scale-110' : 'group-hover:scale-105'}`}>
                                        <SubIconComponent className="h-4 w-4 text-gray-900" />
                                      </div>
                                      <h4 className={`text-lg font-semibold ${subColors.textColor}`}>
                                        <div dangerouslySetInnerHTML={{ 
                                          __html: subsection.title
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                            .replace(/_(.*?)_/g, '<em>$1</em>')
                                        }} />
                                      </h4>
                                    </div>
                                    {isSubExpanded ? (
                                      <Minus className={`h-4 w-4 text-black flex-shrink-0`} />
                                    ) : (
                                      <Plus className={`h-4 w-4 text-black flex-shrink-0`} />
                                    )}
                                  </button>
                                  
                                  {isSubExpanded && subsection.content && subsection.content.length > 0 && (
                                    <div className={`px-4 pb-4 animate-in slide-in-from-top duration-300 ${subColors.bg.replace('/80','/40').replace('/90','/40')} ${subColors.border.replace('/30','/30')} rounded-b-xl` }>
                                      <div className="space-y-2 mt-2">
                                        {subsection.content.map((item, itemIndex) => {
                                          const startsHyphen = /^\s*-\s+/.test(item)
                                          const isTopEmojiBold = /^\s*-\s*([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2300-\u23FF\u2600-\u26FF\u2700-\u27BF])\s*\*\*/.test(item)
                                          const showArrow = startsHyphen && !isTopEmojiBold
                                          return (
                                            <div key={itemIndex} className="flex items-baseline gap-2">
                                              <span className={`${showArrow ? 'text-gray-700' : 'text-gray-800'} mt-0.5 flex-shrink-0 opacity-80`}>{showArrow ? '→' : '•'}</span>
                                              <div className={`text-gray-800 opacity-90`}
                                                 dangerouslySetInnerHTML={{ 
                                                     __html: item.replace(/^\s*-\s*(\d+\.\s*)?/, '')
                                                     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                     .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                     .replace(/_(.*?)_/g, '<em>$1</em>')
                                                 }} 
                                            />
                                          </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>)
          })()}

          {/* Sources Section - Positioned right after content sections */}
          {sources && sources.length > 0 && (
            <div className="space-y-4 mt-4">
              <div className="rounded-2xl bg-white border border-[#D9D9FF] transition-all duration-300" data-section-id="sources">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSection('sources');
                  }}
                                        className="w-full p-4 text-left rounded-2xl transition-all duration-300 flex items-center justify-between group relative"
                  title={expandedSections['sources'] ? "Close section" : "Open section"}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#D9D9FF] rounded-lg flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-gray-900" />
                  </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-0.5">Sources</h3>
                      <p className="text-sm text-gray-700">Explore the books, guides, and research that shaped this page</p>
                  </div>
                  </div>
                    {expandedSections['sources'] ? (
                    <Minus className="h-5 w-5 text-black flex-shrink-0" />
                    ) : (
                    <Plus className="h-5 w-5 text-black flex-shrink-0" />
                    )}
                </button>
                
                {expandedSections['sources'] && (
                  <div className="px-4 pb-4 animate-in slide-in-from-top duration-300 border-t border-[#D9D9FF] bg-white">
                    {/* Group sources by category and sort by count (descending) */}
                    {Object.entries(
                      sources.reduce((acc, source) => {
                        const category = source.category || 'Other'
                        if (!acc[category]) acc[category] = []
                        acc[category].push(source)
                        return acc
                      }, {} as Record<string, typeof sources>)
                    )
                    .sort(([,a], [,b]) => b.length - a.length) // Sort by count descending
                    .map(([category, categorySources], index) => {
                      // Color palette for category headers (matching feelings style)
                      const colors = [
                        { bg: 'bg-[#FBF8CC]/40', hover: 'hover:bg-[#FBF8CC]/60', border: 'border-[#FBF8CC]/60', iconBg: 'bg-[#FBF8CC]/90' }, // Lemon Chiffon
                        { bg: 'bg-[#FDE4CF]/40', hover: 'hover:bg-[#FDE4CF]/60', border: 'border-[#FDE4CF]/60', iconBg: 'bg-[#FDE4CF]/90' }, // Champagne Pink
                        { bg: 'bg-[#FFCFD2]/40', hover: 'hover:bg-[#FFCFD2]/60', border: 'border-[#FFCFD2]/60', iconBg: 'bg-[#FFCFD2]/90' }, // Baby Pink
                        { bg: 'bg-[#F1C0E8]/40', hover: 'hover:bg-[#F1C0E8]/60', border: 'border-[#F1C0E8]/60', iconBg: 'bg-[#F1C0E8]/90' }, // Pink Lavender
                        { bg: 'bg-[#CFBAF0]/40', hover: 'hover:bg-[#CFBAF0]/60', border: 'border-[#CFBAF0]/60', iconBg: 'bg-[#CFBAF0]/90' }, // Lavender Blue
                        { bg: 'bg-[#A3C4F3]/40', hover: 'hover:bg-[#A3C4F3]/60', border: 'border-[#A3C4F3]/60', iconBg: 'bg-[#A3C4F3]/90' }, // Baby Blue Eyes
                        { bg: 'bg-[#90DBF4]/40', hover: 'hover:bg-[#90DBF4]/60', border: 'border-[#90DBF4]/60', iconBg: 'bg-[#90DBF4]/90' }, // Sky Blue
                        { bg: 'bg-[#8EECF5]/40', hover: 'hover:bg-[#8EECF5]/60', border: 'border-[#8EECF5]/60', iconBg: 'bg-[#8EECF5]/90' }, // Electric Blue
                        { bg: 'bg-[#98F5E1]/40', hover: 'hover:bg-[#98F5E1]/60', border: 'border-[#98F5E1]/60', iconBg: 'bg-[#98F5E1]/90' }, // Magic Mint
                        { bg: 'bg-[#B9FBC0]/40', hover: 'hover:bg-[#B9FBC0]/60', border: 'border-[#B9FBC0]/60', iconBg: 'bg-[#B9FBC0]/90' }  // Granny Smith Apple
                      ]
                      const colorScheme = colors[index % colors.length]
                      
                      // Deduplicate sources within a category by normalized title+authors
                      const normalized = (value: string) =>
                        (value || '')
                          .toLowerCase()
                          .replace(/[_*`~]/g, '')
                          .replace(/[^a-z0-9\s()&:+,-]/g, '')
                          .replace(/\s+/g, ' ')
                          .trim();

                      const deduped = Object.values(
                        (categorySources as any[]).reduce((acc, src) => {
                          const key = `${normalized(src.title)}::${normalized(src.authors)}`;
                          if (!acc[key]) {
                            acc[key] = { ...src, _descriptions: [] as string[] };
                          }
                          if (src.description) acc[key]._descriptions.push(src.description);
                          return acc;
                        }, {} as Record<string, any>)
                      ) as Array<any & { _descriptions: string[] }>;
                      if (deduped.length === 0) return null;
                      
                      return (
                        <div key={category} className="space-y-2 mb-4" data-section-id={`source-category-${category}`}>
                          <Button
                            onClick={() => toggleSection(`source-category-${category}`)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl ${colorScheme.bg} ${colorScheme.hover} border ${colorScheme.border} transition-all duration-300 shadow-sm`}
                            variant="ghost"
                            size="lg"
                          >
                            <h4 className="font-bold text-gray-900 text-base">
                              {category} ({deduped.length} {deduped.length === 1 ? 'source' : 'sources'})
                            </h4>
                            {expandedSections[`source-category-${category}`] ? (
                              <Minus className="h-4 w-4 text-gray-600" />
                            ) : (
                              <Plus className="h-4 w-4 text-gray-600" />
                            )}
                          </Button>
                          
                          {expandedSections[`source-category-${category}`] && (
                  <div className={`pl-2 space-y-3 animate-in slide-in-from-top duration-200 bg-white rounded-lg p-4 border ${colorScheme.border}`}>
                              {deduped.map((source, sourceIndex) => (
                                <div key={sourceIndex} className="border-l-3 border-gray-400/40 pl-4 py-2">
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-900 mt-1 flex-shrink-0">•</span>
                                    <div>
                                      <h5 className="font-semibold text-gray-900">
                                        {(() => {
                                          // Title and optional year (clean markdown italics from title)
                                          const rawTitle = (source.title || '').replace(/\*(.*?)\*/g, '$1').replace(/_(.*?)_/g, '$1');
                                          const baseTitle = rawTitle || 'Title Not Available';
                                          const titleYearMatch = (source.title || '').match(/\((19|20)\d{2}\)/);
                                          const descYearMatch = (source.description || '').match(/\b(19|20)\d{2}\b/);
                                          const yearText = titleYearMatch?.[0] || (descYearMatch ? ` (${descYearMatch[0]})` : '');
                                          const displayTitle = baseTitle.includes('(') ? baseTitle : `${baseTitle}${yearText}`;

                                          // Authors (clean stray quotes)
                                          const authors = (source.authors || '').replace(/"/g, '');

                                          // Format: "Book Title (Year) by Authors"
                                          return (
                                            <>
                                              {displayTitle}
                                              {authors && (
                                                <span className="font-normal text-gray-600">
                                                  {' by '}{authors}
                                                </span>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </h5>
                                      {(() => {
                                        const clean = (text: string) =>
                                          (text || '')
                                            .replace(/\*\*(.*?)\*\*/g, '$1')
                                            .replace(/_(.*?)_/g, '$1')
                                            .replace(/\s*—\s*/g, ' — ')
                                            .replace(/"/g, '')
                                            .trim();
                                        const normalize = (s: string) =>
                                          s
                                            .toLowerCase()
                                            .replace(/\((19|20)\d{2}\)/g, '') // strip years
                                            .replace(/[^a-z0-9\s]/g, '')
                                            .replace(/\s+/g, ' ')
                                            .trim();

                                        const baseTitleForCompare = clean((source.title || ''));
                                        const uniqueDescriptions = Array.from(
                                          new Set(((source._descriptions as string[] | undefined) || [source.description as string])
                                            .map((d: string) => clean(d)))
                                        )
                                          .filter(Boolean)
                                          // drop descriptions that are just the title repeated
                                          .filter(d => normalize(d) !== normalize(baseTitleForCompare));

                                        if (uniqueDescriptions.length === 0) return null;

                                        return (
                                      <p className="text-sm text-gray-700 leading-relaxed mt-1">
                                            {uniqueDescriptions.join(' • ')}
                                          </p>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps Section with Glassmorphism Background */}
          <div className="mt-6 p-6 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-xl">
            {/* Suggestion Button */}
            <div className="mb-6">
              <SuggestionButton pageType="tasks" />
            </div>

                      {/* Navigation Options - Excluding Life Areas */}
          <div className="space-y-4">
            {/* Mobile: Simple stacked buttons */}
            <div className="block lg:hidden space-y-3">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/feelings'}
                className="w-full p-4 text-center h-auto border-2 hover:bg-pink-50 dark:hover:bg-pink-900/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium text-gray-900 dark:text-white">Browse by Feelings</span>
                </div>
              </Button>

              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/barriers'}
                className="w-full p-4 text-center h-auto border-2 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <Construction className="h-5 w-5" />
                  <span className="font-medium text-gray-900 dark:text-white">Browse by Barriers</span>
                </div>
              </Button>

              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/complex_loops'}
                className="w-full p-4 text-center h-auto border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <RotateCcw className="h-5 w-5" />
                  <span className="font-medium text-gray-900 dark:text-white">Browse by Complex Loops</span>
                </div>
              </Button>

              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/identities'}
                className="w-full p-4 text-center h-auto border-2 hover:bg-pink-50 dark:hover:bg-pink-900/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <Rainbow className="h-5 w-5" />
                  <span className="font-medium text-gray-900 dark:text-white">Browse by Identity</span>
                </div>
              </Button>

              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/systems'}
                className="w-full p-4 text-center h-auto border-2 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <Puzzle className="h-5 w-5" />
                  <span className="font-medium text-gray-900 dark:text-white">Go to Systems Lab</span>
                </div>
              </Button>
            </div>

            {/* Desktop: Detailed cards with descriptions */}
            <div className="hidden lg:block space-y-4">
              {/* Top Row - Feelings and Barriers */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/feelings'}
                  className="p-4 text-left h-auto border-2 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Feeling stuck emotionally?</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Feelings</div>
                    </div>
                  </div>
                </Button>

                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/barriers'}
                  className="p-4 text-left h-auto border-2 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  <div className="flex items-center gap-3">
                    <Construction className="h-5 w-5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Encountering barriers?</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Barriers</div>
                    </div>
                  </div>
                </Button>
              </div>

              {/* Middle Row - Complex Loops and Identity */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/complex_loops'}
                  className="p-4 text-left h-auto border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Stuck in repetitive patterns?</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">→ Browse Complex Loops</div>
                    </div>
                  </div>
                </Button>

                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/identities'}
                  className="p-4 text-left h-auto border-2 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                >
                  <div className="flex items-center gap-3">
                    <Rainbow className="h-5 w-5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Need identity-aware support?</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">→ Browse by Identity</div>
                    </div>
                  </div>
                </Button>
              </div>

              {/* Bottom Row - Systems Lab */}
              <div className="grid grid-cols-1 gap-4">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/systems'}
                  className="p-4 text-left h-auto border-2 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <div className="flex items-center gap-3">
                    <Puzzle className="h-5 w-5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Want to build a system around this?</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Systems Lab</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Need more help? Check out our <Link href="/guides" className="text-blue-600 hover:underline">guides</Link>, <Link href="/scripts" className="text-blue-600 hover:underline">scripts</Link>, <Link href="/quizzes" className="text-blue-600 hover:underline">quizzes</Link>, or <Link href="/resources" className="text-blue-600 hover:underline">resources</Link>.</p>
          </div>
          
          </div> {/* Close glassmorphism container */}
        </div>
      </div>
      
      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={content?.task_name || 'Task Page'}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        description={`Get help with ${content?.task_name?.toLowerCase() || 'this task'} - ADHD-friendly strategies and support.`}
      />
    </div>
  )
}
