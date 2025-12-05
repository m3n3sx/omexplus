'use client'

import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bądź na bieżąco
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            Zapisz się do newslettera i otrzymuj informacje o nowościach, promocjach i ekskluzywnych ofertach
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Twój adres email..."
                required
                disabled={status === 'loading' || status === 'success'}
                className="flex-1 px-6 py-4 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="px-8 py-4 bg-secondary-500 text-white rounded-lg font-semibold hover:bg-secondary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg whitespace-nowrap"
              >
                {status === 'loading' && 'Zapisywanie...'}
                {status === 'success' && '✓ Zapisano!'}
                {status === 'idle' && 'Zapisz się'}
                {status === 'error' && 'Spróbuj ponownie'}
              </button>
            </div>

            {/* Success message */}
            {status === 'success' && (
              <div className="mt-4 p-4 bg-success/20 backdrop-blur-sm border border-success/30 rounded-lg text-sm">
                Dziękujemy! Sprawdź swoją skrzynkę email.
              </div>
            )}
          </form>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Ekskluzywne oferty</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Wczesny dostęp</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Porady eksperckie</span>
            </div>
          </div>

          {/* Privacy note */}
          <p className="text-xs text-white/60 mt-6">
            Szanujemy Twoją prywatność. Możesz wypisać się w każdej chwili.
          </p>
        </div>
      </div>
    </section>
  )
}
