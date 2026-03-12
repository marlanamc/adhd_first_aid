'use client'

import React from 'react'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Plus, Minus, Share2, Brain, Heart, 
  Wrench, RotateCcw, Rainbow, Puzzle, Construction,
  Waves, CheckCircle, XCircle, Lightbulb, Target,
  Users, Globe, BookOpen, Zap, Shield, Star,
  Clock, Home, Briefcase, Activity,
  Camera, Music, Palette, Code,
  Settings, Award, Compass, Map, Route,
  Scale, AlertTriangle, Hand, PenTool, 
  Sparkles, HeartHandshake, MessageCircle,
  TrendingDown, Megaphone, Repeat, Search,
  Key, Flame, FileText,
  Stethoscope, Laptop, Handshake,
  UserPlus, DollarSign, Sprout,
  Network, Timer,   Building2,
  Building, Link as LinkIcon, ArrowLeftRight, Baby,
  UserCog, Fingerprint, ClipboardPlus,
  HeartPulse, UserX,
  UserMinus, BanknoteX, GraduationCap,
  Mail, Receipt, Car, ShoppingCart, CookingPot,
  Shirt, Bath, PhoneCall, Trash2, Hammer,
  Medal, TrendingUp, Rocket, ScrollText,
  CircleDashed, Calendar, Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getIdentitiesContent, getIdentitySources } from '@/lib/supabase'
import type { IdentitiesContent, IdentitySources } from '@/lib/supabase'
import { SuggestionButton } from '@/components/ui/SuggestionButton';
import { ShareModal } from '@/components/ui/ShareModal';
import FixedBottomActions from '@/components/ui/FixedBottomActions'
import { TargetedCrisisMode } from '@/components/ui/TargetedCrisisMode'
import { ContentPageSkeleton } from '@/components/ui/ContentPageSkeleton'

// Simple emoji to icon mapping for content sections
const getSectionIcon = (emoji: string): React.ElementType => {
  const sectionIconMap: Record<string, React.ElementType> = {
    // Core section emojis - ensuring uniqueness across all identities
    '🧠': Brain,
    '⚡': Zap,
    '✨': Sparkles,
    '🎯': Target,
    '🔥': Flame,
    '💡': Lightbulb,
    '⏰': Timer,
    '🕐': Clock,
    '📅': Calendar,
    '🛠️': Wrench,
    '📱': Phone,
    '🏠': Home,
    '💼': Briefcase,
    '📚': BookOpen,
    '🎨': Palette,
    '🎵': Music,
    '📸': Camera,
    '💻': Code,
    '🚗': Car,
    '🛒': ShoppingCart,
    '🍳': CookingPot,
    '👕': Shirt,
    '🧼': Bath,
    '📞': PhoneCall,
    '✉️': Mail,
    '💰': Receipt,
    '📄': FileText,
    '🗑️': Trash2,
    '🔧': Hammer,
    '⚙️': Settings,
    '🏆': Award,
    '🌟': Star,
    '⭐': Medal,
    '🌈': Rainbow,
    '📊': Activity,
    '📈': TrendingUp,
    '🚀': Rocket,
    '🧩': Puzzle,
    '🔗': LinkIcon,
    '🌐': Network,
    '🌱': Sprout,
    '🛡️': Shield,
    '🔑': Key,
    '🧭': Compass,
    '🗺️': Map,
    '🛤️': Route,
    '👥': Users,
    '🤝': Handshake,
    '🫂': UserPlus,
    '🧑‍⚕️': Stethoscope,
    '🧑‍💻': Laptop,
    '🎓': GraduationCap,
    '📢': Megaphone,
    '🗣️': MessageCircle,
    '📝': PenTool,
    '🧾': ScrollText,
    '🔁': Repeat,
    '🔄': RotateCcw,
    '🔍': Search,
    '📉': TrendingDown,
    '💸': DollarSign,
    '🌊': Waves,
    '❤️‍🩹': HeartHandshake,
    '❤️': Heart,
    '💖': HeartPulse,
    '💢': Flame,
    '😵‍💫': CircleDashed,
    '💬': MessageCircle,
    '💪': Building2,
    '🌍': Globe,
    '🧘': Activity,
    '🧘‍♀️': Building,
    '🧱': Construction,
    '⛓️': LinkIcon,
    '🚧': AlertTriangle,
    '⚖️': Scale,
    '⚠️': AlertTriangle,
    '✅': CheckCircle,
    '❌': XCircle,
    '✋': Hand,
    '✍️': PenTool,
    '💭': Brain,
    '🔸': Lightbulb,
  }
  
  return sectionIconMap[emoji] || Lightbulb // Default fallback
}

import { formatIdentityMarkdownText } from '@/lib/utils'

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
  const [copySuccess] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isCrisisModeOpen, setIsCrisisModeOpen] = useState(false)
  const [sources, setSources] = useState<IdentitySources[] | null>(null)

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
        // Fetch sources using slug from URL
        const identitySlug = resolvedParams.identity
        const { data: srcData, error: srcError } = await getIdentitySources(identitySlug)
        if (!srcError && srcData && srcData.length > 0) {
          setSources(srcData as any)
        }
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

  const handleShare = () => {
    // Always show the custom share modal
    setIsShareModalOpen(true)
  }

  // Icon mapping for identities - updated to match category page icons
  const IDENTITY_ICONS: Record<string, React.ElementType> = {
    "The Parent": Baby,
    "ADHD Identity Guide: The Parent of a Child with ADHD": UserCog,
    "The Overly Responsible Sibling": UserPlus,
    "The Solo Household Manager": Home,
    "The Caretaker": HeartHandshake,
    "The Job Seeker": Building,
    "The Burned Out Professional": Flame,
    "The Working Multiple Jobs": Briefcase,
    "The Entrepreneur": Lightbulb,
    "The Breadwinner": Award,
    "The Neurodivergent Adult": Brain,
    "The Recently Diagnosed": ClipboardPlus,
    "The AuDHD Individual": Fingerprint,
    "The Sick or Chronically Ill": HeartPulse,
    "The Grieving or Emotionally Raw Individual": UserX,
    "ADHD Identity Guide: Queer & Trans": Rainbow,
    "The Immigrant": Globe,
    "The Individual Without a Support System": UserMinus,
    "The Low-Income Individual": BanknoteX,
    "The BIPOC Individual": Users,
    "The Student": GraduationCap,
    "The Creative": Sparkles,
    "ADHD Identity Guide: The Recovering Perfectionist": Target
  }

  if (loading) {
    return <ContentPageSkeleton />
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#78c2f2] via-[#b39ddb] to-[#e1d5f9] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative">
        <div className="max-w-4xl mx-auto px-4 py-8 pt-4">
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
    <div className="min-h-screen relative">
      <div className="detail-page-shell">
        <div className="detail-page-card">
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
                {content?.intro_paragraph && formatIdentityMarkdownText(content.intro_paragraph, {
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
                    {formatIdentityMarkdownText(content.gentle_advice, {
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
                    {formatIdentityMarkdownText(content.stern_advice, {
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

          {/* ADHD Reasons - Paired two-column like complex_loops */}
          {content.adhd_reasons && content.adhd_reasons.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-[#FBF8CC] transition-all duration-300 mb-8">
              <button
                onClick={() => toggleSection('adhd-reasons')}
                className="w-full p-4 text-left hover:bg-white rounded-2xl transition-all duration-300 flex items-center gap-4 group min-h-[75px]"
                title={expandedSections['adhd-reasons'] ? 'Close section' : 'Open section'}
              >
                <div className="bg-[#FBF8CC] rounded-full p-3 flex-shrink-0">
                  <Brain className="h-5 w-5 text-gray-900" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 break-words">
                    Why {content?.identity_name?.replace(/^(The |ADHD Identity Guide: The |ADHD Identity Guide: )/, '') || content?.identity_name} is Hard with ADHD
                  </h3>
                  <p className="text-sm text-gray-700 mt-0.5">Connect what you feel with what's happening in your brain, no shame, just clarity</p>
                </div>
                <div className="flex-shrink-0">
                  {expandedSections['adhd-reasons'] ? (
                    <Minus className="h-5 w-5 text-gray-900 flex-shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-900 flex-shrink-0" />
                  )}
                </div>
              </button>
              {expandedSections['adhd-reasons'] && (
                <div className="px-4 pb-4 animate-in slide-in-from-top duration-300 border-t border-[#FBF8CC] bg-white">
                  <div className="space-y-4">
                    {(() => {
                      const youMight: string[] = []
                      const whatsGoingOn: string[] = []
                      let current = ''
                      content.adhd_reasons.forEach((r) => {
                        if (r === 'You might:') current = 'left'
                        else if (r === "Here's what's really going on:") current = 'right'
                        else if (current === 'left') youMight.push(r)
                        else if (current === 'right') whatsGoingOn.push(r)
                      })
                      const sanitize = (s: string) => (s || '').replace(/\uFFFD+/g, '').replace(/\s+/g, ' ').trim()
                      const cleanLeft = (s?: string) => sanitize((s || '').replace(/^[-•]\s*/, ''))
                      const rawLefts = youMight.map(cleanLeft).filter(Boolean)
                      const parseRight = (s?: string) => {
                        if (!s) return { emoji: null as string | null, heading: null as string | null, desc: '' }
                        const emojiMatch = s.match(/^(\p{Extended_Pictographic})\s+(.+)/u) || s.match(/^([\u{2300}-\u{23FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1FAFF}])\s+(.+)/u)
                        let rest = s; let emoji: string | null = null
                        if (emojiMatch) { emoji = emojiMatch[1]; rest = emojiMatch[2] }
                        rest = sanitize(rest.replace(/^[\uFFFD\s]+/, ''))
                        const boldMatch = rest.match(/^\*\*(.*?)\*\*[:：]?\s*(.*)?$/)
                        if (boldMatch) return { emoji, heading: boldMatch[1], desc: boldMatch[2] || '' }
                        return { emoji, heading: null, desc: rest }
                      }
                      const rights = whatsGoingOn.map(parseRight).filter(r => (r.heading && r.heading.trim()) || (r.desc && r.desc.trim()))
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
                        if (!candidate) candidate = r.heading ? `${r.heading} shows up in your day-to-day` : 'Notice this pattern popping up'
                        return candidate.charAt(0).toUpperCase() + candidate.slice(1)
                      })
                      const emojiForHeading = (h?: string | null) => {
                        const k = (h || '').toLowerCase()
                        if (k.includes('executive')) return '🧩'
                        if (k.includes('time')) return '⏰'
                        if (k.includes('working memory')) return '🧠'
                        if (k.includes('attention')) return '🎯'
                        if (k.includes('motivation')) return '💥'
                        if (k.includes('shame')) return '😞'
                        if (k.includes('nervous system')) return '💛'
                        return '💡'
                      }
                      const pairs = lefts.map((left, i) => ({ left, right: manualRights[i] || rights[i] || { emoji: '💡', heading: 'Context matters', desc: 'your brain is adapting to stressors; gentle supports help shift the pattern' } }))
                      return (
                        <div className="space-y-3">
                          <div className="hidden lg:grid lg:grid-cols-2 gap-3 pl-1 pr-1">
                            <h4 className="font-semibold text-gray-900 text-base border-b border-gray-200 pb-1">You might:</h4>
                            <h4 className="font-semibold text-gray-900 text-base border-b border-gray-200 pb-1">Here's what's really going on:</h4>
                          </div>
                          {pairs.map((pair, idx) => {
                            const rowPalette = [
                              { bg: 'bg-[#FBF8CC]/35', border: 'border-[#FBF8CC]/60' },
                              { bg: 'bg-[#FDE4CF]/35', border: 'border-[#FDE4CF]/60' },
                              { bg: 'bg-[#FFCFD2]/35', border: 'border-[#FFCFD2]/60' },
                              { bg: 'bg-[#F1C0E8]/35', border: 'border-[#F1C0E8]/60' },
                              { bg: 'bg-[#CFBAF0]/35', border: 'border-[#CFBAF0]/60' },
                              { bg: 'bg-[#A3C4F3]/35', border: 'border-[#A3C4F3]/60' },
                            ]
                            const rowColor = rowPalette[idx % rowPalette.length]
                            const right = typeof pair.right === 'string' ? parseRight(pair.right) : pair.right
                            const displayEmoji = right.emoji || emojiForHeading(right.heading)
                            return (
                              <div key={idx} className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 group">
                                <span className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-gray-500 select-none">→</span>
                                <div className={`rounded-md px-4 py-3 md:py-3.5 flex items-start gap-3 border ${rowColor.bg} ${rowColor.border}`}>
                                  <span className="text-purple-600 flex-shrink-0 translate-y-[2px] text-base leading-none w-4 text-center">•</span>
                                  <span className="text-gray-900 text-[15px] md:text-[16px] leading-[1.7] pl-0.5">{pair.left}</span>
                                </div>
                                <div className={`rounded-md px-4 py-3 md:py-3.5 flex items-start gap-3 border ${rowColor.bg} ${rowColor.border}`}>
                                  <span className="text-lg w-5 text-center translate-y-[1px] flex-shrink-0">{displayEmoji}</span>
                                  <div className="text-gray-800 text-[15px] md:text-[16px] leading-[1.7]">
                                    {right.heading ? (
                                      <>
                                        <strong className="text-gray-900">{right.heading}</strong>
                                        {right.desc && <span className="text-gray-700">: {right.desc}</span>}
                                      </>
                                    ) : (
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: (right.desc || '')
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                            .replace(/_(.*?)_/g, '<em>$1</em>')
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Sections - Simplified structure like complex_loops */}
          {content.content_sections && content.content_sections.length > 0 && (
            <div className="space-y-4">
              {content.content_sections.map((section, index) => {
                // Fixed accent colors per section (starting with orange since ADHD reasons uses yellow)
                const colorSchemes = [
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#FDE4CF]', iconBg: 'bg-[#FDE4CF]', textColor: 'text-[#FDE4CF]', panelBg: 'bg-[#FDE4CF]/20', bulletColor: 'text-orange-600' }, // Orange/peach - First section
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#B9FBC0]', iconBg: 'bg-[#B9FBC0]', textColor: 'text-[#B9FBC0]', panelBg: 'bg-[#B9FBC0]/20', bulletColor: 'text-green-600' }, // Light green
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#F1C0E8]', iconBg: 'bg-[#F1C0E8]', textColor: 'text-[#F1C0E8]', panelBg: 'bg-[#F1C0E8]/20', bulletColor: 'text-pink-600' }, // Light pink
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#A3C4F3]', iconBg: 'bg-[#A3C4F3]', textColor: 'text-[#A3C4F3]', panelBg: 'bg-[#A3C4F3]/20', bulletColor: 'text-blue-600' }, // Light blue
                  { bg: 'bg-white', hover: 'hover:bg-white', border: 'border-[#FBF8CC]', iconBg: 'bg-[#FBF8CC]', textColor: 'text-[#FBF8CC]', panelBg: 'bg-[#FBF8CC]/20', bulletColor: 'text-yellow-600' }, // Yellow - Last section
                ];
                
                const colors = colorSchemes[index % colorSchemes.length];
                const sectionId = `identity-section-${index}`
                
                return (
                  <section key={sectionId} id={sectionId} className="guide-section relative">
                    <div className="relative">
                    <button
                      onClick={() => toggleSection(`section_${index}`)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 ${colors.bg} ${colors.hover} ${colors.border} transition-colors min-h-[75px] touch-manipulation`}
                    >
                      <div className={`${colors.iconBg} rounded-full p-3 flex-shrink-0`}>
                        {React.createElement(getSectionIcon(section.emoji), {
                          className: "h-5 w-5 text-gray-900"
                        })}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 break-words">
                          {section.title.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedSections[`section_${index}`] ? (
                          <Minus className="h-5 w-5 text-gray-900" />
                        ) : (
                          <Plus className="h-5 w-5 text-gray-900" />
                        )}
                      </div>
                    </button>
                    
                    {expandedSections[`section_${index}`] && (
                      <div className={`${colors.panelBg || 'bg-white'} rounded-xl p-5 space-y-4 animate-in slide-in-from-top duration-300 mb-4 border ${colors.border}`}>
                        {/* Main section content */}
                        {section.content && section.content.length > 0 && (
                          <div>
                            <div className="space-y-3">
                              {section.content.map((item, itemIndex) => {
                                // If it's a callout, render without bullet point
                                if (item.startsWith('> ')) {
                                  return (
                                    <div key={itemIndex}>
                                      {formatIdentityMarkdownText(item, colors)}
                                    </div>
                                  );
                                }
                                
                                // Check if it's a header/subheader (starts with bold text **text**)
                                if (item.trim().match(/^\*\*[^*]+\*\*/)) {
                                  return (
                                    <div key={itemIndex} className="flex items-start gap-3 mt-3 first:mt-0">
                                      <span className={`${colors.bulletColor} mt-1 flex-shrink-0`}>•</span>
                                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
                                        {formatIdentityMarkdownText(item, colors)}
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
                                        {formatIdentityMarkdownText(item.trim().substring(1).trim(), colors)}
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
                                        {formatIdentityMarkdownText(item, colors)}
                                      </span>
                                    </div>
                                  );
                                }
                                
                                // Regular bullet point
                                return (
                                  <div key={itemIndex} className="flex items-start gap-3">
                                    <span className={`${colors.bulletColor} mt-1 flex-shrink-0`}>•</span>
                                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                      {formatIdentityMarkdownText(item, colors)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* Subsections - Only show if they exist and have content */}
                        {section.subsections && section.subsections.length > 0 && (
                          <div className="mt-4 space-y-3 border-l-4 border-gray-200 dark:border-gray-700 pl-4">
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Related Strategies:</h4>
                            {section.subsections.map((subsection, subIndex) => {
                              const subSectionId = `identity-section-${index}-sub-${subIndex}`
                              return (
                                <section key={subSectionId} id={subSectionId} className="guide-section relative">
                                  <div className="relative">
                                    <Button
                                      onClick={() => toggleSection(`subsection_${index}_${subIndex}`)}
                                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                      variant="ghost"
                                      size="sm"
                                    >
                                      {React.createElement(getSectionIcon(subsection.emoji), {
                                        className: "h-5 w-5 text-gray-600 dark:text-gray-400"
                                      })}
                                      <div className="flex-1 text-left">
                                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                                          {subsection.title}
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
                                      <div className="mt-2 p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg animate-in slide-in-from-top duration-300">
                                        <div className="space-y-2">
                                          {subsection.content.map((item, itemIndex) => {
                                            // Handle different content types
                                            if (item.startsWith('> ')) {
                                              return (
                                                <div key={itemIndex} className="border-l-4 border-purple-400 bg-purple-50/50 dark:bg-purple-900/10 pl-4 py-2 rounded-r">
                                                  {formatIdentityMarkdownText(item.substring(2), colors)}
                                                </div>
                                              );
                                            }
                                            
                                            if (item.trim().startsWith('→') || item.trim().startsWith('-')) {
                                              return (
                                                <div key={itemIndex} className="flex items-start gap-2 ml-4">
                                                  <span className={`${colors.bulletColor} flex-shrink-0`}>→</span>
                                                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                                                    {formatIdentityMarkdownText(item.replace(/^[→-]\s*/, ''), colors)}
                                                  </span>
                                                </div>
                                              );
                                            }
                                            
                                            return (
                                              <div key={itemIndex} className="flex items-start gap-2">
                                                <span className={`${colors.bulletColor} mt-1 flex-shrink-0`}>•</span>
                                                <span className="text-gray-700 dark:text-gray-300">
                                                  {formatIdentityMarkdownText(item, colors)}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </section>
                              )
                            })}
                          </div>
                          )}
                      </div>
                    )}
                  </div>
                </section>
              );
              })}
            </div>
          )}

          {/* Sources Section - last header */}
          {sources && sources.length > 0 && (
            <section id="sources" className="guide-section relative space-y-4 mt-8">
              <div className="relative">
                <Button
                  onClick={() => setExpandedSections(prev=>({ ...prev, 'sources': !prev['sources'] }))}
                  className="w-full flex items-center gap-4 mb-5 p-4 rounded-2xl border-2 bg-[#F3E8FF]/40 hover:bg-[#F3E8FF]/60 border-[#D8B4FE]/50 transition-colors min-h-[75px] touch-manipulation"
                  variant="ghost"
                  size="lg"
                >
                  <div className="bg-[#D8B4FE]/90 rounded-full p-3 flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-gray-900" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900 break-words">
                      Sources ({sources.length} sources)
                    </h3>
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
                  <div className="bg-[#F3E8FF]/30 rounded-lg p-4 space-y-4 animate-in slide-in-from-top duration-300 mb-4">
                    {Object.entries(
                      (sources || []).reduce((acc, source) => {
                        const cat = source.category || 'Other'
                        if (!acc[cat]) acc[cat] = [] as any[]
                        (acc[cat] as any[]).push(source)
                        return acc
                      }, {} as Record<string, any[]>)
                    )
                    .sort(([,a], [,b]) => b.length - a.length)
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
                        (categorySources as any[]).reduce((acc, src) => {
                          const key = `${normalized(src.title)}::${normalized(src.authors || '')}`
                          if (!acc[key]) acc[key] = { ...src, _descriptions: [] as string[] }
                          if (src.description) acc[key]._descriptions.push(src.description)
                          return acc
                        }, {} as Record<string, any>)
                      ) as Array<any & { _descriptions: string[] }>

                      return (
                        <div key={category} className="space-y-2">
                          <Button
                            onClick={() => setExpandedSections(prev=>({ ...prev, [`src-cat-${category}`]: !prev[`src-cat-${category}`] }))}
                            className={`w-full flex items-center justify-between p-4 rounded-xl ${scheme.bg} ${scheme.hover} border ${scheme.border} transition-all duration-300 shadow-sm`}
                            variant="ghost"
                            size="lg"
                          >
                            <h4 className="font-bold text-gray-900 text-base">
                              {category} ({(categorySources as any[]).length} {(categorySources as any[]).length === 1 ? 'source' : 'sources'})
                            </h4>
                            {expandedSections[`src-cat-${category}`] ? (
                              <Minus className="h-4 w-4 text-gray-600" />
                            ) : (
                              <Plus className="h-4 w-4 text-gray-600" />
                            )}
                          </Button>

                          {expandedSections[`src-cat-${category}`] && (
                            <div className={`pl-2 space-y-3 animate-in slide-in-from-top duration-200 ${scheme.bg} rounded-lg p-4 border ${scheme.border}`}>
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
                                          return (<>{displayTitle}{authors && (<span className="font-normal text-gray-600">{' by '}{authors}</span>)}</>)
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
            </section>
          )}

          {/* Next Steps Section with Glassmorphism Background */}
          <div className="mt-8 p-8 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-xl">
            {/* Suggestion Button */}
            <div className="mb-8">
              <SuggestionButton pageType="identity" />
            </div>

            {/* Navigation Options - Excluding Identities */}
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
                {/* Top Row - Feelings and Tasks */}
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
                <div className="grid grid-cols-2 gap-4">
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
        title={content?.identity_name?.replace(/^(The |ADHD Identity Guide: The |ADHD Identity Guide: )/, '') || content?.identity_name || 'Identity Page'}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        description={`Get ADHD support as "${content?.identity_name?.replace(/^(The |ADHD Identity Guide: The |ADHD Identity Guide: )/, '') || content?.identity_name}" - ADHD-friendly strategies and guidance.`}
      />

      {/* Targeted Crisis Mode Modal */}
      <TargetedCrisisMode
        contentName={content?.identity_name || ''}
        contentType="identity"
        isOpen={isCrisisModeOpen}
        onClose={() => setIsCrisisModeOpen(false)}
        contentEmoji="👤"
      />

      {/* Fixed Bottom Actions with Crisis Mode and Walkthrough */}
      <FixedBottomActions
        slug={resolvedParams.identity}
        summaryHtml={`ADHD-friendly strategies for ${content?.identity_name || 'this identity'}`}
        pageType="identity"
        sources={sources}
        content={content}
        onOpenCrisisMode={() => setIsCrisisModeOpen(true)}
      />
    </div>
  )
}
