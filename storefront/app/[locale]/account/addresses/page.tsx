'use client'

import { useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function AddressesPage() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const { customer, loading: authLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/account/login`)
    }
  }, [authLoading, isAuthenticated, router, locale])

  if (authLoading || !customer) {
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
            {t('account.addresses')}
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
            <span>Adresy</span>
          </div>
        </div>

        {/* Addresses Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Billing Address */}
          {customer.billing_address && (
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '2px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                  📍 Adres rozliczeniowy
                </h3>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '0.25rem',
                  fontWeight: '600',
                }}>
                  GŁÓWNY
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                {customer.billing_address.first_name} {customer.billing_address.last_name}<br />
                {customer.billing_address.address_1}<br />
                {customer.billing_address.address_2 && <>{customer.billing_address.address_2}<br /></>}
                {customer.billing_address.postal_code} {customer.billing_address.city}<br />
                {customer.billing_address.country_code?.toUpperCase()}<br />
                {customer.billing_address.phone && <>Tel: {customer.billing_address.phone}</>}
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                  {t('common.edit')}
                </button>
              </div>
            </div>
          )}

          {/* Shipping Addresses */}
          {customer.shipping_addresses && customer.shipping_addresses.length > 0 ? (
            customer.shipping_addresses.map((address, index) => (
              <div key={address.id || index} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                    📦 Adres dostawy {index + 1}
                  </h3>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                  {address.first_name} {address.last_name}<br />
                  {address.address_1}<br />
                  {address.address_2 && <>{address.address_2}<br /></>}
                  {address.postal_code} {address.city}<br />
                  {address.country_code?.toUpperCase()}<br />
                  {address.phone && <>Tel: {address.phone}</>}
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: 'white',
                    color: '#3b82f6',
                    border: '1px solid #3b82f6',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}>
                    {t('common.edit')}
                  </button>
                  <button style={{
                    padding: '0.5rem',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}>
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            ))
          ) : null}

          {/* Add New Address Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '2px dashed #d1d5db',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#9ca3af' }}>➕</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
              Dodaj nowy adres
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center' }}>
              Kliknij aby dodać nowy adres dostawy
            </p>
          </div>
        </div>

        {/* Empty State */}
        {!customer.billing_address && (!customer.shipping_addresses || customer.shipping_addresses.length === 0) && (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '0.75rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📍</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
              Brak zapisanych adresów
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Dodaj swój pierwszy adres dostawy
            </p>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
              Dodaj adres
            </button>
          </div>
        )}

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
