'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { apiClient } from '@/lib/api-client'
import { isAuthenticated } from '@/lib/auth'
import Link from 'next/link'
import { 
  FileText, Layout, Home, Info, Phone, HelpCircle, Truck, 
  Shield, FileCheck, Users, Briefcase, Package, Search,
  Edit, Eye, ExternalLink, Plus, RefreshCw, Wand2, Globe,
  CheckCircle, XCircle, Clock, Menu, ChevronRight, Settings,
  Image, Type, Layers, Navigation, ShoppingCart, User, Star,
  Tag, Percent, BookOpen, MessageSquare, Mail, MapPin
} from 'lucide-react'

const STOREFRONT_URL = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

// Rzeczywiste strony ze storefront
const STOREFRONT_PAGES = [
  { slug: '', name: 'Strona główna', icon: Home, category: 'main', description: 'Główna strona sklepu z hero, produktami i banerami' },
  { slug: 'o-nas', name: 'O nas', icon: Info, category: 'info', description: 'Informacje o firmie' },
  { slug: 'kontakt', name: 'Kontakt', icon: Phone, category: 'info', description: 'Formularz kontaktowy i dane firmy' },
  { slug: 'faq', name: 'FAQ', icon: HelpCircle, category: 'info', description: 'Najczęściej zadawane pytania' },
  { slug: 'dostawa', name: 'Dostawa', icon: Truck, category: 'info', description: 'Informacje o dostawie' },
  { slug: 'regulamin', name: 'Regulamin', icon: FileCheck, category: 'legal', description: 'Regulamin sklepu' },
  { slug: 'polityka-prywatnosci', name: 'Polityka prywatności', icon: Shield, category: 'legal', description: 'RODO i polityka prywatności' },
  { slug: 'zwroty', name: 'Zwroty i reklamacje', icon: Package, category: 'legal', description: 'Procedura zwrotów' },
  { slug: 'kariera', name: 'Kariera', icon: Briefcase, category: 'info', description: 'Oferty pracy' },
  { slug: 'promocje', name: 'Promocje', icon: Percent, category: 'shop', description: 'Produkty w promocji' },
  { slug: 'nowosci', name: 'Nowości', icon: Star, category: 'shop', description: 'Najnowsze produkty' },
  { slug: 'bestsellery', name: 'Bestsellery', icon: Tag, category: 'shop', description: 'Najpopularniejsze produkty' },
  { slug: 'products', name: 'Produkty', icon: Package, category: 'shop', description: 'Lista wszystkich produktów' },
  { slug: 'categories', name: 'Kategorie', icon: Layers, category: 'shop', description: 'Przeglądanie kategorii' },
  { slug: 'search', name: 'Wyszukiwarka', icon: Search, category: 'shop', description: 'Wyszukiwanie produktów' },
  { slug: 'cart', name: 'Koszyk', icon: ShoppingCart, category: 'checkout', description: 'Koszyk zakupowy' },
  { slug: 'checkout', name: 'Checkout', icon: ShoppingCart, category: 'checkout', description: 'Proces zamówienia' },
  { slug: 'logowanie', name: 'Logowanie', icon: User, category: 'auth', description: 'Strona logowania' },
  { slug: 'rejestracja', name: 'Rejestracja', icon: User, category: 'auth', description: 'Rejestracja konta' },
  { slug: 'konto', name: 'Moje konto', icon: User, category: 'auth', description: 'Panel klienta' },
  { slug: 'zamowienia', name: 'Moje zamówienia', icon: Package, category: 'auth', description: 'Historia zamówień' },
  { slug: 'sledzenie', name: 'Śledzenie przesyłki', icon: MapPin, category: 'info', description: 'Śledzenie paczki' },
  { slug: 'blog', name: 'Blog', icon: BookOpen, category: 'content', description: 'Artykuły i poradniki' },
]

// Komponenty globalne storefront
const GLOBAL_COMPONENTS = [
  { key: 'header', name: 'Header (Nagłówek)', icon: Navigation, type: 'header', description: 'Logo, menu główne, koszyk, login' },
  { key: 'topbar', name: 'Topbar', icon: Type, type: 'topbar', description: 'Pasek informacyjny nad headerem' },
  { key: 'footer', name: 'Footer (Stopka)', icon: Layout, type: 'footer', description: 'Linki, kontakt, social media' },
  { key: 'main-menu', name: 'Menu główne', icon: Menu, type: 'menu', description: 'Nawigacja główna' },
  { key: 'mobile-menu', name: 'Menu mobilne', icon: Menu, type: 'menu', description: 'Menu na urządzeniach mobilnych' },
  { key: 'mega-menu', name: 'Mega Menu', icon: Layers, type: 'menu', description: 'Rozbudowane menu kategorii' },
  { key: 'home-hero', name: 'Hero (strona główna)', icon: Image, type: 'hero', description: 'Główny baner na stronie głównej' },
  { key: 'home-banners', name: 'Banery promocyjne', icon: Image, type: 'banners', description: 'Banery na stronie głównej' },
  { key: 'newsletter', name: 'Newsletter', icon: Mail, type: 'widget', description: 'Formularz zapisu do newslettera' },
  { key: 'cookie-banner', name: 'Cookie Banner', icon: Shield, type: 'widget', description: 'Informacja o cookies' },
]

const CATEGORIES = {
  main: { name: 'Główne', color: 'blue' },
  shop: { name: 'Sklep', color: 'green' },
  info: { name: 'Informacyjne', color: 'purple' },
  legal: { name: 'Prawne', color: 'orange' },
  auth: { name: 'Konto', color: 'pink' },
  checkout: { name: 'Zamówienie', color: 'yellow' },
  content: { name: 'Treści', color: 'cyan' },
}

export default function StorefrontCMSPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [cmsContents, setCmsContents] = useState<any[]>([])
  const [locale, setLocale] = useState('pl')
  const [activeTab, setActiveTab] = useState<'pages' | 'components' | 'menus'>('pages')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [storefrontStatus, setStorefrontStatus] = useState<'online' | 'offline' | 'checking'>('checking')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    loadCMSContents()
    checkStorefrontStatus()
  }, [router, locale])

  const loadCMSContents = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get(`/admin/cms?locale=${locale}`)
      setCmsContents(data.contents || [])
    } catch (error) {
      console.error('Failed to load CMS contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkStorefrontStatus = async () => {
    try {
      const res = await fetch(STOREFRONT_URL, { method: 'HEAD', mode: 'no-cors' })
      setStorefrontStatus('online')
    } catch {
      setStorefrontStatus('offline')
    }
  }

  const getPageCMSContent = (slug: string) => {
    return cmsContents.find(c => c.key === `page-${slug}` || c.key === slug)
  }

  const getComponentCMSContent = (key: string) => {
    return cmsContents.find(c => c.key === key)
  }

  const createContent = async (key: string, type: string, name: string) => {
    try {
      await apiClient.post('/admin/cms', {
        key,
        type,
        name,
        locale,
        is_active: true,
        content: { elements: [] }
      })
      loadCMSContents()
    } catch (error) {
      console.error('Failed to create content:', error)
      alert('Błąd podczas tworzenia')
    }
  }

  const filteredPages = selectedCategory === 'all' 
    ? STOREFRONT_PAGES 
    : STOREFRONT_PAGES.filter(p => p.category === selectedCategory)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Storefront CMS</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Zarządzaj wszystkimi elementami sklepu - strony, menu, nagłówek, stopka
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Storefront Status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              storefrontStatus === 'online' ? 'bg-green-100 text-green-700' :
              storefrontStatus === 'offline' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                storefrontStatus === 'online' ? 'bg-green-500' :
                storefrontStatus === 'offline' ? 'bg-red-500' :
                'bg-gray-500 animate-pulse'
              }`} />
              Storefront: {storefrontStatus === 'online' ? 'Online' : storefrontStatus === 'offline' ? 'Offline' : 'Sprawdzanie...'}
            </div>
            
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="pl">🇵🇱 Polski</option>
              <option value="en">🇬🇧 English</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="uk">🇺🇦 Українська</option>
            </select>
            
            <button
              onClick={loadCMSContents}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="Odśwież"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <a
              href={STOREFRONT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              Otwórz sklep
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
          {[
            { id: 'pages', label: 'Strony', icon: FileText, count: STOREFRONT_PAGES.length },
            { id: 'components', label: 'Komponenty', icon: Layout, count: GLOBAL_COMPONENTS.length },
            { id: 'menus', label: 'Menu', icon: Menu, count: 3 },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded">
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                Wszystkie ({STOREFRONT_PAGES.length})
              </button>
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const count = STOREFRONT_PAGES.filter(p => p.category === key).length
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === key
                        ? `bg-${cat.color}-600 text-white`
                        : `bg-${cat.color}-50 text-${cat.color}-700 hover:bg-${cat.color}-100 dark:bg-${cat.color}-900/20 dark:text-${cat.color}-400`
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                )
              })}
            </div>

            {/* Pages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPages.map((page) => {
                const cmsContent = getPageCMSContent(page.slug || 'home')
                const Icon = page.icon
                const category = CATEGORIES[page.category as keyof typeof CATEGORIES]
                
                return (
                  <div
                    key={page.slug}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-lg`}>
                          <Icon className={`w-5 h-5 text-${category.color}-600 dark:text-${category.color}-400`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{page.name}</h3>
                          <code className="text-xs text-gray-500">/{locale}/{page.slug}</code>
                        </div>
                      </div>
                      {cmsContent ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <XCircle className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{page.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={`${STOREFRONT_URL}/${locale}/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <Eye className="w-4 h-4" />
                        Podgląd
                      </a>
                      {cmsContent ? (
                        <Link
                          href={`/cms/visual-editor?id=${cmsContent.id}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          <Wand2 className="w-4 h-4" />
                          Edytuj
                        </Link>
                      ) : (
                        <button
                          onClick={() => createContent(`page-${page.slug || 'home'}`, 'page', page.name)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                          Dodaj do CMS
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Components Tab */}
        {activeTab === 'components' && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Komponenty Globalne</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Te elementy są wyświetlane na wszystkich lub wielu stronach storefront
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GLOBAL_COMPONENTS.map((component) => {
                const cmsContent = getComponentCMSContent(component.key)
                const Icon = component.icon
                
                return (
                  <div
                    key={component.key}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{component.name}</h3>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                            {component.type}
                          </span>
                        </div>
                      </div>
                      {cmsContent?.is_active && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Aktywny</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{component.description}</p>
                    
                    <div className="flex gap-2">
                      {cmsContent ? (
                        <>
                          <Link
                            href={`/cms/${cmsContent.id}/edit`}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                            Edytuj
                          </Link>
                          <Link
                            href={`/cms/visual-editor?id=${cmsContent.id}`}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            <Wand2 className="w-4 h-4" />
                          </Link>
                        </>
                      ) : (
                        <button
                          onClick={() => createContent(component.key, component.type, component.name)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                          Utwórz
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Menus Tab */}
        {activeTab === 'menus' && (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-1">Zarządzanie Menu</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Edytuj strukturę nawigacji w sklepie
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Menu */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Navigation className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Menu Główne</h3>
                    <p className="text-sm text-gray-500">Nawigacja w headerze</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ChevronRight className="w-4 h-4" /> Strona główna
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ChevronRight className="w-4 h-4" /> Produkty
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ChevronRight className="w-4 h-4" /> Kategorie
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ChevronRight className="w-4 h-4" /> Kontakt
                  </div>
                </div>
                <Link
                  href="/megamenu"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Settings className="w-4 h-4" />
                  Edytuj Menu
                </Link>
              </div>

              {/* Footer Menu */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Layout className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Menu Stopki</h3>
                    <p className="text-sm text-gray-500">Linki w footerze</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>• O nas</span>
                  <span>• Kontakt</span>
                  <span>• Regulamin</span>
                  <span>• Prywatność</span>
                  <span>• Dostawa</span>
                  <span>• Zwroty</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Settings className="w-4 h-4" />
                  Edytuj Stopkę
                </button>
              </div>

              {/* Categories Menu */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Layers className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Mega Menu</h3>
                    <p className="text-sm text-gray-500">Menu kategorii</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Rozbudowane menu z kategoriami produktów, obrazkami i linkami
                </p>
                <Link
                  href="/megamenu"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Settings className="w-4 h-4" />
                  Konfiguruj
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
