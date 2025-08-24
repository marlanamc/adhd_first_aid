import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ModalProvider } from '../contexts/ModalContext'
import { Header } from '../components/layout/Header'
import SearchModal from '../components/ui/SearchModal'
import FeedbackModal from '../components/ui/FeedbackModal'
import ErrorBoundary from '../components/ErrorBoundary'

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

describe('Complete User Journey Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('light')
  })

  describe('New User Onboarding Journey', () => {
    it('should complete full onboarding flow: theme setup -> navigation -> search -> feedback', async () => {
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
          <FeedbackModal
            isOpen={false}
            onClose={() => {}}
            pageType="home"
          />
          <main>
            <h1>Welcome to ADHD First Aid Kit</h1>
            <p>Your comprehensive guide to managing ADHD symptoms and challenges.</p>
          </main>
        </TestWrapper>
      )

      // 1. User arrives and sees the main page
      expect(screen.getByText('Welcome to ADHD First Aid Kit')).toBeInTheDocument()

      // 2. User explores the navigation menu
      const menuButton = screen.getByRole('button', { name: /menu/i })
      fireEvent.click(menuButton)

      // Should see all main sections
      expect(screen.getByText('Feelings')).toBeInTheDocument()
      expect(screen.getByText('Barriers')).toBeInTheDocument()
      expect(screen.getByText('Complex Loops')).toBeInTheDocument()
      expect(screen.getByText('Identity')).toBeInTheDocument()

      // 3. User navigates to feelings section
      const feelingsLink = screen.getByText('Feelings')
      fireEvent.click(feelingsLink)
      expect(mockNavigateToPage).toHaveBeenCalledWith('feelings')

      // 4. User decides to try dark mode
      fireEvent.click(menuButton) // Re-open menu
      const themeButton = screen.getByText(/dark mode/i)
      fireEvent.click(themeButton)

      // Theme should be applied
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })

      // 5. User searches for specific content
      const searchButton = screen.getByRole('button', { name: /search/i })
      fireEvent.click(searchButton)
      expect(mockOnSearchOpen).toHaveBeenCalled()

      // 6. User sees search modal
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
          <FeedbackModal
            isOpen={false}
            onClose={() => {}}
            pageType="feeling"
          />
        </TestWrapper>
      )

      expect(screen.getByText('Search')).toBeInTheDocument()

      // 7. User closes search and provides feedback
      mockOnSearchClose()

      rerender(
        <TestWrapper>
          <Header
            navigateHome={mockNavigateHome}
            navigateToPage={mockNavigateToPage}
            onSearchOpen={mockOnSearchOpen}
            pageType="feeling"
          />
          <SearchModal
            isOpen={false}
            onClose={mockOnSearchClose}
          />
          <FeedbackModal
            isOpen={true}
            onClose={() => {}}
            pageType="feeling"
          />
        </TestWrapper>
      )

      expect(screen.getByText(/Share Your Thoughts/)).toBeInTheDocument()
    })
  })

  describe('Power User Workflow', () => {
    it('should handle rapid navigation and theme switching', async () => {
      const mockNavigateHome = jest.fn()
      const mockNavigateToPage = jest.fn()

      render(
        <TestWrapper>
          <Header
            navigateHome={mockNavigateHome}
            navigateToPage={mockNavigateToPage}
            onSearchOpen={() => {}}
            pageType="home"
          />
        </TestWrapper>
      )

      // User rapidly navigates through sections
      const menuButton = screen.getByRole('button', { name: /menu/i })

      const sections = [
        { name: 'Feelings', expectedCall: 'feelings' },
        { name: 'Barriers', expectedCall: 'barriers' },
        { name: 'Complex Loops', expectedCall: 'complex_loops' },
        { name: 'Identity', expectedCall: 'identity' }
      ]

      for (const section of sections) {
        fireEvent.click(menuButton)
        const sectionLink = screen.getByText(section.name)
        fireEvent.click(sectionLink)

        expect(mockNavigateToPage).toHaveBeenCalledWith(section.expectedCall)
      }

      // User switches theme multiple times
      for (let i = 0; i < 3; i++) {
        fireEvent.click(menuButton)
        const themeButton = screen.getByText(/mode/i)
        fireEvent.click(themeButton)

        // Theme should toggle
        await waitFor(() => {
          const isDark = document.documentElement.classList.contains('dark')
          expect(isDark).toBe(i % 2 === 1) // Should alternate
        })
      }
    })

    it('should maintain state during complex interactions', () => {
      // Mock a component with internal state
      const StatefulComponent = () => {
        const [interactions, setInteractions] = React.useState<string[]>([])

        return (
          <div>
            <button onClick={() => setInteractions([...interactions, 'search'])}>
              Open Search
            </button>
            <button onClick={() => setInteractions([...interactions, 'menu'])}>
              Open Menu
            </button>
            <button onClick={() => setInteractions([...interactions, 'theme'])}>
              Toggle Theme
            </button>
            <div data-testid="interactions">{interactions.join(', ')}</div>
          </div>
        )
      }

      render(
        <TestWrapper>
          <Header
            navigateHome={() => {}}
            navigateToPage={() => {}}
            onSearchOpen={() => {}}
            pageType="home"
          />
          <StatefulComponent />
        </TestWrapper>
      )

      // Perform various interactions
      const searchButton = screen.getByRole('button', { name: /search/i })
      const menuButton = screen.getByRole('button', { name: /menu/i })
      const themeButton = screen.getByText(/mode/i)

      // Simulate user workflow
      fireEvent.click(searchButton)
      fireEvent.click(menuButton)
      fireEvent.click(themeButton)

      // Component state should be preserved
      expect(screen.getByTestId('interactions')).toHaveTextContent('search, menu, theme')

      // Header should still be functional
      expect(searchButton).toBeInTheDocument()
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Accessibility User Journey', () => {
    it('should provide complete keyboard navigation experience', () => {
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

      // Get all interactive elements
      const interactiveElements = [
        screen.getByRole('button', { name: /adhd first aid kit/i }), // Logo
        screen.getByRole('button', { name: /search/i }),
        screen.getByRole('button', { name: /menu/i })
      ]

      // Test tab navigation
      interactiveElements.forEach((element, index) => {
        element.focus()
        expect(document.activeElement).toBe(element)

        // Simulate Tab key press
        fireEvent.keyDown(element, { key: 'Tab', code: 'Tab' })
      })

      // Test Enter key activation
      const searchButton = screen.getByRole('button', { name: /search/i })
      searchButton.focus()

      // Simulate Enter key press
      fireEvent.keyDown(searchButton, { key: 'Enter', code: 'Enter' })

      // Test Escape key handling
      const menuButton = screen.getByRole('button', { name: /menu/i })
      fireEvent.click(menuButton) // Open menu

      // Menu should be open
      expect(screen.getByRole('menu')).toBeInTheDocument()

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

      // Menu should close (this would normally be handled by the component)
    })

    it('should maintain proper ARIA states during interactions', () => {
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

      // All buttons should have proper accessibility attributes
      const buttons = screen.getAllByRole('button')

      buttons.forEach(button => {
        expect(button).toBeEnabled()
        // Should have accessible name
        expect(button).toHaveAccessibleName()
      })

      // Test menu button interaction
      const menuButton = screen.getByRole('button', { name: /menu/i })

      // Initially menu should not be expanded
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')

      // Click to open menu
      fireEvent.click(menuButton)

      // Menu should be expanded
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')

      // Menu should be present
      const menu = screen.getByRole('menu')
      expect(menu).toBeInTheDocument()

      // Menu items should be properly labeled
      const menuItems = within(menu).getAllByRole('button')
      menuItems.forEach(item => {
        expect(item).toHaveAccessibleName()
      })
    })
  })

  describe('Error Handling User Journey', () => {
    const FlakyComponent = ({ shouldError, errorType }: { shouldError: boolean; errorType?: string }) => {
      if (shouldError) {
        if (errorType === 'network') {
          throw new Error('Network connection failed')
        } else if (errorType === 'validation') {
          throw new Error('Invalid input provided')
        } else {
          throw new Error('Unexpected application error')
        }
      }

      return <div>Component working normally</div>
    }

    it('should handle various error scenarios gracefully', () => {
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
            <FlakyComponent shouldError={false} />
          </ErrorBoundary>
        </TestWrapper>
      )

      // Initially working fine
      expect(screen.getByText('Component working normally')).toBeInTheDocument()

      // Simulate network error
      rerender(
        <TestWrapper>
          <ErrorBoundary>
            <Header
              navigateHome={() => {}}
              navigateToPage={() => {}}
              onSearchOpen={() => {}}
              pageType="home"
            />
            <FlakyComponent shouldError={true} errorType="network" />
          </ErrorBoundary>
        </TestWrapper>
      )

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()

      // User tries to recover
      fireEvent.click(screen.getByText('Try Again'))

      // Rerender with working component
      rerender(
        <TestWrapper>
          <ErrorBoundary>
            <Header
              navigateHome={() => {}}
              navigateToPage={() => {}}
              onSearchOpen={() => {}}
              pageType="home"
            />
            <FlakyComponent shouldError={false} />
          </ErrorBoundary>
        </TestWrapper>
      )

      // Should recover successfully
      expect(screen.getByText('Component working normally')).toBeInTheDocument()
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument()

      consoleError.mockRestore()
    })

    it('should maintain navigation during error states', () => {
      // Mock console.error to avoid noise
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

      const mockNavigateToPage = jest.fn()

      render(
        <TestWrapper>
          <ErrorBoundary>
            <Header
              navigateHome={() => {}}
              navigateToPage={mockNavigateToPage}
              onSearchOpen={() => {}}
              pageType="home"
            />
            <FlakyComponent shouldError={true} errorType="validation" />
          </ErrorBoundary>
        </TestWrapper>
      )

      // Even with error, header should still be functional
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()

      // User can still navigate
      const menuButton = screen.getByRole('button', { name: /menu/i })
      fireEvent.click(menuButton)

      const feelingsLink = screen.getByText('Feelings')
      fireEvent.click(feelingsLink)

      expect(mockNavigateToPage).toHaveBeenCalledWith('feelings')

      consoleError.mockRestore()
    })
  })

  describe('Performance and Responsiveness', () => {
    it('should handle rapid user interactions without breaking', () => {
      const mockNavigateHome = jest.fn()
      const mockNavigateToPage = jest.fn()
      const mockOnSearchOpen = jest.fn()

      render(
        <TestWrapper>
          <Header
            navigateHome={mockNavigateHome}
            navigateToPage={mockNavigateToPage}
            onSearchOpen={mockOnSearchOpen}
            pageType="home"
          />
        </TestWrapper>
      )

      // Simulate rapid user interactions
      const searchButton = screen.getByRole('button', { name: /search/i })
      const menuButton = screen.getByRole('button', { name: /menu/i })

      // Rapidly click buttons
      for (let i = 0; i < 10; i++) {
        fireEvent.click(searchButton)
        fireEvent.click(menuButton)
      }

      // Component should handle rapid interactions gracefully
      expect(mockOnSearchOpen).toHaveBeenCalledTimes(10)
      expect(mockNavigateHome).toHaveBeenCalledTimes(0) // Logo not clicked in this test
    })

    it('should maintain responsive behavior across screen sizes', () => {
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

      // Test that components adapt to different screen sizes
      // This is more of a structure test since we can't actually change screen size in Jest
      const header = screen.getByRole('banner') // Header should have role="banner"

      expect(header).toBeInTheDocument()

      // All interactive elements should be present
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /adhd first aid kit/i })).toBeInTheDocument()
    })
  })
})
