"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatDate, getOrderStatusColor } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { ArrowLeft, Save, Truck, XCircle } from "lucide-react"

const statusTranslations: { [key: string]: string } = {
  'pending': 'Oczekujące',
  'completed': 'Zrealizowane',
  'canceled': 'Anulowane',
  'draft': 'Wersja robocza',
  'archived': 'Zarchiwizowane',
  'requires_action': 'Wymaga działania'
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedStatus, setEditedStatus] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const response = await api.getOrder(orderId)
      setOrder(response.order)
      setEditedStatus(response.order.status)
      setEditedEmail(response.order.email || "")
      setNotes(response.order.metadata?.notes || "")
    } catch (error) {
      console.error("Error loading order:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.updateOrder(orderId, {
        status: editedStatus,
        email: editedEmail,
        metadata: {
          ...order.metadata,
          notes
        }
      })
      alert("Zamówienie zostało zaktualizowane")
      setEditMode(false)
      loadOrder()
    } catch (error: any) {
      console.error("Error updating order:", error)
      alert(`Błąd: ${error.message}`)
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

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Nie znaleziono zamówienia</p>
          <Link href="/orders">
            <Button className="mt-4">Powrót do listy</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Zamówienie #{order.display_id}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Utworzono {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!editMode ? (
              <Button onClick={() => setEditMode(true)}>
                Edytuj zamówienie
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => {
                  setEditMode(false)
                  setEditedStatus(order.status)
                  setEditedEmail(order.email || "")
                  setNotes(order.metadata?.notes || "")
                }}>
                  Anuluj
                </Button>
                <Button onClick={handleSave} isLoading={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  Zapisz zmiany
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status zamówienia</h2>
              {editMode ? (
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="pending">Oczekujące</option>
                  <option value="completed">Zrealizowane</option>
                  <option value="canceled">Anulowane</option>
                  <option value="draft">Wersja robocza</option>
                  <option value="archived">Zarchiwizowane</option>
                  <option value="requires_action">Wymaga działania</option>
                </select>
              ) : (
                <Badge className={getOrderStatusColor(order.status)}>
                  {statusTranslations[order.status] || order.status}
                </Badge>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Produkty</h2>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.title || `Produkt ${item.product_id}`}</p>
                      <p className="text-sm text-gray-600">Ilość: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {((item.unit_price || 0) / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
                      </p>
                      <p className="text-sm text-gray-600">
                        Razem: {((item.unit_price * item.quantity || 0) / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <span>Suma:</span>
                  <span>{((order.total || 0) / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notatki</h2>
              {editMode ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dodaj notatki do zamówienia..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-600">{notes || "Brak notatek"}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Klient</h2>
              {editMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Email:</p>
                  <p className="font-medium text-gray-900">{order.email || "Brak"}</p>
                  {order.customer_id && (
                    <Link href={`/customers/${order.customer_id}`} className="text-sm text-primary-600 hover:text-primary-700">
                      Zobacz profil klienta →
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Shipping Address */}
            {order.shipping_address && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Adres dostawy</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                  </p>
                  <p>{order.shipping_address.address_1}</p>
                  {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                  <p>
                    {order.shipping_address.postal_code} {order.shipping_address.city}
                  </p>
                  {order.shipping_address.phone && <p>Tel: {order.shipping_address.phone}</p>}
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Płatność</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={getOrderStatusColor(order.payment_status)}>
                    {order.payment_status || "Brak"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Waluta:</span>
                  <span className="font-medium">PLN</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Szybkie akcje</h2>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <Truck className="w-4 h-4 mr-2" />
                  Oznacz jako wysłane
                </Button>
                <Button variant="secondary" className="w-full justify-start text-red-600" size="sm">
                  <XCircle className="w-4 h-4 mr-2" />
                  Anuluj zamówienie
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
