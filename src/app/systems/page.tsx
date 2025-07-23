'use client'

import { useState } from 'react'
import { ArrowLeft, Settings, Plus, Heart, Clock, Zap, Coffee, Moon, RefreshCw, Users, Share2, Download, Home, Brain, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Sample systems data - in a real app, this would come from a database
const featuredSystems = [
  {
    id: 1,
    name: 'Morning Routine Reset',
    description: 'A gentle morning routine for low-energy days',
    creator: 'Community',
    likes: 124,
    category: 'Daily Routines',
    difficulty: 'Easy',
    time: '15-30 min',
    icon: Coffee,
    steps: 5,
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 2,
    name: 'Post-Crash Recovery',
    description: 'Steps to recover from executive function shutdown',
    creator: 'ADHD Coach Sarah',
    likes: 89,
    category: 'Crisis Support',
    difficulty: 'Medium',
    time: '10-20 min',
    icon: RefreshCw,
    steps: 7,
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 3,
    name: '7AM Workout System',
    description: 'Early morning exercise routine that actually sticks',
    creator: 'FitnessADHD',
    likes: 156,
    category: 'Exercise',
    difficulty: 'Hard',
    time: '45-60 min',
    icon: Zap,
    steps: 8,
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 4,
    name: 'Evening Wind-Down',
    description: 'Consistent bedtime routine for better sleep',
    creator: 'SleepExpert',
    likes: 203,
    category: 'Sleep',
    difficulty: 'Easy',
    time: '20-40 min',
    icon: Moon,
    steps: 6,
    color: 'from-purple-400 to-indigo-500'
  },
  {
    id: 5,
    name: 'ADHD Declutter Method',
    description: 'Organizing that sticks, even with executive dysfunction',
    creator: 'OrganizeADHD',
    likes: 178,
    category: 'Organization',
    difficulty: 'Medium',
    time: '30-60 min',
    icon: Home,
    steps: 6,
    color: 'from-teal-400 to-cyan-500'
  },
  {
    id: 6,
    name: 'Focus & Flow Framework',
    description: 'Optimize your environment and mindset for deep work',
    creator: 'ADHDProductivity',
    likes: 142,
    category: 'Productivity',
    difficulty: 'Medium',
    time: '20-30 min setup',
    icon: Brain,
    steps: 4,
    color: 'from-indigo-400 to-purple-500'
  }
]

const systemCategories = [
  { name: 'Daily Routines', icon: Calendar, count: 12, color: 'from-orange-400 to-yellow-500' },
  { name: 'Crisis Support', icon: Heart, count: 8, color: 'from-red-400 to-pink-500' },
  { name: 'Exercise', icon: Zap, count: 15, color: 'from-green-400 to-emerald-500' },
  { name: 'Sleep', icon: Moon, count: 9, color: 'from-purple-400 to-indigo-500' },
  { name: 'Organization', icon: Home, count: 18, color: 'from-teal-400 to-cyan-500' },
  { name: 'Productivity', icon: Brain, count: 21, color: 'from-blue-400 to-indigo-500' }
]

export default function SystemsPage() {
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'browse' | 'build' | 'my-systems'>('browse')

  const handleSystemSelect = (systemId: number) => {
    setSelectedSystem(systemId)
    // In a real app, this would navigate to the system detail page
    console.log(`Selected system: ${systemId}`)
  }

  const goBack = () => {
    window.history.back()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={goBack}
              className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-3">
                <Settings className="h-8 w-8 text-green-500" />
                Systems Lab
              </h1>
              <p className="text-muted-foreground mt-2">
                Browse, build, and share ADHD-friendly routines that solve real problems
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-200 dark:bg-gray-800 rounded-xl p-1 max-w-md">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'browse'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Browse Systems
            </button>
            <button
              onClick={() => setActiveTab('build')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'build'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Build System
            </button>
            <button
              onClick={() => setActiveTab('my-systems')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'my-systems'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Systems
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            {/* Categories */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Browse by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {systemCategories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <div
                      key={category.name}
                      className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <IconComponent className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <h3 className="font-medium text-foreground text-sm mb-1">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.count} systems</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Featured Systems */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Featured Systems</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {featuredSystems.map((system) => {
                  const IconComponent = system.icon
                  return (
                    <div
                      key={system.id}
                      onClick={() => handleSystemSelect(system.id)}
                      className={`
                        group cursor-pointer transform transition-all duration-300 ease-out
                        hover:scale-[1.02] hover:-translate-y-1
                        ${selectedSystem === system.id ? 'scale-[1.02] -translate-y-1' : ''}
                      `}
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                        {/* Header with gradient */}
                        <div className={`bg-gradient-to-r ${system.color} p-6 text-white`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{system.name}</h3>
                                <p className="text-white/90 text-sm">{system.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{system.steps} steps</span>
                              <span>{system.time}</span>
                              <span 
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(system.difficulty)}`}
                              >
                                {system.difficulty}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-muted-foreground">{system.likes}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">by {system.creator}</p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Download className="h-4 w-4 mr-1" />
                                Use System
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'build' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Build Your Own System</h2>
                <p className="text-muted-foreground">
                  Create a step-by-step routine that works for your ADHD brain
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., My Morning Routine"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Briefly describe what this system helps with..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select category...</option>
                      {systemCategories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Difficulty
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select difficulty...</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Time Needed
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 15-30 min"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Steps
                  </label>
                  <div className="space-y-3">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-sm font-medium text-green-600 dark:text-green-400">
                          {step}
                        </div>
                        <input
                          type="text"
                          placeholder={`Step ${step}: What do you do?`}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Step
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <Button variant="outline">Save as Draft</Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Publish System
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-systems' && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No Systems Yet</h2>
              <p className="text-muted-foreground mb-6">
                Build your first system to see it here, or save systems from the community.
              </p>
              <Button
                onClick={() => setActiveTab('build')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First System
              </Button>
            </div>
          </div>
        )}

        {/* Footer Text */}
        <div className="text-center mt-12 max-w-2xl mx-auto">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Build Systems That Work for You
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              These are step-by-step routines created by and for the ADHD community. Share what works for you and discover new approaches.
            </p>
            <Button 
              onClick={() => window.location.href = '/suggest'}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Suggest a System Topic
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}