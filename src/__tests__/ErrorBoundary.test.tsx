import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ErrorBoundary from '../components/ErrorBoundary'

// Mock the error handling module
jest.mock('../lib/error-handling', () => ({
  logError: jest.fn()
}))

// Component that throws an error
const ErrorComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Normal component</div>
}

// Component that triggers error on button click
const ErrorTriggerComponent = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false)

  if (shouldThrow) {
    throw new Error('Button triggered error')
  }

  return (
    <div>
      <button onClick={() => setShouldThrow(true)} data-testid="error-button">
        Trigger Error
      </button>
      <div data-testid="normal-content">Normal content</div>
    </div>
  )
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child component</div>
      </ErrorBoundary>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Child component')).toBeInTheDocument()
  })

  it('catches errors thrown by child components', () => {
    // Mock console.error to avoid noise in test output
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    // Should render error UI instead of crashing
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument()

    consoleError.mockRestore()
  })

  it('provides reset functionality', () => {
    // Mock console.error to avoid noise in test output
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    // Should show error UI
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()

    // Should have reset button
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Go Home')).toBeInTheDocument()

    consoleError.mockRestore()
  })

  it('recovers from runtime errors', () => {
    // Mock console.error to avoid noise in test output
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { rerender } = render(
      <ErrorBoundary>
        <ErrorTriggerComponent />
      </ErrorBoundary>
    )

    // Initially should show normal content
    expect(screen.getByTestId('normal-content')).toBeInTheDocument()

    // Trigger error
    fireEvent.click(screen.getByTestId('error-button'))

    // Should show error UI
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
    expect(screen.queryByTestId('normal-content')).not.toBeInTheDocument()

    consoleError.mockRestore()
  })

  it('calls onError prop when provided', () => {
    // Mock console.error to avoid noise in test output
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    const onErrorMock = jest.fn()

    render(
      <ErrorBoundary onError={onErrorMock}>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(onErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    )

    consoleError.mockRestore()
  })

  it('uses custom fallback component when provided', () => {
    // Mock console.error to avoid noise in test output
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    const CustomFallback = ({ error, resetError }: { error?: Error; resetError: () => void }) => (
      <div data-testid="custom-fallback">
        Custom Error: {error?.message}
        <button onClick={resetError} data-testid="custom-reset">Reset</button>
      </div>
    )

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
    expect(screen.getByText('Custom Error: Test error')).toBeInTheDocument()
    expect(screen.getByTestId('custom-reset')).toBeInTheDocument()

    consoleError.mockRestore()
  })

  it('shows error details in development mode', () => {
    // Mock console.error to avoid noise in test output
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    // Set NODE_ENV to development
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()

    // Restore original environment
    process.env.NODE_ENV = originalEnv

    consoleError.mockRestore()
  })

  it('hides error details in production mode', () => {
    // Mock console.error to avoid noise in test output
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    // Set NODE_ENV to production
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument()

    // Restore original environment
    process.env.NODE_ENV = originalEnv

    consoleError.mockRestore()
  })
})
