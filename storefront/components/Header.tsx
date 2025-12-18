'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CategoryNavigation } from './layout/CategoryNavigation'

export default function Header() {
  const [cartCount] = useState(0)
  const [showMegaMenu, setShowMegaMenu] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 lg:px-12 max-w-[1200px]">
          <div className="flex items-center justify-between h-10 text-sm font-semibold">
            <div className="flex items-center gap-6">
              <a href="tel:+48500189080" className="flex items-center gap-2 text-secondary-700 hover:text-primary-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +48 500 189 080
              </a>
              <a href="mailto:omexsales@gmail.com" className="flex items-center gap-2 text-secondary-700 hover:text-primary-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                omexsales@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-secondary-700 hover:text-primary-500 transition-colors">
                🇵🇱 POLISH
              </button>
              <button className="flex items-center gap-1 text-secondary-700 hover:text-primary-500 transition-colors">
                PLN
              </button>
              <Link href="/pl/faq" className="text-secondary-700 hover:text-primary-500 transition-colors">
                FAQ
              </Link>
              <Link href="/pl/checkout" className="flex items-center gap-1 text-secondary-700 hover:text-primary-500 transition-colors">
                🛒 ZŁOŻONE CZĘŚCI
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Induxter Dark Style */}
      <div className="bg-secondary-700">
        <div className="container mx-auto px-4 lg:px-12 max-w-[1200px]">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/pl" className="flex items-center">
              <span className="text-3xl font-bold text-white tracking-wider font-heading">OMEX</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-8">
              <div 
                className="relative"
                onMouseEnter={() => setShowMegaMenu(true)}
                onMouseLeave={() => setShowMegaMenu(false)}
              >
                <button
                  className="flex items-center gap-2 text-white font-bold hover:text-primary-500 transition-colors font-heading"
                >
                  PRODUKTY
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showMegaMenu && (
                  <div className="absolute left-0 top-full pt-2 w-screen max-w-[1200px] -ml-[200px]">
                    <CategoryNavigation />
                  </div>
                )}
              </div>
              <Link href="/pl/o-nas" className="text-white font-bold hover:text-primary-500 transition-colors font-heading">
                O NAS
              </Link>
              <Link href="/pl/promocje" className="text-white font-bold hover:text-primary-500 transition-colors font-heading">
                PROMOCJE
              </Link>
              <Link href="/pl/kontakt" className="text-white font-bold hover:text-primary-500 transition-colors font-heading">
                KONTAKT
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Link href="/pl/logowanie" className="text-white hover:text-primary-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href="/pl/checkout" className="relative text-white hover:text-primary-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
