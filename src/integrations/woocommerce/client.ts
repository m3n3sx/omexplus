/**
 * WooCommerce API Client
 * 
 * Klient do pobierania produktów ze sklepów WooCommerce (omexplus.pl, kolaiwalki.pl)
 */

import crypto from 'crypto'

interface WooCommerceConfig {
  url: string
  consumerKey: string
  consumerSecret: string
}

interface WooProduct {
  id: number
  name: string
  slug: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  stock_quantity: number | null
  stock_status: string
  description: string
  short_description: string
  categories: { id: number; name: string; slug: string }[]
  images: { id: number; src: string; alt: string }[]
  attributes: { name: string; options: string[] }[]
  meta_data: { key: string; value: any }[]
}

export class WooCommerceClient {
  private config: WooCommerceConfig

  constructor(config: WooCommerceConfig) {
    this.config = config
  }

  private generateOAuthSignature(method: string, url: string, params: Record<string, string>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')

    const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`
    const signingKey = `${encodeURIComponent(this.config.consumerSecret)}&`

    return crypto
      .createHmac('sha256', signingKey)
      .update(baseString)
      .digest('base64')
  }

  private buildAuthUrl(endpoint: string, params: Record<string, string> = {}): string {
    const url = `${this.config.url}/wp-json/wc/v3/${endpoint}`
    
    // For HTTPS, use query string authentication
    const authParams = new URLSearchParams({
      ...params,
      consumer_key: this.config.consumerKey,
      consumer_secret: this.config.consumerSecret,
    })

    return `${url}?${authParams.toString()}`
  }

  async getProducts(page = 1, perPage = 100): Promise<{ products: WooProduct[]; total: number; totalPages: number }> {
    const url = this.buildAuthUrl('products', {
      page: page.toString(),
      per_page: perPage.toString(),
      status: 'publish',
    })

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`)
    }

    const products = await response.json()
    const total = parseInt(response.headers.get('X-WP-Total') || '0')
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1')

    return { products, total, totalPages }
  }

  async getAllProducts(): Promise<WooProduct[]> {
    const allProducts: WooProduct[] = []
    let page = 1
    let totalPages = 1

    do {
      const { products, totalPages: pages } = await this.getProducts(page, 100)
      allProducts.push(...products)
      totalPages = pages
      page++
      
      // Rate limiting - wait 500ms between requests
      await new Promise(resolve => setTimeout(resolve, 500))
    } while (page <= totalPages)

    return allProducts
  }

  async getProduct(id: number): Promise<WooProduct> {
    const url = this.buildAuthUrl(`products/${id}`)
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`)
    }

    return response.json()
  }

  async getProductBySku(sku: string): Promise<WooProduct | null> {
    const url = this.buildAuthUrl('products', { sku })
    const response = await fetch(url)
    
    if (!response.ok) {
      return null
    }

    const products = await response.json()
    return products.length > 0 ? products[0] : null
  }

  async getCategories(): Promise<any[]> {
    const url = this.buildAuthUrl('products/categories', { per_page: '100' })
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`)
    }

    return response.json()
  }

  async testConnection(): Promise<{ success: boolean; message: string; productCount?: number }> {
    try {
      const { total } = await this.getProducts(1, 1)
      return {
        success: true,
        message: 'Połączenie udane',
        productCount: total,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Błąd połączenia',
      }
    }
  }
}

// Pre-configured clients for OMEX stores
export function createOmexPlusClient(consumerKey: string, consumerSecret: string): WooCommerceClient {
  return new WooCommerceClient({
    url: 'https://omexplus.pl',
    consumerKey,
    consumerSecret,
  })
}

export function createKolaiWalkiClient(consumerKey: string, consumerSecret: string): WooCommerceClient {
  return new WooCommerceClient({
    url: 'https://kolaiwalki.pl',
    consumerKey,
    consumerSecret,
  })
}
