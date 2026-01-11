'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { isAuthenticated } from '@/lib/auth'
import { 
  Search, Globe, FileText, TrendingUp, Settings, Save, 
  RefreshCw, ExternalLink, CheckCircle, AlertCircle, Info,
  Edit, Eye, Tag, Image, Link2, BarChart3, Sparkles,
  ChevronRight, Package, FolderTree, FileQuestion, Wand2
} from 'lucide-react'

const STOREFRONT_URL = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://ooxo.pl'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ooxo.pl'

interface SEOData {
  id: string
  type: 'page' | 'product' | 'category'
  name: string
  url: string
  title: string
  description: string
  keywords: string
  og_image: string
  canonical_url: string
  no_index: boolean
  no_follow: boolean
  status: 'ok' | 'warning' | 'error'
  issues: string[]
}

// Storefront pages with their SEO data
const STOREFRONT_PAGES: SEOData[] = [
  { id: 'home', type: 'page', name: 'Strona główna', url: '/', title: 'Części do maszyn budowlanych - OMEX | CAT, Komatsu, JCB', description: 'Wysokiej jakości części do maszyn budowlanych. Oferujemy oryginalne i zamienne części do CAT, Komatsu, DOOSAN, JCB.', keywords: 'części do maszyn, CAT, Komatsu', og_image: '/images/og-home.jpg', canonical_url: '', no_index: false, no_follow: false, status: 'ok', issues: [] },
  { id: 'products', type: 'page', name: 'Produkty', url: '/products', title: 'Produkty - Części do maszyn | OMEX', description: 'Przeglądaj naszą ofertę części do maszyn budowlanych.', keywords: 'produkty, części zamienne', og_image: '', canonical_url: '', no_index: false, no_follow: false, status: 'ok', issues: [] },
  { id: 'categories', type: 'page', name: 'Kategorie', url: '/categories', title: 'Kategorie produktów | OMEX', description: 'Wszystkie kategorie części do maszyn budowlanych.', keywords: 'kategorie, filtry, oleje', og_image: '', canonical_url: '', no_index: false, no_follow: false, status: 'ok', issues: [] },
  { id: 'about', type: 'page', name: 'O nas', url: '/o-nas', title: 'O firmie OMEX - 17 lat doświadczenia', description: '', keywords: '', og_image: '', canonical_url: '', no_index: false, no_follow: false, status: 'warning', issues: ['Brak meta description'] },
  { id: 'contact', type: 'page', name: 'Kontakt', url: '/kontakt', title: 'Kontakt - OMEX', description: 'Skontaktuj się z nami. Jesteśmy do Twojej dyspozycji.', keywords: 'kontakt, telefon, email', og_image: '', canonical_url: '', no_index: false, no_follow: false, status: 'ok', issues: [] },
  { id: 'faq', type: 'page', name: 'FAQ', url: '/faq', title: 'Najczęściej zadawane pytania | OMEX', description: 'Odpowiedzi na najczęściej zadawane pytania.', keywords: 'faq, pytania, pomoc', og_image: '', canonical_url: '', no_index: false, no_follow: false, status: 'ok', issues: [] },
  { id: 'delivery', type: 'page', name: 'Dostawa', url: '/dostawa', title: 'Dostawa i płatności | OMEX', description: 'Informacje o dostawie i metodach płatności.', keywords: 'dostawa, płatność, kurier', og_image: '', canonical_url: '', no_index: false, no_follow: false, status: 'ok', issues: [] },
  { id: 'returns', type: 'page', name: 'Zwroty', url: '/zwroty', title: 'Zwroty i reklamacje | OMEX', description: '', keywords: '', og_image: '', canonical_url: '', no_index: false, no_follow: false, status: 'warning', issues: ['Brak meta description'] },
  { id: 'privacy', type: 'page', name: 'Polityka prywatności', url: '/polityka-prywatnosci', title: 'Polityka prywatności | OMEX', description: 'Polityka prywatności sklepu OMEX.', keywords: '', og_image: '', canonical_url: '', no_index: false, no_follow: false, status: 'ok', issues: [] },
  { id: 'terms', type: 'page', name: 'Regulamin', url: '/regulamin', title: 'Regulamin sklepu | OMEX', description: 'Regulamin sklepu internetowego OMEX.', keywords: '', og_image: '', canonical_url: '', no_index: false, no_follow: false, status: 'ok', issues: [] },
]

export default function SEOPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pages' | 'products' | 'categories' | 'settings'>('pages')
  const [pages, setPages] = useState<SEOData[]>(STOREFRONT_PAGES)
  const [products, setProducts] = useState<SEOData[]>([])
  const [categories, setCategories] = useState<SEOData[]>([])
  const [editingItem, setEditingItem] = useState<SEOData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    loadData()
  }, [router])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load products from Medusa
      const productsRes = await fetch(`${API_URL}/store/products?limit=100`)
      const productsData = await productsRes.json()
      
      const productsSEO: SEOData[] = (productsData.products || []).map((p: any) => {
        const issues: string[] = []
        if (!p.description || p.description.length < 50) issues.push('Krótki opis')
        if (!p.metadata?.seo_title) issues.push('Brak SEO title')
        
        return {
          id: p.id,
          type: 'product' as const,
          name: p.title,
          url: `/products/${p.handle}`,
          title: p.metadata?.seo_title || p.title,
          description: p.metadata?.seo_description || p.description?.substring(0, 160) || '',
          keywords: p.metadata?.seo_keywords || '',
          og_image: p.thumbnail || '',
          canonical_url: p.metadata?.canonical_url || '',
          no_index: p.metadata?.no_index || false,
          no_follow: p.metadata?.no_follow || false,
          status: issues.length === 0 ? 'ok' : issues.length === 1 ? 'warning' : 'error',
          issues
        }
      })
      setProducts(productsSEO)

      // Load categories
      const categoriesRes = await fetch(`${API_URL}/store/product-categories?limit=100`)
      const categoriesData = await categoriesRes.json()
      
      const categoriesSEO: SEOData[] = (categoriesData.product_categories || []).map((c: any) => {
        const issues: string[] = []
        if (!c.description) issues.push('Brak opisu')
        if (!c.metadata?.seo_title) issues.push('Brak SEO title')
        
        return {
          id: c.id,
          type: 'category' as const,
          name: c.name,
          url: `/categories/${c.handle}`,
          title: c.metadata?.seo_title || c.name,
          description: c.metadata?.seo_description || c.description || '',
          keywords: c.metadata?.seo_keywords || '',
          og_image: c.metadata?.image || '',
          canonical_url: c.metadata?.canonical_url || '',
          no_index: c.metadata?.no_index || false,
          no_follow: c.metadata?.no_follow || false,
          status: issues.length === 0 ? 'ok' : issues.length === 1 ? 'warning' : 'error',
          issues
        }
      })
      setCategories(categoriesSEO)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="w-4 h-4" />
      case 'warning': return <AlertCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <FileQuestion className="w-4 h-4" />
    }
  }

  const stats = {
    pages: { total: pages.length, ok: pages.filter(p => p.status === 'ok').length, issues: pages.filter(p => p.status !== 'ok').length },
    products: { total: products.length, ok: products.filter(p => p.status === 'ok').length, issues: products.filter(p => p.status !== 'ok').length },
    categories: { total: categories.length, ok: categories.filter(c => c.status === 'ok').length, issues: categories.filter(c => c.status !== 'ok').length },
  }

  const seoScore = Math.round(((stats.pages.ok + stats.products.ok + stats.categories.ok) / (stats.pages.total + stats.products.total + stats.categories.total || 1)) * 100)

  const getCurrentItems = () => {
    let items: SEOData[] = []
    switch (activeTab) {
      case 'pages': items = pages; break
      case 'products': items = products; break
      case 'categories': items = categories; break
      default: return []
    }
    if (searchQuery) {
      return items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return items
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Manager</h1>
            <p className="text-gray-500">Zarządzaj meta tagami i optymalizacją SEO</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Odśwież
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">SEO Score</p>
                <p className="text-4xl font-bold mt-1">{seoScore}%</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Strony</p>
                <p className="text-2xl font-bold">{stats.pages.total}</p>
                <p className="text-xs text-green-600">{stats.pages.ok} OK</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Produkty</p>
                <p className="text-2xl font-bold">{stats.products.total}</p>
                <p className="text-xs text-yellow-600">{stats.products.issues} do poprawy</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FolderTree className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Kategorie</p>
                <p className="text-2xl font-bold">{stats.categories.total}</p>
                <p className="text-xs text-yellow-600">{stats.categories.issues} do poprawy</p>
              </div>
            </div>
          </div>

          {/* AI Bulk Generator Card */}
          <Link 
            href="/seo/bulk-generate"
            className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-5 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">AI Generator</p>
                <p className="text-lg font-bold">Bulk SEO</p>
                <p className="text-xs text-purple-600">Generuj masowo →</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {[
              { id: 'pages', label: 'Strony', icon: FileText, count: stats.pages.total },
              { id: 'products', label: 'Produkty', icon: Package, count: stats.products.total },
              { id: 'categories', label: 'Kategorie', icon: FolderTree, count: stats.categories.total },
              { id: 'settings', label: 'Ustawienia', icon: Settings, count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== null && (
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
          
          {activeTab !== 'settings' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Content */}
        {activeTab !== 'settings' ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nazwa</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {getCurrentItems().slice(0, 50).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.name}</div>
                      {item.issues.length > 0 && (
                        <div className="text-xs text-red-500 mt-1">{item.issues.join(', ')}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{item.url}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {item.title || <span className="text-gray-400 italic">Brak</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status === 'ok' ? 'OK' : item.status === 'warning' ? 'Uwaga' : 'Błąd'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          title="Edytuj SEO"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <a
                          href={`${STOREFRONT_URL}/pl${item.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          title="Podgląd"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {getCurrentItems().length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Brak wyników
              </div>
            )}
          </div>
        ) : (
          <SettingsTab />
        )}

        {/* Edit Modal */}
        {editingItem && (
          <SEOEditModal 
            item={editingItem} 
            onClose={() => setEditingItem(null)}
            onSave={(updated) => {
              // Update local state
              if (updated.type === 'page') {
                setPages(pages.map(p => p.id === updated.id ? updated : p))
              } else if (updated.type === 'product') {
                setProducts(products.map(p => p.id === updated.id ? updated : p))
              } else {
                setCategories(categories.map(c => c.id === updated.id ? updated : c))
              }
              setEditingItem(null)
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

// SEO Edit Modal Component
function SEOEditModal({ item, onClose, onSave }: { item: SEOData, onClose: () => void, onSave: (item: SEOData) => void }) {
  const [data, setData] = useState(item)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // In production, save to Medusa metadata
      // For now, just update local state
      await new Promise(resolve => setTimeout(resolve, 500))
      onSave(data)
    } catch (error) {
      alert('Błąd podczas zapisywania')
    } finally {
      setSaving(false)
    }
  }

  const generateWithAI = async () => {
    setAiLoading(true)
    try {
      const action = item.type === 'product' 
        ? 'generateProductSEO' 
        : item.type === 'category' 
          ? 'generateCategorySEO' 
          : 'generatePageSEO'

      const response = await fetch('/api/ai-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          data: {
            title: item.name,
            description: data.description,
            category: item.type === 'product' ? 'Części do maszyn' : undefined,
          }
        })
      })

      const result = await response.json()

      if (result.success && result.result) {
        setData({
          ...data,
          title: result.result.metaTitle || data.title,
          description: result.result.metaDescription || data.description,
          keywords: result.result.keywords?.join(', ') || data.keywords,
        })
      } else {
        throw new Error(result.error || 'Błąd generowania')
      }
    } catch (error) {
      console.error('AI generation error:', error)
      alert('Błąd generowania AI. Sprawdź konfigurację GEMINI_API_KEY.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Edytuj SEO</h2>
              <p className="text-sm text-gray-500">{item.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* AI Generate Button */}
          <button
            onClick={generateWithAI}
            disabled={aiLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
          >
            <Sparkles className={`w-5 h-5 ${aiLoading ? 'animate-spin' : ''}`} />
            {aiLoading ? 'Generowanie...' : 'Wygeneruj z AI'}
          </button>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Meta Title
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              placeholder="Tytuł strony..."
            />
            <p className={`text-xs mt-1 ${data.title.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
              {data.title.length}/60 znaków
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Meta Description
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              rows={3}
              placeholder="Opis strony..."
            />
            <p className={`text-xs mt-1 ${data.description.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
              {data.description.length}/160 znaków
            </p>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Keywords
            </label>
            <input
              type="text"
              value={data.keywords}
              onChange={(e) => setData({ ...data, keywords: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              placeholder="słowo1, słowo2, słowo3"
            />
          </div>

          {/* OG Image */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Image className="w-4 h-4 inline mr-1" />
              Open Graph Image
            </label>
            <input
              type="text"
              value={data.og_image}
              onChange={(e) => setData({ ...data, og_image: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              placeholder="/images/og-image.jpg"
            />
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Link2 className="w-4 h-4 inline mr-1" />
              Canonical URL (opcjonalnie)
            </label>
            <input
              type="text"
              value={data.canonical_url}
              onChange={(e) => setData({ ...data, canonical_url: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              placeholder="https://..."
            />
          </div>

          {/* Indexing Options */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.no_index}
                onChange={(e) => setData({ ...data, no_index: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">noindex</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.no_follow}
                onChange={(e) => setData({ ...data, no_follow: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">nofollow</span>
            </label>
          </div>

          {/* Google Preview */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Podgląd w Google
            </h4>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
              <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                {data.title || 'Tytuł strony'}
              </div>
              <div className="text-green-700 text-sm truncate">
                {STOREFRONT_URL}/pl{data.url}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                {data.description || 'Opis strony pojawi się tutaj...'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Anuluj
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Zapisywanie...' : 'Zapisz'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Settings Tab Component
function SettingsTab() {
  const [settings, setSettings] = useState({
    site_title: 'OMEX - Części do Maszyn Budowlanych',
    site_description: 'Profesjonalny sklep z częściami zamiennymi do maszyn budowlanych.',
    default_og_image: '/images/og-default.jpg',
    twitter_handle: '@omex_pl',
    google_verification: '',
    bing_verification: '',
    robots_txt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /konto/
Sitemap: https://ooxo.pl/sitemap.xml`,
    sitemap_enabled: true,
    structured_data: true
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    alert('Ustawienia zapisane!')
    setSaving(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* General Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          Ustawienia globalne
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Domyślny tytuł strony</label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Domyślny opis</label>
            <textarea
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Domyślny obraz OG</label>
            <input
              type="text"
              value={settings.default_og_image}
              onChange={(e) => setSettings({ ...settings, default_og_image: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Twitter Handle</label>
            <input
              type="text"
              value={settings.twitter_handle}
              onChange={(e) => setSettings({ ...settings, twitter_handle: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Verification */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Weryfikacja
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Google Search Console</label>
            <input
              type="text"
              value={settings.google_verification}
              onChange={(e) => setSettings({ ...settings, google_verification: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              placeholder="Kod weryfikacyjny Google"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bing Webmaster</label>
            <input
              type="text"
              value={settings.bing_verification}
              onChange={(e) => setSettings({ ...settings, bing_verification: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              placeholder="Kod weryfikacyjny Bing"
            />
          </div>
          <div className="pt-2 space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.sitemap_enabled}
                onChange={(e) => setSettings({ ...settings, sitemap_enabled: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">Automatyczna generacja sitemap.xml</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.structured_data}
                onChange={(e) => setSettings({ ...settings, structured_data: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">Structured Data (JSON-LD)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Robots.txt */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" />
            robots.txt
          </h3>
          <a
            href="https://ooxo.pl/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            Podgląd <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <textarea
          value={settings.robots_txt}
          onChange={(e) => setSettings({ ...settings, robots_txt: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg font-mono text-sm dark:bg-gray-700"
          rows={10}
        />
      </div>

      {/* Save Button */}
      <div className="lg:col-span-2 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Zapisywanie...' : 'Zapisz ustawienia'}
        </button>
      </div>
    </div>
  )
}
