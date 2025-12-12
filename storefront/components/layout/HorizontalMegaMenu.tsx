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
    <div className="hidden md:block bg-primary-500 border-b border-primary-600 relative">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-1">
          {CATEGORIES.map((category, index) => (
            <div key={`cat-${category.slug}`} className="flex items-center">
              <div
                className="relative"
                onMouseEnter={() => setActiveCategory(category.slug)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={`/pl/categories/${category.slug}`}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-bold transition-all uppercase tracking-wide ${
                    activeCategory === category.slug
                      ? 'text-secondary-700 bg-primary-600'
                      : 'text-secondary-600 hover:text-secondary-700 hover:bg-primary-400'
                  }`}
                >
                  <span className="px-2 py-0.5 bg-primary-600 border border-primary-700 text-secondary-700 rounded text-xs font-bold font-mono">
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                  {category.subcategories.length > 0 && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown - Full width on dark theme */}
                {activeCategory === category.slug && category.subcategories.length > 0 && (
                  <div className="fixed left-0 right-0 top-[calc(100%+1px)] bg-neutral-50 border-t-4 border-primary-500 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="container mx-auto p-6">
                      <div className="grid grid-cols-3 gap-4">
                        {category.subcategories.map((sub, idx) => (
                          <Link
                            key={idx}
                            href={`/pl/categories/${category.slug}/${sub.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}
                            className="block px-4 py-3 text-sm text-secondary-600 hover:bg-white hover:text-secondary-700 rounded-lg border border-transparent hover:border-primary-400 transition-all font-medium"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-neutral-200 mt-4 pt-4">
                        <Link
                          href={`/pl/categories/${category.slug}`}
                          className="inline-block px-6 py-2 text-sm bg-primary-500 text-secondary-700 hover:bg-primary-600 rounded-lg font-bold uppercase tracking-wide transition-all"
                        >
                          Zobacz wszystkie w kategorii {category.name} →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {index < CATEGORIES.length - 1 && (
                <span className="text-primary-700 mx-1">/</span>
              )}
            </div>
          ))}

          {/* Right side links */}
          <div className="flex-1" />
          <Link href="/pl/o-nas" className="px-4 py-4 text-sm text-secondary-600 hover:text-secondary-700 transition-colors font-semibold uppercase tracking-wide">
            O nas
          </Link>
          <span className="text-primary-700 self-center">/</span>
          <Link href="/pl/kontakt" className="px-4 py-4 text-sm text-secondary-600 hover:text-secondary-700 transition-colors font-semibold uppercase tracking-wide">
            Kontakt
          </Link>
          <span className="text-primary-700 self-center">/</span>
          <Link href="/pl/faq" className="px-4 py-4 text-sm text-secondary-600 hover:text-secondary-700 transition-colors font-semibold uppercase tracking-wide">
            FAQ
          </Link>
        </nav>
      </div>
    </div>
  )
}
