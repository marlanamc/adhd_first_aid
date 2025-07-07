import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Search, Heart, Star, ArrowLeft, ChevronRight, Timer, X, ExternalLink, Menu, ChevronDown } from 'lucide-react'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState('feeling') // 'feeling', 'issue', 'barrier', 'gallery', 'faq', 'about', 'blog', 'terminology', 'legal'
  const [selectedFeeling, setSelectedFeeling] = useState('')
  const [selectedIssue, setSelectedIssue] = useState('')
  const [selectedBarrier, setSelectedBarrier] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('feeling') // 'feeling' or 'task'
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState(null)
  const [showStrategyModal, setShowStrategyModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedBlogPost, setSelectedBlogPost] = useState(null)
  const [showBlogModal, setShowBlogModal] = useState(false)

  const feelings = [
    'Overwhelmed',
    'Stuck', 
    'Ashamed',
    'Unmotivated',
    'Anxious',
    'Scattered',
    'Chaotic',
    'Numb',
    'Avoidant'
  ]

  const tasks = [
    'Cleaning my fridge',
    'Getting started on work',
    'Managing a shame spiral',
    'Trying to eat today',
    'Doing laundry',
    'Making phone calls',
    'Organizing my space',
    'Starting a project'
  ]

  const issues = [
    'Getting started on work',
    'Cleaning/organizing space',
    'Managing emotions',
    'Making phone calls',
    'Eating/self-care',
    'Time management',
    'Social situations',
    'Decision making',
    'Completing tasks',
    'Staying focused'
  ]

  const barriers = [
    'Perfectionism',
    'Lack of energy',
    'Too many options',
    'Fear of judgment',
    'Sensory overwhelm',
    'Executive dysfunction',
    'Time pressure',
    'Emotional dysregulation',
    'Procrastination',
    'Feeling stuck'
  ]

  // Mock strategies for the gallery
  const mockStrategies = [
    {
      id: '1',
      name: '5-Minute Timer Trick',
      description: 'Set a timer for just 5 minutes of work on that task you\'ve been avoiding. Tell yourself "I only have to do this for 5 minutes, then I can stop." Often, starting is the hardest part.',
      tags: ['momentum', 'procrastination', 'starting tasks'],
      price: 'Free',
      featured: true,
      voteCount: 23,
      category: 'Getting Started'
    },
    {
      id: '2',
      name: '15-Minute Speed Clean',
      description: 'When your space feels chaotic, set a timer for just 15 minutes. Focus only on what you can see and move gently through the space. It\'s not about perfection—it\'s about creating a little more calm.',
      tags: ['home mess', 'quick clean', 'timer method'],
      price: 'Free',
      featured: false,
      voteCount: 18,
      category: 'Organization'
    },
    {
      id: '3',
      name: 'Body Doubling',
      description: 'Work alongside someone else, either in person or virtually. You don\'t need to talk or work on the same thing. Sometimes just having gentle company makes all the difference.',
      tags: ['accountability', 'body doubling', 'focus'],
      price: 'Free',
      featured: true,
      voteCount: 31,
      category: 'Focus'
    },
    {
      id: '4',
      name: 'The 2-Minute Rule',
      description: 'If something takes less than 2 minutes, do it now. This prevents small tasks from piling up and becoming overwhelming.',
      tags: ['quick tasks', 'productivity', 'momentum'],
      price: 'Free',
      featured: false,
      voteCount: 15,
      category: 'Productivity'
    },
    {
      id: '5',
      name: 'Gentle Movement Break',
      description: 'Take 5 minutes to stretch, walk, or do gentle movement. This can help reset your nervous system and improve focus.',
      tags: ['movement', 'self-care', 'reset'],
      price: 'Free',
      featured: false,
      voteCount: 22,
      category: 'Self-Care'
    },
    {
      id: '6',
      name: 'Brain Dump',
      description: 'Write down everything on your mind for 10 minutes without editing. This helps clear mental clutter and identify priorities.',
      tags: ['clarity', 'overwhelm', 'planning'],
      price: 'Free',
      featured: true,
      voteCount: 28,
      category: 'Mental Clarity'
    }
  ]

  // Mock blog posts
  const blogPosts = [
    {
      id: '1',
      title: 'Why Traditional Productivity Advice Doesn\'t Work for ADHD Brains',
      excerpt: 'Exploring why neurotypical productivity systems often fail for ADHD minds and what works instead. We dive into the science behind executive dysfunction and offer gentle alternatives.',
      content: `
        <h2>The Problem with One-Size-Fits-All Productivity</h2>
        <p>Most productivity advice assumes a neurotypical brain that can easily prioritize, focus on demand, and maintain consistent motivation. For ADHD brains, this advice often feels like trying to fit a square peg into a round hole.</p>
        
        <h2>Understanding Executive Dysfunction</h2>
        <p>Executive dysfunction isn't a character flaw or lack of willpower. It's a neurological difference that affects how we plan, organize, and execute tasks. Traditional productivity systems that rely heavily on these functions often set us up for failure.</p>
        
        <h2>What Works Instead</h2>
        <p>ADHD-friendly strategies work with your brain, not against it. They account for variable attention, the need for immediate rewards, and the importance of interest-based motivation.</p>
        
        <h2>Key Principles for ADHD Productivity</h2>
        <ul>
          <li><strong>Start small:</strong> Tiny actions build momentum without overwhelming your executive function</li>
          <li><strong>Use external structure:</strong> Timers, body doubling, and environmental cues replace internal organization</li>
          <li><strong>Follow your energy:</strong> Work with your natural rhythms instead of forcing a rigid schedule</li>
          <li><strong>Embrace imperfection:</strong> Done is better than perfect, especially for ADHD brains</li>
        </ul>
        
        <p>Remember: You're not broken, and you don't need to be fixed. You just need strategies that work with your beautiful, unique brain.</p>
      `,
      featured: true,
      category: 'Understanding ADHD',
      readTime: '5 min read',
      publishDate: 'Coming soon...'
    },
    {
      id: '2',
      title: 'The Art of the 5-Minute Start',
      excerpt: 'A deep dive into why the 5-minute timer trick works so well for ADHD brains, plus variations and troubleshooting tips for when it doesn\'t work.',
      content: `
        <h2>Why 5 Minutes is Magic</h2>
        <p>The 5-minute timer trick works because it bypasses the ADHD brain's tendency to catastrophize tasks. Instead of seeing an overwhelming project, you're just committing to 5 minutes.</p>
        
        <h2>The Science Behind It</h2>
        <p>This strategy works with several ADHD traits:</p>
        <ul>
          <li><strong>Task initiation difficulties:</strong> Starting is often the hardest part</li>
          <li><strong>Time blindness:</strong> 5 minutes feels manageable and concrete</li>
          <li><strong>Dopamine seeking:</strong> Quick wins provide immediate reward</li>
        </ul>
        
        <h2>Variations to Try</h2>
        <p>Not everyone responds to 5 minutes. Some alternatives:</p>
        <ul>
          <li><strong>The 2-minute rule:</strong> For even smaller starts</li>
          <li><strong>The 15-minute sprint:</strong> When you need a bit more momentum</li>
          <li><strong>The "just one thing" approach:</strong> Focus on a single action rather than time</li>
        </ul>
        
        <h2>When It Doesn't Work</h2>
        <p>If the timer trick isn't working, consider:</p>
        <ul>
          <li>Are you in the right headspace? Sometimes we need to address emotions first</li>
          <li>Is the task too vague? Break it down further</li>
          <li>Do you need a different environment or body doubling?</li>
        </ul>
        
        <p>Remember: No strategy works 100% of the time. Be gentle with yourself and keep experimenting.</p>
      `,
      featured: false,
      category: 'Strategies',
      readTime: '4 min read',
      publishDate: 'Coming soon...'
    },
    {
      id: '3',
      title: 'Sensory Overwhelm: Recognition and Recovery',
      excerpt: 'Understanding the signs of sensory overwhelm and practical strategies for both prevention and recovery. Includes a downloadable sensory toolkit checklist.',
      content: `
        <h2>What is Sensory Overwhelm?</h2>
        <p>Sensory overwhelm happens when your nervous system receives more input than it can process. For ADHD brains, this threshold is often lower and more variable than for neurotypical people.</p>
        
        <h2>Common Signs</h2>
        <p>Sensory overwhelm can look like:</p>
        <ul>
          <li>Feeling irritable or on edge</li>
          <li>Difficulty concentrating</li>
          <li>Physical discomfort or restlessness</li>
          <li>Emotional dysregulation</li>
          <li>Urge to escape or shut down</li>
        </ul>
        
        <h2>Prevention Strategies</h2>
        <ul>
          <li><strong>Know your triggers:</strong> Loud noises, bright lights, crowds, textures</li>
          <li><strong>Plan ahead:</strong> Bring headphones, sunglasses, fidget tools</li>
          <li><strong>Take breaks:</strong> Step away before you hit your limit</li>
          <li><strong>Communicate needs:</strong> Let others know what helps you</li>
        </ul>
        
        <h2>Recovery Techniques</h2>
        <p>When overwhelm hits:</p>
        <ul>
          <li><strong>Find a quiet space:</strong> Even a bathroom can provide temporary relief</li>
          <li><strong>Use grounding techniques:</strong> 5-4-3-2-1 sensory grounding</li>
          <li><strong>Gentle movement:</strong> Stretching or walking can help reset</li>
          <li><strong>Breathe deeply:</strong> Slow, intentional breathing calms the nervous system</li>
        </ul>
        
        <h2>Building Your Sensory Toolkit</h2>
        <p>Consider keeping these items handy:</p>
        <ul>
          <li>Noise-canceling headphones or earplugs</li>
          <li>Sunglasses for light sensitivity</li>
          <li>Fidget tools or stress balls</li>
          <li>Comfortable clothing layers</li>
          <li>Essential oils or calming scents</li>
        </ul>
        
        <p>Remember: Taking care of your sensory needs isn't being "high maintenance" - it's being kind to your nervous system.</p>
      `,
      featured: false,
      category: 'Self-Care',
      readTime: '6 min read',
      publishDate: 'Coming soon...'
    }
  ]

  const handleFeelingSelect = (feeling) => {
    setSelectedFeeling(feeling)
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentStep('issue')
      setIsTransitioning(false)
    }, 800)
  }

  const handleTaskSelect = (task) => {
    setSelectedFeeling(task)
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentStep('issue')
      setIsTransitioning(false)
    }, 800)
  }

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue)
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentStep('barrier')
      setIsTransitioning(false)
    }, 600)
  }

  const handleBarrierSelect = (barrier) => {
    setSelectedBarrier(barrier)
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentStep('gallery')
      setIsTransitioning(false)
    }, 600)
  }

  const goBack = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      if (currentStep === 'gallery') {
        setCurrentStep('barrier')
        setSelectedBarrier('')
      } else if (currentStep === 'barrier') {
        setCurrentStep('issue')
        setSelectedIssue('')
      } else if (currentStep === 'issue') {
        setCurrentStep('feeling')
        setSelectedFeeling('')
      }
      setIsTransitioning(false)
    }, 400)
  }

  const resetFlow = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep('feeling')
      setSelectedFeeling('')
      setSelectedIssue('')
      setSelectedBarrier('')
      setShowSearch(false)
      setIsTransitioning(false)
    }, 400)
  }

  const handleStrategyClick = (strategy) => {
    setSelectedStrategy(strategy)
    setShowStrategyModal(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const closeStrategyModal = () => {
    setShowStrategyModal(false)
    setSelectedStrategy(null)
    // Restore body scroll
    document.body.style.overflow = 'unset'
  }

  const handleBlogPostClick = (blogPost) => {
    setSelectedBlogPost(blogPost)
    setShowBlogModal(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const closeBlogModal = () => {
    setShowBlogModal(false)
    setSelectedBlogPost(null)
    // Restore body scroll
    document.body.style.overflow = 'unset'
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showStrategyModal) {
        closeStrategyModal()
      }
      if (e.key === 'Escape' && showBlogModal) {
        closeBlogModal()
      }
      if (e.key === 'Escape' && showDropdown) {
        setShowDropdown(false)
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showStrategyModal, showBlogModal, showDropdown])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest('.dropdown-container')) {
        setShowDropdown(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showDropdown])

  const navigateToPage = (page) => {
    setIsTransitioning(true)
    setShowDropdown(false)
    setTimeout(() => {
      setCurrentStep(page)
      setIsTransitioning(false)
    }, 400)
  }

  const navigateHome = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep('feeling')
      setSelectedFeeling('')
      setSelectedIssue('')
      setSelectedBarrier('')
      setShowSearch(false)
      setIsTransitioning(false)
    }, 400)
  }

  return (
    <div className="min-h-screen ocean-gradient relative">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo/Title Area */}
            <div className="flex-1">
              <button
                onClick={navigateHome}
                className="text-2xl sm:text-3xl font-serif text-foreground hover:text-primary transition-colors duration-300 cursor-pointer"
              >
                ADHD First Aid Kit
              </button>
            </div>
            
            {/* Header Actions - Search and Menu */}
            <div className="flex items-center space-x-3">
              {/* Search Icon */}
              <Button
                variant="ghost"
                onClick={() => setShowSearch(!showSearch)}
                className="p-3 rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <Search className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors duration-300" />
              </Button>

              {/* Dropdown Menu */}
              <div className="relative dropdown-container">
                <Button
                  variant="ghost"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="dropdown-trigger p-3 rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg"
                >
                  <Menu className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors duration-300" />
                </Button>

                {/* Dropdown Content */}
                {showDropdown && (
                  <div className="dropdown-menu absolute top-14 right-0 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/30 py-2 z-50">
                    <button
                      onClick={() => navigateToPage('about')}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all duration-200 font-light"
                    >
                      About
                    </button>
                    <button
                      onClick={() => navigateToPage('faq')}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all duration-200 font-light"
                    >
                      FAQ
                    </button>
                    <button
                      onClick={() => navigateToPage('terminology')}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all duration-200 font-light"
                    >
                      Terminology
                    </button>
                    <button
                      onClick={() => navigateToPage('blog')}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all duration-200 font-light"
                    >
                      Blog
                    </button>
                    <button
                      onClick={() => navigateToPage('legal')}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all duration-200 font-light"
                    >
                      Legal & Privacy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-white/30 shadow-lg">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 text-base h-14 bg-white/60 backdrop-blur-sm border-0 shadow-sm focus:shadow-md transition-all duration-300 rounded-full font-light"
                autoFocus
              />
              <Button
                variant="ghost"
                onClick={() => setShowSearch(false)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-white/20"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content with top padding to account for fixed header */}
      <main className="pt-20">
        {/* Subtitle for homepage only */}
        {currentStep === 'feeling' && (
          <div className="text-center py-4 md:py-6 px-4">
            <p className="text-base sm:text-lg text-muted-foreground font-light italic subheading-serif">
              Gentle tools for overwhelming moments
            </p>
          </div>
        )}

        {/* How are you feeling section */}
        {currentStep !== 'feeling' && (
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <span className={currentStep === 'feeling' ? 'text-primary' : ''}>Feeling</span>
              <ChevronRight className="h-4 w-4" />
              <span className={currentStep === 'issue' ? 'text-primary' : ''}>Issue</span>
              <ChevronRight className="h-4 w-4" />
              <span className={currentStep === 'barrier' ? 'text-primary' : ''}>Barrier</span>
              <ChevronRight className="h-4 w-4" />
              <span className={currentStep === 'gallery' ? 'text-primary' : ''}>Strategies</span>
            </div>
          </div>
        )}

        {/* Step 1: Feeling Selection */}
        {currentStep === 'feeling' && (
          <div className="mobile-transition opacity-100 transform translate-y-0">
            <div className="text-center mb-8 md:mb-12">
              <div className="mb-4 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-foreground mb-3 md:mb-4 leading-relaxed px-4">
                  {viewMode === 'feeling' ? 'How are you feeling right now?' : 'What would you like help with?'}
                </h2>
                
                <Button
                  variant="ghost"
                  onClick={() => setViewMode(viewMode === 'feeling' ? 'task' : 'feeling')}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 underline decoration-dotted underline-offset-4 font-light mobile-button"
                >
                  {viewMode === 'feeling' ? 'Switch to tasks' : 'Switch to feelings'}
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
                {(viewMode === 'feeling' ? feelings : tasks).map((item, index) => (
                  <Button
                    key={item}
                    variant="ghost"
                    onClick={() => viewMode === 'feeling' ? handleFeelingSelect(item) : handleTaskSelect(item)}
                    className="feeling-button h-auto py-3 sm:py-4 px-4 sm:px-6 text-sm font-light rounded-full mobile-transition mobile-button-large inline-flex items-center justify-center whitespace-nowrap text-muted-foreground hover:text-foreground"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      transform: isTransitioning ? 'translateY(-20px)' : 'translateY(0)',
                      opacity: isTransitioning ? 0 : 1
                    }}
                  >
                    <span className="text-center leading-tight">{item}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Hover-only Reassuring Message */}
            <div className="text-center py-6 md:py-8 hover-message-container group cursor-default">
              <div className="max-w-2xl mx-auto space-y-3 md:space-y-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light body-light">
                  You're not failing — you're just overwhelmed.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground/80 leading-relaxed font-light italic body-light">
                  This is a gentle space with tools designed specifically for ADHD minds. 
                  Take your time, breathe, and choose what feels right for you today.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Issue Selection */}
        {currentStep === 'issue' && (
          <div className={`mobile-transition ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="mb-3 md:mb-4">
              <Button
                variant="ghost"
                onClick={goBack}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light mobile-button"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm sm:text-base">Back</span>
              </Button>
            </div>

            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-base sm:text-lg font-serif text-muted-foreground mb-2 md:mb-3 leading-relaxed px-4">
                You're feeling {selectedFeeling.toLowerCase()}
              </h3>
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-foreground mb-4 md:mb-6 leading-relaxed px-4">
                What specific issue are you facing right now?
              </h2>
              
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
                {issues.map((issue, index) => (
                  <Button
                    key={issue}
                    variant="ghost"
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
            </div>
          </div>
        )}

        {/* Step 3: Barrier Selection */}
        {currentStep === 'barrier' && (
          <div className={`mobile-transition ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="mb-3 md:mb-4">
              <Button
                variant="ghost"
                onClick={goBack}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light mobile-button"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm sm:text-base">Back</span>
              </Button>
            </div>

            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-base sm:text-lg font-serif text-muted-foreground mb-2 md:mb-3 leading-relaxed px-4">
                You're working on: {selectedIssue.toLowerCase()}
              </h3>
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-foreground mb-4 md:mb-6 leading-relaxed px-4">
                What's making this harder for you?
              </h2>
              
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
                {barriers.map((barrier, index) => (
                  <Button
                    key={barrier}
                    variant="ghost"
                    onClick={() => handleBarrierSelect(barrier)}
                    className="feeling-button h-auto py-3 sm:py-4 px-4 sm:px-6 text-sm font-light rounded-full mobile-transition mobile-button-large inline-flex items-center justify-center whitespace-nowrap text-muted-foreground hover:text-foreground"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      transform: isTransitioning ? 'translateY(-20px)' : 'translateY(0)',
                      opacity: isTransitioning ? 0 : 1
                    }}
                  >
                    <span className="text-center leading-tight">{barrier}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Gallery Results */}
        {currentStep === 'gallery' && (
          <div className={`mobile-transition ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="mb-3 md:mb-4 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={goBack}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light mobile-button"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm sm:text-base">Back</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={resetFlow}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light mobile-button text-xs sm:text-sm"
              >
                Start over
              </Button>
            </div>

            <div className="mb-6 md:mb-8 text-center">
              <h3 className="text-base sm:text-lg font-serif text-muted-foreground mb-2 leading-relaxed px-4">
                Personalized strategies for you
              </h3>
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-primary mb-3 leading-relaxed px-4">
                {selectedFeeling} → {selectedIssue} → {selectedBarrier}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground font-light px-4">
                Here are gentle strategies tailored to your specific situation
              </p>
            </div>
            
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {mockStrategies.map((strategy, index) => (
                <div 
                  key={strategy.id} 
                  onClick={() => handleStrategyClick(strategy)}
                  className="strategy-card clickable-card rounded-xl md:rounded-2xl p-4 sm:p-6 mobile-transition bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl cursor-pointer"
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    transform: isTransitioning ? 'translateY(30px)' : 'translateY(0)',
                    opacity: isTransitioning ? 0 : 1
                  }}
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex-1">
                      <span className="text-xs text-primary font-medium mb-1 block">{strategy.category}</span>
                      <h4 className="font-serif text-foreground text-base sm:text-lg leading-relaxed pr-2">
                        {strategy.name}
                      </h4>
                    </div>
                    {strategy.featured && (
                      <span className="text-xs bg-accent/20 text-accent px-2 sm:px-3 py-1 rounded-full ml-2 sm:ml-4 font-light flex-shrink-0">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-sm sm:text-base mb-4 md:mb-6 leading-relaxed font-light body-light">
                    {strategy.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4 md:mb-6 mobile-tags">
                    {strategy.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-muted/50 text-muted-foreground px-2 sm:px-3 py-1 rounded-full font-light mobile-tag">
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs bg-muted/30 text-muted-foreground px-2 sm:px-3 py-1 rounded-full font-light mobile-tag">
                      {strategy.price}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="vote-button text-muted-foreground hover:text-primary transition-colors duration-300 font-light mobile-button p-2 sm:p-3"
                      >
                        <Heart className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">
                          {strategy.voteCount} found this helpful
                        </span>
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="vote-button text-muted-foreground hover:text-accent transition-colors duration-300 mobile-button self-start sm:self-auto"
                    >
                      <Star className="h-4 w-4" />
                      <span className="ml-2 text-xs sm:text-sm">Save</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Page */}
        {currentStep === 'about' && (
          <div className={`mobile-transition ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={navigateHome}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light mobile-button"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Back to home</span>
                </Button>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-6 leading-tight">
                  About ADHD First Aid Kit
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  A gentle space designed specifically for ADHD minds in overwhelming moments
                </p>
              </div>

              <div className="space-y-8 text-muted-foreground leading-relaxed font-light">
                <div>
                  <h2 className="text-xl font-serif text-foreground mb-4">Our Mission</h2>
                  <p className="mb-4">
                    We believe that ADHD minds deserve tools that work with their unique wiring, not against it. 
                    This space was created to provide gentle, practical strategies for those overwhelming moments 
                    when everything feels too much.
                  </p>
                  <p>
                    Every strategy here is designed with ADHD-specific challenges in mind: executive dysfunction, 
                    sensory overwhelm, emotional dysregulation, and the beautiful complexity of neurodivergent thinking.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-serif text-foreground mb-4">Why "First Aid Kit"?</h2>
                  <p className="mb-4">
                    Just like a first aid kit provides immediate relief for physical injuries, this toolkit offers 
                    immediate support for emotional and cognitive overwhelm. These aren't long-term solutions or 
                    life overhauls—they're gentle interventions for right now.
                  </p>
                  <p>
                    Sometimes you just need something that works in the next 5 minutes, not the next 5 months.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-serif text-foreground mb-4">Built with Care</h2>
                  <p>
                    This platform was created by and for the ADHD community. Every design choice, from the calming 
                    color palette to the gentle language, was made with neurodivergent users in mind. We know that 
                    traditional productivity advice often doesn't work for ADHD brains, so we've curated strategies 
                    that actually do.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Page */}
        {currentStep === 'faq' && (
          <div className={`mobile-transition ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={navigateHome}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light mobile-button"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Back to home</span>
                </Button>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-6 leading-tight">
                  Frequently Asked Questions
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  Common questions about using the ADHD First Aid Kit
                </p>
              </div>

              <div className="space-y-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-serif text-foreground mb-3">How do I know which strategy to try?</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    Start with how you're feeling right now, then identify the specific issue you're facing and 
                    what's making it harder. The guided flow will help you find strategies tailored to your exact situation.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-serif text-foreground mb-3">What if a strategy doesn't work for me?</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    That's completely normal! ADHD brains are beautifully unique. Feel free to modify any strategy 
                    to fit your needs, or try a different one. The goal is finding what works for you, not following 
                    instructions perfectly.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-serif text-foreground mb-3">Can I save strategies for later?</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    Yes! Click the star icon on any strategy to save it to your personal toolkit. Your saved strategies 
                    are stored locally in your browser, so they'll be there whenever you need them.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-serif text-foreground mb-3">Is this a replacement for therapy or medication?</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    Not at all. This toolkit is designed to complement professional support, not replace it. These are 
                    gentle coping strategies for everyday moments, not medical or therapeutic interventions.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-serif text-foreground mb-3">How often should I use these strategies?</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    Whenever you need them! There's no "right" frequency. Some people use them daily, others only in 
                    crisis moments. Listen to your needs and use this toolkit in whatever way serves you best.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Page */}
        {currentStep === 'blog' && (
          <div className={`mobile-transition ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={navigateHome}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light mobile-button"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Back to home</span>
                </Button>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-6 leading-tight">
                  Blog & Resources
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  Insights, stories, and deeper dives into ADHD-friendly strategies
                </p>
              </div>

              <div className="space-y-8">
                {blogPosts.map((post, index) => (
                  <article 
                    key={post.id}
                    onClick={() => handleBlogPostClick(post)}
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 cursor-pointer hover:shadow-xl hover:bg-white/70 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 0.15}s`,
                      transform: isTransitioning ? 'translateY(30px)' : 'translateY(0)',
                      opacity: isTransitioning ? 0 : 1
                    }}
                  >
                    {post.featured && (
                      <div className="mb-4">
                        <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                          Featured
                        </span>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-xl font-serif text-foreground mb-3 leading-tight pr-4">
                        {post.title}
                      </h2>
                      <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-full font-light flex-shrink-0">
                        {post.readTime}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-light mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                      <div className="text-sm text-muted-foreground font-light">
                        {post.publishDate}
                      </div>
                    </div>
                  </article>
                ))}

                <div className="text-center py-8">
                  <p className="text-muted-foreground font-light italic">
                    More articles coming soon. We're taking our time to create content that truly serves the ADHD community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Terminology Page */}
        {currentStep === 'terminology' && (
          <div className={`mobile-transition ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={navigateHome}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light mobile-button"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Back to home</span>
                </Button>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-6 leading-tight">
                  ADHD Terminology
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  Understanding the language around ADHD in gentle, accessible terms
                </p>
              </div>

              <div className="space-y-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-3">Executive Function</h2>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    Think of this as your brain's "CEO" - the part that manages planning, organizing, 
                    time management, and decision-making. When executive function is struggling, 
                    everyday tasks can feel overwhelming.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-3">Hyperfocus</h2>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    When your ADHD brain finds something interesting, you might get completely absorbed 
                    for hours. It's like having tunnel vision for activities you enjoy - time seems to disappear.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-3">Rejection Sensitive Dysphoria (RSD)</h2>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    An intense emotional response to perceived rejection or criticism. Even small comments 
                    can feel devastating. It's not being "too sensitive" - it's a real neurological difference.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-3">Dopamine</h2>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    The brain's "reward chemical" that helps with motivation and focus. ADHD brains often 
                    have lower baseline dopamine, which is why we seek stimulating activities and struggle 
                    with "boring" tasks.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-3">Masking</h2>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    Hiding or suppressing ADHD traits to fit in or meet expectations. This can be exhausting 
                    and often leads to burnout. You're not "faking it" - you're working extra hard to appear neurotypical.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-3">Stimming</h2>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    Self-stimulating behaviors like fidgeting, tapping, or rocking that help regulate emotions 
                    and sensory input. These aren't "bad habits" - they're coping mechanisms that can actually help focus.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-3">Time Blindness</h2>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    Difficulty perceiving the passage of time. Five minutes and fifty minutes can feel the same. 
                    It's not about being lazy or irresponsible - your brain literally processes time differently.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-3">Object Permanence Issues</h2>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    "Out of sight, out of mind" taken to the extreme. If you can't see something, your brain 
                    might forget it exists entirely. This affects everything from relationships to remembering to eat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legal & Privacy Page */}
        {currentStep === 'legal' && (
          <div className={`mobile-transition ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={navigateHome}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light mobile-button"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Back to home</span>
                </Button>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-6 leading-tight">
                  Legal & Privacy Policy
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  Important information about using ADHD First Aid Kit
                </p>
              </div>

              <div className="space-y-8">
                {/* Medical Disclaimer */}
                <div className="bg-red-50/60 backdrop-blur-sm rounded-xl p-6 border border-red-200/30">
                  <h2 className="text-xl font-serif text-foreground mb-4 flex items-center">
                    <span className="mr-3">⚠️</span>
                    Medical Disclaimer
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed font-light">
                    <p className="text-base">
                      <strong>This website is NOT medical advice, therapy, or medication.</strong> The ADHD First Aid Kit provides educational content and peer-to-peer strategies for informational purposes only.
                    </p>
                    <p>
                      The strategies, tools, and information provided on this website are not intended to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Diagnose any medical or mental health condition</li>
                      <li>Treat, cure, or prevent any medical condition</li>
                      <li>Replace professional medical care or therapy</li>
                      <li>Substitute for prescribed medications or treatments</li>
                      <li>Provide professional mental health services</li>
                    </ul>
                    <p className="font-medium">
                      Always consult with qualified healthcare professionals before making any changes to your treatment plan, medication, or therapeutic approach.
                    </p>
                  </div>
                </div>

                {/* Emergency Resources */}
                <div className="bg-blue-50/60 backdrop-blur-sm rounded-xl p-6 border border-blue-200/30">
                  <h2 className="text-xl font-serif text-foreground mb-4">Crisis Resources</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed font-light">
                    <p>
                      If you are experiencing a mental health crisis or having thoughts of self-harm, please seek immediate help:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Emergency Services:</strong> Call 911 (US) or your local emergency number</li>
                      <li><strong>National Suicide Prevention Lifeline:</strong> 988 (US)</li>
                      <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                      <li>Contact your healthcare provider or go to your nearest emergency room</li>
                    </ul>
                  </div>
                </div>

                {/* Content Disclaimer */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-4">Content & Community Guidelines</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed font-light">
                    <p>
                      The strategies and content on this website represent:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Personal experiences shared by community members</li>
                      <li>Peer-to-peer support strategies</li>
                      <li>Educational information about ADHD</li>
                      <li>General wellness and coping techniques</li>
                    </ul>
                    <p>
                      <strong>Individual results may vary.</strong> What works for one person may not work for another. 
                      We encourage you to adapt strategies to fit your unique needs and circumstances.
                    </p>
                  </div>
                </div>

                {/* Privacy Policy */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-4">Privacy & Data</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed font-light">
                    <p>
                      We respect your privacy and are committed to protecting your personal information:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Local Storage:</strong> Your saved strategies and preferences are stored locally in your browser</li>
                      <li><strong>No Personal Data Collection:</strong> We do not collect, store, or share personal information</li>
                      <li><strong>No Tracking:</strong> We do not use tracking cookies or analytics that identify individual users</li>
                      <li><strong>Anonymous Usage:</strong> Any usage data collected is anonymous and aggregated</li>
                    </ul>
                    <p>
                      Your data remains private and under your control. You can clear your local data at any time through your browser settings.
                    </p>
                  </div>
                </div>

                {/* Limitation of Liability */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-4">Limitation of Liability</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed font-light">
                    <p>
                      By using this website, you acknowledge and agree that:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>You use the strategies and information at your own risk</li>
                      <li>The creators and contributors are not liable for any outcomes from using this content</li>
                      <li>This platform does not guarantee any specific results or improvements</li>
                      <li>You are responsible for your own health and safety decisions</li>
                    </ul>
                  </div>
                </div>

                {/* Contact & Updates */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-serif text-foreground mb-4">Updates & Contact</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed font-light">
                    <p>
                      This legal policy may be updated from time to time to reflect changes in our practices or legal requirements. 
                      We encourage you to review this page periodically.
                    </p>
                    <p>
                      <strong>Last Updated:</strong> December 2024
                    </p>
                    <p>
                      This website is a community resource created with care for the ADHD community. 
                      We believe in transparency, safety, and supporting each other while respecting the importance of professional healthcare.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Enhanced Footer with Legal Disclaimers */}
      <footer className="py-8 md:py-12 mt-12 md:mt-16 mobile-footer mobile-safe-area bg-white/30 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Medical Disclaimer - Prominent */}
          <div className="text-center mb-8 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
            <h3 className="text-lg font-serif text-foreground mb-4">⚠️ Important Medical Disclaimer</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light max-w-4xl mx-auto">
              <strong>This website is not medical advice, therapy, or medication.</strong> The strategies and information provided are for educational and supportive purposes only. 
              They are not intended to diagnose, treat, cure, or prevent any medical condition. Always consult with qualified healthcare professionals 
              before making any changes to your treatment plan, medication, or therapeutic approach.
            </p>
          </div>

          {/* Footer Links and Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div className="text-center md:text-left">
              <h4 className="text-base font-serif text-foreground mb-3">About ADHD First Aid Kit</h4>
              <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed font-light">
                A gentle space with peer-to-peer strategies designed specifically for ADHD minds during overwhelming moments.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h4 className="text-base font-serif text-foreground mb-3">Quick Links</h4>
              <div className="space-y-2">
                <button
                  onClick={() => navigateToPage('about')}
                  className="block mx-auto text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-light"
                >
                  About
                </button>
                <button
                  onClick={() => navigateToPage('faq')}
                  className="block mx-auto text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-light"
                >
                  FAQ
                </button>
                <button
                  onClick={() => navigateToPage('legal')}
                  className="block mx-auto text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-light"
                >
                  Legal & Privacy
                </button>
              </div>
            </div>

            {/* Community */}
            <div className="text-center md:text-right">
              <h4 className="text-base font-serif text-foreground mb-3">Community</h4>
              <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed font-light">
                Built with care by and for the ADHD community. Your experiences and feedback help make this toolkit better.
              </p>
            </div>
          </div>

          {/* Bottom Legal Text */}
          <div className="text-center pt-6 border-t border-white/20">
            <p className="text-xs text-muted-foreground/60 font-light leading-relaxed max-w-4xl mx-auto mb-3">
              The content on this website represents personal experiences and community-shared strategies. Individual results may vary. 
              This platform does not replace professional medical care, therapy, or prescribed medications. If you are experiencing a mental health crisis, 
              please contact your healthcare provider or emergency services immediately.
            </p>
            <p className="text-xs text-muted-foreground/60 font-light italic">
              © 2024 ADHD First Aid Kit • Built with care for the ADHD community
            </p>
          </div>
        </div>
      </footer>

      {/* Full-Screen Strategy Modal */}
      {showStrategyModal && selectedStrategy && (
        <div className="fixed inset-0 z-50 strategy-modal-overlay">
          <div className="strategy-modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeStrategyModal}></div>
          
          <div className="strategy-modal-container relative z-10 min-h-screen flex items-center justify-center p-4">
            <div className="strategy-modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
              {/* Modal Header */}
              <div className="strategy-modal-header sticky top-0 bg-white/90 backdrop-blur-lg border-b border-white/20 p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={closeStrategyModal}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 p-2"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    <span className="text-sm">Back to strategies</span>
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  onClick={closeStrategyModal}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="strategy-modal-body p-6 md:p-8 lg:p-12">
                <div className="max-w-3xl mx-auto">
                  {/* Strategy Header */}
                  <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                        {selectedStrategy.category}
                      </span>
                      {selectedStrategy.featured && (
                        <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full font-light">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-6 leading-tight">
                      {selectedStrategy.name}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                      {selectedStrategy.description}
                    </p>
                  </div>

                  {/* Strategy Details */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-serif text-foreground mb-4">How to use this strategy</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      <p className="leading-relaxed font-light mb-4">
                        This gentle approach is designed specifically for ADHD minds. Take your time with each step, 
                        and remember that it's okay to modify this strategy to fit your unique needs and circumstances.
                      </p>
                      <p className="leading-relaxed font-light">
                        The key is to start small and be kind to yourself throughout the process. Every small step 
                        forward is a victory worth celebrating.
                      </p>
                    </div>
                  </div>

                  {/* Tags and Metadata */}
                  <div className="mb-8">
                    <h3 className="text-lg font-serif text-foreground mb-3">Related topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStrategy.tags.map((tag) => (
                        <span key={tag} className="text-sm bg-muted/50 text-muted-foreground px-3 py-1 rounded-full font-light">
                          {tag}
                        </span>
                      ))}
                      <span className="text-sm bg-muted/30 text-muted-foreground px-3 py-1 rounded-full font-light">
                        {selectedStrategy.price}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-muted/20">
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-muted-foreground hover:text-primary transition-colors duration-300 font-light p-4"
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      <span>{selectedStrategy.voteCount} found this helpful</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-muted-foreground hover:text-accent transition-colors duration-300 font-light p-4"
                    >
                      <Star className="h-5 w-5 mr-3" />
                      <span>Save to my toolkit</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-muted-foreground hover:text-foreground transition-colors duration-300 font-light p-4"
                    >
                      <ExternalLink className="h-5 w-5 mr-3" />
                      <span>Share strategy</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Blog Post Modal */}
      {showBlogModal && selectedBlogPost && (
        <div className="fixed inset-0 z-50 strategy-modal-overlay">
          <div className="strategy-modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeBlogModal}></div>
          
          <div className="strategy-modal-container relative z-10 min-h-screen flex items-center justify-center p-4">
            <div className="strategy-modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
              {/* Modal Header */}
              <div className="strategy-modal-header sticky top-0 bg-white/90 backdrop-blur-lg border-b border-white/20 p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={closeBlogModal}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 p-2"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    <span className="text-sm">Back to blog</span>
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  onClick={closeBlogModal}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="strategy-modal-body p-6 md:p-8 lg:p-12">
                <div className="max-w-3xl mx-auto">
                  {/* Blog Post Header */}
                  <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                        {selectedBlogPost.category}
                      </span>
                      {selectedBlogPost.featured && (
                        <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full font-light">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-6 leading-tight">
                      {selectedBlogPost.title}
                    </h1>
                    
                    <div className="flex items-center space-x-4 mb-6 text-sm text-muted-foreground">
                      <span>{selectedBlogPost.readTime}</span>
                      <span>•</span>
                      <span>{selectedBlogPost.publishDate}</span>
                    </div>
                    
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                      {selectedBlogPost.excerpt}
                    </p>
                  </div>

                  {/* Blog Post Content */}
                  <div className="mb-8">
                    <div 
                      className="prose prose-lg max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: selectedBlogPost.content }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-muted/20">
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-muted-foreground hover:text-primary transition-colors duration-300 font-light p-4"
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      <span>Found this helpful</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-muted-foreground hover:text-accent transition-colors duration-300 font-light p-4"
                    >
                      <Star className="h-5 w-5 mr-3" />
                      <span>Save article</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-muted-foreground hover:text-foreground transition-colors duration-300 font-light p-4"
                    >
                      <ExternalLink className="h-5 w-5 mr-3" />
                      <span>Share article</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

