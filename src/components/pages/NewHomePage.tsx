import { useState } from 'react'
import { MessageSquareText, Heart, Brain, Settings, BookOpen, ArrowRight, Wrench, User, HelpCircle, AlertCircle, RotateCcw } from 'lucide-react'

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
    icon: Heart,
    color: 'bg-gradient-to-br from-[#fbc2eb] via-[#fbd786] to-[#fbc687] dark:from-[#4A2D4A] dark:via-[#4A3D2D] dark:to-[#4A362D]',
    examples: ['Overwhelmed', 'Ashamed', 'Stuck']
  },
  {
    id: 'barriers',
    title: 'Can\'t get started?',
    subtitle: 'Find barrier-specific solutions',
    icon: AlertCircle,
    color: 'bg-gradient-to-br from-[#fbc687] via-[#fff5db] to-[#d4fc79] dark:from-[#4A362D] dark:via-[#3D4A2D] dark:to-[#2D4A2D]',
    examples: ['Can\'t start', 'Feel shame', 'Too big']
  },
  {
    id: 'tasks',
    title: 'Trying to get something done?',
    subtitle: 'Get specific guidance',
    icon: Wrench,
    color: 'bg-gradient-to-br from-[#d4fc79] via-[#b0f4ea] to-[#8fd3f4] dark:from-[#2D4A2D] dark:via-[#2D4A4A] dark:to-[#2D3D4A]',
    examples: ['Cleaning', 'Cooking', 'Friendships']
  },
  {
    id: 'complex_loops',
    title: 'Stuck in a loop?',
    subtitle: 'Break free from repetitive ADHD spirals',
    icon: RotateCcw,
    color: 'bg-gradient-to-br from-[#8fd3f4] via-[#78c2f2] to-[#a18cd1] dark:from-[#2D3D4A] dark:via-[#2D354A] dark:to-[#362D4A]',
    examples: ['Phone Scrolling', 'Chronic Lateness']
  },
  {
    id: 'identities',
    title: 'How can you be supported?',
    subtitle: 'Explore identity-specific support',
    icon: User,
    color: 'bg-gradient-to-br from-[#a18cd1] via-[#b19cd9] to-[#dec6f7] dark:from-[#362D4A] dark:via-[#3D2D4A] dark:to-[#4A2D4A]',
    examples: ['Parent', 'Caregiver', 'Student']
  }
]

// Middle - Systems Lab
const systemsCategory = {
  id: 'systems',
  title: 'Systems Lab',
  subtitle: 'Browse, build, and share ADHD-friendly routines that solve real problems',
  icon: Settings,
  color: 'bg-[linear-gradient(135deg,_#fbc2eb,_#fbd786,_#fbc687,_#fff5db,_#d4fc79,_#b0f4ea,_#8fd3f4,_#78c2f2,_#a18cd1,_#b19cd9,_#dec6f7)] dark:bg-[linear-gradient(135deg,_#4A2D4A,_#4A3D2D,_#4A362D,_#3D4A2D,_#2D4A2D,_#2D4A4A,_#2D3D4A,_#2D354A,_#362D4A,_#3D2D4A,_#4A2D4A)]',
  examples: ['Morning Routine', 'Post-Crash Reset', '7AM Workout']
}

// Bottom Row - Support & Tools
const bottomCategories = [
  {
    id: 'guides',
    title: '📚 Read Guides & Insights',
    subtitle: 'Educational articles (e.g., Habit Bundling, Diagnostic Guide)',
    icon: BookOpen,
    color: 'bg-[#CAE5FF] dark:bg-[#2B4365]',
    examples: ['Habit Stacking', 'Diagnostic Guide', 'Types of Support']
  },
  {
    id: 'scripts',
    title: '🗣 Scripts for Hard Moments',
    subtitle: 'Prewritten things to say or send when words fail',
    icon: MessageSquareText,
    color: 'bg-[#E8D7FF] dark:bg-[#453975]',
    examples: ['Ask for ADHD evaluation', 'Tell partner what you need', 'Workplace accommodations']
  },
  {
    id: 'quizzes',
    title: '🧪 Quizzes & Tools',
    subtitle: 'Interactive experiences (e.g., Structure Type Quiz, Sleep Calculator)',
    icon: HelpCircle,
    color: 'bg-[#E0F5CE] dark:bg-[#2D4A2A]',
    examples: ['Structure Quiz', 'Sleep Calculator', 'Time Blindness']
  },
  {
    id: 'resources',
    title: '🔗 Resources & Links',
    subtitle: 'Podcasts, books, terminology, and external support materials',
    icon: BookOpen,
    color: 'bg-[#FFD4DB] dark:bg-[#4A2D35]',
    examples: ['Podcasts', 'Books', 'Terminology']
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
        window.location.href = '/tasks'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-8 space-y-3 mt-20">
        <h1 className="text-xl md:text-2xl font-light text-gray-800 dark:text-gray-200">
          {getPersonalizedGreeting()}
        </h1>
        <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-900 dark:text-white">
          Where do you want to start?
        </h2>
      </div>

      {/* Main Cards - 3 Section Layout */}
      <div className="max-w-6xl w-full space-y-8">
        
        {/* Top Row - Core Entry Points */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
              Not sure where to begin? Pick the option that feels most true right now.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-stretch">
          {topCategories.map((category) => {
            const IconComponent = category.icon
            
            return (
              <div
                key={category.id}
                onClick={() => handleCardClick(category.id)}
                className={`
                  relative group cursor-pointer transform transition-all duration-500 ease-out touch-manipulation
                  hover:scale-110 hover:-translate-y-2 hover:rotate-1
                  ${localSelectedCard === category.id ? 'scale-110 -translate-y-2 rotate-1' : ''}
                  ${isTransitioning ? 'pointer-events-none' : ''}
                  hover:z-10 active:scale-105
                `}
                style={{
                  transformOrigin: 'center center',
                }}
              >
                <div 
                  className={`
                    relative overflow-hidden rounded-[1.5rem] p-3
                    ${category.color}
                    transition-all duration-500 ease-out
                    h-[12rem] md:h-[13rem]
                    flex flex-col justify-between h-full
                    after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/5 after:to-transparent
                  `}
                >
                  <div className="mb-2 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-500 group-hover:bg-white/30">
                      <IconComponent className="w-3.5 h-3.5 text-black transition-all duration-500 group-hover:w-4 group-hover:h-4" />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-xs font-bold text-black transition-all duration-500 group-hover:text-sm leading-tight">
                      {category.title}
                    </h3>
                    <p className="text-black/80 text-xs leading-tight transition-all duration-500 group-hover:text-black">
                      {category.subtitle}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-auto pt-1.5">
                      {category.examples.slice(0, 2).map((example, index) => (
                        <span
                          key={index}
                          className="bg-white/20 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-xs text-black
                                     transition-all duration-500 ease-out transform
                                     group-hover:bg-white/30 group-hover:scale-105 leading-none"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2">
                    <ArrowRight className="w-3.5 h-3.5 text-black transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:scale-110" />
                  </div>

                </div>
              </div>
            )
          })}
          </div>
        </div>

        {/* Middle - Systems Lab (Featured) */}
        <div className="flex justify-center">
          <div
            onClick={() => handleCardClick(systemsCategory.id)}
            className={`
              relative group cursor-pointer transform transition-all duration-500 ease-out touch-manipulation
              hover:scale-105 hover:-translate-y-2 hover:rotate-1
              ${localSelectedCard === systemsCategory.id ? 'scale-105 -translate-y-2 rotate-1' : ''}
              ${isTransitioning ? 'pointer-events-none' : ''}
              hover:z-10 active:scale-105 max-w-xl w-full
            `}
          >
            <div 
              className={`
                relative overflow-hidden rounded-[2rem] p-4
                ${systemsCategory.color}
                transition-all duration-500 ease-out
                h-[4rem] sm:h-[5rem] md:h-[6rem]
                flex flex-col justify-center
                after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/5 after:to-transparent
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-white/30">
                      <Settings className="w-7 h-7 text-black transition-all duration-500 group-hover:w-8 group-hover:h-8" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black transition-all duration-500 group-hover:text-xl mb-2">
                      {systemsCategory.title}
                    </h3>
                    <p className="text-black/80 text-xs leading-relaxed transition-all duration-500 group-hover:text-black">
                      {systemsCategory.subtitle}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6">
                  <ArrowRight className="w-6 h-6 text-black transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:scale-110" />
                </div>
              </div>

              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
            </div>
          </div>
        </div>

        {/* Bottom Row - Support & Tools */}
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
              Ready to dive deeper? Explore tools, insights, and resources to support your ADHD journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {bottomCategories.map((category) => {
            const IconComponent = category.icon
            
            return (
              <div
                key={category.id}
                onClick={() => handleCardClick(category.id)}
                className={`
                  relative group cursor-pointer transform transition-all duration-500 ease-out touch-manipulation
                  hover:scale-110 hover:-translate-y-2 hover:rotate-1
                  ${localSelectedCard === category.id ? 'scale-110 -translate-y-2 rotate-1' : ''}
                  ${isTransitioning ? 'pointer-events-none' : ''}
                  hover:z-10 active:scale-105
                `}
                style={{
                  transformOrigin: 'center center',
                }}
              >
                <div 
                  className={`
                    relative overflow-hidden rounded-[2rem] p-4
                    ${category.color}
                    transition-all duration-500 ease-out
                    h-[14rem] sm:h-[16rem] md:h-[18rem]
                    flex flex-col justify-between h-full
                    after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/5 after:to-transparent
                  `}
                >
                  <div className="mb-3 sm:mb-4 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-white/30">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-black transition-all duration-500 group-hover:w-6 group-hover:h-6 sm:group-hover:w-8 sm:group-hover:h-8" />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-black transition-all duration-500 group-hover:text-lg sm:group-hover:text-xl">
                      {category.title}
                    </h3>
                    <p className="text-black/80 text-xs leading-relaxed transition-all duration-500 group-hover:text-black">
                      {category.subtitle}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {category.examples.slice(0, 2).map((example, index) => (
                        <span
                          key={index}
                          className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-black
                                     transition-all duration-500 ease-out transform
                                     group-hover:bg-white/30 group-hover:scale-105"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-black transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:scale-110" />
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
              {selectedCard === 'feelings' && 'Finding feelings pages...'}
              {selectedCard === 'barriers' && 'Finding barrier solutions...'}
              {selectedCard === 'tasks' && 'Finding task help...'}
              {selectedCard === 'identities' && 'Finding identity pages...'}
              {selectedCard === 'complex_loops' && 'Breaking loops...'}
              {selectedCard === 'systems' && 'Opening Systems Lab...'}
              {selectedCard === 'guides' && 'Loading guides...'}
              {selectedCard === 'scripts' && 'Finding your scripts...'}
              {selectedCard === 'quizzes' && 'Loading quizzes and tools...'}
              {selectedCard === 'resources' && 'Loading resources...'}
              {!selectedCard && 'Loading...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}