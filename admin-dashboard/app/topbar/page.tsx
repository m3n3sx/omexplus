"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Save, Phone, Mail, Globe, DollarSign } from "lucide-react"
import api from "@/lib/api-client"
import { isAuthenticated } from "@/lib/auth"

export default function TopbarSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    phone: "+48 500 189 080",
    email: "omexsales@gmail.com",
    languages: [
      { code: "pl", name: "POLISH", flag: "🇵🇱", enabled: true },
      { code: "en", name: "ENGLISH", flag: "🇬🇧", enabled: true },
      { code: "de", name: "GERMAN", flag: "🇩🇪", enabled: false },
    ],
    currencies: [
      { code: "PLN", symbol: "zł", enabled: true },
      { code: "EUR", symbol: "€", enabled: true },
      { code: "USD", symbol: "$", enabled: false },
    ],
    links: [
      { label: "FAQ", url: "/faq", enabled: true },
      { label: "ZŁOŻONE CZĘŚCI", url: "/checkout", enabled: true },
    ]
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadSettings()
  }, [router])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await api.getTopbarSettings()
      if (response.settings) {
        setSettings(response.settings)
      }
    } catch (error) {
      console.error("Error loading topbar settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.updateTopbarSettings(settings)
      alert("Ustawienia zapisane pomyślnie!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Błąd podczas zapisywania ustawień")
    } finally {
      setSaving(false)
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ustawienia Topbar</h1>
          <p className="text-gray-600 mt-1">Zarządzaj górnym paskiem nawigacyjnym</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Dane Kontaktowe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Języki
            </h2>
            <div className="space-y-2">
              {settings.languages.map((lang, index) => (
                <div key={lang.code} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={lang.enabled}
                    onChange={(e) => {
                      const newLangs = [...settings.languages]
                      newLangs[index].enabled = e.target.checked
                      setSettings({ ...settings, languages: newLangs })
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-2xl">{lang.flag}</span>
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => {
                      const newLangs = [...settings.languages]
                      newLangs[index].name = e.target.value
                      setSettings({ ...settings, languages: newLangs })
                    }}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-500">{lang.code.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Currencies */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Waluty
            </h2>
            <div className="space-y-2">
              {settings.currencies.map((currency, index) => (
                <div key={currency.code} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={currency.enabled}
                    onChange={(e) => {
                      const newCurr = [...settings.currencies]
                      newCurr[index].enabled = e.target.checked
                      setSettings({ ...settings, currencies: newCurr })
                    }}
                    className="w-4 h-4"
                  />
                  <span className="font-bold text-lg">{currency.symbol}</span>
                  <span className="flex-1 font-medium">{currency.code}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? <LoadingSpinner size="sm" /> : <Save className="w-5 h-5" />}
              Zapisz Ustawienia
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
