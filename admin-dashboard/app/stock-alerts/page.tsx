"use client"

/**
 * Stock Alerts Management Page
 * 
 * Automatyczne alerty przy niskich stanach magazynowych
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { Plus, Bell, BellOff, Mail, AlertTriangle, Package } from "lucide-react"

export default function StockAlertsPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadAlerts()
  }, [router])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/stock-alerts`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('medusa_admin_token')}`,
          },
        }
      )
      const data = await response.json()
      setAlerts(data.stock_alerts || [])
    } catch (error) {
      console.error("Error loading stock alerts:", error)
      alert("Failed to load stock alerts")
    } finally {
      setLoading(false)
    }
  }

  const toggleAlert = async (alertId: string, currentStatus: boolean) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/stock-alerts/${alertId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('medusa_admin_token')}`,
          },
          body: JSON.stringify({ active: !currentStatus }),
        }
      )
      loadAlerts()
    } catch (error) {
      console.error("Error toggling alert:", error)
      alert("❌ Błąd podczas zmiany statusu alertu")
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
            <h1 className="text-2xl font-bold text-gray-900">Alerty Stanów Magazynowych</h1>
            <p className="text-gray-600 mt-1">
              Automatyczne powiadomienia przy niskich stanach
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nowy Alert
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Jak działają alerty?</h3>
          <ul className="text-yellow-800 text-sm space-y-1">
            <li>• System sprawdza stany magazynowe co 6 godzin</li>
            <li>• Gdy stan spadnie poniżej progu, wysyłane jest powiadomienie</li>
            <li>• Możesz skonfigurować auto-zamówienie do dostawcy</li>
            <li>• Alerty mogą być jednorazowe, dzienne lub tygodniowe</li>
          </ul>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {alerts.filter(a => a.active).length}
                </div>
                <div className="text-sm text-gray-600">Aktywne alerty</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {alerts.filter(a => a.times_triggered > 0).length}
                </div>
                <div className="text-sm text-gray-600">Uruchomione</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {alerts.filter(a => a.auto_order_enabled).length}
                </div>
                <div className="text-sm text-gray-600">Auto-zamówienia</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        {alerts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Brak alertów
            </h3>
            <p className="text-gray-600 mb-4">
              Utwórz pierwszy alert żeby otrzymywać powiadomienia o niskich stanach
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Utwórz Alert
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Produkt</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Próg</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Częstotliwość</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Akcje</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Uruchomień</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ostatnio</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => {
                  const actions = JSON.parse(alert.actions || '[]')
                  
                  return (
                    <tr key={alert.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleAlert(alert.id, alert.active)}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          {alert.active ? (
                            <Bell className="w-5 h-5 text-green-600" />
                          ) : (
                            <BellOff className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{alert.variant_id}</div>
                        <div className="text-sm text-gray-600">{alert.product_id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{alert.low_stock_threshold}</span>
                          {alert.critical_stock_threshold && (
                            <span className="text-xs text-red-600">
                              (krytyczny: {alert.critical_stock_threshold})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                          {alert.alert_frequency}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {actions.map((action: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800"
                            >
                              {action.type}
                            </span>
                          ))}
                          {alert.auto_order_enabled && (
                            <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                              auto-order
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold">{alert.times_triggered || 0}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {alert.last_alerted_at
                          ? new Date(alert.last_alerted_at).toLocaleDateString('pl-PL')
                          : 'Nigdy'
                        }
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="secondary">
                          Edytuj
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Create Modal Placeholder */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Nowy Alert Stanów</h2>
              <p className="text-gray-600 mb-4">
                Funkcja tworzenia alertów będzie dostępna wkrótce.
                <br />
                Możesz tworzyć alerty przez API:
              </p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`POST /admin/stock-alerts
{
  "variant_id": "var_123",
  "product_id": "prod_123",
  "low_stock_threshold": 10,
  "critical_stock_threshold": 5,
  "alert_frequency": "daily",
  "actions": [
    { "type": "email", "recipients": ["admin@example.com"] },
    { "type": "notification" }
  ],
  "auto_order_enabled": true,
  "auto_order_quantity": 50,
  "supplier_id": "supp_1"
}`}
              </pre>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setShowCreateModal(false)}>
                  Zamknij
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
