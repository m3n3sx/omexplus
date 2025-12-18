"use client"

/**
 * Price Rules Management Page
 * 
 * Automatyczne reguły cenowe - marże, rabaty, zaokrąglenia
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { isAuthenticated } from "@/lib/auth"
import { Plus, Play, Eye, Edit, Trash2, TrendingUp, Percent } from "lucide-react"

export default function PriceRulesPage() {
  const router = useRouter()
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [applyingRule, setApplyingRule] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadRules()
  }, [router])

  const loadRules = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/price-rules`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('medusa_admin_token')}`,
          },
        }
      )
      const data = await response.json()
      setRules(data.price_rules || [])
    } catch (error) {
      console.error("Error loading price rules:", error)
      alert("Failed to load price rules")
    } finally {
      setLoading(false)
    }
  }

  const applyRule = async (ruleId: string, dryRun = false) => {
    try {
      setApplyingRule(ruleId)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/price-rules/${ruleId}/apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('medusa_admin_token')}`,
          },
          body: JSON.stringify({ dryRun }),
        }
      )
      const data = await response.json()
      
      if (dryRun) {
        // Show preview
        const changedProducts = data.results.filter((r: any) => r.changed)
        const preview = changedProducts.slice(0, 5).map((r: any) => 
          `${r.title}: ${(r.old_price / 100).toFixed(2)} → ${(r.new_price / 100).toFixed(2)} PLN (${r.change_percentage}%)`
        ).join('\n')
        
        alert(`📊 Preview:\n\n${data.affected} produktów zostanie zaktualizowanych\n\nPrzykłady:\n${preview}`)
      } else {
        alert(`✅ Zaktualizowano ${data.affected} produktów!\n\nCeny zostały automatycznie zsynchronizowane ze sklepem.`)
        loadRules()
      }
    } catch (error) {
      console.error("Error applying rule:", error)
      alert("❌ Błąd podczas aplikowania reguły")
    } finally {
      setApplyingRule(null)
    }
  }

  const deleteRule = async (ruleId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tę regułę?")) return

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/price-rules/${ruleId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('medusa_admin_token')}`,
          },
        }
      )
      alert("✅ Reguła usunięta")
      loadRules()
    } catch (error) {
      console.error("Error deleting rule:", error)
      alert("❌ Błąd podczas usuwania reguły")
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
            <h1 className="text-2xl font-bold text-gray-900">Reguły Cenowe</h1>
            <p className="text-gray-600 mt-1">
              Automatyczne marże, rabaty i zaokrąglenia
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nowa Reguła
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Jak to działa?</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Utwórz regułę cenową (np. marża 30% dla kategorii "Hydraulika")</li>
            <li>• Kliknij "Preview" żeby zobaczyć zmiany przed zastosowaniem</li>
            <li>• Kliknij "Zastosuj" żeby zaktualizować ceny</li>
            <li>• Ceny są automatycznie synchronizowane ze sklepem</li>
          </ul>
        </div>

        {/* Rules List */}
        {rules.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Brak reguł cenowych
            </h3>
            <p className="text-gray-600 mb-4">
              Utwórz pierwszą regułę żeby automatyzować zarządzanie cenami
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Utwórz Regułę
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nazwa</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Typ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Wartość</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Produkty</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ostatnio</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{rule.name}</div>
                      {rule.description && (
                        <div className="text-sm text-gray-600">{rule.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                        {rule.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {rule.margin_percentage && (
                        <span className="flex items-center gap-1">
                          <Percent className="w-4 h-4" />
                          +{rule.margin_percentage}%
                        </span>
                      )}
                      {rule.discount_percentage && (
                        <span className="flex items-center gap-1">
                          <Percent className="w-4 h-4" />
                          -{rule.discount_percentage}%
                        </span>
                      )}
                      {rule.margin_fixed && `+${rule.margin_fixed} PLN`}
                      {rule.fixed_price && `${rule.fixed_price} PLN`}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        rule.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.active ? 'Aktywna' : 'Nieaktywna'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold">{rule.products_affected || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {rule.last_applied_at 
                        ? new Date(rule.last_applied_at).toLocaleDateString('pl-PL')
                        : 'Nigdy'
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => applyRule(rule.id, true)}
                          disabled={applyingRule === rule.id}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => applyRule(rule.id, false)}
                          disabled={applyingRule === rule.id}
                        >
                          {applyingRule === rule.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteRule(rule.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create Modal Placeholder */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Nowa Reguła Cenowa</h2>
              <p className="text-gray-600 mb-4">
                Funkcja tworzenia reguł będzie dostępna wkrótce.
                <br />
                Możesz tworzyć reguły przez API:
              </p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`POST /admin/price-rules
{
  "name": "Marża 30% dla hydrauliki",
  "type": "percentage_margin",
  "margin_percentage": 30,
  "collection_ids": ["col_hydraulics"],
  "active": true
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
