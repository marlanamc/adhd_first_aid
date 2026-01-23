'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { getStrategies } from '@/lib/strategies'
// import { getAllGuides, type GuideMetadata } from '@/lib/markdown'

// Hardcoded guide mappings for now (we can make this dynamic later)
interface GuideMapping {
  title: string
  slug: string
  emoji: string
  description: string
}

const FEELING_GUIDE_MAPPINGS: Record<string, GuideMapping> = {
  'overwhelmed': {
    title: 'Cognitive & Overload Guide',
    slug: 'mentalfog',
    emoji: '😶‍🌫️',
    description: 'Navigate mental fog and overwhelm with practical ADHD-friendly strategies'
  }
}

export default function FeelingIssuePage({ params }: { params: Promise<{ feeling: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const feeling = decodeURIComponent(resolvedParams.feeling)
  
  const [issues, setIssues] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [availableGuide, setAvailableGuide] = useState<GuideMapping | null>(null)

  // Fetch strategies and extract available issues
  useEffect(() => {
    async function fetchStrategiesAndIssues() {
      try {
        setLoading(true)
        const data = await getStrategies({ feelings: [feeling] })

        // Extract unique issues from strategies
        const availableIssues = Array.from(new Set(
          data.flatMap(strategy => {
            if (Array.isArray(strategy.strategy_issues)) {
              return strategy.strategy_issues
                .map(si => si.issue?.name)
                .filter((name): name is string => !!name)
            }
            if (strategy.issue) {
              if (Array.isArray(strategy.issue)) {
                return strategy.issue
              }
              return strategy.issue.split(',').map(i => i.trim())
            }
            return []
          })
        ))
        setIssues(availableIssues)

        // Check if there's a guide for this feeling
        const feelingKey = feeling.toLowerCase().trim()
        console.log('Raw feeling from URL:', feeling)
        console.log('Processed feeling key:', feelingKey)
        console.log('Available mappings:', Object.keys(FEELING_GUIDE_MAPPINGS))
        
        // Try multiple variations
        let matchedGuide = null
        
        // Direct match
        if (FEELING_GUIDE_MAPPINGS[feelingKey as keyof typeof FEELING_GUIDE_MAPPINGS]) {
          matchedGuide = FEELING_GUIDE_MAPPINGS[feelingKey as keyof typeof FEELING_GUIDE_MAPPINGS]
          console.log('Direct match found')
        }
        // Check if feeling contains "overwhelmed"
        else if (feelingKey.includes('overwhelmed') || feelingKey.includes('overwhelm')) {
          matchedGuide = FEELING_GUIDE_MAPPINGS['overwhelmed']
          console.log('Substring match found for overwhelmed')
        }
        
        if (matchedGuide) {
          console.log('Found matching guide:', matchedGuide)
          setAvailableGuide(matchedGuide)
        } else {
          console.log('No guide found for feeling:', feelingKey)
          setAvailableGuide(null)
        }
      } catch (err) {
        console.error('Error fetching strategies:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStrategiesAndIssues()
  }, [feeling])

  const handleIssueSelect = (issue: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(`/feeling/${encodeURIComponent(feeling)}/issue/${encodeURIComponent(issue)}`)
    }, 300)
  }

  const goBack = () => {
    // Go back to strategies page if that's where user came from, otherwise home
    const referrer = document.referrer
    if (referrer && referrer.includes('/strategies')) {
      router.push('/')
    } else {
      router.back() // Use browser back for better UX
    }
  }

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToPage = (page: string) => {
    router.push(`/${page}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen ocean-gradient relative flex flex-col">
        <Header 
          navigateHome={navigateHome} 
          navigateToPage={navigateToPage} 
          onSearchOpen={() => {}} 
        />
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="rounded-full h-12 w-12 border-b-2 border-primary" aria-hidden="true" />
          <span className="sr-only">Finding what's weighing on you</span>
          <p className="mt-4 text-muted-foreground">Finding what's weighing on you...</p>
        </main></div>
    )
  }

  return (
    <div className="min-h-screen ocean-gradient relative flex flex-col">
      <Header 
        navigateHome={navigateHome} 
        navigateToPage={navigateToPage} 
        onSearchOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-4 md:pt-6 pb-24">
          {/* Navigation */}
          <div className="mb-12 mt-10">
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <button
                onClick={goBack}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light inline-flex items-center cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="font-light">Feeling</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-primary font-strong">Issue</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-light">Barrier</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-light">Strategies</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`mobile-transition px-4 md:px-6 ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="text-center mb-6">
              <h3 className="text-base sm:text-lg font-serif text-muted-foreground mb-1 md:mb-2 leading-relaxed">
                You&apos;re feeling <span className="font-semibold">{feeling.split(',').join(', ').toLowerCase()}</span>
              </h3>
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-foreground mb-3 md:mb-4 leading-relaxed">
                What specific issue are you facing right now?
              </h2>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
                {issues.map((issue, index) => (
                  <Button
                    key={issue}
                    variant="ghost"
                    size="default"
                    onClick={() => handleIssueSelect(issue)}
                    className="feeling-button h-auto py-3 sm:py-4 px-4 sm:px-6 text-sm font-light rounded-full mobile-transition mobile-button-large inline-flex items-center justify-center whitespace-nowrap text-muted-foreground hover:text-foreground"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      transform: isTransitioning ? 'translateY(-20px)' : 'translateY(0)',
                      opacity: isTransitioning ? 0 : 1
                    }}
                  >
                    <span className="text-center leading-tight">{issue}</span>
                  </Button>
                ))}
              </div>

              {/* Read More Guide Button */}
              {availableGuide && (
                <>
                  {console.log('Rendering guide button for:', availableGuide)}
                <div className="mt-8 text-center">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium text-foreground">Need More Support?</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Read our comprehensive guide about {feeling.toLowerCase()} with practical strategies and insights.
                    </p>
                    <Button
                      onClick={() => router.push(`/guides/${availableGuide.slug}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all duration-200"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read: {availableGuide.title}
                    </Button>
                  </div>
                </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main></div>
  )
}
