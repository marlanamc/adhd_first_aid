'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ArrowLeft, ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'

// FAQ data
const faqs = [
  {
    id: 1,
    category: "About the Site",
    question: "What is the ADHD First Aid Kit?",
    answer: "The ADHD First Aid Kit is a personalized resource that helps you find practical strategies when you're struggling with ADHD-related challenges. By telling us how you're feeling or what task you're struggling with, we can suggest relevant coping strategies and techniques from our community-curated database."
  },
  {
    id: 2,
    category: "About the Site",
    question: "Is this site a replacement for professional medical advice?",
    answer: "No, absolutely not. This site provides peer support and practical strategies, but it is not medical advice. Always consult with qualified healthcare professionals for diagnosis, treatment, and medical guidance regarding ADHD."
  },
  {
    id: 3,
    category: "About the Site",
    question: "How are the strategies curated?",
    answer: "Our strategies come from community submissions, research, and evidence-based practices. Each strategy is reviewed for safety and relevance before being added to our database. We prioritize practical, real-world approaches that have worked for people in the ADHD community."
  },
  {
    id: 4,
    category: "Using the Site",
    question: "How do I find strategies that work for me?",
    answer: "Start by selecting whether you're dealing with emotions or a specific task. Then, get more specific about your situation - the issue you're facing and any barriers you're encountering. Our system will match you with relevant strategies based on your specific circumstances."
  },
  {
    id: 5,
    category: "Using the Site",
    question: "What if I don't find strategies that help?",
    answer: "Everyone's ADHD experience is different. If our current strategies don't resonate with you, we encourage you to submit your own strategies that have worked for you. You can also contact us with suggestions for new categories or types of support you'd like to see."
  },
  {
    id: 6,
    category: "Using the Site",
    question: "Can I save strategies for later?",
    answer: "Currently, you can bookmark pages in your browser or screenshot strategies you find helpful. We're working on adding user accounts and saving features in the future to make this even easier."
  },
  {
    id: 7,
    category: "ADHD Questions",
    question: "I think I might have ADHD. What should I do?",
    answer: "If you suspect you might have ADHD, the best first step is to speak with a healthcare professional who can properly assess and diagnose ADHD. This might be your primary care doctor, a psychiatrist, or a psychologist who specializes in ADHD."
  },
  {
    id: 8,
    category: "ADHD Questions",
    question: "Are there different types of ADHD?",
    answer: "Yes, ADHD has three main presentations: Primarily Inattentive (difficulty with focus and attention), Primarily Hyperactive-Impulsive (difficulty sitting still and controlling impulses), and Combined (symptoms of both). Many people's symptoms can also change over time."
  },
  {
    id: 9,
    category: "ADHD Questions",
    question: "Can adults have ADHD?",
    answer: "Absolutely. ADHD is a lifelong neurodevelopmental condition. Many adults are diagnosed later in life, sometimes after their children are diagnosed. Adult ADHD symptoms might look different from childhood symptoms but are just as valid and treatable."
  },
  {
    id: 10,
    category: "ADHD Questions",
    question: "Isn't this just common sense? Do people with ADHD really need help with things like this?",
    answer: "What's \"common sense\" for one person might be a daily challenge for someone with ADHD. It's not about intelligence — it's about how the brain processes motivation, memory, time, and emotion. People with ADHD often know what to do, but struggle to do it consistently. These strategies aren't about being smart or dumb — they're about building support systems that actually work with the way your brain operates."
  },
  {
    id: 11,
    category: "Contributing",
    question: "How can I submit my own strategies?",
    answer: "You can submit strategies through our 'Suggest a Strategy' page. We welcome strategies that have genuinely helped you, along with specific examples of how to implement them. All submissions are reviewed before being added to help ensure quality and safety."
  },
  {
    id: 12,
    category: "Contributing",
    question: "What makes a good strategy submission?",
    answer: "Good strategies are specific, actionable, and include real examples. Instead of 'be organized,' a good strategy might be 'use a daily brain dump where you write down every task in your head for 5 minutes each morning, then pick the top 3 to focus on.' Include what worked, when it worked, and any tips for implementation."
  },
  {
    id: 13,
    category: "Privacy & Safety",
    question: "Do you collect personal information?",
    answer: "We collect minimal information necessary to operate the site. We don't require accounts to use our basic features, and we don't sell personal information. See our Privacy Policy for complete details about what information we collect and how it's used."
  }
]

const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))]

export default function FAQPage() {
  const router = useRouter()
  const [openItems, setOpenItems] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToPage = (page: string) => {
    router.push(`/${page}`)
  }

  const goBack = () => {
    router.back()
  }

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

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
                Frequently Asked Questions
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                Common questions about ADHD, our site, and how to get the most out of the resources available
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-white/20 ${
                    selectedCategory === category
                      ? 'bg-primary/20 text-primary border-primary/30'
                      : 'bg-white/60 text-muted-foreground hover:bg-white/80 hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4 mb-16">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg overflow-hidden"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/50 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        openItems.includes(faq.id) ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {openItems.includes(faq.id) && (
                    <div className="px-6 pb-6">
                      <div className="pt-4 border-t border-white/20">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary/10 to-purple/10 border border-primary/20 rounded-2xl p-8 md:p-12">
                <MessageCircle className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">Still Have Questions?</h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-2xl mx-auto">
                  Can&apos;t find what you&apos;re looking for? We&apos;re here to help! Reach out with any questions 
                  about ADHD, our site, or suggestions for improvement.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigateToPage('contact')}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full transition-all duration-200 transform hover:scale-105 font-medium"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Contact Us</span>
                  </button>
                  <button
                    onClick={() => navigateToPage('suggest')}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-white/60 hover:bg-white/80 text-foreground rounded-full transition-all duration-200 transform hover:scale-105 font-medium border border-white/20"
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span>Suggest a Strategy</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main></div>
  )
}