'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Order } from '@/types'
import medusaClient from '@/lib/medusa'

export default function OrdersPage() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const { customer, loading: authLoading, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/account/login`)
    }
  }, [authLoading, isAuthenticated, router, locale])

  useEffect(() => {
    if (customer) {
      fetchOrders()
    }
  }, [customer])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await medusaClient.customers.listOrders()
      setOrders(response.orders as any)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount / 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: '#d1fae5', text: '#065f46' }
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e' }
      case 'canceled':
        return { bg: '#fee2e2', text: '#991b1b' }
      default:
        return { bg: '#e5e7eb', text: '#374151' }
    }
  }

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p>{t('common.loading')}</p>
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
            {t('account.orders')}
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            <Link href={`/${locale}`} style={{ color: '#3b82f6' }}>
              {t('common.home')}
            </Link>
            {' / '}
            <Link href={`/${locale}/account`} style={{ color: '#3b82f6' }}>
              Konto
            </Link>
            {' / '}
            <span>Zamówienia</span>
          </div>
        </div>

        {/* Orders List */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', overflow: 'hidden' }}>
          {orders.length > 0 ? (
            <div>
              {orders.map((order) => {
                const statusColors = getStatusColor(order.status)
                return (
                  <Link
                    key={order.id}
                    href={`/${locale}/account/orders/${order.id}`}
                    style={{
                      display: 'block',
                      padding: '1.5rem',
                      borderBottom: '1px solid #e5e7eb',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                          Zamówienie #{order.display_id}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Złożone: {new Date(order.created_at).toLocaleDateString('pl-PL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
                          {formatPrice(order.total, order.currency_code)}
                        </div>
                        <div style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                          borderRadius: '0.25rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}>
                          {order.status}
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            backgroundColor: '#f9fafb',
                            borderRadius: '0.5rem',
                          }}
                        >
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '0.25rem',
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '50px',
                              height: '50px',
                              backgroundColor: '#e5e7eb',
                              borderRadius: '0.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                            }}>
                              📦
                            </div>
                          )}
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              Ilość: {item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.75rem',
                          color: '#6b7280',
                          fontSize: '0.875rem',
                        }}>
                          +{order.items.length - 3} więcej
                        </div>
                      )}
                    </div>

                    {/* Shipping Info */}
                    {order.shipping_address && (
                      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        📍 Dostawa: {order.shipping_address.city}, {order.shipping_address.country_code}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
                Brak zamówień
              </h2>
              <p style={{ marginBottom: '2rem' }}>
                Nie masz jeszcze żadnych zamówień
              </p>
              <Link href={`/${locale}/products`}>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                  Rozpocznij zakupy
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Back to Account */}
        <div style={{ marginTop: '2rem' }}>
          <Link href={`/${locale}/account`} style={{ color: '#3b82f6', fontSize: '0.875rem' }}>
            ← Powrót do konta
          </Link>
        </div>
      </div>
    </div>
  )
}
