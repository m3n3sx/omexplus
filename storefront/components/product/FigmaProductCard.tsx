'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface FigmaProductCardProps {
  product: any
}

export function FigmaProductCard({ product }: FigmaProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)

  const price = product.variants?.[0]?.prices?.[0]?.amount || 0
  const formattedPrice = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(price / 100)

  const thumbnail = product.thumbnail || product.images?.[0]?.url || '/placeholder.svg'
  const isNew = product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const discount = product.metadata?.discount || null

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Image Container */}
      <Link href={`/pl/products/${product.handle}`} className="block relative aspect-square bg-neutral-50 overflow-hidden">
        <Image
          src={imageError ? '/placeholder.svg' : thumbnail}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={() => setImageError(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-primary-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
              NOWOŚĆ
            </span>
          )}
          {discount && (
            <span className="bg-secondary-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsWishlisted(!isWishlisted)
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary-50"
          aria-label="Dodaj do ulubionych"
        >
          <svg 
            className={`w-5 h-5 ${isWishlisted ? 'fill-primary-600 text-primary-600' : 'text-neutral-400'}`}
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        {/* Quick View - appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full py-2 bg-white text-neutral-900 text-[13px] font-semibold rounded-lg hover:bg-neutral-100 transition-colors">
            Szybki podgląd
          </button>
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.categories?.[0] && (
          <Link 
            href={`/pl/categories/${product.categories[0].handle}`}
            className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide hover:text-primary-600 transition-colors"
          >
            {product.categories[0].name}
          </Link>
        )}
        
        {/* Title */}
        <Link href={`/pl/products/${product.handle}`}>
          <h3 className="text-[14px] font-semibold text-neutral-900 mt-2 mb-3 line-clamp-2 hover:text-primary-600 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-[12px] text-neutral-500">(4.8)</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-neutral-900">{formattedPrice}</div>
            {discount && (
              <div className="text-[12px] text-neutral-400 line-through">
                {new Intl.NumberFormat('pl-PL', {
                  style: 'currency',
                  currency: 'PLN'
                }).format((price / 100) * (1 + discount / 100))}
              </div>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <button
            className="w-9 h-9 bg-neutral-900 text-white rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
            aria-label="Dodaj do koszyka"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
