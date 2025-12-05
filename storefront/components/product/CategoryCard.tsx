'use client'

import Link from 'next/link'
import Image from 'next/image'

interface CategoryCardProps {
  id: string
  name: string
  handle: string
  description?: string
  thumbnail?: string | null
  productCount?: number
}

export function CategoryCard({
  id,
  name,
  handle,
  description,
  thumbnail,
  productCount
}: CategoryCardProps) {
  return (
    <Link href={`/pl/categories/${handle || id}`}>
      <article className="group relative bg-white rounded-lg border-2 border-neutral-200 overflow-hidden transition-all duration-300 hover:border-primary-500 hover:shadow-xl hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Product count badge */}
          {productCount !== undefined && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-700">
              {productCount} {productCount === 1 ? 'produkt' : 'produktów'}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {name}
          </h3>
          
          {description && (
            <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
              {description}
            </p>
          )}

          {/* View button */}
          <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
            <span>Przeglądaj</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-t-primary-500 border-r-[40px] border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </article>
    </Link>
  )
}
