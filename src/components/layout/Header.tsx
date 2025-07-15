import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Menu, Moon, Sun, Heart } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'
import { useFavorites } from '@/hooks/useFavorites'

interface HeaderProps {
  navigateHome: () => void
  navigateToPage: (page: string) => void
  onSearchOpen: () => void
}

export function Header({ navigateHome, navigateToPage, onSearchOpen }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { favoritesCount } = useFavorites()

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo Area */}
            <div className="flex-1 logo-container">
              <button
                onClick={navigateHome}
                className="flex items-center hover:opacity-80 transition-opacity duration-300 cursor-pointer"
              >
                <Image
                  src={theme === 'dark' ? '/logo-light.png' : '/logo.png'}
                  alt="ADHD First Aid Kit"
                  width={300}
                  height={300}
                  className="h-22 sm:h-28 w-auto transition-opacity duration-300"
                  priority
                />
              </button>
            </div>
            
            {/* Header Actions - Search and Menu */}
            <div className="flex items-center space-x-3">
              {/* Search Icon */}
              <Button
                variant="ghost"
                size="default"
                onClick={onSearchOpen}
                className="p-3 rounded-full hover:bg-white/20 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg"
              >
                <Search className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors duration-300" />
              </Button>

              {/* Dropdown Menu */}
              <div className="relative dropdown-container">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="dropdown-trigger p-3 rounded-full hover:bg-white/20 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg"
                >
                  <Menu className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors duration-300" />
                </Button>

                {/* Dropdown Content */}
                {showDropdown && (
                  <div className="dropdown-menu absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-lg shadow-lg border border-white/30 overflow-hidden">
                    {/* First Section: Main Navigation */}
                    <button
                      onClick={() => {
                        navigateToPage('favorites')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700 transition-all duration-200 font-light flex items-center gap-2"
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
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700 transition-all duration-200 font-light"
                    >
                      FAQ
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('blog')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700 transition-all duration-200 font-light"
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
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700 transition-all duration-200 font-light"
                    >
                      About
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('contact')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700 transition-all duration-200 font-light"
                    >
                      Contact Me
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('suggest')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700 transition-all duration-200 font-light"
                    >
                      Suggest a Strategy
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('legal')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700 transition-all duration-200 font-light"
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
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700 transition-all duration-200 font-light flex items-center gap-2"
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