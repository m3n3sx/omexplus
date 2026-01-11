'use client'

import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'
import { useLocale } from 'next-intl'

const ITEMS_PER_PAGE = 12

export default function CategoriesPage() {
  const locale = useLocale()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 })
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 50000 })
  const [availability, setAvailability] = useState<string[]>(['in-stock', 'order'])
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Dynamic data from API
  const [categories, setCategories] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [maxPrice, setMaxPrice] = useState(50000)

  // Load categories and products from API
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // Load categories
        const categoriesResponse = await fetch('/api/categories?limit=100')
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories || [])

        // Load ALL products (increased limit)
        const productsResponse = await fetch('/api/products?limit=1000')
        const productsData = await productsResponse.json()
        const products = productsData.products || []
        setAllProducts(products)
        
        // Calculate max price from products
        if (products.length > 0) {
          const prices = products
            .map((p: any) => p.variants?.[0]?.prices?.[0]?.amount || 0)
            .filter((p: number) => p > 0)
          if (prices.length > 0) {
            const calculatedMax = Math.ceil(Math.max(...prices) / 100)
            setMaxPrice(calculatedMax)
            setPriceRange({ min: 0, max: calculatedMax })
            setTempPriceRange({ min: 0, max: calculatedMax })
          }
        }
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
      const query = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.variants?.[0]?.sku?.toLowerCase().includes(query) ||
        p.handle?.toLowerCase().includes(query)
      )
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      result = result.filter(p => {
        // Check if product belongs to any selected category
        const productCategories = p.categories || []
        return productCategories.some((cat: any) => 
          selectedCategories.includes(cat.id)
        )
      })
    }

    // Filter by price range
    result = result.filter(p => {
      const price = (p.variants?.[0]?.prices?.[0]?.amount || 0) / 100
      return price >= priceRange.min && price <= priceRange.max
    })

    // Filter by availability
    if (availability.length > 0 && availability.length < 2) {
      result = result.filter(p => {
        const qty = p.variants?.[0]?.inventory_quantity ?? 10
        const isInStock = qty > 0
        
        if (availability.includes('in-stock') && !availability.includes('order')) {
          return isInStock
        }
        if (availability.includes('order') && !availability.includes('in-stock')) {
          return !isInStock
        }
        return true
      })
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => {
          const priceA = a.variants?.[0]?.prices?.[0]?.amount || 0
          const priceB = b.variants?.[0]?.prices?.[0]?.amount || 0
          return priceA - priceB
        })
        break
      case 'price-desc':
        result = [...result].sort((a, b) => {
          const priceA = a.variants?.[0]?.prices?.[0]?.amount || 0
          const priceB = b.variants?.[0]?.prices?.[0]?.amount || 0
          return priceB - priceA
        })
        break
      case 'newest':
        result = [...result].sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateB - dateA
        })
        break
      case 'name':
      default:
        result = [...result].sort((a, b) => (a.title || '').localeCompare(b.title || '', 'pl'))
    }

    return result
  }, [allProducts, selectedCategories, priceRange, sortBy, searchQuery, availability])

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

  const applyPriceFilter = () => {
    setPriceRange(tempPriceRange)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange({ min: 0, max: maxPrice })
    setTempPriceRange({ min: 0, max: maxPrice })
    setAvailability(['in-stock', 'order'])
    setSearchQuery('')
    setCurrentPage(1)
  }

  // Pagination helpers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getVisiblePages = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    let prev = 0
    for (const i of range) {
      if (prev) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1)
        } else if (i - prev !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      prev = i
    }

    return rangeWithDots
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Ładowanie produktów...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200 py-4 px-6">
        <div className="container mx-auto max-w-7xl text-sm text-neutral-600">
          <Link href={`/${locale}`} className="text-primary-600 hover:text-primary-700 font-semibold">Strona główna</Link>
          {' > '}
          <span className="font-medium">Katalog produktów</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-secondary-700 text-white py-8 px-6">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-2">Katalog produktów</h1>
          <p className="text-neutral-300">
            Przeglądaj naszą pełną ofertę części do maszyn budowlanych
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white rounded-xl shadow-sm border border-neutral-200 text-neutral-700 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtry {selectedCategories.length > 0 && `(${selectedCategories.length})`}
        </button>

        {/* Sidebar */}
        <aside className={`w-full lg:w-72 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-900">Filtry</h2>
              <button
                onClick={resetFilters}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Wyczyść filtry
              </button>
            </div>

            {/* Categories */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-3 text-neutral-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Kategorie
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                {categories.slice(0, 25).map(cat => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="flex-1 text-neutral-700">{cat.name}</span>
                  </label>
                ))}
                {categories.length > 25 && (
                  <p className="text-xs text-neutral-500 p-2">
                    + {categories.length - 25} więcej kategorii
                  </p>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-3 text-neutral-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cena (PLN)
              </h3>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={tempPriceRange.min}
                    onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: Math.max(0, Number(e.target.value)) })}
                    placeholder="Od"
                    min="0"
                    className="w-full px-2 py-1.5 border border-neutral-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <span className="text-neutral-400">-</span>
                  <input
                    type="number"
                    value={tempPriceRange.max}
                    onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: Math.max(0, Number(e.target.value)) })}
                    placeholder="Do"
                    min="0"
                    className="w-full px-2 py-1.5 border border-neutral-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <button
                  onClick={applyPriceFilter}
                  className="w-full py-1.5 bg-primary-500 text-white rounded text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  Zastosuj
                </button>
                {(priceRange.min > 0 || priceRange.max < maxPrice) && (
                  <div className="text-xs text-primary-600 text-center font-medium">
                    Filtr: {priceRange.min} - {priceRange.max} PLN
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-neutral-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Dostępność
              </h3>
              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={availability.includes('in-stock')}
                    onChange={() => toggleAvailability('in-stock')}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-700">Na magazynie</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={availability.includes('order')}
                    onChange={() => toggleAvailability('order')}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-700">Na zamówienie</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Search & Sort */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-neutral-200">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Szukaj produktu, SKU..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-sm text-neutral-600 whitespace-nowrap">
                  <span className="font-semibold text-neutral-900">{filteredProducts.length}</span> produktów
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-neutral-200 rounded-lg text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="newest">Najnowsze</option>
                  <option value="name">Nazwa A-Z</option>
                  <option value="price-asc">Cena: od najniższej</option>
                  <option value="price-desc">Cena: od najwyższej</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 || searchQuery) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  Szukaj: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-primary-900">×</button>
                </span>
              )}
              {selectedCategories.map(catId => {
                const cat = categories.find(c => c.id === catId)
                return cat ? (
                  <span key={catId} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                    {cat.name}
                    <button onClick={() => toggleCategory(catId)} className="ml-1 hover:text-secondary-900">×</button>
                  </span>
                ) : null
              })}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-neutral-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Brak produktów</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Nie znaleźliśmy produktów spełniających Twoje kryteria.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Wyczyść filtry
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {paginatedProducts.map(product => (
                  <ProductCardTemplate
                    key={product.id}
                    product={product}
                    locale={locale}
                  />
                ))}
              </div>

              {/* Pagination with arrows */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 mt-8">
                  {/* Previous Arrow */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg font-semibold text-sm transition-all ${
                      currentPage === 1
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:border-primary-500 hover:text-primary-600'
                    }`}
                    aria-label="Poprzednia strona"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {getVisiblePages().map((page, index) => (
                    page === '...' ? (
                      <span key={`dots-${index}`} className="px-3 py-2 text-neutral-400">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page as number)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                          page === currentPage
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white text-neutral-700 border border-neutral-200 hover:border-primary-500 hover:text-primary-600'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}

                  {/* Next Arrow */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg font-semibold text-sm transition-all ${
                      currentPage === totalPages
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:border-primary-500 hover:text-primary-600'
                    }`}
                    aria-label="Następna strona"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Page info */}
              {totalPages > 1 && (
                <div className="text-center mt-4 text-sm text-neutral-500">
                  Strona {currentPage} z {totalPages} • Wyświetlono {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} z {filteredProducts.length} produktów
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
