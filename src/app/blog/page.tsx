'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, BookOpen, Calendar, Clock, ChevronRight } from 'lucide-react'

// Sample blog posts (this would come from a CMS or database in the future)
const blogPosts = [
  {
    id: 1,
    title: "Understanding ADHD Executive Function",
    excerpt: "Executive function challenges are at the heart of many ADHD struggles. Learn what they are and how to work with them.",
    date: "2024-03-15",
    readTime: "5 min read",
    category: "Education",
    featured: true
  },
  {
    id: 2,
    title: "Building Sustainable Routines with ADHD",
    excerpt: "Why traditional routines often fail for ADHD brains and how to create ones that actually stick.",
    date: "2024-03-10",
    readTime: "7 min read",
    category: "Strategies"
  },
  {
    id: 3,
    title: "The Power of Body Doubling",
    excerpt: "How working alongside others (virtually or in person) can transform your productivity and focus.",
    date: "2024-03-05",
    readTime: "4 min read",
    category: "Techniques"
  },
  {
    id: 4,
    title: "Hyperfocus: Friend or Foe?",
    excerpt: "Understanding hyperfocus and learning when to lean into it and when to break free from it.",
    date: "2024-02-28",
    readTime: "6 min read",
    category: "Education"
  }
]

const categories = ["All", "Education", "Strategies", "Techniques", "Personal Stories"]

export default function BlogPage() {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen ocean-gradient relative flex flex-col">
      <Header 
        navigateHome={navigateHome} 
        navigateToPage={navigateToPage} 
        onSearchOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 pt-12 md:pt-16 pb-24">
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
                ADHD Resources & Insights
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                Educational content, personal stories, and practical insights for the ADHD community
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/60 text-muted-foreground hover:bg-white/80 hover:text-foreground border border-white/20"
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Featured Post */}
            {blogPosts.find(post => post.featured) && (
              <div className="mb-16">
                <h2 className="text-2xl font-serif text-foreground mb-6">Featured Article</h2>
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="bg-gradient-to-r from-primary/20 to-purple/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                    <span className="bg-white/60 text-muted-foreground px-3 py-1 rounded-full text-sm">
                      {blogPosts.find(post => post.featured)?.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors duration-200">
                    {blogPosts.find(post => post.featured)?.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                    {blogPosts.find(post => post.featured)?.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(blogPosts.find(post => post.featured)?.date || '')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {blogPosts.find(post => post.featured)?.readTime}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            )}

            {/* Blog Posts Grid */}
            <div className="mb-16">
              <h2 className="text-2xl font-serif text-foreground mb-6">Latest Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts
                  .filter(post => !post.featured)
                  .map((post) => (
                    <article
                      key={post.id}
                      className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-white/60 text-muted-foreground px-3 py-1 rounded-full text-sm">
                            {post.category}
                          </span>
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        
                        <h3 className="text-xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                          {post.excerpt}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-white/20">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(post.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {post.readTime}
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="text-center">
              <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12">
                <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">More Content Coming Soon</h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-2xl mx-auto">
                  We&apos;re working on bringing you more educational content, personal stories, and practical insights. 
                  Have a topic you&apos;d like us to cover? Let us know!
                </p>
                <button
                  onClick={() => navigateToPage('contact')}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white/60 hover:bg-white/80 text-foreground rounded-full transition-all duration-200 transform hover:scale-105 font-medium border border-white/20"
                >
                  <span>Suggest a Topic</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer navigateToPage={navigateToPage} />
    </div>
  )
}