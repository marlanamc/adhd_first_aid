'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search, Heart } from 'lucide-react'

export default function NotFoundPage() {
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
    <div className="min-h-screen ocean-gradient relative flex flex-col items-center justify-center p-6">
      {/* Main Content */}
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-[120px] md:text-[180px] font-bold text-white/20 leading-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
                <Search className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-6 leading-tight">
            Oops! Page Not Found
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
            It looks like the page you're looking for doesn't exist or has been moved. 
            Don't worry though – let's get you back on track!
          </p>
        </div>

        {/* ADHD-Friendly Message */}
        <div className="mb-8 p-6 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl">
          <div className="flex items-start gap-3">
            <Heart className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">
                Hey, it's okay!
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Getting lost happens to everyone, especially when you're navigating quickly or have a lot on your mind. 
                Take a breath, and let's find what you were looking for.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={navigateHome}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full transition-all duration-200 transform hover:scale-105 font-medium"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Button>
          
          <Button
            onClick={goBack}
            variant="outline"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/60 hover:bg-white/80 text-foreground rounded-full transition-all duration-200 transform hover:scale-105 font-medium border border-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { title: 'FAQ', path: '/faq', icon: '❓' },
            { title: 'Resources', path: '/resources', icon: '📚' },
            { title: 'Contact', path: '/contact', icon: '💬' },
            { title: 'Feelings', path: '/feelings', icon: '❤️' }
          ].map((link) => (
            <button
              key={link.path}
              onClick={() => navigateToPage(link.path)}
              className="p-4 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/80 transition-all duration-200 transform hover:scale-105 text-center"
            >
              <div className="text-2xl mb-2">{link.icon}</div>
              <div className="text-sm font-medium text-foreground">{link.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping" style={{animationDelay: '0s'}} />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{animationDelay: '3s'}} />
      </div>
    </div>
  )
}