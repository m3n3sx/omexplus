import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /admin/suppliers - Lista dostawców
 * POST /admin/suppliers - Utwórz dostawcę
 */

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    
    const { 
      is_active, 
      is_dropship, 
      q,
      limit = 50, 
      offset = 0 
    } = req.query

    let query = knex("supplier").select("*")

    if (is_active !== undefined) {
      query = query.where("is_active", is_active === "true")
    }

    if (is_dropship !== undefined) {
      query = query.where("is_dropship", is_dropship === "true")
    }

    if (q) {
      query = query.where(function() {
        this.where("name", "ilike", `%${q}%`)
          .orWhere("code", "ilike", `%${q}%`)
          .orWhere("contact_email", "ilike", `%${q}%`)
      })
    }

    // Get count separately
    const countQuery = knex("supplier").count("id as count")
    if (is_active !== undefined) {
      countQuery.where("is_active", is_active === "true")
    }
    if (is_dropship !== undefined) {
      countQuery.where("is_dropship", is_dropship === "true")
    }
    if (q) {
      countQuery.where(function() {
        this.where("name", "ilike", `%${q}%`)
          .orWhere("code", "ilike", `%${q}%`)
          .orWhere("contact_email", "ilike", `%${q}%`)
      })
    }
    const countResult = await countQuery.first()
    const count = parseInt(String(countResult?.count || 0))

    const suppliers = await query
      .orderBy("created_at", "desc")
      .limit(Number(limit))
      .offset(Number(offset))

    res.json({
      suppliers,
      count,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    console.error("Error listing suppliers:", error)
    res.status(500).json({ message: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const data = req.body as any

    if (!data.name || !data.code) {
      return res.status(400).json({ message: "Name and code are required" })
    }

    // Check if code already exists
    const existing = await knex("supplier").where("code", data.code.toUpperCase()).first()
    if (existing) {
      return res.status(400).json({ message: `Supplier with code "${data.code}" already exists` })
    }

    const id = `sup_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    const stockLocationId = `sloc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    // Create stock location (warehouse) for the supplier
    let createdStockLocation = null
    if (data.is_dropship !== false) {
      try {
        // Create stock location address if supplier has address
        let addressId = null
        if (data.address_line_1 || data.city) {
          addressId = `sladdr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
          await knex("stock_location_address").insert({
            id: addressId,
            address_1: data.address_line_1 || null,
            address_2: data.address_line_2 || null,
            city: data.city || null,
            postal_code: data.postal_code || null,
            country_code: data.country_code || "PL",
            phone: data.contact_phone || null,
            created_at: new Date(),
            updated_at: new Date(),
          })
        }

        // Create stock location
        await knex("stock_location").insert({
          id: stockLocationId,
          name: `Magazyn: ${data.name}`,
          address_id: addressId,
          metadata: JSON.stringify({ supplier_id: id, type: "dropship" }),
          created_at: new Date(),
          updated_at: new Date(),
        })

        createdStockLocation = { id: stockLocationId, name: `Magazyn: ${data.name}` }
        console.log(`✅ Created stock location for supplier: ${data.name}`)
      } catch (stockError: any) {
        console.error("Error creating stock location:", stockError.message)
        // Continue without stock location - not critical
      }
    }

    const supplier = {
      id,
      name: data.name,
      code: data.code.toUpperCase(),
      contact_name: data.contact_name || null,
      contact_email: data.contact_email || null,
      contact_phone: data.contact_phone || null,
      address_line_1: data.address_line_1 || null,
      address_line_2: data.address_line_2 || null,
      city: data.city || null,
      postal_code: data.postal_code || null,
      country_code: data.country_code || "PL",
      api_url: data.api_url || null,
      api_key: data.api_key || null,
      api_format: data.api_format || "json",
      sync_enabled: data.sync_enabled || false,
      sync_frequency: data.sync_frequency || "manual",
      commission_rate: data.commission_rate || null,
      min_order_value: data.min_order_value || null,
      lead_time_days: data.lead_time_days || 3,
      shipping_method: data.shipping_method || null,
      stock_location_id: createdStockLocation ? stockLocationId : null,
      is_active: true,
      is_dropship: data.is_dropship !== false,
      products_count: 0,
      orders_count: 0,
      total_revenue: 0,
      notes: data.notes || null,
      metadata: JSON.stringify(data.metadata || {}),
      created_at: new Date(),
      updated_at: new Date(),
    }

    await knex("supplier").insert(supplier)

    res.status(201).json({ 
      supplier,
      stock_location: createdStockLocation,
    })
  } catch (error: any) {
    console.error("Error creating supplier:", error)
    res.status(500).json({ message: error.message })
  }
}
