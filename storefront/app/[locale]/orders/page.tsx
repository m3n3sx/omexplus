'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

type Order = {
  id: string
  order_number: string
  created_at: string
  status: string
  total: number
  items_count: number
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  processing: { bg: '#dbeafe', text: '#1e40af' },
  shipped: { bg: '#d1fae5', text: '#065f46' },
  delivered: { bg: '#d1fae5', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' }
}

export default function OrdersPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, fetch from API
      const mockOrders: Order[] = [
        {
          id: '1',
          order_number: 'ORD-2024-001',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'delivered',
          total: 45990,
          items_count: 3
        },
        {
          id: '2',
          order_number: 'ORD-2024-002',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'shipped',
          total: 12500,
          items_count: 1
        },
        {
          id: '3',
          order_number: 'ORD-2024-003',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'processing',
          total: 78900,
          items_count: 5
        }
      ]
      setOrders(mockOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <Link href={`/${locale}`} style={{ color: '#3b82f6' }}>
            {t('common.home')}
          </Link>
          {' / '}
          <span>{t('order.orderHistory')}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {t('order.orderHistory')}
          </h1>
          <p style={{ color: '#6b7280' }}>
            Przeglądaj i śledź swoje zamówienia
          </p>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.75rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: filterStatus === status ? '#F9580E' : '#f3f4f6',
                color: filterStatus === status ? 'white' : '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {status === 'all' ? 'Wszystkie' : getStatusLabel(status)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 1rem', 
              backgroundColor: '#FEF3EE', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <svg style={{ width: '40px', height: '40px', color: '#F9580E', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>{t('common.loading')}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              margin: '0 auto 1rem', 
              backgroundColor: '#FEF3EE', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <svg style={{ width: '50px', height: '50px', color: '#F9580E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Brak zamówień
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Nie masz jeszcze żadnych zamówień
            </p>
            <Link href={`/${locale}/products`}>
              <button style={{
                backgroundColor: '#F9580E',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                {t('common.continueShopping')}
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredOrders.map((order) => (
              <Link key={order.id} href={`/${locale}/orders/${order.id}`}>
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#F9580E'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {order.order_number}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(order.created_at).toLocaleDateString('pl-PL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: STATUS_COLORS[order.status]?.bg || '#f3f4f6',
                        color: STATUS_COLORS[order.status]?.text || '#6b7280',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}
                    >
                      {getStatusLabel(order.status)}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        Produkty
                      </div>
                      <div style={{ fontWeight: '600' }}>
                        {order.items_count} szt.
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        {t('cart.total')}
                      </div>
                      <div style={{ fontWeight: '600', color: '#F9580E' }}>
                        {(order.total / 100).toFixed(2)} PLN
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <button style={{
                        backgroundColor: '#FEF3EE',
                        color: '#F9580E',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        {t('common.viewDetails')} →
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
</div>
  )
}
