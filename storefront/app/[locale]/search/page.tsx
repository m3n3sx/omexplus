'use client'

/**
 * Search Page - Main search interface with all 5 search methods
 * Full implementation combining all search components
 */

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSearch, FilterSearchParams } from '@/hooks/useSearch'
import EnhancedSearchBar from '@/components/search/EnhancedSearchBar'
import MachineSelector from '@/components/search/MachineSelector'
import PartNumberSearch from '@/components/search/PartNumberSearch'
import VisualSearch from '@/components/search/VisualSearch'
import AdvancedFilters from '@/components/search/AdvancedFilters'
import SearchResults from '@/components/search/SearchResults'

type SearchMethod = 'text' | 'machine' | 'part-number' | 'visual' | 'filters'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get('q') || ''
  
  const [activeMethod, setActiveMethod] = useState<SearchMethod>('text')
  const [showMachineSelector, setShowMachineSelector] = useState(false)
  const [filters, setFilters] = useState<FilterSearchParams>({})
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const { results, loading, error, searchInfo, search } = useSearch()
  const displayResults = results || []

  // Initial search if query parameter exists
  useEffect(() => {
    if (initialQuery) {
      handleTextSearch(initialQuery)
    }
  }, [initialQuery])

  const handleTextSearch = async (query: string) => {
    setActiveMethod('text')
    try {
      await search({
        method: 'text',
        params: {
          query,
          language: 'pl',
          fuzzy: true,
        },
      })
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  const handleMachineSearch = async (machineParams: any) => {
    setActiveMethod('machine')
    setShowMachineSelector(false)
    try {
      await search({
        method: 'machine',
        params: machineParams,
      })
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  const handleFilterSearch = async () => {
    setActiveMethod('filters')
    try {
      await search({
        method: 'filters',
        params: filters,
      })
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    // In real implementation, fetch new page
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}>
            Wyszukiwarka części OMEX
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
          }}>
            5 zaawansowanych metod wyszukiwania
          </p>
        </div>

        {/* Search Methods Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          padding: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <button
            onClick={() => setActiveMethod('text')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeMethod === 'text' ? '#3b82f6' : 'transparent',
              color: activeMethod === 'text' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            💬 Wyszukiwanie tekstowe
          </button>
          <button
            onClick={() => {
              setActiveMethod('machine')
              setShowMachineSelector(true)
            }}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeMethod === 'machine' ? '#3b82f6' : 'transparent',
              color: activeMethod === 'machine' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            🚜 Po maszynie
          </button>
          <button
            onClick={() => setActiveMethod('part-number')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeMethod === 'part-number' ? '#3b82f6' : 'transparent',
              color: activeMethod === 'part-number' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            🔢 Po numerze części
          </button>
          <button
            onClick={() => setActiveMethod('visual')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeMethod === 'visual' ? '#3b82f6' : 'transparent',
              color: activeMethod === 'visual' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            📸 Po zdjęciu
          </button>
          <button
            onClick={() => setActiveMethod('filters')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeMethod === 'filters' ? '#3b82f6' : 'transparent',
              color: activeMethod === 'filters' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            🎛️ Zaawansowane filtry
          </button>
        </div>

        {/* Search Interface */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          {/* Text Search */}
          {activeMethod === 'text' && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}>
                Wyszukiwanie tekstowe
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '1.5rem',
              }}>
                Wpisz nazwę części, numer OEM, markę lub model maszyny
              </p>
              <EnhancedSearchBar
                onSearch={handleTextSearch}
                placeholder="np. pompa hydrauliczna cat 320d, filtr oleju, 320-8134..."
              />
            </div>
          )}

          {/* Machine Search */}
          {activeMethod === 'machine' && (
            <div>
              {showMachineSelector ? (
                <MachineSelector
                  onComplete={handleMachineSearch}
                  onCancel={() => {
                    setShowMachineSelector(false)
                    setActiveMethod('text')
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <button
                    onClick={() => setShowMachineSelector(true)}
                    style={{
                      padding: '1rem 2rem',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                    }}
                  >
                    Rozpocznij wyszukiwanie po maszynie
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Part Number Search */}
          {activeMethod === 'part-number' && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}>
                Wyszukiwanie po numerze części
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '1.5rem',
              }}>
                Wpisz numer OEM, SKU lub EAN
              </p>
              <PartNumberSearch />
            </div>
          )}

          {/* Visual Search */}
          {activeMethod === 'visual' && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}>
                Wyszukiwanie po zdjęciu
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '1.5rem',
              }}>
                Prześlij zdjęcie części aby znaleźć podobne produkty lub odczytać numery
              </p>
              <VisualSearch />
            </div>
          )}

          {/* Advanced Filters */}
          {activeMethod === 'filters' && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}>
                Zaawansowane filtry
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '1.5rem',
              }}>
                Użyj filtrów aby precyzyjnie zawęzić wyniki
              </p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <AdvancedFilters
                  onFilterChange={setFilters}
                  onApply={handleFilterSearch}
                />
                <div style={{ flex: 1 }}>
                  {displayResults.length > 0 ? (
                    <SearchResults
                      products={displayResults}
                      total={searchInfo?.total || displayResults.length}
                      page={page}
                      limit={12}
                      hasMore={searchInfo?.hasMore || false}
                      loading={loading}
                      viewMode={viewMode}
                      onPageChange={handlePageChange}
                      onViewModeChange={setViewMode}
                    />
                  ) : (
                    <div style={{
                      padding: '3rem 2rem',
                      textAlign: 'center',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎛️</div>
                      <p style={{ fontSize: '1rem', color: '#6b7280' }}>
                        Wybierz filtry i kliknij &quot;Zastosuj filtry&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section (for text, machine, part-number, visual methods) */}
        {activeMethod !== 'filters' && displayResults.length > 0 && (
          <div>
            <SearchResults
              products={displayResults}
              total={searchInfo?.total || displayResults.length}
              page={page}
              limit={12}
              hasMore={searchInfo?.hasMore || false}
              loading={loading}
              viewMode={viewMode}
              onPageChange={handlePageChange}
              onViewModeChange={setViewMode}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#991b1b',
            marginTop: '1rem',
          }}>
            {error}
          </div>
        )}

        {/* Search Info */}
        {searchInfo && searchInfo.parsedQuery && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#eff6ff',
            border: '1px solid #93c5fd',
            borderRadius: '8px',
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Wykryte parametry wyszukiwania:
            </h4>
            <div style={{ fontSize: '0.75rem', color: '#1e40af' }}>
              {searchInfo.parsedQuery.brands && searchInfo.parsedQuery.brands.length > 0 && (
                <div>Marki: <strong>{searchInfo.parsedQuery.brands.join(', ')}</strong></div>
              )}
              {searchInfo.parsedQuery.models && searchInfo.parsedQuery.models.length > 0 && (
                <div>Modele: <strong>{searchInfo.parsedQuery.models.join(', ')}</strong></div>
              )}
              {searchInfo.parsedQuery.partTypes && searchInfo.parsedQuery.partTypes.length > 0 && (
                <div>Typy części: <strong>{searchInfo.parsedQuery.partTypes.join(', ')}</strong></div>
              )}
              {searchInfo.parsedQuery.oemNumbers && searchInfo.parsedQuery.oemNumbers.length > 0 && (
                <div>Numery OEM: <strong>{searchInfo.parsedQuery.oemNumbers.join(', ')}</strong></div>
              )}
            </div>
            {searchInfo.searchTime && (
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Czas wyszukiwania: {searchInfo.searchTime}ms
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
