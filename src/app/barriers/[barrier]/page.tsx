'use client'

import React from 'react'
import { useState, useEffect, use } from 'react'
import { 
  ArrowLeft, AlertCircle, Ban, Battery, Brain, CloudLightning, 
  Clock, HelpCircle, Mountain, Frown, CloudRain, XCircle, 
  Timer, Map, Users, Shuffle, Heart, Plus, Minus, Share2, 
  Wrench, RotateCcw, Rainbow, Puzzle, Construction, Pause,
  UserX, Focus, Snowflake, Route, Zap, TrendingDown, Layers, Sparkles,
  ArrowLeftRight, BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getBarriersContent, getBarrierSources } from '@/lib/supabase'
import type { BarriersContent, BarrierSources } from '@/lib/supabase'
import { StepIcon } from '@/components/ui/StepIcon';
import { SuggestionButton } from '@/components/ui/SuggestionButton';
import { Header } from '@/components/layout/Header';

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
    // Emotional validation & barrier-specific support
    { pattern: /\b(you are safe|you're safe|you are enough|you're enough|you matter|this is valid|this is real)\b/gi, style: 'bold' },
    { pattern: /\b(not your fault|not weakness|not overreacting|not broken|not lazy|not stupid)\b/gi, style: 'bold' },
    { pattern: /\b(you can do this|you've got this|you're capable|you're stronger)\b/gi, style: 'bold' },
    
    // Core actions and techniques for barriers
    { pattern: /\b(start small|tiny step|micro-action|break it down|chunk it)\b/gi, style: 'bold' },
    { pattern: /\b(breathe|pause|stop|slow down|take a break|rest)\b/gi, style: 'bold' },
    { pattern: /\b(one step|one thing|small steps|tiny actions|next right thing)\b/gi, style: 'bold' },
    { pattern: /\b(ask for help|reach out|support|accountability|body doubling)\b/gi, style: 'bold' },
    
    // Time and urgency reframes for barriers
    { pattern: /\b(right now|this moment|today|not forever|will pass|temporary)\b/gi, style: 'bold' },
    { pattern: /\b(doesn't have to be perfect|good enough|done is better|progress not perfection)\b/gi, style: 'bold' },
    { pattern: /\b(when you're ready|at your pace|no rush|take your time)\b/gi, style: 'bold' },
    
    // Barrier-specific concepts
    { pattern: /\b(executive function|working memory|dopamine|motivation|energy|focus)\b/gi, style: 'bold' },
    { pattern: /\b(ADHD brain|neurodivergent|rejection sensitivity|time blindness|task paralysis)\b/gi, style: 'bold' },
    { pattern: /\b(overwhelm|shutdown|freeze|stuck|procrastination)\b/gi, style: 'bold' },
    { pattern: /\b(nervous system|sensory|stimming|regulation)\b/gi, style: 'bold' },
    
    // Strategy and planning emphasis
    { pattern: /\b(strategy|plan|system|routine|structure|scaffold)\b/gi, style: 'bold' },
    { pattern: /\b(environment|setup|prepare|organize|declutter)\b/gi, style: 'bold' },
    
    // Gentle self-talk patterns for italics
    { pattern: /\b(maybe|perhaps|gently|softly|kindly|compassionately)\b/gi, style: 'italic' },
    { pattern: /\b(it's okay to|it's normal to|you're allowed to|you can|you might)\b/gi, style: 'italic' },
    { pattern: /\b(consider|try|experiment|explore|notice)\b/gi, style: 'italic' },
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

interface BarrierPageProps {
  params: Promise<{
    barrier: string
  }>
}

export default function BarrierPage({ params }: BarrierPageProps) {
  const resolvedParams = use(params)
  const [content, setContent] = useState<BarriersContent | null>(null)
  const [sources, setSources] = useState<BarrierSources[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({})
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // URL to barrier name mapping to handle apostrophes correctly
  const urlToBarrierName = (urlParam: string): string => {
    const urlMapping: Record<string, string> = {
      'i-already-failed': 'I Already Failed',
      'i-cant-start': "I Can't Start",
      'i-feel-alone': 'I Feel Alone',
      'i-cant-stay-focused': "I Can't Stay Focused",
      'i-dont-have-energy': "I Don't Have Energy",
      'i-dont-have-time': "I Don't Have Time",
      'i-dont-know-how': "I Don't Know How",
      'i-dont-know-where-to-start': "I Don't Know Where to Start",
      'i-feel-emotionally-blocked': 'I Feel Emotionally Blocked',
      'i-feel-frozen': 'I Feel Frozen',
      'i-feel-shame': 'I Feel Shame',
      'i-forgot': 'I Forgot',
      'i-got-distracted': 'I Got Distracted',
      'i-keep-avoiding-it': 'I Keep Avoiding It',
      'i-run-out-of-steam': 'I Run Out of Steam',
      'im-afraid-ill-fail': "I'm Afraid I'll Fail",
      'it-feels-pointless': 'It Feels Pointless',
      'it-feels-too-big': 'It Feels Too Big',
      'its-not-urgent': "It's Not Urgent",
      'too-many-decisions': 'Too Many Decisions'
    }

    return urlMapping[urlParam] || decodeURIComponent(urlParam)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        
        // Convert URL param back to display name with proper apostrophe handling
        const barrierName = urlToBarrierName(resolvedParams.barrier)

        const { data, error } = await getBarriersContent(barrierName)
        
        if (error) {
          setError(`Could not load content for "${barrierName}". This barrier may not have detailed content yet.`)
          return
        }

        if (!data) {
          setError(`No content found for "${barrierName}".`)
          return
        }

        setContent(data)
        
        // Fetch sources data using the URL slug
        const barrierSlug = resolvedParams.barrier  // This is the URL slug like 'i-cant-start'
        const { data: sourcesData, error: sourcesError } = await getBarrierSources(barrierSlug.replace(/-/g, '_'))
        
        if (sourcesData && sourcesData.length > 0) {
          setSources(sourcesData)
        }
      } catch (err) {
        setError('Failed to load barriers content.')
        console.error('Error loading barriers content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [resolvedParams.barrier])


  const goBack = () => {
    // Check if there's a category parameter in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    
    if (category) {
      // Go back to the specific category page - re-encode the category
      window.location.href = `/barriers?category=${encodeURIComponent(category)}`
    } else {
      // Try browser history first, fallback to main barriers page
      if (document.referrer && document.referrer.includes('/barriers')) {
        window.history.back()
      } else {
        window.location.href = '/barriers'
      }
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `ADHD First Aid Kit - ${content?.barrier_name}`,
      text: `Get help overcoming the barrier "${content?.barrier_name}" - ADHD-friendly strategies and support`,
      url: window.location.href
    }

    try {
      // Check if native sharing is available and supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard with better feedback
        await navigator.clipboard.writeText(window.location.href)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000) // Reset after 2 seconds
      }
    } catch (error) {
      // Fallback to clipboard if share fails
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000) // Reset after 2 seconds
      } catch (clipboardError) {
        console.error('Share failed:', error)
      }
    }
  }

  // Icon mapping for barriers
  const BARRIER_ICONS: Record<string, React.ElementType> = {
    "I Already Failed": XCircle,
    "I Can't Start": Pause,
    "I Feel Alone": UserX,
    "I Can't Stay Focused": Focus,
    "I Don't Have Energy": Battery,
    "I Don't Have Time": Clock,
    "I Don't Know How": HelpCircle,
    "I Don't Know Where to Start": Map,
    "I Feel Emotionally Blocked": Heart,
    "I Feel Frozen": Snowflake,
    "I Feel Shame": Frown,
    "I Forgot": Brain,
    "I Got Distracted": CloudLightning,
    "I Keep Avoiding It": Route,
    "I Run Out of Steam": Zap,
    "I'm Afraid I'll Fail": AlertCircle,
    "It Feels Pointless": TrendingDown,
    "It Feels Too Big": Mountain,
    "It's Not Urgent": Timer,
    "Too Many Decisions": Layers
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbc687] via-[#fff5db] to-[#d4fc79] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-lg">Loading barrier content...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbc687] via-[#fff5db] to-[#d4fc79] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative">
        <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-lg">
            <div className="flex items-center gap-4 mb-5">
              <Button
                variant="ghost"
                size="default"
                onClick={goBack}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Content Not Available
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error}
              </p>
              <Button 
                onClick={() => window.location.href = '/barriers'}
                className="bg-orange-600 hover:bg-orange-700 text-white"
                variant="default"
                size="lg"
              >
                Browse All Barriers
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbc687] via-[#fff5db] to-[#d4fc79] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative">
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
                  {React.createElement(BARRIER_ICONS[content?.barrier_name || ''] || Construction, {
                    className: "h-6 w-6 sm:h-8 sm:w-8 text-orange-500 flex-shrink-0"
                  })}
                  {content?.barrier_name}
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

            {/* Intro Paragraph - with orange border like screenshot */}
            <div 
              className="border-l-4 border-orange-400 bg-orange-50/50 dark:bg-orange-900/10 pl-5 py-4 mb-7 rounded-r-lg"
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
                    <Minus className="h-5 w-5 text-[#EA580C]" />
                  ) : (
                    <Plus className="h-5 w-5 text-[#EA580C]" />
                  )}
                </div>
              </Button>

              {expandedSections['stern'] && (
                <div className="bg-[#F87171]/30 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 animate-in slide-in-from-top duration-300 border border-[#F87171]/50 mt-2">
                  <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
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

          {/* Why ADHD Makes [Barrier] Worse Section */}
          <div className="relative mb-4">
            <Button
              onClick={() => toggleSection('adhd_reasons')}
              className="w-full flex items-center gap-4 mb-5 p-5 rounded-xl bg-[#FFADD3]/20 hover:bg-[#FFADD3]/30 transition-colors min-h-[90px] touch-manipulation"
              variant="ghost"
              size="lg"
            >
              <div className="bg-[#FFADD3]/90 rounded-full p-3 flex-shrink-0">
                <Brain className="h-5 w-5 text-gray-900" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  How ADHD Amplifies The Struggle
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
            
            {expandedSections['adhd_reasons'] && (
              <div className="bg-[#FFADD3]/20 rounded-xl p-5 space-y-4 animate-in slide-in-from-top duration-300 border border-[#FFADD3]/30">
                <ul className="space-y-3">
                  {content.adhd_reasons.map((reason, index) => {
                    // Define emojis for each ADHD reason
                    const reasonEmojis = ['🧩', '⏰', '🧠', '💔', '⚡'];
                    const emoji = reasonEmojis[index % reasonEmojis.length];
                    
                    // Split on the first colon to get bold heading and description
                    const colonIndex = reason.indexOf(':');
                    const hasColon = colonIndex !== -1;
                    const heading = hasColon ? reason.substring(0, colonIndex) : '';
                    const description = hasColon ? reason.substring(colonIndex + 1).trim() : reason;
                    
                    return (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-2xl mt-0 flex-shrink-0">{emoji}</span>
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {hasColon ? (
                            <>
                              <strong>{heading}</strong> - {formatMarkdownText(description)}
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
                // Define different color schemes for each step
                const colorSchemes = [
                  { bg: 'bg-[#FCF6BD]/20', hover: 'hover:bg-[#FCF6BD]/30', border: 'border-[#FCF6BD]/50', iconBg: 'bg-[#FCF6BD]/90' },
                  { bg: 'bg-[#D0F4DE]/20', hover: 'hover:bg-[#D0F4DE]/30', border: 'border-[#D0F4DE]/50', iconBg: 'bg-[#D0F4DE]/90' },
                  { bg: 'bg-[#A9DEF9]/20', hover: 'hover:bg-[#A9DEF9]/30', border: 'border-[#A9DEF9]/50', iconBg: 'bg-[#A9DEF9]/90' },
                  { bg: 'bg-[#E4C1F9]/20', hover: 'hover:bg-[#E4C1F9]/30', border: 'border-[#E4C1F9]/50', iconBg: 'bg-[#E4C1F9]/90' },
                  { bg: 'bg-[#ffdace]/20', hover: 'hover:bg-[#ffdace]/30', border: 'border-[#ffdace]/50', iconBg: 'bg-[#ffdace]/90' }
                ];
                
                const colors = colorSchemes[index % colorSchemes.length];
                
                return (
                  <div key={index} className="relative">
                    <Button
                      onClick={() => toggleSection(`step_${index}`)}
                      className={`w-full flex items-center gap-4 mb-5 p-4 rounded-xl ${colors.bg} ${colors.hover} transition-colors min-h-[75px] touch-manipulation`}
                      variant="ghost"
                      size="lg"
                    >
                      <div className={`${colors.iconBg} rounded-full p-3 flex-shrink-0`}>
                        <StepIcon 
                          iconName={step.emoji} 
                          className="h-5 w-5 text-gray-900 dark:text-white" 
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 break-words">
                          {step.number}. {step.title.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </h3>
                        <p className="text-base text-gray-600 dark:text-gray-400">
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
                    
                    {expandedSections[`step_${index}`] && (
                      <div className={`${colors.bg} rounded-xl p-5 space-y-4 animate-in slide-in-from-top duration-300 border ${colors.border}`}>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white mb-3">Try this:</p>
                          <ul className="space-y-2">
                            {step.try_this.map((item, itemIndex) => {
                              return (
                                <li key={itemIndex} className="flex items-start gap-3 ml-6 relative before:absolute before:left-[-1.75rem] before:top-1/2 before:w-3 before:h-px before:bg-gray-200 group/bullet hover:bg-gray-500/10 rounded-lg transition-colors">
                                  <span className="text-gray-900 flex-shrink-0 translate-y-[1px] text-lg group-hover/bullet:scale-110 transition-transform">•</span>
                                  <span className="text-gray-900 py-1 leading-relaxed">
                                    {formatMarkdownText(item)}
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

          {/* Sources Section - styled like a step but without number */}
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
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-1 break-words">
                      Sources: {content?.barrier_name}
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">
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
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-5 space-y-6 animate-in slide-in-from-top duration-300">
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      These resources explain the neurological roots and offer strategies for overcoming this barrier.
                    </p>
                    
                    {/* Group sources by category and sort by count (most to least) */}
                    {Object.entries(
                      sources.reduce((acc, source) => {
                        const category = source.category || 'Other'
                        if (!acc[category]) {
                          acc[category] = []
                        }
                        acc[category].push(source)
                        return acc
                      }, {} as Record<string, BarrierSources[]>)
                    ).sort(([, a], [, b]) => b.length - a.length).map(([category, categorySources], index) => {
                      // Define color schemes for categories (same as feelings)
                      const colors = [
                        { bg: 'bg-[#FBF8CC]/40', hover: 'hover:bg-[#FBF8CC]/60', border: 'border-[#FBF8CC]/30', text: 'text-gray-900', bulletColor: 'text-orange-600' },
                        { bg: 'bg-[#FFD3A5]/40', hover: 'hover:bg-[#FFD3A5]/60', border: 'border-[#FFD3A5]/30', text: 'text-gray-900', bulletColor: 'text-red-600' },
                        { bg: 'bg-[#FD9FDD]/40', hover: 'hover:bg-[#FD9FDD]/60', border: 'border-[#FD9FDD]/30', text: 'text-gray-900', bulletColor: 'text-pink-600' },
                        { bg: 'bg-[#EEAECA]/40', hover: 'hover:bg-[#EEAECA]/60', border: 'border-[#EEAECA]/30', text: 'text-gray-900', bulletColor: 'text-purple-600' },
                        { bg: 'bg-[#94F3E4]/40', hover: 'hover:bg-[#94F3E4]/60', border: 'border-[#94F3E4]/30', text: 'text-gray-900', bulletColor: 'text-teal-600' },
                        { bg: 'bg-[#B8E6B8]/40', hover: 'hover:bg-[#B8E6B8]/60', border: 'border-[#B8E6B8]/30', text: 'text-gray-900', bulletColor: 'text-green-600' },
                        { bg: 'bg-[#A8E6CF]/40', hover: 'hover:bg-[#A8E6CF]/60', border: 'border-[#A8E6CF]/30', text: 'text-gray-900', bulletColor: 'text-emerald-600' },
                        { bg: 'bg-[#C7CEEA]/40', hover: 'hover:bg-[#C7CEEA]/60', border: 'border-[#C7CEEA]/30', text: 'text-gray-900', bulletColor: 'text-indigo-600' },
                        { bg: 'bg-[#FFDAC1]/40', hover: 'hover:bg-[#FFDAC1]/60', border: 'border-[#FFDAC1]/30', text: 'text-gray-900', bulletColor: 'text-orange-500' },
                        { bg: 'bg-[#FFB7B2]/40', hover: 'hover:bg-[#FFB7B2]/60', border: 'border-[#FFB7B2]/30', text: 'text-gray-900', bulletColor: 'text-red-500' }
                      ]
                      const colorScheme = colors[index % colors.length]
                      
                      return (
                        <div key={category} className="relative">
                          <Button
                            onClick={() => toggleSection(`sources_${category.replace(/\s+/g, '_').toLowerCase()}`)}
                            className={`w-full flex items-center gap-3 mb-3 p-4 rounded-lg ${colorScheme.bg} ${colorScheme.hover} transition-all duration-200 touch-manipulation border ${colorScheme.border}`}
                            variant="ghost"
                            size="default"
                          >
                            <div className="flex-1 text-left">
                              <h4 className="font-bold text-gray-900 text-base">
                                {category} ({categorySources.length} {categorySources.length === 1 ? 'source' : 'sources'})
                              </h4>
                            </div>
                            <div className="flex-shrink-0">
                              {expandedSections[`sources_${category.replace(/\s+/g, '_').toLowerCase()}`] ? (
                                <Minus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              ) : (
                                <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              )}
                            </div>
                          </Button>
                          
                          {expandedSections[`sources_${category.replace(/\s+/g, '_').toLowerCase()}`] && (
                            <div className={`${colorScheme.bg} rounded-lg p-4 space-y-3 animate-in slide-in-from-top duration-300 mb-4 border ${colorScheme.border}`}>
                              {categorySources.map((source, sourceIndex) => (
                                <div key={sourceIndex} className={`border-l-3 ${colorScheme.border} pl-4 py-2`}>
                                  <div className="flex items-start gap-2">
                                    <span className={`${colorScheme.bulletColor} dark:${colorScheme.bulletColor} mt-1 flex-shrink-0`}>•</span>
                                    <div>
                                      <h5 className="font-semibold text-gray-900 dark:text-white">
                                        {source.title}
                                        {source.authors && (
                                          <span className="font-normal text-gray-600 dark:text-gray-400">
                                            {' by '}{source.authors}
                                          </span>
                                        )}
                                      </h5>
                                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-1">
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
              <SuggestionButton pageType="barriers" />
            </div>

            {/* Navigation Options - Excluding Barriers */}
            <div className="space-y-4">
            {/* Top Row - Feelings and Tasks */}
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
            <p>Need more help? Check out our <a href="/guides" className="text-orange-600 hover:underline">guides</a>, <a href="/scripts" className="text-orange-600 hover:underline">scripts</a>, <a href="/quizzes" className="text-orange-600 hover:underline">quizzes</a>, or <a href="/resources" className="text-orange-600 hover:underline">resources</a>.</p>
          </div>
          
          </div> {/* Close glassmorphism container */}
        </div>
      </div>
    </div>
  )
}