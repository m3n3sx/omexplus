'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCartContext } from '@/contexts/CartContext'

interface OrderData {
  id: string
  display_id?: number
  email?: string
  total?: number
  shipping_address?: {
    first_name?: string
    last_name?: string
    address_1?: string
    city?: string
    postal_code?: string
  }
  items?: Array<{
    id: string
    title: string
    quantity: number
    unit_price: number
  }>
  created_at?: string
}

export default function OrderSuccessPage() {
  const t = useTranslations()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const { clearCart } = useCartContext()
  
  const [mounted, setMounted] = useState(false)
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('')

  const orderId = searchParams.get('order')

  useEffect(() => {
    setMounted(true)
    
    // Clear cart on order success
    clearCart()
    
    // Set order number (client-side only to avoid hydration mismatch)
    if (orderId && orderId !== 'success') {
      setOrderNumber(orderId.slice(0, 12).toUpperCase())
      fetchOrderDetails(orderId)
    } else {
      setOrderNumber(`ORD-${Date.now().toString().slice(-6)}`)
      setLoading(false)
    }
    
    // Set estimated delivery date (client-side only)
    const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    setEstimatedDelivery(deliveryDate.toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }))
  }, [orderId])

  // Update order number when order data is loaded
  useEffect(() => {
    if (order?.display_id) {
      setOrderNumber(`ORD-${order.display_id}`)
    }
  }, [order])

  const fetchOrderDetails = async (id: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
      
      const response = await fetch(`${backendUrl}/store/orders/${id}`, {
        headers: {
          'x-publishable-api-key': apiKey,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order || data)
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  // Show loading state until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Ładowanie...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 text-white text-5xl shadow-lg">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Dziękujemy za zamówienie!
          </h1>
          <p className="text-lg text-neutral-600">
            Twoje zamówienie zostało pomyślnie złożone
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 mb-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-sm text-neutral-500 mb-1">Numer zamówienia</div>
              <div className="text-2xl font-bold text-primary-600">{orderNumber || '...'}</div>
            </div>
            <div>
              <div className="text-sm text-neutral-500 mb-1">Przewidywana dostawa</div>
              <div className="text-lg font-semibold text-neutral-900">{estimatedDelivery || '...'}</div>
            </div>
          </div>

          {/* Order total if available */}
          {order?.total && (
            <div className="p-4 bg-neutral-50 rounded-xl mb-6">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Suma zamówienia:</span>
                <span className="text-xl font-bold text-neutral-900">
                  {(order.total / 100).toFixed(2)} zł
                </span>
              </div>
            </div>
          )}

          {/* Email confirmation */}
          <div className="p-4 bg-blue-50 rounded-xl mb-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl">📧</div>
              <div>
                <div className="font-semibold text-neutral-900 mb-1">
                  Potwierdzenie wysłane
                </div>
                <div className="text-sm text-neutral-600">
                  {order?.email 
                    ? `Wysłaliśmy potwierdzenie na adres ${order.email}`
                    : 'Sprawdź swoją skrzynkę email, aby zobaczyć szczegóły zamówienia'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Shipping address if available */}
          {order?.shipping_address && (
            <div className="p-4 bg-neutral-50 rounded-xl mb-6">
              <div className="flex items-start gap-4">
                <div className="text-2xl">📍</div>
                <div>
                  <div className="font-semibold text-neutral-900 mb-1">Adres dostawy</div>
                  <div className="text-sm text-neutral-600">
                    <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                    <p>{order.shipping_address.address_1}</p>
                    <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tracking Info Placeholder */}
          <div className="p-6 border-2 border-dashed border-neutral-300 rounded-xl text-center">
            <div className="text-3xl mb-2">📦</div>
            <div className="font-semibold text-neutral-900 mb-1">
              Numer śledzenia będzie dostępny wkrótce
            </div>
            <div className="text-sm text-neutral-500">
              Otrzymasz powiadomienie email, gdy Twoja przesyłka zostanie wysłana
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href={`/${locale}/zamowienia`} className="block">
            <button className="w-full py-4 px-6 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
              Moje zamówienia
            </button>
          </Link>
          <Link href={`/${locale}/products`} className="block">
            <button className="w-full py-4 px-6 bg-white text-primary-600 border-2 border-primary-500 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
              Kontynuuj zakupy
            </button>
          </Link>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Co dalej?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                ✓
              </div>
              <div>
                <div className="font-semibold text-neutral-900 mb-1">Zamówienie przyjęte</div>
                <div className="text-sm text-neutral-500">
                  Twoje zamówienie zostało zarejestrowane w naszym systemie
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold flex-shrink-0 animate-pulse">
                2
              </div>
              <div>
                <div className="font-semibold text-neutral-900 mb-1">Przygotowujemy zamówienie</div>
                <div className="text-sm text-neutral-500">
                  Nasz zespół kompletuje Twoje produkty do wysyłki
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <div className="font-semibold text-neutral-900 mb-1">Wysyłka</div>
                <div className="text-sm text-neutral-500">
                  Otrzymasz email z numerem śledzenia przesyłki
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <div className="font-semibold text-neutral-900 mb-1">Dostawa</div>
                <div className="text-sm text-neutral-500">
                  Przewidywana data dostawy: {estimatedDelivery || '...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>Masz pytania? Skontaktuj się z nami:</p>
          <p className="mt-1">
            <a href="mailto:omexplus@gmail.com" className="text-primary-600 hover:underline">
              omexplus@gmail.com
            </a>
            {' • '}
            <a href="tel:+48500169060" className="text-primary-600 hover:underline">
              +48 500 169 060
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
