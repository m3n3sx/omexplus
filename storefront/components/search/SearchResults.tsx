'use client'

/**
 * SearchResults Component - Display search results with grid/list view
 * Full implementation with pagination, sorting, quick view
 */

import { useState } from 'react'

interface SearchResultsProps {
  products: any[]
  total: number
  page?: number
  limit?: number
  hasMore?: boolean
  loading?: boolean
  viewMode?: 'grid' | 'list'
  onPageChange?: (page: number) => void
  onViewModeChange?: (mode: 'grid' | 'list') => void
  onQuickView?: (product: any) => void
  onAddToCart?: (product: any) => void
  onCompare?: (product: any, checked: boolean) => void
}

export default function SearchResults({
  products,
  total,
  page = 1,
  limit = 12,
  hasMore = false,
  loading = false,
  viewMode: initialViewMode = 'grid',
  onPageChange,
  onViewModeChange,
  onQuickView,
  onAddToCart,
  onCompare,
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode)
  const [selectedForCompare, setSelectedForCompare] = useState<Set<string>>(new Set())

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    if (onViewModeChange) {
      onViewModeChange(mode)
    }
  }

  const handleCompareToggle = (product: any) => {
    const newSelected = new Set(selectedForCompare)
    if (newSelected.has(product.id)) {
      newSelected.delete(product.id)
    } else {
      if (newSelected.size >= 4) {
        alert('Możesz porównać maksymalnie 4 produkty')
        return
      }
      newSelected.add(product.id)
    }
    setSelectedForCompare(newSelected)
    if (onCompare) {
      onCompare(product, newSelected.has(product.id))
    }
  }

  const totalPages = Math.ceil(total / limit)

  const ProductCard = ({ product }: { product: any }) => (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: viewMode === 'grid' ? 'column' : 'row',
      gap: '1rem',
      position: 'relative',
      transition: 'all 0.2s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      {/* Compare Checkbox */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        left: '0.5rem',
        zIndex: 10,
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          cursor: 'pointer',
          fontSize: '0.75rem',
          backgroundColor: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          border: '1px solid #e5e7eb',
        }}>
          <input
            type="checkbox"
            checked={selectedForCompare.has(product.id)}
            onChange={() => handleCompareToggle(product)}
          />
          Porównaj
        </label>
      </div>

      {/* Product Image */}
      <div style={{
        width: viewMode === 'grid' ? '100%' : '200px',
        height: viewMode === 'grid' ? '200px' : '150px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: viewMode === 'grid' ? '1.5rem' : '0',
      }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <div style={{ fontSize: '3rem', color: '#d1d5db' }}>📦</div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Part Number */}
        <div style={{
          fontSize: '0.75rem',
          color: '#6b7280',
          marginBottom: '0.25rem',
        }}>
          {product.partNumber || product.sku}
        </div>

        {/* Product Name */}
        <h3 style={{
          fontSize: viewMode === 'grid' ? '1rem' : '1.125rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          lineHeight: '1.4',
        }}>
          {product.name || product.title}
        </h3>

        {/* Description (list view only) */}
        {viewMode === 'list' && product.description && (
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.75rem',
            lineHeight: '1.5',
          }}>
            {product.description.substring(0, 150)}...
          </p>
        )}

        {/* Part Type Badge */}
        {product.partType && (
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: product.partType === 'OEM' ? '#dbeafe' : '#fef3c7',
              color: product.partType === 'OEM' ? '#1e40af' : '#92400e',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '600',
            }}>
              {product.partType}
            </span>
          </div>
        )}

        {/* Compatibility */}
        {product.compatibility && product.compatibility.length > 0 && (
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
          }}>
            Pasuje do: {product.compatibility.slice(0, 3).join(', ')}
            {product.compatibility.length > 3 && ` +${product.compatibility.length - 3}`}
          </div>
        )}

        {/* Rating */}
        {product.rating && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
          }}>
            <div style={{ color: '#f59e0b', fontSize: '0.875rem' }}>
              {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Price and Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #e5e7eb',
        }}>
          <div>
            <div style={{
              fontSize: viewMode === 'grid' ? '1.25rem' : '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
            }}>
              {product.price} {product.currency || 'PLN'}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: product.availability === 'in-stock' ? '#16a34a' : '#f59e0b',
              fontWeight: '600',
              marginTop: '0.25rem',
            }}>
              {product.availability === 'in-stock' ? '✓ Na magazynie' : 
               product.availability === 'order-2-5-days' ? '📦 2-5 dni' :
               product.availability === 'order-2-4-weeks' ? '📦 2-4 tygodnie' :
               '❌ Niedostępne'}
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: viewMode === 'grid' ? 'column' : 'row',
            gap: '0.5rem',
          }}>
            {onQuickView && (
              <button
                onClick={() => onQuickView(product)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                }}
              >
                👁️ Podgląd
              </button>
            )}
            <button
              onClick={() => onAddToCart && onAddToCart(product)}
              disabled={product.availability === 'discontinued'}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: product.availability === 'discontinued' ? '#e5e7eb' : '#3b82f6',
                color: 'white',
                cursor: product.availability === 'discontinued' ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                whiteSpace: 'nowrap',
              }}
            >
              🛒 Dodaj
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
      }}>
        <div style={{
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            animation: 'spin 1s linear infinite',
          }}>
            ⚙️
          </div>
          <div style={{ fontSize: '1rem', color: '#6b7280' }}>
            Ładowanie wyników...
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Nie znaleziono wyników
        </h3>
        <p style={{ fontSize: '1rem', color: '#6b7280' }}>
          Spróbuj zmienić kryteria wyszukiwania lub filtry
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header with view toggle and results count */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
      }}>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Znaleziono <strong>{total}</strong> {total === 1 ? 'produkt' : 'produktów'}
          {page > 1 && ` (strona ${page} z ${totalPages})`}
        </div>

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          padding: '0.25rem',
          backgroundColor: 'white',
        }}>
          <button
            onClick={() => handleViewModeChange('grid')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: viewMode === 'grid' ? '#3b82f6' : 'transparent',
              color: viewMode === 'grid' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            ⊞ Siatka
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: viewMode === 'list' ? '#3b82f6' : 'transparent',
              color: viewMode === 'list' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            ☰ Lista
          </button>
        </div>
      </div>

      {/* Compare Bar */}
      {selectedForCompare.size > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <span>
            Wybrano {selectedForCompare.size} {selectedForCompare.size === 1 ? 'produkt' : 'produkty'} do porównania
          </span>
          <button
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#3b82f6',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            Porównaj
          </button>
          <button
            onClick={() => setSelectedForCompare(new Set())}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid white',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Wyczyść
          </button>
        </div>
      )}

      {/* Products Grid/List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'grid' 
          ? 'repeat(auto-fill, minmax(280px, 1fr))' 
          : '1fr',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '2rem',
        }}>
          <button
            onClick={() => onPageChange && onPageChange(page - 1)}
            disabled={page === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              backgroundColor: page === 1 ? '#f9fafb' : 'white',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
            }}
          >
            ← Poprzednia
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum
            if (totalPages <= 7) {
              pageNum = i + 1
            } else if (page <= 4) {
              pageNum = i + 1
            } else if (page >= totalPages - 3) {
              pageNum = totalPages - 6 + i
            } else {
              pageNum = page - 3 + i
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange && onPageChange(pageNum)}
                style={{
                  padding: '0.5rem 1rem',
                  border: page === pageNum ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: page === pageNum ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: page === pageNum ? '600' : 'normal',
                  minWidth: '40px',
                }}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            onClick={() => onPageChange && onPageChange(page + 1)}
            disabled={!hasMore && page === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              backgroundColor: (!hasMore && page === totalPages) ? '#f9fafb' : 'white',
              cursor: (!hasMore && page === totalPages) ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Następna →
          </button>
        </div>
      )}

      {/* Load More Button (alternative to pagination) */}
      {hasMore && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem',
        }}>
          <button
            onClick={() => onPageChange && onPageChange(page + 1)}
            style={{
              padding: '0.75rem 2rem',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#3b82f6',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
            }}
          >
            Załaduj więcej
          </button>
        </div>
      )}
    </div>
  )
}
