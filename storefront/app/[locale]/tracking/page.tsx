'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function TrackingPage() {
  const t = useTranslations()
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
      // TODO: Implement real tracking API
      // For now, show mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTrackingData({
        number: trackingNumber,
        status: 'W transporcie',
        estimatedDelivery: '2024-12-10',
        events: [
          { date: '2024-12-07 14:30', status: 'Przesyłka w transporcie', location: 'Warszawa' },
          { date: '2024-12-07 10:15', status: 'Przesyłka odebrana przez kuriera', location: 'Katowice' },
          { date: '2024-12-06 16:45', status: 'Przesyłka nadana', location: 'Katowice' },
        ]
      })
    } catch (err) {
      setError('Nie znaleziono przesyłki o podanym numerze')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Śledzenie przesyłki</h1>
        <p className="text-neutral-600 mb-8">
          Wprowadź numer przesyłki, aby sprawdzić status dostawy
        </p>

        <form onSubmit={handleTrack} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Numer przesyłki (np. 1234567890)"
              className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Szukam...' : 'Śledź'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-red-600 text-sm">{error}</p>
          )}
        </form>

        {trackingData && (
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-neutral-100">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Numer przesyłki</p>
                <p className="text-xl font-bold">{trackingData.number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-600 mb-1">Status</p>
                <p className="text-xl font-bold text-primary-600">{trackingData.status}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-neutral-600 mb-1">Przewidywana dostawa</p>
              <p className="text-lg font-semibold">{new Date(trackingData.estimatedDelivery).toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Historia przesyłki</h3>
              <div className="space-y-4">
                {trackingData.events.map((event: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-primary-600' : 'bg-neutral-300'}`} />
                      {index < trackingData.events.length - 1 && (
                        <div className="w-0.5 h-full bg-neutral-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold">{event.status}</p>
                      <p className="text-sm text-neutral-600">{event.location}</p>
                      <p className="text-xs text-neutral-500 mt-1">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 bg-neutral-50 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Potrzebujesz pomocy?</h3>
          <p className="text-neutral-600 mb-4">
            Jeśli masz pytania dotyczące swojej przesyłki, skontaktuj się z nami:
          </p>
          <div className="flex flex-col gap-2">
            <a href="tel:+48123456789" className="text-primary-600 hover:text-primary-700 font-semibold">
              📞 +48 123 456 789
            </a>
            <a href="mailto:kontakt@omex.pl" className="text-primary-600 hover:text-primary-700 font-semibold">
              ✉️ kontakt@omex.pl
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
