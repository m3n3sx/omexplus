'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { apiClient } from '@/lib/api-client'
import CMSContentEditor from '@/components/cms/CMSContentEditor'

export default function NewCMSContentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    key: '',
    type: 'section',
    name: '',
    description: '',
    content: {},
    is_active: true,
    sort_order: 0,
    locale: 'pl',
    metadata: {}
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await apiClient.post('/admin/cms', formData)
      router.push('/cms')
    } catch (error) {
      console.error('Failed to create content:', error)
      alert('Błąd podczas tworzenia elementu')
    } finally {
      setLoading(false)
    }
  }

  const types = ['header', 'footer', 'menu', 'hero', 'section', 'banner', 'widget', 'text', 'image', 'button', 'custom']

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Nowy Element CMS</h1>
          <p className="text-gray-600 mt-1">Dodaj nowy element do zarządzania treścią</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Key (identyfikator)</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="np. main-header"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Typ</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nazwa</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Nazwa wyświetlana w panelu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Opis</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                placeholder="Opcjonalny opis elementu"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Język</label>
                <select
                  value={formData.locale}
                  onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="pl">Polski</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="uk">Українська</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kolejność</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span>Aktywny</span>
                </label>
              </div>
            </div>
          </div>

          <CMSContentEditor
            type={formData.type}
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Zapisywanie...' : 'Zapisz'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
