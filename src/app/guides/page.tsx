'use client'

import { useState } from 'react'
import { ArrowLeft, Stethoscope, Pill, Briefcase, School, Users, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
  },
  {
    id: 'relationships',
    title: 'Relationship Guidance',
    description: 'Building and maintaining healthy relationships with ADHD',
    icon: Heart,
    color: 'from-red-400 to-pink-500',
    status: 'Coming Soon',
    guides: [
      {
        title: 'Dating with ADHD',
        preview: 'When and how to share your ADHD with romantic partners...',
        steps: ['Early dating', 'Disclosure timing', 'Building understanding']
      },
      {
        title: 'ADHD and Marriage/Partnership',
        preview: 'Long-term relationship strategies and communication...',
        steps: ['Communication patterns', 'Household management', 'Intimacy considerations']
      },
      {
        title: 'Parenting with ADHD',
        preview: 'Strategies for ADHD parents and ADHD children...',
        steps: ['Self-care priorities', 'Structure creation', 'Modeling strategies']
      }
    ]
  },
  {
    id: 'community',
    title: 'Building Your Support Network',
    description: 'Finding community, therapy, and ongoing support',
    icon: Users,
    color: 'from-indigo-400 to-purple-500',
    status: 'Coming Soon',
    guides: [
      {
        title: 'Finding ADHD-Informed Therapy',
        preview: 'What to look for in therapists and treatment approaches...',
        steps: ['Therapist qualifications', 'Treatment modalities', 'Interview questions']
      },
      {
        title: 'Building Your ADHD Community',
        preview: 'Online and offline communities, support groups, and connections...',
        steps: ['Community types', 'Safety considerations', 'Participation tips']
      },
      {
        title: 'Creating Your Support System',
        preview: 'Building a network of understanding friends, family, and professionals...',
        steps: ['Support mapping', 'Communication strategies', 'Boundary setting']
      }
    ]
  }
]

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const navigateHome = () => {
    window.history.back()
  }

  const navigateToPage = (page: string) => {
    window.location.href = `/${page}`
  }

  return (
    <div className="min-h-screen ocean-gradient relative flex flex-col">
      <Header 
        navigateHome={navigateHome} 
        navigateToPage={navigateToPage} 
        onSearchOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-12 md:pt-16 pb-24">
          
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={navigateHome}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              ADHD Life Guides
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Comprehensive, step-by-step guidance for major ADHD life journeys. 
              From diagnosis to workplace success, we'll help you navigate each important milestone.
            </p>
          </div>

          {/* Guide Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guideCategories.map((category) => {
              const IconComponent = category.icon
              
              return (
                <div key={category.id} className="space-y-6">
                  {/* Category Header */}
                  <div
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className={`
                      relative overflow-hidden rounded-3xl p-8 h-56
                      bg-gradient-to-br ${category.color}
                      backdrop-blur-lg bg-opacity-90 shadow-lg hover:shadow-xl
                    `}>
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-white text-xs font-medium">
                            {category.status}
                          </span>
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">
                          {category.title}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {category.description}
                        </p>

                        {/* Guide Count */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                          <span className="text-white text-sm font-medium">
                            {category.guides.length} guides planned
                          </span>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Guides Preview */}
                  <div className="space-y-4">
                    {category.guides.map((guide, index) => (
                      <div
                        key={index}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                          {guide.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {guide.preview}
                        </p>
                        
                        {/* Steps Preview */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            What you'll learn:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {guide.steps.map((step, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 
                                           text-xs px-3 py-1 rounded-full"
                              >
                                {step}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Coming Soon Badge */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 
                                         text-xs px-3 py-1 rounded-full font-medium">
                            Comprehensive guide in development
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Development Notice */}
          <div className="mt-16 text-center">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Guides Coming Soon!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're developing comprehensive, evidence-based guides for every major ADHD life journey. 
                These will include real-world examples, checklists, templates, and community insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigateToPage('suggest')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Request a Guide Topic
                </Button>
                <Button 
                  onClick={() => navigateToPage('blog')}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Read Current Articles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer navigateToPage={navigateToPage} />
    </div>
  )
}