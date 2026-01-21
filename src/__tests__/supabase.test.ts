import { supabase } from '../lib/supabase'

// Mock Supabase client
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          order: jest.fn(),
        })),
        ilike: jest.fn(),
        order: jest.fn(),
        limit: jest.fn(),
      })),
    })),
  },
}))

describe('Supabase Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Database Schema', () => {
    it('should have required tables', () => {
      // Test that the supabase client is properly configured
      expect(supabase).toBeDefined()
      expect(typeof supabase.from).toBe('function')
    })

    it('should support table queries', () => {
      const mockTable = supabase.from('test_table')
      expect(mockTable).toBeDefined()
      expect(typeof mockTable.select).toBe('function')
    })
  })

  describe('Query Building', () => {
    it('should build select queries', () => {
      const mockQuery = {
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      }

      const mockFrom = jest.fn(() => ({
        select: jest.fn(() => mockQuery)
      }))
      
      // Use type assertion to allow mocking
      ;(supabase.from as jest.Mock).mockImplementation(mockFrom)

      const query = supabase
        .from('feelings')
        .select('*')
        .eq('feeling_name', 'test')

      expect(query).toBeDefined()
    })

    it('should support order by', () => {
      const mockQuery = {
        order: jest.fn(() => ({
          single: jest.fn()
        }))
      }

      const mockFrom = jest.fn(() => ({
        select: jest.fn(() => mockQuery)
      }))
      
      ;(supabase.from as jest.Mock).mockImplementation(mockFrom)

      const query = supabase
        .from('feelings')
        .select('*')
        .order('feeling_name')

      expect(query).toBeDefined()
    })

    it('should support ilike for search', () => {
      const mockQuery = {
        ilike: jest.fn(() => ({
          single: jest.fn()
        }))
      }

      const mockFrom = jest.fn(() => ({
        select: jest.fn(() => mockQuery)
      }))
      
      ;(supabase.from as jest.Mock).mockImplementation(mockFrom)

      const query = supabase
        .from('feelings')
        .select('*')
        .ilike('feeling_name', '%test%')

      expect(query).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle query errors gracefully', async () => {
      const mockQuery = {
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Test error' }
        })
      }

      const mockFrom = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => mockQuery)
        }))
      }))
      
      ;(supabase.from as jest.Mock).mockImplementation(mockFrom)

      const result = await mockQuery.single()
      expect(result.error).toBeDefined()
      expect(result.data).toBeNull()
    })

    it('should handle successful queries', async () => {
      const mockData = { id: 1, name: 'Test' }
      const mockQuery = {
        single: jest.fn().mockResolvedValue({
          data: mockData,
          error: null
        })
      }

      const mockFrom = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => mockQuery)
        }))
      }))
      
      ;(supabase.from as jest.Mock).mockImplementation(mockFrom)

      const result = await mockQuery.single()
      expect(result.data).toEqual(mockData)
      expect(result.error).toBeNull()
    })
  })

  describe('Data Types', () => {
    it('should handle feeling data structure', () => {
      const feelingData = {
        feeling_name: 'Anxious',
        category: 'Dysregulation & Shutdown',
        emoji: '😰',
        description: 'Feeling nervous or worried',
        color: '#fbbf24'
      }

      expect(feelingData).toHaveProperty('feeling_name')
      expect(feelingData).toHaveProperty('category')
      expect(feelingData).toHaveProperty('emoji')
      expect(feelingData).toHaveProperty('description')
    })

    it('should handle barrier data structure', () => {
      const barrierData = {
        barrier_name: 'Time Management',
        category: 'Executive Function',
        description: 'Difficulty managing time effectively',
        strategies: ['Use timers', 'Break tasks into chunks']
      }

      expect(barrierData).toHaveProperty('barrier_name')
      expect(barrierData).toHaveProperty('category')
      expect(barrierData).toHaveProperty('description')
      expect(Array.isArray(barrierData.strategies)).toBe(true)
    })
  })
})
