"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import { useToast } from "@/components/ui/Toast"
import { ArrowLeft, Save, Building2 } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export default function NewSupplierPage() {
  const router = useRouter()
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    postal_code: "",
    country_code: "PL",
    api_url: "",
    api_key: "",
    api_format: "json",
    sync_enabled: false,
    sync_frequency: "manual",
    commission_rate: 20,
    min_order_value: 0,
    lead_time_days: 3,
    shipping_method: "",
    is_dropship: true,
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.code) {
      toast.error("Nazwa i kod są wymagane")
      return
    }

    try {
      setSaving(true)
      
      const token = localStorage.getItem("medusa_admin_token")
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
      
      const res = await fetch(`${BACKEND_URL}/admin/suppliers`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...formData,
          commission_rate: parseFloat(formData.commission_rate.toString()) || 0,
          min_order_value: parseFloat(formData.min_order_value.toString()) || 0,
          lead_time_days: parseInt(formData.lead_time_days.toString()) || 3,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Dostawca został utworzony")
        router.push(`/suppliers/${data.supplier.id}`)
      } else {
        toast.error(data.message || "Błąd podczas tworzenia dostawcy")
      }
    } catch (error) {
      console.error("Error creating supplier:", error)
      toast.error("Błąd podczas tworzenia dostawcy")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/suppliers">
              <Button type="button" variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nowy dostawca</h1>
              <p className="text-gray-600 mt-1">Dodaj nowego dostawcę dropship</p>
            </div>
          </div>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Zapisywanie..." : "Zapisz"}
          </Button>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Podstawowe informacje
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwa dostawcy *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="np. Parts24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kod dostawcy *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
                placeholder="np. PARTS24"
              />
              <p className="text-xs text-gray-500 mt-1">Unikalny kod identyfikacyjny</p>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_dropship"
                  checked={formData.is_dropship}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Dostawca dropship (wysyłka bezpośrednio do klienta)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dane kontaktowe</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Osoba kontaktowa
              </label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Adres</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres linia 1
              </label>
              <input
                type="text"
                name="address_line_1"
                value={formData.address_line_1}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres linia 2
              </label>
              <input
                type="text"
                name="address_line_2"
                value={formData.address_line_2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miasto
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kod pocztowy
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kraj
              </label>
              <select
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="PL">Polska</option>
                <option value="DE">Niemcy</option>
                <option value="CZ">Czechy</option>
                <option value="SK">Słowacja</option>
                <option value="LT">Litwa</option>
                <option value="UA">Ukraina</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Integration */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Integracja API</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL API
              </label>
              <input
                type="url"
                name="api_url"
                value={formData.api_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://api.dostawca.pl/products"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Klucz API
              </label>
              <input
                type="password"
                name="api_key"
                value={formData.api_key}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format danych
              </label>
              <select
                name="api_format"
                value={formData.api_format}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="sync_enabled"
                  checked={formData.sync_enabled}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Włącz automatyczną synchronizację
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Częstotliwość synchronizacji
              </label>
              <select
                name="sync_frequency"
                value={formData.sync_frequency}
                onChange={handleChange}
                disabled={!formData.sync_enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              >
                <option value="manual">Ręcznie</option>
                <option value="hourly">Co godzinę</option>
                <option value="daily">Codziennie</option>
                <option value="weekly">Co tydzień</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Terms */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Warunki współpracy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domyślna marża (%)
              </label>
              <input
                type="number"
                name="commission_rate"
                value={formData.commission_rate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min. wartość zamówienia (PLN)
              </label>
              <input
                type="number"
                name="min_order_value"
                value={formData.min_order_value}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Czas realizacji (dni)
              </label>
              <input
                type="number"
                name="lead_time_days"
                value={formData.lead_time_days}
                onChange={handleChange}
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferowana metoda wysyłki
              </label>
              <input
                type="text"
                name="shipping_method"
                value={formData.shipping_method}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="np. DPD, InPost, DHL"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notatki</h2>
          
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Dodatkowe informacje o dostawcy..."
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/suppliers">
            <Button type="button" variant="secondary">
              Anuluj
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Zapisywanie..." : "Utwórz dostawcę"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
