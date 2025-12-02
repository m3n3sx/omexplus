'use client'

/**
 * AlternativeCalculator Component - Find alternative parts
 * FUNKCJA 5: KALKULATOR ZAMIENNOŚCI
 */

import { useState } from 'react'

interface Alternative {
  id: string
  partNumber: string
  name: string
  manufacturer: string
  partType: 'OEM' | 'Certified' | 'Premium' | 'Budget'
  price: number
  currency: string
  availability: string
  compatibilityScore: number
  savings?: number
  image?: string
}

interface AlternativeCalculatorProps {
  onAddToCart?: (partId: string) => void
}

export default function AlternativeCalculator({ onAddToCart }: AlternativeCalculatorProps) {
  const [oemNumber, setOemNumber] = useState('')
  const [alternatives, setAlternatives] = useState<Alternative[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [originalPart, setOriginalPart] = useState<Alternative | null>(null)

  const handleSearch = async () => {
    if (!oemNumber.trim()) return

    setLoading(true)
    setError(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const response = await fetch(`${backendUrl}/store/omex-search/alternatives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oemNumber: oemNumber.trim() }),
      })

      if (!response.ok) {
        throw new Error('Nie znaleziono części')
      }

      const data = await response.json()
      setOriginalPart(data.original)
      setAlternatives(data.alternatives || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
      setAlternatives([])
      setOriginalPart(null)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'OEM':
        return { bg: '#dbeafe', color: '#1e40af' }
      case 'Certified':
        return { bg: '#dcfce7', color: '#16a34a' }
      case 'Premium':
        return { bg: '#fef3c7', color: '#92400e' }
      case 'Budget':
        return { bg: '#f3f4f6', color: '#4b5563' }
      default:
        return { bg: '#f3f4f6', color: '#6b7280' }
    }
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          🔄 Kalkulator Zamienności
        </h2>
        <p style={{ fontSize: '1rem', color: '#6b7280' }}>
          Wpisz numer OEM aby znaleźć wszystkie dostępne zamienniki
        </p>
      </div>

      {/* Search Input */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '2rem',
        maxWidth: '600px',
        margin: '0 auto 2rem',
      }}>
        <input
          type="text"
          value={oemNumber}
          onChange={(e) => setOemNumber(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Wpisz numer OEM (np. 320-8134)"
          style={{
            flex: 1,
            padding: '1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !oemNumber.trim()}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: loading || !oemNumber.trim() ? '#e5e7eb' : '#3b82f6',
            color: 'white',
            cursor: loading || !oemNumber.trim() ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Szukam...' : 'Szukaj'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#991b1b',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* Original Part */}
      {originalPart && (
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f0fdf4',
          border: '2px solid #86efac',
          borderRadius: '12px',
          marginBottom: '2rem',
        }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#16a34a',
            marginBottom: '0.75rem',
          }}>
            ✓ CZĘŚĆ ORYGINALNA (OEM)
          </div>
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              backgroundColor: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {originalPart.image ? (
                <img
                  src={originalPart.image}
                  alt={originalPart.name}
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
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {originalPart.name}
              </h3>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Numer: <strong>{originalPart.partNumber}</strong>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                Producent: <strong>{originalPart.manufacturer}</strong>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                {originalPart.price} {originalPart.currency}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              Znalezione zamienniki ({alternatives.length})
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Sortuj według: 
              <select
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                }}
              >
                <option>Najlepsze dopasowanie</option>
                <option>Najniższa cena</option>
                <option>Najwyższa jakość</option>
                <option>Dostępność</option>
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            backgroundColor: 'white',
            overflow: 'hidden',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', borderBottom: '2px solid #e5e7eb' }}>
                    Część
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem', borderBottom: '2px solid #e5e7eb' }}>
                    Typ
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem', borderBottom: '2px solid #e5e7eb' }}>
                    Dopasowanie
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem', borderBottom: '2px solid #e5e7eb' }}>
                    Cena
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem', borderBottom: '2px solid #e5e7eb' }}>
                    Oszczędność
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem', borderBottom: '2px solid #e5e7eb' }}>
                    Dostępność
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem', borderBottom: '2px solid #e5e7eb' }}>
                    Akcja
                  </th>
                </tr>
              </thead>
              <tbody>
                {alternatives.map((alt, index) => {
                  const typeColors = getTypeColor(alt.partType)
                  return (
                    <tr
                      key={alt.id}
                      style={{
                        borderBottom: index < alternatives.length - 1 ? '1px solid #f3f4f6' : 'none',
                      }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {alt.image ? (
                              <img
                                src={alt.image}
                                alt={alt.name}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain',
                                }}
                              />
                            ) : (
                              <div style={{ fontSize: '1.5rem', color: '#d1d5db' }}>📦</div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                              {alt.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>
                              {alt.partNumber}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {alt.manufacturer}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: typeColors.bg,
                          color: typeColors.color,
                        }}>
                          {alt.partType}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}>
                          <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                            {Math.round(alt.compatibilityScore * 100)}%
                          </div>
                          <div style={{
                            width: '60px',
                            height: '4px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '2px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${alt.compatibilityScore * 100}%`,
                              height: '100%',
                              backgroundColor: alt.compatibilityScore >= 0.9 ? '#16a34a' : alt.compatibilityScore >= 0.7 ? '#f59e0b' : '#ef4444',
                            }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                          {alt.price} {alt.currency}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {alt.savings && alt.savings > 0 ? (
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#16a34a',
                          }}>
                            -{alt.savings} {alt.currency}
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              ({Math.round((alt.savings / (originalPart?.price || 1)) * 100)}%)
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#6b7280' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: alt.availability === 'in-stock' ? '#16a34a' : '#f59e0b',
                        }}>
                          {alt.availability === 'in-stock' ? '✓ Magazyn' : '📦 Zamówienie'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => onAddToCart && onAddToCart(alt.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          🛒 Dodaj
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{ fontSize: '2rem' }}>💡</div>
            <div style={{ flex: 1, fontSize: '0.875rem', color: '#1e40af' }}>
              <strong>Wskazówka:</strong> Części z dopasowaniem powyżej 90% są w pełni kompatybilne. 
              Części Premium oferują najlepszy stosunek jakości do ceny.
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && oemNumber && alternatives.length === 0 && !error && (
        <div style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Brak zamienników
          </h3>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            Nie znaleziono zamienników dla numeru {oemNumber}
          </p>
        </div>
      )}
    </div>
  )
}
