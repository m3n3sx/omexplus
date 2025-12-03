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
      {/* Hamburger Button */}
      <button
        className="flex flex-col gap-1 p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <span className="w-6 h-0.5 bg-white transition-all" />
        <span className="w-6 h-0.5 bg-white transition-all" />
        <span className="w-6 h-0.5 bg-white transition-all" />
      </button>

      {/* Overlay and Menu - using portal to avoid hydration issues */}
      {mounted && isOpen && createPortal(
        <div>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-[1002]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Drawer */}
          <nav 
            className="fixed top-0 left-0 w-72 h-full bg-white z-[1003] overflow-y-auto shadow-2xl"
            aria-label="Mobile navigation"
          >
            {/* Menu Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <button
                className="text-2xl text-gray-600 hover:text-gray-900 p-1"
                onClick={() => setIsOpen(false)}
                aria-label="Zamknij menu"
              >
                ✕
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-5">
              {/* Main Categories */}
              <div className="space-y-1">
                <Link
                  href="/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  🏠 Strona główna
                </Link>
                <Link
                  href="/kategoria/hydraulika"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Hydraulika
                </Link>
                <Link
                  href="/kategoria/filtry"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Filtry
                </Link>
                <Link
                  href="/kategoria/osprzet"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Osprzęt
                </Link>
                <Link
                  href="/kategoria/loziska"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Łożyska
                </Link>
                <Link
                  href="/kategoria/silniki"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Silniki
                </Link>
                <Link
                  href="/kategoria/lyzki"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Łyżki
                </Link>
              </div>

              {/* User Section */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-1">
                <Link
                  href="/konto"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  👤 Moje konto
                </Link>
                <Link
                  href="/checkout"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  🛒 Koszyk
                </Link>
              </div>

              {/* Footer Links */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-1">
                <Link
                  href="/o-nas"
                  className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  O nas
                </Link>
                <Link
                  href="/kontakt"
                  className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Kontakt
                </Link>
                <Link
                  href="/faq"
                  className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  FAQ
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    <a href="tel:+48123456789" className="hover:text-gray-900">
                      ☎ +48 123 456 789
                    </a>
                  </div>
                  <div>
                    <a href="mailto:kontakt@omex.pl" className="hover:text-gray-900">
                      ✉ kontakt@omex.pl
                    </a>
                  </div>
                  <div className="text-xs text-gray-500 mt-3">
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
