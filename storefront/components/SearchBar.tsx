'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

type SearchResult = {
  id: string
  title: string
  description: string
  thumbnail?: string
  variants?: Array<{
    prices?: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

export default function SearchBar() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        searchProducts(query)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

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

  const searchProducts = async (searchQuery: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/store/products?q=${encodeURIComponent(searchQuery)}&limit=5`)
      const data = await response.json()
      setResults(data.products || [])
      setIsOpen(true)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${locale}/products?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className="relative flex-1 max-w-[500px] mx-8">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full px-5 pr-12 py-3 bg-white border border-neutral-200 rounded-full text-sm text-secondary-700 placeholder-secondary-500 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            onFocus={() => {
              if (results.length > 0) setIsOpen(true)
            }}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 border-none cursor-pointer text-lg p-2 text-white hover:bg-secondary-700 transition-colors rounded-full w-9 h-9 flex items-center justify-center"
          >
            🔍
          </button>
        </div>
      </form>

      {/* Search Suggestions Dropdown - Induxter light theme */}
      {isOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-[400px] overflow-y-auto z-50">
          {/* Orange accent line - Induxter style */}
          <div className="h-1 bg-primary-500 rounded-t-lg"></div>
          
          {loading ? (
            <div className="p-4 text-center text-secondary-500">
              {t('common.loading')}...
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.id}`}
                  onClick={handleResultClick}
                  className="flex gap-4 p-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer group"
                >
                  <div className="w-[60px] h-[60px] bg-neutral-50 border border-neutral-200 rounded flex items-center justify-center flex-shrink-0 group-hover:border-primary-500 transition-colors">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold mb-1 text-secondary-700 group-hover:text-primary-500 transition-colors truncate font-heading">
                      {product.title}
                    </h4>
                    <p className="text-xs text-secondary-500 truncate">
                      {product.description}
                    </p>
                    <div className="text-sm font-bold text-primary-500 mt-1">
                      {product.variants?.[0]?.prices?.[0]?.amount
                        ? `${(product.variants[0].prices[0].amount / 100).toFixed(2)} PLN`
                        : t('common.price')}
                    </div>
                  </div>
                </Link>
              ))}
              <Link 
                href={`/${locale}/products?q=${encodeURIComponent(query)}`} 
                onClick={handleResultClick}
                className="block p-3 text-center text-primary-500 text-sm font-bold hover:bg-neutral-50 transition-colors cursor-pointer uppercase tracking-wide"
              >
                {t('search.results')} "{query}" →
              </Link>
            </>
          ) : (
            <div className="p-4 text-center text-secondary-500">
              {t('search.noResults')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
