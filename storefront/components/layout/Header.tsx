'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useAuth } from '@/contexts/AuthContext'
import { useCartContext } from '@/contexts/CartContext'
import { CategoryNavigation } from './CategoryNavigation'

export function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { currency, setCurrency } = useCurrency()
  const { customer, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCartContext()
  
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const languages = [
    { code: 'pl', name: 'POLSKI', flag: '🇵🇱' },
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

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
    router.push(`/${locale}`)
  }

  // Get user's first name for greeting
  const userName = customer?.first_name || customer?.email?.split('@')[0] || 'Użytkownik'

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-white text-neutral-700 border-b border-neutral-200">
        <div className="container mx-auto px-4 lg:px-12 max-w-[1400px]">
          <div className="flex items-center justify-between h-10 text-xs font-semibold">
            <div className="top-bar__contact flex items-center gap-4">
              {/* Animated phone badge - primary */}
              <a href="tel:+48505039525" className="inline-flex items-center gap-2 bg-primary-500 text-white px-3 py-1 rounded-full hover:bg-primary-600 transition-all hover:scale-105">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-bold">+48 505 039 525</span>
              </a>
              <a href="mailto:czesci.omex@gmail.com" className="top-bar__email flex items-center gap-1.5 hover:text-primary-500 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                czesci.omex@gmail.com
              </a>
              {/* Secondary phone */}
              <a href="tel:+48500169060" className="inline-flex items-center gap-2 bg-primary-500 text-white px-3 py-1 rounded-full hover:bg-primary-600 transition-all hover:scale-105">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-bold">+48 500 169 060</span>
              </a>
              <a href="mailto:omexplus@gmail.com" className="top-bar__email flex items-center gap-1.5 hover:text-primary-500 transition-colors">
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
                    setShowUserMenu(false)
                  }}
                  className="language-selector__trigger flex items-center gap-1 hover:text-primary-500 transition-colors"
                >
                  {currentLanguage.flag} {currentLanguage.name}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showLanguageMenu && (
                  <div className="language-selector__dropdown absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 min-w-[150px] z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left text-sm font-semibold flex items-center gap-2 transition-colors ${
                          locale === lang.code
                            ? 'bg-primary-50 text-primary-600'
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
                    setShowUserMenu(false)
                  }}
                  className="currency-selector__trigger flex items-center gap-1 hover:text-primary-500 transition-colors"
                >
                  {currentCurrency.code}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCurrencyMenu && (
                  <div className="currency-selector__dropdown absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 min-w-[120px] z-50">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencyChange(curr.code)}
                        className={`w-full px-4 py-2 text-left text-sm font-semibold transition-colors ${
                          currency === curr.code
                            ? 'bg-primary-50 text-primary-600'
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
          </div>
        </div>
      </div>

      {/* Main Header - Induxter Orange Style with Glass Effect */}
      <div className="main-header w-full bg-primary-500/90 backdrop-blur-md">
        <div className="mx-auto px-6 lg:px-12 max-w-[1400px]">
          <div className="main-header__content flex items-center h-16">
            <Link href={`/${locale}`} className="main-header__logo flex items-center mr-8">
              <span className="text-3xl font-bold text-white tracking-wider font-heading">OMEX</span>
            </Link>

            {/* Main Navigation - aligned left with equal spacing */}
            <nav className="main-menu hidden lg:flex items-center">
              <CategoryNavigation />
              <span className="main-menu__separator text-white/50 text-lg font-light px-3">/</span>
              <Link href={`/${locale}/o-nas`} className="main-menu__item text-white font-bold hover:text-secondary-700 transition-colors px-3 py-2 text-sm uppercase font-heading">
                O NAS
              </Link>
              <span className="main-menu__separator text-white/50 text-lg font-light px-3">/</span>
              <Link href={`/${locale}/blog`} className="main-menu__item text-white font-bold hover:text-secondary-700 transition-colors px-3 py-2 text-sm uppercase font-heading">
                BLOG
              </Link>
              <span className="main-menu__separator text-white/50 text-lg font-light px-3">/</span>
              <Link href={`/${locale}/kontakt`} className="main-menu__item text-white font-bold hover:text-secondary-700 transition-colors px-3 py-2 text-sm uppercase font-heading">
                KONTAKT
              </Link>
              <span className="main-menu__separator text-white/50 text-lg font-light px-3">/</span>
              <Link href={`/${locale}/faq`} className="main-menu__item text-white font-bold hover:text-secondary-700 transition-colors px-3 py-2 text-sm uppercase font-heading">
                FAQ
              </Link>
              <span className="main-menu__separator text-white/50 text-lg font-light px-3">/</span>
              <Link href={`/${locale}/tracking`} className="main-menu__item text-white font-bold hover:text-secondary-700 transition-colors px-3 py-2 text-sm uppercase font-heading flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ŚLEDZENIE
              </Link>
            </nav>

            {/* Spacer to push actions to right */}
            <div className="flex-1"></div>

            <div className="main-header__actions flex items-center gap-4">
              {/* User Account - with greeting when logged in */}
              <div className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu)
                      setShowLanguageMenu(false)
                      setShowCurrencyMenu(false)
                    }}
                    className="flex items-center gap-2 text-white hover:text-secondary-200 transition-colors"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="hidden sm:block text-sm font-semibold">
                      Cześć, {userName}!
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link 
                    href={`/${locale}/login`} 
                    className="main-header__account text-white hover:text-secondary-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden sm:block text-sm font-semibold">Zaloguj</span>
                  </Link>
                )}

                {/* User Dropdown Menu */}
                {showUserMenu && isAuthenticated && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 min-w-[200px] z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-bold text-secondary-800">
                        {customer?.first_name} {customer?.last_name}
                      </p>
                      <p className="text-xs text-secondary-500 truncate">
                        {customer?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      href={`/${locale}/konto`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-neutral-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Moje konto
                    </Link>
                    <Link
                      href={`/${locale}/zamowienia`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-neutral-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Moje zamówienia
                    </Link>
                    <Link
                      href={`/${locale}/tracking`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-neutral-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      Śledzenie paczki
                    </Link>

                    {/* Divider */}
                    <div className="h-px bg-neutral-100 my-2"></div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Wyloguj się
                    </button>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link href={`/${locale}/cart`} className="main-header__cart relative text-white hover:text-secondary-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="main-header__cart-badge absolute -top-2 -right-2 bg-white text-primary-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {itemCount > 99 ? '99+' : itemCount}
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
