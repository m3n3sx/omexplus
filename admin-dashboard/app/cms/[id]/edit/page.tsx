'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { apiClient } from '@/lib/api-client'
import SimplePageEditor, { ContentBlock } from '@/components/cms/SimplePageEditor'
import BlockPreview from '@/components/cms/BlockPreview'
import Link from 'next/link'
import { 
  ArrowLeft, Save, ExternalLink, Eye, EyeOff, Settings, 
  FileText, Globe, Calendar, User, CheckCircle, XCircle,
  Wand2, Code
} from 'lucide-react'

const STOREFRONT_URL = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'

export default function EditCMSContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'preview'>('content')
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    loadContent()
  }, [id])

  const loadContent = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get(`/admin/cms/${id}`)
      setFormData(data.content)
      
      // Konwertuj content na bloki jeśli istnieją
      if (data.content?.content?.blocks) {
        setBlocks(data.content.content.blocks)
      } else if (data.content?.content?.elements) {
        // Konwersja z Visual Editor format
        setBlocks(convertElementsToBlocks(data.content.content.elements))
      }
    } catch (error) {
      console.error('Failed to load content:', error)
      alert('Błąd podczas ładowania')
    } finally {
      setLoading(false)
    }
  }

  // Konwersja elementów Visual Editor na bloki
  const convertElementsToBlocks = (elements: any[]): ContentBlock[] => {
    return elements.map((el, i) => {
      const id = el.id || `block_${Date.now()}_${i}`
      switch (el.type) {
        case 'heading':
          return { id, type: 'heading' as const, data: { text: el.content?.text || '', level: el.content?.level || 'h2', align: el.style?.textAlign || 'left' } }
        case 'text':
          return { id, type: 'text' as const, data: { html: el.content?.html || '', align: el.style?.textAlign || 'left' } }
        case 'image':
          return { id, type: 'image' as const, data: { src: el.content?.src || '', alt: el.content?.alt || '', caption: el.content?.caption || '' } }
        case 'button':
          return { id, type: 'button' as const, data: { text: el.content?.text || '', url: el.content?.url || '', style: 'primary' } }
        case 'divider':
          return { id, type: 'divider' as const, data: { style: 'solid' } }
        case 'spacer':
          return { id, type: 'divider' as const, data: { style: 'solid' } }
        default:
          return { id, type: 'text' as const, data: { html: `<p>${JSON.stringify(el.content)}</p>` } }
      }
    }).filter(b => b.type)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    try {
      setSaving(true)
      
      // Zapisz bloki w content
      const updatedFormData = {
        ...formData,
        content: {
          ...formData.content,
          blocks: blocks
        }
      }
      
      await apiClient.put(`/admin/cms/${id}`, updatedFormData)
      router.push('/cms')
    } catch (error) {
      console.error('Failed to update content:', error)
      alert('Błąd podczas zapisywania')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !formData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Ładowanie...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const getPageUrl = () => {
    if (!formData.key) return null
    const path = formData.key.replace('page-', '').replace('storefront-', '')
    return `${STOREFRONT_URL}/${formData.locale || 'pl'}/${path}`
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{formData.name || 'Edycja strony'}</h1>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {formData.type === 'page' ? 'Strona' : formData.type}
                {formData.is_active ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-3 h-3" /> Aktywna
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400">
                    <XCircle className="w-3 h-3" /> Nieaktywna
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getPageUrl() && (
              <a
                href={getPageUrl()!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Podgląd
              </a>
            )}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showAdvanced ? 'bg-gray-100 border-gray-300' : 'hover:bg-gray-50'
              }`}
              title="Opcje zaawansowane"
            >
              <Code className="w-4 h-4" />
              Zaawansowane
            </button>
            <button
              onClick={() => handleSubmit()}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'content' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Treść
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'preview' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            Podgląd
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'settings' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            Ustawienia
          </button>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <SimplePageEditor
              blocks={blocks}
              onChange={setBlocks}
              onSave={() => handleSubmit()}
            />
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="max-w-3xl mx-auto">
              {blocks.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Brak treści do wyświetlenia</p>
                  <p className="text-sm">Dodaj bloki w zakładce "Treść"</p>
                </div>
              ) : (
                <BlockPreview blocks={blocks} />
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nazwa strony
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nazwa wyświetlana w CMS"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Język
                </label>
                <select
                  value={formData.locale || 'pl'}
                  onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pl">🇵🇱 Polski</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="de">🇩🇪 Deutsch</option>
                  <option value="uk">🇺🇦 Українська</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opis strony (SEO)
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Krótki opis strony dla wyszukiwarek"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Strona aktywna</span>
                  <p className="text-sm text-gray-500">Strona będzie widoczna dla użytkowników</p>
                </div>
              </label>
            </div>

            {/* Zaawansowane opcje */}
            {showAdvanced && (
              <div className="pt-6 border-t space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Opcje zaawansowane
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Klucz (key)
                    </label>
                    <input
                      type="text"
                      value={formData.key || ''}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                      placeholder="page-nazwa"
                    />
                    <p className="text-xs text-gray-500 mt-1">Unikalny identyfikator strony</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Typ
                    </label>
                    <select
                      value={formData.type || 'page'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="page">Strona</option>
                      <option value="header">Nagłówek</option>
                      <option value="footer">Stopka</option>
                      <option value="menu">Menu</option>
                      <option value="section">Sekcja</option>
                      <option value="banner">Baner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kolejność sortowania
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order || 0}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                    className="w-32 px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Link do Visual Editor */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wand2 className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">Visual Editor</p>
                        <p className="text-sm text-purple-700">Zaawansowany edytor wizualny z większą kontrolą</p>
                      </div>
                    </div>
                    <Link
                      href={`/cms/visual-editor?id=${id}`}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                    >
                      Otwórz
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
