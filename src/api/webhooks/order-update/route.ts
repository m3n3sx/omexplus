import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export async function OPTIONS(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.status(204).end()
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const body = req.body as { orderId: string; email?: string; metadata?: Record<string, any>; status?: string }
  const { orderId, email, metadata, status } = body

  console.log("=== ORDER UPDATE WEBHOOK ===")
  console.log("Order ID:", orderId)
  console.log("Body:", JSON.stringify(body, null, 2))

  if (!orderId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "orderId jest wymagany"
    )
  }

  try {
    const knex = req.scope.resolve("__pg_connection__")
    
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
      return res.json({
        success: false,
        message: "Brak danych do aktualizacji"
      })
    }

    updates.push("updated_at = NOW()")
    values.push(orderId)

    const updateQuery = 
      'UPDATE "order" SET ' + updates.join(", ") + 
      " WHERE id = $" + paramIndex + 
      " RETURNING id, display_id, status, email, metadata, created_at, updated_at"

    console.log("SQL:", updateQuery)
    console.log("Values:", values)

    const result = await knex.raw(updateQuery, values)
    
    console.log("Result:", JSON.stringify(result.rows, null, 2))
    
    if (!result.rows || result.rows.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Zamówienie o ID " + orderId + " nie zostało znalezione"
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
      "Nie udało się zaktualizować zamówienia: " + error.message
    )
  }
}

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  res.json({ 
    status: "ok", 
    message: "Order update webhook endpoint is active"
  })
}
