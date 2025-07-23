// Strategy-related type definitions

export interface StrategyFilters {
  feelings?: string[];
  issues?: string[];
  barrier_type?: string;
  help_tasks?: string[];
  search?: string;
}

export type SortOption = 'popular' | 'newest' | 'alphabetical';

export interface StrategySearchState {
  query: string;
  filters: StrategyFilters;
  sortBy: SortOption;
  showFilters: boolean;
  priceFilter: string[];
  tagFilter: string[];
  availableTags: string[];
  availablePrices: string[];
}