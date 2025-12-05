'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Category {
  name: string
  icon: string
  slug: string
  subcategories: string[]
}

const CATEGORIES: Category[] = [
  {
    name: 'Hydraulika',
    icon: 'HYD',
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
    ]
  },
  {
    name: 'Filtry',
    icon: 'FIL',
    slug: 'filtry-uszczelnienia',
    subcategories: [
      'Filtry powietrza',
      'Filtry paliwa',
      'Filtry oleju',
      'Filtry hydrauliczne',
      'O-ringi',
      'Uszczelki',
    ]
  },
  {
    name: 'Silnik',
    icon: 'ENG',
    slug: 'silnik-osprzet',
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
    icon: 'TRK',
    slug: 'podwozia-gasienice',
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
    icon: 'ELE',
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
    icon: 'ATT',
    slug: 'osprzet-roboczy',
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
    name: 'Normalia',
    icon: 'HRD',
    slug: 'normalia',
    subcategories: [
      'Śruby (M6-M42)',
      'Nakrętki',
      'Podkładki',
      'Kołki & Cwoki',
      'Pierścienie zabezpieczające',
      'Komplety & Zestawy',
    ]
  },
  {
    name: 'Więcej',
    icon: '...',
    slug: 'categories',
    subcategories: []
  },
]

export function HorizontalMegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="hidden md:block bg-white border-b border-neutral-200 relative">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-1">
          {CATEGORIES.map((category) => (
            <div
              key={category.slug}
              className="relative"
              onMouseEnter={() => setActiveCategory(category.slug)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link
                href={`/pl/categories/${category.slug}`}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                  activeCategory === category.slug
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs font-bold font-mono">
                  {category.icon}
                </span>
                <span>{category.name}</span>
                {category.subcategories.length > 0 && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>

              {/* Dropdown */}
              {activeCategory === category.slug && category.subcategories.length > 0 && (
                <div className="absolute left-0 top-full mt-0 bg-white border border-neutral-200 rounded-b-lg shadow-xl z-50 min-w-[280px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    {category.subcategories.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={`/pl/categories/${category.slug}/${sub.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        {sub}
                      </Link>
                    ))}
                    <div className="border-t border-neutral-200 mt-2 pt-2">
                      <Link
                        href={`/pl/categories/${category.slug}`}
                        className="block px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 font-semibold"
                      >
                        Zobacz wszystkie →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Right side links */}
          <div className="flex-1" />
          <Link href="/pl/o-nas" className="px-4 py-4 text-sm text-neutral-600 hover:text-primary-600 transition-colors">
            O nas
          </Link>
          <Link href="/pl/kontakt" className="px-4 py-4 text-sm text-neutral-600 hover:text-primary-600 transition-colors">
            Kontakt
          </Link>
          <Link href="/pl/faq" className="px-4 py-4 text-sm text-neutral-600 hover:text-primary-600 transition-colors">
            FAQ
          </Link>
        </nav>
      </div>
    </div>
  )
}
