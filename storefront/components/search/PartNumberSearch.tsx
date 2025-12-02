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
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !partNumber.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: loading || !partNumber.trim() ? '#e5e7eb' : '#3b82f6',
            color: 'white',
            cursor: loading || !partNumber.trim() ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          {loading ? 'Szukam...' : 'Szukaj'}
        </button>
      </div>

      {/* Options */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}>
          <input
            type="checkbox"
            checked={includeAlternatives}
            onChange={(e) => setIncludeAlternatives(e.target.checked)}
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
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '8px',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '0.5rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600', marginBottom: '0.25rem' }}>
                    ZNALEZIONO DOKŁADNE DOPASOWANIE
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {searchResults.exact.name}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Numer: <strong>{searchResults.exact.partNumber}</strong>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Typ: <strong>{searchResults.exact.type}</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                    {searchResults.exact.price} PLN
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: searchResults.exact.availability === 'in-stock' ? '#16a34a' : '#f59e0b',
                    fontWeight: '600',
                    marginTop: '0.25rem',
                  }}>
                    {searchResults.exact.availability === 'in-stock' ? 'Na magazynie' : 'Zamówienie'}
                  </div>
                </div>
              </div>
              <button
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  width: '100%',
                }}
              >
                Dodaj do koszyka
              </button>
            </div>
          )}

          {/* Alternatives */}
          {searchResults.alternatives && searchResults.alternatives.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Zamienniki ({searchResults.alternatives.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {searchResults.alternatives.map((alt: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          {alt.name}
                        </h4>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          Numer: <strong>{alt.partNumber}</strong>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Typ: <span style={{
                            padding: '0.125rem 0.5rem',
                            backgroundColor: alt.type === 'Premium' ? '#dbeafe' : '#fef3c7',
                            color: alt.type === 'Premium' ? '#1e40af' : '#92400e',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}>
                            {alt.type}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                          {alt.price} PLN
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: alt.availability === 'in-stock' ? '#16a34a' : '#f59e0b',
                          marginTop: '0.25rem',
                        }}>
                          {alt.availability === 'in-stock' ? 'Na magazynie' : 'Zamówienie'}
                        </div>
                        <button
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem 1rem',
                            border: '1px solid #3b82f6',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                          }}
                        >
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
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Podobne numery części:
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {searchResults.suggestions.map((suggestion: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setPartNumber(suggestion)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!searchResults.exact && (!searchResults.alternatives || searchResults.alternatives.length === 0) && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
            }}>
              <svg style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: '#d1d5db' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Nie znaleziono części
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                Spróbuj wyszukać inny numer lub skontaktuj się z nami
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
