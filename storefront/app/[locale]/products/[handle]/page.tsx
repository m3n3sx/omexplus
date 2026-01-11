'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { VariantSelector, VariantDropdown } from '@/components/product/VariantSelector'
import { EnquiryModal } from '@/components/product/EnquiryModal'
import { ProductSchema } from '@/components/seo/ProductSchema'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { useEcommerceTracking } from '@/hooks/useEcommerceTracking'

export default function ProductPage() {
  const params = useParams()
  const handle = params.handle as string
  const locale = (params.locale as string) || 'pl'
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [showEnquiryModal, setShowEnquiryModal] = useState(false)
  const { trackProductView } = useEcommerceTracking()

  useEffect(() => {
    async function loadProduct() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
        const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
        const regionId = 'reg_01KBDXHQAFG1GS7F3WH2680KP0' // Poland/Europe region
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        
        if (apiKey) {
          headers['x-publishable-api-key'] = apiKey
        }
        
        // Add region header for price calculation
        headers['x-region-id'] = regionId
        
        // Request calculated_price for variants
        const url = `${backendUrl}/store/products?handle=${encodeURIComponent(handle)}&fields=*variants.calculated_price`
        const response = await fetch(url, { headers })
        
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
        
        // Track product view
        const calcPrice = productData.variants?.[0]?.calculated_price
        if (calcPrice) {
          trackProductView({
            id: productData.id,
            title: productData.title,
            category: productData.categories?.[0]?.name || 'Części do maszyn',
            price: calcPrice.calculated_amount / 100,
            currency: calcPrice.currency_code?.toUpperCase() || 'PLN',
          })
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const calcPrice = selectedVariant?.calculated_price
  const priceAmount = calcPrice ? (calcPrice.calculated_amount / 100).toFixed(2) : '0.00'
  const currency = calcPrice?.currency_code === 'pln' ? 'PLN' : calcPrice?.currency_code?.toUpperCase() || 'PLN'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Schemas */}
      {product && (
        <>
          <ProductSchema product={product} locale={locale} />
          <BreadcrumbSchema items={[
            { name: 'Strona główna', url: `/${locale}` },
            { name: 'Produkty', url: `/${locale}/products` },
            { name: product.title, url: `/${locale}/products/${handle}` },
          ]} />
        </>
      )}
      
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
              {priceAmount && parseFloat(priceAmount) > 0 ? (
                <>
                  <div className="text-4xl font-bold text-primary">
                    {priceAmount} {currency}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Cena netto (bez VAT)
                  </div>
                </>
              ) : (
                <div className="text-2xl font-bold text-secondary-700">
                  Zapytaj o cenę
                </div>
              )}
            </div>

            {/* Variant Selector - tylko jeśli produkt ma opcje/warianty */}
            {product.options && product.options.length > 0 && product.variants && product.variants.length > 1 && (
              <div className="border-t border-b py-4">
                <VariantSelector
                  options={product.options}
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />
              </div>
            )}

            {/* Prosty dropdown dla wariantów bez opcji */}
            {(!product.options || product.options.length === 0) && product.variants && product.variants.length > 1 && (
              <div className="border-t border-b py-4">
                <VariantDropdown
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />
              </div>
            )}

            {/* SKU & Stock */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">SKU</div>
                <div className="font-mono font-semibold">{selectedVariant?.sku || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-600">Dostępność</div>
                <div className={`font-semibold ${parseFloat(priceAmount) > 0 ? 'text-success' : 'text-orange-600'}`}>
                  {parseFloat(priceAmount) > 0 ? '✓ Dostępny' : '📦 Na zamówienie'}
                </div>
              </div>
            </div>

            {/* Add to Cart or Enquiry - based on price */}
            <div className="space-y-3">
              {parseFloat(priceAmount) > 0 && selectedVariant ? (
                <>
                  <AddToCartButton 
                    variantId={selectedVariant.id || product.id}
                    disabled={false}
                    className="w-full"
                  />
                  <button 
                    onClick={() => setShowEnquiryModal(true)}
                    className="w-full px-6 py-3 border-2 border-secondary-500 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Zapytaj o produkt
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setShowEnquiryModal(true)}
                    className="w-full px-6 py-3 bg-secondary-700 text-white rounded-lg hover:bg-secondary-800 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Zapytaj o produkt
                  </button>
                  <a 
                    href="tel:+48500169060"
                    className="w-full px-6 py-3 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Zadzwoń: +48 500 169 060
                  </a>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-3">Opis produktu</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Metadata */}
            {product.metadata && Object.keys(product.metadata).filter(k => !['in_stock', 'stock_quantity'].includes(k)).length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-3">Specyfikacja techniczna</h2>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(product.metadata)
                    .filter(([key]) => !['in_stock', 'stock_quantity'].includes(key))
                    .map(([key, value]) => (
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

      {/* Enquiry Modal */}
      <EnquiryModal
        product={product}
        selectedVariant={selectedVariant}
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
      />
    </div>
  )
}
