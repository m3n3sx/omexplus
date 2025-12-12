'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Hamburger Button - Gold accent */}
      <button
        className="flex flex-col gap-1.5 p-2 rounded hover:bg-neutral-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <span className={`w-6 h-0.5 bg-secondary-500 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-6 h-0.5 bg-secondary-500 transition-all ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-0.5 bg-secondary-500 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Overlay and Menu - using portal to avoid hydration issues */}
      {mounted && isOpen && createPortal(
        <div>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1002]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Drawer - Dark theme */}
          <nav 
            className="fixed top-0 left-0 w-80 h-full bg-neutral-900 z-[1003] overflow-y-auto shadow-2xl border-r border-neutral-700"
            aria-label="Mobile navigation"
          >
            {/* Gold accent line */}
            <div className="h-1 bg-gradient-to-r from-secondary-500 via-secondary-400 to-transparent"></div>
            
            {/* Menu Header */}
            <div className="flex justify-between items-center p-6 border-b border-neutral-700">
              <div>
                <h2 className="text-2xl font-bold text-neutral-100 uppercase tracking-wider">OMEX</h2>
                <div className="h-0.5 w-16 bg-secondary-500 mt-1"></div>
              </div>
              <button
                className="w-10 h-10 flex items-center justify-center rounded bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-secondary-500 hover:border-secondary-500 transition-all"
                onClick={() => setIsOpen(false)}
                aria-label="Zamknij menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6">
              {/* Main Categories */}
              <div className="space-y-2">
                <Link
                  href="/pl"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-100 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-bold transition-all group border border-transparent hover:border-secondary-500/30"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">🏠</span>
                  <span className="uppercase tracking-wide text-sm">Strona główna</span>
                </Link>
                <Link
                  href="/pl/products"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all group border border-transparent hover:border-secondary-500/30"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">📦</span>
                  <span className="uppercase tracking-wide text-sm">Wszystkie produkty</span>
                </Link>
                <Link
                  href="/pl/categories"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all group border border-transparent hover:border-secondary-500/30"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">📂</span>
                  <span className="uppercase tracking-wide text-sm">Kategorie</span>
                </Link>
                <Link
                  href="/pl/promocje"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all group border border-transparent hover:border-secondary-500/30"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">🏷️</span>
                  <span className="uppercase tracking-wide text-sm">Promocje</span>
                </Link>
                <Link
                  href="/pl/nowosci"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all group border border-transparent hover:border-secondary-500/30"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">⚡</span>
                  <span className="uppercase tracking-wide text-sm">Nowości</span>
                </Link>
                <Link
                  href="/pl/bestsellery"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all group border border-transparent hover:border-secondary-500/30"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">⭐</span>
                  <span className="uppercase tracking-wide text-sm">Bestsellery</span>
                </Link>
              </div>

              {/* User Section */}
              <div className="mt-6 pt-6 border-t border-neutral-700 space-y-2">
                <div className="text-xs text-secondary-500 font-bold uppercase tracking-widest mb-3 px-4">Konto</div>
                <Link
                  href="/pl/konto"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">👤</span>
                  <span>Moje konto</span>
                </Link>
                <Link
                  href="/pl/zamowienia"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">📋</span>
                  <span>Moje zamówienia</span>
                </Link>
                <Link
                  href="/pl/cart"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">🛒</span>
                  <span>Koszyk</span>
                </Link>
              </div>

              {/* Footer Links */}
              <div className="mt-6 pt-6 border-t border-neutral-700 space-y-2">
                <div className="text-xs text-secondary-500 font-bold uppercase tracking-widest mb-3 px-4">Informacje</div>
                <Link
                  href="/pl/o-nas"
                  className="block px-4 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 rounded-lg text-sm transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  O nas
                </Link>
                <Link
                  href="/pl/kontakt"
                  className="block px-4 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 rounded-lg text-sm transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Kontakt
                </Link>
                <Link
                  href="/pl/faq"
                  className="block px-4 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 rounded-lg text-sm transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  FAQ
                </Link>
                <Link
                  href="/pl/tracking"
                  className="block px-4 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 rounded-lg text-sm transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  📍 Śledzenie paczki
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-neutral-700">
                <div className="text-xs text-secondary-500 font-bold uppercase tracking-widest mb-3 px-4">Kontakt</div>
                <div className="px-4 space-y-3">
                  <a href="tel:+48123456789" className="flex items-center gap-2 text-neutral-300 hover:text-secondary-500 transition-colors">
                    <span>☎</span>
                    <span className="font-semibold">+48 123 456 789</span>
                  </a>
                  <a href="mailto:kontakt@omex.pl" className="flex items-center gap-2 text-neutral-300 hover:text-secondary-500 transition-colors">
                    <span>✉</span>
                    <span className="font-semibold">kontakt@omex.pl</span>
                  </a>
                  <div className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-800">
                    Pn-Pt 8:00-18:00
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>,
        document.body
      )}
    </>
  )
}
