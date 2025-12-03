'use client'

import { useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function AccountPage() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const { customer, loading, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/${locale}/account/login`)
    }
  }, [loading, isAuthenticated, router, locale])

  if (loading || !customer) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
    router.push(`/${locale}`)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Witaj, {customer.first_name}!
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            <Link href={`/${locale}`} style={{ color: '#3b82f6' }}>
              {t('common.home')}
            </Link>
            {' / '}
            <span>Moje konto</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          {/* Sidebar */}
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {customer.first_name} {customer.last_name}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {customer.email}
                </div>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link
                  href={`/${locale}/account`}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#eff6ff',
                    color: '#3b82f6',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}
                >
                  📊 Dashboard
                </Link>
                <Link
                  href={`/${locale}/account/orders`}
                  style={{
                    padding: '0.75rem 1rem',
                    color: '#374151',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                  }}
                >
                  📦 {t('account.orders')}
                </Link>
                <Link
                  href={`/${locale}/account/addresses`}
                  style={{
                    padding: '0.75rem 1rem',
                    color: '#374151',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                  }}
                >
                  📍 {t('account.addresses')}
                </Link>
                <Link
                  href={`/${locale}/account/profile`}
                  style={{
                    padding: '0.75rem 1rem',
                    color: '#374151',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                  }}
                >
                  👤 {t('account.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '0.75rem 1rem',
                    color: '#dc2626',
                    borderRadius: '0.5rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  🚪 {t('account.logout')}
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                  {customer.orders?.length || 0}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Zamówienia
                </div>
              </div>

              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                  {customer.shipping_addresses?.length || 0}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Adresy
                </div>
              </div>

              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                  VIP
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Status klienta
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
                Ostatnie zamówienia
              </h2>

              {customer.orders && customer.orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {customer.orders.slice(0, 5).map((order) => (
                    <Link
                      key={order.id}
                      href={`/${locale}/account/orders/${order.id}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                          Zamówienie #{order.display_id}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(order.created_at).toLocaleDateString('pl-PL')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', color: '#3b82f6', marginBottom: '0.25rem' }}>
                          {(order.total / 100).toFixed(2)} {order.currency_code.toUpperCase()}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: order.status === 'completed' ? '#d1fae5' : '#fef3c7',
                          color: order.status === 'completed' ? '#065f46' : '#92400e',
                          borderRadius: '0.25rem',
                          fontWeight: '600',
                        }}>
                          {order.status}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                  <p>Nie masz jeszcze żadnych zamówień</p>
                  <Link href={`/${locale}/products`}>
                    <button style={{
                      marginTop: '1rem',
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
          </div>
        </div>
      </div>
    </div>
  )
}
