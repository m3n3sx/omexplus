'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

/**
 * AdminSidebar Component
 * 
 * Displays navigation menu for admin section
 */
export default function AdminSidebar() {
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string

  const isActive = (path: string) => {
    return pathname.includes(path)
  }

  const navItems = [
    {
      label: 'Dashboard',
      href: `/${locale}/admin`,
      icon: '📊',
    },
    {
      label: 'Categories',
      href: `/${locale}/admin/categories`,
      icon: '📁',
    },
    {
      label: 'Products',
      href: `/${locale}/admin/products`,
      icon: '📦',
    },
    {
      label: 'Orders',
      href: `/${locale}/admin/orders`,
      icon: '📋',
    },
    {
      label: 'Users',
      href: `/${locale}/admin/users`,
      icon: '👥',
    },
    {
      label: 'Settings',
      href: `/${locale}/admin/settings`,
      icon: '⚙️',
    },
  ]

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-neutral-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-primary-50 text-primary-600 font-semibold'
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
