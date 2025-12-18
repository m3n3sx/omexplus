export interface Manufacturer {
  id: string
  name: string
  name_en?: string
  name_de?: string
  slug: string
  logo_url?: string
  website_url?: string
  description?: string
  country?: string
  contact_email?: string
  contact_phone?: string
  catalog_pdf_url?: string
  catalog_updated_at?: Date
  api_endpoint?: string
  api_key?: string
  is_active: boolean
  sync_frequency?: "daily" | "weekly" | "monthly"
  last_sync_at?: Date
  products_count: number
  created_at: Date
  updated_at: Date
}

export interface ManufacturerPart {
  id: string
  manufacturer_id: string
  product_id: string
  manufacturer_sku: string
  manufacturer_name?: string
  part_number?: string
  alternative_names?: string[]
  catalog_page?: number
  catalog_url?: string
  technical_doc_url?: string
  datasheet_json?: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface CreateManufacturerDTO {
  name: string
  name_en?: string
  name_de?: string
  slug: string
  logo_url?: string
  website_url?: string
  description?: string
  country?: string
  contact_email?: string
  contact_phone?: string
  catalog_pdf_url?: string
  api_endpoint?: string
  api_key?: string
  sync_frequency?: "daily" | "weekly" | "monthly"
}

export interface UpdateManufacturerDTO extends Partial<CreateManufacturerDTO> {}
