'use client'

/**
 * CategoryMegaMenu - Pełna struktura menu kategorii IP PARTS
 * Hierarchiczne menu z wszystkimi kategoriami i podkategoriami
 */

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

interface CategoryMegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function CategoryMegaMenu({ isOpen, onClose }: CategoryMegaMenuProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories')

  if (!isOpen) return null

  return (
    <div
      className="absolute left-0 right-0 top-full mt-2 bg-neutral-900 border border-neutral-700 shadow-2xl rounded-lg"
      style={{ zIndex: 100 }}
      onMouseLeave={onClose}
    >
      {/* Gold accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-secondary-500 to-transparent rounded-t-lg"></div>
      
      <div className="container mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-neutral-700">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-bold uppercase tracking-wide text-sm transition-all ${
              activeTab === 'categories'
                ? 'text-secondary-500 border-b-2 border-secondary-500'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Kategorie Produktów
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-6 py-3 font-bold uppercase tracking-wide text-sm transition-all ${
              activeTab === 'brands'
                ? 'text-secondary-500 border-b-2 border-secondary-500'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Części wg Marek
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
                    className="flex items-center gap-2 text-base font-bold text-secondary-500 hover:text-secondary-400 transition-colors group"
                    onClick={onClose}
                  >
                    <span className="px-2 py-1 bg-neutral-800 border border-neutral-700 text-secondary-500 rounded font-mono text-xs font-bold group-hover:border-secondary-500 transition-colors">
                      {category.icon}
                    </span>
                    <div>
                      <div className="uppercase tracking-wide text-sm">{category.name}</div>
                      {category.priority && (
                        <div className="text-xs text-neutral-500 font-normal">
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
                          className="text-sm text-neutral-400 hover:text-secondary-500 transition-colors block"
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
                          className="text-sm text-secondary-500 hover:text-secondary-400 font-bold uppercase tracking-wide"
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

            <div className="mt-6 pt-6 border-t border-neutral-700">
              <div className="flex justify-between items-center">
                <div className="text-sm text-neutral-400">
                  <strong className="text-neutral-200">{CATEGORIES.length} kategorii głównych</strong> • 200+ podkategorii • 50,000+ części
                </div>
                <Link
                  href="/pl/categories"
                  className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg text-sm font-bold hover:border-secondary-500 hover:text-secondary-500 transition-all uppercase tracking-wide"
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
                  className="group flex items-center gap-3 p-4 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-secondary-500 hover:shadow-lg hover:shadow-secondary-500/10 transition-all"
                  onClick={onClose}
                >
                  <span className="px-3 py-2 bg-neutral-900 border border-neutral-700 text-secondary-500 rounded font-mono text-sm font-bold group-hover:border-secondary-500 transition-colors">
                    {brand.icon}
                  </span>
                  <span className="text-base font-bold text-neutral-100 group-hover:text-secondary-500 transition-colors uppercase tracking-wide">{brand.name}</span>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-700">
              <div className="text-center text-sm text-neutral-400">
                <strong className="text-neutral-200">Części oryginalne i zamienniki</strong> do wszystkich popularnych marek maszyn budowlanych
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
