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
    'pompa hydrauliczna',
    'filtr oleju',
    'gąsienice gumowe',
    'cylinder hydrauliczny',
    'silnik perkins',
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

  // Debounce autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        getSuggestions(query, 10)
        setIsOpen(true)
      } else {
        clear()
        // Don't auto-open on empty query - only open when user focuses
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, getSuggestions, clear])

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
      'product': 'PRD',
      'category': 'CAT',
      'brand': 'BRD',
      'model': 'MDL',
      'part-number': 'SKU',
    }
    return icons[type] || 'ALL'
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
            className="w-full px-6 py-4 pr-28 border-2 border-neutral-200 rounded-full text-sm font-bold outline-none transition-all duration-300 bg-white hover:border-primary-500 focus:border-primary-500 focus:shadow-lg placeholder:text-neutral-400 placeholder:font-normal"
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
          {/* Loading State */}
          {loading && (
            <div className="p-6 text-center text-secondary-600 text-sm font-bold">
              Szukam...
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
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full flex items-center gap-4 px-6 py-4 border-none bg-white cursor-pointer text-left transition-all duration-300 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0"
                >
                  <span className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {getSuggestionIcon(suggestion.type)}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-secondary-800">
                      {suggestion.text}
                    </div>
                    {suggestion.count !== undefined && (
                      <div className="text-xs text-secondary-600 font-bold mt-0.5">
                        {suggestion.count} {suggestion.count === 1 ? 'wynik' : 'wyników'}
                      </div>
                    )}
                  </div>
                  <span className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-full text-xs text-secondary-700 font-bold uppercase tracking-wider">
                    {suggestion.type === 'product' ? 'Produkt' :
                     suggestion.type === 'category' ? 'Kategoria' :
                     suggestion.type === 'brand' ? 'Marka' :
                     suggestion.type === 'model' ? 'Model' :
                     suggestion.type === 'part-number' ? 'Numer' : 'Inne'}
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
