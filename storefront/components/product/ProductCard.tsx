'use client'

import { HTMLAttributes } from 'react'

interface Product {
  id: string
  title: string
  handle?: string
  sku?: string
  thumbnail?: string
  inventory_quantity?: number
  variants?: Array<{
    id: string
    prices?: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  product: Product
}

export function ProductCard({ product, className = '', ...props }: ProductCardProps) {
  const price = product.variants?.[0]?.prices?.[0]
  const priceAmount = price ? (price.amount / 100).toFixed(2) : '0.00'
  const currency = price?.currency_code === 'pln' ? 'PLN' : price?.currency_code?.toUpperCase() || 'PLN'
  const inStock = (product.inventory_quantity ?? 0) > 0

  return (
    <div
      className={`group relative bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Orange accent on hover - Induxter style */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-lg"></div>

      {/* Product Image */}
      <div className="text-5xl text-center mb-4 bg-neutral-50 p-6 rounded-lg group-hover:bg-neutral-100 transition-colors">
        📦
      </div>

      {/* Product Title */}
      <h3 className="text-base font-bold mb-2 text-secondary-700 line-clamp-2 group-hover:text-primary-500 transition-colors font-heading">
        {product.title}
      </h3>

      {/* SKU */}
      <p className="text-xs text-secondary-500 mb-2 uppercase tracking-wide">
        SKU: {product.sku || 'N/A'}
      </p>

      {/* Stock Status */}
      <div className={`text-xs mb-4 font-semibold uppercase tracking-wide ${inStock ? 'text-success' : 'text-primary-500'}`}>
        {inStock ? `✓ ${product.inventory_quantity}x na magazynie` : '⏳ Zamówienie'}
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-200 mb-4"></div>

      {/* Price & Add to Cart */}
      <div className="flex justify-between items-center gap-3">
        <div>
          <div className="text-xs text-secondary-500 uppercase tracking-wide mb-1">Cena netto</div>
          <span className="text-xl font-bold text-primary-500 font-heading">
            {priceAmount} {currency}
          </span>
        </div>
        <button
          className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
            inStock
              ? 'bg-primary-500 text-white hover:bg-secondary-700 hover:shadow-lg'
              : 'bg-neutral-200 text-secondary-500 cursor-not-allowed'
          }`}
          disabled={!inStock}
        >
          {inStock ? 'Dodaj' : 'Zamów'}
        </button>
      </div>
    </div>
  )
}
