'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ArrowLeft, BookOpen, Headphones, Globe, User, ExternalLink, Search } from 'lucide-react'

// ADHD terminology and definitions
const terminology = [
  {
    term: "ADHD",
    definition: "Attention Deficit Hyperactivity Disorder - a neurodevelopmental condition characterized by patterns of inattention, hyperactivity, and impulsivity that interfere with functioning or development.",
    category: "Core Concepts"
  },
  {
    term: "Executive Function",
    definition: "Mental processes that help with planning, initiating, focusing, remembering, and regulating.",
    category: "Core Concepts"
  },
  {
    term: "Task Initiation",
    definition: "The ability to start a task without getting stuck in overwhelm or avoidance.",
    category: "Core Concepts"
  },
  {
    term: "Working Memory",
    definition: "Holding info in your brain while using it (e.g., following steps without forgetting mid-process).",
    category: "Core Concepts"
  },
  {
    term: "Cognitive Flexibility",
    definition: "Switching between tasks or ideas, like adapting when plans change.",
    category: "Core Concepts"
  },
  {
    term: "Emotional Regulation",
    definition: "Managing emotional responses without spiraling or freezing.",
    category: "Core Concepts"
  },
  {
    term: "Inhibition",
    definition: "Resisting distractions or impulses (e.g., 'don't scroll!').",
    category: "Core Concepts"
  },
  {
    term: "Mental Fog",
    definition: "Feeling like your brain is 'buffering,' slow to engage, or hard to direct.",
    category: "Inattentive Challenges"
  },
  {
    term: "Time Blindness",
    definition: "Losing track of time or not feeling the urgency until it's too late.",
    category: "Inattentive Challenges"
  },
  {
    term: "Drift",
    definition: "Zoning out mid-task or forgetting what you were just doing.",
    category: "Inattentive Challenges"
  },
  {
    term: "Task Abandonment",
    definition: "Starting things, then wandering off or losing steam without closure.",
    category: "Inattentive Challenges"
  },
  {
    term: "Activation Deficit",
    definition: "Knowing what you need to do—but physically can't start without external input.",
    category: "Inattentive Challenges"
  },
  {
    term: "Dopamine Seeking",
    definition: "Needing novelty, urgency, or interest to feel 'turned on' mentally.",
    category: "Inattentive Challenges"
  },
  {
    term: "Motor Restlessness",
    definition: "Feeling physically agitated; needing to move, fidget, or engage the body to stay regulated.",
    category: "Hyperactive Challenges"
  },
  {
    term: "Verbal Impulsivity",
    definition: "Speaking quickly or out of turn; interrupting or blurting without intending to.",
    category: "Hyperactive Challenges"
  },
  {
    term: "Sensory Seeking",
    definition: "Craving stimulation through noise, touch, movement, or novelty to stay engaged.",
    category: "Hyperactive Challenges"
  },
  {
    term: "Task Hopping",
    definition: "Jumping rapidly between tasks or activities without finishing.",
    category: "Hyperactive Challenges"
  },
  {
    term: "Emotional Reactivity",
    definition: "Strong, fast emotional responses that feel disproportionate or hard to rein back in.",
    category: "Hyperactive Challenges"
  },
  {
    term: "Burnout Cycles",
    definition: "Surging into projects with intense energy, then crashing into exhaustion or shutdown.",
    category: "Hyperactive Challenges"
  },
  {
    term: "Overcommitting",
    definition: "Saying 'yes' to too many things, driven by excitement or a desire to please, then feeling overwhelmed later.",
    category: "Hyperactive Challenges"
  },
  {
    term: "Rejection Sensitive Dysphoria (RSD)",
    definition: "Extreme emotional pain or panic in response to perceived rejection, criticism, or failure—even if imagined.",
    category: "Emotional & Social"
  },
  {
    term: "Masking",
    definition: "Hiding symptoms, needs, or true feelings to appear 'functional,' 'normal,' or more socially acceptable.",
    category: "Emotional & Social"
  },
  {
    term: "Shame Spiral",
    definition: "Intense self-blame or hopelessness after small mistakes, inconsistency, or perceived failures.",
    category: "Emotional & Social"
  },
  {
    term: "Perfectionism Loop",
    definition: "Getting stuck in avoidance or over-editing because nothing feels 'good enough' to finish.",
    category: "Emotional & Social"
  },
  {
    term: "Emotional Flooding",
    definition: "Feeling overwhelmed by intense emotions that derail focus or motivation.",
    category: "Emotional & Social"
  },
  {
    term: "Social Exhaustion",
    definition: "Fatigue after long periods of masking or people-pleasing, leading to shutdown or isolation.",
    category: "Emotional & Social"
  },
  {
    term: "Sensory Overload",
    definition: "Feeling overwhelmed or agitated by too much noise, light, movement, or sensory input.",
    category: "Cognitive & Sensory"
  },
  {
    term: "Hyperfocus",
    definition: "Becoming intensely absorbed in one task or topic, sometimes losing awareness of time or surroundings.",
    category: "Cognitive & Sensory"
  },
  {
    term: "Analysis Paralysis",
    definition: "Overthinking decisions or steps so much that you become stuck, unable to act or choose.",
    category: "Cognitive & Sensory"
  },
  {
    term: "Thought Ping-Pong",
    definition: "Rapid bouncing between ideas, making it hard to hold onto one train of thought.",
    category: "Cognitive & Sensory"
  },
  {
    term: "Low Frustration Tolerance",
    definition: "Quick to feel irritated or upset when tasks are challenging or progress is blocked.",
    category: "Cognitive & Sensory"
  },
  {
    term: "Body Doubling",
    definition: "Doing a task alongside someone (even silently) to help initiate/focus.",
    category: "Support Tools"
  },
  {
    term: "Externalizing Systems",
    definition: "Using visuals, calendars, alarms to 'offload' memory and mental steps.",
    category: "Support Tools"
  },
  {
    term: "Scaffolding",
    definition: "Adding simple supports (e.g., a checklist or step-by-step plan) to build success.",
    category: "Support Tools"
  },
  {
    term: "Anchoring",
    definition: "Linking a habit to something already in your routine (e.g., 'after coffee…').",
    category: "Support Tools"
  },
  {
    term: "Low-Activation Task",
    definition: "A task that requires almost no setup, pressure, or planning—just motion.",
    category: "Support Tools"
  },
  {
    term: "Nonlinear Progress",
    definition: "Emphasizing that success may look like spirals, not straight lines.",
    category: "Support Tools"
  }
]

const terminologyCategories = ["All", ...Array.from(new Set(terminology.map(item => item.category)))]

// Resource categories
const resourceCategories = [
  {
    id: 'websites',
    title: 'Websites',
    icon: Globe,
    description: 'Helpful websites and online resources',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'books',
    title: 'Books',
    icon: BookOpen,
    description: 'Recommended reading for understanding and managing ADHD',
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'podcasts',
    title: 'Podcasts',
    icon: Headphones,
    description: 'Audio content about ADHD experiences, research, and tips',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'terminology',
    title: 'Terminology',
    icon: User,
    description: 'ADHD-related terms and definitions',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'view-all',
    title: 'View All',
    icon: Globe,
    description: 'All resource types',
    color: 'from-gray-400 to-gray-600'
  }
]

// Sample resources data
const resources = {
  podcasts: [
    {
      id: 1,
      title: 'ADHD Experts Podcast',
      description: 'Deep dives into ADHD research and strategies with leading experts',
      url: 'https://adhdexperts.com/podcast',
      category: 'Educational'
    },
    {
      id: 2,
      title: 'Taking Control: The ADHD Podcast',
      description: 'Practical strategies and tools for managing ADHD in daily life',
      url: 'https://takecontroladhd.com',
      category: 'Practical'
    },
    {
      id: 3,
      title: 'ADHD for Smart Ass Women',
      description: 'Support and strategies specifically for women with ADHD',
      url: 'https://smartasswomen.com',
      category: 'Support'
    }
  ],
  books: [
    {
      id: 1,
      title: 'Driven to Distraction',
      description: 'Classic book on recognizing and coping with ADHD by Edward Hallowell',
      url: 'https://www.amazon.com/Driven-Distraction-Recognizing-Attention-Disorder/dp/0307743152',
      category: 'Understanding ADHD'
    },
    {
      id: 2,
      title: 'The ADHD Advantage',
      description: 'Focuses on the strengths and advantages of having ADHD',
      url: 'https://www.amazon.com/ADHD-Advantage-Thought-Differently-Succeed/dp/1594633525',
      category: 'Strengths-Based'
    },
    {
      id: 3,
      title: 'Women with ADHD',
      description: 'Comprehensive guide addressing ADHD in women and girls',
      url: 'https://www.amazon.com/Women-ADHD-Michelle-Mowbray/dp/1572243937',
      category: 'Women & ADHD'
    }
  ],
  websites: [
    {
      id: 1,
      title: 'CHADD (Children and Adults with ADHD)',
      description: 'National resource for education, advocacy, and support',
      url: 'https://chadd.org',
      category: 'Organizations'
    },
    {
      id: 2,
      title: 'ADDitude Magazine',
      description: 'Online magazine with articles, tips, and resources',
      url: 'https://additudemag.com',
      category: 'Information'
    },
    {
      id: 3,
      title: 'How to ADHD',
      description: 'YouTube channel and website with practical ADHD tips',
      url: 'https://howtoadhd.com',
      category: 'Educational'
    }
  ]
}

export default function ResourcesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('view-all')
  const [searchQuery, setSearchQuery] = useState('')
  const [terminologyFilter, setTerminologyFilter] = useState('All')

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToPage = (page: string) => {
    router.push(`/${page}`)
  }

  const goBack = () => {
    router.back()
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const getCurrentResources = () => {
    if (selectedCategory === 'view-all') {
      return [...resources.websites, ...resources.books, ...resources.podcasts]
        .sort((a, b) => a.title.localeCompare(b.title))
    }
    return resources[selectedCategory as keyof typeof resources] || []
  }

  const filteredResources = getCurrentResources().filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFilteredTerminology = () => {
    let filtered = terminology
    
    if (terminologyFilter !== 'All') {
      filtered = filtered.filter(term => term.category === terminologyFilter)
    } else {
      filtered = [...filtered].sort((a, b) => a.term.localeCompare(b.term))
    }
    
    if (searchQuery) {
      filtered = filtered.filter(term =>
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return filtered
  }

  return (
    <div className="min-h-screen bg-[#FFD4DB] dark:bg-[#4A2D35] relative flex flex-col">
      <Header 
        navigateHome={navigateHome} 
        navigateToPage={navigateToPage} 
        onSearchOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-32 md:pt-36 pb-24">
          {/* Navigation */}
          <div className="mb-12">
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 max-w-xs">
              <button
                onClick={goBack}
                className="text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors duration-300 font-light inline-flex items-center cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="animate-in px-4 md:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-black mb-6 leading-tight">
                Resources
              </h1>
              <p className="text-lg md:text-xl text-black leading-relaxed font-light max-w-3xl mx-auto">
                Helpful links, podcasts, books, and terminology to support your ADHD journey
              </p>
            </div>

            {/* Category Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-black text-center mb-6">Choose a resource type:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {resourceCategories.map((category) => {
                  const isSelected = selectedCategory === category.id
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`
                        group cursor-pointer transform transition-all duration-300 ease-out
                        hover:scale-105 hover:-translate-y-1 text-left
                        ${isSelected ? 'scale-105 -translate-y-1' : ''}
                      `}
                    >
                      <div className={`backdrop-blur-md rounded-2xl p-3 
                                    transition-all duration-300
                                    group-hover:bg-white/30
                                    h-16 flex flex-col justify-center
                                    ${isSelected 
                                      ? 'bg-white/40 ring-2 ring-black/[0.15] dark:ring-white/[0.3]' 
                                      : 'bg-white/10 hover:bg-white/20'}`}>
                        
                        <h3 className={`text-sm font-medium text-black text-center mb-1
                                      ${isSelected ? 'font-semibold' : ''}`}>
                          {category.title}
                        </h3>
                        <p className={`text-xs text-black/70 text-center
                                      ${isSelected ? 'text-black/90' : ''}`}>
                          {category.description.split(' ').slice(0, 3).join(' ')}...
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={selectedCategory === 'terminology' ? "Search terms..." : "Search resources..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                />
              </div>
            </div>

            {/* Terminology Category Filter */}
            {selectedCategory === 'terminology' && (
              <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                  {terminologyCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setTerminologyFilter(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-white/20 ${
                        terminologyFilter === category
                          ? 'bg-primary/20 text-primary border-primary/30'
                          : 'bg-white/60 text-muted-foreground hover:bg-white/80 hover:text-foreground'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resources List */}
            {selectedCategory !== 'terminology' && (
              <div>
                <h2 className="text-2xl font-bold text-black text-center mb-8">
                  {selectedCategory === 'view-all' ? 'All Resources' : resourceCategories.find(cat => cat.id === selectedCategory)?.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource, index) => (
                    <div
                      key={resource.id}
                      className="bg-white/20 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="bg-white/20 text-black px-3 py-1 rounded-full text-sm font-medium">
                          {resource.category}
                        </span>
                        <ExternalLink className="h-5 w-5 text-black/70" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-black mb-3">
                        {resource.title}
                      </h3>
                      
                      <p className="text-black/80 leading-relaxed mb-4 flex-grow">
                        {resource.description}
                      </p>
                      
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-black hover:text-black/80 font-medium transition-colors duration-200"
                      >
                        <span>View Resource</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terminology List */}
            {selectedCategory === 'terminology' && (
              <div>
                <h2 className="text-2xl font-bold text-black text-center mb-8">
                  ADHD Terminology
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredTerminology().map((term, index) => (
                    <div
                      key={term.term}
                      className="bg-white/20 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="bg-white/20 text-black px-3 py-1 rounded-full text-sm font-medium">
                          {term.category}
                        </span>
                        <User className="h-5 w-5 text-black/70" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-black mb-3">
                        {term.term}
                      </h3>
                      
                      <p className="text-black/80 leading-relaxed">
                        {term.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {selectedCategory !== 'terminology' && filteredResources.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No resources found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or explore a different category.
                  </p>
                </div>
              </div>
            )}

            {/* Terminology Empty State */}
            {selectedCategory === 'terminology' && getFilteredTerminology().length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No terms found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or selecting a different category.
                  </p>
                </div>
              </div>
            )}

            {/* Footer Text */}
            <div className="text-center mt-12 max-w-3xl mx-auto">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  Need More Resources?
                </h3>
                <p className="text-black/70 dark:text-white/70 text-sm mb-4">
                  These resources provide evidence-based information and community support for your ADHD journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => setSelectedCategory('websites')}
                    className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Browse Websites
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('books')}
                    className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Find Books
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('podcasts')}
                    className="bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Listen to Podcasts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}