'use client'

import Link from 'next/link'
import Image from 'next/image'

export function FigmaHero() {
  return (
    <section className="relative bg-neutral-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-[60px]">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center py-12 md:py-20">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="inline-block">
              <span className="text-[13px] font-medium text-primary-600 bg-primary-50 px-4 py-2 rounded-full">
                Nowa kolekcja 2024
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
              Części do maszyn budowlanych
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-lg">
              Odkryj najwyższej jakości części zamienne do koparek, ładowarek i innych maszyn budowlanych. Gwarancja najlepszych cen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/pl/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white text-[14px] font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Przeglądaj produkty
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link
                href="/pl/categories"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-neutral-900 text-[14px] font-semibold rounded-lg border-2 border-neutral-200 hover:border-neutral-900 transition-colors"
              >
                Zobacz kategorie
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-neutral-900">5000+</div>
                <div className="text-sm text-neutral-600">Produktów</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neutral-900">50+</div>
                <div className="text-sm text-neutral-600">Marek</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neutral-900">24/7</div>
                <div className="text-sm text-neutral-600">Wsparcie</div>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
              {/* Placeholder with icon - replace with actual image when available */}
              <div className="text-center p-8">
                <div className="text-8xl mb-4">🚜</div>
                <div className="text-neutral-600 font-medium">
                  Maszyny budowlane
                </div>
                <div className="text-sm text-neutral-500 mt-2">
                  Dodaj obraz: /storefront/public/hero-machine.jpg
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
