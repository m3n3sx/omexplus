"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { TrendingUp, Plus, Search, Edit, Trash2 } from "lucide-react"

export default function PricingPage() {
  const router = useRouter()
  const [pricingTiers, setPricingTiers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadPricingTiers()
  }, [])

  const loadPricingTiers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("medusa_admin_token")
      const response = await fetch("http://localhost:9000/admin/b2b/pricing", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) throw new Error("Failed to load pricing tiers")
      
      const data = await response.json()
      setPricingTiers(data.pricing_tiers || [])
    } catch (error) {
      console.error("Error loading pricing tiers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTiers = pricingTiers.filter(tier => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      tier.product_name?.toLowerCase().includes(search) ||
      tier.sku?.toLowerCase().includes(search)
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
            <h1 className="text-2xl font-bold text-gray-900">Cenniki hurtowe</h1>
            <p className="text-gray-600 mt-1">
              Konfiguruj ceny i rabaty dla klientów B2B
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj cennik
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produkty z cennikiem B2B</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {pricingTiers.length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Średni rabat</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  15%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktywne poziomy cenowe</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  3
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj po nazwie produktu lub SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Pricing Tiers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cena detaliczna
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poziomy cenowe B2B
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTiers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Brak cenników hurtowych</p>
                      <Button className="mt-4" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Dodaj pierwszy cennik
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filteredTiers.map((tier) => (
                    <tr key={tier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tier.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {tier.product_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(tier.retail_price / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {tier.tiers?.map((t: any, idx: number) => (
                            <div key={idx} className="text-sm">
                              <span className="text-gray-600">
                                {t.qty_min}+ szt:
                              </span>
                              <span className="font-semibold text-gray-900 ml-2">
                                {(t.price / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
                              </span>
                              <Badge className="ml-2 bg-green-100 text-green-800">
                                -{t.discount_percentage}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                        <Button variant="secondary" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Jak działają cenniki hurtowe?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ustaw różne ceny w zależności od ilości zamawianej przez klienta</li>
            <li>• Rabaty są automatycznie stosowane przy składaniu zamówienia</li>
            <li>• Możesz ustawić nieograniczoną liczbę poziomów cenowych</li>
            <li>• Cenniki są widoczne tylko dla klientów B2B po zalogowaniu</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
