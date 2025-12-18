"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { Building2, Search, Mail, Phone, CreditCard } from "lucide-react"

export default function B2BCompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("medusa_admin_token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://ooxo.pl'}/admin/b2b/companies`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) throw new Error("Failed to load companies")
      
      const data = await response.json()
      setCompanies(data.companies || [])
    } catch (error) {
      console.error("Error loading companies:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter(company => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      company.metadata?.company_name?.toLowerCase().includes(search) ||
      company.email?.toLowerCase().includes(search) ||
      company.metadata?.nip?.includes(search)
    )
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
            <h1 className="text-2xl font-bold text-gray-900">Firmy B2B</h1>
            <p className="text-gray-600 mt-1">
              Zarządzaj klientami hurtowymi
            </p>
          </div>
          <Button>
            <Building2 className="w-4 h-4 mr-2" />
            Dodaj firmę
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj po nazwie, email lub NIP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <Badge className="bg-green-100 text-green-800">Aktywny</Badge>
              </div>

              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {company.metadata?.company_name || "Bez nazwy"}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {company.email}
                </div>
                {company.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {company.phone}
                  </div>
                )}
                {company.metadata?.nip && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">NIP:</span>
                    {company.metadata.nip}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Limit kredytowy:</span>
                  <span className="font-semibold text-gray-900">
                    {((company.metadata?.credit_limit || 0) / 100).toLocaleString('pl-PL')} PLN
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rabat:</span>
                  <span className="font-semibold text-green-600">
                    {company.metadata?.discount_percentage || 0}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Warunki płatności:</span>
                  <span className="font-semibold text-gray-900">
                    {company.metadata?.payment_terms || 'NET30'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="secondary" size="sm" className="w-full">
                  Zobacz szczegóły
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Brak firm B2B</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
