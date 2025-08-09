'use client'

import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { 
  ArrowLeft, Plus, Minus, Share2, Brain, Heart, 
  Wrench, RotateCcw, Rainbow, Puzzle, Construction,
  CheckCircle, XCircle, Lightbulb, Target,
  BookOpen, Zap, Star, Clock, Home, Briefcase, 
  Settings, Folder, FileText, Mail, ClipboardList,
  ShoppingCart, Utensils, Bed, Shirt, Trash2,
  Phone, Wallet, Calendar, Car, Pill, Activity,
  Sparkles, Key, Flame, ArrowLeftRight, Bath,
  Sun, DoorClosed, Dumbbell, CookingPot, Refrigerator,
  Recycle, Store, PackageCheck, Receipt, Calculator,
  ScrollText, Pencil, PhoneCall, Bell, GraduationCap,
  Library, Palette, MailPlus, TrendingUp, TrendingDown,
  Award, Medal, Music, Laptop, Monitor, MapPin, 
  Dice1 as Dice, Link, Globe, Snowflake, Scissors, Hammer,
  Paintbrush, Brush, Shield, Gem, Crown, Flower, Leaf,
  Gamepad2, User, Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTasksContent, getLifeAreaSources } from '@/lib/supabase'
import type { TasksContent, LifeAreaSources } from '@/lib/supabase'
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
    // Emotional validation & task-specific support
    { pattern: /\b(you are safe|you're safe|you are enough|you're enough|you matter|this is valid|this is real)\b/gi, style: 'bold' },
    { pattern: /\b(not your fault|not weakness|not overreacting|not broken|not lazy|not failing)\b/gi, style: 'bold' },
    { pattern: /\b(you can do this|you've got this|you're capable|you're learning)\b/gi, style: 'bold' },
    
    // Task execution and productivity
    { pattern: /\b(start small|tiny step|micro-task|break it down|chunk it|one piece)\b/gi, style: 'bold' },
    { pattern: /\b(timer|pomodoro|time block|schedule|deadline|priority)\b/gi, style: 'bold' },
    { pattern: /\b(focus|attention|concentration|distraction|multitask)\b/gi, style: 'bold' },
    { pattern: /\b(energy|momentum|motivation|dopamine|reward)\b/gi, style: 'bold' },
    
    // Core actions and techniques for tasks
    { pattern: /\b(breathe|pause|stop|slow down|take a break|rest|reset)\b/gi, style: 'bold' },
    { pattern: /\b(one step|one thing|next task|next action|small steps)\b/gi, style: 'bold' },
    { pattern: /\b(body double|accountability|support|help|collaborate)\b/gi, style: 'bold' },
    
    // Time and completion reframes
    { pattern: /\b(right now|this moment|today|not forever|will pass|temporary)\b/gi, style: 'bold' },
    { pattern: /\b(doesn't have to be perfect|good enough|done is better|progress not perfection)\b/gi, style: 'bold' },
    { pattern: /\b(finish later|come back to it|pause and resume|save and continue)\b/gi, style: 'bold' },
    
    // Task-specific ADHD concepts
    { pattern: /\b(executive function|working memory|task switching|initiation|completion)\b/gi, style: 'bold' },
    { pattern: /\b(ADHD brain|neurodivergent|rejection sensitivity|time blindness|hyperfocus)\b/gi, style: 'bold' },
    { pattern: /\b(overwhelm|shutdown|freeze|stuck|procrastination|avoidance)\b/gi, style: 'bold' },
    { pattern: /\b(nervous system|sensory|stimming|regulation|hypervigilance)\b/gi, style: 'bold' },
    
    // Organization and systems
    { pattern: /\b(organize|structure|system|routine|habit|workflow)\b/gi, style: 'bold' },
    { pattern: /\b(environment|workspace|setup|prepare|tools|resources)\b/gi, style: 'bold' },
    { pattern: /\b(checklist|reminder|alarm|calendar|notes|external brain)\b/gi, style: 'bold' },
    
    // Self-care and maintenance
    { pattern: /\b(hydrate|eat|sleep|move|stretch|walk|exercise)\b/gi, style: 'bold' },
    { pattern: /\b(medication|supplements|therapy|support group)\b/gi, style: 'bold' },
    
    // Gentle self-talk patterns for italics
    { pattern: /\b(maybe|perhaps|gently|softly|kindly|compassionately)\b/gi, style: 'italic' },
    { pattern: /\b(it's okay to|it's normal to|you're allowed to|you can|you might)\b/gi, style: 'italic' },
    { pattern: /\b(consider|try|experiment|explore|notice|observe)\b/gi, style: 'italic' },
    { pattern: /\b(when you feel ready|if it helps|as needed|as you can)\b/gi, style: 'italic' },
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
    '🔗': Link,
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
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({ 'adhd-reasons': true })
  const [expandedSources, setExpandedSources] = useState<{[key: string]: boolean}>({})
  const [copySuccess, setCopySuccess] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }, [])

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
          let lifeAreaSlug = resolvedParams.life_area

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
      <div className="min-h-screen bg-gradient-to-br from-[#d4fc79] via-[#b0f4ea] to-[#8fd3f4] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-[#d4fc79] via-[#b0f4ea] to-[#8fd3f4] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-[#d4fc79] via-[#b0f4ea] to-[#8fd3f4] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative">
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
                  {React.createElement(getTaskIcon(content.task_name), {
                    className: "h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0"
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

            {/* Intro Paragraph - with green border like requested */}
            <div className="border-l-4 border-green-500 bg-green-50/50 dark:bg-green-900/10 pl-5 py-4 mb-7 rounded-r-lg">
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

          {/* Side-by-Side Toggle Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                    {formatMarkdownText(content.gentle_advice)}
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

          {/* ADHD Reasons - paired layout (same as complex_loops) */}
          {content.adhd_reasons && content.adhd_reasons.length > 0 && (
            <div className="bg-[#5e60ce]/20 backdrop-blur-sm rounded-2xl border border-[#5e60ce]/30 transition-all duration-300 mb-8">
              <button
                onClick={() => toggleSection('adhd-reasons')}
                className="w-full p-6 text-left hover:bg-[#5e60ce]/30 rounded-2xl transition-all duration-300 flex items-center justify-between group"
                title={expandedSections['adhd-reasons'] ? 'Close section' : 'Open section'}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#5e60ce]/90 rounded-lg flex-shrink-0 transition-transform duration-300">
                    <Brain className="h-5 w-5 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Why {content.task_name} is Hard with ADHD
                    </h3>
                    {!expandedSections['adhd-reasons'] && (
                      <p className="text-sm text-gray-700 mt-0.5">Connect what you feel with what’s happening in your brain, no shame, just clarity</p>
                    )}
                  </div>
                </div>
                {expandedSections['adhd-reasons'] ? (
                  <Minus className="h-5 w-5 text-gray-900 flex-shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-900 flex-shrink-0" />
                )}
              </button>

              {expandedSections['adhd-reasons'] && (
                <div className="px-6 pb-6 animate-in slide-in-from-top duration-300">
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

                      const pairs = lefts.map((left, i) => ({ left, right: manualRights[i] || rights[i] || guessRight(left) }))

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

                      return (
                        <div className="space-y-3">
                          <div className="hidden lg:grid lg:grid-cols-2 gap-3 pl-1 pr-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base border-b border-gray-200 pb-1">You might:</h4>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base border-b border-gray-200 pb-1">Here's what's really going on:</h4>
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
                                  <span className="text-blue-600 flex-shrink-0 translate-y-[2px] text-base leading-none w-4 text-center">•</span>
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


          {/* Content Sections */}
          {content.content_sections && content.content_sections.length > 0 && (
            <div className="space-y-4">
              {content.content_sections.map((section, index) => {
                const colorSchemes = [
                  { bg: 'bg-[#5390d9]/30', hover: 'hover:bg-[#5390d9]/60', border: 'border-[#5390d9]/50', iconBg: 'bg-[#5390d9]/90'},
                  { bg: 'bg-[#4ea8de]/30', hover: 'hover:bg-[#4ea8de]/60', border: 'border-[#4ea8de]/50', iconBg: 'bg-[#4ea8de]/90' },
                  { bg: 'bg-[#56cfe1]/30', hover: 'hover:bg-[#56cfe1]/60', border: 'border-[#56cfe1]/50', iconBg: 'bg-[#56cfe1]/90' },
                  { bg: 'bg-[#64dfdf]/30', hover: 'hover:bg-[#64dfdf]/60', border: 'border-[#64dfdf]/50', iconBg: 'bg-[#64dfdf]/90' },
                  { bg: 'bg-[#80ffdb]/30', hover: 'hover:bg-[#80ffdb]/60', border: 'border-[#80ffdb]/50', iconBg: 'bg-[#80ffdb]/90' }
                ];
                
                const colors = colorSchemes[index % colorSchemes.length];
                const IconComponent = getSectionIcon(section.emoji);
                const sectionId = `section-${index}`;
                const isExpanded = expandedSections[sectionId];
                


                return (
                  <div key={index} className={`${colors.bg} backdrop-blur-sm rounded-2xl border-2 ${colors.border} transition-all duration-300 group/section`}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSection(sectionId);
                      }}
                      className={`w-full p-6 text-left ${colors.hover} rounded-2xl transition-all duration-300 flex items-center justify-between group relative`}
                      title={isExpanded ? "Close section" : "Open section"}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 ${colors.iconBg} rounded-xl flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'scale-110' : 'group-hover:scale-105'} shadow-sm`}>
                          <IconComponent className="h-6 w-6 text-gray-900" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            <div dangerouslySetInnerHTML={{ 
                              __html: section.title
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/_(.*?)_/g, '<em>$1</em>')
                            }} />
                          </h3>
                          {!isExpanded && (
                            <p className="text-sm text-gray-600 group-hover/section:text-gray-900 transition-colors">
                              {/* Simple, ADHD‑friendly subtitles using the section title */}
                              {(() => {
                                const t = section.title.toLowerCase()
                                if (t.includes('core principles')) return 'The few big ideas to keep you steady when your brain spirals'
                                if (t.includes('strategies')) return 'Tiny, do‑able moves to get this task started now'
                                if (t.includes('mindset')) return 'Gentle reframes that lower pressure and unlock action'
                                if (t.includes('encouragement')) return 'A quick pep talk to take with you when it’s tough'
                                if (t.includes('tools')) return 'Practical helpers you can grab fast when you need them'
                                if (t.includes('examples')) return 'Real‑life patterns and how people shift them'
                                if (t.includes('checklist')) return 'A simple list so your brain doesn’t have to remember it all'
                                return 'Open for a quick, plain‑language guide to help you move forward'
                              })()}
                            </p>
                          )}
                        </div>
                      </div>
                      {isExpanded ? (
                        <Minus className="h-5 w-5 text-gray-900 flex-shrink-0" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-900 flex-shrink-0" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-6 pb-6 animate-in slide-in-from-top duration-300">
                        {/* Section content */}
                        {section.content && section.content.length > 0 && (
                          <div className="space-y-4 mb-4 relative before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gray-200">
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
                                    <div key={groupIndex} className={`border-l-4 ${colors.border} ml-6 pl-4 py-3 ${colors.bg.replace('/40', '/10')} rounded-lg space-y-2 relative before:absolute before:left-[-1.75rem] before:top-1/2 before:w-3 before:h-px before:bg-gray-200 hover:shadow-sm transition-shadow group/quote`}>
                                      <div className={`absolute -left-[1.4rem] top-1/2 -translate-y-1/2 w-3 h-3 ${colors.iconBg} rounded-full transition-transform group-hover/quote:scale-110`} />
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
                                    <div key={groupIndex} className="flex items-start gap-3 ml-6 relative before:absolute before:left-[-1.75rem] before:top-1/2 before:w-3 before:h-px before:bg-gray-200 group/bullet hover:bg-gray-500/10 rounded-lg transition-colors">
                                      <span className="text-gray-900 flex-shrink-0 translate-y-[1px] text-lg group-hover/bullet:scale-110 transition-transform">•</span>
                                      <div className="text-gray-900 pt-0.5 py-1"
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
                                <div key={subIndex} className={`${subColors.bg.replace('/90', '/20')} backdrop-blur-sm rounded-xl border ${subColors.border.replace('/50', '/30')} transition-all duration-300`}>
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
                                      <Minus className={`h-4 w-4 ${subColors.textColor} flex-shrink-0 opacity-70`} />
                                    ) : (
                                      <Plus className={`h-4 w-4 ${subColors.textColor} flex-shrink-0 opacity-70`} />
                                    )}
                                  </button>
                                  
                                  {isSubExpanded && subsection.content && subsection.content.length > 0 && (
                                    <div className="px-4 pb-4 animate-in slide-in-from-top duration-300">
                                      <div className="space-y-2">
                                        {subsection.content.map((item, itemIndex) => (
                                          <div key={itemIndex} className="flex items-start gap-2">
                                            <span className={`${subColors.textColor} mt-1 flex-shrink-0 opacity-80`}>•</span>
                                            <div className={`${subColors.textColor} opacity-90`}
                                                 dangerouslySetInnerHTML={{ 
                                                   __html: item.replace(/^-\s*(\d+\.\s*)?/, '')
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

          {/* Sources Section - Positioned right after content sections */}
          {sources && sources.length > 0 && (
            <div className="space-y-4 mt-8">
              <div className="relative">
                <Button
                  onClick={() => toggleSection('sources')}
                  className="w-full flex items-center gap-4 mb-5 p-4 rounded-2xl border-2 
                            bg-[#f1e4f3]/30 hover:bg-[#f1e4f3]/60 border-[#f1e4f3]/50 
                            transition-colors min-h-[75px] touch-manipulation"
                  variant="ghost"
                  size="lg"
                >
                  <div className="bg-[#f1e4f3]/90 rounded-full p-3 flex-shrink-0">
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
                  <div className="bg-[#f1e4f3]/20 rounded-lg p-4 space-y-4 animate-in slide-in-from-top duration-300 mb-4">
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
          <div className="mt-8 p-8 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-xl">
            {/* Suggestion Button */}
            <div className="mb-8">
              <SuggestionButton pageType="tasks" />
            </div>

            {/* Navigation Options - Excluding Life Areas */}
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

            {/* Bottom Row - Complex Loops and Identity */}
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
        title={content?.task_name || 'Task Page'}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        description={`Get help with ${content?.task_name?.toLowerCase() || 'this task'} - ADHD-friendly strategies and support.`}
      />
    </div>
  )
}
