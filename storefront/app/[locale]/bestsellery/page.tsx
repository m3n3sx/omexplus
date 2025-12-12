'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCurrency } from '@/contexts/CurrencyContext'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'

export default function BestselleryPage() {
  const { currency } = useCurrency()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products?limit=20')
        const data = await response.json()
        
        // For now, just show all products
        // In production, this should filter by sales data
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-neutral-600">Ładowanie bestsellerów...</p>
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
            <span>Bestsellery</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#F2B90C] to-[#d9a50b] rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-neutral-900">Bestsellery</h1>
              <p className="text-lg text-neutral-600 mt-1">Najpopularniejsze produkty wybierane przez naszych klientów</p>
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
            <h2 className="text-2xl font-bold mb-4">Brak bestsellerów</h2>
            <p className="text-gray-600">
              Aktualnie nie ma danych o bestsellerach.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
