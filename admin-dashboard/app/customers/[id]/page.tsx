"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import { formatPrice, formatDate, getOrderStatusColor } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { Customer } from "@/lib/types"
import { ArrowLeft, User, Mail, Phone, MapPin, ShoppingBag } from "lucide-react"

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadCustomer()
  }, [router, customerId])

  const loadCustomer = async () => {
    try {
      setLoading(true)
      const response = await api.getCustomer(customerId)
      setCustomer(response.customer as Customer)
    } catch (error) {
      console.error("Error loading customer:", error)
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

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer not found</h2>
          <p className="text-gray-600 mb-6">The customer you're looking for doesn't exist.</p>
          <Link href="/customers">
            <Button>Back to Customers</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const customerName = customer.first_name || customer.last_name
    ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
    : "N/A"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/customers">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customerName}</h1>
              <p className="text-gray-600 mt-1">{customer.email}</p>
            </div>
          </div>
          <Badge variant={customer.has_account ? "success" : "default"}>
            {customer.has_account ? "Registered" : "Guest"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Order History
              </h2>
              
              {customer.orders && customer.orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Link href={`/orders/${order.id}`} className="font-medium text-primary-600 hover:text-primary-700">
                            #{order.display_id}
                          </Link>
                        </TableCell>
                        <TableCell className="text-gray-600">{formatDate(order.created_at)}</TableCell>
                        <TableCell>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(order.total, order.currency_code)}
                        </TableCell>
                        <TableCell>
                          <Link href={`/orders/${order.id}`}>
                            <Button size="sm" variant="ghost">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-600 text-center py-8">No orders yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Contact Information
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <span className="text-gray-600 block">Email</span>
                    <p className="text-gray-900">{customer.email}</p>
                  </div>
                </div>
                
                {customer.phone && (
                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <span className="text-gray-600 block">Phone</span>
                      <p className="text-gray-900">{customer.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Addresses */}
            {customer.shipping_addresses && customer.shipping_addresses.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Addresses
                </h2>
                
                <div className="space-y-4">
                  {customer.shipping_addresses.map((address, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-medium text-gray-900 mb-1">
                        {address.first_name} {address.last_name}
                      </p>
                      <p className="text-gray-600">{address.address_1}</p>
                      {address.address_2 && <p className="text-gray-600">{address.address_2}</p>}
                      <p className="text-gray-600">
                        {address.city}, {address.province} {address.postal_code}
                      </p>
                      <p className="text-gray-600">{address.country_code?.toUpperCase()}</p>
                      {address.phone && <p className="text-gray-600 mt-1">{address.phone}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-medium text-gray-900">{customer.orders?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">{formatDate(customer.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Customer ID:</span>
                  <p className="text-gray-900 mt-1 font-mono text-xs break-all">{customer.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="text-gray-900 mt-1">{formatDate(customer.created_at)}</p>
                </div>
                {customer.updated_at && (
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <p className="text-gray-900 mt-1">{formatDate(customer.updated_at)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
