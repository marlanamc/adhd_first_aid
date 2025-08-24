'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
// Using static font classes from globals.css to avoid hydration issues
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SearchModal } from '@/components/ui/SearchModal'
import { ModalProvider, useModal } from '@/contexts/ModalContext'
import { FeedbackModal } from '@/components/ui/FeedbackModal'
// import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt'

// Fonts are now imported via CSS to prevent hydration mismatches

function GlobalModals() {
  const { isOpen, closeModal, pageType } = useModal()
  if (!isOpen) return null
  return (
    <FeedbackModal isOpen={isOpen} onClose={closeModal} pageType={pageType} />
  )
}

// Pure function to determine page type from URL path
// Moved outside component to prevent unnecessary re-renders
export const getPageType = (pathname?: string) => {
  if (typeof window === 'undefined') return 'home'

  // Use provided pathname or get from window.location
  const path = pathname || window.location.pathname

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

  // Memoize pageType calculation for optimal performance
  const currentPageType = useMemo(() => getPageType(pathname), [pathname])

  // Update pageType when URL changes
  useEffect(() => {
    setPageType(currentPageType)
  }, [currentPageType])

  // Enhanced service worker registration with proper error handling
  useEffect(() => {
    const registerServiceWorker = async () => {
      // Check if service worker is supported
      if (!('serviceWorker' in navigator) || typeof window === 'undefined') {
        console.info('Service Worker: Not supported in this environment')
        return
      }

      try {
        // Check if service worker file exists before attempting registration
        const swResponse = await fetch('/sw.js', { method: 'HEAD' })
        if (!swResponse.ok) {
          console.warn('Service Worker: sw.js file not found, PWA features disabled')
          return
        }

        // Register service worker with enhanced error handling
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none' // Force checking for updates
        })

        console.log('✅ Service Worker registered successfully:', registration.scope)

        // Optional: Show success notification to user
        // You can integrate this with your existing notification system
        console.info('🚀 PWA Ready: App can be installed and works offline!')

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 Service Worker updated, new version available')
                // Optionally show update notification to user
                // showUpdateNotification()
              }
            })
          }
        })

        // Handle service worker controller change (new version activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('🔄 Service Worker controller changed, page will reload')
          // Optional: Show user that page will reload due to update
          window.location.reload()
        })

      } catch (error) {
        console.error('❌ Service Worker registration failed:', error)

        // Provide user feedback for critical errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'

        // Log detailed error information for debugging
        console.error('Service Worker Error Details:', {
          error: errorMessage,
          userAgent: navigator.userAgent,
          isSecureContext: window.isSecureContext,
          serviceWorkerSupported: 'serviceWorker' in navigator
        })

        // Show user-friendly error notification
        // You can integrate this with your existing notification system
        console.warn('⚠️ PWA Features Limited: Service worker could not be registered. Offline functionality and app installation may not work properly.')
      }
    }

    // Register service worker after page load to avoid blocking
    if (document.readyState === 'loading') {
      window.addEventListener('load', registerServiceWorker)
    } else {
      registerServiceWorker()
    }

    // Cleanup function
    return () => {
      window.removeEventListener('load', registerServiceWorker)
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
      <body className="font-inter">
        <ThemeProvider>
          <ModalProvider>
            <div className="min-h-screen flex flex-col relative">
              {/* Background gradient that covers entire viewport including behind header */}
              <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 -z-20" />

              <Header
                navigateHome={navigateHome}
                navigateToPage={navigateToPage}
                onSearchOpen={() => setIsSearchOpen(true)}
                pageType={pageType}
              />

              {/* Main content positioned below header */}
              <main className="flex-1 flex flex-col relative z-10">
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
