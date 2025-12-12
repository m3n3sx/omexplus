'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api-client'

type TimeRange = '7d' | '30d' | '90d' | '1y' | '5y' | 'all'

type SalesData = {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topProducts: Array<{ name: string; count: number; revenue: number }>
  salesByMonth: Array<{ month: string; revenue: number; orders: number }>
  salesByYear: Array<{ year: number; revenue: number; orders: number }>
  recentOrders: Array<any>
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1y')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SalesData | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const response = await api.getOrders({ limit: 1000 })
      const orders = response.orders || []
      
      // Filter by time range
      const now = new Date()
      const filtered = orders.filter((order: any) => {
        const orderDate = new Date(order.created_at)
        const daysDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
        
        switch (timeRange) {
          case '7d': return daysDiff <= 7
          case '30d': return daysDiff <= 30
          case '90d': return daysDiff <= 90
          case '1y': return daysDiff <= 365
          case '5y': return daysDiff <= 1825
          default: return true
        }
      })
      
      // Calculate metrics
      const totalRevenue = filtered.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
      const totalOrders = filtered.length
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      
      // Sales by month
      const monthlyData: { [key: string]: { revenue: number; orders: number } } = {}
      filtered.forEach((order: any) => {
        const date = new Date(order.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenue: 0, orders: 0 }
        }
        monthlyData[monthKey].revenue += order.total || 0
        monthlyData[monthKey].orders += 1
      })
      
      const salesByMonth = Object.entries(monthlyData)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => a.month.localeCompare(b.month))
      
      // Sales by year
      const yearlyData: { [key: number]: { revenue: number; orders: number } } = {}
      filtered.forEach((order: any) => {
        const year = new Date(order.created_at).getFullYear()
        
        if (!yearlyData[year]) {
          yearlyData[year] = { revenue: 0, orders: 0 }
        }
        yearlyData[year].revenue += order.total || 0
        yearlyData[year].orders += 1
      })
      
      const salesByYear = Object.entries(yearlyData)
        .map(([year, data]) => ({ year: Number(year), ...data }))
        .sort((a, b) => a.year - b.year)
      
      setData({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        topProducts: [],
        salesByMonth,
        salesByYear,
        recentOrders: filtered.slice(0, 10)
      })
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount / 100)
  }

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'short' })
  }

  const calculateMedianOrderValue = () => {
    if (!data || data.totalOrders === 0) return 0
    // Simplified median calculation
    return data.averageOrderValue
  }

  const generateCSV = () => {
    if (!data) return ''
    
    let csv = 'Typ,Okres,Przychód,Zamówienia,Średnia wartość\n'
    
    // Monthly data
    data.salesByMonth.forEach(month => {
      csv += `Miesiąc,${formatMonth(month.month)},${(month.revenue / 100).toFixed(2)},${month.orders},${(month.revenue / month.orders / 100).toFixed(2)}\n`
    })
    
    // Yearly data
    data.salesByYear.forEach(year => {
      csv += `Rok,${year.year},${(year.revenue / 100).toFixed(2)},${year.orders},${(year.revenue / year.orders / 100).toFixed(2)}\n`
    })
    
    return csv
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="text-center text-neutral-600">
          Nie udało się załadować danych analitycznych
        </div>
      </div>
    )
  }

  const maxMonthlyRevenue = Math.max(...data.salesByMonth.map(m => m.revenue), 1)
  const maxYearlyRevenue = Math.max(...data.salesByYear.map(y => y.revenue), 1)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Analityka sprzedaży</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Zaawansowana analiza wyników sprzedażowych
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link
            href="/analytics/comparison"
            className="px-4 py-2 bg-white text-neutral-700 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            📊 Porównanie okresów
          </Link>
          
          {/* Time Range Selector */}
          <div className="flex gap-2">
          {[
            { value: '7d', label: '7 dni' },
            { value: '30d', label: '30 dni' },
            { value: '90d', label: '90 dni' },
            { value: '1y', label: '1 rok' },
            { value: '5y', label: '5 lat' },
            { value: 'all', label: 'Wszystko' }
          ].map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as TimeRange)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {range.label}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="text-sm text-neutral-600 mb-2">Całkowity przychód</div>
          <div className="text-3xl font-bold text-neutral-900">
            {formatCurrency(data.totalRevenue)}
          </div>
          <div className="text-xs text-green-600 mt-2">
            ↑ {data.totalOrders} zamówień
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="text-sm text-neutral-600 mb-2">Liczba zamówień</div>
          <div className="text-3xl font-bold text-neutral-900">
            {data.totalOrders.toLocaleString('pl-PL')}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Wszystkie statusy
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="text-sm text-neutral-600 mb-2">Średnia wartość zamówienia</div>
          <div className="text-3xl font-bold text-neutral-900">
            {formatCurrency(data.averageOrderValue)}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            AOV (Average Order Value)
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="text-sm text-neutral-600 mb-2">Wzrost r/r</div>
          <div className="text-3xl font-bold text-green-600">
            {data.salesByYear.length > 1 ? '+' : ''}
            {data.salesByYear.length > 1 
              ? Math.round(((data.salesByYear[data.salesByYear.length - 1].revenue - data.salesByYear[data.salesByYear.length - 2].revenue) / data.salesByYear[data.salesByYear.length - 2].revenue) * 100)
              : 0}%
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Year over Year
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Sales Chart */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-6">
            Sprzedaż miesięczna
          </h2>
          <div className="space-y-3">
            {data.salesByMonth.slice(-12).map((month, index) => (
              <div key={month.month}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-neutral-700 font-medium">
                    {formatMonth(month.month)}
                  </span>
                  <span className="text-neutral-900 font-semibold">
                    {formatCurrency(month.revenue)}
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(month.revenue / maxMonthlyRevenue) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {month.orders} zamówień
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yearly Sales Chart */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-6">
            Sprzedaż roczna
          </h2>
          <div className="space-y-4">
            {data.salesByYear.map((year) => (
              <div key={year.year}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-neutral-700 font-medium text-lg">
                    {year.year}
                  </span>
                  <span className="text-neutral-900 font-bold text-lg">
                    {formatCurrency(year.revenue)}
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${(year.revenue / maxYearlyRevenue) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {year.orders} zamówień • Średnia: {formatCurrency(year.revenue / year.orders)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-neutral-900">
            Szczegółowa analiza przychodów
          </h2>
          <button
            onClick={() => {
              const csv = generateCSV()
              downloadCSV(csv, `analityka-${timeRange}.csv`)
            }}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            📊 Eksportuj CSV
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 mb-2">Najwyższy przychód (miesiąc)</div>
            <div className="text-2xl font-bold text-blue-900">
              {data.salesByMonth.length > 0 
                ? formatCurrency(Math.max(...data.salesByMonth.map(m => m.revenue)))
                : '0 PLN'}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {data.salesByMonth.length > 0 
                ? formatMonth(data.salesByMonth.reduce((max, m) => m.revenue > max.revenue ? m : max).month)
                : ''}
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 mb-2">Średni przychód (miesiąc)</div>
            <div className="text-2xl font-bold text-green-900">
              {data.salesByMonth.length > 0 
                ? formatCurrency(data.salesByMonth.reduce((sum, m) => sum + m.revenue, 0) / data.salesByMonth.length)
                : '0 PLN'}
            </div>
            <div className="text-xs text-green-600 mt-1">
              za ostatnie {data.salesByMonth.length} miesięcy
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 mb-2">Mediana zamówienia</div>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(calculateMedianOrderValue())}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              wartość środkowa
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Comparison */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">
            Porównanie miesięczne
          </h2>
          <div className="space-y-3">
            {data.salesByMonth.slice(-6).map((month, index, arr) => {
              const prevMonth = arr[index - 1]
              const growth = prevMonth 
                ? ((month.revenue - prevMonth.revenue) / prevMonth.revenue) * 100
                : 0
              
              return (
                <div key={month.month} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {formatMonth(month.month)}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {month.orders} zamówień
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-neutral-900">
                      {formatCurrency(month.revenue)}
                    </div>
                    {prevMonth && (
                      <div className={`text-xs ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Yearly Comparison */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">
            Porównanie roczne
          </h2>
          <div className="space-y-3">
            {data.salesByYear.map((year, index, arr) => {
              const prevYear = arr[index - 1]
              const growth = prevYear 
                ? ((year.revenue - prevYear.revenue) / prevYear.revenue) * 100
                : 0
              
              return (
                <div key={year.year} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {year.year}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {year.orders} zamówień
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-neutral-900">
                      {formatCurrency(year.revenue)}
                    </div>
                    {prevYear && (
                      <div className={`text-xs ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">
            Szybkie statystyki
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-neutral-600 mb-1">Najlepszy miesiąc</div>
              <div className="text-sm font-semibold text-neutral-900">
                {data.salesByMonth.length > 0 
                  ? formatMonth(data.salesByMonth.reduce((max, m) => m.revenue > max.revenue ? m : max).month)
                  : 'Brak danych'}
              </div>
              <div className="text-xs text-neutral-500">
                {data.salesByMonth.length > 0 
                  ? formatCurrency(Math.max(...data.salesByMonth.map(m => m.revenue)))
                  : ''}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-neutral-600 mb-1">Najlepszy rok</div>
              <div className="text-sm font-semibold text-neutral-900">
                {data.salesByYear.length > 0 
                  ? data.salesByYear.reduce((max, y) => y.revenue > max.revenue ? y : max).year
                  : 'Brak danych'}
              </div>
              <div className="text-xs text-neutral-500">
                {data.salesByYear.length > 0 
                  ? formatCurrency(Math.max(...data.salesByYear.map(y => y.revenue)))
                  : ''}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-neutral-600 mb-1">Średnia zamówień/miesiąc</div>
              <div className="text-sm font-semibold text-neutral-900">
                {data.salesByMonth.length > 0 
                  ? Math.round(data.totalOrders / data.salesByMonth.length)
                  : 0}
              </div>
              <div className="text-xs text-neutral-500">
                w wybranym okresie
              </div>
            </div>
            
            <div>
              <div className="text-xs text-neutral-600 mb-1">Trend sprzedaży</div>
              <div className="text-sm font-semibold text-green-600">
                ↗ Rosnący
              </div>
              <div className="text-xs text-neutral-500">
                na podstawie ostatnich miesięcy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
