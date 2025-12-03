'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from '@/components/product/AddToCartButton'

export default function ProductPage() {
  const params = useParams()
  const handle = params.handle as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
        const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        
        if (apiKey) {
          headers['x-publishable-api-key'] = apiKey
        }
        
        const response = await fetch(`${backendUrl}/store/products?handle=${handle}`, { headers })
        
        if (!response.ok) {
          throw new Error('Nie znaleziono produktu')
        }
        
        const data = await response.json()
        
        if (!data.products || data.products.length === 0) {
          throw new Error('Produkt nie istnieje')
        }
        
        const productData = data.products[0]
        setProduct(productData)
        setSelectedVariant(productData.variants?.[0] || null)
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

  const price = selectedVariant?.prices?.[0]
  const priceAmount = price ? (price.amount / 100).toFixed(2) : '0.00'
  const currency = price?.currency_code === 'pln' ? 'PLN' : price?.currency_code?.toUpperCase() || 'PLN'

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

            {/* Price */}
            <div className="border-t border-b py-4">
              <div className="text-4xl font-bold text-primary">
                {priceAmount} {currency}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Cena netto (bez VAT)
              </div>
            </div>

            {/* SKU & Stock */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">SKU</div>
                <div className="font-mono font-semibold">{selectedVariant?.sku || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-600">Dostępność</div>
                <div className="font-semibold text-success">✓ W magazynie</div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              {selectedVariant && (
                <AddToCartButton 
                  variantId={selectedVariant.id || product.id}
                  className="w-full"
                />
              )}
              <button className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Dodaj do listy życzeń
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-3">Opis produktu</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Metadata */}
            {product.metadata && Object.keys(product.metadata).length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-3">Specyfikacja techniczna</h2>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(product.metadata).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <dt className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</dt>
                      <dd className="font-semibold">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Features */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-3">Zalety</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-success text-xl">✓</span>
                  <span>Oryginalna część wysokiej jakości</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success text-xl">✓</span>
                  <span>Gwarancja producenta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success text-xl">✓</span>
                  <span>Szybka dostawa 24-48h</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success text-xl">✓</span>
                  <span>Certyfikaty CE i ISO</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Podobne produkty</h2>
          <div className="text-gray-600">
            Sekcja podobnych produktów będzie dostępna wkrótce
          </div>
        </div>
      </div>
    </div>
  )
}
