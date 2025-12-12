'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  priority: number
  productCount: number
  subcategories?: Category[]
}

export function CategoryMenuBar() {
  const locale = useLocale()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/categories/hierarchy')
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }

        const data = await response.json()
        setCategories(data.categories || [])
      } catch (err) {
        console.error('Error fetching categories:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-neutral-100 border-b border-neutral-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
          <div className="h-12 flex items-center">
            <div className="h-4 w-32 bg-neutral-300 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <div className="bg-neutral-100 border-b border-neutral-200 relative">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        <nav className="flex items-center">
          {categories.map((category, index) => (
            <div key={category.id} className="flex items-center">
              <div
                className="relative"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  href={`/${locale}/categories/${category.slug}`}
                  className="block px-4 py-3 text-sm font-semibold text-neutral-700 hover:text-secondary-600 hover:bg-white transition-colors"
                >
                  {category.name}
                </Link>

                {/* Mega menu dropdown */}
                {hoveredCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
                  <div
                    className="absolute top-full left-0 bg-white shadow-xl border border-neutral-200 rounded-b-lg py-4 min-w-[800px] z-50"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="grid grid-cols-3 gap-6 px-6 max-h-[500px] overflow-y-auto">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="space-y-2">
                          {/* Level 2: Subcategory */}
                          <Link
                            href={`/${locale}/categories/${subcategory.slug}`}
                            className="block px-3 py-2 text-sm font-bold text-neutral-900 hover:text-secondary-600 transition-colors border-b border-neutral-200"
                          >
                            {subcategory.name}
                            {subcategory.productCount > 0 && (
                              <span className="ml-2 text-xs text-neutral-500 font-normal">
                                ({subcategory.productCount})
                              </span>
                            )}
                          </Link>

                          {/* Level 3: Sub-subcategories */}
                          {subcategory.subcategories && subcategory.subcategories.length > 0 && (
                            <div className="space-y-1 ml-2">
                              {subcategory.subcategories.map((subSubcategory) => (
                                <Link
                                  key={subSubcategory.id}
                                  href={`/${locale}/categories/${subSubcategory.slug}`}
                                  className="block px-2 py-1 text-xs text-neutral-600 hover:text-secondary-600 hover:bg-neutral-50 rounded transition-colors"
                                >
                                  → {subSubcategory.name}
                                  {subSubcategory.productCount > 0 && (
                                    <span className="ml-1 text-xs text-neutral-400">
                                      ({subSubcategory.productCount})
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-neutral-200 mt-4 pt-3 px-6">
                      <Link
                        href={`/${locale}/categories/${category.slug}`}
                        className="text-sm text-secondary-600 hover:text-secondary-700 font-semibold"
                      >
                        Zobacz wszystkie w kategorii {category.name} →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Separator */}
              {index < categories.length - 1 && (
                <span className="text-neutral-400 text-lg font-light px-1">/</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
