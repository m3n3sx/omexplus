'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { storeAPI } from '@/lib/api-client'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'

export default function ProductsPage() {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const data = await storeAPI.getProducts({ 
          limit: 20,
          offset: 0
        })
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [categoryParam])

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-neutral-400 mb-6 flex items-center gap-2">
            <Link href={`/${locale}`} className="hover:text-secondary-500 transition-colors">Home</Link>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-100 font-semibold">Products</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-100 mb-2 uppercase tracking-wide">Products</h1>
            <div className="h-1 w-24 bg-secondary-500 mb-4"></div>
            <p className="text-neutral-400">Browse our complete catalog</p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-neutral-800 border border-neutral-700 rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCardTemplate key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-neutral-800 border border-neutral-700 rounded-lg">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-neutral-400 mb-4">No products found</p>
              <Link 
                href={`/${locale}/products`}
                className="inline-block px-6 py-3 bg-secondary-500 text-neutral-900 rounded-lg font-bold hover:bg-secondary-400 transition-all uppercase tracking-wide text-sm"
              >
                View all products
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
