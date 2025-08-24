// 🎯 Standardized Error Handling System
// This system provides consistent error handling across the entire application

import React from 'react'

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface AppError {
  message: string
  originalError?: unknown
  severity: ErrorSeverity
  context?: string
  userMessage?: string
  timestamp: number
}

// ===== ERROR LOGGING UTILITIES =====

/**
 * Standardized error logging with consistent formatting
 */
export const logError = (
  message: string,
  error?: unknown,
  context?: string,
  severity: ErrorSeverity = 'medium'
): AppError => {
  const appError: AppError = {
    message,
    originalError: error,
    severity,
    context,
    timestamp: getSafeTimestamp()
  }

  // Log with consistent emoji-based severity indicators
  const emoji = {
    low: 'ℹ️',
    medium: '⚠️',
    high: '❌',
    critical: '🚨'
  }[severity]

  const contextStr = context ? ` [${context}]` : ''
  const errorDetails = error instanceof Error ? error.message : String(error || '')

  console.error(`${emoji} ${message}${contextStr}`, errorDetails)

  return appError
}

/**
 * Standardized warning logging
 */
export const logWarning = (
  message: string,
  context?: string
): void => {
  const contextStr = context ? ` [${context}]` : ''
  console.warn(`⚠️ ${message}${contextStr}`)
}

/**
 * Standardized info logging
 */
export const logInfo = (
  message: string,
  context?: string
): void => {
  const contextStr = context ? ` [${context}]` : ''
  console.info(`ℹ️ ${message}${contextStr}`)
}

// ===== ERROR FORMATTING UTILITIES =====

/**
 * Safely extract error message from unknown error type
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  if (error !== null && error !== undefined) return String(error)
  return 'An unexpected error occurred'
}

/**
 * Create user-friendly error message from technical error
 */
export const createUserFriendlyError = (
  action: string,
  error: unknown,
  fallbackMessage = 'Please try again or contact support if the problem persists.'
): string => {
  const errorMessage = getErrorMessage(error)

  // Capitalize first letter of action
  const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1)

  // Common error patterns and user-friendly translations
  const userFriendlyPatterns: Record<string, string> = {
    'Failed to fetch': 'Unable to connect to the server. Please check your internet connection.',
    'NetworkError': 'Network connection issue. Please check your internet connection.',
    'timeout': 'The request timed out. Please try again.',
    '404': 'The requested content was not found.',
    '500': 'Server error. Please try again later.',
    '403': 'Access denied. You may not have permission to view this content.',
    '401': 'Authentication required. Please log in and try again.'
  }

  // Check for known error patterns
  for (const [pattern, friendlyMessage] of Object.entries(userFriendlyPatterns)) {
    if (errorMessage.toLowerCase().includes(pattern.toLowerCase())) {
      return `${capitalizedAction} failed. ${friendlyMessage}`
    }
  }

  // If no pattern matches, provide a generic but helpful message
  return `${capitalizedAction} failed. ${fallbackMessage}`
}

// ===== ASYNC ERROR HANDLING =====

/**
 * Standardized async operation wrapper with consistent error handling
 */
export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  options: {
    action: string
    context?: string
    severity?: ErrorSeverity
    onSuccess?: (result: T) => void
    onError?: (error: AppError) => void
  }
): Promise<{ success: boolean; data?: T; error?: AppError }> => {
  try {
    const result = await operation()

    if (options.onSuccess) {
      options.onSuccess(result)
    }

    return { success: true, data: result }
  } catch (error) {
    const appError = logError(
      `Failed to ${options.action}`,
      error,
      options.context,
      options.severity
    )

    if (options.onError) {
      options.onError(appError)
    }

    return { success: false, error: appError }
  }
}

// ===== DATABASE ERROR HANDLING =====

/**
 * Standardized Supabase error handling
 */
export const handleSupabaseError = (
  error: any,
  operation: string,
  context?: string
): AppError => {
  console.log(`🔍 HANDLE_SUPABASE_ERROR: Called for operation "${operation}" in context "${context}"`);

  if (!error) {
    return logError('Unknown database error', undefined, context, 'high')
  }

  // Handle specific Supabase error codes
  const errorMessages: Record<string, string> = {
    'PGRST116': 'No data found for the requested query.',
    'PGRST301': 'Permission denied for this operation.',
    'PGRST103': 'Database connection failed.',
    '23505': 'This record already exists.',
    '23503': 'Referenced record does not exist.',
    '23514': 'Data validation failed.',
    '42601': 'Invalid query syntax.',
    '42P01': 'Table does not exist.',
    '42703': 'Column does not exist.'
  }

  const userFriendlyMessage = errorMessages[error.code] ||
    error.message ||
    error.details ||
    'Database operation failed'

  // Log the full error details for debugging
  console.error('🔍 Supabase Error Details:', {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
    fullError: error,
    operation,
    context
  })

  return logError(
    `Database ${operation} failed: ${userFriendlyMessage}`,
    error,
    context,
    error.code ? 'medium' : 'high'
  )
}

// ===== REACT HOOK ERROR HANDLING =====

/**
 * Hook for consistent error state management
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleError = React.useCallback((error: unknown, action: string) => {
    const userMessage = createUserFriendlyError(action, error)
    setError(userMessage)
    logError(`User-facing error: ${action}`, error, 'UI', 'medium')
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  const withLoading = React.useCallback(async <T,>(
    operation: () => Promise<T>,
    options: {
      action: string
      onSuccess?: (result: T) => void
    }
  ): Promise<T | null> => {
    setIsLoading(true)
    clearError()

    try {
      const result = await operation()
      if (options.onSuccess) {
        options.onSuccess(result)
      }
      return result
    } catch (error) {
      handleError(error, options.action)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [handleError, clearError])

  return {
    error,
    isLoading,
    handleError,
    clearError,
    withLoading,
    setError
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Safely get current timestamp, returns 0 on server to avoid hydration issues
 */
export const getSafeTimestamp = (): number => {
  return typeof window !== 'undefined' ? Date.now() : 0
}

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  const errorMessage = getErrorMessage(error).toLowerCase()
  const retryablePatterns = [
    'network',
    'timeout',
    'connection',
    'fetch',
    '500',
    '502',
    '503',
    '504'
  ]

  return retryablePatterns.some(pattern => errorMessage.includes(pattern))
}

/**
 * Get appropriate retry delay based on error type
 */
export const getRetryDelay = (error: unknown, attempt: number): number => {
  const baseDelay = isRetryableError(error) ? 1000 : 5000
  return baseDelay * Math.pow(2, attempt - 1) // Exponential backoff
}


