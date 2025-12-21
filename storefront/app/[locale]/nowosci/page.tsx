'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useCurrency } from '@/contexts/CurrencyContext'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'

export default function NowosciPage() {
  const locale = useLocale()
  const { currency } = useCurrency()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products?limit=20')
        const data = await response.json()
        const sortedProducts = (data.products || []).sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        setProducts(sortedProducts)
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
          <p className="text-secondary-700 font-bold">Ładowanie nowości...</p>
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
          <span>Nowości</span>
        </div>

        {/* Hero */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Świeżo dodane</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading">
            Nowości w <span className="text-primary-500">Ofercie</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl">
            Najnowsze produkty w naszym sklepie. Sprawdź co nowego dodaliśmy do oferty.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-primary-500/20 px-4 py-2 rounded-full text-sm">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{products.length} nowych produktów</span>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product: any) => (
              <ProductCardTemplate key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm mb-12">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-secondary-700 mb-2">Brak nowości</h2>
            <p className="text-secondary-500">Aktualnie nie ma nowych produktów. Sprawdź ponownie wkrótce!</p>
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
