'use client'

import { ProductCard } from './ProductCard'

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

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (productId: string) => Promise<void>
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <span className="text-6xl mb-4 opacity-50" aria-hidden="true">📦</span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Nie znaleziono produktów
        </h2>
        <p className="text-gray-600 mb-6">
          Spróbuj zmienić kryteria wyszukiwania lub filtry
        </p>
        <button className="btn-secondary">
          Wyczyść filtry
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4 lg:p-8">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
