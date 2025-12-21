'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function DeliveryPage() {
  const locale = useLocale()

  const deliveryOptions = [
    {
      icon: <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
      name: 'Kurier DPD/DHL',
      time: '1-2 dni robocze',
      price: 'od 15 zł',
      desc: 'Standardowa dostawa kurierska'
    },
    {
      icon: <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      name: 'Kurier Express',
      time: '24 godziny',
      price: 'od 35 zł',
      desc: 'Ekspresowa dostawa następnego dnia'
    },
    {
      icon: <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
      name: 'Paleta',
      time: '2-3 dni robocze',
      price: 'wycena indywidualna',
      desc: 'Dla większych zamówień'
    },
    {
      icon: <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      name: 'Odbiór osobisty',
      time: 'od ręki',
      price: 'bezpłatnie',
      desc: 'Września, ul. Gnieźnieńska 19'
    }
  ]

  const paymentMethods = [
    { icon: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>, name: 'Karta płatnicza', desc: 'Visa, Mastercard, Maestro' },
    { icon: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, name: 'Przelew bankowy', desc: 'Tradycyjny przelew' },
    { icon: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>, name: 'BLIK', desc: 'Szybka płatność mobilna' },
    { icon: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>, name: 'Przelewy24', desc: 'Szybkie przelewy online' },
    { icon: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, name: 'Płatność odroczona', desc: 'Dla klientów B2B (14/30/60 dni)' },
    { icon: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, name: 'Za pobraniem', desc: 'Płatność przy odbiorze' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-secondary-500">
          <Link href={`/${locale}`} className="text-primary-500 hover:underline">Strona główna</Link>
          {' / '}
          <span>Dostawa i płatność</span>
        </div>

        {/* Hero */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Informacje</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading">
            Dostawa i <span className="text-primary-500">Płatność</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl">
            Szybka i bezpieczna dostawa w całej Polsce. Wiele wygodnych form płatności.
          </p>
        </div>

        {/* Delivery Options */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Wysyłka</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mt-4 font-heading">
              Opcje <span className="text-primary-500">dostawy</span>
            </h2>
            <div className="flex justify-center gap-1 mt-4">
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryOptions.map((option, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary-500">
                <div className="mb-4">{option.icon}</div>
                <h3 className="font-bold text-secondary-700 mb-2">{option.name}</h3>
                <p className="text-primary-500 font-semibold text-sm mb-1">{option.time}</p>
                <p className="text-secondary-700 font-bold mb-2">{option.price}</p>
                <p className="text-secondary-500 text-sm">{option.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Free Delivery Info */}
        <div className="bg-primary-500 rounded-lg p-8 mb-16 text-white text-center">
          <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            Darmowa dostawa od 500 zł!
          </h3>
          <p className="text-white/90">Zamów za minimum 500 zł i nie płać za przesyłkę</p>
        </div>

        {/* Payment Methods */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Płatności</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mt-4 font-heading">
              Formy <span className="text-primary-500">płatności</span>
            </h2>
            <div className="flex justify-center gap-1 mt-4">
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0">{method.icon}</div>
                <div>
                  <h3 className="font-bold text-secondary-700 mb-1">{method.name}</h3>
                  <p className="text-secondary-500 text-sm">{method.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-secondary-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              Ważne informacje
            </h3>
            <ul className="space-y-2 text-secondary-600 text-sm">
              <li>• Zamówienia złożone do 14:00 wysyłamy tego samego dnia</li>
              <li>• Każda przesyłka jest ubezpieczona</li>
              <li>• Otrzymasz numer śledzenia przesyłki na email</li>
              <li>• Możliwość dostawy na budowę lub do magazynu</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-secondary-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Dla firm (B2B)
            </h3>
            <ul className="space-y-2 text-secondary-600 text-sm">
              <li>• Płatność odroczona z terminem 14, 30 lub 60 dni</li>
              <li>• Indywidualne warunki dla stałych klientów</li>
              <li>• Faktura VAT do każdego zamówienia</li>
              <li>• Dedykowany opiekun klienta</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <h2 className="text-2xl font-bold mb-4">Masz pytania o dostawę?</h2>
          <p className="text-neutral-300 mb-6">Skontaktuj się z nami - chętnie pomożemy!</p>
          <Link href={`/${locale}/kontakt`} className="inline-block px-8 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">
            Skontaktuj się
          </Link>
        </div>
      </div>
    </div>
  )
}
