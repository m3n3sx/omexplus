'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { getCMSContent, CMSContent } from '@/lib/cms'

interface HeaderContent {
  logo?: { src?: string; alt?: string }
  logoText?: string
  topBarBackgroundColor?: string
  topBarTextColor?: string
  mainBackgroundColor?: string
  mainTextColor?: string
  contact?: { phone?: string; email?: string }
  navigation?: { text: string; url: string; target?: string }[]
  topBarLinks?: { text: string; url: string; target?: string }[]
  showCart?: boolean
  showUser?: boolean
  showSearch?: boolean
  showLanguageSwitcher?: boolean
  showCurrencySwitcher?: boolean
}

// Domyślne wartości gdy CMS nie zwróci danych
const defaultContent: HeaderContent = {
  logoText: 'OMEX',
  topBarBackgroundColor: '#FFFFFF',
  topBarTextColor: '#374151',
  mainBackgroundColor: '#FFAA21',
  mainTextColor: '#111827',
  contact: { phone: '+48 500 169 060', email: 'omexplus@gmail.com' },
  navigation: [
    { text: 'PRODUKTY', url: '/products' },
    { text: 'O NAS', url: '/o-nas' },
    { text: 'PROMOCJE', url: '/promocje' },
    { text: 'KONTAKT', url: '/kontakt' },
  ],
  topBarLinks: [
    { text: 'FAQ', url: '/faq' },
    { text: 'ŚLEDŹ PACZKĘ', url: '/tracking' },
  ],
  showCart: true,
  showUser: true,
  showLanguageSwitcher: true,
  showCurrencySwitcher: true,
}

export function CMSHeader() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  
  const [content, setContent] = useState<HeaderContent>(defaultContent)
  const [cartCount] = useState(0)
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  useEffect(() => {
    async function loadContent() {
      const cmsData = await getCMSContent('main-header', locale)
      if (cmsData?.content) {
        setContent({ ...defaultContent, ...cmsData.content })
      }
    }
    loadContent()
  }, [locale])

  const languages = [
    { code: 'pl', name: 'POLISH', flag: '🇵🇱' },
    { code: 'en', name: 'ENGLISH', flag: '🇬🇧' },
    { code: 'de', name: 'DEUTSCH', flag: '🇩🇪' },
    { code: 'uk', name: 'УКРАЇНСЬКА', flag: '🇺🇦' }
  ]

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, '')
    router.push(`/${newLocale}${currentPath || '/'}`)
    setShowLanguageMenu(false)
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-neutral-800">
        {/* Top Bar */}
        <div 
          style={{ 
            backgroundColor: content.topBarBackgroundColor,
            color: content.topBarTextColor 
          }}
          className="border-b border-neutral-200"
        >
          <div className="container mx-auto px-4 lg:px-12 max-w-[1400px]">
            <div className="flex items-center justify-between h-10 text-xs">
              {/* Contact */}
              <div className="flex items-center gap-6">
                {content.contact?.phone && (
                  <a href={`tel:${content.contact.phone}`} className="flex items-center gap-1.5 hover:opacity-70">
                    📞 {content.contact.phone}
                  </a>
                )}
                {content.contact?.email && (
                  <a href={`mailto:${content.contact.email}`} className="flex items-center gap-1.5 hover:opacity-70">
                    ✉️ {content.contact.email}
                  </a>
                )}
              </div>

              {/* Language Selector */}
              {content.showLanguageSwitcher && (
                <div className="relative">
                  <button 
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="flex items-center gap-1 hover:opacity-70"
                  >
                    {currentLanguage.flag} {currentLanguage.name}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showLanguageMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border py-2 min-w-[150px] z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                            locale === lang.code ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-50'
                          }`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Top Bar Links */}
              <div className="flex items-center gap-6">
                {content.topBarLinks?.map((link, i) => (
                  <Link 
                    key={i} 
                    href={`/${locale}${link.url}`} 
                    className="hover:opacity-70"
                    target={link.target}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div 
          style={{ backgroundColor: content.mainBackgroundColor }}
          className="w-full"
        >
          <div className="mx-auto px-6 lg:px-12 max-w-[1400px]">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href={`/${locale}`} className="flex items-center">
                {content.logo?.src ? (
                  <img src={content.logo.src} alt={content.logo.alt || 'Logo'} className="h-10" />
                ) : (
                  <span 
                    className="text-3xl font-bold tracking-wider"
                    style={{ color: content.mainTextColor }}
                  >
                    {content.logoText}
                  </span>
                )}
              </Link>

              {/* Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {content.navigation?.map((item, i) => (
                  <span key={i} className="flex items-center">
                    {i > 0 && (
                      <span 
                        className="text-lg font-light px-2"
                        style={{ color: content.mainTextColor }}
                      >
                        /
                      </span>
                    )}
                    <Link 
                      href={`/${locale}${item.url}`}
                      className="font-bold hover:opacity-70 px-4 py-2 text-sm uppercase"
                      style={{ color: content.mainTextColor }}
                      target={item.target}
                    >
                      {item.text}
                    </Link>
                  </span>
                ))}
              </nav>

              {/* Icons */}
              <div className="flex items-center gap-4">
                {content.showUser && (
                  <Link 
                    href={`/${locale}/logowanie`} 
                    className="hover:opacity-70"
                    style={{ color: content.mainTextColor }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                )}
                {content.showCart && (
                  <Link 
                    href={`/${locale}/checkout`} 
                    className="relative hover:opacity-70"
                    style={{ color: content.mainTextColor }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default CMSHeader
