'use client'

import { useState } from 'react'
import Link from 'next/link'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

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

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[1002] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu Drawer */}
      <nav 
        className={`
          fixed top-0 left-0 w-72 h-full bg-white z-[1003] overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
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
        <ul className="py-2">
          <li className="border-b border-gray-100">
            <Link 
              href="/kategoria/hydraulika" 
              className="block px-5 py-4 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Hydraulika
            </Link>
          </li>
          <li className="border-b border-gray-100">
            <Link 
              href="/kategoria/filtry" 
              className="block px-5 py-4 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Filtry
            </Link>
          </li>
          <li className="border-b border-gray-100">
            <Link 
              href="/kategoria/osprzet" 
              className="block px-5 py-4 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Osprzęt
            </Link>
          </li>
          <li className="border-b border-gray-100">
            <Link 
              href="/kategoria/loziska" 
              className="block px-5 py-4 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Łożyska
            </Link>
          </li>
          <li className="border-b border-gray-100">
            <Link 
              href="/kategoria/silniki" 
              className="block px-5 py-4 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Silniki
            </Link>
          </li>
          <li className="border-b border-gray-100">
            <Link 
              href="/kategoria/lyzki" 
              className="block px-5 py-4 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Łyżki
            </Link>
          </li>
        </ul>

        {/* Additional Links */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <ul className="py-2">
            <li>
              <Link 
                href="/o-nas" 
                className="block px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                O nas
              </Link>
            </li>
            <li>
              <Link 
                href="/kontakt" 
                className="block px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Kontakt
              </Link>
            </li>
            <li>
              <Link 
                href="/faq" 
                className="block px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Pomoc
              </Link>
            </li>
          </ul>
        </div>

        {/* Language Switcher */}
        <div className="mt-4 px-5 py-4 border-t border-gray-200">
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary text-white rounded font-semibold">
              PL
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
              EN
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
              DE
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
