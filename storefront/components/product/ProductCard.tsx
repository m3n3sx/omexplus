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
  }
  variants: Array<{
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => Promise<void>
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!onAddToCart) return
    setIsLoading(true)
    try {
      await onAddToCart(product.id)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const stockStatus = getStockStatus(product.inventory_quantity || 0)
  const price = product.variants[0]?.prices[0]
  const priceAmount = price ? (price.amount / 100).toFixed(2) : '0.00'
  const currency = price?.currency_code === 'eur' ? '€' : price?.currency_code?.toUpperCase() || 'EUR'

  return (
    <article 
      className={`
        group relative bg-white border rounded-lg overflow-hidden
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary
        ${stockStatus.borderClass}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-labelledby={`product-title-${product.id}`}
    >
      {/* Image Area */}
      <div className="relative h-48 bg-gray-50">
        <Image
          src={product.thumbnail || '/placeholder.svg'}
          alt={product.title}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center animate-in fade-in duration-300">
            <Link href={`/products/${product.handle}`}>
              <button className="px-6 py-2 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition-colors">
                Podgląd
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-2">
        {/* Rating */}
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <span aria-hidden="true">⭐⭐⭐⭐⭐</span>
          <span className="sr-only">Ocena {product.rating || 4.5} z 5 gwiazdek</span>
          <span>({product.rating || 4.5}) {product.reviewCount || 0} opinie</span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.handle}`}>
          <h3 
            id={`product-title-${product.id}`}
            className="font-semibold text-gray-900 line-clamp-2 hover:text-primary transition-colors cursor-pointer"
          >
            {product.title}
          </h3>
        </Link>

        {/* SKU */}
        <div className="text-xs font-mono text-gray-600 space-y-1">
          <div>SKU: {product.sku || 'N/A'}</div>
          {product.metadata?.manufacturer_sku && (
            <div>Mfr: {product.metadata.manufacturer_sku}</div>
          )}
        </div>

        <hr className="my-2 border-gray-200" />

        {/* Price */}
        <div className="text-2xl font-bold text-primary">
          {currency === '€' ? `€${priceAmount}` : `${priceAmount} ${currency}`}
        </div>

        {/* Stock Status */}
        <div className={`text-sm font-semibold flex items-center gap-1 ${stockStatus.color}`}>
          <span aria-hidden="true">{stockStatus.icon}</span>
          <span>{stockStatus.text}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={stockStatus.outOfStock || isLoading}
            className="flex-1 btn-primary min-h-[44px] flex items-center justify-center gap-2"
            aria-label="Dodaj do koszyka"
          >
            {isLoading ? (
              <span className="inline-block animate-spin">⟳</span>
            ) : (
              <>
                <span aria-hidden="true">➕</span>
                <span>Dodaj do koszyka</span>
              </>
            )}
          </button>
          <Link href={`/products/${product.handle}`}>
            <button className="px-4 py-3 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-all min-h-[44px]">
              Szczegóły
            </button>
          </Link>
        </div>
      </div>
    </article>
  )
}

function getStockStatus(quantity: number) {
  if (quantity === 0) {
    return {
      borderClass: 'border-l-4 border-danger opacity-70',
      color: 'text-danger',
      icon: '✗',
      text: 'Brak',
      outOfStock: true
    }
  }
  if (quantity < 10) {
    return {
      borderClass: 'border-l-4 border-warning',
      color: 'text-warning',
      icon: '⚠',
      text: 'Mało',
      outOfStock: false
    }
  }
  return {
    borderClass: '',
    color: 'text-success',
    icon: '✓',
    text: 'W magazynie',
    outOfStock: false
  }
}
