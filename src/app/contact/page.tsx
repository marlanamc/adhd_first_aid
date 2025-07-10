'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, Mail, MessageCircle, Send, CheckCircle, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    contactType: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToPage = (page: string) => {
    router.push(`/${page}`)
  }

  const goBack = () => {
    router.back()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const contactTypes = [
    { value: 'general', label: 'General Question', description: 'General questions or feedback' },
    { value: 'strategy', label: 'Strategy Suggestion', description: 'Suggest a new strategy or improvement' },
    { value: 'technical', label: 'Technical Issue', description: 'Report a bug or technical problem' },
    { value: 'collaboration', label: 'Collaboration', description: 'Partnership or collaboration inquiry' },
    { value: 'content', label: 'Content Request', description: 'Request for specific content or resources' }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen ocean-gradient relative flex flex-col">
        <Header 
          navigateHome={navigateHome} 
          navigateToPage={navigateToPage} 
          onSearchOpen={() => {}} 
        />

        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12 shadow-lg text-center max-w-2xl">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-6">
              Message Sent Successfully!
            </h1>
            <p className="text-muted-foreground leading-relaxed text-lg mb-8">
              Thank you for reaching out! I&apos;ll get back to you as soon as possible, 
              usually within 24-48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                    contactType: 'general'
                  })
                }}
                variant="default"
                size="default"
                className="bg-primary hover:bg-primary/90"
              >
                Send Another Message
              </Button>
              <Button
                onClick={navigateHome}
                variant="outline"
                size="default"
                className="bg-white/60 hover:bg-white/80"
              >
                Return Home
              </Button>
            </div>
          </div>
        </main>

        <Footer navigateToPage={navigateToPage} />
      </div>
    )
  }

  return (
    <div className="min-h-screen ocean-gradient relative flex flex-col">
      <Header 
        navigateHome={navigateHome} 
        navigateToPage={navigateToPage} 
        onSearchOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-4xl px-4 sm:px-6 pt-12 md:pt-16 pb-24">
          {/* Navigation */}
          <div className="mb-12 mt-10">
            <button
              onClick={goBack}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light inline-flex items-center cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>

          {/* Content */}
          <div className="animate-in px-4 md:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-6 leading-tight">
                Get in Touch
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                Have a question, suggestion, or just want to say hello? I&apos;d love to hear from you! 
                Your feedback helps make this resource better for everyone.
              </p>
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Type */}
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 md:p-8 shadow-lg">
                  <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center">
                    <MessageCircle className="h-6 w-6 text-primary mr-3" />
                    What can I help you with?
                  </h2>
                  
                  <div className="space-y-3">
                    {contactTypes.map((type) => (
                      <label
                        key={type.value}
                        className="flex items-start space-x-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="contactType"
                          value={type.value}
                          checked={formData.contactType === type.value}
                          onChange={(e) => handleInputChange('contactType', e.target.value)}
                          className="mt-1 h-4 w-4 text-primary focus:ring-primary focus:ring-2"
                        />
                        <div className="flex-1 p-3 rounded-lg group-hover:bg-white/40 transition-all duration-200">
                          <div className="font-medium text-foreground">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 md:p-8 shadow-lg">
                  <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center">
                    <Mail className="h-6 w-6 text-primary mr-3" />
                    Your Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Brief description of your message"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 md:p-8 shadow-lg">
                  <h2 className="text-2xl font-serif text-foreground mb-6">Your Message</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Tell me more about your question, suggestion, or feedback..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="default"
                    size="default"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Alternative Contact */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-primary/10 to-purple/10 border border-primary/20 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
                <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">A Personal Note</h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  This project comes from personal experience navigating ADHD challenges. 
                  Every message, suggestion, and piece of feedback helps make this resource 
                  more helpful for our community.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I read every message personally and do my best to respond thoughtfully. 
                  Thank you for being part of this journey! 💙
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer navigateToPage={navigateToPage} />
    </div>
  )
}