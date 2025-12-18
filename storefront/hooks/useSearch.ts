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
          if (!machineParams || !machineParams.brand) {
            // If no machine params, return empty result
            return {
              products: [],
              total: 0,
              page: 1,
              limit: 20,
              hasMore: false
            }
          }
          // Use machines search endpoint
          url = `${backendUrl}/store/omex-search/machines?`
          queryParams.push(`manufacturer=${encodeURIComponent(machineParams.brand)}`)
          if (machineParams.model) queryParams.push(`model=${encodeURIComponent(machineParams.model)}`)
          if (machineParams.engine) queryParams.push(`q=${encodeURIComponent(machineParams.engine)}`)
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
          
          setResults(filterResult.products || [])
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
      setResults(searchResult.products || [])
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
    setResults, // Export for external use (e.g., loading from chat)
  }
}

// Autocomplete hook - searches both products and machines
export function useAutocomplete() {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [machineSuggestions, setMachineSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const getSuggestions = useCallback(async (query: string, limit: number = 10) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      setMachineSuggestions([])
      return
    }

    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
      
      const headers: Record<string, string> = {}
      if (publishableKey) {
        headers['x-publishable-api-key'] = publishableKey
      }

      // Fetch products and machines in parallel
      const [productsResponse, machinesResponse] = await Promise.all([
        fetch(
          `${backendUrl}/store/products?q=${encodeURIComponent(query)}&limit=${limit}`,
          { headers }
        ),
        fetch(
          `${backendUrl}/store/omex-search/machines/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`,
          { headers }
        )
      ])

      // Process products
      let productSuggestions: any[] = []
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        productSuggestions = (productsData.products || []).map((product: any) => ({
          text: product.title,
          type: 'product',
          count: 1,
          id: product.id,
          icon: '📦'
        }))
      }

      // Process machines
      let machineSuggs: any[] = []
      if (machinesResponse.ok) {
        const machinesData = await machinesResponse.json()
        machineSuggs = machinesData.suggestions || []
      }

      // Combine: machines first (more specific), then products
      const combined = [
        ...machineSuggs.slice(0, 6),
        ...productSuggestions.slice(0, limit - Math.min(machineSuggs.length, 6))
      ].slice(0, limit)
      
      setSuggestions(combined)
      setMachineSuggestions(machineSuggs)
    } catch (err) {
      console.error('Autocomplete error:', err)
      setSuggestions([])
      setMachineSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setSuggestions([])
    setMachineSuggestions([])
  }, [])

  return {
    suggestions,
    machineSuggestions,
    loading,
    getSuggestions,
    clear,
  }
}
