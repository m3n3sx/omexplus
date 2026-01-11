"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import ImageUploader from "@/components/ui/ImageUploader"
import RichTextEditor from "@/components/ui/RichTextEditor"
import VariantEditor from "@/components/products/VariantEditor"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { Product, ProductOption, ProductVariant } from "@/lib/types"
import { ArrowLeft, Save, Package, Image as ImageIcon, DollarSign, Info, Layers } from "lucide-react"

type Tab = 'basic' | 'images' | 'variants' | 'inventory'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('basic')
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    handle: "",
    status: "draft",
    internal_number: "",
  })
  const [images, setImages] = useState<string[]>([])
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [options, setOptions] = useState<ProductOption[]>([])

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadProduct()
  }, [router, productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const response = await api.getProduct(productId)
      const prod = response.product as Product
      setProduct(prod)
      setFormData({
        title: prod.title,
        description: prod.description || "",
        handle: prod.handle,
        status: prod.status,
        internal_number: prod.metadata?.internal_number || "",
      })
      
      const productImages: string[] = []
      if (prod.thumbnail) productImages.push(prod.thumbnail)
      if (prod.images) {
        prod.images.forEach(img => {
          if (img.url && !productImages.includes(img.url)) {
            productImages.push(img.url)
          }
        })
      }
      setImages(productImages)
      setVariants(prod.variants || [])
      setOptions(prod.options || [])
    } catch (error) {
      console.error("Error loading product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      // Update product with variants and options
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        handle: formData.handle,
        status: formData.status,
        metadata: {
          ...product?.metadata,
          internal_number: formData.internal_number,
        },
      }
      
      // Only add thumbnail if we have images
      if (images.length > 0) {
        updateData.thumbnail = images[0]
      }

      // Add options if they exist
      if (options.length > 0) {
        updateData.options = options.map(opt => ({
          title: opt.title,
          values: opt.values.map(v => v.value)
        }))
      }

      // Add variants with prices
      if (variants.length > 0) {
        updateData.variants = variants.map(v => ({
          id: v.id.startsWith('var_') ? undefined : v.id, // New variants don't have real IDs
          title: v.title,
          sku: v.sku,
          manage_inventory: true,
          prices: v.prices,
          options: v.options?.reduce((acc: Record<string, string>, o: any) => {
            if (o.option_id && o.value) {
              acc[o.option_id] = o.value
            }
            return acc
          }, {}) || {}
        }))
      }
      
      console.log("Updating product with:", updateData)
      await api.updateProduct(productId, updateData)
      alert("Produkt zaktualizowany!")
      router.push(`/products/${productId}`)
    } catch (error: any) {
      console.error("Error updating product:", error)
      alert(`Błąd aktualizacji produktu: ${error.message || 'Nieznany błąd'}`)
    } finally {
      setSaving(false)
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

  if (!product) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-theme-primary mb-2">Produkt nie znaleziony</h2>
          <Link href="/products">
            <Button>Powrót do produktów</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const tabs = [
    { id: 'basic' as Tab, label: 'Podstawowe', icon: Info },
    { id: 'images' as Tab, label: 'Zdjęcia', icon: ImageIcon },
    { id: 'variants' as Tab, label: 'Warianty', icon: Layers },
    { id: 'inventory' as Tab, label: 'Magazyn', icon: Package },
  ]

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-theme-secondary border-b border-theme -mx-6 px-6 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/products/${productId}`}>
                <button type="button" className="p-2 hover:bg-theme-hover rounded-lg transition-colors text-theme-primary">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-theme-primary">{formData.title || 'Edytuj produkt'}</h1>
                <p className="text-sm text-theme-muted">ID produktu: {productId.slice(0, 8)}...</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href={`/products/${productId}`}>
                <Button type="button" variant="secondary">
                  Anuluj
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Zapisywanie..." : "Zapisz zmiany"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-theme-secondary rounded-lg shadow-sm border border-theme overflow-hidden">
          <div className="border-b border-theme">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                      ${activeTab === tab.id
                        ? 'border-accent text-accent bg-accent/10'
                        : 'border-transparent text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label htmlFor="internal_number" className="block text-sm font-semibold text-theme-primary mb-2">
                    Numer wewnętrzny
                  </label>
                  <input
                    type="text"
                    id="internal_number"
                    name="internal_number"
                    value={formData.internal_number}
                    onChange={(e) => setFormData({...formData, internal_number: e.target.value})}
                    placeholder="np. 020560A, 167187"
                    className="w-full px-4 py-3 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono"
                  />
                  <p className="text-xs text-theme-muted mt-1">Numer katalogowy / numer części (widoczny tylko w panelu admina)</p>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-theme-primary mb-2">
                    Nazwa produktu
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="np. Pompa hydrauliczna XYZ-2000"
                    className="w-full px-4 py-3 text-lg border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-theme-primary mb-2">
                    Opis
                  </label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData({...formData, description: value})}
                    placeholder="Opisz cechy produktu, specyfikację i korzyści..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="handle" className="block text-sm font-semibold text-theme-primary mb-2">
                      URL Handle
                    </label>
                    <input
                      type="text"
                      id="handle"
                      name="handle"
                      value={formData.handle}
                      onChange={(e) => setFormData({...formData, handle: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <p className="text-xs text-theme-muted mt-1">Używany w URL produktu</p>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-theme-primary mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="draft">Szkic</option>
                      <option value="published">Opublikowany</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-4">
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
                  <p className="text-sm text-accent">
                    <strong>Wskazówka:</strong> Pierwsze zdjęcie będzie miniaturą produktu. Przeciągnij zdjęcia aby zmienić kolejność.
                  </p>
                </div>
                <ImageUploader
                  images={images}
                  onChange={setImages}
                  maxImages={10}
                />
              </div>
            )}

            {/* Variants Tab */}
            {activeTab === 'variants' && (
              <div className="space-y-6">
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
                  <p className="text-sm text-accent">
                    <strong>Wskazówka:</strong> Dodaj opcje (np. Rozmiar, Materiał) aby utworzyć warianty produktu. 
                    Ustaw cenę 0 dla wariantów z opcją "Zapytaj o cenę".
                  </p>
                </div>
                <VariantEditor
                  options={options}
                  variants={variants}
                  onOptionsChange={setOptions}
                  onVariantsChange={setVariants}
                  productTitle={formData.title}
                />
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    <strong>Zarządzanie stanem:</strong> Zmień ilość i kliknij "Zapisz stan" przy każdym wariancie.
                  </p>
                </div>
                {variants.map((variant, index) => (
                  <div key={variant.id} className="bg-theme-tertiary rounded-lg p-6 border border-theme">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-theme-primary">{variant.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        variant.inventory_quantity > 10 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : variant.inventory_quantity > 0
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {variant.inventory_quantity > 0 ? `${variant.inventory_quantity} szt.` : 'Brak'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-2">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={variant.sku || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-theme-hover border border-theme rounded-lg text-theme-muted"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-2">
                          Stan magazynowy
                        </label>
                        <input
                          type="number"
                          value={variant.inventory_quantity || 0}
                          onChange={(e) => {
                            const updated = [...variants]
                            updated[index] = { ...updated[index], inventory_quantity: parseInt(e.target.value) || 0 }
                            setVariants(updated)
                          }}
                          min="0"
                          className="w-full px-4 py-3 text-lg font-semibold border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-2">
                          Cena (PLN)
                        </label>
                        <div className="px-4 py-3 bg-theme-hover border border-theme rounded-lg text-theme-muted">
                          {variant.prices?.[0]?.amount 
                            ? `${(variant.prices[0].amount / 100).toFixed(2)} zł`
                            : 'Zapytaj o cenę'}
                        </div>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await api.updateInventory(variant.id, variant.inventory_quantity || 0)
                              alert(`Stan dla "${variant.title}" zapisany!`)
                            } catch (error: any) {
                              alert(`Błąd: ${error.message}`)
                            }
                          }}
                          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          Zapisz stan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Bulk save button */}
                {variants.length > 1 && (
                  <div className="pt-4 border-t border-theme">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const updates = variants.map(v => ({
                            variantId: v.id,
                            quantity: v.inventory_quantity || 0
                          }))
                          await api.bulkUpdateInventory(updates)
                          alert('Wszystkie stany magazynowe zapisane!')
                        } catch (error: any) {
                          alert(`Błąd: ${error.message}`)
                        }
                      }}
                      className="w-full px-6 py-4 btn-accent rounded-lg font-semibold transition-colors"
                    >
                      💾 Zapisz wszystkie stany magazynowe
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}
