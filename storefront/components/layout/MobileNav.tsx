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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  <span className="uppercase tracking-wide text-sm">Strona główna</span>
                </Link>
                <Link
                  href="/pl/products"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all group border border-transparent hover:border-secondary-500/30"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <span className="uppercase tracking-wide text-sm">Wszystkie produkty</span>
                </Link>
                <Link
                  href="/pl/categories"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all group border border-transparent hover:border-secondary-500/30"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  <span className="uppercase tracking-wide text-sm">Kategorie</span>
                </Link>
                <Link
                  href="/pl/promocje"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all group border border-transparent hover:border-secondary-500/30"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                  <span className="uppercase tracking-wide text-sm">Promocje</span>
                </Link>
                <Link
                  href="/pl/nowosci"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all group border border-transparent hover:border-secondary-500/30"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span className="uppercase tracking-wide text-sm">Nowości</span>
                </Link>
                <Link
                  href="/pl/bestsellery"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all group border border-transparent hover:border-secondary-500/30"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span>Moje konto</span>
                </Link>
                <Link
                  href="/pl/zamowienia"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  <span>Moje zamówienia</span>
                </Link>
                <Link
                  href="/pl/cart"
                  className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-neutral-800 hover:text-secondary-500 rounded-lg font-semibold transition-all text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
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
                  className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 rounded-lg text-sm transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Śledzenie paczki
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-neutral-700">
                <div className="text-xs text-secondary-500 font-bold uppercase tracking-widest mb-3 px-4">Kontakt</div>
                <div className="px-4 space-y-3">
                  <a href="tel:+48500169060" className="flex items-center gap-2 text-neutral-300 hover:text-secondary-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span className="font-semibold">+48 500 169 060</span>
                  </a>
                  <a href="mailto:omexplus@gmail.com" className="flex items-center gap-2 text-neutral-300 hover:text-secondary-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="font-semibold">omexplus@gmail.com</span>
                  </a>
                  <div className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-800">
                    Pn-Pt 8:00-16:00
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
