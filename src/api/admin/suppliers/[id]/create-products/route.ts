import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * POST /admin/suppliers/:id/create-products
 * 
 * Tworzy produkty Medusa z produktów dostawcy
 * Body: { product_ids?: string[], all?: boolean }
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params
    const { product_ids, all = false } = req.body as any

    const supplier = await knex("supplier").where("id", id).first()
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    // Get supplier products to create
    let query = knex("supplier_product")
      .where("supplier_id", id)
      .whereNull("product_id") // Only those not yet linked

    if (!all && product_ids?.length) {
      query = query.whereIn("id", product_ids)
    }

    const supplierProducts = await query.limit(100) // Max 100 at a time

    if (supplierProducts.length === 0) {
      return res.json({ success: true, created: 0, message: "Brak produktów do utworzenia" })
    }

    const salesChannel = await knex("sales_channel").first()
    let created = 0, errors = 0

    for (const sp of supplierProducts) {
      try {
        const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
        const variantId = `variant_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
        const handle = `${supplier.code.toLowerCase()}-${sp.supplier_sku}`.toLowerCase().replace(/[^a-z0-9-]/g, '-')

        // Calculate price with markup
        let sellingPrice = sp.supplier_price
        if (sp.markup_type === "percentage") {
          sellingPrice = Math.round(sp.supplier_price * (1 + (sp.markup_value || 20) / 100))
        } else {
          sellingPrice = sp.supplier_price + Math.round((sp.markup_value || 0) * 100)
        }

        // Create product
        await knex("product").insert({
          id: productId,
          title: sp.supplier_sku,
          handle,
          status: "published",
          is_giftcard: false,
          discountable: true,
          metadata: JSON.stringify({
            supplier_id: supplier.id,
            supplier_code: supplier.code,
            supplier_sku: sp.supplier_sku,
            supplier_product_id: sp.id,
          }),
          created_at: new Date(),
          updated_at: new Date(),
        })

        // Create variant
        await knex("product_variant").insert({
          id: variantId,
          product_id: productId,
          title: "Default",
          sku: `${supplier.code}-${sp.supplier_sku}`,
          manage_inventory: true,
          allow_backorder: false,
          created_at: new Date(),
          updated_at: new Date(),
        })

        // Create price set and price
        const priceSetId = `pset_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
        await knex("price_set").insert({
          id: priceSetId,
          created_at: new Date(),
          updated_at: new Date(),
        })

        await knex("price").insert({
          id: `price_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          price_set_id: priceSetId,
          currency_code: "pln",
          amount: sellingPrice,
          raw_amount: JSON.stringify({ value: String(sellingPrice), precision: 20 }),
          created_at: new Date(),
          updated_at: new Date(),
        })

        await knex("product_variant_price_set").insert({
          id: `pvps_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          variant_id: variantId,
          price_set_id: priceSetId,
          created_at: new Date(),
          updated_at: new Date(),
        })

        // Link to sales channel
        if (salesChannel) {
          await knex("product_sales_channel").insert({
            id: `psc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            product_id: productId,
            sales_channel_id: salesChannel.id,
            created_at: new Date(),
            updated_at: new Date(),
          }).onConflict().ignore()
        }

        // Update supplier_product with link
        await knex("supplier_product").where("id", sp.id).update({
          product_id: productId,
          selling_price: sellingPrice,
          is_active: true,
          updated_at: new Date(),
        })

        created++
      } catch (e: any) {
        console.error(`Error creating product ${sp.supplier_sku}:`, e.message)
        errors++
      }
    }

    res.json({
      success: true,
      created,
      errors,
      message: `Utworzono ${created} produktów w sklepie`,
    })
  } catch (error: any) {
    console.error("Create products error:", error)
    res.status(500).json({ message: error.message })
  }
}
