import { supabase } from './supabase.js'

// Strategy data access functions

/**
 * Get all strategies with optional filtering
 * @param {Object} filters - Filter options
 * @param {string[]} filters.feelings - Filter by feelings
 * @param {string[]} filters.tags - Filter by tags
 * @param {string} filters.search - Search query
 * @returns {Promise<Array>} Array of strategies
 */
export async function getStrategies(filters = {}) {
  try {
    let query = supabase
      .from('strategies')
      .select(`
        *,
        vote_count:strategy_votes(count)
      `)
      .order('created_at', { ascending: false })

    // Filter by feelings
    if (filters.feelings && filters.feelings.length > 0) {
      query = query.overlaps('feeling', filters.feelings)
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags)
    }

    // Search functionality
    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`
      query = query.or(`
        name.ilike.${searchTerm},
        description.ilike.${searchTerm},
        tags.cs.{${filters.search.toLowerCase()}}
      `)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching strategies:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getStrategies:', error)
    return []
  }
}

/**
 * Get a single strategy by ID
 * @param {string} id - Strategy ID
 * @returns {Promise<Object|null>} Strategy object or null
 */
export async function getStrategy(id) {
  try {
    const { data, error } = await supabase
      .from('strategies')
      .select(`
        *,
        vote_count:strategy_votes(count)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching strategy:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getStrategy:', error)
    return null
  }
}

/**
 * Vote for a strategy
 * @param {string} strategyId - Strategy ID
 * @param {string} sessionId - User session ID
 * @returns {Promise<boolean>} Success status
 */
export async function voteForStrategy(strategyId, sessionId) {
  try {
    const { error } = await supabase
      .from('strategy_votes')
      .insert({
        strategy_id: strategyId,
        session_id: sessionId
      })

    if (error) {
      // If it's a duplicate vote, that's okay
      if (error.code === '23505') {
        return true
      }
      console.error('Error voting for strategy:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in voteForStrategy:', error)
    return false
  }
}

/**
 * Get vote count for a strategy
 * @param {string} strategyId - Strategy ID
 * @returns {Promise<number>} Vote count
 */
export async function getVoteCount(strategyId) {
  try {
    const { count, error } = await supabase
      .from('strategy_votes')
      .select('*', { count: 'exact', head: true })
      .eq('strategy_id', strategyId)

    if (error) {
      console.error('Error getting vote count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error in getVoteCount:', error)
    return 0
  }
}

/**
 * Check if user has voted for a strategy
 * @param {string} strategyId - Strategy ID
 * @param {string} sessionId - User session ID
 * @returns {Promise<boolean>} Whether user has voted
 */
export async function hasUserVoted(strategyId, sessionId) {
  try {
    const { data, error } = await supabase
      .from('strategy_votes')
      .select('id')
      .eq('strategy_id', strategyId)
      .eq('session_id', sessionId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking vote status:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error in hasUserVoted:', error)
    return false
  }
}

// Utility function to generate a session ID for anonymous users
export function generateSessionId() {
  return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

