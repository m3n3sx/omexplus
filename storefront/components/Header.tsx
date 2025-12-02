'use client'

import Link from 'next/link'
import { useState } from 'react'
import CategoryMegaMenu from './CategoryMegaMenu'

export default function Header() {
  const [cartCount] = useState(0)
  const [showMegaMenu, setShowMegaMenu] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Logo */}
          <Link href="/pl" className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <span className="text-2xl font-bold">OMEX</span>
          </Link>

          {/* Quick Search Link */}
          <div className="flex-1 max-w-2xl">
            <Link href="/pl">
              <div className="px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-white transition-all cursor-pointer flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-gray-500">Kliknij aby wyszukać części...</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {/* Cart */}
            <Link 
              href="/pl/checkout" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">
                Koszyk ({cartCount})
              </span>
            </Link>

            {/* User */}
            <Link 
              href="/pl/logowanie" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Konto</span>
            </Link>

            {/* Catalog Button with Mega Menu */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowMegaMenu(true)}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                Katalog
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <CategoryMegaMenu 
                isOpen={showMegaMenu}
                onClose={() => setShowMegaMenu(false)}
              />
            </div>
          </nav>
        </div>
      </div>

      {/* Secondary Nav */}
      <div className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 py-3 text-sm">
            <Link href="/pl/o-nas" className="text-gray-600 hover:text-primary-500 transition-colors">
              O nas
            </Link>
            <Link href="/pl/kontakt" className="text-gray-600 hover:text-primary-500 transition-colors">
              Kontakt
            </Link>
            <Link href="/pl/faq" className="text-gray-600 hover:text-primary-500 transition-colors">
              FAQ
            </Link>
            <Link href="/pl/products" className="text-gray-600 hover:text-primary-500 transition-colors">
              Produkty
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
