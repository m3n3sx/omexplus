'use client'

import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'
import { useLocale } from 'next-intl'

const ITEMS_PER_PAGE = 12

export default function CategoriesPage() {
  const locale = useLocale()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [availability, setAvailability] = useState<string[]>(['in-stock', 'order'])
  const [sortBy, setSortBy] = useState('name')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  // Dynamic data from API
  const [categories, setCategories] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])

  // Load categories and products from API
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // Load categories
        const categoriesResponse = await fetch('/api/categories?limit=50')
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories || [])

        // Load products
        const productsResponse = await fetch('/api/products?limit=100')
        const productsData = await productsResponse.json()
        setAllProducts(productsData.products || [])
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = allProducts

    // Filter by search query
    if (searchQuery) {
      result = result.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.variants?.[0]?.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by categories (using category IDs from selected categories)
    if (selectedCategories.length > 0) {
      // This would require category-product mapping from backend
      // For now, skip category filtering
    }

    // Filter by price range
    result = result.filter(p => {
      const price = p.variants?.[0]?.prices?.[0]?.amount || 0
      return price >= priceRange.min * 100 && price <= priceRange.max * 100
    })

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => {
          const priceA = a.variants?.[0]?.prices?.[0]?.amount || 0
          const priceB = b.variants?.[0]?.prices?.[0]?.amount || 0
          return priceA - priceB
        })
        break
      case 'price-desc':
        result.sort((a, b) => {
          const priceA = a.variants?.[0]?.prices?.[0]?.amount || 0
          const priceB = b.variants?.[0]?.prices?.[0]?.amount || 0
          return priceB - priceA
        })
        break
      case 'newest':
        result.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateB - dateA
        })
        break
      case 'name':
      default:
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    }

    return result
  }, [allProducts, selectedCategories, priceRange, availability, sortBy, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
    setCurrentPage(1)
  }

  const toggleAvailability = (status: string) => {
    setAvailability(prev =>
      prev.includes(status) ? prev.filter(a => a !== status) : [...prev, status]
    )
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Ładowanie kategorii...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200 py-4 px-6">
        <div className="container mx-auto max-w-7xl text-sm text-neutral-600">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">Home</Link>
          {' > '}
          <span>Katalog</span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <h2 className="text-xl font-bold mb-6 text-neutral-900">Filtry</h2>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-neutral-900">Kategorie</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categories.slice(0, 20).map(cat => (
                  <Link
                    key={cat.id}
                    href={`/${locale}/categories/${cat.handle}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors text-sm"
                  >
                    <span className="flex-1">{cat.name}</span>
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-neutral-900">Zakres cen</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  placeholder="Min"
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  placeholder="Max"
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="text-xs text-neutral-500">
                PLN {priceRange.min} - {priceRange.max}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-neutral-900">Dostępność</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={availability.includes('in-stock')}
                    onChange={() => toggleAvailability('in-stock')}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Na magazynie</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={availability.includes('order')}
                    onChange={() => toggleAvailability('order')}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Zamówienie</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search & Sort */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-neutral-200 flex gap-4 items-center justify-between">
            <input
              type="text"
              placeholder="Szukaj w kategorii..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex gap-4 items-center">
              <span className="text-sm text-neutral-600 whitespace-nowrap">
                Wyników: <span className="font-semibold text-neutral-900">{filteredProducts.length}</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-neutral-200 rounded-lg text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Nazwa A-Z</option>
                <option value="price-asc">Cena rosnąco</option>
                <option value="price-desc">Cena malejąco</option>
                <option value="newest">Najnowsze</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-neutral-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Brak produktów</h3>
              <p className="text-neutral-600 text-sm">
                Nie znaleźliśmy produktów spełniających Twoje kryteria. Spróbuj zmienić filtry.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedProducts.map(product => (
                  <ProductCardTemplate
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>



              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        page === currentPage
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white text-neutral-900 border border-neutral-200 hover:border-primary-500 hover:text-primary-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
