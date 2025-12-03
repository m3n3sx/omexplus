'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SearchSuggestion {
  id: string
  title: string
  query: string
  type: 'product' | 'search'
  sku?: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query.length >= 2) {
      fetchSuggestions(query)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [query])

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/search/suggestions?q=${searchQuery}`)
      // const data = await response.json()
      
      // Mock data for now
      const mockSuggestions: SearchSuggestion[] = [
        {
          id: '1',
          title: 'Pompa hydrauliczna Rexroth A2FO',
          query: searchQuery,
          type: 'product',
          sku: 'HYD-001'
        },
        {
          id: '2',
          title: 'Filtr hydrauliczny Parker',
          query: searchQuery,
          type: 'product',
          sku: 'FIL-045'
        },
      ]
      
      setSuggestions(mockSuggestions)
      setIsOpen(true)
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const handleSearch = (searchQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSearch(suggestions[selectedIndex].query)
      } else {
        handleSearch(query)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <span className="absolute left-4 text-gray-400 text-xl pointer-events-none" aria-hidden="true">
          🔍
        </span>
        <input
          ref={inputRef}
          type="search"
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder="Szukaj produktów, SKU, numerów producenta..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          aria-label="Szukaj produktów"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={isOpen}
        />
        {query && (
          <button
            className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => {
              setQuery('')
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            aria-label="Wyczyść wyszukiwanie"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div 
          id="search-suggestions"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left border-b last:border-b-0 transition-colors ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleSearch(suggestion.query)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <span className="text-xl flex-shrink-0" aria-hidden="true">
                {suggestion.type === 'product' ? '📦' : '🔍'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {suggestion.title}
                </div>
                {suggestion.sku && (
                  <div className="text-xs font-mono text-gray-600">
                    SKU: {suggestion.sku}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
