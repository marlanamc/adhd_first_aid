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
    definition: "A set of mental skills including working memory, flexible thinking, and self-control that help us get things done, plan, focus, and juggle multiple tasks.",
    category: "Core Concepts"
  },
  {
    term: "Dopamine",
    definition: "A neurotransmitter that plays a key role in motivation, reward, and attention. ADHD brains often have differences in dopamine processing.",
    category: "Neuroscience"
  },
  {
    term: "Hyperfocus",
    definition: "An intense form of mental concentration or visualization that focuses consciousness on a subject, topic, or task to the exclusion of everything else.",
    category: "Symptoms & Traits"
  },
  {
    term: "Time Blindness",
    definition: "Difficulty accurately estimating how much time has passed or how long tasks will take. Common in ADHD and can affect planning and punctuality.",
    category: "Symptoms & Traits"
  },
  {
    term: "Rejection Sensitive Dysphoria (RSD)",
    definition: "Intense emotional pain triggered by the perception of rejection, criticism, or failure. Often experienced by people with ADHD.",
    category: "Symptoms & Traits"
  },
  {
    term: "Stimming",
    definition: "Self-stimulatory behavior involving repetitive movements or sounds that help with self-regulation, focus, or sensory needs.",
    category: "Behaviors"
  },
  {
    term: "Body Doubling",
    definition: "Working alongside another person (virtually or in person) to help maintain focus and accountability without direct interaction about the task.",
    category: "Strategies"
  },
  {
    term: "Masking",
    definition: "Consciously or unconsciously suppressing natural ADHD behaviors to appear more 'neurotypical' in social or professional settings.",
    category: "Behaviors"
  },
  {
    term: "Task Switching",
    definition: "The ability to move attention from one task or activity to another. People with ADHD often struggle with both switching to new tasks and away from preferred tasks.",
    category: "Core Concepts"
  },
  {
    term: "Dopamine Seeking",
    definition: "The tendency to look for activities, situations, or behaviors that provide a quick dopamine boost, often as a way to self-regulate attention and motivation.",
    category: "Behaviors"
  },
  {
    term: "Analysis Paralysis",
    definition: "Being unable to make decisions or take action due to overthinking or considering too many options at once.",
    category: "Symptoms & Traits"
  },
  {
    term: "ADHD Paralysis",
    definition: "A state where you know what needs to be done but feel unable to start or complete tasks, often due to overwhelm or perfectionism.",
    category: "Symptoms & Traits"
  },
  {
    term: "Interest-Based Nervous System",
    definition: "A concept describing how ADHD brains are motivated more by interest, novelty, urgency, and passion rather than importance alone.",
    category: "Core Concepts"
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