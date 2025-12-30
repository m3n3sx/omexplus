'use client'

import Link from 'next/link'
import { useState } from 'react'
import { EnquiryModal } from './EnquiryModal'
import { AvailabilityStatus } from './ProductCard'

interface Product {
  id: string
  title: string
  handle: string
  sku?: string
  thumbnail?: string
  inventory_quantity?: number
  availability?: AvailabilityStatus
  metadata?: {
    availability?: AvailabilityStatus
    lead_time?: string
  }
  variants: Array<{
    id?: string
    sku?: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

interface ProductCardTemplateProps {
  product: Product
  locale?: string
}

// Helper to determine availability status
function getAvailabilityStatus(product: Product): AvailabilityStatus {
  if (product.metadata?.availability) {
    return product.metadata.availability
  }
  if (product.availability) {
    return product.availability
  }
  
  const qty = product.inventory_quantity ?? 0
  if (qty > 10) return 'in-stock'
  if (qty > 0) return 'low-stock'
  return 'on-order'
}

// Get availability display info
function getAvailabilityInfo(status: AvailabilityStatus, leadTime?: string) {
  switch (status) {
    case 'in-stock':
      return { label: 'Na magazynie', color: 'text-green-600', bgColor: 'bg-green-50', icon: '✓', canAddToCart: true }
    case 'low-stock':
      return { label: 'Ostatnie sztuki', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: '⚡', canAddToCart: true }
    case 'pre-order':
      return { label: 'Przedsprzedaż', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '🔜', canAddToCart: true }
    case 'on-order':
      return { label: leadTime ? `Na zamówienie (${leadTime})` : 'Na zamówienie', color: 'text-primary-600', bgColor: 'bg-primary-50', icon: '📦', canAddToCart: false }
    case 'enquiry-only':
      return { label: 'Zapytaj o cenę', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: '💬', canAddToCart: false }
    case 'out-of-stock':
      return { label: 'Brak w magazynie', color: 'text-red-600', bgColor: 'bg-red-50', icon: '✕', canAddToCart: false }
    case 'discontinued':
      return { label: 'Wycofany', color: 'text-neutral-600', bgColor: 'bg-neutral-100', icon: '🔄', canAddToCart: false }
    default:
      return { label: 'Sprawdź', color: 'text-secondary-600', bgColor: 'bg-neutral-50', icon: '❓', canAddToCart: false }
  }
}

export function ProductCardTemplate({ product, locale = 'pl' }: ProductCardTemplateProps) {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false)
  
  const availabilityStatus = getAvailabilityStatus(product)
  const availabilityInfo = getAvailabilityInfo(availabilityStatus, product.metadata?.lead_time)
  
  const hasPrice = product.variants && product.variants.length > 0 && product.variants[0].prices && product.variants[0].prices.length > 0
  const price = hasPrice ? product.variants[0].prices[0] : null

  const handleEnquiryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowEnquiryModal(true)
  }

  return (
    <>
      <Link
        href={`/${locale}/products/${product.handle}`}
        className="group relative bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 block"
      >
        {/* Orange accent on hover - Induxter style */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-10"></div>
        
        {/* Availability Badge */}
        <div className={`absolute top-3 right-3 z-10 px-2 py-1 rounded-md text-xs font-semibold ${availabilityInfo.bgColor} ${availabilityInfo.color}`}>
          {availabilityInfo.icon} {availabilityInfo.label}
        </div>
        
        {/* Product Image */}
        <div className="aspect-square bg-neutral-50 flex items-center justify-center relative overflow-hidden group-hover:bg-neutral-100 transition-colors duration-300">
          {product.thumbnail ? (
            <img 
              src={product.thumbnail} 
              alt={product.title}
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <svg className="w-24 h-24 text-neutral-300 group-hover:text-primary-500 transition-colors duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-secondary-700 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors text-base font-heading min-h-[3rem]">
            {product.title}
          </h3>
          <p className="text-xs text-secondary-500 mb-4 uppercase tracking-wide">
            SKU: {product.variants?.[0]?.sku || product.sku || 'N/A'}
          </p>
          
          {/* Divider */}
          <div className="h-px bg-neutral-200 mb-4"></div>
          
          {/* Price & Action */}
          <div className="flex items-end justify-between">
            {price ? (
              <div>
                <div className="text-xs text-secondary-500 uppercase tracking-wide mb-1">Cena netto</div>
                <div className="text-primary-500 font-bold text-xl font-heading">
                  {(price.amount / 100).toFixed(2)} {price.currency_code.toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="text-secondary-600 font-semibold text-sm">
                Zapytaj o cenę
              </div>
            )}
            
            {/* Action Button */}
            {availabilityInfo.canAddToCart ? (
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            ) : (
              <button
                onClick={handleEnquiryClick}
                className="px-4 py-2 rounded-lg bg-secondary-700 text-white text-sm font-semibold hover:bg-secondary-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Zapytaj
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Enquiry Modal */}
      <EnquiryModal
        product={{
          id: product.id,
          title: product.title,
          handle: product.handle,
          sku: product.variants?.[0]?.sku || product.sku,
          thumbnail: product.thumbnail,
        }}
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
      />
    </>
  )
}
