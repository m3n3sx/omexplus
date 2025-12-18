"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { Building2, Users, FileText, ShoppingCart, TrendingUp, Plus } from "lucide-react"

export default function B2BPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    companies: 0,
    quotes: 0,
    purchaseOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("medusa_admin_token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://ooxo.pl'}/admin/b2b/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) throw new Error("Failed to load B2B stats")
      
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("Error loading B2B stats:", error)
    } finally {
      setLoading(false)
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">B2B - Sprzedaż hurtowa</h1>
            <p className="text-gray-600 mt-1">
              Zarządzaj klientami hurtowymi, ofertami i zamówieniami zakupowymi
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Firmy B2B</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.companies}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Oferty</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.quotes}
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Zamówienia zakupowe</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.purchaseOrders}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Przychód B2B</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(stats.totalRevenue / 100).toLocaleString('pl-PL')} PLN
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/b2b/companies">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer">
              <Building2 className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Firmy B2B</h3>
              <p className="text-sm text-gray-600">
                Zarządzaj firmami hurtowymi i ich kontami
              </p>
            </div>
          </Link>

          <Link href="/b2b/quotes">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer">
              <FileText className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Oferty</h3>
              <p className="text-sm text-gray-600">
                Twórz i zarządzaj ofertami dla klientów
              </p>
            </div>
          </Link>

          <Link href="/b2b/purchase-orders">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer">
              <ShoppingCart className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Zamówienia zakupowe</h3>
              <p className="text-sm text-gray-600">
                Przeglądaj zamówienia zakupowe (PO)
              </p>
            </div>
          </Link>

          <Link href="/b2b/pricing">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer">
              <TrendingUp className="w-8 h-8 text-orange-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Cenniki hurtowe</h3>
              <p className="text-sm text-gray-600">
                Konfiguruj ceny i rabaty hurtowe
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ostatnia aktywność</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nowa firma B2B</p>
                  <p className="text-sm text-gray-600">ABC Sp. z o.o. została dodana</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 godz. temu</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Oferta zaakceptowana</p>
                  <p className="text-sm text-gray-600">Oferta #Q-2024-001 - 45 000 PLN</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">5 godz. temu</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nowe zamówienie zakupowe</p>
                  <p className="text-sm text-gray-600">PO-2024-123 - 78 500 PLN</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">1 dzień temu</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
