'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, Lightbulb, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuggestPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    strategyName: '',
    description: '',
    example: '',
    feelings: [] as string[],
    issues: [] as string[],
    barriers: [] as string[],
    tags: '',
    price: '',
    source: '',
    submitterName: '',
    submitterEmail: ''
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

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }))
  }

  const feelingOptions = ['Overwhelmed', 'Anxious', 'Frustrated', 'Unmotivated', 'Scattered', 'Stressed', 'Angry', 'Sad', 'Restless']
  const issueOptions = ['Focus', 'Time Management', 'Organization', 'Memory', 'Social Situations', 'Work Tasks', 'Self-Care', 'Relationships']
  const barrierOptions = ['Executive Dysfunction', 'Perfectionism', 'Overwhelm', 'Lack of Structure', 'Distractions', 'Low Energy', 'Time Blindness', 'Procrastination']

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
              Thank You for Your Submission!
            </h1>
            <p className="text-muted-foreground leading-relaxed text-lg mb-8">
              Your strategy suggestion has been received and will be reviewed by our team. 
              If approved, it will be added to our database to help others in the ADHD community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({
                    strategyName: '',
                    description: '',
                    example: '',
                    feelings: [],
                    issues: [],
                    barriers: [],
                    tags: '',
                    price: '',
                    source: '',
                    submitterName: '',
                    submitterEmail: ''
                  })
                }}
                variant="default"
                size="default"
                className="bg-primary hover:bg-primary/90"
              >
                Submit Another Strategy
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
                Suggest a Strategy
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                Share a strategy, technique, or approach that has helped you with ADHD challenges. 
                Your contribution could be exactly what someone else needs to hear.
              </p>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-xl p-6 mb-8">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Submission Guidelines</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Be specific and include real examples of how the strategy works</li>
                    <li>• Focus on practical, actionable approaches rather than general advice</li>
                    <li>• Include context about when and where the strategy is most effective</li>
                    <li>• Only submit strategies you&apos;ve personally tried and found helpful</li>
                    <li>• All submissions are reviewed before being added to the database</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Strategy Details */}
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 md:p-8 shadow-lg">
                <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center">
                  <Lightbulb className="h-6 w-6 text-primary mr-3" />
                  Strategy Details
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Strategy Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.strategyName}
                      onChange={(e) => handleInputChange('strategyName', e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g., The 5-Minute Rule for Starting Tasks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Describe the strategy in detail. What exactly do you do? How does it work?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Example *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.example}
                      onChange={(e) => handleInputChange('example', e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Give a specific example of how you've used this strategy. Be concrete!"
                    />
                  </div>
                </div>
              </div>

              {/* When It Helps */}
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 md:p-8 shadow-lg">
                <h2 className="text-2xl font-serif text-foreground mb-6">When It Helps</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Feelings (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {feelingOptions.map((feeling) => (
                        <button
                          key={feeling}
                          type="button"
                          onClick={() => handleMultiSelect('feelings', feeling)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            formData.feelings.includes(feeling)
                              ? 'bg-primary text-white'
                              : 'bg-white/60 text-muted-foreground hover:bg-white/80'
                          }`}
                        >
                          {feeling}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Issues (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {issueOptions.map((issue) => (
                        <button
                          key={issue}
                          type="button"
                          onClick={() => handleMultiSelect('issues', issue)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            formData.issues.includes(issue)
                              ? 'bg-primary text-white'
                              : 'bg-white/60 text-muted-foreground hover:bg-white/80'
                          }`}
                        >
                          {issue}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Barriers (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {barrierOptions.map((barrier) => (
                        <button
                          key={barrier}
                          type="button"
                          onClick={() => handleMultiSelect('barriers', barrier)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            formData.barriers.includes(barrier)
                              ? 'bg-primary text-white'
                              : 'bg-white/60 text-muted-foreground hover:bg-white/80'
                          }`}
                        >
                          {barrier}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 md:p-8 shadow-lg">
                <h2 className="text-2xl font-serif text-foreground mb-6">Additional Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g., productivity, mindfulness, apps"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cost/Price
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g., Free, $5/month, One-time $20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Source (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.source}
                      onChange={(e) => handleInputChange('source', e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="https://... (if applicable)"
                    />
                  </div>
                </div>
              </div>

              {/* Submitter Info */}
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 md:p-8 shadow-lg">
                <h2 className="text-2xl font-serif text-foreground mb-6">Your Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.submitterName}
                      onChange={(e) => handleInputChange('submitterName', e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="How you'd like to be credited (if at all)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={formData.submitterEmail}
                      onChange={(e) => handleInputChange('submitterEmail', e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="In case we need to follow up"
                    />
                  </div>
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
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Strategy
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer navigateToPage={navigateToPage} />
    </div>
  )
}