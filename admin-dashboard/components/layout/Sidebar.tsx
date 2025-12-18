"use client"

import { useState, useEffect } from "react"
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
  FileText,
  Menu,
  FolderTree,
  Globe,
  Image,
  Layers,
  Warehouse,
  Building2,
  MessageCircle,
  Calendar,
  CheckSquare,
  StickyNote,
  Mail,
  DollarSign,
  AlertTriangle,
  UserCog,
  Shield,
  Languages,
  Truck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getCurrentUser, getRoleLabel } from "@/lib/auth"
import { canAccessPage, Role, ROLE_COLORS, Permission, hasPermission } from "@/lib/roles"

interface NavItem {
  name: string
  href?: string
  icon: any
  permission?: Permission
  children?: NavItem[]
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Analityka", href: "/analytics", icon: BarChart3, permission: 'analytics.view' },
  { name: "Zamówienia", href: "/orders", icon: ShoppingCart, permission: 'orders.view' },
  { 
    name: "Produkty", 
    icon: Package,
    permission: 'products.view',
    children: [
      { name: "Lista produktów", href: "/products", icon: Package },
      { name: "Bulk Edit", href: "/products/bulk-edit", icon: CheckSquare },
      { name: "Import CSV", href: "/products/import", icon: FileText },
      { name: "Dodaj produkt", href: "/products/new", icon: Package },
    ]
  },
  { name: "Kategorie", href: "/categories", icon: FolderTree, permission: 'products.view' },
  { name: "Magazyn", href: "/inventory", icon: Warehouse, permission: 'inventory.view' },
  { name: "Baza maszyn", href: "/machines", icon: Truck, permission: 'products.view' },
  { name: "Alerty stanów", href: "/stock-alerts", icon: AlertTriangle, permission: 'inventory.view' },
  { name: "Reguły cenowe", href: "/price-rules", icon: DollarSign, permission: 'price_rules.view' },
  { name: "Klienci", href: "/customers", icon: Users, permission: 'customers.view' },
  { name: "B2B - Hurt", href: "/b2b", icon: Building2, permission: 'b2b.view' },
  { name: "Czat", href: "/chat", icon: MessageCircle, permission: 'chat.view' },
  { name: "Formularze", href: "/contact-forms", icon: Mail, permission: 'chat.view' },
  { 
    name: "Zespół", 
    icon: Users,
    children: [
      { name: "Zadania", href: "/tasks", icon: CheckSquare },
      { name: "Kalendarz", href: "/calendar", icon: Calendar },
      { name: "Notatki", href: "/notes", icon: StickyNote },
      { name: "Wiadomości", href: "/messages", icon: Mail },
    ]
  },
  { 
    name: "Treść & Wygląd", 
    icon: Layers,
    permission: 'cms.view',
    children: [
      { name: "Strony CMS", href: "/cms/pages", icon: FileText },
      { name: "Tłumaczenia", href: "/translations", icon: Languages },
      { name: "Topbar", href: "/topbar", icon: Globe },
      { name: "Mega Menu", href: "/megamenu", icon: Menu },
      { name: "Bannery", href: "/banners", icon: Image },
      { name: "SEO", href: "/seo", icon: Tag },
    ]
  },
  { name: "Użytkownicy", href: "/users", icon: UserCog, permission: 'users.view' },
  { name: "Ustawienia", href: "/settings", icon: Settings, permission: 'settings.view' },
]

// Filtruj nawigację na podstawie uprawnień
function filterNavigation(items: NavItem[], role: Role): NavItem[] {
  return items.filter(item => {
    // Jeśli nie ma wymaganego uprawnienia, pokaż
    if (!item.permission) return true
    
    // Sprawdź czy użytkownik ma uprawnienie
    return hasPermission(role, item.permission)
  }).map(item => {
    // Jeśli ma dzieci, filtruj je też
    if (item.children) {
      return {
        ...item,
        children: filterNavigation(item.children, role)
      }
    }
    return item
  }).filter(item => {
    // Usuń puste grupy
    if (item.children && item.children.length === 0) return false
    return true
  })
}

export default function Sidebar() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [filteredNav, setFilteredNav] = useState<NavItem[]>(navigation)
  
  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    
    // Jeśli użytkownik ma rolę, filtruj menu
    // Jeśli nie ma roli lub jest super_admin, pokaż wszystko
    if (currentUser?.role) {
      if (currentUser.role === 'super_admin') {
        setFilteredNav(navigation)
      } else {
        setFilteredNav(filterNavigation(navigation, currentUser.role))
      }
    } else {
      // Brak użytkownika - pokaż pełne menu (zostanie przekierowany na login)
      setFilteredNav(navigation)
    }
  }, [])
  
  // Automatycznie rozwiń sekcję gdy pathname pasuje do jednego z children
  useEffect(() => {
    const sectionsToExpand: string[] = []
    
    filteredNav.forEach((item) => {
      if ('children' in item && item.children) {
        const hasActiveChild = item.children.some(child => 
          pathname === child.href || pathname.startsWith(child.href + '/')
        )
        if (hasActiveChild && !expandedSections.includes(item.name)) {
          sectionsToExpand.push(item.name)
        }
      }
    })
    
    if (sectionsToExpand.length > 0) {
      setExpandedSections(prev => [...new Set([...prev, ...sectionsToExpand])])
    }
  }, [pathname, filteredNav])
  
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
      
      {/* User info with role badge */}
      {user && (
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white font-medium">
                {user.first_name?.[0]}{user.last_name?.[0] || user.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.first_name} {user.last_name}
              </p>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                ROLE_COLORS[user.role as Role] || "bg-gray-100 text-gray-800"
              )}>
                <Shield className="w-3 h-3 mr-1" />
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          if ('children' in item && item.children && item.children.length > 0) {
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
                
                {isExpanded && item.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const isActive = pathname === child.href || pathname.startsWith(child.href + '/')
                      const ChildIcon = child.icon
                      
                      return (
                        <Link
                          key={child.name}
                          href={child.href!}
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
          
          if (!item.href) return null
          
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
      
      {/* Version info */}
      <div className="px-4 py-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          OMEX Admin v1.0
        </p>
      </div>
    </div>
  )
}
