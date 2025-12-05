'use client'

import Link from 'next/link'
import { useState } from 'react'
import { OmexLogo } from './OmexLogo'

export function FigmaHeader() {
  const [cartCount] = useState(0)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [
    {
      id: 'hydraulika',
      name: 'Hydraulika',
      subcategories: [
        { name: 'Pompy hydrauliczne', href: '/pl/categories/pompy-hydrauliczne' },
        { name: 'Cylindry hydrauliczne', href: '/pl/categories/cylindry-hydrauliczne' },
        { name: 'Zawory hydrauliczne', href: '/pl/categories/zawory-hydrauliczne' },
        { name: 'Węże i przewody', href: '/pl/categories/weze-przewody' },
        { name: 'Złącza hydrauliczne', href: '/pl/categories/zlacza-hydrauliczne' },
      ]
    },
    {
      id: 'filtry',
      name: 'Filtry & Uszczelnienia',
      subcategories: [
        { name: 'Filtry oleju', href: '/pl/categories/filtry-oleju' },
        { name: 'Filtry paliwa', href: '/pl/categories/filtry-paliwa' },
        { name: 'Filtry powietrza', href: '/pl/categories/filtry-powietrza' },
        { name: 'Uszczelki', href: '/pl/categories/uszczelki' },
        { name: 'O-ringi', href: '/pl/categories/o-ringi' },
      ]
    },
    {
      id: 'silnik',
      name: 'Silnik & Osprzęt',
      subcategories: [
        { name: 'Tłoki i pierścienie', href: '/pl/categories/tloki-pierscienie' },
        { name: 'Wały korbowe', href: '/pl/categories/waly-korbowe' },
        { name: 'Głowice silnika', href: '/pl/categories/glowice-silnika' },
        { name: 'Turbosprężarki', href: '/pl/categories/turbosprezarki' },
        { name: 'Chłodnice', href: '/pl/categories/chlodnice' },
      ]
    },
    {
      id: 'podwozie',
      name: 'Podwozie & Gąsienice',
      subcategories: [
        { name: 'Gąsienice gumowe', href: '/pl/categories/gasienice-gumowe' },
        { name: 'Gąsienice stalowe', href: '/pl/categories/gasienice-stalowe' },
        { name: 'Rolki podtrzymujące', href: '/pl/categories/rolki-podtrzymujace' },
        { name: 'Koła napędowe', href: '/pl/categories/kola-napedowe' },
        { name: 'Koła napinające', href: '/pl/categories/kola-napinajace' },
      ]
    },
    {
      id: 'elektryka',
      name: 'Elektryka',
      subcategories: [
        { name: 'Alternatory', href: '/pl/categories/alternatory' },
        { name: 'Rozruszniki', href: '/pl/categories/rozruszniki' },
        { name: 'Akumulatory', href: '/pl/categories/akumulatory' },
        { name: 'Czujniki', href: '/pl/categories/czujniki' },
        { name: 'Wiązki elektryczne', href: '/pl/categories/wiazki-elektryczne' },
      ]
    },
    {
      id: 'kabina',
      name: 'Kabina & Komfort',
      subcategories: [
        { name: 'Fotele operatora', href: '/pl/categories/fotele-operatora' },
        { name: 'Szyby kabiny', href: '/pl/categories/szyby-kabiny' },
        { name: 'Klimatyzacja', href: '/pl/categories/klimatyzacja' },
        { name: 'Lusterka', href: '/pl/categories/lusterka' },
        { name: 'Oświetlenie kabiny', href: '/pl/categories/oswietlenie-kabiny' },
      ]
    },
    {
      id: 'oswietlenie',
      name: 'Oświetlenie',
      subcategories: [
        { name: 'Reflektory LED', href: '/pl/categories/reflektory-led' },
        { name: 'Lampy robocze', href: '/pl/categories/lampy-robocze' },
        { name: 'Światła ostrzegawcze', href: '/pl/categories/swiatla-ostrzegawcze' },
        { name: 'Żarówki', href: '/pl/categories/zarowki' },
      ]
    },
    {
      id: 'narzedzia',
      name: 'Narzędzia & Akcesoria',
      subcategories: [
        { name: 'Łyżki', href: '/pl/categories/lyzki' },
        { name: 'Młoty hydrauliczne', href: '/pl/categories/mloty-hydrauliczne' },
        { name: 'Chwytaki', href: '/pl/categories/chwytaki' },
        { name: 'Szybkozłącza', href: '/pl/categories/szybkozlacza' },
        { name: 'Zęby łyżek', href: '/pl/categories/zeby-lyzek' },
      ]
    },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top Navbar */}
      <div className="bg-gradient-to-r from-[#0554F2] to-[#1675F2] border-b border-[#1B8EF2]">
        <div className="container mx-auto px-4 md:px-[60px]">
          <div className="flex items-center justify-between h-12">
            {/* Left: Language & Currency */}
            <div className="flex items-center gap-6 text-[12px] font-bold text-white">
              <button className="hover:text-[#22A2F2] transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Polski
              </button>
              <button className="hover:text-[#22A2F2] transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                PLN
              </button>
            </div>

            {/* Right: Contact Info */}
            <div className="hidden md:flex items-center gap-8 text-[12px] font-semibold text-white">
              <a href="tel:+48123456789" className="flex items-center gap-2 hover:text-[#22A2F2] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +48 123 456 789
              </a>
              <a href="mailto:kontakt@omex.pl" className="flex items-center gap-2 hover:text-[#22A2F2] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                kontakt@omex.pl
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white border-b-2 border-[#E8F4FE]">
        <div className="container mx-auto px-4 md:px-[60px]">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/pl" className="transition-opacity hover:opacity-80">
              <OmexLogo variant="full" size="md" />
            </Link>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center gap-6 flex-1 ml-12">
              <Link href="/pl/tracking" className="font-bold text-[13px] text-neutral-700 hover:text-[#1675F2] transition-colors px-3 py-2 rounded-lg hover:bg-[#E8F4FE] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Śledzenie paczki
              </Link>
              <Link href="/pl/faq" className="font-bold text-[13px] text-neutral-700 hover:text-[#1675F2] transition-colors px-3 py-2 rounded-lg hover:bg-[#E8F4FE] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQ
              </Link>
              <Link href="/pl/o-nas" className="font-bold text-[13px] text-neutral-700 hover:text-[#1675F2] transition-colors px-3 py-2 rounded-lg hover:bg-[#E8F4FE] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                O nas
              </Link>
              <Link href="/pl/kontakt" className="font-bold text-[13px] text-neutral-700 hover:text-[#1675F2] transition-colors px-3 py-2 rounded-lg hover:bg-[#E8F4FE] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Kontakt
              </Link>
              <Link href="/pl/promocje" className="font-bold text-[13px] text-neutral-900 bg-[#F2B90C] px-4 py-2 rounded-xl transition-colors flex items-center gap-2 hover:bg-[#d9a50b]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Promocje
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              {/* User */}
              <Link href="/pl/logowanie" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#E8F4FE] text-[#1675F2] hover:bg-[#1675F2] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              {/* Cart */}
              <Link href="/pl/cart" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#E8F4FE] text-[#1675F2] hover:bg-[#1675F2] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#1675F2] to-[#22A2F2] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Mega Menu */}
      <div className="bg-gradient-to-r from-[#F2F2F2] to-[#E8F4FE] border-b-2 border-[#D4EBFC]">
        <div className="container mx-auto px-4 md:px-[60px] relative">
          <nav className="flex items-center gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button 
                  className={`px-4 py-3 text-[13px] font-bold transition-colors whitespace-nowrap rounded-xl ${
                    activeCategory === category.id 
                      ? 'text-white bg-gradient-to-r from-[#1675F2] to-[#22A2F2]' 
                      : 'text-neutral-700 hover:text-[#1675F2] hover:bg-white'
                  }`}
                >
                  {category.name}
                </button>

                {/* Mega Menu Dropdown */}
                {activeCategory === category.id && (
                  <div 
                    className="absolute left-0 top-full z-[9999] pointer-events-auto"
                    style={{ marginTop: '8px' }}
                    onMouseEnter={() => setActiveCategory(category.id)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <div className="bg-white border-2 border-[#1B8EF2] rounded-2xl py-3 min-w-[260px]">
                      {category.subcategories.map((sub, idx) => (
                        <Link
                          key={idx}
                          href={sub.href}
                          className="block px-5 py-2.5 text-[13px] font-semibold text-neutral-700 hover:bg-[#E8F4FE] hover:text-[#1675F2] transition-colors rounded-lg mx-2"
                        >
                          {sub.name}
                        </Link>
                      ))}
                      <div className="border-t-2 border-[#E8F4FE] mt-2 pt-2 mx-2">
                        <Link
                          href={`/pl/categories/${category.id}`}
                          className="block px-5 py-2.5 text-[13px] text-white bg-gradient-to-r from-[#1675F2] to-[#22A2F2] hover:from-[#0554F2] hover:to-[#1675F2] font-bold rounded-xl transition-colors text-center"
                        >
                          Zobacz wszystkie →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
