"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatPrice, formatDate, getOrderStatusColor, getPaymentStatusColor } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { Order } from "@/lib/types"
import { ArrowLeft, Package, CreditCard, MapPin, User } from "lucide-react"

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadOrder()
  }, [router, orderId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const response = await api.getOrder(orderId)
      setOrder(response.order as Order)
      setNewStatus(response.order.status)
    } catch (error) {
      console.error("Error loading order:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === order?.status) {
      setShowStatusModal(false)
      return
    }

    try {
      setUpdating(true)
      await api.updateOrder(orderId, { status: newStatus })
      await loadOrder()
      setShowStatusModal(false)
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status")
    } finally {
      setUpdating(false)
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link href="/orders">
            <Button>Back to Orders</Button>
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
          <div className="flex items-center space-x-4">
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.display_id}</h1>
              <p className="text-gray-600 mt-1">{formatDate(order.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getOrderStatusColor(order.status)}>
              {order.status}
            </Badge>
            <Badge className={getPaymentStatusColor(order.payment_status)}>
              {order.payment_status}
            </Badge>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setShowStatusModal(true)}
            >
              Change Status
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Items
              </h2>
              
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.variant?.title || "Default"}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.unit_price * item.quantity, order.currency_code)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.unit_price, order.currency_code)} each
                      </p>
                    </div>
                  </div>
                ))}
                
                {(!order.items || order.items.length === 0) && (
                  <p className="text-gray-600 text-center py-4">No items in this order</p>
                )}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(order.subtotal, order.currency_code)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{formatPrice(order.shipping_total || 0, order.currency_code)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(order.tax_total || 0, order.currency_code)}</span>
                </div>
                {order.discount_total > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-{formatPrice(order.discount_total, order.currency_code)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(order.total, order.currency_code)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Payment Status:</span>
                  <Badge className={`ml-2 ${getPaymentStatusColor(order.payment_status)}`}>
                    {order.payment_status}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="ml-2 text-gray-900">{order.payments?.[0]?.provider_id || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer
              </h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="text-gray-900 mt-1">{order.email}</p>
                </div>
                {order.customer && (
                  <>
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="text-gray-900 mt-1">
                        {order.customer.first_name} {order.customer.last_name}
                      </p>
                    </div>
                    {order.customer.phone && (
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="text-gray-900 mt-1">{order.customer.phone}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h2>
              
              {order.shipping_address ? (
                <div className="text-sm text-gray-900">
                  <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                  <p>{order.shipping_address.address_1}</p>
                  {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country_code?.toUpperCase()}</p>
                  {order.shipping_address.phone && <p className="mt-2">{order.shipping_address.phone}</p>}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No shipping address</p>
              )}
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h2>
              
              {order.billing_address ? (
                <div className="text-sm text-gray-900">
                  <p>{order.billing_address.first_name} {order.billing_address.last_name}</p>
                  <p>{order.billing_address.address_1}</p>
                  {order.billing_address.address_2 && <p>{order.billing_address.address_2}</p>}
                  <p>
                    {order.billing_address.city}, {order.billing_address.province} {order.billing_address.postal_code}
                  </p>
                  <p>{order.billing_address.country_code?.toUpperCase()}</p>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">Same as shipping address</p>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Order ID:</span>
                  <p className="text-gray-900 mt-1 font-mono text-xs break-all">{order.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="text-gray-900 mt-1">{formatDate(order.created_at)}</p>
                </div>
                {order.updated_at && (
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <p className="text-gray-900 mt-1">{formatDate(order.updated_at)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Change Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Order Status</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </label>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div>
                  <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                    <option value="requires_action">Requires Action</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button 
                  onClick={handleUpdateStatus}
                  disabled={updating || newStatus === order.status}
                >
                  {updating ? "Updating..." : "Update Status"}
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowStatusModal(false)}
                  disabled={updating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
