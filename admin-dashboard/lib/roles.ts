/**
 * System ról i uprawnień dla Admin Dashboard
 * 
 * Role:
 * - super_admin: Pełny dostęp (właściciel)
 * - manager: Zarządzanie sklepem, pracownikami
 * - sales: Zamówienia, klienci, chat
 * - warehouse: Produkty, inwentarz, wysyłki
 * - content: CMS, banery, SEO
 * - support: Chat, formularze kontaktowe
 */

export type Role = 
  | 'super_admin' 
  | 'manager' 
  | 'sales' 
  | 'warehouse' 
  | 'content' 
  | 'support'

export type Permission = 
  // Orders
  | 'orders.view'
  | 'orders.edit'
  | 'orders.refund'
  | 'orders.cancel'
  // Products
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'products.pricing'
  // Inventory
  | 'inventory.view'
  | 'inventory.edit'
  // Customers
  | 'customers.view'
  | 'customers.edit'
  | 'customers.delete'
  // Analytics
  | 'analytics.view'
  | 'analytics.export'
  // CMS
  | 'cms.view'
  | 'cms.edit'
  | 'cms.publish'
  // Chat
  | 'chat.view'
  | 'chat.respond'
  | 'chat.assign'
  // Settings
  | 'settings.view'
  | 'settings.edit'
  // Users
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  // B2B
  | 'b2b.view'
  | 'b2b.edit'
  // Price Rules
  | 'price_rules.view'
  | 'price_rules.edit'
  | 'price_rules.apply'

// Definicja uprawnień dla każdej roli
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    // Wszystkie uprawnienia
    'orders.view', 'orders.edit', 'orders.refund', 'orders.cancel',
    'products.view', 'products.create', 'products.edit', 'products.delete', 'products.pricing',
    'inventory.view', 'inventory.edit',
    'customers.view', 'customers.edit', 'customers.delete',
    'analytics.view', 'analytics.export',
    'cms.view', 'cms.edit', 'cms.publish',
    'chat.view', 'chat.respond', 'chat.assign',
    'settings.view', 'settings.edit',
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'b2b.view', 'b2b.edit',
    'price_rules.view', 'price_rules.edit', 'price_rules.apply',
  ],
  
  manager: [
    'orders.view', 'orders.edit', 'orders.refund', 'orders.cancel',
    'products.view', 'products.create', 'products.edit', 'products.pricing',
    'inventory.view', 'inventory.edit',
    'customers.view', 'customers.edit',
    'analytics.view', 'analytics.export',
    'cms.view', 'cms.edit', 'cms.publish',
    'chat.view', 'chat.respond', 'chat.assign',
    'settings.view',
    'users.view',
    'b2b.view', 'b2b.edit',
    'price_rules.view', 'price_rules.edit',
  ],
  
  sales: [
    'orders.view', 'orders.edit',
    'products.view',
    'customers.view', 'customers.edit',
    'analytics.view',
    'chat.view', 'chat.respond',
    'b2b.view',
  ],
  
  warehouse: [
    'orders.view',
    'products.view', 'products.edit',
    'inventory.view', 'inventory.edit',
  ],
  
  content: [
    'products.view', 'products.edit',
    'cms.view', 'cms.edit', 'cms.publish',
    'analytics.view',
  ],
  
  support: [
    'orders.view',
    'customers.view',
    'chat.view', 'chat.respond',
  ],
}

// Nazwy ról po polsku
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  manager: 'Manager',
  sales: 'Sprzedaż',
  warehouse: 'Magazyn',
  content: 'Content',
  support: 'Wsparcie',
}

// Opisy ról
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  super_admin: 'Pełny dostęp do wszystkich funkcji systemu',
  manager: 'Zarządzanie sklepem, produktami i zespołem',
  sales: 'Obsługa zamówień, klientów i sprzedaży',
  warehouse: 'Zarządzanie produktami i stanem magazynowym',
  content: 'Zarządzanie treścią, CMS i SEO',
  support: 'Obsługa klienta i czat',
}

// Kolory ról dla UI
export const ROLE_COLORS: Record<Role, string> = {
  super_admin: 'bg-red-100 text-red-800',
  manager: 'bg-purple-100 text-purple-800',
  sales: 'bg-blue-100 text-blue-800',
  warehouse: 'bg-yellow-100 text-yellow-800',
  content: 'bg-green-100 text-green-800',
  support: 'bg-orange-100 text-orange-800',
}

// Funkcja sprawdzająca uprawnienia
export function hasPermission(userRole: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole]
  return permissions?.includes(permission) ?? false
}

// Funkcja sprawdzająca wiele uprawnień (OR)
export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(userRole, p))
}

// Funkcja sprawdzająca wiele uprawnień (AND)
export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(userRole, p))
}

// Mapowanie stron do wymaganych uprawnień
export const PAGE_PERMISSIONS: Record<string, Permission[]> = {
  '/': [], // Dashboard - dostępny dla wszystkich zalogowanych
  '/orders': ['orders.view'],
  '/products': ['products.view'],
  '/customers': ['customers.view'],
  '/inventory': ['inventory.view'],
  '/analytics': ['analytics.view'],
  '/cms': ['cms.view'],
  '/chat': ['chat.view'],
  '/contact-forms': ['chat.view'],
  '/settings': ['settings.view'],
  '/users': ['users.view'],
  '/b2b': ['b2b.view'],
  '/price-rules': ['price_rules.view'],
  '/banners': ['cms.view'],
  '/megamenu': ['cms.view'],
  '/topbar': ['cms.view'],
  '/seo': ['cms.view'],
  '/calendar': [], // Dostępny dla wszystkich
  '/tasks': [], // Dostępny dla wszystkich
  '/messages': [], // Dostępny dla wszystkich
  '/notes': [], // Dostępny dla wszystkich
  '/stock-alerts': ['inventory.view'],
}

// Funkcja sprawdzająca dostęp do strony
export function canAccessPage(userRole: Role, path: string): boolean {
  const requiredPermissions = PAGE_PERMISSIONS[path]
  
  // Jeśli strona nie ma zdefiniowanych uprawnień, jest dostępna
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }
  
  return hasAnyPermission(userRole, requiredPermissions)
}

// Funkcja filtrująca menu na podstawie uprawnień
export function filterMenuByRole(menuItems: MenuItem[], userRole: Role): MenuItem[] {
  return menuItems.filter(item => {
    if (!item.path) return true
    return canAccessPage(userRole, item.path)
  })
}

export interface MenuItem {
  label: string
  path?: string
  icon?: string
  children?: MenuItem[]
}
