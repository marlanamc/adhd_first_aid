'use client'

import { Inter } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable}`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col relative">
            <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 -z-10" />
            
            <Header 
              navigateHome={() => window.location.href = '/'} 
              navigateToPage={(page: string) => window.location.href = `/${page}`} 
              onSearchOpen={() => {
                // TODO: Implement search functionality
              }} 
            />

            <main className="flex-1 flex flex-col relative z-0">
              {children}
            </main>

            <Footer navigateToPage={(page: string) => window.location.href = `/${page}`} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
