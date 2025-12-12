'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api-client'
import Link from 'next/link'

type ComparisonPeriod = 'month' | 'quarter' | 'year'

export default function ComparisonPage() {
  const [period, setPeriod] = useState<ComparisonPeriod>('month')
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const response = await api.getOrders({ limit: 1000 })
      setOrders(response.orders || [])
    } catch (error) {
      console.error('Failed to load orders:', error)
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

  const getPeriodData = () => {
    const now = new Date()
    const periods: Array<{ label: string; start: Date; end: Date }> = []

    if (period === 'month') {
      for (let i = 0; i < 12; i++) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
        periods.push({
          label: start.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long' }),
          start,
          end
        })
      }
    } else if (period === 'quarter') {
      for (let i = 0; i < 8; i++) {
        const quarterStart = Math.floor((now.getMonth() - i * 3) / 3) * 3
        const start = new Date(now.getFullYear(), quarterStart, 1)
        const end = new Date(now.getFullYear(), quarterStart + 3, 0)
        const q = Math.floor(quarterStart / 3) + 1
        periods.push({
          label: `Q${q} ${start.getFullYear()}`,
          start,
          end
        })
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const year = now.getFullYear() - i
        periods.push({
          label: year.toString(),
          start: new Date(year, 0, 1),
          end: new Date(year, 11, 31)
        })
      }
    }

    return periods.map(p => {
      const periodOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at)
        return orderDate >= p.start && orderDate <= p.end
      })

      const revenue = periodOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      const orderCount = periodOrders.length

      return {
        ...p,
        revenue,
        orderCount,
        avgOrderValue: orderCount > 0 ? revenue / orderCount : 0
      }
    })
  }

  const periodData = getPeriodData()
  const maxRevenue = Math.max(...periodData.map(p => p.revenue), 1)

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-8"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/analytics"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              ← Analityka
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Porównanie okresów</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Szczegółowe porównanie wyników sprzedażowych
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2">
          {[
            { value: 'month', label: 'Miesiące' },
            { value: 'quarter', label: 'Kwartały' },
            { value: 'year', label: 'Lata' }
          ].map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as ComparisonPeriod)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p.value
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Okres
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">
                  Przychód
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">
                  Zamówienia
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">
                  Średnia wartość
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">
                  Zmiana r/r
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Wykres
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {periodData.map((p, index) => {
                const prevPeriod = periodData[index + 1]
                const growth = prevPeriod && prevPeriod.revenue > 0
                  ? ((p.revenue - prevPeriod.revenue) / prevPeriod.revenue) * 100
                  : 0

                return (
                  <tr key={p.label} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                      {p.label}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-neutral-900">
                      {formatCurrency(p.revenue)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-700">
                      {p.orderCount.toLocaleString('pl-PL')}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-700">
                      {formatCurrency(p.avgOrderValue)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      {prevPeriod ? (
                        <span className={growth >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${(p.revenue / maxRevenue) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="text-sm opacity-90 mb-2">Najlepszy okres</div>
          <div className="text-2xl font-bold mb-1">
            {periodData.length > 0 
              ? periodData.reduce((max, p) => p.revenue > max.revenue ? p : max).label
              : '-'}
          </div>
          <div className="text-sm opacity-90">
            {periodData.length > 0 
              ? formatCurrency(Math.max(...periodData.map(p => p.revenue)))
              : ''}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="text-sm opacity-90 mb-2">Średni wzrost</div>
          <div className="text-2xl font-bold mb-1">
            {periodData.length > 1 
              ? `${((periodData[0].revenue - periodData[periodData.length - 1].revenue) / periodData[periodData.length - 1].revenue * 100 / periodData.length).toFixed(1)}%`
              : '0%'}
          </div>
          <div className="text-sm opacity-90">
            na okres
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="text-sm opacity-90 mb-2">Trend</div>
          <div className="text-2xl font-bold mb-1">
            {periodData.length > 1 && periodData[0].revenue > periodData[1].revenue 
              ? '↗ Rosnący'
              : periodData.length > 1 && periodData[0].revenue < periodData[1].revenue
              ? '↘ Spadający'
              : '→ Stabilny'}
          </div>
          <div className="text-sm opacity-90">
            ostatnie okresy
          </div>
        </div>
      </div>
    </div>
  )
}
