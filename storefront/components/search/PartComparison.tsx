'use client'

/**
 * PartComparison Component - Compare up to 4 parts side by side
 * FUNKCJA 1: PORÓWNYWANIE CZĘŚCI
 */

import { useState } from 'react'

interface Part {
  id: string
  name: string
  partNumber: string
  price: number
  currency: string
  availability: string
  partType: string
  manufacturer?: string
  rating?: number
  reviewCount?: number
  specifications?: Record<string, any>
  compatibility?: string[]
  image?: string
}

interface PartComparisonProps {
  parts: Part[]
  onRemove?: (partId: string) => void
  onAddToCart?: (partId: string) => void
  onExportPDF?: () => void
}

export default function PartComparison({ parts, onRemove, onAddToCart, onExportPDF }: PartComparisonProps) {
  const [selectedParts, setSelectedParts] = useState<Part[]>(parts.slice(0, 4))

  if (selectedParts.length === 0) {
    return (
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚖️</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Brak części do porównania
        </h3>
        <p style={{ fontSize: '1rem', color: '#6b7280' }}>
          Wybierz części z wyników wyszukiwania aby je porównać
        </p>
      </div>
    )
  }

  const allSpecs = new Set<string>()
  selectedParts.forEach(part => {
    if (part.specifications) {
      Object.keys(part.specifications).forEach(key => allSpecs.add(key))
    }
  })

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Porównanie części ({selectedParts.length}/4)
        </h2>
        {onExportPDF && (
          <button
            onClick={onExportPDF}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#3b82f6',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            📄 Eksportuj do PDF
          </button>
        )}
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
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '0.875rem',
                color: '#6b7280',
                borderBottom: '2px solid #e5e7eb',
                minWidth: '200px',
              }}>
                Właściwość
              </th>
              {selectedParts.map((part) => (
                <th
                  key={part.id}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    borderBottom: '2px solid #e5e7eb',
                    minWidth: '250px',
                    position: 'relative',
                  }}
                >
                  {onRemove && (
                    <button
                      onClick={() => onRemove(part.id)}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: '#fee2e2',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        color: '#991b1b',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Images */}
            <tr>
              <td style={{
                padding: '1rem',
                fontWeight: '600',
                borderBottom: '1px solid #f3f4f6',
              }}>
                Zdjęcie
              </td>
              {selectedParts.map((part) => (
                <td
                  key={part.id}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <div style={{
                    width: '150px',
                    height: '150px',
                    margin: '0 auto',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                      <div style={{ fontSize: '3rem', color: '#d1d5db' }}>📦</div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Name */}
            <tr>
              <td style={{
                padding: '1rem',
                fontWeight: '600',
                borderBottom: '1px solid #f3f4f6',
              }}>
                Nazwa
              </td>
              {selectedParts.map((part) => (
                <td
                  key={part.id}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #f3f4f6',
                    fontWeight: '600',
                  }}
                >
                  {part.name}
                </td>
              ))}
            </tr>

            {/* Part Number */}
            <tr>
              <td style={{
                padding: '1rem',
                fontWeight: '600',
                borderBottom: '1px solid #f3f4f6',
              }}>
                Numer części
              </td>
              {selectedParts.map((part) => (
                <td
                  key={part.id}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #f3f4f6',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                  }}
                >
                  {part.partNumber}
                </td>
              ))}
            </tr>

            {/* Price */}
            <tr style={{ backgroundColor: '#fffbeb' }}>
              <td style={{
                padding: '1rem',
                fontWeight: '600',
                borderBottom: '1px solid #f3f4f6',
              }}>
                Cena
              </td>
              {selectedParts.map((part) => (
                <td
                  key={part.id}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #f3f4f6',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#16a34a',
                  }}
                >
                  {part.price} {part.currency}
                </td>
              ))}
            </tr>

            {/* Availability */}
            <tr>
              <td style={{
                padding: '1rem',
                fontWeight: '600',
                borderBottom: '1px solid #f3f4f6',
              }}>
                Dostępność
              </td>
              {selectedParts.map((part) => (
                <td
                  key={part.id}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backgroundColor: part.availability === 'in-stock' ? '#dcfce7' : '#fef3c7',
                    color: part.availability === 'in-stock' ? '#16a34a' : '#f59e0b',
                  }}>
                    {part.availability === 'in-stock' ? '✓ Na magazynie' : '📦 Zamówienie'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Part Type */}
            <tr>
              <td style={{
                padding: '1rem',
                fontWeight: '600',
                borderBottom: '1px solid #f3f4f6',
              }}>
                Typ części
              </td>
              {selectedParts.map((part) => (
                <td
                  key={part.id}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backgroundColor: part.partType === 'OEM' ? '#dbeafe' : '#fef3c7',
                    color: part.partType === 'OEM' ? '#1e40af' : '#92400e',
                  }}>
                    {part.partType}
                  </span>
                </td>
              ))}
            </tr>

            {/* Manufacturer */}
            {selectedParts.some(p => p.manufacturer) && (
              <tr>
                <td style={{
                  padding: '1rem',
                  fontWeight: '600',
                  borderBottom: '1px solid #f3f4f6',
                }}>
                  Producent
                </td>
                {selectedParts.map((part) => (
                  <td
                    key={part.id}
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    {part.manufacturer || '-'}
                  </td>
                ))}
              </tr>
            )}

            {/* Rating */}
            {selectedParts.some(p => p.rating) && (
              <tr>
                <td style={{
                  padding: '1rem',
                  fontWeight: '600',
                  borderBottom: '1px solid #f3f4f6',
                }}>
                  Ocena
                </td>
                {selectedParts.map((part) => (
                  <td
                    key={part.id}
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    {part.rating ? (
                      <div>
                        <div style={{ color: '#f59e0b', fontSize: '1rem' }}>
                          {'★'.repeat(Math.floor(part.rating))}{'☆'.repeat(5 - Math.floor(part.rating))}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          ({part.reviewCount || 0} recenzji)
                        </div>
                      </div>
                    ) : '-'}
                  </td>
                ))}
              </tr>
            )}

            {/* Specifications */}
            {Array.from(allSpecs).map((spec) => (
              <tr key={spec}>
                <td style={{
                  padding: '1rem',
                  fontWeight: '600',
                  borderBottom: '1px solid #f3f4f6',
                }}>
                  {spec}
                </td>
                {selectedParts.map((part) => (
                  <td
                    key={part.id}
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    {part.specifications?.[spec] || '-'}
                  </td>
                ))}
              </tr>
            ))}

            {/* Compatibility */}
            {selectedParts.some(p => p.compatibility && p.compatibility.length > 0) && (
              <tr>
                <td style={{
                  padding: '1rem',
                  fontWeight: '600',
                  borderBottom: '1px solid #f3f4f6',
                }}>
                  Kompatybilność
                </td>
                {selectedParts.map((part) => (
                  <td
                    key={part.id}
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      borderBottom: '1px solid #f3f4f6',
                      fontSize: '0.875rem',
                    }}
                  >
                    {part.compatibility && part.compatibility.length > 0 ? (
                      <div>
                        {part.compatibility.slice(0, 3).join(', ')}
                        {part.compatibility.length > 3 && (
                          <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                            +{part.compatibility.length - 3} więcej
                          </div>
                        )}
                      </div>
                    ) : '-'}
                  </td>
                ))}
              </tr>
            )}

            {/* Actions */}
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <td style={{
                padding: '1rem',
                fontWeight: '600',
              }}>
                Akcje
              </td>
              {selectedParts.map((part) => (
                <td
                  key={part.id}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                  }}
                >
                  {onAddToCart && (
                    <button
                      onClick={() => onAddToCart(part.id)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                      }}
                    >
                      🛒 Dodaj do koszyka
                    </button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#eff6ff',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#1e40af',
      }}>
        <strong>💡 Wskazówka:</strong> Możesz porównać maksymalnie 4 części jednocześnie. 
        Przewiń w prawo aby zobaczyć wszystkie kolumny.
      </div>
    </div>
  )
}
