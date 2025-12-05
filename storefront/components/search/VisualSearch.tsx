'use client'

/**
 * VisualSearch Component - Search by image upload
 */

import { useState, useRef } from 'react'
import { useSearch } from '@/hooks/useSearch'

interface VisualSearchProps {
  onSearch?: (results: any) => void
}

export default function VisualSearch({ onSearch }: VisualSearchProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageData, setImageData] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { search, loading, error } = useSearch()
  const [searchResults, setSearchResults] = useState<any>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Proszę wybrać plik obrazu')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
      // Extract base64 data
      const base64 = result.split(',')[1]
      setImageData(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleSearch = async () => {
    if (!imageData) return

    try {
      const result = await search({
        method: 'visual',
        params: {
          image: imageData,
          detectOCR: true,
        },
      })

      setSearchResults(result)
      if (onSearch) {
        onSearch(result)
      }
    } catch (err) {
      console.error('Visual search failed:', err)
    }
  }

  const handleClear = () => {
    setImagePreview(null)
    setImageData(null)
    setSearchResults(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Upload Area */}
      {!imagePreview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? '2px dashed #1675F2' : '2px dashed #D4EBFC',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: dragActive ? '#E8F4FE' : '#F2F2F2',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg style={{ width: '64px', height: '64px', margin: '0 auto 1rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0554F2' }}>
            Wyszukaj przez zdjęcie
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            Przeciągnij zdjęcie tutaj lub kliknij aby wybrać
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid #1675F2',
                borderRadius: '12px',
                backgroundColor: 'white',
                color: '#1675F2',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              <svg style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Wybierz plik
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem' }}>
            Obsługiwane formaty: JPG, PNG, GIF (max 10MB)
          </div>
        </div>
      ) : (
        <div>
          {/* Image Preview */}
          <div style={{
            border: '2px solid #D4EBFC',
            borderRadius: '16px',
            padding: '1rem',
            backgroundColor: 'white',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  border: '2px solid #D4EBFC',
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0554F2' }}>
                  Zdjęcie gotowe do wyszukania
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                  Kliknij "Szukaj" aby znaleźć podobne części lub użyj OCR do odczytania numerów z zdjęcia.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '12px',
                      backgroundColor: loading ? '#E8F4FE' : '#1675F2',
                      color: loading ? '#9ca3af' : 'white',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      boxShadow: loading ? 'none' : '0 4px 12px rgba(22, 117, 242, 0.3)',
                    }}
                  >
                    {loading ? 'Szukam...' : 'Szukaj'}
                  </button>
                  <button
                    onClick={handleClear}
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: '2px solid #D4EBFC',
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1675F2',
                    }}
                  >
                    Wyczyść
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#991b1b',
          marginTop: '1rem',
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {searchResults && (
        <div style={{ marginTop: '1.5rem' }}>
          {/* OCR Results */}
          {searchResults.ocrResults && searchResults.ocrResults.length > 0 && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#E8F4FE',
              border: '2px solid #1675F2',
              borderRadius: '16px',
              marginBottom: '1rem',
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0554F2' }}>
                Wykryte numery części:
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {searchResults.ocrResults.map((text: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'white',
                      border: '2px solid #1675F2',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#0554F2',
                    }}
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detected Part Type */}
          {searchResults.detectedPartType && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#E8F4FE',
              border: '2px solid #1675F2',
              borderRadius: '16px',
              marginBottom: '1rem',
            }}>
              <div style={{ fontSize: '0.875rem', color: '#0554F2', fontWeight: '600' }}>
                Wykryty typ części: <strong>{searchResults.detectedPartType}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Pewność: {Math.round(searchResults.confidence * 100)}%
              </div>
            </div>
          )}

          {/* Similar Parts */}
          {searchResults.similarParts && searchResults.similarParts.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#0554F2' }}>
                Podobne części ({searchResults.similarParts.length})
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1rem',
              }}>
                {searchResults.similarParts.map((part: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      border: '2px solid #D4EBFC',
                      borderRadius: '16px',
                      backgroundColor: 'white',
                    }}
                  >
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {part.name}
                    </h4>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      {part.partNumber}
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#0554F2' }}>
                      {part.price} PLN
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: part.availability === 'in-stock' ? '#27ae60' : '#F2B90C',
                      marginBottom: '0.75rem',
                      fontWeight: '600',
                    }}>
                      {part.availability === 'in-stock' ? 'Na magazynie' : 'Zamówienie'}
                    </div>
                    <button
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: '12px',
                        backgroundColor: '#1675F2',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(22, 117, 242, 0.3)',
                      }}
                    >
                      Dodaj do koszyka
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {(!searchResults.similarParts || searchResults.similarParts.length === 0) && 
           (!searchResults.ocrResults || searchResults.ocrResults.length === 0) && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
            }}>
              <svg style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: '#d1d5db' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Nie znaleziono podobnych części
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                Spróbuj użyć innego zdjęcia lub skontaktuj się z nami
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
