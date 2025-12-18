/**
 * Extended Product type with all new fields
 */
export interface ProductExtended {
  id: string
  title: string
  description?: string
  sku: string
  price: number
  cost?: number

  // SEO Fields
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]
  slug?: string
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  schema_type?: string
  structured_data?: Record<string, any>

  // Manufacturer Fields
  manufacturer_id?: string
  manufacturer_sku?: string
  manufacturer_part_number?: string
  manufacturer_catalog_page?: number
  manufacturer_catalog_pdf_url?: string
  manufacturer_technical_docs?: Array<{
    title: string
    url: string
    type: string
  }>

  // Category Hierarchy
  category_id?: string
  subcategory_id?: string
  sub_subcategory_id?: string
  breadcrumb?: string

  // Search/Filter Fields
  searchable_text?: string
  filter_attributes?: Record<string, any>
  is_featured: boolean
  is_bestseller: boolean
  is_new: boolean
  comparable_products?: string[]

  // B2B Fields
  b2b_min_quantity?: number
  b2b_pricing_tiers?: Array<{
    qty_min: number
    qty_max: number | null
    price: number
    discount_percentage?: number
  }>
  b2b_discount_percentage?: number
  b2b_lead_time_days?: number
  b2b_bulk_discount_available: boolean
  requires_quote: boolean

  // Supplier/Stock Fields
  supplier_ids?: string[]
  stock_level: number
  stock_reserved: number
  stock_available: number
  stock_warehouse_locations?: Array<{
    warehouse_id: string
    location: string
    quantity: number
  }>
  reorder_point?: number
  supplier_lead_time?: number

  created_at: Date
  updated_at: Date
}

export interface UpdateProductExtendedDTO extends Partial<ProductExtended> {}
