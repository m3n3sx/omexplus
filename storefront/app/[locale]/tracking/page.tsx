'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function TrackingPage() {
  const locale = useLocale()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingData, setTrackingData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trackingNumber.trim()) {
      setError('Wprowadź numer przesyłki')
      return
    }

    setLoading(true)
    setError('')
    setTrackingData(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTrackingData({
        number: trackingNumber,
        status: 'W transporcie',
        estimatedDelivery: '2024-12-20',
        carrier: 'DPD',
        events: [
          { date: '2024-12-18 14:30', status: 'Przesyłka w transporcie', location: 'Warszawa - Sortownia' },
          { date: '2024-12-18 10:15', status: 'Przesyłka odebrana przez kuriera', location: 'Września' },
          { date: '2024-12-17 16:45', status: 'Przesyłka nadana', location: 'OMEX - Września' },
        ]
      })
    } catch (err) {
      setError('Nie znaleziono przesyłki o podanym numerze')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-secondary-500">
          <Link href={`/${locale}`} className="text-primary-500 hover:underline">Strona główna</Link>
          {' / '}
          <span>Śledzenie przesyłki</span>
        </div>

        {/* Hero */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Dostawa</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading">
            Śledzenie <span className="text-primary-500">Przesyłki</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl">
            Wprowadź numer przesyłki, aby sprawdzić aktualny status dostawy Twojego zamówienia.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg p-8 lg:p-12 shadow-sm mb-12">
          <div className="flex gap-1 mb-6">
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
          </div>
          <h2 className="text-2xl font-bold text-secondary-700 mb-6">Wyszukaj przesyłkę</h2>

          <form onSubmit={handleTrack} className="max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Numer przesyłki (np. 1234567890)"
                  className="w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-primary-500 text-white rounded-lg font-bold hover:bg-primary-600 transition-colors disabled:bg-neutral-400 whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Szukam...
                  </span>
                ) : 'Śledź przesyłkę'}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-red-600 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </form>

          <p className="mt-4 text-secondary-500 text-sm">
            Numer przesyłki znajdziesz w emailu z potwierdzeniem wysyłki lub w sekcji "Moje zamówienia".
          </p>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="bg-white rounded-lg p-8 lg:p-12 shadow-sm mb-12">
            {/* Status Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-neutral-200">
              <div>
                <p className="text-sm text-secondary-500 mb-1">Numer przesyłki</p>
                <p className="text-2xl font-bold text-secondary-700">{trackingData.number}</p>
                <p className="text-sm text-secondary-500 mt-1">Przewoźnik: {trackingData.carrier}</p>
              </div>
              <div className="lg:text-right">
                <p className="text-sm text-secondary-500 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></span>
                  <p className="text-2xl font-bold text-primary-500">{trackingData.status}</p>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="py-6 border-b border-neutral-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-500 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Przewidywana dostawa</p>
                  <p className="text-xl font-bold text-secondary-700">
                    {new Date(trackingData.estimatedDelivery).toLocaleDateString('pl-PL', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-8">
              <h3 className="text-lg font-bold text-secondary-700 mb-6">Historia przesyłki</h3>
              <div className="space-y-0">
                {trackingData.events.map((event: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-4 ${
                        index === 0 
                          ? 'bg-primary-500 border-primary-200' 
                          : 'bg-white border-neutral-300'
                      }`} />
                      {index < trackingData.events.length - 1 && (
                        <div className="w-0.5 h-16 bg-neutral-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className={`font-bold ${index === 0 ? 'text-primary-500' : 'text-secondary-700'}`}>
                        {event.status}
                      </p>
                      <p className="text-secondary-500 text-sm">{event.location}</p>
                      <p className="text-secondary-400 text-xs mt-1">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-secondary-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Gdzie znajdę numer przesyłki?
            </h3>
            <ul className="space-y-2 text-secondary-600 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                W emailu z potwierdzeniem wysyłki
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                W sekcji "Moje zamówienia" na Twoim koncie
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                W SMS-ie od przewoźnika
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-secondary-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Potrzebujesz pomocy?
            </h3>
            <p className="text-secondary-600 text-sm mb-4">
              Jeśli masz pytania dotyczące swojej przesyłki, skontaktuj się z nami:
            </p>
            <div className="space-y-2">
              <a href="tel:+48500169060" className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +48 500 169 060
              </a>
              <a href="mailto:omexplus@gmail.com" className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                omexplus@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <h2 className="text-2xl font-bold mb-4">Nie znalazłeś swojej przesyłki?</h2>
          <p className="text-neutral-300 mb-6">Skontaktuj się z nami, a pomożemy Ci zlokalizować Twoje zamówienie</p>
          <Link href={`/${locale}/kontakt`} className="inline-block px-8 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">
            Skontaktuj się z nami
          </Link>
        </div>
      </div>
    </div>
  )
}
