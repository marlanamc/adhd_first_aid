import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Log environment variables (but not the full key)
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseAnonKey ? 'present' : 'missing'
  });
  throw new Error('Missing Supabase environment variables')
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('Invalid Supabase URL format:', supabaseUrl);
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

// Test the connection immediately
async function testConnection() {
  try {
    const { count, error } = await supabase
      .from('help_tasks')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('Failed to connect to Supabase:', error.message);
    } else {
      console.log('Successfully connected to Supabase. Help tasks count:', count);
    }
  } catch (err) {
    console.error('Exception while testing Supabase connection:', err);
  }
}

void testConnection();

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

// Feelings content function
export async function getFeelingsContent(feelingName: string) {
  try {
    const { data, error } = await supabase
      .from('feelings_content')
      .select('*')
      .eq('feeling_name', feelingName)
      .single();

    if (error) {
      console.error('Error fetching feelings content:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching feelings content:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to fetch feelings content')
    };
  }
}

// Barriers content function
export async function getBarriersContent(barrierName: string) {
  try {
    const { data, error } = await supabase
      .from('barriers_content')
      .select('*')
      .eq('barrier_name', barrierName)
      .single();

    if (error) {
      console.error('Error fetching barriers content:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching barriers content:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to fetch barriers content')
    };
  }
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

// Identity Content Functions
export async function getIdentitiesContent(identityName: string) {
  try {
    const { data, error } = await supabase
      .from('identities_content')
      .select('*')
      .eq('identity_name', identityName)
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching identity content:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch identity content') 
    };
  }
}

// Crisis Mode Functions
export async function getCrisisModeFeeling(feelingName: string) {
  try {
    const { data, error } = await supabase
      .from('crisis_mode_feelings')
      .select('*')
      .eq('feeling_name', feelingName)
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching crisis mode feeling:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch crisis mode feeling') 
    };
  }
}

export async function getAllCrisisModeFeelingsNames() {
  try {
    const { data, error } = await supabase
      .from('crisis_mode_feelings')
      .select('feeling_name, description, icon')
      .order('feeling_name');
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching crisis mode feelings names:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch crisis mode feelings names') 
    };
  }
}

export async function getAllIdentitiesContent() {
  try {
    const { data, error } = await supabase
      .from('identities_content')
      .select('*')
      .order('identity_name');
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching all identity content:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch identity content') 
    };
  }
}

// Tasks Content Functions
export async function getTasksContent(taskName: string) {
  try {
    const { data, error } = await supabase
      .from('tasks_content')
      .select('*')
      .ilike('task_name', taskName)
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching task content:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch task content') 
    };
  }
}

export async function getAllTasksContent() {
  try {
    const { data, error } = await supabase
      .from('tasks_content')
      .select('*')
      .order('task_name');
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching all task content:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch task content') 
    };
  }
}

// Complex Loops Content Functions
export async function getComplexLoopsContent(loopName: string) {
  try {
    const { data, error } = await supabase
      .from('complex_loops_content')
      .select('*')  
      .ilike('loop_name', loopName)
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching complex loop content:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch complex loop content') 
    };
  }
}

export async function getAllComplexLoopsContent() {
  try {
    const { data, error } = await supabase
      .from('complex_loops_content')
      .select('*')
      .order('loop_name');
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching all complex loop content:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch complex loop content') 
    };
  }
}

// Complex Loop Sources Functions
export async function getComplexLoopSources(loopSlug: string) {
  try {
    const { data, error } = await supabase
      .from('complex_loop_sources')
      .select('*')
      .eq('loop_slug', loopSlug)
      .order('category, title');
    return { data, error };
  } catch (error) {
    console.error('Error fetching complex loop sources:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to fetch complex loop sources')
    };
  }
}

// Feeling Sources Functions
export async function getFeelingSources(feelingSlug: string) {
  try {
    const { data, error } = await supabase
      .from('feeling_sources')
      .select('*')
      .eq('feeling_slug', feelingSlug)  
      .order('category, title');
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching feeling sources:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch feeling sources') 
    };
  }
}

// Barrier Sources Functions
export async function getBarrierSources(barrierSlug: string) {
  try {
    const { data, error } = await supabase
      .from('barrier_sources')
      .select('*')
      .eq('barrier_slug', barrierSlug)  
      .order('category, title');
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching barrier sources:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch barrier sources') 
    };
  }
}

// Life Area Sources Functions
export async function getLifeAreaSources(lifeAreaSlug: string) {
  try {
    const { data, error } = await supabase
      .from('life_areas_sources')
      .select('*')
      .eq('life_area_slug', lifeAreaSlug)  
      .order('category, title');
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching life area sources:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch life area sources') 
    };
  }
}

// Identity Sources Functions
export async function getIdentitySources(identitySlug: string) {
  try {
    const { data, error } = await supabase
      .from('identity_sources')
      .select('*')
      .eq('identity_slug', identitySlug)
      .order('category, title')
    return { data, error }
  } catch (error) {
    console.error('Error fetching identity sources:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to fetch identity sources')
    }
  }
}

