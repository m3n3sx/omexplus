'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import PaymentMethods from '@/components/checkout/PaymentMethods'
import ShippingMethods from '@/components/checkout/ShippingMethods'

export default function CheckoutPage() {
  const locale = useLocale()
  const router = useRouter()
  const { cart } = useCart()

  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Customer type: 'company' or 'individual'
  const [customerType, setCustomerType] = useState<'company' | 'individual'>('company')

  // Company/Invoice data (for company customers)
  const [companyData, setCompanyData] = useState({
    nip: '',
    companyName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'PL'
  })

  // Contact person data
  const [contactData, setContactData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  // Shipping address (can be different from company/billing address)
  const [shippingAddress, setShippingAddress] = useState({
    sameAsBilling: true,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'PL'
  })

  // Shipping & Payment
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null)
  const [shippingPrice, setShippingPrice] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [blikCode, setBlikCode] = useState('')

  // Notes
  const [orderNotes, setOrderNotes] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  // GUS lookup state
  const [gusLoading, setGusLoading] = useState(false)
  const [gusError, setGusError] = useState<string | null>(null)
  const [gusSuccess, setGusSuccess] = useState(false)

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Function to fetch company data from GUS
  const fetchCompanyFromGUS = async (nip: string) => {
    if (!nip || nip.replace(/[-\s]/g, '').length !== 10) {
      setGusError('Wprowadź poprawny NIP (10 cyfr)')
      return
    }

    setGusLoading(true)
    setGusError(null)
    setGusSuccess(false)

    try {
      const response = await fetch(`/api/gus?nip=${encodeURIComponent(nip)}`)
      const data = await response.json()

      if (!response.ok) {
        setGusError(data.error || 'Nie znaleziono firmy')
        return
      }

      if (data.success && data.data) {
        setCompanyData(prev => ({
          ...prev,
          companyName: data.data.companyName || prev.companyName,
          nip: data.data.nip || prev.nip,
          address: data.data.address || prev.address,
          city: data.data.city || prev.city,
          postalCode: data.data.postalCode || prev.postalCode,
        }))
        setGusSuccess(true)
        setGusError(null)
      }
    } catch (error) {
      console.error('GUS fetch error:', error)
      setGusError('Błąd połączenia z GUS')
    } finally {
      setGusLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Dane', icon: '👤' },
    { number: 2, title: 'Dostawa', icon: '🚚' },
    { number: 3, title: 'Płatność', icon: '💳' },
    { number: 4, title: 'Podsumowanie', icon: '✅' }
  ]

  // Calculate totals
  const subtotal = cart?.subtotal ? cart.subtotal / 100 : 0
  const tax = cart?.tax ? cart.tax / 100 : 0
  const total = subtotal + tax + shippingPrice

  // Validation helpers
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+48\s?)?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validatePostalCode = (code: string): boolean => {
    const postalRegex = /^\d{2}-\d{3}$/
    return postalRegex.test(code)
  }

  const validateNip = (nip: string): boolean => {
    const cleanNip = nip.replace(/[-\s]/g, '')
    return /^\d{10}$/.test(cleanNip)
  }

  // Validation for step 1
  const isStep1Valid = () => {
    // Contact data validation
    if (!contactData.firstName.trim()) return false
    if (!contactData.lastName.trim()) return false
    if (!contactData.email || !validateEmail(contactData.email)) return false
    if (!contactData.phone || !validatePhone(contactData.phone)) return false

    if (customerType === 'company') {
      // Company data validation
      if (!companyData.nip || !validateNip(companyData.nip)) return false
      if (!companyData.companyName.trim()) return false
      if (!companyData.address.trim()) return false
      if (!companyData.city.trim()) return false
      if (!companyData.postalCode || !validatePostalCode(companyData.postalCode)) return false
    } else {
      // Individual - need address
      if (shippingAddress.sameAsBilling) {
        // For individual with same address, we need shipping address filled
        if (!shippingAddress.address.trim()) return false
        if (!shippingAddress.city.trim()) return false
        if (!shippingAddress.postalCode || !validatePostalCode(shippingAddress.postalCode)) return false
      }
    }

    // If shipping address is different
    if (!shippingAddress.sameAsBilling) {
      if (!shippingAddress.address.trim()) return false
      if (!shippingAddress.city.trim()) return false
      if (!shippingAddress.postalCode || !validatePostalCode(shippingAddress.postalCode)) return false
    }

    return true
  }

  const isStep2Valid = () => selectedShipping !== null
  const isStep3Valid = () => selectedPayment !== null
  const isStep4Valid = () => acceptTerms

  const canProceed = () => {
    switch (currentStep) {
      case 1: return isStep1Valid()
      case 2: return isStep2Valid()
      case 3: return isStep3Valid()
      case 4: return isStep4Valid()
      default: return false
    }
  }

  const handleNext = () => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleShippingSelect = (methodId: string, price: number) => {
    setSelectedShipping(methodId)
    setShippingPrice(price)
  }

  // Get billing address based on customer type
  const getBillingAddress = () => {
    if (customerType === 'company') {
      return {
        company: companyData.companyName,
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        address_1: companyData.address,
        city: companyData.city,
        postal_code: companyData.postalCode,
        country_code: companyData.country.toLowerCase(),
        phone: contactData.phone,
      }
    } else {
      return {
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        address_1: shippingAddress.address,
        city: shippingAddress.city,
        postal_code: shippingAddress.postalCode,
        country_code: shippingAddress.country.toLowerCase(),
        phone: contactData.phone,
      }
    }
  }

  // Get shipping address
  const getShippingAddress = () => {
    if (shippingAddress.sameAsBilling) {
      if (customerType === 'company') {
        return {
          first_name: contactData.firstName,
          last_name: contactData.lastName,
          address_1: companyData.address,
          city: companyData.city,
          postal_code: companyData.postalCode,
          country_code: companyData.country.toLowerCase(),
          phone: contactData.phone,
        }
      } else {
        return {
          first_name: contactData.firstName,
          last_name: contactData.lastName,
          address_1: shippingAddress.address,
          city: shippingAddress.city,
          postal_code: shippingAddress.postalCode,
          country_code: shippingAddress.country.toLowerCase(),
          phone: contactData.phone,
        }
      }
    } else {
      return {
        first_name: shippingAddress.firstName || contactData.firstName,
        last_name: shippingAddress.lastName || contactData.lastName,
        address_1: shippingAddress.address,
        city: shippingAddress.city,
        postal_code: shippingAddress.postalCode,
        country_code: shippingAddress.country.toLowerCase(),
        phone: contactData.phone,
      }
    }
  }

  const handlePlaceOrder = async () => {
    if (!cart || !acceptTerms) return

    setIsProcessing(true)
    setError(null)

    try {
      const backendUrl = 'http://localhost:9000'
      const apiKey = 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0'

      // 1. Update cart with addresses
      const updateResponse = await fetch(`${backendUrl}/store/carts/${cart.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': apiKey
        },
        body: JSON.stringify({
          email: contactData.email,
          shipping_address: getShippingAddress(),
          billing_address: getBillingAddress(),
          metadata: {
            order_notes: orderNotes,
            customer_type: customerType,
            tax_id: customerType === 'company' ? companyData.nip : '',
            company_name: customerType === 'company' ? companyData.companyName : '',
            shipping_method: selectedShipping,
            payment_method: selectedPayment,
          }
        })
      })

      if (!updateResponse.ok) {
        const err = await updateResponse.json()
        throw new Error(err.message || 'Nie udało się zaktualizować koszyka')
      }

      // 2. Create payment via local API
      const paymentResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_id: cart.id,
          amount: total,
          currency: 'PLN',
          method: selectedPayment,
          customer_email: contactData.email,
          customer_name: `${contactData.firstName} ${contactData.lastName}`,
          customer_phone: contactData.phone,
          return_url: `${window.location.origin}/${locale}/order-success`,
          blik_code: selectedPayment === 'tpay_blik' ? blikCode : undefined,
        })
      })

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Błąd płatności')
      }

      // 3. Handle payment response
      if (paymentData.redirect_url) {
        window.location.href = paymentData.redirect_url
      } else if (paymentData.success) {
        await completeOrder()
      } else {
        throw new Error('Nieznana odpowiedź płatności')
      }

    } catch (err: any) {
      console.error('Order error:', err)
      setError(err.message || 'Wystąpił błąd podczas składania zamówienia')
      setIsProcessing(false)
    }
  }

  const completeOrder = async () => {
    if (!cart) return

    const backendUrl = 'http://localhost:9000'
    const apiKey = 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0'

    const completeResponse = await fetch(`${backendUrl}/store/carts/${cart.id}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': apiKey
      }
    })

    if (!completeResponse.ok) {
      const err = await completeResponse.json()
      throw new Error(err.message || 'Nie udało się złożyć zamówienia')
    }

    const orderData = await completeResponse.json()
    localStorage.removeItem('cart_id')
    
    const orderId = orderData.order?.id || orderData.data?.id || 'success'
    router.push(`/${locale}/order-success?order=${orderId}`)
  }

  // Empty cart view
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">Twój koszyk jest pusty</h1>
          <p className="text-neutral-600 mb-6">Dodaj produkty do koszyka, aby kontynuować zakupy</p>
          <Link href={`/${locale}/products`} className="inline-flex items-center gap-2 px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors">
            Przeglądaj produkty
          </Link>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${locale}/cart`} className="text-sm text-primary-600 hover:underline mb-2 inline-block">
            ← Wróć do koszyka
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Finalizacja zamówienia</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200 -z-10">
              <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
            </div>
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => step.number < currentStep && setCurrentStep(step.number)}
                disabled={step.number > currentStep}
                className="flex flex-col items-center"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                  currentStep >= step.number ? 'bg-primary-500 text-white shadow-lg' : 'bg-white border-2 border-neutral-200 text-neutral-400'
                }`}>
                  {currentStep > step.number ? '✓' : step.icon}
                </div>
                <span className={`mt-2 text-xs font-medium ${currentStep >= step.number ? 'text-primary-600' : 'text-neutral-400'}`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Customer Data */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Customer Type Toggle */}
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                  <h2 className="text-lg font-bold text-neutral-900 mb-4">Typ klienta</h2>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCustomerType('company')}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        customerType === 'company'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">🏢</div>
                      <div className="font-semibold text-neutral-900">Firma</div>
                      <div className="text-sm text-neutral-500">Zakup na fakturę VAT</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerType('individual')}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        customerType === 'individual'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">👤</div>
                      <div className="font-semibold text-neutral-900">Osoba prywatna</div>
                      <div className="text-sm text-neutral-500">Zakup na paragon</div>
                    </button>
                  </div>
                </div>

                {/* Company Data (only for company) */}
                {customerType === 'company' && (
                  <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                    <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                      <span>🏢</span> Dane firmy (do faktury)
                    </h2>
                    
                    {/* NIP with GUS lookup */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1.5 text-neutral-700">NIP *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={companyData.nip}
                          onChange={(e) => {
                            setCompanyData({ ...companyData, nip: e.target.value })
                            setGusSuccess(false)
                          }}
                          className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            gusSuccess ? 'border-green-500 bg-green-50' : 'border-neutral-300'
                          }`}
                          placeholder="1234567890"
                          maxLength={13}
                        />
                        <button
                          type="button"
                          onClick={() => fetchCompanyFromGUS(companyData.nip)}
                          disabled={gusLoading || !companyData.nip}
                          className="px-4 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          {gusLoading ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Szukam...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              Pobierz z GUS
                            </>
                          )}
                        </button>
                      </div>
                      {gusError && <p className="text-red-500 text-xs mt-1">{gusError}</p>}
                      {gusSuccess && <p className="text-green-600 text-xs mt-1">✓ Dane pobrane z GUS</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1.5 text-neutral-700">Nazwa firmy *</label>
                        <input
                          type="text"
                          value={companyData.companyName}
                          onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Firma Sp. z o.o."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1.5 text-neutral-700">Adres *</label>
                        <input
                          type="text"
                          value={companyData.address}
                          onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="ul. Przykładowa 1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-neutral-700">Miejscowość *</label>
                        <input
                          type="text"
                          value={companyData.city}
                          onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Warszawa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-neutral-700">Kod pocztowy *</label>
                        <input
                          type="text"
                          value={companyData.postalCode}
                          onChange={(e) => setCompanyData({ ...companyData, postalCode: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="00-001"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Person */}
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                  <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <span>👤</span> {customerType === 'company' ? 'Osoba kontaktowa' : 'Dane osobowe'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-neutral-700">Imię *</label>
                      <input
                        type="text"
                        value={contactData.firstName}
                        onChange={(e) => setContactData({ ...contactData, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Jan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-neutral-700">Nazwisko *</label>
                      <input
                        type="text"
                        value={contactData.lastName}
                        onChange={(e) => setContactData({ ...contactData, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Kowalski"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-neutral-700">Email *</label>
                      <input
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="jan@firma.pl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-neutral-700">Telefon *</label>
                      <input
                        type="tel"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="+48 500 000 000"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                  <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <span>📍</span> Adres dostawy
                  </h2>
                  
                  {customerType === 'company' && (
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input
                        type="checkbox"
                        checked={shippingAddress.sameAsBilling}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, sameAsBilling: e.target.checked })}
                        className="w-5 h-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-700">Taki sam jak adres firmy</span>
                    </label>
                  )}

                  {(customerType === 'individual' || !shippingAddress.sameAsBilling) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {!shippingAddress.sameAsBilling && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-1.5 text-neutral-700">Imię odbiorcy</label>
                            <input
                              type="text"
                              value={shippingAddress.firstName}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder={contactData.firstName || 'Jan'}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1.5 text-neutral-700">Nazwisko odbiorcy</label>
                            <input
                              type="text"
                              value={shippingAddress.lastName}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder={contactData.lastName || 'Kowalski'}
                            />
                          </div>
                        </>
                      )}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1.5 text-neutral-700">Adres *</label>
                        <input
                          type="text"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="ul. Przykładowa 1/2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-neutral-700">Miejscowość *</label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Warszawa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-neutral-700">Kod pocztowy *</label>
                        <input
                          type="text"
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="00-001"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* Step 2: Shipping */}
            {currentStep === 2 && (
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm">2</span>
                  Metoda dostawy
                </h2>
                <ShippingMethods
                  selectedMethod={selectedShipping}
                  onMethodSelect={handleShippingSelect}
                  destination={{
                    country: shippingAddress.sameAsBilling && customerType === 'company' ? companyData.country : shippingAddress.country,
                    postal_code: shippingAddress.sameAsBilling && customerType === 'company' ? companyData.postalCode : shippingAddress.postalCode,
                  }}
                  cartTotal={subtotal}
                />
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm">3</span>
                  Metoda płatności
                </h2>
                <PaymentMethods
                  selectedMethod={selectedPayment}
                  onMethodSelect={setSelectedPayment}
                  onBlikCodeChange={setBlikCode}
                  totalAmount={total}
                />
              </div>
            )}

            {/* Step 4: Summary */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Order items */}
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                  <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm">4</span>
                    Podsumowanie zamówienia
                  </h2>
                  <div className="space-y-3">
                    {cart.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
                        <div className="w-16 h-16 bg-white rounded-lg border border-neutral-200 flex items-center justify-center">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt="" className="w-12 h-12 object-contain" />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">{item.title || item.variant?.title || 'Produkt'}</div>
                          <div className="text-sm text-neutral-500">Ilość: {item.quantity}</div>
                        </div>
                        <div className="font-bold text-neutral-900">
                          {((item.total || item.unit_price * item.quantity) / 100).toFixed(2)} zł
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Addresses summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-neutral-200">
                    <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                      <span>🧾</span> Dane do faktury
                    </h3>
                    <div className="text-sm text-neutral-600 space-y-1">
                      {customerType === 'company' ? (
                        <>
                          <p className="font-medium">{companyData.companyName}</p>
                          <p>NIP: {companyData.nip}</p>
                          <p>{companyData.address}</p>
                          <p>{companyData.postalCode} {companyData.city}</p>
                        </>
                      ) : (
                        <>
                          <p>{contactData.firstName} {contactData.lastName}</p>
                          <p>{shippingAddress.address}</p>
                          <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-neutral-200">
                    <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                      <span>📍</span> Adres dostawy
                    </h3>
                    <div className="text-sm text-neutral-600 space-y-1">
                      <p>{shippingAddress.firstName || contactData.firstName} {shippingAddress.lastName || contactData.lastName}</p>
                      <p>{shippingAddress.sameAsBilling && customerType === 'company' ? companyData.address : shippingAddress.address}</p>
                      <p>{shippingAddress.sameAsBilling && customerType === 'company' ? `${companyData.postalCode} ${companyData.city}` : `${shippingAddress.postalCode} ${shippingAddress.city}`}</p>
                      <p>{contactData.phone}</p>
                      <p>{contactData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping & Payment summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-neutral-200">
                    <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                      <span>🚚</span> Dostawa
                    </h3>
                    <div className="text-sm text-neutral-600">
                      <p className="font-medium">{selectedShipping?.replace(/_/g, ' ')}</p>
                      <p>{shippingPrice === 0 ? 'Darmowa dostawa' : `${shippingPrice.toFixed(2)} zł`}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-neutral-200">
                    <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                      <span>💳</span> Płatność
                    </h3>
                    <div className="text-sm text-neutral-600">
                      <p className="font-medium">{selectedPayment?.replace(/tpay_|stripe_/g, '').replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                </div>

                {/* Order notes */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200">
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    Uwagi do zamówienia (opcjonalnie)
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Np. preferowana godzina dostawy, dodatkowe informacje..."
                  />
                </div>

                {/* Terms acceptance */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">
                      Akceptuję{' '}
                      <Link href={`/${locale}/regulamin`} className="text-primary-600 hover:underline">regulamin sklepu</Link>{' '}
                      oraz{' '}
                      <Link href={`/${locale}/polityka-prywatnosci`} className="text-primary-600 hover:underline">politykę prywatności</Link>.
                      Rozumiem, że moje dane będą przetwarzane w celu realizacji zamówienia. *
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-4 bg-white text-neutral-700 border border-neutral-300 rounded-xl font-semibold hover:bg-neutral-50 transition-colors disabled:opacity-50"
                >
                  ← Wstecz
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1 px-6 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Dalej →
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={!canProceed() || isProcessing}
                  className="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  style={{ color: 'white', backgroundColor: '#16a34a' }}
                >
                  {isProcessing ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Przetwarzanie...
                    </>
                  ) : (
                    <>
                      {selectedPayment === 'cash_on_delivery' 
                        ? `Zamawiam z płatnością przy odbiorze ${total.toFixed(2)} zł`
                        : `Zamawiam i płacę ${total.toFixed(2)} zł`
                      }
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Twoje zamówienie</h3>

              <div className="text-sm text-neutral-600 mb-4">
                {cart.items.length} {cart.items.length === 1 ? 'produkt' : cart.items.length < 5 ? 'produkty' : 'produktów'}
              </div>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cart.items.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center flex-shrink-0">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt="" className="w-8 h-8 object-contain" />
                      ) : (
                        <span>📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-neutral-700">{item.title || 'Produkt'}</div>
                      <div className="text-neutral-500">x{item.quantity}</div>
                    </div>
                  </div>
                ))}
                {cart.items.length > 3 && (
                  <div className="text-sm text-neutral-500 text-center py-1">+{cart.items.length - 3} więcej...</div>
                )}
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Produkty:</span>
                  <span className="font-medium">{subtotal.toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Dostawa:</span>
                  <span className="font-medium">
                    {selectedShipping ? (shippingPrice === 0 ? <span className="text-green-600">GRATIS</span> : `${shippingPrice.toFixed(2)} zł`) : '—'}
                  </span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">VAT:</span>
                    <span className="font-medium">{tax.toFixed(2)} zł</span>
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-neutral-900">Razem:</span>
                  <span className="text-2xl font-bold text-primary-600">{total.toFixed(2)} zł</span>
                </div>
                <div className="text-xs text-neutral-500 text-right mt-1">w tym VAT</div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-4 border-t border-neutral-200">
                <div className="grid grid-cols-2 gap-3 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🔒</span>
                    <span>Bezpieczne płatności</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🚚</span>
                    <span>Szybka dostawa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">↩️</span>
                    <span>14 dni na zwrot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">📞</span>
                    <span>Wsparcie 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
