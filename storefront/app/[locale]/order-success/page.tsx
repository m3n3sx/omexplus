'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function OrderSuccessPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)

  // Mock order data - in real app, this would come from URL params or API
  const [orderNumber, setOrderNumber] = useState('ORD-2024-XXXX')
  const [estimatedDelivery, setEstimatedDelivery] = useState('...')

  useEffect(() => {
    setMounted(true)
    // Generate order number and date only on client side
    setOrderNumber('ORD-2024-' + Math.floor(Math.random() * 10000))
    setEstimatedDelivery(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('pl-PL'))
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
<div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
        {/* Success Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '3rem'
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
            Dziękujemy za zamówienie!
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Twoje zamówienie zostało pomyślnie złożone
          </p>
        </div>

        {/* Order Details Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {t('order.orderNumber')}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {orderNumber}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {t('order.estimatedDelivery')}
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                {estimatedDelivery}
              </div>
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>📧</div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Potwierdzenie wysłane
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Sprawdź swoją skrzynkę email, aby zobaczyć szczegóły zamówienia
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Info Placeholder */}
          <div style={{
            padding: '1.5rem',
            border: '2px dashed #d1d5db',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
              Numer śledzenia będzie dostępny wkrótce
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Otrzymasz powiadomienie email, gdy Twoja przesyłka zostanie wysłana
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <Link href={`/${locale}/orders`}>
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
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              {t('order.orderHistory')}
            </button>
          </Link>
          <Link href={`/${locale}/products`}>
            <button style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'white',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              {t('common.continueShopping')}
            </button>
          </Link>
        </div>

        {/* What's Next */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Co dalej?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                1
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Przetwarzamy Twoje zamówienie
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Nasz zespół przygotowuje Twoje produkty do wysyłki
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#e5e7eb',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                2
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Wysyłka
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Otrzymasz numer śledzenia przesyłki
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#e5e7eb',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                3
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Dostawa
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Twoja przesyłka dotrze w ciągu {estimatedDelivery}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</div>
  )
}
