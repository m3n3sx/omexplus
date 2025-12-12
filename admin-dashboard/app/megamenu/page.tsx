"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Save, Plus, Edit, Trash2, Menu } from "lucide-react"
import api from "@/lib/api-client"
import { isAuthenticated } from "@/lib/auth"

interface MenuItem {
  id: string
  name: string
  icon: string
  slug: string
  priority?: string
  salesPercent?: string
  subcategories: string[]
}

export default function MegaMenuPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadMenuItems()
  }, [router])

  const loadMenuItems = async () => {
    try {
      setLoading(true)
      const response = await api.getMegaMenuSettings()
      setMenuItems(response.menuItems || [])
    } catch (error) {
      console.error("Error loading menu items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.updateMegaMenuSettings({ menuItems })
      alert("Menu zapisane pomyślnie!")
    } catch (error) {
      console.error("Error saving menu:", error)
      alert("Błąd podczas zapisywania menu")
    } finally {
      setSaving(false)
    }
  }

  const handleAddItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: "",
      icon: "",
      slug: "",
      subcategories: []
    }
    setEditingItem(newItem)
    setShowAddForm(true)
  }

  const handleSaveItem = () => {
    if (!editingItem) return
    
    if (showAddForm) {
      setMenuItems([...menuItems, editingItem])
    } else {
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ))
    }
    
    setEditingItem(null)
    setShowAddForm(false)
  }

  const handleDeleteItem = (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten element menu?")) return
    setMenuItems(menuItems.filter(item => item.id !== id))
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
            <h1 className="text-2xl font-bold text-gray-900">Zarządzanie Mega Menu</h1>
            <p className="text-gray-600 mt-1">Edytuj strukturę głównego menu kategorii</p>
          </div>
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Dodaj Element
          </button>
        </div>

        {/* Edit Form */}
        {editingItem && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold">
              {showAddForm ? "Nowy Element Menu" : "Edytuj Element"}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nazwa</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ikona (3 litery)</label>
                <input
                  type="text"
                  value={editingItem.icon}
                  onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                  maxLength={3}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={editingItem.slug}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priorytet</label>
                <select
                  value={editingItem.priority || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Brak</option>
                  <option value="⭐⭐⭐">⭐⭐⭐</option>
                  <option value="⭐⭐">⭐⭐</option>
                  <option value="⭐">⭐</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Podkategorie (jedna na linię)
              </label>
              <textarea
                value={editingItem.subcategories.join("\n")}
                onChange={(e) => setEditingItem({ 
                  ...editingItem, 
                  subcategories: e.target.value.split("\n").filter(s => s.trim())
                })}
                rows={6}
                className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Zapisz Element
              </button>
              <button
                onClick={() => {
                  setEditingItem(null)
                  setShowAddForm(false)
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Anuluj
              </button>
            </div>
          </div>
        )}

        {/* Menu Items List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-mono font-bold">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">/{item.slug}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.subcategories.length} podkategorii
                      {item.priority && ` • ${item.priority}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <LoadingSpinner size="sm" /> : <Save className="w-5 h-5" />}
              Zapisz Wszystkie Zmiany
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
