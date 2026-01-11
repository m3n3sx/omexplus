import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

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
  const orderId = req.params.id
  const body = req.body as { email?: string; metadata?: Record<string, any>; status?: string }
  const { email, metadata, status } = body

  console.log("=== CUSTOM ORDER UPDATE ===")
  console.log("Order ID:", orderId)
  console.log("Body:", JSON.stringify(body, null, 2))

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
      return res.json({
        success: false,
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

    console.log("SQL:", updateQuery)
    console.log("Values:", values)

    const result = await knex.raw(updateQuery, values)
    
    console.log("Result:", JSON.stringify(result.rows, null, 2))
    
    if (!result.rows || result.rows.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Zamówienie o ID ${orderId} nie zostało znalezione`
      )
    }

    res.json({
      success: true,
      order: result.rows[0],
      message: "Zamówienie zaktualizowane pomyślnie"
    })
  } catch (error: any) {
    console.error("Error:", error)
    if (error instanceof MedusaError) {
      throw error
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Nie udało się zaktualizować zamówienia: ${error.message}`
    )
  }
}
