'use client'

import { useRouter } from 'next/navigation'
import { HTMLAttributes } from 'react'

interface FeaturedProductCardProps extends HTMLAttributes<HTMLDivElement> {
  product: {
    id: string
    name: string
    slug: string
    category: string
    description: string
  }
  locale: string
  onClick?: () => void
}

/**
 * FeaturedProductCard component displays a featured product in the mega menu
 * with text-only design, 2-line description truncation, and click navigation.
 * 
 * @param product - Product data including name, slug, category, and description
 * @param locale - Current locale for navigation
 * @param onClick - Optional callback when card is clicked
 */
export function FeaturedProductCard({ 
  product, 
  locale, 
  onClick,
  className = '',
  ...props 
}: FeaturedProductCardProps) {
  const router = useRouter()

  const handleClick = () => {
    // Navigate to product detail page
    router.push(`/${locale}/products/${product.slug}`)
    
    // Call optional onClick callback
    if (onClick) {
      onClick()
    }
  }

  return (
    <div
      className={`featured-product-card group cursor-pointer p-4 rounded-md hover:bg-neutral-50 transition-all duration-200 ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      {...props}
    >
      {/* Product Name */}
      <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-secondary-600 transition-colors mb-1">
        {product.name}
      </h4>

      {/* Category Badge */}
      <div className="mb-2">
        <span className="inline-block text-xs text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
          {product.category}
        </span>
      </div>

      {/* Description with 2-line truncation */}
      <p 
        className="text-xs text-neutral-600 line-clamp-2"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {product.description}
      </p>
    </div>
  )
}
