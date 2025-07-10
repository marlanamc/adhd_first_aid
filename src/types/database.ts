// Database type definitions for ADHD First Aid Kit

export interface Tag {
  id: string;
  name: string;
  category?: string | null;
  description?: string;
}

export interface StrategyTag {
  tag: Tag;
  strategy_id: string;
}

export interface Feeling {
  id: string;
  name: string;
  emoji?: string | null;
  color?: string | null;
  category?: string | null;
  description?: string | null;
}

export interface StrategyFeeling {
  feeling: Feeling;
  strategy_id: string;
}

export interface Issue {
  id: string;
  name: string;
}

export interface StrategyIssue {
  issue: Issue;
  strategy_id: string;
}

export interface Barrier {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

export interface StrategyBarrier {
  barrier: Barrier;
  strategy_id: string;
}

export interface Strategy {
  id: string;
  name: string;
  description?: string;
  example?: string;
  source?: string | null;
  price?: string | null;
  use_case?: string | null;
  created_at?: string | null;
  vote_count?: number;
  featured?: boolean;
  strategy_tags?: StrategyTag[];
  strategy_feelings?: StrategyFeeling[];
  strategy_issues?: StrategyIssue[];
  strategy_barriers?: StrategyBarrier[];
  // Legacy fields for backward compatibility
  issue?: string | string[];
  barrier_type?: string;
}

export interface HelpTask {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  color?: string;
  category?: string;
}

export interface HelpTaskBarrier {
  help_task_id: string;
  barrier_id: string;
  help_task?: HelpTask;
  barrier?: Barrier;
}

export interface StrategyVote {
  id: string;
  strategy_id: string;
  session_id: string;
  created_at: string;
}