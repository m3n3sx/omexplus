"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { ShoppingCart, Search, Download } from "lucide-react"

export default function PurchaseOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("medusa_admin_token")
      const response = await fetch("http://localhost:9000/admin/b2b/purchase-orders", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) throw new Error("Failed to load purchase orders")
      
      const data = await response.json()
      setOrders(data.purchase_orders || [])
    } catch (error) {
      console.error("Error loading purchase orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: "Oczekujące", className: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Potwierdzone", className: "bg-blue-100 text-blue-800" },
      processing: { label: "W realizacji", className: "bg-purple-100 text-purple-800" },
      shipped: { label: "Wysłane", className: "bg-indigo-100 text-indigo-800" },
      delivered: { label: "Dostarczone", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Anulowane", className: "bg-red-100 text-red-800" },
    }
    const config = statusMap[status] || statusMap.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || order.status === filterStatus
    
    return matchesSearch && matchesFilter
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
            <h1 className="text-2xl font-bold text-gray-900">Zamówienia zakupowe (PO)</h1>
            <p className="text-gray-600 mt-1">
              Przeglądaj i zarządzaj zamówieniami zakupowymi od klientów B2B
            </p>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Eksportuj
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Szukaj po numerze PO lub firmie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === "all" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                Wszystkie
              </Button>
              <Button
                variant={filterStatus === "pending" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("pending")}
                size="sm"
              >
                Oczekujące
              </Button>
              <Button
                variant={filterStatus === "processing" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("processing")}
                size="sm"
              >
                W realizacji
              </Button>
              <Button
                variant={filterStatus === "delivered" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("delivered")}
                size="sm"
              >
                Dostarczone
              </Button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numer PO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Firma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wartość
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warunki płatności
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data dostawy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data utworzenia
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Brak zamówień zakupowych</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.po_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.company_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {(order.total_amount / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.payment_terms}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString('pl-PL') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Button variant="secondary" size="sm">
                          Zobacz
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
