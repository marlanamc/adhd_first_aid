'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { 
  ArrowLeft, Plus, Minus, Share2, Brain, Heart, 
  Wrench, RotateCcw, Rainbow, Construction,
  CheckCircle, XCircle, Lightbulb, Target,
  BookOpen, Zap, Star, Clock,
  Settings, Mail, ClipboardList,
  ShoppingCart, Utensils, Bed,
  Calendar, Sparkles, Key, Flame, Smartphone, Laptop,
  MessageSquareText, Users, AlertCircle, ArrowLeftRight, Puzzle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getComplexLoopsContent } from '@/lib/supabase'
import type { ComplexLoopsContent } from '@/lib/supabase'
import { SuggestionButton } from '@/components/ui/SuggestionButton';

// Function to convert markdown-style formatting to JSX with intelligent enhancement
const formatMarkdownText = (text: string) => {
  // If text already has markdown formatting, process it as-is
  if (text.includes('**') || text.includes('_')) {
    // First handle bold text (**text**)
    const withBold = text.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return { type: 'bold', content: part.slice(2, -2), key: `bold-${index}` };
      }
      return { type: 'text', content: part, key: `text-${index}` };
    });

    // Then handle italics (_text_) within each part
    const result: React.ReactNode[] = [];
    withBold.forEach((item) => {
      if (item.type === 'bold') {
        result.push(<strong key={item.key}>{item.content}</strong>);
      } else {
        // Process italics in text parts
        const italicParts = item.content.split(/(_[^_]+_)/).map((part, index) => {
          if (part.startsWith('_') && part.endsWith('_')) {
            return <em key={`${item.key}-italic-${index}`}>{part.slice(1, -1)}</em>;
          }
          return part;
        });
        result.push(...italicParts);
      }
    });

    return result;
  }

  // For plain text advice, add intelligent formatting
  // Key phrases and concepts that should be emphasized in advice for complex loops
  const emphasisPatterns = [
    // Emotional validation & loop-breaking support
    { pattern: /\b(you are safe|you're safe|you are enough|you're enough|you matter|this is valid|this is real)\b/gi, style: 'bold' },
    { pattern: /\b(not your fault|not weakness|not overreacting|not broken|not lazy|not stupid)\b/gi, style: 'bold' },
    { pattern: /\b(you can do this|you've got this|you're capable|you're learning|you can break this)\b/gi, style: 'bold' },
    
    // Loop recognition and interruption
    { pattern: /\b(notice the pattern|recognize the loop|catch yourself|awareness|mindfulness)\b/gi, style: 'bold' },
    { pattern: /\b(interrupt|break the cycle|stop the spiral|pause the loop|redirect)\b/gi, style: 'bold' },
    { pattern: /\b(choice point|decision moment|crossroads|turning point)\b/gi, style: 'bold' },
    
    // Core actions and techniques for breaking loops
    { pattern: /\b(breathe|pause|stop|slow down|take a break|rest|reset)\b/gi, style: 'bold' },
    { pattern: /\b(one step|one thing|small change|tiny shift|micro adjustment)\b/gi, style: 'bold' },
    { pattern: /\b(self-compassion|be kind|gentle with yourself|forgive yourself)\b/gi, style: 'bold' },
    
    // Pattern and behavioral insights
    { pattern: /\b(trigger|cue|signal|warning sign|red flag)\b/gi, style: 'bold' },
    { pattern: /\b(habit|pattern|cycle|loop|spiral|routine)\b/gi, style: 'bold' },
    { pattern: /\b(automatic|unconscious|default|reactive|impulsive)\b/gi, style: 'bold' },
    
    // Time and change reframes
    { pattern: /\b(right now|this moment|today|not forever|will pass|temporary)\b/gi, style: 'bold' },
    { pattern: /\b(progress not perfection|small wins|baby steps|gradual change)\b/gi, style: 'bold' },
    { pattern: /\b(practice|repetition|consistency|patience|persistence)\b/gi, style: 'bold' },
    
    // Loop-specific ADHD concepts
    { pattern: /\b(executive function|working memory|dopamine|motivation|regulation)\b/gi, style: 'bold' },
    { pattern: /\b(ADHD brain|neurodivergent|rejection sensitivity|emotional dysregulation)\b/gi, style: 'bold' },
    { pattern: /\b(overwhelm|shutdown|freeze|stuck|rumination|hyperfocus)\b/gi, style: 'bold' },
    { pattern: /\b(nervous system|fight or flight|stress response|cortisol)\b/gi, style: 'bold' },
    
    // Support and environment
    { pattern: /\b(support|help|community|accountability|therapy)\b/gi, style: 'bold' },
    { pattern: /\b(environment|setup|structure|boundaries|limits)\b/gi, style: 'bold' },
    
    // Gentle self-talk patterns for italics
    { pattern: /\b(maybe|perhaps|gently|softly|kindly|compassionately)\b/gi, style: 'italic' },
    { pattern: /\b(it's okay to|it's normal to|you're allowed to|you can|you might)\b/gi, style: 'italic' },
    { pattern: /\b(consider|try|experiment|explore|notice|observe)\b/gi, style: 'italic' },
    { pattern: /\b(when you feel ready|if it helps|as you can|at your own pace)\b/gi, style: 'italic' },
  ];

  let formattedText = text;
  const replacements: Array<{start: number, end: number, replacement: string, originalText: string}> = [];

  // Find and mark all patterns for replacement
  emphasisPatterns.forEach(({ pattern, style }) => {
    let match;
    // Reset the regex to start from beginning
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
      const marker = style === 'bold' ? '**' : '_';
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement: `${marker}${match[0]}${marker}`,
        originalText: match[0]
      });
    }
  });

  // Sort replacements by position (reverse order to avoid index shifting)
  replacements.sort((a, b) => b.start - a.start);

  // Apply replacements
  replacements.forEach(({ start, end, replacement }) => {
    formattedText = formattedText.slice(0, start) + replacement + formattedText.slice(end);
  });

  // Now process the enhanced text with our original markdown processor
  const withBold = formattedText.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return { type: 'bold', content: part.slice(2, -2), key: `bold-${index}` };
    }
    return { type: 'text', content: part, key: `text-${index}` };
  });

  const result: React.ReactNode[] = [];
  withBold.forEach((item) => {
    if (item.type === 'bold') {
      result.push(<strong key={item.key}>{item.content}</strong>);
    } else {
      // Process italics in text parts
      const italicParts = item.content.split(/(_[^_]+_)/).map((part, index) => {
        if (part.startsWith('_') && part.endsWith('_')) {
          return <em key={`${item.key}-italic-${index}`}>{part.slice(1, -1)}</em>;
        }
        return part;
      });
      result.push(...italicParts);
    }
  });

  return result;
};

// Function to map emoji strings to Lucide icons
const getIconForEmoji = (emoji: string) => {
  const emojiToIconMap: Record<string, React.ElementType> = {
    // Digital & Screen
    '📱': Smartphone, // Phone scrolling
    '💻': Laptop, // Screen time
    '📺': Laptop, // TV/streaming
    '🛒': ShoppingCart, // Online shopping
    '📮': MessageSquareText, // Social media
    
    // Time & Schedule
    '⏰': Clock, // Lateness
    '📅': Calendar, // Appointments
    '🗓️': Calendar, // Scheduling
    '⏱️': Clock, // Time management
    
    // Sleep & Rest
    '🌙': Bed, // Bedtime procrastination  
    '😴': Bed, // Sleep issues
    '⏰': Clock, // Alarms
    '🛌': Bed, // Sleeping through alarms
    
    // Food & Eating
    '🍽️': Utensils, // Eating patterns
    '🥪': Utensils, // Meals
    '🥗': Utensils, // Healthy eating
    
    // Communication & Social
    '✉️': Mail, // Email overwhelm
    '💬': MessageSquareText, // Text avoidance
    '👥': Users, // Social situations
    '🤝': Users, // Relationships
    
    // Mental & Emotional
    '🧠': Brain, // Analysis paralysis
    '😵‍💫': Brain, // Overwhelm
    '💭': Brain, // Overthinking
    '😰': AlertCircle, // Anxiety loops
    '🔄': RotateCcw, // Perfectionism cycles
    
    // Work & Productivity
    '💼': ClipboardList, // Work avoidance
    '📋': ClipboardList, // Task avoidance
    '🎯': Target, // Decision overwhelm
    
    // Common fallbacks
    '✅': CheckCircle,
    '❌': XCircle,
    '⚡': Zap,
    '❤️': Heart,
    '🛠️': Wrench,
    '⚙️': Settings,
    '📖': BookOpen,
    '💡': Lightbulb,
    '⭐': Star,
    '🔑': Key,
    '🔥': Flame,
    '✨': Sparkles,
  }
  
  return emojiToIconMap[emoji] || RotateCcw
}

interface ComplexLoopPageProps {
  params: Promise<{
    loop: string
  }>
}

export default function ComplexLoopPage({ params }: ComplexLoopPageProps) {
  const [content, setContent] = useState<ComplexLoopsContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({})
  const [copySuccess, setCopySuccess] = useState(false)

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
        // Await the params first
        const resolvedParams = await params
        
        // Convert URL param back to display name
        let loopName = decodeURIComponent(resolvedParams.loop)
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace(/And/g, '&')

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
        if (loopName === 'Can T Fall Asleep') {
          loopName = 'Can\'t Fall Asleep'
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
  }, [params])

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

  const handleShare = async () => {
    const shareData = {
      title: `ADHD First Aid Kit - ${content?.loop_name || 'Complex Loop'}`,
      text: `Get help with ${content?.loop_name?.toLowerCase() || 'this loop'} - ADHD-friendly strategies and support`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (clipboardError) {
        console.error('Share failed:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8fd3f4] via-[#78c2f2] to-[#a18cd1] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-lg">Loading complex loop content...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8fd3f4] via-[#78c2f2] to-[#a18cd1] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-[#8fd3f4] via-[#78c2f2] to-[#a18cd1] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative">
      <div className="max-w-5xl mx-auto px-6 py-8 pt-24">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-5">
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
                  <RotateCcw className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
                  {content.loop_name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
            <div className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 pl-5 py-4 mb-7 rounded-r-lg">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Left Box - Soft Start */}
            <div className="relative">
              <Button
                onClick={() => toggleSection('gentle-advice')}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors border border-green-200 dark:border-green-800 min-h-[60px] touch-manipulation"
                variant="ghost"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
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
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 animate-in slide-in-from-top duration-300 border border-green-200 dark:border-green-800 mt-2">
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatMarkdownText(content.gentle_advice)}
                  </p>
                </div>
              )}
            </div>

            {/* Right Box - Tough Love */}
            <div className="relative">
              <Button
                onClick={() => toggleSection('stern-advice')}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800 min-h-[60px] touch-manipulation"
                variant="ghost"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
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
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 animate-in slide-in-from-top duration-300 border border-red-200 dark:border-red-800 mt-2">
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatMarkdownText(content.stern_advice)}
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

          <div className="mb-8">

            {/* ADHD Reasons - Collapsible */}
            {content.adhd_reasons && content.adhd_reasons.length > 0 && (
              <div className="bg-purple-100/50 dark:bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-200 dark:border-purple-800 transition-all duration-300 mb-8">
                <button
                  onClick={() => toggleSection('adhd-reasons')}
                  className="w-full p-6 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-2xl transition-all duration-300 flex items-center justify-between group"
                  title={expandedSections['adhd-reasons'] ? "Close section" : "Open section"}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-lg flex-shrink-0 transition-transform duration-300">
                      <Brain className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Why {content.loop_name} is Hard with ADHD
                    </h3>
                  </div>
                  {expandedSections['adhd-reasons'] ? (
                    <Minus className="h-5 w-5 text-purple-600 dark:text-purple-300 flex-shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-purple-600 dark:text-purple-300 flex-shrink-0" />
                  )}
                </button>
                
                {expandedSections['adhd-reasons'] && (
                  <div className="px-6 pb-6 animate-in slide-in-from-top duration-300">
                    <div className="space-y-2">
                      {content.adhd_reasons.map((reason, index) => {
                        if (reason === 'You might:' || reason === "Here's what's really going on:") {
                          return (
                            <div key={index} className="font-semibold text-gray-900 dark:text-gray-100 mt-4 first:mt-0">
                              {reason}
                            </div>
                          )
                        } else {
                          const emojiMatch = reason.match(/^([\u{1F300}-\u{1F9FF}])\s+(.+)/u)
                          if (emojiMatch) {
                            return (
                              <div key={index} className="flex items-start gap-2 text-gray-900 dark:text-gray-100 ml-4">
                                <span className="mt-1 flex-shrink-0">{emojiMatch[1]}</span>
                                <span dangerouslySetInnerHTML={{ 
                                  __html: emojiMatch[2]
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                    .replace(/_(.*?)_/g, '<em>$1</em>')
                                }} />
                              </div>
                            )
                          } else {
                            return (
                              <div key={index} className="flex items-start gap-2 text-gray-900 dark:text-gray-100 ml-4">
                                <span className="text-purple-500 mt-1 flex-shrink-0">•</span>
                                <span dangerouslySetInnerHTML={{ 
                                  __html: reason
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                    .replace(/_(.*?)_/g, '<em>$1</em>')
                                }} />
                              </div>
                            )
                          }
                        }
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content Sections */}
          {content.content_sections && content.content_sections.length > 0 && (
            <div className="space-y-4">
              {content.content_sections.map((section, index) => {
                const colorSchemes = [
                  { bg: 'bg-blue-100/50', hover: 'hover:bg-blue-100', dark: 'dark:bg-blue-900/20 dark:hover:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800', iconBg: 'bg-blue-200 dark:bg-blue-800', bulletColor: 'text-blue-600 dark:text-blue-400', calloutBorder: 'border-blue-300 dark:border-blue-600', calloutBg: 'bg-blue-50 dark:bg-blue-800/50' },
                  { bg: 'bg-green-100/50', hover: 'hover:bg-green-100', dark: 'dark:bg-green-900/20 dark:hover:bg-green-900/30', border: 'border-green-200 dark:border-green-800', iconBg: 'bg-green-200 dark:bg-green-800', bulletColor: 'text-green-600 dark:text-green-400', calloutBorder: 'border-green-300 dark:border-green-600', calloutBg: 'bg-green-50 dark:bg-green-800/50' },
                  { bg: 'bg-yellow-100/50', hover: 'hover:bg-yellow-100', dark: 'dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800', iconBg: 'bg-yellow-200 dark:bg-yellow-800', bulletColor: 'text-yellow-600 dark:text-yellow-400', calloutBorder: 'border-yellow-300 dark:border-yellow-600', calloutBg: 'bg-yellow-50 dark:bg-yellow-800/50' },
                  { bg: 'bg-orange-100/50', hover: 'hover:bg-orange-100', dark: 'dark:bg-orange-900/20 dark:hover:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800', iconBg: 'bg-orange-200 dark:bg-orange-800', bulletColor: 'text-orange-600 dark:text-orange-400', calloutBorder: 'border-orange-300 dark:border-orange-600', calloutBg: 'bg-orange-50 dark:bg-orange-800/50' },
                  { bg: 'bg-pink-100/50', hover: 'hover:bg-pink-100', dark: 'dark:bg-pink-900/20 dark:hover:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800', iconBg: 'bg-pink-200 dark:bg-pink-800', bulletColor: 'text-pink-600 dark:text-pink-400', calloutBorder: 'border-pink-300 dark:border-pink-600', calloutBg: 'bg-pink-50 dark:bg-pink-800/50' }
                ];
                
                const colors = colorSchemes[index % colorSchemes.length];
                const IconComponent = getIconForEmoji(section.emoji);
                const sectionId = `section-${index}`;
                const isExpanded = expandedSections[sectionId];

                return (
                  <div key={index} className={`${colors.bg} ${colors.dark} backdrop-blur-sm rounded-2xl border ${colors.border} transition-all duration-300`}>
                    <button
                      onClick={() => toggleSection(sectionId)}
                      className={`w-full p-6 text-left ${colors.hover} ${colors.dark} rounded-2xl transition-all duration-300 flex items-center justify-between group`}
                      title={isExpanded ? "Close section" : "Open section"}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${colors.iconBg} rounded-lg flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'scale-110' : 'group-hover:scale-105'}`}>
                          <IconComponent className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {section.title}
                          </h3>
                        </div>
                      </div>
                      {isExpanded ? (
                        <Minus className={`h-5 w-5 ${colors.bulletColor} flex-shrink-0`} />
                      ) : (
                        <Plus className={`h-5 w-5 ${colors.bulletColor} flex-shrink-0`} />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-6 pb-6 animate-in slide-in-from-top duration-300">
                        {/* Section content */}
                        {section.content && section.content.length > 0 && (
                          <div className="space-y-3 mb-4">
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
                              
                              if (currentQuoteGroup.length > 0) {
                                groupedContent.push({ type: 'quote', items: currentQuoteGroup });
                              }
                              
                              return groupedContent.map((group, groupIndex) => {
                                if (group.type === 'quote') {
                                  return (
                                    <div key={groupIndex} className={`border-l-4 ${colors.calloutBorder} pl-4 py-3 ${colors.calloutBg} rounded-r-lg space-y-2`}>
                                      {group.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="text-gray-700 dark:text-gray-200 italic"
                                             dangerouslySetInnerHTML={{ 
                                               __html: item.replace('> ', '')
                                                 .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                 .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                 .replace(/_(.*?)_/g, '<em>$1</em>')
                                             }} 
                                        />
                                      ))}
                                    </div>
                                  )
                                } else {
                                  return (
                                    <div key={groupIndex} className="flex items-start gap-2">
                                      <span className={`${colors.bulletColor} mt-1 flex-shrink-0`}>•</span>
                                      <div className="text-gray-700 dark:text-gray-200"
                                           dangerouslySetInnerHTML={{ 
                                             __html: group.item.replace(/^- /, '')
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
                        )}
                        
                        {/* Subsections */}
                        {section.subsections && section.subsections.length > 0 && (
                          <div className="space-y-4">
                            {section.subsections.map((subsection, subIndex) => {
                              const SubIconComponent = getIconForEmoji(subsection.emoji);
                              const subsectionId = `subsection-${index}-${subIndex}`;
                              const isSubExpanded = expandedSections[subsectionId];
                              
                              return (
                                <div key={subIndex} className="bg-white/40 dark:bg-gray-800/40 rounded-xl">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toggleSection(subsectionId);
                                    }}
                                    className="w-full p-4 text-left hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-xl transition-all duration-300 flex items-center justify-between group"
                                    title={isSubExpanded ? "Close section" : "Open section"}
                                  >
                                    <div className="flex items-center gap-2">
                                      <SubIconComponent className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                                      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                                        <div dangerouslySetInnerHTML={{ 
                                          __html: subsection.title
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                            .replace(/_(.*?)_/g, '<em>$1</em>')
                                        }} />
                                      </h4>
                                    </div>
                                    {isSubExpanded ? (
                                      <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                                    ) : (
                                      <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                                    )}
                                  </button>
                                  
                                  {isSubExpanded && subsection.content && subsection.content.length > 0 && (
                                    <div className="px-4 pb-4 animate-in slide-in-from-top duration-300">
                                      <div className="space-y-2">
                                        {subsection.content.map((item, itemIndex) => (
                                          <div key={itemIndex} className="flex items-start gap-2">
                                            <span className={`${colors.bulletColor} mt-1 flex-shrink-0`}>•</span>
                                            <div className="text-gray-700 dark:text-gray-200 text-base"
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

          {/* Next Steps Section with Glassmorphism Background */}
          <div className="mt-8 p-8 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-xl">
            {/* Suggestion Button */}
            <div className="mb-8">
              <SuggestionButton pageType="complex_loops" />
            </div>

            {/* Navigation Options - Excluding Complex Loops */}
            <div className="space-y-4">
            {/* Top Row - Feelings and Barriers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Bottom Row - Tasks and Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Need more help? Check out our <a href="/guides" className="text-purple-600 hover:underline">guides</a>, <a href="/scripts" className="text-purple-600 hover:underline">scripts</a>, <a href="/quizzes" className="text-purple-600 hover:underline">quizzes</a>, or <a href="/resources" className="text-purple-600 hover:underline">resources</a>.</p>
          </div>
          
          </div> {/* Close glassmorphism container */}
        </div>
      </div>
    </div>
  )
}