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
    { number: 1, title: t('checkout.shippingAddress') },
    { number: 2, title: t('checkout.shippingMethod') },
    { number: 3, title: t('checkout.billingAddress') },
    { number: 4, title: t('checkout.paymentMethod') },
    { number: 5, title: t('checkout.reviewOrder') }
  ]

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePlaceOrder = async () => {
    // TODO: Implement order placement
    alert('Order placed!')
    router.push(`/${locale}/order-success`)
  }

  const selectedShippingMethod = SHIPPING_METHODS.find(m => m.id === selectedShipping)
  const shippingCost = selectedShippingMethod?.price || 0
  const subtotal = cart?.subtotal || 0
  const tax = cart?.tax || 0
  const total = subtotal + tax + shippingCost

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
<div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {t('cart.empty')}
          </h1>
          <Link href={`/${locale}/products`}>
            <button style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              {t('common.continueShopping')}
            </button>
          </Link>
        </div>
</div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <Link href={`/${locale}`} style={{ color: '#3b82f6' }}>
            {t('common.home')}
          </Link>
          {' / '}
          <span>{t('checkout.title')}</span>
        </div>

        {/* Progress Steps */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {/* Progress Line */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '0',
              right: '0',
              height: '2px',
              backgroundColor: '#e5e7eb',
              zIndex: 0
            }}>
              <div style={{
                height: '100%',
                backgroundColor: '#3b82f6',
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                transition: 'width 0.3s'
              }} />
            </div>

            {steps.map((step) => (
              <div key={step.number} style={{ position: 'relative', zIndex: 1, textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= step.number ? '#3b82f6' : '#e5e7eb',
                  color: currentStep >= step.number ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  margin: '0 auto',
                  transition: 'all 0.3s'
                }}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                  color: currentStep >= step.number ? '#1f2937' : '#6b7280',
                  fontWeight: currentStep === step.number ? '600' : '400'
                }}>
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Content */}
          <div>
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  {t('checkout.shippingAddress')}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('checkout.firstName')}
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('checkout.lastName')}
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('checkout.email')}
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('checkout.phone')}
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                      required
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('checkout.address')}
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('checkout.city')}
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('checkout.postalCode')}
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {currentStep === 2 && (
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  {t('checkout.shippingMethod')}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {SHIPPING_METHODS.map((method) => (
                    <label
                      key={method.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1.5rem',
                        border: selectedShipping === method.id ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={selectedShipping === method.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        style={{ marginRight: '1rem' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{method.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Dostawa w {method.estimatedDays} dni robocze
                        </div>
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {(method.price / 100).toFixed(2)} PLN
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Billing Address */}
            {currentStep === 3 && (
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  {t('checkout.billingAddress')}
                </h2>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={billingAddress.sameAsShipping}
                    onChange={(e) => setBillingAddress({ ...billingAddress, sameAsShipping: e.target.checked })}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>{t('checkout.sameAsShipping')}</span>
                </label>

                {!billingAddress.sameAsShipping && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {t('checkout.companyName')}
                      </label>
                      <input
                        type="text"
                        value={billingAddress.companyName}
                        onChange={(e) => setBillingAddress({ ...billingAddress, companyName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {t('checkout.taxId')} (NIP)
                      </label>
                      <input
                        type="text"
                        value={billingAddress.taxId}
                        onChange={(e) => setBillingAddress({ ...billingAddress, taxId: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {t('checkout.purchaseOrderNumber')} (opcjonalnie)
                  </label>
                  <input
                    type="text"
                    value={purchaseOrderNumber}
                    onChange={(e) => setPurchaseOrderNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="PO-2024-001"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  {t('checkout.paymentMethod')}
                </h2>
                <div style={{
                  padding: '2rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                    Płatność Stripe zostanie zintegrowana w następnym kroku
                  </p>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Akceptujemy: Visa, Mastercard, BLIK, Przelewy24
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  {t('checkout.reviewOrder')}
                </h2>
                
                {/* Order Items */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Produkty ({cart.items.length})
                  </h3>
                  {cart.items.map((item: any) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>Product #{item.product_id}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {t('common.quantity')}: {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontWeight: '600' }}>
                        {(item.total / 100).toFixed(2)} PLN
                      </div>
                    </div>
                  ))}
                </div>

                {/* Addresses */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('checkout.shippingAddress')}
                    </h3>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                      {shippingAddress.firstName} {shippingAddress.lastName}<br />
                      {shippingAddress.address}<br />
                      {shippingAddress.postalCode} {shippingAddress.city}<br />
                      {shippingAddress.email}<br />
                      {shippingAddress.phone}
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('checkout.shippingMethod')}
                    </h3>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {selectedShippingMethod?.name}<br />
                      Dostawa w {selectedShippingMethod?.estimatedDays} dni
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: 'white',
                    color: '#3b82f6',
                    border: '2px solid #3b82f6',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ← Wstecz
                </button>
              )}
              {currentStep < 5 ? (
                <button
                  onClick={handleNext}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Dalej →
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {t('checkout.placeOrder')} 🎉
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              position: 'sticky',
              top: '100px'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                {t('checkout.orderSummary')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>{t('cart.subtotal')}:</span>
                  <span style={{ fontWeight: '600' }}>{(subtotal / 100).toFixed(2)} PLN</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>{t('cart.shipping')}:</span>
                  <span style={{ fontWeight: '600' }}>
                    {selectedShipping ? `${(shippingCost / 100).toFixed(2)} PLN` : 'Wybierz metodę'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>{t('cart.tax')}:</span>
                  <span style={{ fontWeight: '600' }}>{(tax / 100).toFixed(2)} PLN</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <span>{t('cart.total')}:</span>
                <span style={{ color: '#3b82f6' }}>{(total / 100).toFixed(2)} PLN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
</div>
  )
}
