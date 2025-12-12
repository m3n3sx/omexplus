"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Plus, Edit, Trash2, FileText, Eye } from "lucide-react"
import api from "@/lib/api-client"
import { isAuthenticated } from "@/lib/auth"

interface Page {
  id: string
  title: string
  slug: string
  content: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export default function CMSPagesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState<Page[]>([])

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
          <button
            onClick={() => router.push("/cms/pages/new")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Nowa Strona
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tytuł</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ostatnia aktualizacja</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{page.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">/{page.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      page.is_published 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {page.is_published ? "Opublikowana" : "Szkic"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(page.updated_at).toLocaleDateString("pl-PL")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => window.open(`/pl/${page.slug}`, "_blank")}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Podgląd"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/cms/pages/${page.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edytuj"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
          
          {pages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Brak stron. Dodaj pierwszą stronę.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
