'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, User, Users, Home, Briefcase, Brain, Globe, HeartHandshake, GraduationCap, Baby, UserCog, UserMinus, Building, Lightbulb, Award, HeartPulse, UserX, Rainbow, UserPlus, Target, Sparkles, BanknoteX, ClipboardPlus, Flame, Fingerprint, MousePointerClick } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SuggestContentModal } from '@/components/ui/SuggestContentModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useIsMobile } from '@/hooks/use-mobile'
import FixedBottomActions from '@/components/ui/FixedBottomActions'
import React from 'react'

// Identity data with icons - Brain first, Sparkles last, no duplicates
const identities = [
  // Health & Neurodivergence (Brain first as requested)
  { name: 'The Neurodivergent Adult', category: 'Health & Neurodivergence', icon: Brain },
  { name: 'The Recently Diagnosed', category: 'Health & Neurodivergence', icon: ClipboardPlus },
  { name: 'The AuDHD Individual', category: 'Health & Neurodivergence', icon: Fingerprint },
  { name: 'The Sick or Chronically Ill', category: 'Health & Neurodivergence', icon: HeartPulse },
  { name: 'The Grieving or Emotionally Raw Individual', category: 'Health & Neurodivergence', icon: UserX },
  
  // Family & Care
  { name: 'The Parent', category: 'Family & Care', icon: Baby },
  { name: 'ADHD Identity Guide: The Parent of a Child with ADHD', category: 'Family & Care', icon: UserCog },
  { name: 'The Overly Responsible Sibling', category: 'Family & Care', icon: UserPlus },
  { name: 'The Solo Household Manager', category: 'Family & Care', icon: Home },
  { name: 'The Caretaker', category: 'Family & Care', icon: HeartHandshake },
  
  // Work & Career
  { name: 'The Job Seeker', category: 'Work & Career', icon: Building },
  { name: 'The Burned Out Professional', category: 'Work & Career', icon: Flame },
  { name: 'The Working Multiple Jobs', category: 'Work & Career', icon: Briefcase },
  { name: 'The Entrepreneur', category: 'Work & Career', icon: Lightbulb },
  { name: 'The Breadwinner', category: 'Work & Career', icon: Award },
  
  // Identity & Community
  { name: 'ADHD Identity Guide: Queer & Trans', category: 'Identity & Community', icon: Rainbow },
  { name: 'The Immigrant', category: 'Identity & Community', icon: Globe },
  { name: 'The Individual Without a Support System', category: 'Identity & Community', icon: UserMinus },
  { name: 'The Low-Income Individual', category: 'Identity & Community', icon: BanknoteX },
  { name: 'The BIPOC Individual', category: 'Identity & Community', icon: Users },
  
  // Learning & Creative
  { name: 'The Student', category: 'Learning & Creative', icon: GraduationCap },
  
  // Recovery & Growth
  { name: 'ADHD Identity Guide: The Recovering Perfectionist', category: 'Recovery & Growth', icon: Target },
  
  // Creative (Sparkles last as requested)
  { name: 'The Creative', category: 'Learning & Creative', icon: Sparkles }
]

const categories = [
  { name: 'Health & Neurodivergence', color: 'from-purple-400 to-violet-500', count: 5 },
  { name: 'Family & Care', color: 'from-pink-400 to-rose-500', count: 5 },
  { name: 'Work & Career', color: 'from-blue-400 to-indigo-500', count: 5 },
  { name: 'Identity & Community', color: 'from-green-400 to-teal-500', count: 5 },
  { name: 'Learning & Creative', color: 'from-yellow-400 to-orange-500', count: 2 },
  { name: 'Recovery & Growth', color: 'from-red-400 to-pink-500', count: 1 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 23 }
]

export default function IdentitiesPage() {
  const [selectedIdentity, setSelectedIdentity] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Health & Neurodivergence')
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
  const isMobile = useIsMobile()

  // Read category from URL parameter on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryFromUrl = urlParams.get('category')
    if (categoryFromUrl) {
      const decodedCategory = decodeURIComponent(categoryFromUrl)
      // Check if the decoded category matches any of our known categories exactly
      const categories = ['Health & Neurodivergence', 'Family & Care', 'Work & Career', 'Identity & Community', 'Learning & Creative', 'Recovery & Growth', 'View All']
      const matchingCategory = categories.find(cat => cat === decodedCategory)
      if (matchingCategory) {
        setSelectedCategory(decodedCategory)
      }
    }
  }, [])

  const handleIdentitySelect = (identity: string) => {
    setSelectedIdentity(identity)
    
    // Create URL slug mapping to match our individual page URL mappings
    const createUrlSlug = (name: string): string => {
      // Special handling for our identity names to match the URL mapping in the individual page
      const nameMapping: Record<string, string> = {
        'The Recently Diagnosed': 'the-newly-diagnosed',
        'The AuDHD Individual': 'the-audhd-individual',
        'The Breadwinner': 'the-breadwinner',
        'The Burned Out Professional': 'the-burned-out-professional',
        'The Creative': 'the-creative',
        'The Entrepreneur': 'the-entrepreneur',
        'The Immigrant': 'the-immigrant',
        'The Job Seeker': 'the-job-seeker',
        'The Low-Income Individual': 'the-low-income-individual',
        'The Neurodivergent Adult': 'the-neurodivergent-adult',
        'The Individual Without a Support System': 'the-individual-without-a-support-system',
        'The Overly Responsible Sibling': 'the-overly-responsible-sibling',
        'The Parent': 'the-parent',
        'ADHD Identity Guide: The Parent of a Child with ADHD': 'the-parent-of-an-adhd-child',
        'ADHD Identity Guide: Queer & Trans': 'queer_or_trans',
        'ADHD Identity Guide: The Recovering Perfectionist': 'the-recovering-perfectionist',
        'The Sick or Chronically Ill': 'the-sick-or-chronically-ill-adult',
        'The Solo Household Manager': 'the-solo-household-manager',
        'The Student': 'the-student',
        'The Working Multiple Jobs': 'the-working-multiple-jobs-individual',
        'The Grieving or Emotionally Raw Individual': 'the-grieving',
        'The BIPOC Individual': 'the-bipoc-individual',
        'The Caretaker': 'the-caretaker'
      }
      
      return nameMapping[name] || name.toLowerCase().replace(/\s+/g, '-')
    }
    
    // Navigate to individual identity page with category parameter
    const identitySlug = createUrlSlug(identity)
    const categoryParam = selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ''
    window.location.href = `/identities/${identitySlug}${categoryParam}`
  }

  const goBack = () => {
    window.location.href = '/'
  }

  // Filter identities by selected category
  const filteredIdentities = selectedCategory === 'View All'
    ? [...identities].sort((a, b) => {
        // Sort by the simplified display names, not the full database names
        const displayNameA = a.name.replace(/^(The |ADHD Identity Guide: The |ADHD Identity Guide: )/, '')
        const displayNameB = b.name.replace(/^(The |ADHD Identity Guide: The |ADHD Identity Guide: )/, '')
        return displayNameA.localeCompare(displayNameB)
      })
    : selectedCategory
    ? identities.filter(identity => identity.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen relative">
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
                Life Context & Identity
              </h1>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black dark:text-white text-center mb-6 flex items-center justify-center gap-2">
            <MousePointerClick className="h-5 w-5" />
            Choose an identity type:
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
                          {category.name === 'Student & Learning' ? '🎓' :
                           category.name === 'Work & Career' ? '💼' :
                           category.name === 'Parent & Family' ? '👨‍👩‍👧‍👦' :
                           category.name === 'Creative & Artist' ? '🎨' :
                           category.name === 'Health & Wellness' ? '💪' :
                           category.name === 'Social & Relationships' ? '🤝' :
                           category.name === 'Entrepreneur & Business' ? '🚀' :
                           category.name === 'View All' ? '👀' : '🆔'}
                        </span>
                        <span className={`font-medium text-base ${category.name === 'View All' ? 'text-gray-600' : ''}`}>
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm text-black/60 dark:text-white/60 flex-shrink-0 ml-4">
                        {category.count} {category.count === 1 ? 'identity' : 'identities'}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
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
                    
                    <h3 className={`text-sm font-medium text-black dark:text-white text-center mb-1
                                  ${selectedCategory === category.name ? 'font-semibold' : ''}`}>
                      {category.name}
                    </h3>
                    <p className={`text-xs text-black/70 dark:text-white/70 text-center
                                  ${selectedCategory === category.name ? 'text-black/90 dark:text-white/90' : ''}`}>
                      {category.count} identities
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Category Identities */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white text-center mb-8">
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
                    <h3 className="text-sm font-medium text-black dark:text-white text-center transition-all duration-300">
                      {identity.name.replace(/^(The |ADHD Identity Guide: The |ADHD Identity Guide: )/, '')}
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
              Looking for a different approach?
            </h3>
            
            {/* Suggest an Identity Button */}
            <div className="mb-4 flex justify-center">
              <Button
                onClick={() => setIsSuggestModalOpen(true)}
                className="group relative px-4 py-2 bg-gradient-to-r from-[#78c2f2] via-[#b39ddb] to-[#e1d5f9] hover:from-[#71bbeb] hover:via-[#ac96d4] hover:to-[#dacef2] text-gray-800 font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white/30 rounded-md group-hover:bg-white/40 transition-colors">
                    <User className="h-4 w-4 text-gray-700" />
                  </div>
                  <span>Suggest an Identity</span>
                </div>
              </Button>
            </div>
            
            <p className="text-black dark:text-white text-sm mb-4">
              Your identity and life context shape your ADHD experience. Try other pathways to find what you need.
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
                onClick={() => window.location.href = '/life_areas'}
                className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Life Areas
              </Button>
              <Button 
                variant="ghost"
                size="default"
                onClick={() => window.location.href = '/complex_loops'}
                className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 text-black dark:text-white border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
              >
                Browse by Complex Loops
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Suggest Identity Modal */}
      <SuggestContentModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        contentType="identity"
      />

      {/* Fixed Bottom Actions with Crisis Mode */}
      <FixedBottomActions
        slug="identities-category"
        pageType="identity"
      />
    </div>
  )
}
