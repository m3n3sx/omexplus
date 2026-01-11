"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { useToast } from "@/components/ui/Toast"
import { isAuthenticated } from "@/lib/auth"
import { Building2, Search, Mail, Phone, X, Save, Loader2, CheckCircle } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export default function B2BCompaniesPage() {
  const router = useRouter()
  const toast = useToast()
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [gusLoading, setGusLoading] = useState(false)
  const [gusError, setGusError] = useState<string | null>(null)
  const [gusSuccess, setGusSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    contact_email: "",
    contact_phone: "",
    city: "",
    address_line_1: "",
    payment_terms: 14,
    credit_limit: 0,
    discount_percentage: 0,
  })

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
      
      const response = await fetch(`${BACKEND_URL}/admin/b2b/companies`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        console.warn("B2B companies endpoint returned:", response.status)
        setCompanies([])
        return
      }
      
      const data = await response.json()
      setCompanies(data.companies || [])
    } catch (error) {
      console.error("Error loading companies:", error)
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }))
    if (name === 'nip') {
      setGusSuccess(false)
      setGusError(null)
    }
  }

  const fetchCompanyFromGUS = async () => {
    const nip = formData.nip.replace(/[-\s]/g, '')
    if (!nip || nip.length !== 10) {
      setGusError('Wprowadź poprawny NIP (10 cyfr)')
      return
    }

    setGusLoading(true)
    setGusError(null)
    setGusSuccess(false)

    try {
      const response = await fetch(`/api/gus?nip=${encodeURIComponent(nip)}`)
      const data = await response.json()

      if (!response.ok) {
        setGusError(data.error || 'Nie znaleziono firmy')
        return
      }

      if (data.success && data.data) {
        setFormData(prev => ({
          ...prev,
          name: data.data.companyName || prev.name,
          nip: data.data.nip || prev.nip,
          address_line_1: data.data.address || prev.address_line_1,
          city: data.data.city || prev.city,
        }))
        setGusSuccess(true)
        toast.success('Dane firmy zostały pobrane z GUS')
      }
    } catch (error) {
      console.error('GUS fetch error:', error)
      setGusError('Błąd połączenia z GUS')
    } finally {
      setGusLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      toast.error("Nazwa firmy jest wymagana")
      return
    }
    try {
      setSaving(true)
      const token = localStorage.getItem("medusa_admin_token")
      const res = await fetch(`${BACKEND_URL}/admin/b2b/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Firma została utworzona")
        setShowModal(false)
        setFormData({
          name: "", nip: "", contact_email: "", contact_phone: "",
          city: "", address_line_1: "", payment_terms: 14, credit_limit: 0, discount_percentage: 0,
        })
        loadCompanies()
      } else {
        toast.error(data.message || "Błąd podczas tworzenia firmy")
      }
    } catch (error: any) {
      toast.error(error.message || "Błąd podczas tworzenia firmy")
    } finally {
      setSaving(false)
    }
  }

  const filteredCompanies = companies.filter(company => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      company.name?.toLowerCase().includes(search) ||
      company.contact_email?.toLowerCase().includes(search) ||
      company.nip?.includes(search)
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Firmy B2B</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Zarządzaj klientami hurtowymi</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Building2 className="w-4 h-4 mr-2" />
            Dodaj firmę
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj po nazwie, email lub NIP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">Aktywny</Badge>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{company.name || "Bez nazwy"}</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {company.contact_email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{company.contact_email}</div>}
                {company.contact_phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{company.contact_phone}</div>}
                {company.nip && <div className="flex items-center gap-2"><span className="font-medium">NIP:</span>{company.nip}</div>}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Limit kredytowy:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{(company.credit_limit || 0).toLocaleString('pl-PL')} PLN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Rabat:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{company.discount_percentage || 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Termin płatności:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{company.payment_terms || 14} dni</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="secondary" size="sm" className="w-full" onClick={() => router.push(`/b2b/companies/${company.id}`)}>
                  Zobacz szczegóły
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Brak firm B2B</p>
            <Button className="mt-4" onClick={() => setShowModal(true)}>
              <Building2 className="w-4 h-4 mr-2" />
              Dodaj pierwszą firmę
            </Button>
          </div>
        )}

        {/* Create Company Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nowa firma B2B</h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nazwa firmy *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NIP</label>
                    <div className="flex gap-2">
                      <input type="text" name="nip" value={formData.nip} onChange={handleChange}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={fetchCompanyFromGUS}
                        disabled={gusLoading || !formData.nip}
                        className="whitespace-nowrap"
                      >
                        {gusLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : gusSuccess ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        <span className="ml-1">GUS</span>
                      </Button>
                    </div>
                    {gusError && <p className="text-sm text-red-500 mt-1">{gusError}</p>}
                    {gusSuccess && <p className="text-sm text-green-500 mt-1">Dane pobrane z GUS</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefon</label>
                    <input type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Miasto</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adres</label>
                    <input type="text" name="address_line_1" value={formData.address_line_1} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Warunki handlowe</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Termin płatności (dni)</label>
                      <input type="number" name="payment_terms" value={formData.payment_terms} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Limit kredytowy (PLN)</label>
                      <input type="number" name="credit_limit" value={formData.credit_limit} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rabat (%)</label>
                      <input type="number" name="discount_percentage" value={formData.discount_percentage} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Anuluj</Button>
                  <Button type="submit" disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Zapisywanie..." : "Utwórz firmę"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
