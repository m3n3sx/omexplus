'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

type ShippingMethod = {
  id: string
  name: string
  price: number
  estimatedDays: string
}

const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'inpost', name: 'InPost Paczkomaty', price: 1299, estimatedDays: '1-2' },
  { id: 'dpd', name: 'DPD Kurier', price: 1999, estimatedDays: '1-2' },
  { id: 'dhl', name: 'DHL Express', price: 2999, estimatedDays: '1' },
]

export default function CheckoutPage() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const { cart } = useCart()

  const [currentStep, setCurrentStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Poland'
  })
  const [selectedShipping, setSelectedShipping] = useState<string>('')
  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
    companyName: '',
    taxId: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Poland'
  })
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('')

  const steps = [
    { number: 1, title: 'Adres dostawy' },
    { number: 2, title: 'Dostawa' },
    { number: 3, title: 'Płatność' },
    { number: 4, title: 'Podsumowanie' }
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePlaceOrder = async () => {
    try {
      if (!cart) {
        alert('Brak koszyka')
        return
      }

      // 1. Update cart with shipping address
      const response1 = await fetch(`http://localhost:9000/store/carts/${cart.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0'
        },
        body: JSON.stringify({
          shipping_address: {
            first_name: shippingAddress.firstName,
            last_name: shippingAddress.lastName,
            address_1: shippingAddress.address,
            city: shippingAddress.city,
            postal_code: shippingAddress.postalCode,
            country_code: 'pl',
            phone: shippingAddress.phone
          },
          email: shippingAddress.email
        })
      })

      if (!response1.ok) {
        const errorData = await response1.json().catch(() => ({}))
        console.error('Shipping address error:', errorData)
        throw new Error(`Failed to update shipping address: ${errorData.message || response1.statusText}`)
      }

      // 2. Add shipping method (if selected)
      if (selectedShipping) {
        // Get shipping options first
        const shippingOptionsResponse = await fetch(`http://localhost:9000/store/shipping-options/${cart.id}`, {
          headers: {
            'x-publishable-api-key': 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0'
          }
        })
        
        if (shippingOptionsResponse.ok) {
          const shippingOptions = await shippingOptionsResponse.json()
          const firstOption = shippingOptions.shipping_options?.[0]
          
          if (firstOption) {
            await fetch(`http://localhost:9000/store/carts/${cart.id}/shipping-methods`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-publishable-api-key': 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0'
              },
              body: JSON.stringify({
                option_id: firstOption.id
              })
            })
          }
        }
      }

      // 3. Initialize payment session
      const paymentResponse = await fetch(`http://localhost:9000/store/carts/${cart.id}/payment-collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0'
        }
      })

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json().catch(() => ({}))
        console.error('Payment initialization error:', errorData)
        // Continue anyway - payment might not be required for testing
      }

      // 4. Complete the cart (create order)
      const completeResponse = await fetch(`http://localhost:9000/store/carts/${cart.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0'
        }
      })

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json()
        console.error('Complete cart error:', errorData)
        throw new Error(errorData.message || 'Failed to complete order')
      }

      const orderData = await completeResponse.json()
      console.log('Order created:', orderData)

      // Clear cart from localStorage
      localStorage.removeItem('cart_id')

      // Redirect to success page
      router.push(`/${locale}/order-success?order=${orderData.order?.id || 'success'}`)
    } catch (error: any) {
      console.error('Order placement error:', error)
      alert(`Błąd podczas składania zamówienia: ${error.message}`)
    }
  }

  const selectedShippingMethod = SHIPPING_METHODS.find(m => m.id === selectedShipping)
  const shippingCost = selectedShippingMethod?.price || 0
  const subtotal = cart?.subtotal || 0
  const tax = cart?.tax || 0
  const total = subtotal + tax + shippingCost

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-20">
        <div className="container mx-auto px-4 md:px-[60px]">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-7xl mb-6">🛒</div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
              {t('cart.empty')}
            </h1>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-lg text-[14px] font-semibold hover:bg-neutral-800 transition-colors"
            >
              {t('common.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-[60px]">
        {/* Breadcrumb */}
        <div className="mb-6 text-[13px] text-neutral-600">
          <Link href={`/${locale}`} className="hover:text-neutral-900 transition-colors">
            {t('common.home')}
          </Link>
          {' / '}
          <span>Kasa</span>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative max-w-3xl mx-auto">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200 -z-10">
              <div 
                className="h-full bg-neutral-900 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold transition-all ${
                  currentStep >= step.number
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border-2 border-neutral-200 text-neutral-400'
                }`}>
                  {currentStep > step.number ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : step.number}
                </div>
                <div className={`mt-2 text-[12px] font-medium text-center ${
                  currentStep >= step.number ? 'text-neutral-900' : 'text-neutral-500'
                }`}>
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="bg-white p-6 md:p-8 rounded-xl border border-neutral-200">
                <h2 className="text-[18px] font-bold text-neutral-900 mb-6">
                  Adres dostawy
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Imię *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Nazwisko *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Adres *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Miasto *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Kod pocztowy *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {currentStep === 2 && (
              <div className="bg-white p-6 md:p-8 rounded-xl border border-neutral-200">
                <h2 className="text-[18px] font-bold text-neutral-900 mb-6">
                  Metoda dostawy
                </h2>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-5 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedShipping === method.id
                          ? 'border-neutral-900 bg-neutral-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={selectedShipping === method.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="w-4 h-4 text-neutral-900 focus:ring-neutral-900"
                      />
                      <div className="ml-4 flex-1">
                        <div className="font-semibold text-[14px] text-neutral-900 mb-1">{method.name}</div>
                        <div className="text-[13px] text-neutral-600">
                          Dostawa w {method.estimatedDays} dni robocze
                        </div>
                      </div>
                      <div className="text-[16px] font-bold text-neutral-900">
                        {(method.price / 100).toFixed(2)} PLN
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="bg-white p-6 md:p-8 rounded-xl border border-neutral-200">
                <h2 className="text-[18px] font-bold text-neutral-900 mb-6">
                  Metoda płatności
                </h2>
                <div className="p-8 bg-neutral-50 rounded-lg text-center border border-neutral-200">
                  <div className="text-5xl mb-4">💳</div>
                  <p className="text-[14px] text-neutral-600 mb-4">
                    Płatność Stripe zostanie zintegrowana w następnym kroku
                  </p>
                  <div className="text-[13px] text-neutral-500">
                    Akceptujemy: Visa, Mastercard, BLIK, Przelewy24
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="bg-white p-6 md:p-8 rounded-xl border border-neutral-200">
                <h2 className="text-[18px] font-bold text-neutral-900 mb-6">
                  Podsumowanie zamówienia
                </h2>
                
                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-[14px] font-semibold text-neutral-900 mb-3">
                    Produkty ({cart.items.length})
                  </h3>
                  <div className="space-y-2">
                    {cart.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between p-4 bg-neutral-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-[14px] text-neutral-900">Product #{item.product_id}</div>
                          <div className="text-[13px] text-neutral-600">
                            Ilość: {item.quantity}
                          </div>
                        </div>
                        <div className="font-semibold text-[14px] text-neutral-900">
                          {(item.total / 100).toFixed(2)} PLN
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-[14px] font-semibold text-neutral-900 mb-2">
                      Adres dostawy
                    </h3>
                    <div className="text-[13px] text-neutral-600 leading-relaxed">
                      {shippingAddress.firstName} {shippingAddress.lastName}<br />
                      {shippingAddress.address}<br />
                      {shippingAddress.postalCode} {shippingAddress.city}<br />
                      {shippingAddress.email}<br />
                      {shippingAddress.phone}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-neutral-900 mb-2">
                      Metoda dostawy
                    </h3>
                    <div className="text-[13px] text-neutral-600">
                      {selectedShippingMethod?.name}<br />
                      Dostawa w {selectedShippingMethod?.estimatedDays} dni
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 bg-white text-neutral-900 border border-neutral-300 rounded-lg text-[14px] font-semibold hover:bg-neutral-50 transition-colors"
                >
                  ← Wstecz
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-neutral-900 text-white rounded-lg text-[14px] font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Dalej →
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg text-[14px] font-semibold hover:bg-green-700 transition-colors"
                >
                  Złóż zamówienie 🎉
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-neutral-200 sticky top-24">
              <h3 className="text-[16px] font-bold text-neutral-900 mb-5">
                Podsumowanie
              </h3>
              <div className="space-y-3 mb-5 pb-5 border-b border-neutral-200">
                <div className="flex justify-between text-[13px]">
                  <span className="text-neutral-600">Produkty:</span>
                  <span className="font-semibold text-neutral-900">{(subtotal / 100).toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-neutral-600">Dostawa:</span>
                  <span className="font-semibold text-neutral-900">
                    {selectedShipping ? `${(shippingCost / 100).toFixed(2)} PLN` : 'Wybierz metodę'}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-neutral-600">Podatek:</span>
                  <span className="font-semibold text-neutral-900">{(tax / 100).toFixed(2)} PLN</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-bold text-neutral-900">Razem:</span>
                <span className="text-2xl font-bold text-neutral-900">{(total / 100).toFixed(2)} PLN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
