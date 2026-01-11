'use client'

import { useState, useEffect } from 'react'

interface ShippingMethod {
  id: string
  provider: string
  method: string
  name: string
  description: string
  price: number
  currency: string
  delivery_days: number
  icon: string
}

interface ShippingMethodsProps {
  selectedMethod: string | null
  onMethodSelect: (methodId: string, price: number) => void
  destination: {
    country: string
    postal_code: string
  }
  cartTotal: number
}

export function ShippingMethods({
  selectedMethod,
  onMethodSelect,
  destination,
  cartTotal,
}: ShippingMethodsProps) {
  const [methods, setMethods] = useState<ShippingMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(500)

  useEffect(() => {
    fetchShippingMethods()
  }, [destination])

  const fetchShippingMethods = async () => {
    try {
      // Use local Next.js API route
      const response = await fetch('/api/shipping/methods')
      
      if (response.ok) {
        const data = await response.json()
        if (data.methods && data.methods.length > 0) {
          setMethods(data.methods)
        } else {
          setMethods(getDefaultMethods())
        }
        setFreeShippingThreshold(data.free_shipping_threshold || 500)
      } else {
        setMethods(getDefaultMethods())
      }
    } catch (error) {
      console.error('Failed to fetch shipping methods:', error)
      setMethods(getDefaultMethods())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultMethods = (): ShippingMethod[] => [
    {
      id: 'inpost_paczkomat_24_7',
      provider: 'inpost',
      method: 'paczkomat_24_7',
      name: 'InPost Paczkomat 24/7',
      description: 'Odbiór w Paczkomacie 24/7 - dostępny całą dobę',
      price: 13.99,
      currency: 'PLN',
      delivery_days: 2,
      icon: '/images/shipping/inpost.svg',
    },
    {
      id: 'inpost_courier',
      provider: 'inpost',
      method: 'courier',
      name: 'InPost Kurier',
      description: 'Dostawa kurierem InPost pod wskazany adres',
      price: 18.99,
      currency: 'PLN',
      delivery_days: 1,
      icon: '/images/shipping/inpost.svg',
    },
    {
      id: 'dpd_standard',
      provider: 'dpd',
      method: 'standard',
      name: 'DPD Standard',
      description: 'Standardowa dostawa kurierska 1-2 dni robocze',
      price: 16.99,
      currency: 'PLN',
      delivery_days: 2,
      icon: '/images/shipping/dpd.svg',
    },
    {
      id: 'dhl_standard',
      provider: 'dhl',
      method: 'standard',
      name: 'DHL Standard',
      description: 'Dostawa standardowa 2-3 dni robocze',
      price: 19.99,
      currency: 'PLN',
      delivery_days: 3,
      icon: '/images/shipping/dhl.svg',
    },
  ]

  const isFreeShipping = cartTotal >= freeShippingThreshold
  const amountToFreeShipping = freeShippingThreshold - cartTotal

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Free shipping progress */}
      {!isFreeShipping && amountToFreeShipping > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span className="text-sm font-medium text-primary-800">
              Dodaj jeszcze {amountToFreeShipping.toFixed(2)} zł do darmowej dostawy!
            </span>
          </div>
          <div className="w-full bg-primary-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((cartTotal / freeShippingThreshold) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {isFreeShipping && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium text-green-800">
            Gratulacje! Masz darmową dostawę!
          </span>
        </div>
      )}

      {/* Shipping methods */}
      <div className="space-y-2">
        {methods.map(method => {
          const finalPrice = isFreeShipping ? 0 : method.price
          
          return (
            <button
              key={method.id}
              onClick={() => onMethodSelect(method.id, finalPrice)}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                selectedMethod === method.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {method.provider === 'omex' && (
                  <span className="text-lg font-bold text-green-600">🏪</span>
                )}
                {method.provider === 'inpost' && (
                  <span className="text-lg font-bold text-yellow-600">📦</span>
                )}
                {method.provider === 'dpd' && (
                  <span className="text-lg font-bold text-red-600">🚚</span>
                )}
                {method.provider === 'dhl' && (
                  <span className="text-lg font-bold text-yellow-500">✈️</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">{method.name}</div>
                <div className="text-sm text-gray-500">
                  {method.description || `Dostawa w ${method.delivery_days} dni robocze`}
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                {isFreeShipping ? (
                  <div>
                    <span className="text-green-600 font-bold">GRATIS</span>
                    <span className="text-sm text-gray-400 line-through ml-2">
                      {method.price.toFixed(2)} zł
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-gray-900">
                    {method.price.toFixed(2)} zł
                  </span>
                )}
              </div>

              {/* Radio */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method.id
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300'
              }`}>
                {selectedMethod === method.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ShippingMethods
