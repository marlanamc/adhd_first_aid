'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, Search, BookOpen, Brain } from 'lucide-react'

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

const categories = ["All", ...Array.from(new Set(terminology.map(item => item.category)))]

export default function TerminologyPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToPage = (page: string) => {
    router.push(`/${page}`)
  }

  const goBack = () => {
    router.back()
  }

  // Filter terminology based on search and category
  const filteredTerminology = terminology.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen ocean-gradient relative flex flex-col">
      <Header 
        navigateHome={navigateHome} 
        navigateToPage={navigateToPage} 
        onSearchOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-12 md:pt-16 pb-24">
          {/* Navigation */}
          <div className="mb-12 mt-10">
            <button
              onClick={goBack}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light inline-flex items-center cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>

          {/* Content */}
          <div className="animate-in px-4 md:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-6 leading-tight">
                ADHD Terminology
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                Understanding the language around ADHD can help you better communicate about your experiences and find the support you need
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-12">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search terms or definitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/80"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/80"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="mb-8">
              <p className="text-muted-foreground text-center">
                Showing {filteredTerminology.length} of {terminology.length} terms
              </p>
            </div>

            {/* Terminology Grid */}
            {filteredTerminology.length > 0 ? (
              <div className="grid gap-6 mb-16">
                {filteredTerminology.map((item, index) => (
                  <div
                    key={item.term}
                    className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl md:text-2xl font-serif text-foreground">
                            {item.term}
                          </h3>
                          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                          {item.definition}
                        </p>
                      </div>
                      <Brain className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-serif text-foreground mb-4">No terms found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or category filter
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                  }}
                  className="px-6 py-3 bg-white/60 hover:bg-white/80 text-foreground rounded-full transition-all duration-200 border border-white/20"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Contribute Section */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary/10 to-purple/10 border border-primary/20 rounded-2xl p-8 md:p-12">
                <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">Missing a Term?</h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-2xl mx-auto">
                  If there&apos;s an ADHD-related term you think should be included in our terminology guide, 
                  we&apos;d love to hear from you!
                </p>
                <button
                  onClick={() => navigateToPage('contact')}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white/60 hover:bg-white/80 text-foreground rounded-full transition-all duration-200 transform hover:scale-105 font-medium border border-white/20"
                >
                  <span>Suggest a Term</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer navigateToPage={navigateToPage} />
    </div>
  )
}