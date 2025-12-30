'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import { 
  FileText, Layout, Menu, Plus, RefreshCw, Globe, Database, 
  CheckCircle, XCircle, Wand2, ExternalLink, Settings, Image,
  Navigation, Layers, Eye, Edit, Trash2
} from 'lucide-react'
import { isAuthenticated } from '@/lib/auth'

const STOREFRONT_URL = process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000"
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export default function CMSPage() {
  const router = useRouter()
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ type: '', locale: 'pl' })
  const [stats, setStats] = useState({ pages: 0, components: 0, active: 0 })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    loadContents()
  }, [filter, router])

  const loadContents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter.type) params.append('type', filter.type)
      if (filter.locale) params.append('locale', filter.locale)
      
      const data = await apiClient.get(`/admin/cms?${params}`)
      const items = data.contents || []
      setContents(items)
      
      setStats({
        pages: items.filter((c: any) => c.type === 'page').length,
        components: items.filter((c: any) => ['header', 'footer', 'menu', 'hero', 'widget'].includes(c.type)).length,
        active: items.filter((c: any) => c.is_active).length,
      })
    } catch (error) {
      console.error('Failed to load CMS contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteContent = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten element?')) return
    try {
      await apiClient.delete(`/admin/cms/${id}`)
      loadContents()
    } catch (error) {
      console.error('Failed to delete content:', error)
      alert('Błąd podczas usuwania')
    }
  }

  const types = ['page', 'header', 'footer', 'menu', 'hero', 'section', 'banner', 'widget', 'text', 'image', 'button', 'custom']

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CMS - System Zarządzania Treścią</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Zarządzaj wszystkimi elementami frontendu sklepu
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadContents}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="Odśwież"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/cms/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Nowy Element
            </Link>
            <Link
              href="/cms/visual-editor"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
            >
              <Wand2 className="w-5 h-5" />
              Visual Editor
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{contents.length}</p>
                <p className="text-sm text-gray-500">Wszystkie elementy</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pages}</p>
                <p className="text-sm text-gray-500">Strony</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Layout className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.components}</p>
                <p className="text-sm text-gray-500">Komponenty</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                <p className="text-sm text-gray-500">Aktywne</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/cms/storefront" className="group flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:border-green-400 transition-all hover:shadow-lg">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-300">Strony Storefront</h3>
              <p className="text-sm text-green-600 dark:text-green-400">Wszystkie strony sklepu</p>
            </div>
          </Link>
          
          <Link href="/cms/visual-editor" className="group flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:border-purple-400 transition-all hover:shadow-lg">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-300">Visual Editor</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">Buduj strony wizualnie</p>
            </div>
          </Link>
          
          <Link href="/megamenu" className="group flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:border-blue-400 transition-all hover:shadow-lg">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-300">Menu & Nawigacja</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">Edytuj menu sklepu</p>
            </div>
          </Link>
          
          <Link href="/banners" className="group flex items-center gap-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800 hover:border-orange-400 transition-all hover:shadow-lg">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl group-hover:scale-110 transition-transform">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-300">Banery</h3>
              <p className="text-sm text-orange-600 dark:text-orange-400">Zarządzaj banerami</p>
            </div>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center">
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Wszystkie typy</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={filter.locale}
            onChange={(e) => setFilter({ ...filter, locale: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="pl">🇵🇱 Polski</option>
            <option value="en">🇬🇧 English</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="uk">🇺🇦 Українська</option>
          </select>
          
          <a
            href={STOREFRONT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          >
            <ExternalLink className="w-4 h-4" />
            Otwórz Storefront
          </a>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            Ładowanie...
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nazwa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Typ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Język</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {contents.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{content.name}</div>
                      {content.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{content.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {content.key}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        content.type === 'page' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                        content.type === 'header' || content.type === 'footer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        content.type === 'hero' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {content.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {content.locale === 'pl' ? '🇵🇱' : content.locale === 'en' ? '🇬🇧' : content.locale === 'de' ? '🇩🇪' : '🇺🇦'} {content.locale}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        content.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {content.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {content.is_active ? 'Aktywny' : 'Nieaktywny'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        {content.type === 'page' && (
                          <a
                            href={`${STOREFRONT_URL}/${content.locale}/${content.key.replace('page-', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            title="Podgląd"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href={`/cms/visual-editor?id=${content.id}`}
                          className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
                          title="Visual Editor"
                        >
                          <Wand2 className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/cms/${content.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          title="Edytuj"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteContent(content.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Usuń"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {contents.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Database className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>Brak elementów CMS</p>
                <Link
                  href="/cms/storefront"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj pierwszy element
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
