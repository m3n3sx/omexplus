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
      {/* Hero Section - Induxter Dark Style */}
      <div className="bg-secondary-700 text-white">
        <div className="container mx-auto px-4 lg:px-12 py-16 lg:py-24 max-w-[1200px]">
          <div className="mb-6">
            <span className="text-white uppercase tracking-widest font-bold text-sm font-heading">OMEX - Części do maszyn</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-heading text-white">
            Części do maszyn<br /><span className="text-primary-500">budowlanych.</span>
          </h1>
          <p className="text-neutral-300 text-lg mb-12 max-w-2xl">
            Profesjonalny dostawca części zamiennych do maszyn budowlanych. 18 lat doświadczenia na rynku B2B.
          </p>

          {/* Search Hub with Tabs */}
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <UnifiedSearchHub onSearch={handleSearch} locale={locale} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-12 py-12 lg:py-16 max-w-[1200px]">

        {/* Categories - Induxter style */}
        <div className="mb-20 lg:mb-32">
          <div className="mb-8 text-center">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm font-heading">Nasza oferta</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-700 mb-2 mt-4 font-heading">Kategorie <span className="text-primary-500">produktów</span></h2>
            <p className="text-secondary-500">Znajdź części dla swojej maszyny</p>
            {/* Induxter decorative lines */}
            <div className="flex justify-center gap-1 mt-4">
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category: any) => (
              <MainCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Products - Induxter style */}
        <div className="mb-20 lg:mb-32">
          <div className="flex justify-between items-end mb-12 lg:mb-16">
            <div>
              <span className="text-primary-500 uppercase tracking-widest font-bold text-sm font-heading">Nowości</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary-700 mb-2 mt-4 font-heading">Najnowsze <span className="text-primary-500">Produkty</span></h2>
              <p className="text-secondary-500">Sprawdź naszą najnowszą ofertę</p>
              {/* Induxter decorative lines */}
              <div className="flex gap-1 mt-4">
                <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
                <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
                <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
              </div>
            </div>
            <Link href={`/${locale}/products`} className="bg-primary-500 text-white hover:bg-secondary-700 px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 group transition-all">
              <span>Zobacz wszystkie</span>
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

        {/* Stats - Induxter style with orange accents */}
        <div className="relative bg-secondary-700 rounded-lg p-10 md:p-16 overflow-hidden">
          {/* Orange accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative z-10">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-white mb-3 font-heading">
                {totalProducts > 0 ? totalProducts.toLocaleString('pl-PL') : '0'}
              </div>
              <div className="text-primary-500 font-bold uppercase tracking-wide text-base">Produktów w ofercie</div>
              <div className="text-neutral-400 text-sm mt-2">Stale poszerzamy asortyment</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-white mb-3 font-heading">
                {totalCategories > 0 ? totalCategories : '0'}
              </div>
              <div className="text-primary-500 font-bold uppercase tracking-wide text-base">Kategorii produktów</div>
              <div className="text-neutral-400 text-sm mt-2">Łatwo znajdziesz to czego szukasz</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-white mb-3 font-heading">24h</div>
              <div className="text-primary-500 font-bold uppercase tracking-wide text-base">Szybka dostawa</div>
              <div className="text-neutral-400 text-sm mt-2">Ekspresowa realizacja zamówień</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
