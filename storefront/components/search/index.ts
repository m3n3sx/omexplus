/**
 * OMEX Advanced Search Components
 * Export all search-related components
 */

// Basic Search Components (5 Methods)
export { default as MachineSelector } from './MachineSelector'
export { default as PartNumberSearch } from './PartNumberSearch'
export { default as VisualSearch } from './VisualSearch'
export { default as AdvancedFilters } from './AdvancedFilters'
export { default as SearchResults } from './SearchResults'
export { default as EnhancedSearchBar } from './EnhancedSearchBar'

// Advanced Features
export { default as PartComparison } from './PartComparison'
export { default as AIRecommendations } from './AIRecommendations'
export { default as AvailabilityNotifier } from './AvailabilityNotifier'
export { default as AlternativeCalculator } from './AlternativeCalculator'
export { default as SpecificationExporter } from './SpecificationExporter'

// Types
export type {
  MachineSearchParams,
  PartNumberSearchParams,
  VisualSearchParams,
  TextSearchParams,
  FilterSearchParams,
  SearchMethod,
  SearchParams,
  SearchResult,
} from '@/hooks/useSearch'
