'use client'

import Link from 'next/link'
import UnifiedSearchHub from '@/components/search/UnifiedSearchHub'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch products with prices from our custom API
        const productsResponse = await fetch('/api/products?limit=8')
        const productsData = await productsResponse.json()
        
        // Fetch categories from our custom API
        const categoriesResponse = await fetch('/api/categories?limit=8')
        const categoriesData = await categoriesResponse.json()
        
        setProducts(productsData.products || [])
        setCategories(categoriesData.categories || [])
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSearch = (query: string, method: string, params?: any) => {
    const searchParams = new URLSearchParams()
    searchParams.set('q', query)
    searchParams.set('method', method)
    if (params) {
      searchParams.set('params', JSON.stringify(params))
    }
    router.push(`/pl/search?${searchParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-neutral-600">Ładowanie...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <UnifiedSearchHub onSearch={handleSearch} locale="pl" />
      </div>

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 mb-12 text-white">
        <h1 className="text-4xl font-bold mb-4">Części do Maszyn Budowlanych</h1>
        <p className="text-xl mb-6">Profesjonalny sklep B2B - Najwyższa jakość, konkurencyjne ceny</p>
        <Link 
          href="/pl/products" 
          className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Zobacz wszystkie produkty
        </Link>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Kategorie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/pl/categories/${category.handle}`}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.description || 'Zobacz produkty'}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Polecane produkty</h2>
          <Link href="/pl/products" className="text-primary-600 hover:text-primary-700 font-semibold">
            Zobacz wszystkie →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Link
              key={product.id}
              href={`/pl/products/${product.handle}`}
              className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary-500 hover:shadow-lg transition-all"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              {product.variants && product.variants.length > 0 && product.variants[0].prices && product.variants[0].prices.length > 0 ? (
                <div className="text-primary-600 font-bold">
                  {(product.variants[0].prices[0].amount / 100).toFixed(2)} {product.variants[0].prices[0].currency_code.toUpperCase()}
                </div>
              ) : (
                <div className="text-gray-500 font-semibold">Zapytaj o cenę</div>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-gray-50 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">{products.length > 0 ? '1,884' : '0'}</div>
            <div className="text-gray-600">Produktów w ofercie</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">{categories.length}</div>
            <div className="text-gray-600">Kategorii</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">24h</div>
            <div className="text-gray-600">Szybka dostawa</div>
          </div>
        </div>
      </div>
    </div>
  )
}
