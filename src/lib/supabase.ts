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

