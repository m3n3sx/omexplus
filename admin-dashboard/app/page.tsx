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
    ordersLastWeek: 0,
    ordersLastMonth: 0,
    revenueTrend: 0,
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
      
      // Fetch ALL orders for accurate statistics
      const ordersResponse = await api.getOrders({ limit: 1000 })
      const allOrders = ordersResponse.orders || []
      
      // Calculate real stats from all orders
      const totalRevenue = allOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
      const totalOrders = allOrders.length
      
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      const newOrders = allOrders.filter((order: any) => new Date(order.created_at) > yesterday).length
      const ordersLastWeek = allOrders.filter((order: any) => new Date(order.created_at) > lastWeek).length
      const ordersLastMonth = allOrders.filter((order: any) => new Date(order.created_at) > lastMonth).length
      
      // Calculate trends
      const revenueLastMonth = allOrders
        .filter((order: any) => new Date(order.created_at) > lastMonth)
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0)
      
      const previousMonth = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
      const revenuePreviousMonth = allOrders
        .filter((order: any) => {
          const orderDate = new Date(order.created_at)
          return orderDate > previousMonth && orderDate <= lastMonth
        })
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0)
      
      const revenueTrend = revenuePreviousMonth > 0 
        ? ((revenueLastMonth - revenuePreviousMonth) / revenuePreviousMonth) * 100
        : 0
      
      // Fetch customers
      const customersResponse = await api.getCustomers({ limit: 1000 })
      const totalCustomers = customersResponse.customers?.length || 0
      
      setStats({
        totalOrders,
        totalRevenue,
        newOrders,
        totalCustomers,
        ordersLastWeek,
        ordersLastMonth,
        revenueTrend,
      })
      
      // Recent orders (last 10, sorted by date)
      const sortedOrders = [...allOrders].sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      setRecentOrders(sortedOrders.slice(0, 10) as Order[])
      
      // Generate sales data for chart (last 30 days for better view)
      const salesByDay = generateSalesData(allOrders, 30)
      setSalesData(salesByDay)
      
      // Calculate top products from all orders
      const productSales = calculateTopProducts(allOrders)
      setTopProducts(productSales.slice(0, 10))
      
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSalesData = (orders: any[], days: number = 30) => {
    const salesByDay = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      
      const daySales = orders
        .filter((order: any) => {
          const orderDate = new Date(order.created_at)
          return orderDate.toDateString() === date.toDateString()
        })
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0)
      
      salesByDay.push({ date: dateStr, sales: daySales / 100 })
    }
    return salesByDay
  }

  const calculateTopProducts = (orders: any[]) => {
    const productMap = new Map()
    
    orders.forEach((order: any) => {
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
    
    return Array.from(productMap.values()).sort((a: any, b: any) => b.revenue - a.revenue)
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
          <p className="text-gray-600 mt-1">Witaj! Oto co dzieje się w Twoim sklepie.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Wszystkie zamówienia"
            value={stats.totalOrders.toLocaleString('pl-PL')}
            icon={ShoppingCart}
            trend={{ value: stats.ordersLastMonth, isPositive: true, label: 'ostatni miesiąc' }}
          />
          <StatsCard
            title="Całkowity przychód"
            value={`${(stats.totalRevenue / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`}
            icon={DollarSign}
            trend={{ value: Math.abs(stats.revenueTrend), isPositive: stats.revenueTrend >= 0 }}
            iconColor="text-green-600"
          />
          <StatsCard
            title="Nowe zamówienia (24h)"
            value={stats.newOrders}
            icon={Package}
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Klienci"
            value={stats.totalCustomers}
            icon={Users}
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
