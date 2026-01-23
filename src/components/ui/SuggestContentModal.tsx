'use client'

import React, { useState } from 'react'
import { X, Send, CheckCircle, Sparkles, Shield, Target, Repeat, User } from 'lucide-react'
import { Button } from './button'

interface SuggestContentModalProps {
  isOpen: boolean
  onClose: () => void
  contentType: 'barrier' | 'task' | 'complex_loop' | 'identity'
}

export function SuggestContentModal({ isOpen, onClose, contentType }: SuggestContentModalProps) {
  const [contentName, setContentName] = useState('')
  const [email, setEmail] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Get content-specific configuration
  const getContentConfig = () => {
    switch (contentType) {
      case 'barrier':
        return {
          title: 'Suggest a Barrier',
          subtitle: 'Help us expand our barriers collection',
          icon: Shield,
          questionLabel: "What barrier are you experiencing?",
          placeholder: '',
          gradient: {
            from: 'from-[#fbc687]',
            via: 'via-[#fff5db]',
            to: 'to-[#d4fc79]'
          },
          emailSubject: 'Barrier Suggestion'
        }
      case 'task':
        return {
          title: 'Suggest a Life Area',
          subtitle: 'Help us expand our life areas collection',
          icon: Target,
          questionLabel: "What life area would be helpful?",
          placeholder: '',
          gradient: {
            from: 'from-[#d4fc79]',
            via: 'via-[#b0f4ea]',
            to: 'to-[#8fd3f4]'
          },
          emailSubject: 'Life Area Suggestion'
        }
      case 'complex_loop':
        return {
          title: 'Suggest a Complex Loop',
          subtitle: 'Help us expand our complex loops collection',
          icon: Repeat,
          questionLabel: "What pattern do you notice?",
          placeholder: '',
          gradient: {
            from: 'from-[#8fd3f4]',
            via: 'via-[#78c2f2]',
            to: 'to-[#a18cd1]'
          },
          emailSubject: 'Complex Loop Suggestion'
        }
      case 'identity':
        return {
          title: 'Suggest an Identity',
          subtitle: 'Help us expand our identity guides collection',
          icon: User,
          questionLabel: "What role or identity is missing?",
          placeholder: '',
          gradient: {
            from: 'from-[#a18cd1]',
            via: 'via-[#b19cd9]',
            to: 'to-[#dec6f7]'
          },
          emailSubject: 'Identity Guide Suggestion'
        }
      default:
        return {
          title: 'Suggest Content',
          subtitle: 'Help us improve',
          icon: Sparkles,
          questionLabel: "What would you like to suggest?",
          placeholder: 'Enter your suggestion...',
          gradient: {
            from: 'from-gray-400',
            via: 'via-gray-500',
            to: 'to-gray-600'
          },
          emailSubject: 'Content Suggestion'
        }
    }
  }

  const config = getContentConfig()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create email content
      const subject = `ADHD First Aid Kit - ${config.emailSubject}: ${contentName}`
      const body = `Suggested ${contentType.replace('_', ' ')}: ${contentName}

Submitter Email: ${email || 'Not provided'}

Additional Information: ${additionalInfo || 'None provided'}

---
Sent from ADHD First Aid Kit ${config.title} Form
Timestamp: ${new Date().toLocaleString()}`

      // Create mailto link
      const mailtoLink = `mailto:marlie@navcoaching.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      
      // Open in new tab
      window.open(mailtoLink, '_blank')
      
      setSubmitted(true)
      setIsSubmitting(false)
      
      // Close modal after showing success
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setContentName('')
        setEmail('')
        setAdditionalInfo('')
      }, 3000)
    } catch (error) {
      console.error('Error submitting suggestion:', error)
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const IconComponent = config.icon

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-lg"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center p-4">
        {/* Modal Content */}
        <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Header Bar */}
          <div className={`bg-gradient-to-r ${config.gradient.from} ${config.gradient.via} ${config.gradient.to} p-6 shadow-lg relative`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 p-0 rounded-full hover:bg-black/10 transition-colors"
            >
              <X className="h-5 w-5 text-gray-800" />
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/30 rounded-2xl shadow-lg">
                <IconComponent className="h-7 w-7 text-gray-800" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{config.title}</h2>
                <p className="text-gray-700 text-sm">{config.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {submitted ? (
              <div className="text-center max-w-md mx-auto">
                <div className="mb-6">
                  <div className="relative mx-auto mb-4 w-20 h-20">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full"
                      aria-hidden="true"
                    />
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-700 rounded-full w-full h-full flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Thank You! 🎉
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your suggestion has been sent! Marlie will review it and consider adding it to the collection.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-3">
                    Thanks for helping us improve! 💛
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Content Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {config.questionLabel}
                  </label>
                  <input
                    type="text"
                    value={contentName}
                    onChange={(e) => setContentName(e.target.value)}
                    required
                    placeholder={config.placeholder}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Your Email <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <span>💌</span> For credit and if we have questions
                  </p>
                </div>

                {/* Additional Info */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Anything you'd like to include? <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    rows={4}
                    placeholder="Describe the situation, when it happens, suggest strategies, sources, or any context that might help..."
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!contentName.trim() || isSubmitting}
                  className={`w-full bg-gradient-to-r ${config.gradient.from} ${config.gradient.via} ${config.gradient.to} text-gray-800 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-800/30 border-t-gray-800 rounded-full" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Suggestion
                      </>
                    )}
                  </div>
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                  Your suggestion will be sent directly to Marlie.<br/>
                  Thanks for helping us grow! 🙏
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
