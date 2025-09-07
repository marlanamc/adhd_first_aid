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

export interface BarriersContent {
  id: string;
  barrier_name: string;
  subtitle: string;
  intro_paragraph: string;
  gentle_advice: string;
  stern_advice: string;
  adhd_reasons: string[];
  step_sections?: StepSection[];
  created_at: string;
  updated_at: string;
}

export interface IdentityContentSection {
  title: string;
  emoji: string;
  content: string[];
  subsections?: {
    title: string;
    emoji: string;
    content: string[];
  }[];
}

export interface IdentitiesContent {
  id: string;
  identity_name: string;
  subtitle?: string;
  emoji: string;
  intro_paragraph: string;
  gentle_advice: string;
  stern_advice: string;
  // Optional field for parity with other content types
  adhd_reasons?: string[];
  content_sections: IdentityContentSection[];
  created_at: string;
  updated_at: string;
}

export interface TasksContent {
  id: string;
  task_name: string;
  subtitle?: string;
  intro_paragraph: string;
  gentle_advice: string;
  stern_advice: string;
  adhd_reasons: string[];
  content_sections: IdentityContentSection[];
  created_at: string;
  updated_at: string;
}

export interface ComplexLoopsContent {
  id: string;
  loop_name: string;
  subtitle?: string;
  intro_paragraph: string;
  gentle_advice: string;
  stern_advice: string;
  adhd_reasons: string[];
  content_sections: IdentityContentSection[];
  loop_type?: 'time_transition' | 'analysis_decision' | 'social_relationship' | 'dopamine_impulse' | 'energy_capacity' | 'task_communication';
  framework_title?: string;
  framework_sections?: {
    // Time & Transition (The Time Trap)
    setup?: { title: string; content: string; };
    adhd_response?: { title: string; content: string; mechanisms: string[]; };
    cascade?: { title: string; steps: string[]; };
    loop?: { title: string; content: string; };
    // Analysis & Decision (The Thinking Spiral)
    trigger?: { title: string; content: string; };
    adhd_amplification?: { title: string; content: string; mechanisms: string[]; };
    mental_traffic_jam?: { title: string; steps: string[]; };
    paralysis?: { title: string; content: string; };
    // Social & Relationship (The Social Spiral)
    protective_response?: { title: string; steps: string[]; };
    reinforcement?: { title: string; content: string; };
    // Dopamine & Impulse (The Dopamine Cycle)
    adhd_hijack?: { title: string; content: string; mechanisms: string[]; };
    hyperfocus_trap?: { title: string; steps: string[]; };
    crash?: { title: string; content: string; };
    // Energy & Capacity (The Depletion Pattern)
    demand?: { title: string; content: string; };
    overextension?: { title: string; content: string; mechanisms: string[]; };
    shame_cycle?: { title: string; content: string; };
    // Task & Communication (The Avoidance Spiral)
    task?: { title: string; content: string; };
    executive_breakdown?: { title: string; content: string; mechanisms: string[]; };
    avoidance?: { title: string; steps: string[]; };
    mountain_effect?: { title: string; content: string; };
  };
  created_at: string;
  updated_at: string;
}

export interface FeelingSources {
  id: string;
  feeling_slug: string;
  category: string;
  title: string;
  authors: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface BarrierSources {
  id: string;
  barrier_slug: string;
  category: string;
  title: string;
  authors: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface LifeAreaSources {
  id: string;
  life_area_slug: string;
  category: string;
  title: string;
  authors: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IdentitySources {
  id: string;
  identity_slug: string;
  category: string;
  title: string;
  authors: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CrisisModeFeeling {
  id: string;
  feeling_name: string;
  description: string;
  strategies: string[];
  icon: string;
  created_at: string;
  updated_at: string;
}