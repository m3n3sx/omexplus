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
      className={`group relative bg-neutral-800 rounded-lg p-6 shadow-lg border border-neutral-700 hover:border-secondary-500 hover:shadow-2xl hover:shadow-secondary-500/10 transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Gold accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-lg"></div>

      {/* Product Image */}
      <div className="text-5xl text-center mb-4 bg-neutral-900 p-6 rounded-lg border border-neutral-700 group-hover:border-secondary-500/30 transition-colors">
        📦
      </div>

      {/* Product Title */}
      <h3 className="text-base font-semibold mb-2 text-neutral-100 line-clamp-2 group-hover:text-secondary-500 transition-colors">
        {product.title}
      </h3>

      {/* SKU */}
      <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wide">
        SKU: {product.sku || 'N/A'}
      </p>

      {/* Stock Status */}
      <div className={`text-xs mb-4 font-bold uppercase tracking-wide ${inStock ? 'text-success' : 'text-warning'}`}>
        {inStock ? `✓ ${product.inventory_quantity}x na magazynie` : '⏳ Zamówienie'}
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-700 mb-4"></div>

      {/* Price & Add to Cart */}
      <div className="flex justify-between items-center gap-3">
        <div>
          <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Cena netto</div>
          <span className="text-xl font-bold text-secondary-500">
            {priceAmount} {currency}
          </span>
        </div>
        <button
          className={`px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
            inStock
              ? 'bg-secondary-500 text-neutral-900 hover:bg-secondary-400 hover:shadow-lg hover:shadow-secondary-500/30'
              : 'bg-neutral-700 text-neutral-500 cursor-not-allowed border border-neutral-600'
          }`}
          disabled={!inStock}
        >
          {inStock ? 'Dodaj' : 'Zamów'}
        </button>
      </div>
    </div>
  )
}
