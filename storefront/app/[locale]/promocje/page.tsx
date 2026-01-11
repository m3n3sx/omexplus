'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useCurrency } from '@/contexts/CurrencyContext'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'

export default function PromocjePage() {
  const locale = useLocale()
  const { currency } = useCurrency()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products?limit=12')
        const data = await response.json()
        setProducts(data.products?.slice(0, 12) || [])
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filters = [
    { id: 'all', label: 'Wszystkie' },
    { id: '20', label: 'Do -20%' },
    { id: '30', label: 'Do -30%' },
    { id: '50', label: 'Do -50%' },
    { id: 'sale', label: 'Wyprzedaż' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-neutral-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-secondary-700 font-bold">Ładowanie promocji...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-secondary-500">
          <Link href={`/${locale}`} className="text-primary-500 hover:underline">Strona główna</Link>
          {' / '}
          <span>Promocje</span>
        </div>

        {/* Hero */}
        <div className="bg-primary-500 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="relative z-10">
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              Gorące promocje
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-heading text-white">
              Promocje i Wyprzedaże
            </h1>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              Najlepsze oferty na części do maszyn budowlanych. Oszczędź nawet do 50%!
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Darmowa dostawa od 500 PLN
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Gwarancja najniższej ceny
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                activeFilter === filter.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-600 border border-neutral-200 hover:border-primary-500'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCardTemplate key={product.id} product={product} />
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Newsletter</span>
            <h2 className="text-2xl lg:text-3xl font-bold mt-4 mb-4 font-heading">
              Nie przegap najlepszych okazji!
            </h2>
            <p className="text-neutral-300 mb-8">
              Zapisz się do newslettera i otrzymuj informacje o nowych promocjach
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Twój adres e-mail"
                className="flex-1 px-4 py-3 rounded-full text-secondary-700 focus:ring-2 focus:ring-primary-500"
              />
              <button className="px-8 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">
                Zapisz się
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
