'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface ModernProductCardProps {
  product: any
}

export function ModernProductCard({ product }: ModernProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)

  const price = product.variants?.[0]?.prices?.[0]?.amount || 0
  const formattedPrice = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(price / 100)

  const thumbnail = product.thumbnail || product.images?.[0]?.url || '/placeholder.svg'
  const isNew = product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  // Random pastel colors for variety
  const colors = ['bg-info/10', 'bg-primary-50', 'bg-neutral-100', 'bg-primary-100']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return (
    <div className="group relative">
      {/* Card */}
      <div className={`${randomColor} rounded-3xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
        {/* Image Container */}
        <Link href={`/pl/products/${product.handle}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-white mb-4">
          <Image
            src={imageError ? '/placeholder.svg' : thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
          
          {/* Badges */}
          {isNew && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                NOWOŚĆ
              </span>
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Dodaj do ulubionych"
          >
            <svg 
              className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </Link>
        
        {/* Content */}
        <div className="space-y-3">
          {/* Category */}
          {product.categories?.[0] && (
            <Link 
              href={`/pl/categories/${product.categories[0].handle}`}
              className="inline-block text-[11px] font-bold text-neutral-500 uppercase tracking-wider hover:text-neutral-900 transition-colors"
            >
              {product.categories[0].name}
            </Link>
          )}
          
          {/* Title */}
          <Link href={`/pl/products/${product.handle}`}>
            <h3 className="text-[15px] font-bold text-neutral-900 line-clamp-2 hover:text-blue-600 transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
          
          {/* Price & Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-2xl font-extrabold text-neutral-900">{formattedPrice}</div>
            
            <button
              className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110 shadow-lg shadow-blue-600/30"
              aria-label="Dodaj do koszyka"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
