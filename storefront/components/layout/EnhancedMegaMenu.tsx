'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Category {
  name: string
  icon: string
  slug: string
  priority?: '⭐⭐⭐' | '⭐⭐' | '⭐'
  salesPercent?: string
  subcategories: string[]
}

const CATEGORIES: Category[] = [
  {
    name: 'Hydraulika & Osprzęt',
    icon: 'HYD',
    slug: 'hydraulika',
    priority: '⭐⭐⭐',
    salesPercent: '40%',
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
    name: 'Filtry & Uszczelnienia',
    icon: 'FIL',
    slug: 'filtry-uszczelnienia',
    priority: '⭐⭐⭐',
    salesPercent: '35%',
    subcategories: [
      'Filtry powietrza',
      'Filtry paliwa',
      'Filtry oleju',
      'Filtry hydrauliczne HF',
      'Filtry hydrauliczne HG',
      'Filtry hydrauliczne HH',
      'O-ringi',
      'Pierścienie tłokowe',
      'Uszczelki głowicy',
      'Uszczelki wałów',
      'Komplety uszczelniające',
    ]
  },
  {
    name: 'Silnik & Osprzęt',
    icon: 'ENG',
    slug: 'silnik-osprzet',
    priority: '⭐⭐',
    salesPercent: '15%',
    subcategories: [
      'Silniki spalinowe',
      'Turbosprężarki',
      'Filtry powietrza',
      'Układ paliwowy',
      'Filtry oleju & Serwis',
      'Układ chłodzenia',
      'Układ rozruchowy',
      'Paski & Łańcuchy',
    ]
  },
  {
    name: 'Podwozia & Gąsienice',
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
    name: 'Skrzynia Biegów',
    icon: 'GBX',
    slug: 'skrzynia-biegow',
    subcategories: [
      'Skrzynia biegów',
      'Reduktory & Zwolnice',
      'Sprzęgła',
      'Wałki napędowe',
      'Differencial',
    ]
  },
  {
    name: 'Elektryka & Elektronika',
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
    name: 'Element Obrotu',
    icon: 'ROT',
    slug: 'element-obrotu',
    subcategories: [
      'Pierścienie obrotu',
      'Zęby obrotu',
      'Ramiona wysięgnika',
      'Ramiona ładowcze',
      'Systemy połączeń',
    ]
  },
  {
    name: 'Osprzęt Roboczy',
    icon: 'ATT',
    slug: 'osprzet-roboczy',
    priority: '⭐⭐',
    salesPercent: '5%',
    subcategories: [
      'Łyżki standardowe',
      'Łyżki wzmocnione',
      'Młoty hydrauliczne',
      'Wiertła & Narzędzia',
      'Kompaktory',
      'Haki & Uchwyty',
      'Magnesy',
    ]
  },
  {
    name: 'Nadwozie & Oprawa',
    icon: 'CAB',
    slug: 'nadwozie',
    subcategories: [
      'Kabiny & Drzwi',
      'Szyby & Prościce',
      'Osłony & Osłonki',
      'Wnętrze kabiny',
      'Uchwyty & Wsporniki',
    ]
  },
  {
    name: 'Normalia Warsztatowe',
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
    name: 'Wtryski & Systemy Paliwowe',
    icon: 'INJ',
    slug: 'wtryski',
    subcategories: [
      'Wtryski paliwowe',
      'Pompy paliwowe',
      'Filtry paliwa',
      'Przewody & Złączki',
      'Zbiorniki paliwa',
      'Czujniki',
    ]
  },
  {
    name: 'Układ Hamulcowy',
    icon: 'BRK',
    slug: 'uklad-hamulcowy',
    subcategories: [
      'Klocki hamulcowe',
      'Tarcze hamulcowe',
      'Cylindry hamulkowe',
      'Siłowniki hamulcowe',
      'Przewody hamulcowe',
      'Płyn hamulcowy',
    ]
  },
  {
    name: 'Czujniki & Sterowanie',
    icon: 'SEN',
    slug: 'czujniki',
    subcategories: [
      'Czujniki pozycji',
      'Czujniki ciśnienia',
      'Czujniki temperatury',
      'Czujniki obrotów',
      'Czujniki poziomu',
      'Przełączniki',
      'Moduły elektroniki',
    ]
  },
  {
    name: 'Akcesoria',
    icon: 'ACC',
    slug: 'akcesoria',
    subcategories: [
      'Lampy ostrzegawcze',
      'Sterowniki & Manetki',
      'Wyłączniki bezpieczeństwa',
      'Pasy bezpieczeństwa',
      'Uchwyty & Wsporniki',
      'Dodatkowe wyposażenie',
    ]
  },
]

const BRAND_CATEGORIES = [
  { name: 'CAT (Caterpillar)', icon: 'CAT', slug: 'cat' },
  { name: 'KOMATSU', icon: 'KOM', slug: 'komatsu' },
  { name: 'HITACHI', icon: 'HIT', slug: 'hitachi' },
  { name: 'VOLVO', icon: 'VOL', slug: 'volvo' },
  { name: 'JCB', icon: 'JCB', slug: 'jcb' },
  { name: 'KOBELCO', icon: 'KOB', slug: 'kobelco' },
  { name: 'HYUNDAI', icon: 'HYU', slug: 'hyundai' },
  { name: 'BOBCAT', icon: 'BOB', slug: 'bobcat' },
  { name: 'DOOSAN', icon: 'DOO', slug: 'doosan' },
]

interface EnhancedMegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function EnhancedMegaMenu({ isOpen, onClose }: EnhancedMegaMenuProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories')

  if (!isOpen) return null

  return (
    <div
      className="absolute left-0 right-0 top-full mt-2 bg-neutral-50 border-t-4 border-primary-500 shadow-2xl rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
      style={{ zIndex: 100 }}
      onMouseLeave={onClose}
    >
      
      <div className="container mx-auto p-8">
        {/* Tabs - Light theme */}
        <div className="flex gap-4 mb-8 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-bold uppercase tracking-wide text-sm transition-all ${
              activeTab === 'categories'
                ? 'text-secondary-700 border-b-2 border-primary-500'
                : 'text-secondary-600 hover:text-secondary-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Kategorie Produktów
            </div>
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-6 py-3 font-bold uppercase tracking-wide text-sm transition-all ${
              activeTab === 'brands'
                ? 'text-secondary-700 border-b-2 border-primary-500'
                : 'text-secondary-600 hover:text-secondary-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Części wg Marek
            </div>
          </button>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="grid grid-cols-4 gap-6 max-h-[600px] overflow-y-auto">
              {CATEGORIES.map((category) => (
                <div key={category.slug} className="space-y-3">
                  <Link
                    href={`/pl/categories/${category.slug}`}
                    className="flex items-center gap-2 text-base font-bold text-secondary-700 hover:text-secondary-800 transition-colors group"
                    onClick={onClose}
                  >
                    <span className="px-2 py-1 bg-primary-500 border border-primary-600 text-secondary-700 rounded font-mono text-xs font-bold group-hover:border-primary-700 transition-colors">
                      {category.icon}
                    </span>
                    <div>
                      <div className="uppercase tracking-wide text-sm">{category.name}</div>
                      {category.priority && (
                        <div className="text-xs text-secondary-500 font-normal">
                          {category.priority} {category.salesPercent && `• ${category.salesPercent}`}
                        </div>
                      )}
                    </div>
                  </Link>
                  <ul className="space-y-2 ml-8">
                    {category.subcategories.slice(0, 8).map((sub, idx) => (
                      <li key={idx}>
                        <Link
                          href={`/pl/categories/${category.slug}/${sub.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}
                          className="text-sm text-secondary-600 hover:text-secondary-700 hover:bg-white px-2 py-1 rounded transition-colors block"
                          onClick={onClose}
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                    {category.subcategories.length > 8 && (
                      <li>
                        <Link
                          href={`/pl/categories/${category.slug}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-bold uppercase tracking-wide"
                          onClick={onClose}
                        >
                          + {category.subcategories.length - 8} więcej →
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-secondary-600">
                  <strong className="text-secondary-700">{CATEGORIES.length} kategorii głównych</strong> • 200+ podkategorii • 50,000+ części
                </div>
                <Link
                  href="/pl/categories"
                  className="px-4 py-2 bg-primary-500 border border-primary-600 text-secondary-700 rounded-lg text-sm font-bold hover:bg-primary-600 transition-all uppercase tracking-wide"
                  onClick={onClose}
                >
                  Zobacz wszystkie →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <div>
            <div className="grid grid-cols-3 gap-6">
              {BRAND_CATEGORIES.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/pl/brands/${brand.slug}`}
                  className="group flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-lg hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all"
                  onClick={onClose}
                >
                  <span className="px-3 py-2 bg-primary-500 border border-primary-600 text-secondary-700 rounded font-mono text-sm font-bold group-hover:border-primary-700 transition-colors">
                    {brand.icon}
                  </span>
                  <span className="text-base font-bold text-secondary-700 group-hover:text-secondary-800 transition-colors uppercase tracking-wide">{brand.name}</span>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="text-center text-sm text-secondary-600">
                <strong className="text-secondary-700">Części oryginalne i zamienniki</strong> do wszystkich popularnych marek maszyn budowlanych
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
