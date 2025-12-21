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
  Languages,
  Truck,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getCurrentUser, getRoleLabel } from "@/lib/auth"
import { Role, ROLE_COLORS, Permission, hasPermission } from "@/lib/roles"

interface NavItem {
  name: string
  href?: string
  icon: any
  permission?: Permission
  children?: NavItem[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigationSections: NavSection[] = [
  {
    title: "Główne",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Analityka", href: "/analytics", icon: BarChart3, permission: 'analytics.view' },
    ]
  },
  {
    title: "Sprzedaż",
    items: [
      { name: "Zamówienia", href: "/orders", icon: ShoppingCart, permission: 'orders.view' },
      { name: "Klienci", href: "/customers", icon: Users, permission: 'customers.view' },
      { name: "B2B - Hurt", href: "/b2b", icon: Building2, permission: 'b2b.view' },
      { name: "Reguły cenowe", href: "/price-rules", icon: DollarSign, permission: 'price_rules.view' },
    ]
  },
  {
    title: "Katalog",
    items: [
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
      { name: "Baza maszyn", href: "/machines", icon: Truck, permission: 'products.view' },
    ]
  },
  {
    title: "Magazyn",
    items: [
      { name: "Stan magazynowy", href: "/inventory", icon: Warehouse, permission: 'inventory.view' },
      { name: "Alerty stanów", href: "/stock-alerts", icon: AlertTriangle, permission: 'inventory.view' },
      { name: "Dostawcy", href: "/suppliers", icon: Truck, permission: 'inventory.view' },
      { name: "Magazyny dostawców", href: "/supplier-inventory", icon: Warehouse, permission: 'inventory.view' },
      { name: "Zamówienia dropship", href: "/supplier-orders", icon: Package, permission: 'orders.view' },
    ]
  },
  {
    title: "Komunikacja",
    items: [
      { name: "Czat", href: "/chat", icon: MessageCircle, permission: 'chat.view' },
      { name: "Formularze", href: "/contact-forms", icon: Mail, permission: 'chat.view' },
    ]
  },
  {
    title: "Zespół",
    items: [
      { name: "Zadania", href: "/tasks", icon: CheckSquare },
      { name: "Kalendarz", href: "/calendar", icon: Calendar },
      { name: "Notatki", href: "/notes", icon: StickyNote },
      { name: "Wiadomości", href: "/messages", icon: Mail },
    ]
  },
  {
    title: "Treść",
    items: [
      { name: "Strony CMS", href: "/cms/pages", icon: FileText, permission: 'cms.view' },
      { name: "Tłumaczenia", href: "/translations", icon: Languages, permission: 'cms.view' },
      { name: "Topbar", href: "/topbar", icon: Globe, permission: 'cms.view' },
      { name: "Mega Menu", href: "/megamenu", icon: Menu, permission: 'cms.view' },
      { name: "Bannery", href: "/banners", icon: Image, permission: 'cms.view' },
      { name: "SEO", href: "/seo", icon: Tag, permission: 'cms.view' },
    ]
  },
  {
    title: "System",
    items: [
      { name: "Użytkownicy", href: "/users", icon: UserCog, permission: 'users.view' },
      { name: "Ustawienia", href: "/settings", icon: Settings, permission: 'settings.view' },
    ]
  },
]

function filterNavItems(items: NavItem[], role: Role): NavItem[] {
  return items.filter(item => {
    if (!item.permission) return true
    return hasPermission(role, item.permission)
  }).map(item => {
    if (item.children) {
      return { ...item, children: filterNavItems(item.children, role) }
    }
    return item
  }).filter(item => {
    if (item.children && item.children.length === 0) return false
    return true
  })
}

function filterSections(sections: NavSection[], role: Role): NavSection[] {
  return sections.map(section => ({
    ...section,
    items: filterNavItems(section.items, role)
  })).filter(section => section.items.length > 0)
}

const SIDEBAR_COLLAPSED_KEY = 'omex_sidebar_collapsed'
const SIDEBAR_SECTIONS_KEY = 'omex_sidebar_sections'

export default function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [collapsedSections, setCollapsedSections] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [filteredSections, setFilteredSections] = useState<NavSection[]>(navigationSections)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  useEffect(() => {
    const savedCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    if (savedCollapsed === 'true') setIsCollapsed(true)
    
    const savedSections = localStorage.getItem(SIDEBAR_SECTIONS_KEY)
    if (savedSections) {
      try {
        setCollapsedSections(JSON.parse(savedSections))
      } catch {}
    }
    
    const currentUser = getCurrentUser()
    setUser(currentUser)
    
    if (currentUser?.role) {
      if (currentUser.role === 'super_admin') {
        setFilteredSections(navigationSections)
      } else {
        setFilteredSections(filterSections(navigationSections, currentUser.role))
      }
    } else {
      setFilteredSections(navigationSections)
    }
  }, [])
  
  useEffect(() => {
    const itemsToExpand: string[] = []
    
    filteredSections.forEach(section => {
      section.items.forEach(item => {
        if (item.children) {
          const hasActiveChild = item.children.some(child => 
            pathname === child.href || pathname.startsWith(child.href + '/')
          )
          if (hasActiveChild && !expandedItems.includes(item.name)) {
            itemsToExpand.push(item.name)
          }
        }
      })
    })
    
    if (itemsToExpand.length > 0) {
      setExpandedItems(prev => [...new Set([...prev, ...itemsToExpand])])
    }
  }, [pathname, filteredSections])
  
  const toggleItem = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  const toggleSection = (title: string) => {
    const newSections = collapsedSections.includes(title)
      ? collapsedSections.filter(s => s !== title)
      : [...collapsedSections, title]
    setCollapsedSections(newSections)
    localStorage.setItem(SIDEBAR_SECTIONS_KEY, JSON.stringify(newSections))
  }

  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newState))
  }

  const renderNavItem = (item: NavItem, isChild = false) => {
    if (item.children && item.children.length > 0) {
      const isExpanded = expandedItems.includes(item.name)
      const Icon = item.icon
      
      if (isCollapsed) {
        return (
          <div key={item.name} className="relative group">
            <button
              className="w-full flex items-center justify-center p-2.5 text-theme-secondary hover:bg-theme-hover rounded-lg transition-colors"
              title={item.name}
            >
              <Icon className="w-5 h-5" />
            </button>
            <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
              <div className="bg-theme-secondary rounded-lg shadow-xl py-2 min-w-[180px] border border-theme">
                <div className="px-3 py-2 text-xs font-semibold text-theme-muted uppercase">{item.name}</div>
                {item.children.map((child) => {
                  const isActive = pathname === child.href
                  const ChildIcon = child.icon
                  return (
                    <Link
                      key={child.name}
                      href={child.href!}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm transition-colors",
                        isActive ? "bg-theme-hover text-theme-primary" : "text-theme-secondary hover:bg-theme-hover"
                      )}
                    >
                      <ChildIcon className="w-4 h-4 mr-2" />
                      {child.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )
      }
      
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleItem(item.name)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg text-theme-secondary hover:bg-theme-hover transition-colors"
          >
            <div className="flex items-center">
              <Icon className="w-4 h-4 mr-3" />
              {item.name}
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
          </button>
          
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-0.5 border-l border-theme pl-3">
              {item.children.map((child) => renderNavItem(child, true))}
            </div>
          )}
        </div>
      )
    }
    
    if (!item.href) return null
    
    const isActive = pathname === item.href
    const Icon = item.icon
    
    if (isCollapsed && !isChild) {
      return (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex items-center justify-center p-2.5 rounded-lg transition-colors",
            isActive ? "bg-accent text-white" : "text-theme-secondary hover:bg-theme-hover"
          )}
          title={item.name}
        >
          <Icon className="w-5 h-5" />
        </Link>
      )
    }
    
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
          isActive 
            ? "bg-accent text-white" 
            : "text-theme-secondary hover:bg-theme-hover",
          isChild && "text-xs"
        )}
      >
        <Icon className={cn("mr-3", isChild ? "w-3.5 h-3.5" : "w-4 h-4")} />
        {item.name}
      </Link>
    )
  }
  
  return (
    <div className={cn(
      "flex flex-col bg-theme-secondary min-h-screen transition-all duration-300 relative border-r border-theme",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Collapse toggle */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-20 z-10 w-6 h-6 bg-theme-tertiary hover:bg-theme-hover rounded-full flex items-center justify-center text-theme-primary shadow-lg border border-theme"
        title={isCollapsed ? "Rozwiń menu" : "Zwiń menu"}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo */}
      <div className={cn(
        "flex items-center h-14 bg-theme-tertiary border-b border-theme",
        isCollapsed ? "justify-center px-2" : "px-4"
      )}>
        <h1 className={cn(
          "font-bold text-theme-primary transition-all duration-300",
          isCollapsed ? "text-lg" : "text-xl"
        )}>
          {isCollapsed ? "O" : "OMEX"}
        </h1>
      </div>
      
      {/* User info */}
      {user && !isCollapsed && (
        <div className="px-3 py-3 border-b border-theme">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-theme-tertiary flex items-center justify-center flex-shrink-0">
              <span className="text-theme-primary font-medium text-sm">
                {user.first_name?.[0]}{user.last_name?.[0] || user.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-theme-primary truncate">
                {user.first_name} {user.last_name}
              </p>
              <span className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
                ROLE_COLORS[user.role as Role] || "bg-gray-100 text-gray-800"
              )}>
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>
        </div>
      )}

      {user && isCollapsed && (
        <div className="flex justify-center py-3 border-b border-theme">
          <div className="w-9 h-9 rounded-full bg-theme-tertiary flex items-center justify-center" title={`${user.first_name} ${user.last_name}`}>
            <span className="text-theme-primary font-medium text-sm">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </span>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-4 overflow-y-auto scrollbar-thin",
        isCollapsed ? "px-2" : "px-3"
      )}>
        {filteredSections.map((section, idx) => {
          const isSectionCollapsed = collapsedSections.includes(section.title)
          
          return (
            <div key={section.title} className={cn(idx > 0 && "mt-4")}>
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-1.5 mb-1"
                >
                  <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
                    {section.title}
                  </span>
                  <ChevronDown className={cn(
                    "w-3 h-3 text-theme-muted transition-transform",
                    isSectionCollapsed && "-rotate-90"
                  )} />
                </button>
              )}
              
              {isCollapsed && idx > 0 && (
                <div className="border-t border-theme my-2" />
              )}
              
              {!isSectionCollapsed && (
                <div className="space-y-0.5">
                  {section.items.map(item => renderNavItem(item))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      
      {/* Version */}
      {!isCollapsed && (
        <div className="px-4 py-2 border-t border-theme">
          <p className="text-xs text-theme-muted text-center">v1.0</p>
        </div>
      )}
    </div>
  )
}
