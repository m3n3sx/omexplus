"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import StatsCard from "@/components/dashboard/StatsCard"
import RecentOrders from "@/components/dashboard/RecentOrders"
import SalesChart from "@/components/dashboard/SalesChart"
import TopProducts from "@/components/dashboard/TopProducts"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { ShoppingCart, DollarSign, Users, Package } from "lucide-react"
import api from "@/lib/api-client"
import { isAuthenticated } from "@/lib/auth"
import { Order } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    newOrders: 0,
    totalCustomers: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [salesData, setSalesData] = useState<Array<{ date: string; sales: number }>>([])
  const [topProducts, setTopProducts] = useState<any[]>([])

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    
    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch orders
      const ordersResponse = await api.getOrders({ limit: 50 })
      const orders = ordersResponse.orders || []
      
      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const newOrders = orders.filter(order => new Date(order.created_at) > yesterday).length
      
      // Fetch customers
      const customersResponse = await api.getCustomers({ limit: 100 })
      const totalCustomers = customersResponse.customers?.length || 0
      
      setStats({
        totalOrders: orders.length,
        totalRevenue,
        newOrders,
        totalCustomers,
      })
      
      // Recent orders (last 5)
      setRecentOrders(orders.slice(0, 5) as Order[])
      
      // Generate sales data for chart (last 7 days)
      const salesByDay = generateSalesData(orders)
      setSalesData(salesByDay)
      
      // Calculate top products
      const productSales = calculateTopProducts(orders)
      setTopProducts(productSales.slice(0, 5))
      
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSalesData = (orders: any[]) => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      
      const daySales = orders
        .filter(order => {
          const orderDate = new Date(order.created_at)
          return orderDate.toDateString() === date.toDateString()
        })
        .reduce((sum, order) => sum + (order.total || 0), 0)
      
      last7Days.push({ date: dateStr, sales: daySales / 100 })
    }
    return last7Days
  }

  const calculateTopProducts = (orders: any[]) => {
    const productMap = new Map()
    
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        const existing = productMap.get(item.product_id) || {
          id: item.product_id,
          title: item.title,
          sales: 0,
          revenue: 0,
          thumbnail: item.thumbnail,
        }
        
        existing.sales += item.quantity
        existing.revenue += item.total
        productMap.set(item.product_id, existing)
      })
    })
    
    return Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue)
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue / 100).toFixed(2)}`}
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
            iconColor="text-green-600"
          />
          <StatsCard
            title="New Orders (24h)"
            value={stats.newOrders}
            icon={Package}
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
            iconColor="text-purple-600"
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart data={salesData} />
          </div>
          <div>
            <TopProducts products={topProducts} />
          </div>
        </div>

        {/* Recent Orders */}
        <RecentOrders orders={recentOrders} />
      </div>
    </DashboardLayout>
  )
}
