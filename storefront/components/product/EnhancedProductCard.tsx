'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  sku?: string
  inventory_quantity?: number
  rating?: number
  reviewCount?: number
  metadata?: {
    manufacturer_sku?: string
    manufacturer?: string
  }
  variants: Array<{
    id?: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

interface EnhancedProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => Promise<void>
  onQuickView?: (product: Product) => void
}

export function EnhancedProductCard({ product, onAddToCart, onQuickView }: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const stockStatus = getStockStatus(product.inventory_quantity || 0)
  const price = product.variants?.[0]?.prices?.[0]
  const priceAmount = price && price.amount > 0 ? (price.amount / 100).toFixed(2) : null
  const currency = price?.currency_code === 'pln' ? 'PLN' : price?.currency_code?.toUpperCase() || 'PLN'
  const hasPrice = priceAmount !== null

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!onAddToCart || !product.variants?.[0]?.id) return
    
    setIsAddingToCart(true)
    try {
      await onAddToCart(product.variants[0].id)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  return (
    <Link href={`/pl/products/${product.handle}`}>
      <article
        className="group relative bg-white rounded-xl border-2 border-neutral-200 overflow-hidden transition-all duration-300 hover:border-primary-500 hover:shadow-2xl hover:-translate-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Stock status indicator */}
        <div className={`absolute top-0 left-0 w-full h-1 ${stockStatus.bgColor} z-10`} />

        {/* Image Section */}
        <div className="relative h-64 bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
          <Image
            src={product.thumbnail || '/placeholder.svg'}
            alt={product.title}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Stock badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 ${stockStatus.bgColor} ${stockStatus.textColor} rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1 shadow-lg`}>
            <span>{stockStatus.icon}</span>
            <span>{stockStatus.text}</span>
          </div>

          {/* Quick actions overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-6 animate-in fade-in duration-300">
              <div className="flex gap-2">
                <button
                  onClick={handleQuickView}
                  className="px-4 py-2 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Podgląd
                </button>
                
                <button
                  onClick={handleAddToCart}
                  disabled={stockStatus.outOfStock || isAddingToCart || !hasPrice}
                  className="px-4 py-2 bg-secondary-500 text-white rounded-lg font-semibold hover:bg-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                >
                  {!hasPrice ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Zapytaj
                    </>
                  ) : isAddingToCart ? (
                    <>
                      <span className="inline-block animate-spin">⟳</span>
                      Dodawanie...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Do koszyka
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          {/* Manufacturer */}
          {product.metadata?.manufacturer && (
            <div className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
              {product.metadata.manufacturer}
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-neutral-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating || 4.5) ? 'text-warning fill-current' : 'text-neutral-300'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-neutral-600">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* SKU */}
          <div className="flex flex-col gap-1 text-xs font-mono text-neutral-600 bg-neutral-50 rounded-md p-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">SKU:</span>
              <span className="font-semibold">{product.sku || 'N/A'}</span>
            </div>
            {product.metadata?.manufacturer_sku && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Mfr:</span>
                <span className="font-semibold">{product.metadata.manufacturer_sku}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2 border-t border-neutral-200">
            {hasPrice ? (
              <div className="text-2xl font-bold text-primary-600">
                {priceAmount} {currency}
              </div>
            ) : (
              <div className="text-lg font-bold text-secondary-700">
                Zapytaj o cenę
              </div>
            )}
          </div>

          {/* Stock info */}
          <div className="flex items-center justify-between text-sm pt-2">
            <span className={`font-semibold ${stockStatus.textColor}`}>
              {stockStatus.fullText}
            </span>
            {product.inventory_quantity && product.inventory_quantity > 0 && (
              <span className="text-neutral-600">
                {product.inventory_quantity} szt.
              </span>
            )}
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[60px] border-b-primary-500/5 border-l-[60px] border-l-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </article>
    </Link>
  )
}

function getStockStatus(quantity: number) {
  if (quantity === 0) {
    return {
      bgColor: 'bg-danger/10',
      textColor: 'text-danger',
      icon: '✗',
      text: 'Brak',
      fullText: 'Brak w magazynie',
      outOfStock: true
    }
  }
  if (quantity < 10) {
    return {
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
      icon: '⚠',
      text: 'Mało',
      fullText: 'Niski stan magazynowy',
      outOfStock: false
    }
  }
  return {
    bgColor: 'bg-success/10',
    textColor: 'text-success',
    icon: '✓',
    text: 'Dostępny',
    fullText: 'W magazynie',
    outOfStock: false
  }
}
