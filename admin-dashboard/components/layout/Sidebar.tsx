"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings,
  BarChart3,
  Tag,
  Truck,
  FileText,
  Menu,
  FolderTree,
  Globe,
  Image,
  Layers,
  Warehouse,
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Analityka", href: "/analytics", icon: BarChart3 },
  { name: "Zamówienia", href: "/orders", icon: ShoppingCart },
  { name: "Produkty", href: "/products", icon: Package },
  { name: "Kategorie", href: "/categories", icon: FolderTree },
  { name: "Magazyn", href: "/inventory", icon: Warehouse },
  { name: "Klienci", href: "/customers", icon: Users },
  { name: "B2B - Hurt", href: "/b2b", icon: Building2 },
  { 
    name: "Treść & Wygląd", 
    icon: Layers,
    children: [
      { name: "Strony CMS", href: "/cms/pages", icon: FileText },
      { name: "Topbar", href: "/topbar", icon: Globe },
      { name: "Mega Menu", href: "/megamenu", icon: Menu },
      { name: "Bannery", href: "/banners", icon: Image },
      { name: "SEO", href: "/seo", icon: Tag },
    ]
  },
  { name: "Ustawienia", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  
  const toggleSection = (name: string) => {
    setExpandedSections(prev => 
      prev.includes(name) 
        ? prev.filter(s => s !== name)
        : [...prev, name]
    )
  }
  
  return (
    <div className="flex flex-col w-64 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-center h-16 px-4 bg-gray-800">
        <h1 className="text-xl font-bold text-white">OMEX Admin</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          if ('children' in item) {
            const isExpanded = expandedSections.includes(item.name)
            const Icon = item.icon
            
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleSection(item.name)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
                </button>
                
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const isActive = pathname === child.href
                      const ChildIcon = child.icon
                      
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm rounded-lg transition-colors",
                            isActive
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          )}
                        >
                          <ChildIcon className="w-4 h-4 mr-3" />
                          {child.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }
          
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
