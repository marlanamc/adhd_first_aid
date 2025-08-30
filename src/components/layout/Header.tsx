'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Menu, Moon, Sun, Heart } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useFavorites } from '@/hooks/useFavorites'

interface HeaderProps {
  navigateHome: () => void
  navigateToPage: (page: string) => void
  onSearchOpen: () => void
  pageType?: 'home' | 'barrier' | 'feeling' | 'task' | 'complex_loop' | 'identity' | 'guide' | 'script' | 'quiz' | 'resource'
}

const getLogoColor = (pageType: string | undefined, isDark: boolean) => {
  switch (pageType) {
    // Main content types
    case 'barrier':
      return isDark ? 'text-orange-300' : 'text-orange-500'
    case 'feeling':
      return isDark ? 'text-pink-300' : 'text-pink-500'
    case 'task':
      return isDark ? 'text-green-300' : 'text-green-500'
    case 'complex_loop':
      return isDark ? 'text-blue-300' : 'text-blue-500'
    case 'identity':
      return isDark ? 'text-purple-300' : 'text-purple-500'
    
    // Resource pages
    case 'guide':
      return isDark ? 'text-blue-300' : 'text-blue-500'
    case 'script':
      return isDark ? 'text-purple-300' : 'text-purple-500'
    case 'quiz':
      return isDark ? 'text-emerald-300' : 'text-emerald-500'
    case 'resource':
      return isDark ? 'text-pink-300' : 'text-pink-500'
    
    // Default for home and unspecified pages
    default:
      return isDark ? 'text-blue-300' : 'text-pink-500'
  }
}

export function Header({ navigateHome, navigateToPage, onSearchOpen, pageType }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { favoritesCount } = useFavorites()

  // Handle client-side only rendering for safe area
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {/* Fixed Header - Background extends to absolute top */}
      <header
        className="fixed inset-x-0 top-0 z-50 backdrop-blur-sm bg-transparent border-b border-white/20 dark:border-warm-gray-700 shadow-sm"
        style={isClient ? { paddingTop: 'env(safe-area-inset-top)' } : {}}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-1 min-h-[60px]">
            {/* Logo Area */}
            <div className="flex-1 logo-container">
              <button
                onClick={navigateHome}
                className="flex items-center hover:opacity-60 transition-opacity duration-300 cursor-pointer"
              >
                <span className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-[#22223B] dark:text-white">
                  ADHD <span className={getLogoColor(pageType, theme === 'dark')}>First Aid</span> Kit
                </span>
              </button>
            </div>
            
            {/* Header Actions - Search and Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Icon */}
              <Button
                variant="ghost"
                size="default"
                onClick={onSearchOpen}
                className="p-2 sm:p-3 rounded-full hover:bg-white/20 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground hover:text-foreground transition-colors duration-300" />
              </Button>

              {/* Dropdown Menu */}
              <div className="relative dropdown-container">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="dropdown-trigger p-2 sm:p-3 rounded-full hover:bg-white/20 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground hover:text-foreground transition-colors duration-300" />
                </Button>

                {/* Dropdown Content */}
                {showDropdown && (
                  <div className="dropdown-menu absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white/95 dark:bg-warm-gray-800/95 backdrop-blur-lg rounded-lg shadow-lg border border-white/30 dark:border-warm-gray-600 overflow-hidden z-50">
                    {/* First Section: Main Navigation */}
                    <button
                      onClick={() => {
                        navigateToPage('favorites')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-3 sm:px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-warm-gray-700 transition-all duration-200 font-light touch-manipulation min-h-[44px] flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      <span>My Favorites</span>
                      {favoritesCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {favoritesCount}
                        </span>
                      )}
                    </button>
                    {/* Second Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
                    <button
                      onClick={() => {
                        navigateToPage('faq')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-3 sm:px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-warm-gray-700 transition-all duration-200 font-light touch-manipulation min-h-[44px]"
                    >
                      FAQ
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('blog')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-3 sm:px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-warm-gray-700 transition-all duration-200 font-light touch-manipulation min-h-[44px]"
                    >
                      Blog
                    </button>

                    {/* Third Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

                    {/* Second Section: Secondary Pages */}
                    <button
                      onClick={() => {
                        navigateToPage('about')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-3 sm:px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-warm-gray-700 transition-all duration-200 font-light touch-manipulation min-h-[44px]"
                    >
                      About
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('contact')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-3 sm:px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-warm-gray-700 transition-all duration-200 font-light touch-manipulation min-h-[44px]"
                    >
                      Contact Me
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('suggest')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-3 sm:px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-warm-gray-700 transition-all duration-200 font-light touch-manipulation min-h-[44px]"
                    >
                      Suggest a Strategy
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('legal')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-3 sm:px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-warm-gray-700 transition-all duration-200 font-light touch-manipulation min-h-[44px]"
                    >
                      Legal & Privacy
                    </button>

                    {/* Second Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

                    {/* Third Section: Settings */}
                    <button
                      onClick={() => {
                        toggleTheme()
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-3 sm:px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-warm-gray-700 transition-all duration-200 font-light touch-manipulation min-h-[44px] flex items-center gap-2"
                    >
                      {theme === 'light' ? (
                        <>
                          <Moon className="h-4 w-4" />
                          Dark Mode
                        </>
                      ) : (
                        <>
                          <Sun className="h-4 w-4" />
                          Light Mode
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
} 