'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Wrench, Heart, Home, Calendar, Brain, Clock, Mail, ClipboardList, Briefcase, BookOpen, Brush, ShoppingCart, Utensils, Bed, Shirt, Trash2, Laptop, Phone, Wallet, FileText, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

interface TaskPageProps {
  params: {
    task: string
  }
}

export default function TaskPage({ params }: TaskPageProps) {
  const [taskName, setTaskName] = useState<string>('')
  const [taskIcon, setTaskIcon] = useState<React.ElementType>(Wrench)
  const [expandedSections, setExpandedSections] = useState<{[key: number]: boolean}>({})
  const [hoveredSection, setHoveredSection] = useState<number | null>(null)

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  useEffect(() => {
    // Convert URL param back to display name
    const name = decodeURIComponent(params.task)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/And/g, '&') // Fix "Emails And Texts" -> "Emails & Texts"
    setTaskName(name)

    // Map tasks to Lucide icons (matching main tasks page)
    const iconMap: Record<string, React.ElementType> = {
      'Cleaning': Home,
      'Laundry': Shirt,
      'Dishes': Utensils,
      'Decluttering': Trash2,
      'Meal Planning': Utensils,
      'Shopping': ShoppingCart,
      'Sleep': Bed,
      'Calendar': Calendar,
      'To-Do Lists': ClipboardList,
      'Emails': Mail,
      'Bills & Money': Wallet,
      'Paperwork': FileText,
      'Focus Time': Brain,
      'Work Tasks': Briefcase,
      'Study': BookOpen,
      'Creative Projects': Brush,
      'Morning Routine': Clock,
      'Screen Time': Laptop,
      'Phone Use': Phone,
      // Legacy mappings for compatibility
      'Meal Prep': Utensils,
      'Emails & Texts': Mail,
      'Hygiene': Home,
      'Finances': Wallet,
      'Errands': ShoppingCart,
      'Planning': Calendar,
      'Time Management': Clock,
      'Starting Something Hard': Brain,
      'Finishing Something': ClipboardList,
      'Leaving the House': Home,
      'Getting Ready': Clock
    }
    setTaskIcon(iconMap[name] || Wrench)
  }, [params.task])

  const goBack = () => {
    window.history.back()
  }

  // Example validation messages for different tasks
  const getValidationMessage = (task: string) => {
    const messages: Record<string, string> = {
      'Cleaning': "Your space doesn't define your worth. You're not lazy - your brain just works differently.",
      'Meal Prep': "Feeding yourself is an act of self-care. Simple meals count. You don't need to be perfect.",
      'Emails & Texts': "Communication overwhelm is real. You're not rude for needing time to respond thoughtfully.",
      'Hygiene': "Self-care isn't selfish. Your brain might make this feel harder, but you deserve to feel clean and comfortable.",
      'Finances': "Money stress is overwhelming for ADHD brains. Taking small steps still counts as progress.",
      'Starting Something Hard': "Task initiation issues aren't character flaws. Your brain needs different activation strategies.",
      'Planning': "ADHD brains struggle with time and sequencing. External structure helps your brilliant mind function."
    }
    return messages[task] || `This task feels hard because your ADHD brain processes things differently. That's not a flaw - it's just how you're wired.`
  }

  // Micro strategies based on the task
  const getMicroStrategies = (task: string) => {
    const strategies: Record<string, Array<{title: string, description: string}>> = {
      'Cleaning': [
        { title: "Set timer for 15 minutes", description: "Just pick one small area and clean until the timer goes off." },
        { title: "Put on energizing music", description: "Let the rhythm carry you through the task." },
        { title: "Start with trash pickup", description: "Quick wins build momentum for bigger tasks." }
      ],
      'Emails & Texts': [
        { title: "Set specific email times", description: "Check only at 9am, 1pm, and 5pm. Close it otherwise." },
        { title: "Use voice-to-text", description: "Sometimes speaking is easier than typing." },
        { title: "Draft template responses", description: "Have standard replies ready for common messages." }
      ],
      'Starting Something Hard': [
        { title: "Do just the first step", description: "Open the document, gather supplies, or read the first line." },
        { title: "Set up your environment", description: "Clear your space, get water, eliminate distractions." },
        { title: "Tell someone you're starting", description: "Body doubling works even virtually." }
      ],
      'Planning': [
        { title: "Brain dump everything", description: "Get all thoughts out of your head onto paper first." },
        { title: "Pick 3 priorities max", description: "Your brain can only handle so much at once." },
        { title: "Time block in calendar", description: "Make your intentions visible and protected." }
      ]
    }
    
    return strategies[task] || [
      { title: "Start smaller", description: "Break it down into the tiniest possible first step." },
      { title: "Change your environment", description: "Sometimes a different location shifts everything." },
      { title: "Set a timer", description: "Commit to just 10-15 minutes to start." }
    ]
  }

  const microStrategies = getMicroStrategies(taskName)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4fc79] via-[#b0f4ea] to-[#8fd3f4] relative">
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-lg">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="default"
                onClick={goBack}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-3">
                  {React.createElement(taskIcon, {
                    className: "h-8 w-8 text-blue-500"
                  })}
                  {taskName}
                </h1>
              </div>
            </div>

            {/* Validation Header */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <p className="text-lg md:text-xl text-foreground leading-relaxed">
                {getValidationMessage(taskName)}
              </p>
            </div>
          </div>

          {/* Gentle guidance note */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
              <span className="text-lg">🌱</span>
              <span>Take your time, open each section when you're ready</span>
            </p>
          </div>

          {/* Collapsible Micro Strategies */}
          <div className="mb-8 space-y-4">
            {microStrategies.map((strategy, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => toggleSection(index)}
                  onMouseEnter={() => setHoveredSection(index)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="w-full flex items-center gap-3 mb-4 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {strategy.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Quick start strategy
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedSections[index] ? (
                      <Minus className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {/* Custom Tooltip */}
                {hoveredSection === index && (
                  <div className="absolute right-2 top-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded shadow-lg z-10 pointer-events-none">
                    {expandedSections[index] ? "Close section" : "Open section"}
                  </div>
                )}
                
                {expandedSections[index] && (
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4 animate-in slide-in-from-top duration-300">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {strategy.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show All Strategies Button - moved above navigation */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Need More Strategies?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-center">
                Explore all available strategies specifically for {taskName.toLowerCase()}.
              </p>
              <div className="text-center">
                <Button 
                  onClick={() => window.location.href = `/strategies?task=${encodeURIComponent(taskName)}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Show All Strategies for {taskName}
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="grid gap-4 md:grid-cols-2 pt-4">
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/feelings'}
              className="p-6 text-left h-auto border-2 hover:bg-pink-50 dark:hover:bg-pink-900/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">❤️</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Feeling stuck emotionally?</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Feelings</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline"
              onClick={() => window.location.href = '/barriers'}
              className="p-6 text-left h-auto border-2 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚧</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Facing barriers or obstacles?</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Barriers Support</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline"
              onClick={() => window.location.href = '/identities'}
              className="p-6 text-left h-auto border-2 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌈</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Need identity-aware support?</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Identity Support</div>
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/systems'}
              className="p-6 text-left h-auto border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧩</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Want to build a system around this?</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Systems Lab</div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}