"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/Toast"
import { Package, Send, RefreshCw, Truck, CheckCircle, Clock, XCircle, ExternalLink } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

interface SupplierOrder {
  id: string
  supplier_id: string
  order_id: string
  supplier_order_id?: string
  status: string
  tracking_number?: string
  supplier_total: number
  your_margin: number
  supplier_name: string
  supplier_code: string
  order_display_id: number
  customer_email: string
  items?: { sku: string; quantity: number; name?: string }[]
  created_at: string
  sent_at?: string
  shipped_at?: string
  delivered_at?: string
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Oczekuje", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  sent: { label: "Wysłane", color: "bg-blue-100 text-blue-800", icon: Send },
  confirmed: { label: "Potwierdzone", color: "bg-indigo-100 text-indigo-800", icon: CheckCircle },
  shipped: { label: "W transporcie", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Dostarczone", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Anulowane", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function SupplierOrdersPage() {
  const router = useRouter()
  const toast = useToast()
  const [orders, setOrders] = useState<SupplierOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState<string | null>(null)
  const [checking, setChecking] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadOrders()
  }, [filterStatus])

  const getHeaders = () => {
    const token = localStorage.getItem("medusa_admin_token")
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
  }

  const loadOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus) params.append("status", filterStatus)
      params.append("limit", "100")

      const res = await fetch(`${BACKEND_URL}/admin/supplier-orders?${params}`, { headers: getHeaders() })
      const data = await res.json()
      setOrders(data.supplier_orders || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (orderId: string) => {
    setSending(orderId)
    try {
      const res = await fetch(`${BACKEND_URL}/admin/supplier-orders/${orderId}/send`, {
        method: "POST",
        headers: getHeaders(),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        loadOrders()
      } else {
        toast.error(data.message || "Błąd wysyłania")
      }
    } catch (e) {
      toast.error("Błąd połączenia")
    } finally {
      setSending(null)
    }
  }

  const handleCheckStatus = async (orderId: string) => {
    setChecking(orderId)
    try {
      const res = await fetch(`${BACKEND_URL}/admin/supplier-orders/${orderId}/status`, { headers: getHeaders() })
      const data = await res.json()

      if (data.success) {
        toast.success(`Status: ${data.status}${data.tracking_number ? `, Tracking: ${data.tracking_number}` : ""}`)
        loadOrders()
      } else {
        toast.error(data.message || "Błąd sprawdzania")
      }
    } catch (e) {
      toast.error("Błąd połączenia")
    } finally {
      setChecking(null)
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    sent: orders.filter(o => o.status === "sent").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    totalMargin: orders.reduce((sum, o) => sum + (o.your_margin || 0), 0),
  }

  if (loading && orders.length === 0) {
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
            <h1 className="text-2xl font-bold">Zamówienia Dropship</h1>
            <p className="text-gray-600">Zamówienia wysyłane do dostawców</p>
          </div>
          <Button variant="secondary" onClick={loadOrders}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Odśwież
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600">Wszystkie</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600">Oczekujące</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600">Wysłane</p>
            <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600">W transporcie</p>
            <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600">Dostarczone</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600">Twoja marża</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalMargin / 100)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {["", "pending", "sent", "shipped", "delivered"].map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? "primary" : "secondary"}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status === "" ? "Wszystkie" : statusConfig[status]?.label || status}
            </Button>
          ))}
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zamówienie</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dostawca</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produkty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Koszt / Marża</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    Brak zamówień dropship
                  </td>
                </tr>
              ) : (
                orders.map(order => {
                  const config = statusConfig[order.status] || statusConfig.pending
                  const StatusIcon = config.icon
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium">#{order.order_display_id}</span>
                          <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{order.supplier_name}</span>
                        {order.supplier_order_id && (
                          <p className="text-xs text-gray-500">WC #{order.supplier_order_id}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {order.items?.map((item, i) => (
                          <div key={i} className="text-sm">
                            {item.quantity}x {item.sku}
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${config.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <span className="text-gray-600">{formatCurrency(order.supplier_total / 100)}</span>
                          <span className="text-green-600 ml-2">+{formatCurrency(order.your_margin / 100)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {order.tracking_number ? (
                          <span className="font-mono text-sm">{order.tracking_number}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {order.status === "pending" && !order.supplier_order_id && (
                            <Button
                              size="sm"
                              onClick={() => handleSend(order.id)}
                              disabled={sending === order.id}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          {order.supplier_order_id && order.status !== "delivered" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleCheckStatus(order.id)}
                              disabled={checking === order.id}
                            >
                              <RefreshCw className={`w-4 h-4 ${checking === order.id ? "animate-spin" : ""}`} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
