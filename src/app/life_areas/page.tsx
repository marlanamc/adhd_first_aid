'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Wrench, Home, Calendar, Brain, Clock, Mail, ClipboardList, Briefcase, BookOpen, Brush, ShoppingCart, Utensils, Bed, Shirt, Trash2, Laptop, Phone, Wallet, FileText, Users, Sparkles, Bath, Car, Sun, Dumbbell, CookingPot, Refrigerator, Recycle, Store, PackageCheck, Receipt, Calculator, ScrollText, Pencil, PhoneCall, Bell, GraduationCap, Library, Palette, DoorClosed, Pill, MailPlus, MousePointerClick, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SuggestContentModal } from '@/components/ui/SuggestContentModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'

// Tasks data with icons - updated to ensure Brain is first, Sparkles is last, no duplicates
const tasks = [
  // Work & Study (Brain first as requested)
  { name: 'Focus & Time', category: 'Work & Study', icon: Brain },
  { name: 'Work Tasks', category: 'Work & Study', icon: Briefcase },
  { name: 'Big Exam Prep (Long-Term Studying)', category: 'Work & Study', icon: GraduationCap },
  { name: 'Staying on Top of Classwork', category: 'Work & Study', icon: Library },
  
  // Home & Cleaning
  { name: 'Cleaning', category: 'Home & Cleaning', icon: Brush },
  { name: 'Laundry', category: 'Home & Cleaning', icon: Shirt },
  { name: 'Dishes', category: 'Home & Cleaning', icon: Utensils },
  { name: 'Decluttering', category: 'Home & Cleaning', icon: PackageCheck },
  { name: 'Cleaning Out the Fridge', category: 'Home & Cleaning', icon: Refrigerator },
  { name: 'Trash & Recycling', category: 'Home & Cleaning', icon: Recycle },
  { name: 'Minor Repairs', category: 'Home & Cleaning', icon: Wrench },
  
  // Health & Routines
  { name: 'Hygiene', category: 'Health & Routines', icon: Bath },
  { name: 'Morning Routine', category: 'Health & Routines', icon: Sun },
  { name: 'Getting Out the Door', category: 'Health & Routines', icon: DoorClosed },
  { name: 'Moving Your Body', category: 'Health & Routines', icon: Dumbbell },
  { name: 'Cooking', category: 'Health & Routines', icon: CookingPot },
  { name: 'Car Maintenance', category: 'Health & Routines', icon: Car },
  
  // Food & Shopping
  { name: 'Meal Planning', category: 'Food & Shopping', icon: ClipboardList },
  { name: 'Meal Prepping', category: 'Food & Shopping', icon: Clock },
  { name: 'Grocery Shopping', category: 'Food & Shopping', icon: ShoppingCart },
  { name: 'Retail Shopping', category: 'Food & Shopping', icon: Store },
  { name: 'Returning Items', category: 'Food & Shopping', icon: Wallet },
  
  // Planning & Organization
  { name: 'Planning & Scheduling', category: 'Planning & Organization', icon: Calendar },
  { name: 'To-Do Lists', category: 'Planning & Organization', icon: FileText },
  { name: 'Bills & Money', category: 'Planning & Organization', icon: Receipt },
  { name: 'Budgeting & Tracking', category: 'Planning & Organization', icon: Calculator },
  { name: 'Paperwork', category: 'Planning & Organization', icon: ScrollText },
  { name: 'Filling Out Documents', category: 'Planning & Organization', icon: Pencil },
  { name: 'Reading Important Mail', category: 'Planning & Organization', icon: Mail },
  { name: 'Writing Emails', category: 'Planning & Organization', icon: MailPlus },
  { name: 'Organization', category: 'Planning & Organization', icon: Target },
  { name: 'Making Phone Calls', category: 'Planning & Organization', icon: PhoneCall },
  { name: 'Following Up', category: 'Planning & Organization', icon: Bell },
  { name: 'Scheduling Appointments', category: 'Planning & Organization', icon: BookOpen },
  { name: 'Medication Refills', category: 'Planning & Organization', icon: Pill },
  
  // Creative & Personal (Sparkles last as requested)
  { name: 'Creative Projects', category: 'Creative & Personal', icon: Sparkles }
]

const categories = [
  { name: 'Work & Study', color: 'from-purple-400 to-violet-500', count: 4 },
  { name: 'Home & Cleaning', color: 'from-green-400 to-emerald-500', count: 7 },
  { name: 'Health & Routines', color: 'from-teal-400 to-cyan-500', count: 6 },
  { name: 'Food & Shopping', color: 'from-orange-400 to-amber-500', count: 5 },
  { name: 'Planning & Organization', color: 'from-blue-400 to-indigo-500', count: 12 },
  { name: 'Creative & Personal', color: 'from-pink-400 to-rose-500', count: 1 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 36 }
]

const categoryColors = {
  'Home & Cleaning': 'from-green-400 to-emerald-500',
  'Health & Routines': 'from-teal-400 to-cyan-500',
  'Food & Shopping': 'from-orange-400 to-amber-500',
  'Planning & Organization': 'from-blue-400 to-indigo-500',
  'Work & Study': 'from-purple-400 to-violet-500',
  'Creative & Personal': 'from-pink-400 to-rose-500'
}

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Work & Study')
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
  const isMobile = useIsMobile()

  // Read category from URL parameter on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryFromUrl = urlParams.get('category')
    if (categoryFromUrl) {
      const decodedCategory = decodeURIComponent(categoryFromUrl)
      // Check if the decoded category matches any of our known categories exactly
      const categories = ['Work & Study', 'Home & Cleaning', 'Health & Routines', 'Food & Shopping', 'Planning & Organization', 'Creative & Personal', 'View All']
      const matchingCategory = categories.find(cat => cat === decodedCategory)
      if (matchingCategory) {
        setSelectedCategory(decodedCategory)
      }
    }
  }, [])

  const handleTaskSelect = (task: string) => {
    setSelectedTask(task)
    // Navigate to individual task page with category parameter
    // Fix ampersand handling to avoid double dashes in URLs
    const taskSlug = encodeURIComponent(
      task
        .toLowerCase()
        .replace(/&/g, 'and') // Replace & with 'and' before other processing
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/[^a-z0-9-]/g, '') // Remove special characters
        .replace(/--+/g, '-') // Clean up any double dashes
    )
    const categoryParam = selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ''
    window.location.href = `/life_areas/${taskSlug}${categoryParam}`
  }

  const goBack = () => {
    window.location.href = '/'
  }

  // Filter tasks by selected category
  const filteredTasks = selectedCategory === 'View All'
    ? [...tasks].sort((a, b) => a.name.localeCompare(b.name))
    : selectedCategory 
    ? tasks.filter(task => task.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9ee5b5] via-[#b0f4ea] to-[#8fd3f4] dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative">
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
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white text-center">
                What do you need help with today?
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black dark:text-white text-center mb-6 flex items-center justify-center gap-2">
            <MousePointerClick className="h-5 w-5" />
            Choose a task type:
          </h2>
          {isMobile ? (
            <Select value={selectedCategory || undefined} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full bg-white/20 dark:bg-gray-800/40 backdrop-blur-md border-white/30 dark:border-gray-600/30 text-black dark:text-white">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-white/30 dark:border-gray-600/30">
                {categories.map((category, index) => (
                  <SelectItem 
                    key={category.name} 
                    value={category.name}
                    className="text-black dark:text-white hover:bg-white/20 dark:hover:bg-gray-700/50"
                  >
                    {category.name === 'View All' && index > 0 && (
                      <div className="border-t border-gray-300 my-2 -mx-2"></div>
                    )}
                    <div className="flex items-center w-full">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-xl">
                          {category.name === 'Work & Study' ? '💼' :
                           category.name === 'Home & Cleaning' ? '🏠' :
                           category.name === 'Health & Routines' ? '💪' :
                           category.name === 'Food & Shopping' ? '🛒' :
                           category.name === 'Planning & Organization' ? '📋' :
                           category.name === 'Creative & Personal' ? '🎨' :
                           category.name === 'View All' ? '👀' : '🔧'}
                        </span>
                        <span className={`font-medium text-base ${category.name === 'View All' ? 'text-gray-600' : ''}`}>
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm text-black/60 dark:text-white/60 flex-shrink-0 ml-4">
                        {category.count} {category.count === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
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
                    
                    <h3 className={`text-sm font-medium text-black dark:text-white text-center mb-1
                                  ${selectedCategory === category.name ? 'font-semibold' : ''}`}>
                      {category.name}
                    </h3>
                    <p className={`text-xs text-black/70 dark:text-white/70 text-center
                                  ${selectedCategory === category.name ? 'text-black/90 dark:text-white/90' : ''}`}>
                      {category.count} tasks
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Category Tasks */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white text-center mb-8">
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
                    <h3 className="text-sm font-medium text-black dark:text-white text-center transition-all duration-300">
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
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Not sure where to start?
            </h3>
            
            {/* Suggest a Life Area Button */}
            <div className="mb-4 flex justify-center">
              <Button
                onClick={() => setIsSuggestModalOpen(true)}
                className="group relative px-4 py-2 bg-gradient-to-r from-[#9ee5b5] via-[#b0f4ea] to-[#8fd3f4] hover:from-[#95dfae] hover:via-[#a9f1e3] hover:to-[#88cfed] text-gray-800 font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white/30 rounded-md group-hover:bg-white/40 transition-colors">
                    <Target className="h-4 w-4 text-gray-700" />
                  </div>
                  <span>Suggest a Life Area</span>
                </div>
              </Button>
            </div>
            
            <p className="text-black dark:text-white text-sm mb-4">
              Sometimes it's easier to start with how you're feeling or what's blocking you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/feelings'}
                className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Feelings
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/barriers'}
                className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Barriers
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/complex_loops'}
                className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Complex Loops
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/identities'}
                className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Identity
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Suggest Life Area Modal */}
      <SuggestContentModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        contentType="task"
      />
    </div>
  )
} 