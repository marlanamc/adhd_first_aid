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
import FixedBottomActions from '@/components/ui/FixedBottomActions'

// Function to format text without bold (for use when bold is handled manually)
const formatTextNoBold = (text: string) => {
  // Strip ** formatting and just handle italics and plain text
  const strippedText = text.replace(/\*\*(.*?)\*\*/g, '$1');
  
  if (strippedText.includes('_')) {
    // Handle italics (_text_)
    return strippedText.split(/(_[^_]+_)/).map((part, index) => {
      if (part.startsWith('_') && part.endsWith('_')) {
        return <em key={`italic-${index}`}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  }
  
  return strippedText;
};

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
  const [copySuccess] = useState(false)
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
        const { data: sourcesData } = await getFeelingSources(feelingSlug.replace(/-/g, '_'))
        
        if (sourcesData && sourcesData.length > 0) {
          setSources(sourcesData)
        }

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
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 md:py-8 pt-24 sm:pt-28 md:pt-24">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg">
          {/* Header */}
          <div className="mb-4 sm:mb-6 md:mb-6">
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
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground flex items-center gap-2 sm:gap-3">
                  {React.createElement(FEELING_ICONS[content?.feeling_name || ''] || Heart, {
                    className: "h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-pink-500 flex-shrink-0"
                  })}
                  <span className="break-words truncate">{content?.feeling_name}</span>
                </h1>
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


            {/* Intro Paragraph - with pink border like screenshot */}
            <div 
              id="tldr"
              className="guide-section border-l-4 border-pink-400 bg-pink-50/50 dark:bg-pink-900/10 pl-5 py-4 mb-4 sm:mb-5 md:mb-6 rounded-r-lg"
            >
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                {content?.intro_paragraph && formatMarkdownText(content.intro_paragraph)}
              </p>
            </div>
          </div>


          {/* Section Divider */}
          <div className="flex items-center justify-center gap-4 mb-4 text-gray-400 dark:text-gray-600">
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              <p className="text-sm font-medium">Choose how you want to begin</p>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
          </div>

          {/* Side-by-Side Toggle Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-3 sm:mb-4">
            {/* Left Box - Soft Start */}
            <section id="gentle" className="guide-section relative">
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
                <div className="bg-[#A0E8AF]/40 rounded-xl p-4 sm:p-5 space-y-2 animate-in slide-in-from-top duration-300 border border-[#A0E8AF]/60 mt-2">
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatMarkdownText(content.gentle_advice)}
                  </p>
                </div>
              )}
            </section>

            {/* Right Box - Tough Love */}
            <section id="stern" className="guide-section relative">
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
                <div className="bg-[#F87171]/30 rounded-xl p-4 sm:p-5 space-y-2 animate-in slide-in-from-top duration-300 border border-[#F87171]/50 mt-2">
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatMarkdownText(content.stern_advice)}
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Gentle guidance note - moved before ADHD reasons section */}
          <div className="flex items-center justify-center gap-4 mb-4 text-gray-400 dark:text-gray-600">
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <p className="text-sm font-medium">Explore when you're ready</p>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
          </div>

          {/* Why ADHD Makes [Feeling] Worse Section */}
          <section id="adhd_reasons" className="guide-section relative mb-3 sm:mb-4">
            <div className="rounded-2xl transition-all duration-300 mb-3 bg-white border border-[#FFADD3] md:border-2 shadow-sm">
              <button
                onClick={() => toggleSection('adhd_reasons')}
                className="w-full p-3 md:p-4 lg:p-5 text-left rounded-2xl transition-all duration-300 flex items-center justify-between group"
                title={expandedSections['adhd_reasons'] ? 'Close section' : 'Open section'}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-[#FFADD3] rounded-lg flex-shrink-0">
                    <Brain className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight">Why ADHD Makes {content?.feeling_name} Worse</h3>
                    <p className="text-xs md:text-sm text-gray-700 mt-0.5">The hidden drivers</p>
                  </div>
                </div>
                {expandedSections['adhd_reasons'] ? (
                  <Minus className="h-5 w-5 text-black flex-shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 text-black flex-shrink-0" />
                )}
              </button>
              
              {expandedSections['adhd_reasons'] && (
                <div className="px-3 md:px-4 pb-2 md:pb-3 animate-in slide-in-from-top duration-300 border-t border-[#FFADD3] bg-white">
                  <div className="space-y-1">
                    {content.adhd_reasons.map((reason, index) => {
                      // Parse bold heading safely before splitting on colon
                      const parseHeadingAndBody = (text: string) => {
                        // Handle **Heading:** format (colon inside the stars)
                        const boldMatchInside = text.match(/^\s*\*\*([^*]+?):\*\*\s*/);
                        if (boldMatchInside) {
                          return { heading: boldMatchInside[1].trim(), body: text.slice(boldMatchInside[0].length).trim() };
                        }
                        // Handle **Heading**: format (colon outside the stars) 
                        const boldMatchOutside = text.match(/^\s*\*\*([^*]+?)\*\*\s*:\s*/);
                        if (boldMatchOutside) {
                          return { heading: boldMatchOutside[1].trim(), body: text.slice(boldMatchOutside[0].length).trim() };
                        }
                        // Handle regular heading: format
                        const colonIndex = text.indexOf(':');
                        if (colonIndex !== -1) {
                          return { heading: text.slice(0, colonIndex).trim(), body: text.slice(colonIndex + 1).trim() };
                        }
                        return null;
                      };
                      const parsedReason = parseHeadingAndBody(reason);
                      
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
                        <div key={index} className="flex items-start gap-3 p-2 rounded-xl bg-[#FBF8CC]/40 border border-[#FBF8CC]/60 hover:bg-[#FBF8CC]/60 transition-colors">
                          <div className="bg-[#FBF8CC] rounded-full p-2 flex-shrink-0">
                            <span className="text-lg">{emoji}</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-gray-900 leading-snug">
                              {parsedReason
                                ? (<><strong>{parsedReason.heading}:</strong> {formatMarkdownText(parsedReason.body)}</>)
                                : formatMarkdownText(reason)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Step-by-Step Sections with clean headers */}
          {content.step_sections && content.step_sections.length > 0 && (
            <div className="space-y-2">
              {content.step_sections.map((step, index) => {
                const colorSchemes = [
                  { bg: 'bg-[#FCF6BD]', border: 'border-[#FCF6BD]', bulletColor: 'text-yellow-600', tipBg: 'bg-[#FCF6BD]' },
                  { bg: 'bg-[#D0F4DE]', border: 'border-[#D0F4DE]', bulletColor: 'text-green-600', tipBg: 'bg-[#D0F4DE]' },
                  { bg: 'bg-[#A9DEF9]', border: 'border-[#A9DEF9]', bulletColor: 'text-blue-600', tipBg: 'bg-[#A9DEF9]' },
                  { bg: 'bg-[#E4C1F9]', border: 'border-[#E4C1F9]', bulletColor: 'text-purple-600', tipBg: 'bg-[#E4C1F9]' },
                  { bg: 'bg-[#CEF4FF]', border: 'border-[#CEF4FF]', bulletColor: 'text-cyan-600', tipBg: 'bg-[#CEF4FF]' }
                ];
                
                const colors = colorSchemes[index % colorSchemes.length];
                
                return (
                  <section key={index} id={`step_${index}`} className="guide-section relative">
                    <div className="bg-white rounded-2xl transition-all duration-300 mb-4 shadow-sm">
                      <button
                        onClick={() => toggleSection(`step_${index}`)}
                        className="w-full p-3 md:p-4 lg:p-5 text-left rounded-2xl transition-all duration-300 flex items-center justify-between group"
                        title={expandedSections[`step_${index}`] ? 'Close section' : 'Open section'}
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className={`p-1.5 md:p-2 ${colors.bg} rounded-full flex-shrink-0`}>
                            <StepIcon 
                              iconName={step.emoji} 
                              className="h-4 w-4 md:h-5 md:w-5 text-gray-900" 
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                              {step.number}. {step.title.replace(/\*\*(.*?)\*\*/g, '$1')}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-700 mt-0.5">
                              {formatMarkdownText(step.intro)}
                            </p>
                          </div>
                        </div>
                        {expandedSections[`step_${index}`] ? (
                          <Minus className="h-5 w-5 text-black flex-shrink-0" />
                        ) : (
                          <Plus className="h-5 w-5 text-black flex-shrink-0" />
                        )}
                      </button>
                      
                      {expandedSections[`step_${index}`] && (
                        <div className="px-3 md:px-5 pb-2 md:pb-3 animate-in slide-in-from-top duration-300 bg-white rounded-b-2xl">
                          <div className="space-y-2">
                            <div>
                              <p className="font-semibold text-gray-900 mb-2">Try this:</p>
                              <ul className="space-y-1">
                                {step.try_this.map((item, itemIndex) => {
                                  // Check if this is an arrow item (nested)
                                  const isArrowItem = item.startsWith('→');
                                  const processedItem = isArrowItem ? item.substring(1).trim() : item;
                                  
                                  // Parse bold heading safely before splitting on colon
                                  const parseHeadingAndBody = (text: string) => {
                                    // Handle **Heading:** format (colon inside the stars)
                                    const boldMatchInside = text.match(/^\s*\*\*([^*]+?):\*\*\s*/);
                                    if (boldMatchInside) {
                                      return { heading: boldMatchInside[1].trim(), body: text.slice(boldMatchInside[0].length).trim() };
                                    }
                                    // Handle **Heading**: format (colon outside the stars) 
                                    const boldMatchOutside = text.match(/^\s*\*\*([^*]+?)\*\*\s*:\s*/);
                                    if (boldMatchOutside) {
                                      return { heading: boldMatchOutside[1].trim(), body: text.slice(boldMatchOutside[0].length).trim() };
                                    }
                                    // Handle regular heading: format
                                    const colonIndex = text.indexOf(':');
                                    if (colonIndex !== -1) {
                                      return { heading: text.slice(0, colonIndex).trim(), body: text.slice(colonIndex + 1).trim() };
                                    }
                                    return null;
                                  };
                                  const parsed = parseHeadingAndBody(processedItem);
                                  
                                  if (isArrowItem) {
                                    // Arrow items - no bullet, different styling
                                    return (
                                      <li key={itemIndex} className="flex items-start gap-3 py-1 px-2 sm:py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <span className="text-gray-500 flex-shrink-0 translate-y-[1px] text-base">→</span>
                                        <span className="text-gray-900 leading-snug">
                                          {parsed
                                            ? (<><strong>{parsed.heading}:</strong> {formatMarkdownText(parsed.body)}</>)
                                            : formatMarkdownText(processedItem)}
                                        </span>
                                      </li>
                                    );
                                  } else {
                                    // Regular items - with bullet
                                    return (
                                      <li key={itemIndex} className="flex items-start gap-3 py-1 px-2 sm:py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <span className="text-gray-900 flex-shrink-0 translate-y-[1px] text-base">•</span>
                                        <span className="text-gray-900 leading-snug">
                                          {parsed
                                            ? (<><strong>{parsed.heading}:</strong> {formatMarkdownText(parsed.body)}</>)
                                            : formatMarkdownText(processedItem)}
                                        </span>
                                      </li>
                                    );
                                  }
                                })}
                              </ul>
                            </div>
                            
                            <div className={`${colors.tipBg} border-l-4 ${colors.border} pl-4 py-3 rounded-r-lg`}>
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">💡 Tip:</span> {formatMarkdownText(step.tip)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {/* Sources Section */}
          {sources && sources.length > 0 && (
            <div className="space-y-2 mt-3">
              <section id="sources" className="guide-section relative">
                <div className="rounded-2xl transition-all duration-300 mb-3 bg-white border border-gray-300 md:border-2 shadow-sm">
                  <button
                    onClick={() => toggleSection('sources')}
                    className="w-full p-3 md:p-4 lg:p-5 text-left rounded-2xl transition-all duration-300 flex items-center justify-between group"
                    title={expandedSections['sources'] ? 'Close section' : 'Open section'}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="p-1.5 md:p-2 bg-[#CEFFF2] rounded-lg flex-shrink-0">
                        <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight">Sources: {content?.feeling_name}</h3>
                        <p className="text-xs md:text-sm text-gray-700 mt-0.5">Explore the books, guides, and research that shaped this page</p>
                      </div>
                    </div>
                    {expandedSections['sources'] ? (
                      <Minus className="h-5 w-5 text-black flex-shrink-0" />
                    ) : (
                      <Plus className="h-5 w-5 text-black flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedSections['sources'] && (
                    <div className="px-5 md:px-6 pb-4 md:pb-5 animate-in slide-in-from-top duration-300 border-t border-gray-200 bg-white">
                      <div className="space-y-2">
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
                            { bg: 'bg-[#FBF8CC]', border: 'border-[#FBF8CC]' }, // Lemon Chiffon
                            { bg: 'bg-[#FDE4CF]', border: 'border-[#FDE4CF]' }, // Champagne Pink
                            { bg: 'bg-[#FFCFD2]', border: 'border-[#FFCFD2]' }, // Baby Pink
                            { bg: 'bg-[#F1C0E8]', border: 'border-[#F1C0E8]' }, // Pink Lavender
                            { bg: 'bg-[#CFBAF0]', border: 'border-[#CFBAF0]' }, // Lavender Blue
                            { bg: 'bg-[#A3C4F3]', border: 'border-[#A3C4F3]' }, // Baby Blue Eyes
                            { bg: 'bg-[#90DBF4]', border: 'border-[#90DBF4]' }, // Sky Blue
                            { bg: 'bg-[#8EECF5]', border: 'border-[#8EECF5]' }, // Electric Blue
                            { bg: 'bg-[#98F5E1]', border: 'border-[#98F5E1]' }, // Magic Mint
                            { bg: 'bg-[#B9FBC0]', border: 'border-[#B9FBC0]' }  // Granny Smith Apple
                          ]
                          const colorScheme = colors[index % colors.length]
                          
                          return (
                            <div key={category} className="space-y-2">
                              <button
                                onClick={() => toggleSection(`source-category-${category}`)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl ${colorScheme.bg} border ${colorScheme.border} transition-all duration-300 text-left`}
                              >
                                <h4 className="font-bold text-gray-900 text-base">
                                  {category} ({categorySources.length} {categorySources.length === 1 ? 'source' : 'sources'})
                                </h4>
                                {expandedSections[`source-category-${category}`] ? (
                                  <Minus className="h-4 w-4 text-gray-600" />
                                ) : (
                                  <Plus className="h-4 w-4 text-gray-600" />
                                )}
                              </button>
                              
                              {expandedSections[`source-category-${category}`] && (
                                <div className={`pl-2 space-y-2 animate-in slide-in-from-top duration-200 bg-white rounded-lg p-3 border ${colorScheme.border}`}>
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
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* Next Steps Section with Glassmorphism Background */}
          <div className="mt-4 sm:mt-5 md:mt-6 p-4 sm:p-5 md:p-6 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-xl">
            {/* Suggestion Button */}
            <div className="mb-4 sm:mb-5 md:mb-6">
              <SuggestionButton pageType="feelings" />
            </div>

            {/* Navigation Options - Excluding Feelings */}
            <div className="space-y-2">
              {/* Mobile: Simple stacked buttons */}
              <div className="block lg:hidden space-y-2">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/barriers'}
                  className="w-full p-4 text-center h-auto border md:border-2 hover:bg-orange-100 dark:hover:bg-orange-900/40"
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
                  className="w-full p-4 text-center h-auto border md:border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Wrench className="h-5 w-5" />
                    <span className="font-medium text-gray-900 dark:text-white">Browse by Life Areas</span>
                  </div>
                </Button>

                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/complex_loops'}
                  className="w-full p-4 text-center h-auto border md:border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
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
                  className="w-full p-4 text-center h-auto border md:border-2 hover:bg-pink-50 dark:hover:bg-pink-900/20"
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
                  className="w-full p-4 text-center h-auto border md:border-2 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Puzzle className="h-5 w-5" />
                    <span className="font-medium text-gray-900 dark:text-white">Go to Systems Lab</span>
                  </div>
                </Button>
              </div>

              {/* Desktop: Detailed cards with descriptions */}
              <div className="hidden lg:block space-y-2">
                {/* Top Row - Barriers and Tasks */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => window.location.href = '/barriers'}
                    className="p-4 text-left h-auto border md:border-2 hover:bg-orange-100 dark:hover:bg-orange-900/40"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <Construction className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-base break-words leading-tight">Facing barriers or obstacles?</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">→ Go to Barriers Support</div>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => window.location.href = '/life_areas'}
                    className="p-4 text-left h-auto border md:border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <Wrench className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-base break-words leading-tight">Need help with specific tasks?</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">→ Go to Life Areas</div>
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
                    className="p-4 text-left h-auto border md:border-2 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <RotateCcw className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-base break-words leading-tight">Stuck in repetitive patterns?</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">→ Browse Complex Loops</div>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => window.location.href = '/identities'}
                    className="p-4 text-left h-auto border md:border-2 hover:bg-pink-50 dark:hover:bg-purple-900/20"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <Rainbow className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-base break-words leading-tight">Need identity-aware support?</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">→ Browse by Identity</div>
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
                    className="p-4 text-left h-auto border md:border-2 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <Puzzle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-base break-words leading-tight">Want to build a system around this?</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">→ Go to Systems Lab</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>


          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
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

      {/* Fixed Bottom Actions */}
      <FixedBottomActions
        slug={resolvedParams.feeling}
        summaryHtml={content?.intro_paragraph ? `<p>${content.intro_paragraph}</p>` : `<ul><li>Step away for 60–120s; breathe 4–6 times</li><li>Lower input: silence phone; reduce tabs</li><li>Pick 1 tiny task; 2‑minute timer; start</li></ul>`}
        pageType="feeling"
      />
    </div>
  )
}