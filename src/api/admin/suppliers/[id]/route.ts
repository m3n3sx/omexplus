import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /admin/suppliers/:id - Pobierz dostawcę
 * PUT /admin/suppliers/:id - Aktualizuj dostawcę
 * DELETE /admin/suppliers/:id - Usuń dostawcę
 */

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params

    const supplier = await knex("supplier").where("id", id).first()

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    // Get products count
    const productsCount = await knex("supplier_product")
      .where("supplier_id", id)
      .count("id as count")
      .first()

    // Get orders count
    const ordersCount = await knex("supplier_order")
      .where("supplier_id", id)
      .count("id as count")
      .first()

    res.json({
      supplier: {
        ...supplier,
        products_count: parseInt(productsCount?.count || "0"),
        orders_count: parseInt(ordersCount?.count || "0"),
      },
    })
  } catch (error: any) {
    console.error("Error retrieving supplier:", error)
    res.status(500).json({ message: error.message })
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params
    const data = req.body as any

    const existing = await knex("supplier").where("id", id).first()
    if (!existing) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    // If code is being changed, check for duplicates
    if (data.code && data.code.toUpperCase() !== existing.code) {
      const duplicate = await knex("supplier")
        .where("code", data.code.toUpperCase())
        .whereNot("id", id)
        .first()
      
      if (duplicate) {
        return res.status(400).json({ message: `Supplier with code "${data.code}" already exists` })
      }
    }

    const updateData: any = {
      updated_at: new Date(),
    }

    // Only update provided fields
    const allowedFields = [
      "name", "code", "contact_name", "contact_email", "contact_phone",
      "address_line_1", "address_line_2", "city", "postal_code", "country_code",
      "api_url", "api_key", "api_format", "sync_enabled", "sync_frequency",
      "commission_rate", "min_order_value", "lead_time_days", "shipping_method",
      "stock_location_id", "is_active", "is_dropship", "notes"
    ]

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = field === "code" ? data[field].toUpperCase() : data[field]
      }
    }

    if (data.metadata) {
      updateData.metadata = JSON.stringify(data.metadata)
    }

    await knex("supplier").where("id", id).update(updateData)

    const supplier = await knex("supplier").where("id", id).first()

    res.json({ supplier })
  } catch (error: any) {
    console.error("Error updating supplier:", error)
    res.status(500).json({ message: error.message })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params

    const supplier = await knex("supplier").where("id", id).first()
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    // Check for active products
    const productsCount = await knex("supplier_product")
      .where("supplier_id", id)
      .where("is_active", true)
      .count("id as count")
      .first()

    if (parseInt(productsCount?.count || "0") > 0) {
      return res.status(400).json({ 
        message: "Cannot delete supplier with active products. Deactivate products first." 
      })
    }

    // Check for pending orders
    const pendingOrders = await knex("supplier_order")
      .where("supplier_id", id)
      .whereIn("status", ["pending", "sent", "confirmed"])
      .count("id as count")
      .first()

    if (parseInt(pendingOrders?.count || "0") > 0) {
      return res.status(400).json({ 
        message: "Cannot delete supplier with pending orders." 
      })
    }

    // Delete related records
    await knex("supplier_order").where("supplier_id", id).delete()
    await knex("supplier_product").where("supplier_id", id).delete()
    await knex("supplier").where("id", id).delete()

    res.json({ deleted: true, id })
  } catch (error: any) {
    console.error("Error deleting supplier:", error)
    res.status(500).json({ message: error.message })
  }
}
