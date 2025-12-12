'use client'

import Link from 'next/link'

export function ModernHero() {
  return (
    <section className="relative bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-[60px] py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-[13px] font-semibold">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              Nowa kolekcja 2024
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 leading-tight">
              Części do maszyn
              <span className="block text-primary-600">budowlanych</span>
            </h1>
            
            <p className="text-lg text-neutral-700 leading-relaxed max-w-lg">
              Odkryj najwyższej jakości części zamienne. Gwarancja najlepszych cen i szybka dostawa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/pl/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white text-[15px] font-bold rounded-2xl hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
              >
                Przeglądaj produkty
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link
                href="/pl/categories"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-neutral-900 text-[15px] font-bold rounded-2xl hover:bg-neutral-50 transition-all border-2 border-neutral-200"
              >
                Kategorie
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-extrabold text-neutral-900">5000+</div>
                <div className="text-sm text-neutral-600">Produktów</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-neutral-900">50+</div>
                <div className="text-sm text-neutral-600">Marek</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-neutral-900">24/7</div>
                <div className="text-sm text-neutral-600">Wsparcie</div>
              </div>
            </div>
          </div>
          
          {/* Right Image - Floating Card Style */}
          <div className="relative">
            {/* Large Circle Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 blur-3xl"></div>
            
            {/* Main Image Card */}
            <div className="relative bg-white rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-8xl mb-4">🚜</div>
                  <div className="text-neutral-600 font-semibold">
                    Maszyny budowlane
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">Gwarancja</div>
                  <div className="text-xs text-neutral-600">Oryginalne części</div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-300 rounded-2xl opacity-50 blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-300 rounded-full opacity-30 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
