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
            className="nav-item__trigger flex items-center gap-1 text-neutral-900 font-bold hover:text-neutral-700 transition-colors px-4 py-2 text-sm uppercase"
          >
            PRODUCTS
          </button>
        </div>
      </nav>

      {/* Full-width mega menu portal */}
      {isMenuOpen && (
        <div
          className="mega-menu fixed left-0 right-0 bg-white shadow-2xl border-t-4 border-secondary-600 py-8 max-h-[600px] overflow-y-auto z-50"
          style={{ top: '120px' }}
          onMouseEnter={handleMenuOpen}
          onMouseLeave={handleMenuClose}
        >
          <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
            {/* Dynamic 3-column layout: Categories expand as needed + Featured Products always visible */}
            <div className="mega-menu__dynamic-grid flex gap-6">
              {/* Column 1: Main Categories (Level 1) - Always visible */}
              <div className="mega-menu__level-1 w-80 flex-shrink-0">
                <div className="space-y-1">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onMouseEnter={() => {
                        setHoveredLevel1(category.id)
                        setHoveredLevel2(null)
                      }}
                      className="relative"
                    >
                      <Link
                        href={`/${locale}/categories/${category.slug}`}
                        onClick={() => handleCategorySelect(category)}
                        className={`block px-4 py-2.5 text-sm font-bold rounded-md transition-colors ${
                          hoveredLevel1 === category.id
                            ? 'bg-secondary-50 text-secondary-600'
                            : 'text-neutral-900 hover:bg-neutral-50 hover:text-secondary-600'
                        }`}
                      >
                        {category.name}
                        {category.productCount > 0 && (
                          <span className="ml-2 text-xs text-neutral-500 font-normal">
                            ({category.productCount})
                          </span>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Subcategories (Level 2) - Shows only when Level 1 is hovered */}
              {hoveredLevel1 && categories.find(cat => cat.id === hoveredLevel1)?.subcategories && 
               categories.find(cat => cat.id === hoveredLevel1)!.subcategories!.length > 0 && (
                <div className="mega-menu__level-2 w-72 flex-shrink-0 border-l border-neutral-200 pl-6">
                  <div className="space-y-1">
                    {categories
                      .find(cat => cat.id === hoveredLevel1)
                      ?.subcategories?.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          onMouseEnter={() => setHoveredLevel2(subcategory.id)}
                          className="relative"
                        >
                          <Link
                            href={`/${locale}/categories/${subcategory.slug}`}
                            onClick={() => handleCategorySelect(subcategory)}
                            className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                              hoveredLevel2 === subcategory.id
                                ? 'bg-secondary-50 text-secondary-600 font-medium'
                                : 'text-neutral-700 hover:bg-neutral-50 hover:text-secondary-600'
                            }`}
                          >
                            {subcategory.name}
                            {subcategory.productCount > 0 && (
                              <span className="ml-2 text-xs text-neutral-400 font-normal">
                                ({subcategory.productCount})
                              </span>
                            )}
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Column 3: Sub-subcategories (Level 3) - Shows only when Level 2 is hovered and has children */}
              {hoveredLevel2 && hoveredLevel1 && 
               categories.find(cat => cat.id === hoveredLevel1)
                 ?.subcategories?.find(sub => sub.id === hoveredLevel2)
                 ?.subcategories && 
               categories.find(cat => cat.id === hoveredLevel1)!
                 .subcategories!.find(sub => sub.id === hoveredLevel2)!
                 .subcategories!.length > 0 && (
                <div className="mega-menu__level-3 w-72 flex-shrink-0 border-l border-neutral-200 pl-6">
                  <div className="space-y-1 max-h-[500px] overflow-y-auto">
                    {categories
                      .find(cat => cat.id === hoveredLevel1)
                      ?.subcategories?.find(sub => sub.id === hoveredLevel2)
                      ?.subcategories?.map((subSubcategory) => (
                        <Link
                          key={subSubcategory.id}
                          href={`/${locale}/categories/${subSubcategory.slug}`}
                          onClick={() => handleCategorySelect(subSubcategory)}
                          className="block px-4 py-2 text-sm text-neutral-600 hover:text-secondary-600 hover:bg-neutral-50 rounded-md transition-colors"
                        >
                          {subSubcategory.name}
                          {subSubcategory.productCount > 0 && (
                            <span className="ml-2 text-xs text-neutral-400">
                              ({subSubcategory.productCount})
                            </span>
                          )}
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* Featured Products Column - Always visible on the right */}
              <div className="mega-menu__featured-products flex-1 border-l border-neutral-200 pl-6 min-w-[320px]">
                {/* Featured Products Section Header */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase">
                    {t('featuredProducts')}
                  </h3>
                </div>

                {/* Featured Products List or Fallback */}
                {featuredProducts.length > 0 ? (
                  <div className="space-y-3">
                    {featuredProducts.map((product) => (
                      <FeaturedProductCard
                        key={product.id}
                        product={product}
                        locale={locale}
                        onClick={handleMenuClose}
                      />
                    ))}
                  </div>
                ) : (
                  /* View All Products CTA Fallback */
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-sm text-neutral-600 mb-4">
                      {featuredProductsError 
                        ? t('unableToLoadFeaturedProducts')
                        : t('noFeaturedProductsAvailable')}
                    </p>
                    <Link
                      href={`/${locale}/products`}
                      onClick={handleMenuClose}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary-600 text-white text-sm font-medium rounded-md hover:bg-secondary-700 transition-colors"
                    >
                      {t('viewAllProducts')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
