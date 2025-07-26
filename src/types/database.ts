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
  hover_description?: string | null;
}

export interface StrategyFeeling {
  feeling: Feeling;
  strategy_id: string;
}

export interface Issue {
  id: string;
  name: string;
  emoji?: string | null;
  color?: string | null;
  category?: string | null;
  hover_description?: string | null;
}

export interface StrategyIssue {
  issue: Issue;
  strategy_id: string;
}

export interface Barrier {
  id: string;
  name: string;
  emoji?: string | null;
  color?: string | null;
  category?: string | null;
  hover_description?: string | null;
}

export interface StrategyBarrier {
  barrier: Barrier;
  strategy_id: string;
}

export interface WhyDoesThisWork {
  id: string;
  name: string;
  category?: string | null;
  emoji?: string | null;
  color?: string | null;
  hover_description?: string | null;
}

export interface StrategyWhyDoesThisWork {
  why_does_this_work: WhyDoesThisWork;
  strategy_id: string;
}

export interface Strategy {
  id: string;
  name: string;
  subtitle?: string | null;
  description?: string;
  example?: string;
  source?: string | null;
  price?: string | null;
  use_case?: string | null;
  adhd_friendly_improvement?: string | null;
  why_does_this_work?: string | null;
  image?: string | null;
  icon_file?: string | null;
  image_source?: string | null;
  further_reading_text?: string | null;
  further_reading_url?: string | null;
  further_reading_suggestions?: string | null;
  reviewed?: boolean;
  help_task_id?: string | null;
  barrier_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  vote_count?: number | { count: number };
  featured?: boolean;
  strategy_tags?: StrategyTag[];
  strategy_feelings?: StrategyFeeling[];
  strategy_issues?: StrategyIssue[];
  strategy_barriers?: StrategyBarrier[];
  strategy_help_tasks?: StrategyHelpTask[];
  strategy_why_does_this_work?: StrategyWhyDoesThisWork[];
  // Legacy fields for backward compatibility
  issue?: string | string[];
  barrier_type?: string;
}

export interface HelpTask {
  id: string;
  name: string;
  emoji?: string | null;
  color?: string | null;
  category?: string | null;
  hover_description?: string | null;
}

export interface StrategyHelpTask {
  help_task: HelpTask;
  strategy_id: string;
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

export interface StepSection {
  number: number;
  emoji: string;
  title: string;
  intro: string;
  try_this: string[];
  tip: string;
}

export interface FeelingsContent {
  id: string;
  feeling_name: string;
  subtitle: string;
  intro_paragraph: string;
  gentle_advice: string;
  stern_advice: string;
  adhd_reasons: string[];
  step_sections?: StepSection[];
  created_at: string;
  updated_at: string;
}