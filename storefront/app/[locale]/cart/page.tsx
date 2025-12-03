'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useCartContext } from '@/contexts/CartContext'
import Image from 'next/image'

export default function CartPage() {
  const t = useTranslations()
  const locale = useLocale()
  const { cart, loading, updateItem, removeItem, itemCount } = useCartContext()

  const formatPrice = (amount: number, currencyCode: string = 'PLN') => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount / 100)
  }

  if (loading && !cart) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
            {t('cart.empty')}
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Dodaj produkty do koszyka, aby kontynuować zakupy
          </p>
          <Link href={`/${locale}/products`}>
            <button style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}>
              Przeglądaj produkty
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            {t('cart.title')} ({itemCount})
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            <Link href={`/${locale}`} style={{ color: '#3b82f6' }}>
              {t('common.home')}
            </Link>
            {' / '}
            <span>Koszyk</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          {/* Cart Items */}
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', overflow: 'hidden' }}>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  {/* Product Image */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={120}
                        height={120}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                      }}>
                        📦
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                        {item.description}
                      </p>
                    )}
                    {item.variant && (
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        SKU: {item.variant.sku || 'N/A'}
                      </p>
                    )}

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}>
                        <button
                          onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                          disabled={loading}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.25rem',
                            color: '#6b7280',
                          }}
                        >
                          −
                        </button>
                        <span style={{ padding: '0 1rem', fontWeight: '600', minWidth: '3rem', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          disabled={loading}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.25rem',
                            color: '#6b7280',
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={loading}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {formatPrice(item.total, cart.region?.currency_code)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      {formatPrice(item.unit_price, cart.region?.currency_code)} / szt.
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div style={{ marginTop: '1.5rem' }}>
              <Link href={`/${locale}/products`}>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#3b82f6',
                  border: '2px solid #3b82f6',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                  ← {t('cart.continueShopping')}
                </button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              position: 'sticky',
              top: '100px',
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
                {t('checkout.orderSummary')}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>{t('cart.subtotal')}:</span>
                  <span style={{ fontWeight: '600' }}>
                    {formatPrice(cart.subtotal, cart.region?.currency_code)}
                  </span>
                </div>

                {cart.discount_total > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6b7280' }}>Rabat:</span>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>
                      -{formatPrice(cart.discount_total, cart.region?.currency_code)}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>{t('cart.shipping')}:</span>
                  <span style={{ fontWeight: '600' }}>
                    {cart.shipping_total > 0
                      ? formatPrice(cart.shipping_total, cart.region?.currency_code)
                      : 'Obliczane przy kasie'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>{t('cart.tax')}:</span>
                  <span style={{ fontWeight: '600' }}>
                    {formatPrice(cart.tax_total, cart.region?.currency_code)}
                  </span>
                </div>
              </div>

              <div style={{
                paddingTop: '1.5rem',
                borderTop: '2px solid #e5e7eb',
                marginBottom: '1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  <span>{t('cart.total')}:</span>
                  <span style={{ color: '#3b82f6' }}>
                    {formatPrice(cart.total, cart.region?.currency_code)}
                  </span>
                </div>
              </div>

              <Link href={`/${locale}/checkout`}>
                <button style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}>
                  {t('cart.checkout')} →
                </button>
              </Link>

              {/* Trust Badges */}
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
                  <div style={{ marginBottom: '0.5rem' }}>🔒 Bezpieczne płatności</div>
                  <div style={{ marginBottom: '0.5rem' }}>📦 Darmowa dostawa od 200 PLN</div>
                  <div>↩️ 30 dni na zwrot</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
