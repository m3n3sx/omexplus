'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCMSContent, getCMSMenu } from '@/lib/cms'

export default function DynamicHeader({ locale = 'pl' }: { locale?: string }) {
  const [headerContent, setHeaderContent] = useState<any>(null)
  const [mainMenu, setMainMenu] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHeader() {
      try {
        const [content, menu] = await Promise.all([
          getCMSContent('main-header', locale),
          getCMSMenu('main-menu', locale)
        ])
        
        setHeaderContent(content)
        setMainMenu(menu)
      } catch (error) {
        console.error('Failed to load header:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadHeader()
  }, [locale])

  if (loading) {
    return <div className="h-16 bg-white border-b animate-pulse" />
  }

  // Fallback do domyślnego headera jeśli brak danych CMS
  if (!headerContent) {
    return <DefaultHeader />
  }

  const { logo, showSearch, showCart } = headerContent.content || {}

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt="Logo" className="h-10" />
            ) : (
              <>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  O
                </div>
                <span className="text-2xl font-bold">OMEX</span>
              </>
            )}
          </Link>

          {/* Search */}
          {showSearch && (
            <div className="flex-1 max-w-2xl">
              <Link href={`/${locale}`}>
                <div className="px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all cursor-pointer flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-sm text-gray-500">Szukaj...</span>
                </div>
              </Link>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {showCart && (
              <Link href={`/${locale}/checkout`} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-semibold">Koszyk</span>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Menu */}
      {mainMenu && mainMenu.items && (
        <div className="bg-gray-50 border-t">
          <div className="container mx-auto px-4">
            <div className="flex gap-8 py-3 text-sm">
              {mainMenu.items.map((item: any) => (
                <Link
                  key={item.id}
                  href={item.url}
                  target={item.open_in_new_tab ? '_blank' : undefined}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// Fallback header
function DefaultHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/pl" className="text-2xl font-bold">OMEX</Link>
          <nav className="flex gap-4">
            <Link href="/pl">Strona główna</Link>
            <Link href="/pl/products">Produkty</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
