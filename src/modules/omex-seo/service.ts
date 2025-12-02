import { MedusaService } from "@medusajs/framework/utils"

interface SEOMetaTags {
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]
  og_title?: string
  og_description?: string
  og_image?: string
  canonical_url?: string
}

interface StructuredDataProduct {
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
}

class SEOService extends MedusaService({}) {
  private readonly BASE_URL = process.env.STORE_URL || "https://omex.pl"

  /**
   * Generate SEO meta tags for a product
   */
  async generateMetaTags(product: any): Promise<SEOMetaTags> {
    const title = this.truncate(product.title || product.name, 60)
    const description = this.truncate(product.description || "", 160)

    return {
      meta_title: `${title} | OMEX`,
      meta_description: description,
      meta_keywords: this.extractKeywords(product),
      og_title: title,
      og_description: description,
      og_image: product.thumbnail || product.image_url,
      canonical_url: this.generateCanonicalUrl(product),
    }
  }

  /**
   * Generate canonical URL for a product
   */
  generateCanonicalUrl(product: any): string {
    const slug = product.slug || this.slugify(product.title || product.name)
    const category = product.category_slug || "produkty"
    
    return `${this.BASE_URL}/${category}/${slug}`
  }

  /**
   * Generate structured data (JSON-LD) for Google Rich Snippets
   */
  generateStructuredData(product: any): StructuredDataProduct {
    const structuredData: StructuredDataProduct = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title || product.name,
      description: product.description,
      image: product.thumbnail || product.image_url,
      sku: product.sku,
    }

    // Add brand if available
    if (product.manufacturer_name || product.brand) {
      structuredData.brand = {
        "@type": "Brand",
        name: product.manufacturer_name || product.brand,
      }
    }

    // Add offers (price)
    if (product.price !== undefined) {
      structuredData.offers = {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "PLN",
        availability: product.stock_available > 0 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock",
        url: this.generateCanonicalUrl(product),
      }
    }

    return structuredData
  }

  /**
   * Validate meta tags
   */
  validateMetaTags(metaTags: SEOMetaTags): { valid: boolean; warnings: string[] } {
    const warnings: string[] = []

    if (!metaTags.meta_title) {
      warnings.push("Missing meta_title")
    } else if (metaTags.meta_title.length > 60) {
      warnings.push(`meta_title too long (${metaTags.meta_title.length} chars, max 60)`)
    }

    if (!metaTags.meta_description) {
      warnings.push("Missing meta_description")
    } else if (metaTags.meta_description.length > 160) {
      warnings.push(`meta_description too long (${metaTags.meta_description.length} chars, max 160)`)
    }

    if (!metaTags.canonical_url) {
      warnings.push("Missing canonical_url")
    }

    if (!metaTags.og_title) {
      warnings.push("Missing og_title (Open Graph)")
    }

    if (!metaTags.og_description) {
      warnings.push("Missing og_description (Open Graph)")
    }

    if (!metaTags.og_image) {
      warnings.push("Missing og_image (Open Graph)")
    }

    return {
      valid: warnings.length === 0,
      warnings,
    }
  }

  /**
   * Generate sitemap.xml for all products
   */
  async generateSitemap(options: { includeCategories?: boolean; includeManufacturers?: boolean } = {}) {
    const { includeCategories = true, includeManufacturers = true } = options

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    // Add homepage
    sitemap += this.generateSitemapUrl(this.BASE_URL, new Date(), "daily", "1.0")

    // Add products
    // In real implementation, fetch all products from database
    const products: any[] = [] // Would be populated from query
    for (const product of products) {
      const url = this.generateCanonicalUrl(product)
      sitemap += this.generateSitemapUrl(url, product.updated_at, "weekly", "0.8")
    }

    // Add categories
    if (includeCategories) {
      const categories: any[] = [] // Would be populated from query
      for (const category of categories) {
        const url = `${this.BASE_URL}/kategoria/${category.slug}`
        sitemap += this.generateSitemapUrl(url, category.updated_at, "weekly", "0.7")
      }
    }

    // Add manufacturers
    if (includeManufacturers) {
      const manufacturers: any[] = [] // Would be populated from query
      for (const manufacturer of manufacturers) {
        const url = `${this.BASE_URL}/producent/${manufacturer.slug}`
        sitemap += this.generateSitemapUrl(url, manufacturer.updated_at, "monthly", "0.6")
      }
    }

    sitemap += '</urlset>'

    return sitemap
  }

  /**
   * Generate robots.txt
   */
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /account/

Sitemap: ${this.BASE_URL}/sitemap.xml
`
  }

  /**
   * Update SEO fields for a product
   */
  async updateProductSEO(productId: string, seoData: SEOMetaTags) {
    if (!productId) {
      throw new Error("Product ID is required")
    }

    // Validate meta tags
    const validation = this.validateMetaTags(seoData)
    if (!validation.valid) {
      console.warn("SEO validation warnings:", validation.warnings)
    }

    // In real implementation, update product in database
    return {
      product_id: productId,
      ...seoData,
      updated_at: new Date(),
    }
  }

  /**
   * Auto-generate SEO fields for products without them
   */
  async autoGenerateSEO(productId: string) {
    if (!productId) {
      throw new Error("Product ID is required")
    }

    // In real implementation, fetch product from database
    const product: any = {} // Would be populated from query

    const metaTags = await this.generateMetaTags(product)
    const structuredData = this.generateStructuredData(product)

    return this.updateProductSEO(productId, {
      ...metaTags,
      structured_data: structuredData as any,
    })
  }

  // Helper methods

  private truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text
    }
    return text.substring(0, maxLength - 3) + "..."
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  private extractKeywords(product: any): string[] {
    const keywords: string[] = []

    if (product.title) {
      keywords.push(...product.title.split(/\s+/).filter((w: string) => w.length > 3))
    }

    if (product.category_name) {
      keywords.push(product.category_name)
    }

    if (product.manufacturer_name) {
      keywords.push(product.manufacturer_name)
    }

    if (product.equipment_type) {
      keywords.push(product.equipment_type)
    }

    // Remove duplicates and limit to 10
    return [...new Set(keywords)].slice(0, 10)
  }

  private generateSitemapUrl(
    url: string,
    lastmod: Date,
    changefreq: string,
    priority: string
  ): string {
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod.toISOString().split("T")[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>\n`
  }
}

export default SEOService
