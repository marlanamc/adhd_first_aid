'use client'

import { useState } from 'react'
import { ArrowLeft, User, Users, Home, Briefcase, Brain, Heart, Globe, Palette, Coins, ArrowUpRight, School, HeartHandshake, Building2, Zap, GraduationCap, Brush } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

// Identity data with icons
const identities = [
  // Family & Care
  { name: 'Caregiver', category: 'Family & Care', icon: HeartHandshake },
  { name: 'Parent', category: 'Family & Care', icon: Users },
  { name: 'Over-responsible Sibling', category: 'Family & Care', icon: Users },
  { name: 'Solo Household Manager', category: 'Family & Care', icon: Home },
  
  // Work & Career
  { name: 'Job Seeker', category: 'Work & Career', icon: ArrowUpRight },
  { name: 'Burned Out Professional', category: 'Work & Career', icon: Building2 },
  { name: 'Working Multiple Jobs', category: 'Work & Career', icon: Zap },
  { name: 'Entrepreneur', category: 'Work & Career', icon: Briefcase },
  { name: 'Breadwinner', category: 'Work & Career', icon: Coins },
  
  // Health & Neurodivergence  
  { name: 'Neurodivergent Adult', category: 'Health & Neurodivergence', icon: Brain },
  { name: 'Newly Diagnosed ADHD', category: 'Health & Neurodivergence', icon: Brain },
  { name: 'Sick or Chronically Ill', category: 'Health & Neurodivergence', icon: Heart },
  { name: 'Grieving or Emotionally Raw', category: 'Health & Neurodivergence', icon: Heart },
  
  // Identity & Community
  { name: 'Queer or Trans in Unsupportive Environment', category: 'Identity & Community', icon: User },
  { name: 'Immigrant or English Language Learner', category: 'Identity & Community', icon: Globe },
  { name: 'No Support System', category: 'Identity & Community', icon: Users },
  
  // Learning & Creative
  { name: 'Student', category: 'Learning & Creative', icon: GraduationCap },
  { name: 'Creative with Executive Dysfunction', category: 'Learning & Creative', icon: Brush },
  
  // Financial & Recovery
  { name: 'Low-Income / Financially Stretched', category: 'Financial & Recovery', icon: Coins },
  { name: 'Recovering Perfectionist', category: 'Financial & Recovery', icon: ArrowUpRight }
]

const categories = [
  { name: 'Family & Care', color: 'from-pink-400 to-rose-500', count: 4 },
  { name: 'Work & Career', color: 'from-blue-400 to-indigo-500', count: 5 },
  { name: 'Health & Neurodivergence', color: 'from-purple-400 to-violet-500', count: 4 },
  { name: 'Identity & Community', color: 'from-green-400 to-teal-500', count: 3 },
  { name: 'Learning & Creative', color: 'from-yellow-400 to-orange-500', count: 2 },
  { name: 'Financial & Recovery', color: 'from-red-400 to-pink-500', count: 2 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 20 }
]

export default function IdentitiesPage() {
  const [selectedIdentity, setSelectedIdentity] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Family & Care')

  const handleIdentitySelect = (identity: string) => {
    setSelectedIdentity(identity)
    // Navigate to individual identity page
    window.location.href = `/identities/${encodeURIComponent(identity.toLowerCase().replace(/\s+/g, '-'))}`
  }

  const goBack = () => {
    window.history.back()
  }

  // Filter identities by selected category
  const filteredIdentities = selectedCategory === 'View All'
    ? [...identities].sort((a, b) => a.name.localeCompare(b.name))
    : selectedCategory 
    ? identities.filter(identity => identity.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8fd3f4] via-[#a18cd1] to-[#b19cd9] relative">
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
                Life Context & Identity
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black text-center mb-6">Choose an identity type:</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    {category.count} identities
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Category Identities */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-black text-center mb-8">
              {selectedCategory === 'View All' ? 'All Identities' : selectedCategory}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredIdentities.map((identity) => (
                <div
                  key={identity.name}
                  onClick={() => handleIdentitySelect(identity.name)}
                  className={`
                    group cursor-pointer transform transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1
                    ${selectedIdentity === identity.name ? 'scale-105 -translate-y-1' : ''}
                  `}
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 
                                shadow-lg hover:shadow-xl transition-all duration-300
                                group-hover:bg-white/30
                                h-32 flex flex-col justify-center items-center
                                border border-white/10">
                    
                    {/* Icon */}
                    <div className="text-2xl mb-1 transition-all duration-300 group-hover:scale-110">
                      {React.createElement(identity.icon, {
                        size: 24,
                        className: "text-black dark:text-white"
                      })}
                    </div>
                    
                    {/* Identity Name */}
                    <h3 className="text-sm font-medium text-black text-center transition-all duration-300">
                      {identity.name}
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
              Looking for a different approach?
            </h3>
            <p className="text-black text-sm mb-4">
              Your identity and life context shape your ADHD experience. Try other pathways to find what you need.
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
                onClick={() => window.location.href = '/tasks'}
                className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm"
              >
                Browse by Tasks
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/barriers'}
                className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm"
              >
                Browse by Barriers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}