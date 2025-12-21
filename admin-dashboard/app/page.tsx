"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import StatsCard from "@/components/dashboard/StatsCard"
import RecentOrders from "@/components/dashboard/RecentOrders"
import SalesChart from "@/components/dashboard/SalesChart"
import TopProducts from "@/components/dashboard/TopProducts"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import WidgetConfigPanel from "@/components/dashboard/WidgetConfigPanel"
import DraggableWidgetGrid from "@/components/dashboard/DraggableWidgetGrid"
import ChatWidget from "@/components/dashboard/widgets/ChatWidget"
import QuickActionsWidget from "@/components/dashboard/widgets/QuickActionsWidget"
import StockAlertsWidget from "@/components/dashboard/widgets/StockAlertsWidget"
import TasksWidget from "@/components/dashboard/widgets/TasksWidget"
import { ShoppingCart, DollarSign, Users, Package, Settings2, Move, Check, RotateCcw } from "lucide-react"
import api from "@/lib/api-client"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { Order } from "@/lib/types"
import { usePermissions } from "@/lib/usePermissions"
import { 
  DashboardConfig, 
  WidgetConfig, 
  WidgetId,
  getDashboardConfig, 
  saveDashboardConfig,
  updateWidgetConfig,
  resetDashboardConfig,
  getWidgetGridClass
} from "@/lib/dashboard-config"

export default function DashboardPage() {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [loading, setLoading] = useState(true)
  const [showConfig, setShowConfig] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null)
  
  const [stats, setStats] = useState({
    totalOrders: 0, totalRevenue: 0, newOrders: 0, totalCustomers: 0,
    ordersLastWeek: 0, ordersLastMonth: 0, revenueTrend: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [salesData, setSalesData] = useState<Array<{ date: string; sales: number }>>([])
  const [topProducts, setTopProducts] = useState<any[]>([])

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return }
    setDashboardConfig(getDashboardConfig())
    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const ordersResponse = await api.getOrders({ limit: 1000 })
      const allOrders = ordersResponse.orders || []
      
      const totalRevenue = allOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      const newOrders = allOrders.filter((o: any) => new Date(o.created_at) > yesterday).length
      const ordersLastMonth = allOrders.filter((o: any) => new Date(o.created_at) > lastMonth).length
      
      const customersResponse = await api.getCustomers({ limit: 1000 })
      
      setStats({
        totalOrders: allOrders.length, totalRevenue, newOrders,
        totalCustomers: customersResponse.customers?.length || 0,
        ordersLastWeek: 0, ordersLastMonth, revenueTrend: 0,
      })
      
      const sortedOrders = [...allOrders].sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      setRecentOrders(sortedOrders.slice(0, 10) as Order[])
      setSalesData(generateSalesData(allOrders, 30))
      setTopProducts(calculateTopProducts(allOrders).slice(0, 10))
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      // If we get an auth error, redirect to login
      if (!isAuthenticated()) {
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const generateSalesData = (orders: any[], days: number) => {
    const salesByDay = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(); date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      const daySales = orders
        .filter((o: any) => new Date(o.created_at).toDateString() === date.toDateString())
        .reduce((sum: number, o: any) => sum + (o.total || 0), 0)
      salesByDay.push({ date: dateStr, sales: daySales / 100 })
    }
    return salesByDay
  }

  const calculateTopProducts = (orders: any[]) => {
    const productMap = new Map()
    orders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const existing = productMap.get(item.product_id) || { id: item.product_id, title: item.title, sales: 0, revenue: 0, thumbnail: item.thumbnail }
        existing.sales += item.quantity; existing.revenue += item.total
        productMap.set(item.product_id, existing)
      })
    })
    return Array.from(productMap.values()).sort((a: any, b: any) => b.revenue - a.revenue)
  }

  const handleUpdateWidget = useCallback((widgetId: string, updates: Partial<WidgetConfig>) => {
    const newConfig = updateWidgetConfig(widgetId as WidgetId, updates)
    setDashboardConfig(newConfig)
  }, [])

  const handleResetConfig = useCallback(() => setDashboardConfig(resetDashboardConfig()), [])

  const handleReorderWidgets = useCallback((widgets: WidgetConfig[]) => {
    if (!dashboardConfig) return
    const newConfig = { ...dashboardConfig, widgets }
    saveDashboardConfig(newConfig)
    setDashboardConfig(newConfig)
  }, [dashboardConfig])

  const renderWidgetContent = (widgetId: string) => {
    switch (widgetId) {
      case 'stats-orders': return <StatsCard title="Zamówienia" value={stats.totalOrders.toLocaleString('pl-PL')} icon={ShoppingCart} compact />
      case 'stats-revenue': return <StatsCard title="Przychód" value={`${(stats.totalRevenue / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN`} icon={DollarSign} iconColor="text-green-600" compact />
      case 'stats-new-orders': return <StatsCard title="Nowe (24h)" value={stats.newOrders} icon={Package} iconColor="text-blue-600" compact />
      case 'stats-customers': return <StatsCard title="Klienci" value={stats.totalCustomers} icon={Users} iconColor="text-purple-600" compact />
      case 'sales-chart': return <SalesChart data={salesData} />
      case 'recent-orders': return <RecentOrders orders={recentOrders} />
      case 'top-products': return <TopProducts products={topProducts} />
      case 'chat-widget': return <ChatWidget />
      case 'quick-actions': return <QuickActionsWidget />
      case 'stock-alerts': return <StockAlertsWidget />
      case 'tasks-widget': return <TasksWidget />
      default: return <div className="text-gray-500">Widget niedostępny</div>
    }
  }

  const canViewWidget = (widget: WidgetConfig): boolean => {
    if (!widget.permission) return true
    const user = getCurrentUser()
    if (!user?.role) return true // Pokaż wszystko jeśli brak użytkownika
    if (user.role === 'super_admin') return true // Super admin widzi wszystko
    return hasPermission(widget.permission as any)
  }

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-full"><LoadingSpinner size="lg" /></div></DashboardLayout>

  const visibleWidgets = dashboardConfig?.widgets.filter(w => w.visible && canViewWidget(w)).sort((a, b) => a.order - b.order) || []
  const user = getCurrentUser()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-theme-primary">Dashboard</h1>
            <p className="text-theme-secondary mt-1">Witaj, {user?.first_name || 'użytkowniku'}!</p>
          </div>
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <button 
                  onClick={() => {
                    if (confirm('Czy na pewno chcesz zresetować układ widgetów do domyślnego?')) {
                      handleResetConfig()
                    }
                  }} 
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-theme-secondary border border-red-200 rounded-lg hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button 
                  onClick={() => setEditMode(false)} 
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white btn-accent rounded-lg"
                >
                  <Check className="w-4 h-4" /> Gotowe
                </button>
              </>
            ) : (
              <button 
                onClick={() => setEditMode(true)} 
                className="flex items-center gap-2 px-4 py-2 text-sm text-theme-secondary bg-theme-secondary border border-theme rounded-lg hover:bg-theme-hover"
              >
                <Move className="w-4 h-4" /> Przeciągaj widgety
              </button>
            )}
            <button 
              onClick={() => setShowConfig(true)} 
              className="flex items-center gap-2 px-4 py-2 text-sm text-theme-secondary bg-theme-secondary border border-theme rounded-lg hover:bg-theme-hover"
            >
              <Settings2 className="w-4 h-4" /> Ustawienia
            </button>
          </div>
        </div>

        {editMode && (
          <div className="bg-accent-light border border-accent rounded-lg px-4 py-3 text-sm text-accent">
            <strong>Tryb edycji:</strong> Przeciągnij widgety aby zmienić ich kolejność. Kliknij X aby ukryć widget.
          </div>
        )}

        <DraggableWidgetGrid
          widgets={visibleWidgets}
          onReorder={handleReorderWidgets}
          onUpdateWidget={handleUpdateWidget}
          renderContent={renderWidgetContent}
          editMode={editMode}
        />

        {visibleWidgets.length === 0 && (
          <div className="text-center py-12 bg-theme-secondary rounded-lg border border-dashed border-theme">
            <Settings2 className="w-12 h-12 text-theme-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-theme-primary mb-2">Brak widocznych widgetów</h3>
            <button onClick={() => setShowConfig(true)} className="px-4 py-2 btn-accent rounded-lg">Dostosuj widgety</button>
          </div>
        )}
      </div>

      {showConfig && dashboardConfig && (
        <WidgetConfigPanel config={dashboardConfig} onClose={() => setShowConfig(false)} onUpdateWidget={handleUpdateWidget} onReset={handleResetConfig} onReorderWidgets={handleReorderWidgets} />
      )}
    </DashboardLayout>
  )
}
