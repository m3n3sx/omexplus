'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function CheckoutErrorPage() {
  const locale = useLocale()
  const searchParams = useSearchParams()
  
  const orderId = searchParams.get('order')
  const errorMessage = searchParams.get('error')

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-6 text-white text-5xl shadow-lg">
            ✕
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Płatność nie powiodła się
          </h1>
          <p className="text-lg text-neutral-600">
            Niestety, wystąpił problem z przetworzeniem Twojej płatności
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 mb-6">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div>
                  <div className="font-semibold text-red-800 mb-1">Szczegóły błędu</div>
                  <div className="text-sm text-red-700">{decodeURIComponent(errorMessage)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="font-semibold text-neutral-900">Co możesz zrobić?</h2>
            
            <div className="flex gap-3">
              <span className="text-xl">💳</span>
              <div>
                <div className="font-medium text-neutral-900">Sprawdź dane karty</div>
                <div className="text-sm text-neutral-500">
                  Upewnij się, że numer karty, data ważności i kod CVV są poprawne
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">💰</span>
              <div>
                <div className="font-medium text-neutral-900">Sprawdź środki na koncie</div>
                <div className="text-sm text-neutral-500">
                  Upewnij się, że masz wystarczające środki na koncie bankowym
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">🔄</span>
              <div>
                <div className="font-medium text-neutral-900">Spróbuj innej metody płatności</div>
                <div className="text-sm text-neutral-500">
                  Możesz wybrać BLIK, przelew bankowy lub inną kartę
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">📞</span>
              <div>
                <div className="font-medium text-neutral-900">Skontaktuj się z bankiem</div>
                <div className="text-sm text-neutral-500">
                  Twój bank mógł zablokować transakcję ze względów bezpieczeństwa
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href={`/${locale}/checkout`} className="block">
            <button className="w-full py-4 px-6 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
              Spróbuj ponownie
            </button>
          </Link>
          <Link href={`/${locale}/cart`} className="block">
            <button className="w-full py-4 px-6 bg-white text-neutral-700 border-2 border-neutral-300 rounded-xl font-semibold hover:bg-neutral-50 transition-colors">
              Wróć do koszyka
            </button>
          </Link>
        </div>

        {/* Help section */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Potrzebujesz pomocy?</h3>
          <p className="text-sm text-blue-700 mb-4">
            Jeśli problem się powtarza, skontaktuj się z naszym zespołem obsługi klienta.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="mailto:omexplus@gmail.com" className="text-blue-600 hover:underline flex items-center gap-1">
              📧 omexplus@gmail.com
            </a>
            <a href="tel:+48500169060" className="text-blue-600 hover:underline flex items-center gap-1">
              📞 +48 500 169 060
            </a>
          </div>
        </div>

        {/* Order reference */}
        {orderId && (
          <div className="mt-6 text-center text-sm text-neutral-500">
            Numer referencyjny: <span className="font-mono">{orderId}</span>
          </div>
        )}
      </div>
    </div>
  )
}
