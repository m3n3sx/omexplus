/**
 * Public Bulk Update Endpoints
 * 
 * Handles bulk updates for products, prices, and orders
 * Uses /public/ path to bypass admin auth middleware
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * OPTIONS /public/bulk-update
 * Handle CORS preflight
 */
export async function OPTIONS(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.status(204).end()
}

/**
 * POST /public/bulk-update
 * Bulk update products, prices, or orders
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  const body = req.body as { 
    type: "products" | "prices" | "order"
    productIds?: string[]
    updates?: any
    orderId?: string
    email?: string
    metadata?: Record<string, any>
    status?: string
  }

  console.log("=== PUBLIC BULK UPDATE ===")
  console.log("Type:", body.type)
  console.log("Body:", JSON.stringify(body, null, 2))

  try {
    const knex = req.scope.resolve("__pg_connection__")

    // Handle product bulk update
    if (body.type === "products") {
      const { productIds, updates } = body
      
      if (!productIds || productIds.length === 0) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "productIds jest wymagany")
      }

      const setClauses: string[] = []
      const values: any[] = []
      let paramIndex = 1

      if (updates?.status) {
        setClauses.push("status = $" + paramIndex)
        values.push(updates.status)
        paramIndex++
      }

      if (updates?.collection_id) {
        setClauses.push("collection_id = $" + paramIndex)
        values.push(updates.collection_id)
        paramIndex++
      }

      if (setClauses.length === 0) {
        return res.json({ success: false, message: "Brak danych do aktualizacji" })
      }

      setClauses.push("updated_at = NOW()")
      const idPlaceholders = productIds.map((_, i) => "$" + (paramIndex + i)).join(", ")
      values.push(...productIds)

      const updateQuery = 
        "UPDATE product SET " + setClauses.join(", ") + 
        " WHERE id IN (" + idPlaceholders + ") RETURNING id, title, status"

      const result = await knex.raw(updateQuery, values)
      
      return res.json({
        success: true,
        updated: result.rows?.length || 0,
        products: result.rows,
        message: "Zaktualizowano " + (result.rows?.length || 0) + " produktów"
      })
    }

    // Handle price bulk update
    if (body.type === "prices") {
      const priceUpdates = body.updates as Array<{ variantId: string; amount: number; currencyCode: string }>
      
      if (!priceUpdates || priceUpdates.length === 0) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "updates jest wymagany")
      }

      let updatedCount = 0

      for (const update of priceUpdates) {
        const { variantId, amount, currencyCode } = update
        
        const result = await knex.raw(`
          UPDATE price p
          SET amount = $1, updated_at = NOW()
          FROM price_set_money_amount psma
          JOIN product_variant_price_set pvps ON pvps.price_set_id = psma.price_set_id
          WHERE p.id = psma.price_id
          AND pvps.variant_id = $2
          AND p.currency_code = $3
        `, [amount, variantId, currencyCode])

        if (result.rowCount > 0) {
          updatedCount++
        }
      }

      return res.json({
        success: true,
        updated: updatedCount,
        message: "Zaktualizowano " + updatedCount + " cen"
      })
    }

    // Handle order update
    if (body.type === "order") {
      const { orderId, email, metadata, status } = body
      
      if (!orderId) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "orderId jest wymagany")
      }

      const updates: string[] = []
      const values: any[] = []
      let paramIndex = 1

      if (email !== undefined) {
        updates.push("email = $" + paramIndex)
        values.push(email)
        paramIndex++
      }
      
      if (metadata !== undefined) {
        updates.push("metadata = COALESCE(metadata, '{}'::jsonb) || $" + paramIndex + "::jsonb")
        values.push(JSON.stringify(metadata))
        paramIndex++
      }

      if (status !== undefined) {
        const allowedStatuses = ["pending", "completed", "canceled", "archived", "requires_action"]
        if (allowedStatuses.includes(status)) {
          updates.push("status = $" + paramIndex)
          values.push(status)
          paramIndex++
        }
      }

      if (updates.length === 0) {
        return res.json({ success: false, message: "Brak danych do aktualizacji" })
      }

      updates.push("updated_at = NOW()")
      values.push(orderId)

      const updateQuery = 
        'UPDATE "order" SET ' + updates.join(", ") + 
        " WHERE id = $" + paramIndex + 
        " RETURNING id, display_id, status, email, metadata, created_at, updated_at"

      const result = await knex.raw(updateQuery, values)
      
      if (!result.rows || result.rows.length === 0) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Zamówienie nie zostało znalezione")
      }

      return res.json({
        success: true,
        order: result.rows[0],
        message: "Zamówienie zaktualizowane pomyślnie"
      })
    }

    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Nieznany typ: " + body.type)

  } catch (error: any) {
    console.error("Error:", error)
    if (error instanceof MedusaError) {
      throw error
    }
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Błąd: " + error.message)
  }
}

/**
 * GET /public/bulk-update
 * Health check
 */
export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  res.json({ 
    status: "ok", 
    message: "Public bulk update endpoint is active",
    types: ["products", "prices", "order"]
  })
}
