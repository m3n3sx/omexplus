'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { MobileNav } from './MobileNav'
import { useCartContext } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

// Main categories with subcategories
const MAIN_CATEGORIES = [
  {
    name: 'Hydraulika',
    icon: '🔧',
    slug: 'hydraulika',
    subcategories: [
      'Pompy hydrauliczne',
      'Silniki hydrauliczne',
      'Zawory hydrauliczne',
      'Cylindry hydrauliczne',
      'Wąż hydrauliczny & Złączki',
      'Zbiorniki hydrauliczne',
      'Filtry hydrauliczne',
      'Płyny hydrauliczne',
      'Garne hydrauliczne',
      'Czujniki & Wskaźniki',
    ]
  },
  {
    name: 'Filtry',
    icon: '🔍',
    slug: 'filtry',
    subcategories: [
      'Filtry powietrza',
      'Filtry paliwa',
      'Filtry oleju',
      'Filtry hydrauliczne HF',
      'Filtry hydrauliczne HG',
      'Filtry hydrauliczne HH',
      'Komplety filtrów',
    ]
  },
  {
    name: 'Silniki',
    icon: '⚙️',
    slug: 'silniki',
    subcategories: [
      'Silniki spalinowe',
      'Turbosprężarki',
      'Układ paliwowy',
      'Układ chłodzenia',
      'Układ rozruchowy',
      'Paski & Łańcuchy',
    ]
  },
  {
    name: 'Podwozia',
    icon: '🚜',
    slug: 'podwozia',
    subcategories: [
      'Gąsienice gumowe',
      'Podwozia kołowe',
      'Groty gąsienic',
      'Bolce gąsienic',
      'Łączniki gąsienic',
      'Napinacze gąsienic',
    ]
  },
  {
    name: 'Elektryka',
    icon: '⚡',
    slug: 'elektryka',
    subcategories: [
      'Oświetlenie',
      'Kable & Przewody',
      'Silniki elektryczne',
      'Elektronika sterowania',
      'Baterie & Zasilanie',
    ]
  },
  {
    name: 'Osprzęt',
    icon: '🔨',
    slug: 'osprzet',
    subcategories: [
      'Łyżki standardowe',
      'Łyżki wzmocnione',
      'Młoty hydrauliczne',
      'Wiertła & Narzędzia',
      'Kompaktory',
      'Haki & Uchwyty',
    ]
  },
  {
    name: 'Uszczelnienia',
    icon: '⭕',
    slug: 'uszczelnienia',
    subcategories: [
      'O-ringi',
      'Pierścienie tłokowe',
      'Uszczelki głowicy',
      'Uszczelki wałów',
      'Komplety uszczelniające',
    ]
  },
]

export function NewHeader() {
  const locale = useLocale()
  const { itemCount } = useCartContext()
  const { customer, isAuthenticated } = useAuth()
  const [activeCategoryMenu, setActiveCategoryMenu] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-dark text-white shadow-2xl">
      {/* Yellow accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
      
      {/* Top Bar - Yellow theme */}
      <div className="bg-primary-500 border-b border-primary-600">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="hidden md:flex gap-4">
              <a href="tel:+48500169060" className="text-secondary-700 hover:text-secondary-800 transition-colors font-medium">
                ☎ +48 500 169 060
              </a>
              <a href="mailto:omexplus@gmail.com" className="text-secondary-700 hover:text-secondary-800 transition-colors font-medium">
                ✉ omexplus@gmail.com
              </a>
            </div>
            <div className="flex gap-4 items-center ml-auto">
              <span className="hidden sm:inline text-secondary-700">Pn-Pt 8:00-18:00</span>
              <div className="flex gap-2">
                <button className="text-secondary-700 hover:text-secondary-800 transition-colors font-bold uppercase tracking-wide">PL</button>
                <span className="text-primary-700">|</span>
                <button className="text-secondary-600 hover:text-secondary-700 transition-colors uppercase tracking-wide">EN</button>
                <span className="text-primary-700">|</span>
                <button className="text-secondary-600 hover:text-secondary-700 transition-colors uppercase tracking-wide">DE</button>
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
          <Link href="/pl" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-neutral-800 border-2 border-primary-500 rounded flex items-center justify-center font-bold text-xl text-light group-hover:bg-primary-500 group-hover:text-secondary-700 transition-all duration-300">
                O
              </div>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
            <div>
              <span className="text-2xl font-bold text-light tracking-wider">OMEX</span>
              <div className="h-0.5 w-16 bg-primary-500"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 flex-1 justify-center items-center" aria-label="Main navigation">
            <Link href="/pl/products" className="text-light hover:text-primary-500 transition-colors font-medium uppercase tracking-wide text-sm">
              Produkty
            </Link>
            <Link href="/pl/o-nas" className="text-light hover:text-primary-500 transition-colors font-medium uppercase tracking-wide text-sm">
              O nas
            </Link>
            <Link href="/pl/kontakt" className="text-light hover:text-primary-500 transition-colors font-medium uppercase tracking-wide text-sm">
              Kontakt
            </Link>
            <Link href="/pl/faq" className="text-light hover:text-primary-500 transition-colors font-medium uppercase tracking-wide text-sm">
              FAQ
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            {/* User Menu */}
            {isAuthenticated && customer ? (
              <Link 
                href={`/${locale}/account`} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-primary-500 hover:bg-neutral-750 transition-all group" 
                aria-label="Konto użytkownika"
              >
                <svg className="w-5 h-5 text-light group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden md:inline text-sm font-semibold text-light group-hover:text-primary-500 transition-colors">{customer.first_name}</span>
              </Link>
            ) : (
              <Link 
                href={`/${locale}/account/login`} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-primary-500 hover:bg-neutral-750 transition-all group" 
                aria-label="Zaloguj się"
              >
                <svg className="w-5 h-5 text-light group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden md:inline text-sm font-semibold text-light group-hover:text-primary-500 transition-colors uppercase tracking-wide">Zaloguj</span>
              </Link>
            )}
            
            {/* Cart */}
            <Link 
              href={`/${locale}/cart`} 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-primary-500 hover:bg-neutral-750 transition-all group relative" 
              aria-label={`Koszyk, ${itemCount} produkty`}
            >
              <svg className="w-5 h-5 text-light group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="px-2 py-0.5 bg-danger text-neutral-50 text-xs rounded-full font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Category Bar - Yellow theme */}
      <div className="bg-primary-500 border-t border-primary-600">
        <div className="container mx-auto">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {MAIN_CATEGORIES.map((category) => (
              <div
                key={category.slug}
                onMouseEnter={() => setActiveCategoryMenu(category.slug)}
                onMouseLeave={() => setActiveCategoryMenu(null)}
              >
                <Link
                  href={`/pl/categories/${category.slug}`}
                  className={`px-4 py-3 text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 rounded-md uppercase tracking-wide ${
                    activeCategoryMenu === category.slug 
                      ? 'text-secondary-700 bg-primary-600 border-b-2 border-secondary-700' 
                      : 'text-secondary-600 hover:text-secondary-700 hover:bg-primary-400'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </Link>
              </div>
            ))}
            
            {/* All Categories Link */}
            <Link
              href="/pl/categories"
              className="px-4 py-3 text-sm font-bold text-secondary-600 hover:text-secondary-700 hover:bg-primary-400 rounded-md transition-all whitespace-nowrap ml-auto uppercase tracking-wide"
            >
              Wszystkie kategorie →
            </Link>
          </div>
        </div>
        
        {/* Mega Menu - Full width light theme */}
        {activeCategoryMenu && (
          <div 
            className="absolute left-0 right-0 bg-neutral-50 border-t-4 border-primary-500 shadow-2xl"
            style={{ zIndex: 9999 }}
            onMouseEnter={() => setActiveCategoryMenu(activeCategoryMenu)}
            onMouseLeave={() => setActiveCategoryMenu(null)}
          >
            <div className="container mx-auto p-6">
              {MAIN_CATEGORIES.filter(cat => cat.slug === activeCategoryMenu).map(category => (
                <div key={category.slug}>
                  <h3 className="text-lg font-bold text-secondary-700 mb-4 uppercase tracking-wide">{category.icon} {category.name}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {category.subcategories.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={`/pl/categories/${category.slug}/${sub.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}
                        className="text-sm text-secondary-600 hover:text-secondary-700 hover:bg-white px-3 py-2 rounded-md transition-all block border border-transparent hover:border-primary-400 font-medium"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <Link
                      href={`/pl/categories/${category.slug}`}
                      className="inline-block px-6 py-2 text-sm bg-primary-500 text-secondary-700 hover:bg-primary-600 rounded-lg font-bold uppercase tracking-wide transition-all"
                    >
                      Zobacz wszystkie w kategorii {category.name} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
