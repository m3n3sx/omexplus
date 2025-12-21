'use client'

/**
 * EnquiryModal - Modal do zapytań o produkty na zamówienie
 * Wysyła zapytanie do backendu i zapisuje w bazie
 */

import { useState } from 'react'

interface Product {
  id: string
  title: string
  handle?: string
  sku?: string
  thumbnail?: string
}

interface EnquiryModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function EnquiryModal({ product, isOpen, onClose }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: 1,
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      
      const response = await fetch(`${backendUrl}/store/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          product_title: product.title,
          product_sku: product.sku,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          company_name: formData.company,
          quantity: formData.quantity,
          message: formData.message,
          type: 'product_enquiry',
        }),
      })

      if (!response.ok) {
        throw new Error('Nie udało się wysłać zapytania')
      }

      setSuccess(true)
      
      // Reset form after 3 seconds and close
      setTimeout(() => {
        setSuccess(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          quantity: 1,
          message: '',
        })
        onClose()
      }, 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-secondary-800">
              Zapytaj o produkt
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
            >
              <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-neutral-200">
              {product.thumbnail ? (
                <img src={product.thumbnail} alt={product.title} className="w-12 h-12 object-contain" />
              ) : (
                <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="font-bold text-secondary-800 line-clamp-2">{product.title}</h3>
              {product.sku && (
                <p className="text-xs text-secondary-500 mt-1">SKU: {product.sku}</p>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary-800 mb-2">
              Zapytanie wysłane!
            </h3>
            <p className="text-secondary-600">
              Odpowiemy najszybciej jak to możliwe, zwykle w ciągu 15 minut.
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 outline-none transition-colors"
                  placeholder="Jan Kowalski"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 outline-none transition-colors"
                  placeholder="jan@firma.pl"
                />
              </div>
            </div>

            {/* Phone & Company */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 outline-none transition-colors"
                  placeholder="+48 500 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">
                  Firma
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 outline-none transition-colors"
                  placeholder="Nazwa firmy"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-1">
                Ilość sztuk
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-32 px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 outline-none transition-colors"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-1">
                Dodatkowe informacje
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 outline-none transition-colors resize-none"
                placeholder="Np. numer seryjny maszyny, pilność zamówienia..."
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                loading
                  ? 'bg-neutral-400 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Wysyłanie...
                </span>
              ) : (
                'Wyślij zapytanie'
              )}
            </button>

            {/* Info */}
            <p className="text-xs text-secondary-500 text-center">
              Odpowiadamy zwykle w ciągu 15 minut w godzinach pracy (8:00-16:00)
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
