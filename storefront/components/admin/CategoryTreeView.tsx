'use client'

import { useState } from 'react'
import Link from 'next/link'

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

interface CategoryTreeViewProps {
  categories: CategoryTree[]
  locale: string
  level?: number
}

/**
 * CategoryTreeView Component
 * 
 * Displays categories in a hierarchical tree view with:
 * - Expandable/collapsible nodes
 * - Edit and delete actions
 * - Category metadata display
 * 
 * Requirements: 9.1
 */
export default function CategoryTreeView({
  categories,
  locale,
  level = 0,
}: CategoryTreeViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Subcategories will be orphaned.')) {
      return
    }

    try {
      setDeletingId(id)
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.statusText}`)
      }

      // Refresh the page to show updated tree
      window.location.reload()
    } catch (err) {
      console.error('Error deleting category:', err)
      alert('Failed to delete category. Please try again.')
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <CategoryTreeNode
          key={category.id}
          category={category}
          locale={locale}
          level={level}
          isExpanded={expandedIds.has(category.id)}
          onToggleExpanded={toggleExpanded}
          onDelete={handleDelete}
          isDeleting={deletingId === category.id}
        />
      ))}
    </div>
  )
}

interface CategoryTreeNodeProps {
  category: CategoryTree
  locale: string
  level: number
  isExpanded: boolean
  onToggleExpanded: (id: string) => void
  onDelete: (id: string) => void
  isDeleting: boolean
}

function CategoryTreeNode({
  category,
  locale,
  level,
  isExpanded,
  onToggleExpanded,
  onDelete,
  isDeleting,
}: CategoryTreeNodeProps) {
  const hasChildren = category.children && category.children.length > 0
  const paddingLeft = level * 24

  return (
    <div>
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-neutral-50 transition-colors group"
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            onClick={() => onToggleExpanded(category.id)}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div className="flex-shrink-0 w-6" />
        )}

        {/* Category Icon */}
        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-semibold">
          {category.icon || '📁'}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-neutral-900 truncate">{category.name}</h3>
            {category.name_en && (
              <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                {category.name_en}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-neutral-500">
              Slug: <code className="bg-neutral-100 px-2 py-0.5 rounded">{category.slug}</code>
            </p>
            {category.metadata?.productCount && (
              <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                {category.metadata.productCount} products
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/${locale}/admin/categories/${category.id}/edit`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
            title="Edit category"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <button
            onClick={() => onDelete(category.id)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete category"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          <CategoryTreeView
            categories={category.children!}
            locale={locale}
            level={level + 1}
          />
        </div>
      )}
    </div>
  )
}
