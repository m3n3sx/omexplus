'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon?: string
  provider: 'tpay' | 'stripe' | 'cod'
  available: boolean
}

interface PaymentMethodsProps {
  selectedMethod: string | null
  onMethodSelect: (methodId: string) => void
  onBlikCodeChange?: (code: string) => void
  totalAmount: number
}

export function PaymentMethods({ 
  selectedMethod, 
  onMethodSelect, 
  onBlikCodeChange,
  totalAmount 
}: PaymentMethodsProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [blikCode, setBlikCode] = useState('')

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      // Use local Next.js API route
      const response = await fetch('/api/payments/methods')
      
      if (response.ok) {
        const data = await response.json()
        setMethods(data.methods || [])
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error)
      // Fallback methods
      setMethods([
        {
          id: 'cash_on_delivery',
          name: 'Płatność przy odbiorze',
          description: 'Zapłać gotówką lub kartą przy odbiorze przesyłki',
          provider: 'cod',
          available: true,
        },
        {
          id: 'tpay_blik',
          name: 'BLIK',
          description: 'Szybka płatność kodem BLIK',
          provider: 'tpay',
          available: true,
        },
        {
          id: 'tpay_transfer',
          name: 'Przelew bankowy',
          description: 'Przelew online z Twojego banku',
          provider: 'tpay',
          available: true,
        },
        {
          id: 'tpay_card',
          name: 'Karta płatnicza',
          description: 'Visa, Mastercard, Maestro',
          provider: 'tpay',
          available: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleBlikCodeChange = (value: string) => {
    // Only allow 6 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 6)
    setBlikCode(cleaned)
    onBlikCodeChange?.(cleaned)
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg" />
        ))}
      </div>
    )
  }

  // Group methods by type
  const popularMethods = methods.filter(m => 
    ['tpay_blik', 'tpay_transfer', 'tpay_card', 'cash_on_delivery'].includes(m.id)
  )
  const otherMethods = methods.filter(m => 
    !['tpay_blik', 'tpay_transfer', 'tpay_card', 'cash_on_delivery'].includes(m.id)
  )

  return (
    <div className="space-y-6">
      {/* Popular methods */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Popularne metody płatności
        </h3>
        <div className="space-y-2">
          {popularMethods.map(method => (
            <div key={method.id}>
              <button
                onClick={() => onMethodSelect(method.id)}
                disabled={!method.available}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  selectedMethod === method.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {method.id === 'tpay_blik' && (
                    <span className="text-2xl font-bold text-pink-600">B</span>
                  )}
                  {method.id === 'tpay_transfer' && (
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  )}
                  {method.id === 'tpay_card' && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  )}
                  {method.id === 'cash_on_delivery' && (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">{method.name}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>

                {/* Radio indicator */}
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

              {/* BLIK code input */}
              {method.id === 'tpay_blik' && selectedMethod === 'tpay_blik' && (
                <div className="mt-3 ml-16 mr-9">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wpisz kod BLIK
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={blikCode}
                    onChange={(e) => handleBlikCodeChange(e.target.value)}
                    placeholder="______"
                    className="w-40 px-4 py-3 text-center text-2xl font-mono tracking-widest border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Kod znajdziesz w aplikacji bankowej
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Other methods */}
      {otherMethods.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Inne metody płatności
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {otherMethods.map(method => (
              <button
                key={method.id}
                onClick={() => onMethodSelect(method.id)}
                disabled={!method.available}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  selectedMethod === method.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-medium text-sm text-gray-900">{method.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Security badges */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Bezpieczna płatność
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Szyfrowanie SSL
        </div>
      </div>
    </div>
  )
}

export default PaymentMethods
