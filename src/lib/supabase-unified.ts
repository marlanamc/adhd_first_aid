// Unified Supabase client for new schema structure
// Use this to gradually replace your existing supabase.ts functions

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for the new unified schema
export interface ContentType {
  id: string
  name: string
  display_name: string
  description?: string
  icon?: string
  color_scheme?: string
  created_at: string
  updated_at: string
}

export interface ContentPage {
  id: string
  content_type_id: string
  name: string
  slug: string
  subtitle?: string
  emoji?: string
  intro_paragraph: string
  gentle_advice: string
  stern_advice: string
  adhd_reasons: string[]
  content_sections: any[] // JSONB array
  meta_data: Record<string, any> // JSONB object
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ContentWithType extends ContentPage {
  content_type: string
  content_type_display: string
  content_type_icon?: string
  content_type_color?: string
}

export interface ContentFull extends ContentWithType {
  source_count: number
  source_categories: string[]
  tag_count: number
  tags: Array<{
    id: string
    name: string
    category?: string
    emoji?: string
    relevance_score: number
  }>
  view_count: number
  vote_score: number
  favorite_count: number
}

export interface Source {
  id: string
  title: string
  authors?: string
  description?: string
  publication_year?: number
  source_type: 'book' | 'article' | 'website' | 'research' | 'blog' | 'video' | 'podcast' | 'other'
  url?: string
  isbn?: string
  doi?: string
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  category?: string
  color?: string
  emoji?: string
  description?: string
  usage_count: number
  created_at: string
  updated_at: string
}

// =============================================================================
// CONTENT FUNCTIONS (replace your existing content functions)
// =============================================================================

/**
 * Get all content of a specific type
 */
export async function getContentByType(contentType: string, limit?: number) {
  const query = supabase
    .from('content_with_types')
    .select('*')
    .eq('content_type', contentType)
    .order('sort_order', { ascending: true })

  if (limit) {
    query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error(`Error fetching ${contentType} content:`, error)
    return { data: null, error }
  }

  return { data: data as ContentWithType[], error: null }
}

/**
 * Get a single content page by slug
 */
export async function getContentBySlug(slug: string) {
  const { data, error } = await supabase
    .from('content_full')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error(`Error fetching content by slug ${slug}:`, error)
    return { data: null, error }
  }

  return { data: data as ContentFull, error: null }
}

/**
 * Get content with sources for a specific page
 */
export async function getContentSources(contentPageId: string) {
  const { data, error } = await supabase
    .from('content_sources')
    .select(`
      *,
      source:sources(*)
    `)
    .eq('content_page_id', contentPageId)
    .order('relevance_score', { ascending: false })

  if (error) {
    console.error('Error fetching content sources:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Search content across all types
 */
export async function searchContent(query: string, contentTypes?: string[], limit: number = 20) {
  let searchQuery = supabase
    .from('content_full')
    .select('*')
    .or(`name.ilike.%${query}%,intro_paragraph.ilike.%${query}%`)
    .limit(limit)

  if (contentTypes && contentTypes.length > 0) {
    searchQuery = searchQuery.in('content_type', contentTypes)
  }

  const { data, error } = await searchQuery

  if (error) {
    console.error('Error searching content:', error)
    return { data: null, error }
  }

  return { data: data as ContentFull[], error: null }
}

// =============================================================================
// LEGACY COMPATIBILITY FUNCTIONS
// These help you migrate gradually by providing the same interface as before
// =============================================================================

/**
 * Get feelings content (backward compatibility)
 */
export async function getFeelingsContent(feelingName?: string) {
  if (feelingName) {
    const { data, error } = await getContentBySlug(feelingName.toLowerCase().replace(/\s+/g, '-'))
    return { 
      data: data ? [data] : null, 
      error 
    }
  }
  
  return await getContentByType('feeling')
}

/**
 * Get barriers content (backward compatibility) 
 */
export async function getBarriersContent(barrierName?: string) {
  if (barrierName) {
    const { data, error } = await getContentBySlug(barrierName.toLowerCase().replace(/\s+/g, '-'))
    return { 
      data: data ? [data] : null, 
      error 
    }
  }
  
  return await getContentByType('barrier')
}

/**
 * Get identities content (backward compatibility)
 */
export async function getIdentitiesContent(identityName?: string) {
  if (identityName) {
    const { data, error } = await getContentBySlug(identityName.toLowerCase().replace(/\s+/g, '-'))
    return { 
      data: data ? [data] : null, 
      error 
    }
  }
  
  return await getContentByType('identity')
}

/**
 * Get tasks content (backward compatibility)
 */
export async function getTasksContent(taskName?: string) {
  if (taskName) {
    const { data, error } = await getContentBySlug(taskName.toLowerCase().replace(/\s+/g, '-'))
    return { 
      data: data ? [data] : null, 
      error 
    }
  }
  
  return await getContentByType('task')
}

/**
 * Get complex loops content (backward compatibility)
 */
export async function getComplexLoopsContent(loopName?: string) {
  if (loopName) {
    const { data, error } = await getContentBySlug(loopName.toLowerCase().replace(/\s+/g, '-'))
    return { 
      data: data ? [data] : null, 
      error 
    }
  }
  
  return await getContentByType('complex_loop')
}

// =============================================================================
// USER INTERACTION FUNCTIONS
// =============================================================================

/**
 * Track user interaction (view, vote, favorite, etc.)
 */
export async function trackInteraction(
  sessionId: string,
  contentPageId: string,
  interactionType: 'vote_up' | 'vote_down' | 'favorite' | 'view' | 'share',
  interactionData: Record<string, any> = {}
) {
  const { error } = await supabase
    .from('user_interactions')
    .upsert({
      session_id: sessionId,
      content_page_id: contentPageId,
      interaction_type: interactionType,
      interaction_data: interactionData
    })

  if (error) {
    console.error('Error tracking interaction:', error)
    return { error }
  }

  return { error: null }
}

/**
 * Get user interactions for a session
 */
export async function getUserInteractions(sessionId: string) {
  const { data, error } = await supabase
    .from('user_interactions')
    .select('*')
    .eq('session_id', sessionId)

  if (error) {
    console.error('Error fetching user interactions:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

// =============================================================================
// TAG FUNCTIONS
// =============================================================================

/**
 * Get all tags with usage counts
 */
export async function getAllTags() {
  const { data, error } = await supabase
    .from('unified_tags')
    .select('*')
    .order('usage_count', { ascending: false })

  if (error) {
    console.error('Error fetching tags:', error)
    return { data: null, error }
  }

  return { data: data as Tag[], error: null }
}

/**
 * Get content by tag
 */
export async function getContentByTag(tagId: string, limit: number = 20) {
  const { data, error } = await supabase
    .from('content_tags')
    .select(`
      relevance_score,
      content_page:content_pages(*)
    `)
    .eq('tag_id', tagId)
    .order('relevance_score', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching content by tag:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get all content types
 */
export async function getContentTypes() {
  const { data, error } = await supabase
    .from('content_types')
    .select('*')
    .order('display_name', { ascending: true })

  if (error) {
    console.error('Error fetching content types:', error)
    return { data: null, error }
  }

  return { data: data as ContentType[], error: null }
}

/**
 * Generate session ID for anonymous users
 */
export function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

export default supabase