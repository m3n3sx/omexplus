'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCurrency } from '@/contexts/CurrencyContext'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'

export default function NowaosciPage() {
  const { currency } = useCurrency()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products?limit=20')
        const data = await response.json()
        
        // Sort by created_at to get newest products
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-neutral-600">Ładowanie nowości...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-[#E8F4FE] to-[#D4EBFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="text-sm text-gray-600">
            <Link href="/pl" className="text-blue-600 hover:underline">
              Strona główna
            </Link>
            {' > '}
            <span>Nowości</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1675F2] to-[#22A2F2] rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-neutral-900">Nowości</h1>
              <p className="text-lg text-neutral-600 mt-1">Najnowsze produkty w naszej ofercie</p>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            {products.length} {products.length === 1 ? 'produkt' : 'produktów'}
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCardTemplate key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-4">Brak nowości</h2>
            <p className="text-gray-600">
              Aktualnie nie ma nowych produktów.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
