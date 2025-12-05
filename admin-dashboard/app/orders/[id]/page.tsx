"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import Modal from "@/components/ui/Modal"
import { formatPrice, formatDate, getOrderStatusColor, getPaymentStatusColor } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import medusaClient from "@/lib/medusa-client"
import { Order } from "@/lib/types"
import { ArrowLeft, Truck, Mail, FileText, RefreshCw } from "lucide-react"

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundAmount, setRefundAmount] = useState("")
  const [processing, setProcessing] = useState(false)

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
      const response = await medusaClient.admin.orders.retrieve(orderId)
      setOrder(response.order as Order)
    } catch (error) {
      console.error("Error loading order:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsShipped = async () => {
    try {
      setProcessing(true)
      // Create fulfillment
      await medusaClient.admin.orders.createFulfillment(orderId, {
        items: order?.items.map(item => ({ item_id: item.id, quantity: item.quantity })) || [],
      })
      await loadOrder()
      alert("Order marked as shipped!")
    } catch (error) {
      console.error("Error marking as shipped:", error)
      alert("Failed to mark as shipped")
    } finally {
      setProcessing(false)
    }
  }

  const handleSendEmail = async () => {
    alert("Email functionality would be implemented here")
  }

  const handleGenerateInvoice = () => {
    window.print()
  }

  const handleRefund = async () => {
    try {
      setProcessing(true)
      const amount = parseFloat(refundAmount) * 100
      
      await medusaClient.admin.orders.refund(orderId, {
        amount,
        reason: "requested_by_customer",
      })
      
      setShowRefundModal(false)
      await loadOrder()
      alert("Refund processed successfully!")
    } catch (error) {
      console.error("Error processing refund:", error)
      alert("Failed to process refund")
    } finally {
      setProcessing(false)
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
          <p className="text-gray-600">Order not found</p>
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
            <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.display_id}</h1>
              <p className="text-gray-600 mt-1">{formatDate(order.created_at)}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" onClick={handleSendEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Email Customer
            </Button>
            <Button variant="secondary" size="sm" onClick={handleGenerateInvoice}>
              <FileText className="w-4 h-4 mr-2" />
              Invoice
            </Button>
            <Button variant="secondary" size="sm" onClick={handleMarkAsShipped} isLoading={processing}>
              <Truck className="w-4 h-4 mr-2" />
              Mark Shipped
            </Button>
            <Button variant="danger" size="sm" onClick={() => setShowRefundModal(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refund
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center space-x-4">
                        {item.thumbnail && (
                          <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.total, order.currency_code)}</p>
                        <p className="text-sm text-gray-600">{formatPrice(item.unit_price, order.currency_code)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(order.subtotal, order.currency_code)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatPrice(order.shipping_total, order.currency_code)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatPrice(order.tax_total, order.currency_code)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(order.total, order.currency_code)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Status</p>
                  <Badge className={getOrderStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                  <Badge className={getPaymentStatusColor(order.payment_status)}>{order.payment_status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fulfillment Status</p>
                  <Badge variant="info">{order.fulfillment_status || "not_fulfilled"}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-gray-900">{order.email}</p>
                {order.customer && (
                  <p className="text-sm text-gray-600 mt-1">
                    {order.customer.first_name} {order.customer.last_name}
                  </p>
                )}
              </CardContent>
            </Card>

            {order.shipping_address && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-900 space-y-1">
                    <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                    <p>{order.shipping_address.address_1}</p>
                    {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.country_code?.toUpperCase()}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        title="Process Refund"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              Max: {formatPrice(order.total, order.currency_code)}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleRefund} isLoading={processing} className="flex-1">
              Process Refund
            </Button>
            <Button variant="secondary" onClick={() => setShowRefundModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
