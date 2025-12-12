'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import CategoryTreeView from '@/components/admin/CategoryTreeView'

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

interface CategoryTree extends Category {
  children?: CategoryTree[]
}

/**
 * Admin Category Management Page
 * 
 * Displays all categories in a hierarchical tree view with:
 * - Category count and metadata
 * - Loading and error states
 * - Add, edit, delete functionality
 * 
 * Requirements: 9.1
 */
export default function AdminCategoriesPage() {
  const locale = useLocale()
  const [categories, setCategories] = useState<CategoryTree[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  // Fetch category tree on mount
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
        setCategories(data.tree || [])
        setTotalCount(data.count || 0)
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Category Management</h1>
              <p className="text-neutral-600">Manage product categories and hierarchy</p>
            </div>
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Category Management</h1>
              <p className="text-neutral-600">Manage product categories and hierarchy</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Error Loading Categories</h3>
                <p className="text-neutral-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Category Management</h1>
            <p className="text-neutral-600">Manage product categories and hierarchy</p>
          </div>
          <Link
            href={`/${locale}/admin/categories/new`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 font-medium">Total Categories</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">{totalCount}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 font-medium">Main Categories</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {categories.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-7 7m0 0l7 7m-7-7h18" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 font-medium">Last Updated</p>
                <p className="text-lg font-bold text-neutral-900 mt-2">
                  {new Date().toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tree */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {categories.length > 0 ? (
            <div className="p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Category Hierarchy</h2>
              <CategoryTreeView categories={categories} locale={locale} />
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📁</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No categories found</h3>
              <p className="text-neutral-600 mb-6">
                Start by creating your first category to organize your products.
              </p>
              <Link
                href={`/${locale}/admin/categories/new`}
                className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Create First Category
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
