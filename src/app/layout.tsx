'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Inter } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SearchModal } from '@/components/ui/SearchModal'
import { ModalProvider, useModal } from '@/contexts/ModalContext'
import { FeedbackModal } from '@/components/ui/FeedbackModal'
// import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

function GlobalModals() {
  const { isOpen, closeModal, pageType } = useModal()
  if (!isOpen) return null
  return (
    <FeedbackModal isOpen={isOpen} onClose={closeModal} pageType={pageType} />
  )
}

const getPageType = () => {
  if (typeof window === 'undefined') return 'home'
  const path = window.location.pathname
  
  // Main content types
  if (path.startsWith('/barriers')) return 'barrier'
  if (path.startsWith('/feelings')) return 'feeling'
  if (path.startsWith('/life_areas')) return 'task'
  if (path.startsWith('/complex_loops')) return 'complex_loop'
  if (path.startsWith('/identities')) return 'identity'
  
  // Resource pages
  if (path.startsWith('/guides')) return 'guide'
  if (path.startsWith('/scripts')) return 'script'
  if (path.startsWith('/quizzes')) return 'quiz'
  if (path.startsWith('/resources')) return 'resource'
  
  return 'home'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [pageType, setPageType] = useState<
    'home' | 'barrier' | 'feeling' | 'task' | 'complex_loop' | 'identity' | 'guide' | 'script' | 'quiz' | 'resource'
  >('home')

  // Update pageType when URL changes
  useEffect(() => {
    setPageType(getPageType())
  }, [pathname])

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('Service Worker registered successfully:', registration.scope)
          },
          (error) => {
            console.log('Service Worker registration failed:', error)
          }
        )
      })
    }
  }, [])

  const navigateHome = useCallback(() => {
    router.push('/')
  }, [router])

  const navigateToPage = useCallback((page: string) => {
    router.push(`/${page}`)
  }, [router])

  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="light-content" />
        <meta name="apple-mobile-web-app-title" content="ADHD Aid" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        
        {/* Additional PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="ADHD First Aid Kit" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-TileImage" content="/icon-144x144.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} ${playfair.variable}`}>
        <ThemeProvider>
          <ModalProvider>
            <div className="min-h-screen flex flex-col relative">
              <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 -z-10" />

              <Header
                navigateHome={navigateHome}
                navigateToPage={navigateToPage}
                onSearchOpen={() => setIsSearchOpen(true)}
                pageType={pageType}
              />

              <main className="flex-1 flex flex-col relative z-0 mt-header-safe">
                {children}
              </main>

              <Footer
                navigateToPage={navigateToPage}
              />

              <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
              />
              <GlobalModals />
              {/* <PWAInstallPrompt /> */}
            </div>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
