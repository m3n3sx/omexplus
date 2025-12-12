'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'

interface Category {
  id: string
  name: string
  name_en?: string
  slug: string
  description?: string
  icon?: string
  priority: number
  subcategoryCount?: number
  created_at?: string
  updated_at?: string
}

interface CategoryWithSubcategories extends Category {
  subcategories?: Category[]
}

interface CategoryFilterProps {
  categories?: Category[]
  selectedCategories?: string[]
  onFilterChange?: (categories: string[]) => void
  multiSelect?: boolean
  className?: string
  updateUrl?: boolean
}

/**
 * CategoryFilter Component
 * 
 * Displays category hierarchy as filter options with support for single and multi-select modes.
 * Updates URL parameters on filter change and emits filter change events to parent.
 * 
 * Requirements: 7.2, 7.4
 * Property 20: Category Filter Updates Product List
 * 
 * @param categories - Array of top-level categories to display
 * @param selectedCategories - Array of currently selected category IDs
 * @param onFilterChange - Callback when filter selection changes
 * @param multiSelect - Whether to allow multiple selections (default: true)
 * @param className - Optional additional CSS classes
 * @param updateUrl - Whether to update URL parameters (default: true)
 */
export function CategoryFilter({
  categories = [],
  selectedCategories = [],
  onFilterChange,
  multiSelect = true,
  className = '',
  updateUrl = true,
}: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()

  const [selected, setSelected] = useState<string[]>(selectedCategories)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [subcategoriesCache, setSubcategoriesCache] = useState<Record<string, Category[]>>({})
  const [loadingSubcategories, setLoadingSubcategories] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize selected categories from URL params on mount
  useEffect(() => {
    const categoryParam = searchParams.get('categories')
    if (categoryParam) {
      const urlCategories = categoryParam.split(',').filter(Boolean)
      setSelected(urlCategories)
    }
  }, [searchParams])

  // Fetch subcategories when expanding a category
  const handleCategoryExpand = async (categoryId: string, categorySlug: string) => {
    // If already cached, just toggle expansion
    if (subcategoriesCache[categoryId]) {
      setExpandedCategories((prev) => ({
        ...prev,
        [categoryId]: !prev[categoryId],
      }))
      return
    }

    try {
      setLoadingSubcategories((prev) => ({ ...prev, [categoryId]: true }))

      const response = await fetch(`/api/categories/${categorySlug}/subcategories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch subcategories: ${response.statusText}`)
      }

      const data = await response.json()
      setSubcategoriesCache((prev) => ({
        ...prev,
        [categoryId]: data.subcategories || [],
      }))

      setExpandedCategories((prev) => ({
        ...prev,
        [categoryId]: true,
      }))
    } catch (err) {
      console.error('Error fetching subcategories:', err)
      setError('Failed to load subcategories')
    } finally {
      setLoadingSubcategories((prev) => ({ ...prev, [categoryId]: false }))
    }
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    let newSelected: string[]

    if (multiSelect) {
      // Multi-select: toggle category in selection
      newSelected = selected.includes(categoryId)
        ? selected.filter((id) => id !== categoryId)
        : [...selected, categoryId]
    } else {
      // Single-select: replace selection
      newSelected = selected.includes(categoryId) ? [] : [categoryId]
    }

    setSelected(newSelected)

    // Emit filter change event
    if (onFilterChange) {
      onFilterChange(newSelected)
    }

    // Update URL parameters
    if (updateUrl) {
      updateUrlParams(newSelected)
    }
  }

  // Update URL parameters
  const updateUrlParams = (selectedIds: string[]) => {
    const params = new URLSearchParams(searchParams)

    if (selectedIds.length > 0) {
      params.set('categories', selectedIds.join(','))
    } else {
      params.delete('categories')
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.push(newUrl)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSelected([])
    setExpandedCategories({})

    if (onFilterChange) {
      onFilterChange([])
    }

    if (updateUrl) {
      const params = new URLSearchParams(searchParams)
      params.delete('categories')
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
      router.push(newUrl)
    }
  }

  // Loading state
  if (isLoading && categories.length === 0) {
    return (
      <div className={`category-filter category-filter--loading ${className}`}>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-full bg-neutral-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error && categories.length === 0) {
    return (
      <div className={`category-filter category-filter--error ${className}`}>
        <div className="flex items-center gap-2 text-sm text-red-600">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    )
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className={`category-filter category-filter--empty ${className}`}>
        <div className="text-sm text-neutral-500">No categories available</div>
      </div>
    )
  }

  return (
    <div className={`category-filter ${className}`}>
      <div className="space-y-2">
        {/* Category list */}
        <fieldset className="space-y-1">
          <legend className="sr-only">Filter by category</legend>

          {categories.map((category) => (
            <div key={category.id} className="space-y-1">
              {/* Main category checkbox */}
              <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-2 rounded transition-colors group">
                <input
                  type={multiSelect ? 'checkbox' : 'radio'}
                  name={multiSelect ? undefined : 'category-filter'}
                  checked={selected.includes(category.id)}
                  onChange={() => handleCategorySelect(category.id)}
                  className="w-4 h-4 text-primary-500 bg-white border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                  aria-label={`Filter by ${category.name}`}
                />
                <span className="text-sm text-neutral-700 group-hover:text-neutral-900 font-medium flex-1">
                  {category.name}
                </span>

                {/* Expand/collapse button for subcategories */}
                {(category.subcategoryCount ?? 0) > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleCategoryExpand(category.id, category.slug)
                    }}
                    className="p-1 hover:bg-neutral-200 rounded transition-colors"
                    aria-expanded={expandedCategories[category.id] ?? false}
                    aria-label={`${expandedCategories[category.id] ? 'Collapse' : 'Expand'} ${category.name} subcategories`}
                  >
                    <svg
                      className={`w-4 h-4 text-neutral-500 transition-transform ${
                        expandedCategories[category.id] ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </label>

              {/* Subcategories */}
              {expandedCategories[category.id] && (
                <div className="ml-6 space-y-1 border-l-2 border-neutral-200 pl-2">
                  {loadingSubcategories[category.id] ? (
                    <div className="px-2 py-1 text-xs text-neutral-500">Loading...</div>
                  ) : (subcategoriesCache[category.id]?.length ?? 0) > 0 ? (
                    (subcategoriesCache[category.id] || []).map((subcategory) => (
                      <label
                        key={subcategory.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-2 rounded transition-colors group"
                      >
                        <input
                          type={multiSelect ? 'checkbox' : 'radio'}
                          name={multiSelect ? undefined : 'category-filter'}
                          checked={selected.includes(subcategory.id)}
                          onChange={() => handleCategorySelect(subcategory.id)}
                          className="w-4 h-4 text-primary-500 bg-white border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                          aria-label={`Filter by ${subcategory.name}`}
                        />
                        <span className="text-sm text-neutral-600 group-hover:text-neutral-900">
                          {subcategory.name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className="px-2 py-1 text-xs text-neutral-400">No subcategories</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </fieldset>

        {/* Clear filters button */}
        {selected.length > 0 && (
          <button
            onClick={handleClearFilters}
            className="w-full mt-4 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors border border-primary-200"
            aria-label="Clear all category filters"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
