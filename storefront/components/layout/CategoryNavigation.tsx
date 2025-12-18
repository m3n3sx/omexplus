'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { FeaturedProductCard } from './FeaturedProductCard'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  priority: number
  productCount: number
  subcategories?: Category[]
}

interface FeaturedProduct {
  id: string
  name: string
  slug: string
  category: string
  description: string
}

interface CategoryNavigationProps {
  onCategorySelect?: (category: Category) => void
  isLoading?: boolean
}

export function CategoryNavigation({ onCategorySelect }: CategoryNavigationProps) {
  const locale = useLocale()
  const t = useTranslations('nav')
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [featuredProductsError, setFeaturedProductsError] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredLevel1, setHoveredLevel1] = useState<string | null>(null)
  const [hoveredLevel2, setHoveredLevel2] = useState<string | null>(null)

  // Fetch full category hierarchy on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/categories/hierarchy', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`)
        }

        const data = await response.json()
        setCategories(data.categories || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('failedToLoadCategories')
        setError(errorMessage)
        console.error('Error fetching categories:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch featured products on mount
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setFeaturedProductsError(null)

        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
        const response = await fetch(`${backendUrl}/store/featured-products?limit=6&locale=${locale}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          console.warn('Featured products API returned error, using empty array')
          setFeaturedProducts([])
          return
        }

        const data = await response.json()
        setFeaturedProducts(data.products || [])
      } catch (err) {
        console.warn('Error fetching featured products, using empty array:', err)
        setFeaturedProducts([])
      }
    }

    fetchFeaturedProducts()
  }, [locale])

  const handleMenuOpen = () => {
    setIsMenuOpen(true)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
    setHoveredLevel1(null)
    setHoveredLevel2(null)
  }

  const handleCategorySelect = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category)
    }
    handleMenuClose()
  }

  // Loading state
  if (isLoading) {
    return (
      <nav className="hidden lg:flex items-center gap-1">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
        </div>
      </nav>
    )
  }

  // Error state
  if (error) {
    return (
      <nav className="hidden lg:flex items-center gap-1">
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-red-600">
          <span>{t('failedToLoadCategories')}</span>
        </div>
      </nav>
    )
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <nav className="hidden lg:flex items-center gap-1">
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-500">
          {t('noCategoriesAvailable')}
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav className="hidden lg:flex items-center gap-1">
        <div className="nav-item relative">
          <button
            onMouseEnter={handleMenuOpen}
            className="nav-item__trigger flex items-center gap-1 text-white font-bold hover:text-secondary-700 transition-colors px-4 py-2 text-sm uppercase font-heading"
          >
            PRODUCTS
          </button>
        </div>
      </nav>

      {/* Mega menu - IBM Style (container width, centered) */}
      {isMenuOpen && (
        <div
          className="mega-menu fixed left-1/2 -translate-x-1/2 bg-secondary-800 shadow-2xl z-50 rounded-b-lg overflow-hidden"
          style={{ top: '104px', maxHeight: 'calc(100vh - 120px)', width: '100%', maxWidth: '1400px' }}
          onMouseEnter={handleMenuOpen}
          onMouseLeave={handleMenuClose}
        >
          <div className="flex h-full">
            {/* Left sidebar - Main Categories */}
            <div className="w-64 bg-secondary-900 py-6 flex flex-col" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              <div className="px-6 mb-4">
                <h3 className="text-white text-sm font-semibold uppercase tracking-wider">
                  {t('categories')}
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onMouseEnter={() => {
                      setHoveredLevel1(category.id)
                      setHoveredLevel2(null)
                    }}
                    onClick={() => {
                      handleCategorySelect(category)
                      window.location.href = `/${locale}/categories/${category.slug}`
                    }}
                    className={`w-full text-left px-6 py-3 text-sm font-medium transition-all duration-150 flex items-center justify-between group ${
                      hoveredLevel1 === category.id
                        ? 'bg-primary-500 text-white'
                        : 'text-neutral-300 hover:bg-secondary-700 hover:text-white'
                    }`}
                  >
                    <span>{category.name}</span>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <svg 
                        className={`w-4 h-4 transition-transform ${hoveredLevel1 === category.id ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              {/* View All Link */}
              <div className="px-6 pt-4 border-t border-secondary-700">
                <Link
                  href={`/${locale}/categories`}
                  onClick={handleMenuClose}
                  className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  {t('viewAllCategories')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right content area - Subcategories in grid */}
            <div className="flex-1 py-6 px-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              {hoveredLevel1 ? (
                <>
                  {/* Category header */}
                  <div className="mb-6">
                    <h2 className="text-white text-xl font-semibold mb-1">
                      {categories.find(cat => cat.id === hoveredLevel1)?.name}
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      {categories.find(cat => cat.id === hoveredLevel1)?.description || 
                       `${categories.find(cat => cat.id === hoveredLevel1)?.productCount || 0} ${t('products')}`}
                    </p>
                  </div>

                  {/* Subcategories grid */}
                  {categories.find(cat => cat.id === hoveredLevel1)?.subcategories && 
                   categories.find(cat => cat.id === hoveredLevel1)!.subcategories!.length > 0 ? (
                    <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                      {categories
                        .find(cat => cat.id === hoveredLevel1)
                        ?.subcategories?.map((subcategory) => (
                          <div key={subcategory.id} className="space-y-2">
                            <Link
                              href={`/${locale}/categories/${subcategory.slug}`}
                              onClick={() => handleCategorySelect(subcategory)}
                              className="text-white font-semibold text-sm hover:text-primary-400 transition-colors flex items-center gap-2"
                            >
                              {subcategory.name}
                              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                            {/* Level 3 subcategories */}
                            {subcategory.subcategories && subcategory.subcategories.length > 0 && (
                              <div className="space-y-1 pl-0">
                                {subcategory.subcategories.slice(0, 5).map((subSub) => (
                                  <Link
                                    key={subSub.id}
                                    href={`/${locale}/categories/${subSub.slug}`}
                                    onClick={() => handleCategorySelect(subSub)}
                                    className="block text-neutral-400 text-sm hover:text-primary-400 transition-colors py-0.5"
                                  >
                                    {subSub.name}
                                  </Link>
                                ))}
                                {subcategory.subcategories.length > 5 && (
                                  <Link
                                    href={`/${locale}/categories/${subcategory.slug}`}
                                    onClick={() => handleCategorySelect(subcategory)}
                                    className="block text-primary-400 text-sm hover:text-primary-300 transition-colors py-0.5 font-medium"
                                  >
                                    +{subcategory.subcategories.length - 5} {t('viewAll')}
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-neutral-400 text-sm">
                      <Link
                        href={`/${locale}/categories/${categories.find(cat => cat.id === hoveredLevel1)?.slug}`}
                        onClick={handleMenuClose}
                        className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium"
                      >
                        {t('viewAllProducts')}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                /* Default state - show featured or popular categories */
                <div>
                  <h2 className="text-white text-xl font-semibold mb-6">
                    {t('discoverOurProducts')}
                  </h2>
                  <div className="grid grid-cols-3 gap-6">
                    {categories.slice(0, 6).map((category) => (
                      <Link
                        key={category.id}
                        href={`/${locale}/categories/${category.slug}`}
                        onClick={() => handleCategorySelect(category)}
                        onMouseEnter={() => setHoveredLevel1(category.id)}
                        className="group p-4 bg-secondary-700/50 rounded-lg hover:bg-secondary-700 transition-all"
                      >
                        <h3 className="text-white font-semibold text-sm group-hover:text-primary-400 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-neutral-500 text-xs mt-1">
                          {category.productCount} {t('products')}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
