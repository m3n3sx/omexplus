'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useCartContext } from '@/contexts/CartContext'
import Image from 'next/image'

export default function CartPage() {
  const t = useTranslations()
  const locale = useLocale()
  const { cart, loading, updateItem, removeItem, itemCount } = useCartContext()

  const formatPrice = (amount: number, currencyCode: string = 'PLN') => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount / 100)
  }

  if (loading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-neutral-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-20">
        <div className="container mx-auto px-4 md:px-[60px]">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-7xl mb-6">🛒</div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
              {t('cart.empty')}
            </h1>
            <p className="text-[14px] text-neutral-600 mb-8">
              Dodaj produkty do koszyka, aby kontynuować zakupy
            </p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#1675F2] text-white rounded-2xl text-[14px] font-bold hover:bg-[#0554F2] transition-all shadow-lg shadow-[#1675F2]/30"
            >
              Przeglądaj produkty
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-[#E8F4FE] to-[#D4EBFC] py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-[60px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            {t('cart.title')} ({itemCount})
          </h1>
          <div className="text-[13px] text-neutral-600">
            <Link href={`/${locale}`} className="hover:text-neutral-900 transition-colors">
              {t('common.home')}
            </Link>
            {' / '}
            <span>Koszyk</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border-2 border-[#D4EBFC] divide-y divide-[#E8F4FE] shadow-lg">
              {cart.items.map((item) => (
                <div key={item.id} className="p-4 md:p-6">
                  <div className="flex gap-4 md:gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] md:text-[16px] font-semibold text-neutral-900 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-[13px] text-neutral-600 mb-2 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                      {item.variant && (
                        <p className="text-[12px] text-neutral-500">
                          SKU: {item.variant.sku || 'N/A'}
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center border border-neutral-300 rounded-lg">
                          <button
                            onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                            disabled={loading}
                            className="px-3 py-2 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="px-4 py-2 font-semibold text-[14px] min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            disabled={loading}
                            className="px-3 py-2 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[13px] font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                          {t('cart.remove')}
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-[16px] md:text-lg font-bold text-neutral-900">
                        {formatPrice(item.total, cart.region?.currency_code)}
                      </div>
                      <div className="text-[12px] text-neutral-500 mt-1">
                        {formatPrice(item.unit_price, cart.region?.currency_code)} / szt.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 border border-neutral-300 rounded-lg text-[13px] font-semibold hover:bg-neutral-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('cart.continueShopping')}
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border-2 border-[#D4EBFC] sticky top-24 shadow-lg">
              <h2 className="text-[16px] font-bold text-neutral-900 mb-6">
                {t('checkout.orderSummary')}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[13px]">
                  <span className="text-neutral-600">{t('cart.subtotal')}:</span>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(cart.subtotal, cart.region?.currency_code)}
                  </span>
                </div>

                {cart.discount_total > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-neutral-600">Rabat:</span>
                    <span className="font-semibold text-danger">
                      -{formatPrice(cart.discount_total, cart.region?.currency_code)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[13px]">
                  <span className="text-neutral-600">{t('cart.shipping')}:</span>
                  <span className="font-semibold text-neutral-900">
                    {cart.shipping_total > 0
                      ? formatPrice(cart.shipping_total, cart.region?.currency_code)
                      : 'Obliczane przy kasie'}
                  </span>
                </div>

                <div className="flex justify-between text-[13px]">
                  <span className="text-neutral-600">{t('cart.tax')}:</span>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(cart.tax_total, cart.region?.currency_code)}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-neutral-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[16px] font-bold text-neutral-900">{t('cart.total')}:</span>
                  <span className="text-xl md:text-2xl font-bold text-neutral-900">
                    {formatPrice(cart.total, cart.region?.currency_code)}
                  </span>
                </div>
              </div>

              <Link
                href={`/${locale}/checkout`}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary-500 text-secondary-700 rounded-2xl text-[14px] font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/30"
              >
                {t('cart.checkout')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 p-4 bg-neutral-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-neutral-700">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Bezpieczne płatności
                </div>
                <div className="flex items-center gap-2 text-[12px] text-neutral-700">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Darmowa dostawa od 200 PLN
                </div>
                <div className="flex items-center gap-2 text-[12px] text-neutral-700">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  30 dni na zwrot
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
