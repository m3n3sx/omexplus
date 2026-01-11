'use client'

/**
 * PartNumberSearch Component - Search by OEM part number
 */

import { useState } from 'react'
import { useSearch, PartNumberSearchParams } from '@/hooks/useSearch'

interface PartNumberSearchProps {
  onSearch?: (results: any) => void
}

export default function PartNumberSearch({ onSearch }: PartNumberSearchProps) {
  const [partNumber, setPartNumber] = useState('')
  const [includeAlternatives, setIncludeAlternatives] = useState(true)
  const { search, loading, error } = useSearch()
  const [searchResults, setSearchResults] = useState<any>(null)

  const handleSearch = async () => {
    if (!partNumber.trim()) return

    try {
      const result = await search({
        method: 'part-number',
        params: {
          partNumber: partNumber.trim(),
          includeAlternatives,
          exactMatch: false,
        } as PartNumberSearchParams,
      })

      setSearchResults(result)
      if (onSearch) {
        onSearch(result)
      }
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Search Input */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
      }}>
        <input
          type="text"
          value={partNumber}
          onChange={(e) => setPartNumber(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz numer części (np. 320-8134)"
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '1rem',
            outline: 'none',
            backgroundColor: 'white',
            color: '#282828',
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !partNumber.trim()}
          className={`px-6 py-3 border-none rounded-xl font-semibold text-base ${
            loading || !partNumber.trim()
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-primary-500 text-white cursor-pointer shadow-md hover:bg-primary-600'
          }`}
        >
          {loading ? 'Szukam...' : 'Szukaj'}
        </button>
      </div>

      {/* Options */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary-700">
          <input
            type="checkbox"
            checked={includeAlternatives}
            onChange={(e) => setIncludeAlternatives(e.target.checked)}
            className="w-4 h-4 accent-primary-500"
          />
          Pokaż zamienniki
        </label>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#991b1b',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {searchResults && (
        <div>
          {/* Exact Match */}
          {searchResults.exact && (
            <div className="p-6 bg-primary-50 border-2 border-primary-500 rounded-2xl mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs text-primary-500 font-semibold mb-1">
                    ZNALEZIONO DOKŁADNE DOPASOWANIE
                  </div>
                  <h3 className="text-xl font-bold text-secondary-700 mb-2">
                    {searchResults.exact.name}
                  </h3>
                  <div className="text-sm text-secondary-500">
                    Numer: <strong className="text-secondary-700">{searchResults.exact.partNumber}</strong>
                  </div>
                  <div className="text-sm text-secondary-500">
                    Typ: <strong className="text-secondary-700">{searchResults.exact.type}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-secondary-700">
                    {searchResults.exact.price} PLN
                  </div>
                  <div className={`text-xs font-semibold mt-1 ${
                    searchResults.exact.availability === 'in-stock' ? 'text-green-600' : 'text-primary-500'
                  }`}>
                    {searchResults.exact.availability === 'in-stock' ? 'Na magazynie' : 'Zamówienie'}
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full py-3 px-6 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
                Dodaj do koszyka
              </button>
            </div>
          )}

          {/* Alternatives */}
          {searchResults.alternatives && searchResults.alternatives.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-secondary-700 mb-4">
                Zamienniki ({searchResults.alternatives.length})
              </h3>
              <div className="flex flex-col gap-4">
                {searchResults.alternatives.map((alt: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 border-2 border-neutral-200 rounded-2xl bg-white hover:border-primary-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-secondary-700 mb-2">
                          {alt.name}
                        </h4>
                        <div className="text-sm text-secondary-500 mb-1">
                          Numer: <strong className="text-secondary-700">{alt.partNumber}</strong>
                        </div>
                        <div className="text-sm text-secondary-500">
                          Typ: <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            alt.type === 'Premium' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-secondary-700'
                          }`}>
                            {alt.type}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary-600">
                          {alt.price} PLN
                        </div>
                        <div className={`text-xs font-semibold mt-1 ${
                          alt.availability === 'in-stock' ? 'text-green-600' : 'text-primary-500'
                        }`}>
                          {alt.availability === 'in-stock' ? 'Na magazynie' : 'Zamówienie'}
                        </div>
                        <button className="mt-2 px-4 py-2 border-2 border-primary-500 rounded-lg bg-white text-primary-500 font-semibold text-sm hover:bg-primary-50 transition-colors">
                          Dodaj
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {searchResults.suggestions && searchResults.suggestions.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm text-secondary-700 font-semibold mb-2">
                Podobne numery części:
              </h4>
              <div className="flex gap-2 flex-wrap">
                {searchResults.suggestions.map((suggestion: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setPartNumber(suggestion)}
                    className="px-4 py-2 border-2 border-primary-500 rounded-lg bg-white text-primary-500 font-semibold text-sm hover:bg-primary-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!searchResults.exact && (!searchResults.alternatives || searchResults.alternatives.length === 0) && (
            <div className="p-8 text-center bg-neutral-50 rounded-xl">
              <svg className="w-12 h-12 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="text-lg font-semibold text-secondary-700 mb-2">
                Nie znaleziono części
              </div>
              <div className="text-sm text-secondary-500">
                Spróbuj wyszukać inny numer lub skontaktuj się z nami
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
