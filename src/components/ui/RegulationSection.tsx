'use client'

import { useState, useEffect } from 'react'
import { Plus, Minus, Sparkles, Wind, Eye, Home, Heart, Brain, Clock, CheckCircle, X, Monitor, Lightbulb, Volume2, Thermometer, Zap, HandIcon, Droplets, Activity, Footprints, RotateCcw, Target, Lightbulb as BulbIcon, Star } from 'lucide-react'

interface RegulationSectionProps {
  barrierType?: string
  customTitle?: string
  customContent?: React.ReactNode
}

export default function RegulationSection({ 
  barrierType = "default",
  customTitle = "First: Ground & Reset",
  customContent
}: RegulationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedSubSections, setExpandedSubSections] = useState<{[key: string]: boolean}>({
    environment: false,
    reset: false,
    ground: false,
    values: false
  })
  const [completedTechniques, setCompletedTechniques] = useState<Set<string>>(new Set())
  const [activeTimer, setActiveTimer] = useState<{type: string, seconds: number} | null>(null)
  const [activeValuesQuestion, setActiveValuesQuestion] = useState<'quick' | 'deeper' | null>(null)

  const toggleSubSection = (section: string) => {
    setExpandedSubSections(prev => {
      // Close all sections first
      const allClosed = {
        environment: false,
        reset: false,
        ground: false,
        values: false
      }
      
      // If the clicked section was already open, keep it closed
      // If it was closed, open only that section
      if (prev[section]) {
        return allClosed // Keep all closed
      } else {
        return {
          ...allClosed,
          [section]: true // Open only the clicked section
        }
      }
    })
  }

  const markTechniqueComplete = (techniqueId: string) => {
    setCompletedTechniques(prev => new Set([...prev, techniqueId]))
  }

  const startTimer = (type: string, duration: number) => {
    setActiveTimer({ type, seconds: duration })
  }

  // Timer countdown effect
  useEffect(() => {
    if (activeTimer && activeTimer.seconds > 0) {
      const timer = setTimeout(() => {
        setActiveTimer(prev => prev ? { ...prev, seconds: prev.seconds - 1 } : null)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (activeTimer && activeTimer.seconds === 0) {
      // Timer finished - mark as complete
      markTechniqueComplete(activeTimer.type)
      setActiveTimer(null)
    }
  }, [activeTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
  }

  const getContextualValuesQuestion = (type: 'why' | 'outcome' | 'strength' | 'impact', barrier?: string) => {
    const barrierKey = barrier?.toLowerCase().replace(/['']/g, '').replace(/\s+/g, '-') || 'default'
    
    const questions = {
      'i-cant-stay-focused': {
        why: "What's worth your focused attention right now?",
        outcome: "How will completing this help you feel more in control?",
        strength: "What focus superpower do you have when it matters?",
        impact: "Who benefits when you can focus on what matters?"
      },
      'i-dont-have-energy': {
        why: "What gives this task meaning beyond just getting it done?",
        outcome: "How will finishing this restore your energy?",
        strength: "When have you pushed through low energy before?",
        impact: "Who depends on you showing up, even when tired?"
      },
      'i-dont-know-how': {
        why: "What makes learning this skill worthwhile?",
        outcome: "How will figuring this out help you grow?",
        strength: "What's one thing you've learned recently that seemed impossible?",
        impact: "Who could you help once you master this?"
      },
      'i-cant-start': {
        why: "What's the first small win you're hoping for?",
        outcome: "How will starting this reduce your mental load?",
        strength: "What's your best strategy for just beginning?",
        impact: "Who cheers you on when you take action?"
      },
      'default': {
        why: "What makes this worth your time and energy?",
        outcome: "How will completing this serve your goals?",
        strength: "What personal strength will help you here?",
        impact: "Who benefits when you follow through?"
      }
    }

    return questions[barrierKey as keyof typeof questions]?.[type] || questions.default[type]
  }

  const defaultContent = (
    <div className="space-y-4">
      {/* Professional intro */}
      <div className="mb-6 p-4 bg-gradient-to-br from-slate-50/40 to-gray-50/40 dark:from-slate-800/30 dark:to-gray-800/30 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Take a moment to <span className="font-medium text-slate-900 dark:text-slate-100">ground yourself</span> before continuing. 
          Choose what feels most helpful right now.
        </p>
      </div>


      {/* Circular Selection Interface */}
      <div className="flex flex-col items-center">
        {/* Circular Options */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => toggleSubSection('environment')}
            className={`relative w-16 h-16 rounded-full transition-all duration-300 flex flex-col items-center justify-center ${
              expandedSubSections.environment 
                ? 'bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 shadow-lg scale-110' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:scale-105'
            }`}
          >
            <Monitor className="h-5 w-5" />
            {completedTechniques.has('environment') && (
              <div className="absolute -top-1 -right-1">
                <CheckCircle className="h-4 w-4 text-emerald-500 bg-white rounded-full" />
              </div>
            )}
          </button>

          <button
            onClick={() => toggleSubSection('reset')}
            className={`relative w-16 h-16 rounded-full transition-all duration-300 flex flex-col items-center justify-center ${
              expandedSubSections.reset 
                ? 'bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 shadow-lg scale-110' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:scale-105'
            }`}
          >
            <Zap className="h-5 w-5" />
            {completedTechniques.has('reset') && (
              <div className="absolute -top-1 -right-1">
                <CheckCircle className="h-4 w-4 text-emerald-500 bg-white rounded-full" />
              </div>
            )}
          </button>

          <button
            onClick={() => toggleSubSection('ground')}
            className={`relative w-16 h-16 rounded-full transition-all duration-300 flex flex-col items-center justify-center ${
              expandedSubSections.ground 
                ? 'bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 shadow-lg scale-110' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:scale-105'
            }`}
          >
            <Brain className="h-5 w-5" />
          </button>

          <button
            onClick={() => toggleSubSection('values')}
            className={`relative w-16 h-16 rounded-full transition-all duration-300 flex flex-col items-center justify-center ${
              expandedSubSections.values 
                ? 'bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 shadow-lg scale-110' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:scale-105'
            }`}
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* Labels */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <div className="w-16 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Environment</p>
          </div>
          <div className="w-16 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Reset</p>
          </div>
          <div className="w-16 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Ground</p>
          </div>
          <div className="w-16 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Values</p>
          </div>
        </div>

        {/* Selected Content Area */}
        <div className="w-full max-w-2xl">
          {/* Environment Assessment */}
          {expandedSubSections.environment && (
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6 animate-in slide-in-from-top duration-300">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 text-center">Environment Assessment</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 text-center">Optimize your workspace</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => markTechniqueComplete('workspace')}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    completedTechniques.has('workspace') 
                      ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                      : 'bg-slate-50/80 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 hover:bg-slate-100/80 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
                      <Monitor className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Workspace</span>
                    {completedTechniques.has('workspace') && (
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Clear and organize</p>
                </button>
                
                <button 
                  onClick={() => markTechniqueComplete('lighting')}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    completedTechniques.has('lighting') 
                      ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                      : 'bg-slate-50/80 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 hover:bg-slate-100/80 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Lighting</span>
                    {completedTechniques.has('lighting') && (
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Adjust brightness</p>
                </button>
                
                <button 
                  onClick={() => markTechniqueComplete('sound')}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    completedTechniques.has('sound') 
                      ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                      : 'bg-slate-50/80 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 hover:bg-slate-100/80 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
                      <Volume2 className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Audio</span>
                    {completedTechniques.has('sound') && (
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Manage noise</p>
                </button>
                
                <button 
                  onClick={() => markTechniqueComplete('temperature')}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    completedTechniques.has('temperature') 
                      ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                      : 'bg-slate-50/80 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 hover:bg-slate-100/80 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
                      <Thermometer className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Temperature</span>
                    {completedTechniques.has('temperature') && (
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Adjust comfort</p>
                </button>
              </div>
            </div>
          )}

          {/* Physical Reset */}
          {expandedSubSections.reset && (
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6 animate-in slide-in-from-top duration-300">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 text-center">Physical Reset</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
                Pick what feels good right now (timer will help guide you)
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => activeTimer?.type === 'breathing' ? setActiveTimer(null) : startTimer('breathing', 30)}
                  className={`group p-3 rounded-xl border transition-all hover:scale-105 ${
                    activeTimer?.type === 'breathing' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' 
                      : completedTechniques.has('breathing')
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                      : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    {activeTimer?.type === 'breathing' && (
                      <div className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(activeTimer.seconds)}
                      </div>
                    )}
                    {completedTechniques.has('breathing') && !activeTimer && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {activeTimer?.type === 'breathing' ? 'Breathing...' : '3 Deep Breaths'}
                  </p>
                </button>
                
                <button className="group bg-slate-50/80 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
                      <HandIcon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Shake Hands</span>
                  </div>
                </button>
                
                <button className="group bg-slate-50/80 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
                      <Droplets className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Sip Water</span>
                  </div>
                </button>
                
                <button className="group bg-slate-50/80 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
                        <Monitor className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Look Outside</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Grounding Techniques */}
          {expandedSubSections.ground && (
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6 animate-in slide-in-from-top duration-300">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 text-center">Ground Yourself</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">Nervous system calming - pick one</p>
              
              <div className="space-y-3">
                <div className="bg-purple-50/30 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-200/30 dark:border-purple-800/30 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">5-4-3-2-1 Senses</p>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                        <p>• <strong>5</strong> things you can see</p>
                        <p>• <strong>4</strong> things you can hear</p>
                        <p>• <strong>3</strong> things you can feel/touch</p>
                        <p>• <strong>2</strong> things you can smell</p>
                        <p>• <strong>1</strong> thing you can taste</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-indigo-50/30 dark:bg-indigo-900/10 p-3 rounded-xl border border-indigo-200/30 dark:border-indigo-800/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mt-0.5">
                        <Footprints className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">Feet on Ground</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Press firmly, feel connection</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-teal-50/30 dark:bg-teal-900/10 p-3 rounded-xl border border-teal-200/30 dark:border-teal-800/30 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-md bg-teal-100 dark:bg-teal-800 flex items-center justify-center mt-0.5">
                        <HandIcon className="h-4 w-4 text-teal-600 dark:text-teal-300" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">Squeeze & Release</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Tense hands, then let go</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-rose-50/30 dark:bg-rose-900/10 p-3 rounded-xl border border-rose-200/30 dark:border-rose-800/30 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-md bg-rose-100 dark:bg-rose-800 flex items-center justify-center mt-0.5">
                        <RotateCcw className="h-4 w-4 text-rose-600 dark:text-rose-300" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">Shoulder Rolls</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Roll back slowly, release tension</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Values Check */}
          {expandedSubSections.values && (
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6 animate-in slide-in-from-top duration-300">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 text-center">Connect to Your Why</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">Quick motivation check</p>
              
              <div className="bg-gradient-to-br from-red-50/30 to-pink-50/30 dark:from-red-900/10 dark:to-pink-900/10 p-5 rounded-xl border border-red-200/30 dark:border-red-800/30">
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Just pick one question that resonates (or skip this entirely!)
                  </p>
                </div>
                
                {/* Simple one-at-a-time reveal */}
                {!activeValuesQuestion ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-4">
                      Quick motivation check - choose what feels right:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveValuesQuestion('quick')}
                        className="p-4 bg-red-100/50 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-800/50 hover:bg-red-100/70 dark:hover:bg-red-900/30 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-800 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-red-600 dark:text-red-300" />
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">Quick Why</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">One simple question</p>
                      </button>
                      
                      <button
                        onClick={() => setActiveValuesQuestion('deeper')}
                        className="p-4 bg-red-100/50 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-800/50 hover:bg-red-100/70 dark:hover:bg-red-900/30 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-800 flex items-center justify-center">
                            <Star className="h-4 w-4 text-red-600 dark:text-red-300" />
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">Find Your Why</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Dig a little deeper</p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        {activeValuesQuestion === 'quick' ? 'Quick Check' : 'Your Why'}
                      </h4>
                      <button
                        onClick={() => setActiveValuesQuestion(null)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {activeValuesQuestion === 'quick' ? (
                      <div className="text-center py-4">
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                          {getContextualValuesQuestion('why', barrierType)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Just think about it - no need to write anything down
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center mt-0.5">
                              <BulbIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Purpose</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {getContextualValuesQuestion('why', barrierType)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center mt-0.5">
                              <Target className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Outcome</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {getContextualValuesQuestion('outcome', barrierType)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          Just reflecting is enough - you don't need to have all the answers
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="mb-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/40 dark:border-slate-700/40 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100/80 dark:bg-slate-700/80 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h2 className="text-base font-medium text-slate-900 dark:text-slate-100">{customTitle}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Take a moment to center yourself</p>
          </div>
        </div>
        <div className="bg-slate-100/60 dark:bg-slate-700/60 rounded-lg p-1.5">
          {isExpanded ? (
            <Minus className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          ) : (
            <Plus className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6 animate-in slide-in-from-top duration-300">
          <div className="border-t border-slate-200/30 dark:border-slate-700/30 pt-6">
            {customContent || defaultContent}
          </div>
        </div>
      )}
    </div>
  )
}