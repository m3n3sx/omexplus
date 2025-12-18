import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const orderId = req.params.id
  const body = req.body as { status: string }
  const { status } = body

  if (!status) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Status jest wymagany"
    )
  }

  // Dozwolone statusy
  const allowedStatuses = ['pending', 'completed', 'canceled', 'draft', 'archived', 'requires_action']
  if (!allowedStatuses.includes(status)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Nieprawidłowy status. Dozwolone: ${allowedStatuses.join(', ')}`
    )
  }

  try {
    // Użyj Order Module Service do aktualizacji
    const orderModuleService: any = req.scope.resolve("orderModuleService")
    
    // Aktualizuj status przez Order Module
    await orderModuleService.updateOrders(orderId, {
      status: status
    })

    // Pobierz zaktualizowane zamówienie przez query
    const query = req.scope.resolve("query")
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

    if (!updatedOrders || updatedOrders.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Zamówienie o ID ${orderId} nie zostało znalezione`
      )
    }

    res.json({
      order: updatedOrders[0],
      message: `Status zamówienia został zmieniony na: ${status}`
    })
  } catch (error: any) {
    if (error instanceof MedusaError) {
      throw error
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Nie udało się zaktualizować statusu: ${error.message}`
    )
  }
}
