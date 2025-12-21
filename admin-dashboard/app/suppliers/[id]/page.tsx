"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatDate, formatCurrency } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import { useToast } from "@/components/ui/Toast"
import { 
  ArrowLeft, Save, RefreshCw, Package, Truck, Building2, 
  Plus, CheckCircle, XCircle, AlertCircle, Eye, EyeOff, Upload
} from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

interface Supplier {
  id: string
  name: string
  code: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  postal_code?: string
  country_code?: string
  api_url?: string
  api_key?: string
  api_format?: string
  sync_enabled: boolean
  sync_frequency?: string
  last_sync_at?: string
  commission_rate?: number
  min_order_value?: number
  lead_time_days?: number
  shipping_method?: string
  stock_location_id?: string
  is_active: boolean
  is_dropship: boolean
  show_in_store: boolean
  products_count: number
  orders_count: number
  notes?: string
  created_at: string
  updated_at: string
}

interface SupplierProduct {
  id: string
  supplier_sku: string
  supplier_price: number
  supplier_stock: number
  markup_type: string
  markup_value: number
  selling_price: number
  is_active: boolean
  sync_status?: string
  last_sync_at?: string
  product?: {
    id: string
    title: string
    handle: string
    thumbnail?: string
  }
}

interface SupplierOrder {
  id: string
  order_id: string
  status: string
  supplier_order_id?: string
  tracking_number?: string
  supplier_total: number
  your_margin: number
  created_at: string
  order?: {
    display_id: number
    email: string
  }
}

export default function SupplierDetailPage() {
  const router = useRouter()
  const params = useParams()
  const toast = useToast()
  const supplierId = params.id as string

  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [products, setProducts] = useState<SupplierProduct[]>([])
  const [orders, setOrders] = useState<SupplierOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [activeTab, setActiveTab] = useState<"info" | "products" | "orders" | "woocommerce">("info")
  const [formData, setFormData] = useState<Partial<Supplier>>({})

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadData()
  }, [router, supplierId])

  const getAuthHeaders = () => {
    const token = localStorage.getItem("medusa_admin_token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const headers = getAuthHeaders()

      // Load supplier
      const supplierRes = await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}`, { headers })
      const supplierData = await supplierRes.json()
      
      if (!supplierRes.ok) {
        toast.error("Dostawca nie został znaleziony")
        router.push("/suppliers")
        return
      }

      setSupplier(supplierData.supplier)
      setFormData(supplierData.supplier)

      // Load products
      const productsRes = await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}/products`, { headers })
      const productsData = await productsRes.json()
      setProducts(productsData.products || [])

      // Load orders
      const ordersRes = await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}/orders`, { headers })
      const ordersData = await ordersRes.json()
      setOrders(ordersData.orders || [])
    } catch (error) {
      console.error("Error loading supplier:", error)
      toast.error("Błąd podczas ładowania danych")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      const res = await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success("Zapisano zmiany")
        loadData()
      } else {
        const data = await res.json()
        toast.error(data.message || "Błąd podczas zapisywania")
      }
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Błąd podczas zapisywania")
    } finally {
      setSaving(false)
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true)
      const res = await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}/sync`, {
        method: "POST",
        headers: getAuthHeaders(),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(`Zsynchronizowano ${data.products_synced} produktów`)
        loadData()
      } else {
        toast.error(data.error || "Błąd synchronizacji")
      }
    } catch (error) {
      console.error("Sync error:", error)
      toast.error("Błąd podczas synchronizacji")
    } finally {
      setSyncing(false)
    }
  }

  const handlePublish = async (publish: boolean) => {
    try {
      setPublishing(true)
      const res = await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}/publish`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ publish }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        loadData()
      } else {
        toast.error(data.message || "Błąd publikacji")
      }
    } catch (error) {
      console.error("Publish error:", error)
      toast.error("Błąd podczas publikacji")
    } finally {
      setPublishing(false)
    }
  }

  const handleCreateProducts = async () => {
    try {
      setPublishing(true)
      const res = await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}/create-products`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ all: true }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(data.message || `Utworzono ${data.created} produktów`)
        loadData()
      } else {
        toast.error(data.message || "Błąd tworzenia produktów")
      }
    } catch (error) {
      console.error("Create products error:", error)
      toast.error("Błąd podczas tworzenia produktów")
    } finally {
      setPublishing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      sent: "bg-blue-100 text-blue-800",
      confirmed: "bg-indigo-100 text-indigo-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    const labels: Record<string, string> = {
      pending: "Oczekuje",
      sent: "Wysłane",
      confirmed: "Potwierdzone",
      shipped: "W transporcie",
      delivered: "Dostarczone",
      cancelled: "Anulowane",
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || "bg-gray-100 text-gray-800"}`}>
        {labels[status] || status}
      </span>
    )
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

  if (!supplier) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Dostawca nie został znaleziony</p>
          <Link href="/suppliers">
            <Button className="mt-4">Powrót do listy</Button>
          </Link>
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
            <Link href="/suppliers">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{supplier.name}</h1>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {supplier.code}
                </span>
                {supplier.is_dropship && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    Dropship
                  </span>
                )}
                {supplier.is_active ? (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    Aktywny
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    Nieaktywny
                  </span>
                )}
                {supplier.show_in_store ? (
                  <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    W sklepie
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    Ukryty
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                {supplier.products_count} produktów • {supplier.orders_count} zamówień
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {supplier.sync_enabled && (
              <Button variant="secondary" onClick={handleSync} disabled={syncing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Synchronizacja..." : "Synchronizuj"}
              </Button>
            )}
            {supplier.products_count > 0 && (
              <>
                <Button 
                  variant="secondary" 
                  onClick={handleCreateProducts} 
                  disabled={publishing}
                >
                  <Package className="w-4 h-4 mr-2" />
                  {publishing ? "..." : "Dodaj do sklepu"}
                </Button>
                {supplier.show_in_store ? (
                  <Button 
                    variant="secondary" 
                    onClick={() => handlePublish(false)} 
                    disabled={publishing}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Ukryj
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    onClick={() => handlePublish(true)} 
                    disabled={publishing}
                    className="text-green-600 hover:bg-green-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Pokaż
                  </Button>
                )}
              </>
            )}
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Zapisywanie..." : "Zapisz"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {[
              { id: "info", label: "Informacje", icon: Building2 },
              { id: "products", label: `Produkty (${products.length})`, icon: Package },
              { id: "orders", label: `Zamówienia (${orders.length})`, icon: Truck },
              { id: "woocommerce", label: "WooCommerce", icon: RefreshCw },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Podstawowe informacje</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kod</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Czas realizacji</label>
                    <input
                      type="number"
                      name="lead_time_days"
                      value={formData.lead_time_days || 3}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active || false}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                    />
                    <span className="text-sm">Aktywny</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_dropship"
                      checked={formData.is_dropship || false}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                    />
                    <span className="text-sm">Dropship</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kontakt</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Osoba kontaktowa</label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* API */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Integracja API</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL API</label>
                  <input
                    type="url"
                    name="api_url"
                    value={formData.api_url || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        name="sync_enabled"
                        checked={formData.sync_enabled || false}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium">Synchronizacja</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Częstotliwość</label>
                    <select
                      name="sync_frequency"
                      value={formData.sync_frequency || "manual"}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="manual">Ręcznie</option>
                      <option value="hourly">Co godzinę</option>
                      <option value="daily">Codziennie</option>
                      <option value="weekly">Co tydzień</option>
                    </select>
                  </div>
                </div>
                {supplier.last_sync_at && (
                  <p className="text-sm text-gray-500">
                    Ostatnia synchronizacja: {formatDate(supplier.last_sync_at)}
                  </p>
                )}
              </div>
            </div>

            {/* Business Terms */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Warunki współpracy</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marża (%)</label>
                    <input
                      type="number"
                      name="commission_rate"
                      value={formData.commission_rate || 20}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min. zamówienie (PLN)</label>
                    <input
                      type="number"
                      name="min_order_value"
                      value={formData.min_order_value || 0}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metoda wysyłki</label>
                  <input
                    type="text"
                    name="shipping_method"
                    value={formData.shipping_method || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Produkty od dostawcy</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Dodaj produkt
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produkt</TableHead>
                  <TableHead>SKU dostawcy</TableHead>
                  <TableHead>Cena zakupu</TableHead>
                  <TableHead>Marża</TableHead>
                  <TableHead>Cena sprzedaży</TableHead>
                  <TableHead>Stan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Brak produktów
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.product ? (
                          <div className="flex items-center gap-3">
                            {product.product.thumbnail && (
                              <img
                                src={product.product.thumbnail}
                                alt=""
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <span className="font-medium">{product.product.title}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Nie powiązany</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{product.supplier_sku}</span>
                      </TableCell>
                      <TableCell>{formatCurrency(product.supplier_price / 100)}</TableCell>
                      <TableCell>
                        {product.markup_type === "percentage" 
                          ? `${product.markup_value}%` 
                          : formatCurrency(product.markup_value)}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(product.selling_price / 100)}
                      </TableCell>
                      <TableCell>{product.supplier_stock}</TableCell>
                      <TableCell>
                        {product.is_active ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Zamówienia do dostawcy</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zamówienie</TableHead>
                  <TableHead>ID u dostawcy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Koszt</TableHead>
                  <TableHead>Marża</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Brak zamówień
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {order.order ? (
                          <Link href={`/orders/${order.order_id}`} className="text-primary-600 hover:underline">
                            #{order.order.display_id}
                          </Link>
                        ) : (
                          <span className="text-gray-400">{order.order_id}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.supplier_order_id || <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {order.tracking_number || <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>{formatCurrency(order.supplier_total / 100)}</TableCell>
                      <TableCell className="text-green-600 font-medium">
                        +{formatCurrency(order.your_margin / 100)}
                      </TableCell>
                      <TableCell className="text-gray-500">{formatDate(order.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === "woocommerce" && (
          <WooCommerceConfig supplierId={supplierId} supplier={supplier} onUpdate={loadData} />
        )}
      </div>
    </DashboardLayout>
  )
}

// WooCommerce Configuration Component
function WooCommerceConfig({ 
  supplierId, 
  supplier, 
  onUpdate 
}: { 
  supplierId: string
  supplier: Supplier
  onUpdate: () => void 
}) {
  const toast = useToast()
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const [credentials, setCredentials] = useState({
    store_url: supplier.api_url?.replace('/wp-json/wc/v3', '') || '',
    consumer_key: '',
    consumer_secret: '',
  })

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setTesting(true)
    try {
      const res = await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}/woocommerce`)
      const data = await res.json()
      setConnectionStatus(data)
    } catch (error) {
      setConnectionStatus({ configured: false, message: 'Error testing connection' })
    } finally {
      setTesting(false)
    }
  }

  const saveCredentials = async () => {
    if (!credentials.consumer_key || !credentials.consumer_secret) {
      toast.error('Wprowadź klucze API')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}/woocommerce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        setCredentials(prev => ({ ...prev, consumer_key: '', consumer_secret: '' }))
        testConnection()
        onUpdate()
      } else {
        toast.error(data.message || 'Błąd zapisywania')
      }
    } catch (error) {
      toast.error('Błąd połączenia')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status połączenia</h2>
        
        {testing ? (
          <div className="flex items-center gap-3 text-gray-500">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Testowanie połączenia...
          </div>
        ) : connectionStatus ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {connectionStatus.connected ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-medium text-green-700">Połączono z WooCommerce</p>
                    <p className="text-sm text-gray-500">
                      Znaleziono {connectionStatus.products_count} produktów
                    </p>
                  </div>
                </>
              ) : connectionStatus.configured ? (
                <>
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-700">Skonfigurowano, ale brak połączenia</p>
                    <p className="text-sm text-gray-500">{connectionStatus.message}</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">Nie skonfigurowano</p>
                    <p className="text-sm text-gray-500">Wprowadź klucze API WooCommerce</p>
                  </div>
                </>
              )}
            </div>
            <Button variant="secondary" size="sm" onClick={testConnection}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Testuj ponownie
            </Button>
          </div>
        ) : null}
      </div>

      {/* API Credentials */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Konfiguracja API WooCommerce</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL sklepu
            </label>
            <input
              type="url"
              value={credentials.store_url}
              onChange={(e) => setCredentials(prev => ({ ...prev, store_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://omexplus.pl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consumer Key
            </label>
            <input
              type="text"
              value={credentials.consumer_key}
              onChange={(e) => setCredentials(prev => ({ ...prev, consumer_key: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consumer Secret
            </label>
            <input
              type="password"
              value={credentials.consumer_secret}
              onChange={(e) => setCredentials(prev => ({ ...prev, consumer_secret: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          <Button onClick={saveCredentials} disabled={saving}>
            {saving ? 'Zapisywanie...' : 'Zapisz i testuj połączenie'}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Jak wygenerować klucze API?</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Zaloguj się do panelu WordPress sklepu</li>
            <li>Przejdź do WooCommerce → Ustawienia → Zaawansowane → REST API</li>
            <li>Kliknij "Dodaj klucz"</li>
            <li>Opis: "OMEX Dropship", Uprawnienia: "Odczyt"</li>
            <li>Kliknij "Wygeneruj klucz API"</li>
            <li>Skopiuj Consumer Key i Consumer Secret</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
