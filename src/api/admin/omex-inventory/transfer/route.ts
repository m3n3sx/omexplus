import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_INVENTORY_MODULE } from "../../../../modules/omex-inventory"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const inventoryService = req.scope.resolve(OMEX_INVENTORY_MODULE)

  const { product_id, from_warehouse, to_warehouse, quantity } = req.body

  if (!product_id || !from_warehouse || !to_warehouse || !quantity) {
    return res.status(400).json({
      error: {
        code: 'MISSING_FIELDS',
        message: 'Product ID, source warehouse, destination warehouse, and quantity are required',
      },
    })
  }

  try {
    const result = await inventoryService.transferStock(
      product_id,
      from_warehouse,
      to_warehouse,
      quantity
    )

    res.json(result)
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'TRANSFER_ERROR',
        message: error.message,
      },
    })
  }
}
