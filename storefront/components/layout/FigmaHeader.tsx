'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useCurrency } from '@/contexts/CurrencyContext'

export function FigmaHeader() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { currency, setCurrency } = useCurrency()
  
  const [cartCount] = useState(0)
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false)

  const languages = [
    { code: 'pl', name: 'POLISH', flag: '🇵🇱' },
    { code: 'en', name: 'ENGLISH', flag: '🇬🇧' },
    { code: 'de', name: 'DEUTSCH', flag: '🇩🇪' },
    { code: 'uk', name: 'УКРАЇНСЬКА', flag: '🇺🇦' }
  ]

  const currencies = [
    { code: 'PLN', symbol: 'zł' },
    { code: 'EUR', symbol: '€' },
    { code: 'USD', symbol: '$' },
    { code: 'GBP', symbol: '£' },
    { code: 'UAH', symbol: '₴' }
  ]

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]
  const currentCurrency = currencies.find(curr => curr.code === currency) || currencies[0]

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, '')
    router.push(`/${newLocale}${currentPath || '/'}`)
    setShowLanguageMenu(false)
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    setShowCurrencyMenu(false)
  }

  const categories = [
    { name: 'Hydraulika', href: `/${locale}/categories/hydraulika` },
    { name: 'Filtry', href: `/${locale}/categories/filtry` },
    { name: 'Silniki', href: `/${locale}/categories/silniki` },
    { name: 'Podwozie', href: `/${locale}/categories/podwozie` },
    { name: 'Elektryka', href: `/${locale}/categories/elektryka` },
    { name: 'Kabina', href: `/${locale}/categories/kabina` },
    { name: 'Osprzęt', href: `/${locale}/categories/osprzet` }
  ]

  return (
    <header className="sticky top-0 z-50">
      {/* Dark Background Section */}
      <div className="bg-neutral-800">
        {/* Top Bar - biały */}
        <div className="bg-white text-neutral-700 border-b border-neutral-200">
          <div className="container mx-auto px-4 lg:px-12 max-w-[1400px]">
            <div className="flex items-center justify-between h-10 text-xs">
              {/* Lewa strona - kontakt */}
            <div className="flex items-center gap-6">
              <a href="tel:+48500169060" className="flex items-center gap-1.5 hover:text-secondary-500 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +48 500 169 060
              </a>
              <a href="mailto:omexplus@gmail.com" className="flex items-center gap-1.5 hover:text-secondary-500 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                omexplus@gmail.com
              </a>
            </div>

            {/* Środek - język i waluta */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowLanguageMenu(!showLanguageMenu)
                    setShowCurrencyMenu(false)
                  }}
                  className="flex items-center gap-1 hover:text-secondary-500 transition-colors"
                >
                  {currentLanguage.flag} {currentLanguage.name}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showLanguageMenu && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 min-w-[150px] z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                          locale === lang.code
                            ? 'bg-secondary-50 text-secondary-600'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowCurrencyMenu(!showCurrencyMenu)
                    setShowLanguageMenu(false)
                  }}
                  className="flex items-center gap-1 hover:text-secondary-500 transition-colors"
                >
                  {currentCurrency.code}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCurrencyMenu && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 min-w-[120px] z-50">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencyChange(curr.code)}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          currency === curr.code
                            ? 'bg-secondary-50 text-secondary-600'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {curr.code} ({curr.symbol})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Prawa strona - FAQ i śledzenie */}
            <div className="flex items-center gap-6">
              <Link href={`/${locale}/faq`} className="hover:text-secondary-500 transition-colors flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQ
              </Link>
              <Link href={`/${locale}/tracking`} className="flex items-center gap-1.5 hover:text-secondary-500 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ŚLEDŹ PACZKĘ
              </Link>
            </div>
          </div>
        </div>
      </div>

        {/* Main Header - żółty */}
        <div className="bg-yellow-400 w-full" style={{ backgroundColor: '#FFAA21' }}>
          <div className="mx-auto px-6 lg:px-12 max-w-[1400px]">
            <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center">
              <span className="text-3xl font-bold text-neutral-900 tracking-wider">OMEX</span>
            </Link>

            {/* Navigation - środek */}
            <nav className="hidden lg:flex items-center gap-1">
              <div className="relative">
                <button
                  onMouseEnter={() => setShowMegaMenu(true)}
                  onMouseLeave={() => setShowMegaMenu(false)}
                  className="flex items-center gap-1 text-neutral-900 font-bold hover:text-neutral-700 transition-colors px-4 py-2 text-sm uppercase"
                >
                  PRODUKTY
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Mega Menu Dropdown */}
                {showMegaMenu && (
                  <div 
                    className="absolute top-full left-0 mt-0 bg-white rounded-b-lg shadow-2xl border-t-4 border-secondary-600 py-6 min-w-[600px] z-50"
                    onMouseEnter={() => setShowMegaMenu(true)}
                    onMouseLeave={() => setShowMegaMenu(false)}
                  >
                    <div className="grid grid-cols-2 gap-2 px-6">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="px-4 py-3 text-sm font-semibold text-neutral-700 hover:text-secondary-600 hover:bg-neutral-50 rounded transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-neutral-200 mt-4 pt-4 px-6">
                      <Link
                        href={`/${locale}/products`}
                        className="inline-block px-6 py-2.5 text-sm text-white bg-secondary-500 hover:bg-secondary-600 font-bold transition-all rounded"
                      >
                        Zobacz wszystkie produkty →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-neutral-900 text-lg font-light px-2">/</span>
              <Link href={`/${locale}/o-nas`} className="text-neutral-900 font-bold hover:text-neutral-700 transition-colors px-4 py-2 text-sm uppercase">
                O NAS
              </Link>
              <span className="text-neutral-900 text-lg font-light px-2">/</span>
              <Link href={`/${locale}/promocje`} className="text-neutral-900 font-bold hover:text-neutral-700 transition-colors px-4 py-2 text-sm uppercase">
                PROMOCJE
              </Link>
              <span className="text-neutral-900 text-lg font-light px-2">/</span>
              <Link href={`/${locale}/kontakt`} className="text-neutral-900 font-bold hover:text-neutral-700 transition-colors px-4 py-2 text-sm uppercase">
                KONTAKT
              </Link>
            </nav>

            {/* Icons - prawa strona */}
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/logowanie`} className="text-neutral-900 hover:text-neutral-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href={`/${locale}/checkout`} className="relative text-neutral-900 hover:text-neutral-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
