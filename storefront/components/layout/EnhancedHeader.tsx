'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HorizontalMegaMenu } from './HorizontalMegaMenu'

export function EnhancedHeader() {
  const [cartCount] = useState(0)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-xs md:text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hidden md:inline">+48 123 456 789</span>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>kontakt@omex.pl</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline">Darmowa dostawa od 500 PLN</span>
              <Link href="/pl/kontakt" className="hover:text-secondary-300 transition-colors">
                Pomoc
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link href="/pl" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-105 transition-transform">
                O
              </div>
              <div className="hidden md:block">
                <div className="text-2xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                  OMEX
                </div>
                <div className="text-xs text-neutral-500">Części budowlane</div>
              </div>
            </Link>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Cart */}
              <Link 
                href="/pl/cart" 
                className="relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl hover:bg-neutral-100 transition-colors group"
              >
                <div className="relative">
                  <svg className="w-6 h-6 text-neutral-700 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline text-sm font-semibold text-neutral-700 group-hover:text-primary-600 transition-colors">
                  Koszyk
                </span>
              </Link>

              {/* User Account */}
              <Link 
                href="/pl/logowanie" 
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl hover:bg-neutral-100 transition-colors group"
              >
                <svg className="w-6 h-6 text-neutral-700 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden lg:inline text-sm font-semibold text-neutral-700 group-hover:text-primary-600 transition-colors">
                  Konto
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Mega Menu */}
      <HorizontalMegaMenu />

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-neutral-200">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link href="/pl/categories" className="block py-2 text-neutral-700 hover:text-primary-600 font-medium">
              Wszystkie kategorie
            </Link>
            <Link href="/pl/o-nas" className="block py-2 text-neutral-700 hover:text-primary-600 font-medium">
              O nas
            </Link>
            <Link href="/pl/kontakt" className="block py-2 text-neutral-700 hover:text-primary-600 font-medium">
              Kontakt
            </Link>
            <Link href="/pl/faq" className="block py-2 text-neutral-700 hover:text-primary-600 font-medium">
              FAQ
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
