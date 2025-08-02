'use client'

import { useState } from 'react'
import { X, Copy, Mail, MessageCircle, Twitter, Facebook, Link2, Check } from 'lucide-react'
import { Button } from './button'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  url: string
  description?: string
}

export function ShareModal({ isOpen, onClose, title, url, description }: ShareModalProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  if (!isOpen) return null

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copySuccess ? Check : Copy,
      color: copySuccess ? 'text-green-600' : 'text-blue-600',
      action: handleCopyLink,
      label: copySuccess ? 'Copied!' : 'Copy link to clipboard'
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'text-purple-600',
      action: () => {
        const subject = encodeURIComponent(`ADHD First Aid Kit: ${title}`)
        const body = encodeURIComponent(`I thought this might be helpful:\n\n${title}\n${url}\n\n${description || ''}`)
        window.open(`mailto:?subject=${subject}&body=${body}`)
      },
      label: 'Send via email'
    },
    {
      name: 'Text Message',
      icon: MessageCircle,
      color: 'text-green-600',
      action: () => {
        const text = encodeURIComponent(`Check out this ADHD resource: ${title} ${url}`)
        window.open(`sms:?body=${text}`)
      },
      label: 'Send via text message'
    },
    {
      name: 'Twitter/X',
      icon: Twitter,
      color: 'text-black dark:text-white',
      action: () => {
        const text = encodeURIComponent(`${title} - helpful ADHD resource`)
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`)
      },
      label: 'Share on Twitter/X'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-700',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
      },
      label: 'Share on Facebook'
    }
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="relative bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-pink-300/40 dark:border-pink-700/40 overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-orange-100/20 dark:from-pink-900/10 dark:to-orange-900/10 pointer-events-none" />
          {/* Header */}
          <div className="relative flex items-center justify-between p-6 border-b border-pink-200/50 dark:border-pink-800/30">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Share This Page
            </h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="rounded-full p-2 hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Share Options */}
          <div className="relative p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Share "{title}" with someone who might find it helpful
            </p>
            
            <div className="space-y-3">
              {shareOptions.map((option, index) => {
                const Icon = option.icon
                // Alternating gradient backgrounds for share options
                const gradients = [
                  'hover:bg-pink-100/50 dark:hover:bg-pink-900/20',
                  'hover:bg-orange-100/50 dark:hover:bg-orange-900/20',
                  'hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20',
                  'hover:bg-green-100/50 dark:hover:bg-green-900/20',
                  'hover:bg-blue-100/50 dark:hover:bg-blue-900/20'
                ]
                const hoverClass = gradients[index % gradients.length]
                
                return (
                  <Button
                    key={option.name}
                    onClick={option.action}
                    variant="ghost"
                    className={`w-full justify-start gap-3 p-4 h-auto bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-pink-200/30 dark:border-pink-700/30 transition-all shadow-sm ${hoverClass}`}
                  >
                    <div className={`p-2 rounded-full bg-gradient-to-br from-pink-100/80 to-orange-100/80 dark:from-pink-900/40 dark:to-orange-900/40`}>
                      <Icon className={`h-5 w-5 ${option.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {option.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {option.label}
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
            
            {/* URL Preview */}
            <div className="mt-6 p-3 bg-gradient-to-r from-pink-50/60 to-orange-50/60 dark:from-pink-900/20 dark:to-orange-900/20 backdrop-blur-sm rounded-lg border border-pink-200/50 dark:border-pink-800/30">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="p-1">
                  <Link2 className="h-3 w-3 text-pink-500" />
                </div>
                <span className="truncate font-mono text-xs">{url}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}