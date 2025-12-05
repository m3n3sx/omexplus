'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'

export default function CMSPage() {
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ type: '', locale: 'pl' })

  useEffect(() => {
    loadContents()
  }, [filter])

  const loadContents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter.type) params.append('type', filter.type)
      if (filter.locale) params.append('locale', filter.locale)
      
      const data = await apiClient.get(`/admin/cms?${params}`)
      setContents(data.contents || [])
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

  const types = ['header', 'footer', 'menu', 'hero', 'section', 'banner', 'widget', 'text', 'image', 'button', 'custom']

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">CMS - Zarządzanie Treścią</h1>
            <p className="text-gray-600 mt-1">Edytuj wszystkie elementy frontendu</p>
          </div>
          <Link
            href="/cms/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Dodaj Element
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow flex gap-4">
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Wszystkie typy</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={filter.locale}
            onChange={(e) => setFilter({ ...filter, locale: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="pl">Polski</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="uk">Українська</option>
          </select>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="text-center py-12">Ładowanie...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nazwa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Typ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Język</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contents.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{content.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{content.key}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {content.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{content.locale}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        content.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {content.is_active ? 'Aktywny' : 'Nieaktywny'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/cms/${content.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edytuj
                      </Link>
                      <button
                        onClick={() => deleteContent(content.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {contents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Brak elementów CMS. Dodaj pierwszy element.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
