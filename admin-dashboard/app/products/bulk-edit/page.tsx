"use client"

/**
 * Bulk Edit Products Page
 * 
 * Edytuj wiele produktów jednocześnie - oszczędza godziny pracy!
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { unifiedAdminAPI } from "@/lib/unified-admin-client"
import { Check, X, Edit } from "lucide-react"

export default function BulkEditPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bulkUpdates, setBulkUpdates] = useState({
    status: '',
    collection_id: '',
    discount_percent: '',
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadProducts()
  }, [router])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await unifiedAdminAPI.products.getAll({ limit: 100 })
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error loading products:", error)
      alert("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

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
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(products.map(p => p.id)))
    }
  }

  const handleBulkUpdate = async () => {
    if (selectedIds.size === 0) {
      alert("Wybierz przynajmniej jeden produkt")
      return
    }

    const updates: any = {}
    if (bulkUpdates.status) updates.status = bulkUpdates.status
    if (bulkUpdates.collection_id) updates.collection_id = bulkUpdates.collection_id

    if (Object.keys(updates).length === 0 && !bulkUpdates.discount_percent) {
      alert("Wprowadź przynajmniej jedną zmianę")
      return
    }

    try {
      setSaving(true)

      // Bulk update basic fields
      if (Object.keys(updates).length > 0) {
        await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/products/bulk/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('medusa_admin_token')}`,
          },
          body: JSON.stringify({
            productIds: Array.from(selectedIds),
            updates,
          }),
        })
      }

      // Apply discount if specified
      if (bulkUpdates.discount_percent) {
        const discount = parseFloat(bulkUpdates.discount_percent) / 100
        const priceUpdates = []

        for (const id of selectedIds) {
          const product = products.find(p => p.id === id)
          if (product?.variants?.[0]) {
            const variant = product.variants[0]
            const currentPrice = variant.prices?.[0]?.amount || 0
            const newPrice = Math.round(currentPrice * (1 - discount))

            priceUpdates.push({
              variantId: variant.id,
              amount: newPrice,
              currencyCode: 'pln',
            })
          }
        }

        if (priceUpdates.length > 0) {
          await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/products/bulk-price/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('medusa_admin_token')}`,
            },
            body: JSON.stringify({ updates: priceUpdates }),
          })
        }
      }

      alert(`✅ Zaktualizowano ${selectedIds.size} produktów!`)
      setSelectedIds(new Set())
      setBulkUpdates({ status: '', collection_id: '', discount_percent: '' })
      await loadProducts()
    } catch (error) {
      console.error("Error updating products:", error)
      alert("❌ Błąd podczas aktualizacji")
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Edit Products</h1>
          <p className="text-gray-600 mt-1">
            Edytuj wiele produktów jednocześnie - oszczędź czas!
          </p>
        </div>

        {/* Bulk Actions Panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Wybrano: {selectedIds.size} / {products.length}
            </h2>
            <Button variant="secondary" size="sm" onClick={selectAll}>
              {selectedIds.size === products.length ? 'Odznacz wszystkie' : 'Zaznacz wszystkie'}
            </Button>
          </div>

          {selectedIds.size > 0 && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Zastosuj zmiany do zaznaczonych:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={bulkUpdates.status}
                    onChange={(e) => setBulkUpdates({ ...bulkUpdates, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Bez zmian</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rabat (%)
                  </label>
                  <input
                    type="number"
                    placeholder="np. 15"
                    value={bulkUpdates.discount_percent}
                    onChange={(e) => setBulkUpdates({ ...bulkUpdates, discount_percent: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Collection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kolekcja
                  </label>
                  <input
                    type="text"
                    placeholder="Collection ID"
                    value={bulkUpdates.collection_id}
                    onChange={(e) => setBulkUpdates({ ...bulkUpdates, collection_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <Button
                onClick={handleBulkUpdate}
                disabled={saving}
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                {saving ? 'Zapisywanie...' : `Zaktualizuj ${selectedIds.size} produktów`}
              </Button>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === products.length}
                    onChange={selectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const variant = product.variants?.[0]
                const price = variant?.prices?.[0]
                const isSelected = selectedIds.has(product.id)

                return (
                  <tr
                    key={product.id}
                    className={`border-b hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.thumbnail && (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-gray-600">{product.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        product.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {price ? `${(price.amount / 100).toFixed(2)} PLN` : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {variant?.inventory_quantity || 0}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
