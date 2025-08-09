'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, Calendar, Share2, Link as LinkIcon, BookOpen, Target, Shuffle, Sparkles, StickyNote, Lightbulb, AlertCircle, Leaf, ChevronDown, Eye, Zap, Layers, Brain, Stars, Footprints } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareModal } from '@/components/ui/ShareModal'
import { type Guide } from '@/lib/markdown'
import { useCrisisAndWalkthrough } from '@/hooks/useCrisisAndWalkthrough'
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

// (condensed UI – extra comparison/strength types not needed)

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
        'Called it: “Defect of Moral Control”',
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
        'DSM-III introduced “Attention Deficit Disorder (ADD)”',
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
        'New name: “Attention-Deficit Hyperactivity Disorder (ADHD)”',
        'Combined both types into one disorder',
        'Three presentations: Inattentive, Hyperactive-Impulsive, Combined'
      ]
    },
    {
      year: '2013',
      era: 'era-2013',
      title: '🌈 Modern Understanding',
      content: [
        'DSM-5: “Types” became “Presentations”',
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
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null)
  const [isTldrOpen, setIsTldrOpen] = useState(false)

  // Generate summary HTML for crisis mode
  const summaryHtml = useMemo(() => {
    if (guide.slug === 'is-it-time-to-rethink-adhd' || /rethink\s+the\s+name/i.test(guide.title)) {
      return `
        <ul>
          <li>ADHD name from 1987 doesn't capture what we know now</li>
          <li>Not about less attention - it's about difficulty controlling where attention goes</li>
          <li>Hyperactivity can be internal (racing thoughts) not just physical</li>
          <li>"Deficit" and "disorder" create shame and misunderstanding</li>
          <li>Better terms: Neurodiversity, VAST, Executive Function Difference</li>
        </ul>
      `
    }
    return '<p>Quick summary not available for this guide.</p>'
  }, [guide.slug, guide.title])

  // Initialize walkthrough functionality
  const { goCrisis, openWalkthrough, modal } = useCrisisAndWalkthrough({ 
    slug: guide.slug, 
    summaryHtml 
  })

  const timeline = parseTimelineFromContent(guide.content)

  // Content injection for the naming guide – curated, concise, and stigma-reducing
  const isNamingGuide =
    guide.slug === 'is-it-time-to-rethink-adhd' || /rethink\s+the\s+name/i.test(guide.title)

  const summaryPoints: string[] | null = isNamingGuide
    ? [
        'ADHD stands for **"Attention-Deficit Hyperactivity Disorder"** — but this **1987 name** doesn\'t capture what we know now.',
        'It\'s **not about having less attention** — it\'s about **difficulty controlling** where attention goes.',
        '**Hyperactivity can be internal** (racing thoughts, restlessness) not just physical movement.',
        'The words **"deficit" and "disorder"** create **shame and misunderstanding** about ADHD brains.',
        'Better terms exist: **Neurodiversity** (natural brain difference), **VAST** (Variable Attention), or **Executive Function Difference**.',
        'The **name you use shapes** how you see yourself — and that matters for **self-acceptance and getting support**.'
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
            '**Inattentive** — trouble focusing on demand, **time blindness**, forgetfulness, mental fog (used to be called **"ADD"**)',
            '**Hyperactive-Impulsive** — restlessness, quick decisions, difficulty waiting, high energy',
            '**Combined** — traits from both categories (**most common diagnosis**)'
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
      for (const t of timeline) {
        items.push({ id: `year-${t.year}`, label: t.year })
      }
    }
    if (isNamingGuide) {
      for (const sec of namingSections as Array<{ key: string; title: string }>) {
        items.push({ id: sec.key, label: sec.title })
      }
    }
    return items
  }, [timeline, isNamingGuide, namingSections])

  // TL;DR color palette (alternating sticky notes)
  const tldrPalette = useMemo(
    () => ['note-coral', 'note-mint', 'note-lavender', 'note-sand', 'note-sky'],
    []
  )

  const eraStyle = (year: string): { icon: React.ReactNode; card: string } => {
    switch (year) {
      case '1902':
        return { icon: <BookOpen className="h-4 w-4" />, card: 'era era-early' }
      case '1980':
        return { icon: <Target className="h-4 w-4" />, card: 'era era-attn' }
      case '1987':
        return { icon: <Shuffle className="h-4 w-4" />, card: 'era era-combo' }
      case '2013':
        return { icon: <Sparkles className="h-4 w-4" />, card: 'era era-modern' }
      default:
        return { icon: <Calendar className="h-4 w-4" />, card: 'era' }
    }
  }

  const sectionIcon = (key: string): React.ReactNode => {
    if (key.includes('what-it-means')) return <Lightbulb className="h-4 w-4" />
    if (key.includes('from-add-to-adhd')) return <AlertCircle className="h-4 w-4" />
    if (key.includes('why-short')) return <StickyNote className="h-4 w-4" />
    if (key.includes('reframing')) return <Leaf className="h-4 w-4" />
    return <StickyNote className="h-4 w-4" />
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
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-violet-50 dark:from-[#0a0f1a] dark:via-[#0e1422] dark:to-[#0f1a2e]">
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
        
        /* Removed harsh hover animations */
        
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
        .note-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(30, 64, 175, 0.85); }

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
        .pill { border-radius: 9999px; padding: 6px 12px; font-weight: 600; border: 1px solid rgba(0,0,0,0.06); }
        .pill-coral { background: linear-gradient(135deg,#ffe0dc,#ffd8ea); color: #7f1d1d; }
        .pill-teal { background: linear-gradient(135deg,#d1fae5,#cffafe); color: #064e3b; }
        .pill-indigo { background: linear-gradient(135deg,#e0e7ff,#ede9fe); color: #1e1b4b; }
        .pill-amber { background: linear-gradient(135deg,#fef3c7,#fde68a); color: #7c2d12; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 pt-14 pb-8">
        {/* Top utility bar */}
        <div className="flex items-center justify-between gap-2 mb-4">
          {/* Left side - Walkthrough buttons */}
          <div className="flex items-center gap-2">
            <Button onClick={goCrisis} size="sm" variant="default" className="bg-rose-600 hover:bg-rose-700 text-white">
              <Zap className="h-4 w-4 mr-2" />
              Crisis mode
            </Button>
            <Button onClick={openWalkthrough} size="sm" variant="default" className="bg-teal-600 hover:bg-teal-700 text-white">
              <Footprints className="h-4 w-4 mr-2" />
              Walk me through
            </Button>
          </div>
          
          {/* Right side - Quick Nav and Share */}
          <div className="flex items-center gap-2">
            {/* Quick Nav dropdown */}
            {quickNavItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-blue-800 dark:text-blue-200 hover:bg-white/60 dark:hover:bg-blue-900/40">
                    Quick Nav
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={8} className="bg-white/80 dark:bg-blue-900/80 backdrop-blur-md border-blue-200/60 dark:border-blue-800/60 w-64">
                  <DropdownMenuLabel inset={false} className="text-[11px] text-blue-900 dark:text-blue-100">Jump to</DropdownMenuLabel>
                  <DropdownMenuSeparator className="" />
                  {quickNavItems.map((item) => (
                    <DropdownMenuItem inset={false} key={item.id} className="text-[13px]">
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
              size="sm"
              variant="ghost"
              className="text-blue-800 dark:text-blue-200 hover:bg-white/60 dark:hover:bg-blue-900/40"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          </div>
        </div>
        {/* Hero Title */}
        <section id="top" className="mb-5 guide-section">
          <div className="rounded-2xl p-6 border border-blue-200/70 dark:border-blue-800 bg-gradient-to-br from-rose-50/80 via-orange-50/70 to-violet-50/70 dark:from-blue-900/30 dark:via-blue-900/20 dark:to-violet-900/20 shadow-sm">
            <div className="flex items-start justify-center gap-3 text-center">
              <div className="hidden sm:block p-2 rounded-xl bg-white/70 dark:bg-blue-900/40 shadow-sm">
                <Brain className="h-8 w-8 text-rose-500" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-blue-100 mb-2">
              {guide.title}
            </h1>
                <p className="text-sm md:text-base text-slate-800/90 dark:text-blue-200/90 max-w-3xl mx-auto">
              {guide.description}
            </p>
          </div>
              <div className="hidden sm:block p-2 rounded-xl bg-white/70 dark:bg-blue-900/40 shadow-sm">
                <Stars className="h-8 w-8 text-violet-500" />
              </div>
            </div>
        </div>
        </section>

        {/* TL;DR */}
        {summaryPoints && (
          <section id="tldr" aria-labelledby="tldr-title" className="mb-5 guide-section">
            <h2 id="tldr-title" className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 px-1 text-center">
              <button
                type="button"
                onClick={() => setIsTldrOpen((v) => !v)}
                aria-expanded={isTldrOpen}
                aria-controls="tldr-content"
                title={isTldrOpen ? 'Collapse quick summary' : 'Expand quick summary'}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 bg-white/70 dark:bg-blue-900/40 border border-blue-200/70 dark:border-blue-800 shadow-sm hover:bg-white/90 dark:hover:bg-blue-900/60 transition-colors"
              >
                TL;DR
                <ChevronDown className={`h-4 w-4 transition-transform ${isTldrOpen ? '' : '-rotate-90'}`} />
              </button>
            </h2>
            <div id="tldr-content" className={`bg-white/80 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800 rounded-xl p-4 shadow-sm ${isTldrOpen ? '' : 'hidden'}` }>
              <div className="flex items-center justify-end mb-3">
                <a href="#timeline" className="text-[10px] text-blue-700 dark:text-blue-300 inline-flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" /> Timeline
                </a>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 max-w-6xl mx-auto">
                {summaryPoints.map((p, i) => {
                  const colorClass = tldrPalette[i % tldrPalette.length]
                  return (
                    <div key={i} className={`note-card ${colorClass} p-3`}>
                      <div className="flex items-start gap-2">
                        <div className="note-dot mt-1" />
                        <span className="text-[12px] md:text-[13px] text-slate-900 dark:text-slate-100 leading-snug" dangerouslySetInnerHTML={{__html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ADHD types callouts removed from TL;DR per request */}
            </div>
          </section>
        )}

        {/* Timeline - vertical with anchors */}
        {timeline.length > 0 && (
          <section className="mb-6 guide-section" id="timeline">
            <div className="bg-white/80 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800 rounded-xl p-0 shadow-sm">
              {/* Banner header to match other sections */}
              <div className="flex items-center gap-2 px-5 py-3.5 rounded-t-xl bg-gradient-to-r from-amber-50 via-rose-50 to-violet-50 dark:from-blue-900/30 dark:via-rose-900/20 dark:to-violet-900/20 border-b border-blue-200/40 dark:border-blue-800/40">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-blue-100">Evolution Timeline</h2>
              </div>
              {/* Horizontal timeline */}
              <div className="relative p-4">
                {/* removed central rail for a cleaner look */}
                <div className="flex md:justify-between gap-3 overflow-x-auto no-scrollbar py-2 md:py-2">
                  {timeline.map((item, index) => {
                    const visible = item.content // show full content by default
                    const { icon, card } = eraStyle(item.year)
                    return (
                      <div key={index} id={`year-${item.year}`} className="scroll-mt-28 min-w-[250px] md:min-w-0 md:w-[23%]">
                        <div className={`${card} p-4 md:p-5 card-hover`}>
                          <div className="flex items-center gap-2 mb-2 text-slate-800 dark:text-slate-100">
                            {icon}
                            <div className="text-[14px] md:text-[16px] font-extrabold">{item.year}</div>
                          </div>
                          <h3 className="text-[14px] md:text-[15px] font-semibold text-slate-900 dark:text-slate-100 mb-2 leading-tight">{item.title.replace(/📚|🎯|🔄|🌈/g, '').trim()}</h3>
                          <ul className="space-y-1.5">
                            {visible.map((point, i) => (
                              <li key={i} className="text-[12.5px] md:text-[13px] text-slate-800 dark:text-slate-100 leading-tight flex items-start gap-1.5">
                                <span className="text-slate-500 dark:text-slate-300 mt-0.5 text-[9px]">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                          {/* all content shown; no toggle needed */}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content - varied layouts like handwritten notes */}
        {isNamingGuide && (
          <div className="grid gap-3 md:grid-cols-2 mb-6">
            {namingSections.map((sec, secIndex) => {
              // Vary layout patterns like the notes
              const isWide = secIndex % 3 === 0
              const hasSubsections = 'subsections' in sec && (sec as any).subsections
              
              return (
                <section id={sec.key} key={sec.key} className={`bg-white/85 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800 rounded-xl shadow-sm guide-section p-0 h-full flex flex-col`}>
                  <div className="flex items-center gap-2 px-5 py-3.5 rounded-t-xl bg-gradient-to-r from-amber-50 via-rose-50 to-violet-50 dark:from-blue-900/30 dark:via-rose-900/20 dark:to-violet-900/20 border-b border-blue-200/40 dark:border-blue-800/40">
                    <div className="p-1.5 rounded-full bg-white/70 dark:bg-blue-900/50 text-slate-800 dark:text-slate-100">
                      {sectionIcon(sec.key)}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{sec.title}</h3>
                  </div>
                  <div className="p-4 md:p-5 flex-1 flex flex-col">
                  
                  {/* Dynamic layout based on content type */}
                  {hasSubsections ? (
                    sec.key === 'why-short' ? (
                      // Story panel style: three roomy cards, alternating soft backgrounds
                      <div className="grid md:grid-cols-3 gap-4">
                        {(sec as any).subsections.map((sub: { title: string; items: string[] }, i: number) => (
                          <div key={i} className={`rounded-xl p-4 md:p-5 card-hover border ${i % 2 === 0 ? 'bg-gradient-to-br from-rose-50 to-orange-50 border-rose-100/60' : 'bg-gradient-to-br from-teal-50 to-sky-50 border-teal-100/60'} dark:from-blue-900/30 dark:to-blue-900/10 dark:border-blue-800/50`}>
                            <h4 className="text-[13px] md:text-[14px] font-bold text-slate-900 dark:text-slate-100 mb-2">{sub.title}</h4>
                            <ul className="space-y-2">
                              {sub.items.map((it, j) => (
                                <li key={j} className="text-[12.5px] md:text-[13px] text-slate-800 dark:text-slate-200 leading-snug flex items-start gap-2">
                                  <span className="text-emerald-600 dark:text-emerald-300 mt-1 text-[10px]">•</span>
                                  <span dangerouslySetInnerHTML={{__html: it.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Default multi-column layout
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-1">
                          {sec.body && (
                            <div className="space-y-2">
                              {sec.body.map((p, i) => (
                                <p key={i} className="text-[12px] text-slate-800 dark:text-slate-200 leading-snug" dangerouslySetInnerHTML={{__html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                              ))}
                              {sec.key === 'what-it-means' && (
                                <div className="mt-3 grid sm:grid-cols-3 gap-2.5">
                                  <div className="note-card note-mint p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Eye className="h-4 w-4 text-emerald-700" />
                                      <div className="text-[12px] font-semibold text-slate-900">Inattentive</div>
                                    </div>
                                    <div className="text-[11px] text-slate-800">Daydreamy, forgetful, time blindness; focus on demand is hard.</div>
                                  </div>
                                  <div className="note-card note-coral p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Zap className="h-4 w-4 text-rose-700" />
                                      <div className="text-[12px] font-semibold text-slate-900">Hyperactive‑Impulsive</div>
                                    </div>
                                    <div className="text-[11px] text-slate-800">Restlessness, quick decisions, difficulty waiting, high energy.</div>
                                  </div>
                                  <div className="note-card note-lavender p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Layers className="h-4 w-4 text-indigo-700" />
                                      <div className="text-[12px] font-semibold text-slate-900">Combined</div>
                                    </div>
                                    <div className="text-[11px] text-slate-800">Traits from both categories; this is the most common diagnosis.</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="lg:col-span-3 grid gap-3 md:grid-cols-3">
                          {(sec as any).subsections?.map((sub: { title: string; items: string[] }, i: number) => (
                            <div key={i} className={`rounded-lg p-3.5 md:p-4 card-hover border ${i % 2 === 0 ? 'bg-gradient-to-br from-rose-50 to-orange-50 border-rose-100/60' : 'bg-gradient-to-br from-teal-50 to-sky-50 border-teal-100/60'} dark:from-blue-900/30 dark:to-blue-900/10 dark:border-blue-800/50`}>
                              <h4 className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{sub.title}</h4>
                              <ul className="space-y-1.5">
                                {sub.items.map((it, j) => (
                                  <li key={j} className="text-[11px] text-slate-800 dark:text-slate-200 leading-tight flex items-start gap-2">
                                    <span className="text-emerald-600 dark:text-emerald-300 mt-0.5 text-[9px]">•</span>
                                  <span dangerouslySetInnerHTML={{__html: it.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                    )
                  ) : (
                    // Flowing layout for simpler sections
                    <div className={`${sec.list && sec.list.length > 4 ? 'grid grid-cols-1 lg:grid-cols-5 gap-4' : ''} flex-1`}> 
                      <div className={sec.list && sec.list.length > 4 ? 'lg:col-span-2' : ''}>
                        {sec.body && (
                          <div className="space-y-2 mb-3">
                            {sec.body.map((p, i) => (
                              <p key={i} className="text-[11px] text-slate-800 dark:text-slate-200 leading-snug" dangerouslySetInnerHTML={{__html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                            ))}
                          </div>
                        )}
                        {sec.listTitle && (
                          <div className="text-[10px] font-medium text-slate-800 dark:text-blue-200 mb-1 bg-slate-100/80 dark:bg-blue-800/50 px-2 py-0.5 rounded inline-block">{sec.listTitle}</div>
                        )}
                      </div>
                      
                      {sec.list && (
                        <div className={`${sec.list.length > 4 ? 'lg:col-span-3 columns-1 md:columns-2' : ''}`}>
                          {sec.key === 'what-it-means' ? (
                            <div className="grid sm:grid-cols-3 gap-2.5">
                              {sec.list.map((item: string, i: number) => {
                                const palettes = ['note-mint', 'note-coral', 'note-lavender']
                                const icons = [
                                  <Eye key="e" className="h-4 w-4 text-emerald-700" />,
                                  <Zap key="z" className="h-4 w-4 text-rose-700" />,
                                  <Layers key="l" className="h-4 w-4 text-indigo-700" />
                                ]
                                const palette = palettes[i % palettes.length]
                                const Icon = icons[i % icons.length]
                                return (
                                  <div key={i} className={`note-card ${palette} p-3`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      {Icon}
                                      <div className="text-[12px] font-semibold text-slate-900">{['Inattentive','Hyperactive‑Impulsive','Combined'][i] || 'Type'}</div>
                                    </div>
                                    <div className="text-[11px] text-slate-800" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <ul className="space-y-1.5">
                            {sec.list.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 break-inside-avoid">
                                  <span className="text-rose-500 dark:text-rose-300 mt-0.5 text-[10px]">•</span>
                                  <span className="text-[11px] text-slate-800 dark:text-slate-200 leading-snug" dangerouslySetInnerHTML={{__html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                              </li>
                            ))}
                          </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {'chips' in sec && (sec as any).chips && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(sec as any).chips.map((chip: string, i: number) => {
                        const color = ['pill-coral','pill-teal','pill-indigo','pill-amber'][i % 4]
                        return (
                          <span key={i} className={`pill ${color} text-[13px] card-hover`}>{chip}</span>
                        )
                      })}
                    </div>
                  )}
                  </div>
                  
                </section>
              )
            })}
          </div>
        )}

        {/* Reflection removed per request */}

        {/* Quick-Nav popover replaces sticky sidebar for tighter layout */}

        {/* Navigation Footer */}
        <div className="text-center mt-6">
          <Button 
            onClick={() => window.history.back()}
            variant="ghost"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-white px-4 py-2 rounded-lg text-xs"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
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
      {/* Walkthrough Modal */}
      {modal}
    </div>
  )
}