'use client'

/**
 * EnhancedSearchBar Component - Advanced search with autocomplete suggestions
 * Full implementation with search history, popular searches, category suggestions
 */

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAutocomplete } from '@/hooks/useSearch'

interface EnhancedSearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  showHistory?: boolean
  showPopular?: boolean
  locale?: string
}

export default function EnhancedSearchBar({
  onSearch,
  placeholder = 'Szukaj części (np. pompa hydrauliczna, 320-8134)...',
  showHistory = true,
  showPopular = true,
  locale = 'pl',
}: EnhancedSearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [popularSearches] = useState<string[]>([
    'CAT 320D',
    'Komatsu PC200',
    'Hitachi ZX210',
    'pompa hydrauliczna',
    'filtr oleju',
  ])
  const searchRef = useRef<HTMLDivElement>(null)
  const { suggestions, loading, getSuggestions, clear } = useAutocomplete()

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  const [aiAnalysis, setAiAnalysis] = useState<{
    brand?: string
    model?: string
    partType?: string
    suggestions: string[]
    refinedQuery?: string
  } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  // Debounce autocomplete and AI analysis
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        getSuggestions(query, 10)
        setIsOpen(true)
        
        // AI analysis for longer queries
        if (query.length >= 4) {
          setAiLoading(true)
          try {
            const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
            const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
            
            const response = await fetch(`${backendUrl}/store/omex-search/ai-analyze`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(publishableKey ? { 'x-publishable-api-key': publishableKey } : {})
              },
              body: JSON.stringify({ query, language: locale })
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.analysis) {
                setAiAnalysis({
                  brand: data.analysis.brand,
                  model: data.analysis.model,
                  partType: data.analysis.partType,
                  suggestions: data.analysis.suggestions || [],
                  refinedQuery: data.analysis.refinedQuery
                })
              }
            }
          } catch (err) {
            console.error('AI analysis failed:', err)
          } finally {
            setAiLoading(false)
          }
        }
      } else {
        clear()
        setAiAnalysis(null)
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, getSuggestions, clear, locale])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const saveToHistory = (searchQuery: string) => {
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveToHistory(query.trim())
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`)
      }
      setIsOpen(false)
    }
  }

  const handleSuggestionClick = (text: string) => {
    setQuery(text)
    saveToHistory(text)
    if (onSearch) {
      onSearch(text)
    } else {
      router.push(`/${locale}/search?q=${encodeURIComponent(text)}`)
    }
    setIsOpen(false)
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  const getSuggestionIcon = (type: string) => {
    const icons: Record<string, string> = {
      'product': '📦',
      'category': '📁',
      'brand': '🏷️',
      'model': '🔧',
      'part-number': '🔢',
      'machine': '🚜',
      'manufacturer': '🏭',
      'serial': '🔢',
      'engine': '⚙️',
    }
    return icons[type] || '🔍'
  }

  const getSuggestionLabel = (type: string) => {
    const labels: Record<string, string> = {
      'product': 'Produkt',
      'category': 'Kategoria',
      'brand': 'Marka',
      'model': 'Model',
      'part-number': 'Numer',
      'machine': 'Maszyna',
      'manufacturer': 'Producent',
      'serial': 'Nr seryjny',
      'engine': 'Silnik',
    }
    return labels[type] || 'Inne'
  }

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-6 py-4 pr-28 border-2 border-neutral-200 rounded-full text-sm font-bold outline-none transition-all duration-300 bg-white text-secondary-700 hover:border-primary-500 focus:border-primary-500 focus:shadow-lg placeholder:text-neutral-400 placeholder:font-normal"
            onFocus={() => setIsOpen(true)}
          />
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                clear()
              }}
              className="absolute right-24 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-xl p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              ✕
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 border-none rounded-full cursor-pointer px-6 py-3 text-white shadow-md hover:bg-primary-600 hover:shadow-lg transition-all duration-300 font-bold text-sm uppercase tracking-wider"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-[calc(100%+0.75rem)] left-0 right-0 bg-white rounded-3xl shadow-xl max-h-[500px] overflow-y-auto z-50 border border-neutral-200">
          {/* AI Analysis Badge */}
          {aiAnalysis && (aiAnalysis.brand || aiAnalysis.model || aiAnalysis.partType) && (
            <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-neutral-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI wykryło:
                </span>
                {aiAnalysis.brand && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    {aiAnalysis.brand}
                  </span>
                )}
                {aiAnalysis.model && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    {aiAnalysis.model}
                  </span>
                )}
                {aiAnalysis.partType && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                    {aiAnalysis.partType}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {aiAnalysis && aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
            <div>
              <div className="px-6 py-3 text-xs font-bold text-purple-600 uppercase tracking-wider border-b border-neutral-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Sugestie AI
              </div>
              {aiAnalysis.suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={`ai-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-4 px-6 py-4 border-none bg-gradient-to-r from-white to-purple-50 cursor-pointer text-left transition-all duration-300 hover:from-purple-50 hover:to-purple-100 border-b border-neutral-100 last:border-b-0"
                >
                  <span className="px-3 py-1.5 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">
                    AI
                  </span>
                  <span className="text-sm font-bold text-secondary-800">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {(loading || aiLoading) && (
            <div className="p-6 text-center text-secondary-600 text-sm font-bold flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {aiLoading ? 'Analizuję z AI...' : 'Szukam...'}
            </div>
          )}

          {/* Suggestions */}
          {!loading && suggestions.length > 0 && (
            <div>
              <div className="px-6 py-4 text-xs font-bold text-secondary-600 uppercase tracking-wider border-b border-neutral-200">
                Sugestie
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(
                    suggestion.type === 'machine' || suggestion.type === 'serial' 
                      ? suggestion.model || suggestion.text 
                      : suggestion.text
                  )}
                  className="w-full flex items-center gap-4 px-6 py-4 border-none bg-white cursor-pointer text-left transition-all duration-300 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0"
                >
                  <span className="text-2xl">
                    {suggestion.icon || getSuggestionIcon(suggestion.type)}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-secondary-800">
                      {suggestion.text}
                    </div>
                    {/* Machine details */}
                    {(suggestion.type === 'machine' || suggestion.type === 'serial') && (
                      <div className="text-xs text-secondary-600 mt-0.5 flex flex-wrap gap-2">
                        {suggestion.weight && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            ⚖️ {suggestion.weight}
                          </span>
                        )}
                        {suggestion.years && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                            📅 {suggestion.years}
                          </span>
                        )}
                        {suggestion.engine && (
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">
                            ⚙️ {suggestion.engine}
                          </span>
                        )}
                        {suggestion.serialRange && (
                          <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded">
                            🔢 {suggestion.serialRange}
                          </span>
                        )}
                      </div>
                    )}
                    {/* Count for manufacturers/engines */}
                    {suggestion.count !== undefined && suggestion.count > 1 && (
                      <div className="text-xs text-secondary-600 font-bold mt-0.5">
                        {suggestion.count} {suggestion.count === 1 ? 'model' : 'modeli'}
                      </div>
                    )}
                  </div>
                  <span className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-full text-xs text-secondary-700 font-bold">
                    {getSuggestionLabel(suggestion.type)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Search History */}
          {!loading && query.length === 0 && showHistory && searchHistory.length > 0 && (
            <div>
              <div className="px-6 py-4 text-xs font-bold text-secondary-600 uppercase tracking-wider border-b border-neutral-200 flex justify-between items-center">
                <span>Historia wyszukiwań</span>
                <button
                  onClick={clearHistory}
                  className="bg-none border-none text-red-600 cursor-pointer text-xs font-bold hover:text-red-700 transition-colors"
                >
                  Wyczyść
                </button>
              </div>
              {searchHistory.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full flex items-center gap-4 px-6 py-4 border-none bg-white cursor-pointer text-left transition-all duration-300 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0"
                >
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold text-secondary-800">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {!loading && query.length === 0 && showPopular && popularSearches.length > 0 && (
            <div>
              <div className={`px-6 py-4 text-xs font-bold text-secondary-600 uppercase tracking-wider border-b border-neutral-200 ${searchHistory.length > 0 ? 'border-t border-neutral-200' : ''}`}>
                Popularne wyszukiwania
              </div>
              {popularSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full flex items-center gap-4 px-6 py-4 border-none bg-white cursor-pointer text-left transition-all duration-300 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0"
                >
                  <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-sm font-bold text-secondary-800">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && query.length >= 2 && suggestions.length === 0 && (
            <div className="p-8 text-center text-secondary-600">
              <svg className="w-12 h-12 mx-auto mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="text-sm font-bold text-secondary-800">
                Brak sugestii dla "{query}"
              </div>
              <div className="text-xs font-bold text-secondary-600 mt-2">
                Naciśnij Enter aby wyszukać
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
