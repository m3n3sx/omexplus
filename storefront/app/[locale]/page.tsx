'use client'

import Link from 'next/link'
import { useState } from 'react'
import UnifiedSearchHub from '@/components/search/UnifiedSearchHub'
import SearchResults from '@/components/search/SearchResults'
import { useSearch } from '@/hooks/useSearch'

type SearchMethod = 'text' | 'machine' | 'part-number' | 'visual' | 'filters'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMethod, setSearchMethod] = useState<SearchMethod>('text')
  const { results, loading, error, search } = useSearch()

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

  const featuredCategories = [
    { id: 1, name: 'Hydraulika', code: 'HYD', slug: 'hydraulika' },
    { id: 2, name: 'Filtry', code: 'FIL', slug: 'filtry' },
    { id: 3, name: 'Silniki', code: 'ENG', slug: 'silniki' },
    { id: 4, name: 'Podwozia', code: 'TRK', slug: 'podwozia' },
    { id: 5, name: 'Elektryka', code: 'ELE', slug: 'elektryka' },
    { id: 6, name: 'Osprzęt', code: 'ATT', slug: 'osprzet' },
  ]

  const bestsellers = [
    { id: 1, name: 'Pompa hydrauliczna CAT 320', sku: 'CAT-HYD-001', price: 2500 },
    { id: 2, name: 'Koło gąsienicowe Komatsu', sku: 'KOM-WHE-002', price: 1800 },
    { id: 3, name: 'Filtr oleju Volvo', sku: 'VOL-FIL-003', price: 2100 },
  ]

  const whyChooseUs = [
    { title: 'Jakość', desc: 'Oryginalne i certyfikowane części' },
    { title: 'Cena', desc: 'Konkurencyjne ceny hurtowe' },
    { title: 'Szybkość', desc: 'Dostawa w 24-48h' },
    { title: 'Wsparcie', desc: 'Profesjonalna obsługa' },
  ]

  return (
    <div>
      {/* Hero Section with Unified Search Hub */}
      <section className="bg-gradient-to-r from-primary-500 to-blue-600 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold mb-3">
              Części do Maszyn Budowlanych
            </h1>
            <p className="text-xl opacity-90">
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
            results={results}
            loading={loading}
            error={error}
            locale="pl"
          />
        </section>
      )}

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Popularne Kategorie
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredCategories.map(category => (
            <Link
              key={category.id}
              href={`/pl/categories/${category.slug}`}
              className="p-6 bg-white border-2 border-gray-200 rounded-xl text-center hover:border-primary-500 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md"
            >
              <div className="mb-3 inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-mono text-lg font-bold">
                {category.code}
              </div>
              <div className="font-semibold text-gray-700">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Bestsellery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestsellers.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-transform border border-gray-200"
              >
                <div className="text-center mb-4 bg-gray-100 py-12 rounded-lg">
                  <div className="text-4xl font-bold text-gray-400">IMG</div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  SKU: {product.sku}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-500">
                    {product.price} PLN
                  </span>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                    Dodaj
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Dlaczego OMEX?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="text-center p-8 bg-white rounded-xl border-2 border-gray-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 text-lg text-gray-600">
          <strong>18 lat doświadczenia</strong> na rynku części do maszyn budowlanych
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary-500 text-white py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Newsletter</h2>
          <p className="text-lg mb-8 opacity-90">
            Zapisz się i otrzymuj informacje o nowościach i promocjach
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Twój email..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="px-8 py-3 bg-white text-primary-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Zapisz się
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
