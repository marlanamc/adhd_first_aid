'use client'

import React, { useState } from 'react'
import { X, Send, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from './button'

interface SuggestFeelingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SuggestFeelingModal({ isOpen, onClose }: SuggestFeelingModalProps) {
  const [feelingName, setFeelingName] = useState('')
  const [email, setEmail] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleClose = () => {
    // Reset form state when closing
    setSubmitted(false)
    setFeelingName('')
    setEmail('')
    setAdditionalInfo('')
    setIsSubmitting(false)
    onClose()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Email content creation commented out - not opening email client
      // const subject = `ADHD First Aid Kit - Feeling Suggestion: ${feelingName}`
      // const body = `Suggested Feeling: ${feelingName}
      //
      // Submitter Email: ${email || 'Not provided'}
      //
      // Additional Information: ${additionalInfo || 'None provided'}
      //
      // ---
      // Sent from ADHD First Aid Kit Feeling Suggestion Form
      // Timestamp: ${new Date().toLocaleString()}`
      //
      // const mailtoLink = `mailto:marlie@navcoaching.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      // window.open(mailtoLink, '_blank')
      
      setSubmitted(true)
      setIsSubmitting(false)
      
      // Don't auto-close - let user close manually by clicking outside or X button
      // setTimeout(() => {
      //   onClose()
      //   setSubmitted(false)
      //   setFeelingName('')
      //   setEmail('')
      //   setAdditionalInfo('')
      // }, 3000)
    } catch (error) {
      console.error('Error submitting feeling suggestion:', error)
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-lg"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center p-4 pb-16">
        {/* Modal Content */}
        <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#fbc2eb] via-[#fbd786] to-[#fbc687] p-6 shadow-lg relative">
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
                <Sparkles className="h-7 w-7 text-gray-800" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Suggest a Feeling</h2>
                <p className="text-gray-700 text-sm">Help us expand our feelings collection</p>
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
                    Thanks for helping other people with ADHD! 💛
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your feeling suggestion will help expand our collection so more people can find the support they need.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feeling Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    What's the feeling?
                  </label>
                  <input
                    type="text"
                    value={feelingName}
                    onChange={(e) => setFeelingName(e.target.value)}
                    required
                    placeholder=""
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
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
                    placeholder="Describe the feeling, when it happens, suggest strategies, sources, or any context that might help..."
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors resize-vertical"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!feelingName.trim() || isSubmitting}
                  className="w-full bg-gradient-to-r from-[#fbc2eb] via-[#fbd786] to-[#fbc687] text-gray-800 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
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
                        Suggest Feeling
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
