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
        if (query.length === 0 && (showHistory || showPopular)) {
          setIsOpen(true)
        } else {
          setIsOpen(false)
        }
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, getSuggestions, clear, showHistory, showPopular])

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
    <div ref={searchRef} style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '1rem 3.5rem 1rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.currentTarget) {
                e.currentTarget.style.borderColor = '#e5e7eb'
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                clear()
              }}
              style={{
                position: 'absolute',
                right: '3rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.25rem',
                padding: '0.25rem',
                color: '#6b7280',
              }}
            >
              ✕
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              padding: '0.5rem 0.75rem',
              color: 'white',
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          maxHeight: '500px',
          overflowY: 'auto',
          zIndex: 50,
          border: '1px solid #e5e7eb',
        }}>
          {/* Loading State */}
          {loading && (
            <div style={{
              padding: '1rem',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.875rem',
            }}>
              Szukam...
            </div>
          )}

          {/* Suggestions */}
          {!loading && suggestions.length > 0 && (
            <div>
              <div style={{
                padding: '0.75rem 1rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid #f3f4f6',
              }}>
                Sugestie
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono font-bold">
                    {getSuggestionIcon(suggestion.type)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {suggestion.text}
                    </div>
                    {suggestion.count !== undefined && (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {suggestion.count} {suggestion.count === 1 ? 'wynik' : 'wyników'}
                      </div>
                    )}
                  </div>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    textTransform: 'capitalize',
                  }}>
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
              <div style={{
                padding: '0.75rem 1rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span>Historia wyszukiwań</span>
                <button
                  onClick={clearHistory}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textTransform: 'none',
                  }}
                >
                  Wyczyść
                </button>
              </div>
              {searchHistory.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderBottom: index < Math.min(searchHistory.length, 5) - 1 ? '1px solid #f3f4f6' : 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  <svg style={{ width: '16px', height: '16px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{ fontSize: '0.875rem' }}>{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {!loading && query.length === 0 && showPopular && popularSearches.length > 0 && (
            <div>
              <div style={{
                padding: '0.75rem 1rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid #f3f4f6',
                borderTop: searchHistory.length > 0 ? '1px solid #f3f4f6' : 'none',
              }}>
                Popularne wyszukiwania
              </div>
              {popularSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderBottom: index < popularSearches.length - 1 ? '1px solid #f3f4f6' : 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  <svg style={{ width: '16px', height: '16px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span style={{ fontSize: '0.875rem' }}>{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && query.length >= 2 && suggestions.length === 0 && (
            <div style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <svg style={{ width: '48px', height: '48px', margin: '0 auto 0.5rem', color: '#d1d5db' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div style={{ fontSize: '0.875rem' }}>
                Brak sugestii dla "{query}"
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Naciśnij Enter aby wyszukać
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
