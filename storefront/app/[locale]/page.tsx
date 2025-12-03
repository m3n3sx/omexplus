'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import UnifiedSearchHub from '@/components/search/UnifiedSearchHub'
import SearchResults from '@/components/search/SearchResults'
import { useSearch } from '@/hooks/useSearch'
import { ProductCard } from '@/components/product/ProductCard'

type SearchMethod = 'text' | 'machine' | 'part-number' | 'visual' | 'filters'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMethod, setSearchMethod] = useState<SearchMethod>('text')
  const { results, loading: searchLoading, error: searchError, search } = useSearch()

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

  const handleSearch = async (query: string, method: SearchMethod, params?: any) => {
    setSearchQuery(query)
    setSearchMethod(method)
    
    try {
      // Call search with method and params
      if (method === 'text') {
        await search({
          method: 'text',
          params: { query, language: 'pl', fuzzy: true }
        })
      } else if (method === 'machine') {
        await search({
          method: 'machine',
          params: params || {}
        })
      } else if (method === 'part-number') {
        await search({
          method: 'part-number',
          params: { partNumber: query, includeAlternatives: true, ...params }
        })
      } else if (method === 'visual') {
        await search({
          method: 'visual',
          params: params || {}
        })
      } else if (method === 'filters') {
        await search({
          method: 'filters',
          params: params || {}
        })
      }
    } catch (err) {
      console.error('Search error:', err)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Unified Search Hub */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Części do Maszyn Budowlanych
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Profesjonalny sklep B2B • 18 lat doświadczenia • 50,000+ części
            </p>
          </div>
        </div>
      </section>

      {/* Unified Search Hub */}
      <section className="container mx-auto px-4 -mt-8">
        <UnifiedSearchHub 
          onSearch={handleSearch}
          locale="pl"
        />
      </section>

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
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold mb-8">Kategorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/categories/${category.handle || category.id}`}
                className="p-4 md:p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition-all text-center"
              >
                <div className="font-semibold text-sm md:text-base">{category.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products - show only when not searching */}
      {!searchQuery && products.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Produkty</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
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

      {/* Features - show only when not searching */}
      {!searchQuery && (
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Dlaczego OMEX?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Jakość', desc: 'Oryginalne i certyfikowane części', icon: '✓' },
            { title: 'Cena', desc: 'Konkurencyjne ceny hurtowe', icon: '💰' },
            { title: 'Szybkość', desc: 'Dostawa w 24-48h', icon: '🚚' },
            { title: 'Wsparcie', desc: 'Profesjonalna obsługa', icon: '💬' },
          ].map((item, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg border-2 border-gray-200">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Newsletter */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto max-w-2xl text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Newsletter</h2>
          <p className="text-lg mb-8">
            Zapisz się i otrzymuj informacje o nowościach i promocjach
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Twój email..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Zapisz się
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
