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
  const body = req.body as { email?: string; metadata?: Record<string, any> }
  const { email, metadata } = body

  try {
    const orderModuleService: any = req.scope.resolve("orderModuleService")
    
    // Przygotuj dane do aktualizacji
    // UWAGA: W Medusa v2 nie można bezpośrednio aktualizować statusu
    // Status jest zarządzany przez workflows (cancel, complete, etc.)
    const updateData: any = {}
    
    if (email !== undefined) {
      updateData.email = email
    }
    
    if (metadata !== undefined) {
      updateData.metadata = metadata
    }

    // Aktualizuj zamówienie
    const updatedOrder = await orderModuleService.updateOrders(orderId, updateData)

    res.json({
      order: updatedOrder,
      message: "Zamówienie zaktualizowane pomyślnie"
    })
  } catch (error: any) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Nie udało się zaktualizować zamówienia: ${error.message}`
    )
  }
}
