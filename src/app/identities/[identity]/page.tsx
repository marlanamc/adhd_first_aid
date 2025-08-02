'use client'

import React from 'react'
import { useState, useEffect, use } from 'react'
import { 
  ArrowLeft, Plus, Minus, Share2, Brain, Heart, 
  Wrench, RotateCcw, Rainbow, Puzzle, Construction,
  Waves, CheckCircle, XCircle, Lightbulb, Target,
  Users, Globe, BookOpen, Zap, Shield, Star,
  Clock, Home, Briefcase, School, Activity,
  Camera, Music, Palette, Code, Database,
  Settings, Award, Compass, Map, Route,
  Scale, AlertTriangle, Hand, PenTool, 
  Sparkles, HeartHandshake, MessageCircle,
  TrendingDown, Megaphone, Repeat, Search,
  Key, Flame, Folder, FileText,
  Stethoscope, Laptop, Handshake,
  UserPlus, DollarSign, Sprout,
  Network, Timer, Building2,
  Building, Link, ArrowLeftRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getIdentitiesContent } from '@/lib/supabase'
import type { IdentitiesContent } from '@/lib/supabase'
import { SuggestionButton } from '@/components/ui/SuggestionButton';

// Function to map emoji strings to Lucide icons
const getIconForEmoji = (emoji: string) => {
  const emojiToIconMap: Record<string, React.ElementType> = {
    // Time & Organization
    '⏰': Timer,
    '🕐': Clock,
    '⚖️': Scale,
    '⚠️': AlertTriangle,
    '✅': CheckCircle,
    '❌': XCircle,
    '✋': Hand,
    '✍️': PenTool,
    
    // Emotional & Mental States
    '🌊': Waves,
    '🧠': Brain,
    '❤️‍🩹': HeartHandshake,
    '❤️': Heart,
    '💖': Heart,
    '💢': Flame,
    '😵‍💫': Brain, // Using brain for confusion/overwhelm
    '💬': MessageCircle,
    
    // Energy & Action
    '⚡': Zap,
    '💪': Building2, // Using building for strength metaphor
    '🔥': Flame,
    '✨': Sparkles,
    '🌱': Sprout,
    '🚀': Zap,
    '🌟': Star,
    '⭐': Star,
    
    // Tools & Resources
    '🛠️': Wrench,
    '🛡️': Shield,
    '🗂️': Folder,
    '🧰': Database,
    '🔑': Key,
    '🧭': Compass,
    '🗺️': Map,
    '🛤️': Route,
    '⚙️': Settings,
    
    // Social & Support
    '👥': Users,
    '🤝': Handshake,
    '🫂': UserPlus,
    '🧑‍⚕️': Stethoscope,
    '🧑‍💻': Laptop,
    
    // Learning & Growth
    '📚': BookOpen,
    '🎓': School,
    '📢': Megaphone,
    '🗣️': MessageCircle,
    '📝': FileText,
    '🧾': FileText,
    '💡': Lightbulb,
    '🎯': Target,
    
    // Systems & Processes
    '🔁': Repeat,
    '🔄': RotateCcw,
    '🌐': Network,
    '🔍': Search,
    '📉': TrendingDown,
    '💸': DollarSign,
    
    // Spaces & Environment
    '🏠': Home,
    '💼': Briefcase,
    '🌍': Globe,
    '🧘': Building, // Meditation space
    '🧘‍♀️': Building,
    
    // Creative & Expression
    '🎨': Palette,
    '🎵': Music,
    '📸': Camera,
    '💻': Code,
    '📊': Activity,
    
    // Challenges & Barriers
    '🧱': Construction, // Building/barriers
    '⛓️': Link, // Using link for chains
    '🚧': Construction,
    
    // Achievement & Success
    '🏆': Award,
    '✨': Sparkles,
    '🌟': Star,
    
    // Default fallback
    '💭': Brain,
    '📝': BookOpen,
    '🔸': Lightbulb
  };
  
  return emojiToIconMap[emoji] || Lightbulb; // Default to Lightbulb if emoji not found
};

// Function to convert markdown-style formatting to JSX, including callout boxes
const formatMarkdownText = (text: string, colorScheme?: any) => {
  // Handle callout boxes (> content) first
  if (text.startsWith('> ')) {
    const calloutContent = text.substring(2);
    
    // Split by double newlines to handle multi-paragraph callouts
    const paragraphs = calloutContent.split('\n\n');
    
    // Use section color scheme if provided, otherwise default to blue
    const calloutColors = colorScheme ? {
      bg: colorScheme.bg.replace('/50', '/30'), // Make callout slightly more subtle
      border: colorScheme.border.split(' ')[0], // Get just the border color class
      textColor: colorScheme.bulletColor
    } : {
      bg: 'bg-blue-100/30 dark:bg-blue-900/15',
      border: 'border-blue-200',
      textColor: 'text-blue-600 dark:text-blue-400'
    };
    
    return (
      <div className={`${calloutColors.bg} border-l-4 ${calloutColors.border} p-4 rounded-r-lg my-4`}>
        <div className={`${calloutColors.textColor} font-medium space-y-2`}>
          {paragraphs.map((paragraph, index) => (
            <div key={index}>
              {processTextFormatting(paragraph.trim())}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return processTextFormatting(text);
};

// Helper function to process bold and italic formatting
const processTextFormatting = (text: string) => {
  // If text already has markdown formatting, process it as-is
  if (text.includes('**') || text.includes('_') || text.includes('*')) {
    const result: React.ReactNode[] = [];
    let keyCounter = 0;

    // Simple approach: find all markdown patterns and replace them in order
    let processedText = text;
    const replacements: Array<{ start: number; end: number; element: React.ReactNode }> = [];

    // Find all bold patterns (**text**)
    const boldMatches = [...processedText.matchAll(/\*\*([^*]+?)\*\*/g)];
    boldMatches.forEach(match => {
      if (match.index !== undefined) {
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          element: <strong key={`bold-${keyCounter++}`}>{match[1]}</strong>
        });
      }
    });

    // Find all italic patterns (*text*) that don't overlap with bold
    const italicMatches = [...processedText.matchAll(/\*([^*]+?)\*/g)];
    italicMatches.forEach(match => {
      if (match.index !== undefined) {
        // Check if this overlaps with any bold matches or is part of **text**
        const overlaps = replacements.some(r => 
          (match.index! < r.end && match.index! + match[0].length > r.start)
        );
        
        // Also check if this is part of a **text** pattern
        const isPartOfBold = (match.index! > 0 && processedText[match.index! - 1] === '*') ||
                            (match.index! + match[0].length < processedText.length && processedText[match.index! + match[0].length] === '*');
        
        if (!overlaps && !isPartOfBold) {
          replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            element: <em key={`italic-${keyCounter++}`}>{match[1]}</em>
          });
        }
      }
    });

    // Find all italic patterns (_text_)
    const underscoreMatches = [...processedText.matchAll(/_([^_]+?)_/g)];
    underscoreMatches.forEach(match => {
      if (match.index !== undefined) {
        // Check if this overlaps with existing matches
        const overlaps = replacements.some(r => 
          (match.index! < r.end && match.index! + match[0].length > r.start)
        );
        if (!overlaps) {
          replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            element: <em key={`italic-${keyCounter++}`}>{match[1]}</em>
          });
        }
      }
    });

    // Sort replacements by position
    replacements.sort((a, b) => a.start - b.start);

    // Build result by interleaving text and elements
    let lastEnd = 0;
    replacements.forEach(replacement => {
      // Add text before this replacement
      if (replacement.start > lastEnd) {
        const textBefore = processedText.slice(lastEnd, replacement.start);
        if (textBefore) {
          result.push(textBefore);
        }
      }
      // Add the replacement element
      result.push(replacement.element);
      lastEnd = replacement.end;
    });

    // Add remaining text
    if (lastEnd < processedText.length) {
      const remainingText = processedText.slice(lastEnd);
      if (remainingText) {
        result.push(remainingText);
      }
    }

    // If no replacements, return original text
    return result.length > 0 ? result : [text];
  }

  // For plain text advice, add intelligent formatting for identity-specific content
  const emphasisPatterns = [
    // Emotional validation & identity-specific support
    { pattern: /\b(you are safe|you're safe|you are enough|you're enough|you matter|this is valid|this is real)\b/gi, style: 'bold' },
    { pattern: /\b(not your fault|not weakness|not overreacting|not broken|not too much|not too little)\b/gi, style: 'bold' },
    { pattern: /\b(you belong|you're welcome|you're valued|you're seen|you're heard)\b/gi, style: 'bold' },
    
    // Identity affirmation and empowerment
    { pattern: /\b(your identity|your truth|your experience|your story|your journey)\b/gi, style: 'bold' },
    { pattern: /\b(authentic|genuine|real|true to yourself|honor yourself)\b/gi, style: 'bold' },
    { pattern: /\b(boundaries|limits|needs|rights|dignity|respect)\b/gi, style: 'bold' },
    
    // Core actions and self-advocacy
    { pattern: /\b(speak up|advocate|assert|communicate|express|voice)\b/gi, style: 'bold' },
    { pattern: /\b(ask for help|reach out|support|community|allies)\b/gi, style: 'bold' },
    { pattern: /\b(self-care|self-compassion|self-advocacy|self-protection)\b/gi, style: 'bold' },
    
    // Navigating challenges and systems
    { pattern: /\b(navigate|manage|cope with|handle|deal with|work through)\b/gi, style: 'bold' },
    { pattern: /\b(discrimination|bias|stigma|prejudice|microaggressions)\b/gi, style: 'bold' },
    { pattern: /\b(workplace|school|healthcare|family|relationships)\b/gi, style: 'bold' },
    
    // Identity-specific ADHD concepts
    { pattern: /\b(masking|camouflaging|hiding|performing|pretending)\b/gi, style: 'bold' },
    { pattern: /\b(intersectionality|multiple identities|complex identity)\b/gi, style: 'bold' },
    { pattern: /\b(double stigma|triple threat|additional challenges)\b/gi, style: 'bold' },
    
    // Time and change reframes
    { pattern: /\b(right now|this moment|today|not forever|will pass|temporary)\b/gi, style: 'bold' },
    { pattern: /\b(progress not perfection|small steps|your pace|gradual change)\b/gi, style: 'bold' },
    { pattern: /\b(healing|growth|learning|evolving|becoming)\b/gi, style: 'bold' },
    
    // Support and community
    { pattern: /\b(community|tribe|chosen family|support network|allies)\b/gi, style: 'bold' },
    { pattern: /\b(representation|visibility|role models|mentors)\b/gi, style: 'bold' },
    
    // Gentle self-talk patterns for italics
    { pattern: /\b(maybe|perhaps|gently|softly|kindly|compassionately)\b/gi, style: 'italic' },
    { pattern: /\b(it's okay to|it's normal to|you're allowed to|you can|you might)\b/gi, style: 'italic' },
    { pattern: /\b(consider|try|experiment|explore|notice|observe)\b/gi, style: 'italic' },
    { pattern: /\b(when you feel ready|if it helps|as you can|at your own pace)\b/gi, style: 'italic' },
    { pattern: /\b(remember|know that|trust that|believe that)\b/gi, style: 'italic' },
  ];

  let formattedText = text;
  const markdownReplacements: Array<{start: number, end: number, replacement: string, originalText: string}> = [];

  // Find and mark all patterns for replacement
  emphasisPatterns.forEach(({ pattern, style }) => {
    let match;
    // Reset the regex to start from beginning
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
      const marker = style === 'bold' ? '**' : '_';
      markdownReplacements.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement: `${marker}${match[0]}${marker}`,
        originalText: match[0]
      });
    }
  });

  // Sort replacements by position (reverse order to avoid index shifting)
  markdownReplacements.sort((a, b) => b.start - a.start);

  // Apply replacements
  markdownReplacements.forEach(({ start, end, replacement }) => {
    formattedText = formattedText.slice(0, start) + replacement + formattedText.slice(end);
  });

  // Now process the enhanced text with the existing markdown processor
  const result: React.ReactNode[] = [];
  let keyCounter = 0;
  const replacements: Array<{ start: number; end: number; element: React.ReactNode }> = [];

  // Find all bold patterns (**text**)
  const boldMatches = [...formattedText.matchAll(/\*\*([^*]+?)\*\*/g)];
  boldMatches.forEach(match => {
    if (match.index !== undefined) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        element: <strong key={`bold-${keyCounter++}`}>{match[1]}</strong>
      });
    }
  });

  // Find all italic patterns (_text_)
  const underscoreMatches = [...formattedText.matchAll(/_([^_]+?)_/g)];
  underscoreMatches.forEach(match => {
    if (match.index !== undefined) {
      const overlaps = replacements.some(r => 
        (match.index! < r.end && match.index! + match[0].length > r.start)
      );
      if (!overlaps) {
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          element: <em key={`italic-${keyCounter++}`}>{match[1]}</em>
        });
      }
    }
  });

  // Sort replacements by position
  replacements.sort((a, b) => a.start - b.start);

  // Build result by interleaving text and elements
  let lastEnd = 0;
  replacements.forEach(replacement => {
    // Add text before this replacement
    if (replacement.start > lastEnd) {
      const textBefore = formattedText.slice(lastEnd, replacement.start);
      if (textBefore) {
        result.push(textBefore);
      }
    }
    // Add the replacement element
    result.push(replacement.element);
    lastEnd = replacement.end;
  });

  // Add remaining text
  if (lastEnd < formattedText.length) {
    const remainingText = formattedText.slice(lastEnd);
    if (remainingText) {
      result.push(remainingText);
    }
  }

  // If no replacements, return original text
  return result.length > 0 ? result : [text];
};

interface IdentityPageProps {
  params: Promise<{
    identity: string
  }>
}

export default function IdentityPage({ params }: IdentityPageProps) {
  const resolvedParams = use(params)
  const [content, setContent] = useState<IdentitiesContent | null>(null)
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

  // URL to identity name mapping to handle special characters correctly
  const urlToIdentityName = (urlParam: string): string => {
    const urlMapping: Record<string, string> = {
      'the-newly-diagnosed': 'The Recently Diagnosed',
      'the-audhd-individual': 'The AuDHD Individual',
      'the-breadwinner': 'The Breadwinner',
      'the-burned-out-professional': 'The Burned Out Professional',
      'the-creative': 'The Creative',
      'the-entrepreneur': 'The Entrepreneur',
      'the-immigrant': 'The Immigrant',
      'the-job-seeker': 'The Job Seeker',
      'the-low-income-individual': 'The Low-Income Individual',
      'the-neurodivergent-adult': 'The Neurodivergent Adult',
      'the-individual-without-a-support-system': 'The Individual Without a Support System',
      'the-overly-responsible-sibling': 'The Overly Responsible Sibling',
      'the-parent': 'The Parent',
      'the-parent-of-an-adhd-child': 'ADHD Identity Guide: The Parent of a Child with ADHD',
      'queer_or_trans': 'ADHD Identity Guide: Queer & Trans',
      'the-queer-or-trans-individual': 'ADHD Identity Guide: Queer & Trans',
      'the-recovering-perfectionist': 'ADHD Identity Guide: The Recovering Perfectionist',
      'the-sick-or-chronically-ill-adult': 'The Sick or Chronically Ill',
      'the-solo-household-manager': 'The Solo Household Manager',
      'the-student': 'The Student',
      'the-working-multiple-jobs-individual': 'The Working Multiple Jobs',
      'the-grieving': 'The Grieving or Emotionally Raw Individual',
      'the-bipoc-individual': 'The BIPOC Individual',
      'the-caretaker': 'The Caretaker'
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
        
        // Convert URL param back to display name with proper mapping
        const identityName = urlToIdentityName(resolvedParams.identity)

        const { data, error } = await getIdentitiesContent(identityName)
        
        if (error) {
          setError(`Could not load content for "${identityName}". This identity may not have detailed content yet.`)
          return
        }

        if (!data) {
          setError(`No content found for "${identityName}".`)
          return
        }

        setContent(data)
      } catch (err) {
        setError('Failed to load identity content.')
        console.error('Error loading identity content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [resolvedParams.identity])


  const goBack = () => {
    // Check if there's a category parameter in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    
    if (category) {
      // Go back to the specific category page - re-encode the category
      window.location.href = `/identities?category=${encodeURIComponent(category)}`
    } else {
      // Try browser history first, fallback to main identities page
      if (document.referrer && document.referrer.includes('/identities')) {
        window.history.back()
      } else {
        window.location.href = '/identities'
      }
    }
  }

  const handleShare = async () => {
    const cleanName = content?.identity_name?.replace(/^(The |ADHD Identity Guide: The |ADHD Identity Guide: )/, '') || content?.identity_name
    const shareData = {
      title: `ADHD First Aid Kit - ${cleanName}`,
      text: `Get support for ADHD as "${cleanName}" - ADHD-friendly strategies and guidance`,
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

  // Icon mapping for identities
  const IDENTITY_ICONS: Record<string, React.ElementType> = {
    "The Recently Diagnosed": Brain,
    "The AuDHD Individual": Rainbow,
    "The Breadwinner": Construction,
    "The Burned Out Professional": Construction,
    "The Creative": Heart,
    "The Entrepreneur": Construction,
    "The Immigrant": Heart,
    "The Job Seeker": Construction,
    "The Low-Income Individual": Heart,
    "The Neurodivergent Adult": Brain,
    "The Individual Without a Support System": Heart,
    "The Overly Responsible Sibling": Heart,
    "The Parent": Heart,
    "ADHD Identity Guide: The Parent of a Child with ADHD": Heart,
    "ADHD Identity Guide: Queer & Trans": Rainbow,
    "ADHD Identity Guide: The Recovering Perfectionist": Heart,
    "The Sick or Chronically Ill": Heart,
    "The Solo Household Manager": Construction,
    "The Student": Brain,
    "The Working Multiple Jobs": Construction,
    "The Grieving or Emotionally Raw Individual": Heart,
    "The BIPOC Individual": Heart,
    "The Caretaker": Heart
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#a18cd1] via-[#b19cd9] to-[#dec6f7] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-lg">Loading identity content...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e0aaff] via-[#c77dff] to-[#9d4edd] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative">
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
                onClick={() => window.location.href = '/identities'}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                variant="default"
                size="lg"
              >
                Browse All Identities
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0aaff] via-[#c77dff] to-[#9d4edd] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative">
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
                  {React.createElement(IDENTITY_ICONS[content?.identity_name || ''] || Rainbow, {
                    className: "h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0"
                  })}
                  {content?.identity_name?.replace(/^(The |ADHD Identity Guide: The |ADHD Identity Guide: )/, '') || content?.identity_name}
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

            {/* Intro Paragraph - with purple border */}
            <div 
              className="border-l-4 border-purple-400 bg-purple-50/50 dark:bg-purple-900/10 pl-5 py-4 mb-7 rounded-r-lg"
            >
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                {content?.intro_paragraph && formatMarkdownText(content.intro_paragraph, {
                  bg: 'bg-purple-100/50 dark:bg-purple-900/20',
                  border: 'border-purple-200 dark:border-purple-800',
                  bulletColor: 'text-purple-600 dark:text-purple-400'
                })}
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
                    {formatMarkdownText(content.gentle_advice, {
                      bg: 'bg-green-100/50 dark:bg-green-900/20',
                      border: 'border-green-200 dark:border-green-800',
                      bulletColor: 'text-green-600 dark:text-green-400'
                    })}
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
                    {formatMarkdownText(content.stern_advice, {
                      bg: 'bg-red-100/50 dark:bg-red-900/20',
                      border: 'border-red-200 dark:border-red-800',
                      bulletColor: 'text-red-600 dark:text-red-400'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Gentle guidance note */}
          <div className="flex items-center justify-center gap-4 mb-5 text-gray-400 dark:text-gray-600">
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <p className="text-sm font-medium">Explore when you're ready</p>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
          </div>

          {/* Content Sections with nested toggles */}
          {content.content_sections && content.content_sections.length > 0 && (
            <div className="space-y-4">
              {content.content_sections.map((section, index) => {
                // Define different color schemes for each section
                const colorSchemes = [
                  { bg: 'bg-blue-100/50', hover: 'hover:bg-blue-100', dark: 'dark:bg-blue-900/20 dark:hover:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800', iconBg: 'bg-blue-200 dark:bg-blue-800', bulletColor: 'text-blue-600 dark:text-blue-400' },
                  { bg: 'bg-purple-100/50', hover: 'hover:bg-purple-100', dark: 'dark:bg-purple-900/20 dark:hover:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800', iconBg: 'bg-purple-200 dark:bg-purple-800', bulletColor: 'text-purple-600 dark:text-purple-400' },
                  { bg: 'bg-teal-100/50', hover: 'hover:bg-teal-100', dark: 'dark:bg-teal-900/20 dark:hover:bg-teal-900/30', border: 'border-teal-200 dark:border-teal-800', iconBg: 'bg-teal-200 dark:bg-teal-800', bulletColor: 'text-teal-600 dark:text-teal-400' },
                  { bg: 'bg-pink-100/50', hover: 'hover:bg-pink-100', dark: 'dark:bg-pink-900/20 dark:hover:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800', iconBg: 'bg-pink-200 dark:bg-pink-800', bulletColor: 'text-pink-600 dark:text-pink-400' },
                  { bg: 'bg-amber-100/50', hover: 'hover:bg-amber-100', dark: 'dark:bg-amber-900/20 dark:hover:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800', iconBg: 'bg-amber-200 dark:bg-amber-800', bulletColor: 'text-amber-600 dark:text-amber-400' }
                ];
                
                const colors = colorSchemes[index % colorSchemes.length];
                
                return (
                  <div key={index} className="relative">
                    <Button
                      onClick={() => toggleSection(`section_${index}`)}
                      onMouseEnter={() => setHoveredSection(`section_${index}`)}
                      onMouseLeave={() => setHoveredSection(null)}
                      onTouchStart={() => setHoveredSection(null)}
                      className="w-full flex items-center gap-4 mb-3 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors min-h-[75px] touch-manipulation"
                      variant="ghost"
                      size="lg"
                    >
                      <div className={`${colors.iconBg} rounded-full p-3 flex-shrink-0`}>
                        {React.createElement(getIconForEmoji(section.emoji), {
                          className: "h-6 w-6 text-gray-700 dark:text-gray-300"
                        })}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 break-words">
                          {section.title.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedSections[`section_${index}`] ? (
                          <Minus className="h-6 w-6 text-gray-500" />
                        ) : (
                          <Plus className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                    </Button>
                    
                    {/* Custom Tooltip */}
                    {hoveredSection === `section_${index}` && (
                      <div className="absolute right-2 top-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded shadow-lg z-10 pointer-events-none">
                        {expandedSections[`section_${index}`] ? "Close section" : "Open section"}
                      </div>
                    )}
                    
                    {expandedSections[`section_${index}`] && (
                      <div className="bg-white dark:bg-gray-900 rounded-xl p-5 space-y-4 animate-in slide-in-from-top duration-300 mb-4">
                        {/* Main section content */}
                        {section.content && section.content.length > 0 && (
                          <div>
                            <div className="space-y-3">
                              {section.content.map((item, itemIndex) => {
                                // If it's a callout, render without bullet point
                                if (item.startsWith('> ')) {
                                  return (
                                    <div key={itemIndex}>
                                      {formatMarkdownText(item, colors)}
                                    </div>
                                  );
                                }
                                
                                // Check if it's a header/subheader (starts with bold text **text**)
                                if (item.trim().match(/^\*\*[^*]+\*\*/)) {
                                  return (
                                    <div key={itemIndex} className="flex items-start gap-3 mt-3 first:mt-0">
                                      <span className={`${colors.bulletColor} mt-1 flex-shrink-0`}>•</span>
                                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
                                        {formatMarkdownText(item, colors)}
                                      </span>
                                    </div>
                                  );
                                }
                                
                                // Check if it's an indented sub-bullet (starts with →)
                                if (item.trim().startsWith('→')) {
                                  return (
                                    <div key={itemIndex} className="flex items-start gap-3 ml-4">
                                      <span className={`${colors.bulletColor} flex-shrink-0 text-base`}>→</span>
                                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                        {formatMarkdownText(item.trim().substring(1).trim(), colors)}
                                      </span>
                                    </div>
                                  );
                                }
                                
                                // Check if this should be an indented item (follows a bold header)
                                const previousItem = itemIndex > 0 ? section.content[itemIndex - 1] : null;
                                const isFollowingBoldHeader = previousItem && previousItem.trim().match(/^\*\*[^*]+\*\*/);
                                const isNotBoldItself = !item.trim().match(/^\*\*[^*]+\*\*/);
                                
                                if (isFollowingBoldHeader && isNotBoldItself) {
                                  return (
                                    <div key={itemIndex} className="flex items-start gap-3 ml-4">
                                      <span className={`${colors.bulletColor} flex-shrink-0 text-base`}>→</span>
                                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                        {formatMarkdownText(item, colors)}
                                      </span>
                                    </div>
                                  );
                                }
                                
                                // Regular bullet point
                                return (
                                  <div key={itemIndex} className="flex items-start gap-3">
                                    <span className={`${colors.bulletColor} mt-1 flex-shrink-0`}>•</span>
                                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                      {formatMarkdownText(item, colors)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* Subsections */}
                        {section.subsections && section.subsections.length > 0 && (
                          <div className="space-y-3">
                            {section.subsections.map((subsection, subIndex) => (
                              <div key={subIndex} className="relative">
                                <Button
                                  onClick={() => toggleSection(`subsection_${index}_${subIndex}`)}
                                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  variant="ghost"
                                  size="sm"
                                >
                                  {React.createElement(getIconForEmoji(subsection.emoji), {
                                    className: "h-5 w-5 text-gray-600 dark:text-gray-400"
                                  })}
                                  <div className="flex-1 text-left">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {formatMarkdownText(subsection.title, colors)}
                                    </h4>
                                  </div>
                                  <div className="flex-shrink-0">
                                    {expandedSections[`subsection_${index}_${subIndex}`] ? (
                                      <Minus className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <Plus className="h-4 w-4 text-gray-500" />
                                    )}
                                  </div>
                                </Button>
                                
                                {expandedSections[`subsection_${index}_${subIndex}`] && (
                                  <div className="mt-2 ml-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-in slide-in-from-top duration-300">
                                    <div className="space-y-3">
                                      {subsection.content.map((subItem, subItemIndex) => {
                                        // If it's a callout, render without bullet point
                                        if (subItem.startsWith('> ')) {
                                          return (
                                            <div key={subItemIndex}>
                                              {formatMarkdownText(subItem, colors)}
                                            </div>
                                          );
                                        }
                                        
                                        // Check if it's a header/subheader (starts with bold text **text**)
                                        if (subItem.trim().match(/^\*\*[^*]+\*\*/)) {
                                          return (
                                            <div key={subItemIndex} className="flex items-start gap-3 mt-3 first:mt-0">
                                              <span className={`${colors.bulletColor} mt-1 flex-shrink-0 text-base`}>•</span>
                                              <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-base font-semibold">
                                                {formatMarkdownText(subItem, colors)}
                                              </span>
                                            </div>
                                          );
                                        }
                                        
                                        // Check if it's an indented sub-bullet (starts with →)
                                        if (subItem.trim().startsWith('→')) {
                                          return (
                                            <div key={subItemIndex} className="flex items-start gap-3 ml-4">
                                              <span className={`${colors.bulletColor} flex-shrink-0 text-base`}>→</span>
                                              <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                                {formatMarkdownText(subItem.trim().substring(1).trim(), colors)}
                                              </span>
                                            </div>
                                          );
                                        }
                                        
                                        // Check if this should be an indented item (follows a bold header)
                                        const previousSubItem = subItemIndex > 0 ? subsection.content[subItemIndex - 1] : null;
                                        const isFollowingBoldHeader = previousSubItem && previousSubItem.trim().match(/^\*\*[^*]+\*\*/);
                                        const isNotBoldItself = !subItem.trim().match(/^\*\*[^*]+\*\*/);
                                        
                                        if (isFollowingBoldHeader && isNotBoldItself) {
                                          return (
                                            <div key={subItemIndex} className="flex items-start gap-3 ml-4">
                                              <span className={`${colors.bulletColor} flex-shrink-0 text-base`}>→</span>
                                              <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                                {formatMarkdownText(subItem, colors)}
                                              </span>
                                            </div>
                                          );
                                        }
                                        
                                        // Regular bullet point (but only for items that aren't headers)
                                        return (
                                          <div key={subItemIndex} className="flex items-start gap-3">
                                            <span className={`${colors.bulletColor} mt-1 flex-shrink-0 text-base`}>•</span>
                                            <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                              {formatMarkdownText(subItem, colors)}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Next Steps Section with Glassmorphism Background */}
          <div className="mt-8 p-8 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-xl">
            {/* Suggestion Button */}
            <div className="mb-8">
              <SuggestionButton pageType="identity" />
            </div>

            {/* Navigation Options - Excluding Identities */}
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

            {/* Middle Row - Barriers and Complex Loops */}
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