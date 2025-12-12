"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Plus, Edit, Trash2, FolderTree } from "lucide-react"
import api from "@/lib/api-client"
import { isAuthenticated } from "@/lib/auth"

interface Category {
  id: string
  name: string
  handle: string
  description?: string
  parent_category_id?: string
  parent_category?: Category
  category_children?: Category[]
  is_active: boolean
  rank?: number
}

export default function CategoriesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadCategories()
  }, [router])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await api.getCategories({ 
        include_descendants_tree: true,
        limit: 1000
      })
      setCategories(response.product_categories || [])
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tę kategorię?")) return
    
    try {
      await api.deleteCategory(id)
      await loadCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Błąd podczas usuwania kategorii")
    }
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCategories(newExpanded)
  }

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.category_children && category.category_children.length > 0
    const isExpanded = expandedCategories.has(category.id)

    return (
      <div key={category.id}>
        <div
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          style={{ marginLeft: `${level * 2}rem` }}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? "▼" : "▶"}
              </button>
            )}
            {!hasChildren && <div className="w-6" />}
            
            <FolderTree className="w-5 h-5 text-blue-600" />
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">/{category.handle}</p>
              {category.description && (
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                category.is_active 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {category.is_active ? "Aktywna" : "Nieaktywna"}
              </span>
              
              {category.rank !== undefined && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Kolejność: {category.rank}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => router.push(`/categories/${category.id}/edit`)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edytuj"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Usuń"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2">
            {category.category_children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
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

  const rootCategories = categories.filter(cat => !cat.parent_category_id)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kategorie Produktów</h1>
            <p className="text-gray-600 mt-1">Zarządzaj hierarchią kategorii w sklepie</p>
          </div>
          <button
            onClick={() => router.push("/categories/new")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Dodaj Kategorię
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-2">
            {rootCategories.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FolderTree className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Brak kategorii. Dodaj pierwszą kategorię.</p>
              </div>
            ) : (
              rootCategories.map(category => renderCategory(category))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
