'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import UnifiedSearchHub from '@/components/search/UnifiedSearchHub'
import SearchResults from '@/components/search/SearchResults'
import { useSearch } from '@/hooks/useSearch'

type SearchMethod = 'text' | 'machine' | 'part-number' | 'visual' | 'filters'

export default function HomePage() {
  const searchParams = useSearchParams()
  const urlSearchQuery = searchParams.get('search')
  
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMethod, setSearchMethod] = useState<SearchMethod>('text')
  const { results, loading: searchLoading, search } = useSearch()

  const handleSearch = (query: string, method: SearchMethod, params?: any) => {
    setSearchQuery(query)
    setSearchMethod(method)
    
    // Map search method to API method
    const methodMap: Record<SearchMethod, any> = {
      'text': {
        method: 'text',
        params: { query, language: 'pl', fuzzy: true }
      },
      'machine': {
        method: 'machine',
        params: params || {}
      },
      'part-number': {
        method: 'part-number',
        params: { partNumber: query, includeAlternatives: true, ...params }
      },
      'visual': {
        method: 'visual',
        params: params || {}
      },
      'filters': {
        method: 'filters',
        params: params || {}
      }
    }

    search(methodMap[method])
  }

  // Handle URL search parameter
  useEffect(() => {
    if (urlSearchQuery && urlSearchQuery !== searchQuery) {
      setSearchQuery(urlSearchQuery)
      handleSearch(urlSearchQuery, 'text')
    }
  }, [urlSearchQuery])

  useEffect(() => {
    async function loadData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
        const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
        
        console.log('🔍 Connecting to backend:', backendUrl)
        console.log('🔑 API Key configured:', apiKey ? 'Yes' : 'No')
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        
        if (apiKey) {
          headers['x-publishable-api-key'] = apiKey
        }
        
        // Fetch products and categories
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${backendUrl}/store/products?limit=6&fields=*variants,*variants.prices`, { headers }),
          fetch(`${backendUrl}/store/product-categories?limit=6`, { headers })
        ])
        
        console.log('📦 Products response:', productsRes.status)
        console.log('📁 Categories response:', categoriesRes.status)
        
        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error(`API Error: Products ${productsRes.status}, Categories ${categoriesRes.status}`)
        }
        
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()
        
        console.log('✅ Products loaded:', productsData.products?.length || 0)
        console.log('✅ Categories loaded:', categoriesData.product_categories?.length || 0)
        
        setProducts(productsData.products || [])
        setCategories(categoriesData.product_categories || [])
      } catch (err) {
        console.error('❌ Failed to load data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Ładowanie...</div>
          <div className="text-gray-600">Łączenie z backendem Medusa</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-2xl font-bold mb-4 text-red-600">Błąd połączenia</div>
          <div className="text-gray-700 mb-4">{error}</div>
          <div className="text-sm text-gray-600">
            <p className="mb-2">Upewnij się, że:</p>
            <ul className="text-left list-disc list-inside">
              <li>Backend Medusa działa (npm run dev)</li>
              <li>Backend jest na porcie 9000</li>
              <li>CORS jest poprawnie skonfigurowany</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-[#E8F4FE] to-[#D4EBFC]">
      {/* Unified Search Hub */}
      <section className="container mx-auto px-4 md:px-[60px] py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-3">
              Znajdź części do swojej maszyny
            </h2>
            <p className="text-[15px] text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Użyj jednej z 5 metod wyszukiwania, aby szybko znaleźć potrzebne części zamienne
            </p>
          </div>
          <UnifiedSearchHub 
            onSearch={handleSearch}
            locale="pl"
          />
        </div>
      </section>

      {/* Hero Section - Temporarily Hidden */}
      {/* <FigmaHero /> */}

      {/* Search Results Section */}
      {searchQuery && (
        <section className="container mx-auto px-4 py-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Wyniki wyszukiwania
              </h2>
              <p className="text-sm text-gray-600">
                Metoda: <span className="font-semibold">{searchMethod}</span> • Zapytanie: "{searchQuery}"
              </p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Wyczyść wyniki
            </button>
          </div>
          <SearchResults 
            products={results}
            total={results.length}
            loading={searchLoading}
          />
        </section>
      )}

      {/* Categories - show only when not searching */}
      {!searchQuery && categories.length > 0 && (
        <section className="py-12 md:py-16 relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#E8F4FE] via-[#D4EBFC] to-[#C0E2FA] opacity-70"></div>
          
          <div className="container mx-auto px-4 md:px-[60px] relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-[13px] font-semibold mb-4">
                <svg className="w-4 h-4 text-[#1675F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Kategorie
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-3">
                Przeglądaj kategorie
              </h2>
              <p className="text-[15px] text-neutral-600 leading-relaxed">
                Znajdź części dla swojej maszyny budowlanej
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category: any) => {
                const colors = ['bg-[#E8F4FE]', 'bg-[#D4EBFC]', 'bg-[#C0E2FA]', 'bg-[#ACE0FF]', 'bg-[#98D8FF]']
                const randomColor = colors[Math.floor(Math.random() * colors.length)]
                
                return (
                  <Link
                    key={category.id}
                    href={`/pl/categories/${category.handle}`}
                    className={`group ${randomColor} rounded-3xl p-6 transition-colors duration-300`}
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden bg-white mb-4 flex items-center justify-center">
                      <svg className="w-20 h-20 text-[#1675F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-[16px] font-bold text-neutral-900 mb-2 line-clamp-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-[13px] text-neutral-600 line-clamp-2 mb-3">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-neutral-500">
                        {category.product_count || 0} produktów
                      </span>
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Products - show only when not searching */}
      {!searchQuery && products.length > 0 && (
        <section className="py-12 md:py-16 relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F2F2F2] via-[#E8F4FE] to-[#D4EBFC] opacity-70"></div>
          
          <div className="container mx-auto px-4 md:px-[60px] relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-[13px] font-semibold mb-3">
                  ⭐ Polecane
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-2">Polecane produkty</h2>
                <p className="text-[15px] text-neutral-600">Najczęściej wybierane przez naszych klientów</p>
              </div>
              <Link
                href="/pl/products"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#1675F2] text-white rounded-2xl text-[14px] font-bold hover:bg-[#0554F2] transition-colors"
              >
                Zobacz wszystkie
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => {
                const colors = ['bg-[#E8F4FE]', 'bg-[#D4EBFC]', 'bg-[#C0E2FA]', 'bg-[#ACE0FF]', 'bg-[#98D8FF]']
                const randomColor = colors[Math.floor(Math.random() * colors.length)]
                const price = product.variants?.[0]?.prices?.[0]?.amount || 0
                const formattedPrice = new Intl.NumberFormat('pl-PL', {
                  style: 'currency',
                  currency: 'PLN'
                }).format(price / 100)
                
                return (
                  <div key={product.id} className="group">
                    <div className={`${randomColor} rounded-3xl p-5 transition-colors duration-300`}>
                      <Link href={`/pl/products/${product.handle}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-white mb-4">
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-20 h-20 text-[#1675F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </Link>
                      
                      <div className="space-y-3">
                        {product.categories?.[0] && (
                          <Link 
                            href={`/pl/categories/${product.categories[0].handle}`}
                            className="inline-block text-[11px] font-bold text-neutral-500 uppercase tracking-wider hover:text-neutral-900 transition-colors"
                          >
                            {product.categories[0].name}
                          </Link>
                        )}
                        
                        <Link href={`/pl/products/${product.handle}`}>
                          <h3 className="text-[15px] font-bold text-neutral-900 line-clamp-2 hover:text-[#1675F2] transition-colors leading-snug">
                            {product.title}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="text-2xl font-extrabold text-neutral-900">{formattedPrice}</div>
                          
                          <button
                            className="w-11 h-11 bg-[#1675F2] text-white rounded-xl flex items-center justify-center hover:bg-[#0554F2] transition-colors"
                            aria-label="Dodaj do koszyka"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-10 text-center md:hidden">
              <Link
                href="/pl/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1675F2] text-white rounded-2xl text-[15px] font-bold hover:bg-[#0554F2] transition-colors"
              >
                Zobacz wszystkie produkty
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* No Data Message - show only when not searching */}
      {!searchQuery && products.length === 0 && categories.length === 0 && (
        <section className="container mx-auto py-16 px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-4">Brak danych</h2>
            <p className="text-gray-600 mb-4">
              Backend Medusa jest połączony, ale nie ma jeszcze produktów ani kategorii.
            </p>
            <p className="text-sm text-gray-500">
              Uruchom skrypty seed, aby wypełnić bazę danych przykładowymi danymi.
            </p>
          </div>
        </section>
      )}


    </div>
  )
}
