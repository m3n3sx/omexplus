'use client'

/**
 * VisualSearch Component - Search by image upload with Gemini Vision AI
 * Features:
 * - Drag & drop image upload
 * - AI-powered part identification
 * - OCR for part number detection
 * - Product search based on analysis
 */

import { useState, useRef } from 'react'
import { useSearch } from '@/hooks/useSearch'

interface VisualSearchProps {
  onSearch?: (results: any) => void
}

interface AnalysisResult {
  detectedPartType?: string
  partCategory?: string
  possibleBrands?: string[]
  description?: string
  confidence: number
}

interface OcrResult {
  texts: string[]
  partNumbers: string[]
}

export default function VisualSearch({ onSearch }: VisualSearchProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageData, setImageData] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState<string>('image/jpeg')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { search, loading, error } = useSearch()
  
  const [searchResults, setSearchResults] = useState<any>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [ocrResults, setOcrResults] = useState<OcrResult | null>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Proszę wybrać plik obrazu (JPG, PNG, WebP)')
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Plik jest za duży. Maksymalny rozmiar to 10MB.')
      return
    }

    setMimeType(file.type)

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
      // Extract base64 data (remove data:image/...;base64, prefix)
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

    // Reset previous results
    setAnalysis(null)
    setOcrResults(null)
    setSearchResults(null)

    try {
      const result = await search({
        method: 'visual',
        params: {
          image: imageData,
          detectOCR: true,
        },
      })

      // Set analysis results
      if (result.detectedPartType || result.confidence) {
        setAnalysis({
          detectedPartType: result.detectedPartType,
          confidence: result.confidence || 0,
        })
      }

      // Set OCR results
      if (result.ocrResults && result.ocrResults.length > 0) {
        setOcrResults({
          texts: result.ocrResults,
          partNumbers: result.ocrResults,
        })
      }

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
    setAnalysis(null)
    setOcrResults(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handlePartNumberClick = (partNumber: string) => {
    // Trigger search by part number
    if (onSearch) {
      onSearch({ partNumber, type: 'part-number-from-ocr' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Upload Area */}
      {!imagePreview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-neutral-300 bg-white hover:border-primary-400 hover:bg-neutral-50'
          }`}
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-secondary-800 mb-2">
            Wyszukaj przez zdjęcie
          </h3>
          <p className="text-sm text-secondary-600 mb-6">
            Przeciągnij zdjęcie tutaj lub kliknij aby wybrać
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              className="px-6 py-3 border-2 border-primary-500 rounded-xl bg-white text-primary-500 font-semibold hover:bg-primary-50 transition-colors"
            >
              <svg className="w-5 h-5 inline-block mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Wybierz plik
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <p className="text-xs text-neutral-400 mt-6">
            Obsługiwane formaty: JPG, PNG, WebP (max 10MB)
          </p>
        </div>
      ) : (
        <div>
          {/* Image Preview with Analysis */}
          <div className="border-2 border-primary-200 rounded-xl p-6 bg-white mb-6">
            <div className="flex gap-6 items-start">
              {/* Image */}
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-48 h-48 object-contain rounded-lg border-2 border-neutral-200"
                />
                {analysis && (
                  <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    {Math.round(analysis.confidence * 100)}%
                  </div>
                )}
              </div>
              
              {/* Info & Actions */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-secondary-800 mb-2">
                  {analysis?.detectedPartType || 'Zdjęcie gotowe do analizy'}
                </h3>
                
                {analysis?.description && (
                  <p className="text-sm text-secondary-600 mb-4">
                    {analysis.description}
                  </p>
                )}
                
                {!analysis && (
                  <p className="text-sm text-secondary-600 mb-4">
                    Kliknij "Analizuj" aby AI rozpoznało część i znalazło podobne produkty.
                  </p>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      loading
                        ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analizuję z AI...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {analysis ? 'Szukaj ponownie' : 'Analizuj z AI'}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={handleClear}
                    className="px-6 py-3 border-2 border-neutral-300 rounded-xl font-semibold text-secondary-700 hover:bg-neutral-100 transition-colors"
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
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 mt-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Błąd:</span> {error}
          </div>
        </div>
      )}

      {/* Results */}
      {searchResults && (
        <div className="mt-6 space-y-6">
          {/* AI Analysis Results */}
          {analysis && (
            <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h4 className="text-lg font-bold text-purple-800">Analiza AI</h4>
                <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  Pewność: {Math.round(analysis.confidence * 100)}%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {analysis.detectedPartType && (
                  <div>
                    <span className="text-xs text-purple-600 font-semibold uppercase">Wykryty typ:</span>
                    <p className="text-secondary-800 font-bold">{analysis.detectedPartType}</p>
                  </div>
                )}
                {analysis.partCategory && (
                  <div>
                    <span className="text-xs text-purple-600 font-semibold uppercase">Kategoria:</span>
                    <p className="text-secondary-800 font-bold">{analysis.partCategory}</p>
                  </div>
                )}
                {analysis.possibleBrands && analysis.possibleBrands.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-xs text-purple-600 font-semibold uppercase">Możliwe marki:</span>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {analysis.possibleBrands.map((brand, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm text-secondary-700">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OCR Results */}
          {ocrResults && ocrResults.partNumbers.length > 0 && (
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <h4 className="text-lg font-bold text-green-800">Wykryte numery części (OCR)</h4>
              </div>
              
              <div className="flex gap-3 flex-wrap">
                {ocrResults.partNumbers.map((partNumber, index) => (
                  <button
                    key={index}
                    onClick={() => handlePartNumberClick(partNumber)}
                    className="px-4 py-2 bg-white border-2 border-green-300 rounded-xl text-green-700 font-bold hover:bg-green-100 hover:border-green-400 transition-all"
                  >
                    {partNumber}
                    <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                ))}
              </div>
              
              <p className="text-xs text-green-600 mt-3">
                Kliknij numer aby wyszukać część
              </p>
            </div>
          )}

          {/* Search Suggestions */}
          {searchResults.suggestions && searchResults.suggestions.length > 0 && (
            <div className="p-6 bg-neutral-50 border-2 border-neutral-200 rounded-lg">
              <h4 className="text-sm font-bold text-secondary-700 mb-3">Sugerowane wyszukiwania:</h4>
              <div className="flex gap-2 flex-wrap">
                {searchResults.suggestions.map((term: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => onSearch?.({ query: term, type: 'suggestion' })}
                    className="px-4 py-2 bg-white border border-neutral-300 rounded-full text-sm text-secondary-700 hover:border-primary-500 hover:text-primary-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Similar Products */}
          {searchResults.similarParts && searchResults.similarParts.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-secondary-800 mb-4">
                Znalezione części ({searchResults.similarParts.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.similarParts.slice(0, 9).map((part: any, index: number) => (
                  <a
                    key={index}
                    href={`/pl/products/${part.handle}`}
                    className="p-4 border-2 border-neutral-200 rounded-lg bg-white hover:border-primary-300 hover:shadow-md transition-all group"
                  >
                    {part.thumbnail && (
                      <img
                        src={part.thumbnail}
                        alt={part.title}
                        className="w-full h-32 object-contain mb-3 rounded-lg bg-neutral-50"
                      />
                    )}
                    <h4 className="font-semibold text-secondary-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {part.title}
                    </h4>
                    {part.variants?.[0]?.sku && (
                      <p className="text-xs text-secondary-500 mt-1">
                        SKU: {part.variants[0].sku}
                      </p>
                    )}
                    {part.variants?.[0]?.prices?.[0] && (
                      <p className="text-lg font-bold text-primary-600 mt-2">
                        {(part.variants[0].prices[0].amount / 100).toFixed(2)} {part.variants[0].prices[0].currency_code}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {(!searchResults.similarParts || searchResults.similarParts.length === 0) && 
           (!ocrResults || ocrResults.partNumbers.length === 0) && (
            <div className="p-8 text-center bg-neutral-50 rounded-lg">
              <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h4 className="text-lg font-semibold text-secondary-700 mb-2">
                Nie znaleziono podobnych części
              </h4>
              <p className="text-sm text-secondary-500 mb-4">
                Spróbuj użyć innego zdjęcia lub skontaktuj się z nami
              </p>
              <a
                href="/pl/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Zapytaj eksperta
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
