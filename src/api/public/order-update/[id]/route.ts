import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

// Handle CORS preflight
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-publishable-api-key")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.status(204).end()
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Verify authorization header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "Brak autoryzacji"
    )
  }

  const orderId = req.params.id
  const body = req.body as { email?: string; metadata?: Record<string, any>; status?: string }
  const { email, metadata, status } = body

  console.log("[public/order-update] Received body:", JSON.stringify(body, null, 2))
  console.log("[public/order-update] orderId:", orderId)

  try {
    const knex = req.scope.resolve("__pg_connection__")
    
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (email !== undefined) {
      updates.push(`email = $${paramIndex}`)
      values.push(email)
      paramIndex++
    }
    
    if (metadata !== undefined) {
      updates.push(`metadata = COALESCE(metadata, '{}'::jsonb) || $${paramIndex}::jsonb`)
      values.push(JSON.stringify(metadata))
      paramIndex++
    }

    if (status !== undefined) {
      const allowedStatuses = ['pending', 'completed', 'canceled', 'archived', 'requires_action']
      if (allowedStatuses.includes(status)) {
        updates.push(`status = $${paramIndex}`)
        values.push(status)
        paramIndex++
      }
    }

    if (updates.length === 0) {
      const query = req.scope.resolve("query")
      const { data: orders } = await query.graph({
        entity: "order",
        fields: ["id", "display_id", "status", "email", "metadata"],
        filters: { id: orderId }
      })
      
      return res.json({
        order: orders?.[0] || null,
        message: "Brak danych do aktualizacji"
      })
    }

    updates.push(`updated_at = NOW()`)
    values.push(orderId)

    const updateQuery = `
      UPDATE "order"
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, display_id, status, email, metadata, created_at, updated_at
    `

    console.log("[public/order-update] SQL:", updateQuery)

    const result = await knex.raw(updateQuery, values)
    
    console.log("[public/order-update] Result:", JSON.stringify(result.rows, null, 2))
    
    if (!result.rows || result.rows.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Zamówienie o ID ${orderId} nie zostało znalezione`
      )
    }

    res.json({
      order: result.rows[0],
      message: "Zamówienie zaktualizowane pomyślnie"
    })
  } catch (error: any) {
    console.error("[public/order-update] Error:", error)
    if (error instanceof MedusaError) {
      throw error
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Nie udało się zaktualizować zamówienia: ${error.message}`
    )
  }
}
