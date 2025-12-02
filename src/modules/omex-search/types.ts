/**
 * Types for OMEX Advanced Search System
 * 5 search methods as per szukajka.md specification
 */

// ============================================================================
// METHOD 1: Machine-Based Search (5-step wizard)
// ============================================================================

export interface MachineSearchStep1 {
  brand: string // CAT, Komatsu, Hitachi, Volvo, JCB, etc.
}

export interface MachineSearchStep2 extends MachineSearchStep1 {
  machineType: 
    | 'excavator'           // Koparka
    | 'loader'              // Ładowarka
    | 'backhoe'             // Koparka-ładowarka
    | 'dozer'               // Spychacz
    | 'telehandler'         // Ładowarka teleskopowa
    | 'compactor'           // Walcarka
    | 'sweeper'             // Czyszczarka
    | 'scarifier'           // Wertikutator
    | 'mini-excavator'      // Mini koparka
    | 'wheel-excavator'     // Koparka kołowa
}

export interface MachineSearchStep3 extends MachineSearchStep2 {
  model: string // e.g., "320D", "PC200", "ZX210"
  modelYear?: string // e.g., "2015-2020"
  serialNumber?: string // Optional SN range
}

export interface MachineSearchStep4 extends MachineSearchStep3 {
  series?: string // e.g., "F", "G", "H" generation
  frame?: 'small' | 'standard' | 'large' // Frame size
}

export interface MachineSearchStep5 extends MachineSearchStep4 {
  engine?: string // Perkins, Yanmar, Mitsubishi, Caterpillar
}

export type MachineSearchParams = MachineSearchStep5

// ============================================================================
// METHOD 2: Part Number Search
// ============================================================================

export interface PartNumberSearchParams {
  partNumber: string // OEM number, SKU, EAN, etc.
  includeAlternatives?: boolean // Show zamienniki
  exactMatch?: boolean // Exact vs fuzzy match
}

export interface PartNumberSearchResult {
  exact?: PartSearchMatch
  alternatives: PartSearchMatch[]
  suggestions: string[] // Similar part numbers
}

export interface PartSearchMatch {
  id: string
  partNumber: string
  type: 'OEM' | 'Certified' | 'Premium' | 'Budget'
  name: string
  price: number
  availability: 'in-stock' | 'order-2-5-days' | 'order-2-4-weeks' | 'discontinued'
  compatibility: string[] // Compatible machines
}

// ============================================================================
// METHOD 3: Visual Search (Image-based)
// ============================================================================

export interface VisualSearchParams {
  image: Buffer | string // Image data or URL
  detectOCR?: boolean // Try to read part numbers from image
}

export interface VisualSearchResult {
  detectedPartType?: string // AI-detected part type
  ocrResults?: string[] // Part numbers found in image
  similarParts: PartSearchMatch[]
  confidence: number // 0-1 confidence score
}

// ============================================================================
// METHOD 4: Text Search (Natural Language)
// ============================================================================

export interface TextSearchParams {
  query: string // Natural language query
  language?: 'pl' | 'en' | 'de' | 'uk'
  fuzzy?: boolean // Allow typos
}

export interface ParsedQuery {
  brands?: string[] // Detected brands
  models?: string[] // Detected models
  partTypes?: string[] // Detected part types
  parameters?: Record<string, any> // e.g., { weight: "3 tons" }
  oemNumbers?: string[] // OEM numbers found in text
}

// ============================================================================
// METHOD 5: Advanced Filters
// ============================================================================

export interface AdvancedSearchFilters {
  // Category
  categoryIds?: string[] // Multi-select categories
  includeSubcategories?: boolean

  // Machine Brand
  machineBrands?: string[] // CAT, Komatsu, etc.

  // Availability
  availability?: ('in-stock' | 'order-2-5-days' | 'order-2-4-weeks' | 'discontinued')[]

  // Price Range
  minPrice?: number
  maxPrice?: number
  currency?: 'PLN' | 'EUR'

  // OEM vs Alternative
  partTypes?: ('OEM' | 'Certified' | 'Premium' | 'Budget')[]

  // Manufacturer
  manufacturers?: string[] // Parker, Rexroth, Vickers, etc.

  // Quality
  minQuality?: 'Budget' | 'Premium' | 'Certified' | 'OEM'

  // Rating & Reviews
  minRating?: number // 1-5
  minReviews?: number

  // Sorting
  sortBy?: 'newest' | 'best-selling' | 'price-asc' | 'price-desc' | 'rating'
}

// ============================================================================
// Common Search Result
// ============================================================================

export interface SearchResult<T = any> {
  products: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  filters?: AdvancedSearchFilters
  parsedQuery?: ParsedQuery
  searchTime?: number // milliseconds
}

// ============================================================================
// Search History & Tracking
// ============================================================================

export interface SearchHistoryEntry {
  id: string
  userId?: string
  sessionId: string
  query: string
  method: 'machine' | 'part-number' | 'visual' | 'text' | 'filters'
  params: any
  resultsCount: number
  clickedProducts?: string[] // Product IDs clicked
  timestamp: Date
}

// ============================================================================
// Suggestions & Autocomplete
// ============================================================================

export interface SearchSuggestion {
  text: string
  type: 'product' | 'category' | 'brand' | 'model' | 'part-number'
  count?: number // Number of results
  icon?: string
}

// ============================================================================
// Machine Database (for Method 1)
// ============================================================================

export interface MachineDefinition {
  id: string
  brand: string
  type: string
  model: string
  series?: string
  frame?: string
  engine?: string
  yearFrom?: number
  yearTo?: number
  serialNumberRange?: string
  weight?: number // tons
  compatibleParts: string[] // Part IDs
}

// ============================================================================
// Part Compatibility Matrix
// ============================================================================

export interface PartCompatibility {
  partId: string
  compatibleMachines: {
    brand: string
    models: string[]
    years?: string
    notes?: string
  }[]
  alternatives: {
    partId: string
    type: 'OEM' | 'Certified' | 'Premium' | 'Budget'
    compatibility: number // 0-100% compatibility score
  }[]
}
