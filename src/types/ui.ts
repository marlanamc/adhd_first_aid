// UI-related type definitions

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featured: boolean;
  category: string;
  readTime: string;
  publishDate: string;
}

export type ViewMode = 'feeling' | 'task';

export type AppStep = 'feeling' | 'issue' | 'barrier' | 'gallery' | 'faq' | 'about' | 'blog' | 'terminology' | 'legal';

export interface AppState {
  currentStep: AppStep;
  selectedFeeling: string;
  selectedIssue: string;
  selectedBarrier: string;
  searchQuery: string;
  viewMode: ViewMode;
  isTransitioning: boolean;
  showSearch: boolean;
  showDropdown: boolean;
  loading: boolean;
  error: string | null;
}