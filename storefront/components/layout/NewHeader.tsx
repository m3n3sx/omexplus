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
    <header className="sticky top-0 z-50 bg-blue-700 text-white shadow-lg">
      {/* Top Bar */}
      <div className="bg-blue-900">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="hidden md:flex gap-4">
              <a href="tel:+48123456789" className="hover:text-orange-400 transition-colors">
                ☎ +48 123 456 789
              </a>
              <a href="mailto:kontakt@omex.pl" className="hover:text-orange-400 transition-colors">
                ✉ kontakt@omex.pl
              </a>
            </div>
            <div className="flex gap-4 items-center ml-auto">
              <span className="hidden sm:inline">Pn-Pt 8:00-18:00</span>
              <div className="flex gap-2">
                <button className="hover:text-orange-400 transition-colors font-semibold">PL</button>
                <span className="text-gray-300">|</span>
                <button className="hover:text-orange-400 transition-colors">EN</button>
                <span className="text-gray-300">|</span>
                <button className="hover:text-orange-400 transition-colors">DE</button>
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
          <Link href="/pl" className="text-2xl font-bold hover:text-orange-400 transition-colors">
            OMEX
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 flex-1 justify-center items-center" aria-label="Main navigation">
            <Link href="/pl/products" className="hover:text-orange-400 transition-colors font-medium">
              Produkty
            </Link>
            <Link href="/pl/o-nas" className="hover:text-orange-400 transition-colors font-medium">
              O nas
            </Link>
            <Link href="/pl/kontakt" className="hover:text-orange-400 transition-colors font-medium">
              Kontakt
            </Link>
            <Link href="/pl/faq" className="hover:text-orange-400 transition-colors font-medium">
              FAQ
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* User Menu */}
            {isAuthenticated && customer ? (
              <Link 
                href={`/${locale}/account`} 
                className="p-2 hover:text-orange-400 transition-colors flex items-center gap-2" 
                aria-label="Konto użytkownika"
              >
                <span className="text-xl">👤</span>
                <span className="hidden md:inline text-sm font-medium">{customer.first_name}</span>
              </Link>
            ) : (
              <Link 
                href={`/${locale}/account/login`} 
                className="p-2 hover:text-orange-400 transition-colors flex items-center gap-2" 
                aria-label="Zaloguj się"
              >
                <span className="text-xl">👤</span>
                <span className="hidden md:inline text-sm font-medium">Zaloguj</span>
              </Link>
            )}
            
            {/* Cart */}
            <Link 
              href={`/${locale}/cart`} 
              className="p-2 relative hover:text-orange-400 transition-colors" 
              aria-label={`Koszyk, ${itemCount} produkty`}
            >
              <span className="text-xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Category Bar - Horizontal menu with categories */}
      <div className="bg-white border-t border-gray-200">
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
                  className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 rounded-md ${
                    activeCategoryMenu === category.slug 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
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
              className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors whitespace-nowrap ml-auto"
            >
              Wszystkie kategorie →
            </Link>
          </div>
        </div>
        
        {/* Mega Menu - Outside the flex container */}
        {activeCategoryMenu && (
          <div 
            className="absolute left-0 right-0 bg-white border-t border-b border-gray-200 shadow-2xl"
            style={{ zIndex: 9999 }}
            onMouseEnter={() => setActiveCategoryMenu(activeCategoryMenu)}
            onMouseLeave={() => setActiveCategoryMenu(null)}
          >
            <div className="container mx-auto p-6">
              {MAIN_CATEGORIES.filter(cat => cat.slug === activeCategoryMenu).map(category => (
                <div key={category.slug}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{category.icon} {category.name}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {category.subcategories.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={`/pl/categories/${category.slug}/${sub.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}
                        className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors block"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      href={`/pl/categories/${category.slug}`}
                      className="text-sm text-blue-600 font-semibold hover:text-blue-700"
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
