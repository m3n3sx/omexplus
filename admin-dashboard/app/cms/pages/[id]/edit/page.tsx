"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Save, ArrowLeft, Eye, ExternalLink, RefreshCw } from "lucide-react"
import api from "@/lib/api-client"
import { isAuthenticated } from "@/lib/auth"

const STOREFRONT_URL = process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000"
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export default function EditPagePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [storefrontData, setStorefrontData] = useState<any>(null)
  const [loadingStorefront, setLoadingStorefront] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    meta_description: "",
    is_published: false,
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadPage()
  }, [router, params.id])

  const loadPage = async () => {
    try {
      setLoading(true)
      const response = await api.getPage(params.id as string)
      const page = response.page
      setFormData({
        title: page.title || "",
        slug: page.slug || "",
        content: typeof page.content === 'string' ? page.content : JSON.stringify(page.content, null, 2),
        meta_description: page.meta_description || "",
        is_published: page.is_published ?? page.status === 'published',
      })
    } catch (error) {
      console.error("Error loading page:", error)
    } finally {
      setLoading(false)
    }
  }

  // Pobierz dane ze storefront (publiczny endpoint)
  const loadStorefrontData = async () => {
    if (!formData.slug) return
    
    try {
      setLoadingStorefront(true)
      const res = await fetch(`${BACKEND_URL}/public/cms/pages?slug=${formData.slug}`)
      if (res.ok) {
        const data = await res.json()
        setStorefrontData(data.page || null)
      } else {
        setStorefrontData(null)
      }
    } catch (error) {
      console.error("Error loading storefront data:", error)
      setStorefrontData(null)
    } finally {
      setLoadingStorefront(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      await api.updatePage(params.id as string, formData)
      router.push("/cms/pages")
    } catch (error) {
      console.error("Error updating page:", error)
      alert("Błąd podczas aktualizacji strony")
    } finally {
      setSaving(false)
    }
  }

  const openInStorefront = () => {
    if (formData.slug) {
      window.open(`${STOREFRONT_URL}/pl/${formData.slug}`, "_blank")
    }
  }

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
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edytuj Stronę</h1>
              <p className="text-gray-600 mt-1">/{formData.slug}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowPreview(!showPreview)
                if (!showPreview) loadStorefrontData()
              }}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Ukryj podgląd" : "Podgląd storefront"}
            </button>
            <button
              type="button"
              onClick={openInStorefront}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <ExternalLink className="w-4 h-4" />
              Otwórz w storefront
            </button>
          </div>
        </div>

        <div className={`grid gap-6 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {/* Formularz edycji */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tytuł Strony *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description (SEO)
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Opis strony dla wyszukiwarek..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treść Strony (HTML/JSON)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                Opublikuj stronę
              </label>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? <LoadingSpinner size="sm" /> : <Save className="w-5 h-5" />}
                Zapisz Zmiany
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Anuluj
              </button>
            </div>
          </form>

          {/* Podgląd storefront */}
          {showPreview && (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Podgląd ze Storefront</h3>
                <button
                  onClick={loadStorefrontData}
                  disabled={loadingStorefront}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Odśwież"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingStorefront ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              {loadingStorefront ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : storefrontData ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Strona jest widoczna na storefront
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Tytuł:</span>
                      <p className="font-medium">{storefrontData.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Slug:</span>
                      <p className="font-mono text-sm">/{storefrontData.slug}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        storefrontData.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {storefrontData.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Ostatnia aktualizacja:</span>
                      <p className="text-sm">{new Date(storefrontData.updated_at).toLocaleString('pl-PL')}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <span className="text-sm text-gray-500">Podgląd treści:</span>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-64 overflow-auto">
                      <pre className="text-xs whitespace-pre-wrap">
                        {typeof storefrontData.content === 'string' 
                          ? storefrontData.content 
                          : JSON.stringify(storefrontData.content, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠ Strona nie jest jeszcze widoczna na storefront.
                    {!formData.is_published && " Upewnij się, że strona jest opublikowana."}
                  </p>
                </div>
              )}
              
              {/* iframe preview */}
              {formData.is_published && formData.slug && (
                <div className="border-t pt-4">
                  <span className="text-sm text-gray-500 mb-2 block">Podgląd na żywo:</span>
                  <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
                    <iframe
                      src={`${STOREFRONT_URL}/pl/${formData.slug}`}
                      className="w-full h-full"
                      title="Podgląd strony"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
