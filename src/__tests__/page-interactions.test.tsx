import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ModalProvider } from '../contexts/ModalContext'
import { Header } from '../components/layout/Header'
import SearchModal from '../components/ui/SearchModal'
import FeedbackModal from '../components/ui/FeedbackModal'

// Mock Next.js router
const mockPush = jest.fn()
const mockBack = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    pathname: '/',
  }),
  usePathname: () => '/',
}))

// Mock Supabase functions
jest.mock('../lib/supabase', () => ({
  getFeelingsContent: jest.fn(),
  getFeelingSources: jest.fn(),
  getBarriersContent: jest.fn(),
  getBarrierSources: jest.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock as any

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <ModalProvider>
      {children}
    </ModalProvider>
  </ThemeProvider>
)

describe('Page Interaction Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('light')
  })

  describe('Header Navigation Flow', () => {
    it('should complete full navigation flow: home -> feelings -> search -> theme toggle', async () => {
      const mockNavigateHome = jest.fn()
      const mockNavigateToPage = jest.fn()
      const mockOnSearchOpen = jest.fn()
      const mockOnSearchClose = jest.fn()

      const { rerender } = render(
        <TestWrapper>
          <Header
            navigateHome={mockNavigateHome}
            navigateToPage={mockNavigateToPage}
            onSearchOpen={mockOnSearchOpen}
            pageType="home"
          />
          <SearchModal
            isOpen={false}
            onClose={mockOnSearchClose}
          />
        </TestWrapper>
      )

      // 1. Click logo to go home
      const logoButton = screen.getByRole('button', { name: /adhd first aid kit/i })
      fireEvent.click(logoButton)
      expect(mockNavigateHome).toHaveBeenCalled()

      // 2. Open dropdown menu
      const menuButton = screen.getByRole('button', { name: /menu/i })
      fireEvent.click(menuButton)

      // 3. Navigate to feelings section
      const feelingsLink = screen.getByText('Feelings')
      fireEvent.click(feelingsLink)
      expect(mockNavigateToPage).toHaveBeenCalledWith('feelings')

      // 4. Open search modal
      const searchButton = screen.getByRole('button', { name: /search/i })
      fireEvent.click(searchButton)
      expect(mockOnSearchOpen).toHaveBeenCalled()

      // 5. Rerender with search modal open
      rerender(
        <TestWrapper>
          <Header
            navigateHome={mockNavigateHome}
            navigateToPage={mockNavigateToPage}
            onSearchOpen={mockOnSearchOpen}
            pageType="feeling"
          />
          <SearchModal
            isOpen={true}
            onClose={mockOnSearchClose}
          />
        </TestWrapper>
      )

      // Search modal should be visible
      expect(screen.getByText('Search')).toBeInTheDocument()
    })

    it('should handle theme persistence across navigation', async () => {
      localStorageMock.getItem.mockReturnValue('dark')

      render(
        <TestWrapper>
          <Header
            navigateHome={() => {}}
            navigateToPage={() => {}}
            onSearchOpen={() => {}}
            pageType="home"
          />
        </TestWrapper>
      )

      // Theme should be applied
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })

      // Open dropdown menu
      const menuButton = screen.getByRole('button', { name: /menu/i })
      fireEvent.click(menuButton)

      // Dropdown should have dark theme styling
      const dropdown = screen.getByRole('menu')
      expect(dropdown).toHaveClass('dark:bg-warm-gray-800')
    })
  })

  describe('Modal Integration Flow', () => {
    it('should handle multiple modal states correctly', () => {
      const mockOnSearchOpen = jest.fn()
      const mockOnSearchClose = jest.fn()

      const { rerender } = render(
        <TestWrapper>
          <Header
            navigateHome={() => {}}
            navigateToPage={() => {}}
            onSearchOpen={mockOnSearchOpen}
            pageType="home"
          />
          <SearchModal
            isOpen={false}
            onClose={mockOnSearchClose}
          />
          <FeedbackModal
            isOpen={false}
            onClose={() => {}}
            pageType="home"
          />
        </TestWrapper>
      )

      // Open search modal
      const searchButton = screen.getByRole('button', { name: /search/i })
      fireEvent.click(searchButton)

      // Rerender with search modal open
      rerender(
        <TestWrapper>
          <Header
            navigateHome={() => {}}
            navigateToPage={() => {}}
            onSearchOpen={mockOnSearchOpen}
            pageType="home"
          />
          <SearchModal
            isOpen={true}
            onClose={mockOnSearchClose}
          />
          <FeedbackModal
            isOpen={false}
            onClose={() => {}}
            pageType="home"
          />
        </TestWrapper>
      )

      // Search modal should be visible
      expect(screen.getByText('Search')).toBeInTheDocument()

      // Close search modal and open feedback modal
      mockOnSearchClose()

      rerender(
        <TestWrapper>
          <Header
            navigateHome={() => {}}
            navigateToPage={() => {}}
            onSearchOpen={mockOnSearchOpen}
            pageType="home"
          />
          <SearchModal
            isOpen={false}
            onClose={mockOnSearchClose}
          />
          <FeedbackModal
            isOpen={true}
            onClose={() => {}}
            pageType="home"
          />
        </TestWrapper>
      )

      // Search modal should be hidden, feedback modal should be visible
      expect(screen.queryByText('Search')).not.toBeInTheDocument()
      expect(screen.getByText(/Share Your Thoughts/)).toBeInTheDocument()
    })
  })

  describe('Responsive Navigation Flow', () => {
    it('should handle mobile navigation patterns', () => {
      const mockNavigateToPage = jest.fn()

      render(
        <TestWrapper>
          <Header
            navigateHome={() => {}}
            navigateToPage={mockNavigateToPage}
            onSearchOpen={() => {}}
            pageType="home"
          />
        </TestWrapper>
      )

      // Open dropdown menu (simulating mobile menu)
      const menuButton = screen.getByRole('button', { name: /menu/i })
      fireEvent.click(menuButton)

      // Navigate through different sections
      const sections = ['Feelings', 'Barriers', 'Complex Loops', 'Identity']

      sections.forEach(section => {
        // Re-open menu for each navigation (simulating mobile behavior)
        fireEvent.click(menuButton)

        // Click on section link
        const sectionLink = screen.getByText(section)
        fireEvent.click(sectionLink)

        expect(mockNavigateToPage).toHaveBeenCalledWith(section.toLowerCase().replace(' ', '_'))
      })
    })

    it('should maintain accessibility during interactions', () => {
      render(
        <TestWrapper>
          <Header
            navigateHome={() => {}}
            navigateToPage={() => {}}
            onSearchOpen={() => {}}
            pageType="home"
          />
        </TestWrapper>
      )

      // All interactive elements should be keyboard accessible
      const buttons = screen.getAllByRole('button')

      buttons.forEach(button => {
        expect(button).toBeEnabled()
        expect(button).toHaveAttribute('type')
      })

      // Test keyboard navigation
      const searchButton = screen.getByRole('button', { name: /search/i })
      const menuButton = screen.getByRole('button', { name: /menu/i })

      // Focus management should work
      searchButton.focus()
      expect(document.activeElement).toBe(searchButton)

      menuButton.focus()
      expect(document.activeElement).toBe(menuButton)
    })
  })

  describe('Error Recovery Flow', () => {
    const ErrorTriggerComponent = ({ shouldError }: { shouldError: boolean }) => {
      const [errorCount, setErrorCount] = React.useState(0)

      if (shouldError) {
        throw new Error(`Test error ${errorCount}`)
      }

      return (
        <div>
          <button onClick={() => setErrorCount(errorCount + 1)}>
            Trigger Error
          </button>
          <span data-testid="error-count">{errorCount}</span>
        </div>
      )
    }

    it('should handle error recovery with component state preservation', () => {
      // Mock console.error to avoid noise
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

      const { rerender } = render(
        <TestWrapper>
          <ErrorBoundary>
            <Header
              navigateHome={() => {}}
              navigateToPage={() => {}}
              onSearchOpen={() => {}}
              pageType="home"
            />
            <ErrorTriggerComponent shouldError={false} />
          </ErrorBoundary>
        </TestWrapper>
      )

      // Initial state
      expect(screen.getByTestId('error-count')).toHaveTextContent('0')

      // Trigger error
      fireEvent.click(screen.getByText('Trigger Error'))

      // Should show error UI
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()

      // Click try again
      fireEvent.click(screen.getByText('Try Again'))

      // Rerender with non-error component
      rerender(
        <TestWrapper>
          <ErrorBoundary>
            <Header
              navigateHome={() => {}}
              navigateToPage={() => {}}
              onSearchOpen={() => {}}
              pageType="home"
            />
            <ErrorTriggerComponent shouldError={false} />
          </ErrorBoundary>
        </TestWrapper>
      )

      // Component should recover and maintain its state
      expect(screen.getByTestId('error-count')).toHaveTextContent('1')
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument()

      consoleError.mockRestore()
    })
  })

  describe('Theme and Navigation Integration', () => {
    it('should handle theme changes during navigation', async () => {
      // Start with light theme
      localStorageMock.getItem.mockReturnValue('light')

      const { rerender } = render(
        <TestWrapper>
          <Header
            navigateHome={() => {}}
            navigateToPage={() => {}}
            onSearchOpen={() => {}}
            pageType="home"
          />
        </TestWrapper>
      )

      // Should start with light theme
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false)
      })

      // Switch to dark theme
      localStorageMock.getItem.mockReturnValue('dark')

      rerender(
        <TestWrapper>
          <Header
            navigateHome={() => {}}
            navigateToPage={() => {}}
            onSearchOpen={() => {}}
            pageType="feeling"
          />
        </TestWrapper>
      )

      // Should switch to dark theme
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })

      // Theme should be saved
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
    })

    it('should maintain user preferences across interactions', async () => {
      localStorageMock.getItem.mockReturnValue('dark')

      render(
        <TestWrapper>
          <Header
            navigateHome={() => {}}
            navigateToPage={() => {}}
            onSearchOpen={() => {}}
            pageType="barrier"
          />
        </TestWrapper>
      )

      // Should remember dark theme preference
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })

      // Open dropdown menu
      const menuButton = screen.getByRole('button', { name: /menu/i })
      fireEvent.click(menuButton)

      // Menu should use dark theme styling
      const dropdown = screen.getByRole('menu')
      expect(dropdown).toHaveClass('dark:bg-warm-gray-800')
    })
  })
})
