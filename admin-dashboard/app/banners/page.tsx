"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, EyeOff } from "lucide-react"
import api from "@/lib/api-client"
import { isAuthenticated } from "@/lib/auth"

interface Banner {
  id: string
  title: string
  image_url: string
  link_url?: string
  position: string
  is_active: boolean
  priority: number
}

export default function BannersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState<Banner[]>([])
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadBanners()
  }, [router])

  const loadBanners = async () => {
    try {
      setLoading(true)
      const response = await api.getBanners()
      setBanners(response.banners || [])
    } catch (error) {
      console.error("Error loading banners:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    try {
      await api.updateBanner(banner.id, { is_active: !banner.is_active })
      await loadBanners()
    } catch (error) {
      console.error("Error updating banner:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten banner?")) return
    
    try {
      await api.deleteBanner(id)
      await loadBanners()
    } catch (error) {
      console.error("Error deleting banner:", error)
      alert("Błąd podczas usuwania bannera")
    }
  }

  const handleSaveBanner = async () => {
    if (!editingBanner) return
    
    try {
      if (editingBanner.id.startsWith("new-")) {
        await api.createBanner(editingBanner)
      } else {
        await api.updateBanner(editingBanner.id, editingBanner)
      }
      setEditingBanner(null)
      await loadBanners()
    } catch (error) {
      console.error("Error saving banner:", error)
      alert("Błąd podczas zapisywania bannera")
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bannery</h1>
            <p className="text-gray-600 mt-1">Zarządzaj bannerami promocyjnymi</p>
          </div>
          <button
            onClick={() => setEditingBanner({
              id: `new-${Date.now()}`,
              title: "",
              image_url: "",
              position: "home-hero",
              is_active: true,
              priority: 0
            })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Dodaj Banner
          </button>
        </div>

        {editingBanner && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold">
              {editingBanner.id.startsWith("new-") ? "Nowy Banner" : "Edytuj Banner"}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tytuł</label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pozycja</label>
                <select
                  value={editingBanner.position}
                  onChange={(e) => setEditingBanner({ ...editingBanner, position: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="home-hero">Strona główna - Hero</option>
                  <option value="home-secondary">Strona główna - Sekundarne</option>
                  <option value="category-top">Kategoria - Góra</option>
                  <option value="sidebar">Sidebar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL Obrazka</label>
                <input
                  type="text"
                  value={editingBanner.image_url}
                  onChange={(e) => setEditingBanner({ ...editingBanner, image_url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Link (opcjonalny)</label>
                <input
                  type="text"
                  value={editingBanner.link_url || ""}
                  onChange={(e) => setEditingBanner({ ...editingBanner, link_url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="/promocje"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingBanner.is_active}
                  onChange={(e) => setEditingBanner({ ...editingBanner, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Aktywny</span>
              </label>
              
              <div className="flex items-center gap-2">
                <label className="text-sm">Priorytet:</label>
                <input
                  type="number"
                  value={editingBanner.priority}
                  onChange={(e) => setEditingBanner({ ...editingBanner, priority: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 border rounded"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveBanner}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Zapisz
              </button>
              <button
                onClick={() => setEditingBanner(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Anuluj
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {banner.image_url ? (
                  <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`p-2 rounded-lg ${
                      banner.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                    }`}
                  >
                    {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{banner.position}</p>
                <p className="text-xs text-gray-400 mt-1">Priorytet: {banner.priority}</p>
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setEditingBanner(banner)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {banners.length === 0 && !editingBanner && (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Brak bannerów. Dodaj pierwszy banner.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
