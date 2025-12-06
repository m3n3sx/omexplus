'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function CategoryPage() {
  const params = useParams()
  const handle = params.handle as string
  
  const [category, setCategory] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategoryData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
        const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        
        if (apiKey) {
          headers['x-publishable-api-key'] = apiKey
        }
        
        // Fetch category by handle
        const categoryRes = await fetch(
          `${backendUrl}/store/product-categories?handle=${handle}`,
          { headers }
        )
        
        if (!categoryRes.ok) {
          throw new Error('Category not found')
        }
        
        const categoryData = await categoryRes.json()
        const cat = categoryData.product_categories?.[0]
        
        if (!cat) {
          throw new Error('Category not found')
        }
        
        setCategory(cat)
        
        // Fetch products in this category
        const productsRes = await fetch(
          `${backendUrl}/store/products?category_id[]=${cat.id}&limit=20&fields=*variants,*variants.prices`,
          { headers }
        )
        
        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setProducts(productsData.products || [])
        }
        
      } catch (err) {
        console.error('Failed to load category:', err)
        setError(err instanceof Error ? err.message : 'Failed to load category')
      } finally {
        setLoading(false)
      }
    }
    
    if (handle) {
      loadCategoryData()
    }
  }, [handle])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Ładowanie kategorii...</div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📁</div>
          <div className="text-2xl font-bold mb-4">Kategoria nie znaleziona</div>
          <p className="text-gray-600 mb-4">{error || 'Nie znaleziono kategorii'}</p>
          <Link
            href="/pl"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Wróć do strony głównej
          </Link>
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
            <Link href="/pl/categories" className="text-blue-600 hover:underline">
              Kategorie
            </Link>
            {' > '}
            <span>{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 mb-8">
          <h1 className="text-4xl font-extrabold text-neutral-900 mb-3">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-neutral-600 mb-4">
              {category.description}
            </p>
          )}
          <div className="text-sm text-neutral-500">
            {products.length} {products.length === 1 ? 'produkt' : 'produktów'}
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => {
              const colors = ['bg-[#E8F4FE]', 'bg-[#D4EBFC]', 'bg-[#C0E2FA]', 'bg-[#ACE0FF]']
              const randomColor = colors[Math.floor(Math.random() * colors.length)]
              const price = product.variants?.[0]?.prices?.[0]?.amount || 0
              const formattedPrice = new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN'
              }).format(price / 100)
              
              return (
                <div key={product.id} className="group">
                  <div className={`${randomColor} rounded-3xl p-5 transition-all duration-300 hover:shadow-lg`}>
                    <Link href={`/pl/products/${product.handle}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-white mb-4">
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-20 h-20 text-[#1675F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </Link>
                    
                    <div className="space-y-3">
                      <Link href={`/pl/products/${product.handle}`}>
                        <h3 className="text-[15px] font-bold text-neutral-900 line-clamp-2 hover:text-[#1675F2] transition-colors leading-snug">
                          {product.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-2xl font-extrabold text-neutral-900">{formattedPrice}</div>
                        
                        <button
                          className="w-11 h-11 bg-[#1675F2] text-white rounded-xl flex items-center justify-center hover:bg-[#0554F2] transition-colors"
                          aria-label="Dodaj do koszyka"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-4">Brak produktów</h2>
            <p className="text-gray-600">
              W tej kategorii nie ma jeszcze produktów.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
