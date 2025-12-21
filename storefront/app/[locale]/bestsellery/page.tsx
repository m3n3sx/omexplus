'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useCurrency } from '@/contexts/CurrencyContext'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'

export default function BestselleryPage() {
  const locale = useLocale()
  const { currency } = useCurrency()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products?limit=20')
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-neutral-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-secondary-700 font-bold">Ładowanie bestsellerów...</p>
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
          <span>Bestsellery</span>
        </div>

        {/* Hero */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <div className="absolute top-8 right-8">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Najpopularniejsze</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading">
            Bestsellery <span className="text-primary-500">OMEX</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl">
            Najpopularniejsze produkty wybierane przez naszych klientów. Sprawdzone części najwyższej jakości.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-primary-500/20 px-4 py-2 rounded-full text-sm">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Wybór klientów</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border-t-4 border-primary-500">
            <div className="text-3xl font-bold text-primary-500 mb-1 font-heading">500+</div>
            <div className="text-secondary-500 text-sm">Zadowolonych klientów</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border-t-4 border-primary-500">
            <div className="text-3xl font-bold text-primary-500 mb-1 font-heading">2000+</div>
            <div className="text-secondary-500 text-sm">Sprzedanych części</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border-t-4 border-primary-500">
            <div className="text-3xl font-bold text-primary-500 mb-1 font-heading">4.9/5</div>
            <div className="text-secondary-500 text-sm">Średnia ocena</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border-t-4 border-primary-500">
            <div className="text-3xl font-bold text-primary-500 mb-1 font-heading">98%</div>
            <div className="text-secondary-500 text-sm">Poleca nas</div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product: any, index: number) => (
              <div key={product.id} className="relative">
                {index < 3 && (
                  <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                )}
                <ProductCardTemplate product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm mb-12">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-secondary-700 mb-2">Brak bestsellerów</h2>
            <p className="text-secondary-500">Aktualnie nie ma danych o bestsellerach.</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <h2 className="text-2xl font-bold mb-4">Szukasz konkretnej części?</h2>
          <p className="text-neutral-300 mb-6">Skorzystaj z naszej wyszukiwarki lub skontaktuj się z nami</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href={`/${locale}/search`} className="px-8 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">
              Wyszukaj części
            </Link>
            <Link href={`/${locale}/kontakt`} className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-full font-bold hover:bg-white hover:text-secondary-700 transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
