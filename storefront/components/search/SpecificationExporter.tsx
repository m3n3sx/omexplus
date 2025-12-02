'use client'

/**
 * SpecificationExporter Component - Export parts specifications
 * FUNKCJA 7: EXPORT SPECYFIKACJI
 */

import { useState } from 'react'

interface Part {
  id: string
  name: string
  partNumber: string
  price: number
  currency: string
  specifications?: Record<string, any>
  quantity?: number
}

interface SpecificationExporterProps {
  parts: Part[]
  onExport?: (format: ExportFormat, parts: Part[], notes: string) => void
}

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'xml'

export default function SpecificationExporter({ parts, onExport }: SpecificationExporterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedParts, setSelectedParts] = useState<Set<string>>(new Set(parts.map(p => p.id)))
  const [format, setFormat] = useState<ExportFormat>('pdf')
  const [includeImages, setIncludeImages] = useState(true)
  const [includePrices, setIncludePrices] = useState(true)
  const [includeSpecs, setIncludeSpecs] = useState(true)
  const [notes, setNotes] = useState('')
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    const partsToExport = parts.filter(p => selectedParts.has(p.id))
    
    if (partsToExport.length === 0) {
      alert('Wybierz przynajmniej jedną część do eksportu')
      return
    }

    setExporting(true)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const response = await fetch(`${backendUrl}/store/omex-search/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parts: partsToExport,
          format,
          options: {
            includeImages,
            includePrices,
            includeSpecs,
          },
          notes,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `specyfikacja-${Date.now()}.${format === 'excel' ? 'xlsx' : format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        if (onExport) {
          onExport(format, partsToExport, notes)
        }

        setIsOpen(false)
      } else {
        alert('Nie udało się wyeksportować specyfikacji')
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Wystąpił błąd podczas eksportu')
    } finally {
      setExporting(false)
    }
  }

  const togglePart = (partId: string) => {
    const newSelected = new Set(selectedParts)
    if (newSelected.has(partId)) {
      newSelected.delete(partId)
    } else {
      newSelected.add(partId)
    }
    setSelectedParts(newSelected)
  }

  const selectAll = () => {
    setSelectedParts(new Set(parts.map(p => p.id)))
  }

  const deselectAll = () => {
    setSelectedParts(new Set())
  }

  const getFormatIcon = (fmt: ExportFormat) => {
    switch (fmt) {
      case 'pdf': return '📄'
      case 'excel': return '📊'
      case 'csv': return '📋'
      case 'xml': return '🔖'
    }
  }

  const getFormatDescription = (fmt: ExportFormat) => {
    switch (fmt) {
      case 'pdf': return 'Dokument PDF z pełną specyfikacją'
      case 'excel': return 'Arkusz Excel do edycji'
      case 'csv': return 'Plik CSV dla systemów ERP'
      case 'xml': return 'Format XML dla integracji'
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '0.75rem 1.5rem',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          backgroundColor: 'white',
          color: '#3b82f6',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        📥 Eksportuj specyfikację
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '2rem',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '1.5rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Eksport specyfikacji
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Wybierz części i format eksportu
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            ✕
          </button>
        </div>

        {/* Format Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
            Format eksportu:
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}>
            {(['pdf', 'excel', 'csv', 'xml'] as ExportFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${format === fmt ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  backgroundColor: format === fmt ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  {getFormatIcon(fmt)}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {fmt.toUpperCase()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {getFormatDescription(fmt)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
            Opcje eksportu:
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              backgroundColor: includeImages ? '#eff6ff' : 'white',
            }}>
              <input
                type="checkbox"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
              />
              <span style={{ fontSize: '0.875rem' }}>Dołącz zdjęcia części</span>
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              backgroundColor: includePrices ? '#eff6ff' : 'white',
            }}>
              <input
                type="checkbox"
                checked={includePrices}
                onChange={(e) => setIncludePrices(e.target.checked)}
              />
              <span style={{ fontSize: '0.875rem' }}>Dołącz ceny</span>
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              backgroundColor: includeSpecs ? '#eff6ff' : 'white',
            }}>
              <input
                type="checkbox"
                checked={includeSpecs}
                onChange={(e) => setIncludeSpecs(e.target.checked)}
              />
              <span style={{ fontSize: '0.875rem' }}>Dołącz specyfikacje techniczne</span>
            </label>
          </div>
        </div>

        {/* Parts Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              Wybierz części ({selectedParts.size}/{parts.length}):
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={selectAll}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                Zaznacz wszystkie
              </button>
              <button
                onClick={deselectAll}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                Odznacz wszystkie
              </button>
            </div>
          </div>
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '0.5rem',
          }}>
            {parts.map((part) => (
              <label
                key={part.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  backgroundColor: selectedParts.has(part.id) ? '#eff6ff' : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedParts.has(part.id)}
                  onChange={() => togglePart(part.id)}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {part.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {part.partNumber} • {part.price} {part.currency}
                    {part.quantity && ` • Ilość: ${part.quantity}`}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Notatki (opcjonalnie):
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Dodaj własne notatki do specyfikacji..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '0.875rem',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            Anuluj
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || selectedParts.size === 0}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: exporting || selectedParts.size === 0 ? '#e5e7eb' : '#3b82f6',
              color: 'white',
              cursor: exporting || selectedParts.size === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            {exporting ? 'Eksportowanie...' : `📥 Eksportuj (${selectedParts.size})`}
          </button>
        </div>

        {/* Info */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          fontSize: '0.75rem',
          color: '#6b7280',
          lineHeight: '1.5',
        }}>
          💡 Eksportowany plik będzie zawierał wszystkie wybrane części wraz z ich specyfikacjami. 
          Format PDF jest najlepszy do druku, Excel do edycji, a CSV/XML do integracji z systemami.
        </div>
      </div>
    </div>
  )
}
