"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Plus, Edit, Trash2, FileText, Eye, Globe, Database, CheckCircle, XCircle, ExternalLink, RefreshCw } from "lucide-react"
import api from "@/lib/api-client"
import { isAuthenticated } from "@/lib/auth"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const STOREFRONT_URL = process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000"

interface Page {
  id: string
  title: string
  slug: string
  content: string
  status: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export default function CMSPagesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [loadingStorefront, setLoadingStorefront] = useState(false)
  const [pages, setPages] = useState<Page[]>([])
  const [storefrontPages, setStorefrontPages] = useState<Page[]>([])
  const [viewMode, setViewMode] = useState<'admin' | 'storefront'>('admin')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadPages()
  }, [router])

  const loadPages = async () => {
    try {
      setLoading(true)
      const response = await api.getPages()
      setPages(response.pages || [])
    } catch (error) {
      console.error("Error loading pages:", error)
    } finally {
      setLoading(false)
    }
  }

  // Pobierz strony ze storefront (publiczny endpoint)
  const loadStorefrontPages = async () => {
    try {
      setLoadingStorefront(true)
      const res = await fetch(`${BACKEND_URL}/public/cms/pages`)
      if (res.ok) {
        const data = await res.json()
        setStorefrontPages(data.pages || [])
      }
    } catch (error) {
      console.error("Error loading storefront pages:", error)
    } finally {
      setLoadingStorefront(false)
    }
  }

  useEffect(() => {
    if (viewMode === 'storefront') {
      loadStorefrontPages()
    }
  }, [viewMode])

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tę stronę?")) return
    
    try {
      await api.deletePage(id)
      await loadPages()
    } catch (error) {
      console.error("Error deleting page:", error)
      alert("Błąd podczas usuwania strony")
    }
  }

  const displayPages = viewMode === 'storefront' ? storefrontPages : pages

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Strony CMS</h1>
            <p className="text-gray-600 mt-1">Zarządzaj treścią statycznych stron</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                loadPages()
                if (viewMode === 'storefront') loadStorefrontPages()
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Odśwież"
            >
              <RefreshCw className={`w-5 h-5 ${loading || loadingStorefront ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => router.push("/cms/pages/new")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Nowa Strona
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border">
          <span className="text-sm font-medium text-gray-600">Widok:</span>
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-2 px-4 py-2 text-sm ${
                viewMode === 'admin' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Database className="w-4 h-4" />
              Admin (wszystkie)
            </button>
            <button
              onClick={() => setViewMode('storefront')}
              className={`flex items-center gap-2 px-4 py-2 text-sm ${
                viewMode === 'storefront' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Globe className="w-4 h-4" />
              Storefront (opublikowane)
            </button>
          </div>
          
          {viewMode === 'storefront' && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              Pokazuje tylko opublikowane strony widoczne na storefront
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Wszystkie strony</p>
            <p className="text-2xl font-bold">{pages.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Opublikowane</p>
            <p className="text-2xl font-bold">{pages.filter(p => p.is_published || p.status === 'published').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600">Szkice</p>
            <p className="text-2xl font-bold">{pages.filter(p => !p.is_published && p.status !== 'published').length}</p>
          </div>
        </div>

        {loadingStorefront && viewMode === 'storefront' ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tytuł</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  {viewMode === 'admin' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Storefront</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ostatnia aktualizacja</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayPages.map((page) => {
                  const isOnStorefront = viewMode === 'admin' 
                    ? storefrontPages.some(sp => sp.id === page.id || sp.slug === page.slug)
                    : true
                  const isPublished = page.is_published || page.status === 'published'
                  
                  return (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{page.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">/{page.slug}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isPublished 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {isPublished ? "Opublikowana" : "Szkic"}
                        </span>
                      </td>
                      {viewMode === 'admin' && (
                        <td className="px-6 py-4">
                          {isOnStorefront ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs">Widoczna</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400">
                              <XCircle className="w-4 h-4" />
                              <span className="text-xs">Ukryta</span>
                            </span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(page.updated_at).toLocaleDateString("pl-PL")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => window.open(`${STOREFRONT_URL}/pl/${page.slug}`, "_blank")}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Otwórz w storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/cms/pages/${page.id}/edit`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edytuj"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {viewMode === 'admin' && (
                            <button
                              onClick={() => handleDelete(page.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Usuń"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            {displayPages.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>
                  {viewMode === 'storefront' 
                    ? 'Brak opublikowanych stron na storefront.'
                    : 'Brak stron. Dodaj pierwszą stronę.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
