/**
 * Przykład użycia Unified API Client w Product Page
 * 
 * Zawsze świeże dane produktu bez problemów z cache
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { unifiedAPI } from '@/lib/unified-api-client'

export default function ProductPage() {
  const params = useParams()
  const handle = params.handle as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [stock, setStock] = useState<number | null>(null)
  const [price, setPrice] = useState<any>(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        // ✅ Zawsze świeże dane produktu
        const { products } = await unifiedAPI.products.getByHandle(handle, true)
        
        if (!products || products.length === 0) {
          throw new Error('Produkt nie istnieje')
        }
        
        const productData = products[0]
        const variant = productData.variants?.[0]
        
        setProduct(productData)
        setSelectedVariant(variant)

        // ✅ Pobierz real-time stan magazynowy
        if (variant?.id) {
          const stockData = await unifiedAPI.inventory.checkStock(variant.id)
          setStock(stockData.quantity)
        }

        // ✅ Pobierz real-time cenę
        if (variant?.id) {
          const priceData = await unifiedAPI.pricing.getPrice(variant.id)
          setPrice(priceData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Błąd ładowania produktu')
      } finally {
        setLoading(false)
      }
    }
    
    if (handle) {
      loadProduct()
    }
  }, [handle])

  // Funkcja do odświeżenia danych (np. po dodaniu do koszyka)
  const refreshData = async () => {
    if (selectedVariant?.id) {
      const [stockData, priceData] = await Promise.all([
        unifiedAPI.inventory.checkStock(selectedVariant.id),
        unifiedAPI.pricing.getPrice(selectedVariant.id),
      ])
      setStock(stockData.quantity)
      setPrice(priceData)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Ładowanie...</div>
          <div className="text-gray-600">Pobieranie danych produktu</div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-2xl font-bold mb-4 text-red-600">Błąd</div>
          <div className="text-gray-700 mb-4">{error || 'Nie znaleziono produktu'}</div>
          <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    )
  }

  // ✅ Real-time cena
  const priceAmount = price ? (price.amount / 100).toFixed(2) : '0.00'
  const currency = price?.currency_code?.toUpperCase() || 'PLN'

  // ✅ Real-time dostępność
  const inStock = stock !== null && stock > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li><Link href="/" className="hover:text-primary">Strona główna</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-primary">Produkty</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-semibold">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.thumbnail || '/placeholder.svg'}
                alt={product.title}
                fill
                className="object-contain p-8"
                priority
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-lg text-gray-600">{product.subtitle}</p>
              )}
            </div>

            {/* Price - Real-time */}
            <div className="border-t border-b py-4">
              <div className="text-4xl font-bold text-primary">
                {priceAmount} {currency}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Cena netto (bez VAT)
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ✓ Zawsze aktualna cena
              </div>
            </div>

            {/* SKU & Stock - Real-time */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">SKU</div>
                <div className="font-mono font-semibold">{selectedVariant?.sku || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-600">Dostępność</div>
                {inStock ? (
                  <div className="font-semibold text-success">
                    ✓ W magazynie ({stock} szt.)
                  </div>
                ) : (
                  <div className="font-semibold text-red-600">
                    ✗ Brak w magazynie
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  ✓ Stan rzeczywisty
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              {selectedVariant && inStock && (
                <AddToCartButton 
                  variantId={selectedVariant.id || product.id}
                  className="w-full"
                  onSuccess={refreshData}
                />
              )}
              {!inStock && (
                <button 
                  disabled 
                  className="w-full px-6 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                >
                  Produkt niedostępny
                </button>
              )}
              <button 
                onClick={refreshData}
                className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                🔄 Odśwież dane
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-3">Opis produktu</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Real-time indicator */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                <span>Dane aktualizowane w czasie rzeczywistym</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
