"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Save, ArrowLeft } from "lucide-react"
import api from "@/lib/api-client"
import { isAuthenticated } from "@/lib/auth"

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    description: "",
    parent_category_id: "",
    is_active: true,
    rank: 0,
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadData()
  }, [router, params.id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [categoryResponse, categoriesResponse] = await Promise.all([
        api.getCategory(params.id as string),
        api.getCategories()
      ])
      
      const category = categoryResponse.product_category
      setFormData({
        name: category.name || "",
        handle: category.handle || "",
        description: category.description || "",
        parent_category_id: category.parent_category_id || "",
        is_active: category.is_active ?? true,
        rank: category.rank || 0,
      })
      
      setCategories((categoriesResponse.product_categories || []).filter((c: any) => c.id !== params.id))
    } catch (error) {
      console.error("Error loading category:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      
      const data: any = {
        name: formData.name,
        handle: formData.handle,
        is_active: formData.is_active,
        rank: formData.rank,
      }
      
      if (formData.description) {
        data.description = formData.description
      }
      
      if (formData.parent_category_id) {
        data.parent_category_id = formData.parent_category_id
      }
      
      await api.updateCategory(params.id as string, data)
      router.push("/categories")
    } catch (error) {
      console.error("Error updating category:", error)
      alert("Błąd podczas aktualizacji kategorii")
    } finally {
      setSaving(false)
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
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edytuj Kategorię</h1>
            <p className="text-gray-600 mt-1">Modyfikuj ustawienia kategorii</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nazwa Kategorii *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handle (URL)
              </label>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opis
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoria Nadrzędna
              </label>
              <select
                value={formData.parent_category_id}
                onChange={(e) => setFormData({ ...formData, parent_category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Brak (kategoria główna)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kolejność
              </label>
              <input
                type="number"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Kategoria aktywna
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? <LoadingSpinner size="sm" /> : <Save className="w-5 h-5" />}
              Zapisz Zmiany
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
