"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { useToast } from "@/components/ui/Toast"
import { isAuthenticated } from "@/lib/auth"
import { 
  ArrowLeft, Save, Building2, Mail, Phone, MapPin, 
  FileText, CreditCard, Percent, Calendar, Edit2, Trash2, Search, Loader2, CheckCircle 
} from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

interface Company {
  id: string
  name: string
  nip?: string
  regon?: string
  krs?: string
  contact_email?: string
  contact_phone?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  postal_code?: string
  country_code?: string
  payment_terms?: number
  credit_limit?: number
  discount_percentage?: number
  notes?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export default function CompanyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const toast = useToast()
  const companyId = params.id as string
  
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Company>>({})
  const [gusLoading, setGusLoading] = useState(false)
  const [gusError, setGusError] = useState<string | null>(null)
  const [gusSuccess, setGusSuccess] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadCompany()
  }, [companyId])

  const loadCompany = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("medusa_admin_token")
      const response = await fetch(`${BACKEND_URL}/admin/b2b/companies/${companyId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) throw new Error("Failed to load company")
      
      const data = await response.json()
      setCompany(data.company)
      setFormData(data.company)
    } catch (error) {
      console.error("Error loading company:", error)
      toast.error("Nie udało się załadować danych firmy")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    const nip = (formData.nip || '').replace(/[-\s]/g, '')
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
          regon: data.data.regon || prev.regon,
          address_line_1: data.data.address || prev.address_line_1,
          city: data.data.city || prev.city,
          postal_code: data.data.postalCode || prev.postal_code,
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

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem("medusa_admin_token")
      const response = await fetch(`${BACKEND_URL}/admin/b2b/companies/${companyId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error("Failed to update company")
      
      const data = await response.json()
      setCompany(data.company)
      setEditing(false)
      toast.success("Firma została zaktualizowana")
    } catch (error) {
      console.error("Error updating company:", error)
      toast.error("Nie udało się zaktualizować firmy")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć tę firmę?")) return
    
    try {
      const token = localStorage.getItem("medusa_admin_token")
      const response = await fetch(`${BACKEND_URL}/admin/b2b/companies/${companyId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
      
      if (!response.ok) throw new Error("Failed to delete company")
      
      toast.success("Firma została usunięta")
      router.push("/b2b/companies")
    } catch (error) {
      console.error("Error deleting company:", error)
      toast.error("Nie udało się usunąć firmy")
    }
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

  if (!company) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Firma nie została znaleziona</p>
          <Link href="/b2b/companies">
            <Button className="mt-4">Powrót do listy</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/b2b/companies">
              <Button type="button" variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-600 mt-1">
                {company.nip && `NIP: ${company.nip}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Anuluj
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Zapisywanie..." : "Zapisz"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edytuj
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Usuń
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Dane firmy
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa firmy</label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{company.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
              {editing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="nip"
                      value={formData.nip || ""}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
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
                      <span className="ml-2">GUS</span>
                    </Button>
                  </div>
                  {gusError && <p className="text-sm text-red-500">{gusError}</p>}
                  {gusSuccess && <p className="text-sm text-green-500">Dane pobrane z GUS</p>}
                </div>
              ) : (
                <p className="text-gray-900">{company.nip || "-"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">REGON</label>
              {editing ? (
                <input
                  type="text"
                  name="regon"
                  value={formData.regon || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{company.regon || "-"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KRS</label>
              {editing ? (
                <input
                  type="text"
                  name="krs"
                  value={formData.krs || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{company.krs || "-"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Dane kontaktowe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {editing ? (
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{company.contact_email || "-"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              {editing ? (
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{company.contact_phone || "-"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Adres
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
              {editing ? (
                <input
                  type="text"
                  name="address_line_1"
                  value={formData.address_line_1 || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{company.address_line_1 || "-"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Miasto</label>
              {editing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{company.city || "-"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kod pocztowy</label>
              {editing ? (
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{company.postal_code || "-"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Terms */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Warunki handlowe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Termin płatności (dni)</label>
              {editing ? (
                <input
                  type="number"
                  name="payment_terms"
                  value={formData.payment_terms || 14}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{company.payment_terms || 14} dni</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limit kredytowy (PLN)</label>
              {editing ? (
                <input
                  type="number"
                  name="credit_limit"
                  value={formData.credit_limit || 0}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{(company.credit_limit || 0).toLocaleString('pl-PL')} PLN</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rabat (%)</label>
              {editing ? (
                <input
                  type="number"
                  name="discount_percentage"
                  value={formData.discount_percentage || 0}
                  onChange={handleChange}
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900 text-green-600 font-semibold">{company.discount_percentage || 0}%</p>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Notatki
          </h2>
          
          {editing ? (
            <textarea
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          ) : (
            <p className="text-gray-900 whitespace-pre-wrap">{company.notes || "Brak notatek"}</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
