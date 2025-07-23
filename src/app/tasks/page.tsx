'use client'

import { useState } from 'react'
import { ArrowLeft, Wrench, Home, Calendar, Brain, Clock, Mail, ClipboardList, Briefcase, BookOpen, Brush, ShoppingCart, Utensils, Bed, Shirt, Trash2, Laptop, Phone, Wallet, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

// Tasks data with icons
const tasks = [
  // Home & Life Maintenance
  { name: 'Cleaning', category: 'Home & Life Maintenance', icon: Home },
  { name: 'Laundry', category: 'Home & Life Maintenance', icon: Shirt },
  { name: 'Dishes', category: 'Home & Life Maintenance', icon: Utensils },
  { name: 'Decluttering', category: 'Home & Life Maintenance', icon: Trash2 },
  { name: 'Meal Planning', category: 'Home & Life Maintenance', icon: Utensils },
  { name: 'Shopping', category: 'Home & Life Maintenance', icon: ShoppingCart },
  { name: 'Sleep', category: 'Home & Life Maintenance', icon: Bed },
  
  // Planning & Organization
  { name: 'Calendar', category: 'Planning & Organization', icon: Calendar },
  { name: 'To-Do Lists', category: 'Planning & Organization', icon: ClipboardList },
  { name: 'Emails', category: 'Planning & Organization', icon: Mail },
  { name: 'Bills & Money', category: 'Planning & Organization', icon: Wallet },
  { name: 'Paperwork', category: 'Planning & Organization', icon: FileText },
  
  // Execution & Productivity
  { name: 'Focus Time', category: 'Execution & Productivity', icon: Brain },
  { name: 'Work Tasks', category: 'Execution & Productivity', icon: Briefcase },
  { name: 'Study', category: 'Execution & Productivity', icon: BookOpen },
  { name: 'Creative Projects', category: 'Execution & Productivity', icon: Brush },
  
  // Transition & Activation
  { name: 'Morning Routine', category: 'Transition & Activation', icon: Clock },
  { name: 'Screen Time', category: 'Transition & Activation', icon: Laptop },
  { name: 'Phone Use', category: 'Transition & Activation', icon: Phone }
]

const categories = [
  { name: 'Home & Life Maintenance', color: 'from-green-400 to-emerald-500', count: 11 },
  { name: 'Planning & Organization', color: 'from-blue-400 to-cyan-500', count: 4 },
  { name: 'Execution & Productivity', color: 'from-orange-400 to-amber-500', count: 3 },
  { name: 'Transition & Activation', color: 'from-purple-400 to-indigo-500', count: 2 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 20 }
]

const categoryColors = {
  'Home & Life Maintenance': 'from-green-400 to-emerald-500',
  'Planning & Organization': 'from-blue-400 to-cyan-500',
  'Execution & Productivity': 'from-orange-400 to-amber-500',
  'Transition & Activation': 'from-purple-400 to-indigo-500'
}

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Home & Life Maintenance')

  const handleTaskSelect = (task: string) => {
    setSelectedTask(task)
    // Navigate to individual task page
    window.location.href = `/tasks/${encodeURIComponent(task.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}`
  }

  const goBack = () => {
    window.history.back()
  }

  // Filter tasks by selected category
  const filteredTasks = selectedCategory === 'View All'
    ? [...tasks].sort((a, b) => a.name.localeCompare(b.name))
    : selectedCategory 
    ? tasks.filter(task => task.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4fc79] via-[#b0f4ea] to-[#8fd3f4] relative">
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="default"
              onClick={goBack}
              className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-[#22223B] dark:text-white" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-black text-center">
                What do you need help with today?
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black text-center mb-6">Choose a task type:</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`
                  group cursor-pointer transform transition-all duration-300 ease-out
                  hover:scale-105 hover:-translate-y-1 text-left
                  ${selectedCategory === category.name ? 'scale-105 -translate-y-1' : ''}
                `}
              >
                <div className={`backdrop-blur-md rounded-2xl p-3 
                              transition-all duration-300
                              group-hover:bg-white/30
                              h-16 flex flex-col justify-center
                              ${selectedCategory === category.name 
                                ? 'bg-white/40 ring-2 ring-black/[0.15] dark:ring-white/[0.3]' 
                                : 'bg-white/10 hover:bg-white/20'}`}>
                  
                  <h3 className={`text-sm font-medium text-black text-center mb-1
                                ${selectedCategory === category.name ? 'font-semibold' : ''}`}>
                    {category.name}
                  </h3>
                  <p className={`text-xs text-black/70 text-center
                                ${selectedCategory === category.name ? 'text-black/90' : ''}`}>
                    {category.count} tasks
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Category Tasks */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-black text-center mb-8">
              {selectedCategory === 'View All' ? 'All Tasks' : selectedCategory}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.name}
                  onClick={() => handleTaskSelect(task.name)}
                  className={`
                    group cursor-pointer transform transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1
                    ${selectedTask === task.name ? 'scale-105 -translate-y-1' : ''}
                  `}
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 
                                shadow-lg hover:shadow-xl transition-all duration-300
                                group-hover:bg-white/30
                                h-32 flex flex-col justify-center items-center
                                border border-white/10">
                    
                    {/* Icon */}
                    <div className="text-2xl mb-1 transition-all duration-300 group-hover:scale-110">
                      {React.createElement(task.icon, {
                        size: 24,
                        className: "text-black dark:text-white"
                      })}
                    </div>
                    
                    {/* Task Name */}
                    <h3 className="text-sm font-medium text-black text-center transition-all duration-300">
                      {task.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Text */}
        <div className="text-center mt-12 max-w-3xl mx-auto">
          <div className="bg-white/30 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-black mb-2">
              Not sure where to start?
            </h3>
            <p className="text-black text-sm mb-4">
              Sometimes it's easier to start with how you're feeling or what's blocking you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/feelings'}
                className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm"
              >
                Browse by Feelings
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/barriers'}
                className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm"
              >
                Browse by Barriers
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/identities'}
                className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm"
              >
                Browse by Identity
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 