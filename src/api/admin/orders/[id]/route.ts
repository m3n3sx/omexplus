import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const orderId = req.params.id
  const { status, email, metadata } = req.body

  try {
    const orderModuleService = req.scope.resolve("orderModuleService")
    
    // Przygotuj dane do aktualizacji
    const updateData: any = {}
    
    if (status) {
      updateData.status = status
    }
    
    if (email) {
      updateData.email = email
    }
    
    if (metadata) {
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
