'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { VisualEditor, PageElement } from '@/components/cms'
import { apiClient } from '@/lib/api-client'
import { isAuthenticated } from '@/lib/auth'
import { ArrowLeft, Save, Eye, Settings, FileText } from 'lucide-react'
import Link from 'next/link'

export default function VisualEditorPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    }>
      <VisualEditorContent />
    </Suspense>
  )
}

function VisualEditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contentId = searchParams.get('id')
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [elements, setElements] = useState<PageElement[]>([])
  const [metadata, setMetadata] = useState({
    key: '',
    name: '',
    type: 'page',
    locale: 'pl',
    is_active: true
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    
    if (contentId) {
      loadContent()
    } else {
      setLoading(false)
    }
  }, [contentId, router])

  const loadContent = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get(`/admin/cms/${contentId}`)
      if (data.content) {
        setMetadata({
          key: data.content.key || '',
          name: data.content.name || '',
          type: data.content.type || 'page',
          locale: data.content.locale || 'pl',
          is_active: data.content.is_active ?? true
        })
        // Jeśli content ma elements, użyj ich, w przeciwnym razie konwertuj stary format
        if (data.content.content?.elements) {
          setElements(data.content.content.elements)
        } else if (data.content.content) {
          // Konwersja starego formatu na nowy
          setElements([{
            id: 'legacy_content',
            type: 'html',
            content: { code: JSON.stringify(data.content.content, null, 2) },
            style: {}
          }])
        }
      }
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!metadata.key || !metadata.name) {
      alert('Wypełnij klucz i nazwę')
      return
    }

    try {
      setSaving(true)
      
      const payload = {
        key: metadata.key,
        name: metadata.name,
        type: metadata.type,
        locale: metadata.locale,
        is_active: metadata.is_active,
        content: { elements }
      }

      if (contentId) {
        await apiClient.put(`/admin/cms/${contentId}`, payload)
      } else {
        await apiClient.post('/admin/cms', payload)
      }

      router.push('/cms')
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Błąd podczas zapisywania')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/cms" 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {contentId ? 'Edytuj stronę' : 'Nowa strona'}
              </h1>
              <p className="text-sm text-gray-500">
                Wizualny edytor stron w stylu Elementor
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold">Ustawienia strony</h2>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Klucz (URL)</label>
              <input
                type="text"
                value={metadata.key}
                onChange={(e) => setMetadata({ ...metadata, key: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="strona-glowna"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa</label>
              <input
                type="text"
                value={metadata.name}
                onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Strona główna"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
              <select
                value={metadata.type}
                onChange={(e) => setMetadata({ ...metadata, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="page">Strona</option>
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="hero">Hero</option>
                <option value="section">Sekcja</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Język</label>
              <select
                value={metadata.locale}
                onChange={(e) => setMetadata({ ...metadata, locale: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="pl">Polski</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="uk">Українська</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <label className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={metadata.is_active}
                  onChange={(e) => setMetadata({ ...metadata, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm">Aktywna</span>
              </label>
            </div>
          </div>
        </div>

        {/* Visual Editor */}
        <VisualEditor
          elements={elements}
          onChange={setElements}
          onSave={handleSave}
        />
      </div>
    </DashboardLayout>
  )
}
