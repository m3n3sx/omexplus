export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  newOrders: number
  totalCustomers: number
}

export interface OrderItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  total: number
  thumbnail?: string
  variant?: {
    id: string
    title: string
  }
}

export interface Order {
  id: string
  display_id: number
  email: string
  created_at: string
  updated_at: string
  status: string
  payment_status: string
  fulfillment_status: string
  total: number
  subtotal: number
  tax_total: number
  shipping_total: number
  discount_total: number
  currency_code: string
  items: OrderItem[]
  customer?: {
    id: string
    email: string
    first_name?: string
    last_name?: string
    phone?: string
  }
  shipping_address?: {
    first_name?: string
    last_name?: string
    address_1?: string
    address_2?: string
    city?: string
    province?: string
    postal_code?: string
    country_code?: string
    phone?: string
  }
  billing_address?: {
    first_name?: string
    last_name?: string
    address_1?: string
    address_2?: string
    city?: string
    province?: string
    postal_code?: string
    country_code?: string
  }
  payments?: Array<{
    id: string
    provider_id: string
    amount: number
  }>
}

export interface Product {
  id: string
  title: string
  subtitle?: string
  description?: string
  handle: string
  status: string
  thumbnail?: string
  images?: Array<{ url: string }>
  variants?: ProductVariant[]
  options?: ProductOption[]
  collection_id?: string
  type_id?: string
  tags?: Array<{ value: string }>
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  title: string
  sku?: string
  barcode?: string
  inventory_quantity: number
  prices: Array<{
    amount: number
    currency_code: string
  }>
  options?: Array<{
    value: string
    option_id: string
  }>
}

export interface ProductOption {
  id: string
  title: string
  values: Array<{
    id: string
    value: string
  }>
}

export interface Customer {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  has_account: boolean
  created_at: string
  updated_at: string
  orders?: Order[]
  billing_address?: Address
  shipping_addresses?: Address[]
}

export interface Address {
  id: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  province?: string
  postal_code?: string
  country_code?: string
  phone?: string
}

export interface PaginationParams {
  limit?: number
  offset?: number
}

export interface FilterParams {
  q?: string
  status?: string
  payment_status?: string
  fulfillment_status?: string
  created_at?: {
    gt?: string
    lt?: string
  }
}
