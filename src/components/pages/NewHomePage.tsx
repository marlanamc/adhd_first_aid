import { useState } from 'react'
import { MessageSquareText, Heart, Brain, Settings, BookOpen, ArrowRight } from 'lucide-react'

interface Feeling {
  id: string
  name: string
  emoji: string | null
  color: string | null
  category: string | null
  description: string | null
}

interface Task {
  id: string
  name: string
  emoji: string | null
  color: string | null
  category: string | null
  description: string | null
}

interface NewHomePageProps {
  feelings: Feeling[]
  tasks: Task[]
  handleFeelingSelect: (feeling: string) => void
  handleTaskSelect: (task: string) => void
  onScriptSelect: (category: string) => void
  onSystemSelect: (category: string) => void
  onGuideSelect: (category: string) => void
  onStrategySelect: () => void
  onQuizSelect: () => void
  onResourceSelect: () => void
  isTransitioning: boolean
  selectedCard?: string | null
}

// Card categories based on Reddit research priorities
const categories = [
  {
    id: 'scripts-guides',
    title: 'Guides & Scripts',
    subtitle: 'Communication templates & step-by-step guidance',
    icon: MessageSquareText,
    color: 'from-blue-400 to-purple-500',
    priority: 1, // #1 Reddit need: Relationships & Communication
    examples: ['Explaining ADHD', 'Diagnosis journey', 'Workplace advocacy']
  },
  {
    id: 'strategies',
    title: 'Find Your Strategy',
    subtitle: 'Browse by how you\'re feeling or what you need help with',
    icon: Brain,
    color: 'from-pink-400 to-green-500',
    priority: 2, // #2 & #3 Reddit needs: Emotional regulation & Executive function
    examples: ['When overwhelmed', 'Getting started', 'Staying focused']
  },
  {
    id: 'systems',
    title: 'Systems',
    subtitle: 'Life management frameworks & tools',
    icon: Settings,
    color: 'from-orange-400 to-yellow-500',
    priority: 3, // #4 Reddit need: Daily life management
    examples: ['Routines', 'Organization', 'Energy management']
  },
  {
    id: 'quizzes',
    title: 'Quizzes & Downloads',
    subtitle: 'Self-assessments, worksheets & helpful resources',
    icon: Heart,
    color: 'from-purple-400 to-pink-500',
    priority: 4, // Learning and self-discovery tools
    examples: ['ADHD quiz', 'Worksheets', 'Printable resources']
  },
  {
    id: 'resources',
    title: 'Resources',
    subtitle: 'Links, podcasts, books & terminology',
    icon: BookOpen,
    color: 'from-indigo-400 to-blue-500',
    priority: 5, // External learning and support materials
    examples: ['Podcasts', 'Books', 'Terminology']
  }
]

export default function NewHomePage({
  feelings: _feelings,
  tasks: _tasks,
  handleFeelingSelect: _handleFeelingSelect,
  handleTaskSelect: _handleTaskSelect,
  onScriptSelect,
  onSystemSelect,
  onGuideSelect: _onGuideSelect,
  onStrategySelect,
  onQuizSelect,
  onResourceSelect,
  isTransitioning,
  selectedCard
}: NewHomePageProps) {
  const [localSelectedCard, setLocalSelectedCard] = useState<string | null>(null)

  const handleCardClick = (categoryId: string) => {
    setLocalSelectedCard(categoryId)
    
    switch (categoryId) {
      case 'scripts-guides':
        onScriptSelect('communication')
        break
      case 'strategies':
        // Navigate to combined strategy selection page
        onStrategySelect()
        break
      case 'systems':
        onSystemSelect('life-management')
        break
      case 'quizzes':
        onQuizSelect()
        break
      case 'resources':
        onResourceSelect()
        break
    }
  }

  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours()
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
    
    return `Good ${timeOfDay}.`
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-2xl md:text-3xl font-light text-gray-800 dark:text-gray-200">
          {getPersonalizedGreeting()}
        </h1>
        <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white">
          How can I help you today?
        </h2>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl w-full
                      lg:gap-8 xl:gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon
          
          return (
            <div
              key={category.id}
              onClick={() => handleCardClick(category.id)}
              className={`
                relative group cursor-pointer transform transition-all duration-500 ease-out
                hover:scale-110 hover:-translate-y-2 hover:rotate-1
                ${localSelectedCard === category.id ? 'scale-110 -translate-y-2 shadow-2xl rotate-1' : 'shadow-lg hover:shadow-2xl'}
                ${isTransitioning ? 'pointer-events-none' : ''}
                hover:z-10
              `}
              style={{
                transformOrigin: 'center center',
              }}
            >
              {/* Card Background with Gradient */}
              <div 
                className={`
                  relative overflow-hidden rounded-3xl p-6
                  bg-gradient-to-br ${category.color}
                  backdrop-blur-lg bg-opacity-90
                  transition-all duration-500 ease-out
                  group-hover:bg-opacity-100 group-hover:backdrop-blur-xl
                  h-[22rem] md:h-[24rem] lg:h-[26rem]
                  flex flex-col justify-between
                `}
              >
                {/* Priority Badge */}
                <div className="absolute top-4 right-4 transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-12">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 transition-all duration-500 group-hover:bg-white/30">
                    <span className="text-white text-sm font-medium">
                      #{category.priority}
                    </span>
                  </div>
                </div>

                {/* Top Content - Icon and Text */}
                <div className="flex-1 flex flex-col">
                  {/* Icon */}
                  <div className="mb-6 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-white/30 group-hover:rounded-3xl">
                      <IconComponent className="w-8 h-8 text-white transition-all duration-500 group-hover:w-10 group-hover:h-10" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-4 flex-1 transition-all duration-500 ease-out group-hover:transform group-hover:translate-y-1">
                    <h3 className="text-2xl font-bold text-white transition-all duration-500 group-hover:text-3xl">
                      {category.title}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed transition-all duration-500 group-hover:text-white">
                      {category.subtitle}
                    </p>
                    
                    {/* Examples */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {category.examples.map((example, index) => (
                        <span
                          key={index}
                          className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white
                                     transition-all duration-500 ease-out transform
                                     group-hover:bg-white/30 group-hover:scale-105"
                          style={{
                            transitionDelay: `${index * 100}ms`
                          }}
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Arrow - Bottom */}
                <div className="self-end mt-4">
                  <div className="transition-all duration-500 ease-out group-hover:scale-125 group-hover:rotate-12">
                    <ArrowRight className={`
                      w-6 h-6 text-white transition-all duration-500 ease-out
                      ${localSelectedCard === category.id ? 'translate-x-2 scale-110' : 'group-hover:translate-x-2 group-hover:scale-110'}
                    `} />
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
                
                {/* Subtle sparkle effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-1000">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '0ms'}} />
                  <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '200ms'}} />
                  <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{animationDelay: '400ms'}} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Text */}
      <div className="text-center mt-12 max-w-2xl">
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Choose the approach that feels right for you right now. 
          You can always explore other paths when you need them.
        </p>
      </div>

      {/* Loading State */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {selectedCard === 'scripts-guides' && 'Finding your scripts and guides...'}
              {selectedCard === 'strategies' && 'Finding your strategies...'}
              {selectedCard === 'systems' && 'Finding your systems...'}
              {selectedCard === 'quizzes' && 'Loading quizzes and downloads...'}
              {selectedCard === 'resources' && 'Loading resources...'}
              {!selectedCard && 'Loading...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}