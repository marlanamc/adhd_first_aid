'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SearchModal } from '@/components/ui/SearchModal'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <html lang="en">
      <head>
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
          <div className="min-h-screen flex flex-col relative">
            <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 -z-10" />
            
            <Header 
              navigateHome={() => window.location.href = '/'} 
              navigateToPage={(page: string) => window.location.href = `/${page}`} 
              onSearchOpen={() => setIsSearchOpen(true)} 
            />

            <main className="flex-1 flex flex-col relative z-0">
              {children}
            </main>

            <Footer navigateToPage={(page: string) => window.location.href = `/${page}`} />
            
            <SearchModal 
              isOpen={isSearchOpen} 
              onClose={() => setIsSearchOpen(false)} 
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
