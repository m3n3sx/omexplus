'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

type Product = {
  id: string
  title: string
  description: string
  thumbnail?: string
  images?: Array<{ url: string }>
  variants?: Array<{
    id: string
    title: string
    prices?: Array<{
      amount: number
      currency_code: string
    }>
    inventory_quantity?: number
  }>
  metadata?: {
    sku?: string
    part_number?: string
    brand?: string
    min_order_qty?: number
    technical_specs?: any
  }
}

export default function ProductDetailPage() {
  const t = useTranslations()
  const locale = useLocale()
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProduct()
    fetchRelatedProducts()
  }, [productId])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/store/products/${productId}`)
      const data = await response.json()
      setProduct(data.product)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/store/products?limit=4`)
      const data = await response.json()
      setRelatedProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleAddToCart = () => {
    // TODO: Implement add to cart
    alert(`Added ${quantity} items to cart`)
  }

  const minOrderQty = product?.metadata?.min_order_qty || 1

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Header />
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>{t('common.loading')}</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Header />
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
          <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>Produkt nie znaleziony</p>
        </div>
        <Footer />
      </div>
    )
  }

  const price = product.variants?.[0]?.prices?.[0]?.amount || 0
  const images = product.images || (product.thumbnail ? [{ url: product.thumbnail }] : [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <Link href={`/${locale}`} style={{ color: '#3b82f6' }}>
            {t('common.home')}
          </Link>
          {' / '}
          <Link href={`/${locale}/products`} style={{ color: '#3b82f6' }}>
            {t('common.products')}
          </Link>
          {' / '}
          <span>{product.title}</span>
        </div>

        {/* Product Detail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '3rem' }}>
          {/* Image Gallery */}
          <div>
            <div style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              marginBottom: '1rem',
              height: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]?.url}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontSize: '6rem' }}>📦</span>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImage === idx ? '2px solid #3b82f6' : '2px solid transparent',
                      height: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {product.title}
            </h1>

            {/* Meta Info */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              {product.metadata?.sku && (
                <div>
                  <strong>{t('product.sku')}:</strong> {product.metadata.sku}
                </div>
              )}
              {product.metadata?.part_number && (
                <div>
                  <strong>{t('product.partNumber')}:</strong> {product.metadata.part_number}
                </div>
              )}
              {product.metadata?.brand && (
                <div>
                  <strong>{t('product.brand')}:</strong> {product.metadata.brand}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div style={{
              display: 'inline-block',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1.5rem'
            }}>
              ✓ {t('product.inStock')}
            </div>

            {/* Price */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
                {(price / 100).toFixed(2)} PLN
              </div>
              {minOrderQty > 1 && (
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {t('product.minOrderQty')}: {minOrderQty} szt.
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                {t('product.description')}
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {t('common.quantity')}
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <button
                    onClick={() => setQuantity(Math.max(minOrderQty, quantity - 1))}
                    style={{
                      padding: '0.75rem 1.25rem',
                      backgroundColor: '#f3f4f6',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      fontWeight: 'bold'
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(minOrderQty, Number(e.target.value)))}
                    min={minOrderQty}
                    style={{
                      width: '80px',
                      textAlign: 'center',
                      border: 'none',
                      borderLeft: '1px solid #d1d5db',
                      borderRight: '1px solid #d1d5db',
                      fontSize: '1.125rem',
                      fontWeight: '600'
                    }}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      backgroundColor: '#f3f4f6',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      fontWeight: 'bold'
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    padding: '1rem 2rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  {t('common.addToCart')}
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1rem', color: '#6b7280' }}>{t('common.total')}:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {((price * quantity) / 100).toFixed(2)} PLN
              </span>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        {product.metadata?.technical_specs && (
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {t('product.specifications')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {Object.entries(product.metadata.technical_specs).map(([key, value]) => (
                <div key={key} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{key}</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>{String(value)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {t('product.relatedProducts')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              {relatedProducts.map((relProduct) => (
                <Link key={relProduct.id} href={`/${locale}/products/${relProduct.id}`}>
                  <div
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '0.75rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{
                      height: '150px',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {relProduct.thumbnail ? (
                        <img src={relProduct.thumbnail} alt={relProduct.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '3rem' }}>📦</span>
                      )}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {relProduct.title}
                      </h3>
                      <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {relProduct.variants?.[0]?.prices?.[0]?.amount
                          ? `${(relProduct.variants[0].prices[0].amount / 100).toFixed(2)} PLN`
                          : t('common.price')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
