'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { OmexLogo } from './OmexLogo'
import { useCurrency } from '@/contexts/CurrencyContext'

export function FigmaHeader() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()
  const { currency, setCurrency } = useCurrency()
  
  const [cartCount] = useState(0)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.language-menu') && !target.closest('.currency-menu')) {
        setShowLanguageMenu(false)
        setShowCurrencyMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const languages = [
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  ]

  const currencies = [
    { code: 'PLN', symbol: 'zł', name: 'Polski Złoty' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'UAH', symbol: '₴', name: 'Українська гривня' },
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
              {/* Language Selector */}
              <div className="relative language-menu">
                <button 
                  onClick={() => {
                    setShowLanguageMenu(!showLanguageMenu)
                    setShowCurrencyMenu(false)
                  }}
                  className="hover:text-[#22A2F2] transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>{currentLanguage.flag} {currentLanguage.name}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showLanguageMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 min-w-[180px] z-[9999]">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left text-[13px] font-semibold flex items-center gap-2 transition-colors ${
                          locale === lang.code
                            ? 'bg-[#E8F4FE] text-[#1675F2]'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {locale === lang.code && (
                          <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <div className="relative currency-menu">
                <button 
                  onClick={() => {
                    setShowCurrencyMenu(!showCurrencyMenu)
                    setShowLanguageMenu(false)
                  }}
                  className="hover:text-[#22A2F2] transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{currentCurrency.code}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showCurrencyMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 min-w-[180px] z-[9999]">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencyChange(curr.code)}
                        className={`w-full px-4 py-2 text-left text-[13px] font-semibold flex items-center gap-2 transition-colors ${
                          currency === curr.code
                            ? 'bg-[#E8F4FE] text-[#1675F2]'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="font-bold">{curr.symbol}</span>
                        <span>{curr.code} - {curr.name}</span>
                        {currency === curr.code && (
                          <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
            <div className="hidden md:flex items-center gap-3 flex-1 ml-12">
              <Link href="/pl/tracking" className="relative font-bold text-[13px] text-neutral-700 hover:text-[#1675F2] transition-colors px-4 py-2 flex items-center gap-2 group">
                <span className="absolute inset-0 bg-[#E8F4FE] opacity-0 group-hover:opacity-100 transition-opacity" style={{ clipPath: 'polygon(6px 0%, calc(100% - 0px) 0%, calc(100% - 6px) 100%, 0px 100%)' }}></span>
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="relative z-10">Śledzenie paczki</span>
              </Link>
              <span className="text-neutral-300">/</span>
              <Link href="/pl/faq" className="relative font-bold text-[13px] text-neutral-700 hover:text-[#1675F2] transition-colors px-4 py-2 flex items-center gap-2 group">
                <span className="absolute inset-0 bg-[#E8F4FE] opacity-0 group-hover:opacity-100 transition-opacity" style={{ clipPath: 'polygon(6px 0%, calc(100% - 0px) 0%, calc(100% - 6px) 100%, 0px 100%)' }}></span>
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="relative z-10">FAQ</span>
              </Link>
              <span className="text-neutral-300">/</span>
              <Link href="/pl/o-nas" className="relative font-bold text-[13px] text-neutral-700 hover:text-[#1675F2] transition-colors px-4 py-2 flex items-center gap-2 group">
                <span className="absolute inset-0 bg-[#E8F4FE] opacity-0 group-hover:opacity-100 transition-opacity" style={{ clipPath: 'polygon(6px 0%, calc(100% - 0px) 0%, calc(100% - 6px) 100%, 0px 100%)' }}></span>
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="relative z-10">O nas</span>
              </Link>
              <span className="text-neutral-300">/</span>
              <Link href="/pl/kontakt" className="relative font-bold text-[13px] text-neutral-700 hover:text-[#1675F2] transition-colors px-4 py-2 flex items-center gap-2 group">
                <span className="absolute inset-0 bg-[#E8F4FE] opacity-0 group-hover:opacity-100 transition-opacity" style={{ clipPath: 'polygon(6px 0%, calc(100% - 0px) 0%, calc(100% - 6px) 100%, 0px 100%)' }}></span>
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="relative z-10">Kontakt</span>
              </Link>
              <span className="text-neutral-300">/</span>
              <Link href="/pl/promocje" className="relative font-bold text-[13px] text-neutral-900 bg-[#F2B90C] px-5 py-2 transition-colors flex items-center gap-2 hover:bg-[#d9a50b] group" style={{ clipPath: 'polygon(6px 0%, calc(100% - 0px) 0%, calc(100% - 6px) 100%, 0px 100%)' }}>
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span className="relative z-10">Promocje</span>
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
            {categories.map((category, index) => (
              <div key={category.id} className="flex items-center gap-2">
                <div
                  className="relative group"
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button 
                    className={`relative px-5 py-3 text-[13px] font-bold transition-all whitespace-nowrap ${
                      activeCategory === category.id 
                        ? 'text-white' 
                        : 'text-neutral-700 hover:text-[#1675F2]'
                    }`}
                    style={activeCategory === category.id ? {
                      background: 'linear-gradient(to right, #1675F2, #22A2F2)',
                      clipPath: 'polygon(8px 0%, calc(100% - 0px) 0%, calc(100% - 8px) 100%, 0px 100%)'
                    } : {}}
                  >
                    {activeCategory !== category.id && (
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity" style={{ clipPath: 'polygon(8px 0%, calc(100% - 0px) 0%, calc(100% - 8px) 100%, 0px 100%)' }}></span>
                    )}
                    <span className="relative z-10">{category.name}</span>
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
                          className="relative block px-5 py-2.5 text-[13px] font-semibold text-neutral-700 hover:text-[#1675F2] transition-colors mx-2 group"
                        >
                          <span className="absolute inset-0 bg-[#E8F4FE] opacity-0 group-hover:opacity-100 transition-opacity" style={{ clipPath: 'polygon(5px 0%, calc(100% - 0px) 0%, calc(100% - 5px) 100%, 0px 100%)' }}></span>
                          <span className="relative z-10">{sub.name}</span>
                        </Link>
                      ))}
                      <div className="border-t-2 border-[#E8F4FE] mt-2 pt-2 mx-2">
                        <Link
                          href={`/pl/categories/${category.id}`}
                          className="relative block px-5 py-2.5 text-[13px] text-white bg-gradient-to-r from-[#1675F2] to-[#22A2F2] hover:from-[#0554F2] hover:to-[#1675F2] font-bold transition-colors text-center group"
                          style={{ clipPath: 'polygon(5px 0%, calc(100% - 0px) 0%, calc(100% - 5px) 100%, 0px 100%)' }}
                        >
                          <span className="relative z-10">Zobacz wszystkie →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                </div>
                {index < categories.length - 1 && (
                  <span className="text-neutral-300">/</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
