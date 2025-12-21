import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const REMOTE_API_KEY = 'omex_supplier_sync_2024_secret'

const STORE_API_URLS: Record<string, string> = {
  'OMEXPLUS': 'https://omexplus.pl/api/supplier-feed.php',
  'KOLAIWALKI': 'https://kolaiwalki.pl/api/supplier-feed.php',
}

/**
 * POST /admin/suppliers/:id/sync
 * Synchronizuje produkty z WooCommerce do tabeli supplier_product
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params

    const supplier = await knex("supplier").where("id", id).first()
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    if (!supplier.sync_enabled) {
      return res.status(400).json({ message: "Sync disabled" })
    }

    // Get API URL
    const remoteUrl = STORE_API_URLS[supplier.code?.toUpperCase()]
    const apiUrl = remoteUrl ? `${remoteUrl}?key=${REMOTE_API_KEY}` : supplier.api_url

    if (!apiUrl) {
      return res.status(400).json({ message: "No API URL" })
    }

    console.log(`🔄 Sync: ${supplier.name}`)

    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error(`API: ${response.status}`)

    const catalog = await response.json()
    let items = catalog.products || catalog.items || catalog.data || catalog
    if (!Array.isArray(items)) items = []

    console.log(`📦 ${items.length} products`)

    let created = 0, updated = 0

    for (const item of items) {
      const sku = item.sku || item.code || String(item.id)
      const price = Math.round((item.price || 0) * 100)
      const stock = item.stock || item.quantity || 0

      const existing = await knex("supplier_product")
        .where("supplier_id", id)
        .where("supplier_sku", sku)
        .first()

      if (existing) {
        await knex("supplier_product").where("id", existing.id).update({
          supplier_price: price,
          supplier_stock: stock,
          last_sync_at: new Date(),
          updated_at: new Date(),
        })
        updated++
      } else {
        await knex("supplier_product").insert({
          id: `sp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          supplier_id: id,
          supplier_sku: sku,
          supplier_price: price,
          supplier_stock: stock,
          supplier_currency: "PLN",
          markup_type: "percentage",
          markup_value: supplier.commission_rate || 20,
          is_active: supplier.show_in_store || false,
          sync_status: "synced",
          last_sync_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        })
        created++
      }
    }

    // Update supplier count
    const count = await knex("supplier_product").where("supplier_id", id).count("id as c").first()
    await knex("supplier").where("id", id).update({
      products_count: parseInt(String(count?.c || 0)),
      last_sync_at: new Date(),
    })

    console.log(`✅ Created: ${created}, Updated: ${updated}`)

    res.json({ success: true, created, updated, total: created + updated })
  } catch (error: any) {
    console.error("Sync error:", error)
    res.status(500).json({ message: error.message })
  }
}
