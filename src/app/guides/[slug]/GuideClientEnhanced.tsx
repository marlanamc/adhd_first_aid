'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, ArrowRight, Calendar, Share2, Link as LinkIcon, BookOpen, Target, Shuffle, Sparkles, StickyNote, Lightbulb, AlertCircle, Leaf, ChevronDown, Eye, Zap, Layers, Brain, Stars } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareModal } from '@/components/ui/ShareModal'
import { type Guide } from '@/lib/markdown'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

interface GuideClientEnhancedProps {
  guide: Guide
}

interface TimelineItem {
  year: string
  title: string
  content: string[]
  highlights?: { type: 'red-flag' | 'breakthrough' | 'note', text: string }[]
  era?: string
}

interface NamingSection {
  key: string
  title: string
  body: string[]
  listTitle?: string
  list?: string[]
  subsections?: Array<{
    title: string
    content: string[]
  }>
  chips?: string[]
}

// Parse timeline data from markdown content
const parseTimelineFromContent = (_content: string): TimelineItem[] => {
  // This would parse the actual markdown content
  // For now, returning example data based on the ADHD guide
  return [
    {
      year: '1902',
      era: 'era-1902',
      title: '📚 The Beginning',
      content: [
        'Sir George Still - British pediatrician',
        'Called it: "Defect of Moral Control"',
        'Kids with normal intelligence but couldn\'t control behavior'
      ],
      highlights: [
        { type: 'red-flag', text: 'Moral defect language' },
        { type: 'breakthrough', text: 'Recognized it wasn\'t about intelligence' }
      ]
    },
    {
      year: '1980',
      era: 'era-1980',
      title: '🎯 The Attention Revolution',
      content: [
        'DSM-III introduced "Attention Deficit Disorder (ADD)"',
        'With hyperactivity (ADD-H)',
        'Without hyperactivity (ADD-WO)'
      ],
      highlights: [
        { type: 'breakthrough', text: 'Attention problems were the core issue' },
        { type: 'note', text: 'Validated the "quiet" ADHD kids' }
      ]
    },
    {
      year: '1987',
      era: 'era-1987',
      title: '🔄 The Combo Era',
      content: [
        'New name: "Attention-Deficit Hyperactivity Disorder (ADHD)"',
        'Combined both types into one disorder',
        'Three presentations: Inattentive, Hyperactive-Impulsive, Combined'
      ]
    },
    {
      year: '2013',
      era: 'era-2013',
      title: '🌈 Modern Understanding',
      content: [
        'DSM-5: "Types" became "Presentations"',
        'Age of onset changed from 7 to 12',
        'Adult ADHD officially recognized',
        'Severity levels: Mild, Moderate, Severe'
      ],
      highlights: [
        { type: 'breakthrough', text: 'Symptoms can change over time' }
      ]
    }
  ]
}

export default function GuideClientEnhanced({ guide }: GuideClientEnhancedProps) {
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [_activeAnchor, setActiveAnchor] = useState<string | null>(null)
  const [isTldrOpen, setIsTldrOpen] = useState(false)
  // Start with all sections collapsed by default
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set(['timeline', 'what-it-means', 'from-add-to-adhd', 'why-short', 'reframing']))

  const timeline = parseTimelineFromContent(guide.content)

  // Helper functions for collapsible sections
  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey)
      } else {
        newSet.add(sectionKey)
      }
      return newSet
    })
  }

  const isSectionCollapsed = (sectionKey: string) => collapsedSections.has(sectionKey)

  // Content injection for the naming guide – curated, concise, and stigma-reducing
  const isNamingGuide =
    guide.slug === 'is-it-time-to-rethink-adhd' || /rethink\s+the\s+name/i.test(guide.title)

  const summaryPoints: string[] | null = isNamingGuide
    ? [
        'ADHD stands for **"Attention-Deficit Hyperactivity Disorder"**, but this **1987 name** doesn\'t capture what we know now.',
        'It\'s not about having **less attention**, it\'s about **difficulty controlling** where attention goes.',
        '**Hyperactivity can be internal** (racing thoughts, restlessness) not just physical movement.',
        'The words **"deficit" and "disorder"** create **shame and misunderstanding** about ADHD brains.',
        'Better terms exist: **Neurodiversity** (natural brain difference), **VAST** (Variable Attention), or **Executive Function Difference**.',
        'The **name you use shapes** how you see yourself, and that matters for **self-acceptance and getting support**.'
      ]
    : null

  const namingSections = isNamingGuide
    ? [
        {
          key: 'what-it-means',
          title: 'What ADHD Really Means',
          body: [
            '**ADHD is how some brains are wired** — differences in areas that manage **attention, emotions, time awareness, and impulse control**. About **70-80% of traits are inherited**, making it largely genetic.',
            'Think of it as having a **different operating system**, not a broken one.'
          ],
          listTitle: 'Three presentations (what doctors look for)',
          list: [
            '• trouble focusing on demand<br>• **time blindness**<br>• forgetfulness<br>• mental fog<br>(used to be called **"ADD"**)',
            '• restlessness<br>• quick decisions<br>• difficulty waiting<br>• high energy',
            '• traits from both categories<br>(**most common diagnosis**)'
          ]
        },
        {
          key: 'from-add-to-adhd',
          title: 'The Name Change That Caused Problems',
          body: [
            'In **1987**, researchers merged **two separate conditions** into one umbrella term. Good intention, but it created **confusion that still hurts people today**.'
          ],
          list: [
            '**1980**: **"ADD"** (Attention Deficit Disorder) — recognized with/without hyperactivity as **separate types**',
            '**1987**: Everything became **"ADHD"** — even for people with **zero hyperactivity**',
            '**Result**: Quiet, inattentive people (especially **girls/women**) felt invisible or **"not ADHD enough"**',
            'The **stereotype stuck**: ADHD = **disruptive kid bouncing off walls**'
          ]
        },
        {
          key: 'why-short',
          title: 'Why the Name Falls Short',
          subsections: [
            {
              title: '"Attention Deficit" is Wrong',
              items: [
                '**ADHD brains have plenty of attention** — they just **can\'t control where it goes**',
                '**Hyperfocus proves this**: **6 hours** on something interesting, **6 minutes** on boring tasks',
                'It\'s like having a **flashlight with a broken switch**, not a dead battery'
              ]
            },
            {
              title: '"Hyperactivity" Misses the Mark',
              items: [
                '**Kids**: Running, climbing, can\'t sit still (the **stereotype everyone knows**)',
                '**Adults**: **Internal restlessness**, racing thoughts, rapid speech, fidgeting',
                '**Many ADHD people aren\'t hyperactive at all** — they\'re **daydreamers** or **"space cadets"**'
              ]
            },
            {
              title: '"Deficit" and "Disorder" Create Shame',
              items: [
                'Makes ADHD sound like **something\'s missing or broken**',
                'People **hide their diagnosis**, **avoid getting help**, or **feel defective**',
                '**Words matter** — they shape how we see ourselves and how others treat us'
              ]
            }
          ]
        },
        {
          key: 'reframing',
          title: 'Better Ways to Think About It',
          body: [
            '**Scientists and advocates** are moving toward language that captures **what ADHD actually is** — a **different way of processing the world**.'
          ],
          chips: [
            'Neurodiversity — Natural brain variation (like left-handedness)',
            'VAST — Variable Attention Stimulus Trait (Dr. Ned Hallowell)',
            'Executive Function Difference — Challenges with planning, focus, impulse control',
            'Attention Regulation Condition — Difficulty controlling attention flow'
          ]
        }
      ]
    : []

  // Build anchors for quick navigation
  const quickNavItems = useMemo(() => {
    const items: { id: string; label: string }[] = []
    if (timeline.length > 0) {
      items.push({ id: 'timeline', label: 'Evolution' })
    }
    if (isNamingGuide) {
      for (const sec of namingSections as Array<{ key: string; title: string }>) {
        items.push({ id: sec.key, label: sec.title })
      }
    }
    return items
  }, [timeline, isNamingGuide, namingSections])


  const eraStyle = (year: string): { icon: React.ReactNode; card: string } => {
    switch (year) {
      case '1902':
        return { icon: <BookOpen className="h-5 w-5" />, card: 'era era-early' }
      case '1980':
        return { icon: <Target className="h-5 w-5" />, card: 'era era-attn' }
      case '1987':
        return { icon: <Shuffle className="h-5 w-5" />, card: 'era era-combo' }
      case '2013':
        return { icon: <Sparkles className="h-5 w-5" />, card: 'era era-modern' }
      default:
        return { icon: <Calendar className="h-5 w-5" />, card: 'era' }
    }
  }

  const sectionIcon = (key: string): React.ReactNode => {
    if (key.includes('what-it-means')) return <Lightbulb className="h-5 w-5" />
    if (key.includes('from-add-to-adhd')) return <AlertCircle className="h-5 w-5" />
    if (key.includes('why-short')) return <StickyNote className="h-5 w-5" />
    if (key.includes('reframing')) return <Leaf className="h-5 w-5" />
    return <StickyNote className="h-5 w-5" />
  }

  // Subtle animation on scroll + scrollspy for quick-nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.guide-section')
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.9) {
          section.classList.add('animate-in')
        }
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveAnchor(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    )

    quickNavItems.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [quickNavItems])

  return (
    <div className="min-h-screen bg-[#CAE5FF] dark:from-[#0a0f1a] dark:via-[#0e1422] dark:to-[#0f1a2e]">
      <style jsx global>{`
        /* Removed harsh animations that cause visual stress */
        
        .guide-section {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }
        
        .guide-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .guide-section {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
        
        .highlight-yellow { 
          background: #f1f5f9; 
          padding: 2px 6px; 
          border-radius: 4px;
          display: inline-block;
          margin: 0 2px;
        }
        
        .highlight-blue { 
          background: #e2e8f0; 
          padding: 2px 6px; 
          border-radius: 4px;
          display: inline-block;
          margin: 0 2px;
        }
        
        .highlight-green { 
          background: #e2e8f0; 
          padding: 2px 6px; 
          border-radius: 4px;
          display: inline-block;
          margin: 0 2px;
        }
        
        .highlight-purple { 
          background: #cbd5e1; 
          padding: 2px 6px; 
          border-radius: 4px;
          display: inline-block;
          margin: 0 2px;
        }
        
        .era-1902 { border-color: rgba(231, 76, 60, 0.35) !important; }
        .era-1960 { border-color: rgba(243, 156, 18, 0.35) !important; }
        .era-1980 { border-color: rgba(52, 152, 219, 0.35) !important; }
        .era-1987 { border-color: rgba(155, 89, 182, 0.35) !important; }
        .era-2013 { border-color: rgba(46, 204, 113, 0.35) !important; }

        /* Playful sticky note backgrounds */
        .note-coral { background: linear-gradient(135deg, #ffe2d2 0%, #ffd2e1 100%); box-shadow: 0 6px 14px rgba(255, 112, 67, 0.15); }
        .note-mint { background: linear-gradient(135deg, #dcfce7 0%, #c8f7f1 100%); box-shadow: 0 6px 14px rgba(16, 185, 129, 0.15); }
        .note-lavender { background: linear-gradient(135deg, #ede9fe 0%, #e0f2fe 100%); box-shadow: 0 6px 14px rgba(99, 102, 241, 0.16); }
        .note-sand { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); box-shadow: 0 6px 14px rgba(245, 158, 11, 0.15); }
        .note-sky { background: linear-gradient(135deg, #e0f2fe 0%, #cffafe 100%); box-shadow: 0 6px 14px rgba(59, 130, 246, 0.14); }

        .note-card { border-radius: 14px; border: 1px solid rgba(30, 41, 59, 0.08); }
        .note-card:hover { transform: translateY(-1px); box-shadow: 0 10px 18px rgba(2, 6, 23, 0.08); }
        .note-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(30, 64, 175, 0.85); }

        /* Timeline era cards */
        .era { border-radius: 16px; border: 1px solid rgba(30,41,59,0.08); box-shadow: 0 6px 16px rgba(2,6,23,0.06); }
        .era-early { background: linear-gradient(135deg, #e0f7fa 0%, #eaf2ff 100%); }
        .era-attn { background: linear-gradient(135deg, #fff1e6 0%, #ffedd5 100%); }
        .era-combo { background: linear-gradient(135deg, #ffe4e6 0%, #fde2f3 100%); }
        .era-modern { background: linear-gradient(135deg, #e9d5ff 0%, #e0e7ff 100%); }

        /* Journal paper background */
        .journal { 
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.7),
            rgba(255,255,255,0.7) 24px,
            rgba(14, 165, 233, 0.12) 25px
          );
        }

        /* No scrollbar utility */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Focus states */
        a:focus-visible, button:focus-visible { outline: 2px dashed rgba(99, 102, 241, 0.6); outline-offset: 2px; }

        /* Gentle card hover */
        .card-hover { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .card-hover:hover { transform: translateY(-2px) scale(1.01); box-shadow: 0 12px 24px rgba(2,6,23,0.08); }

        /* Pill buttons for reframes */
        .pill { border-radius: 9999px; padding: 8px 16px; font-weight: 600; border: 1px solid rgba(0,0,0,0.06); }
        .pill-coral { background: linear-gradient(135deg,#ffe0dc,#ffd8ea); color: #7f1d1d; }
        .pill-teal { background: linear-gradient(135deg,#d1fae5,#cffafe); color: #064e3b; }
        .pill-indigo { background: linear-gradient(135deg,#e0e7ff,#ede9fe); color: #1e1b4b; }
        .pill-amber { background: linear-gradient(135deg,#fef3c7,#fde68a); color: #7c2d12; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        {/* Top utility bar: Quick Nav and Share - Larger buttons */}
        <div className="flex items-center justify-end gap-3 mb-6">
          <div className="flex items-center gap-3">
            {/* Quick Nav dropdown */}
            {quickNavItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="default" variant="ghost" className="text-blue-800 dark:text-blue-200 hover:bg-white/60 dark:hover:bg-blue-900/40 text-base font-medium px-4 py-2">
                    Quick Nav
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={8} className="bg-white/80 dark:bg-blue-900/80 backdrop-blur-md border-blue-200/60 dark:border-blue-800/60 w-64">
                  <DropdownMenuLabel inset={false} className="text-sm text-blue-900 dark:text-blue-100">Jump to</DropdownMenuLabel>
                  <DropdownMenuSeparator className="" />
                  {quickNavItems.map((item) => (
                    <DropdownMenuItem inset={false} key={item.id} className="text-base">
                      <a href={`#${item.id}`} className="block w-full text-blue-900 dark:text-blue-100">
                        {item.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              onClick={() => setIsShareOpen(true)}
              size="default"
              variant="ghost"
              className="text-blue-800 dark:text-blue-200 hover:bg-white/60 dark:hover:bg-blue-900/40 text-base font-medium px-4 py-2"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Hero Title - Much larger and more spacious */}
        <section id="top" className="mb-8 guide-section">
          <div className="rounded-3xl p-8 md:p-12 border border-blue-200/70 dark:border-blue-800 bg-gradient-to-br from-rose-50/80 via-orange-50/70 to-violet-50/70 dark:from-blue-900/30 dark:via-blue-900/20 dark:to-violet-900/20 shadow-sm">
            <div className="flex items-start justify-center gap-6 text-center">
              <div className="hidden sm:block p-4 rounded-2xl bg-white/70 dark:bg-blue-900/40 shadow-sm">
                <Brain className="h-12 w-12 text-rose-500" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-blue-100 mb-4 leading-tight">
                  {guide.title}
                </h1>
                <p className="text-base md:text-lg text-slate-800/90 dark:text-blue-200/90 max-w-4xl mx-auto leading-relaxed">
                  {guide.description}
                </p>
              </div>
              <div className="hidden sm:block p-4 rounded-2xl bg-white/70 dark:bg-blue-900/40 shadow-sm">
                <Stars className="h-12 w-12 text-violet-500" />
              </div>
            </div>
          </div>
        </section>

        {/* TL;DR - Larger cards and text */}
        {summaryPoints && (
          <section id="tldr" aria-labelledby="tldr-title" className="mb-8 guide-section">
            <h2 id="tldr-title" className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-4 px-1 text-center">
              <button
                type="button"
                onClick={() => setIsTldrOpen((v) => !v)}
                aria-expanded={isTldrOpen}
                aria-controls="tldr-content"
                title={isTldrOpen ? 'Collapse quick summary' : 'Expand quick summary'}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-white/70 dark:bg-blue-900/40 border border-blue-200/70 dark:border-blue-800 shadow-sm hover:bg-white/90 dark:hover:bg-blue-900/60 transition-colors text-base font-semibold"
              >
                TL;DR
                <ChevronDown className={`h-5 w-5 transition-transform ${isTldrOpen ? '' : '-rotate-90'}`} />
              </button>
            </h2>
            <div id="tldr-content" className={`bg-white/90 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800 rounded-2xl p-6 md:p-8 shadow-sm ${isTldrOpen ? '' : 'hidden'}` }>
              <div className="flex items-center justify-end mb-4">
                <a href="#timeline" className="text-sm text-blue-700 dark:text-blue-300 inline-flex items-center gap-2 font-medium">
                  <LinkIcon className="h-4 w-4" /> Timeline
                </a>
              </div>
              <ul className="space-y-6 max-w-4xl mx-auto">
                {summaryPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-300 rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-base md:text-lg text-slate-900 dark:text-slate-100 leading-relaxed font-medium" dangerouslySetInnerHTML={{__html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Timeline - Much larger and more readable */}
        {timeline.length > 0 && (
          <section className="mb-8 guide-section" id="timeline">
            <div className="bg-white/80 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800 rounded-3xl p-0 shadow-lg overflow-hidden">
              {/* Banner header - Now collapsible and matches other section headers */}
              <button
                type="button"
                onClick={() => toggleSection('timeline')}
                aria-expanded={!isSectionCollapsed('timeline')}
                aria-controls="timeline-content"
                className="w-full flex items-center justify-between gap-4 px-8 py-6 bg-gradient-to-r from-amber-50 via-rose-50 to-violet-50 dark:from-blue-900/30 dark:via-rose-900/20 dark:to-violet-900/20 border-b border-blue-200/40 dark:border-blue-800/40 hover:from-amber-100 hover:via-rose-100 hover:to-violet-100 dark:hover:from-blue-900/50 dark:hover:via-rose-900/30 dark:hover:to-violet-900/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-blue-900/60 text-slate-800 dark:text-slate-100">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 text-left">Evolution Timeline</h2>
                </div>
                <ChevronDown className={`h-6 w-6 text-blue-600 dark:text-blue-300 transition-transform flex-shrink-0 ${isSectionCollapsed('timeline') ? '-rotate-90' : ''}`} />
              </button>
              {/* Horizontal timeline */}
              <div id="timeline-content" className={`${isSectionCollapsed('timeline') ? 'hidden' : ''} relative p-6 md:p-8`}>
                <div className="relative">
                  {/* Timeline line - positioned absolutely behind the cards */}
                  <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 dark:from-blue-700 dark:via-purple-700 dark:to-green-700 transform -translate-y-1/2 z-0 hidden md:block">
                    {/* Arrow at the end */}
                    <div className="absolute -right-2 -top-2 p-1 bg-green-500 dark:bg-green-600 rounded-full">
                      <ArrowRight className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex md:justify-between gap-6 overflow-x-auto no-scrollbar py-4 relative z-10">
                    {timeline.map((item, index) => {
                      const visible = item.content
                      const { icon, card } = eraStyle(item.year)
                      return (
                        <div key={index} id={`year-${item.year}`} className="scroll-mt-28 min-w-[300px] md:min-w-0 md:w-[23%] relative">
                          <div className={`${card} p-6 md:p-8 card-hover relative z-20`}>
                            <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-slate-100">
                              {icon}
                              <div className="text-lg md:text-xl font-extrabold">{item.year}</div>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">{item.title.replace(/📚|🎯|🔄|🌈/g, '').trim()}</h3>
                            <ul className="space-y-3">
                              {visible.map((point, i) => (
                                <li key={i} className="text-sm md:text-base text-slate-800 dark:text-slate-100 leading-relaxed flex items-start gap-2">
                                  <span className="text-slate-500 dark:text-slate-300 mt-1 text-xs">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Timeline dot for each era */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-4 h-4 bg-white dark:bg-slate-800 border-4 border-blue-400 dark:border-blue-500 rounded-full z-30 hidden md:block shadow-sm"></div>
                        </div>
                      )
                    })}
                  </div>
                  
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content - Clean, spacious sections */}
        {isNamingGuide && (
          <div className="space-y-8 mb-8">
            {namingSections.map((sec) => {
              const hasSubsections = 'subsections' in sec && (sec as NamingSection).subsections
              
              return (
                <section id={sec.key} key={sec.key} className="bg-white/90 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800 rounded-3xl shadow-lg guide-section overflow-hidden">
                  {/* Section Header - Now collapsible */}
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.key)}
                    aria-expanded={!isSectionCollapsed(sec.key)}
                    aria-controls={`${sec.key}-content`}
                    className="w-full flex items-center justify-between gap-4 px-8 py-6 bg-gradient-to-r from-amber-50 via-rose-50 to-violet-50 dark:from-blue-900/30 dark:via-rose-900/20 dark:to-violet-900/20 border-b border-blue-200/40 dark:border-blue-800/40 hover:from-amber-100 hover:via-rose-100 hover:to-violet-100 dark:hover:from-blue-900/50 dark:hover:via-rose-900/30 dark:hover:to-violet-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/80 dark:bg-blue-900/60 text-slate-800 dark:text-slate-100">
                        {sectionIcon(sec.key)}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 text-left">{sec.title}</h3>
                    </div>
                    <ChevronDown className={`h-6 w-6 text-blue-600 dark:text-blue-300 transition-transform flex-shrink-0 ${isSectionCollapsed(sec.key) ? '-rotate-90' : ''}`} />
                  </button>

                  {/* Section Content */}
                  <div id={`${sec.key}-content`} className={`${isSectionCollapsed(sec.key) ? 'hidden' : ''} p-8 md:p-12`}>
                    {/* Body text if present */}
                    {sec.body && (
                      <div className="mb-10">
                        {sec.body.map((p, i) => (
                          <p key={i} className="text-base md:text-lg text-slate-800 dark:text-slate-200 leading-relaxed mb-6" dangerouslySetInnerHTML={{__html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                        ))}
                      </div>
                    )}

                    {/* Special layout for "Why the Name Falls Short" */}
                    {sec.key === 'why-short' && hasSubsections && (
                      <div className="grid gap-8 lg:grid-cols-3">
                        {(sec as NamingSection).subsections?.map((sub: { title: string; content: string[] }, i: number) => {
                          const colors = [
                            'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200',
                            'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200', 
                            'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'
                          ]
                          return (
                            <div key={i} className={`rounded-2xl p-8 border-2 ${colors[i]} dark:from-blue-900/30 dark:to-blue-900/10 dark:border-blue-800/50`}>
                              <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">{sub.title}</h4>
                              <ul className="space-y-4">
                                {sub.content && sub.content.map((it, j) => (
                                  <li key={j} className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-slate-600 dark:bg-slate-300 rounded-full mt-3 flex-shrink-0"></div>
                                    <span className="text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{__html: it.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Regular list items */}
                    {sec.list && sec.key !== 'why-short' && (
                      <div>
                        {sec.listTitle && (
                          <div className="text-center mb-6">
                            <h4 className="text-lg font-bold text-slate-800 dark:text-blue-200 bg-slate-100/80 dark:bg-blue-800/50 px-4 py-2 rounded-xl inline-block">{sec.listTitle}</h4>
                          </div>
                        )}
                        
                        {sec.key === 'what-it-means' ? (
                          // Special cards for ADHD types
                          <div className="grid gap-6 md:grid-cols-3">
                            {sec.list.map((item: string, i: number) => {
                              const configs = [
                                { bg: 'note-mint', icon: <Eye className="h-6 w-6 text-emerald-700" />, title: 'Inattentive' },
                                { bg: 'note-coral', icon: <Zap className="h-6 w-6 text-rose-700" />, title: 'Hyperactive-Impulsive' },
                                { bg: 'note-lavender', icon: <Layers className="h-6 w-6 text-indigo-700" />, title: 'Combined' }
                              ]
                              const config = configs[i] || configs[0]
                              return (
                                <div key={i} className={`note-card ${config.bg} p-6 rounded-2xl`}>
                                  <div className="flex items-center gap-3 mb-4">
                                    {config.icon}
                                    <div className="text-base font-bold text-slate-900">{config.title}</div>
                                  </div>
                                  <div className="text-sm text-slate-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          // Regular bullet list
                          <ul className="space-y-5">
                            {sec.list.map((item, i) => (
                              <li key={i} className="flex items-start gap-4">
                                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-300 rounded-full mt-3 flex-shrink-0"></div>
                                <span className="text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{__html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {/* Chips for alternative terms */}
                    {'chips' in sec && (sec as NamingSection).chips && (
                      <div className="mt-10">
                        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Alternative Terms:</h4>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {(sec as NamingSection).chips!.map((chip: string, i: number) => {
                            const colors = [
                              'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border-rose-200',
                              'bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border-teal-200',
                              'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200',
                              'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200'
                            ]
                            const color = colors[i % colors.length]
                            return (
                              <div key={i} className={`${color} p-4 rounded-xl border-2 font-semibold text-sm md:text-base`}>
                                {chip}
                              </div>
                            )
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

        {/* Navigation Footer - Larger button */}
        <div className="text-center mt-10">
          <Button 
            onClick={() => window.history.back()}
            variant="ghost"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-white px-6 py-3 rounded-2xl text-base font-semibold"
          >
            <ArrowLeft className="h-6 w-6 mr-3" />
            Back to Guides
          </Button>
        </div>
      </div>
      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={guide.title}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        description={guide.description}
      />
    </div>
  )
}