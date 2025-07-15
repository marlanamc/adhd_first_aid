import { supabase } from './supabase'
import type { Strategy } from './supabase'
import type { StrategyFilters } from '../types/strategies'

// Strategy data access functions

/**
 * Get all strategies with optional filtering
 * @param {Object} filters - Filter options
 * @param {string[]} filters.feelings - Filter by feelings
 * @param {string[]} filters.issues - Filter by issues
 * @param {string} filters.barrier_type - Filter by barrier type
 * @param {string} filters.search - Search query
 * @returns {Promise<Array>} Array of strategies
 */
export async function getStrategies(filters: StrategyFilters = {}): Promise<Strategy[]> {
  try {
    console.log('Starting getStrategies with filters:', filters)

    // Start with full strategies query including new fields
    let query = supabase
      .from('strategies')
      .select(`
        *,
        strategy_feelings:strategy_feelings (
          feeling:feeling_id (
            name
          )
        ),
        strategy_issues:strategy_issues (
          issue:issue_id (
            name
          )
        ),
        strategy_barriers:strategy_barriers (
          barrier:barrier_id (
            name
          )
        ),
        strategy_tags:strategy_tags (
          tag:tag_id (
            name,
            category
          )
        ),
        help_task:help_task_id (
          name
        ),
        barrier:barrier_id (
          name
        )
      `)
    
    let strategyIds: string[] = []

    // FEELINGS
    if (filters.feelings && filters.feelings.length > 0) {
      console.log('Adding feeling filter:', filters.feelings)
      const { data: feelingIdsData, error: feelingError } = await supabase
        .from('feelings')
        .select('id')
        .in('name', filters.feelings)

      if (feelingError) throw feelingError

      const feelingIds = feelingIdsData.map(row => row.id)
      console.log('Resolved feeling IDs:', feelingIds)

      const { data: sfData, error: sfError } = await supabase
        .from('strategy_feelings')
        .select('strategy_id')
        .in('feeling_id', feelingIds)

      if (sfError) throw sfError

      const sfIds = sfData.map(row => row.strategy_id)
      strategyIds = strategyIds.length ? strategyIds.filter(id => sfIds.includes(id)) : sfIds
    }

    // ISSUES
    if (filters.issues && filters.issues.length > 0) {
      console.log('Adding issue filter:', filters.issues)
      const { data: issueIdsData, error: issueError } = await supabase
        .from('issues')
        .select('id')
        .in('name', filters.issues)

      if (issueError) throw issueError

      const issueIds = issueIdsData.map(row => row.id)
      console.log('Resolved issue IDs:', issueIds)

      const { data: siData, error: siError } = await supabase
        .from('strategy_issues')
        .select('strategy_id')
        .in('issue_id', issueIds)

      if (siError) throw siError

      const siIds = siData.map(row => row.strategy_id)
      strategyIds = strategyIds.length ? strategyIds.filter(id => siIds.includes(id)) : siIds
    }

    // BARRIERS
    if (filters.barrier_type) {
      console.log('Adding barrier filter:', filters.barrier_type)
      const { data: barrierIdData, error: barrierError } = await supabase
        .from('barriers')
        .select('id')
        .eq('name', filters.barrier_type)

      if (barrierError) throw barrierError

      const barrierId = barrierIdData?.[0]?.id
      if (barrierId) {
        const { data: sbData, error: sbError } = await supabase
          .from('strategy_barriers')
          .select('strategy_id')
          .eq('barrier_id', barrierId)

        if (sbError) throw sbError

        const sbIds = sbData.map(row => row.strategy_id)
        strategyIds = strategyIds.length ? strategyIds.filter(id => sbIds.includes(id)) : sbIds
      }
    }

    // Apply strategyId filter if we have any
    if (strategyIds.length > 0) {
      query = query.in('id', strategyIds)
    }

    // Search functionality - updated to include new fields
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      query = query.or(
        `name.ilike.%${searchTerm}%,subtitle.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,example.ilike.%${searchTerm}%,use_case.ilike.%${searchTerm}%`
      )
    }

    // Execute final query
    console.log('Executing final strategy query...')
    const { data, error } = await query

    if (error) {
      console.error('Error fetching strategies:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      console.error('Error message:', error.message)
      console.error('Error code:', error.code)
      throw error
    }

    console.log('Query successful. Strategies found:', data?.length ?? 0)
    return data || []
  } catch (error) {
    console.error('Error in getStrategies:', error)
    throw error
  }
}

/**
 * Get a single strategy by ID
 * @param {string} id - Strategy ID
 * @returns {Promise<Object|null>} Strategy object or null
 */
export async function getStrategy(id: string) {
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
export async function voteForStrategy(strategyId: string, sessionId: string) {
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
export async function getVoteCount(strategyId: string) {
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
export async function hasUserVoted(strategyId: string, sessionId: string) {
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

