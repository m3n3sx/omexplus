'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'

interface BreadcrumbCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
}

interface CategoryBreadcrumbProps {
  categorySlug: string
  onNavigate?: (slug: string) => void
  className?: string
}

/**
 * CategoryBreadcrumb Component
 * 
 * Displays breadcrumb navigation showing the full path from root to current category.
 * Fetches breadcrumb data from API based on current slug.
 * 
 * Requirements: 6.4
 * Property 18: API Breadcrumb Endpoint Returns Correct Path
 * 
 * @param categorySlug - The slug of the current category
 * @param onNavigate - Optional callback when breadcrumb link is clicked
 * @param className - Optional additional CSS classes
 */
export function CategoryBreadcrumb({
  categorySlug,
  onNavigate,
  className = '',
}: CategoryBreadcrumbProps) {
  const locale = useLocale()
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch breadcrumb data on mount or when slug changes
  useEffect(() => {
    const fetchBreadcrumb = async () => {
      if (!categorySlug) {
        setBreadcrumb([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/categories/${categorySlug}/breadcrumb`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Category not found')
          }
          throw new Error(`Failed to fetch breadcrumb: ${response.statusText}`)
        }

        const data = await response.json()
        setBreadcrumb(data.breadcrumb || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load breadcrumb'
        setError(errorMessage)
        console.error('Error fetching breadcrumb:', err)
        setBreadcrumb([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBreadcrumb()
  }, [categorySlug])

  const handleNavigate = (slug: string) => {
    if (onNavigate) {
      onNavigate(slug)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <nav className={`breadcrumb breadcrumb--loading ${className}`} aria-label="Breadcrumb">
        <div className="flex items-center gap-2">
          <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
        </div>
      </nav>
    )
  }

  // Error state
  if (error) {
    return (
      <nav className={`breadcrumb breadcrumb--error ${className}`} aria-label="Breadcrumb">
        <div className="flex items-center gap-2 text-sm text-red-600">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </nav>
    )
  }

  // Empty state
  if (breadcrumb.length === 0) {
    return (
      <nav className={`breadcrumb breadcrumb--empty ${className}`} aria-label="Breadcrumb">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          No breadcrumb available
        </div>
      </nav>
    )
  }

  return (
    <nav className={`breadcrumb ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        {/* Home link */}
        <li>
          <Link
            href={`/${locale}`}
            className="text-primary-500 hover:text-primary-600 transition-colors font-medium"
            onClick={() => handleNavigate('')}
          >
            Home
          </Link>
        </li>

        {/* Breadcrumb items */}
        {breadcrumb.map((category, index) => {
          const isLast = index === breadcrumb.length - 1

          return (
            <li key={category.id} className="flex items-center gap-2">
              {/* Separator */}
              <svg
                className="w-4 h-4 text-neutral-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>

              {/* Category link or text */}
              {isLast ? (
                <span
                  className="text-neutral-700 font-medium"
                  aria-current="page"
                >
                  {category.name}
                </span>
              ) : (
                <Link
                  href={`/${locale}/categories/${category.slug}`}
                  className="text-primary-500 hover:text-primary-600 transition-colors font-medium"
                  onClick={() => handleNavigate(category.slug)}
                >
                  {category.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
