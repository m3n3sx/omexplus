'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ModernHero } from '@/components/layout/ModernHero'
import { ModernSidebar } from '@/components/layout/ModernSidebar'
import { ModernPromoCards } from '@/components/layout/ModernPromoCards'
import { ModernProductCard } from '@/components/product/ModernProductCard'

export default function ModernPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
        const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        
        if (apiKey) {
          headers['x-publishable-api-key'] = apiKey
        }
        
        const res = await fetch(`${backendUrl}/store/products?limit=8&fields=*variants,*variants.prices`, { headers })
        
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero */}
      <ModernHero />

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 md:px-[60px] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <ModernSidebar />
          </div>

          {/* Main Content */}
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">Explore</h2>
                <div className="flex items-center gap-6">
                  <button className="text-[14px] font-bold text-neutral-900 pb-2 border-b-2 border-blue-600">
                    All
                  </button>
                  <button className="text-[14px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                    Men
                  </button>
                  <button className="text-[14px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                    Women
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-[13px] font-semibold hover:bg-neutral-50 transition-colors">
                  Filters
                </button>
                <button className="w-10 h-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center hover:bg-neutral-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Promo Cards */}
            <ModernPromoCards />

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⏳</div>
                <p className="text-neutral-600">Ładowanie produktów...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.slice(0, 6).map((product) => (
                    <ModernProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Favourites Section */}
                <div className="bg-white rounded-3xl p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-extrabold text-neutral-900">Favourites</h3>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center hover:bg-neutral-200 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center hover:bg-neutral-200 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.slice(0, 4).map((product) => (
                      <Link
                        key={product.id}
                        href={`/pl/products/${product.handle}`}
                        className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 hover:scale-105 transition-transform"
                      >
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          📦
                        </div>
                      </Link>
                    ))}
                  </div>

                  <button className="w-full mt-6 py-3 text-[14px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    See All
                  </button>
                </div>

                {/* Bring Bold Fashion */}
                <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-3">
                        Bring Bold Fashion
                      </h3>
                      <p className="text-[15px] text-neutral-600 mb-6">
                        Layers on Layers
                      </p>
                      <button className="px-8 py-3 bg-neutral-900 text-white rounded-2xl font-bold text-[14px] hover:bg-neutral-800 transition-colors">
                        Shop Now
                      </button>
                    </div>
                    <div className="aspect-square rounded-2xl bg-white flex items-center justify-center text-7xl">
                      👔
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-neutral-600">Brak produktów</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
