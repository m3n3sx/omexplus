'use client'

import Link from 'next/link'

export function ModernSidebar() {

  return (
    <aside className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-lg sticky top-24">
      {/* Brand */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-neutral-900 mb-1">BuyMore</h2>
        <div className="flex items-center gap-2 text-[13px] text-neutral-600">
          <span className="font-bold text-neutral-900">37</span>
          <span>Zamówień (7 dni)</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        <Link
          href="/pl"
          className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold text-[14px] transition-all hover:bg-blue-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Explore Now
        </Link>
        
        <Link
          href="/pl/categories"
          className="flex items-center gap-3 px-4 py-3 text-neutral-700 rounded-xl font-medium text-[14px] hover:bg-neutral-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Clothing and Shoes
        </Link>
        
        <Link
          href="/pl/gifts"
          className="flex items-center gap-3 px-4 py-3 text-neutral-700 rounded-xl font-medium text-[14px] hover:bg-neutral-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          Gifts and Living
        </Link>
        
        <Link
          href="/pl/inspiration"
          className="flex items-center gap-3 px-4 py-3 text-neutral-700 rounded-xl font-medium text-[14px] hover:bg-neutral-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Inspiration
        </Link>
      </nav>

      {/* Quick Actions */}
      <div className="space-y-3 pt-6 border-t border-neutral-100">
        <div className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider mb-3">
          Quick actions
        </div>
        
        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-neutral-700 rounded-lg font-medium text-[13px] hover:bg-neutral-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Request for product
        </button>
        
        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-neutral-700 rounded-lg font-medium text-[13px] hover:bg-neutral-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add member
        </button>
      </div>

      {/* Last Orders */}
      <div className="mt-8 pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">
            Last orders · 37
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-[11px] font-bold">
              DN
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-neutral-900 truncate">DXC Nike</div>
              <div className="text-[11px] text-neutral-500">...new order</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-[11px] font-bold">
              OW
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-neutral-900 truncate">Outwear</div>
              <div className="text-[11px] text-neutral-500">...new order</div>
            </div>
          </div>
        </div>
        
        <button className="w-full mt-4 text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          See all
        </button>
      </div>

      {/* Logout */}
      <button className="flex items-center gap-3 w-full px-4 py-3 mt-6 text-neutral-700 rounded-xl font-medium text-[14px] hover:bg-red-50 hover:text-red-600 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Log out
      </button>
    </aside>
  )
}
