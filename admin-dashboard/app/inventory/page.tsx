"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { Package, Search, Download, AlertTriangle, Warehouse } from "lucide-react"

export default function InventoryPage() {
  const router = useRouter()
  const [inventory, setInventory] = useState<any[]>([])
  const [stockLocations, setStockLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStock, setFilterStock] = useState<"all" | "low" | "out">("all")
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("medusa_admin_token")
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
      
      const locationsRes = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/admin/stock-locations`, { headers })
      if (locationsRes.ok) {
        const locData = await locationsRes.json()
        setStockLocations(locData.stock_locations || [])
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/admin/inventory-items?limit=100`, { headers })
      
      if (!response.ok) throw new Error("Failed to load inventory")
      
      const data = await response.json()
      setInventory(data.inventory_items || [])
    } catch (error) {
      console.error("Error loading inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = !searchTerm || 
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const qty = item.stocked_quantity || 0
    const matchesFilter = 
      filterStock === "all" ||
      (filterStock === "low" && qty > 0 && qty <= 10) ||
      (filterStock === "out" && qty === 0)
    
    const matchesLocation = !selectedLocation || 
      item.location_levels?.some((level: any) => level.location_id === selectedLocation)
    
    return matchesSearch && matchesFilter && matchesLocation
  })

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Brak</Badge>
    if (quantity <= 10) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Niski</Badge>
    return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">OK</Badge>
  }

  const stats = {
    total: inventory.length,
    available: inventory.filter(i => (i.stocked_quantity || 0) > 10).length,
    low: inventory.filter(i => { const q = i.stocked_quantity || 0; return q > 0 && q <= 10 }).length,
    out: inventory.filter(i => (i.stocked_quantity || 0) === 0).length,
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-theme-primary">Stany magazynowe</h1>
            <p className="text-theme-secondary mt-1">Produkty w magazynie Medusa</p>
          </div>
          <Button onClick={() => {
            const csv = ["SKU,Nazwa,Stan", ...filteredInventory.map(i => 
              `${i.sku || ""},${i.title || ""},${i.stocked_quantity || 0}`
            )].join("\n")
            const blob = new Blob([csv], { type: "text/csv" })
            const a = document.createElement("a")
            a.href = URL.createObjectURL(blob)
            a.download = "inventory.csv"
            a.click()
          }}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>

        {stockLocations.length > 0 && (
          <div className="bg-theme-secondary rounded-lg border border-theme p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-theme-primary">
              <Warehouse className="w-5 h-5" />
              Lokalizacje ({stockLocations.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {stockLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(selectedLocation === loc.id ? null : loc.id)}
                  className={`px-4 py-2 rounded-lg border-2 transition text-theme-primary ${
                    selectedLocation === loc.id
                      ? "border-accent bg-accent/10"
                      : "border-theme hover:border-theme-hover"
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-theme-secondary rounded-lg border border-theme p-6">
            <p className="text-sm text-theme-secondary">Wszystkie</p>
            <p className="text-2xl font-bold text-theme-primary">{stats.total}</p>
          </div>
          <div className="bg-theme-secondary rounded-lg border border-theme p-6">
            <p className="text-sm text-theme-secondary">Dostępne</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.available}</p>
          </div>
          <div className="bg-theme-secondary rounded-lg border border-theme p-6">
            <p className="text-sm text-theme-secondary">Niski stan</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.low}</p>
          </div>
          <div className="bg-theme-secondary rounded-lg border border-theme p-6">
            <p className="text-sm text-theme-secondary">Brak</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.out}</p>
          </div>
        </div>

        <div className="bg-theme-secondary rounded-lg border border-theme p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex gap-2">
            <Button variant={filterStock === "all" ? "primary" : "secondary"} onClick={() => setFilterStock("all")}>
              Wszystkie
            </Button>
            <Button variant={filterStock === "low" ? "primary" : "secondary"} onClick={() => setFilterStock("low")}>
              Niski ({stats.low})
            </Button>
            <Button variant={filterStock === "out" ? "primary" : "secondary"} onClick={() => setFilterStock("out")}>
              Brak ({stats.out})
            </Button>
          </div>
        </div>

        <div className="bg-theme-secondary rounded-lg border border-theme overflow-hidden">
          <table className="w-full">
            <thead className="bg-theme-tertiary border-b border-theme">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase">Nazwa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase">Stan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-theme-muted">
                    Brak produktów
                  </td>
                </tr>
              ) : (
                filteredInventory.slice(0, 100).map((item) => (
                  <tr key={item.id} className="hover:bg-theme-hover">
                    <td className="px-6 py-4 font-mono text-sm text-theme-primary">{item.sku || "-"}</td>
                    <td className="px-6 py-4 text-theme-primary">{item.title || "Bez nazwy"}</td>
                    <td className="px-6 py-4">{getStockBadge(item.stocked_quantity || 0)}</td>
                    <td className="px-6 py-4 font-medium text-theme-primary">{item.stocked_quantity || 0} szt.</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
