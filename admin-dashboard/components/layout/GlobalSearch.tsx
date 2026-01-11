"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Package, ShoppingCart, Users, Building2, Loader2 } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api-client"

interface SearchResult {
  id: string
  type: 'product' | 'order' | 'customer' | 'company'
  title: string
  subtitle?: string
  href: string
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcut to open search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])


  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    const searchResults: SearchResult[] = []

    try {
      // Search products
      const productsRes = await api.getProducts({ q: searchQuery, limit: 5 })
      if (productsRes.products) {
        productsRes.products.forEach((p: any) => {
          searchResults.push({
            id: p.id,
            type: 'product',
            title: p.title || p.name,
            subtitle: p.variants?.[0]?.sku || '',
            href: `/products/${p.id}/edit`
          })
        })
      }
    } catch (e) {}

    try {
      // Search orders
      const ordersRes = await api.getOrders({ q: searchQuery, limit: 5 })
      if (ordersRes.orders) {
        ordersRes.orders.forEach((o: any) => {
          searchResults.push({
            id: o.id,
            type: 'order',
            title: `Zamówienie #${o.display_id || o.id.slice(-6)}`,
            subtitle: o.email || '',
            href: `/orders/${o.id}`
          })
        })
      }
    } catch (e) {}

    try {
      // Search customers
      const customersRes = await api.getCustomers({ q: searchQuery, limit: 5 })
      if (customersRes.customers) {
        customersRes.customers.forEach((c: any) => {
          searchResults.push({
            id: c.id,
            type: 'customer',
            title: `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.email,
            subtitle: c.email,
            href: `/customers/${c.id}`
          })
        })
      }
    } catch (e) {}

    setResults(searchResults)
    setSelectedIndex(0)
    setLoading(false)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      window.location.href = results[selectedIndex].href
      setIsOpen(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'product': return <Package className="w-4 h-4" />
      case 'order': return <ShoppingCart className="w-4 h-4" />
      case 'customer': return <Users className="w-4 h-4" />
      case 'company': return <Building2 className="w-4 h-4" />
      default: return <Search className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'product': return 'Produkt'
      case 'order': return 'Zamówienie'
      case 'customer': return 'Klient'
      case 'company': return 'Firma'
      default: return type
    }
  }


  return (
    <>
      {/* Search trigger */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-muted" />
        <input
          type="text"
          placeholder="Szukaj... (Ctrl+K)"
          className="w-full pl-10 pr-4 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent cursor-pointer"
          onClick={() => setIsOpen(true)}
          readOnly
        />
      </div>

      {/* Search modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 pt-20">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
            
            <div 
              ref={containerRef}
              className="relative mx-auto max-w-2xl bg-theme-secondary rounded-xl shadow-2xl border border-theme overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center px-4 border-b border-theme">
                <Search className="w-5 h-5 text-theme-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Szukaj produktów, zamówień, klientów..."
                  className="flex-1 px-4 py-4 bg-transparent text-theme-primary placeholder:text-theme-muted focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="p-1 hover:bg-theme-hover rounded">
                    <X className="w-4 h-4 text-theme-muted" />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-theme-muted" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-theme-hover ${
                          index === selectedIndex ? 'bg-theme-hover' : ''
                        }`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-theme-tertiary flex items-center justify-center text-theme-secondary">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-theme-primary truncate">{result.title}</p>
                          {result.subtitle && (
                            <p className="text-xs text-theme-muted truncate">{result.subtitle}</p>
                          )}
                        </div>
                        <span className="text-xs text-theme-muted bg-theme-tertiary px-2 py-1 rounded">
                          {getTypeLabel(result.type)}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : query ? (
                  <div className="py-8 text-center text-theme-muted">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Brak wyników dla "{query}"</p>
                  </div>
                ) : (
                  <div className="py-8 text-center text-theme-muted">
                    <p className="text-sm">Wpisz frazę aby wyszukać</p>
                    <p className="text-xs mt-2">Produkty, zamówienia, klienci</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-theme bg-theme-tertiary text-xs text-theme-muted flex items-center gap-4">
                <span><kbd className="px-1.5 py-0.5 bg-theme-secondary rounded">↑↓</kbd> nawigacja</span>
                <span><kbd className="px-1.5 py-0.5 bg-theme-secondary rounded">Enter</kbd> wybierz</span>
                <span><kbd className="px-1.5 py-0.5 bg-theme-secondary rounded">Esc</kbd> zamknij</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
