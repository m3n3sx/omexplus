/**
 * WooCommerce Sync Service
 * 
 * Synchronizuje produkty z WooCommerce do systemu dropshipping OMEX
 */

import { WooCommerceClient } from './client'

interface SyncResult {
  supplier_id: string
  synced_at: Date
  products_total: number
  products_created: number
  products_updated: number
  products_skipped: number
  errors: number
  error_details: string[]
}

interface SupplierConfig {
  id: string
  name: string
  code: string
  woo_url: string
  woo_consumer_key: string
  woo_consumer_secret: string
  default_markup: number
  default_markup_type: 'percentage' | 'fixed'
}

export class WooCommerceSyncService {
  private knex: any

  constructor(knex: any) {
    this.knex = knex
  }

  async syncSupplier(supplierId: string): Promise<SyncResult> {
    const result: SyncResult = {
      supplier_id: supplierId,
      synced_at: new Date(),
      products_total: 0,
      products_created: 0,
      products_updated: 0,
      products_skipped: 0,
      errors: 0,
      error_details: [],
    }

    try {
      // Get supplier config
      const supplier = await this.knex('supplier').where('id', supplierId).first()
      
      if (!supplier) {
        throw new Error(`Supplier ${supplierId} not found`)
      }

      // Parse WooCommerce credentials from metadata
      let metadata: any = {}
      if (supplier.metadata) {
        metadata = typeof supplier.metadata === 'string' 
          ? JSON.parse(supplier.metadata) 
          : supplier.metadata
      }

      if (!metadata.woo_consumer_key || !metadata.woo_consumer_secret) {
        throw new Error('WooCommerce API credentials not configured')
      }

      const client = new WooCommerceClient({
        url: supplier.api_url.replace('/api/products', '').replace('/wp-json/wc/v3', ''),
        consumerKey: metadata.woo_consumer_key,
        consumerSecret: metadata.woo_consumer_secret,
      })

      console.log(`🔄 Syncing products from ${supplier.name}...`)

      // Test connection first
      const testResult = await client.testConnection()
      if (!testResult.success) {
        throw new Error(`Connection failed: ${testResult.message}`)
      }

      console.log(`📦 Found ${testResult.productCount} products`)
      result.products_total = testResult.productCount || 0

      // Get all products
      const products = await client.getAllProducts()

      for (const wooProduct of products) {
        try {
          // Skip products without SKU
          if (!wooProduct.sku) {
            result.products_skipped++
            continue
          }

          // Check if product already exists
          const existing = await this.knex('supplier_product')
            .where('supplier_id', supplierId)
            .where('supplier_sku', wooProduct.sku)
            .first()

          const price = parseFloat(wooProduct.price || wooProduct.regular_price || '0')
          const stock = wooProduct.stock_quantity || (wooProduct.stock_status === 'instock' ? 100 : 0)

          if (existing) {
            // Update existing
            await this.knex('supplier_product')
              .where('id', existing.id)
              .update({
                supplier_price: Math.round(price * 100),
                supplier_stock: stock,
                last_sync_at: new Date(),
                sync_status: 'synced',
                updated_at: new Date(),
              })
            result.products_updated++
          } else {
            // Create new
            const spId = `sp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
            
            await this.knex('supplier_product').insert({
              id: spId,
              supplier_id: supplierId,
              product_id: null, // Will be linked manually
              supplier_sku: wooProduct.sku,
              supplier_price: Math.round(price * 100),
              supplier_currency: 'PLN',
              supplier_stock: stock,
              markup_type: 'percentage',
              markup_value: supplier.commission_rate || 20,
              is_active: false, // Inactive until linked
              sync_status: 'synced',
              last_sync_at: new Date(),
              created_at: new Date(),
              updated_at: new Date(),
            })
            result.products_created++
          }
        } catch (productError: any) {
          result.errors++
          result.error_details.push(`SKU ${wooProduct.sku}: ${productError.message}`)
        }
      }

      // Update supplier last_sync_at and products_count
      const productsCount = await this.knex('supplier_product')
        .where('supplier_id', supplierId)
        .count('id as count')
        .first()

      await this.knex('supplier')
        .where('id', supplierId)
        .update({
          last_sync_at: new Date(),
          products_count: parseInt(productsCount?.count || '0'),
          updated_at: new Date(),
        })

      console.log(`✅ Sync completed: ${result.products_created} created, ${result.products_updated} updated, ${result.errors} errors`)

    } catch (error: any) {
      console.error(`❌ Sync failed:`, error.message)
      result.errors++
      result.error_details.push(error.message)
    }

    return result
  }

  async importProductToMedusa(
    supplierProductId: string, 
    medusaProductId: string,
    options?: {
      updatePrice?: boolean
      updateStock?: boolean
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const supplierProduct = await this.knex('supplier_product')
        .where('id', supplierProductId)
        .first()

      if (!supplierProduct) {
        return { success: false, message: 'Supplier product not found' }
      }

      // Link supplier product to Medusa product
      await this.knex('supplier_product')
        .where('id', supplierProductId)
        .update({
          product_id: medusaProductId,
          is_active: true,
          updated_at: new Date(),
        })

      // Optionally update Medusa product price/stock
      if (options?.updatePrice || options?.updateStock) {
        // This would require Medusa service integration
        // For now, just mark as linked
      }

      return { success: true, message: 'Product linked successfully' }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }
}
