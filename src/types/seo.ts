export interface SEOMetaTags {
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]
  og_title?: string
  og_description?: string
  og_image?: string
  canonical_url?: string
}

export interface StructuredDataProduct {
  "@context": string
  "@type": string
  name: string
  description?: string
  image?: string
  sku?: string
  brand?: {
    "@type": string
    name: string
  }
  offers?: {
    "@type": string
    price: number
    priceCurrency: string
    availability: string
    url?: string
  }
  aggregateRating?: {
    "@type": string
    ratingValue: number
    reviewCount: number
  }
}

export interface ProductSEO {
  product_id: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]
  slug?: string
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  schema_type?: string
  structured_data?: StructuredDataProduct
}

export interface SEOValidation {
  valid: boolean
  warnings: string[]
}
