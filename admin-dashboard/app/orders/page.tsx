"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatDate, getOrderStatusColor, getPaymentStatusColor } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { useToast } from "@/components/ui/Toast"
import { Order } from "@/lib/types"
import { Search, Download, ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from "lucide-react"

const statusTranslations: { [key: string]: string } = {
  'pending': 'Oczekujące',
  'completed': 'Zrealizowane',
  'canceled': 'Anulowane',
  'draft': 'Wersja robocza',
  'archived': 'Zarchiwizowane',
  'requires_action': 'Wymaga działania'
}

const paymentStatusTranslations: { [key: string]: string } = {
  'not_paid': 'Nieopłacone',
  'awaiting': 'Oczekuje',
  'captured': 'Opłacone',
  'partially_refunded': 'Częściowo zwrócone',
  'refunded': 'Zwrócone',
  'canceled': 'Anulowane'
}

type SortField = 'display_id' | 'email' | 'created_at' | 'status' | 'total'
type SortDirection = 'asc' | 'desc'

export default function OrdersPage() {
  const router = useRouter()
  const toast = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ordersPerPage = 20

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadOrders()
  }, [router, currentPage, statusFilter, paymentFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const offset = (currentPage - 1) * ordersPerPage
      
      const params: any = {
        limit: 1000, // Load more for client-side filtering
        offset: 0,
      }
      
      const response = await api.getOrders(params)
      setOrders(response.orders as Order[])
    } catch (error) {
      console.error("Error loading orders:", error)
      toast.error("Błąd podczas ładowania zamówień")
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-30" />
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1" />
      : <ArrowDown className="w-4 h-4 ml-1" />
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setPaymentFilter("all")
    setDateFrom("")
    setDateTo("")
    setMinAmount("")
    setMaxAmount("")
  }

  const filteredOrders = orders.filter(order => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        order.email?.toLowerCase().includes(query) ||
        order.display_id?.toString().includes(query) ||
        order.id.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) return false

    // Payment filter
    if (paymentFilter !== "all" && order.payment_status !== paymentFilter) return false

    // Date range filter
    if (dateFrom) {
      const orderDate = new Date(order.created_at)
      const fromDate = new Date(dateFrom)
      if (orderDate < fromDate) return false
    }
    if (dateTo) {
      const orderDate = new Date(order.created_at)
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59)
      if (orderDate > toDate) return false
    }

    // Amount range filter
    if (minAmount) {
      const min = parseFloat(minAmount) * 100
      if ((order.total || 0) < min) return false
    }
    if (maxAmount) {
      const max = parseFloat(maxAmount) * 100
      if ((order.total || 0) > max) return false
    }

    return true
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aVal: any, bVal: any

    switch (sortField) {
      case 'display_id':
        aVal = a.display_id || 0
        bVal = b.display_id || 0
        break
      case 'email':
        aVal = a.email || ''
        bVal = b.email || ''
        break
      case 'created_at':
        aVal = new Date(a.created_at).getTime()
        bVal = new Date(b.created_at).getTime()
        break
      case 'status':
        aVal = a.status || ''
        bVal = b.status || ''
        break
      case 'total':
        aVal = a.total || 0
        bVal = b.total || 0
        break
      default:
        return 0
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Pagination
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  )
  const totalPagesCalculated = Math.ceil(sortedOrders.length / ordersPerPage)

  const exportOrders = () => {
    const csv = [
      ["Nr zamówienia", "Klient", "Data", "Status", "Płatność", "Wartość"],
      ...sortedOrders.map(order => [
        `#${order.display_id}`,
        order.email || 'Brak',
        formatDate(order.created_at),
        statusTranslations[order.status] || order.status,
        paymentStatusTranslations[order.payment_status] || order.payment_status,
        `${(order.total / 100).toFixed(2)} PLN`,
      ])
    ].map(row => row.join(",")).join("\n")
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `zamowienia-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    toast.success("Wyeksportowano zamówienia do CSV")
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
            <h1 className="text-2xl font-bold text-theme-primary">Zamówienia</h1>
            <p className="text-theme-secondary mt-1">
              Znaleziono {sortedOrders.length} zamówień
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              {showAdvancedFilters ? 'Ukryj filtry' : 'Zaawansowane filtry'}
            </Button>
            <Button onClick={exportOrders} variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Eksportuj CSV
            </Button>
          </div>
        </div>

        {/* Basic Filters */}
        <div className="bg-theme-secondary rounded-lg border border-theme p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-muted" />
              <input
                type="text"
                placeholder="Szukaj po email, numerze..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="pending">Oczekujące</option>
              <option value="completed">Zrealizowane</option>
              <option value="canceled">Anulowane</option>
              <option value="draft">Wersja robocza</option>
              <option value="archived">Zarchiwizowane</option>
              <option value="requires_action">Wymaga działania</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            >
              <option value="all">Wszystkie płatności</option>
              <option value="captured">Opłacone</option>
              <option value="not_paid">Nieopłacone</option>
              <option value="awaiting">Oczekuje</option>
              <option value="refunded">Zwrócone</option>
            </select>

            <Button onClick={clearFilters} variant="ghost" size="sm">
              <X className="w-4 h-4 mr-1" />
              Wyczyść filtry
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-theme-secondary rounded-lg border border-theme p-4">
            <h3 className="text-sm font-semibold text-theme-primary mb-4">Zaawansowane filtry</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-theme-secondary mb-1">Data od</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-theme-secondary mb-1">Data do</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-theme-secondary mb-1">Kwota min (PLN)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-theme-secondary mb-1">Kwota max (PLN)</label>
                <input
                  type="number"
                  placeholder="10000.00"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-theme-secondary rounded-lg border border-theme overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('display_id')}
                    className="flex items-center hover:text-theme-primary font-semibold"
                  >
                    Nr {getSortIcon('display_id')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center hover:text-theme-primary font-semibold"
                  >
                    Klient {getSortIcon('email')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('created_at')}
                    className="flex items-center hover:text-theme-primary font-semibold"
                  >
                    Data {getSortIcon('created_at')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center hover:text-theme-primary font-semibold"
                  >
                    Status {getSortIcon('status')}
                  </button>
                </TableHead>
                <TableHead>Płatność</TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('total')}
                    className="flex items-center ml-auto hover:text-theme-primary font-semibold"
                  >
                    Wartość {getSortIcon('total')}
                  </button>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-theme-muted">
                    Nie znaleziono zamówień spełniających kryteria
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/orders/${order.id}`} className="font-medium text-accent hover:underline">
                        #{order.display_id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.email || 'Brak email'}</TableCell>
                    <TableCell className="text-theme-secondary">{formatDate(order.created_at)}</TableCell>
                    <TableCell>
                      <Badge className={getOrderStatusColor(order.status)}>
                        {statusTranslations[order.status] || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        {paymentStatusTranslations[order.payment_status] || order.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {order.total ? `${(order.total / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN` : '0,00 PLN'}
                    </TableCell>
                    <TableCell>
                      <Link href={`/orders/${order.id}`}>
                        <Button size="sm" variant="ghost">Edytuj</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPagesCalculated > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-theme-secondary">
              Strona {currentPage} z {totalPagesCalculated} • Wyświetlanie {paginatedOrders.length} z {sortedOrders.length} zamówień
            </p>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Poprzednia
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPagesCalculated, p + 1))}
                disabled={currentPage === totalPagesCalculated}
              >
                Następna
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
