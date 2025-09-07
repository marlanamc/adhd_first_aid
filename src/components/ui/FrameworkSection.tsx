'use client'

import React from 'react'
import { 
  Clock, Brain, Users, Target, Zap, FileText,
  Plus, Minus,
  Timer, ChevronDown, AlertTriangle, 
  Repeat, ArrowDown, RotateCcw
} from 'lucide-react'

// Framework section data structure
export interface FrameworkSections {
  // Time & Transition (The Time Trap)
  setup?: {
    title: string
    content: string
  }
  adhd_response?: {
    title: string
    content: string
    mechanisms: string[]
  }
  cascade?: {
    title: string
    steps: string[]
  }
  loop?: {
    title: string
    content: string
  }
  
  // Analysis & Decision (The Thinking Spiral)
  trigger?: {
    title: string
    content: string
  }
  adhd_amplification?: {
    title: string
    content: string
    mechanisms: string[]
  }
  mental_traffic_jam?: {
    title: string
    steps: string[]
  }
  paralysis?: {
    title: string
    content: string
  }
  
  // Social & Relationship (The Social Spiral)
  protective_response?: {
    title: string
    steps: string[]
  }
  reinforcement?: {
    title: string
    content: string
  }
  
  // Dopamine & Impulse (The Dopamine Cycle)
  adhd_hijack?: {
    title: string
    content: string
    mechanisms: string[]
  }
  hyperfocus_trap?: {
    title: string
    steps: string[]
  }
  crash?: {
    title: string
    content: string
  }
  
  // Energy & Capacity (The Depletion Pattern)
  demand?: {
    title: string
    content: string
  }
  overextension?: {
    title: string
    content: string
    mechanisms: string[]
  }
  shame_cycle?: {
    title: string
    content: string
  }
  
  // Task & Communication (The Avoidance Spiral)
  task?: {
    title: string
    content: string
  }
  executive_breakdown?: {
    title: string
    content: string
    mechanisms: string[]
  }
  avoidance?: {
    title: string
    steps: string[]
  }
  mountain_effect?: {
    title: string
    content: string
  }
}

interface FrameworkSectionProps {
  loopName: string
  loopType: 'time_transition' | 'analysis_decision' | 'social_relationship' | 'dopamine_impulse' | 'energy_capacity' | 'task_communication'
  frameworkTitle: string
  frameworkSections: FrameworkSections
  isExpanded: boolean
  onToggle: () => void
}

const getFrameworkIcon = (loopType: string) => {
  const iconMap = {
    'time_transition': Clock,
    'analysis_decision': Brain, 
    'social_relationship': Users,
    'dopamine_impulse': Target,
    'energy_capacity': Zap,
    'task_communication': FileText
  }
  return iconMap[loopType as keyof typeof iconMap] || Brain
}

const getFrameworkColors = (loopType: string) => {
  const colorMap = {
    'time_transition': {
      bg: 'bg-blue-50/50',
      border: 'border-blue-200', 
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      headerColor: 'text-blue-900'
    },
    'analysis_decision': {
      bg: 'bg-purple-50/50',
      border: 'border-purple-200',
      iconBg: 'bg-purple-100', 
      iconColor: 'text-purple-600',
      headerColor: 'text-purple-900'
    },
    'social_relationship': {
      bg: 'bg-pink-50/50',
      border: 'border-pink-200',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600', 
      headerColor: 'text-pink-900'
    },
    'dopamine_impulse': {
      bg: 'bg-orange-50/50',
      border: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      headerColor: 'text-orange-900'
    },
    'energy_capacity': {
      bg: 'bg-red-50/50',
      border: 'border-red-200', 
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      headerColor: 'text-red-900'
    },
    'task_communication': {
      bg: 'bg-green-50/50',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      headerColor: 'text-green-900'
    }
  }
  return colorMap[loopType as keyof typeof colorMap] || colorMap['time_transition']
}

const FrameworkSection: React.FC<FrameworkSectionProps> = ({
  loopName,
  loopType,
  frameworkTitle, 
  frameworkSections,
  isExpanded,
  onToggle
}) => {
  const IconComponent = getFrameworkIcon(loopType)
  const colors = getFrameworkColors(loopType)
  
  const renderMechanismsList = (mechanisms: string[]) => (
    <div className="space-y-3 mt-4">
      {mechanisms.map((mechanism, index) => (
        <div key={index} className="flex items-start gap-4 p-4 bg-white/60 rounded-lg border border-gray-200/50">
          <div className="flex-shrink-0 mt-1">
            <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
          </div>
          <div 
            className="text-gray-800 text-base leading-relaxed flex-1"
            dangerouslySetInnerHTML={{ 
              __html: mechanism
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
            }} 
          />
        </div>
      ))}
    </div>
  )

  const renderStepsList = (steps: string[]) => (
    <div className="space-y-4 mt-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-7 h-7 ${colors.iconBg} rounded-full flex items-center justify-center text-sm font-semibold ${colors.iconColor}`}>
            {index + 1}
          </div>
          <div 
            className="text-gray-800 text-base leading-relaxed pt-1 flex-1"
            dangerouslySetInnerHTML={{ 
              __html: step
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
            }} 
          />
        </div>
      ))}
    </div>
  )

  const renderContentSection = (section: { title: string; content: string }, showIcon = false) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {showIcon && <ChevronDown className="w-4 h-4 text-gray-500" />}
        <h4 className={`font-semibold ${colors.headerColor} text-xl`}>{section.title}</h4>
      </div>
      <div 
        className="text-gray-800 text-base leading-relaxed"
        dangerouslySetInnerHTML={{ 
          __html: section.content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
        }} 
      />
    </div>
  )

  // Render different framework types
  const renderFrameworkContent = () => {
    switch (loopType) {
      case 'time_transition':
        return (
          <div className="space-y-8">
            {frameworkSections.setup && renderContentSection(frameworkSections.setup)}
            
            {frameworkSections.adhd_response && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.adhd_response.title}
                  </h4>
                </div>
                <div 
                  className="text-gray-800 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: frameworkSections.adhd_response.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} 
                />
                {frameworkSections.adhd_response.mechanisms && 
                  renderMechanismsList(frameworkSections.adhd_response.mechanisms)}
              </div>
            )}
            
            {frameworkSections.cascade && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ArrowDown className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.cascade.title}
                  </h4>
                </div>
                {renderStepsList(frameworkSections.cascade.steps)}
              </div>
            )}
            
            {frameworkSections.loop && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.loop.title}
                  </h4>
                </div>
                <div 
                  className="text-gray-800 text-base leading-relaxed p-5 bg-yellow-50/50 border border-yellow-200 rounded-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: frameworkSections.loop.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} 
                />
              </div>
            )}
          </div>
        )

      case 'analysis_decision':
        return (
          <div className="space-y-8">
            {frameworkSections.trigger && renderContentSection(frameworkSections.trigger)}
            
            {frameworkSections.adhd_amplification && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.adhd_amplification.title}
                  </h4>
                </div>
                <div 
                  className="text-gray-800 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: frameworkSections.adhd_amplification.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} 
                />
                {frameworkSections.adhd_amplification.mechanisms && 
                  renderMechanismsList(frameworkSections.adhd_amplification.mechanisms)}
              </div>
            )}
            
            {frameworkSections.mental_traffic_jam && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.mental_traffic_jam.title}
                  </h4>
                </div>
                {renderStepsList(frameworkSections.mental_traffic_jam.steps)}
              </div>
            )}
            
            {frameworkSections.paralysis && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.paralysis.title}
                  </h4>
                </div>
                <div 
                  className="text-gray-800 text-base leading-relaxed p-5 bg-red-50/50 border border-red-200 rounded-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: frameworkSections.paralysis.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} 
                />
              </div>
            )}
          </div>
        )

      case 'social_relationship':
        return (
          <div className="space-y-6">
            {frameworkSections.protective_response && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.protective_response.title}
                  </h4>
                </div>
                {renderStepsList(frameworkSections.protective_response.steps)}
              </div>
            )}
            
            {frameworkSections.reinforcement && renderContentSection(frameworkSections.reinforcement)}
          </div>
        )

      case 'dopamine_impulse':
        return (
          <div className="space-y-6">
            {frameworkSections.trigger && renderContentSection(frameworkSections.trigger)}
            
            {frameworkSections.adhd_hijack && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.adhd_hijack.title}
                  </h4>
                </div>
                <div 
                  className="text-gray-800 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: frameworkSections.adhd_hijack.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} 
                />
                {frameworkSections.adhd_hijack.mechanisms && 
                  renderMechanismsList(frameworkSections.adhd_hijack.mechanisms)}
              </div>
            )}
            
            {frameworkSections.hyperfocus_trap && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.hyperfocus_trap.title}
                  </h4>
                </div>
                {renderStepsList(frameworkSections.hyperfocus_trap.steps)}
              </div>
            )}
            
            {frameworkSections.crash && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.crash.title}
                  </h4>
                </div>
                <div 
                  className="text-gray-800 text-base leading-relaxed p-5 bg-orange-50/50 border border-orange-200 rounded-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: frameworkSections.crash.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} 
                />
              </div>
            )}
          </div>
        )

      case 'energy_capacity':
        return (
          <div className="space-y-6">
            {frameworkSections.demand && renderContentSection(frameworkSections.demand)}
            
            {frameworkSections.overextension && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.overextension.title}
                  </h4>
                </div>
                <div 
                  className="text-gray-800 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: frameworkSections.overextension.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} 
                />
                {frameworkSections.overextension.mechanisms && 
                  renderMechanismsList(frameworkSections.overextension.mechanisms)}
              </div>
            )}
            
            {frameworkSections.shame_cycle && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Repeat className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.shame_cycle.title}
                  </h4>
                </div>
                <div 
                  className="text-gray-800 text-base leading-relaxed p-5 bg-red-50/50 border border-red-200 rounded-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: frameworkSections.shame_cycle.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} 
                />
              </div>
            )}
          </div>
        )

      case 'task_communication':
        return (
          <div className="space-y-6">
            {frameworkSections.task && renderContentSection(frameworkSections.task)}
            
            {frameworkSections.executive_breakdown && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.executive_breakdown.title}
                  </h4>
                </div>
                <div 
                  className="text-gray-800 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: frameworkSections.executive_breakdown.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} 
                />
                {frameworkSections.executive_breakdown.mechanisms && 
                  renderMechanismsList(frameworkSections.executive_breakdown.mechanisms)}
              </div>
            )}
            
            {frameworkSections.avoidance && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.avoidance.title}
                  </h4>
                </div>
                {renderStepsList(frameworkSections.avoidance.steps)}
              </div>
            )}
            
            {frameworkSections.mountain_effect && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-gray-500" />
                  <h4 className={`font-semibold ${colors.headerColor} text-xl`}>
                    {frameworkSections.mountain_effect.title}
                  </h4>
                </div>
                <div 
                  className="text-gray-800 text-base leading-relaxed p-5 bg-green-50/50 border border-green-200 rounded-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: frameworkSections.mountain_effect.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} 
                />
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="text-gray-600 text-center py-8">
            Framework content for {loopType} coming soon...
          </div>
        )
    }
  }

  return (
    <div className={`rounded-2xl transition-all duration-300 mb-4 bg-white border ${colors.border}`}>
      <button
        onClick={onToggle}
        className="w-full p-5 md:p-6 text-left rounded-2xl transition-all duration-300 flex items-center justify-between group"
        title={isExpanded ? 'Close section' : 'Open section'}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 ${colors.iconBg} rounded-lg flex-shrink-0`}>
            <IconComponent className={`h-5 w-5 ${colors.iconColor}`} />
          </div>
          <div>
            <h3 className={`text-xl md:text-2xl font-bold ${colors.headerColor}`}>
              {frameworkTitle}: {loopName}
            </h3>
            <p className="text-base text-gray-700 mt-1">
              Understand the neurological pattern behind this loop
            </p>
          </div>
        </div>
        {isExpanded ? (
          <Minus className="h-5 w-5 text-black flex-shrink-0" />
        ) : (
          <Plus className="h-5 w-5 text-black flex-shrink-0" />
        )}
      </button>
      
      {isExpanded && (
        <div className={`px-6 md:px-8 py-6 md:py-8 animate-in slide-in-from-top duration-300 border-t ${colors.border} ${colors.bg}`}>
          {renderFrameworkContent()}
        </div>
      )}
    </div>
  )
}

export default FrameworkSection