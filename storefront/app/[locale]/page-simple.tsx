'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
        
        // Fetch products and categories
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${backendUrl}/store/products?limit=6`),
          fetch(`${backendUrl}/store/product-categories?limit=6`)
        ])
        
        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()
        
        setProducts(productsData.products || [])
        setCategories(categoriesData.product_categories || [])
      } catch (err) {
        console.error('Failed to load data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading...</div>
          <div className="text-gray-600">Connecting to Medusa backend</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-2xl font-bold mb-4 text-red-600">Connection Error</div>
          <div className="text-gray-700 mb-4">{error}</div>
          <div className="text-sm text-gray-600">
            <p className="mb-2">Make sure:</p>
            <ul className="text-left list-disc list-inside">
              <li>Medusa backend is running (npm run dev)</li>
              <li>Backend is on port 9000</li>
              <li>CORS is configured correctly</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Części do Maszyn Budowlanych
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Profesjonalny sklep B2B • 18 lat doświadczenia • 50,000+ części
          </p>
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Szukaj części..."
              className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold mb-8">Kategorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/categories/${category.handle || category.id}`}
                className="p-4 md:p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition-all text-center"
              >
                <div className="font-semibold text-sm md:text-base">{category.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      {products.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Produkty</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow"
                >
                  {/* Product Image Placeholder */}
                  <div className="bg-gray-200 rounded-lg mb-4 h-48 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">📦</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    {product.variants?.[0]?.prices?.[0] && (
                      <span className="text-2xl font-bold text-blue-600">
                        {(product.variants[0].prices[0].amount / 100).toFixed(2)} PLN
                      </span>
                    )}
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Dodaj
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Data Message */}
      {products.length === 0 && categories.length === 0 && (
        <section className="container mx-auto py-16 px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-4">No Data Available</h2>
            <p className="text-gray-600 mb-4">
              Your Medusa backend is connected, but there are no products or categories yet.
            </p>
            <p className="text-sm text-gray-500">
              Run seed scripts to populate your database with sample data.
            </p>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Dlaczego OMEX?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Jakość', desc: 'Oryginalne i certyfikowane części', icon: '✓' },
            { title: 'Cena', desc: 'Konkurencyjne ceny hurtowe', icon: '💰' },
            { title: 'Szybkość', desc: 'Dostawa w 24-48h', icon: '🚚' },
            { title: 'Wsparcie', desc: 'Profesjonalna obsługa', icon: '💬' },
          ].map((item, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg border-2 border-gray-200">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto max-w-2xl text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Newsletter</h2>
          <p className="text-lg mb-8">
            Zapisz się i otrzymuj informacje o nowościach i promocjach
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Twój email..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Zapisz się
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
