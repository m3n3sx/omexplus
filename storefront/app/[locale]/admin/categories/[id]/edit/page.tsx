'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import CategoryForm from '@/components/admin/CategoryForm'

interface Category {
  id: string
  name: string
  name_en?: string
  slug: string
  description?: string
  icon?: string
  priority: number
  parent_id?: string | null
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

/**
 * Edit Category Page
 * 
 * Provides a page for editing existing categories with:
 * - CategoryForm component pre-populated with existing data
 * - Circular reference prevention
 * - Success/error messaging
 * - Cache invalidation on update
 * 
 * Requirements: 9.3, 9.5
 */
export default function EditCategoryPage() {
  const locale = useLocale()
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch category and all categories for parent selection
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch the specific category
        const categoryResponse = await fetch(`/api/categories/${categoryId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!categoryResponse.ok) {
          if (categoryResponse.status === 404) {
            throw new Error('Category not found')
          }
          throw new Error(`Failed to fetch category: ${categoryResponse.statusText}`)
        }

        const categoryData = await categoryResponse.json()
        setCategory(categoryData)

        // Fetch all categories for parent selection
        const treeResponse = await fetch('/api/categories/tree', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!treeResponse.ok) {
          throw new Error(`Failed to fetch categories: ${treeResponse.statusText}`)
        }

        const treeData = await treeResponse.json()

        // Flatten the tree structure to get all categories
        const flattenCategories = (categories: any[]): Category[] => {
          const result: Category[] = []
          const traverse = (cats: any[]) => {
            cats.forEach((cat) => {
              result.push(cat)
              if (cat.children && cat.children.length > 0) {
                traverse(cat.children)
              }
            })
          }
          traverse(categories)
          return result
        }

        const flatCategories = flattenCategories(treeData.tree || [])
        setAllCategories(flatCategories)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load category'
        setError(errorMessage)
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchData()
    }
  }, [categoryId])

  /**
   * Handle successful category update
   */
  const handleSuccess = (updatedCategory: Category) => {
    setSuccessMessage(`Category "${updatedCategory.name}" updated successfully!`)

    // Redirect to categories page after a short delay
    setTimeout(() => {
      router.push(`/${locale}/admin/categories`)
    }, 1500)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href={`/${locale}/admin/categories`}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Categories
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4" />
              </div>
              <p className="text-neutral-600 font-medium">Loading category...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href={`/${locale}/admin/categories`}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Categories
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Error Loading Category</h3>
                <p className="text-neutral-600 mb-4">{error}</p>
                <Link
                  href={`/${locale}/admin/categories`}
                  className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  Back to Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Category not found
  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href={`/${locale}/admin/categories`}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Categories
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Category Not Found</h3>
              <p className="text-neutral-600 mb-4">The category you're looking for doesn't exist.</p>
              <Link
                href={`/${locale}/admin/categories`}
                className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Back to Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href={`/${locale}/admin/categories`}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Categories
        </Link>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-green-900">Success</h3>
              <p className="text-green-700 text-sm mt-1">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <CategoryForm
          initialCategory={category}
          allCategories={allCategories}
          onSuccess={handleSuccess}
          locale={locale}
        />
      </div>
    </div>
  )
}
