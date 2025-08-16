import { useState } from 'react'
import { MessageSquareText, HeartCrack, Brain, Settings, BookOpen, ArrowRight, Wrench, User, HelpCircle, AlertCircle, RotateCcw, FileText, MessageCircle, Puzzle, ExternalLink } from 'lucide-react'

interface Feeling {
  id: string
  name: string
  emoji: string | null
  color: string | null
  category: string | null
  hover_description: string | null
}

interface Task {
  id: string
  name: string
  emoji: string | null
  color: string | null
  category: string | null
  hover_description: string | null
}

interface NewHomePageProps {
  // Simplified props - no database dependencies for now
  isTransitioning: boolean
  selectedCard?: string | null
}

// Top Row - Core Entry Points
const topCategories = [
  {
    id: 'feelings',
    title: 'Feeling off?',
    subtitle: 'Browse emotion-first tools',
    icon: HeartCrack,
    color: 'bg-gradient-to-br from-[#fca3b7] via-[#fbc2eb] to-[#fbd786] dark:from-[#8B7355] dark:via-[#7A6B52] dark:to-[#7A6752]',
    examples: ['Overwhelmed', 'Ashamed', 'Stuck']
  },
  {
    id: 'barriers',
    title: 'Something holding you back?',
    subtitle: 'Find barrier-specific solutions',
    icon: AlertCircle,
    color: 'bg-gradient-to-br from-[#fbd786] via-[#fff5db] to-[#c0f5a3] dark:from-[#7A6752] dark:via-[#6B7A52] dark:to-[#5B7A52]',
    examples: ['Can\'t start', 'Too big', 'Feel shame']
  },
  {
    id: 'tasks',
    title: 'What do you need help with?',
    subtitle: 'Get specific guidance',
    icon: Wrench,
    color: 'bg-gradient-to-br from-[#9ee5b5] via-[#b0f4ea] to-[#8fd3f4] dark:from-[#5B7A52] dark:via-[#527A7A] dark:to-[#526B7A]',
    examples: ['Cleaning', 'Friendships', 'Cooking']
  },
  {
    id: 'complex_loops',
    title: 'Stuck in a loop?',
    subtitle: 'Break free from repetitive ADHD spirals',
    icon: RotateCcw,
    color: 'bg-gradient-to-br from-[#b0f4ea] via-[#78c2f2] to-[#a18cd1] dark:from-[#526B7A] dark:via-[#52637A] dark:to-[#63527A]',
    examples: ['Phone Scrolling', 'Chronic Lateness']
  },
  {
    id: 'identities',
    title: 'How can you be supported?',
    subtitle: 'Explore identity-specific support',
    icon: User,
    color: 'bg-gradient-to-br from-[#78c2f2] via-[#b39ddb] to-[#e1d5f9] dark:from-[#63527A] dark:via-[#6B527A] dark:to-[#7A527A]',
    examples: ['Parent', 'Student', 'Caregiver']
  }
]

// Middle - Systems Lab
const systemsCategory = {
  id: 'systems',
  title: 'Systems Lab',
  subtitle: 'Build ADHD-friendly routines that actually work',
  icon: Settings,
  color: 'bg-[linear-gradient(135deg,_#fbc2eb,_#fbd786,_#fbc687,_#fff5db,_#d4fc79,_#b0f4ea,_#8fd3f4,_#78c2f2,_#a18cd1,_#b19cd9,_#dec6f7)] dark:bg-[linear-gradient(135deg,_#4A2D4A,_#4A3D2D,_#4A362D,_#3D4A2D,_#2D4A2D,_#2D4A4A,_#2D3D4A,_#2D354A,_#362D4A,_#3D2D4A,_#4A2D4A)]',
  examples: ['Morning Routine', 'Post-Crash Reset', '7AM Workout']
}

// Bottom Row - Support & Tools
const bottomCategories = [
  {
    id: 'guides',
    title: 'Read Guides & Insights',
    subtitle: 'Guides and insights on ADHD struggles',
    icon: FileText,
    color: 'bg-[#CAE5FF] dark:bg-slate-700',
    examples: ['Habit Stacking', 'Diagnostic Guide', 'Types of Support']
  },
  {
    id: 'scripts',
    title: 'Scripts for Hard Moments',
    subtitle: 'Prewritten things to say or send when words fail',
    icon: MessageCircle,
    color: 'bg-[#E8D7FF] dark:bg-slate-600',
    examples: ['Ask for ADHD evaluation', 'Tell partner what you need', 'Workplace accommodations']
  },
  {
    id: 'quizzes',
    title: 'Quizzes & Tools',
    subtitle: 'Interactive experiences and tools',
    icon: Puzzle,
    color: 'bg-[#E0F5CE] dark:bg-slate-800',
    examples: ['Structure Quiz', 'Sleep Calculator', 'Time Blindness']
  },
  {
    id: 'resources',
    title: 'Resources & Links',
    subtitle: 'External support materials',
    icon: ExternalLink,
    color: 'bg-[#FFD4DB] dark:bg-slate-500',
    examples: ['Podcasts', 'Books', 'Terms']
  }
]

export default function NewHomePage({
  isTransitioning,
  selectedCard
}: NewHomePageProps) {
  const [localSelectedCard, setLocalSelectedCard] = useState<string | null>(null)

  const handleCardClick = (categoryId: string) => {
    setLocalSelectedCard(categoryId)
    
    switch (categoryId) {
      case 'feelings':
        // Navigate to feelings selector page
        window.location.href = '/feelings'
        break
      case 'tasks':
        // Navigate to tasks selector page  
        window.location.href = '/life_areas'
        break
      case 'identities':
        // Navigate to identities selector page
        window.location.href = '/identities'
        break
      case 'barriers':
        // Navigate to barriers selector page
        window.location.href = '/barriers'
        break
      case 'complex_loops':
        // Navigate to complex loops selector page
        window.location.href = '/complex_loops'
        break
      case 'systems':
        window.location.href = '/systems'
        break
      case 'guides':
        window.location.href = '/guides'
        break
      case 'scripts':
        window.location.href = '/scripts'
        break
      case 'quizzes':
        window.location.href = '/quizzes'
        break
      case 'resources':
        window.location.href = '/resources'
        break
    }
  }

  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours()
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
    const emoji = hour < 12 ? '☀️' : hour < 17 ? '🌤️' : '🌙'
    
    return `Good ${timeOfDay}. ${emoji}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 flex flex-col items-center justify-center p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4 mt-12 md:mt-20">
        <h1 className="text-lg md:text-xl lg:text-2xl font-light text-gray-800 dark:text-gray-200">
          {getPersonalizedGreeting()}
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-gray-900 dark:text-blue-300 homepage-main-heading px-4 md:px-0">
          Where do you want to start?
        </h2>
      </div>

      {/* Main Cards - 3 Section Layout */}
      <div className="max-w-6xl w-full space-y-8 md:space-y-12 relative">
        
        {/* Top Row - Core Entry Points */}
        <div className="space-y-4 md:space-y-6 relative">
          {/* Subtle separator shadow - hidden on mobile */}
          <div className="hidden md:block absolute -bottom-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-30"></div>
          
          {/* Mobile: Full-width stacked cards, Desktop: Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-3 items-stretch">
          {topCategories.map((category) => {
            const IconComponent = category.icon
            
            return (
              <div
                key={category.id}
                onClick={() => handleCardClick(category.id)}
                className={`
                  relative group cursor-pointer transform transition-all duration-300 ease-out touch-manipulation
                  md:hover:-translate-y-1 md:hover:shadow-lg
                  ${localSelectedCard === category.id ? 'md:-translate-y-1 shadow-lg' : ''}
                  ${isTransitioning ? 'pointer-events-none' : ''}
                  md:hover:z-10 active:scale-[0.98] md:active:scale-95
                `}
                style={{
                  transformOrigin: 'center center',
                }}
              >
                <div 
                  className={`
                    relative overflow-hidden rounded-2xl md:rounded-[1.5rem] p-5 md:p-4
                    ${category.color}
                    transition-all duration-300 ease-out
                    h-[12rem] sm:h-[13rem] md:h-[15rem] lg:h-[16rem]
                    flex flex-col justify-between
                    group-hover:shadow-xl
                    after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/5 after:to-transparent
                  `}
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile: Horizontal layout, Desktop: Vertical layout */}
                    <div className="flex md:flex-col h-full">
                      {/* Icon */}
                      <div className="flex-shrink-0 mr-4 md:mr-0 md:mb-3 md:flex md:justify-center">
                        <div className="w-14 h-14 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-white/30">
                          <IconComponent className="w-7 h-7 md:w-6 md:h-6 text-black transition-all duration-300" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col md:text-center">
                        {/* Title */}
                        <h3 className="text-lg md:text-base font-bold text-black transition-all duration-300 md:group-hover:text-lg leading-tight mb-2 md:mb-3 md:h-[3rem] md:flex md:items-start md:justify-center">
                          {category.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-black/80 text-sm leading-relaxed transition-all duration-300 group-hover:text-black font-medium mb-3 md:mb-4 md:h-12">
                          {category.subtitle}
                        </p>
                        
                        {/* Examples - Show all on mobile, 2 on desktop */}
                        <div className="flex flex-wrap gap-1.5 md:justify-center">
                          {category.examples.map((example, index) => (
                            <span
                              key={index}
                              className={`
                                bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1.5 md:px-2 md:py-1 text-xs text-black
                                transition-all duration-300 ease-out
                                group-hover:bg-white/30 leading-none font-medium
                                ${index > 1 ? 'md:hidden' : ''}
                              `}
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-3 right-3 md:bottom-2 md:right-2">
                      <ArrowRight className="w-4 h-4 md:w-3.5 md:h-3.5 text-black/60 md:text-black transition-all duration-300 ease-out group-hover:translate-x-1" />
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
          </div>
        </div>

        {/* Middle - Systems Lab (Subtle) */}
        <div className="flex justify-center relative px-0 md:px-0">
          {/* Subtle separator shadow - hidden on mobile */}
          <div className="hidden md:block absolute -bottom-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-30"></div>
          <div
            onClick={() => handleCardClick(systemsCategory.id)}
            className={`
              relative group cursor-pointer transform transition-all duration-300 ease-out touch-manipulation
              md:hover:scale-[1.01] md:hover:shadow-md
              ${localSelectedCard === systemsCategory.id ? 'md:scale-[1.01] shadow-md' : ''}
              ${isTransitioning ? 'pointer-events-none' : ''}
              active:scale-[0.98] md:active:scale-95 max-w-2xl w-full
            `}
          >
            <div 
              className={`
                relative overflow-hidden rounded-2xl md:rounded-xl p-5 md:p-4 border border-gray-200/30 dark:border-gray-700/30
                bg-gradient-to-r from-gray-50/80 via-white/60 to-gray-50/80 
                dark:from-gray-800/80 dark:via-gray-700/60 dark:to-gray-800/80
                backdrop-blur-sm
                transition-all duration-300 ease-out
                h-[4.5rem] md:h-[3.5rem] lg:h-[4rem]
                flex items-center
                group-hover:border-gray-300/40 dark:group-hover:border-gray-600/40
                group-hover:shadow-lg
              `}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  {/* Smaller, more subtle icon */}
                  <div className="transition-all duration-300 ease-out">
                    <div className="w-8 h-8 bg-gray-100/60 dark:bg-gray-600/60 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-gray-200/60 dark:group-hover:bg-gray-500/60">
                      <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300 transition-all duration-300" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base md:text-sm font-bold text-gray-700 dark:text-gray-300 transition-all duration-300 mb-0.5">
                      {systemsCategory.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-xs transition-all duration-300 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                      Combine strategies from above into routines
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Visual hint that it combines the above */}
                  <div className="flex -space-x-1">
                    <div className="w-2 h-2 bg-[#fbc687]/60 rounded-full"></div>
                    <div className="w-2 h-2 bg-[#d4fc79]/60 rounded-full"></div>
                    <div className="w-2 h-2 bg-[#8fd3f4]/60 rounded-full"></div>
                    <div className="w-2 h-2 bg-[#a18cd1]/60 rounded-full"></div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Support & Tools */}
        <div className="space-y-4 md:space-y-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium">
              More tools to support your journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-stretch max-w-4xl mx-auto">
          {bottomCategories.map((category) => {
            const IconComponent = category.icon
            
            return (
              <div
                key={category.id}
                onClick={() => handleCardClick(category.id)}
                className={`
                  relative group cursor-pointer transform transition-all duration-300 ease-out touch-manipulation
                  md:hover:scale-[1.02] md:hover:shadow-md
                  ${localSelectedCard === category.id ? 'md:scale-[1.02] shadow-md' : ''}
                  ${isTransitioning ? 'pointer-events-none' : ''}
                  active:scale-[0.98] md:active:scale-95
                `}
                style={{
                  transformOrigin: 'center center',
                }}
              >
                <div 
                  className={`
                    relative overflow-hidden rounded-2xl md:rounded-lg p-4 md:p-3 border-2 border-gray-200/50 dark:border-gray-700/50
                    ${category.color}
                    transition-all duration-300 ease-out
                    h-[10rem] md:h-[9rem] lg:h-[9.5rem]
                    flex flex-col
                    group-hover:border-gray-300/60 dark:group-hover:border-gray-600/60
                    group-hover:shadow-lg
                    backdrop-blur-sm
                  `}
                >
                  {/* Header with icon and title */}
                  <div className="flex items-start gap-3 mb-3 md:mb-2">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-8 md:h-8 bg-black/10 dark:bg-white/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 md:w-4 md:h-4 text-black dark:text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-base font-semibold text-black dark:text-white leading-tight">
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex-1 mb-3 md:mb-2">
                    <p className="text-black/70 dark:text-white/70 text-sm leading-relaxed md:leading-snug font-medium">
                      {category.subtitle}
                    </p>
                  </div>
                  
                  {/* Bottom section with examples and arrow */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex gap-1.5 flex-wrap">
                      {category.examples.map((example, index) => (
                        <span
                          key={index}
                          className={`
                            inline-block bg-black/10 dark:bg-white/10 rounded-md px-2 py-1 text-xs text-black dark:text-white font-medium
                            ${index > 2 ? 'md:hidden' : ''}
                          `}
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="w-4 h-4 text-black/60 dark:text-white/60 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-black dark:group-hover:text-white ml-2 flex-shrink-0" />
                  </div>

                </div>
              </div>
            )
          })}
          </div>
        </div>
      </div>


      {/* Loading State */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {selectedCard === 'feelings' && 'Gathering your emotional support toolkit...'}
              {selectedCard === 'barriers' && 'Loading your obstacle-busting strategies...'}
              {selectedCard === 'tasks' && 'Finding support for this part of your life...'}
              {selectedCard === 'identities' && 'Finding strategies that fit your life...'}
              {selectedCard === 'complex_loops' && 'Breaking down your patterns with ADHD insights...'}
              {selectedCard === 'systems' && 'Building your personalized ADHD system...'}
              {selectedCard === 'guides' && 'Collecting your step-by-step helpers...'}
              {selectedCard === 'scripts' && 'Gathering your conversation lifelines...'}
              {selectedCard === 'quizzes' && 'Getting your self-discovery tools ready...'}
              {selectedCard === 'resources' && 'Gathering your ADHD learning library...'}
              {!selectedCard && 'Getting your ADHD toolkit ready...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}