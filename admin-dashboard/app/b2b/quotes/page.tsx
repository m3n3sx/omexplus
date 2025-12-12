"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { FileText, Plus, Search, Calendar, DollarSign } from "lucide-react"

export default function QuotesPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadQuotes()
  }, [])

  const loadQuotes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("medusa_admin_token")
      const response = await fetch("http://localhost:9000/admin/b2b/quotes", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) throw new Error("Failed to load quotes")
      
      const data = await response.json()
      setQuotes(data.quotes || [])
    } catch (error) {
      console.error("Error loading quotes:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      draft: { label: "Wersja robocza", className: "bg-gray-100 text-gray-800" },
      sent: { label: "Wysłana", className: "bg-blue-100 text-blue-800" },
      accepted: { label: "Zaakceptowana", className: "bg-green-100 text-green-800" },
      rejected: { label: "Odrzucona", className: "bg-red-100 text-red-800" },
      expired: { label: "Wygasła", className: "bg-yellow-100 text-yellow-800" },
    }
    const config = statusMap[status] || statusMap.draft
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = !searchTerm || 
      quote.quote_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || quote.status === filterStatus
    
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
            <h1 className="text-2xl font-bold text-gray-900">Oferty B2B</h1>
            <p className="text-gray-600 mt-1">
              Zarządzaj ofertami dla klientów hurtowych
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nowa oferta
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Szukaj po numerze oferty lub firmie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                Wszystkie
              </Button>
              <Button
                variant={filterStatus === "sent" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("sent")}
                size="sm"
              >
                Wysłane
              </Button>
              <Button
                variant={filterStatus === "accepted" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("accepted")}
                size="sm"
              >
                Zaakceptowane
              </Button>
            </div>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numer oferty
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
                    Ważna do
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
                {filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Brak ofert do wyświetlenia</p>
                      <Button className="mt-4" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Utwórz pierwszą ofertę
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {quote.quote_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {quote.company_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(quote.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {(quote.total_amount / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(quote.valid_until).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(quote.created_at).toLocaleDateString('pl-PL')}
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
