"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import ImageUploader from "@/components/ui/ImageUploader"
import RichTextEditor from "@/components/ui/RichTextEditor"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { Product } from "@/lib/types"
import { ArrowLeft, Save, Package, Image as ImageIcon, DollarSign, Info } from "lucide-react"

type Tab = 'basic' | 'images' | 'pricing' | 'inventory'

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
  })
  const [images, setImages] = useState<string[]>([])
  const [variants, setVariants] = useState<any[]>([])

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
      // Simplified update - only send basic fields
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        handle: formData.handle,
        status: formData.status,
      }
      
      // Only add thumbnail if we have images
      if (images.length > 0) {
        updateData.thumbnail = images[0]
      }
      
      console.log("Updating product with:", updateData)
      await api.updateProduct(productId, updateData)
      alert("Product updated successfully!")
      router.push(`/products/${productId}`)
    } catch (error: any) {
      console.error("Error updating product:", error)
      alert(`Failed to update product: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleVariantUpdate = async (index: number, field: string, value: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const handlePriceUpdate = async (index: number, amount: string) => {
    const updated = [...variants]
    const prices = updated[index].prices || []
    if (prices.length > 0) {
      prices[0].amount = Math.round(parseFloat(amount) * 100)
    } else {
      prices.push({ amount: Math.round(parseFloat(amount) * 100), currency_code: 'pln' })
    }
    updated[index].prices = prices
    setVariants(updated)
  }

  const saveVariant = async (index: number) => {
    try {
      const variant = variants[index]
      await api.updateProduct(productId, {
        variants: [{
          id: variant.id,
          inventory_quantity: variant.inventory_quantity,
          prices: variant.prices,
        }]
      })
      alert("Variant updated!")
    } catch (error) {
      console.error("Error updating variant:", error)
      alert("Failed to update variant")
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const tabs = [
    { id: 'basic' as Tab, label: 'Basic Info', icon: Info },
    { id: 'images' as Tab, label: 'Images', icon: ImageIcon },
    { id: 'pricing' as Tab, label: 'Pricing', icon: DollarSign },
    { id: 'inventory' as Tab, label: 'Inventory', icon: Package },
  ]

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-6 px-6 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/products/${productId}`}>
                <button type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{formData.title || 'Edit Product'}</h1>
                <p className="text-sm text-gray-500">Product ID: {productId.slice(0, 8)}...</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href={`/products/${productId}`}>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
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
                        ? 'border-primary-600 text-primary-600 bg-primary-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="e.g. Hydraulic Pump XYZ-2000"
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData({...formData, description: value})}
                    placeholder="Describe your product features, specifications, and benefits..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="handle" className="block text-sm font-semibold text-gray-900 mb-2">
                      URL Handle
                    </label>
                    <input
                      type="text"
                      id="handle"
                      name="handle"
                      value={formData.handle}
                      onChange={(e) => setFormData({...formData, handle: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Used in product URL</p>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> The first image will be used as the main product thumbnail. Drag images to reorder them.
                  </p>
                </div>
                <ImageUploader
                  images={images}
                  onChange={setImages}
                  maxImages={10}
                />
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Click "Update" after changing prices to save changes.
                  </p>
                </div>
                {variants.map((variant, index) => {
                  const price = variant.prices?.[0]
                  return (
                    <div key={variant.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{variant.title}</h3>
                        <span className="text-sm text-gray-500">SKU: {variant.sku || 'N/A'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (PLN)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">zł</span>
                            <input
                              type="number"
                              step="0.01"
                              value={price ? (price.amount / 100).toFixed(2) : ""}
                              onChange={(e) => handlePriceUpdate(index, e.target.value)}
                              className="w-full pl-10 pr-4 py-3 text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            onClick={() => saveVariant(index)}
                            variant="secondary"
                            className="w-full"
                          >
                            Update Price
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800">
                    <strong>Stock Management:</strong> Update inventory levels for each variant. Click "Update" to save.
                  </p>
                </div>
                {variants.map((variant, index) => (
                  <div key={variant.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{variant.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        variant.inventory_quantity > 10 
                          ? 'bg-green-100 text-green-800'
                          : variant.inventory_quantity > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {variant.inventory_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={variant.inventory_quantity}
                          onChange={(e) => handleVariantUpdate(index, 'inventory_quantity', parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          onClick={() => saveVariant(index)}
                          variant="secondary"
                          className="w-full"
                        >
                          Update Stock
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}
