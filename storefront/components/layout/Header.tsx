'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useCurrency } from '@/contexts/CurrencyContext'
import { CategoryNavigation } from './CategoryNavigation'

export function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { currency, setCurrency } = useCurrency()
  
  const [cartCount] = useState(0)
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

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-neutral-800">
        <div className="bg-white text-neutral-700 border-b border-neutral-200">
          <div className="container mx-auto px-4 lg:px-12 max-w-[1400px]">
            <div className="flex items-center justify-between h-10 text-xs">
              <div className="top-bar__contact flex items-center gap-6">
                <a href="tel:+48500169060" className="top-bar__phone flex items-center gap-1.5 hover:text-secondary-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +48 500 169 060
                </a>
                <a href="mailto:omexplus@gmail.com" className="top-bar__email flex items-center gap-1.5 hover:text-secondary-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  omexplus@gmail.com
                </a>
              </div>

              <div className="top-bar__selectors flex items-center gap-4">
                <div className="language-selector relative">
                  <button 
                    onClick={() => {
                      setShowLanguageMenu(!showLanguageMenu)
                      setShowCurrencyMenu(false)
                    }}
                    className="language-selector__trigger flex items-center gap-1 hover:text-secondary-500 transition-colors"
                  >
                    {currentLanguage.flag} {currentLanguage.name}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showLanguageMenu && (
                    <div className="language-selector__dropdown absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 min-w-[150px] z-50">
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

                <div className="currency-selector relative">
                  <button 
                    onClick={() => {
                      setShowCurrencyMenu(!showCurrencyMenu)
                      setShowLanguageMenu(false)
                    }}
                    className="currency-selector__trigger flex items-center gap-1 hover:text-secondary-500 transition-colors"
                  >
                    {currentCurrency.code}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showCurrencyMenu && (
                    <div className="currency-selector__dropdown absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 min-w-[120px] z-50">
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

              <div className="top-bar__actions flex items-center gap-6">
                <Link href={`/${locale}/faq`} className="top-bar__faq hover:text-secondary-500 transition-colors flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  FAQ
                </Link>
                <Link href={`/${locale}/tracking`} className="top-bar__tracking flex items-center gap-1.5 hover:text-secondary-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  TRACK PACKAGE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-header w-full" style={{ backgroundColor: '#FFAA21' }}>
        <div className="mx-auto px-6 lg:px-12 max-w-[1400px]">
          <div className="main-header__content flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="main-header__logo flex items-center">
              <span className="text-3xl font-bold text-neutral-900 tracking-wider">OMEX</span>
            </Link>

            <CategoryNavigation />

            <nav className="main-nav hidden lg:flex items-center gap-1">
              <span className="nav__separator text-neutral-900 text-lg font-light px-2">/</span>
              <Link href={`/${locale}/about`} className="nav-item text-neutral-900 font-bold hover:text-neutral-700 transition-colors px-4 py-2 text-sm uppercase">
                ABOUT
              </Link>
              <span className="nav__separator text-neutral-900 text-lg font-light px-2">/</span>
              <Link href={`/${locale}/promotions`} className="nav-item text-neutral-900 font-bold hover:text-neutral-700 transition-colors px-4 py-2 text-sm uppercase">
                PROMOTIONS
              </Link>
              <span className="nav__separator text-neutral-900 text-lg font-light px-2">/</span>
              <Link href={`/${locale}/contact`} className="nav-item text-neutral-900 font-bold hover:text-neutral-700 transition-colors px-4 py-2 text-sm uppercase">
                CONTACT
              </Link>
            </nav>

            <div className="main-header__actions flex items-center gap-4">
              <Link href={`/${locale}/login`} className="main-header__account text-neutral-900 hover:text-neutral-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href={`/${locale}/cart`} className="main-header__cart relative text-neutral-900 hover:text-neutral-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="main-header__cart-badge absolute -top-2 -right-2 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
