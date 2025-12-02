export interface PricingTier {
  qty_min: number
  qty_max: number | null
  price: number
  discount_percentage?: number
}

export interface QuoteItem {
  product_id: string
  product_name?: string
  quantity: number
  unit_price: number
  total: number
}

export interface Quote {
  id: string
  customer_id: string
  items: QuoteItem[]
  total_amount: number
  valid_until?: Date
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface CreateQuoteDTO {
  customer_id: string
  items: QuoteItem[]
  valid_until?: Date
  notes?: string
}

export interface PurchaseOrder {
  id: string
  customer_id: string
  po_number: string
  items: QuoteItem[]
  total_amount: number
  payment_terms?: string
  delivery_date?: Date
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface CreatePurchaseOrderDTO {
  customer_id: string
  po_number: string
  items: QuoteItem[]
  payment_terms?: string
  delivery_date?: Date
  notes?: string
}

export interface B2BCustomerGroup {
  id: string
  name: string
  discount_percentage?: number
  min_order_value?: number
  payment_terms?: string
  custom_catalog_ids?: string[]
  created_at: Date
  updated_at: Date
}

export interface B2BOrderValidation {
  valid: boolean
  errors: string[]
  warnings: string[]
}
