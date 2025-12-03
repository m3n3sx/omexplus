'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SearchBar } from './NewSearchBar'
import { MobileNav } from './MobileNav'

export function NewHeader() {
  const [cartCount, setCartCount] = useState(2) // TODO: Get from cart context

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-lg">
      {/* Top Bar */}
      <div className="bg-primary-dark">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="hidden md:flex gap-4">
              <a href="tel:+48123456789" className="hover:text-secondary transition-colors">
                ☎ +48 123 456 789
              </a>
              <a href="mailto:kontakt@omex.pl" className="hover:text-secondary transition-colors">
                ✉ kontakt@omex.pl
              </a>
            </div>
            <div className="flex gap-4 items-center ml-auto">
              <span className="hidden sm:inline">Pn-Pt 8:00-18:00</span>
              <div className="flex gap-2">
                <button className="hover:text-secondary transition-colors font-semibold">PL</button>
                <span className="text-gray-400">|</span>
                <button className="hover:text-secondary transition-colors">EN</button>
                <span className="text-gray-400">|</span>
                <button className="hover:text-secondary transition-colors">DE</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <MobileNav />
          </div>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold hover:text-secondary transition-colors">
            OMEX
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 flex-1 justify-center" aria-label="Main navigation">
            <Link href="/kategoria/hydraulika" className="hover:text-secondary transition-colors font-medium">
              Hydraulika
            </Link>
            <Link href="/kategoria/filtry" className="hover:text-secondary transition-colors font-medium">
              Filtry
            </Link>
            <Link href="/kategoria/osprzet" className="hover:text-secondary transition-colors font-medium">
              Osprzęt
            </Link>
            <Link href="/kategoria/loziska" className="hover:text-secondary transition-colors font-medium">
              Łożyska
            </Link>
            <Link href="/kategoria/silniki" className="hover:text-secondary transition-colors font-medium">
              Silniki
            </Link>
            <Link href="/kategoria/lyzki" className="hover:text-secondary transition-colors font-medium">
              Łyżki
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link href="/konto" className="p-2 hover:text-secondary transition-colors" aria-label="Konto użytkownika">
              <span className="text-xl">👤</span>
            </Link>
            <Link href="/checkout" className="p-2 relative hover:text-secondary transition-colors" aria-label={`Koszyk, ${cartCount} produkty`}>
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white py-3 shadow-md">
        <div className="container mx-auto px-4">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}
