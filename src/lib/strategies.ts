import { supabase } from './supabase'
import type { Strategy } from './supabase'

export interface StrategyFilters {
  feelings?: string[]
  issues?: string[]
  barrier_type?: string
  search?: string
}

/**
 * Get all strategies with optional filtering
 */
export async function getStrategies(filters: StrategyFilters = {}): Promise<Strategy[]> {
  try {
    console.log('Starting getStrategies with filters:', filters)

    // Start with full strategies query
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
        )
      `)
    let strategyIds: number[] = []

    // FEELINGS
    if ((filters.feelings?.length ?? 0) > 0) {
      const { data: feelingIdsData, error: feelingError } = await supabase
        .from('feelings')
        .select('id')
        .in('name', filters.feelings ?? [])

      if (feelingError) throw feelingError

      const feelingIds = feelingIdsData.map(row => row.id)

      const { data: sfData, error: sfError } = await supabase
        .from('strategy_feelings')
        .select('strategy_id')
        .in('feeling_id', feelingIds)

      if (sfError) throw sfError

      const sfIds = sfData.map(row => row.strategy_id)
      strategyIds = strategyIds.length ? strategyIds.filter(id => sfIds.includes(id)) : sfIds
    }

    // ISSUES
    if ((filters.issues?.length ?? 0) > 0) {
      console.log('Adding issue filter:', filters.issues)

      // Step 1: Get issue IDs for the given issue names
      const { data: issueRows, error: issueError } = await supabase
        .from('issues')
        .select('id')
        .in('name', filters.issues ?? [])

      if (issueError) throw issueError

      const issueIds = (issueRows ?? []).map(row => row.id)
      console.log('Resolved issue IDs:', issueIds)

      // Step 2: Get strategy IDs from strategy_issues
      const { data: strategyIssueRows, error: strategyIssueError } = await supabase
        .from('strategy_issues')
        .select('strategy_id')
        .in('issue_id', issueIds)

      if (strategyIssueError) throw strategyIssueError

      const strategyIdsForIssues = (strategyIssueRows ?? []).map(row => row.strategy_id)
      console.log('Matching strategy IDs for issue:', strategyIdsForIssues)

      // Step 3: Refine the main strategy query
      query = query.in('id', strategyIdsForIssues)
    }

    // BARRIERS
    if (filters.barrier_type) {
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

    // Apply strategyId filter
    if (strategyIds.length > 0) {
      query = query.in('id', strategyIds)
    } else if (filters.feelings || filters.issues || filters.barrier_type) {
      // If filters were used but no match, return empty
      return []
    }

    // SEARCH
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      query = query.or(
        `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      )
    }

    // Run query
    console.log('Executing strategy query...')
    const { data, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }

    console.log('Query successful. Strategies found:', data?.length ?? 0)
    console.log('Fetched strategies:', data);
    return data ?? []
  } catch (error) {
    console.error('Error in getStrategies:', error)
    throw error
  }
}

/**
 * Get a single strategy by ID
 */
export async function getStrategy(id: string): Promise<Strategy | null> {
  try {
    const { data, error } = await supabase
      .from('strategies')
      .select('*')
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
 * Get vote count for a strategy
 */
export async function getVoteCount(strategyId: string): Promise<number> {
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
