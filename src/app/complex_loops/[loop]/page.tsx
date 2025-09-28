'use client'

import React, { use } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Plus, Minus, Share2, Brain, Heart, 
  Wrench, Rainbow, Construction,
  XCircle, Lightbulb, Target,
  BookOpen, Zap, Star, Clock,
  Settings, Mail, ClipboardList,
  ShoppingCart, Utensils, Bed,
  Calendar, Sparkles, Key, Flame, Laptop,
  MessageSquareText, Users, AlertCircle, ArrowLeftRight, Puzzle,
  ShoppingBag, AlarmClock, CalendarX, CalendarCheck, CalendarClock,
  Timer, HeartCrack, UserMinus, UserX, MessagesSquare, MailQuestion,
  HeartHandshake, MessageCircleQuestion, CircleDashed,
  UtensilsCrossed, Building2, Dumbbell, Moon, BellRing, BatteryLow,
  Briefcase, Activity, TrendingUp, Award, Music,
  Phone, Smartphone, Globe, Palette, Link as LinkIcon, Dice1 as Dice, Home, Pill, Car,
  CookingPot, Shirt, Bath, PhoneCall, Receipt, ScrollText, Trash2, 
  Hammer, Crown, Shield, Gem, Rocket, Medal, Flower, Leaf
} from 'lucide-react'
import FixedBottomActions from '@/components/ui/FixedBottomActions'
import { Button } from '@/components/ui/button'
import { TargetedCrisisMode } from '@/components/ui/TargetedCrisisMode'
import { getComplexLoopsContent, getComplexLoopSources } from '@/lib/supabase'
import type { ComplexLoopsContent } from '@/lib/supabase'
import { SuggestionButton } from '@/components/ui/SuggestionButton';
import AdhdReasonsThreeCol, { type Row as AdhdRow } from '@/components/ui/AdhdReasonsThreeCol'
import FrameworkSection, { type FrameworkSections } from '@/components/ui/FrameworkSection'
import CorePrinciplesCondensed from '@/components/ui/CorePrinciplesCondensed'
import { ShareModal } from '@/components/ui/ShareModal';

// Short, ADHD‑friendly subtitles for section headers
const getSectionSubtitle = (title: string): string => {
  const t = (title || '').toLowerCase()
  if (t.includes('core principles')) return 'The few big ideas to keep you steady when your brain spirals'
  if (t.includes('strategies')) return 'Tiny, do‑able moves to break the loop right now'
  if (t.includes('mindset')) return 'Gentle reframes that lower pressure and unlock action'
  if (t.includes('encouragement')) return 'A quick pep talk to take with you when it’s tough'
  if (t.includes('tools')) return 'Practical helpers you can grab fast when you need them'
  if (t.includes('examples')) return 'Real‑life patterns and how people shift them'
  if (t.includes('common mistakes')) return 'What trips folks up, and how to avoid it without shame'
  if (t.includes('checklist')) return 'A simple list so your brain doesn’t have to remember it all'
  if (t.includes('faq')) return 'Quick answers to the questions that pop up a lot'
  // ADHD reasons header
  if (t.includes('why') && t.includes('hard with adhd')) return 'Connect what you feel with what’s happening in your brain, no shame, just clarity'
  // Generic fallback
  return 'Open for a quick, plain‑language guide to help you move forward'
}

import { formatMarkdownTextWithIntelligence } from '@/lib/utils'

// Direct mapping of loop names to Lucide icons (no emoji intermediary)
const getLoopIcon = (loopName: string): React.ElementType => {
  const loopIconMap: Record<string, React.ElementType> = {
    // Brain is first as required, then organized by category
    'Analysis Paralysis': Brain,
    
    // Social & Communication - each gets unique icon
    'ADHD & Social Media': Share2,
    'Phone Scrolling': Smartphone,
    'Replying to Texts': MessagesSquare,
    'Email Overwhelm': MailQuestion,
    'Friendships & ADHD': Users,
    'Intimacy & Connection': HeartHandshake,
    'Difficult Conversations': MessageCircleQuestion,
    
    // Time & Scheduling - each gets unique icon
    'Chronic Lateness': AlarmClock,
    'Missed Appointments': CalendarX,
    'Last-Minute Cancelling': CalendarCheck,
    'Double-Booking Yourself': CalendarClock,
    'Waiting Mode': Timer,
    
    // Sleep & Energy - each gets unique icon
    'Bedtime Procrastination': Clock,
    'Can\'t Fall Asleep': Moon,
    'Sleeping Through Alarms': BellRing,
    'Constantly Tired': BatteryLow,
    
    // Eating & Health - each gets unique icon
    'Overeating': Utensils,
    'Undereating': UtensilsCrossed,
    'Workout Avoidance': Dumbbell,
    
    // Shopping & Decision Making - each gets unique icon
    'Online Shopping': ShoppingBag,
    'Decision Overwhelm': CircleDashed,
    'Perfectionism Cycles': Target,
    
    // Emotional & Mental Health - each gets unique icon
    'People-Pleasing Burnout': HeartCrack,
    'Rejection Sensitivity Loops': UserMinus,
    'Masking Exhaustion': UserX,
    
    // Work & Career - each gets unique icon
    'Job Searching': Building2,
    
    // Special sections
    'Encouragement to Take With You': Heart,
  }
  
  return loopIconMap[loopName] || Puzzle // Default fallback
}

// Simple emoji to icon mapping for content sections
const getSectionIcon = (emoji: string): React.ElementType => {
  const sectionIconMap: Record<string, React.ElementType> = {
    // Core universal emojis - expanded mapping to prevent repetition
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
    '⏱️': Timer,
    '⏳': Clock,
    '📅': Calendar,
    '🗓️': Calendar,
    
    // Communication & Information
    '📞': PhoneCall,
    '📱': Phone,
    '✉️': Mail,
    '📧': Mail,
    '💬': MessageSquareText,
    '📋': ClipboardList,
    '📝': ScrollText,
    '📄': Receipt,
    '📊': TrendingUp,
    '📈': TrendingUp,
    
    // Digital & Technology
    '💻': Laptop,
    '🖥️': Laptop,
    '📲': Phone,
    '🔗': LinkIcon,
    '🌐': Globe,
    '📺': Laptop,
    
    // Health & Body
    '🧘': Users, // Meditation
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
    '🛍️': ShoppingBag, // Shopping bags
    
    // Home & Living
    '🏠': Home,
    '🚪': Home, // Door
    '🛏️': Bed, // Bed
    '🧹': Wrench, // Broom/cleaning
    '🧽': Construction, // Sponge
    '🗑️': Trash2, // Trash
    '♻️': Trash2, // Recycling
    
    // Work & Business
    '💼': Briefcase,
    '👔': Briefcase, // Necktie/professional
    '📈_trend': TrendingUp,
    '💰': Award, // Money bag
    '💳': Receipt, // Credit card
    '🏢': Building2, // Office building
    
    // Transportation
    '🚗': Car,
    '🚌': Car, // Bus
    '🚇': Car, // Metro
    '✈️': Car, // Airplane
    '🚲': Car, // Bicycle
    
    // Education & Learning
    '📚': BookOpen,
    '📖': BookOpen, // Open book
    '✏️_pencil': ScrollText, // Pencil
    '📝_memo': ScrollText, // Memo
    '🎓': Award, // Graduation cap
    '🔬': Settings, // Microscope
    
    // Emotions & Feelings
    '😴': Moon, // Sleeping
    '😰': AlertCircle, // Anxious
    '😵': CircleDashed, // Dizzy
    '🤯': Brain, // Mind blown
    '😤': Flame, // Huffing
    '💔': HeartCrack, // Broken heart
    '🤝': HeartHandshake, // Handshake
    '👥': Users, // People
    '👤': UserMinus, // Person
    '🚫': UserX, // Prohibited
    
    // Creative & Arts
    '🎨': Palette,
    '🖌️': Palette, // Paintbrush
    '✂️': Palette, // Scissors
    '🎭': Palette, // Theater masks
    '🎵': Music, // Musical note
    '🎶': Music, // Musical notes
    
    // Miscellaneous useful icons
    '⭐_star': Star,
    '🌟_sparkle': Sparkles, // Glowing star
    '💎_gem': Gem, // Diamond
    '👑_crown': Crown, // Crown
    '🔑_key': Key, // Key
    '🎲_dice': Dice, // Game die
    '🧩_puzzle': Puzzle, // Puzzle piece
    '🎪_circus': Target, // Circus tent
    '🌈_rainbow': Rainbow, // Rainbow
    '👕_shirt': Shirt,
    '🧼_bath': Bath,
    '📞_phone': PhoneCall,
    '✉️_mail': Mail,
    '💰_money': Receipt,
    '📄_doc': ScrollText,
    '🗑️_trash': Trash2,
    '🔧_tool': Hammer,
    '⚙️_settings': Settings,
    '🎪_tent': Crown,
    '🎭_mask': Shield,
    '🔮_crystal': Gem,
    '🏆_trophy': Award,
    '🌟_star': Star,
    '🌈_prism': Rainbow,
    '🎵_music': Music,
    '📊_chart': Activity,
    '📈_up': TrendingUp,
    '🚀_rocket': Rocket,
    '🧩_piece': Puzzle,
    '🔗_link': LinkIcon,
    '🌐_globe': Globe,
    '⭐_medal': Medal,
    '💎_jewel': Key,
    '🛡️_shield': Shield,
    '🌱_sprout': Flower,
    '🌿_leaf': Leaf,
    '💬_chat': Heart, // Encouragement sections
    '🧭_compass': Construction, // Navigation sections
    '❤️_support': HeartHandshake // Support sections
  }
  
  return sectionIconMap[emoji] || Settings // Default fallback
}

interface ComplexLoopPageProps {
  params: Promise<{
    loop: string
  }>
}

export default function ComplexLoopPage({ params }: ComplexLoopPageProps) {
  const resolvedParams = use(params)
  const [content, setContent] = useState<ComplexLoopsContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({})
  const [isFrameworkExpanded, setIsFrameworkExpanded] = useState(false)
  const [copySuccess] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isCrisisModeOpen, setIsCrisisModeOpen] = useState(false)
  const [sources, setSources] = useState<Array<{ id: number; loop_slug: string; category: string; title: string; authors: string | null; description: string }> | null>(null)

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        
        // Convert URL param back to display name with smarter normalization
        const slugParam = decodeURIComponent(resolvedParams.loop)
        let loopName = slugParam
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace(/\bAnd\b/g, '&')
          .replace(/Cant/gi, "Can't")

        // Map display names to database names
        if (loopName === 'Social Media') {
          loopName = 'ADHD & Social Media'
        }
        // Handle hyphenated names that lose hyphens in URL conversion
        if (loopName === 'Last Minute Cancelling') {
          loopName = 'Last-Minute Cancelling'
        }
        if (loopName === 'Double Booking Yourself') {
          loopName = 'Double-Booking Yourself'
        }
        if (loopName === 'Can T Fall Asleep' || loopName === 'Cant Fall Asleep') {
          loopName = "Can't Fall Asleep"
        }
        // Use curly apostrophe variant to match DB row
        if (slugParam === 'cant-fall-asleep') {
          loopName = 'Can’t Fall Asleep'
        }
        if (loopName === 'Screen Free Zones') {
          loopName = 'Screen-Free Zones'
        }
        if (loopName === 'People Pleasing Burnout') {
          loopName = 'People-Pleasing Burnout'
        }

        const { data, error } = await getComplexLoopsContent(loopName)
        
        if (error) {
          setError(`Failed to load complex loop content: ${error.message}`)
        } else if (data) {
          setContent(data)
          // Map route slug to sources slug when names differ
          const routeSlug = resolvedParams.loop
          const mapRouteToSourcesSlug: Record<string, string> = {
            'job-searching': 'job-search',
            'double-booking-yourself': 'double-booking-self',
            'last-minute-cancelling': 'last-min-cancelling',
            'rejection-sensitivity-loops': 'rsd-loops',
            'replying-to-texts': 'text-message-avoidance',
            'adhd-and-social-media': 'social-media-spirals',
            'sleeping-through-alarms': 'sleeping-thru-alarms',
            "can't-fall-asleep": 'cant-fall-asleep',
          }
          const sourcesSlug = mapRouteToSourcesSlug[routeSlug] || routeSlug
          const { data: srcData, error: srcError } = await getComplexLoopSources(sourcesSlug)
          if (!srcError && srcData && srcData.length > 0) {
            setSources(srcData as typeof sources)
          }
        } else {
          setError('Complex loop content not found')
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error('Error fetching complex loop content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [resolvedParams.loop])

  const goBack = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    
    if (category) {
      window.location.href = `/complex_loops?category=${encodeURIComponent(category)}`
    } else {
      if (document.referrer && document.referrer.includes('/complex_loops')) {
        window.history.back()
      } else {
        window.location.href = '/complex_loops'
      }
    }
  }

  const handleShare = () => {
    // Always show the custom share modal
    setIsShareModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-lg">Breaking down your pattern with ADHD insights...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-md text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Complex Loop Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error || 'This complex loop content is not available yet.'}
          </p>
          <Button onClick={goBack} variant="default" size="default" className="bg-blue-500 hover:bg-blue-600 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Complex Loops
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="max-w-5xl mx-auto px-6 py-4 sm:py-6 md:py-8 pt-8 sm:pt-10 md:pt-12">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg">
          {/* Header */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="default"
                onClick={goBack}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-2 sm:gap-3">
                  {React.createElement(getLoopIcon(content.loop_name), {
                    className: "h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0"
                  })}
                  <span className="break-words truncate">
                    {content.loop_name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </h1>
                {content.subtitle && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 truncate">
                    {content.subtitle}
                  </p>
                )}
              </div>
              <div className="relative flex items-center flex-shrink-0">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={handleShare}
                  className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
                  title={copySuccess ? "Link copied!" : "Share this page"}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                {copySuccess && (
                  <div className="absolute -top-8 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                    Link copied!
                  </div>
                )}
              </div>
            </div>


            {/* Intro Paragraph - Blue callout box */}
            <div className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 pl-5 py-5 mb-4 sm:mb-6 md:mb-8 rounded-r-lg">
              <div className="text-lg md:text-xl text-black dark:text-white leading-relaxed"
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

          {/* Side-by-Side Toggle Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Left Box - Soft Start */}
            <div className="relative">
              <Button
                onClick={() => toggleSection('gentle-advice')}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#61ffb5]/40 hover:shadow-md transition-shadow duration-300 border border-[#A0E8AF]/60 min-h-[60px] touch-manipulation"
                variant="ghost"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#2D9C3C]" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Soft Start
                  </h3>
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
                <div className="bg-[#61ffb5]/40 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 animate-in slide-in-from-top duration-300 border border-[#A0E8AF]/60 mt-2">
                  <p className="text-base text-gray-900 leading-relaxed">
                    {formatMarkdownTextWithIntelligence(content.gentle_advice, 'complex_loops')}
                  </p>
                </div>
              )}
            </div>

            {/* Right Box - Tough Love */}
            <div className="relative">
              <Button
                onClick={() => toggleSection('stern-advice')}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#ff61ab]/40 hover:shadow-md transition-shadow duration-300 border border-[#FF9EBB]/60 min-h-[60px] touch-manipulation"
                variant="ghost"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#D23369]" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Tough Love
                  </h3>
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
                <div className="bg-[#ff61ab]/40 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 animate-in slide-in-from-top duration-300 border border-[#FF9EBB]/60 mt-2">
                  <p className="text-base text-gray-900 leading-relaxed">
                    {formatMarkdownTextWithIntelligence(content.stern_advice, 'complex_loops')}
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
              <p className="text-sm font-medium">Explore when you&apos;re ready</p>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
          </div>

          <div className="mb-8">

            {/* Framework Section - replaces ADHD Reasons */}
            {content.loop_type && content.framework_title && content.framework_sections && (
              <FrameworkSection
                loopName={content.loop_name}
                loopType={content.loop_type}
                frameworkTitle={content.framework_title}
                frameworkSections={content.framework_sections}
                isExpanded={isFrameworkExpanded}
                onToggle={() => setIsFrameworkExpanded(!isFrameworkExpanded)}
              />
            )}
            
            {/* Fallback to old ADHD Reasons section if new framework data is not available */}
            {(!content.loop_type || !content.framework_sections) && content.adhd_reasons && content.adhd_reasons.length > 0 && (
              <div className="rounded-2xl transition-all duration-300 mb-4 bg-white border border-[#FBF8CC]">
                <button
                  onClick={() => toggleSection('adhd-reasons')}
                  className="w-full p-5 md:p-6 text-left rounded-2xl transition-all duration-300 flex items-center justify-between group"
                  title={expandedSections['adhd-reasons'] ? 'Close section' : 'Open section'}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FBF8CC] rounded-lg flex-shrink-0">
                      <Brain className="h-5 w-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">Why {content.loop_name} is Hard with ADHD</h3>
                      <p className="text-sm text-gray-700 mt-0.5">Connect what you feel with what’s happening in your brain, no shame, just clarity</p>
                    </div>
                  </div>
                  {expandedSections['adhd-reasons'] ? (
                    <Minus className="h-5 w-5 text-black flex-shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-black flex-shrink-0" />
                  )}
                </button>
                
                {expandedSections['adhd-reasons'] && (
                  <div className="px-5 md:px-6 pb-5 md:pb-6 animate-in slide-in-from-top duration-300 border-t border-[#D9D9FF] bg-white">
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
                          const emojiMatch = s.match(/^(\p{Extended_Pictographic})\s+(.+)/u) || s.match(/^([\u{2300}-\u{23FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1FAFF}])\s+(.+)/u)
                          let rest = s; let emoji: string | null = null
                          if (emojiMatch) { emoji = emojiMatch[1]; rest = emojiMatch[2] }
                          rest = sanitize(rest.replace(/^[\uFFFD\s]+/, ''))
                          
                          // Handle corrupted data with repeated patterns
                          // Remove leading dash
                          rest = rest.replace(/^-\s*/, '')
                          
                          // Find the first **Title** and extract it
                          const titleMatch = rest.match(/\*\*([^*]+)\*\*/)
                          if (titleMatch) {
                            const title = titleMatch[1]
                            // Find where the actual description starts (after the repetitive pattern)
                            const afterTitle = rest.substring(titleMatch.index! + titleMatch[0].length)
                            
                            // Look for the pattern ": - Title: - Title: - Title: actual description"
                            // Extract the final description after repetitive patterns
                            let desc = afterTitle
                              .replace(/^:\s*/, '') // Remove initial colon
                              .replace(/(- [^:]+:\s*)+/, '') // Remove repeated "- something: " patterns
                              .replace(/^-\s*/, '') // Remove any leading dash from description
                              .trim()
                            
                            return { emoji, heading: title, desc }
                          }
                          
                          const boldMatch = rest.match(/^\*\*(.*?)\*\*[:：]?\s*(.*)?$/)
                          if (boldMatch) return { emoji, heading: boldMatch[1], desc: boldMatch[2] || '' }
                          return { emoji, heading: null, desc: rest }
                        }

                        const rights = whatsReallyGoingOnItems
                          .map(parseRight)
                          .filter(r => (r.heading && r.heading.trim()) || (r.desc && r.desc.trim()))

                        const seemsRight = (text: string) => /^(\p{Extended_Pictographic}\s+)/u.test(text) || /^\*\*.+?\*\*/.test(text) || /(executive dysfunction|time blindness|working memory|motivation|shame)/i.test(text)
                        const manualRights: Record<number, { emoji: string | null; heading: string | null; desc: string }> = {}
                        const lefts = rawLefts.map((left, idx) => {
                          if (!seemsRight(left)) return left
                          const r = parseRight(left)
                          manualRights[idx] = r
                          let candidate = sanitize(left)
                            .replace(/^(\p{Extended_Pictographic}\s*)/u, '')
                            .replace(/\*\*[^*]+\*\*/g, '')
                            .replace(/^[—:\-\s]+/, '')
                            .trim()
                          if (!candidate) {
                            candidate = r.heading ? `${r.heading} shows up in your day-to-day` : 'Notice this pattern popping up'
                          }
                          candidate = candidate.charAt(0).toUpperCase() + candidate.slice(1)
                          return candidate
                        })

                        const guessRight = (left: string): { emoji: string; heading: string; desc: string } => {
                          const t = left.toLowerCase()
                          if (/(tab|forget|remember|meeting|agreed|follow\s*up|checked|scheduled)/.test(t)) {
                            return { emoji: '🧠', heading: 'Working memory failures', desc: 'your brain is juggling a lot, so details slip without reminders' }
                          }
                          if (/(avoid|boring|complex|start|starting|begin|multi\s*step|plan)/.test(t)) {
                            return { emoji: '🧩', heading: 'Executive dysfunction', desc: "getting started is hard when your brain can&apos;t pick a first step or feel the spark" }
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

                        const pairs = lefts.map((left, i) => ({ left, right: manualRights[i] || rights[i] || guessRight(left) }))

                        const toLeftMicro = (text: string, index: number) => {
                          const t = text.toLowerCase()
                          if (/(struggle|hard|difficult)\s+to\s+start|getting\s+started/.test(t)) return { label: 'Struggle to start', text, emoji: '🧊' }
                          if (/avoid(ing)?\s+starting/.test(t)) return { label: 'Avoid starting', text, emoji: '🚧' }
                          if (/perfect(ing)?|polish|refine/.test(t)) return { label: 'Perfecting for hours', text, emoji: '🧵' }
                          if (/keep\s+tweak|tweak(ing)?/.test(t)) return { label: 'Keep tweaking', text, emoji: '🔧' }
                          if (/trash|delete|throw\s+away/.test(t)) return { label: 'Trash what you started', text, emoji: '🗑️' }
                          if (/hyperfocus/.test(t)) return { label: 'Hyperfocus for hours', text, emoji: '🔭' }
                          if (/(running|always).*late|late\b/.test(t)) return { label: 'Running late', text, emoji: '⏱️' }
                          if (/guilt|shame/.test(t)) return { label: 'Guilt or shame', text, emoji: '😔' }
                          if (/re-?read/.test(t)) return { label: 'Lost in the page', text: 'Re-read the same page and don’t remember it later', emoji: '📖' }
                          if (/freeze/.test(t) || (/plan/.test(t) && /start/.test(t))) return { label: 'Freeze at the start', text: 'Plan, then freeze at start', emoji: '🧊' }
                          if (/tabs?|browser|doomscroll|scroll|youtube|tiktok|twitter|instagram|reddit/.test(t)) return { label: 'Stuck in tabs', text: 'Browser tabs and feeds pull you away', emoji: '💻' }
                          if (/lose\s*track|what\s*comes\s*next|materials/.test(t)) return { label: 'Misplaced next step', text: 'Lose track of materials/next step', emoji: '🗂️' }
                          if (/forget/.test(t)) return { label: 'Forget what you studied', text, emoji: '🧠' }
                          if (/energy|interest|crash/.test(t)) return { label: 'Energy crash', text, emoji: '🔋' }
                          if (/plan(ning)?\s+but\s+not\s+doing|loop of planning/.test(t)) return { label: 'Planning loop', text, emoji: '🗺️' }
                          if (/overwhelm/.test(t)) return { label: 'Overwhelmed', text, emoji: '🌊' }
                          if (/anxiety|nervous/.test(t)) return { label: 'Anxious to start', text, emoji: '😰' }
                          if (/distract|notification|ping/.test(t)) return { label: 'Started… then wandered off', text: 'Got sidetracked halfway and never came back', emoji: '🔔' }
                          const fallback = ['✨','🧭','📌','🔁','🧿','🪄','🪁']
                          const label = text.split(/[,.]/)[0].split(/\s+/).slice(0, 4).join(' ')
                          return { label: label.charAt(0).toUpperCase() + label.slice(1), text, emoji: fallback[index % fallback.length] }
                        }


                        const rows: AdhdRow[] = pairs.map((pair, i) => {
                          const r = typeof pair.right === 'string' ? parseRight(pair.right) : pair.right
                          const leftBase = toLeftMicro(pair.left, i)
                          const lower = (leftBase.text || '').toLowerCase()
                          let youMightTitle = leftBase.label
                          let youMightBody: string | undefined = undefined
                          if (/tabs?|browser|doomscroll|scroll|youtube|tiktok|twitter|instagram|reddit/.test(lower)) {
                            youMightTitle = 'Open one tab, end up with 12'
                            youMightBody = 'Lose track of your original task'
                          } else if (/freeze|can'?t start|hard to start|struggle to start/.test(lower)) {
                            youMightTitle = 'Open your laptop… and just stare'
                            youMightBody = 'Everything feels too big to begin'
                          } else if (/hyperfocus/.test(lower)) {
                            youMightTitle = 'Look up and it’s 4 hours later'
                            youMightBody = 'Lost the sense of time passing'
                          } else if (/(running|always).*late|late\b/.test(lower)) {
                            youMightTitle = 'Leave early, still arrive late'
                            youMightBody = 'Pre‑leave steps stole the buffer'
                          } else if (/guilt|shame|behind/.test(lower)) {
                            youMightTitle = 'Beat yourself up for being “behind”'
                            youMightBody = 'Motivation drops when shame spikes'
                          }

                          // Add context examples for loops (work, social, sleep, etc.)
                          const loopCtx = (content.loop_name || '').toLowerCase()
                          if (!youMightBody) {
                            if (/email|text|reply|messages/.test(loopCtx)) {
                              youMightBody = 'Put off replying; now there’s a “just checking in” message'
                            } else if (/lateness|appointments|calendar/.test(loopCtx)) {
                              youMightBody = 'Ran out of prep time; running late again'
                            } else if (/bedtime|sleep/.test(loopCtx)) {
                              youMightBody = 'Scroll late; the morning alarm hits hard'
                            }
                          }
                          const normalizeHeading = (h?: string | null) => {
                            const raw = (h || '').trim()
                            const k = raw.toLowerCase()
                            if (!raw || k === 'insight' || k.includes('context matters')) {
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
                          const whats = {
                            title: (normalizeHeading(r.heading).replace(/[—–-]+\s*$/, '') + ':') as string,
                            body: String(r.desc || '').replace(/^[\s—–-]+/, '')
                          }
                          const tips: string[] = []
                          const b = `${whats.title} ${whats.body}`.toLowerCase()
                          const push = (t: string) => { if (!tips.includes(t)) tips.push(t) }
                          if (/tabs?|browser|attention/.test(lower+b)) {
                            push('Close extra tabs before starting')
                            push('Park links in a later window')
                            push('Use one‑tab full‑screen mode')
                          }
                          if (/executive|start|initiat|prioritiz/.test(b)) {
                            push('Do a 5‑4‑3‑2‑1 countdown')
                            push('Open the doc and type 1 line')
                          }
                          if (/time|blind|planning fallacy|transition/.test(b)) {
                            push('Set a visible timer 20–30 min')
                            push('Add +15 min buffer')
                            push('Run two alarms: wrap‑up + leave')
                          }
                          if (/working memory|remember|forget|sequence/.test(b)) {
                            push('Use a door or desk checklist')
                            push('Write a one‑sentence recap')
                          }
                          if (/rsd|shame|motivation|urgency/.test(b)) {
                            push('Name it: “time blind, not lazy”')
                            push('Take a 30‑sec reset')
                            push('Body‑double for a micro‑win')
                          }
                          const howTo = tips.slice(0, 3)
                          return {
                            icon: leftBase.emoji,
                            youMight: { title: youMightTitle, body: youMightBody },
                            whatsGoingOn: whats,
                            howTo: howTo.length ? howTo : ['Start with 1 tiny action', 'Make it visible', 'Summarize aloud']
                          }
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
                              else if (/forget|remember/.test(src)) title = 'Lose your place'
                              else if (/(materials|what comes next|next step)/.test(src)) title = 'Lose track of what’s next'
                              else if (/(energy|interest).*crash|crash/.test(src)) title = 'Energy dips stop the session'
                              else if (/tabs?|scroll/.test(src)) title = 'Open one tab, end up with 12'
                              else title = title + ' — part 2'
                            }
                            seen.add(key(title))
                            return { ...r, youMight: { ...r.youMight, title } }
                          })
                        }

                        const dedupedRows = ensureUniqueYouMight(rows, lefts)
                        return <AdhdReasonsThreeCol rows={dedupedRows} />
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content Sections (life_areas style) */}
          {content.content_sections && content.content_sections.length > 0 && (
            <div className="space-y-4">
              {content.content_sections.map((section, index) => {
                const colorSchemes = [
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#FDE4CF]', iconBg: 'bg-[#FDE4CF]', panelBg: 'bg-[#FDE4CF]/20' },
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#B9FBC0]', iconBg: 'bg-[#B9FBC0]', panelBg: 'bg-[#B9FBC0]/20' },
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#F1C0E8]', iconBg: 'bg-[#F1C0E8]', panelBg: 'bg-[#F1C0E8]/20' },
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#A3C4F3]', iconBg: 'bg-[#A3C4F3]', panelBg: 'bg-[#A3C4F3]/20' },
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#B9FBC0]', iconBg: 'bg-[#B9FBC0]', panelBg: 'bg-[#B9FBC0]/20' }
                ];
                const colors = colorSchemes[index % colorSchemes.length];
                const IconComponent = getSectionIcon(section.emoji);
                const sectionId = `section-${index}`;
                const isExpanded = expandedSections[sectionId];
                

                return (
                  <div key={index} className={`rounded-2xl ${colors.bg} border ${colors.border} transition-all duration-300`}>
                    <button
                      onClick={() => toggleSection(sectionId)}
                      className={`w-full p-6 text-left rounded-2xl transition-all duration-300 flex items-center justify-between group`}
                      title={isExpanded ? "Close section" : "Open section"}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${colors.iconBg} rounded-lg flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'scale-110' : 'group-hover:scale-105'}`}>
                          <IconComponent className="h-5 w-5 text-gray-900" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-0.5">{section.title}</h3>
                          <p className="text-sm text-gray-700">{getSectionSubtitle(section.title)}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <Minus className="h-5 w-5 text-black flex-shrink-0" />
                      ) : (
                        <Plus className="h-5 w-5 text-black flex-shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className={`px-4 sm:px-6 pb-3 sm:pb-4 animate-in slide-in-from-top duration-300 border-t ${colors.border} ${colors.panelBg} rounded-b-2xl`}>
                        {section.content && section.content.length > 0 && (
                          /^\s*core principles\s*$/i.test(section.title || '') ? (
                            (() => {
                              // Mirror life_areas formatting for Core Principles with corruption cleanup
                              const parse = (line: string) => {
                                const lines = (line || '').split('\n')
                                const mainLine = lines[0] || ''
                                // Capture the last emoji before title if multiple appear
                                const emojiPattern = /([\p{Extended_Pictographic}\u2600-\u27BF])\s*\*\*/gu
                                const emojis = [...mainLine.matchAll(emojiPattern)]
                                const lastEmoji = emojis.length > 0 ? emojis[emojis.length - 1][1] : ''
                                // Remove all emoji-** fragments and trailing **:** corruption
                                let cleanedLine = mainLine
                                  .replace(/^\s*-\s*/, '')
                                  .replace(/([\p{Extended_Pictographic}\u2600-\u27BF])\s*\*\*/gu, '')
                                  .replace(/\*\*:\*\*.*$/g, '')
                                  .trim()
                                // Parse title and desc: "Title**: Desc" or "Title: Desc"
                                const m = cleanedLine.match(/^(.*?)\*?\*?:\s*(.*)$/)
                                if (m){
                                  const title = m[1]
                                    .replace(/^[\p{Extended_Pictographic}\u2600-\u27BF\uFE0F\u200D\s]+/u,'')
                                    .replace(/[\*:]+$/g,'')
                                    .replace(/\*/g,'')
                                    .trim()
                                  const desc = m[2]
                                    .replace(/\s*-\s*Try:.*$/i,'')
                                    .replace(/[\*:]+$/g,'')
                                    .replace(/\*/g,'')
                                    .trim()
                                  return { icon: lastEmoji || '', title, desc }
                                }
                                // Fallback: treat the whole cleaned line as title
                                const fallbackTitle = cleanedLine.replace(/\*+/g,'').trim()
                                return { icon: lastEmoji || '', title: fallbackTitle, desc: '' }
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
                                if (picks.length === 0) { add('Set a visible 20–30 min timer'); add('Do one 60‑second starter action'); add('Write a 3‑step checklist you can reuse') }
                                return picks
                              }
                              const pool = ['✨','🧭','📌','🔁','🌱','🔎','🪄','🧠','🎯','⚡','⏰','💡']
                              const usedEmojis = new Set<string>()
                              const pickEmoji = (want?: string) => {
                                if (want && !usedEmojis.has(want)) { usedEmojis.add(want); return want }
                                const alt = pool.find(e => !usedEmojis.has(e)) || '✨'
                                usedEmojis.add(alt)
                                return alt
                              }
                              const usedTries = new Set<string>()
                              const pickTry = (title: string, desc: string) => {
                                const cands = tryCandidates(title, desc)
                                const choice = cands.find(c => !usedTries.has(c)) || cands[0]
                                usedTries.add(choice)
                                return choice
                              }
                              const raw = (section.content as string[])
                                .filter(l => !/^\s*-\s*try:/i.test(l))
                                .map(parse)
                              const items = raw.map(r => ({
                                icon: pickEmoji(r.icon),
                                title: r.title.slice(0, 120),
                                desc: r.desc,
                                try: pickTry(r.title, r.desc)
                              }))
                              return <CorePrinciplesCondensed items={items} />
                            })()
                          ) : (
                            <div className="space-y-2 sm:space-y-3 mb-2 sm:mb-3 pt-1 sm:pt-2">
                            {(() => {
                              const groupedContent: Array<{type: 'quote', items: string[]} | {type: 'bullet', item: string}> = [];
                              let currentQuoteGroup: string[] = [];
                              section.content.forEach((item) => {
                                if (item.startsWith('> ')) {
                                  currentQuoteGroup.push(item);
                                } else {
                                  if (currentQuoteGroup.length > 0) {
                                    groupedContent.push({ type: 'quote', items: currentQuoteGroup });
                                    currentQuoteGroup = [];
                                  }
                                  groupedContent.push({ type: 'bullet', item });
                                }
                              });
                                if (currentQuoteGroup.length > 0) groupedContent.push({ type: 'quote', items: currentQuoteGroup });
                              return groupedContent.map((group, groupIndex) => {
                                if (group.type === 'quote') {
                                  return (
                                      <div key={groupIndex} className={`border-l-4 border-blue-400 ml-6 pl-4 py-3 bg-blue-50/20 dark:bg-blue-900/20 rounded-lg space-y-2 hover:shadow-sm transition-shadow group/quote`}>
                                      {group.items.map((item, itemIndex) => (
                                          <div key={itemIndex} className="text-gray-900" dangerouslySetInnerHTML={{ 
                                            __html: item.replace('> ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/_(.*?)_/g, '<em>$1</em>') }} />
                                      ))}
                                    </div>
                                  )
                                } else {
                                    const html = group.item.replace(/^[\-]\s*/, '').replace(/\*\*([\p{Extended_Pictographic}\u2600-\u27BF\uFE0F\u200D\s]+)([^*]+)\*\*/u, '**$2**').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/_(.*?)_/g, '<em>$1</em>')
                                  return (
                                      <div key={groupIndex} className="flex items-baseline gap-3 ml-6 group/bullet hover:bg-gray-500/10 rounded-lg transition-colors mt-1">
                                        <span className="text-gray-900 flex-shrink-0 mt-0.5 text-lg group-hover/bullet:scale-110 transition-transform">•</span>
                                        <div className="text-gray-900 py-1" dangerouslySetInnerHTML={{ __html: html }} />
                                    </div>
                                  )
                                }
                                })
                            })()}
                          </div>
                          )
                        )}
                        
                        {/* Subsections */}
                        {section.subsections && section.subsections.length > 0 && (
                          <div className="space-y-4">
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
                                <div key={subIndex} className={`${subColors.bg} backdrop-blur-sm rounded-xl border ${subColors.border} transition-all duration-300`}>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toggleSection(subsectionId);
                                    }}
                                    className={`w-full p-4 text-left ${subColors.hover} rounded-xl transition-all duration-300 flex items-center justify-between group`}
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
                                    <div className="px-4 pb-4 animate-in slide-in-from-top duration-300">
                                      <div className="space-y-2 mt-2">
                                        {subsection.content.map((item, itemIndex) => (
                                          <div key={itemIndex} className="flex items-baseline gap-3 ml-6 group/bullet hover:bg-gray-500/10 rounded-lg transition-colors">
                                            <span className={`${subColors.textColor} flex-shrink-0 mt-0.5 text-lg group-hover/bullet:scale-110 transition-transform`}>•</span>
                                            <div className={`${subColors.textColor} text-base py-1`}
                                                 dangerouslySetInnerHTML={{ 
                                                   __html: item
                                                     .replace(/^-\s*/, '') // Remove leading dash and space
                                                     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                     .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                     .replace(/_(.*?)_/g, '<em>$1</em>')
                                                 }} 
                                            />
                                          </div>
                                        ))}
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
            </div>
          )}

          {/* Sources Section - life_areas style */}
          {sources && sources.length > 0 && (
            <div className="space-y-4 mt-4">
              <div className="rounded-2xl bg-white border border-[#D9D9FF] transition-all duration-300">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSection('sources');
                  }}
                  className="w-full p-5 md:p-6 text-left rounded-2xl transition-all duration-300 flex items-center justify-between group relative"
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
                  <div className="px-5 md:px-6 pb-5 md:pb-6 animate-in slide-in-from-top duration-300 border-t border-[#D9D9FF] bg-white">
                    {Object.entries(
                      (sources || []).reduce((acc, source) => {
                        const cat = source.category || 'Other'
                        if (!acc[cat]) acc[cat] = [] as typeof sources
                        (acc[cat] as typeof sources).push(source)
                        return acc
                      }, {} as Record<string, typeof sources>)
                    )
                      .sort(([, a], [, b]) => b.length - a.length)
                    .map(([category, categorySources], index) => {
                      const colors = [
                        { bg: 'bg-[#FBF8CC]/40', hover: 'hover:bg-[#FBF8CC]/60', border: 'border-[#FBF8CC]/60' },
                        { bg: 'bg-[#FDE4CF]/40', hover: 'hover:bg-[#FDE4CF]/60', border: 'border-[#FDE4CF]/60' },
                        { bg: 'bg-[#FFCFD2]/40', hover: 'hover:bg-[#FFCFD2]/60', border: 'border-[#FFCFD2]/60' },
                        { bg: 'bg-[#F1C0E8]/40', hover: 'hover:bg-[#F1C0E8]/60', border: 'border-[#F1C0E8]/60' },
                        { bg: 'bg-[#CFBAF0]/40', hover: 'hover:bg-[#CFBAF0]/60', border: 'border-[#CFBAF0]/60' },
                      ]
                      const scheme = colors[index % colors.length]

                      const normalized = (value: string) =>
                        (value || '')
                          .toLowerCase()
                          .replace(/[_*`~]/g, '')
                          .replace(/[^a-z0-9\s()&:+,-]/g, '')
                          .replace(/\s+/g, ' ')
                          .trim()

                      const deduped = Object.values(
                        (categorySources as typeof sources).reduce((acc, src) => {
                          const key = `${normalized(src.title)}::${normalized(src.authors || '')}`
                          if (!acc[key]) acc[key] = { ...src, _descriptions: [] as string[] }
                          if (src.description) acc[key]._descriptions.push(src.description)
                          return acc
                        }, {} as Record<string, (typeof sources)[0] & { _descriptions: string[] }>)
                      ) as Array<(typeof sources)[0] & { _descriptions: string[] }>

                      return (
                          <div key={category} className="space-y-2 mb-4">
                          <Button
                              onClick={() => setExpandedSections(prev => ({ ...prev, [`src-cat-${category}`]: !prev[`src-cat-${category}`] }))}
                            className={`w-full flex items-center justify-between p-4 rounded-xl ${scheme.bg} ${scheme.hover} border ${scheme.border} transition-all duration-300 shadow-sm`}
                            variant="ghost"
                            size="lg"
                          >
                            <h4 className="font-bold text-gray-900 text-base">
                              {category} ({categorySources.length} {categorySources.length === 1 ? 'source' : 'sources'})
                            </h4>
                            {expandedSections[`src-cat-${category}`] ? (
                              <Minus className="h-4 w-4 text-gray-600" />
                            ) : (
                              <Plus className="h-4 w-4 text-gray-600" />
                            )}
                          </Button>

                          {expandedSections[`src-cat-${category}`] && (
                              <div className={`pl-2 space-y-3 animate-in slide-in-from-top duration-200 bg-white rounded-lg p-4 border ${scheme.border}`}>
                              {deduped.map((source, sourceIndex) => (
                                <div key={sourceIndex} className="border-l-3 border-gray-400/40 pl-4 py-2">
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-900 mt-1 flex-shrink-0">•</span>
                                    <div>
                                      <h5 className="font-semibold text-gray-900">
                                        {(() => {
                                          const rawTitle = (source.title || '').replace(/\*(.*?)\*/g, '$1').replace(/_(.*?)_/g, '$1')
                                          const baseTitle = rawTitle || 'Title Not Available'
                                          const titleYearMatch = (source.title || '').match(/\((19|20)\d{2}\)/)
                                          const descYearMatch = (source.description || '').match(/\b(19|20)\d{2}\b/)
                                          const yearText = titleYearMatch?.[0] || (descYearMatch ? ` (${descYearMatch[0]})` : '')
                                          const displayTitle = baseTitle.includes('(') ? baseTitle : `${baseTitle}${yearText}`
                                          const authors = (source.authors || '').replace(/"/g, '')
                                          return (
                                            <>
                                              {displayTitle}
                                              {authors && (
                                                <span className="font-normal text-gray-600">{' by '}{authors}</span>
                                              )}
                                            </>
                                          )
                                        })()}
                                      </h5>
                                      {(() => {
                                        const clean = (text: string) => (text || '')
                                          .replace(/\*\*(.*?)\*\*/g, '$1')
                                          .replace(/_(.*?)_/g, '$1')
                                          .replace(/\s*—\s*/g, ' — ')
                                          .replace(/"/g, '')
                                          .trim()
                                        const normalize = (s: string) => s.toLowerCase().replace(/\((19|20)\d{2}\)/g, '').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()
                                        const baseTitleForCompare = clean((source.title || ''))
                                        const uniqueDescriptions = Array.from(new Set(((source._descriptions as string[] | undefined) || [source.description as string]).map((d: string) => clean(d))))
                                          .filter(Boolean)
                                          .filter(d => normalize(d) !== normalize(baseTitleForCompare))
                                        if (uniqueDescriptions.length === 0) return null
                                        return (<p className="text-sm text-gray-700 leading-relaxed mt-1">{uniqueDescriptions.join(' • ')}</p>)
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
          <div className="mt-8 p-8 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-xl">
            {/* Suggestion Button */}
            <div className="mb-8">
              <SuggestionButton pageType="complex_loops" />
            </div>

                      {/* Navigation Options - Excluding Complex Loops */}
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
                className="w-full p-4 text-center h-auto border-2 hover:bg-orange-100 dark:hover:bg-orange-900/40"
              >
                <div className="flex items-center justify-center gap-3">
                  <Construction className="h-5 w-5" />
                  <span className="font-medium text-gray-900 dark:text-white">Browse by Barriers</span>
                </div>
              </Button>

              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/life_areas'}
                className="w-full p-4 text-center h-auto border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <Wrench className="h-5 w-5" />
                  <span className="font-medium text-gray-900 dark:text-white">Browse by Life Areas</span>
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
                  className="p-4 text-left h-auto border-2 hover:bg-orange-100 dark:hover:bg-orange-900/40"
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

              {/* Middle Row - Tasks and Identity */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/life_areas'}
                  className="p-4 text-left h-auto border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Need help with specific life areas?</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Life Areas</div>
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
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Need more help? Check out our <Link href="/guides" className="text-purple-600 hover:underline">guides</Link>, <Link href="/scripts" className="text-purple-600 hover:underline">scripts</Link>, <Link href="/quizzes" className="text-purple-600 hover:underline">quizzes</Link>, or <Link href="/resources" className="text-purple-600 hover:underline">resources</Link>.</p>
          </div>
          
          </div> {/* Close glassmorphism container */}
        </div>
      </div>
      
      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={content?.loop_name || 'Complex Loop Page'}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        description={`Get help with ${content?.loop_name?.toLowerCase() || 'this complex loop'} - ADHD-friendly strategies and support.`}
      />

      {/* Targeted Crisis Mode Modal */}
      <TargetedCrisisMode
        contentName={content?.loop_name || ''}
        contentType="complex_loop"
        isOpen={isCrisisModeOpen}
        onClose={() => setIsCrisisModeOpen(false)}
        contentEmoji="🔄"
      />

      {/* Fixed Bottom Actions */}
      <FixedBottomActions
        slug={resolvedParams.loop}
        summaryHtml={content?.intro_paragraph ? `<p>${content.intro_paragraph}</p>` : ''}
        pageType="complex_loop"
        onOpenCrisisMode={() => setIsCrisisModeOpen(true)}
      />
    </div>
  )
}