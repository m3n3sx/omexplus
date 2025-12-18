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
import { Search, Download, ArrowUpDown, ArrowUp, ArrowDown, X, UserPlus } from "lucide-react"

type SortField = 'email' | 'first_name' | 'last_name' | 'created_at' | 'company_name' | 'nip'
type SortDirection = 'asc' | 'desc'

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
      ["Nazwa firmy", "NIP", "Imię", "Nazwisko", "Email", "Typ", "Data rejestracji"],
      ...sortedCustomers.map(customer => [
        customer.metadata?.company_name || '',
        customer.metadata?.nip || '',
        customer.first_name || '',
        customer.last_name || '',
        customer.email || '',
        customer.metadata?.is_b2b ? 'B2B' : 'B2C',
        formatDate(customer.created_at),
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
            <h1 className="text-2xl font-bold text-gray-900">Klienci</h1>
            <p className="text-gray-600 mt-1">
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
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj po email, imieniu, nazwisku, firmie, NIP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('company_name')}
                    className="flex items-center hover:text-gray-900 font-semibold"
                  >
                    Nazwa firmy {getSortIcon('company_name')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('nip')}
                    className="flex items-center hover:text-gray-900 font-semibold"
                  >
                    NIP {getSortIcon('nip')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('first_name')}
                    className="flex items-center hover:text-gray-900 font-semibold"
                  >
                    Imię {getSortIcon('first_name')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('last_name')}
                    className="flex items-center hover:text-gray-900 font-semibold"
                  >
                    Nazwisko {getSortIcon('last_name')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center hover:text-gray-900 font-semibold"
                  >
                    Email {getSortIcon('email')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('created_at')}
                    className="flex items-center hover:text-gray-900 font-semibold"
                  >
                    Data rejestracji {getSortIcon('created_at')}
                  </button>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-gray-500">
                    Nie znaleziono klientów
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      {customer.metadata?.company_name ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{customer.metadata.company_name}</span>
                          {customer.metadata?.is_b2b && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">B2B</span>
                          )}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {customer.metadata?.nip || '-'}
                    </TableCell>
                    <TableCell>{customer.first_name || '-'}</TableCell>
                    <TableCell>{customer.last_name || '-'}</TableCell>
                    <TableCell>
                      <Link href={`/customers/${customer.id}`} className="font-medium text-primary-600 hover:text-primary-700">
                        {customer.email}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-600">{formatDate(customer.created_at)}</TableCell>
                    <TableCell>
                      <Link href={`/customers/${customer.id}`}>
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
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
    </DashboardLayout>
  )
}
