'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function AccountPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'favorites'>('profile')

  // Mock user data
  const user = {
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com',
    company: 'OMEX Sp. z o.o.',
    taxId: 'PL1234567890',
    phone: '+48 123 456 789'
  }

  const orders = [
    { id: 'ORD-001', date: '2024-12-01', status: 'Dostarczone', total: 5250.00 },
    { id: 'ORD-002', date: '2024-11-28', status: 'W transporcie', total: 3420.00 },
    { id: 'ORD-003', date: '2024-11-15', status: 'Dostarczone', total: 8900.00 }
  ]

  const addresses = [
    {
      id: 1,
      type: 'Główny',
      name: 'OMEX Sp. z o.o.',
      street: 'ul. Przemysłowa 15',
      city: 'Warszawa',
      postal: '00-001',
      country: 'Polska'
    },
    {
      id: 2,
      type: 'Magazyn',
      name: 'OMEX - Magazyn',
      street: 'ul. Logistyczna 8',
      city: 'Łódź',
      postal: '90-001',
      country: 'Polska'
    }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <Link href={`/${locale}`} style={{ color: '#3b82f6' }}>
            {t('common.home')}
          </Link>
          {' / '}
          <span>Moje Konto</span>
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Moje Konto
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Zarządzaj swoim kontem, zamówieniami i ustawieniami
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
          {/* Sidebar Navigation */}
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', height: 'fit-content' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {user.firstName} {user.lastName}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {user.email}
              </div>
            </div>

            <nav>
              {[
                { id: 'profile', icon: '👤', label: 'Profil' },
                { id: 'orders', icon: '📦', label: 'Zamówienia' },
                { id: 'addresses', icon: '📍', label: 'Adresy' },
                { id: 'favorites', icon: '❤️', label: 'Ulubione' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    marginBottom: '0.5rem',
                    backgroundColor: activeTab === item.id ? '#eff6ff' : 'transparent',
                    color: activeTab === item.id ? '#3b82f6' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: activeTab === item.id ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
              <button
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                🚪 Wyloguj się
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {activeTab === 'profile' && (
              <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  Informacje o koncie
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Imię
                    </label>
                    <input
                      type="text"
                      value={user.firstName}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Nazwisko
                    </label>
                    <input
                      type="text"
                      value={user.lastName}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={user.phone}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Firma
                    </label>
                    <input
                      type="text"
                      value={user.company}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      NIP
                    </label>
                    <input
                      type="text"
                      value={user.taxId}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                  <button
                    style={{
                      padding: '0.875rem 2rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Edytuj profil
                  </button>
                  <button
                    style={{
                      padding: '0.875rem 2rem',
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Zmień hasło
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  Historia zamówień
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/${locale}/orders/${order.id}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '150px 150px 1fr 150px 100px',
                        alignItems: 'center',
                        gap: '1.5rem',
                        padding: '1.5rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.75rem',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          Numer zamówienia
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                          {order.id}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          Data
                        </div>
                        <div style={{ fontSize: '1rem' }}>
                          {order.date}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          Status
                        </div>
                        <div style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: order.status === 'Dostarczone' ? '#d1fae5' : '#dbeafe',
                          color: order.status === 'Dostarczone' ? '#065f46' : '#1e40af',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          {order.status}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          Wartość
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#3b82f6' }}>
                          {order.total.toFixed(2)} PLN
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.5rem' }}>→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Zapisane adresy
                  </h2>
                  <button
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    + Dodaj adres
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.75rem',
                        border: address.type === 'Główny' ? '2px solid #3b82f6' : '2px solid transparent'
                      }}
                    >
                      <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: address.type === 'Główny' ? '#dbeafe' : '#f3f4f6',
                        color: address.type === 'Główny' ? '#1e40af' : '#6b7280',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        marginBottom: '1rem'
                      }}>
                        {address.type}
                      </div>

                      <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>
                        {address.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                        {address.street}<br />
                        {address.postal} {address.city}<br />
                        {address.country}
                      </div>

                      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <button
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'transparent',
                            color: '#3b82f6',
                            border: '1px solid #3b82f6',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          Edytuj
                        </button>
                        <button
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            border: '1px solid #ef4444',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  Ulubione produkty
                </h2>

                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❤️</div>
                  <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1rem' }}>
                    Nie masz jeszcze ulubionych produktów
                  </p>
                  <Link
                    href={`/${locale}/products`}
                    style={{
                      display: 'inline-block',
                      padding: '0.875rem 2rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      textDecoration: 'none'
                    }}
                  >
                    Przeglądaj produkty
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
