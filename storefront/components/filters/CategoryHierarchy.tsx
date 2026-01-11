'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  parent_category_id?: string | null
  subcategories?: Category[]
  product_count?: number
}

interface CategoryHierarchyProps {
  currentCategory: Category
  rootCategory: Category
  allSubcategories: Category[]
  onCategorySelect?: (categoryId: string) => void
}

export function CategoryHierarchy({ 
  currentCategory, 
  rootCategory,
  allSubcategories,
  onCategorySelect 
}: CategoryHierarchyProps) {
  const locale = useLocale()
  const t = useTranslations('templates.category')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([rootCategory.id, currentCategory.id]))

  // Build hierarchy tree
  const buildHierarchy = (categories: Category[], parentId: string | null = null): Category[] => {
    return categories
      .filter(cat => cat.parent_category_id === parentId)
      .map(cat => ({
        ...cat,
        subcategories: buildHierarchy(categories, cat.id)
      }))
  }

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.subcategories && category.subcategories.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const isCurrent = category.id === currentCategory.id
    const paddingLeft = level * 16

    return (
      <div key={category.id}>
        <div 
          className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
            isCurrent 
              ? 'bg-secondary-50 text-secondary-700 font-bold' 
              : 'hover:bg-neutral-50 text-neutral-700'
          }`}
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
        >
          <Link
            href={`/${locale}/categories/${category.slug}`}
            className="flex-1 text-sm"
            onClick={() => onCategorySelect?.(category.id)}
          >
            {category.name}
            {category.product_count !== undefined && (
              <span className="ml-2 text-xs text-neutral-400">
                ({category.product_count})
              </span>
            )}
          </Link>
          
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault()
                toggleExpand(category.id)
              }}
              className="ml-2 p-1 hover:bg-neutral-100 rounded transition-colors"
            >
              <svg
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {category.subcategories!.map(subcat => renderCategory(subcat, level + 1))}
          </div>
        )}
      </div>
    )
  }

  // Build the hierarchy starting from root category (not current)
  const hierarchy = buildHierarchy(allSubcategories, rootCategory.id)

  // Auto-expand path to current category
  useEffect(() => {
    const newExpanded = new Set<string>([rootCategory.id])
    
    // Find and expand all ancestors of current category
    const findAncestors = (categoryId: string) => {
      const cat = allSubcategories.find(c => c.id === categoryId)
      if (cat?.parent_category_id) {
        newExpanded.add(cat.parent_category_id)
        findAncestors(cat.parent_category_id)
      }
    }
    
    findAncestors(currentCategory.id)
    newExpanded.add(currentCategory.id)
    setExpandedCategories(newExpanded)
  }, [currentCategory.id, rootCategory.id, allSubcategories])

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold text-neutral-900 mb-4">{t('categories')}</h3>
      
      {/* Root category */}
      <div className="mb-2">
        <Link
          href={`/${locale}/categories/${rootCategory.slug}`}
          className={`block py-2 px-3 rounded-md transition-colors ${
            currentCategory.id === rootCategory.id
              ? 'bg-secondary-50 text-secondary-700 font-bold'
              : 'hover:bg-neutral-50 text-neutral-700 font-semibold'
          }`}
        >
          {rootCategory.name}
        </Link>
      </div>

      {/* Subcategories */}
      {hierarchy.length > 0 ? (
        <div className="space-y-1">
          {hierarchy.map(cat => renderCategory(cat, 1))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500 py-4">
          {t('noSubcategories')}
        </p>
      )}
    </div>
  )
}
