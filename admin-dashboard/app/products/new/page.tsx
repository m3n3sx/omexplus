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
import { ArrowLeft, Save, Package, Image as ImageIcon, DollarSign, Info } from "lucide-react"

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
      alert("Please fill in product name and URL handle")
      setActiveTab('basic')
      return
    }

    if (!price) {
      alert("Please set a price for the product")
      setActiveTab('pricing')
      return
    }
    
    try {
      setSaving(true)
      const productData = {
        title: formData.title,
        description: formData.description,
        handle: formData.handle,
        status: formData.status,
        thumbnail: images[0] || "",
        variants: [{
          title: "Default",
          sku: sku || undefined,
          inventory_quantity: inventory,
          prices: [{
            amount: Math.round(parseFloat(price) * 100),
            currency_code: "pln",
          }],
        }],
      }
      
      console.log("Creating product:", productData)
      const response = await api.createProduct(productData)
      alert("Product created successfully!")
      router.push(`/products/${response.product.id}`)
    } catch (error: any) {
      console.error("Error creating product:", error)
      alert(`Failed to create product: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleTitleChange = (value: string) => {
    const handle = value.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setFormData({
      ...formData,
      title: value,
      handle: handle,
    })
  }

  const tabs = [
    { id: 'basic' as Tab, label: 'Basic Info', icon: Info },
    { id: 'images' as Tab, label: 'Images', icon: ImageIcon },
    { id: 'pricing' as Tab, label: 'Pricing & Stock', icon: DollarSign },
  ]

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-6 px-6 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/products">
                <button type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-sm text-gray-500">Create a new product in your catalog</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/products">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Creating..." : "Create Product"}
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Step 1:</strong> Enter basic product information. The URL handle will be auto-generated from the product name.
                  </p>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
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
                      URL Handle *
                    </label>
                    <input
                      type="text"
                      id="handle"
                      value={formData.handle}
                      onChange={(e) => setFormData({...formData, handle: e.target.value})}
                      required
                      placeholder="hydraulic-pump-xyz-2000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated, but you can customize</p>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-2">
                      Status *
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={() => setActiveTab('images')}>
                    Next: Add Images →
                  </Button>
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Step 2:</strong> Upload product images. The first image will be the main thumbnail. You can skip this step and add images later.
                  </p>
                </div>
                <ImageUploader
                  images={images}
                  onChange={setImages}
                  maxImages={10}
                />
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={() => setActiveTab('basic')}>
                    ← Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('pricing')}>
                    Next: Set Price →
                  </Button>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6 max-w-2xl">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Step 3:</strong> Set the price and stock level for your product.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
                      Price (PLN) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">zł</span>
                      <input
                        type="number"
                        id="price"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        placeholder="99.99"
                        className="w-full pl-10 pr-4 py-4 text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inventory" className="block text-sm font-semibold text-gray-900 mb-2">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        id="inventory"
                        value={inventory}
                        onChange={(e) => setInventory(parseInt(e.target.value) || 0)}
                        required
                        min="0"
                        placeholder="100"
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="sku" className="block text-sm font-semibold text-gray-900 mb-2">
                        SKU (Optional)
                      </label>
                      <input
                        type="text"
                        id="sku"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="PROD-001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={() => setActiveTab('images')}>
                    ← Back
                  </Button>
                  <Button type="submit" disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Creating..." : "Create Product"}
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
