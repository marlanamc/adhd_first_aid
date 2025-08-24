import {
  logError,
  logWarning,
  logInfo,
  getErrorMessage,
  createUserFriendlyError,
  handleSupabaseError,
  isRetryableError,
  getRetryDelay,
  ErrorSeverity
} from '../lib/error-handling'

// Mock console methods to capture output
const consoleLog = jest.spyOn(console, 'info').mockImplementation()
const consoleWarn = jest.spyOn(console, 'warn').mockImplementation()
const consoleError = jest.spyOn(console, 'error').mockImplementation()

describe('Error Handling System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getErrorMessage', () => {
    it('should extract message from Error object', () => {
      const error = new Error('Test error message')
      expect(getErrorMessage(error)).toBe('Test error message')
    })

    it('should handle string errors', () => {
      expect(getErrorMessage('String error')).toBe('String error')
    })

    it('should handle error-like objects', () => {
      const error = { message: 'Error in object' }
      expect(getErrorMessage(error)).toBe('Error in object')
    })

    it('should handle null/undefined', () => {
      expect(getErrorMessage(null)).toBe('An unexpected error occurred')
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred')
    })

    it('should handle unknown error types', () => {
      expect(getErrorMessage(123)).toBe('123')
      expect(getErrorMessage({})).toBe('[object Object]')
    })
  })

  describe('logError', () => {
    it('should log errors with correct emoji and formatting', () => {
      const mockError = new Error('Test error')
      const result = logError('Test operation failed', mockError, 'testContext', 'high')

      expect(consoleError).toHaveBeenCalledWith('❌ Test operation failed [testContext]', 'Test error')
      expect(result).toEqual({
        message: 'Test operation failed',
        originalError: mockError,
        severity: 'high',
        context: 'testContext',
        timestamp: expect.any(Number)
      })
    })

    it('should use default severity', () => {
      logError('Test error')
      expect(consoleError).toHaveBeenCalledWith('⚠️ Test error', '')
    })

    it('should handle all severity levels', () => {
      const severities: ErrorSeverity[] = ['low', 'medium', 'high', 'critical']
      const emojis = ['ℹ️', '⚠️', '❌', '🚨']

      severities.forEach((severity, index) => {
        logError('Test', undefined, undefined, severity)
        expect(consoleError).toHaveBeenCalledWith(`${emojis[index]} Test`, '')
      })
    })
  })

  describe('logWarning', () => {
    it('should log warnings with correct formatting', () => {
      logWarning('Test warning', 'testContext')
      expect(consoleWarn).toHaveBeenCalledWith('⚠️ Test warning [testContext]')
    })

    it('should handle warnings without context', () => {
      logWarning('Test warning')
      expect(consoleWarn).toHaveBeenCalledWith('⚠️ Test warning')
    })
  })

  describe('logInfo', () => {
    it('should log info with correct formatting', () => {
      logInfo('Test info', 'testContext')
      expect(consoleLog).toHaveBeenCalledWith('ℹ️ Test info [testContext]')
    })

    it('should handle info without context', () => {
      logInfo('Test info')
      expect(consoleLog).toHaveBeenCalledWith('ℹ️ Test info')
    })
  })

  describe('createUserFriendlyError', () => {
    it('should convert technical errors to user-friendly messages', () => {
      const error = new Error('Failed to fetch')
      const result = createUserFriendlyError('load data', error)
      expect(result).toBe('Load data failed. Unable to connect to the server. Please check your internet connection.')
    })

    it('should handle 404 errors', () => {
      const error = new Error('404 Not Found')
      const result = createUserFriendlyError('load content', error)
      expect(result).toBe('Load content failed. The requested content was not found.')
    })

    it('should handle network errors', () => {
      const error = new Error('NetworkError: Connection failed')
      const result = createUserFriendlyError('save changes', error)
      expect(result).toBe('Save changes failed. Network connection issue. Please check your internet connection.')
    })

    it('should use fallback message for unknown errors', () => {
      const error = new Error('Unknown error code 999')
      const result = createUserFriendlyError('perform action', error, 'Custom fallback message')
      expect(result).toBe('Perform action failed. Custom fallback message')
    })

    it('should handle non-Error objects', () => {
      const error = 'String error message'
      const result = createUserFriendlyError('test action', error)
      expect(result).toBe('Test action failed. Please try again or contact support if the problem persists.')
    })
  })

  describe('handleSupabaseError', () => {
    it('should handle specific Supabase error codes', () => {
      const error = { code: 'PGRST116', message: 'No data found' }
      const result = handleSupabaseError(error, 'select', 'testTable')

      expect(consoleError).toHaveBeenCalledWith('🔍 Supabase Error Details:', expect.any(Object))
      expect(consoleError).toHaveBeenCalledWith('⚠️ Database select failed: No data found for the requested query. [testTable]', '[object Object]')
      expect(result.severity).toBe('medium')
    })

    it('should handle permission errors', () => {
      const error = { code: 'PGRST301', message: 'Permission denied' }
      const result = handleSupabaseError(error, 'insert', 'restrictedTable')

      expect(result.message).toBe('Database insert failed: Permission denied for this operation.')
      expect(result.severity).toBe('medium') // PGRST301 has an error code, so it's medium
    })

    it('should handle null errors', () => {
      const result = handleSupabaseError(null, 'query', 'testTable')

      expect(result.message).toBe('Unknown database error')
      expect(result.severity).toBe('high')
    })

    it('should handle unknown error codes as medium severity', () => {
      const error = { code: 'UNKNOWN123', message: 'Unknown error' }
      const result = handleSupabaseError(error, 'select', 'testTable')

      expect(result.message).toBe('Database select failed: Unknown error')
      expect(result.severity).toBe('medium') // Has error code, so it's medium
    })
  })

  describe('isRetryableError', () => {
    it('should identify network-related errors as retryable', () => {
      expect(isRetryableError(new Error('Network error occurred'))).toBe(true)
      expect(isRetryableError(new Error('Connection timeout'))).toBe(true)
      expect(isRetryableError(new Error('Failed to fetch data'))).toBe(true)
    })

    it('should identify HTTP status codes as retryable', () => {
      expect(isRetryableError(new Error('Server returned 500'))).toBe(true)
      expect(isRetryableError(new Error('502 Bad Gateway'))).toBe(true)
      expect(isRetryableError(new Error('503 Service Unavailable'))).toBe(true)
    })

    it('should not retry client errors', () => {
      expect(isRetryableError(new Error('404 Not Found'))).toBe(false)
      expect(isRetryableError(new Error('403 Forbidden'))).toBe(false)
    })

    it('should not retry validation errors', () => {
      expect(isRetryableError(new Error('Validation failed'))).toBe(false)
    })
  })

  describe('getRetryDelay', () => {
    it('should provide longer delays for non-retryable errors', () => {
      const retryableError = new Error('Network timeout')
      const nonRetryableError = new Error('404 Not Found')

      const retryableDelay = getRetryDelay(retryableError, 1)
      const nonRetryableDelay = getRetryDelay(nonRetryableError, 1)

      expect(retryableDelay).toBe(1000) // 1 second base
      expect(nonRetryableDelay).toBe(5000) // 5 seconds base
    })

    it('should implement exponential backoff', () => {
      const error = new Error('Network error')

      expect(getRetryDelay(error, 1)).toBe(1000)
      expect(getRetryDelay(error, 2)).toBe(2000)
      expect(getRetryDelay(error, 3)).toBe(4000)
    })

    it('should handle different attempt numbers', () => {
      const error = new Error('Connection failed')

      expect(getRetryDelay(error, 0)).toBe(500) // baseDelay / 2 for attempt 0
      expect(getRetryDelay(error, 1)).toBe(1000) // baseDelay for attempt 1
      expect(getRetryDelay(error, 5)).toBe(16000) // baseDelay * 2^4 for attempt 5
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle complete error flow for user-facing errors', () => {
      const technicalError = new Error('Failed to fetch from https://api.example.com')
      const userAction = 'load crisis mode data'

      // 1. Extract error message
      const errorMessage = getErrorMessage(technicalError)
      expect(errorMessage).toBe('Failed to fetch from https://api.example.com')

      // 2. Create user-friendly message
      const userMessage = createUserFriendlyError(userAction, technicalError)
      expect(userMessage).toContain('Load crisis mode data failed')
      expect(userMessage).toContain('connect to the server')

      // 3. Log the error
      const loggedError = logError('Failed to load crisis mode data', technicalError, 'crisisMode', 'high')
      expect(loggedError.severity).toBe('high')
      expect(loggedError.context).toBe('crisisMode')
      expect(loggedError.timestamp).toBeGreaterThan(0)
    })

    it('should handle database errors appropriately', () => {
      const dbError = { code: 'PGRST116', message: 'No rows found' }

      // Handle the Supabase error
      const handledError = handleSupabaseError(dbError, 'select', 'crisis_feelings')

      // Should be medium severity for "no data" errors
      expect(handledError.severity).toBe('medium')
      expect(handledError.message).toContain('No data found for the requested query')

      // Should not be retryable
      expect(isRetryableError(new Error(handledError.message))).toBe(false)
    })
  })
})
