export interface ProductImportRow {
  sku: string
  name_pl: string
  name_en: string
  name_de: string
  desc_pl: string
  desc_en: string
  desc_de: string
  price: string
  cost: string
  category_id: string
  equipment_type: string
  min_order_qty: string
  technical_specs_json: string
}

export interface ImportError {
  line: number
  field: string
  reason: string
  value?: any
}

export interface ImportProgress {
  status: 'processing' | 'completed' | 'failed'
  total: number
  successful: number
  failed: number
  errors: ImportError[]
  duration_ms?: number
  current_line?: number
}

export interface ValidationResult {
  valid: boolean
  errors: ImportError[]
}

export interface ProcessedProduct {
  sku: string
  title: string
  description: string
  price: number
  cost: number
  category_id: string
  equipment_type: string
  min_order_qty: number
  technical_specs: any
  translations: {
    pl: { title: string; description: string }
    en: { title: string; description: string }
    de: { title: string; description: string }
  }
}
