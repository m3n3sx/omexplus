// Core E-commerce Types

export interface Product {
  id: string
  title: string
  subtitle?: string
  description?: string
  handle: string
  thumbnail?: string
  images?: ProductImage[]
  variants: ProductVariant[]
  options?: ProductOption[]
  collection_id?: string
  type?: ProductType
  tags?: ProductTag[]
  status: 'draft' | 'proposed' | 'published' | 'rejected'
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  url: string
  metadata?: Record<string, any>
}

export interface ProductVariant {
  id: string
  title: string
  product_id: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  prices: MoneyAmount[]
  options: ProductOptionValue[]
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
}

export interface ProductOption {
  id: string
  title: string
  values: ProductOptionValue[]
}

export interface ProductOptionValue {
  id: string
  value: string
  option_id: string
}

export interface ProductType {
  id: string
  value: string
}

export interface ProductTag {
  id: string
  value: string
}

export interface MoneyAmount {
  id: string
  currency_code: string
  amount: number
  variant_id: string
  region_id?: string
}

export interface Cart {
  id: string
  email?: string
  billing_address?: Address
  shipping_address?: Address
  items: LineItem[]
  region_id: string
  region?: Region
  discounts?: Discount[]
  gift_cards?: GiftCard[]
  customer_id?: string
  payment_session?: PaymentSession
  payment_sessions?: PaymentSession[]
  shipping_methods?: ShippingMethod[]
  type: 'default' | 'swap' | 'draft_order' | 'payment_link' | 'claim'
  completed_at?: string
  payment_authorized_at?: string
  idempotency_key?: string
  context?: Record<string, any>
  sales_channel_id?: string
  created_at: string
  updated_at: string
  subtotal: number
  discount_total: number
  item_tax_total: number
  shipping_total: number
  shipping_tax_total: number
  tax_total: number
  refunded_total: number
  total: number
  refundable_amount: number
  gift_card_total: number
  gift_card_tax_total: number
}

export interface LineItem {
  id: string
  cart_id: string
  order_id?: string
  swap_id?: string
  claim_order_id?: string
  title: string
  description?: string
  thumbnail?: string
  is_return: boolean
  is_giftcard: boolean
  should_merge: boolean
  allow_discounts: boolean
  has_shipping: boolean
  unit_price: number
  variant_id?: string
  variant?: ProductVariant
  quantity: number
  fulfilled_quantity?: number
  returned_quantity?: number
  shipped_quantity?: number
  refundable?: number
  subtotal: number
  tax_total: number
  total: number
  original_total: number
  original_tax_total: number
  discount_total: number
  raw_discount_total: number
  gift_card_total: number
}

export interface Address {
  id?: string
  customer_id?: string
  company?: string
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  country_code: string
  province?: string
  postal_code: string
  phone?: string
  metadata?: Record<string, any>
}

export interface Region {
  id: string
  name: string
  currency_code: string
  tax_rate: number
  tax_code?: string
  countries: Country[]
  payment_providers: PaymentProvider[]
  fulfillment_providers: FulfillmentProvider[]
}

export interface Country {
  id: string
  iso_2: string
  iso_3: string
  num_code: number
  name: string
  display_name: string
  region_id?: string
}

export interface PaymentProvider {
  id: string
  is_installed: boolean
}

export interface FulfillmentProvider {
  id: string
  is_installed: boolean
}

export interface ShippingMethod {
  id: string
  shipping_option_id: string
  shipping_option?: ShippingOption
  cart_id?: string
  order_id?: string
  swap_id?: string
  return_id?: string
  claim_order_id?: string
  price: number
  data: Record<string, any>
}

export interface ShippingOption {
  id: string
  name: string
  region_id: string
  profile_id: string
  provider_id: string
  price_type: 'flat_rate' | 'calculated'
  amount?: number
  is_return: boolean
  admin_only: boolean
  data: Record<string, any>
}

export interface PaymentSession {
  id: string
  cart_id: string
  provider_id: string
  is_selected: boolean
  is_initiated: boolean
  status: string
  data: Record<string, any>
  idempotency_key?: string
  amount: number
}

export interface Discount {
  id: string
  code: string
  is_dynamic: boolean
  is_disabled: boolean
  rule: DiscountRule
  regions: Region[]
}

export interface DiscountRule {
  id: string
  type: 'fixed' | 'percentage' | 'free_shipping'
  value: number
  allocation: 'total' | 'item'
}

export interface GiftCard {
  id: string
  code: string
  value: number
  balance: number
  region_id: string
  is_disabled: boolean
}

export interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  billing_address_id?: string
  billing_address?: Address
  shipping_addresses?: Address[]
  phone?: string
  has_account: boolean
  orders?: Order[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  status: OrderStatus
  fulfillment_status: FulfillmentStatus
  payment_status: PaymentStatus
  display_id: number
  cart_id: string
  customer_id: string
  customer?: Customer
  email: string
  billing_address?: Address
  shipping_address?: Address
  region_id: string
  region?: Region
  currency_code: string
  tax_rate?: number
  items: LineItem[]
  discounts?: Discount[]
  gift_cards?: GiftCard[]
  shipping_methods?: ShippingMethod[]
  payments?: Payment[]
  fulfillments?: Fulfillment[]
  returns?: Return[]
  claims?: ClaimOrder[]
  swaps?: Swap[]
  draft_order_id?: string
  canceled_at?: string
  no_notification?: boolean
  idempotency_key?: string
  external_id?: string
  sales_channel_id?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  subtotal: number
  discount_total: number
  shipping_total: number
  refunded_total: number
  paid_total: number
  refundable_amount: number
  gift_card_total: number
  gift_card_tax_total: number
  tax_total: number
  total: number
}

export type OrderStatus = 
  | 'pending'
  | 'completed'
  | 'archived'
  | 'canceled'
  | 'requires_action'

export type FulfillmentStatus =
  | 'not_fulfilled'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'partially_shipped'
  | 'shipped'
  | 'partially_returned'
  | 'returned'
  | 'canceled'
  | 'requires_action'

export type PaymentStatus =
  | 'not_paid'
  | 'awaiting'
  | 'captured'
  | 'partially_refunded'
  | 'refunded'
  | 'canceled'
  | 'requires_action'

export interface Payment {
  id: string
  swap_id?: string
  cart_id?: string
  order_id?: string
  amount: number
  currency_code: string
  amount_refunded: number
  provider_id: string
  data: Record<string, any>
  captured_at?: string
  canceled_at?: string
  idempotency_key?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Fulfillment {
  id: string
  claim_order_id?: string
  swap_id?: string
  order_id?: string
  provider_id: string
  location_id?: string
  no_notification?: boolean
  tracking_numbers: string[]
  tracking_links: TrackingLink[]
  data: Record<string, any>
  shipped_at?: string
  canceled_at?: string
  metadata?: Record<string, any>
  idempotency_key?: string
  created_at: string
  updated_at: string
}

export interface TrackingLink {
  url: string
  tracking_number: string
}

export interface Return {
  id: string
  status: ReturnStatus
  items: ReturnItem[]
  swap_id?: string
  claim_order_id?: string
  order_id?: string
  shipping_method?: ShippingMethod
  location_id?: string
  refund_amount: number
  no_notification?: boolean
  idempotency_key?: string
  received_at?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export type ReturnStatus =
  | 'requested'
  | 'received'
  | 'requires_action'
  | 'canceled'

export interface ReturnItem {
  return_id: string
  item_id: string
  quantity: number
  is_requested: boolean
  requested_quantity?: number
  received_quantity?: number
  reason_id?: string
  note?: string
  metadata?: Record<string, any>
}

export interface ClaimOrder {
  id: string
  type: ClaimType
  payment_status: ClaimPaymentStatus
  fulfillment_status: FulfillmentStatus
  claim_items: ClaimItem[]
  additional_items: LineItem[]
  order_id: string
  return_order?: Return
  shipping_address_id?: string
  shipping_address?: Address
  shipping_methods?: ShippingMethod[]
  fulfillments?: Fulfillment[]
  refund_amount?: number
  canceled_at?: string
  no_notification?: boolean
  idempotency_key?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export type ClaimType = 'refund' | 'replace'

export type ClaimPaymentStatus =
  | 'na'
  | 'not_refunded'
  | 'refunded'

export interface ClaimItem {
  id: string
  claim_order_id: string
  item_id: string
  variant_id: string
  reason: ClaimReason
  note?: string
  quantity: number
  tags?: ClaimTag[]
  images?: ClaimImage[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export type ClaimReason =
  | 'missing_item'
  | 'wrong_item'
  | 'production_failure'
  | 'other'

export interface ClaimTag {
  id: string
  value: string
}

export interface ClaimImage {
  id: string
  url: string
  metadata?: Record<string, any>
}

export interface Swap {
  id: string
  fulfillment_status: FulfillmentStatus
  payment_status: SwapPaymentStatus
  order_id: string
  additional_items: LineItem[]
  return_order?: Return
  fulfillments?: Fulfillment[]
  payment?: Payment
  difference_due?: number
  shipping_address_id?: string
  shipping_address?: Address
  shipping_methods?: ShippingMethod[]
  cart_id?: string
  confirmed_at?: string
  canceled_at?: string
  no_notification?: boolean
  allow_backorder: boolean
  idempotency_key?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export type SwapPaymentStatus =
  | 'not_paid'
  | 'awaiting'
  | 'captured'
  | 'confirmed'
  | 'canceled'
  | 'difference_refunded'
  | 'partially_refunded'
  | 'refunded'
  | 'requires_action'
