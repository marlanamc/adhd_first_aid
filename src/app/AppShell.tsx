'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SearchModal } from '@/components/ui/SearchModal'
import { ModalProvider, useModal } from '@/contexts/ModalContext'
import { FeedbackModal } from '@/components/ui/FeedbackModal'
import ErrorBoundary from '@/components/ErrorBoundary'
import { getPageType } from '@/lib/getPageType'

function GlobalModals() {
  const { isOpen, closeModal, pageType } = useModal()
  if (!isOpen) return null
  return (
    <FeedbackModal isOpen={isOpen} onClose={closeModal} pageType={pageType} />
  )
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [pageType, setPageType] = useState<
    'home' | 'barrier' | 'feeling' | 'task' | 'complex_loop' | 'identity' | 'guide' | 'script' | 'quiz' | 'resource'
  >('home')

  const currentPageType = useMemo(() => getPageType(pathname), [pathname])

  useEffect(() => {
    setPageType(currentPageType)
  }, [currentPageType])

  useEffect(() => {
    const registerServiceWorker = async () => {
      if (!('serviceWorker' in navigator) || typeof window === 'undefined') return
      try {
        const swResponse = await fetch('/sw.js', { method: 'HEAD' })
        if (!swResponse.ok) return
        await navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
      } catch (err) {
        console.warn('Service worker registration failed:', err)
      }
    }
    if (document.readyState === 'loading') {
      window.addEventListener('load', registerServiceWorker)
    } else {
      registerServiceWorker()
    }
    return () => window.removeEventListener('load', registerServiceWorker)
  }, [])

  const navigateHome = useCallback(() => router.push('/'), [router])
  const navigateToPage = useCallback((page: string) => router.push(`/${page}`), [router])

  return (
    <>
      <div
        className={`fixed inset-0 ${
          pathname.startsWith('/identities') ? 'bg-identities' :
          pathname.startsWith('/complex_loops') ? 'bg-complex-loops' :
          pathname.startsWith('/feelings') ? 'bg-feelings' :
          pathname.startsWith('/barriers') ? 'bg-barriers' :
          pathname.startsWith('/life_areas') ? 'bg-life-areas' :
          'bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900'
        }`}
        style={{ zIndex: -1000, top: 0, left: 0, right: 0, bottom: 0, position: 'fixed' }}
      />
      <ThemeProvider>
        <ModalProvider>
          <div className="min-h-screen flex flex-col relative">
            <Header
              navigateHome={navigateHome}
              navigateToPage={navigateToPage}
              onSearchOpen={() => setIsSearchOpen(true)}
              pageType={pageType}
            />
            <main className="flex-1 flex flex-col relative z-10 mt-[var(--header-height)]">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
            <Footer />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <GlobalModals />
          </div>
        </ModalProvider>
      </ThemeProvider>
    </>
  )
}
