"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatDate, formatCurrency } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import { useToast } from "@/components/ui/Toast"
import { 
  Search, Plus, RefreshCw, Package, Truck, TrendingUp, 
  Building2, MoreVertical, Edit, Trash2, ExternalLink, 
  CheckCircle, XCircle, Clock
} from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

interface Supplier {
  id: string
  name: string
  code: string
  contact_email?: string
  contact_phone?: string
  city?: string
  country_code?: string
  api_url?: string
  sync_enabled: boolean
  sync_frequency?: string
  last_sync_at?: string
  commission_rate?: number
  lead_time_days?: number
  is_active: boolean
  is_dropship: boolean
  products_count: number
  orders_count: number
  created_at: string
}

interface Stats {
  total_suppliers: number
  active_suppliers: number
  dropship_suppliers: number
  total_dropship_products: number
  pending_supplier_orders: number
  monthly_dropship_margin: number
}

export default function SuppliersPage() {
  const router = useRouter()
  const toast = useToast()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [filterDropship, setFilterDropship] = useState<boolean | null>(null)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("medusa_admin_token")
      const headers: Record<string, string> = { 
        "Content-Type": "application/json",
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
      
      console.log("Loading suppliers with token:", token ? "yes" : "no")
      
      // Load suppliers
      const suppliersRes = await fetch(`${BACKEND_URL}/admin/suppliers`, { headers })
      console.log("Suppliers response status:", suppliersRes.status)
      const suppliersData = await suppliersRes.json()
      console.log("Suppliers data:", suppliersData)
      setSuppliers(suppliersData.suppliers || [])

      // Load stats
      const statsRes = await fetch(`${BACKEND_URL}/admin/suppliers/stats`, { headers })
      const statsData = await statsRes.json()
      setStats(statsData.stats || null)
    } catch (error) {
      console.error("Error loading suppliers:", error)
      toast.error("Błąd podczas ładowania dostawców")
    } finally {
      setLoading(false)
    }
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem("medusa_admin_token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const handleSync = async (supplierId: string) => {
    try {
      setSyncing(supplierId)
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
      setSyncing(null)
    }
  }

  const handleDelete = async (supplierId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tego dostawcę?")) return

    try {
      const res = await fetch(`${BACKEND_URL}/admin/suppliers/${supplierId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      
      if (res.ok) {
        toast.success("Dostawca został usunięty")
        loadData()
      } else {
        const data = await res.json()
        toast.error(data.message || "Błąd podczas usuwania")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Błąd podczas usuwania dostawcy")
    }
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!supplier.name.toLowerCase().includes(query) &&
          !supplier.code.toLowerCase().includes(query) &&
          !supplier.contact_email?.toLowerCase().includes(query)) {
        return false
      }
    }
    if (filterActive !== null && supplier.is_active !== filterActive) return false
    if (filterDropship !== null && supplier.is_dropship !== filterDropship) return false
    return true
  })

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-theme-primary">Dostawcy Dropship</h1>
            <p className="text-theme-secondary mt-1">
              Zarządzaj dostawcami i produktami dropshipping
            </p>
          </div>
          <Link href="/suppliers/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj dostawcę
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-theme-secondary rounded-xl border border-theme p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-theme-secondary">Aktywni dostawcy</p>
                  <p className="text-2xl font-bold text-theme-primary">
                    {stats.active_suppliers} / {stats.total_suppliers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-theme-secondary rounded-xl border border-theme p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-theme-secondary">Produkty dropship</p>
                  <p className="text-2xl font-bold text-theme-primary">
                    {stats.total_dropship_products}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-theme-secondary rounded-xl border border-theme p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-theme-secondary">Oczekujące zamówienia</p>
                  <p className="text-2xl font-bold text-theme-primary">
                    {stats.pending_supplier_orders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-theme-secondary rounded-xl border border-theme p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-theme-secondary">Marża (30 dni)</p>
                  <p className="text-2xl font-bold text-theme-primary">
                    {formatCurrency(stats.monthly_dropship_margin / 100)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-theme-secondary rounded-lg border border-theme p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-muted" />
              <input
                type="text"
                placeholder="Szukaj dostawcy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>

            <select
              value={filterActive === null ? "" : filterActive.toString()}
              onChange={(e) => setFilterActive(e.target.value === "" ? null : e.target.value === "true")}
              className="px-3 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Wszystkie statusy</option>
              <option value="true">Aktywni</option>
              <option value="false">Nieaktywni</option>
            </select>

            <select
              value={filterDropship === null ? "" : filterDropship.toString()}
              onChange={(e) => setFilterDropship(e.target.value === "" ? null : e.target.value === "true")}
              className="px-3 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Wszystkie typy</option>
              <option value="true">Dropship</option>
              <option value="false">Własny magazyn</option>
            </select>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="bg-theme-secondary rounded-lg border border-theme overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dostawca</TableHead>
                <TableHead>Kod</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Produkty</TableHead>
                <TableHead>Zamówienia</TableHead>
                <TableHead>Sync</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-theme-muted">
                    Nie znaleziono dostawców
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-theme-tertiary rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-theme-secondary" />
                        </div>
                        <div>
                          <Link 
                            href={`/suppliers/${supplier.id}`}
                            className="font-medium text-theme-primary hover:text-accent"
                          >
                            {supplier.name}
                          </Link>
                          {supplier.is_dropship && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">
                              Dropship
                            </span>
                          )}
                          {supplier.city && (
                            <p className="text-sm text-theme-muted">{supplier.city}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm bg-theme-tertiary px-2 py-1 rounded text-theme-primary">
                        {supplier.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      {supplier.contact_email ? (
                        <div className="text-sm">
                          <p className="text-theme-primary">{supplier.contact_email}</p>
                          {supplier.contact_phone && (
                            <p className="text-theme-muted">{supplier.contact_phone}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-theme-muted">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-theme-primary">{supplier.products_count}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-theme-primary">{supplier.orders_count}</span>
                    </TableCell>
                    <TableCell>
                      {supplier.sync_enabled ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <div className="text-sm">
                            <p className="text-theme-primary">{supplier.sync_frequency}</p>
                            {supplier.last_sync_at && (
                              <p className="text-theme-muted text-xs">
                                {formatDate(supplier.last_sync_at)}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-theme-muted">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm">Wyłączony</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {supplier.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          Aktywny
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-theme-tertiary text-theme-secondary">
                          Nieaktywny
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {supplier.sync_enabled && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSync(supplier.id)}
                            disabled={syncing === supplier.id}
                          >
                            <RefreshCw className={`w-4 h-4 ${syncing === supplier.id ? 'animate-spin' : ''}`} />
                          </Button>
                        )}
                        <Link href={`/suppliers/${supplier.id}`}>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(supplier.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}
