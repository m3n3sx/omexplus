'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { storeAPI } from '@/lib/api-client'

export default function ProductsPage() {
  const locale = useLocale()
  const t = useTranslations()
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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600 mb-6">
            <Link href={`/${locale}`} className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Products</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">Browse our complete catalog</p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 h-80 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.id}`}
                  className="bg-white border border-gray-200 hover:border-gray-900 transition-colors"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {product.thumbnail ? (
                      <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    {product.variants?.[0]?.prices?.[0] && (
                      <p className="text-sm text-gray-900 font-semibold">
                        {(product.variants[0].prices[0].amount / 100).toFixed(2)} PLN
                      </p>
                    )}
                    {product.variants?.[0]?.inventory_quantity !== undefined && (
                      <p className="text-xs text-gray-600 mt-1">
                        {product.variants[0].inventory_quantity > 0 
                          ? `In stock: ${product.variants[0].inventory_quantity}`
                          : 'Out of stock'
                        }
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">No products found</p>
              <Link 
                href={`/${locale}/products`}
                className="text-sm text-gray-900 font-medium hover:underline"
              >
                View all products
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
