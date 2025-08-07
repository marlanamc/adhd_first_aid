'use client'

import React from 'react'
import { useState, useEffect, use } from 'react'
import { 
  ArrowLeft, Heart, Plus, Minus, BookOpen, 
  Brain, Zap, Frown, Users, BrainCircuit, 
  LockKeyhole, Flame, Sparkles, CloudLightning, 
  Activity, Skull, CloudRain, Rainbow,
  Waves, CloudDrizzle, ArrowLeftRight, UserMinus, UserCircle, HeartOff, ZapOff,
  Share2, Wrench, Construction, RotateCcw, Puzzle, XCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getFeelingsContent, getFeelingSources } from '@/lib/supabase'
import type { FeelingsContent, FeelingSources } from '@/lib/supabase'
import { StepIcon } from '@/components/ui/StepIcon';
import { SuggestionButton } from '@/components/ui/SuggestionButton';
import { ShareModal } from '@/components/ui/ShareModal';

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
  // Key phrases and concepts that should be emphasized in advice
  const emphasisPatterns = [
    // Emotional validation
    { pattern: /\b(you are safe|you're safe|you are enough|you're enough|you matter|this is valid|this is real)\b/gi, style: 'bold' },
    { pattern: /\b(not your fault|not weakness|not overreacting|not broken)\b/gi, style: 'bold' },
    
    // Core actions and techniques
    { pattern: /\b(breathe|pause|stop|slow down|take a break|rest)\b/gi, style: 'bold' },
    { pattern: /\b(one step|one thing|small steps|tiny actions)\b/gi, style: 'bold' },
    { pattern: /\b(body knows|brain knows|you know|trust yourself)\b/gi, style: 'bold' },
    
    // Time and urgency reframes
    { pattern: /\b(right now|this moment|today|not forever|will pass|temporary)\b/gi, style: 'bold' },
    { pattern: /\b(doesn't have to be perfect|good enough|done is better|progress not perfection)\b/gi, style: 'bold' },
    
    // ADHD-specific concepts
    { pattern: /\b(executive function|working memory|dopamine|nervous system|sensory|overwhelm)\b/gi, style: 'bold' },
    { pattern: /\b(ADHD brain|neurodivergent|rejection sensitivity|time blindness)\b/gi, style: 'bold' },
    
    // Gentle self-talk patterns for italics
    { pattern: /\b(maybe|perhaps|gently|softly|kindly|compassionately)\b/gi, style: 'italic' },
    { pattern: /\b(it's okay to|it's normal to|you're allowed to|you can)\b/gi, style: 'italic' },
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

// Icon mapping to match main feelings page
const FEELING_ICONS: Record<string, React.ElementType> = {
  // Cognitive & Overload
  'Mental Fog': CloudDrizzle,
  'Overwhelmed': Waves,
  'Forgetful': Brain,
  'Scattered': CloudLightning, // Changed to CloudLightning as closest to tornado
  'Overstimulated': Sparkles,
  
  // Dysregulation & Shutdown
  'Stuck': LockKeyhole, // Changed to LockKeyhole
  'Drained': BrainCircuit, // Changed to BrainCircuit
  'Burned Out': Flame,
  'Numb': Skull,
  'Ashamed': Frown,
  'Frustrated': ZapOff, // Changed to ZapOff
  
  // Heavy Feelings
  'Guilty': Frown, // Changed to Frown
  'Defeated': CloudRain,
  'Hopeless': UserMinus, // Changed to UserMinus
  'Stressed': Zap,
  
  // Jittery & Wound Up
  'Anxious': HeartOff, // Changed to HeartOff as closest to heart-minus
  'Restless': Sparkles,
  'Wired': Zap,
  'Tense': ArrowLeftRight, // Changed to ArrowLeftRight
  
  // Social & Connection
  'Lonely': UserCircle, // Changed to UserCircle
  'Misunderstood': Users,
  'Rejected': Activity // Changed to Activity as closest to square-activity
}

// Hardcoded guide mappings
const FEELING_GUIDE_MAPPINGS = {
  // Cognitive & Overload feelings
  'mental fog': {
    title: 'Cognitive & Overload Guide',
    slug: 'mentalfog',
    emoji: '😶‍🌫️',
    description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies'
  },
  'overwhelmed': {
    title: 'Cognitive & Overload Guide',
    slug: 'mentalfog',
    emoji: '😶‍🌫️',
    description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies'
  },
  'forgetful': {
    title: 'Cognitive & Overload Guide',
    slug: 'mentalfog',
    emoji: '😶‍🌫️',
    description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies'
  },
  'scattered': {
    title: 'Cognitive & Overload Guide',
    slug: 'mentalfog',
    emoji: '😶‍🌫️',
    description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies'
  },
  'overstimulated': {
    title: 'Cognitive & Overload Guide',
    slug: 'mentalfog',
    emoji: '😶‍🌫️',
    description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies'
  },
  // Dysregulation & Shutdown feelings
  'stuck': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  },
  'drained': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  },
  'burned out': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  },
  'numb': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  },
  'ashamed': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  },
  'frustrated': {
    title: 'Dysregulation & Shutdown Guide',
    slug: 'dysregulation',
    emoji: '🧯',
    description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies'
  }
}

interface FeelingPageProps {
  params: Promise<{
    feeling: string
  }>
}

export default function FeelingPage({ params }: FeelingPageProps) {
  const resolvedParams = use(params)
  const [content, setContent] = useState<FeelingsContent | null>(null)
  const [sources, setSources] = useState<FeelingSources[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({})
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [introRevealed, setIntroRevealed] = useState(false)
  const [availableGuide, setAvailableGuide] = useState<{
    title: string;
    emoji: string;
    slug: string;
    description: string;
  } | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        
        // Convert URL param back to display name
        const feelingName = decodeURIComponent(resolvedParams.feeling)
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        const { data, error } = await getFeelingsContent(feelingName)
        
        if (error) {
          setError(`Could not load content for "${feelingName}". This feeling may not have detailed content yet.`)
          return
        }

        if (!data) {
          setError(`No content found for "${feelingName}".`)
          return
        }

        setContent(data)

        // Fetch sources data using the URL slug
        const feelingSlug = resolvedParams.feeling  // This is the URL slug like 'mental-fog'
        const { data: sourcesData, error: sourcesError } = await getFeelingSources(feelingSlug.replace(/-/g, '_'))
        
        if (sourcesData && sourcesData.length > 0) {
          setSources(sourcesData)
        }

        // Check if there's a guide for this feeling
        const feelingKey = feelingName.toLowerCase().trim()
        const matchedGuide = FEELING_GUIDE_MAPPINGS[feelingKey as keyof typeof FEELING_GUIDE_MAPPINGS]
        setAvailableGuide(matchedGuide || null)
      } catch (err) {
        setError('Failed to load feelings content.')
        console.error('Error loading feelings content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [resolvedParams.feeling])


  const goBack = () => {
    // Check if there's a category parameter in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    
    if (category) {
      // Go back to the specific category page - re-encode the category
      window.location.href = `/feelings?category=${encodeURIComponent(category)}`
    } else {
      // Try browser history first, fallback to main feelings page
      if (document.referrer && document.referrer.includes('/feelings')) {
        window.history.back()
      } else {
        window.location.href = '/feelings'
      }
    }
  }

  const handleShare = () => {
    // Always show the custom share modal
    setIsShareModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fca3b7] via-[#fbc2eb] to-[#fbd786] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-lg">Gathering your ADHD-friendly emotional support...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fca3b7] via-[#fbc2eb] to-[#fbd786] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-md text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Feeling Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error || 'This feeling content is not available yet.'}
          </p>
          <Button onClick={goBack} variant="default" size="default" className="bg-pink-500 hover:bg-pink-600 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feelings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fca3b7] via-[#fbc2eb] to-[#fbd786] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative">
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
                  {React.createElement(FEELING_ICONS[content?.feeling_name || ''] || Heart, {
                    className: "h-6 w-6 sm:h-8 sm:w-8 text-pink-500 flex-shrink-0"
                  })}
                  {content?.feeling_name}
                </h1>
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

            {/* Intro Paragraph - with pink border like screenshot */}
            <div 
              className="border-l-4 border-pink-400 bg-pink-50/50 dark:bg-pink-900/10 pl-5 py-4 mb-7 rounded-r-lg"
            >
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                {content?.intro_paragraph && formatMarkdownText(content.intro_paragraph)}
              </p>
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
                onClick={() => toggleSection('gentle')}
                onMouseEnter={() => setHoveredSection('gentle')}
                onMouseLeave={() => setHoveredSection(null)}
                onTouchStart={() => setHoveredSection(null)}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#A0E8AF]/40 hover:shadow-md transition-shadow duration-300 border border-[#A0E8AF]/60 min-h-[60px] touch-manipulation"
                variant="ghost"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#2D9C3C]" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Soft Start
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {expandedSections['gentle'] ? (
                    <Minus className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </Button>
              
              {/* Custom Tooltip */}
              {hoveredSection === 'gentle' && (
                <div className="absolute right-2 top-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded shadow-lg z-10 pointer-events-none">
                  {expandedSections['gentle'] ? "Close section" : "Open section"}
                </div>
              )}
              
              {expandedSections['gentle'] && (
                <div className="bg-[#A0E8AF]/40 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 animate-in slide-in-from-top duration-300 border border-[#A0E8AF]/60 mt-2">
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatMarkdownText(content.gentle_advice)}
                  </p>
                </div>
              )}
            </div>

            {/* Right Box - Tough Love */}
            <div className="relative">
              <Button
                onClick={() => toggleSection('stern')}
                onMouseEnter={() => setHoveredSection('stern')}
                onMouseLeave={() => setHoveredSection(null)}
                onTouchStart={() => setHoveredSection(null)}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#F87171]/30 hover:shadow-md transition-shadow duration-300 border border-[#F87171]/50 min-h-[60px] touch-manipulation"
                variant="ghost"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#B91C1C]" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Tough Love
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {expandedSections['stern'] ? (
                    <Minus className="h-5 w-5 text-[#B91C1C]" />
                  ) : (
                    <Plus className="h-5 w-5 text-[#B91C1C]" />
                  )}
                </div>
              </Button>

              {/* Custom Tooltip */}
              {hoveredSection === 'stern' && (
                <div className="absolute right-2 top-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded shadow-lg z-10 pointer-events-none">
                  {expandedSections['stern'] ? "Close section" : "Open section"}
                </div>
              )}

              {expandedSections['stern'] && (
                <div className="bg-[#F87171]/30 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 animate-in slide-in-from-top duration-300 border border-[#F87171]/50 mt-2">
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

          {/* Why ADHD Makes [Feeling] Worse Section */}
          <div className="relative mb-4">
            <Button
              onClick={() => toggleSection('adhd_reasons')}
              onMouseEnter={() => setHoveredSection('adhd_reasons')}
              onMouseLeave={() => setHoveredSection(null)}
              onTouchStart={() => setHoveredSection(null)}
              className="w-full flex items-center gap-4 mb-5 p-5 rounded-xl bg-[#FFADD3]/20 hover:bg-[#FFADD3]/30 transition-colors min-h-[90px] touch-manipulation"
              variant="ghost"
              size="lg"
            >
              <div className="bg-[#FFADD3]/90 rounded-full p-3 flex-shrink-0">
                <Brain className="h-5 w-5 text-gray-900" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Why ADHD Makes {content?.feeling_name} Worse
                </h3>
                <p className="text-base text-gray-600">
                  The hidden drivers
                </p>
              </div>
              <div className="flex-shrink-0">
                {expandedSections['adhd_reasons'] ? (
                  <Minus className="h-6 w-6 text-gray-500" />
                ) : (
                  <Plus className="h-6 w-6 text-gray-500" />
                )}
              </div>
            </Button>
            
            {/* Custom Tooltip */}
            {hoveredSection === 'adhd_reasons' && (
              <div className="absolute right-2 top-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded shadow-lg z-10 pointer-events-none">
                {expandedSections['adhd_reasons'] ? "Close section" : "Open section"}
              </div>
            )}
            
            {expandedSections['adhd_reasons'] && (
              <div className="bg-[#FFADD3]/20 rounded-xl p-5 space-y-4 animate-in slide-in-from-top duration-300 border border-[#FFADD3]/30">
                <ul className="space-y-3">
                  {content.adhd_reasons.map((reason, index) => {
                    // Split on the first colon to get bold heading and description
                    const colonIndex = reason.indexOf(':');
                    const hasColon = colonIndex !== -1;
                    const heading = hasColon ? reason.substring(0, colonIndex + 1) : '';
                    const description = hasColon ? reason.substring(colonIndex + 1).trim() : reason;
                    
                    // Smart emoji selection for ADHD reasons
                    const getEmoji = (reasonText: string, usedEmojis: string[]) => {
                      const text = reasonText.toLowerCase();
                      
                      // More specific matches first to avoid conflicts
                      if (text.includes('working memory') && !usedEmojis.includes('💭')) return '💭';
                      if (text.includes('executive') && !usedEmojis.includes('⚙️')) return '⚙️';
                      if (text.includes('dopamine') && !usedEmojis.includes('🧬')) return '🧬';
                      if (text.includes('nervous system') && !usedEmojis.includes('🔌')) return '🔌';
                      if (text.includes('rejection') && !usedEmojis.includes('💔')) return '💔';
                      if (text.includes('emotional') && !usedEmojis.includes('🎭')) return '🎭';
                      if (text.includes('regulation') && !usedEmojis.includes('🌡️')) return '🌡️';
                      if (text.includes('sensitivity') && !usedEmojis.includes('🎚️')) return '🎚️';
                      if (text.includes('perfectionism') && !usedEmojis.includes('🎯')) return '🎯';
                      if (text.includes('rumination') && !usedEmojis.includes('🌀')) return '🌀';
                      if (text.includes('shame') && !usedEmojis.includes('🔒')) return '🔒';
                      if (text.includes('hypervigilance') && !usedEmojis.includes('👀')) return '👀';
                      if (text.includes('attention') && !usedEmojis.includes('🔍')) return '🔍';
                      if (text.includes('focus') && !usedEmojis.includes('🎪')) return '🎪';
                      if (text.includes('distract') && !usedEmojis.includes('🎲')) return '🎲';
                      if (text.includes('overwhelm') && !usedEmojis.includes('🌊')) return '🌊';
                      if (text.includes('stimulation') && !usedEmojis.includes('⚡')) return '⚡';
                      if (text.includes('energy') && !usedEmojis.includes('🔋')) return '🔋';
                      if (text.includes('motivation') && !usedEmojis.includes('🚀')) return '🚀';
                      if (text.includes('procrastination') && !usedEmojis.includes('⏰')) return '⏰';
                      if (text.includes('time') && !usedEmojis.includes('⏳')) return '⏳';
                      if (text.includes('pattern') && !usedEmojis.includes('🔄')) return '🔄';
                      if (text.includes('habit') && !usedEmojis.includes('🔗')) return '🔗';
                      if (text.includes('brain') && !usedEmojis.includes('🧠')) return '🧠';
                      if (text.includes('cognitive') && !usedEmojis.includes('🤔')) return '🤔';
                      if (text.includes('sensory') && !usedEmojis.includes('👂')) return '👂';
                      if (text.includes('fatigue') && !usedEmojis.includes('😴')) return '😴';
                      if (text.includes('burnout') && !usedEmojis.includes('🔥')) return '🔥';
                      if (text.includes('anxiety') && !usedEmojis.includes('😰')) return '😰';
                      if (text.includes('stress') && !usedEmojis.includes('😤')) return '😤';
                      if (text.includes('overwhelm') && !usedEmojis.includes('🌊')) return '🌊';
                      if (text.includes('avoidance') && !usedEmojis.includes('🙈')) return '🙈';
                      if (text.includes('mask') && !usedEmojis.includes('🎭')) return '🎭';
                      if (text.includes('comparison') && !usedEmojis.includes('⚖️')) return '⚖️';
                      if (text.includes('criticism') && !usedEmojis.includes('🗣️')) return '🗣️';
                      if (text.includes('feedback') && !usedEmojis.includes('💬')) return '💬';
                      if (text.includes('social') && !usedEmojis.includes('👥')) return '👥';
                      
                      // Fallback emojis to ensure uniqueness
                      const fallbacks = ['🧩', '🔧', '📊', '🎨', '🔮', '⭐', '🎪', '📡', '🎛️', '🔬'];
                      return fallbacks.find(emoji => !usedEmojis.includes(emoji)) || '🧩';
                    };

                    const usedEmojis = content.adhd_reasons.slice(0, index).map((_, i) => 
                      getEmoji(content.adhd_reasons[i], content.adhd_reasons.slice(0, i).map((_, j) => 
                        getEmoji(content.adhd_reasons[j], [])
                      ))
                    );
                    const emoji = getEmoji(reason, usedEmojis);
                    
                    return (
                      <li key={index} className="flex items-start gap-3 ml-6 relative before:absolute before:left-[-1.75rem] before:top-1/2 before:w-3 before:h-px before:bg-gray-200 group/bullet hover:bg-gray-500/10 rounded-lg transition-colors">
                        <span className="text-base translate-y-[1px] flex-shrink-0 group-hover/bullet:scale-110 transition-transform">{emoji}</span>
                        <span className="text-gray-900 py-1 leading-relaxed">
                          {hasColon ? (
                            <>
                              <strong>{heading.replace(/\*\*(.*?)\*\*/g, '$1')}</strong> {formatMarkdownText(description)}
                            </>
                          ) : (
                            formatMarkdownText(reason)
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Step-by-Step Sections with different colors */}
          {content.step_sections && content.step_sections.length > 0 && (
            <div className="space-y-4">
              {content.step_sections.map((step, index) => {
                const colorSchemes = [
                  { bg: 'bg-[#FCF6BD]/20', hover: 'hover:bg-[#FCF6BD]/30', border: 'border-[#FCF6BD]/50', iconBg: 'bg-[#FCF6BD]/90' },
                  { bg: 'bg-[#D0F4DE]/20', hover: 'hover:bg-[#D0F4DE]/30', border: 'border-[#D0F4DE]/50', iconBg: 'bg-[#D0F4DE]/90' },
                  { bg: 'bg-[#A9DEF9]/20', hover: 'hover:bg-[#A9DEF9]/30', border: 'border-[#A9DEF9]/50', iconBg: 'bg-[#A9DEF9]/90' },
                  { bg: 'bg-[#E4C1F9]/20', hover: 'hover:bg-[#E4C1F9]/30', border: 'border-[#E4C1F9]/50', iconBg: 'bg-[#E4C1F9]/90' },
                  { bg: 'bg-[#CEF4FF]/20', hover: 'hover:bg-[#CEF4FF]/30', border: 'border-[#CEF4FF]/50', iconBg: 'bg-[#CEF4FF]/90' }
                ];
                
                const colors = colorSchemes[index % colorSchemes.length];
                
                return (
                  <div key={index} className="relative">
                    <Button
                      onClick={() => toggleSection(`step_${index}`)}
                      onMouseEnter={() => setHoveredSection(`step_${index}`)}
                      onMouseLeave={() => setHoveredSection(null)}
                      onTouchStart={() => setHoveredSection(null)}
                      className={`w-full flex items-center gap-4 mb-5 p-4 rounded-xl ${colors.bg} ${colors.hover} transition-colors min-h-[75px] touch-manipulation`}
                      variant="ghost"
                      size="lg"
                    >
                      <div className={`${colors.iconBg} rounded-full p-3 flex-shrink-0`}>
                        <StepIcon 
                          iconName={step.emoji} 
                          className="h-5 w-5 text-gray-900" 
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 break-words">
                          {step.number}. {step.title.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </h3>
                        <p className="text-base text-gray-600">
                          {formatMarkdownText(step.intro)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedSections[`step_${index}`] ? (
                          <Minus className="h-6 w-6 text-gray-500" />
                        ) : (
                          <Plus className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                    </Button>
                    
                    {/* Custom Tooltip */}
                    {hoveredSection === `step_${index}` && (
                      <div className="absolute right-2 top-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded shadow-lg z-10 pointer-events-none">
                        {expandedSections[`step_${index}`] ? "Close section" : "Open section"}
                      </div>
                    )}
                    
                    {expandedSections[`step_${index}`] && (
                      <div className={`${colors.bg} rounded-xl p-5 space-y-4 animate-in slide-in-from-top duration-300 border ${colors.border}`}>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white mb-3">Try this:</p>
                          <ul className="space-y-2">
                            {step.try_this.map((item, itemIndex) => {
                              // Split on the first colon to get bold heading and description
                              const colonIndex = item.indexOf(':');
                              const hasColon = colonIndex !== -1;
                              const heading = hasColon ? item.substring(0, colonIndex + 1) : '';
                              const description = hasColon ? item.substring(colonIndex + 1).trim() : item;
                              
                              // Strip ** formatting from heading since we're manually applying <strong>
                              const cleanHeading = heading.replace(/\*\*(.*?)\*\*/g, '$1');
                              
                              return (
                                <li key={itemIndex} className="flex items-start gap-3 ml-6 relative before:absolute before:left-[-1.75rem] before:top-1/2 before:w-3 before:h-px before:bg-gray-200 group/bullet hover:bg-gray-500/10 rounded-lg transition-colors">
                                  <span className="text-gray-900 flex-shrink-0 translate-y-[1px] text-lg group-hover/bullet:scale-110 transition-transform">•</span>
                                  <span className="text-gray-900 py-1 leading-relaxed">
                                    {hasColon ? (
                                      <>
                                        <strong>{cleanHeading}</strong> {formatMarkdownText(description)}
                                      </>
                                    ) : (
                                      formatMarkdownText(item)
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        
                        <div className={`${colors.bg} border-l-4 ${colors.border} pl-4 py-2 rounded-r-lg`}>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">💡 Tip:</span> {formatMarkdownText(step.tip)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Sources Section */}
          {sources && sources.length > 0 && (
            <div className="space-y-4">
              <div className="relative">
                <Button
                  onClick={() => toggleSection('sources')}
                  className="w-full flex items-center gap-4 mb-5 p-4 rounded-xl bg-[#CEFFF2]/20 hover:bg-[#CEFFF2]/30 transition-colors min-h-[75px] touch-manipulation"
                  variant="ghost"
                  size="lg"
                >
                  <div className="bg-[#CEFFF2]/90 rounded-full p-3 flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-gray-900" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 break-words">
                      Sources: {content?.feeling_name}
                    </h3>
                    <p className="text-base text-gray-600">
                      Explore the books, guides, and research that shaped this page
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedSections['sources'] ? (
                      <Minus className="h-6 w-6 text-gray-500" />
                    ) : (
                      <Plus className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                </Button>
                
                {expandedSections['sources'] && (
                  <div className="bg-[#CEFFF2]/20 rounded-lg p-4 space-y-4 animate-in slide-in-from-top duration-300 mb-4">
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
                      // Color palette for category headers (matching life_areas style)
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
                      
                      return (
                        <div key={category} className="space-y-2">
                          <Button
                            onClick={() => toggleSection(`source-category-${category}`)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl ${colorScheme.bg} ${colorScheme.hover} border ${colorScheme.border} transition-all duration-300 shadow-sm`}
                            variant="ghost"
                            size="lg"
                          >
                            <h4 className="font-bold text-gray-900 text-base">
                              {category} ({categorySources.length} {categorySources.length === 1 ? 'source' : 'sources'})
                            </h4>
                            {expandedSections[`source-category-${category}`] ? (
                              <Minus className="h-4 w-4 text-gray-600" />
                            ) : (
                              <Plus className="h-4 w-4 text-gray-600" />
                            )}
                          </Button>
                          
                          {expandedSections[`source-category-${category}`] && (
                            <div className={`pl-2 space-y-3 animate-in slide-in-from-top duration-200 ${colorScheme.bg} rounded-lg p-4 border ${colorScheme.border}`}>
                              {categorySources.map((source, sourceIndex) => (
                                <div key={sourceIndex} className="border-l-3 border-gray-400/40 pl-4 py-2">
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-900 mt-1 flex-shrink-0">•</span>
                                    <div>
                                      <h5 className="font-semibold text-gray-900">
                                        {source.title}
                                        {source.authors && (
                                          <span className="font-normal text-gray-600">
                                            {' by '}{source.authors}
                                          </span>
                                        )}
                                      </h5>
                                      <p className="text-sm text-gray-700 leading-relaxed mt-1">
                                        {source.description.replace(/\s*—\s*/g, ', ')}
                                      </p>
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
              <SuggestionButton pageType="feelings" />
            </div>

            {/* Navigation Options - Excluding Feelings */}
            <div className="space-y-4">
            {/* Top Row - Barriers and Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/barriers'}
                className="p-4 text-left h-auto border-2 hover:bg-orange-100 dark:hover:bg-orange-900/40"
              >
                <div className="flex items-center gap-3">
                  <Construction className="h-5 w-5" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Facing barriers or obstacles?</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Barriers Support</div>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/life_areas'}
                className="p-4 text-left h-auto border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Need help with specific tasks?</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Life Areas</div>
                  </div>
                </div>
              </Button>
            </div>

            {/* Middle Row - Complex Loops and Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Need more help? Check out our <a href="/guides" className="text-blue-600 hover:underline">guides</a>, <a href="/scripts" className="text-blue-600 hover:underline">scripts</a>, <a href="/quizzes" className="text-blue-600 hover:underline">quizzes</a>, or <a href="/resources" className="text-blue-600 hover:underline">resources</a>.</p>
          </div>
          
          </div> {/* Close glassmorphism container */}
        </div>
      </div>
      
      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={content?.feeling_name || 'Feeling Page'}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        description={`Get help with feeling ${content?.feeling_name?.toLowerCase()} - ADHD-friendly strategies and support.`}
      />
    </div>
  )
}