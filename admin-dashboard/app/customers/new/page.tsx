"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import { useToast } from "@/components/ui/Toast"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { ArrowLeft, Save, User, Building2, Mail, Search, Loader2, CheckCircle } from "lucide-react"

export default function NewCustomerPage() {
  const router = useRouter()
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [isB2B, setIsB2B] = useState(false)
  const [gusLoading, setGusLoading] = useState(false)
  const [gusError, setGusError] = useState<string | null>(null)
  const [gusSuccess, setGusSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    company_name: "",
    nip: "",
    address_1: "",
    address_2: "",
    city: "",
    postal_code: "",
    country_code: "pl",
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
          company_name: data.data.companyName || prev.company_name,
          nip: data.data.nip || prev.nip,
          address_1: data.data.address || prev.address_1,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      toast.error("Email jest wymagany")
      return
    }

    try {
      setSaving(true)
      
      const customerData = {
        email: formData.email,
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined,
        phone: formData.phone || undefined,
        metadata: {
          company_name: formData.company_name || undefined,
          nip: formData.nip || undefined,
          is_b2b: isB2B,
          phone: formData.phone || undefined,
        },
      }

      const response = await api.createCustomer(customerData)
      
      toast.success("Klient został utworzony")
      router.push(`/customers/${response.customer.id}`)
    } catch (error: any) {
      console.error("Error creating customer:", error)
      toast.error(error.message || "Błąd podczas tworzenia klienta")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/customers">
              <Button type="button" variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nowy klient</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Dodaj nowego klienta do systemu</p>
            </div>
          </div>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Zapisywanie..." : "Zapisz"}
          </Button>
        </div>

        {/* Customer Type */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Typ klienta</h2>
          <div className="flex gap-4">
            <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-colors ${!isB2B ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}>
              <input
                type="radio"
                name="customer_type"
                checked={!isB2B}
                onChange={() => setIsB2B(false)}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Klient indywidualny (B2C)</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Osoba prywatna</p>
                </div>
              </div>
            </label>
            <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-colors ${isB2B ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}>
              <input
                type="radio"
                name="customer_type"
                checked={isB2B}
                onChange={() => setIsB2B(true)}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Firma (B2B)</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Klient biznesowy</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Dane podstawowe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="klient@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Imię
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nazwisko
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="+48 123 456 789"
              />
            </div>
          </div>
        </div>

        {/* Company Info (B2B only) */}
        {isB2B && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Dane firmy
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nazwa firmy
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nazwa Sp. z o.o."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  NIP
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="nip"
                    value={formData.nip}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="1234567890"
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
                    <span className="ml-2">Pobierz z GUS</span>
                  </Button>
                </div>
                {gusError && (
                  <p className="text-sm text-red-500 mt-1">{gusError}</p>
                )}
                {gusSuccess && (
                  <p className="text-sm text-green-500 mt-1">Dane pobrane z GUS</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/customers">
            <Button type="button" variant="secondary">
              Anuluj
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Zapisywanie..." : "Utwórz klienta"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
