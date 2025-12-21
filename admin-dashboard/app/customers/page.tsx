"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatDate } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { useToast } from "@/components/ui/Toast"
import { Search, Download, ArrowUpDown, ArrowUp, ArrowDown, X, UserPlus, Building2, Mail, Phone, MapPin, ShoppingCart, Truck, Calendar } from "lucide-react"

type SortField = 'email' | 'first_name' | 'last_name' | 'created_at' | 'company_name' | 'nip'
type SortDirection = 'asc' | 'desc'

interface CustomerMachine {
  brand: string
  model: string
  count: number
}

export default function CustomersPage() {
  const router = useRouter()
  const toast = useToast()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const customersPerPage = 20
  
  // Modal state
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [customerOrders, setCustomerOrders] = useState<any[]>([])
  const [customerMachines, setCustomerMachines] = useState<CustomerMachine[]>([])
  const [loadingCustomer, setLoadingCustomer] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadCustomers()
  }, [router])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const response = await api.getCustomers({ limit: 1000 })
      setCustomers(response.customers || [])
    } catch (error) {
      console.error("Error loading customers:", error)
      toast.error("Błąd podczas ładowania klientów")
    } finally {
      setLoading(false)
    }
  }

  const openCustomerCard = async (customer: any) => {
    setSelectedCustomer(customer)
    setLoadingCustomer(true)
    setCustomerOrders([])
    setCustomerMachines([])
    
    try {
      // Fetch customer orders
      const ordersRes = await api.getOrders({ limit: 100 })
      const allOrders = ordersRes.orders || []
      
      // Filter orders by customer email
      const custOrders = allOrders.filter((o: any) => 
        o.email === customer.email || o.customer_id === customer.id
      )
      setCustomerOrders(custOrders)
      
      // Extract machines from order items metadata
      const machineMap = new Map<string, CustomerMachine>()
      
      custOrders.forEach((order: any) => {
        order.items?.forEach((item: any) => {
          // Check item metadata for machine info
          const machineInfo = item.metadata?.machine || item.metadata?.selected_machine
          if (machineInfo) {
            const key = `${machineInfo.brand || 'Unknown'}-${machineInfo.model || 'Unknown'}`
            const existing = machineMap.get(key)
            if (existing) {
              existing.count++
            } else {
              machineMap.set(key, {
                brand: machineInfo.brand || 'Nieznana',
                model: machineInfo.model || 'Nieznany',
                count: 1
              })
            }
          }
          
          // Also check product title for machine patterns (e.g., "Filtr do Caterpillar 320D")
          const title = item.title || ''
          const machinePatterns = [
            /(?:do|dla|for)\s+([A-Z][a-zA-Z]+)\s+([A-Z0-9][a-zA-Z0-9\-]+)/i,
            /([A-Z][a-zA-Z]+)\s+([A-Z0-9][a-zA-Z0-9\-]+)\s+(?:filtr|filter|część|part)/i
          ]
          
          for (const pattern of machinePatterns) {
            const match = title.match(pattern)
            if (match) {
              const key = `${match[1]}-${match[2]}`
              const existing = machineMap.get(key)
              if (existing) {
                existing.count++
              } else {
                machineMap.set(key, {
                  brand: match[1],
                  model: match[2],
                  count: 1
                })
              }
              break
            }
          }
        })
      })
      
      setCustomerMachines(Array.from(machineMap.values()).sort((a, b) => b.count - a.count))
    } catch (error) {
      console.error("Error loading customer details:", error)
    } finally {
      setLoadingCustomer(false)
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

  const filteredCustomers = customers.filter(customer => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      customer.email?.toLowerCase().includes(query) ||
      customer.first_name?.toLowerCase().includes(query) ||
      customer.last_name?.toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query) ||
      customer.metadata?.company_name?.toLowerCase().includes(query) ||
      customer.metadata?.nip?.includes(query)
    )
  })

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aVal: any, bVal: any

    switch (sortField) {
      case 'company_name':
        aVal = a.metadata?.company_name || ''
        bVal = b.metadata?.company_name || ''
        break
      case 'nip':
        aVal = a.metadata?.nip || ''
        bVal = b.metadata?.nip || ''
        break
      case 'email':
        aVal = a.email || ''
        bVal = b.email || ''
        break
      case 'first_name':
        aVal = a.first_name || ''
        bVal = b.first_name || ''
        break
      case 'last_name':
        aVal = a.last_name || ''
        bVal = b.last_name || ''
        break
      case 'created_at':
        aVal = new Date(a.created_at).getTime()
        bVal = new Date(b.created_at).getTime()
        break
      default:
        return 0
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  )
  const totalPages = Math.ceil(sortedCustomers.length / customersPerPage)

  const exportCustomers = () => {
    const csv = [
      ["Nazwa firmy", "NIP", "Imię", "Nazwisko", "Email", "Telefon", "Typ"],
      ...sortedCustomers.map(customer => [
        customer.metadata?.company_name || '',
        customer.metadata?.nip || '',
        customer.first_name || '',
        customer.last_name || '',
        customer.email || '',
        customer.phone || customer.metadata?.phone || '',
        customer.metadata?.is_b2b ? 'B2B' : 'B2C',
      ])
    ].map(row => row.join(",")).join("\n")
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `klienci-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    toast.success("Wyeksportowano klientów do CSV")
  }

  const getTotalSpent = () => {
    return customerOrders.reduce((sum, order) => sum + (order.total || 0), 0) / 100
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
            <h1 className="text-2xl font-bold text-theme-primary">Klienci</h1>
            <p className="text-theme-secondary mt-1">
              Znaleziono {sortedCustomers.length} klientów
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportCustomers} variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Eksportuj CSV
            </Button>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Dodaj klienta
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-theme-secondary rounded-lg border border-theme p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-muted" />
              <input
                type="text"
                placeholder="Szukaj po email, imieniu, nazwisku, firmie, NIP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")} variant="ghost" size="sm">
                <X className="w-4 h-4 mr-1" />
                Wyczyść wyszukiwanie
              </Button>
            )}
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-theme-secondary rounded-lg border border-theme overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('company_name')}
                    className="flex items-center hover:text-theme-primary font-semibold"
                  >
                    Nazwa firmy {getSortIcon('company_name')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('nip')}
                    className="flex items-center hover:text-theme-primary font-semibold"
                  >
                    NIP {getSortIcon('nip')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('first_name')}
                    className="flex items-center hover:text-theme-primary font-semibold"
                  >
                    Imię {getSortIcon('first_name')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('last_name')}
                    className="flex items-center hover:text-theme-primary font-semibold"
                  >
                    Nazwisko {getSortIcon('last_name')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center hover:text-theme-primary font-semibold"
                  >
                    Email {getSortIcon('email')}
                  </button>
                </TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-theme-muted">
                    Nie znaleziono klientów
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id} 
                    className="cursor-pointer"
                    onClick={() => openCustomerCard(customer)}
                  >
                    <TableCell>
                      {customer.metadata?.company_name ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-theme-primary">{customer.metadata.company_name}</span>
                          {customer.metadata?.is_b2b && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">B2B</span>
                          )}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-theme-secondary">
                      {customer.metadata?.nip || '-'}
                    </TableCell>
                    <TableCell>{customer.first_name || '-'}</TableCell>
                    <TableCell>{customer.last_name || '-'}</TableCell>
                    <TableCell>
                      <span className="font-medium text-accent">
                        {customer.email}
                      </span>
                    </TableCell>
                    <TableCell className="text-theme-secondary">{customer.phone || customer.metadata?.phone || '-'}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openCustomerCard(customer) }}>
                        Szczegóły
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-theme-secondary">
              Strona {currentPage} z {totalPages} • Wyświetlanie {paginatedCustomers.length} z {sortedCustomers.length} klientów
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
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Następna
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Card Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCustomer(null)}>
          <div 
            className="bg-theme-secondary rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-accent p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                    {selectedCustomer.first_name?.[0]}{selectedCustomer.last_name?.[0] || selectedCustomer.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="text-white">
                    <h2 className="text-xl font-bold">
                      {selectedCustomer.first_name} {selectedCustomer.last_name}
                    </h2>
                    {selectedCustomer.metadata?.company_name && (
                      <p className="text-white/80 flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {selectedCustomer.metadata.company_name}
                      </p>
                    )}
                    {selectedCustomer.metadata?.is_b2b && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-white/20 rounded">
                        Klient B2B
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-white/80 hover:text-white p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-theme-tertiary rounded-lg">
                  <Mail className="w-5 h-5 text-theme-muted" />
                  <div>
                    <p className="text-xs text-theme-muted">Email</p>
                    <p className="text-theme-primary font-medium">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-theme-tertiary rounded-lg">
                  <Phone className="w-5 h-5 text-theme-muted" />
                  <div>
                    <p className="text-xs text-theme-muted">Telefon</p>
                    <p className="text-theme-primary font-medium">
                      {selectedCustomer.phone || selectedCustomer.metadata?.phone || '-'}
                    </p>
                  </div>
                </div>
                {selectedCustomer.metadata?.nip && (
                  <div className="flex items-center gap-3 p-3 bg-theme-tertiary rounded-lg">
                    <Building2 className="w-5 h-5 text-theme-muted" />
                    <div>
                      <p className="text-xs text-theme-muted">NIP</p>
                      <p className="text-theme-primary font-medium">{selectedCustomer.metadata.nip}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-theme-tertiary rounded-lg">
                  <Calendar className="w-5 h-5 text-theme-muted" />
                  <div>
                    <p className="text-xs text-theme-muted">Klient od</p>
                    <p className="text-theme-primary font-medium">{formatDate(selectedCustomer.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              {loadingCustomer ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-theme-tertiary rounded-lg">
                      <ShoppingCart className="w-6 h-6 mx-auto text-accent mb-2" />
                      <p className="text-2xl font-bold text-theme-primary">{customerOrders.length}</p>
                      <p className="text-sm text-theme-muted">Zamówień</p>
                    </div>
                    <div className="text-center p-4 bg-theme-tertiary rounded-lg">
                      <span className="text-2xl">💰</span>
                      <p className="text-2xl font-bold text-theme-primary">
                        {getTotalSpent().toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
                      </p>
                      <p className="text-sm text-theme-muted">Łączna wartość</p>
                    </div>
                  </div>

                  {/* Machines */}
                  <div>
                    <h3 className="text-lg font-semibold text-theme-primary mb-3 flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Maszyny klienta
                    </h3>
                    {customerMachines.length === 0 ? (
                      <p className="text-theme-muted text-sm py-4 text-center bg-theme-tertiary rounded-lg">
                        Brak danych o maszynach (na podstawie historii zamówień)
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {customerMachines.map((machine, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-theme-tertiary rounded-lg">
                            <div>
                              <p className="font-medium text-theme-primary">{machine.brand}</p>
                              <p className="text-sm text-theme-muted">{machine.model}</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded">
                              {machine.count} {machine.count === 1 ? 'zamówienie' : machine.count < 5 ? 'zamówienia' : 'zamówień'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Orders */}
                  {customerOrders.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-theme-primary mb-3">Ostatnie zamówienia</h3>
                      <div className="space-y-2">
                        {customerOrders.slice(0, 5).map((order) => (
                          <Link 
                            key={order.id} 
                            href={`/orders/${order.id}`}
                            className="flex items-center justify-between p-3 bg-theme-tertiary rounded-lg hover:bg-theme-hover transition-colors"
                          >
                            <div>
                              <p className="font-medium text-theme-primary">#{order.display_id}</p>
                              <p className="text-sm text-theme-muted">{formatDate(order.created_at)}</p>
                            </div>
                            <span className="font-medium text-theme-primary">
                              {((order.total || 0) / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-theme">
                <Link href={`/customers/${selectedCustomer.id}`} className="flex-1">
                  <Button className="w-full">Edytuj klienta</Button>
                </Link>
                <Button variant="secondary" onClick={() => setSelectedCustomer(null)}>
                  Zamknij
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
