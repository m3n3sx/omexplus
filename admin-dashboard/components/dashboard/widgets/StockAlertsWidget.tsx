"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Package, ArrowRight, RefreshCw } from "lucide-react"
import api from "@/lib/api-client"

interface StockAlert {
  id: string
  title: string
  variant_title?: string
  sku?: string
  inventory_quantity: number
  thumbnail?: string
}

export default function StockAlertsWidget() {
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStockAlerts()
  }, [])

  const loadStockAlerts = async () => {
    try {
      setLoading(true)
      const response = await api.getProducts({ limit: 100 })
      const products = response.products || []
      
      // Znajdź produkty z niskim stanem (< 10)
      const lowStock: StockAlert[] = []
      
      products.forEach((product: any) => {
        product.variants?.forEach((variant: any) => {
          const qty = variant.inventory_quantity ?? 0
          if (qty < 10) {
            lowStock.push({
              id: variant.id,
              title: product.title,
              variant_title: variant.title !== 'Default' ? variant.title : undefined,
              sku: variant.sku,
              inventory_quantity: qty,
              thumbnail: product.thumbnail,
            })
          }
        })
      })
      
      // Sortuj od najniższego stanu
      lowStock.sort((a, b) => a.inventory_quantity - b.inventory_quantity)
      setAlerts(lowStock.slice(0, 5))
    } catch (error) {
      console.error("Error loading stock alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAlertColor = (qty: number) => {
    if (qty === 0) return "bg-red-100 text-red-700 border-red-200"
    if (qty < 5) return "bg-orange-100 text-orange-700 border-orange-200"
    return "bg-yellow-100 text-yellow-700 border-yellow-200"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-10 h-10 text-green-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Wszystkie produkty mają wystarczający stan</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center gap-3 p-3 rounded-lg border ${getAlertColor(alert.inventory_quantity)}`}
        >
          {alert.thumbnail ? (
            <img
              src={alert.thumbnail}
              alt={alert.title}
              className="w-10 h-10 rounded object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{alert.title}</p>
            {alert.variant_title && (
              <p className="text-xs opacity-75">{alert.variant_title}</p>
            )}
            {alert.sku && (
              <p className="text-xs opacity-60">SKU: {alert.sku}</p>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold">{alert.inventory_quantity}</span>
          </div>
        </div>
      ))}

      <Link
        href="/stock-alerts"
        className="flex items-center justify-center gap-2 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        Zobacz wszystkie alerty
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
