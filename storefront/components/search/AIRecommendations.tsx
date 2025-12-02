'use client'

/**
 * AIRecommendations Component - AI-powered product recommendations
 * FUNKCJA 2: REKOMENDACJE AI
 */

import { useState, useEffect } from 'react'

interface RecommendedPart {
  id: string
  name: string
  partNumber: string
  price: number
  currency: string
  image?: string
  reason: string
  relevanceScore: number
}

interface AIRecommendationsProps {
  currentPartId?: string
  currentPartType?: string
  cartItems?: string[]
  onAddToCart?: (partId: string) => void
  onViewDetails?: (partId: string) => void
}

export default function AIRecommendations({
  currentPartId,
  currentPartType,
  cartItems = [],
  onAddToCart,
  onViewDetails,
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedPart[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentPartId || currentPartType || cartItems.length > 0) {
      fetchRecommendations()
    }
  }, [currentPartId, currentPartType, cartItems])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const response = await fetch(`${backendUrl}/store/omex-search/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPartId,
          currentPartType,
          cartItems,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Analizuję rekomendacje...
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '2rem' }}>🤖</div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Rekomendacje AI
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Klienci którzy kupili tę część, kupili również:
          </p>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        {recommendations.map((part) => (
          <div
            key={part.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onClick={() => onViewDetails && onViewDetails(part.id)}
          >
            {/* Relevance Badge */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '0.75rem',
            }}>
              <span style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}>
                {Math.round(part.relevanceScore * 100)}% dopasowanie
              </span>
            </div>

            {/* Image */}
            <div style={{
              width: '100%',
              height: '120px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}>
              {part.image ? (
                <img
                  src={part.image}
                  alt={part.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <div style={{ fontSize: '2.5rem', color: '#d1d5db' }}>📦</div>
              )}
            </div>

            {/* Part Number */}
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              fontFamily: 'monospace',
              marginBottom: '0.25rem',
            }}>
              {part.partNumber}
            </div>

            {/* Name */}
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              lineHeight: '1.4',
              minHeight: '2.8em',
            }}>
              {part.name}
            </h4>

            {/* Reason */}
            <div style={{
              fontSize: '0.75rem',
              color: '#3b82f6',
              backgroundColor: '#eff6ff',
              padding: '0.5rem',
              borderRadius: '4px',
              marginBottom: '0.75rem',
              lineHeight: '1.4',
            }}>
              💡 {part.reason}
            </div>

            {/* Price */}
            <div style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#16a34a',
              marginBottom: '0.75rem',
            }}>
              {part.price} {part.currency}
            </div>

            {/* Add to Cart Button */}
            {onAddToCart && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart(part.id)
                }}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
              >
                🛒 Dodaj
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Bundle Offer */}
      {recommendations.length >= 3 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{ fontSize: '1.5rem' }}>🎁</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                Pakiet oszczędnościowy
              </div>
              <div style={{ fontSize: '0.75rem', color: '#92400e' }}>
                Kup wszystkie rekomendowane części razem i zaoszczędź 15%
              </div>
            </div>
            <button
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#f59e0b',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
              }}
            >
              Dodaj pakiet
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#6b7280',
        textAlign: 'center',
      }}>
        Rekomendacje oparte na analizie zakupów innych klientów i kompatybilności części
      </div>
    </div>
  )
}
