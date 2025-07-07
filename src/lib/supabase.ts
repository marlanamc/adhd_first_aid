import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseKey ? 'present' : 'missing'
  })
  throw new Error('Missing required Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Test the connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('strategies')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection test failed:', error)
    } else {
      console.log('Supabase connection test successful')
    }
  } catch (err: unknown) {
    console.error('Failed to test Supabase connection:', err)
  }
}

testConnection()

// Types
export interface Strategy {
  id: string
  name: string
  description: string
  feeling: string[]
  issue: string[]
  type: string[]
  mode: string[]
  barrier_type: string | null
  use_case: string | null
  source: string | null
  price: string | null
  tags: string[]
  adhd_friendly_improvement: string | null
  example: string | null
  featured: boolean
  vote_count: number
}

export interface StrategyVote {
  id: string
  strategy_id: string
  session_id: string
  created_at: string
}

// Helper functions for data operations
export async function getStrategies(): Promise<Strategy[]> {
  const { data, error } = await supabase
    .from('strategies')
    .select('*')
    // order by creation time to show newest strategies first. The previous
    // implementation attempted to sort by a non-existent `votes` column which
    // resulted in a runtime error.
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching strategies:', error)
    throw error
  }
  
  return data || []
}

export async function getStrategyById(id: string): Promise<Strategy | null> {
  const { data, error } = await supabase
    .from('strategies')
    .select(`
      *,
      strategy_votes(count)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  if (!data) return null
  
  return {
    ...data,
    vote_count: data.strategy_votes?.[0]?.count || 0
  }
}

export async function voteForStrategy(id: number): Promise<void> {
  const { error } = await supabase.rpc('increment_votes', { strategy_id: id })
  
  if (error) {
    console.error('Error voting for strategy:', error)
    throw error
  }
}

// Example using useEffect and useState
export function Home() {
  const [feelings, setFeelings] = useState<string[]>([]);

  useEffect(() => {
    async function fetchFeelings() {
      const { data, error } = await supabase.from('feelings').select('name');
      if (!error && data) {
        setFeelings(data.map((f: { name: string }) => f.name));
      }
    }
    fetchFeelings();
  }, []);
  
  // ...rest of your component
}

// Database schema for reference:
/*
CREATE TABLE strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  feeling TEXT[] NOT NULL,
  issue TEXT[] NOT NULL,
  type TEXT[] NOT NULL,
  mode TEXT[] NOT NULL,
  barrier_type TEXT NOT NULL,
  use_case TEXT NOT NULL,
  source TEXT NOT NULL,
  price TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  adhd_friendly_improvement TEXT,
  example TEXT,
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

-- Enable Row Level Security
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on strategies" ON strategies
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on strategy_votes" ON strategy_votes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on strategy_votes" ON strategy_votes
  FOR INSERT WITH CHECK (true);
*/