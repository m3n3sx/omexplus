'use client'

/**
 * Search Page - Main search interface with all 5 search methods
 * Full implementation combining all search components
 */

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useSearch, FilterSearchParams } from '@/hooks/useSearch'
import UnifiedSearchHub from '@/components/search/UnifiedSearchHub'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'

type SearchMethod = 'text' | 'machine' | 'part-number' | 'visual' | 'filters'

const CHAT_SEARCH_RESULTS_KEY = "omex_chat_search_results"
const CHAT_SEARCH_CONTEXT_KEY = "omex_chat_search_context"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations('templates.search')
  const initialQuery = searchParams?.get('q') || ''
  const initialMethod = (searchParams?.get('method') as SearchMethod) || 'text'
  const fromChat = searchParams?.get('from') === 'chat'
  
  const { results, loading, error, searchInfo, search, setResults } = useSearch()
  const [chatContext, setChatContext] = useState<{ brand?: string; model?: string; category?: string } | null>(null)
  
  // Deduplicate results by id
  const displayResults = (results || []).filter((product: any, index: number, self: any[]) => 
    index === self.findIndex((p) => p.id === product.id)
  )

  // Load chat results from sessionStorage if coming from chat
  useEffect(() => {
    if (fromChat) {
      try {
        const savedResults = sessionStorage.getItem(CHAT_SEARCH_RESULTS_KEY)
        const savedContext = sessionStorage.getItem(CHAT_SEARCH_CONTEXT_KEY)
        
        if (savedResults) {
          const parsedResults = JSON.parse(savedResults)
          if (parsedResults.length > 0) {
            setResults(parsedResults)
          }
          // Clear after loading
          sessionStorage.removeItem(CHAT_SEARCH_RESULTS_KEY)
        }
        
        if (savedContext) {
          setChatContext(JSON.parse(savedContext))
          sessionStorage.removeItem(CHAT_SEARCH_CONTEXT_KEY)
        }
      } catch (e) {
        console.error('Error loading chat search results:', e)
      }
    }
  }, [fromChat, setResults])

  // Initial search if query parameter exists (and not from chat with results)
  // Only for text search - machine search requires params
  useEffect(() => {
    if (initialQuery && initialMethod === 'text' && !(fromChat && displayResults.length > 0)) {
      handleSearch(initialQuery, initialMethod)
    }
  }, [initialQuery, initialMethod])

  const handleSearch = async (query: string, method: SearchMethod, params?: any) => {
    try {
      if (method === 'text') {
        await search({
          method: 'text',
          params: {
            query,
            language: locale as 'pl' | 'en' | 'de' | 'uk',
            fuzzy: true,
          },
        })
      } else if (method === 'machine') {
        await search({
          method: 'machine',
          params,
        })
      } else if (method === 'part-number') {
        await search({
          method: 'part-number',
          params,
        })
      } else if (method === 'filters') {
        await search({
          method: 'filters',
          params,
        })
      }
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section with Search */}
      <div className="bg-neutral-800 text-white">
        <div className="container mx-auto px-4 lg:px-12 py-16 lg:py-24 max-w-[1400px]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {t('resultsFor').replace(':', '')}
          </h1>
          {initialQuery && (
            <p className="text-xl text-neutral-300 mb-8">
              {t('resultsFor')} <span className="text-secondary-500 font-bold">&quot;{initialQuery}&quot;</span>
            </p>
          )}
          {/* Chat context info */}
          {chatContext && (chatContext.brand || chatContext.model || chatContext.category) && (
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-xl p-4 mb-8">
              <p className="text-sm text-blue-200 flex items-center gap-2">
                <span>💬</span>
                <span>Wyniki z czatu:</span>
                {chatContext.brand && <span className="bg-blue-500/30 px-2 py-0.5 rounded">{chatContext.brand}</span>}
                {chatContext.model && <span className="bg-blue-500/30 px-2 py-0.5 rounded">{chatContext.model}</span>}
                {chatContext.category && <span className="bg-blue-500/30 px-2 py-0.5 rounded">{chatContext.category}</span>}
              </p>
            </div>
          )}

          {/* Search Hub */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <UnifiedSearchHub onSearch={handleSearch} locale={locale} />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 lg:px-12 py-12 lg:py-16 max-w-[1400px]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-neutral-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-secondary-800 font-bold text-lg">{t('searchingProducts')}</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">{t('errorOccurred')}</h3>
            <p className="text-neutral-600">{error}</p>
          </div>
        ) : displayResults.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                {t('foundProducts')} {searchInfo?.total || displayResults.length} {(searchInfo?.total || displayResults.length) === 1 ? t('product') : t('products')}
              </h2>
              {searchInfo?.searchTime && (
                <p className="text-neutral-600">
                  {t('searchTime')} {searchInfo.searchTime}ms
                </p>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {displayResults.map((product: any) => (
                <ProductCardTemplate key={product.id} product={product} />
              ))}
            </div>

            {/* Search Info */}
            {searchInfo?.parsedQuery && (
              <div className="mt-12 bg-primary-50 rounded-2xl p-6 border border-primary-200">
                <h4 className="text-sm font-bold text-primary-900 mb-3">
                  {t('detectedParameters')}
                </h4>
                <div className="text-sm text-primary-700 space-y-1">
                  {searchInfo.parsedQuery.brands && searchInfo.parsedQuery.brands.length > 0 && (
                    <div>{t('brands')} <strong>{searchInfo.parsedQuery.brands.join(', ')}</strong></div>
                  )}
                  {searchInfo.parsedQuery.models && searchInfo.parsedQuery.models.length > 0 && (
                    <div>{t('models')} <strong>{searchInfo.parsedQuery.models.join(', ')}</strong></div>
                  )}
                  {searchInfo.parsedQuery.partTypes && searchInfo.parsedQuery.partTypes.length > 0 && (
                    <div>{t('partTypes')} <strong>{searchInfo.parsedQuery.partTypes.join(', ')}</strong></div>
                  )}
                  {searchInfo.parsedQuery.oemNumbers && searchInfo.parsedQuery.oemNumbers.length > 0 && (
                    <div>{t('oemNumbers')} <strong>{searchInfo.parsedQuery.oemNumbers.join(', ')}</strong></div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">{t('noResultsFound')}</h3>
            <p className="text-neutral-600 mb-6">
              {t('tryDifferentCriteria')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
