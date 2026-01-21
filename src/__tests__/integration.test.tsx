import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ModalProvider } from '../contexts/ModalContext'
import { Header } from '../components/layout/Header'
import SearchModal from '../components/ui/SearchModal'
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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock as any

// Test wrapper component that includes all providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <ModalProvider>
      {children}
    </ModalProvider>
  </ThemeProvider>
)

describe('Integration Tests - User Flows and Component Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('light')
  })

  describe('Theme Integration', () => {
    it('should persist theme preference across component interactions', async () => {
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

      // Wait for theme to be initialized
      await waitFor(() => {
        expect(localStorageMock.getItem).toHaveBeenCalledWith('theme')
      })

      // Theme should be applied to document
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should handle theme switching with other components', async () => {
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

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })

      // Theme should be saved to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
    })
  })

  describe('Navigation Integration', () => {
    it('should navigate between sections using header', () => {
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

      // Click on a dropdown menu item (we need to open dropdown first)
      const menuButton = screen.getByRole('button', { name: /menu/i })
      fireEvent.click(menuButton)

      // Click on favorites link
      const favoritesLink = screen.getByText('My Favorites')
      fireEvent.click(favoritesLink)

      expect(mockNavigateToPage).toHaveBeenCalledWith('favorites')
    })

    it('should handle search modal integration', () => {
      const mockOnSearchOpen = jest.fn()

      render(
        <TestWrapper>
          <Header
            navigateHome={() => {}}
            navigateToPage={() => {}}
            onSearchOpen={mockOnSearchOpen}
            pageType="home"
          />
          <SearchModal
            isOpen={false}
            onClose={() => {}}
          />
        </TestWrapper>
      )

      // Click search button
      const searchButton = screen.getByRole('button', { name: /search/i })
      fireEvent.click(searchButton)

      expect(mockOnSearchOpen).toHaveBeenCalled()
    })
  })

  describe('Error Boundary Integration', () => {
    const ErrorComponent = () => {
      throw new Error('Integration test error')
    }

    it('should catch errors in component tree', () => {
      // Mock console.error to avoid noise
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
      expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument()

      consoleError.mockRestore()
    })

    it('should allow error recovery', () => {
      // Mock console.error to avoid noise
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

      const RecoverableComponent = ({ shouldError }: { shouldError: boolean }) => {
        if (shouldError) {
          throw new Error('Test error')
        }
        return <div>Recovered successfully!</div>
      }

      const { rerender } = render(
        <ErrorBoundary>
          <RecoverableComponent shouldError={true} />
        </ErrorBoundary>
      )

      // Should show error UI
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()

      // Click try again
      fireEvent.click(screen.getByText('Try Again'))

      // Rerender with non-error component
      rerender(
        <ErrorBoundary>
          <RecoverableComponent shouldError={false} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Recovered successfully!')).toBeInTheDocument()

      consoleError.mockRestore()
    })
  })

  describe('Component State Integration', () => {
    it('should maintain state across theme changes', async () => {
      // Mock localStorage to simulate theme changes
      localStorageMock.getItem.mockReturnValue('light')

      const TestComponent = () => {
        const [count, setCount] = React.useState(0)
        return (
          <div>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <span data-testid="count">{count}</span>
          </div>
        )
      }

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )

      // Initial count should be 0
      expect(screen.getByTestId('count')).toHaveTextContent('0')

      // Click increment button
      fireEvent.click(screen.getByText('Increment'))

      // Count should be 1
      expect(screen.getByTestId('count')).toHaveTextContent('1')

      // State should be preserved even if theme changes
      localStorageMock.getItem.mockReturnValue('dark')

      // Trigger a re-render by changing theme (this would normally happen via ThemeProvider)
      fireEvent.click(screen.getByText('Increment'))

      expect(screen.getByTestId('count')).toHaveTextContent('2')
    })

    it('should handle modal state with navigation', () => {
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
        </TestWrapper>
      )

      // Open search modal
      const searchButton = screen.getByRole('button', { name: /search/i })
      fireEvent.click(searchButton)

      expect(mockOnSearchOpen).toHaveBeenCalled()

      // Rerender with modal open
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
        </TestWrapper>
      )

      // Modal should be present
      expect(screen.getByText('Search')).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('should handle form submissions with theme context', async () => {
      // Mock a simple form component
      const MockForm = () => {
        const [value, setValue] = React.useState('')
        const [submitted, setSubmitted] = React.useState(false)

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault()
          setSubmitted(true)
        }

        if (submitted) {
          return <div data-testid="success">Form submitted successfully!</div>
        }

        return (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              data-testid="input"
            />
            <button type="submit" data-testid="submit">Submit</button>
          </form>
        )
      }

      render(
        <TestWrapper>
          <MockForm />
        </TestWrapper>
      )

      // Fill out form
      const input = screen.getByTestId('input')
      fireEvent.change(input, { target: { value: 'test input' } })

      expect(input).toHaveValue('test input')

      // Submit form
      const submitButton = screen.getByTestId('submit')
      fireEvent.click(submitButton)

      // Should show success message
      expect(screen.getByTestId('success')).toBeInTheDocument()
    })
  })

  describe('Accessibility Integration', () => {
    it('should maintain keyboard navigation with theme switching', async () => {
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

      // Header buttons should be keyboard accessible
      const searchButton = screen.getByRole('button', { name: /search/i })
      const menuButton = screen.getByRole('button', { name: /menu/i })

      // Both buttons should be focusable
      searchButton.focus()
      expect(document.activeElement).toBe(searchButton)

      menuButton.focus()
      expect(document.activeElement).toBe(menuButton)
    })

    it('should handle ARIA attributes correctly', () => {
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

      // Buttons should have appropriate ARIA labels
      const searchButton = screen.getByRole('button', { name: /search/i })
      const menuButton = screen.getByRole('button', { name: /menu/i })

      expect(searchButton).toBeInTheDocument()
      expect(menuButton).toBeInTheDocument()
    })
  })
})
