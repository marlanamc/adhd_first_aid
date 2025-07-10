'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, Shield, Eye, FileText, AlertTriangle } from 'lucide-react'

export default function LegalPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('privacy')

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToPage = (page: string) => {
    router.push(`/${page}`)
  }

  const goBack = () => {
    router.back()
  }

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Use', icon: FileText },
    { id: 'disclaimer', label: 'Medical Disclaimer', icon: AlertTriangle }
  ]

  const lastUpdated = "March 2024"

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
                Legal & Privacy
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                Your privacy and safety are important to us. Here&apos;s how we handle your information and what you should know about using our site.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 border border-white/20 ${
                      activeTab === tab.id
                        ? 'bg-primary/20 text-primary border-primary/30'
                        : 'bg-white/60 text-muted-foreground hover:bg-white/80 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="text-sm text-muted-foreground mb-6">
                Last updated: {lastUpdated}
              </div>

              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif text-foreground mb-4">Privacy Policy</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      We believe in being transparent about how we collect, use, and protect your information. 
                      This policy explains our practices in simple terms.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h3>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <div>
                        <strong className="text-foreground">Usage Information:</strong> We collect basic information about how you use our site, including pages visited, time spent, and interactions with strategies. This helps us understand what&apos;s helpful and improve the experience.
                      </div>
                      <div>
                        <strong className="text-foreground">Form Submissions:</strong> When you contact us or submit strategies, we collect the information you provide (name, email, message content). This is only used to respond to your message and improve our resources.
                      </div>
                      <div>
                        <strong className="text-foreground">Technical Information:</strong> We collect standard web information like IP addresses, browser types, and device information to ensure our site works properly and securely.
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">How We Use Your Information</h3>
                    <ul className="space-y-2 text-muted-foreground leading-relaxed">
                      <li>• Provide and improve our services</li>
                      <li>• Respond to your messages and requests</li>
                      <li>• Analyze usage to make the site more helpful</li>
                      <li>• Ensure security and prevent abuse</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">What We Don&apos;t Do</h3>
                    <ul className="space-y-2 text-muted-foreground leading-relaxed">
                      <li>• We don&apos;t sell your personal information</li>
                      <li>• We don&apos;t share your information with third parties for marketing</li>
                      <li>• We don&apos;t require accounts for basic site usage</li>
                      <li>• We don&apos;t track you across other websites</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Data Security</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We use industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure, so we cannot guarantee absolute security.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Your Rights</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      You have the right to access, correct, or delete your personal information. If you have questions about your data or want to exercise these rights, please contact us.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif text-foreground mb-4">Terms of Use</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      By using the ADHD First Aid Kit, you agree to these terms. We&apos;ve tried to keep them straightforward and fair.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Acceptable Use</h3>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>This site is designed to provide peer support and practical strategies for ADHD-related challenges. When using our site, please:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• Use the site respectfully and constructively</li>
                        <li>• Submit accurate information in forms and suggestions</li>
                        <li>• Respect the experiences and strategies shared by others</li>
                        <li>• Follow applicable laws and regulations</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Content Submissions</h3>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>When you submit strategies, comments, or other content:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• You grant us permission to use and share your submissions to help others</li>
                        <li>• You confirm that the content is your own or you have permission to share it</li>
                        <li>• We may edit submissions for clarity, safety, or length</li>
                        <li>• We reserve the right to remove content that violates these terms</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Intellectual Property</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The content on this site is protected by copyright and other intellectual property laws. You may use our content for personal, non-commercial purposes. For other uses, please contact us.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Disclaimers</h3>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>We provide this site &quot;as is&quot; and make no warranties about:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• The accuracy or completeness of strategies</li>
                        <li>• The suitability of strategies for your specific situation</li>
                        <li>• Uninterrupted access to the site</li>
                        <li>• The security of data transmission</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Changes to Terms</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We may update these terms occasionally. When we do, we&apos;ll update the date at the top of this page. Continued use of the site after changes constitutes acceptance of the new terms.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'disclaimer' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif text-foreground mb-4">Medical Disclaimer</h2>
                    <div className="bg-red-50/80 border border-red-200/60 rounded-lg p-6 mb-6">
                      <div className="flex items-start">
                        <AlertTriangle className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-red-800 font-semibold mb-2">Important: This is not medical advice</p>
                          <p className="text-red-700 text-sm">
                            The information on this site is for educational and peer support purposes only. 
                            It is not intended as medical advice or treatment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">What This Site Is</h3>
                    <ul className="space-y-2 text-muted-foreground leading-relaxed">
                      <li>• A peer support resource sharing practical strategies</li>
                      <li>• Educational information about ADHD experiences</li>
                      <li>• A collection of community-sourced coping techniques</li>
                      <li>• A tool to help you explore different approaches to challenges</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">What This Site Is NOT</h3>
                    <ul className="space-y-2 text-muted-foreground leading-relaxed">
                      <li>• Medical or psychiatric advice</li>
                      <li>• A replacement for professional treatment</li>
                      <li>• A diagnostic tool</li>
                      <li>• Emergency or crisis support</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">When to Seek Professional Help</h3>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>Please consult with qualified healthcare professionals if you:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• Need an ADHD diagnosis or assessment</li>
                        <li>• Are considering medication or treatment changes</li>
                        <li>• Have concerns about your mental health</li>
                        <li>• Are experiencing severe symptoms or distress</li>
                        <li>• Have questions about specific medical conditions</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Crisis Resources</h3>
                    <div className="bg-blue-50/80 border border-blue-200/60 rounded-lg p-6">
                      <div className="space-y-3 text-blue-800">
                        <p className="font-semibold">If you&apos;re in crisis or need immediate help:</p>
                        <ul className="space-y-2 text-sm">
                          <li>• Call 988 (Suicide & Crisis Lifeline) - US</li>
                          <li>• Text &quot;HELLO&quot; to 741741 (Crisis Text Line)</li>
                          <li>• Call 911 for emergencies</li>
                          <li>• Contact your local emergency services</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Use at Your Own Risk</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Strategies shared on this site come from personal experiences and may not be suitable for everyone. 
                      Always consider your individual circumstances and consult professionals when in doubt. 
                      We are not responsible for any consequences of using the strategies or information provided.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">About the Creator</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      This site was created by someone with personal experience with ADHD, not a medical professional. 
                      The goal is to share helpful strategies and create a supportive community, not to provide clinical advice.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="mt-16 text-center">
              <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
                <Eye className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">Questions About Our Policies?</h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                  If you have questions about these policies or how we handle your information, 
                  please don&apos;t hesitate to reach out.
                </p>
                <button
                  onClick={() => navigateToPage('contact')}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  <span>Contact Us</span>
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