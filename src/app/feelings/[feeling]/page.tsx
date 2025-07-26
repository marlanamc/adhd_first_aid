'use client'

import React from 'react'
import { useState, useEffect, use } from 'react'
import { 
  ArrowLeft, Heart, Plus, Minus, BookOpen, 
  Brain, Zap, Frown, Users, BrainCircuit, 
  Battery, Flame, Sparkles, CloudLightning, 
  Rainbow, AlertCircle, Skull, CloudRain, 
  Waves, CloudDrizzle, Shield, UserX, Share2 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getFeelingsContent } from '@/lib/supabase'
import type { FeelingsContent } from '@/lib/supabase'
import { StepIcon } from '@/components/ui/StepIcon';
import { SupportBoxes } from '@/components/ui/SupportBoxes';

// Function to convert markdown-style bold to JSX
const formatBoldText = (text: string) => {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// Icon mapping to match main feelings page
const FEELING_ICONS: Record<string, React.ElementType> = {
  // Cognitive & Overload
  'Mental Fog': CloudDrizzle,
  'Overwhelmed': Waves,
  'Forgetful': Brain,
  'Scattered': CloudLightning,
  'Overstimulated': Sparkles,
  
  // Dysregulation & Shutdown
  'Stuck': BrainCircuit,
  'Drained': Battery,
  'Burned Out': Flame,
  'Numb': Skull,
  'Ashamed': Frown,
  'Frustrated': Flame,
  
  // Heavy Feelings
  'Guilty': AlertCircle,
  'Defeated': CloudRain,
  'Hopeless': CloudRain,
  'Stressed': Zap,
  
  // Jittery & Wound Up
  'Anxious': AlertCircle,
  'Restless': Sparkles,
  'Wired': Zap,
  'Tense': Shield,
  
  // Social & Connection
  'Lonely': Users,
  'Misunderstood': Users,
  'Rejected': UserX
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({})
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [introRevealed, setIntroRevealed] = useState(false)
  const [showIntroParagraph, setShowIntroParagraph] = useState(false)
  const [availableGuide, setAvailableGuide] = useState<{
    title: string;
    emoji: string;
    slug: string;
    description: string;
  } | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

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

  useEffect(() => {
    // Add delay for intro paragraph fade-in
    const timer = setTimeout(() => {
      setShowIntroParagraph(true)
    }, 1500); // 1.5s delay

    return () => clearTimeout(timer);
  }, []);

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

  const handleShare = async () => {
    const shareData = {
      title: `ADHD First Aid Kit - ${content?.feeling_name}`,
      text: `Get help with feeling ${content?.feeling_name?.toLowerCase()} - ADHD-friendly strategies and support`,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbc2eb] via-[#fbd786] to-[#fbc687] relative">
        <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-lg">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading content...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbc2eb] via-[#fbd786] to-[#fbc687] relative">
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
                onClick={() => window.location.href = '/feelings'}
                className="bg-pink-600 hover:bg-pink-700 text-white"
                variant="default"
                size="lg"
              >
                Browse All Feelings
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbc2eb] via-[#fbd786] to-[#fbc687] relative">
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
              className={`border-l-4 border-pink-400 bg-pink-50/50 dark:bg-pink-900/10 pl-5 py-4 mb-7 rounded-r-lg transition-opacity duration-1000 ease-in-out ${showIntroParagraph ? 'opacity-100' : 'opacity-0'}`}
            >
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                {content?.intro_paragraph && formatBoldText(content.intro_paragraph)}
              </p>
            </div>
          </div>

          {/* Section Divider */}
          <div className="flex items-center justify-center gap-4 mb-5 text-gray-400 dark:text-gray-600">
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
            <p className="text-sm font-medium px-4">Choose how you want to begin</p>
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
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 animate-in slide-in-from-top duration-300 border border-green-200 dark:border-green-800 mt-2">
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {content.gentle_advice}
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
                  {expandedSections['stern'] ? (
                    <Minus className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500" />
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
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 animate-in slide-in-from-top duration-300 border border-red-200 dark:border-red-800 mt-2">
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {content.stern_advice}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Gentle guidance note - moved before ADHD reasons section */}
          <div className="flex items-center justify-center gap-4 mb-5 text-gray-400 dark:text-gray-600">
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
            <p className="text-sm font-medium px-4">Explore when you're ready</p>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
          </div>

          {/* Why ADHD Makes [Feeling] Worse Section */}
          <div className="relative mb-4">
            <Button
              onClick={() => toggleSection('adhd_reasons')}
              onMouseEnter={() => setHoveredSection('adhd_reasons')}
              onMouseLeave={() => setHoveredSection(null)}
              className="w-full flex items-center gap-4 mb-5 p-5 rounded-xl bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors min-h-[90px] touch-manipulation"
              variant="ghost"
              size="lg"
            >
              <div className="bg-purple-200 dark:bg-purple-800 rounded-full p-3 flex-shrink-0">
                <Brain className="h-5 w-5 text-gray-900 dark:text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Why ADHD Makes {content?.feeling_name} Worse
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Understanding the neuroscience
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
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 space-y-4 animate-in slide-in-from-top duration-300 border border-purple-200 dark:border-purple-800">
                <ul className="space-y-3">
                  {content.adhd_reasons.map((reason, index) => {
                    // Split on the first colon to get bold heading and description
                    const colonIndex = reason.indexOf(':');
                    const hasColon = colonIndex !== -1;
                    const heading = hasColon ? reason.substring(0, colonIndex + 1) : '';
                    const description = hasColon ? reason.substring(colonIndex + 1).trim() : reason;
                    
                    return (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0">•</span>
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {hasColon ? (
                            <>
                              <strong>{heading}</strong> {description}
                            </>
                          ) : (
                            reason
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
                  { bg: 'bg-blue-100/50', hover: 'hover:bg-blue-100', dark: 'dark:bg-blue-900/20 dark:hover:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800', iconBg: 'bg-blue-200 dark:bg-blue-800', contentBg: 'bg-blue-50/70 dark:bg-blue-900/20', contentBorder: 'border-blue-200 dark:border-blue-800', bulletColor: 'text-blue-600 dark:text-blue-400' },
                  { bg: 'bg-green-100/50', hover: 'hover:bg-green-100', dark: 'dark:bg-green-900/20 dark:hover:bg-green-900/30', border: 'border-green-200 dark:border-green-800', iconBg: 'bg-green-200 dark:bg-green-800', contentBg: 'bg-green-50/70 dark:bg-green-900/20', contentBorder: 'border-green-200 dark:border-green-800', bulletColor: 'text-green-600 dark:text-green-400' },
                  { bg: 'bg-yellow-100/50', hover: 'hover:bg-yellow-100', dark: 'dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800', iconBg: 'bg-yellow-200 dark:bg-yellow-800', contentBg: 'bg-yellow-50/70 dark:bg-yellow-900/20', contentBorder: 'border-yellow-200 dark:border-yellow-800', bulletColor: 'text-yellow-600 dark:text-yellow-400' },
                  { bg: 'bg-orange-100/50', hover: 'hover:bg-orange-100', dark: 'dark:bg-orange-900/20 dark:hover:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800', iconBg: 'bg-orange-200 dark:bg-orange-800', contentBg: 'bg-orange-50/70 dark:bg-orange-900/20', contentBorder: 'border-orange-200 dark:border-orange-800', bulletColor: 'text-orange-600 dark:text-orange-400' },
                  { bg: 'bg-pink-100/50', hover: 'hover:bg-pink-100', dark: 'dark:bg-pink-900/20 dark:hover:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800', iconBg: 'bg-pink-200 dark:bg-pink-800', contentBg: 'bg-pink-50/70 dark:bg-pink-900/20', contentBorder: 'border-pink-200 dark:border-pink-800', bulletColor: 'text-pink-600 dark:text-pink-400' }
                ];
                
                const colors = colorSchemes[index % colorSchemes.length];
                
                return (
                  <div key={index} className="relative">
                    <Button
                      onClick={() => toggleSection(`step_${index}`)}
                      onMouseEnter={() => setHoveredSection(`step_${index}`)}
                      onMouseLeave={() => setHoveredSection(null)}
                      className="w-full flex items-center gap-4 mb-5 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors min-h-[75px] touch-manipulation"
                      variant="ghost"
                      size="lg"
                    >
                      <div className={`${colors.iconBg} rounded-full p-3 flex-shrink-0`}>
                        <StepIcon 
                          iconName={step.emoji} 
                          className="h-5 w-5 text-gray-900 dark:text-white" 
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {step.number}. {step.title}
                        </h3>
                        <p className="text-base text-gray-600 dark:text-gray-400">
                          {step.intro.replace(/\*\*/g, '')}
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
                      <div className="bg-white dark:bg-gray-900 rounded-xl p-5 space-y-4 animate-in slide-in-from-top duration-300">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white mb-3">Try this:</p>
                          <ul className="space-y-2">
                            {step.try_this.map((item, itemIndex) => {
                              // Split on the first colon to get bold heading and description
                              const colonIndex = item.indexOf(':');
                              const hasColon = colonIndex !== -1;
                              const heading = hasColon ? item.substring(0, colonIndex + 1) : '';
                              const description = hasColon ? item.substring(colonIndex + 1).trim() : item;
                              
                              return (
                                <li key={itemIndex} className="flex items-start gap-3">
                                  <span className={`${colors.bulletColor} mt-1 flex-shrink-0`}>•</span>
                                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {hasColon ? (
                                      <>
                                        <strong>{heading}</strong> {description}
                                      </>
                                    ) : (
                                      item
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        
                        <div className={`${colors.contentBg} border-l-4 ${colors.contentBorder.replace('border-', 'border-l-')} pl-4 py-2 rounded-r-lg`}>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">💡 Tip:</span> {step.tip}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Need More Support Box */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Need More Support?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-center">
                Read our comprehensive guide about {content?.feeling_name.toLowerCase()} with practical strategies and insights.
              </p>
              <div className="flex flex-col gap-3 items-center">
                <Button 
                  onClick={() => window.location.href = `/guides/mentalfog`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl w-full md:w-auto"
                  variant="default"
                  size="lg"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read: Cognitive & Overload Guide
                </Button>
                <Button 
                  onClick={() => window.location.href = `/strategies?feeling=${encodeURIComponent(content?.feeling_name || '')}`}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl w-full md:w-auto"
                  variant="default"
                  size="lg"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Show Strategies for {content?.feeling_name}
                </Button>
              </div>
            </div>
          </div>

          {/* Support Boxes */}
          <div className="mt-8">
            <SupportBoxes />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Need more help? Check out our <a href="/guides" className="text-blue-600 hover:underline">guides</a> or <a href="/resources" className="text-blue-600 hover:underline">resources</a>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}