'use client'

import Link from 'next/link'
import UnifiedSearchHub from '@/components/search/UnifiedSearchHub'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'
import { MainCategoryCard } from '@/components/layout/MainCategoryCard'
import { useLocale } from 'next-intl'

export default function HomePage() {
  const router = useRouter()
  const locale = useLocale()
  const { currency } = useCurrency()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalCategories, setTotalCategories] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // Fetch products with prices from our custom API
        const productsResponse = await fetch('/api/products?limit=8')
        const productsData = await productsResponse.json()
        
        // Fetch all main categories from our custom API
        const categoriesResponse = await fetch('/api/categories?limit=50&main=true')
        const categoriesData = await categoriesResponse.json()
        
        setProducts(productsData.products || [])
        setCategories(categoriesData.categories || [])
        setTotalProducts(productsData.count || 0)
        setTotalCategories(categoriesData.count || 0)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [currency])

  const handleSearch = (query: string, method: string, params?: any) => {
    const searchParams = new URLSearchParams()
    searchParams.set('q', query)
    searchParams.set('method', method)
    if (params) {
      searchParams.set('params', JSON.stringify(params))
    }
    router.push(`/${locale}/search?${searchParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-neutral-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-secondary-800 font-bold text-lg">Ładowanie produktów...</p>
          <p className="text-secondary-500 text-sm mt-2 font-bold">Przygotowujemy najlepsze oferty</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="bg-neutral-800 text-white">
        <div className="container mx-auto px-4 lg:px-12 py-16 lg:py-24 max-w-[1400px]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 leading-tight">
            Części do maszyn<br />budowlanych.
          </h1>

          {/* Search Hub with Tabs */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <UnifiedSearchHub onSearch={handleSearch} locale={locale} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-12 py-12 lg:py-16 max-w-[1400px]">

        {/* Categories */}
        <div className="mb-20 lg:mb-32">
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">Kategorie produktów</h2>
            <p className="text-neutral-600">Znajdź części dla swojej maszyny</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category: any) => (
              <MainCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="mb-20 lg:mb-32">
          <div className="flex justify-between items-end mb-12 lg:mb-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-3">Najnowsze Produkty</h2>
              <p className="text-secondary-600 font-bold text-lg">Sprawdź naszą najnowszą ofertę</p>
            </div>
            <Link href={`/${locale}/products`} className="text-primary-600 hover:text-primary-700 font-bold text-base flex items-center gap-2 group underline">
              <span>Zobacz wszystkie produkty</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product: any) => (
              <ProductCardTemplate key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Stats - Light cards with yellow accents */}
        <div className="relative bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-10 md:p-16 border-2 border-neutral-200 overflow-hidden shadow-sm">
          {/* Yellow accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative z-10">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-white border-2 border-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-500 transition-all duration-300 shadow-md">
                <svg className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-primary-600 mb-3">
                {totalProducts > 0 ? totalProducts.toLocaleString('pl-PL') : '0'}
              </div>
              <div className="text-secondary-700 font-bold uppercase tracking-wide text-base">Produktów w ofercie</div>
              <div className="text-secondary-500 text-sm mt-2">Stale poszerzamy asortyment</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-white border-2 border-secondary-700 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary-700 transition-all duration-300 shadow-md">
                <svg className="w-8 h-8 text-secondary-700 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-secondary-700 mb-3">
                {totalCategories > 0 ? totalCategories : '0'}
              </div>
              <div className="text-secondary-700 font-bold uppercase tracking-wide text-base">Kategorii produktów</div>
              <div className="text-secondary-500 text-sm mt-2">Łatwo znajdziesz to czego szukasz</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-white border-2 border-success rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-success transition-all duration-300 shadow-md">
                <svg className="w-8 h-8 text-success group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-success mb-3">24h</div>
              <div className="text-secondary-700 font-bold uppercase tracking-wide text-base">Szybka dostawa</div>
              <div className="text-secondary-500 text-sm mt-2">Ekspresowa realizacja zamówień</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
