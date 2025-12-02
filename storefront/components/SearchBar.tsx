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
    <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: '500px', margin: '0 2rem' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            style={{
              width: '100%',
              padding: '0.75rem 3rem 0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true)
            }}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              padding: '0.25rem 0.5rem'
            }}
          >
            🔍
          </button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 50
        }}>
          {loading ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
              {t('common.loading')}...
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.id}`}
                  onClick={handleResultClick}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.375rem' }}
                        />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>📦</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {product.title}
                      </h4>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {product.description}
                      </p>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6', marginTop: '0.25rem' }}>
                        {product.variants?.[0]?.prices?.[0]?.amount
                          ? `${(product.variants[0].prices[0].amount / 100).toFixed(2)} PLN`
                          : t('common.price')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link href={`/${locale}/products?q=${encodeURIComponent(query)}`} onClick={handleResultClick}>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'center',
                    color: '#3b82f6',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  {t('search.results')} "{query}" →
                </div>
              </Link>
            </>
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
              {t('search.noResults')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
