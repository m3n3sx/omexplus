'use client'

import Link from 'next/link'

interface Product {
  id: string
  title: string
  handle: string
  sku?: string
  variants: Array<{
    id?: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

interface ProductCardTemplateProps {
  product: Product
}

export function ProductCardTemplate({ product }: ProductCardTemplateProps) {
  return (
    <Link
      href={`/pl/products/${product.handle}`}
      className="group relative bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Orange accent on hover - Induxter style */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-10"></div>
      
      <div className="aspect-square bg-neutral-50 flex items-center justify-center relative overflow-hidden group-hover:bg-neutral-100 transition-colors duration-300">
        <svg className="w-24 h-24 text-neutral-300 group-hover:text-primary-500 transition-colors duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-secondary-700 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors text-base font-heading">{product.title}</h3>
        <p className="text-xs text-secondary-500 mb-4 uppercase tracking-wide">SKU: {product.sku}</p>
        
        {/* Divider */}
        <div className="h-px bg-neutral-200 mb-4"></div>
        
        <div className="flex items-center justify-between">
          {product.variants && product.variants.length > 0 && product.variants[0].prices && product.variants[0].prices.length > 0 ? (
            (() => {
              const price = product.variants[0].prices[0]
              return (
                <div>
                  <div className="text-xs text-secondary-500 uppercase tracking-wide mb-1">Cena netto</div>
                  <div className="text-primary-500 font-bold text-xl font-heading">
                    {(price.amount / 100).toFixed(2)} {price.currency_code.toUpperCase()}
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="text-secondary-500 font-bold text-sm uppercase tracking-wide">Zapytaj o cenę</div>
          )}
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
