'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Star, RefreshCw, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Quizzes data with full content
const quizzesData = [
  {
    name: 'Structure Type Archetype Quiz',
    category: 'Self-Understanding',
    emoji: '🏗️',
    slug: 'structure-type-archetype-quiz',
    content: {
      intro: "Discover your personal structure style to create systems that actually work for your ADHD brain.",
      questions: [
        {
          question: "When planning your day, what feels most helpful?",
          options: [
            { text: "A detailed schedule with specific times", score: 'rigid' },
            { text: "A loose list of things to accomplish", score: 'flexible' },
            { text: "A few key priorities with lots of buffer time", score: 'minimal' },
            { text: "Just going with the flow", score: 'freeform' }
          ]
        },
        {
          question: "How do you prefer to organize your physical space?",
          options: [
            { text: "Everything in its designated place", score: 'rigid' },
            { text: "Organized but with some flexibility", score: 'flexible' },
            { text: "A few key areas organized, rest is flexible", score: 'minimal' },
            { text: "Organized chaos that makes sense to me", score: 'freeform' }
          ]
        },
        {
          question: "When you have a big project, you typically:",
          options: [
            { text: "Break it down into detailed steps with deadlines", score: 'rigid' },
            { text: "Create a general plan but adapt as needed", score: 'flexible' },
            { text: "Identify key milestones and work toward them", score: 'minimal' },
            { text: "Start working and figure it out as I go", score: 'freeform' }
          ]
        }
      ],
      results: {
        rigid: {
          title: "The Structure Lover",
          description: "You thrive with clear, detailed systems and consistent routines. Your ADHD brain loves the predictability and external framework that rigid structure provides.",
          tips: [
            "Use detailed calendars and task management systems",
            "Create specific routines for daily activities",
            "Set up your environment to support consistent habits",
            "Build in buffer time to account for ADHD time optimism"
          ]
        },
        flexible: {
          title: "The Adaptive Organizer",
          description: "You need some structure but require flexibility to adapt when your ADHD brain needs a different approach. You like frameworks that can bend without breaking.",
          tips: [
            "Use systems with built-in flexibility (time blocks vs. specific appointments)",
            "Create 'good enough' organizational systems that are easy to maintain",
            "Plan for Plan B options in your routines",
            "Focus on systems that support your energy levels and attention patterns"
          ]
        },
        minimal: {
          title: "The Essential Structurer",
          description: "You prefer just enough structure to stay functional without feeling constrained. Too much structure feels overwhelming, too little feels chaotic.",
          tips: [
            "Focus on 2-3 key organizational systems rather than trying to organize everything",
            "Use simple tools and avoid complex productivity systems",
            "Create structure around your most important priorities only",
            "Build habits gradually, one at a time"
          ]
        },
        freeform: {
          title: "The Flow Follower",
          description: "Traditional structure feels constraining to your ADHD brain. You work best when you can follow your natural rhythms and energy patterns.",
          tips: [
            "Work with your natural energy and attention patterns",
            "Use flexible capture systems for ideas and tasks",
            "Focus on outcomes rather than specific processes",
            "Create 'structure' through environmental design rather than rigid systems"
          ]
        }
      }
    }
  },
  {
    name: 'Sleep Calculator (9 Hours in Bed)',
    category: 'Sleep Hygiene',
    emoji: '😴',
    slug: 'sleep-calculator-9-hours-in-bed',
    content: {
      intro: "Calculate your optimal bedtime for 9 hours in bed, accounting for ADHD sleep challenges.",
      questions: [
        {
          question: "What time do you need to wake up?",
          type: "time",
          key: "wakeTime"
        },
        {
          question: "How long does it typically take you to fall asleep?",
          options: [
            { text: "Less than 15 minutes", score: 15 },
            { text: "15-30 minutes", score: 30 },
            { text: "30-60 minutes", score: 60 },
            { text: "More than 60 minutes", score: 90 }
          ]
        },
        {
          question: "Do you typically wake up during the night?",
          options: [
            { text: "No, I sleep through", score: 0 },
            { text: "Once briefly", score: 15 },
            { text: "2-3 times", score: 30 },
            { text: "Multiple times", score: 45 }
          ]
        }
      ],
      calculator: true
    }
  },
  {
    name: 'Verbal Processor vs Other Types',
    category: 'Cognitive Style Insight',
    emoji: '🗣️',
    slug: 'verbal-processor-vs-other-types',
    content: {
      intro: "Understand how your brain processes information to optimize your learning and communication strategies.",
      questions: [
        {
          question: "When learning something new, you prefer to:",
          options: [
            { text: "Talk through it out loud or with someone", score: 'verbal' },
            { text: "Read about it and take notes", score: 'visual' },
            { text: "Try it hands-on immediately", score: 'kinesthetic' },
            { text: "Think about it quietly first", score: 'internal' }
          ]
        },
        {
          question: "When problem-solving, you typically:",
          options: [
            { text: "Talk through the problem out loud", score: 'verbal' },
            { text: "Write it down or draw it out", score: 'visual' },
            { text: "Fidget or move while thinking", score: 'kinesthetic' },
            { text: "Think through it in your head", score: 'internal' }
          ]
        },
        {
          question: "When you're feeling overwhelmed, what helps most?",
          options: [
            { text: "Talking to someone about it", score: 'verbal' },
            { text: "Making lists or visual organizers", score: 'visual' },
            { text: "Going for a walk or doing something physical", score: 'kinesthetic' },
            { text: "Having quiet time to think", score: 'internal' }
          ]
        }
      ],
      results: {
        verbal: {
          title: "Verbal Processor",
          description: "You think out loud and process information best through speaking and hearing. Your ADHD brain uses verbal processing as a key tool for focus and understanding.",
          tips: [
            "Use voice memos for capturing thoughts and ideas",
            "Study with background music or in slightly noisy environments",
            "Talk through problems with others or even with yourself",
            "Use verbal rehearsal for important information"
          ]
        },
        visual: {
          title: "Visual Processor",
          description: "You process information best through seeing and visualizing. Your ADHD brain benefits from visual organization and representation of ideas.",
          tips: [
            "Use mind maps, charts, and visual organizers",
            "Color-code your systems and notes",
            "Create visual reminders and cues in your environment",
            "Use visual timers and progress tracking"
          ]
        },
        kinesthetic: {
          title: "Kinesthetic Processor",
          description: "You process information best through movement and hands-on experience. Your ADHD brain needs physical engagement to maintain focus and understanding.",
          tips: [
            "Use fidget tools while working or listening",
            "Take movement breaks regularly",
            "Try standing or walking meetings when possible",
            "Use physical manipulatives for learning and planning"
          ]
        },
        internal: {
          title: "Internal Processor",
          description: "You process information best through quiet reflection and internal dialogue. Your ADHD brain needs space to think without external stimulation.",
          tips: [
            "Create quiet spaces for focused work",
            "Use written reflection for processing complex information",
            "Build in processing time after meetings or learning",
            "Practice meditation or mindfulness techniques"
          ]
        }
      }
    }
  },
  {
    name: 'Self-Care Type Quiz',
    category: 'Personalized Support',
    emoji: '💆‍♀️',
    slug: 'self-care-type-quiz',
    content: {
      intro: "Discover your personal self-care style to create sustainable wellness practices that work with your ADHD.",
      questions: [
        {
          question: "When you're feeling stressed, what sounds most appealing?",
          options: [
            { text: "Being around supportive people", score: 'social' },
            { text: "Having time completely alone", score: 'solitary' },
            { text: "Doing something active or physical", score: 'active' },
            { text: "Engaging in a creative hobby", score: 'creative' }
          ]
        },
        {
          question: "What type of environment helps you recharge?",
          options: [
            { text: "Busy, energetic places with lots of people", score: 'social' },
            { text: "Quiet, peaceful spaces with minimal stimulation", score: 'solitary' },
            { text: "Outdoor spaces or places where I can move around", score: 'active' },
            { text: "Inspiring spaces with interesting things to look at", score: 'creative' }
          ]
        },
        {
          question: "Your ideal weekend includes:",
          options: [
            { text: "Spending time with friends or family", score: 'social' },
            { text: "Having no plans and doing whatever feels right", score: 'solitary' },
            { text: "Outdoor activities or exercise", score: 'active' },
            { text: "Working on projects or trying new things", score: 'creative' }
          ]
        }
      ],
      results: {
        social: {
          title: "Social Self-Care",
          description: "You recharge through connection with others. Your ADHD brain benefits from the external stimulation and support that social interaction provides.",
          tips: [
            "Schedule regular friend dates or family time",
            "Join groups or communities around your interests",
            "Use body doubling for difficult tasks",
            "Practice asking for support when you need it"
          ]
        },
        solitary: {
          title: "Solitary Self-Care",
          description: "You recharge through quiet time alone. Your ADHD brain needs space away from stimulation to reset and process.",
          tips: [
            "Protect your alone time and treat it as essential",
            "Create calm, low-stimulation spaces in your home",
            "Use solo activities like reading, meditation, or baths",
            "Learn to say no to social obligations when you need to recharge"
          ]
        },
        active: {
          title: "Active Self-Care",
          description: "You recharge through physical movement and activity. Your ADHD brain uses exercise and movement as key tools for regulation.",
          tips: [
            "Build movement into your daily routine",
            "Use exercise as a transition between activities",
            "Try outdoor activities that combine nature and movement",
            "Use active hobbies as stress relief"
          ]
        },
        creative: {
          title: "Creative Self-Care",
          description: "You recharge through creative expression and stimulation. Your ADHD brain thrives on novelty and the flow state that creative activities provide.",
          tips: [
            "Keep creative supplies easily accessible",
            "Rotate between different creative hobbies to maintain interest",
            "Use creative activities as transitions or breaks",
            "Don't pressure yourself to be 'good' - focus on the process"
          ]
        }
      }
    }
  },
  {
    name: 'Time Blindness Calculator',
    category: 'Time Awareness',
    emoji: '⏰',
    slug: 'time-blindness-calculator',
    content: {
      intro: "Assess your time blindness patterns and get personalized strategies for better time management.",
      questions: [
        {
          question: "How often do you underestimate how long tasks will take?",
          options: [
            { text: "Rarely", score: 1 },
            { text: "Sometimes", score: 2 },
            { text: "Often", score: 3 },
            { text: "Almost always", score: 4 }
          ]
        },
        {
          question: "How often are you late to appointments?",
          options: [
            { text: "Rarely", score: 1 },
            { text: "Sometimes", score: 2 },
            { text: "Often", score: 3 },
            { text: "Almost always", score: 4 }
          ]
        },
        {
          question: "How aware are you of time passing during focused work?",
          options: [
            { text: "Very aware", score: 1 },
            { text: "Somewhat aware", score: 2 },
            { text: "Often lose track", score: 3 },
            { text: "Completely unaware", score: 4 }
          ]
        }
      ],
      results: {
        'low': {
          title: "Mild Time Blindness",
          description: "You have some time awareness challenges but they're generally manageable with basic strategies.",
          tips: [
            "Use visual timers for focused work sessions",
            "Add buffer time to your estimates",
            "Set reminders 15 minutes before leaving",
            "Track how long common tasks actually take"
          ]
        },
        'medium': {
          title: "Moderate Time Blindness",
          description: "Time awareness is a significant challenge that affects your daily life. You need structured support systems.",
          tips: [
            "Use time-blocking in your calendar",
            "Set multiple alarms for important transitions",
            "Have someone else help you estimate task duration",
            "Use external time cues like scheduled breaks"
          ]
        },
        'high': {
          title: "Significant Time Blindness",
          description: "Time awareness is a major challenge requiring comprehensive support strategies and external structures.",
          tips: [
            "Use accountability partners for important deadlines",
            "Build extensive buffer time into all plans",
            "Use location-based reminders",
            "Consider medication evaluation if not already done"
          ]
        }
      }
    }
  },
  {
    name: 'Root Cause Quiz – Why Don\'t You Want to Shower?',
    category: 'Motivation Insight',
    emoji: '🚿',
    slug: 'root-cause-quiz-why-dont-you-want-to-shower',
    content: {
      intro: "Understand the real reasons behind hygiene avoidance to find solutions that actually work for your brain.",
      questions: [
        {
          question: "What bothers you most about showering?",
          options: [
            { text: "The transition/stopping what I'm doing", score: 'transition' },
            { text: "The physical sensations (water, temperature, etc.)", score: 'sensory' },
            { text: "It takes too long", score: 'time' },
            { text: "I forget or don't notice I need to", score: 'awareness' }
          ]
        },
        {
          question: "When do you most avoid showering?",
          options: [
            { text: "When I'm in a flow state or hyperfocused", score: 'transition' },
            { text: "When I'm already overstimulated", score: 'sensory' },
            { text: "When I have a lot to do", score: 'time' },
            { text: "When my routine is disrupted", score: 'awareness' }
          ]
        },
        {
          question: "What would make showering easier?",
          options: [
            { text: "Better timing and reminders", score: 'transition' },
            { text: "More comfortable water temperature/pressure", score: 'sensory' },
            { text: "Faster routines or all-in-one products", score: 'time' },
            { text: "Better habits and environmental cues", score: 'awareness' }
          ]
        }
      ],
      results: {
        transition: {
          title: "Transition Difficulty",
          description: "Your main challenge is stopping what you're doing and transitioning to showering. This is a common ADHD executive function challenge.",
          tips: [
            "Set a timer to remind yourself to shower before getting too focused",
            "Use transition rituals (like gathering shower items) to ease the switch",
            "Shower at consistent times to build automatic habits",
            "Use the 'just wash your face' rule to start smaller"
          ]
        },
        sensory: {
          title: "Sensory Challenges",
          description: "The physical sensations of showering are overwhelming or uncomfortable for your nervous system.",
          tips: [
            "Experiment with water temperature and pressure settings",
            "Use shower tools like loofahs or brushes for different sensations",
            "Try gradual exposure (start with just getting wet)",
            "Consider sensory-friendly shower products (unscented, gentle textures)"
          ]
        },
        time: {
          title: "Time Management Issues",
          description: "Showering feels like it takes too long or interrupts your schedule too much.",
          tips: [
            "Create a 5-minute 'good enough' shower routine",
            "Use combination products (2-in-1 shampoo/conditioner)",
            "Time yourself to see how long it actually takes",
            "Shower at times when you're not rushed"
          ]
        },
        awareness: {
          title: "Awareness and Memory",
          description: "You often forget to shower or don't notice when you need to. This is related to ADHD interoception challenges.",
          tips: [
            "Set daily alarms or phone reminders",
            "Put visual cues in your environment",
            "Use a habit tracker or shower schedule",
            "Ask trusted people to gently remind you if needed"
          ]
        }
      }
    }
  }
]

interface QuizPageProps {
  params: Promise<{ slug: string }>
}

export default function QuizPage({ params }: QuizPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null)
  const [quiz, setQuiz] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)

      const foundQuiz = quizzesData.find(q => q.slug === resolved.slug)
      setQuiz(foundQuiz)
    }

    resolveParams()
  }, [params])

  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQuestion < quiz.content.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult(newAnswers)
    }
  }

  const calculateResult = (finalAnswers: any[]) => {
    if (quiz.content.calculator) {
      // Handle calculator-type quizzes differently
      setShowResults(true)
      return
    }

    // For regular quizzes, count scores
    const scores: { [key: string]: number } = {}
    finalAnswers.forEach(answer => {
      if (typeof answer.score === 'string') {
        scores[answer.score] = (scores[answer.score] || 0) + 1
      } else if (typeof answer.score === 'number') {
        const total = finalAnswers.reduce((sum, a) => sum + (typeof a.score === 'number' ? a.score : 0), 0)
        const category = total <= 6 ? 'low' : total <= 9 ? 'medium' : 'high'
        setResult(quiz.content.results[category])
        setShowResults(true)
        return
      }
    })

    const topScore = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b)
    setResult(quiz.content.results[topScore])
    setShowResults(true)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setResult(null)
  }

  const goBack = () => {
    window.history.back()
  }

  if (!resolvedParams || !quiz) {
    return (
      <div className="min-h-screen bg-[#E0F5CE] dark:bg-[#2D4A2A] relative flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Quiz Not Found</h1>
          <p className="text-black/70 dark:text-white/70 mb-6">
            The quiz you're looking for doesn't exist or hasn't been created yet.
          </p>
          <Button
            onClick={goBack}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E0F5CE] dark:bg-[#2D4A2A] relative">
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={goBack}
              className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-black dark:text-white" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl">{quiz.emoji}</span>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-black text-center">
                  {quiz.name}
                </h1>
              </div>
              <p className="text-center text-black/70 text-sm">
                {quiz.category}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="backdrop-blur-md bg-white/20 dark:bg-black/20 rounded-3xl p-8">
          {!showResults ? (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-black/70 dark:text-white/70 mb-2">
                  <span>Question {currentQuestion + 1} of {quiz.content.questions.length}</span>
                  <span>{Math.round((currentQuestion / quiz.content.questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-black/20 dark:bg-white/20 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentQuestion / quiz.content.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Introduction (only on first question) */}
              {currentQuestion === 0 && (
                <div className="mb-8">
                  <p className="text-black dark:text-white text-lg leading-relaxed">
                    {quiz.content.intro}
                  </p>
                </div>
              )}

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-6">
                  {quiz.content.questions[currentQuestion].question}
                </h2>

                {quiz.content.questions[currentQuestion].type === 'time' ? (
                  <input
                    type="time"
                    className="w-full p-4 rounded-xl bg-white/30 dark:bg-black/30 text-black dark:text-white"
                    onChange={(e) => handleAnswer({ [quiz.content.questions[currentQuestion].key]: e.target.value })}
                  />
                ) : (
                  <div className="space-y-4">
                    {quiz.content.questions[currentQuestion].options.map((option: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="w-full p-4 text-left bg-white/30 dark:bg-black/30 hover:bg-white/40 dark:hover:bg-black/40 rounded-xl transition-all duration-200 text-black dark:text-white"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="text-center mb-8">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                  Your Result: {result?.title}
                </h2>
                <p className="text-black/80 dark:text-white/80 text-lg leading-relaxed mb-8">
                  {result?.description}
                </p>

                {result?.tips && (
                  <div className="bg-white/30 dark:bg-black/30 rounded-2xl p-6 text-left">
                    <h3 className="font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Personalized Tips
                    </h3>
                    <ul className="space-y-3">
                      {result.tips.map((tip: string, index: number) => (
                        <li key={index} className="text-black/80 dark:text-white/80 flex items-start gap-3">
                          <span className="text-green-600 font-bold mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-4 justify-center mt-8">
                  <Button
                    onClick={resetQuiz}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retake Quiz
                  </Button>
                  <Button
                    onClick={() => {
                      const resultText = `${quiz.name}\n\nYour Result: ${result?.title}\n\n${result?.description}\n\nTips:\n${result?.tips?.map((tip: string) => `• ${tip}`).join('\n') || ''}`
                      if (navigator.share) {
                        navigator.share({
                          title: quiz.name,
                          text: resultText,
                        })
                      } else {
                        navigator.clipboard.writeText(resultText)
                      }
                    }}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Save Results
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}