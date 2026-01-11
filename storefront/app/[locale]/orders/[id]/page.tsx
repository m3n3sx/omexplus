'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  processing: { bg: '#dbeafe', text: '#1e40af' },
  shipped: { bg: '#d1fae5', text: '#065f46' },
  delivered: { bg: '#d1fae5', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' }
}

export default function OrderDetailPage() {
  const t = useTranslations()
  const locale = useLocale()
  const params = useParams()
  const orderId = params.id as string

  const [loading, setLoading] = useState(true)

  // Mock order data
  const order = {
    id: orderId,
    order_number: 'ORD-2024-001',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'shipped',
    tracking_number: 'DHL1234567890',
    tracking_url: 'https://www.dhl.com/tracking',
    items: [
      {
        id: '1',
        title: 'Pompa hydrauliczna 250bar',
        quantity: 2,
        unit_price: 15000,
        total: 30000
      },
      {
        id: '2',
        title: 'Filtr oleju hydraulicznego',
        quantity: 5,
        unit_price: 2500,
        total: 12500
      }
    ],
    shipping_address: {
      firstName: 'Jan',
      lastName: 'Kowalski',
      address: 'ul. Przykładowa 123',
      city: 'Warszawa',
      postalCode: '00-001',
      country: 'Polska',
      phone: '+48 123 456 789'
    },
    billing_address: {
      companyName: 'OMEX Sp. z o.o.',
      taxId: '1234567890',
      address: 'ul. Firmowa 456',
      city: 'Warszawa',
      postalCode: '00-002',
      country: 'Polska'
    },
    subtotal: 42500,
    shipping: 1999,
    tax: 9774,
    total: 54273,
    status_history: [
      { status: 'pending', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'processing', date: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'shipped', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500)
  }, [])

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t('order.statusPending'),
      processing: t('order.statusProcessing'),
      shipped: t('order.statusShipped'),
      delivered: t('order.statusDelivered'),
      cancelled: t('order.statusCancelled')
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>{t('common.loading')}</p>
        </div>
</div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <Link href={`/${locale}`} style={{ color: '#3b82f6' }}>
            {t('common.home')}
          </Link>
          {' / '}
          <Link href={`/${locale}/orders`} style={{ color: '#3b82f6' }}>
            {t('order.orderHistory')}
          </Link>
          {' / '}
          <span>{order.order_number}</span>
        </div>

        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.75rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {order.order_number}
            </h1>
            <p style={{ color: '#6b7280' }}>
              Złożono: {new Date(order.created_at).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: STATUS_COLORS[order.status]?.bg || '#f3f4f6',
                color: STATUS_COLORS[order.status]?.text || '#6b7280',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {getStatusLabel(order.status)}
            </div>
            {/* Invoice button - temporarily disabled
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              {t('order.downloadInvoice')} 📄
            </button>
            */}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Content */}
          <div>
            {/* Order Items */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                {t('order.orderDetails')}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {t('common.quantity')}: {item.quantity} × {(item.unit_price / 100).toFixed(2)} PLN
                      </div>
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                      {(item.total / 100).toFixed(2)} PLN
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>{t('cart.subtotal')}:</span>
                  <span style={{ fontWeight: '600' }}>{(order.subtotal / 100).toFixed(2)} PLN</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>{t('cart.shipping')}:</span>
                  <span style={{ fontWeight: '600' }}>{(order.shipping / 100).toFixed(2)} PLN</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>{t('cart.tax')}:</span>
                  <span style={{ fontWeight: '600' }}>{(order.tax / 100).toFixed(2)} PLN</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e7eb',
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                }}>
                  <span>{t('cart.total')}:</span>
                  <span style={{ color: '#3b82f6' }}>{(order.total / 100).toFixed(2)} PLN</span>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {t('checkout.shippingAddress')}
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                  {order.shipping_address.firstName} {order.shipping_address.lastName}<br />
                  {order.shipping_address.address}<br />
                  {order.shipping_address.postalCode} {order.shipping_address.city}<br />
                  {order.shipping_address.country}<br />
                  {order.shipping_address.phone}
                </div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {t('checkout.billingAddress')}
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                  {order.billing_address.companyName}<br />
                  NIP: {order.billing_address.taxId}<br />
                  {order.billing_address.address}<br />
                  {order.billing_address.postalCode} {order.billing_address.city}<br />
                  {order.billing_address.country}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Tracking */}
            {order.tracking_number && (
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {t('order.trackingNumber')}
                </h3>
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {order.tracking_number}
                </div>
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    textDecoration: 'none'
                  }}
                >
                  {t('order.trackShipment')} 📦
                </a>
              </div>
            )}

            {/* Status Timeline */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Historia statusu
              </h3>
              <div style={{ position: 'relative' }}>
                {/* Timeline line */}
                <div style={{
                  position: 'absolute',
                  left: '15px',
                  top: '10px',
                  bottom: '10px',
                  width: '2px',
                  backgroundColor: '#e5e7eb'
                }} />

                {order.status_history.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      paddingLeft: '2.5rem',
                      paddingBottom: index < order.status_history.length - 1 ? '1.5rem' : '0'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      left: '7px',
                      top: '2px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      border: '3px solid white',
                      boxShadow: '0 0 0 2px #3b82f6'
                    }} />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        {getStatusLabel(item.status)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {new Date(item.date).toLocaleDateString('pl-PL', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
</div>
  )
}
