/**
 * Supplier Model - Dostawcy dropshipping
 * 
 * Reprezentuje zewnętrznych dostawców, których produkty sprzedajesz w swoim sklepie.
 * Każdy dostawca ma własny magazyn (stock_location) i może mieć API do synchronizacji.
 */

export interface Supplier {
  id: string
  name: string
  code: string // Unikalny kod dostawcy np. "PARTS24", "AUTOLAND"
  
  // Dane kontaktowe
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  
  // Adres
  address_line_1?: string
  address_line_2?: string
  city?: string
  postal_code?: string
  country_code?: string
  
  // Integracja API
  api_url?: string
  api_key?: string
  api_format?: 'json' | 'xml' | 'csv' // Format danych z API
  sync_enabled: boolean
  sync_frequency?: 'hourly' | 'daily' | 'weekly' | 'manual'
  last_sync_at?: Date
  
  // Warunki współpracy
  commission_rate?: number // Prowizja w % (np. 15 = 15%)
  min_order_value?: number // Minimalna wartość zamówienia
  lead_time_days?: number // Czas realizacji w dniach
  shipping_method?: string // Preferowana metoda wysyłki
  
  // Powiązania Medusa
  stock_location_id?: string // Powiązany magazyn w Medusa
  
  // Status
  is_active: boolean
  is_dropship: boolean // true = dropship, false = własny magazyn
  
  // Statystyki
  products_count: number
  orders_count: number
  total_revenue?: number
  
  // Notatki
  notes?: string
  
  // Metadane
  metadata?: Record<string, any>
  
  created_at: Date
  updated_at: Date
}

export interface SupplierProduct {
  id: string
  supplier_id: string
  product_id: string // ID produktu w Medusa
  
  // Dane od dostawcy
  supplier_sku: string // SKU u dostawcy
  supplier_price: number // Cena zakupu od dostawcy (w groszach)
  supplier_currency: string
  supplier_stock: number // Stan magazynowy u dostawcy
  
  // Twoja marża
  markup_type: 'percentage' | 'fixed'
  markup_value: number // Wartość marży
  
  // Synchronizacja
  last_sync_at?: Date
  sync_status?: 'synced' | 'pending' | 'error'
  sync_error?: string
  
  // Status
  is_active: boolean
  
  created_at: Date
  updated_at: Date
}

export interface SupplierOrder {
  id: string
  supplier_id: string
  order_id: string // ID zamówienia w Medusa
  
  // Status zamówienia u dostawcy
  supplier_order_id?: string // ID zamówienia w systemie dostawcy
  status: 'pending' | 'sent' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  
  // Śledzenie
  tracking_number?: string
  tracking_url?: string
  
  // Koszty
  supplier_total: number // Koszt od dostawcy
  your_margin: number // Twoja marża
  
  // Daty
  sent_at?: Date
  confirmed_at?: Date
  shipped_at?: Date
  delivered_at?: Date
  
  notes?: string
  
  created_at: Date
  updated_at: Date
}

// DTO dla tworzenia/aktualizacji
export interface CreateSupplierDTO {
  name: string
  code: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  postal_code?: string
  country_code?: string
  api_url?: string
  api_key?: string
  api_format?: 'json' | 'xml' | 'csv'
  sync_enabled?: boolean
  sync_frequency?: 'hourly' | 'daily' | 'weekly' | 'manual'
  commission_rate?: number
  min_order_value?: number
  lead_time_days?: number
  shipping_method?: string
  is_dropship?: boolean
  notes?: string
  metadata?: Record<string, any>
}

export interface UpdateSupplierDTO extends Partial<CreateSupplierDTO> {
  is_active?: boolean
  stock_location_id?: string
}

export interface CreateSupplierProductDTO {
  supplier_id: string
  product_id: string
  supplier_sku: string
  supplier_price: number
  supplier_currency?: string
  supplier_stock?: number
  markup_type?: 'percentage' | 'fixed'
  markup_value?: number
}

export interface SupplierFilters {
  is_active?: boolean
  is_dropship?: boolean
  sync_enabled?: boolean
  country_code?: string
  q?: string
}
