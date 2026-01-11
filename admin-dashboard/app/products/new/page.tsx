"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import ImageUploader from "@/components/ui/ImageUploader"
import RichTextEditor from "@/components/ui/RichTextEditor"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { ArrowLeft, Save, Image as ImageIcon, DollarSign, Info } from "lucide-react"

type Tab = 'basic' | 'images' | 'pricing'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('basic')
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    handle: "",
    status: "draft",
  })
  const [images, setImages] = useState<string[]>([])
  const [price, setPrice] = useState("")
  const [sku, setSku] = useState("")
  const [inventory, setInventory] = useState(0)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.handle) {
      alert("Wypełnij nazwę produktu i URL handle")
      setActiveTab('basic')
      return
    }
    if (!price) {
      alert("Ustaw cenę produktu")
      setActiveTab('pricing')
      return
    }
    try {
      setSaving(true)
      const productData: any = {
        title: formData.title,
        description: formData.description,
        handle: formData.handle,
        status: formData.status,
        thumbnail: images[0] || undefined,
        images: images.length > 0 ? images.map(url => ({ url })) : undefined,
        options: [{ title: "Default", values: ["Standard"] }],
        variants: [{
          title: "Default",
          sku: sku || undefined,
          manage_inventory: false,
          options: { "Default": "Standard" },
          prices: [{ amount: Math.round(parseFloat(price) * 100), currency_code: "pln" }],
        }],
      }
      const response = await api.createProduct(productData)
      alert("Produkt został utworzony!")
      router.push(`/products/${response.product.id}`)
    } catch (error: any) {
      alert(`Błąd: ${error.message || 'Nieznany błąd'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleTitleChange = (value: string) => {
    const handle = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    setFormData({ ...formData, title: value, handle })
  }

  const tabs = [
    { id: 'basic' as Tab, label: 'Podstawowe', icon: Info },
    { id: 'images' as Tab, label: 'Zdjęcia', icon: ImageIcon },
    { id: 'pricing' as Tab, label: 'Cena', icon: DollarSign },
  ]

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/products">
                <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nowy produkt</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dodaj nowy produkt do katalogu</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/products"><Button type="button" variant="secondary">Anuluj</Button></Link>
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Tworzenie..." : "Utwórz"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                      ${activeTab === tab.id
                        ? 'border-primary-600 text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                    <Icon className="w-5 h-5" /><span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'basic' && (
              <div className="space-y-6 max-w-2xl">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300"><strong>Krok 1:</strong> Wprowadź podstawowe informacje.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Nazwa produktu *</label>
                  <input type="text" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Opis</label>
                  <RichTextEditor value={formData.description} onChange={(v) => setFormData({...formData, description: v})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">URL Handle *</label>
                    <input type="text" value={formData.handle} onChange={(e) => setFormData({...formData, handle: e.target.value})} required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                      <option value="draft">Szkic</option>
                      <option value="published">Opublikowany</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={() => setActiveTab('images')}>Dalej: Zdjęcia →</Button>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300"><strong>Krok 2:</strong> Dodaj zdjęcia produktu.</p>
                </div>
                <ImageUploader images={images} onChange={setImages} maxImages={10} />
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={() => setActiveTab('basic')}>← Wstecz</Button>
                  <Button type="button" onClick={() => setActiveTab('pricing')}>Dalej: Cena →</Button>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-6 max-w-2xl">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300"><strong>Krok 3:</strong> Ustaw cenę i stan magazynowy.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Cena (PLN) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg">zł</span>
                      <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required min="0"
                        className="w-full pl-10 pr-4 py-4 text-2xl font-semibold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Stan magazynowy</label>
                      <input type="number" value={inventory} onChange={(e) => setInventory(parseInt(e.target.value) || 0)} min="0"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">SKU</label>
                      <input type="text" value={sku} onChange={(e) => setSku(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={() => setActiveTab('images')}>← Wstecz</Button>
                  <Button type="submit" disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Tworzenie..." : "Utwórz produkt"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}
