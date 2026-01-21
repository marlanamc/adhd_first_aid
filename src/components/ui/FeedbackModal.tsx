'use client'

import React, { useState } from 'react'
import { X, MessageSquare, Send, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from './button'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  pageType?: 'feelings' | 'barriers' | 'tasks' | 'complex_loops' | 'identity'
}

export function FeedbackModal({ isOpen, onClose, pageType = 'feelings' }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Reset form when modal closes
  const handleClose = () => {
    onClose()
    setSubmitted(false)
    setFeedback('')
    setEmail('')
    setCategory('general')
  }

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

  // Define gradients for each page type to match the button gradients
  const gradients = {
    feelings: {
      from: 'from-[#fbc2eb]',
      via: 'via-[#fbd786]', 
      to: 'to-[#fbc687]'
    },
    barriers: {
      from: 'from-[#fbc687]',
      via: 'via-[#fff5db]',
      to: 'to-[#d4fc79]'
    },
    tasks: {
      from: 'from-[#d4fc79]',
      via: 'via-[#b0f4ea]',
      to: 'to-[#8fd3f4]'
    },
    complex_loops: {
      from: 'from-[#8fd3f4]',
      via: 'via-[#78c2f2]',
      to: 'to-[#a18cd1]'
    },
    identity: {
      from: 'from-[#a18cd1]',
      via: 'via-[#b19cd9]',
      to: 'to-[#dec6f7]'
    }
  }

  const theme = gradients[pageType] || gradients.feelings

  // Get readable page name from URL
  const getPageName = () => {
    if (typeof window === 'undefined') return 'this page'
    
    const path = window.location.pathname
    const segments = path.split('/')
    
    // Get the last segment of the URL
    const lastSegment = segments[segments.length - 1]
    
    // Convert slug to readable name
    if (lastSegment && lastSegment !== '') {
      let result = lastSegment
        .split(/[-_]/) // Split on both hyphens and underscores
        .map(word => {
          // Handle special cases
          if (word.toLowerCase() === 'adhd') return 'ADHD'
          if (word.toLowerCase() === 'ai') return 'AI'
          if (word.toLowerCase() === 'ui') return 'UI'
          if (word.toLowerCase() === 'api') return 'API'
          // Capitalize first letter of each word
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join(' ')
      
      // Clean up common prefixes
      result = result.replace(/^The\s+/, '') // Remove "The " at the beginning
      result = result.replace(/^ADHD Identity Guide:\s*/, '') // Remove "ADHD Identity Guide: "
      result = result.replace(/^ADHD Identity Guide:\s*The\s*/, '') // Remove "ADHD Identity Guide: The "
      
      return result
    }
    
    // Fallback to page type
    switch (pageType) {
      case 'feelings': return 'Feelings'
      case 'barriers': return 'Barriers'
      case 'tasks': return 'Tasks'
      case 'complex_loops': return 'Complex Loops'
      case 'identity': return 'Identity'
      default: return 'this page'
    }
  }

  const pageName = getPageName()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send email using a service like EmailJS or similar
      // For now, we'll simulate the API call
      // Simulate API call - in production, replace with actual email service
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Log feedback data for now (in production, send to actual email service)
      const feedbackData = {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        pageType: pageType.charAt(0).toUpperCase() + pageType.slice(1),
        currentPage: window.location.href,
        email: email || 'Not provided',
        feedback,
        timestamp: new Date().toLocaleString()
      }
      
      console.log('Feedback submitted:', feedbackData)
      
      setSubmitted(true)
      setIsSubmitting(false)
      
      // Don't auto-close - let user close manually by clicking outside or X button
    } catch (error) {
      console.error('Error submitting feedback:', error)
      setIsSubmitting(false)
      // Could add error state here
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-lg"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center p-4">
        {/* Modal Content */}
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Header Bar */}
      <div className={`bg-gradient-to-r ${theme.from} ${theme.via} ${theme.to} p-6 shadow-lg relative`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute top-4 right-4 h-10 w-10 p-0 rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="h-5 w-5 text-gray-800" />
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/30 rounded-2xl shadow-lg">
            <MessageSquare className="h-7 w-7 text-gray-800" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Share Your Thoughts on {pageName}</h2>
            <p className="text-gray-700 text-sm">Help us improve the ADHD First Aid Kit</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {submitted ? (
            <div className="text-center max-w-md mx-auto">
              <div className="mb-6">
                <div className="relative mx-auto mb-4 w-20 h-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-700 rounded-full w-full h-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Thank You! 🎉
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Your feedback has been sent successfully! Marlie will receive your message and may follow up if you provided an email.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-3">
                  Thanks for helping other people with ADHD! 💛
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                What would you like to share?
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium"
              >
                <option value="general">💬 General Feedback</option>
                <option value="strategy">💡 Suggest a Strategy</option>
                <option value="resource">📚 Recommend Further Reading</option>
                <option value="improvement">✨ Improvement Suggestion</option>
                <option value="bug">🐛 Report an Issue</option>
              </select>
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
                <span>💌</span> Only needed if you'd like a response
              </p>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Your Message
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                rows={6}
                placeholder="Share your thoughts, suggestions, or resources... Your feedback helps us improve the toolkit. 😊"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              />
            </div>

            {/* Submit Button */}
              <Button
                type="submit"
                disabled={!feedback.trim() || isSubmitting}
                className={`w-full bg-gradient-to-r ${theme.from} ${theme.via} ${theme.to} text-gray-800 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg`}
              >
                <div className="flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-800/30 border-t-gray-800 rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Feedback
                    </>
                  )}
                </div>
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                Your feedback will be sent directly to Marlie.<br/>
                Thanks for helping us improve! 🙏
              </p>
            </form>
          )}
      </div>
        </div>
      </div>
    </div>
  )
}