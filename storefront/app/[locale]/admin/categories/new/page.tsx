'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
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
 * Add Category Page
 * 
 * Provides a page for creating new categories with:
 * - CategoryForm component for input
 * - Loading and error states
 * - Success/error messaging
 * - Refresh category list on success
 * 
 * Requirements: 9.2
 */
export default function AddCategoryPage() {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations()

  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch all categories for parent selection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/categories/tree', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`)
        }

        const data = await response.json()
        
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

        const flatCategories = flattenCategories(data.tree || [])
        setAllCategories(flatCategories)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load categories'
        setError(errorMessage)
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  /**
   * Handle successful category creation
   */
  const handleSuccess = (category: Category) => {
    setSuccessMessage(`Category "${category.name}" created successfully!`)
    
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
              <p className="text-neutral-600 font-medium">Loading categories...</p>
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

        {/* Error Message */}
        {error && (
          <div className="mb-8 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <CategoryForm
          allCategories={allCategories}
          onSuccess={handleSuccess}
          locale={locale}
        />
      </div>
    </div>
  )
}
