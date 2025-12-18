/**
 * Przykład użycia Unified Admin API Client
 * 
 * Automatyczna synchronizacja ze storefront po zmianach
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { unifiedAdminAPI } from "@/lib/unified-admin-client"
import { Save, ArrowLeft, RefreshCw } from "lucide-react"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [revalidating, setRevalidating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    inventory: 0,
  })

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
      const data = await unifiedAdminAPI.products.getById(productId)
      setProduct(data.product)
      
      const variant = data.product.variants?.[0]
      setFormData({
        title: data.product.title || '',
        description: data.product.description || '',
        price: variant?.prices?.[0]?.amount ? variant.prices[0].amount / 100 : 0,
        inventory: variant?.inventory_quantity || 0,
      })
    } catch (error) {
      console.error("Error loading product:", error)
      alert("Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // ✅ Aktualizacja produktu - automatycznie invaliduje cache storefront
      await unifiedAdminAPI.products.update(productId, {
        title: formData.title,
        description: formData.description,
      })

      const variant = product.variants?.[0]
      if (variant) {
        // ✅ Aktualizacja ceny - automatycznie invaliduje cache
        await unifiedAdminAPI.products.updatePrice(variant.id, [
          {
            amount: Math.round(formData.price * 100),
            currency_code: 'pln',
          }
        ])

        // ✅ Aktualizacja stanu magazynowego - automatycznie invaliduje cache
        await unifiedAdminAPI.inventory.updateStock(variant.id, formData.inventory)
      }

      alert("✅ Produkt zaktualizowany!\n\nZmiany są natychmiast widoczne w sklepie.")
      await loadProduct()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("❌ Błąd podczas zapisywania produktu")
    } finally {
      setSaving(false)
    }
  }

  const handleManualRevalidation = async () => {
    try {
      setRevalidating(true)
      
      // Ręczne wywołanie revalidation (opcjonalne - dzieje się automatycznie)
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags: ['products', `product-${productId}`],
        }),
      })

      alert("✅ Cache storefront odświeżony!")
    } catch (error) {
      console.error("Error revalidating:", error)
      alert("❌ Błąd podczas odświeżania cache")
    } finally {
      setRevalidating(false)
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
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
            <Button
              variant="secondary"
              onClick={() => router.push('/products')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-1">
                Zmiany są automatycznie synchronizowane ze sklepem
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleManualRevalidation}
              disabled={revalidating}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${revalidating ? 'animate-spin' : ''}`} />
              Odśwież Cache
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Zapisywanie...' : 'Zapisz'}
            </Button>
          </div>
        </div>

        {/* Real-time sync indicator */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            <span className="text-green-800 font-medium">
              Synchronizacja w czasie rzeczywistym włączona
            </span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Po zapisaniu zmian, sklep natychmiast pokaże zaktualizowane dane
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nazwa produktu
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opis
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cena (PLN)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              ✓ Cena będzie natychmiast zaktualizowana w sklepie
            </p>
          </div>

          {/* Inventory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stan magazynowy
            </label>
            <input
              type="number"
              value={formData.inventory}
              onChange={(e) => setFormData({ ...formData, inventory: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              ✓ Stan będzie natychmiast zaktualizowany w sklepie
            </p>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 Jak działa synchronizacja?
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Po kliknięciu "Zapisz" dane są aktualizowane w bazie</li>
            <li>• Automatycznie wysyłany jest sygnał do storefront</li>
            <li>• Cache Next.js jest invalidowany dla tego produktu</li>
            <li>• Następne żądanie pobiera świeże dane z bazy</li>
            <li>• Cały proces trwa &lt;100ms</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
