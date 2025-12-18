"use client"

import Link from "next/link"
import { 
  Plus, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Upload,
  Tag,
  MessageCircle,
  BarChart3,
  Settings
} from "lucide-react"
import { usePermissions } from "@/lib/usePermissions"

interface QuickAction {
  label: string
  href: string
  icon: any
  color: string
  permission?: string
}

const actions: QuickAction[] = [
  { label: "Nowy produkt", href: "/products/new", icon: Plus, color: "bg-blue-500", permission: "products.create" },
  { label: "Import CSV", href: "/products/import", icon: Upload, color: "bg-green-500", permission: "products.create" },
  { label: "Zamówienia", href: "/orders", icon: ShoppingCart, color: "bg-purple-500", permission: "orders.view" },
  { label: "Klienci", href: "/customers", icon: Users, color: "bg-orange-500", permission: "customers.view" },
  { label: "Czat", href: "/chat", icon: MessageCircle, color: "bg-pink-500", permission: "chat.view" },
  { label: "Analityka", href: "/analytics", icon: BarChart3, color: "bg-indigo-500", permission: "analytics.view" },
  { label: "CMS", href: "/cms/pages", icon: FileText, color: "bg-teal-500", permission: "cms.view" },
  { label: "Ustawienia", href: "/settings", icon: Settings, color: "bg-gray-500", permission: "settings.view" },
]

export default function QuickActionsWidget() {
  const { hasPermission } = usePermissions()

  const filteredActions = actions.filter(action => 
    !action.permission || hasPermission(action.permission as any)
  )

  return (
    <div className="grid grid-cols-4 gap-2">
      {filteredActions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className={`${action.color} p-2 rounded-lg text-white group-hover:scale-110 transition-transform`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs text-gray-600 text-center">{action.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
