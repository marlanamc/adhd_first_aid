'use client'

import { useState } from 'react'
import { ArrowLeft, MessageSquare, Users, Briefcase, Heart, BookOpen, Stethoscope, Pill, School, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Communication script categories based on Reddit research
const scriptCategories = [
  {
    id: 'explaining-adhd',
    title: 'Explaining ADHD',
    description: 'Scripts for explaining ADHD to different people in your life',
    icon: MessageSquare,
    color: 'from-blue-400 to-purple-500',
    scripts: [
      {
        title: 'Explaining ADHD to Your Partner',
        preview: 'Help your partner understand how ADHD affects your daily life...',
        situations: ['New relationship', 'Long-term partner', 'During conflict']
      },
      {
        title: 'Talking to Family About ADHD',
        preview: 'Navigate family conversations with confidence...',
        situations: ['Parents', 'Siblings', 'Extended family']
      },
      {
        title: 'ADHD in Professional Settings',
        preview: 'Disclosure strategies for work environments...',
        situations: ['Job interviews', 'Current employer', 'Accommodation requests']
      }
    ]
  },
  {
    id: 'boundary-setting',
    title: 'Setting Boundaries',
    description: 'Scripts for protecting your energy and advocating for your needs',
    icon: Heart,
    color: 'from-pink-400 to-red-500',
    scripts: [
      {
        title: 'Saying No to Commitments',
        preview: 'Polite but firm ways to decline when overwhelmed...',
        situations: ['Social events', 'Work requests', 'Family obligations']
      },
      {
        title: 'Asking for Accommodations',
        preview: 'Professional language for requesting support...',
        situations: ['Workplace', 'School', 'Healthcare']
      },
      {
        title: 'Managing Interruptions',
        preview: 'Protecting your focus time with gentle redirects...',
        situations: ['Deep work', 'Important tasks', 'Recovery time']
      }
    ]
  },
  {
    id: 'social-situations',
    title: 'Social Situations',
    description: 'Navigate social interactions with confidence',
    icon: Users,
    color: 'from-green-400 to-teal-500',
    scripts: [
      {
        title: 'Making New Friends',
        preview: 'Conversation starters and connection builders...',
        situations: ['Meeting new people', 'Group settings', 'One-on-one']
      },
      {
        title: 'Handling Social Rejection',
        preview: 'Coping strategies and perspective shifts...',
        situations: ['Declined invitations', 'Misunderstandings', 'Criticism']
      },
      {
        title: 'Small Talk Strategies',
        preview: 'Navigate casual conversations with ease...',
        situations: ['Work events', 'Social gatherings', 'Networking']
      }
    ]
  }
]

// Guide categories for major ADHD journeys
const guideCategories = [
  {
    id: 'diagnosis',
    title: 'Diagnosis Journey',
    description: 'Complete guide to getting an ADHD diagnosis as an adult',
    icon: Stethoscope,
    color: 'from-blue-400 to-indigo-500',
    status: 'Coming Soon',
    guides: [
      {
        title: 'Preparing for Your First Appointment',
        preview: 'What to bring, what to expect, and how to advocate for yourself...',
        steps: ['Symptom tracking', 'Medical history prep', 'Questions to ask']
      },
      {
        title: 'Understanding ADHD Assessments',
        preview: 'Different types of evaluations and what they measure...',
        steps: ['Psychological testing', 'Medical evaluation', 'Interview process']
      },
      {
        title: 'After Your Diagnosis',
        preview: 'Next steps for treatment and lifestyle changes...',
        steps: ['Processing the diagnosis', 'Treatment options', 'Support resources']
      }
    ]
  },
  {
    id: 'medication',
    title: 'Medication Guide',
    description: 'Understanding ADHD medications and finding what works for you',
    icon: Pill,
    color: 'from-green-400 to-teal-500',
    status: 'Coming Soon',
    guides: [
      {
        title: 'ADHD Medication Types Explained',
        preview: 'Stimulants vs. non-stimulants, how they work, and what to expect...',
        steps: ['Medication categories', 'How they work', 'Side effect profiles']
      },
      {
        title: 'Starting Your First Medication',
        preview: 'What to track, how to communicate with your doctor...',
        steps: ['Baseline tracking', 'Titration process', 'Side effect monitoring']
      },
      {
        title: 'Optimizing Your Treatment',
        preview: 'Fine-tuning dosage, timing, and combination approaches...',
        steps: ['Dose adjustments', 'Timing optimization', 'Combination therapy']
      }
    ]
  },
  {
    id: 'workplace',
    title: 'Workplace Accommodations',
    description: 'Navigate disclosure, accommodations, and workplace success',
    icon: Briefcase,
    color: 'from-purple-400 to-pink-500',
    status: 'Coming Soon',
    guides: [
      {
        title: 'Disclosure Decision Framework',
        preview: 'Weighing the pros and cons of disclosure in your specific situation...',
        steps: ['Legal protections', 'Risk assessment', 'Timing strategies']
      },
      {
        title: 'Requesting Accommodations',
        preview: 'How to ask for what you need professionally and effectively...',
        steps: ['Documentation needs', 'Accommodation examples', 'Negotiation tactics']
      },
      {
        title: 'Thriving at Work with ADHD',
        preview: 'Long-term strategies for career success with ADHD...',
        steps: ['Strength identification', 'Career planning', 'Performance optimization']
      }
    ]
  },
  {
    id: 'education',
    title: 'Education & Learning',
    description: 'Student accommodations, study strategies, and academic success',
    icon: School,
    color: 'from-yellow-400 to-orange-500',
    status: 'Coming Soon',
    guides: [
      {
        title: 'College Accommodations Guide',
        preview: 'Getting support in higher education settings...',
        steps: ['Disability services', 'Documentation requirements', 'Accommodation types']
      },
      {
        title: 'ADHD-Friendly Study Methods',
        preview: 'Learning techniques that work with your ADHD brain...',
        steps: ['Active learning', 'Memory techniques', 'Focus strategies']
      },
      {
        title: 'Test-Taking Strategies',
        preview: 'Maximize your performance on exams and assessments...',
        steps: ['Preparation methods', 'Test accommodations', 'Anxiety management']
      }
    ]
  }
]

// Category selection options
const categoryOptions = [
  {
    id: 'guides',
    title: 'Guides',
    icon: BookOpen,
    description: 'Step-by-step guidance for major ADHD journeys',
    color: 'from-indigo-400 to-blue-500'
  },
  {
    id: 'scripts',
    title: 'Scripts',
    icon: MessageSquare,
    description: 'Communication templates & conversation starters',
    color: 'from-blue-400 to-purple-500'
  }
]

export default function ScriptsPage() {
  const [selectedCategory, setSelectedCategory] = useState('guides')
  const [searchQuery, setSearchQuery] = useState('')

  const navigateHome = () => {
    window.history.back()
  }

  const navigateToPage = (page: string) => {
    window.location.href = `/${page}`
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const getCurrentData = () => {
    return selectedCategory === 'scripts' ? scriptCategories : guideCategories
  }

  const filteredData = getCurrentData().filter(item => {
    if (!searchQuery) return true
    
    const searchLower = searchQuery.toLowerCase()
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      (selectedCategory === 'scripts' 
        ? item.scripts.some((script: any) => 
            script.title.toLowerCase().includes(searchLower) ||
            script.preview.toLowerCase().includes(searchLower)
          )
        : item.guides.some((guide: any) => 
            guide.title.toLowerCase().includes(searchLower) ||
            guide.preview.toLowerCase().includes(searchLower)
          )
      )
    )
  })

  return (
    <div className="min-h-screen ocean-gradient relative flex flex-col">
      <Header 
        navigateHome={navigateHome} 
        navigateToPage={navigateToPage} 
        onSearchOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-32 md:pt-36 pb-24">
          
          {/* Back Button */}
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 max-w-xs">
            <button
              onClick={navigateHome}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light inline-flex items-center cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-6 leading-tight">
              Guides & Scripts
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
              Communication templates and step-by-step guidance to support your ADHD journey
            </p>
          </div>

          {/* Category Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {categoryOptions.map((category) => {
              const IconComponent = category.icon
              const isSelected = selectedCategory === category.id
              
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    relative group cursor-pointer transform transition-all duration-300 
                    ${isSelected ? 'scale-105 shadow-2xl' : 'hover:scale-105 hover:shadow-xl'}
                  `}
                >
                  <div className={`
                    relative overflow-hidden rounded-2xl p-6
                    bg-gradient-to-br ${category.color}
                    backdrop-blur-lg bg-opacity-90
                    transition-all duration-300
                    group-hover:bg-opacity-100
                    h-[13rem] flex flex-col justify-between
                    ${isSelected ? 'ring-2 ring-white/50' : ''}
                  `}>
                    <div className="flex-1 flex flex-col">
                      <div className="mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {category.title}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={selectedCategory === 'scripts' ? "Search scripts..." : "Search guides..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              />
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {filteredData.map((item) => {
              const IconComponent = item.icon
              
              return (
                <div key={item.id} className="space-y-6">
                  {/* Category Header */}
                  <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
                    <div className={`
                      relative overflow-hidden rounded-3xl p-8 h-56
                      bg-gradient-to-br ${item.color}
                      backdrop-blur-lg bg-opacity-90 shadow-lg hover:shadow-xl
                    `}>
                      {/* Status Badge (for guides) */}
                      {selectedCategory === 'guides' && (item as any).status && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-white text-xs font-medium">
                              {(item as any).status}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Icon */}
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">
                          {item.title}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {item.description}
                        </p>

                        {/* Count */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                          <span className="text-white text-sm font-medium">
                            {selectedCategory === 'scripts' 
                              ? `${(item as any).scripts.length} scripts available`
                              : `${(item as any).guides.length} guides planned`
                            }
                          </span>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="space-y-4">
                    {selectedCategory === 'scripts' 
                      ? (item as any).scripts.map((script: any, index: number) => (
                          <div
                            key={index}
                            className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <h4 className="font-semibold text-foreground mb-2">
                              {script.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {script.preview}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {script.situations.map((situation: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full"
                                >
                                  {situation}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))
                      : (item as any).guides.map((guide: any, index: number) => (
                          <div
                            key={index}
                            className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <h4 className="font-semibold text-foreground mb-2 text-lg">
                              {guide.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              {guide.preview}
                            </p>
                            
                            {/* Steps Preview */}
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                What you'll learn:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {guide.steps.map((step: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full"
                                  >
                                    {step}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Coming Soon Badge */}
                            <div className="mt-4 pt-4 border-t border-white/20">
                              <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-medium">
                                Comprehensive guide in development
                              </span>
                            </div>
                          </div>
                        ))
                    }
                  </div>
                </div>
              )
            })}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-16 text-center">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {selectedCategory === 'scripts' ? 'More Scripts Coming Soon!' : 'Guides Coming Soon!'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {selectedCategory === 'scripts' 
                  ? "We're developing comprehensive conversation scripts based on real ADHD community needs. These will include word-for-word examples, common responses, and follow-up strategies."
                  : "We're developing comprehensive, evidence-based guides for every major ADHD life journey. These will include real-world examples, checklists, templates, and community insights."
                }
              </p>
              <Button 
                onClick={() => navigateToPage('suggest')}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {selectedCategory === 'scripts' ? 'Suggest a Script Topic' : 'Request a Guide Topic'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer navigateToPage={navigateToPage} />
    </div>
  )
}