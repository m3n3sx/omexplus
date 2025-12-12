'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { CategoryBreadcrumb } from '@/components/navigation/CategoryBreadcrumb'
import { CategoryHierarchy } from '@/components/filters/CategoryHierarchy'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'

interface Category {
  id: string
  name: string
  name_en?: string
  slug: string
  description?: string
  icon?: string
  priority: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

interface CategoryResponse {
  category: Category
  subcategories: Category[]
  allSubcategories: Category[]
  breadcrumb: Array<{ id: string; name: string; slug: string }>
  subcategoryCount: number
}

interface Product {
  id: string
  title: string
  handle: string
  sku?: string
  description?: string
  thumbnail?: string
  variants: Array<{
    id?: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

/**
 * CategoryPage Component
 * 
 * Displays a category page with:
 * - Category name, description, and breadcrumb navigation
 * - Subcategories as grid or list
 * - Products filtered by category
 * 
 * Requirements: 6.3, 6.5, 7.1
 * Property 20: Category Filter Updates Product List
 */
export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const slug = params.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [allSubcategories, setAllSubcategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch category data on mount or when slug changes
  useEffect(() => {
    async function loadCategoryData() {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/categories/${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Category not found')
          }
          throw new Error(`Failed to fetch category: ${response.statusText}`)
        }

        const data: CategoryResponse = await response.json()
        setCategory(data.category)
        setAllSubcategories(data.allSubcategories || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load category'
        setError(errorMessage)
        console.error('Error fetching category:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCategoryData()
  }, [slug, searchParams])



  // Fetch products when category or filters change
  useEffect(() => {
    async function loadProducts() {
      if (!category) return

      try {
        setProductsLoading(true)

        // Build query parameters for product filtering
        const params = new URLSearchParams()
        params.set('limit', '20')
        params.set('offset', '0')
        params.append('category_id', category.id)

        // Use local API route that queries database directly
        const response = await fetch(
          `/api/products/by-category?${params.toString()}`
        )

        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        } else {
          console.error('Failed to fetch products:', response.statusText)
          setProducts([])
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setProducts([])
      } finally {
        setProductsLoading(false)
      }
    }

    loadProducts()
  }, [category])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4" />
          </div>
          <p className="text-neutral-600 font-medium">Loading category...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📁</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Category not found</h1>
          <p className="text-neutral-600 mb-6">{error || 'The category you are looking for does not exist.'}</p>
          <Link
            href={`/${locale}`}
            className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-neutral-200 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <CategoryBreadcrumb categorySlug={slug} />
        </div>
      </div>

      {/* Category Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-neutral-600 mb-4">
              {category.description}
            </p>
          )}
          <div className="text-sm text-neutral-500">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </div>
        </div>

        {/* Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Category Hierarchy */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CategoryHierarchy
                currentCategory={category}
                allSubcategories={allSubcategories}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm h-80 animate-pulse"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCardTemplate key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-600 mb-6">
                  There are no products in this category yet.
                </p>
                <Link
                  href={`/${locale}/products`}
                  className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  View all products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
