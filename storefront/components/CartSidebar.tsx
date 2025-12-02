'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useCart } from '../hooks/useCart'

type CartSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const t = useTranslations()
  const locale = useLocale()
  const { cart, removeItem, updateItem } = useCart()

  if (!isOpen) return null

  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0
  const tax = cart?.tax || 0
  const shipping = cart?.shipping || 0
  const total = cart?.total || 0

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease-in-out'
        }}
      />

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '450px',
          backgroundColor: 'white',
          boxShadow: '-4px 0 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {t('cart.title')} ({items.length})
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem',
              color: '#6b7280'
            }}
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {t('cart.empty')}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                {t('cart.emptyDescription')}
              </p>
              <Link href={`/${locale}/products`}>
                <button
                  onClick={onClose}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {t('common.continueShopping')}
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem'
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '2rem' }}>📦</span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      marginBottom: '0.25rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      Product #{item.product_id}
                    </h4>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6', marginBottom: '0.5rem' }}>
                      {(item.unit_price / 100).toFixed(2)} PLN
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                        style={{
                          width: '28px',
                          height: '28px',
                          backgroundColor: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 'bold'
                        }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          backgroundColor: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          textDecoration: 'underline'
                        }}
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with totals */}
        {items.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#6b7280' }}>{t('cart.subtotal')}:</span>
              <span style={{ fontWeight: '600' }}>{(subtotal / 100).toFixed(2)} PLN</span>
            </div>

            {/* Tax */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#6b7280' }}>{t('cart.tax')}:</span>
              <span style={{ fontWeight: '600' }}>{(tax / 100).toFixed(2)} PLN</span>
            </div>

            {/* Shipping */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#6b7280' }}>{t('cart.shippingEstimate')}:</span>
              <span style={{ fontWeight: '600' }}>{(shipping / 100).toFixed(2)} PLN</span>
            </div>

            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid #d1d5db',
              fontSize: '1.125rem',
              fontWeight: 'bold'
            }}>
              <span>{t('cart.total')}:</span>
              <span style={{ color: '#3b82f6' }}>{(total / 100).toFixed(2)} PLN</span>
            </div>

            {/* Checkout Button */}
            <Link href={`/${locale}/checkout`}>
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                {t('cart.proceedToCheckout')}
              </button>
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'white',
                color: '#3b82f6',
                border: '1px solid #3b82f6',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {t('common.continueShopping')}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
