'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EnquiryModal } from './EnquiryModal'

// Availability types
export type AvailabilityStatus = 
  | 'in-stock'           // Na magazynie - można dodać do koszyka
  | 'low-stock'          // Niski stan - można dodać do koszyka
  | 'pre-order'          // Przedsprzedaż - można dodać do koszyka
  | 'on-order'           // Na zamówienie - tylko zapytanie
  | 'enquiry-only'       // Tylko zapytanie (np. duże części)
  | 'out-of-stock'       // Brak w magazynie - tylko zapytanie
  | 'discontinued'       // Wycofany - tylko zapytanie o zamiennik

interface Product {
  id: string
  title: string
  handle?: string
  sku?: string
  thumbnail?: string
  inventory_quantity?: number
  availability?: AvailabilityStatus
  metadata?: {
    availability?: AvailabilityStatus
    lead_time?: string // np. "2-5 dni", "2-4 tygodnie"
    min_order_quantity?: number
  }
  variants?: Array<{
    id: string
    sku?: string
    prices?: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

interface ProductCardProps {
  product: Product
  locale?: string
  onAddToCart?: (product: Product) => void
  className?: string
}

// Helper to determine availability status
function getAvailabilityStatus(product: Product): AvailabilityStatus {
  // Check metadata first
  if (product.metadata?.availability) {
    return product.metadata.availability
  }
  if (product.availability) {
    return product.availability
  }
  
  // Fallback to inventory quantity
  const qty = product.inventory_quantity ?? 0
  if (qty > 10) return 'in-stock'
  if (qty > 0) return 'low-stock'
  return 'on-order'
}

// Get availability display info
function getAvailabilityInfo(status: AvailabilityStatus, leadTime?: string) {
  switch (status) {
    case 'in-stock':
      return {
        label: 'Na magazynie',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: '✓',
        canAddToCart: true,
      }
    case 'low-stock':
      return {
        label: 'Ostatnie sztuki',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: '⚡',
        canAddToCart: true,
      }
    case 'pre-order':
      return {
        label: 'Przedsprzedaż',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: '🔜',
        canAddToCart: true,
      }
    case 'on-order':
      return {
        label: leadTime ? `Na zamówienie (${leadTime})` : 'Na zamówienie',
        color: 'text-primary-600',
        bgColor: 'bg-primary-50',
        borderColor: 'border-primary-200',
        icon: '📦',
        canAddToCart: false,
      }
    case 'enquiry-only':
      return {
        label: 'Zapytaj o cenę',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        icon: '💬',
        canAddToCart: false,
      }
    case 'out-of-stock':
      return {
        label: 'Brak w magazynie',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: '✕',
        canAddToCart: false,
      }
    case 'discontinued':
      return {
        label: 'Wycofany - zapytaj o zamiennik',
        color: 'text-neutral-600',
        bgColor: 'bg-neutral-100',
        borderColor: 'border-neutral-300',
        icon: '🔄',
        canAddToCart: false,
      }
    default:
      return {
        label: 'Sprawdź dostępność',
        color: 'text-secondary-600',
        bgColor: 'bg-neutral-50',
        borderColor: 'border-neutral-200',
        icon: '❓',
        canAddToCart: false,
      }
  }
}

export function ProductCard({ product, locale = 'pl', onAddToCart, className = '' }: ProductCardProps) {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false)
  
  const price = product.variants?.[0]?.prices?.[0]
  const priceAmount = price ? (price.amount / 100).toFixed(2) : null
  const currency = price?.currency_code === 'pln' ? 'PLN' : price?.currency_code?.toUpperCase() || 'PLN'
  
  const availabilityStatus = getAvailabilityStatus(product)
  const availabilityInfo = getAvailabilityInfo(availabilityStatus, product.metadata?.lead_time)

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (availabilityInfo.canAddToCart) {
      onAddToCart?.(product)
    } else {
      setShowEnquiryModal(true)
    }
  }

  return (
    <>
      <Link
        href={`/${locale}/products/${product.handle || product.id}`}
        className={`group relative bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 block ${className}`}
      >
        {/* Orange accent on hover - Induxter style */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-2xl"></div>

        {/* Availability Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${availabilityInfo.bgColor} ${availabilityInfo.color} ${availabilityInfo.borderColor} border`}>
          {availabilityInfo.icon} {availabilityInfo.label}
        </div>

        {/* Product Image */}
        <div className="aspect-square bg-neutral-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden group-hover:bg-neutral-100 transition-colors">
          {product.thumbnail ? (
            <img 
              src={product.thumbnail} 
              alt={product.title}
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <svg className="w-16 h-16 text-neutral-300 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-base font-bold mb-2 text-secondary-700 line-clamp-2 group-hover:text-primary-500 transition-colors font-heading min-h-[3rem]">
          {product.title}
        </h3>

        {/* SKU */}
        <p className="text-xs text-secondary-500 mb-3 uppercase tracking-wide">
          SKU: {product.variants?.[0]?.sku || product.sku || 'N/A'}
        </p>

        {/* Divider */}
        <div className="h-px bg-neutral-200 mb-4"></div>

        {/* Price & Action Button */}
        <div className="flex justify-between items-end gap-3">
          <div>
            {priceAmount ? (
              <>
                <div className="text-xs text-secondary-500 uppercase tracking-wide mb-1">Cena netto</div>
                <span className="text-xl font-bold text-primary-500 font-heading">
                  {priceAmount} {currency}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-secondary-600">
                Zapytaj o cenę
              </span>
            )}
          </div>
          
          <button
            onClick={handleButtonClick}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              availabilityInfo.canAddToCart
                ? 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg'
                : 'bg-secondary-700 text-white hover:bg-secondary-800 hover:shadow-lg'
            }`}
          >
            {availabilityInfo.canAddToCart ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Dodaj
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Zapytaj
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Enquiry Modal */}
      <EnquiryModal
        product={product}
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
      />
    </>
  )
}
