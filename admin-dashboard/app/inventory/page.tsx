"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { Package, Search, Download, AlertTriangle } from "lucide-react"

export default function InventoryPage() {
  const router = useRouter()
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStock, setFilterStock] = useState<"all" | "low" | "out">("all")

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
      const response = await fetch("http://localhost:9000/admin/inventory", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) throw new Error("Failed to load inventory")
      
      const data = await response.json()
      setInventory(data.inventory || [])
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
    
    const matchesFilter = 
      filterStock === "all" ||
      (filterStock === "low" && item.quantity > 0 && item.quantity <= 10) ||
      (filterStock === "out" && item.quantity === 0)
    
    return matchesSearch && matchesFilter
  })

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge className="bg-red-100 text-red-800">Brak w magazynie</Badge>
    } else if (quantity <= 10) {
      return <Badge className="bg-yellow-100 text-yellow-800">Niski stan</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800">Dostępny</Badge>
    }
  }

  const exportToCSV = () => {
    const headers = ["SKU", "Nazwa", "Stan magazynowy", "Zarezerwowane", "Dostępne"]
    const rows = filteredInventory.map(item => [
      item.sku || "",
      item.title || "",
      item.quantity || 0,
      item.reserved_quantity || 0,
      (item.quantity || 0) - (item.reserved_quantity || 0)
    ])
    
    const csv = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `stany-magazynowe-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
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

  const lowStockCount = inventory.filter(i => i.quantity > 0 && i.quantity <= 10).length
  const outOfStockCount = inventory.filter(i => i.quantity === 0).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stany magazynowe</h1>
            <p className="text-gray-600 mt-1">
              Zarządzaj stanami magazynowymi produktów
            </p>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Eksportuj CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wszystkie produkty</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {inventory.length}
                </p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dostępne</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {inventory.filter(i => i.quantity > 10).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Niski stan</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {lowStockCount}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Brak w magazynie</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {outOfStockCount}
                </p>
              </div>
              <Package className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Szukaj po SKU lub nazwie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStock === "all" ? "primary" : "secondary"}
                onClick={() => setFilterStock("all")}
              >
                Wszystkie
              </Button>
              <Button
                variant={filterStock === "low" ? "primary" : "secondary"}
                onClick={() => setFilterStock("low")}
              >
                Niski stan ({lowStockCount})
              </Button>
              <Button
                variant={filterStock === "out" ? "primary" : "secondary"}
                onClick={() => setFilterStock("out")}
              >
                Brak ({outOfStockCount})
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nazwa produktu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ilość
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zarezerwowane
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dostępne
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Brak produktów do wyświetlenia
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.sku || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.title || "Bez nazwy"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStockBadge(item.quantity || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.reserved_quantity || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(item.quantity || 0) - (item.reserved_quantity || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Wyświetlono {filteredInventory.length} z {inventory.length} produktów
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
