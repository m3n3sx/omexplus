import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const orderId = req.params.id

  try {
    const query = req.scope.resolve("query")
    
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "status",
        "email",
        "currency_code",
        "created_at",
        "updated_at",
        "metadata",
        "summary.*",
        "fulfillments.*",
        "items.*",
        "items.product.*",
        "shipping_address.*",
        "billing_address.*",
      ],
      filters: {
        id: orderId
      }
    })

    if (!orders || orders.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Zamówienie o ID ${orderId} nie zostało znalezione`
      )
    }

    const order = orders[0]
    
    // Pobierz totals z order_summary (JSONB)
    const knex = req.scope.resolve("__pg_connection__")
    const summaryResult = await knex.raw(`
      SELECT totals
      FROM order_summary
      WHERE order_id = ?
      AND deleted_at IS NULL
      ORDER BY version DESC
      LIMIT 1
    `, [orderId])
    
    // Dodaj totals do summary
    if (summaryResult.rows && summaryResult.rows.length > 0) {
      if (!order.summary) {
        order.summary = {}
      }
      const totals = summaryResult.rows[0].totals
      order.summary.totals = totals
      
      // Dodaj również bezpośrednie pola dla kompatybilności
      order.summary.total = totals.total
      order.summary.paid_total = totals.paid_total
      order.summary.refunded_total = totals.refunded_total
    }

    res.json({
      order
    })
  } catch (error: any) {
    if (error instanceof MedusaError) {
      throw error
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Nie udało się pobrać zamówienia: ${error.message}`
    )
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const orderId = req.params.id
  const body = req.body as { email?: string; metadata?: Record<string, any>; status?: string }
  const { email, metadata, status } = body

  console.log("[orders/[id]/POST] Received:", JSON.stringify(body, null, 2))

  try {
    const knex = req.scope.resolve("__pg_connection__")
    
    // Buduj zapytanie UPDATE
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (email !== undefined) {
      updates.push(`email = $${paramIndex}`)
      values.push(email)
      paramIndex++
    }
    
    if (metadata !== undefined) {
      // Merge metadata zamiast nadpisywania
      updates.push(`metadata = COALESCE(metadata, '{}'::jsonb) || $${paramIndex}::jsonb`)
      values.push(JSON.stringify(metadata))
      paramIndex++
    }

    // Status można aktualizować tylko na określone wartości
    if (status !== undefined) {
      const allowedStatuses = ['pending', 'completed', 'canceled', 'archived', 'requires_action']
      if (allowedStatuses.includes(status)) {
        updates.push(`status = $${paramIndex}`)
        values.push(status)
        paramIndex++
      }
    }

    if (updates.length === 0) {
      // Pobierz aktualne zamówienie jeśli nie ma co aktualizować
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

    // Dodaj updated_at
    updates.push(`updated_at = NOW()`)
    
    // Dodaj orderId jako ostatni parametr
    values.push(orderId)

    const updateQuery = `
      UPDATE "order"
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, display_id, status, email, metadata, created_at, updated_at
    `

    console.log("[orders/[id]/POST] SQL:", updateQuery)
    console.log("[orders/[id]/POST] Values:", values)

    const result = await knex.raw(updateQuery, values)
    
    console.log("[orders/[id]/POST] Result:", JSON.stringify(result.rows, null, 2))
    
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
    console.error("[orders/[id]/POST] Error:", error)
    if (error instanceof MedusaError) {
      throw error
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Nie udało się zaktualizować zamówienia: ${error.message}`
    )
  }
}
