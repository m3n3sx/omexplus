"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatPrice, formatDate, getOrderStatusColor, getPaymentStatusColor } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import medusaClient from "@/lib/medusa-client"
import { Order } from "@/lib/types"
import { Search, Filter, Download } from "lucide-react"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ordersPerPage = 20

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadOrders()
  }, [router, currentPage, statusFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const offset = (currentPage - 1) * ordersPerPage
      
      const params: any = {
        limit: ordersPerPage,
        offset,
      }
      
      if (statusFilter !== "all") {
        params.status = statusFilter
      }
      
      const response = await medusaClient.admin.orders.list(params)
      setOrders(response.orders as Order[])
      setTotalPages(Math.ceil((response.count || 0) / ordersPerPage))
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      order.email.toLowerCase().includes(query) ||
      order.display_id.toString().includes(query) ||
      order.id.toLowerCase().includes(query)
    )
  })

  const exportOrders = () => {
    const csv = [
      ["Order ID", "Customer", "Date", "Status", "Payment", "Total"],
      ...filteredOrders.map(order => [
        `#${order.display_id}`,
        order.email,
        formatDate(order.created_at),
        order.status,
        order.payment_status,
        formatPrice(order.total, order.currency_code),
      ])
    ].map(row => row.join(",")).join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track all your orders</p>
          </div>
          <Button onClick={exportOrders} variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Fulfillment</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link href={`/orders/${order.id}`} className="font-medium text-primary-600 hover:text-primary-700">
                      #{order.display_id}
                    </Link>
                  </TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell className="text-gray-600">{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <Badge className={getOrderStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(order.payment_status)}>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">
                      {order.fulfillment_status || "not_fulfilled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(order.total, order.currency_code)}
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.id}`}>
                      <Button size="sm" variant="ghost">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
