'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ArrowLeft, Heart, Sparkles, Users, Target } from 'lucide-react'

export default function AboutPage() {
  const router = useRouter()

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToPage = (page: string) => {
    router.push(`/${page}`)
  }

  const goBack = () => {
    router.back()
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
                About ADHD First Aid Kit
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                A compassionate, community-driven resource for navigating life with ADHD
              </p>
            </div>

            {/* Mission Section */}
            <div className="mb-16">
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12 shadow-lg">
                <div className="flex items-center mb-6">
                  <Heart className="h-8 w-8 text-primary mr-4" />
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  Living with ADHD can feel overwhelming, especially when you need help in the moment. That&apos;s why we created the ADHD First Aid Kit—a quick, accessible resource that meets you exactly where you are.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Whether you&apos;re feeling overwhelmed, struggling with a specific task, or facing a particular barrier, our curated strategies are designed to provide immediate, practical support when you need it most.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg text-center">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Personalized Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find strategies tailored to your specific feelings, challenges, and situations
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Community Driven</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real strategies from real people who understand the ADHD experience
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Immediate Help</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Quick access to practical solutions when you need them most
                </p>
              </div>
            </div>

            {/* Story Section */}
            <div className="mb-16">
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12 shadow-lg">
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">How It Works</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4 mt-1">1</div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Tell us how you&apos;re feeling or what you&apos;re struggling with</h4>
                      <p className="text-muted-foreground">Start by selecting whether you&apos;re dealing with emotions or a specific task that needs doing.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4 mt-1">2</div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Get more specific about your situation</h4>
                      <p className="text-muted-foreground">Help us understand what specific issue or barrier you&apos;re facing so we can find the most relevant strategies.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4 mt-1">3</div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Discover personalized strategies</h4>
                      <p className="text-muted-foreground">Browse through curated strategies that match your specific situation, complete with examples and practical tips.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Section */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary/10 to-purple/10 border border-primary/20 rounded-2xl p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">Join Our Community</h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-2xl mx-auto">
                  Have a strategy that&apos;s worked for you? We&apos;d love to hear about it! Your experiences could be exactly what someone else needs to hear.
                </p>
                <button
                  onClick={() => navigateToPage('suggest')}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-purple hover:from-primary/90 hover:to-purple/90 text-white rounded-full transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Suggest a Strategy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main></div>
  )
}