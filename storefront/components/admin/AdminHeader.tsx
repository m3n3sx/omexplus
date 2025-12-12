'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

/**
 * AdminHeader Component
 * 
 * Displays header for admin section with branding and user menu
 */
export default function AdminHeader() {
  const params = useParams()
  const locale = params.locale as string

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}/admin`} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-bold text-neutral-900">Admin Panel</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
            <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-600 font-semibold">
              👤
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-neutral-900">Admin</p>
              <p className="text-xs text-neutral-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
