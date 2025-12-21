/**
 * Direct WooCommerce MySQL Sync
 * 
 * Bezpośrednia synchronizacja produktów z bazy MySQL WooCommerce
 * dla sklepów na tym samym serwerze (omexplus.pl, kolaiwalki.pl)
 */

import mysql from 'mysql2/promise'

interface WooDBConfig {
  host: string
  user: string
  password: string
  database: string
  tablePrefix: string
}

interface WooProduct {
  id: number
  sku: string
  name: string
  price: number
  regular_price: number
  sale_price: number | null
  stock_quantity: number
  stock_status: string
  description: string
  short_description: string
  thumbnail: string | null
  categories: string[]
}

export class DirectWooSync {
  private config: WooDBConfig

  constructor(config: WooDBConfig) {
    this.config = config
  }

  private async getConnection() {
    return mysql.createConnection({
      host: this.config.host,
      user: this.config.user,
      password: this.config.password,
      database: this.config.database,
    })
  }

  async getProductCount(): Promise<number> {
    const conn = await this.getConnection()
    try {
      const [rows] = await conn.execute(`
        SELECT COUNT(*) as count 
        FROM ${this.config.tablePrefix}posts 
        WHERE post_type = 'product' 
        AND post_status = 'publish'
      `)
      return (rows as any)[0].count
    } finally {
      await conn.end()
    }
  }

  async getProducts(limit = 100, offset = 0): Promise<WooProduct[]> {
    const conn = await this.getConnection()
    const prefix = this.config.tablePrefix

    try {
      // Get products with their meta data
      const [products] = await conn.execute(`
        SELECT 
          p.ID as id,
          p.post_title as name,
          p.post_content as description,
          p.post_excerpt as short_description,
          MAX(CASE WHEN pm.meta_key = '_sku' THEN pm.meta_value END) as sku,
          MAX(CASE WHEN pm.meta_key = '_price' THEN pm.meta_value END) as price,
          MAX(CASE WHEN pm.meta_key = '_regular_price' THEN pm.meta_value END) as regular_price,
          MAX(CASE WHEN pm.meta_key = '_sale_price' THEN pm.meta_value END) as sale_price,
          MAX(CASE WHEN pm.meta_key = '_stock' THEN pm.meta_value END) as stock_quantity,
          MAX(CASE WHEN pm.meta_key = '_stock_status' THEN pm.meta_value END) as stock_status,
          MAX(CASE WHEN pm.meta_key = '_thumbnail_id' THEN pm.meta_value END) as thumbnail_id
        FROM ${prefix}posts p
        LEFT JOIN ${prefix}postmeta pm ON p.ID = pm.post_id
        WHERE p.post_type = 'product' 
        AND p.post_status = 'publish'
        GROUP BY p.ID
        ORDER BY p.ID
        LIMIT ? OFFSET ?
      `, [limit, offset])

      // Get thumbnail URLs
      const productList = products as any[]
      for (const product of productList) {
        if (product.thumbnail_id) {
          const [thumbRows] = await conn.execute(`
            SELECT meta_value as url 
            FROM ${prefix}postmeta 
            WHERE post_id = ? AND meta_key = '_wp_attached_file'
          `, [product.thumbnail_id])
          
          if ((thumbRows as any[]).length > 0) {
            product.thumbnail = `https://${this.config.database.replace('sql_', '').replace('_p', '.pl')}/wp-content/uploads/${(thumbRows as any)[0].url}`
          }
        }
      }

      return productList.map(p => ({
        id: p.id,
        sku: p.sku || `WOO-${p.id}`,
        name: p.name,
        price: parseFloat(p.price) || 0,
        regular_price: parseFloat(p.regular_price) || 0,
        sale_price: p.sale_price ? parseFloat(p.sale_price) : null,
        stock_quantity: parseInt(p.stock_quantity) || 0,
        stock_status: p.stock_status || 'instock',
        description: p.description || '',
        short_description: p.short_description || '',
        thumbnail: p.thumbnail || null,
        categories: [],
      }))
    } finally {
      await conn.end()
    }
  }

  async getAllProducts(): Promise<WooProduct[]> {
    const total = await this.getProductCount()
    const allProducts: WooProduct[] = []
    const batchSize = 100

    for (let offset = 0; offset < total; offset += batchSize) {
      const batch = await this.getProducts(batchSize, offset)
      allProducts.push(...batch)
      console.log(`  Loaded ${allProducts.length}/${total} products...`)
    }

    return allProducts
  }

  async testConnection(): Promise<{ success: boolean; message: string; productCount?: number }> {
    try {
      const count = await this.getProductCount()
      return {
        success: true,
        message: 'Połączenie z bazą MySQL udane',
        productCount: count,
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Błąd połączenia: ${error.message}`,
      }
    }
  }
}

// Pre-configured for OMEX stores
export const OMEX_STORES: Record<string, WooDBConfig> = {
  omexplus: {
    host: 'localhost',
    user: 'sql_omexplus_pl',
    password: '7d66ba884ae428',
    database: 'sql_omexplus_pl',
    tablePrefix: 'wp_',
  },
  kolaiwalki: {
    host: 'localhost',
    user: 'sql_kolaiwalki_p',
    password: '', // Need to get this
    database: 'sql_kolaiwalki_p',
    tablePrefix: 'wp_0b5b0b_',
  },
}

export function createOmexPlusSync(): DirectWooSync {
  return new DirectWooSync(OMEX_STORES.omexplus)
}

export function createKolaiWalkiSync(password: string): DirectWooSync {
  return new DirectWooSync({
    ...OMEX_STORES.kolaiwalki,
    password,
  })
}
