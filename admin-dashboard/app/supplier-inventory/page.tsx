"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/Toast"
import { Package, Search, RefreshCw, Eye, EyeOff, Truck, Plus, ShoppingBag } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export default function SupplierInventoryPage() {
  const router = useRouter()
  const toast = useToast()
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadSuppliers()
  }, [])

  useEffect(() => {
    if (selectedSupplier) {
      loadProducts(selectedSupplier)
    }
  }, [selectedSupplier])

  const getHeaders = () => {
    const token = localStorage.getItem("medusa_admin_token")
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
  }

  const loadSuppliers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/suppliers`, { headers: getHeaders() })
      const data = await res.json()
      setSuppliers(data.suppliers || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async (supplierId: string) => {
    try {
      setLoading(true)
      const res = await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}/products?limit=500`, { headers: getHeaders() })
      const data = await res.json()
      setProducts(data.products || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async (supplierId: string) => {
    setSyncing(true)
    try {
      await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}/sync`, {
        method: "POST",
        headers: getHeaders(),
      })
      loadProducts(supplierId)
      loadSuppliers()
    } catch (e) {
      console.error(e)
    } finally {
      setSyncing(false)
    }
  }

  const handlePublish = async (supplierId: string, publish: boolean) => {
    try {
      await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}/publish`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ publish }),
      })
      loadSuppliers()
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateProducts = async (all: boolean = false) => {
    if (!selectedSupplier) return
    
    setCreating(true)
    try {
      const res = await fetch(`${BACKEND_URL}/admin/suppliers/${selectedSupplier}/create-products`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ 
          all,
          product_ids: all ? undefined : selectedProducts 
        }),
      })
      const data = await res.json()
      
      if (data.success) {
        toast.success(data.message || `Utworzono ${data.created} produktów`)
        setSelectedProducts([])
        loadProducts(selectedSupplier)
      } else {
        toast.error(data.message || "Błąd tworzenia produktów")
      }
    } catch (e) {
      console.error(e)
      toast.error("Błąd połączenia")
    } finally {
      setCreating(false)
    }
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleAllProducts = () => {
    const notLinked = filtered.filter(p => !p.product_id)
    if (selectedProducts.length === notLinked.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(notLinked.map(p => p.id))
    }
  }

  const filtered = products.filter(p => 
    !search || p.supplier_sku?.toLowerCase().includes(search.toLowerCase())
  )

  const selected = suppliers.find(s => s.id === selectedSupplier)

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.supplier_stock > 0).length,
    outOfStock: products.filter(p => p.supplier_stock === 0).length,
    inShop: products.filter(p => p.product_id).length,
    notInShop: products.filter(p => !p.product_id).length,
  }

  if (loading && suppliers.length === 0) {
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Magazyny dostawców</h1>
            <p className="text-gray-600">Stany magazynowe produktów od dostawców dropship</p>
          </div>
          <Link href="/suppliers">
            <Button variant="secondary">
              <Truck className="w-4 h-4 mr-2" />
              Zarządzaj dostawcami
            </Button>
          </Link>
        </div>

        {/* Supplier cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map(sup => (
            <div
              key={sup.id}
              onClick={() => setSelectedSupplier(sup.id)}
              className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-all ${
                selectedSupplier === sup.id 
                  ? "border-orange-500 shadow-lg" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{sup.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{sup.code}</p>
                </div>
                <div className="flex gap-1">
                  {sup.show_in_store ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3" /> W sklepie
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Ukryty
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{sup.products_count || 0}</p>
                  <p className="text-sm text-gray-500">produktów</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); handleSync(sup.id) }}
                    disabled={syncing}
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant={sup.show_in_store ? "secondary" : "primary"}
                    onClick={(e) => { e.stopPropagation(); handlePublish(sup.id, !sup.show_in_store) }}
                  >
                    {sup.show_in_store ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Products table */}
        {selectedSupplier && (
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">Produkty: {selected?.name}</h2>
                <p className="text-sm text-gray-500">
                  {stats.inStock} dostępnych • {stats.inShop} w sklepie • {stats.notInShop} do dodania
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Szukaj SKU..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 border rounded-lg w-64"
                  />
                </div>
                {selectedProducts.length > 0 && (
                  <Button onClick={() => handleCreateProducts(false)} disabled={creating}>
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj wybrane ({selectedProducts.length})
                  </Button>
                )}
                {stats.notInShop > 0 && (
                  <Button variant="secondary" onClick={() => handleCreateProducts(true)} disabled={creating}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {creating ? "Tworzenie..." : `Dodaj wszystkie (${stats.notInShop})`}
                  </Button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length > 0 && selectedProducts.length === filtered.filter(p => !p.product_id).length}
                        onChange={toggleAllProducts}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cena zakupu</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">W sklepie</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center">
                        <LoadingSpinner />
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Brak produktów
                      </td>
                    </tr>
                  ) : (
                    filtered.slice(0, 200).map(p => (
                      <tr key={p.id} className={`hover:bg-gray-50 ${selectedProducts.includes(p.id) ? "bg-orange-50" : ""}`}>
                        <td className="px-4 py-3">
                          {!p.product_id && (
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(p.id)}
                              onChange={() => toggleProductSelection(p.id)}
                              className="rounded"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-sm">{p.supplier_sku}</td>
                        <td className="px-4 py-3">{formatCurrency(p.supplier_price / 100)}</td>
                        <td className="px-4 py-3 font-medium">
                          <span className={p.supplier_stock > 0 ? "text-green-600" : "text-red-600"}>
                            {p.supplier_stock} szt.
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {p.product_id ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded flex items-center gap-1 w-fit">
                              <ShoppingBag className="w-3 h-3" /> W sklepie
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Nie dodany</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {filtered.length > 200 && (
              <div className="p-3 text-center text-sm text-gray-500 border-t">
                Pokazano 200 z {filtered.length} produktów
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
