"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { isAuthenticated } from "@/lib/auth"
import medusaClient from "@/lib/medusa-client"
import { ArrowLeft, Upload } from "lucide-react"

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    handle: "",
    status: "draft",
    price: "",
    sku: "",
    inventory_quantity: "0",
  })

  if (!isAuthenticated()) {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create product
      const productResponse = await medusaClient.admin.products.create({
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        handle: formData.handle || formData.title.toLowerCase().replace(/\s+/g, "-"),
        status: formData.status as any,
        variants: [
          {
            title: "Default Variant",
            sku: formData.sku,
            inventory_quantity: parseInt(formData.inventory_quantity),
            prices: [
              {
                amount: parseFloat(formData.price) * 100,
                currency_code: "usd",
              },
            ],
          },
        ],
      })

      alert("Product created successfully!")
      router.push(`/products/${productResponse.product.id}`)
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600 mt-1">Create a new product in your catalog</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Product Title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                placeholder="e.g. Premium Cotton T-Shirt"
              />
              
              <Input
                label="Subtitle"
                value={formData.subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Short description"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Detailed product description..."
                />
              </div>
              
              <Input
                label="Handle (URL slug)"
                value={formData.handle}
                onChange={(e) => handleChange("handle", e.target.value)}
                placeholder="premium-cotton-t-shirt"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Price (USD)"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                  placeholder="29.99"
                />
                
                <Input
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  placeholder="PROD-001"
                />
              </div>
              
              <Input
                label="Inventory Quantity"
                type="number"
                value={formData.inventory_quantity}
                onChange={(e) => handleChange("inventory_quantity", e.target.value)}
                required
                placeholder="100"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
                <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF (max 5MB)</p>
                <input type="file" multiple accept="image/*" className="hidden" />
                <Button type="button" variant="secondary" className="mt-4">
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Create Product
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
