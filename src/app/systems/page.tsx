'use client'

import { useState } from 'react'
import { ArrowLeft, Calendar, Home, Zap, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Life management systems based on Reddit research
const systemCategories = [
  {
    id: 'routines',
    title: 'Daily Routines',
    description: 'Flexible frameworks for morning, evening, and weekly routines',
    icon: Calendar,
    color: 'from-orange-400 to-yellow-500',
    systems: [
      {
        title: 'ADHD-Friendly Morning Routine',
        preview: 'Gentle start to your day that works with your brain...',
        components: ['Preparation night before', 'Flexible timing', 'Energy awareness']
      },
      {
        title: 'Evening Wind-Down System',
        preview: 'End your day with clarity and preparation...',
        components: ['Brain dump', 'Tomorrow prep', 'Self-care ritual']
      },
      {
        title: 'Weekly Planning Framework',
        preview: 'Stay on track without overwhelm...',
        components: ['Priority setting', 'Energy mapping', 'Buffer time']
      }
    ]
  },
  {
    id: 'organization',
    title: 'Organization Systems',
    description: 'Sustainable methods for managing your physical and digital spaces',
    icon: Home,
    color: 'from-green-400 to-teal-500',
    systems: [
      {
        title: 'The ADHD Declutter Method',
        preview: 'Organizing that sticks, even with executive dysfunction...',
        components: ['One-touch rule', 'Visual systems', 'Maintenance habits']
      },
      {
        title: 'Digital Life Management',
        preview: 'Tame your digital chaos with simple systems...',
        components: ['Email workflow', 'File organization', 'App optimization']
      },
      {
        title: 'Paper & Document System',
        preview: 'Never lose important documents again...',
        components: ['Action folders', 'Scan workflow', 'Reminder system']
      }
    ]
  },
  {
    id: 'energy-management',
    title: 'Energy Management',
    description: 'Work with your natural energy patterns, not against them',
    icon: Zap,
    color: 'from-purple-400 to-pink-500',
    systems: [
      {
        title: 'Energy Mapping System',
        preview: 'Identify and optimize your daily energy patterns...',
        components: ['Energy tracking', 'Task matching', 'Recovery planning']
      },
      {
        title: 'Spoon Theory for ADHD',
        preview: 'Manage your mental and emotional resources...',
        components: ['Daily capacity', 'Energy budgeting', 'Recovery strategies']
      },
      {
        title: 'Burnout Prevention Framework',
        preview: 'Sustainable productivity that prevents crashes...',
        components: ['Warning signs', 'Circuit breakers', 'Recovery protocols']
      }
    ]
  },
  {
    id: 'productivity',
    title: 'Productivity Systems',
    description: 'ADHD-adapted approaches to getting things done',
    icon: Brain,
    color: 'from-blue-400 to-indigo-500',
    systems: [
      {
        title: 'The ADHD Task System',
        preview: 'Break down overwhelming projects into manageable steps...',
        components: ['Task decomposition', 'Priority matrix', 'Progress tracking']
      },
      {
        title: 'Focus & Flow Framework',
        preview: 'Optimize your environment and mindset for deep work...',
        components: ['Focus triggers', 'Distraction management', 'Flow state entry']
      },
      {
        title: 'Accountability Without Shame',
        preview: 'Self-compassionate approaches to staying on track...',
        components: ['Progress celebration', 'Gentle redirects', 'Support systems']
      }
    ]
  }
]

export default function SystemsPage() {
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
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              Life Management Systems
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Flexible frameworks and systems designed specifically for ADHD brains. 
              Build sustainable habits that work with your neurodivergent patterns.
            </p>
          </div>

          {/* System Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {systemCategories.map((category) => {
              const IconComponent = category.icon
              
              return (
                <div key={category.id} className="space-y-6">
                  {/* Category Header */}
                  <div
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className={`
                      relative overflow-hidden rounded-3xl p-8 h-48
                      bg-gradient-to-br ${category.color}
                      backdrop-blur-lg bg-opacity-90 shadow-lg hover:shadow-xl
                    `}>
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

                        {/* System Count */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                          <span className="text-white text-sm font-medium">
                            {category.systems.length} systems available
                          </span>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Systems Preview */}
                  <div className="space-y-4">
                    {category.systems.map((system, index) => (
                      <div
                        key={index}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                          {system.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {system.preview}
                        </p>
                        
                        {/* Components */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Key Components:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {system.components.map((component, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 
                                           text-xs px-3 py-1 rounded-full"
                              >
                                {component}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Coming Soon Badge */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 
                                         text-xs px-3 py-1 rounded-full font-medium">
                            Detailed guide coming soon
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
                Systems in Development
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're creating comprehensive, step-by-step guides for each of these systems. 
                They'll include templates, checklists, and real-world examples from the ADHD community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigateToPage('suggest')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Suggest a System
                </Button>
                <Button 
                  onClick={() => navigateToPage('strategies')}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Browse Current Strategies
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