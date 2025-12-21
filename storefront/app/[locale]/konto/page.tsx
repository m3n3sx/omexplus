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
    phone: '+48 500 169 060'
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
      street: 'ul. Gnieźnieńska 19',
      city: 'Września',
      postal: '62-300',
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
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-[#E8F4FE] to-[#D4EBFC] py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-[60px]">
        {/* Breadcrumb */}
        <div className="mb-6 text-[13px] text-neutral-600">
          <Link href={`/${locale}`} className="hover:text-neutral-900 transition-colors">
            {t('common.home')}
          </Link>
          {' / '}
          <span>Moje Konto</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            Moje Konto
          </h1>
          <p className="text-[14px] text-neutral-600">
            Zarządzaj swoim kontem, zamówieniami i ustawieniami
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#D4EBFC] h-fit lg:sticky lg:top-24 shadow-lg">
            <div className="mb-6 pb-6 border-b border-neutral-200">
              <div className="text-[16px] font-bold text-neutral-900 mb-1">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-[13px] text-neutral-600">
                {user.email}
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#F9580E] text-white shadow-lg shadow-[#F9580E]/30'
                    : 'text-neutral-700 hover:bg-[#FEF3EE]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#F9580E] text-white shadow-lg shadow-[#F9580E]/30'
                    : 'text-neutral-700 hover:bg-[#FEF3EE]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Zamówienia
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-[#F9580E] text-white shadow-lg shadow-[#F9580E]/30'
                    : 'text-neutral-700 hover:bg-[#FEF3EE]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Adresy
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-[#F9580E] text-white shadow-lg shadow-[#F9580E]/30'
                    : 'text-neutral-700 hover:bg-[#FEF3EE]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Ulubione
              </button>
            </nav>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-[14px] font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Wyloguj się
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl p-6 md:p-8 border border-neutral-200">
                <h2 className="text-[18px] font-bold text-neutral-900 mb-6">
                  Informacje o koncie
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Imię
                    </label>
                    <input
                      type="text"
                      value={user.firstName}
                      readOnly
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Nazwisko
                    </label>
                    <input
                      type="text"
                      value={user.lastName}
                      readOnly
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={user.phone}
                      readOnly
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Firma
                    </label>
                    <input
                      type="text"
                      value={user.company}
                      readOnly
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      NIP
                    </label>
                    <input
                      type="text"
                      value={user.taxId}
                      readOnly
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] bg-neutral-50"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button className="px-6 py-3 bg-[#F9580E] text-white rounded-2xl text-[14px] font-bold hover:bg-[#E04D0B] transition-all shadow-lg shadow-[#F9580E]/30">
                    Edytuj profil
                  </button>
                  <button className="px-6 py-3 bg-white text-neutral-900 border border-neutral-300 rounded-lg text-[14px] font-semibold hover:bg-neutral-50 transition-colors">
                    Zmień hasło
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl p-6 md:p-8 border border-neutral-200">
                <h2 className="text-[18px] font-bold text-neutral-900 mb-6">
                  Historia zamówień
                </h2>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/${locale}/orders/${order.id}`}
                      className="block p-5 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-900 transition-all group"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-[12px] text-neutral-600 mb-1">
                            Numer zamówienia
                          </div>
                          <div className="text-[14px] font-semibold text-neutral-900">
                            {order.id}
                          </div>
                        </div>

                        <div>
                          <div className="text-[12px] text-neutral-600 mb-1">
                            Data
                          </div>
                          <div className="text-[14px] text-neutral-900">
                            {order.date}
                          </div>
                        </div>

                        <div>
                          <div className="text-[12px] text-neutral-600 mb-1">
                            Status
                          </div>
                          <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-semibold ${
                            order.status === 'Dostarczone'
                              ? 'bg-primary-100 text-secondary-700'
                              : 'bg-info/10 text-secondary-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between md:justify-end">
                          <div>
                            <div className="text-[12px] text-neutral-600 mb-1">
                              Wartość
                            </div>
                            <div className="text-[16px] font-bold text-neutral-900">
                              {order.total.toFixed(2)} PLN
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 transition-colors ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-xl p-6 md:p-8 border border-neutral-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-[18px] font-bold text-neutral-900">
                    Zapisane adresy
                  </h2>
                  <button className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-[13px] font-semibold hover:bg-neutral-800 transition-colors">
                    + Dodaj adres
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-5 rounded-lg border-2 ${
                        address.type === 'Główny'
                          ? 'border-neutral-900 bg-neutral-50'
                          : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold mb-4 ${
                        address.type === 'Główny'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}>
                        {address.type}
                      </span>

                      <div className="mb-2 font-semibold text-[14px] text-neutral-900">
                        {address.name}
                      </div>
                      <div className="text-[13px] text-neutral-600 leading-relaxed">
                        {address.street}<br />
                        {address.postal} {address.city}<br />
                        {address.country}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button className="px-4 py-2 bg-white text-neutral-900 border border-neutral-300 rounded-lg text-[12px] font-semibold hover:bg-neutral-50 transition-colors">
                          Edytuj
                        </button>
                        <button className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg text-[12px] font-semibold hover:bg-red-50 transition-colors">
                          Usuń
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-xl p-6 md:p-8 border border-neutral-200">
                <h2 className="text-[18px] font-bold text-neutral-900 mb-6">
                  Ulubione produkty
                </h2>

                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-[#FEF3EE] rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#F9580E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-[14px] text-neutral-600 mb-6">
                    Nie masz jeszcze ulubionych produktów
                  </p>
                  <Link
                    href={`/${locale}/products`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#F9580E] text-white rounded-lg text-[14px] font-semibold hover:bg-[#E04D0B] transition-colors"
                  >
                    Przeglądaj produkty
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
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
