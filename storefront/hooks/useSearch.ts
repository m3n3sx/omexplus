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
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (publishableKey) {
        headers['x-publishable-api-key'] = publishableKey
      }

      let url = `${backendUrl}/store/products?`
      let queryParams: string[] = []

      switch (method) {
        case 'text':
          const textParams = params as TextSearchParams
          // Use custom text search endpoint
          url = `${backendUrl}/store/omex-search/text?`
          queryParams.push(`q=${encodeURIComponent(textParams.query)}`)
          if (textParams.language) queryParams.push(`language=${textParams.language}`)
          if (textParams.fuzzy !== undefined) queryParams.push(`fuzzy=${textParams.fuzzy}`)
          break

        case 'part-number':
          const pnParams = params as PartNumberSearchParams
          // Use custom part number search endpoint
          url = `${backendUrl}/store/omex-search/part-number?`
          queryParams.push(`partNumber=${encodeURIComponent(pnParams.partNumber)}`)
          if (pnParams.includeAlternatives !== undefined) {
            queryParams.push(`includeAlternatives=${pnParams.includeAlternatives}`)
          }
          if (pnParams.exactMatch !== undefined) {
            queryParams.push(`exactMatch=${pnParams.exactMatch}`)
          }
          break

        case 'machine':
          const machineParams = params as MachineSearchParams
          // Use main omex-search endpoint for machine search
          url = `${backendUrl}/store/omex-search?`
          queryParams.push(`brand=${encodeURIComponent(machineParams.brand)}`)
          queryParams.push(`machineType=${encodeURIComponent(machineParams.machineType)}`)
          queryParams.push(`model=${encodeURIComponent(machineParams.model)}`)
          if (machineParams.series) queryParams.push(`series=${encodeURIComponent(machineParams.series)}`)
          if (machineParams.frame) queryParams.push(`frame=${encodeURIComponent(machineParams.frame)}`)
          if (machineParams.engine) queryParams.push(`engine=${encodeURIComponent(machineParams.engine)}`)
          break

        case 'filters':
          const filterParams = params as FilterSearchParams
          // Use filters endpoint
          url = `${backendUrl}/store/omex-search/filters`
          // POST request for filters
          const filterResponse = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(filterParams)
          })
          
          if (!filterResponse.ok) {
            throw new Error(`Filter search failed: ${filterResponse.statusText}`)
          }
          
          const filterData = await filterResponse.json()
          const filterResult: SearchResult = {
            products: filterData.products || [],
            total: filterData.total || 0,
            page: filterData.page || 1,
            limit: filterData.limit || 50,
            hasMore: filterData.hasMore || false,
            searchTime: filterData.searchTime || 0
          }
          
          setResults(filterResult.products)
          setSearchInfo({
            total: filterResult.total,
            page: filterResult.page,
            limit: filterResult.limit,
            hasMore: filterResult.hasMore,
          })
          
          return filterResult

        case 'visual':
          // Visual search nie jest jeszcze wspierany
          return {
            products: [],
            total: 0,
            page: 1,
            limit: 12,
            hasMore: false
          }

        default:
          // Fallback to standard search
          url = `${backendUrl}/store/products?`
          queryParams.push('limit=50')
      }

      url += queryParams.join('&')
      
      const response = await fetch(url, { headers })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }

      const data = await response.json()

      // Przekształć odpowiedź na SearchResult
      let searchResult: SearchResult

      if (method === 'part-number') {
        // Part number search returns { exact, alternatives, suggestions }
        searchResult = {
          exact: data.exact,
          alternatives: data.alternatives || [],
          products: data.alternatives || [],
          suggestions: data.suggestions || [],
          total: (data.alternatives || []).length,
          page: 1,
          limit: 20,
          hasMore: false,
          searchTime: 0
        }
      } else {
        // Other searches return { products, total, page, limit, hasMore }
        searchResult = {
          products: data.products || [],
          total: data.total || data.count || 0,
          page: data.page || 1,
          limit: data.limit || 50,
          hasMore: data.hasMore || false,
          parsedQuery: data.parsedQuery,
          searchTime: data.searchTime || 0
        }
      }

      // Update state
      setResults(searchResult.products)
      setSearchInfo({
        total: searchResult.total,
        page: searchResult.page,
        limit: searchResult.limit,
        hasMore: searchResult.hasMore,
      })

      return searchResult
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
      const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
      
      // Szukaj produktów przez standardowe API Medusa
      const response = await fetch(
        `${backendUrl}/store/products?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          headers: publishableKey ? {
            'x-publishable-api-key': publishableKey
          } : {}
        }
      )

      if (!response.ok) {
        throw new Error('Autocomplete failed')
      }

      const data = await response.json()
      
      // Przekształć produkty na sugestie
      const productSuggestions = (data.products || []).map((product: any) => ({
        text: product.title,
        type: 'product',
        count: 1,
        id: product.id
      }))
      
      setSuggestions(productSuggestions)
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
