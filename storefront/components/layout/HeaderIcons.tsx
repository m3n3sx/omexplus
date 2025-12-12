'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import { useCartContext } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

export function HeaderIcons() {
  const locale = useLocale()
  const { itemCount } = useCartContext()
  const { customer, isAuthenticated, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when authentication state changes
  useEffect(() => {
    setShowUserMenu(false)
  }, [isAuthenticated])

  // Close menu when clicking outside
  useEffect(() => {
    if (!showUserMenu) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    // Use capture phase to ensure we catch the event first
    document.addEventListener('click', handleClickOutside, true)
    
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [showUserMenu])

  const handleLogout = async () => {
    try {
      setShowUserMenu(false)
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowUserMenu(prev => !prev)
  }

  return (
    <div className="flex items-center gap-4">
      {/* User */}
      <div className="relative" ref={menuRef}>
        {isAuthenticated && customer ? (
          <>
            <button
              onClick={toggleMenu}
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-100 hover:border-secondary-500 hover:bg-neutral-750 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden md:inline-block text-sm font-bold whitespace-nowrap">
                Cześć {customer.first_name || 'Użytkowniku'}!
              </span>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl py-2 min-w-[200px] z-50">
                <div className="h-1 bg-gradient-to-r from-transparent via-secondary-500 to-transparent rounded-t-lg"></div>
                <Link
                  href={`/${locale}/konto`}
                  className="block px-4 py-2 text-[13px] font-semibold text-neutral-300 hover:bg-neutral-750 hover:text-secondary-500 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Moje konto
                  </div>
                </Link>
                <Link
                  href={`/${locale}/zamowienia`}
                  className="block px-4 py-2 text-[13px] font-semibold text-neutral-300 hover:bg-neutral-750 hover:text-secondary-500 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Moje zamówienia
                  </div>
                </Link>
                <div className="border-t border-neutral-700 my-2"></div>
                <button
                  onClick={handleLogout}
                  type="button"
                  className="w-full text-left px-4 py-2 text-[13px] font-semibold text-danger hover:bg-danger/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Wyloguj
                  </div>
                </button>
              </div>
            )}
          </>
        ) : (
          <Link 
            href={`/${locale}/logowanie`} 
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-100 hover:border-secondary-500 hover:bg-neutral-750 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden md:block text-[13px] font-bold">
              Zaloguj
            </span>
          </Link>
        )}
      </div>

      {/* Cart */}
      <Link 
        href={`/${locale}/cart`} 
        className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-100 hover:border-secondary-500 hover:bg-neutral-750 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-neutral-900">
            {itemCount}
          </span>
        )}
      </Link>
    </div>
  )
}
