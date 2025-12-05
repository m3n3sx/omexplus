'use client'

import Link from 'next/link'

export function ModernPromoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Green Card - 50% OFF */}
      <Link 
        href="/pl/sale"
        className="relative bg-gradient-to-br from-green-300 to-green-400 rounded-3xl p-8 overflow-hidden group hover:scale-105 transition-transform duration-300"
      >
        <div className="relative z-10">
          <div className="text-5xl font-extrabold text-white mb-2">
            GET UP TO 50% OFF
          </div>
          <button className="mt-4 px-6 py-2.5 bg-white text-neutral-900 rounded-xl font-bold text-[13px] hover:bg-neutral-100 transition-colors">
            Get Discount
          </button>
        </div>
        
        {/* Decorative Image Placeholder */}
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/20 rounded-full"></div>
        <div className="absolute right-4 bottom-4 text-6xl opacity-50">🎁</div>
      </Link>

      {/* Yellow Card - Winter's Weekend */}
      <Link 
        href="/pl/winter"
        className="relative bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-3xl p-8 overflow-hidden group hover:scale-105 transition-transform duration-300"
      >
        <div className="relative z-10">
          <div className="text-4xl font-extrabold text-neutral-900 mb-2">
            Winter's weekend
          </div>
          <div className="text-[15px] text-neutral-700 font-medium mb-4">
            keep it casual
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-white/30 rounded-full"></div>
        <div className="absolute right-8 top-8 text-6xl">☀️</div>
      </Link>
    </div>
  )
}
