import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /admin/suppliers/:id/woocommerce - Test WooCommerce connection
 * POST /admin/suppliers/:id/woocommerce - Configure WooCommerce credentials
 */

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params

    const supplier = await knex("supplier").where("id", id).first()
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    let metadata: any = {}
    if (supplier.metadata) {
      metadata = typeof supplier.metadata === 'string' 
        ? JSON.parse(supplier.metadata) 
        : supplier.metadata
    }

    if (!metadata.woo_consumer_key || !metadata.woo_consumer_secret) {
      return res.json({
        configured: false,
        message: "WooCommerce credentials not configured",
      })
    }

    // Test connection
    try {
      const baseUrl = supplier.api_url?.replace('/wp-json/wc/v3', '').replace('/api/products', '') || ''
      const testUrl = `${baseUrl}/wp-json/wc/v3/products?per_page=1&consumer_key=${metadata.woo_consumer_key}&consumer_secret=${metadata.woo_consumer_secret}`
      
      const response = await fetch(testUrl)
      
      if (response.ok) {
        const total = response.headers.get('X-WP-Total')
        return res.json({
          configured: true,
          connected: true,
          message: "Connection successful",
          products_count: parseInt(total || '0'),
        })
      } else {
        return res.json({
          configured: true,
          connected: false,
          message: `API error: ${response.status} ${response.statusText}`,
        })
      }
    } catch (fetchError: any) {
      return res.json({
        configured: true,
        connected: false,
        message: `Connection error: ${fetchError.message}`,
      })
    }
  } catch (error: any) {
    console.error("Error testing WooCommerce:", error)
    res.status(500).json({ message: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params
    const { consumer_key, consumer_secret, store_url } = req.body as any

    if (!consumer_key || !consumer_secret) {
      return res.status(400).json({ 
        message: "consumer_key and consumer_secret are required" 
      })
    }

    const supplier = await knex("supplier").where("id", id).first()
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    // Parse existing metadata
    let metadata: any = {}
    if (supplier.metadata) {
      metadata = typeof supplier.metadata === 'string' 
        ? JSON.parse(supplier.metadata) 
        : supplier.metadata
    }

    // Update metadata with WooCommerce credentials
    metadata.woo_consumer_key = consumer_key
    metadata.woo_consumer_secret = consumer_secret
    metadata.woo_configured_at = new Date().toISOString()

    // Update supplier
    const updateData: any = {
      metadata: JSON.stringify(metadata),
      api_key: `${consumer_key}:${consumer_secret}`, // Store for order API
      sync_enabled: true,
      updated_at: new Date(),
    }

    if (store_url) {
      updateData.api_url = store_url.replace(/\/$/, '')
    }

    await knex("supplier").where("id", id).update(updateData)

    // Test connection
    const baseUrl = store_url || supplier.api_url?.replace('/wp-json/wc/v3', '') || ''
    const testUrl = `${baseUrl}/wp-json/wc/v3/products?per_page=1&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
    
    try {
      const response = await fetch(testUrl)
      
      if (response.ok) {
        const total = response.headers.get('X-WP-Total')
        return res.json({
          success: true,
          message: "WooCommerce configured and connected",
          products_count: parseInt(total || '0'),
        })
      } else {
        return res.json({
          success: true,
          message: "Credentials saved but connection test failed",
          error: `API returned ${response.status}`,
        })
      }
    } catch (fetchError: any) {
      return res.json({
        success: true,
        message: "Credentials saved but connection test failed",
        error: fetchError.message,
      })
    }
  } catch (error: any) {
    console.error("Error configuring WooCommerce:", error)
    res.status(500).json({ message: error.message })
  }
}
