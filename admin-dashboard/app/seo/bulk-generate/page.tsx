'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { isAuthenticated } from '@/lib/auth'
import {
  Sparkles, Loader2, CheckCircle, XCircle, AlertCircle,
  Play, Pause, Package, FolderTree, ArrowLeft,
  RefreshCw, Filter, Settings2, ChevronDown, ChevronUp,
  MessageSquare, Globe, Zap, RotateCcw
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ooxo.pl'

interface Item {
  id: string
  title: string
  handle: string
  description?: string
  hasMetadata: boolean
  status: 'pending' | 'processing' | 'success' | 'error' | 'skipped'
  error?: string
  generatedContent?: any
}

interface GenerationOptions {
  customInstructions: string
  tone: 'professional' | 'friendly' | 'technical' | 'sales'
  language: 'pl' | 'en' | 'de'
  focusKeywords: string
  targetAudience: string
  includeEmoji: boolean
  regenerateExisting: boolean
}

const DEFAULT_OPTIONS: GenerationOptions = {
  customInstructions: '',
  tone: 'professional',
  language: 'pl',
  focusKeywords: '',
  targetAudience: '',
  includeEmoji: false,
  regenerateExisting: false,
}

export default function BulkGeneratePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')
  const [items, setItems] = useState<Item[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [processing, setProcessing] = useState(false)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [filter, setFilter] = useState<'all' | 'missing' | 'has' | 'error'>('missing')
  const [showOptions, setShowOptions] = useState(false)
  const [options, setOptions] = useState<GenerationOptions>(DEFAULT_OPTIONS)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    loadItems()
  }, [router, activeTab])

  const loadItems = async () => {
    setLoading(true)
    try {
      const endpoint = activeTab === 'products' 
        ? `${API_URL}/store/products?limit=500`
        : `${API_URL}/store/product-categories?limit=100`

      const response = await fetch(endpoint)
      const data = await response.json()

      const rawItems = activeTab === 'products' ? data.products : data.product_categories

      const mappedItems: Item[] = (rawItems || []).map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        handle: item.handle,
        description: item.description || item.subtitle,
        hasMetadata: !!(item.metadata?.seo_title || item.metadata?.seo_description),
        status: 'pending' as const,
      }))

      setItems(mappedItems)
      setSelectedIds(new Set())
    } catch (error) {
      console.error('Failed to load items:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item => {
    if (filter === 'missing') return !item.hasMetadata
    if (filter === 'has') return item.hasMetadata
    if (filter === 'error') return item.status === 'error'
    return true
  })

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const selectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredItems.map(i => i.id)))
    }
  }

  const selectMissing = () => {
    setSelectedIds(new Set(items.filter(i => !i.hasMetadata).map(i => i.id)))
  }

  const selectErrors = () => {
    setSelectedIds(new Set(items.filter(i => i.status === 'error').map(i => i.id)))
  }

  const startBulkGeneration = async () => {
    if (selectedIds.size === 0) return

    setProcessing(true)
    setPaused(false)
    
    let selectedItems = items.filter(i => selectedIds.has(i.id))
    
    // Filter out items with existing metadata if not regenerating
    if (!options.regenerateExisting) {
      selectedItems = selectedItems.filter(i => !i.hasMetadata)
    }
    
    setProgress({ current: 0, total: selectedItems.length })

    for (let i = 0; i < selectedItems.length; i++) {
      // Check if paused
      if (paused) {
        setProcessing(false)
        return
      }

      const item = selectedItems[i]
      setProgress({ current: i + 1, total: selectedItems.length })

      // Update status to processing
      setItems(prev => prev.map(p => 
        p.id === item.id ? { ...p, status: 'processing' } : p
      ))

      try {
        const action = activeTab === 'products' ? 'generateProductSEO' : 'generateCategorySEO'
        
        const apiOptions: any = {
          tone: options.tone,
          language: options.language,
          includeEmoji: options.includeEmoji,
        }
        
        if (options.customInstructions.trim()) {
          apiOptions.customInstructions = options.customInstructions
        }
        
        if (options.focusKeywords.trim()) {
          apiOptions.focusKeywords = options.focusKeywords.split(',').map(k => k.trim()).filter(Boolean)
        }
        
        if (options.targetAudience.trim()) {
          apiOptions.targetAudience = options.targetAudience
        }

        const response = await fetch('/api/ai-seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            data: {
              title: item.title,
              description: item.description,
              category: activeTab === 'products' ? 'Części do maszyn' : undefined,
            },
            options: apiOptions,
          })
        })

        const result = await response.json()

        if (result.success) {
          setItems(prev => prev.map(p => 
            p.id === item.id ? { 
              ...p, 
              status: 'success', 
              hasMetadata: true,
              generatedContent: result.result 
            } : p
          ))
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        setItems(prev => prev.map(p => 
          p.id === item.id ? { 
            ...p, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          } : p
        ))
      }

      // Rate limiting
      if (i < selectedItems.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      }
    }

    setProcessing(false)
  }

  const pauseGeneration = () => {
    setPaused(true)
  }

  const resetStatuses = () => {
    setItems(prev => prev.map(p => ({ ...p, status: 'pending', error: undefined })))
  }

  const getStatusIcon = (status: Item['status']) => {
    switch (status) {
      case 'processing': return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      case 'skipped': return <AlertCircle className="w-4 h-4 text-gray-400" />
      default: return null
    }
  }

  const stats = {
    total: items.length,
    withSEO: items.filter(i => i.hasMetadata).length,
    withoutSEO: items.filter(i => !i.hasMetadata).length,
    success: items.filter(i => i.status === 'success').length,
    errors: items.filter(i => i.status === 'error').length,
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-500">Ładowanie...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/seo')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bulk AI SEO Generator
              </h1>
              <p className="text-gray-500">
                Automatyczne generowanie treści SEO dla wielu elementów
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetStatuses}
              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"
              title="Resetuj statusy"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={loadItems}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Odśwież
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">Wszystkich</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
            <div className="text-2xl font-bold text-green-600">{stats.withSEO}</div>
            <div className="text-sm text-gray-500">Z SEO</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
            <div className="text-2xl font-bold text-yellow-600">{stats.withoutSEO}</div>
            <div className="text-sm text-gray-500">Bez SEO</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            <div className="text-sm text-gray-500">Wygenerowano</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border cursor-pointer hover:bg-red-50" onClick={selectErrors}>
            <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
            <div className="text-sm text-gray-500">Błędy (kliknij)</div>
          </div>
        </div>

        {/* AI Options Panel */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Settings2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Opcje generowania AI</h3>
                <p className="text-sm text-gray-500">Dostosuj instrukcje, ton i język</p>
              </div>
            </div>
            {showOptions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showOptions && (
            <div className="p-4 pt-0 space-y-4 border-t border-purple-200 dark:border-purple-800">
              {/* Custom Instructions */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  Dodatkowe instrukcje dla AI
                </label>
                <textarea
                  value={options.customInstructions}
                  onChange={(e) => setOptions({ ...options, customInstructions: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                  rows={3}
                  placeholder="np. Podkreślaj jakość niemiecką, używaj słów: premium, profesjonalny, niezawodny..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tone */}
                <div>
                  <label className="block text-sm font-medium mb-2">Ton komunikacji</label>
                  <select
                    value={options.tone}
                    onChange={(e) => setOptions({ ...options, tone: e.target.value as any })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                  >
                    <option value="professional">Profesjonalny</option>
                    <option value="friendly">Przyjazny</option>
                    <option value="technical">Techniczny</option>
                    <option value="sales">Sprzedażowy</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Język
                  </label>
                  <select
                    value={options.language}
                    onChange={(e) => setOptions({ ...options, language: e.target.value as any })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                  >
                    <option value="pl">Polski</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium mb-2">Grupa docelowa</label>
                  <input
                    type="text"
                    value={options.targetAudience}
                    onChange={(e) => setOptions({ ...options, targetAudience: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                    placeholder="np. firmy budowlane, mechanicy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Focus Keywords */}
                <div>
                  <label className="block text-sm font-medium mb-2">Słowa kluczowe (oddzielone przecinkami)</label>
                  <input
                    type="text"
                    value={options.focusKeywords}
                    onChange={(e) => setOptions({ ...options, focusKeywords: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                    placeholder="np. części CAT, filtry, koparki"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col justify-end gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.includeEmoji}
                      onChange={(e) => setOptions({ ...options, includeEmoji: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Używaj emoji w opisach</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.regenerateExisting}
                      onChange={(e) => setOptions({ ...options, regenerateExisting: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-orange-600">Regeneruj istniejące SEO</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'products' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-white/50'
              }`}
            >
              <Package className="w-4 h-4" />
              Produkty
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'categories' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-white/50'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              Kategorie
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">Wszystkie</option>
                <option value="missing">Bez SEO</option>
                <option value="has">Z SEO</option>
                <option value="error">Z błędami</option>
              </select>
            </div>

            <button
              onClick={selectMissing}
              className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              Zaznacz bez SEO
            </button>

            {processing ? (
              <button
                onClick={pauseGeneration}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
              >
                <Pause className="w-4 h-4" />
                Pauza
              </button>
            ) : (
              <button
                onClick={startBulkGeneration}
                disabled={selectedIds.size === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Generuj ({selectedIds.size})
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {processing && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Generowanie w toku...
              </span>
              <span className="text-sm text-gray-500">
                {progress.current} / {progress.total}
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Szacowany czas: ~{Math.ceil((progress.total - progress.current) * 2)} sekund
            </p>
          </div>
        )}

        {/* Items Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                      onChange={selectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Nazwa
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Handle
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                    SEO
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      Brak elementów do wyświetlenia
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        item.status === 'processing' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {item.handle}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.hasMetadata ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Tak
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Brak
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(item.status)}
                          {item.status === 'error' && (
                            <span className="text-xs text-red-500" title={item.error}>
                              Błąd
                            </span>
                          )}
                          {item.status === 'success' && (
                            <span className="text-xs text-green-500">OK</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedIds(new Set([item.id]))
                            startBulkGeneration()
                          }}
                          disabled={processing}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
                        >
                          <Play className="w-3 h-3" />
                          Generuj
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination info */}
          <div className="px-4 py-3 border-t bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Wyświetlono {filteredItems.length} z {items.length} elementów
            </div>
            <div className="text-sm text-gray-500">
              Zaznaczono: {selectedIds.size}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
