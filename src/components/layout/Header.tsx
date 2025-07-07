import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Menu, X } from 'lucide-react'

interface HeaderProps {
  navigateHome: () => void
  navigateToPage: (page: string) => void
}

export function Header({ navigateHome, navigateToPage }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo/Title Area */}
            <div className="flex-1">
              <button
                onClick={navigateHome}
                className="text-2xl sm:text-3xl font-serif text-foreground hover:text-primary transition-colors duration-300 cursor-pointer"
              >
                ADHD First Aid Kit
              </button>
            </div>
            
            {/* Header Actions - Search and Menu */}
            <div className="flex items-center space-x-3">
              {/* Search Icon */}
              <Button
                variant="ghost"
                size="default"
                onClick={() => setShowSearch(!showSearch)}
                className="p-3 rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <Search className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors duration-300" />
              </Button>

              {/* Dropdown Menu */}
              <div className="relative dropdown-container">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="dropdown-trigger p-3 rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg"
                >
                  <Menu className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors duration-300" />
                </Button>

                {/* Dropdown Content */}
                {showDropdown && (
                  <div className="dropdown-menu absolute top-14 right-0 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/30 py-2 z-50">
                    <button
                      onClick={() => {
                        navigateToPage('about')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all duration-200 font-light"
                    >
                      About
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('faq')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all duration-200 font-light"
                    >
                      FAQ
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('terminology')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all duration-200 font-light"
                    >
                      Terminology
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('blog')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all duration-200 font-light"
                    >
                      Blog
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('legal')
                        setShowDropdown(false)
                      }}
                      className="dropdown-item w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all duration-200 font-light"
                    >
                      Legal & Privacy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-white/30 shadow-lg">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for strategies..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 text-base h-14 bg-white/60 backdrop-blur-sm border-0 shadow-sm focus:shadow-md transition-all duration-300 rounded-full font-light"
                autoFocus
              />
              <Button
                variant="ghost"
                size="default"
                onClick={() => setShowSearch(false)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-white/20"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 