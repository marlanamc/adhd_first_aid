import { createClient } from '@supabase/supabase-js'
import { logError, handleSupabaseError, getErrorMessage } from './error-handling'

// Supabase configuration - validate environment variables at startup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables (only log errors, not success on every import)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseAnonKey ? 'present' : 'missing'
  });
  throw new Error('Missing Supabase environment variables')
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format. Expected: https://your-project.supabase.co');
}

// Create the Supabase client with explicit options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
  global: {
    headers: {
      'x-client-info': 'adhd-first-aid-kit',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Connection testing utilities - only use when needed for debugging

/**
 * Test database connection by querying a simple table
 * @returns Connection status with optional count and error details
 */
export async function testConnection(): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    const { count, error } = await supabase
      .from('help_tasks')
      .select('count', { count: 'exact', head: true });

    if (error) {
      const appError = handleSupabaseError(error, 'connection test', 'testConnection')
      return { success: false, error: appError.message };
    } else {
      logError('Successfully connected to Supabase', undefined, 'testConnection', 'low')
      return { success: true, count: count ?? undefined };
    }
  } catch (err) {
    const errorMessage = getErrorMessage(err)
    logError('Exception while testing Supabase connection', err, 'testConnection', 'high')
    return { success: false, error: errorMessage };
  }
}

/**
 * Lightweight connection check without making a database query
 * @returns Basic connectivity information
 */
export function getConnectionInfo() {
  return {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isConfigured: !!(supabaseUrl && supabaseAnonKey),
    environment: process.env.NODE_ENV
  };
}

// Development helper - can be called manually for connection testing
// Example usage: import { testConnection } from '@/lib/supabase'; testConnection();
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_TEST_CONNECTION === 'true') {
  // Only test connection in development if explicitly requested
  testConnection().catch(console.error);
}

// Re-export types from the types directory
export type {
  Tag,
  StrategyTag,
  Feeling,
  StrategyFeeling,
  Issue,
  StrategyIssue,
  Barrier,
  StrategyBarrier,
  Strategy,
  HelpTask,
  HelpTaskBarrier,
  StrategyVote,
  FeelingsContent,
  BarriersContent,
  IdentitiesContent,
  TasksContent,
  ComplexLoopsContent,
  FeelingSources,
  BarrierSources,
  LifeAreaSources,
  IdentitySources,
} from '../types/database';

// Database schema for reference:
/*
CREATE TABLE strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  example TEXT,
  source TEXT,
  price TEXT,
  use_case TEXT,
  adhd_friendly_improvement TEXT,
  why_does_this_work TEXT,
  image TEXT,
  icon_file TEXT,
  image_source TEXT,
  further_reading_text TEXT,
  further_reading_url TEXT,
  further_reading_suggestions TEXT,
  reviewed BOOLEAN DEFAULT false,
  help_task_id UUID REFERENCES help_tasks(id),
  barrier_id UUID REFERENCES barriers(id),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE strategy_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(strategy_id, session_id)
);

CREATE TABLE help_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  color TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on strategies" ON strategies
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on strategy_votes" ON strategy_votes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on help_tasks" ON help_tasks
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on strategy_votes" ON strategy_votes
  FOR INSERT WITH CHECK (true);
*/

// Generic Supabase query wrapper
async function supabaseQuery<T = any>(
  table: string,
  operation: 'select' | 'selectAll',
  options: {
    column?: string;
    value?: string;
    orderBy?: string;
    useIlike?: boolean;
  } = {},
  errorMessage: string
): Promise<{ data: T | T[] | null; error: any }> {
  console.log(`🚨 ALERT: supabaseQuery is being called with table: "${table}" - this should NOT happen for feeling_sources!`);

  try {
    if (operation === 'select' && options.column && options.value) {
      console.log(`🔍 SUPABASE_QUERY: Querying table "${table}" for column "${options.column}" = "${options.value}"`);

      // Add stack trace to see who's calling this
      console.trace('🚨 supabaseQuery call stack:');

      let query = supabase.from(table).select('*');

      if (options.useIlike) {
        query = query.ilike(options.column, options.value);
      } else {
        query = query.eq(options.column, options.value);
      }

      const { data, error } = await query.single();

      console.log(`🔍 SUPABASE_QUERY: Result for "${table}":`, {
        data: data ? 'Found data' : 'No data',
        error: error ? error.message : 'No error',
        errorCode: error?.code
      });

      if (error) {
        const appError = handleSupabaseError(error, 'select', table)
        return { data: null, error: appError };
      }

      return { data, error: null };
    }

    if (operation === 'selectAll') {
      let query = supabase.from(table).select('*');

      if (options.orderBy) {
        query = query.order(options.orderBy);
      }

      const { data, error } = await query;

      if (error) {
        const appError = handleSupabaseError(error, 'select', table)
        return { data: null, error: appError };
      }

      return { data, error: null };
    }

    // Default case
    const { data, error } = await supabase.from(table).select('*');

    if (error) {
      console.error(`Error ${errorMessage}:`, error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    const appError = logError(
      `Exception during database operation: ${errorMessage}`,
      error,
      table,
      'high'
    )
    return {
      data: null,
      error: appError
    };
  }
}

// Feelings content function - now uses generic wrapper
export async function getFeelingsContent(feelingName: string) {
  return supabaseQuery(
    'feelings_content',
    'select',
    { column: 'feeling_name', value: feelingName },
    'fetching feelings content'
  );
}

// Barriers content function - now uses generic wrapper
export async function getBarriersContent(barrierName: string) {
  return supabaseQuery(
    'barriers_content',
    'select',
    { column: 'barrier_name', value: barrierName },
    'fetching barriers content'
  );
}

// Quiz submission function
export async function saveQuizSubmission(submission: {
  email: string;
  archetype: string;
  answers: number[];
}) {
  try {
    // For now, just log the submission since we don't have a quiz_submissions table
    console.log('Quiz submission received:', submission);
    
    // Return success response
    return {
      data: { id: 'mock-id', ...submission },
      error: null
    };
  } catch (error) {
    console.error('Error saving quiz submission:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to save quiz submission')
    };
  }
}

// Identity Content Functions - now use generic wrapper
export async function getIdentitiesContent(identityName: string) {
  return supabaseQuery(
    'identities_content',
    'select',
    { column: 'identity_name', value: identityName },
    'fetching identity content'
  );
}

// Crisis Mode Functions - now use generic wrapper
export async function getCrisisModeFeeling(feelingName: string) {
  return supabaseQuery(
    'crisis_mode_feelings',
    'select',
    { column: 'feeling_name', value: feelingName },
    'fetching crisis mode feeling'
  );
}

export async function getAllCrisisModeFeelingsNames() {
  return supabaseQuery(
    'crisis_mode_feelings',
    'selectAll',
    { orderBy: 'feeling_name' },
    'fetching all crisis mode feelings names'
  );
}

export async function getCrisisModeBarrier(barrierName: string) {
  return supabaseQuery(
    'crisis_mode_barriers',
    'select',
    { column: 'barrier_name', value: barrierName },
    'fetching crisis mode barrier'
  );
}

export async function getAllCrisisModeBarriersNames() {
  return supabaseQuery(
    'crisis_mode_barriers',
    'selectAll',
    { orderBy: 'barrier_name' },
    'fetching all crisis mode barriers names'
  );
}

export async function getCrisisModeComplexLoop(loopName: string) {
  return supabaseQuery(
    'crisis_mode_complex_loops',
    'select',
    { column: 'loop_name', value: loopName },
    'fetching crisis mode complex loop'
  );
}

export async function getAllCrisisModeComplexLoopsNames() {
  return supabaseQuery(
    'crisis_mode_complex_loops',
    'selectAll',
    { orderBy: 'loop_name' },
    'fetching all crisis mode complex loops names'
  );
}

export async function getCrisisModeLifeArea(lifeAreaName: string) {
  return supabaseQuery(
    'crisis_mode_life_areas',
    'select',
    { column: 'life_area_name', value: lifeAreaName },
    'fetching crisis mode life area'
  );
}

export async function getAllCrisisModeLifeAreasNames() {
  return supabaseQuery(
    'crisis_mode_life_areas',
    'selectAll',
    { orderBy: 'life_area_name' },
    'fetching all crisis mode life areas names'
  );
}

export async function getCrisisModeIdentity(identityName: string) {
  return supabaseQuery(
    'crisis_mode_identities',
    'select',
    { column: 'identity_name', value: identityName },
    'fetching crisis mode identity'
  );
}

export async function getAllCrisisModeIdentitiesNames() {
  return supabaseQuery(
    'crisis_mode_identities',
    'selectAll',
    { orderBy: 'identity_name' },
    'fetching all crisis mode identities names'
  );
}

export async function getAllIdentitiesContent() {
  return supabaseQuery(
    'identities_content',
    'selectAll',
    { orderBy: 'identity_name' },
    'fetching all identity content'
  );
}

// Tasks Content Functions - now use generic wrapper
export async function getTasksContent(taskName: string) {
  return supabaseQuery(
    'tasks_content',
    'select',
    { column: 'task_name', value: taskName, useIlike: true },
    'fetching task content'
  );
}

export async function getAllTasksContent() {
  return supabaseQuery(
    'tasks_content',
    'selectAll',
    { orderBy: 'task_name' },
    'fetching all task content'
  );
}

// Complex Loops Content Functions - now use generic wrapper
export async function getComplexLoopsContent(loopName: string) {
  return supabaseQuery(
    'complex_loops_content',
    'select',
    { column: 'loop_name', value: loopName, useIlike: true },
    'fetching complex loop content'
  );
}

export async function getAllComplexLoopsContent() {
  return supabaseQuery(
    'complex_loops_content',
    'selectAll',
    { orderBy: 'loop_name' },
    'fetching all complex loop content'
  );
}

// Complex Loop Sources Functions - now use direct queries for better error handling
export async function getComplexLoopSources(loopSlug: string) {
  console.log(`🔍 DEBUG: Querying complex_loop_sources for slug: "${loopSlug}"`);

  try {
    // Check if the specific loop_slug exists
    const { data: specificData, error: specificError } = await supabase
      .from('complex_loop_sources')
      .select('*')
      .eq('loop_slug', loopSlug);

    console.log(`🔍 DEBUG: Specific query for "${loopSlug}":`, {
      data: specificData,
      error: specificError,
      count: specificData?.length || 0
    });

    // Return the data regardless of count
    if (specificData) {
      console.log(`✅ Found ${specificData.length} sources for "${loopSlug}"`);
      return { data: specificData, error: null };
    }

    // If there's an error, return empty array
    if (specificError) {
      console.log(`⚠️ Error querying sources for "${loopSlug}":`, specificError);
      return { data: [], error: specificError };
    }

    // If no data and no error, return empty array
    console.log(`⚠️ No sources found for "${loopSlug}"`);
    return { data: [], error: null };

  } catch (debugError) {
    console.error(`🔍 DEBUG: Error during debug queries:`, debugError);
    return { data: [], error: null };
  }
}

// Feeling Sources Functions - now use generic wrapper
export async function getFeelingSources(feelingSlug: string) {
  console.log(`🔍 DEBUG: Querying feeling_sources for slug: "${feelingSlug}"`);

  // First, let's see what data actually exists in the feeling_sources table
  try {
    console.log(`🔍 DEBUG: Checking all data in feeling_sources table...`);
    const { data: allData, error: allError } = await supabase
      .from('feeling_sources')
      .select('*')
      .limit(10);

    console.log(`🔍 DEBUG: All feeling_sources data (first 10):`, {
      data: allData,
      error: allError,
      count: allData?.length || 0
    });

    // Check if the specific feeling_slug exists
    const { data: specificData, error: specificError } = await supabase
      .from('feeling_sources')
      .select('*')
      .eq('feeling_slug', feelingSlug);

    console.log(`🔍 DEBUG: Specific query for "${feelingSlug}":`, {
      data: specificData,
      error: specificError,
      count: specificData?.length || 0
    });

    // Return the data regardless of count - the database has the data!
    if (specificData) {
      console.log(`✅ Found ${specificData.length} sources for "${feelingSlug}"`);
      return { data: specificData, error: null };
    }

    // If there's an error, return empty array
    if (specificError) {
      console.log(`⚠️ Error querying sources for "${feelingSlug}":`, specificError);
      return { data: [], error: specificError };
    }

    // If no data and no error, return empty array
    console.log(`⚠️ No sources found for "${feelingSlug}"`);
    return { data: [], error: null };

  } catch (debugError) {
    console.error(`🔍 DEBUG: Error during debug queries:`, debugError);
    return { data: [], error: null };
  }
}

// Barrier Sources Functions - now use direct queries for better error handling
export async function getBarrierSources(barrierSlug: string) {
  console.log(`🔍 DEBUG: Querying barrier_sources for slug: "${barrierSlug}"`);

  try {
    // Check if the specific barrier_slug exists
    const { data: specificData, error: specificError } = await supabase
      .from('barrier_sources')
      .select('*')
      .eq('barrier_slug', barrierSlug);

    console.log(`🔍 DEBUG: Specific query for "${barrierSlug}":`, {
      data: specificData,
      error: specificError,
      count: specificData?.length || 0
    });

    // Return the data regardless of count
    if (specificData) {
      console.log(`✅ Found ${specificData.length} sources for "${barrierSlug}"`);
      return { data: specificData, error: null };
    }

    // If there's an error, return empty array
    if (specificError) {
      console.log(`⚠️ Error querying sources for "${barrierSlug}":`, specificError);
      return { data: [], error: specificError };
    }

    // If no data and no error, return empty array
    console.log(`⚠️ No sources found for "${barrierSlug}"`);
    return { data: [], error: null };

  } catch (debugError) {
    console.error(`🔍 DEBUG: Error during debug queries:`, debugError);
    return { data: [], error: null };
  }
}

// Life Area Sources Functions - now use direct queries for better error handling
export async function getLifeAreaSources(lifeAreaSlug: string) {
  console.log(`🔍 DEBUG: Querying life_areas_sources for slug: "${lifeAreaSlug}"`);

  try {
    // Check if the specific life_area_slug exists
    const { data: specificData, error: specificError } = await supabase
      .from('life_areas_sources')
      .select('*')
      .eq('life_area_slug', lifeAreaSlug);

    console.log(`🔍 DEBUG: Specific query for "${lifeAreaSlug}":`, {
      data: specificData,
      error: specificError,
      count: specificData?.length || 0
    });

    // Return the data regardless of count
    if (specificData) {
      console.log(`✅ Found ${specificData.length} sources for "${lifeAreaSlug}"`);
      return { data: specificData, error: null };
    }

    // If there's an error, return empty array
    if (specificError) {
      console.log(`⚠️ Error querying sources for "${lifeAreaSlug}":`, specificError);
      return { data: [], error: specificError };
    }

    // If no data and no error, return empty array
    console.log(`⚠️ No sources found for "${lifeAreaSlug}"`);
    return { data: [], error: null };

  } catch (debugError) {
    console.error(`🔍 DEBUG: Error during debug queries:`, debugError);
    return { data: [], error: null };
  }
}

// Identity Sources Functions - now use direct queries for better error handling
export async function getIdentitySources(identitySlug: string) {
  console.log(`🔍 DEBUG: Querying identity_sources for slug: "${identitySlug}"`);

  try {
    // Check if the specific identity_slug exists
    const { data: specificData, error: specificError } = await supabase
      .from('identity_sources')
      .select('*')
      .eq('identity_slug', identitySlug);

    console.log(`🔍 DEBUG: Specific query for "${identitySlug}":`, {
      data: specificData,
      error: specificError,
      count: specificData?.length || 0
    });

    // Return the data regardless of count
    if (specificData) {
      console.log(`✅ Found ${specificData.length} sources for "${identitySlug}"`);
      return { data: specificData, error: null };
    }

    // If there's an error, return empty array
    if (specificError) {
      console.log(`⚠️ Error querying sources for "${identitySlug}":`, specificError);
      return { data: [], error: specificError };
    }

    // If no data and no error, return empty array
    console.log(`⚠️ No sources found for "${identitySlug}"`);
    return { data: [], error: null };

  } catch (debugError) {
    console.error(`🔍 DEBUG: Error during debug queries:`, debugError);
    return { data: [], error: null };
  }
}

