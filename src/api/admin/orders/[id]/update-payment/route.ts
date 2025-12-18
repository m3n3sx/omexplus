import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const orderId = req.params.id
  const body = req.body as { paid_amount: number }
  const { paid_amount } = body

  if (paid_amount === undefined || paid_amount === null) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "paid_amount jest wymagany"
    )
  }

  if (paid_amount < 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "paid_amount nie może być ujemny"
    )
  }

  try {
    const query = req.scope.resolve("query")
    
    // Najpierw pobierz zamówienie i jego summary
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["id", "summary.*"],
      filters: { id: orderId }
    })

    if (!orders || orders.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Zamówienie o ID ${orderId} nie zostało znalezione`
      )
    }

    const order = orders[0]
    const total = (order.summary as any)?.total || 0

    // Walidacja - paid_amount nie może być większy niż total
    if (paid_amount > total) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Opłacona kwota (${paid_amount}) nie może być większa niż całkowita wartość zamówienia (${total})`
      )
    }

    // Użyj raw query do aktualizacji order_summary
    const knex = req.scope.resolve("__pg_connection__")
    
    await knex.raw(`
      UPDATE order_summary
      SET 
        totals = jsonb_set(
          COALESCE(totals, '{}'::jsonb),
          '{paid_total}',
          ?::text::jsonb
        ),
        updated_at = NOW()
      WHERE order_id = ?
    `, [paid_amount, orderId])

    // Pobierz zaktualizowane zamówienie
    const { data: updatedOrders } = await query.graph({
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
      ],
      filters: { id: orderId }
    })

    // Oblicz status płatności
    let paymentStatus = "not_paid"
    if (paid_amount === 0) {
      paymentStatus = "not_paid"
    } else if (paid_amount < total) {
      paymentStatus = "awaiting"
    } else if (paid_amount >= total) {
      paymentStatus = "captured"
    }

    res.json({
      order: updatedOrders[0],
      payment_status: paymentStatus,
      message: `Status płatności został zmieniony. Opłacono: ${paid_amount} z ${total}`
    })
  } catch (error: any) {
    if (error instanceof MedusaError) {
      throw error
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Nie udało się zaktualizować statusu płatności: ${error.message}`
    )
  }
}
