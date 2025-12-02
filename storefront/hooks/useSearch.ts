/**
 * useSearch Hook - Universal search hook for all 5 search methods
 */

import { useState, useCallback } from 'react'

export interface MachineSearchParams {
  brand: string
  machineType: string
  model: string
  series?: string
  frame?: string
  engine?: string
}

export interface PartNumberSearchParams {
  partNumber: string
  includeAlternatives?: boolean
  exactMatch?: boolean
}

export interface VisualSearchParams {
  image?: string // base64
  imageUrl?: string
  detectOCR?: boolean
}

export interface TextSearchParams {
  query: string
  language?: 'pl' | 'en' | 'de' | 'uk'
  fuzzy?: boolean
}

export interface FilterSearchParams {
  categoryIds?: string[]
  includeSubcategories?: boolean
  machineBrands?: string[]
  availability?: string[]
  minPrice?: number
  maxPrice?: number
  currency?: 'PLN' | 'EUR'
  partTypes?: string[]
  manufacturers?: string[]
  minRating?: number
  minReviews?: number
  sortBy?: string
}

export type SearchMethod = 'machine' | 'part-number' | 'visual' | 'text' | 'filters'

export interface SearchParams {
  method: SearchMethod
  params: MachineSearchParams | PartNumberSearchParams | VisualSearchParams | TextSearchParams | FilterSearchParams
}

export interface SearchResult {
  products?: any[]
  alternatives?: any[]
  similarParts?: any[]
  exact?: any
  ocrResults?: string[]
  detectedPartType?: string
  confidence?: number
  suggestions?: string[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  parsedQuery?: any
  searchTime?: number
}

export interface SearchInfo {
  total: number
  page: number
  limit: number
  hasMore: boolean
  parsedQuery?: any
  searchTime?: number
}

export function useSearch() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null)

  const search = useCallback(async ({ method, params }: SearchParams): Promise<SearchResult> => {
    setLoading(true)
    setError(null)

    try {
      let response: Response
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

      switch (method) {
        case 'machine':
          response = await fetch(`${backendUrl}/store/omex-search/machine`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
          })
          break

        case 'part-number':
          const pnParams = params as PartNumberSearchParams
          response = await fetch(`${backendUrl}/store/omex-search/part-number`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pnParams),
          })
          break

        case 'visual':
          response = await fetch(`${backendUrl}/store/omex-search/visual`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
          })
          break

        case 'text':
          response = await fetch(`${backendUrl}/store/omex-search/text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
          })
          break

        case 'filters':
          response = await fetch(`${backendUrl}/store/omex-search/filters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
          })
          break

        default:
          throw new Error(`Unknown search method: ${method}`)
      }

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }

      const data: SearchResult = await response.json()

      // Update state
      setResults(data.products || data.similarParts || [])
      setSearchInfo({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 12,
        hasMore: data.hasMore || false,
        parsedQuery: data.parsedQuery,
        searchTime: data.searchTime,
      })

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    results,
    loading,
    error,
    searchInfo,
    search,
  }
}

// Autocomplete hook
export function useAutocomplete() {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const getSuggestions = useCallback(async (query: string, limit: number = 10) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const response = await fetch(
        `${backendUrl}/store/omex-search/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`
      )

      if (!response.ok) {
        throw new Error('Autocomplete failed')
      }

      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (err) {
      console.error('Autocomplete error:', err)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setSuggestions([])
  }, [])

  return {
    suggestions,
    loading,
    getSuggestions,
    clear,
  }
}
