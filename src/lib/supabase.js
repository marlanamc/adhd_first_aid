import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// In production, these would come from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema for reference:
/*
CREATE TABLE strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  alt_text TEXT,
  feeling TEXT[] NOT NULL,
  issue TEXT NOT NULL,
  type TEXT NOT NULL,
  mode TEXT[] NOT NULL,
  barrier_type TEXT NOT NULL,
  use_case TEXT NOT NULL,
  source TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  price TEXT NOT NULL,
  image_url TEXT,
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

