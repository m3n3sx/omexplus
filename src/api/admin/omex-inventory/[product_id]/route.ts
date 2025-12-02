import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_INVENTORY_MODULE } from "../../../../modules/omex-inventory"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const inventoryService = req.scope.resolve(OMEX_INVENTORY_MODULE)
  const { product_id } = req.params
  const { warehouse_id, quantity } = req.body

  if (!warehouse_id || quantity === undefined) {
    return res.status(400).json({
      error: {
        code: 'MISSING_FIELDS',
        message: 'Warehouse ID and quantity are required',
      },
    })
  }

  try {
    const result = await inventoryService.updateStock(
      product_id,
      warehouse_id,
      quantity
    )

    res.json(result)
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'INVENTORY_UPDATE_ERROR',
        message: error.message,
      },
    })
  }
}
