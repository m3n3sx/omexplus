"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatDate } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { ArrowLeft, Save, Mail, User, Calendar } from "lucide-react"

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedEmail, setEditedEmail] = useState("")
  const [editedFirstName, setEditedFirstName] = useState("")
  const [editedLastName, setEditedLastName] = useState("")
  const [editedPhone, setEditedPhone] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadCustomer()
  }, [customerId])

  const loadCustomer = async () => {
    try {
      setLoading(true)
      const response = await api.getCustomer(customerId)
      setCustomer(response.customer)
      setEditedEmail(response.customer.email || "")
      setEditedFirstName(response.customer.first_name || "")
      setEditedLastName(response.customer.last_name || "")
      setEditedPhone(response.customer.phone || "")

      // Load customer orders
      const ordersResponse = await api.getOrders({ limit: 100 })
      const customerOrders = ordersResponse.orders.filter((o: any) => o.customer_id === customerId)
      setOrders(customerOrders)
    } catch (error) {
      console.error("Error loading customer:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // Note: Medusa API might not support all these fields
      // This is a simplified example
      alert("Funkcja zapisu zostanie wkrótce dodana")
      setEditMode(false)
    } catch (error: any) {
      console.error("Error updating customer:", error)
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

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Nie znaleziono klienta</p>
          <Link href="/customers">
            <Button className="mt-4">Powrót do listy</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/customers">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {customer.first_name} {customer.last_name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Klient od {formatDate(customer.created_at)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!editMode ? (
              <Button onClick={() => setEditMode(true)}>
                Edytuj klienta
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => {
                  setEditMode(false)
                  setEditedEmail(customer.email || "")
                  setEditedFirstName(customer.first_name || "")
                  setEditedLastName(customer.last_name || "")
                  setEditedPhone(customer.phone || "")
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
            {/* Customer Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informacje o kliencie</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{customer.email || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Imię
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedFirstName}
                      onChange={(e) => setEditedFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{customer.first_name || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nazwisko
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedLastName}
                      onChange={(e) => setEditedLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{customer.last_name || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{customer.phone || '-'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Orders History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Historia zamówień ({orders.length})
              </h2>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Brak zamówień</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Zamówienie #{order.display_id}</p>
                          <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {((order.total || 0) / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
                          </p>
                          <p className="text-sm text-gray-600">{order.status}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statystyki</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Liczba zamówień</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Łączna wartość</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(totalSpent / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Średnia wartość zamówienia</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.length > 0 
                      ? ((totalSpent / orders.length) / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })
                      : '0,00'} PLN
                  </p>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informacje o koncie</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Zarejestrowany: {formatDate(customer.created_at)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>ID: {customer.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
