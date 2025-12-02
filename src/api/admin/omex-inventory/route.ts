import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_INVENTORY_MODULE } from "../../../modules/omex-inventory"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const inventoryService = req.scope.resolve(OMEX_INVENTORY_MODULE)

  const { product_id, warehouse_id, low_stock_threshold } = req.query

  try {
    if (product_id) {
      // Get stock for specific product
      const stock = await inventoryService.getStock(
        product_id as string,
        warehouse_id as string
      )

      return res.json({ stock })
    }

    if (low_stock_threshold) {
      // Get low stock alerts
      const alerts = await inventoryService.getLowStockAlerts(
        parseInt(low_stock_threshold as string)
      )

      return res.json({ alerts })
    }

    // Return all inventory (paginated in real implementation)
    res.json({ inventory: [] })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'INVENTORY_ERROR',
        message: error.message,
      },
    })
  }
}
